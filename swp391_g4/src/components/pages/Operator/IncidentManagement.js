import React, { useState, useEffect } from 'react';
import '../../../styles/IncidentManagement.css';
import { LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Search, Download, FileText, Filter, CheckCircle, Clock, AlertTriangle, Users } from 'lucide-react';

const IncidentManagement = () => {
  // Mock data for incidents
  const mockIncidents = [
    { id: 1, shipper: 'Nguyễn Văn A', type: 'Giao hàng trễ', status: 'Đang xử lý', date: '2025-03-10', reportedBy: 'Khách hàng' },
    { id: 2, shipper: 'Trần Văn B', type: 'Hàng hóa hư hỏng', status: 'Đã xử lý', date: '2025-03-09', reportedBy: 'Khách hàng' },
    { id: 3, shipper: 'Lê Thị C', type: 'Thái độ không tốt', status: 'Đang xử lý', date: '2025-03-08', reportedBy: 'Nhân viên' },
    { id: 4, shipper: 'Phạm Văn D', type: 'Giao sai hàng', status: 'Chưa xử lý', date: '2025-03-07', reportedBy: 'Khách hàng' },
    { id: 5, shipper: 'Hoàng Văn E', type: 'Không liên lạc được', status: 'Đã xử lý', date: '2025-03-06', reportedBy: 'Nhân viên' },
    { id: 6, shipper: 'Nguyễn Thị F', type: 'Giao hàng trễ', status: 'Đã xử lý', date: '2025-03-05', reportedBy: 'Khách hàng' },
    { id: 7, shipper: 'Trần Văn G', type: 'Hàng hóa hư hỏng', status: 'Chưa xử lý', date: '2025-03-04', reportedBy: 'Khách hàng' },
    { id: 8, shipper: 'Lê Văn H', type: 'Thái độ không tốt', status: 'Đã xử lý', date: '2025-03-03', reportedBy: 'Nhân viên' },
  ];

  // Mock data for charts
  const typeChartData = [
    { name: 'Giao hàng trễ', value: 35 },
    { name: 'Hàng hóa hư hỏng', value: 25 },
    { name: 'Thái độ không tốt', value: 20 },
    { name: 'Giao sai hàng', value: 15 },
    { name: 'Không liên lạc được', value: 5 },
  ];

  const timeChartData = [
    { name: '01/03', count: 5 },
    { name: '02/03', count: 7 },
    { name: '03/03', count: 4 },
    { name: '04/03', count: 8 },
    { name: '05/03', count: 6 },
    { name: '06/03', count: 9 },
    { name: '07/03', count: 11 },
    { name: '08/03', count: 8 },
    { name: '09/03', count: 6 },
    { name: '10/03', count: 4 },
  ];

  const shipperChartData = [
    { name: 'Nguyễn Văn A', count: 12 },
    { name: 'Trần Văn B', count: 8 },
    { name: 'Lê Thị C', count: 6 },
    { name: 'Phạm Văn D', count: 5 },
    { name: 'Hoàng Văn E', count: 4 },
  ];

  const [incidents, setIncidents] = useState(mockIncidents);
  const [filteredIncidents, setFilteredIncidents] = useState(mockIncidents);
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('list');

  // COLORS for the charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    let filtered = [...incidents];
    
    // Apply status filter
    if (statusFilter !== 'Tất cả') {
      filtered = filtered.filter(incident => incident.status === statusFilter);
    }
    
    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(incident => 
        incident.shipper.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredIncidents(filtered);
  }, [statusFilter, searchTerm, incidents]);

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleExport = (type) => {
    alert(`Xuất báo cáo dạng ${type}`);
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
            </div>
          </div>

          <div className="incident_management_summary">
            <div className="incident_management_summary-card">
              <div className="incident_management_summary-icon total">
                <AlertTriangle size={24} />
              </div>
              <div className="incident_management_summary-content">
                <h3>Tổng số sự cố</h3>
                <p>{incidents.length}</p>
              </div>
            </div>
            <div className="incident_management_summary-card">
              <div className="incident_management_summary-icon pending">
                <Clock size={24} />
              </div>
              <div className="incident_management_summary-content">
                <h3>Đang xử lý</h3>
                <p>{incidents.filter(i => i.status === 'Đang xử lý').length}</p>
              </div>
            </div>
            <div className="incident_management_summary-card">
              <div className="incident_management_summary-icon resolved">
                <CheckCircle size={24} />
              </div>
              <div className="incident_management_summary-content">
                <h3>Đã xử lý</h3>
                <p>{incidents.filter(i => i.status === 'Đã xử lý').length}</p>
              </div>
            </div>
            <div className="incident_management_summary-card">
              <div className="incident_management_summary-icon shippers">
                <Users size={24} />
              </div>
              <div className="incident_management_summary-content">
                <h3>Shipper liên quan</h3>
                <p>{new Set(incidents.map(i => i.shipper)).size}</p>
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
                  <th>Hành động</th>
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
                    <td>
                      <button className="incident_management_action-btn">Chi tiết</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="incident_management_pagination">
            <button>&laquo;</button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>&raquo;</button>
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="incident_management_stats-container">
          <div className="incident_management_stats-header">
            <h2>Báo cáo & Thống kê</h2>
            <div className="incident_management_export-buttons">
              <button className="incident_management_export-btn" onClick={() => handleExport('excel')}>
                <Download size={16} />
                Xuất Excel
              </button>
              <button className="incident_management_export-btn" onClick={() => handleExport('pdf')}>
                <Download size={16} />
                Xuất PDF
              </button>
            </div>
          </div>

          <div className="incident_management_stats-summary">
            <div className="incident_management_stats-card">
              <h3>Tỷ lệ xử lý thành công</h3>
              <p className="incident_management_stats-value">85%</p>
            </div>
            <div className="incident_management_stats-card">
              <h3>Thời gian xử lý trung bình</h3>
              <p className="incident_management_stats-value">1.5 ngày</p>
            </div>
            <div className="incident_management_stats-card">
              <h3>Sự cố nghiêm trọng</h3>
              <p className="incident_management_stats-value">12</p>
            </div>
            <div className="incident_management_stats-card">
              <h3>Shipper có nhiều sự cố</h3>
              <p className="incident_management_stats-value">Nguyễn Văn A</p>
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
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
              <h3>Sự cố theo thời gian</h3>
              <div className="incident_management_chart-inner">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
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
    </div>
  );
};

export default IncidentManagement;