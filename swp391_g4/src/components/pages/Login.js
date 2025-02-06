import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Kiểm tra dữ liệu đầu vào
    if (!formData.email || !formData.password) {
      setError("Vui lòng điền đầy đủ email và mật khẩu.");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending login data:", formData);

      const response = await axios.post(
        "http://localhost:5000/api/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Login response:", response.data);

      if (response.data.success) {
        localStorage.setItem("shipperName", response.data.shipper.FullName);
        localStorage.setItem("shipperId", response.data.shipper.ShipperID);

        navigate("/shipper");
      } else {
        setError(response.data.message || "Đăng nhập thất bại.");
      }
    } catch (error) {
      console.error("Login error:", error);
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
      <h1 className="login-title">Đăng nhập</h1>

      <form className="login-form" onSubmit={handleLogin}>
        {/* Email input */}
        <input
          className="login-input"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Password input */}
        <input
          className="login-input"
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* Login button */}
        <button
          className="login-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      {/* Hiển thị thông báo lỗi */}
      {error && <p className="login-error">{error}</p>}

      {/* Các liên kết khác */}
      <div className="login-links">
        <button
          className="login-transparent-button"
          onClick={() => navigate("/forgot-password")}
        >
          Quên mật khẩu?
        </button>
        <button
          className="login-transparent-button"
          onClick={() => navigate("/register")}
        >
          Đăng ký
        </button>
      </div>
    </div>
  );
};
export default Login; 