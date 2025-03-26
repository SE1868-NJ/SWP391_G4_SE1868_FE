import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import '../../../styles/ShipperBonusList.css';
import HeaderOperator from './HeaderOperator'; // Assuming this is the correct import path

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
  const [confirmationModal, setConfirmationModal] = useState(null);
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
    setConfirmationModal({
      shipper: shipper,
      isOpen: true
    });
  };

  const confirmPayment = async () => {
    if (!confirmationModal || !confirmationModal.shipper) return;

    const shipper = confirmationModal.shipper;
    
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:4000/api/bonus/pay', {
        ShipperID: shipper.ShipperID,
        BonusAmount: shipper.BonusAmount,
        Month: selectedMonth
      });
      
      const updatedShipperData = shipperData.map(s => 
        s.ShipperID === shipper.ShipperID 
          ? { ...s, Status: 'PAID' } 
          : s
      );
      setShipperData(updatedShipperData);

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

      setSummaryData(prevSummary => ({
        ...prevSummary,
        totalBonus: (parseFloat(prevSummary.totalBonus) - shipper.BonusAmount).toString()
      }));

      setConfirmationModal(null);
    } catch (error) {
      console.error('Error paying bonus:', error);
      
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

  const cancelPayment = () => {
    setConfirmationModal(null);
  };

  const renderConfirmationModal = () => {
    if (!confirmationModal || !confirmationModal.isOpen) return null;

    const { shipper } = confirmationModal;

    return (
      <div className="shipper-bonuslist-confirmation-modal">
        <div className="shipper-bonuslist-confirmation-modal-content">
          <h2>Xác Nhận Thanh Toán</h2>
          <p>Bạn có chắc muốn thanh toán:</p>
          <div className="shipper-bonuslist-payment-details">
            <p><strong>Shipper:</strong> {shipper.FullName}</p>
            <p><strong>Số tiền:</strong> {shipper.BonusAmount.toLocaleString()}đ</p>
            <p><strong>Tháng:</strong> {selectedMonth}</p>
          </div>
          <div className="shipper-bonuslist-confirmation-modal-actions">
            <button 
              className="shipper-bonuslist-confirm-btn" 
              onClick={confirmPayment}
            >
              Xác Nhận
            </button>
            <button 
              className="shipper-bonuslist-cancel-btn" 
              onClick={cancelPayment}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleExportExcel = async () => {
    try {
      const response = await axios.post(
        'http://localhost:4000/api/bonus/export', 
        { 
          params: { 
            month: selectedMonth, 
            ratingFilter: ratingFilter 
          }
        },
        { responseType: 'blob', timeout: 10000 }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Shipper_Bonus_${selectedMonth}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export Error:', error);
      setError(`Export failed: ${error.message}`);
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
            labels: ['5 sao', '4-5 sao', 'Dưới ngưỡng'],
            datasets: [{
              data: [high, medium, low],
              backgroundColor: ['#2c9d32', '#FF9800', '#F44336'],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: { legend: { position: 'bottom' } }
          }
        });
      }

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
                '#2c9d32',    // 5 sao - Green
                '#FF9800',     // 4-4.9 sao - Orange
                '#2196F3',     // 3-3.9 sao - Blue
                '#FF5722',     // 2-2.9 sao - Deep Orange
                '#9E9E9E'      // 1-1.9 sao - Gray
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: { 
                beginAtZero: true, 
                title: { display: true, text: 'Số lượng Shipper' } 
              },
              x: { title: { display: true, text: 'Phân loại đánh giá' } }
            },
            plugins: { 
              legend: { display: false },
              title: { display: true, text: `Phân phối đánh giá Shipper (${selectedMonth})` }
            }
          }
        });
      }
    };

    const timer = setTimeout(createCharts, 500);
    return () => {
      clearTimeout(timer);
      if (bonusDistributionChartRef.current) bonusDistributionChartRef.current.destroy();
      if (ratingTrendChartRef.current) ratingTrendChartRef.current.destroy();
    };
  }, [shipperData, selectedMonth]);

  useEffect(() => {
    setTotalPages(Math.ceil(shipperData.length / itemsPerPage));
  }, [shipperData, itemsPerPage]);

  return (
    <>
      <HeaderOperator />
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <button 
          className="shipper-bonuslist-nav-button active" 
          onClick={() => window.location.href = "http://localhost:3000/shipper-bonus-list"}
        >
          Danh sách thưởng
        </button>
        <button 
          className="shipper-bonuslist-nav-button" 
          onClick={() => window.location.href = "http://localhost:3000/bonus-settings"}
        >
          Cài đặt
        </button>
      </div>

      <main className="shipper-bonuslist-main">
        <h1>Quản Lý Thưởng Shipper</h1>
        <p>Theo dõi và quản lý tiền thưởng cho shipper dựa trên đánh giá và hiệu suất</p>

        <div className="shipper-bonuslist-dashboard">
          <div className="shipper-bonuslist-card">
            <h3>Tổng tiền thưởng ({selectedMonth.slice(5)}/{selectedMonth.slice(0, 4)})</h3>
            <div className="shipper-bonuslist-value">{Number(summaryData.totalBonus).toLocaleString()} VNĐ</div>
            <div className="shipper-bonuslist-change shipper-bonuslist-positive">
              <i className="fas fa-arrow-up"></i> 
            </div>
          </div>
          <div className="shipper-bonuslist-card">
            <h3>Số shipper nhận thưởng</h3>
            <div className="shipper-bonuslist-value">{summaryData.shipperCount}</div>
            <div className="shipper-bonuslist-change shipper-bonuslist-positive">
              <i className="fas fa-arrow-up"></i> 
            </div>
          </div>
          <div className="shipper-bonuslist-card">
            <h3>Đánh giá trung bình</h3>
            <div className="shipper-bonuslist-value">{summaryData.avgRating.toFixed(2)} <small>/ 5</small></div>
            <div className="shipper-bonuslist-change shipper-bonuslist-positive">
              <i className="fas fa-arrow-up"></i> 
            </div>
          </div>
        </div>

        {error && (
          <div className="shipper-bonuslist-error">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        <div className="shipper-bonuslist-tools">
          <div className="shipper-bonuslist-filters">
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
            <div className="shipper-bonuslist-search" style={{display: 'flex'}}>
              <input 
                type="text" 
                placeholder="Tìm kiếm theo ID hoặc tên shipper" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                style={{width: '200px'}}
              />
              <button onClick={handleSearch} >
                <i className="fas fa-search" style={{height: "22px"}}></i>
              </button>
            </div>
          </div>
          <div className="shipper-bonuslist-actions">
            <button 
              className="shipper-bonuslist-secondary" 
              onClick={handleExportExcel}
            >
              <i className="fas fa-download"></i> Xuất Excel
            </button>
          </div>
        </div>

        <div className="shipper-bonuslist-data-container">
          <div className="shipper-bonuslist-data-header">
            <h2>Danh sách thưởng tháng {selectedMonth.slice(5)}/{selectedMonth.slice(0, 4)}</h2>
            <div className="shipper-bonuslist-actions">
              <button 
                className="shipper-bonuslist-secondary" 
                onClick={fetchBonusData}
              >
                <i className="fas fa-sync-alt"></i>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="shipper-bonuslist-loading">
              <i className="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...
            </div>
          ) : (
            <table className="shipper-bonuslist-table">
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
                      {shipper.Status.toLowerCase() === 'paid' ? (
                        <span className="shipper-bonuslist-paid-status">Đã thanh toán</span>
                      ) : (
                        <button 
                          className="shipper-bonuslist-pay-btn"
                          onClick={() => handlePayBonus(shipper)}
                        >
                          Thanh toán
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {getSortedData().length === 0 && (
                  <tr>
                    <td colSpan="9" className="shipper-bonuslist-no-data">
                      Không tìm thấy dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          <div className="shipper-bonuslist-pagination">
            <button 
              className="shipper-bonuslist-secondary" 
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
                    className={currentPage === pageNumber ? 'active' : 'shipper-bonuslist-secondary'}
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
              className="shipper-bonuslist-secondary"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div className="shipper-bonuslist-charts-container">
          <div className="shipper-bonuslist-chart-card">
            <h3>Phân bố thưởng theo đánh giá</h3>
            <canvas id="bonusDistribution"></canvas>
          </div>
          <div className="shipper-bonuslist-chart-card">
            <h3>Phân phối đánh giá Shipper</h3>
            <canvas id="ratingTrend"></canvas>
          </div>
        </div>
        {renderConfirmationModal()}
      </main>
    </>
  );
};

export default ShipperBonusList;