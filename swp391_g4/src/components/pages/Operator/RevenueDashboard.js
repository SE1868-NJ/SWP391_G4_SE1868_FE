import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,Area,AreaChart
} from 'recharts';
import axios from 'axios';
import '../../../styles/RevenueDashboard.css';
import { exportToExcel, exportMultipleSheets, formatDataForExport } from './ExportExcel_Revenue';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
// Utility function
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(amount);
};

// Header Component
function Header({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <header className="RevenueDashboard-header">
      <div className="RevenueDashboard-logo">
        <h1>View Revenue System</h1>
      </div>
      <div className="RevenueDashboard-search-bar">
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm theo mã shipper..." 
        />
        <button onClick={handleSubmit}>Tìm kiếm</button>
      </div>
    </header>
  );
}

// Filters Component
function Filters({ filters, onChange }) {
  // State để kiểm soát hiển thị date pickers
  const [showDatePickers, setShowDatePickers] = useState(false);

  // Xử lý khi thay đổi loại khoảng thời gian
  const handleTimePeriodChange = (value) => {
    if (value === 'custom') {
      setShowDatePickers(true);
      onChange('timePeriod', value);
    } else {
      setShowDatePickers(false);
      onChange('timePeriod', value);
      // Reset các giá trị startDate và endDate nếu không chọn custom
      onChange('startDate', null);
      onChange('endDate', null);
    }
  };

  return (
    <div className="RevenueDashboard-filters">
      <div className="RevenueDashboard-filter-group">
        <label htmlFor="time-period">Khoảng thời gian</label>
        <select 
          id="time-period" 
          value={filters.timePeriod}
          onChange={(e) => handleTimePeriodChange(e.target.value)}
        >
          <option value="day">Hôm nay</option>
          <option value="week">Tuần này</option>
          <option value="month">Tháng này</option>
          <option value="year">Năm nay</option>
          <option value="custom">Tùy chỉnh</option>
        </select>
      </div>
      
      {/* Date pickers cho khoảng thời gian tùy chỉnh */}
      {showDatePickers && (
        <div className="RevenueDashboard-date-range">
          <div className="RevenueDashboard-filter-group">
            <label htmlFor="start-date">Từ ngày</label>
            <input 
              type="date" 
              id="start-date"
              value={filters.startDate || ''}
              onChange={(e) => onChange('startDate', e.target.value)}
            />
          </div>
          <div className="RevenueDashboard-filter-group">
            <label htmlFor="end-date">Đến ngày</label>
            <input 
              type="date" 
              id="end-date"
              value={filters.endDate || ''}
              onChange={(e) => onChange('endDate', e.target.value)}
            />
          </div>
        </div>
      )}
      
      <div className="RevenueDashboard-filter-group">
        <label htmlFor="region">Khu vực</label>
        <select 
          id="region" 
          value={filters.region}
          onChange={(e) => onChange('region', e.target.value)}
        >
          <option value="all">Tất cả khu vực</option>
          <option value="central">Trung tâm</option>
          <option value="mid_zone">Quanh Trung Tâm</option>
          <option value="outer_zone">Rìa Trung Tâm</option>
        </select>
      </div>
      <div className="RevenueDashboard-filter-group">
        <label htmlFor="service-type">Loại dịch vụ</label>
        <select 
          id="service-type" 
          value={filters.serviceType}
          onChange={(e) => onChange('serviceType', e.target.value)}
        >
          <option value="all">Tất cả dịch vụ</option>
          <option value="standard">Giao hàng tiêu chuẩn</option>
          <option value="express">Giao hàng nhanh</option>
          <option value="scheduled">Giao hàng hẹn giờ</option>
        </select>
      </div>
    </div>
  );
}

// Alerts Container Component
function AlertsContainer({ alerts }) {
  if (!alerts || alerts.length === 0) return null;
  
  return (
    <div id="alerts-container">
      {alerts.map((alert, index) => (
        <div key={index} className={`alert alert-${alert.type}`}>
          <strong>Cảnh báo:</strong> {alert.message}
        </div>
      ))}
    </div>
  );
}

