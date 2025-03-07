import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/AdminReportHandling.css";
import { Header } from "../header/Header";
import Footer from "../footer/Footer";

const AdminReportHandling = () => {
  const [orderReports, setOrderReports] = useState([]);
  const [shipperReports, setShipperReports] = useState([]);
  const [updatedStatus, setUpdatedStatus] = useState({});
  const [activeTab, setActiveTab] = useState("order"); // Thêm state để theo dõi tab đang hiển thị

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  };

  useEffect(() => {
    fetchOrderReports();
    fetchShipperReports();
  }, []);

  const fetchOrderReports = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/order-reports");
      setOrderReports(response.data.orderReports);
    } catch (error) {
      console.error("Error fetching order reports:", error);
    }
  };

  const fetchShipperReports = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/shipper-reports");
      setShipperReports(response.data.shipperReports);
    } catch (error) {
      console.error("Error fetching shipper reports:", error);
    }
  };

  const handleStatusChange = (reportId, status) => {
    setUpdatedStatus((prev) => ({ ...prev, [reportId]: status }));
  };

  const updateStatus = async (reportId) => {
    if (!updatedStatus[reportId]) return;
    try {
      await axios.put(`http://localhost:4000/api/reports/${reportId}`, {
        status: updatedStatus[reportId],
        processedDate: new Date().toISOString().split("T")[0],
      });
      fetchOrderReports();
      fetchShipperReports();
    } catch (error) {
      console.error("Error updating report status:", error);
    }
  };

  return (
    <div className="admin-report-page">
      <header className="full-width-header">
        <Header />
      </header>
      <div className="report-container-wrapper">
        {/* Tab buttons */}
        <div className="report-tabs">
          <button 
            className={`tab-button ${activeTab === "order" ? "active" : ""}`}
            onClick={() => setActiveTab("order")}
          >
            Báo cáo sự cố đơn hàng
          </button>
          <button 
            className={`tab-button ${activeTab === "shipper" ? "active" : ""}`}
            onClick={() => setActiveTab("shipper")}
          >
            Báo cáo sự cố đối với shipper
          </button>
        </div>

        {/* Order reports table */}
        <div className={`report-container ${activeTab === "order" ? "active" : "hidden"}`}>
          <h2>Báo cáo sự cố đơn hàng</h2>
          <div className="table-wrapper">
            <table className="report-table">
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
                  <th>Hành động</th>
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
                      <td>{report.AdminResolutionDate ? formatDate(report.AdminResolutionDate) : "Chưa xử lý"}</td>
                      <td>
                        <select
                          value={updatedStatus[report.ReportID] || report.Status}
                          onChange={(e) => handleStatusChange(report.ReportID, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td>{report.ShipperPhoneNumber}</td>
                      <td>
                        <button onClick={() => updateStatus(report.ReportID)}>Cập nhật</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="no-data">Không có báo cáo sự cố đơn hàng</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shipper reports table */}
        <div className={`report-container ${activeTab === "shipper" ? "active" : "hidden"}`}>
          <h2>Báo cáo sự cố đối với shipper</h2>
          <div className="table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Mã sự cố</th>
                  <th>Mã shipper - Tên shipper</th>
                  <th>Loại sự cố</th>
                  <th>Mô tả</th>
                  <th>Ngày báo cáo</th>
                  <th>Ngày xử lý</th>
                  <th>Trạng thái</th>
                  <th>Liên hệ shipper</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {shipperReports.length > 0 ? (
                  shipperReports.map((report) => (
                    <tr key={report.ReportID}>
                      <td>{report.ReportID}</td>
                      <td>{report.ShipperID} - {report.ShipperName}</td>
                      <td>{report.IncidentType}</td>
                      <td>{report.Description}</td>
                      <td>{formatDate(report.ReportDate)}</td>
                      <td>{report.AdminResolutionDate ? formatDate(report.AdminResolutionDate) : "Chưa xử lý"}</td>
                      <td>
                        <select
                          value={updatedStatus[report.ReportID] || report.Status}
                          onChange={(e) => handleStatusChange(report.ReportID, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td>{report.ShipperPhoneNumber}</td>
                      <td>
                        <button onClick={() => updateStatus(report.ReportID)}>Cập nhật</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="no-data">Không có báo cáo sự cố đối với shipper</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminReportHandling;