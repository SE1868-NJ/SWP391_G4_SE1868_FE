import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../styles/ReportIssue.css";
import axios from "axios";
import { Header } from "../header/Header";
import Footer from "../footer/Footer";

const ReportIssue = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [shipperId, setShipperId] = useState(null);
  const [reportType, setReportType] = useState(""); // Loại báo cáo: order hoặc shipper
  const location = useLocation();

  const [report, setReport] = useState({
    orderId: "",
    incidentCategory: "",
    description: "",
  });

  // Lấy shipperId từ API khi component mount
  useEffect(() => {
    const fetchShipperId = async () => {
      try {
        const response = await axios.get("/api/getShipperId", { withCredentials: true });
        if (response.data.success) {
          setShipperId(response.data.shipperId);
        }
      } catch (error) {
        console.error("Lỗi lấy shipperId:", error);
      }
    };
    fetchShipperId();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const idFromURL = queryParams.get("ID");
    if (idFromURL) {
      setShipperId(idFromURL);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport({ ...report, [name]: value });
  };

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
    setReport({ orderId: "", incidentCategory: "", description: "" }); // Reset form khi đổi loại báo cáo
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (reportType === "order") {
        const response = await axios.post("http://localhost:5000/api/reports/order", { ...report, shipperId });
        if (response.data.success) {
          setIsSubmitted(true);
          setTimeout(() => setIsSubmitted(false), 3000);
        }
      } else if (reportType === "shipper") {
        if (!shipperId) {
          console.error("Không thể gửi báo cáo do thiếu shipperId");
          return;
        }
        const response = await axios.post("http://localhost:5000/api/reports/shipper", { ...report, shipperId });
        if (response.data.success) {
          setIsSubmitted(true);
          setTimeout(() => setIsSubmitted(false), 3000);
        }
      }
    } catch (error) {
      console.error("Lỗi gửi báo cáo:", error);
    }
  };

  return (
    <div className="report-page">
      <header className="full-width-header">
        <Header />
      </header>
      <div className="report-container-wrapper">
        <div className="report-container">
          <h2>Báo cáo Sự cố</h2>
          <p><strong>ID Shipper:</strong> {shipperId || "Không có ID"}</p>
          {isSubmitted && <p className="success-msg">Báo cáo đã được gửi!</p>}

          {!reportType ? (
            <div className="report-type-selection">
              <label>Chọn loại báo cáo:</label>
              <select value={reportType} onChange={handleReportTypeChange} required>
                <option value="">Chọn loại báo cáo</option>
                <option value="order">Báo cáo sự cố đơn hàng</option>
                <option value="shipper">Shipper báo cáo sự cố với Admin</option>
              </select>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="report-form">
              {reportType === "order" && (
                <>
                  <label>Mã đơn hàng:</label>
                  <input
                    type="text"
                    name="orderId"
                    value={report.orderId}
                    onChange={handleChange}
                    required
                    placeholder="Nhập mã đơn hàng"
                  />
                </>
              )}

              <label>Danh mục sự cố:</label>
              <select
                name="incidentCategory"
                value={report.incidentCategory}
                onChange={handleChange}
                required
              >
                <option value="">Chọn danh mục</option>
                {reportType === "order" ? (
                  <>
                    <option value="Vấn đề về địa chỉ">Vấn đề về địa chỉ</option>
                    <option value="Sai sản phẩm">Sai sản phẩm</option>
                    <option value="Giao hàng trễ">Giao hàng trễ</option>
                    <option value="Hư hỏng sản phẩm">Hư hỏng sản phẩm</option>
                    <option value="Khác">Khác</option>
                  </>
                ) : (
                  <>
                    <option value="Hỏng phương tiện">Hỏng phương tiện</option>
                    <option value="Tai nạn giao thông">Tai nạn giao thông</option>
                    <option value="Mất tài sản">Mất tài sản</option>
                    <option value="Tai nạn do đối tác">Tai nạn do đối tác</option>
                    <option value="Khác">Khác</option>
                  </>
                )}
              </select>

              <label>Mô tả chi tiết:</label>
              <textarea
                name="description"
                value={report.description}
                onChange={handleChange}
                required
                placeholder="Mô tả sự cố..."
              ></textarea>

              <button type="submit" className="submit-btn">Gửi báo cáo</button>
              <button
                type="button"
                className="back-btn"
                onClick={() => setReportType("")}
              >
                Quay lại
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReportIssue;