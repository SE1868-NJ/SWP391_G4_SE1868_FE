import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { Card, Form, Button, Modal, Table } from "react-bootstrap";
import axios from "axios";
import ReactPaginate from "react-paginate";

const Revenue = () => {
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const pieChartInstance = useRef(null);
  const barChartInstance = useRef(null);
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };
  const [orders, setOrders] = useState([]);
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [deliveryStats, setDeliveryStats] = useState({
    successfulOrders: 0,
    failedOrders: 0,
    successRate: '0%',
    failureRate: '0%'
  });
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'success' hoặc 'failed'
  const [modalOrders, setModalOrders] = useState([]);
  const id = localStorage.getItem("shipperId");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/get-all-my-delivery-orders/" + id
        );
        setOrders(response.data.orders);

        return response.data.orders;
      } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
      }
    };

    fetchAllOrders();
  }, []);

  useEffect(() => {
    const newTotalRevenue = orders.reduce((acc, order) => {
      if (order.OrderStatus === 'Delivered') {
        return acc + Number(order.ShippingFee || 0);
      }
      return acc;
    }, 0);
    setTotalRevenue(newTotalRevenue);
  }, [orders]);

  useEffect(() => {
    if (orders.length > 0) {
      const newStatusCounts = orders.reduce((acc, order) => {
        acc[order.OrderStatus] = (acc[order.OrderStatus] || 0) + 1;
        return acc;
      }, {});
      setStatusCounts(newStatusCounts);

      const months = [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ];
      const shippingFeeByMonth = orders.reduce((acc, order) => {
        if (order.ActualDeliveryTime && order.OrderStatus === 'Delivered') {
          try {
            const dateObject = new Date(order.ActualDeliveryTime);
            if (!isNaN(dateObject.getTime())) {
              const monthIndex = dateObject.getMonth();
              const fee = parseFloat(order.ShippingFee) || 0;
              acc[months[monthIndex]] = (acc[months[monthIndex]] || 0) + fee;
            }
          } catch (error) {
            console.error("Error parsing date for order:", error);
          }
        }
        return acc;
      }, {});

      setLabels(months);
      setData(months.map((month) => shippingFeeByMonth[month] || 0));
    }
  }, [orders]);

  useEffect(() => {
    if (pieChartInstance.current) pieChartInstance.current.destroy();
    if (barChartInstance.current) barChartInstance.current.destroy();

    if (pieChartRef.current && Object.keys(statusCounts).length > 0) {
      const relevantStatuses = {
        'Delivered': 'Đã giao thành công',
        'Cancelled': 'Giao thất bại',
        'InProgress': 'Đang giao'
      };

      // Định nghĩa màu cố định cho từng trạng thái
      const statusColors = {
        'Delivered': '#4CAF50',  // Màu xanh lá cho đơn thành công
        'Cancelled': '#FF5252',  // Màu đỏ cho đơn thất bại
        'InProgress': '#2196F3'  // Màu xanh dương cho đơn đang giao
      };

      const filteredData = Object.entries(statusCounts)
        .filter(([status]) => relevantStatuses[status])
        .reduce((acc, [status, count]) => {
          acc.labels.push(relevantStatuses[status]);
          acc.data.push(count);
          acc.colors.push(statusColors[status]); // Thêm màu tương ứng
          return acc;
        }, { labels: [], data: [], colors: [] });

      pieChartInstance.current = new Chart(pieChartRef.current, {
        type: "pie",
        data: {
          labels: filteredData.labels,
          datasets: [
            {
              data: filteredData.data,
              backgroundColor: filteredData.colors, // Sử dụng mảng màu đã định nghĩa
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: {
                  size: 14
                },
                padding: 20
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((context.raw / total) * 100).toFixed(1);
                  return `${context.label}: ${context.raw} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    }

    if (barChartRef.current && labels.length > 0 && data.length > 0) {
      barChartInstance.current = new Chart(barChartRef.current, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Phí Vận Chuyển (VND)",
              data,
              backgroundColor: '#2196F3', // Màu cố định cho biểu đồ cột
              borderColor: '#1976D2',     // Màu viền cố định
              borderWidth: 1,
              borderRadius: 4,            // Bo góc cho các cột
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return formatCurrency(value);
                },
              },
              grid: {
                color: '#E0E0E0' // Màu của lưới
              }
            },
            x: {
              grid: {
                display: false // Ẩn lưới trục x
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                font: {
                  size: 14
                }
              }
            }
          }
        },
      });
    }
    return () => {
      pieChartInstance.current?.destroy();
      barChartInstance.current?.destroy();
    };
  }, [statusCounts, labels, data]);

  useEffect(() => {
    if (orders.length > 0) {
      const successful = orders.filter(order => order.OrderStatus === 'Delivered').length;
      const failed = orders.filter(order => order.OrderStatus === 'Cancelled').length;
      const successRate = ((successful / orders.length) * 100).toFixed(2);
      const failureRate = ((failed / orders.length) * 100).toFixed(2);

      setDeliveryStats({
        successfulOrders: successful,
        failedOrders: failed,
        successRate: `${successRate}%`,
        failureRate: `${failureRate}%`
      });
    }
  }, [orders]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filterOrdersByDate = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      alert('Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc');
      return;
    }

    const filtered = orders.filter(order => {
      const orderDate = new Date(order.ActualDeliveryTime);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59);

      return orderDate >= start && orderDate <= end;
    });

    setFilteredOrders(filtered);
    
    const newTotalRevenue = filtered.reduce((acc, order) => {
      if (order.OrderStatus === 'Delivered') {
        return acc + Number(order.ShippingFee || 0);
      }
      return acc;
    }, 0);
    setTotalRevenue(newTotalRevenue);

    const successful = filtered.filter(order => order.OrderStatus === 'Delivered').length;
    const failed = filtered.filter(order => order.OrderStatus === 'Cancelled').length;
    const successRate = filtered.length ? ((successful / filtered.length) * 100).toFixed(2) : '0';
    const failureRate = filtered.length ? ((failed / filtered.length) * 100).toFixed(2) : '0';

    setDeliveryStats({
      successfulOrders: successful,
      failedOrders: failed,
      successRate: `${successRate}%`,
      failureRate: `${failureRate}%`
    });

    const newStatusCounts = filtered.reduce((acc, order) => {
      if (['Delivered', 'Cancelled', 'InProgress'].includes(order.OrderStatus)) {
        acc[order.OrderStatus] = (acc[order.OrderStatus] || 0) + 1;
      }
      return acc;
    }, {});
    setStatusCounts(newStatusCounts);

    const months = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
      "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
      "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];
    
    const shippingFeeByMonth = filtered.reduce((acc, order) => {
      if (order.ActualDeliveryTime && order.OrderStatus === 'Delivered') {
        try {
          const dateObject = new Date(order.ActualDeliveryTime);
          if (!isNaN(dateObject.getTime())) {
            const monthIndex = dateObject.getMonth();
            const fee = parseFloat(order.ShippingFee) || 0;
            acc[months[monthIndex]] = (acc[months[monthIndex]] || 0) + fee;
          }
        } catch (error) {
          console.error("Error parsing date for order:", error);
        }
      }
      return acc;
    }, {});

    setLabels(months);
    setData(months.map((month) => shippingFeeByMonth[month] || 0));
  };

  const resetFilter = () => {
    setDateRange({
      startDate: '',
      endDate: ''
    });
    
    setFilteredOrders([]);
    
    const originalTotalRevenue = orders.reduce((acc, order) => {
      if (order.OrderStatus === 'Delivered') {
        return acc + Number(order.ShippingFee || 0);
      }
      return acc;
    }, 0);
    setTotalRevenue(originalTotalRevenue);

    const successful = orders.filter(order => order.OrderStatus === 'Delivered').length;
    const failed = orders.filter(order => order.OrderStatus === 'Cancelled').length;
    const successRate = ((successful / orders.length) * 100).toFixed(2);
    const failureRate = ((failed / orders.length) * 100).toFixed(2);

    setDeliveryStats({
      successfulOrders: successful,
      failedOrders: failed,
      successRate: `${successRate}%`,
      failureRate: `${failureRate}%`
    });

    const newStatusCounts = orders.reduce((acc, order) => {
      if (['Delivered', 'Cancelled', 'InProgress'].includes(order.OrderStatus)) {
        acc[order.OrderStatus] = (acc[order.OrderStatus] || 0) + 1;
      }
      return acc;
    }, {});
    setStatusCounts(newStatusCounts);

    const months = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
      "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
      "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];
    
    const shippingFeeByMonth = orders.reduce((acc, order) => {
      if (order.ActualDeliveryTime && order.OrderStatus === 'Delivered') {
        try {
          const dateObject = new Date(order.ActualDeliveryTime);
          if (!isNaN(dateObject.getTime())) {
            const monthIndex = dateObject.getMonth();
            const fee = parseFloat(order.ShippingFee) || 0;
            acc[months[monthIndex]] = (acc[months[monthIndex]] || 0) + fee;
          }
        } catch (error) {
          console.error("Error parsing date for order:", error);
        }
      }
      return acc;
    }, {});

    setLabels(months);
    setData(months.map((month) => shippingFeeByMonth[month] || 0));
  };

  // Hàm xử lý hiển thị modal
  const handleShowDetails = (type) => {
    const ordersToShow = (filteredOrders.length > 0 ? filteredOrders : orders)
        .filter(order => {
            if (type === 'success') return order.OrderStatus === 'Delivered';
            if (type === 'failed') return order.OrderStatus === 'Cancelled';
            return false;
        });

    // Lấy thêm thông tin từ OrderDetails
    const fetchOrderDetails = async () => {
        try {
            const detailedOrders = await Promise.all(
                ordersToShow.map(async (order) => {
                    // Kiểm tra OrderID tồn tại và log ra để debug
                    console.log("OrderID:", order.OrderID); // MySQL thường dùng viết hoa ID
                    
                    if (!order.OrderID) {
                        console.error("Missing OrderID for order:", order);
                        return order;
                    }

                    const response = await axios.get(`http://localhost:4000/api/getOrderDetails/${order.OrderID}`);
                    return {
                        ...order,
                        ...response.data.order,
                        customerInfo: response.data.customer,
                        shopInfo: response.data.shop,
                        products: response.data.products
                    };
                })
            );
            setModalOrders(detailedOrders);
        } catch (error) {
            console.error("Error fetching order details:", error);
            setModalOrders(ordersToShow);
        }
    };

    fetchOrderDetails();
    setModalType(type);
    setShowModal(true);
  };

  // Thêm hàm xử lý phân trang
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  // Component Modal hiển thị chi tiết
  const OrderDetailsModal = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [orderDetails, setOrderDetails] = useState([]);
    const itemsPerPage = 7;
    const title = modalType === 'success' ? 'Đơn Hàng Thành Công' : 'Đơn Hàng Thất Bại';

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!modalOrders.length) return;
            
            setIsLoading(true);
            try {
                const details = await Promise.all(
                    modalOrders.map(async (order) => {
                        try {
                            const response = await axios.get(`http://localhost:4000/api/getOrderDetails/${order.OrderID}`);
                            return {
                                ...order,
                                ...response.data.order,
                                customerInfo: response.data.customer,
                                shopInfo: response.data.shop,
                                products: response.data.products
                            };
                        } catch (error) {
                            console.error(`Error fetching details for order ${order.OrderID}:`, error);
                            return order;
                        }
                    })
                );
                setOrderDetails(details.filter(detail => detail !== null));
            } catch (error) {
                console.error('Error fetching order details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (showModal) {
            fetchOrderDetails();
        }
    }, [showModal, modalOrders]);

    // Tính toán dữ liệu phân trang
    const offset = currentPage * itemsPerPage;
    const currentPageData = orderDetails.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(orderDetails.length / itemsPerPage);

    const formatDate = (dateString) => {
        if (!dateString) return "Chưa có";
        try {
            return new Date(dateString).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch {
            return "Chưa có";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'Delivered':
                return 'Thành công';
            case 'Cancelled':
                return 'Đã hủy';
            default:
                return status;
        }
    };

  return (
        <Modal 
            show={showModal} 
            onHide={() => {
                setShowModal(false);
                setCurrentPage(0);
                setOrderDetails([]); 
            }}
            className="order-details-modal"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="modal-content-wrapper">
                    <div className="table-container">
                        {isLoading ? (
                            <div className="loading-overlay">
                                <div className="loading-spinner"></div>
                            </div>
                        ) : (
                            <>
                                <div className="pagination-info">
                                    Hiển thị {Math.min(offset + 1, orderDetails.length)} - {Math.min(offset + itemsPerPage, orderDetails.length)} 
                                    trong tổng số {orderDetails.length} đơn hàng
                                </div>
                                <Table responsive hover>
                                    <thead>
                                        <tr>
                                            <th>Mã đơn hàng</th>
                                            <th>Ngày giao</th>
                                            <th>Phí ship</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentPageData.map((order) => (
                                            <tr key={order.OrderID}>
                                                <td>{order.OrderID}</td>
                                                <td>{formatDate(order.DeliveryDate || order.ActualDeliveryTime)}</td>
                                                <td>
                                                    {order.OrderStatus === 'Delivered' 
                                                        ? `${order.ShippingFee?.toLocaleString('vi-VN')}đ`
                                                        : '0đ'
                                                    }
                                                </td>
                                                <td>
                                                    <span className={`status-badge status-${order.OrderStatus}`}>
                                                        {getStatusText(order.OrderStatus)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </>
                        )}
                    </div>

                    {pageCount > 1 && !isLoading && (
                        <div className="pagination-wrapper">
                            <ReactPaginate
                                nextLabel="Sau ›"
                                previousLabel="‹ Trước"
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={1}
                                pageCount={pageCount}
                                onPageChange={(event) => setCurrentPage(event.selected)}
                                containerClassName="pagination"
                                pageClassName="page-item"
                                pageLinkClassName="page-link"
                                previousClassName="page-item"
                                previousLinkClassName="page-link"
                                nextClassName="page-item"
                                nextLinkClassName="page-link"
                                breakClassName="page-item"
                                breakLinkClassName="page-link"
                                activeClassName="active"
                                forcePage={currentPage}
                            />
                        </div>
                    )}
                </div>
            </Modal.Body>
        </Modal>
    );
  };

  return (
    <div className="revenue-container">
      <h1 className="revenue-title">Doanh Thu</h1>
      
      {/* Date filter section */}
      <div className="date-filter-section">
        <div className="date-filter-container">
          <div className="date-input-group">
            <label>Từ ngày</label>
            <input
              type="date"
              className="date-input"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
            />
          </div>
          <div className="date-input-group">
            <label>Đến ngày</label>
            <input
              type="date"
              className="date-input"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
            />
          </div>
          <button className="btn-filter btn-search" onClick={filterOrdersByDate}>
            Tìm kiếm
          </button>
          <button className="btn-filter btn-reset" onClick={resetFilter}>
            Đặt lại
          </button>
        </div>
              </div>

      {/* Main statistics */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">
              {filteredOrders.length > 0 ? filteredOrders.length : orders.length}
            </div>
            <div className="stat-label">Tổng Số Đơn Hàng</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{formatCurrency(totalRevenue)}</div>
            <div className="stat-label">Tổng Doanh Thu</div>
              </div>
            </div>
          </div>

      {/* Delivery statistics */}
      <div className="delivery-stats-section">
        <h2 className="delivery-stats-title">Thống Kê Giao Hàng</h2>
        <div className="delivery-stats-grid">
          <div className="delivery-stat-card success">
            <div className="delivery-stat-value">{deliveryStats.successfulOrders}</div>
            <div className="delivery-stat-label">Đơn Thành Công</div>
            <div className="delivery-stat-rate">{deliveryStats.successRate}</div>
            <button 
              className="btn-details"
              onClick={() => handleShowDetails('success')}
            >
              Xem chi tiết
            </button>
          </div>
          <div className="delivery-stat-card failed">
            <div className="delivery-stat-value">{deliveryStats.failedOrders}</div>
            <div className="delivery-stat-label">Đơn Thất Bại</div>
            <div className="delivery-stat-rate">{deliveryStats.failureRate}</div>
            <button 
              className="btn-details"
              onClick={() => handleShowDetails('failed')}
            >
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-container">
        <div className="chart-card">
          <h2 className="chart-title">Phí Vận Chuyển Theo Tháng</h2>
          <div className="chart-container">
            <canvas ref={barChartRef}></canvas>
              </div>
            </div>
        <div className="chart-card">
          <h2 className="chart-title">Tổng Quan Đơn Hàng</h2>
          <div className="chart-container">
            <canvas ref={pieChartRef}></canvas>
          </div>
        </div>
      </div>

      {/* Add Modal component */}
      <OrderDetailsModal />
    </div>
  );
};

const styles = `
  .form-group {
    margin-bottom: 0;
  }
  
  .form-control {
    border-radius: 8px;
    border: 1px solid #ced4da;
  }
  
  .form-control:focus {
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  }
  
  .btn {
    height: 38px;
    border-radius: 8px;
  }
  
  .date-filter-container {
    background-color: #f8f9fa;
    border-radius: 10px;
    padding: 15px;
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #dee2e6;
  }

  .pagination {
    margin: 0;
    display: flex;
    padding-left: 0;
    list-style: none;
    gap: 5px;
  }

  .page-item {
    margin: 0 2px;
  }

  .page-link {
    position: relative;
    display: block;
    padding: 0.5rem 0.75rem;
    line-height: 1.25;
    color: #007bff;
    background-color: #fff;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    transition: all 0.3s ease;
  }

  .page-link:hover {
    z-index: 2;
    color: #0056b3;
    text-decoration: none;
    background-color: #e9ecef;
    border-color: #dee2e6;
  }

  .page-item.active .page-link {
    z-index: 3;
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
  }

  .page-item.disabled .page-link {
    color: #6c757d;
    pointer-events: none;
    cursor: auto;
    background-color: #fff;
    border-color: #dee2e6;
  }

  .table-container {
    max-height: 400px;
    overflow-y: auto;
    margin-bottom: 0;
  }

  .modal-body {
    padding: 20px;
    display: flex;
    flex-direction: column;
  }
`;

export default Revenue;