// Overview Panel Component
function OverviewPanel({ data, revenueByDay }) {
  const handleExport = () => {
    try {
      // Format the data for export
      const formattedData = formatDataForExport.overview(data, revenueByDay);
      
      // Export multiple sheets in one workbook
      exportMultipleSheets({
        'Tổng quan': formattedData.summaryData,
        'Doanh thu theo ngày': formattedData.revenueData
      }, 'Tổng_quan_doanh_thu');
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Có lỗi khi xuất báo cáo. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="RevenueDashboard-panel">
      <div className="RevenueDashboard-panel-header">
        <div className="RevenueDashboard-panel-title">Tổng quan doanh thu</div>
        <div className="RevenueDashboard-panel-actions">
          <button onClick={handleExport}>Xuất báo cáo</button>
        </div>
      </div>
      <div className="RevenueDashboard-stats-grid">
        <div className="RevenueDashboard-stat-card">
          <div className="RevenueDashboard-stat-value">{formatCurrency(data.revenue)}</div>
          <div className="RevenueDashboard-stat-label">Tổng doanh thu</div>
        </div>
        <div className="RevenueDashboard-stat-card">
          <div className="RevenueDashboard-stat-value">{data.orders}</div>
          <div className="RevenueDashboard-stat-label">Tổng đơn hàng</div>
        </div>
        <div className="RevenueDashboard-stat-card">
          <div className="RevenueDashboard-stat-value">{formatCurrency(data.avgRevenue)}</div>
          <div className="RevenueDashboard-stat-label">Doanh thu trung bình/đơn</div>
        </div>
        <div className="RevenueDashboard-stat-card">
          <div className="RevenueDashboard-stat-value">{formatCurrency(data.profitAfterFees)}</div>
          <div className="RevenueDashboard-stat-label">Lợi nhuận sau phí</div>
        </div>
      </div>
      <div className="RevenueDashboard-chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={revenueByDay}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis 
            tickFormatter={(value) => formatCurrency(value).replace('₫', '') + ' ₫'}
          />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3498db" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3498db" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3498db"
            strokeWidth={2}
            fill="url(#colorRevenue)"
            fillOpacity={1}
            name="Doanh thu (VND)"
            activeDot={{ r: 8 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}

function OrdersPanel({ filters }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersData, setOrdersData] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
  
  useEffect(() => {
    // Function to fetch orders for the current page
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // Đảm bảo gửi thông tin phân trang đến API
        const response = await axios.get('http://localhost:5000/api/orders', { 
          params: { 
            ...filters,
            page: currentPage,
            limit: itemsPerPage
          } 
        });
        
        console.log('Orders API response:', response.data);
        
        // API trả về đúng format { orders: [...], totalCount: ... }
        if (response.data && response.data.orders) {
          setOrdersData(response.data.orders);
          setTotalOrders(response.data.totalCount);
        } else if (Array.isArray(response.data)) {
          // Trường hợp dự phòng nếu API trả về mảng trực tiếp
          setOrdersData(response.data);
          setTotalOrders(response.data.length);
        } else {
          setOrdersData([]);
          setTotalOrders(0);
        }
        
        setError(null);
      } catch (error) {
        console.error('Error loading order data:', error);
        setError('Không thể tải dữ liệu đơn hàng. Vui lòng thử lại sau.');
        setOrdersData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage, filters, itemsPerPage]);
  
  const handleExport = async () => {
    try {
      setExportLoading(true);
      
      // Fetch all orders for export (without pagination limits)
      const response = await axios.get('http://localhost:5000/api/orders', { 
        params: { 
          ...filters,
          limit: 1000 // Large enough to get all orders that match the filters
        } 
      });
      
      let ordersToExport = [];
      
      if (response.data && response.data.orders) {
        ordersToExport = response.data.orders;
      } else if (Array.isArray(response.data)) {
        ordersToExport = response.data;
      }
      
      // Format the data for Excel export
      const statusText = {
        'success': 'Đã giao',
        'pending': 'Đang giao',
        'error': 'Lỗi giao'
      };
      
      const serviceText = {
        'Standard': 'Tiêu chuẩn',
        'Express': 'Nhanh',
        'Scheduled': 'Hẹn giờ'
      };
      
      const regionText = {
        'mid_zone': 'Quanh trung tâm',
        'central': 'Trung tâm',
        'outer_zone': 'Rìa trung tâm'
      };
      
      const formattedData = ordersToExport.map(order => ({
        'Mã đơn hàng': order.id,
        'Ngày giao': order.date,
        'Loại dịch vụ': serviceText[order.type] || order.type,
        'Khu vực': regionText[order.region] || order.region,
        'Trạng thái': statusText[order.status] || order.status,
        'Doanh thu': order.revenue
      }));
      
      // Export to Excel
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Đơn hàng');
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Create a date string for the filename
      const dateStr = new Date().toLocaleDateString('vi-VN').replace(/\//g, '-');
      
      // Save file
      saveAs(blob, `Danh_sách_đơn_hàng_${dateStr}.xlsx`);
      
    } catch (error) {
      console.error('Error exporting orders:', error);
      alert('Không thể xuất dữ liệu đơn hàng. Vui lòng thử lại sau.');
    } finally {
      setExportLoading(false);
    }
  };

  // Status mappings
  const statusClasses = {
    'success': 'status-success',
    'pending': 'status-warning',
    'error': 'status-error'
  };
  
  const statusText = {
    'success': 'Đã giao',
    'pending': 'Đang giao',
    'error': 'Lỗi giao'
  };
  
  const serviceText = {
    'Standard': 'Tiêu chuẩn',
    'Express': 'Nhanh',
    'Scheduled': 'Hẹn giờ'
  };
  
  const regionText = {
    'mid_zone': 'Quanh trung tâm',
    'central': 'Trung tâm',
    'outer_zone': 'Rìa trung tâm'
  };
  
  // Pagination calculation
  const totalPages = Math.ceil(totalOrders / itemsPerPage);
  
  // Display max 5 pagination buttons
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    if (totalPages <= 5) {
      // If total pages <= 5, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // If total pages > 5, show current page and surrounding pages
      if (currentPage <= 3) {
        // If near beginning
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        // If near end
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // In middle
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(i);
        }
      }
    }
    
    return pageNumbers;
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of table when changing pages
    const tableElement = document.querySelector('.RevenueDashboard-table-responsive');
    if (tableElement) {
      tableElement.scrollTop = 0;
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="RevenueDashboard-panel">
      <div className="RevenueDashboard-panel-header">
        <div className="RevenueDashboard-panel-title">Chi tiết doanh thu theo đơn hàng</div>
        <div className="RevenueDashboard-panel-actions">
          <button onClick={handleExport}>Xuất danh sách</button>
          
        </div>
      </div>
      
      {loading ? (
        <div className="text-center p-4">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="text-center p-4 text-red-500">{error}</div>
      ) : (
        <>
          <div className="RevenueDashboard-table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Mã đơn hàng</th>
                  <th>Ngày giao</th>
                  <th>Loại dịch vụ</th>
                  <th>Khu vực</th>
                  <th>Trạng thái</th>
                  <th>Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {ordersData && ordersData.length > 0 ? ordersData.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.date}</td>
                    <td>{serviceText[order.type] || order.type}</td>
                    <td>{regionText[order.region] || order.region}</td>
                    <td>
                      <span className={`status ${statusClasses[order.status] || ''}`}>
                        {statusText[order.status] || order.status}
                      </span>
                    </td>
                    <td>{formatCurrency(order.revenue)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="text-center">Không có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {totalOrders > 0 && (
            <div className="RevenueDashboard-paginator">
              <div className="RevenueDashboard-paginator-info">
                Hiển thị {totalOrders === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalOrders)} trong số {totalOrders} đơn hàng
              </div>
              <div className="RevenueDashboard-paginator-controls">
                {/* Previous Page Button */}
                <button 
                  onClick={handlePrevPage} 
                  disabled={currentPage === 1}
                  className={currentPage === 1 ? 'disabled' : ''}
                >
                  &laquo;
                </button>
                
                {/* Page Numbers */}
                {getPageNumbers().map(number => (
                  <button 
                    key={number}
                    className={currentPage === number ? 'active' : ''}
                    onClick={() => handlePageChange(number)}
                  >
                    {number}
                  </button>
                ))}
                
                {/* Next Page Button */}
                <button 
                  onClick={handleNextPage} 
                  disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? 'disabled' : ''}
                >
                  &raquo;
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
// Region Revenue Panel Component
function RegionRevenuePanel({ revenueByRegion }) {
  const handleExport = () => {
    try {
      // Format the data for export
      const formattedData = formatDataForExport.region(revenueByRegion);
      
      // Export to Excel
      exportToExcel(formattedData, 'Doanh_thu_theo_khu_vực', 'Khu vực');
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Có lỗi khi xuất báo cáo. Vui lòng thử lại sau.');
    }
  };

  // Đảm bảo revenueByRegion tồn tại và có đúng format
  const safeRevenueByRegion = revenueByRegion || { central: 0, mid_zone: 0, outer_zone: 0 };

  const data = [
    { name: 'Trung tâm', value: Number(safeRevenueByRegion.central) || 0 },
    { name: 'Quanh trung tâm', value: Number(safeRevenueByRegion.mid_zone) || 0 },
    { name: 'Rìa trung tâm', value: Number(safeRevenueByRegion.outer_zone) || 0 }
  ];

  const COLORS = ['rgba(52, 152, 219, 0.7)', 'rgba(46, 204, 113, 0.7)', 'rgba(155, 89, 182, 0.7)'];

  return (
    <div className="RevenueDashboard-panel">
      <div className="RevenueDashboard-panel-header">
        <div className="RevenueDashboard-panel-title">Doanh thu theo khu vực</div>
        <div className="RevenueDashboard-panel-actions">
          <button onClick={handleExport}>Xuất báo cáo</button>
        </div>
      </div>
      <div className="RevenueDashboard-chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend layout="vertical" align="right" verticalAlign="middle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
// Service Revenue Panel Component
function ServiceRevenuePanel({ revenueByService }) {
  const handleExport = () => {
    try {
      // Format the data for export
      const formattedData = formatDataForExport.service(revenueByService);
      
      // Export to Excel
      exportToExcel(formattedData, 'Doanh_thu_theo_dịch_vụ', 'Dịch vụ');
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Có lỗi khi xuất báo cáo. Vui lòng thử lại sau.');
    }
  };

// Normalize the data to handle case-insensitivity
const normalizeRevenueData = (data) => {
  // Create a default structure with all zeroes
  const normalized = { standard: 0, express: 0, scheduled: 0 };
  
  // If no data is provided, return the defaults
  if (!data) return normalized;
  
  // Go through all keys in the data object and normalize them
  Object.keys(data).forEach(key => {
    const lowerKey = key.toLowerCase();
    // Only process keys that match our expected service types (case insensitive)
    if (['standard', 'express', 'scheduled'].includes(lowerKey)) {
      // Convert string values to numbers and add to the appropriate key
      normalized[lowerKey] += Number(data[key]) || 0;
    }
  });
  
  return normalized;
};

// Normalize the data
const normalizedData = normalizeRevenueData(revenueByService);

const data = [
  { name: 'Giao hàng tiêu chuẩn', value: normalizedData.standard },
  { name: 'Giao hàng nhanh', value: normalizedData.express },
  { name: 'Giao hàng hẹn giờ', value: normalizedData.scheduled }
];

// Log the normalized data for debugging
console.log('Normalized service revenue data:', normalizedData);
console.log('Formatted chart data:', data);

  const COLORS = ['rgba(52, 152, 219, 0.7)', 'rgba(46, 204, 113, 0.7)', 'rgba(155, 89, 182, 0.7)'];

  return (
    <div className="RevenueDashboard-panel">
      <div className="RevenueDashboard-panel-header">
        <div className="RevenueDashboard-panel-title">Doanh thu theo loại dịch vụ</div>
        <div className="RevenueDashboard-panel-actions">
          <button onClick={handleExport}>Xuất báo cáo</button>
        </div>
      </div>
      <div className="RevenueDashboard-chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => formatCurrency(value).replace('₫', '') + ' ₫'} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Bar dataKey="value" name="Doanh thu">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


// Payments Panel Component
function PaymentsPanel({ payments }) {
  const handleExport = () => {
    try {
      // Format the data for export
      const formattedData = formatDataForExport.payments(payments);
      
      // Export to Excel
      exportToExcel(formattedData, 'Lịch_sử_thanh_toán', 'Thanh toán');
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Có lỗi khi xuất báo cáo. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="RevenueDashboard-panel">
      <div className="RevenueDashboard-panel-header">
        <div className="RevenueDashboard-panel-title">Lịch sử thanh toán</div>
        <div className="RevenueDashboard-panel-actions">
          <button onClick={handleExport}>Xuất báo cáo</button>
        </div>
      </div>
      <div className="RevenueDashboard-table-responsive">
        <table>
          <thead>
            <tr>
              <th>Mã giao dịch</th>
              <th>Ngày thanh toán</th>
              <th>Số tiền</th>
              <th>Phương thức</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.date}</td>
                <td>{formatCurrency(payment.amount)}</td>
                <td>{payment.method}</td>
                <td>
                  <span className="RevenueDashboard-status status-success">{payment.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Fees Panel Component
function FeesPanel({ fees }) {
  const handleExport = () => {
    try {
      // Format the data for export
      const formattedData = formatDataForExport.fees(fees);
      
      // Export to Excel
      exportToExcel(formattedData, 'Danh_sách_phí', 'Phí dịch vụ');
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Có lỗi khi xuất báo cáo. Vui lòng thử lại sau.');
    }
  };
  return (
    <div className="revenue-dashboard-panel">
      <div className="RevenueDashboard-panel-header">
        <div className="RevenueDashboard-panel-title">Tổng kết các khoản phí</div>
        <div className="RevenueDashboard-panel-actions">
          <button onClick={handleExport}>Xuất báo cáo</button>
        </div>
      </div>
      <div className="RevenueDashboard-table-responsive">
        <table>
          <thead>
            <tr>
              <th>Loại phí</th>
              <th>Mô tả</th>
              <th>Số tiền</th>
              <th>Tỷ lệ (%)</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((fee, index) => (
              <tr key={index}>
                <td>{fee.type}</td>
                <td>{fee.description}</td>
                <td>{formatCurrency(fee.amount)}</td>
                <td>{fee.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Footer Component
function Footer() {
  return (
    <footer>
      © 2025 View Revenue System | <a href="#">Trợ giúp</a> | <a href="#">Liên hệ</a>
    </footer>
  );
}

// Main App Component
function App() {
  const [data, setData] = useState({
    totals: { revenue: 0, orders: 0, avgRevenue: 0, profitAfterFees: 0 },
    revenueByDay: [],
    revenueByRegion: { central: 0, mid_zone: 0, outer_zone: 0 },
    revenueByService: { standard: 0, express: 0, scheduled: 0 },
    payments: [],
    fees: [],
    alerts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    timePeriod: 'month',
    startDate: null,
    endDate: null,
    region: 'all',
    serviceType: 'all',
    shipperCode: ''
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Gọi API song song
        const [
          overviewRes,
          revenueByDayRes,
          revenueByRegionRes,
          revenueByServiceRes,
          paymentsRes,
          feesRes,
          alertsRes
        ] = await Promise.all([
          axios.get('http://localhost:5000/api/revenue-overview', { params: filters }),
          axios.get('http://localhost:5000/api/revenue-by-day', { params: filters }),
          axios.get('http://localhost:5000/api/revenue-by-region', { params: filters }),
          axios.get('http://localhost:5000/api/revenue-by-service', { params: filters }),
          axios.get('http://localhost:5000/api/payments', { params: { page: 1, limit: 10 } }),
          axios.get('http://localhost:5000/api/fees'),
          axios.get('http://localhost:5000/api/alerts')
        ]);

        // Kiểm tra dữ liệu trước khi đặt trạng thái
        const overview = overviewRes.data || {};
        const revenueByDay = revenueByDayRes.data || [];
        const revenueByRegion = revenueByRegionRes.data || { central: 0, mid_zone: 0, outer_zone: 0 };
        const revenueByService = revenueByServiceRes.data || { standard: 0, express: 0, scheduled: 0 };

        const payments = paymentsRes.data || [];
        const fees = feesRes.data || [];
        const alerts = alertsRes.data || [];

        // Log dữ liệu API để debug
        console.log('revenueByDay:', revenueByDay);
        console.log('revenueByRegion:', revenueByRegion);
        console.log('revenueByService:', revenueByService);
        
        // Kết hợp tất cả các phản hồi thành một đối tượng dữ liệu
        setData({
          totals: {
            revenue: overview.totalRevenue || 0,
            orders: overview.totalOrders || 0,
            avgRevenue: overview.avgRevenue || 0,
            profitAfterFees: (overview.totalRevenue || 0) * 0.7 // Lợi nhuận ước tính sau phí
          },
          revenueByDay,
          revenueByRegion,
          revenueByService,
          payments,
          fees,
          alerts
        });

        setError(null);
      } catch (err) {
        console.error('Lỗi tải dữ liệu doanh thu:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [filters]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (shipperCode) => {
    setFilters(prev => ({
      ...prev,
      shipperCode
    }));
  };

  if (loading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Thử lại</button>
      </div>
    );
  }

  return (
    <div className="RevenueDashboard-container">
      <Header onSearch={handleSearch} />
      <Filters filters={filters} onChange={handleFilterChange} />
      {/* Dynamically show alerts from backend if available */}
      {data.alerts && data.alerts.length > 0 && (
        <AlertsContainer alerts={data.alerts} />
      )}
      <OverviewPanel data={data.totals} revenueByDay={data.revenueByDay} />
      <OrdersPanel filters={filters} /> 
      <RegionRevenuePanel revenueByRegion={data.revenueByRegion} />
      <ServiceRevenuePanel revenueByService={data.revenueByService} />
      <PaymentsPanel payments={data.payments} />
      <FeesPanel fees={data.fees} />
      <Footer />
    </div>
  );
}



export default App;
