import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Đảm bảo đã cài đặt jwt-decode
import "../../../styles/Login.css";

const Login = ({ isPopup = false, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Kiểm tra token khi component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        
        // Kiểm tra token còn hạn không
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp > currentTime) {
          // Token còn hạn, chuyển thẳng sang trang shipper
          navigate("/shipper");
        }
      } catch (decodeError) {
        // Nếu token không hợp lệ, xóa token
        localStorage.removeItem("token");
        localStorage.removeItem("shipperId");
        localStorage.removeItem("shipperName");
      }
    }
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
        "http://localhost:4000/api/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("shipperId", response.data.shipper.ShipperID);
        localStorage.setItem("shipperName", response.data.shipper.FullName);
        navigate("/shipper");
      } else {
        setError(response.data.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      setError("Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-container ${isPopup ? "popup-mode" : ""}`}>
      <h1 className="login-title">Đăng Nhập</h1>
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
          Đăng Ký
        </button>
      </div>
    </div>
  );
};

export default Login;