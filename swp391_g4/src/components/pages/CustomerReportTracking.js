import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/CustomerReportTracking.css";
import { Header } from "../header/Header";
import Footer from "../footer/Footer";

const CustomerReportTracking = () => {
  const [orderReports, setOrderReports] = useState([]);
  const [customerId, setCustomerId] = useState(null);

  // Hàm định dạng thời gian
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  };

  useEffect(() => {
    const storedCustomerId = localStorage.getItem('customerId');
    setCustomerId(storedCustomerId);
  }, []);

  const fetchOrderReports = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/customer-order-reports?customerId=${1}`);
      setOrderReports(response.data.orderReports);
    } catch (error) {
      console.error("Error fetching order reports:", error);
    }
  };

  useEffect(() => {
    fetchOrderReports();
  }, []);

  return (
    <div className="report-page">
      <header className="full-width-header">
        <Header />
      </header>
      <div className="report-container-wrapper">
        <div className="report-container">
          <h2>Sự cố đơn hàng của tôi</h2>
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
                    <td>{formatDate(report.ReportDate)}</td> {/* Áp dụng định dạng */}
                    <td>{report.AdminResolutionDate ? formatDate(report.AdminResolutionDate) : "Chưa xử lý"}</td> {/* Áp dụng định dạng */}
                    <td>{report.Status}</td>
                    <td>{report.ShipperPhoneNumber}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-data">Không có báo cáo sự cố đơn hàng</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerReportTracking;