import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../../styles/CustomerLogin.css";

const CustomerLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Kiểm tra token khi component mount
  useEffect(() => {
    // const token = localStorage.getItem("token");
    // if (token) {
      // try {
        // const decodedToken = jwtDecode(token);
        // const currentTime = Date.now() / 1000;
        // if (decodedToken.exp > currentTime && decodedToken.customerId) {
          //Nếu token hợp lệ và là token của customer, chuyển hướng tới dashboard
          // navigate("/customer/orders");
        // }
      // } catch (decodeError) {
       // Nếu token không hợp lệ, xóa token
        // localStorage.removeItem("token");
        // localStorage.removeItem("customerId");
        // localStorage.removeItem("customerName");
      // }
    // }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/customer/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // Lưu thông tin customer vào localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("customerName", response.data.customer.FullName);
        localStorage.setItem("customerId", response.data.customer.CustomerID);

        // Chuyển hướng tới trang order trackingtracking của customer
        navigate("/customer/orders");
      } else {
        setError(response.data.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      if (error.response) {
        setError(
          error.response.data.message ||
            "Đăng nhập thất bại. Vui lòng thử lại sau."
        );
      } else if (error.request) {
        setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
      } else {
        setError("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Đăng Nhập Khách Hàng</h1>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          className="login-input"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          className="login-input"
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button className="login-button" type="submit" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
        </button>
      </form>
      {error && <p className="login-error">{error}</p>}
    </div>
  );
};

export default CustomerLogin;