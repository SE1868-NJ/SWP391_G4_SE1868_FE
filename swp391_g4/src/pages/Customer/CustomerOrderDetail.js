import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/CustomerOrderDetail.css";

const CustomerOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(0); // Đánh giá từ 1-5 sao
  const [feedback, setFeedback] = useState(""); // Feedback
  const [existingRating, setExistingRating] = useState(null); // Đánh giá hiện tại
  const [ratingError, setRatingError] = useState(""); // Lỗi khi gửi đánh giá

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/customer/login");
          return;
        }

        const response = await axios.get(`http://localhost:4000/api/customer/order/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setOrder(response.data.order);
        } else {
          setError(response.data.message || "Không thể tải chi tiết đơn hàng");
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết đơn hàng:", err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("customerId");
          localStorage.removeItem("customerName");
          navigate("/customer/login");
        } else {
          setError("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchOrderRating = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:4000/api/customer/order/${orderId}/rating`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setExistingRating(response.data.rating);
        }
      } catch (err) {
        console.error("Lỗi khi lấy đánh giá:", err);
      }
    };

    fetchOrderDetails();
    fetchOrderRating();
  }, [orderId, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    const roundedAmount = Math.floor(amount || 0);
    const formattedAmount = roundedAmount.toLocaleString("vi-VN");
    return `${formattedAmount}đ`;
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleSubmitRating = async () => {
    if (rating < 1 || rating > 5) {
      setRatingError("Vui lòng chọn số sao từ 1 đến 5");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:4000/api/customer/order/${orderId}/rating`,
        { orderId, rating, feedback },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setExistingRating({ rating, feedback, createdAt: new Date() });
        setRating(0);
        setFeedback("");
        setRatingError("");
      } else {
        setRatingError(response.data.message || "Không thể gửi đánh giá");
      }
    } catch (err) {
      console.error("Lỗi khi gửi đánh giá:", err);
      setRatingError("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`customer-orderdetail-star ${index < rating ? "customer-orderdetail-filled" : ""}`}
      >
        ★
      </span>
    ));
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="customer-orderdetail-error-message">{error}</p>;
  if (!order) return <p>Không tìm thấy đơn hàng.</p>;

  return (
    <div className="customer-orderdetail-container">
      <div className="customer-orderdetail-header">
        <button className="customer-orderdetail-back-button" onClick={() => navigate("/customer/orders")}>
          <i className="fas fa-arrow-left"></i> Quay lại Đơn Hàng
        </button>
        <div className="customer-orderdetail-header-content">
          <h1>Đơn Hàng #{order.orderId}</h1>
          <p>
            <span role="img" aria-label="calendar">🗓️</span> Đặt hàng vào {formatDate(order.orderDate)} •{" "}
            <span className={`customer-orderdetail-order-status ${order.orderStatus.toLowerCase()}`}>
              {order.orderStatus === "Pending"
                ? "Đang Chờ"
                : order.orderStatus === "InProgress"
                ? "Đang Xử Lý"
                : order.orderStatus === "Delivered"
                ? "Đã Giao"
                : "Đã Hủy"}
            </span>
          </p>
        </div>
      </div>

      <div className="customer-orderdetail-main-content">
        <div className="customer-orderdetail-left-column">
          <div className="customer-orderdetail-order-status-section">
            <h2>Trạng Thái Đơn Hàng</h2>
            <div className="customer-orderdetail-status-timeline">
              <div className={`customer-orderdetail-status-item ${order.orderStatus !== "Cancelled" ? "customer-orderdetail-completed" : ""}`}>
                <span role="img" aria-label="box">📦</span>
                <p>Đơn Hàng Đặt: {formatDate(order.orderDate)}</p>
              </div>
              <div className={`customer-orderdetail-status-item ${order.orderStatus === "InProgress" || order.orderStatus === "Delivered" ? "customer-orderdetail-completed" : ""}`}>
                <span role="img" aria-label="truck">🚚</span>
                <p>Đang Giao: {order.estimatedDeliveryTime ? formatDate(order.estimatedDeliveryTime) : "Chưa xác định"}</p>
              </div>
              <div className={`customer-orderdetail-status-item ${order.orderStatus === "Delivered" ? "customer-orderdetail-completed" : ""}`}>
                <span role="img" aria-label="check">✅</span>
                <p>Đã Giao: {order.actualDeliveryTime ? formatDate(order.actualDeliveryTime) : "Đang chờ giao"}</p>
              </div>
            </div>
          </div>

          <div className="customer-orderdetail-order-items-section">
            <h2>Sản Phẩm Đặt Hàng</h2>
            {Array.isArray(order.products) && order.products.length > 0 ? (
              order.products.map((product, index) => (
                <div key={index} className="customer-orderdetail-order-item">
                  <div className="customer-orderdetail-order-item-details">
                    <p>
                      <span role="img" aria-label="package">📦</span> {product.ProductName || "Không có tên sản phẩm"}
                    </p>
                    <p>Số lượng: {product.Quantity || 0}</p>
                    <p>{formatCurrency(product.Price)}</p>
                  </div>
                  <div className="customer-orderdetail-order-item-total">
                    <p>{formatCurrency((product.Quantity || 0) * (product.Price || 0))}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>Không có sản phẩm trong đơn hàng.</p>
            )}
          </div>

          <div className="customer-orderdetail-delivery-info-section">
            <h2>Thông Tin Giao Hàng</h2>
            <p>
              <span role="img" aria-label="location">📍</span> Địa Chỉ Giao Hàng: {order.deliveryAddress}
            </p>
            <p>
              <span role="img" aria-label="location">📍</span> Địa Chỉ Cửa Hàng: {order.shopAddress}
            </p>
          </div>
        </div>

        <div className="customer-orderdetail-right-column">
          {(order.orderStatus === "InProgress" || order.orderStatus === "Delivered") && order.shipper && (
            <div className="customer-orderdetail-shipper-info-section">
              <h2>Thông Tin Shipper</h2>
              <p>
                <span role="img" aria-label="person">👤</span> Tên: {order.shipper.FullName}
              </p>
              <p>
                <span role="img" aria-label="phone">📞</span> Số Điện Thoại: {order.shipper.PhoneNumber}
              </p>
              <p>
                <span role="img" aria-label="vehicle">🛵</span> Phương Tiện: {order.shipper.VehicleType}
              </p>
            </div>
          )}

          <div className="customer-orderdetail-payment-summary-section">
            <h2>Tổng Thanh Toán</h2>
            <div className="customer-orderdetail-payment-summary-item">
              <p>Tổng Tiền Hàng</p>
              <p>{formatCurrency(order.subtotal)}</p>
            </div>
            <div className="customer-orderdetail-payment-summary-item">
              <p>Phí Vận Chuyển</p>
              <p>{formatCurrency(order.shippingFee)}</p>
            </div>
            <div className="customer-orderdetail-payment-summary-item customer-orderdetail-total">
              <p><strong>TỔNG CỘNG</strong></p>
              <p><strong>{formatCurrency(order.totalAmount)}</strong></p>
            </div>
          </div>

          {order.orderStatus === "Delivered" && (
            <div className="customer-orderdetail-rating-section">
              <h2>Đánh Giá Shipper</h2>
              {existingRating ? (
                <div className="customer-orderdetail-existing-rating">
                  <p>
                    <strong>Đánh giá của bạn:</strong>{" "}
                    <span className="customer-orderdetail-star-rating">{renderStars(existingRating.rating)}</span>
                  </p>
                  {existingRating.feedback && (
                    <p>
                      <strong>Nhận xét:</strong>{" "}
                      <span className="customer-orderdetail-feedback-text">{existingRating.feedback}</span>
                    </p>
                  )}
                  <p>
                    <strong>Thời gian đánh giá:</strong>{" "}
                    <span className="customer-orderdetail-feedback-text">{formatDate(existingRating.createdAt)}</span>
                  </p>
                </div>
              ) : (
                <div className="customer-orderdetail-rating-form">
                  <div className="customer-orderdetail-star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`customer-orderdetail-star ${rating >= star ? "customer-orderdetail-filled" : ""}`}
                        onClick={() => handleRatingChange(star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  {ratingError && <p className="customer-orderdetail-error-message">{ratingError}</p>}
                  <textarea
                    placeholder="Nhập nhận xét của bạn (không bắt buộc)"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows="3"
                  />
                  <button className="customer-orderdetail-submit-rating-button" onClick={handleSubmitRating}>
                    Gửi Đánh Giá
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderDetail;