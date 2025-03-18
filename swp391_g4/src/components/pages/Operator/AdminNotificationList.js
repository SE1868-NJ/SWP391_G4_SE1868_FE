import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../../styles/AdminNotificationList.css";

const AdminNotificationList = ({ onNewNotification }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/api/admin-notifications');
      setNotifications(response.data.notifications);
      setError(null);
    } catch (err) {
      setError('Không thể tải thông báo. Vui lòng thử lại.');
      console.error('Lỗi khi lấy thông báo:', err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm để thêm thông báo mới từ hành động của admin
  const addNotification = (newNotification) => {
    setNotifications(prev => [newNotification, ...prev]);
    if (onNewNotification) onNewNotification(newNotification); // Callback để thông báo lên component cha
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:4000/api/admin-notifications/${id}/read`);
      setNotifications(notifications.map(notif =>
        notif.AdminNotificationID === id ? { ...notif, IsRead: 1 } : notif
      ));
    } catch (err) {
      console.error('Lỗi khi đánh dấu thông báo:', err);
    }
  };

  return (
    <div className="notification-container">
      <h2>Thông Báo Admin</h2>
      {loading && <p>Đang tải...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && notifications.length === 0 && <p>Không có thông báo nào.</p>}
      <ul className="notification-list">
        {notifications.map(notif => (
          <li
            key={notif.AdminNotificationID}
            className={`notification-item ${notif.IsRead ? 'read' : 'unread'} ${notif.Type}`}
          >
            <div className="notification-content">
              <strong>{notif.Title}</strong>
              <p>{notif.Message}</p>
              <span className="timestamp">
                {new Date(notif.CreatedAt).toLocaleString('vi-VN')}
              </span>
            </div>
            {!notif.IsRead && (
              <button
                className="mark-read-btn"
                onClick={() => markAsRead(notif.AdminNotificationID)}
              >
                Đánh dấu đã đọc
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Export để các component khác có thể sử dụng
export default AdminNotificationList;
export const addAdminNotification = (title, message, type = 'info') => {
  const newNotification = {
    AdminNotificationID: Date.now(), // ID tạm thời, backend sẽ tạo ID thực
    Title: title,
    Message: message,
    Type: type,
    IsRead: 0,
    CreatedAt: new Date().toISOString(),
  };
  return newNotification;
};