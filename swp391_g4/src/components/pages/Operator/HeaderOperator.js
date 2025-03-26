import React from "react";
import { useNavigate } from "react-router-dom";
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
        background: "linear-gradient(to right, #18d04d, #3989d0)", // Gradient giống Header.js
        boxShadow: "0px 4px 6px -1px rgba(0, 0, 0, 0.1)", // Shadow giống Header.js
        display: "flex",
        width: "100%",
        padding: "0 48px",
        alignItems: "center",
        gap: "20px",
        overflow: "hidden",
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      {/* Phần bên trái: Logo và tiêu đề */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          className="shipper-icon-container"
          style={{
            width: "100px", // Kích thước giống logo trong Header.js
            height: "100px",
            alignSelf: "stretch",
            margin: "auto 0",
            flexShrink: 0,
            maxWidth: "100%",
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

      {/* Phần bên phải: Các button điều hướng */}
      <div className="navigation-items">
        <button
          className="nav-item"
          onClick={() => handleNavigate("/manage-shipper")}
        >
          Danh sách
        </button>
        <button
          className="nav-item"
          onClick={() => handleNavigate("/admin-report-handling")}
        >
          Sự cố
        </button>
        <button
          className="nav-item nav-item3"
          onClick={() => handleNavigate("/revenue-dashboard")}
        >
          Doanh thu
        </button>
        <button
          className="nav-item nav-item4"
          onClick={() => handleNavigate("/contact-manager")}
        >
          Liên hệ
        </button>
        <button
          className="nav-item nav-item5"
          onClick={() => handleNavigate("/contact-management")}
        >
          Tài chính
        </button>
        <button className="nav-item nav-item6" disabled>
          {/* Để trống */}
        </button>
      </div>
    </div>
  );
};

export default HeaderOperator;