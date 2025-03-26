import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../styles/CustomerOrderTracking.css";
import { Link } from "react-router-dom";

const CustomerOrderTracking = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const customerName = localStorage.getItem("customerName") || "Khách Hàng";

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/customer/login");
          return;
        }

        const response = await axios.get("http://localhost:4000/api/customer/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setOrders(response.data.orders);
          setFilteredOrders(response.data.orders); // Hiển thị tất cả đơn hàng ban đầu
        } else {
          setError(response.data.message || "Không thể tải đơn hàng");
        }
      } catch (err) {
        console.error("Lỗi khi tải đơn hàng:", err);
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

    fetchOrders();
  }, [navigate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "ALL") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.orderStatus === tab));
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("customerId");
    localStorage.removeItem("customerName");
    navigate("/home");
  };

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
    // Chuyển đổi amount thành số nguyên để loại bỏ phần thập phân không cần thiết
    const roundedAmount = Math.floor(amount);
    // Định dạng số với dấu chấm phân cách hàng nghìn
    const formattedAmount = roundedAmount.toLocaleString("vi-VN");
    // Thêm ký hiệu "đ" để đảm bảo hiển thị đúng
    return `${formattedAmount}đ`;
  };

  return (
    <div className="order-tracking-container">
      <div className="order-tracking-header">
        <h1 className="order-tracking-title">Đơn Hàng Của Tôi</h1>
        <p className="order-tracking-welcome">Chào mừng trở lại, {customerName}</p>
        <Link to="/customer-report-tracking" className="order-tracking-button">
          Xem Sự Cố Của Tôi
        </Link>
        <button className="order-tracking-signout" onClick={handleSignOut}>
          Đăng Xuất
        </button>
      </div>

      <div className="order-tracking-tabs">
        <button
          className={`order-tab ${activeTab === "ALL" ? "active" : ""}`}
          onClick={() => handleTabChange("ALL")}
        >
          Tất Cả
        </button>
        <button
          className={`order-tab ${activeTab === "Pending" ? "active" : ""}`}
          onClick={() => handleTabChange("Pending")}
        >
          Đang Chờ
        </button>
        <button
          className={`order-tab ${activeTab === "InProgress" ? "active" : ""}`}
          onClick={() => handleTabChange("InProgress")}
        >
          Đang Xử Lý
        </button>
        <button
          className={`order-tab ${activeTab === "Delivered" ? "active" : ""}`}
          onClick={() => handleTabChange("Delivered")}
        >
          Đã Giao
        </button>
      </div>

      {loading && <p className="order-tracking-loading">Đang tải...</p>}
      {error && <p className="order-tracking-error">{error}</p>}

      <div className="order-tracking-list">
        {filteredOrders.length === 0 && !loading && (
          <p className="order-tracking-empty">Không có đơn hàng nào.</p>
        )}
        {filteredOrders.map((order) => (
          <div key={order.orderId} className="order-card">
            <div className="order-card-header">
              <h2 className="order-card-title">Đơn Hàng #{order.orderId}</h2>
              <span
                className={`order-status ${
                  order.orderStatus === "Delivered"
                    ? "status-delivered"
                    : order.orderStatus === "Pending"
                    ? "status-pending"
                    : order.orderStatus === "InProgress"
                    ? "status-inprogress"
                    : "status-cancelled"
                }`}
              >
                {order.orderStatus === "Delivered"
                  ? "Đã Giao"
                  : order.orderStatus === "Pending"
                  ? "Đang Chờ"
                  : order.orderStatus === "InProgress"
                  ? "Đang Xử Lý"
                  : "Đã Hủy"}
              </span>
            </div>
            <p className="order-card-date">
              <span role="img" aria-label="calendar">🗓️</span> Đặt hàng vào{" "}
              {formatDate(order.orderDate)}
            </p>
            <p className="order-card-address">
              <span role="img" aria-label="location">📍</span>{" "}
              {order.deliveryAddress}
            </p>
            <p className="order-card-products">
              <span role="img" aria-label="products">🛍️</span> Sản phẩm:{" "}
              {order.productNames.length > 0
                ? order.productNames.join(", ")
                : "Không có sản phẩm"}
            </p>
            <p className="order-card-fee">
              <span role="img" aria-label="box">📦</span> Phí Vận Chuyển{" "}
              {formatCurrency(order.shippingFee)}
            </p>
            <button
              className="order-card-details"
              onClick={() => navigate(`/customer/order/${order.orderId}`)}
            >
              Xem Chi Tiết Đơn Hàng
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerOrderTracking;