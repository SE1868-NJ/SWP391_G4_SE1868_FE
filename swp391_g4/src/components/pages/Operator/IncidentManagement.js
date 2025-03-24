import React, { useState, useEffect } from 'react';
import '../../../styles/IncidentManagement.css';
import { LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Search, Download, FileText, Filter, CheckCircle, Clock, AlertTriangle, Users } from 'lucide-react';
import axios from 'axios';
import IncidentManagementExportPopup from '../Operator/IncidenManagementExportPopup';

const IncidentManagement = () => {
  // State for incidents data
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // State for popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState('success');
  const [popupMessage, setPopupMessage] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // State for statistics
  const [summaryStats, setSummaryStats] = useState({
    totalIncidents: 0,
    inProgressCount: 0,
    resolvedCount: 0,
    totalShippers: 0,
    avgResolutionDays: "0",
    severeCases: 0,
    topShipper: "N/A",
    successRate: 0
  });

  // State for chart data
  const [typeChartData, setTypeChartData] = useState([]);
  const [timeChartData, setTimeChartData] = useState([]);
  const [shipperChartData, setShipperChartData] = useState([]);

  // COLORS for the charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Fetch incidents data
  const fetchIncidents = async () => {
    try {
      // Convert Vietnamese status to database status
      let dbStatus = null;
      if (statusFilter !== 'Tất cả') {
        switch (statusFilter) {
          case 'Chưa xử lý':
            dbStatus = 'Pending';
            break;
          case 'Đang xử lý':
            dbStatus = 'In Progress';
            break;
          case 'Đã xử lý':
            dbStatus = 'Resolved';
            break;
          case 'Từ chối':
            dbStatus = 'Rejected';
            break;
        }
      }
      console.log("Sending status to API:", dbStatus);
      const response = await axios.get('http://localhost:5000/api/incidents', {
        params: {
          dbStatus: dbStatus, // Send the converted status
          search: searchTerm || null,
          page: currentPage,
          limit: limit
        }
      });
      console.log("API response:", response.data);
      setIncidents(response.data.incidents);
      setFilteredIncidents(response.data.incidents);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching incidents:', error);
      showExportPopup('error', 'Đã xảy ra lỗi khi lấy danh sách sự cố');
    }
  };

  // Fetch summary statistics
  const fetchSummaryStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/incidents/summary-stats');
      setSummaryStats(response.data);
    } catch (error) {
      console.error('Error fetching summary stats:', error);
      showExportPopup('error', 'Đã xảy ra lỗi khi lấy số liệu thống kê');
    }
  };

  // Fetch incident type chart data
  const fetchTypeChartData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/incidents/type-stats');
      setTypeChartData(response.data);
    } catch (error) {
      console.error('Error fetching type chart data:', error);
    }
  };

  // Fetch incident time chart data
  const fetchTimeChartData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/incidents/time-stats', {
        params: { days: 10 }
      });
      setTimeChartData(response.data);
    } catch (error) {
      console.error('Error fetching time chart data:', error);
    }
  };

  // Fetch incident shipper chart data
  const fetchShipperChartData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/incidents/shipper-stats', {
        params: { limit: 5 }
      });
      setShipperChartData(response.data);
    } catch (error) {
      console.error('Error fetching shipper chart data:', error);
    }
  };

  // Show export popup
  const showExportPopup = (type, message) => {
    setPopupType(type);
    setPopupMessage(message);
    setShowPopup(true);
  };

  // Close export popup
  const closeExportPopup = () => {
    setShowPopup(false);
  };

  // Load data on initial render and when filters change
  useEffect(() => {
    fetchIncidents();
    fetchSummaryStats();
  }, [statusFilter, searchTerm, currentPage, limit]);
  
  useEffect(() => {
    fetchSummaryStats();
  }, []);
  
  // Load statistics when tab changes
  useEffect(() => {
    if (activeTab === 'stats') {
      fetchSummaryStats();
      fetchTypeChartData();
      fetchTimeChartData();
      fetchShipperChartData();
    }
  }, [activeTab]);

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleExport = async (format) => {
    if (isExporting) return; // Prevent multiple export requests
    
    setIsExporting(true);
    showExportPopup('success', `Đang xuất báo cáo dạng ${format.toUpperCase()}. Vui lòng đợi...`);
    
    try {
      // Lấy dữ liệu thống kê cần thiết cho báo cáo
      const incidentsResponse = await axios.get('http://localhost:5000/api/incidents', {
        params: {
          limit: 1000 // Lấy số lượng lớn bản ghi để xuất báo cáo đầy đủ
        }
      });
      
      const statsResponse = await axios.get('http://localhost:5000/api/incidents/summary-stats');
      const typeStatsResponse = await axios.get('http://localhost:5000/api/incidents/type-stats');
      const timeStatsResponse = await axios.get('http://localhost:5000/api/incidents/time-stats', {
        params: { days: 30 } // Lấy dữ liệu 30 ngày gần nhất cho báo cáo
      });
      
      // Gửi request xuất báo cáo
      const response = await axios.post(
        `http://localhost:5000/api/export-report/${format}`,
        {
          incidents: incidentsResponse.data.incidents,
          summaryStats: statsResponse.data,
          typeStats: typeStatsResponse.data,
          timeStats: timeStatsResponse.data,
          exportDate: new Date().toISOString(),
          exportedBy: 'Admin' // Hoặc lấy từ thông tin đăng nhập
        },
        { responseType: 'blob' }
      );
      
      // Tạo URL cho file blob và tải xuống
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Đặt tên file
      const date = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `bao-cao-su-co-${date}.${format}`);
      
      // Thêm vào DOM, kích hoạt sự kiện click và xóa
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Giải phóng URL đã tạo
      window.URL.revokeObjectURL(url);
      
      // Hiển thị thông báo thành công
      showExportPopup('success', `Xuất báo cáo dạng ${format.toUpperCase()} thành công!`);
    } catch (error) {
      console.error(`Error exporting as ${format}:`, error);
      // Hiển thị thông báo lỗi
      showExportPopup('error', `Đã xảy ra lỗi khi xuất báo cáo dạng ${format}. Chi tiết: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleViewDetails = () => {
    // Navigate to detail page or open a modal
    window.location.href = `/admin-report-handling`;
    // Alternatively, set a state to open a modal
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="incident_management">
      <header className="incident_management_header">
        <h1>Quản lý Báo Cáo Sự Cố</h1>
        <div className="incident_management_user-info">
          <span>Operator: Admin</span>
          <div className="incident_management_avatar"></div>
        </div>
      </header>

      <div className="incident_management_tabs">
        <button
          className={`incident_management_tab ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => handleTabChange('list')}
        >
          <AlertTriangle size={16} />
          Danh sách sự cố
        </button>
        <button
          className={`incident_management_tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => handleTabChange('stats')}
        >
          <FileText size={16} />
          Báo cáo & Thống kê
        </button>
      </div>

      {activeTab === 'list' && (
        <div className="incident_management_list-container">
          <div className="incident_management_filters">
            <div className="incident_management_search-bar">
              <Search size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên shipper..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="incident_management_status-filters">
              <Filter size={18} />
              <button
                className={statusFilter === 'Tất cả' ? 'active' : ''}
                onClick={() => handleStatusFilterChange('Tất cả')}
              >
                Tất cả
              </button>
              <button
                className={statusFilter === 'Chưa xử lý' ? 'active' : ''}
                onClick={() => handleStatusFilterChange('Chưa xử lý')}
              >
                Chưa xử lý
              </button>
              <button
                className={statusFilter === 'Đang xử lý' ? 'active' : ''}
                onClick={() => handleStatusFilterChange('Đang xử lý')}
              >
                Đang xử lý
              </button>
              <button
                className={statusFilter === 'Đã xử lý' ? 'active' : ''}
                onClick={() => handleStatusFilterChange('Đã xử lý')}
              >
                Đã xử lý
              </button>
              <button
                className={statusFilter === 'Từ chối' ? 'active' : ''}
                onClick={() => handleStatusFilterChange('Từ chối')}
              >
                Từ chối
              </button>
            </div>
          </div>

          <div className="incident_management_summary">
            <div className="incident_management_summary-card">
              <div className="incident_management_summary-icon total">
                <AlertTriangle size={24} />
              </div>
              <div className="incident_management_summary-content">
                <h3>Tổng số sự cố</h3>
                <p>{summaryStats.totalIncidents}</p>
              </div>
            </div>
            <div className="incident_management_summary-card">
              <div className="incident_management_summary-icon pending">
                <Clock size={24} />
              </div>
              <div className="incident_management_summary-content">
                <h3>Đang xử lý</h3>
                <p>{summaryStats.inProgressCount}</p>
              </div>
            </div>
            <div className="incident_management_summary-card">
              <div className="incident_management_summary-icon resolved">
                <CheckCircle size={24} />
              </div>
              <div className="incident_management_summary-content">
                <h3>Đã xử lý</h3>
                <p>{summaryStats.resolvedCount}</p>
              </div>
            </div>
            <div className="incident_management_summary-card">
              <div className="incident_management_summary-icon shippers">
                <Users size={24} />
              </div>
              <div className="incident_management_summary-content">
                <h3>Shipper liên quan</h3>
                <p>{summaryStats.totalShippers}</p>
              </div>
            </div>
          </div>

          <div className="incident_management_table-container">
            <table className="incident_management_table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Shipper</th>
                  <th>Loại sự cố</th>
                  <th>Trạng thái</th>
                  <th>Ngày báo cáo</th>
                  <th>Người báo cáo</th>
                  <th>Mức độ</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncidents.map(incident => (
                  <tr key={incident.id}>
                    <td>#{incident.id}</td>
                    <td>{incident.shipper}</td>
                    <td>{incident.type}</td>
                    <td>
                      <span className={`incident_management_status-badge ${incident.status.replace(/\s+/g, '-').toLowerCase()}`}>
                        {incident.status}
                      </span>
                    </td>
                    <td>{incident.date}</td>
                    <td>{incident.reportedBy}</td>
                    <td>{incident.severity}</td>
                  </tr>
                ))}
                {filteredIncidents.length === 0 && (
                  <tr>
                    <td colSpan="8" className="incident_management_no-data">Không có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="incident_management_actions">
            <button
              className="incident_management_action-btn"
              onClick={() => handleViewDetails()}
            >
              Chi tiết & Điều chỉnh sự cố
            </button>
          </div>
          <div className="incident_management_pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &laquo;
            </button>

            {/* Generate page buttons */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  className={currentPage === pageNum ? 'active' : ''}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &raquo;
            </button>
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="incident_management_stats-container">
          <div className="incident_management_stats-header">
            <h2>Báo cáo & Thống kê</h2>
            <div className="incident_management_export-buttons">
              <button 
                className="incident_management_export-btn" 
                onClick={() => handleExport('xlsx')}
                disabled={isExporting}
              >
                <Download size={16} />
                Xuất Excel
              </button>
              <button 
                className="incident_management_export-btn" 
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
              >
                <Download size={16} />
                Xuất PDF
              </button>
            </div>
          </div>

          <div className="incident_management_stats-summary">
            <div className="incident_management_stats-card">
              <h3>Tỷ lệ xử lý thành công</h3>
              <p className="incident_management_stats-value">{summaryStats.successRate}%</p>
            </div>
            <div className="incident_management_stats-card">
              <h3>Thời gian xử lý trung bình</h3>
              <p className="incident_management_stats-value">{summaryStats.avgResolutionDays} ngày</p>
            </div>
            <div className="incident_management_stats-card">
              <h3>Sự cố nghiêm trọng</h3>
              <p className="incident_management_stats-value">{summaryStats.severeCases}</p>
            </div>
            <div className="incident_management_stats-card">
              <h3>Shipper có nhiều sự cố</h3>
              <p className="incident_management_stats-value">{summaryStats.topShipper}</p>
            </div>
          </div>

          <div className="incident_management_charts-container">
            <div className="incident_management_chart-wrapper">
              <h3>Sự cố theo loại</h3>
              <div className="incident_management_chart-inner">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={typeChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {typeChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="incident_management_chart-wrapper">
              <h3>Sự cố theo shipper</h3>
              <div className="incident_management_chart-inner">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={shipperChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Popup */}
      {showPopup && (
        <IncidentManagementExportPopup 
          type={popupType} 
          message={popupMessage} 
          onClose={closeExportPopup} 
        />
      )}
    </div>
  );
};

export default IncidentManagement;