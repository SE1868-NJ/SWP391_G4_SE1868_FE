import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../../../styles/Login.css";

const Login = ({ isPopup = false, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEscrowNotice, setShowEscrowNotice] = useState(false);
  // Kiểm tra token khi component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp > currentTime) {
          if (decodedToken.Status === "PendingDepositEscrow") {
            navigate("/escrow-deposit");
          } else if (decodedToken.Status === "Active") {
            navigate("/dashboard");
          }
        }
      } catch (decodeError) {
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
        "http://localhost:5000/api/login",  
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem('shipperName', response.data.shipper.FullName);
        localStorage.setItem('shipperId', response.data.shipper.ShipperID);
        
        if (response.data.redirectToEscrow) {
          setShowEscrowNotice(true);
        } else {
          if (isPopup && onClose) onClose();
          navigate("/dashboard");
        }
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
  const handleEscrowNoticeOk = () => {
    setShowEscrowNotice(false);
    navigate("/escrow-deposit");
  };
  return (
    <div className={`login-container ${isPopup ? 'popup-mode' : ''}`}>
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

        <button
          className="login-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
        </button>
      </form>
      {error && <p className="login-error">{error}</p>}
      {showEscrowNotice && (
      <div className="login-escrow-notice">
        <p>Số dư trong ví ký quỹ không đủ, vui lòng nạp thêm để có thể hoạt động.</p>
        <button className="login-escrow-notice-ok" onClick={handleEscrowNoticeOk}>
          Nạp tiền
        </button>
      </div>
    )}
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