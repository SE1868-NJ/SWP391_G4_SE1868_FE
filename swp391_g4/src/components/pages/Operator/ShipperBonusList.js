import React, { useState, useEffect, useRef } from 'react';
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
  const bonusDistributionChartRef = useRef(null);
  const ratingTrendChartRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedShipper, setSelectedShipper] = useState(null);
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
      const shipperDataWithStatus = response.data.data.map(shipper => ({
        ...shipper,
        Status: shipper.Status || 'pending'
      }));
      setShipperData(shipperDataWithStatus);
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

  const handlePayBonus = async (shipper) => {
    try {
      // Add confirmation dialog
      const confirmPayment = window.confirm(
        `Bạn có chắc muốn thanh toán ${shipper.BonusAmount.toLocaleString()}đ cho shipper ${shipper.FullName}?`
      );

      if (!confirmPayment) {
        return;  // Exit if user cancels
      }

      setLoading(true);
      const response = await axios.post('http://localhost:4000/api/bonus/pay', {
        ShipperID: shipper.ShipperID,
        BonusAmount: shipper.BonusAmount,
        Month: selectedMonth
      });
      console.log('Payment response:', response.data);
      // Update local state to reflect payment
      const updatedShipperData = shipperData.map(s => 
        s.ShipperID === shipper.ShipperID 
          ? { ...s, Status: 'PAID' } 
          : s
      );
      setShipperData(updatedShipperData);

      // Show success toast/modal
      const paymentModal = document.createElement('div');
      paymentModal.className = 'payment-success-modal';
      paymentModal.innerHTML = `
        <div class="modal-content">
          <h2>Thanh toán thành công</h2>
          <p>Đã chuyển ${shipper.BonusAmount.toLocaleString()}đ cho shipper ${shipper.FullName}</p>
          <p>Mã giao dịch: ${response.data.transactionId}</p>
          <button onclick="this.closest('.payment-success-modal').remove()">Đóng</button>
        </div>
      `;
      document.body.appendChild(paymentModal);

      // Update summary data
      setSummaryData(prevSummary => ({
        ...prevSummary,
        totalBonus: (parseFloat(prevSummary.totalBonus) - shipper.BonusAmount).toString()
      }));

    } catch (error) {
      console.error('Error paying bonus:', error);
      
      // More detailed error handling
      const errorMessage = error.response?.data?.error || 
        error.message || 
        'Thanh toán không thành công';

      const errorModal = document.createElement('div');
      errorModal.className = 'payment-error-modal';
      errorModal.innerHTML = `
        <div class="modal-content">
          <h2>Lỗi Thanh Toán</h2>
          <p>${errorMessage}</p>
          <button onclick="this.closest('.payment-error-modal').remove()">Đóng</button>
        </div>
      `;
      document.body.appendChild(errorModal);

    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      console.log('Exporting with params:', { 
        month: selectedMonth, 
        ratingFilter: ratingFilter 
      });
  
      const response = await axios.post(
        'http://localhost:4000/api/bonus/export', 
        { 
          params: { 
            month: selectedMonth, 
            ratingFilter: ratingFilter 
          }
        },
        {
          responseType: 'blob',
          // Add timeout and error handling
          timeout: 10000,
          validateStatus: (status) => status >= 200 && status < 300
        }
      );
      
      // More robust file download
      const contentType = response.headers['content-type'];
      if (contentType !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        throw new Error('Invalid file type received');
      }
  
      const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Shipper_Bonus_${selectedMonth}.xlsx`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
  
    } catch (error) {
      console.error('Detailed Export Error:', error);
      
      // More informative error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Server Response Error:', error.response.data);
        setError(`Export failed: ${error.response.data.error || 'Unknown server error'}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No Response Received:', error.request);
        setError('No response from server. Check network connection.');
      } else {
        // Something happened in setting up the request
        console.error('Request Setup Error:', error.message);
        setError(`Export error: ${error.message}`);
      }
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
    
    const sorted = [...shipperData].sort((a, b) => {
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

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return sorted.slice(indexOfFirstItem, indexOfLastItem);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    fetchBonusData();
  }, [selectedMonth, ratingFilter]);

  useEffect(() => {
    const createCharts = () => {
      // Bonus Distribution Chart
      if (bonusDistributionChartRef.current) {
        bonusDistributionChartRef.current.destroy();
      }
      
      const bonusDistributionCtx = document.getElementById('bonusDistribution')?.getContext('2d');
      if (bonusDistributionCtx) {
        const high = shipperData.filter(s => s.AvgRating >= 4.5).length;
        const medium = shipperData.filter(s => s.AvgRating >= 3.5 && s.AvgRating < 4.5).length;
        const low = shipperData.filter(s => s.AvgRating < 3.5).length;

        bonusDistributionChartRef.current = new Chart(bonusDistributionCtx, {
          type: 'doughnut',
          data: {
            labels: ['5 sao ', '4-5 sao ', 'Dưới ngưỡng '],
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

      // Rating Trend Chart (New Bar Chart)
      if (ratingTrendChartRef.current) {
        ratingTrendChartRef.current.destroy();
      }
      
      const ratingTrendCtx = document.getElementById('ratingTrend')?.getContext('2d');
      if (ratingTrendCtx) {
        const generateRatingDistributionData = (shipperData) => {
          const ratingBuckets = {
            '5 sao': 0,
            '4-4.9 sao': 0,
            '3-3.9 sao': 0,
            '2-2.9 sao': 0,
            '1-1.9 sao': 0
          };

          shipperData.forEach(shipper => {
            if (shipper.AvgRating >= 5) ratingBuckets['5 sao']++;
            else if (shipper.AvgRating >= 4) ratingBuckets['4-4.9 sao']++;
            else if (shipper.AvgRating >= 3) ratingBuckets['3-3.9 sao']++;
            else if (shipper.AvgRating >= 2) ratingBuckets['2-2.9 sao']++;
            else ratingBuckets['1-1.9 sao']++;
          });

          return {
            labels: Object.keys(ratingBuckets),
            data: Object.values(ratingBuckets)
          };
        };

        const { labels, data } = generateRatingDistributionData(shipperData);

        ratingTrendChartRef.current = new Chart(ratingTrendCtx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Số lượng Shipper',
              data: data,
              backgroundColor: [
                'rgba(76, 175, 80, 0.8)',    // 5 sao - Green
                'rgba(255, 152, 0, 0.8)',     // 4-4.9 sao - Orange
                'rgba(33, 150, 243, 0.8)',    // 3-3.9 sao - Blue
                'rgba(255, 87, 34, 0.8)',     // 2-2.9 sao - Deep Orange
                'rgba(158, 158, 158, 0.8)'    // 1-1.9 sao - Gray
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: { 
                beginAtZero: true, 
                title: { 
                  display: true, 
                  text: 'Số lượng Shipper' 
                } 
              },
              x: {
                title: {
                  display: true,
                  text: 'Phân loại đánh giá'
                }
              }
            },
            plugins: { 
              legend: { display: false },
              title: {
                display: true,
                text: `Phân phối đánh giá Shipper (${selectedMonth})`
              }
            }
          }
        });
      }
    };

    const timer = setTimeout(createCharts, 500);
    
    return () => {
      clearTimeout(timer);
      if (bonusDistributionChartRef.current) {
        bonusDistributionChartRef.current.destroy();
      }
      if (ratingTrendChartRef.current) {
        ratingTrendChartRef.current.destroy();
      }
    };
  }, [shipperData, selectedMonth]);

  useEffect(() => {
    setTotalPages(Math.ceil(shipperData.length / itemsPerPage));
  }, [shipperData, itemsPerPage]);

  return (
    <>
      <header className="ShipperBonusList-header">
        <div className="ShipperBonusList-logo">
          
          <span>Quản Lý Tiền Thưởng Của Shipper</span>
        </div>
        <nav>
          <ul>
            <li><a href="http://localhost:3000/shipper-bonus-list" className="ShipperBonusList-active">Quản lý thưởng</a></li>
            <li><a href="http://localhost:3000/bonus-settings">Cài đặt</a></li>
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
              <i className="fas fa-arrow-up"></i> 
            </div>
          </div>
          <div className="ShipperBonusList-card">
            <h3>Số shipper nhận thưởng</h3>
            <div className="ShipperBonusList-value">{summaryData.shipperCount}</div>
            <div className="ShipperBonusList-change ShipperBonusList-positive">
              <i className="fas fa-arrow-up"></i> 
            </div>
          </div>
          <div className="ShipperBonusList-card">
            <h3>Đánh giá trung bình</h3>
            <div className="ShipperBonusList-value">{summaryData.avgRating.toFixed(2)} <small>/ 5</small></div>
            <div className="ShipperBonusList-change ShipperBonusList-positive">
              <i className="fas fa-arrow-up"></i> 
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
              <option value="2025-03">Tháng 3/2025</option>
              <option value="2025-02">Tháng 2/2025</option>
              <option value="2025-01">Tháng 1/2025</option>
              <option value="2024-12">Tháng 12/2024</option>
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
                  <th>Thanh toán</th>
                  
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
                      {shipper.Status === 'pending' ? (
                        <button 
                          className="ShipperBonusList-pay-btn"
                          onClick={() => handlePayBonus(shipper)}
                        >
                          Thanh toán
                        </button>
                      ) : (
                        <span className="ShipperBonusList-paid-status">Đã thanh toán</span>
                      )}
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
            <button 
              className="ShipperBonusList-secondary" 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    className={currentPage === pageNumber ? 'active' : 'ShipperBonusList-secondary'}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return <span key={pageNumber}>...</span>;
              }
              return null;
            })}

            <button 
              className="ShipperBonusList-secondary"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div className="ShipperBonusList-charts-container">
          <div className="ShipperBonusList-chart-card">
            <h3>Phân bố thưởng theo đánh giá</h3>
            <canvas id="bonusDistribution"></canvas>
          </div>
          <div className="ShipperBonusList-chart-card">
            <h3>Phân phối đánh giá Shipper</h3>
            <canvas id="ratingTrend"></canvas>
          </div>
        </div>
      </main>
    </>
  );
};

export default ShipperBonusList;