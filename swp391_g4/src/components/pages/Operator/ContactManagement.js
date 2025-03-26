import React, { useState, useEffect } from "react";
import axios from "axios";
import HeaderOperator from "./HeaderOperator";
import "../../../styles/ContactManagement.css";

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [message, setMessage] = useState("");
  const [activeTable, setActiveTable] = useState("pending"); // Trạng thái để chuyển đổi giữa 2 bảng
  const [selectedDetailContact, setSelectedDetailContact] = useState(null); // Trạng thái để hiển thị popup chi tiết

  // Lấy danh sách liên hệ khi component được mount
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/contact/list");
      if (response.data.success) {
        setContacts(response.data.contacts);
      } else {
        setMessage("Không thể lấy danh sách liên hệ: " + response.data.message);
      }
    } catch (error) {
      setMessage(
        "Lỗi khi lấy danh sách liên hệ: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleResolve = async (contactId) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/contact/resolve/${contactId}`,
        { responseMessage }
      );
      if (response.data.success) {
        setMessage("Phản hồi thành công!");
        setSelectedContact(null);
        setResponseMessage("");
        fetchContacts(); // Cập nhật lại danh sách
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage(
        "Lỗi khi gửi phản hồi: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleClosePopup = () => {
    setSelectedContact(null);
    setResponseMessage("");
  };

  const handleCloseDetailPopup = () => {
    setSelectedDetailContact(null);
  };

  // Lọc danh sách liên hệ theo trạng thái
  const pendingContacts = contacts.filter(
    (contact) => contact.status === "Pending"
  );
  const resolvedContacts = contacts.filter(
    (contact) => contact.status === "Resolved"
  );

  return (
    <div>
      {/* Thêm HeaderOperator */}
      <div className="contact-management-header">
        <HeaderOperator />
      </div>

      {/* Tiêu đề trang */}
      <div
        className="contact-management-namepage"
        style={{ marginTop: "30px", color: "#2c6e2f" }}
      >
        <h1>Quản lý liên hệ</h1>
      </div>

      {/* Nội dung chính */}
      <div className="contact-management-container" style={{ padding: "20px" }}>
        {/* Thông báo */}
        {message && (
          <p
            className="contact-management-message"
            style={{
              color: message.includes("thành công") ? "green" : "red",
            }}
          >
            {message}
          </p>
        )}

        {/* Nút chuyển đổi giữa 2 bảng */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <button
            className={`contact-management-detail-button ${
              activeTable === "pending" ? "active" : ""
            }`}
            onClick={() => setActiveTable("pending")}
          >
            Chưa duyệt
          </button>
          <button
            className={`contact-management-detail-button ${
              activeTable === "resolved" ? "active" : ""
            }`}
            onClick={() => setActiveTable("resolved")}
          >
            Đã duyệt
          </button>
        </div>

        {/* Bảng "Chưa duyệt" */}
        {activeTable === "pending" && (
          <div>
            <h2>Danh sách liên hệ chưa duyệt</h2>
            <table className="contact-management-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Tin nhắn</th>
                  <th>Ngày tạo</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {pendingContacts.length > 0 ? (
                  pendingContacts.map((contact) => (
                    <tr key={contact.id}>
                      <td>{contact.id}</td>
                      <td>{contact.name}</td>
                      <td>{contact.email}</td>
                      <td>{contact.phone}</td>
                      <td>{contact.message}</td>
                      <td>{new Date(contact.created_at).toLocaleString()}</td>
                      <td>{contact.status}</td>
                      <td>
                        <button
                          className="contact-management-detail-button"
                          onClick={() => setSelectedContact(contact)}
                        >
                          Xử lý
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                      Không có liên hệ chưa duyệt
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Bảng "Đã duyệt" */}
        {activeTable === "resolved" && (
          <div>
            <h2>Danh sách liên hệ đã duyệt</h2>
            <table className="contact-management-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Tin nhắn</th>
                  <th>Ngày tạo</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {resolvedContacts.length > 0 ? (
                  resolvedContacts.map((contact) => (
                    <tr key={contact.id}>
                      <td>{contact.id}</td>
                      <td>{contact.name}</td>
                      <td>{contact.email}</td>
                      <td>{contact.phone}</td>
                      <td>{contact.message}</td>
                      <td>{new Date(contact.created_at).toLocaleString()}</td>
                      <td>{contact.status}</td>
                      <td>
                        <button
                          className="contact-management-detail-button"
                          onClick={() => setSelectedDetailContact(contact)}
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                      Không có liên hệ đã duyệt
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Popup xử lý liên hệ */}
        {selectedContact && (
          <div className="contact-management-popup-overlay">
            <div
              className="contact-management-form-container"
              style={{ width: "100%", maxWidth: "700px" }}
            >
              <h3 style={{ marginBottom: "15px" }}>
                Phản hồi liên hệ: {selectedContact.name}
              </h3>
              <p style={{ marginBottom: "10px" }}>
                <strong>Email:</strong> {selectedContact.email}
              </p>
              <p style={{ marginBottom: "10px" }}>
                <strong>Tin nhắn:</strong> {selectedContact.message}
              </p>
              <div className="contact-management-form-group">
                <textarea
                  className="contact-management-textarea"
                  placeholder="Nhập nội dung phản hồi..."
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                />
              </div>
              <div
                className="contact-management-form-buttons"
                style={{ marginTop: "20px" }}
              >
                <button
                  className="contact-management-detail-button contact-management-confirm-button"
                  onClick={() => handleResolve(selectedContact.id)}
                >
                  Gửi phản hồi
                </button>
                <button
                  className="contact-management-detail-button contact-management-cancel-button"
                  onClick={handleClosePopup}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Popup chi tiết phản hồi */}
        {selectedDetailContact && (
          <div className="contact-management-popup-overlay">
            <div
              className="contact-management-form-container"
              style={{ width: "100%", maxWidth: "700px" }}
            >
              <h3 style={{ marginBottom: "15px" }}>
                Chi tiết liên hệ: {selectedDetailContact.name}
              </h3>
              <p style={{ marginBottom: "10px" }}>
                <strong>Email:</strong> {selectedDetailContact.email}
              </p>
              <p style={{ marginBottom: "10px" }}>
                <strong>Số điện thoại:</strong> {selectedDetailContact.phone}
              </p>
              <p style={{ marginBottom: "10px" }}>
                <strong>Tin nhắn:</strong> {selectedDetailContact.message}
              </p>
              <p style={{ marginBottom: "10px" }}>
                <strong>Ngày tạo:</strong>{" "}
                {new Date(selectedDetailContact.created_at).toLocaleString()}
              </p>
              <p style={{ marginBottom: "10px" }}>
                <strong>Phản hồi:</strong>{" "}
                {selectedDetailContact.Response || "Chưa có phản hồi"}
              </p>
              <div
                className="contact-management-form-buttons"
                style={{ marginTop: "20px" }}
              >
                <button
                  className="contact-management-detail-button contact-management-cancel-button"
                  onClick={handleCloseDetailPopup}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactManagement;