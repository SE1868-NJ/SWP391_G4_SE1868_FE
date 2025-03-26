import React from "react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell"; // Import NotificationBell
import "./HeaderOperator.css"; // Import file CSS

const HeaderOperator = () => {
  const navigate = useNavigate();

  // Hàm xử lý điều hướng cho từng button
  const handleNavigate = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div
      className="shipper-header"
      style={{
        height: "100px",
        background: "linear-gradient(to right, #18d04d, #3989d0)",
        boxShadow: "0px 4px 6px -1px rgba(0, 0, 0, 0.1)",
        display: "flex",
        width: "100%",
        padding: "0 48px",
        alignItems: "center",
        justifyContent: "space-between", // Đảm bảo các phần tử được phân bố đều
      }}
    >
      {/* Phần bên trái: Logo và tiêu đề */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          className="shipper-icon-container"
          style={{
            width: "100px",
            height: "100px",
            alignSelf: "stretch",
            flexShrink: 0,
            marginLeft: "50px",
          }}
        >
          <img
            src="https://useless-gold-stingray.myfilebase.com/ipfs/QmdjqTuFUF1yeoPh8GBh3SP5hegdQ16fasvUEVxYtaoBoR"
            alt="Operator Icon"
            className="shipper-icon"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
            }}
          />
        </div>
        <div style={{ marginLeft: "1rem" }}>
          <h1
            className="shipper-title"
            style={{
              fontSize: "1.5rem",
              color: "white",
              fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
              fontWeight: 500,
            }}
          >
            Operator
          </h1>
          <p
            className="shipper-subtitle"
            style={{
              color: "white",
              fontSize: "0.9rem",
              fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
              fontWeight: 500,
            }}
          >
            <strong>Hoạt động của Operator</strong>
          </p>
        </div>
      </div>

      {/* Phần giữa: Các button điều hướng */}
      <div
        className="navigation-items"
        style={{
          display: "flex",
          gap: "20px",
          flexGrow: 1, // Cho phép phần này mở rộng để căn giữa
          justifyContent: "center", // Căn giữa các button
        }}
      >
        <button
          className="nav-item"
          onClick={() => handleNavigate("/manage-shipper")}
        >
          Danh sách
        </button>
        <button
          className="nav-item"
          onClick={() => handleNavigate("/incident-management")}
        >
          Sự cố
        </button>
        <button
          className="nav-item"
          onClick={() => handleNavigate("/revenue-dashboard")}
        >
          Doanh thu
        </button>
        <button
          className="nav-item"
          onClick={() => handleNavigate("/contact-management")}
        >
          Liên hệ
        </button>
        <button
          className="nav-item"
          onClick={() => handleNavigate("/shipper-bonus-list")}
        >
          Tài chính
        </button>
        <button className="nav-item" disabled>
          {/* Để trống */}
        </button>
      </div>

      {/* Phần bên phải: Chuông thông báo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginRight: "50px", // Tạo khoảng cách bên phải cho cân đối
        }}
      >
        <NotificationBell />
      </div>
    </div>
  );
};

export default HeaderOperator;