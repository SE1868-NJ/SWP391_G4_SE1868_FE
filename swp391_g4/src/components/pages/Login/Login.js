import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../styles/Login.css";

const Login = ({ isPopup = false, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    if (!formData.email || !formData.password) {
      setError("Vui lòng nhập email và mật khẩu.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const status = response.data.shipper.Status;
        if (status === "Active") {
          // Lưu thông tin và chuyển hướng
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("shipperName", response.data.shipper.FullName);
          localStorage.setItem("shipperId", response.data.shipper.ShipperID);

          // Nếu là popup thì đóng popup
          if (isPopup && onClose) {
            onClose();
          }

          // Chuyển hướng đến trang shipper
          navigate("/shipper");
        } else if (status === "PendingRegister") {
          setError("Tài khoản của bạn đang được duyệt, vui lòng đợi.");
        } else if (status === "Inactive") {
          setError("Tài khoản của bạn bị vô hiệu hoá.");
        }
      } else {
        setError(response.data.message || "Đăng nhập thất bại.");
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
