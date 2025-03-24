import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import '../../../styles/ShipperBonusList.css';

const ShipperBonusList = () => {
  const [shipperData, setShipperData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [sortField, setSortField] = useState('BonusAmount');
  const [sortDirection, setSortDirection] = useState('desc');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summaryData, setSummaryData] = useState({
    totalBonus: '0',
    shipperCount: 0,
    avgRating: 0
  });

  const fetchBonusData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:4000/api/bonus/list`, {
        params: { 
          month: selectedMonth, 
          ratingFilter: ratingFilter 
        }
      });
      
      setShipperData(response.data.data);
      setSummaryData(response.data.summary);
    } catch (error) {
      console.error('Error fetching bonus data:', error);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchBonusData();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:4000/api/bonus/search`, {
        params: { 
          searchTerm, 
          month: selectedMonth, 
          ratingFilter: ratingFilter 
        }
      });
      
      setShipperData(response.data.data);
      setSummaryData(response.data.summary);
    } catch (error) {
      console.error('Error searching bonus data:', error);
      setError('Không thể tìm kiếm. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateBonus = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post('http://localhost:4000/api/bonus/calculate', { month: selectedMonth });
      fetchBonusData();
    } catch (error) {
      console.error('Error calculating bonuses:', error);
      setError('Không thể tính toán thưởng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/bonus/export', {
        params: { 
          month: selectedMonth, 
          ratingFilter: ratingFilter 
        },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Shipper_Bonus_${selectedMonth}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting data:', error);
      setError('Không thể xuất Excel. Vui lòng thử lại.');
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortedData = () => {
    if (!shipperData.length) return [];
    
    return [...shipperData].sort((a, b) => {
      let comparison = 0;
      switch(sortField) {
        case 'ShipperID':
          comparison = a.ShipperID.localeCompare(b.ShipperID);
          break;
        case 'FullName':
          comparison = a.FullName.localeCompare(b.FullName);
          break;
        case 'TotalOrders':
          comparison = a.TotalOrders - b.TotalOrders;
          break;
        case 'AvgRating':
          comparison = a.AvgRating - b.AvgRating;
          break;
        case 'BonusAmount':
        default:
          comparison = a.BonusAmount - b.BonusAmount;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  useEffect(() => {
    fetchBonusData();
  }, [selectedMonth, ratingFilter]);

  useEffect(() => {
    const createCharts = () => {
      const bonusDistributionCtx = document.getElementById('bonusDistribution')?.getContext('2d');
      if (bonusDistributionCtx) {
        const high = shipperData.filter(s => s.AvgRating >= 4.5).length;
        const medium = shipperData.filter(s => s.AvgRating >= 3.5 && s.AvgRating < 4.5).length;
        const low = shipperData.filter(s => s.AvgRating < 3.5).length;

        new Chart(bonusDistributionCtx, {
          type: 'doughnut',
          data: {
            labels: ['5 sao (10.000đ/đơn)', '4-5 sao (5.000đ/đơn)', 'Dưới ngưỡng (2.000đ/đơn)'],
            datasets: [{
              data: [high, medium, low],
              backgroundColor: ['#4CAF50', '#FF9800', '#F44336'],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: { legend: { position: 'bottom' } }
          }
        });
      }

      const ratingTrendCtx = document.getElementById('ratingTrend')?.getContext('2d');
      if (ratingTrendCtx) {
        new Chart(ratingTrendCtx, {
          type: 'line',
          data: {
            labels: ['T10/2023', 'T11/2023', 'T12/2023', 'T1/2024', 'T2/2024', 'T3/2024'],
            datasets: [
              {
                label: 'Đánh giá trung bình',
                data: [3.85, 3.92, 4.05, 4.12, 4.25, 4.37],
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.4,
                fill: true
              },
              {
                label: 'Tỉ lệ đánh giá 5 sao',
                data: [35, 38, 42, 48, 52, 59],
                borderColor: '#FF9800',
                backgroundColor: 'rgba(255, 152, 0, 0)',
                tension: 0.4
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              y: { beginAtZero: false, min: 3.5, max: 5, title: { display: true, text: 'Đánh giá' } }
            },
            plugins: { legend: { position: 'bottom' } }
          }
        });
      }
    };

    const timer = setTimeout(() => createCharts(), 500);
    return () => clearTimeout(timer);
  }, [shipperData]);

  return (
    <>
      <header className="ShipperBonusList-header">
        <div className="ShipperBonusList-logo">
          <i className="fas fa-shipping-fast"></i>
          <span>Quản Lý Shipper</span>
        </div>
        <nav>
          <ul>
            <li><a href="#">Tổng quan</a></li>
            <li><a href="#" className="ShipperBonusList-active">Quản lý thưởng</a></li>
            <li><a href="#">Shipper</a></li>
            <li><a href="#">Báo cáo</a></li>
            <li><a href="#">Cài đặt</a></li>
          </ul>
        </nav>
      </header>

      <main className="ShipperBonusList-main">
        <h1>Quản Lý Thưởng Shipper</h1>
        <p>Theo dõi và quản lý tiền thưởng cho shipper dựa trên đánh giá và hiệu suất</p>

        <div className="ShipperBonusList-dashboard">
          <div className="ShipperBonusList-card">
            <h3>Tổng tiền thưởng ({selectedMonth.slice(5)}/{selectedMonth.slice(0, 4)})</h3>
            <div className="ShipperBonusList-value">{Number(summaryData.totalBonus).toLocaleString()} VNĐ</div>
            <div className="ShipperBonusList-change ShipperBonusList-positive">
              <i className="fas fa-arrow-up"></i> 12,3% so với tháng trước
            </div>
          </div>
          <div className="ShipperBonusList-card">
            <h3>Số shipper nhận thưởng</h3>
            <div className="ShipperBonusList-value">{summaryData.shipperCount}</div>
            <div className="ShipperBonusList-change ShipperBonusList-positive">
              <i className="fas fa-arrow-up"></i> 8,5% so với tháng trước
            </div>
          </div>
          <div className="ShipperBonusList-card">
            <h3>Đánh giá trung bình</h3>
            <div className="ShipperBonusList-value">{summaryData.avgRating.toFixed(2)} <small>/ 5</small></div>
            <div className="ShipperBonusList-change ShipperBonusList-positive">
              <i className="fas fa-arrow-up"></i> 0.25 so với tháng trước
            </div>
          </div>
        </div>

        {error && (
          <div className="ShipperBonusList-error">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        <div className="ShipperBonusList-tools">
          <div className="ShipperBonusList-filters">
            <select id="month-filter" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              <option value="2024-03">Tháng 3/2024</option>
              <option value="2024-02">Tháng 2/2024</option>
              <option value="2024-01">Tháng 1/2024</option>
              <option value="2023-12">Tháng 12/2023</option>
            </select>
            <select 
              id="rating-filter" 
              value={ratingFilter} 
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="all">Tất cả đánh giá</option>
              <option value="high">Cao (4.5-5.0)</option>
              <option value="medium">Trung bình (3.5-4.4)</option>
              <option value="low">Thấp (0-3.4)</option>
            </select>
            <div className="ShipperBonusList-search">
              <input 
                type="text" 
                placeholder="Tìm kiếm theo ID hoặc tên shipper" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch}>
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>
          <div className="ShipperBonusList-actions">
            <button 
              className="ShipperBonusList-secondary" 
              onClick={handleExportExcel}
            >
              <i className="fas fa-download"></i> Xuất Excel
            </button>
            <button onClick={handleCalculateBonus}>
              <i className="fas fa-calculator"></i> Tính toán lại
            </button>
          </div>
        </div>

        <div className="ShipperBonusList-data-container">
          <div className="ShipperBonusList-data-header">
            <h2>Danh sách thưởng tháng {selectedMonth.slice(5)}/{selectedMonth.slice(0, 4)}</h2>
            <div className="ShipperBonusList-actions">
              <button 
                className="ShipperBonusList-secondary" 
                onClick={fetchBonusData}
              >
                <i className="fas fa-sync-alt"></i>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="ShipperBonusList-loading">
              <i className="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...
            </div>
          ) : (
            <table className="ShipperBonusList-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('ShipperID')}>
                    Shipper ID {sortField === 'ShipperID' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('FullName')}>
                    Tên shipper {sortField === 'FullName' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('TotalOrders')}>
                    Số đơn hàng {sortField === 'TotalOrders' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('AvgRating')}>
                    Đánh giá TB {sortField === 'AvgRating' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Đánh giá 5 sao</th>
                  <th>Đánh giá 4 sao</th>
                  <th onClick={() => handleSort('BonusAmount')}>
                    Tiền thưởng {sortField === 'BonusAmount' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {getSortedData().map((shipper) => (
                  <tr key={shipper.ShipperID}>
                    <td>{shipper.ShipperID}</td>
                    <td>{shipper.FullName}</td>
                    <td>{shipper.TotalOrders}</td>
                    <td>{shipper.AvgRating.toFixed(2)}</td>
                    <td>
                      {shipper.Rating5Count} ({((shipper.Rating5Count / shipper.TotalOrders) * 100).toFixed(0)}%)
                    </td>
                    <td>
                      {shipper.Rating4Count} ({((shipper.Rating4Count / shipper.TotalOrders) * 100).toFixed(0)}%)
                    </td>
                    <td>{shipper.BonusAmount.toLocaleString()}đ</td>
                    <td>
                      <span className={`ShipperBonusList-status-badge ShipperBonusList-${shipper.Status === 'paid' ? 'high' : 'medium'}`}>
                        {shipper.Status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      </span>
                    </td>
                    <td>
                      <button className="ShipperBonusList-secondary">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="ShipperBonusList-secondary">
                        <i className="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {getSortedData().length === 0 && (
                  <tr>
                    <td colSpan="9" className="ShipperBonusList-no-data">
                      Không tìm thấy dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          <div className="ShipperBonusList-pagination">
            <button className="ShipperBonusList-secondary"><i className="fas fa-chevron-left"></i></button>
            <button className="ShipperBonusList-secondary">1</button>
            <button>2</button>
            <button className="ShipperBonusList-secondary">3</button>
            <button className="ShipperBonusList-secondary"><i className="fas fa-chevron-right"></i></button>
          </div>
        </div>

        <div className="ShipperBonusList-charts-container">
          <div className="ShipperBonusList-chart-card">
            <h3>Phân bố thưởng theo đánh giá</h3>
            <canvas id="bonusDistribution"></canvas>
          </div>
          <div className="ShipperBonusList-chart-card">
            <h3>Xu hướng đánh giá theo tháng</h3>
            <canvas id="ratingTrend"></canvas>
          </div>
        </div>
      </main>
    </>
  );
};

export default ShipperBonusList;