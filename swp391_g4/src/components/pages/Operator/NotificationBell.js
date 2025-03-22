import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react'; // Giữ lại biểu tượng X cho nút đóng
import '../../../styles/NotificationBell.css';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

useEffect(() => {
    const interval = setInterval(fetchNotifications, 4000); // Gọi API mỗi 5 giây
    return () => clearInterval(interval); // Xóa interval khi component unmount
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/admin-notifications');
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.notifications.filter(n => !n.IsRead).length);
    } catch (err) {
      console.error('Lỗi khi lấy thông báo:', err);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('http://localhost:4000/api/admin-notifications/mark-all-read');
      setNotifications(notifications.map(n => ({ ...n, IsRead: 1 })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Lỗi khi đánh dấu tất cả đã đọc:', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:4000/api/admin-notifications/${id}/read`);
      setNotifications(notifications.map(notif =>
        notif.AdminNotificationID === id ? { ...notif, IsRead: 1 } : notif
      ));
      setUnreadCount(unreadCount - 1);
    } catch (err) {
      console.error('Lỗi khi đánh dấu thông báo:', err);
    }
  };

  return (
    <div className="notification-bell-container">
      <button className="notification-bell" onClick={toggleNotifications}>
        🔔 {/* Thay <Bell /> bằng emoji */}
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>
      {showNotifications && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Thông Báo</h3>
            <div className="notification-actions">
              <span onClick={markAllAsRead} className="mark-all-read">Đánh dấu tất cả đã đọc</span>
              <X size={16} onClick={toggleNotifications} className="close-button" />
            </div>
          </div>
          <ul className="notification-list">
            {notifications.length === 0 ? (
              <li className="notification-item">Không có thông báo nào.</li>
            ) : (
              notifications.map(notif => (
                <li
                  key={notif.AdminNotificationID}
                  className={`notification-item ${notif.IsRead ? 'read' : 'unread'}`}
                >
                  <div className="notification-content">
                    <strong>{notif.Title}</strong>
                    <p>{notif.Message}</p>
                    <span className="timestamp">{new Date(notif.CreatedAt).toLocaleString('vi-VN')}</span>
                  </div>
                  {!notif.IsRead && (
                    <button onClick={() => markAsRead(notif.AdminNotificationID)}>
                      Đánh dấu đã đọc
                    </button>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;