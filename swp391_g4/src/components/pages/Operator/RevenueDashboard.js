import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import '../../../styles/RevenueDashboard.css';

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
  return (
    <div className="RevenueDashboard-filters">
      <div className="RevenueDashboard-filter-group">
        <label htmlFor="time-period">Khoảng thời gian</label>
        <select 
          id="time-period" 
          value={filters.timePeriod}
          onChange={(e) => onChange('timePeriod', e.target.value)}
        >
          <option value="day">Hôm nay</option>
          <option value="week">Tuần này</option>
          <option value="month">Tháng này</option>
          <option value="year">Năm nay</option>
        </select>
      </div>
      <div className="RevenueDashboard-filter-group">
        <label htmlFor="region">Khu vực</label>
        <select 
          id="region" 
          value={filters.region}
          onChange={(e) => onChange('region', e.target.value)}
        >
          <option value="all">Tất cả khu vực</option>
          <option value="north">Miền Bắc</option>
          <option value="central">Miền Trung</option>
          <option value="south">Miền Nam</option>
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
    alert('Đang xuất báo cáo tổng quan doanh thu...');
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
          <LineChart
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
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3498db" 
              activeDot={{ r: 8 }} 
              name="Doanh thu (VND)" 
              strokeWidth={2}
              fill="rgba(52, 152, 219, 0.1)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Orders Panel Component
function OrdersPanel({ orders }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const handleExport = () => {
    alert('Đang xuất danh sách đơn hàng...');
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
    'standard': 'Tiêu chuẩn',
    'express': 'Nhanh',
    'scheduled': 'Hẹn giờ'
  };
  
  const regionText = {
    'north': 'Miền Bắc',
    'central': 'Miền Trung',
    'south': 'Miền Nam'
  };
  
  // Pagination calculation
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);
  
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="RevenueDashboard-panel">
      <div className="RevenueDashboard-panel-header">
        <div className="RevenueDashboard-panel-title">Chi tiết doanh thu theo đơn hàng</div>
        <div className="RevenueDashboard-panel-actions">
          <button onClick={handleExport}>Xuất danh sách</button>
        </div>
      </div>
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
            {currentItems.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.date}</td>
                <td>{serviceText[order.type]}</td>
                <td>{regionText[order.region]}</td>
                <td>
                  <span className={`status ${statusClasses[order.status]}`}>
                    {statusText[order.status]}
                  </span>
                </td>
                <td>{formatCurrency(order.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="RevenueDashboard-paginator">
        <div className="RevenueDashboard-paginator-info">
          Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, orders.length)} trong số {orders.length} đơn hàng
        </div>
        <div className="RevenueDashboard-paginator-controls">
          {pageNumbers.map(number => (
            <button 
              key={number}
              className={currentPage === number ? 'active' : ''}
              onClick={() => setCurrentPage(number)}
            >
              {number}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Region Revenue Panel Component
function RegionRevenuePanel({ revenueByRegion }) {
  const handleExport = () => {
    alert('Đang xuất báo cáo doanh thu theo khu vực...');
  };

  const data = [
    { name: 'Miền Bắc', value: revenueByRegion.north },
    { name: 'Miền Trung', value: revenueByRegion.central },
    { name: 'Miền Nam', value: revenueByRegion.south }
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
    alert('Đang xuất báo cáo doanh thu theo dịch vụ...');
  };

  const data = [
    { name: 'Giao hàng tiêu chuẩn', value: revenueByService.standard },
    { name: 'Giao hàng nhanh', value: revenueByService.express },
    { name: 'Giao hàng hẹn giờ', value: revenueByService.scheduled }
  ];

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
    alert('Đang xuất báo cáo lịch sử thanh toán...');
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
  return (
    <div className="revenue-dashboard-panel">
      <div className="RevenueDashboard-panel-header">
        <div className="RevenueDashboard-panel-title">Tổng kết các khoản phí</div>
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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    timePeriod: 'month',
    region: 'all',
    serviceType: 'all',
    shipperCode: ''
  });

  useEffect(() => {
    // In a real app, this would be an API call
    // fetchData(filters);
    setData(sampleData);
    setLoading(false);
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
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="RevenueDashboard-container">
      <Header onSearch={handleSearch} />
      <Filters filters={filters} onChange={handleFilterChange} />
      <AlertsContainer alerts={[{ 
        message: 'Doanh thu đã giảm 18% so với tuần trước. Kiểm tra báo cáo chi tiết để biết thêm thông tin.', 
        type: 'error' 
      }]} />
      <OverviewPanel data={data.totals} revenueByDay={data.revenueByDay} />
      <OrdersPanel orders={data.orders} />
      <RegionRevenuePanel revenueByRegion={data.revenueByRegion} />
      <ServiceRevenuePanel revenueByService={data.revenueByService} />
      <PaymentsPanel payments={data.payments} />
      <FeesPanel fees={data.fees} />
      <Footer />
    </div>
  );
}

// Sample data for demonstration - in a real app this would come from the backend
const sampleData = {
  revenueByDay: [
    { date: '01/03/2025', revenue: 2500000 },
    { date: '02/03/2025', revenue: 3100000 },
    { date: '03/03/2025', revenue: 2800000 },
    { date: '04/03/2025', revenue: 3400000 },
    { date: '05/03/2025', revenue: 3900000 },
    { date: '06/03/2025', revenue: 2700000 },
    { date: '07/03/2025', revenue: 2200000 },
  ],
  revenueByRegion: {
    north: 12000000,
    central: 8500000,
    south: 15800000
  },
  revenueByService: {
    standard: 18000000,
    express: 12500000,
    scheduled: 5800000
  },
  orders: [
    { id: 'ORD-12345', date: '07/03/2025', type: 'standard', region: 'north', status: 'success', revenue: 120000 },
    { id: 'ORD-12346', date: '07/03/2025', type: 'express', region: 'central', status: 'success', revenue: 180000 },
    { id: 'ORD-12347', date: '07/03/2025', type: 'standard', region: 'south', status: 'success', revenue: 110000 },
    { id: 'ORD-12348', date: '07/03/2025', type: 'scheduled', region: 'north', status: 'pending', revenue: 220000 },
    { id: 'ORD-12349', date: '06/03/2025', type: 'express', region: 'south', status: 'success', revenue: 190000 },
    { id: 'ORD-12350', date: '06/03/2025', type: 'standard', region: 'central', status: 'error', revenue: 130000 },
    { id: 'ORD-12351', date: '06/03/2025', type: 'scheduled', region: 'south', status: 'success', revenue: 240000 },
    { id: 'ORD-12352', date: '05/03/2025', type: 'standard', region: 'north', status: 'success', revenue: 125000 },
    { id: 'ORD-12353', date: '05/03/2025', type: 'express', region: 'south', status: 'success', revenue: 185000 },
    { id: 'ORD-12354', date: '05/03/2025', type: 'standard', region: 'central', status: 'pending', revenue: 115000 },
  ],
  payments: [
    { id: 'PMT-1001', date: '01/03/2025', amount: 4200000, method: 'Bank transfer', status: 'completed' },
    { id: 'PMT-1002', date: '15/02/2025', amount: 3800000, method: 'Bank transfer', status: 'completed' },
    { id: 'PMT-1003', date: '01/02/2025', amount: 4500000, method: 'Bank transfer', status: 'completed' },
    { id: 'PMT-1004', date: '15/01/2025', amount: 3950000, method: 'Bank transfer', status: 'completed' },
  ],
  fees: [
    { type: 'Phí vận hành', description: 'Chi phí nhiên liệu, bảo trì xe', amount: 4500000, percentage: 12.5 },
    { type: 'Phí dịch vụ', description: 'Phí nền tảng', amount: 3600000, percentage: 10 },
    { type: 'Phí bảo hiểm', description: 'Bảo hiểm hàng hóa', amount: 1800000, percentage: 5 },
    { type: 'Các khoản thuế', description: 'Thuế thu nhập', amount: 2520000, percentage: 7 },
  ],
  totals: {
    revenue: 36300000,
    orders: 230,
    avgRevenue: 157826,
    profitAfterFees: 23880000
  }
};

export default App;
