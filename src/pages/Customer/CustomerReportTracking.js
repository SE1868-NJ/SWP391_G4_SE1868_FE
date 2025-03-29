import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/CustomerReportTracking.css";
import Footer from "../../components/footer/Footer";
import styles from "../../components/header/Header.module.css";
import { Logo } from "../../components/header/Logo";
import BackButton from "../../components/buttons/BackButton";

const CustomerReportTracking = () => {
  const navigate = useNavigate();
  const [orderReports, setOrderReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  };

  const ReportTrackingHeader = () => {
    return (
      <header className={styles.header}>
        <nav className={styles.backgroundShadow}>
          <Logo />
          <div><strong>EcoShipper</strong></div>
        </nav>
      </header>
    );
  };


  useEffect(() => {
    const fetchOrderReports = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/customer/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:4000/api/customer-order-reports",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setOrderReports(response.data.orderReports);
        } else {
          setError(response.data.message || "Không thể tải báo cáo");
        }
      } catch (err) {
        console.error("Lỗi khi tải báo cáo:", err);
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

    fetchOrderReports();
  }, [navigate]);

  return (
    <div className="report-page">
      <div>
        <ReportTrackingHeader />
      </div>
      <div className="report-container-wrapper">
        <div className="report-container">
          <h2>Sự cố đơn hàng của tôi</h2>
          {loading && <p>Đang tải...</p>}
          {error && <p className="error">{error}</p>}
          <table>
            <thead>
              <tr>
                <th>Mã sự cố</th>
                <th>Mã đơn hàng</th>
                <th>Mã shipper - Tên shipper</th>
                <th>Loại sự cố</th>
                <th>Mô tả</th>
                <th>Ngày báo cáo</th>
                <th>Ngày xử lý</th>
                <th>Trạng thái</th>
                <th>Liên hệ shipper</th>
              </tr>
            </thead>
            <tbody>
              {orderReports.length > 0 ? (
                orderReports.map((report) => (
                  <tr key={report.ReportID}>
                    <td>{report.ReportID}</td>
                    <td>{report.OrderID}</td>
                    <td>{report.ShipperID} - {report.ShipperName}</td>
                    <td>{report.IncidentType}</td>
                    <td>{report.Description}</td>
                    <td>{formatDate(report.ReportDate)}</td>
                    <td>
                      {report.AdminResolutionDate
                        ? formatDate(report.AdminResolutionDate)
                        : "Chưa xử lý"}
                    </td>
                    <td>
                      {report.Status === "In Progress" ? (
                        <span className="in-progress">Đang xử lý</span>
                      ) : report.Status === "Pending" ? (
                        <span className="pending">Chờ xử lý</span>
                      ) : report.Status === "Resolved" ? (
                        <span className="resolved">Hoàn thành</span>
                      ) : (
                        <span className="rejected">Đã từ chối</span>
                      )}
                    </td>
                    <td>{report.ShipperPhoneNumber}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-data">
                    Không có báo cáo sự cố đơn hàng
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{marginLeft: "100px"}}>
        <BackButton /></div>
      <Footer />
    </div>
  );
};

export default CustomerReportTracking;