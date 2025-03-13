"use client";
import React from "react";
import styles from "./Header.module.css";
import { NavigationItem } from "./NavigationItem";
import { Logo } from "./Logo";
import { AuthButton } from "./AuthButton";
import axios from "axios";
import { format } from "date-fns";

export class Header extends React.Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem("token");
    this.state = {
      showLoginButton: !token,
      showDropdownButton: !!token,
      isDropdownOpen: false,
      shipperName: localStorage.getItem("shipperName") || "Shipper",
      notifications: [],
      unreadCount: 0,
      showNotificationModal: false,
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    const shipperId = localStorage.getItem("shipperId");

    if (token && shipperId) {
      this.fetchNotifications(shipperId);

      // Set up polling for notifications
      this.notificationInterval = setInterval(() => {
        this.fetchNotifications(shipperId);
      }, 60000); // Check notifications every minute

      // Add click outside listener
      document.addEventListener("click", this.handleClickOutside);
    }
  }

  componentWillUnmount() {
    // Clear interval and remove event listener
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval);
    }
    document.removeEventListener("click", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    // Close dropdown and notification modal if clicked outside
    if (
      this.state.isDropdownOpen &&
      !event.target.closest(`.${styles.dropdownWrapper}`)
    ) {
      this.setState({ isDropdownOpen: false });
    }

    if (
      this.state.showNotificationModal &&
      !event.target.closest(".notification-modal")
    ) {
      this.setState({ showNotificationModal: false });
    }
  };

  fetchNotifications = async (shipperId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/notifications?shipperId=${shipperId}`
      );
      const notifications = response.data.notifications;

      this.setState({
        notifications,
        unreadCount: notifications.filter((notif) => notif.unread === 1).length,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  markAllAsRead = async () => {
    try {
      const shipperId = localStorage.getItem("shipperId");
      await axios.put(`http://localhost:5000/api/notifications/mark-all-read`, {
        shipperId,
      });
      this.fetchNotifications(shipperId);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  handleMarkAsRead = async (notificationId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/${notificationId}/read`
      );
      const shipperId = localStorage.getItem("shipperId");
      this.fetchNotifications(shipperId);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  showLoginButton = (isShow) => {
    this.setState({ showLoginButton: isShow });
  };

  showDropdownButton = (isShow) => {
    this.setState({ showDropdownButton: isShow });
  };

  toggleDropdown = () => {
    this.setState((prevState) => ({
      isDropdownOpen: !prevState.isDropdownOpen,
    }));
  };

  toggleNotificationModal = (event) => {
    event.stopPropagation();
    this.setState((prevState) => ({
      showNotificationModal: !prevState.showNotificationModal,
    }));
  };

  // Handle logout
  handleLogout = () => {
    // Remove token and shipper info from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("shipperId");
    localStorage.removeItem("shipperName");

    // Redirect to home page
    window.location.href = "/home";
  };

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Renders the header component.
   *
   * @returns {JSX.Element}
   */
  /******  e685888b-b3ca-43af-96f5-438a6bdd62b9  *******/
  render() {
    const defaultNavItems = [
      { text: "Trang chủ", path: "/home", isActive: true },
      { text: "Về chúng tôi", path: "/about" },
      { text: "Tin tức", path: "/news" },
      { text: "Liên hệ", path: "/shipper-contact" },
    ];

    const navItems = this.props.navigationItems || defaultNavItems;

    return (
      <header className={styles.header}>
        <nav className={styles.backgroundShadow}>
          <Logo />
          <div className={styles.navigationItems}>
            {navItems.map((item, index) => (
              <NavigationItem
                key={index}
                text={item.text}
                path={item.path}
                isActive={item.isActive}
              />
            ))}
          </div>
          <div className={styles.authSection}>
            {this.state.showLoginButton ? (
              <div className={styles.authContainer}>
                <AuthButton onClick={this.props.onLoginClick} />
              </div>
            ) : (
              <div className={styles.authContainer}>
                <div className={styles.dropdownWrapper}>
                  {/* Notification Button */}
                  <button
                    className={styles.notificationButton}
                    onClick={this.toggleNotificationModal}
                    style={{ position: "relative", marginRight: "10px" }}
                  >
                    🔔
                    {this.state.unreadCount > 0 && (
                      <span
                        style={{
                          position: "absolute",
                          top: "-5px",
                          right: "-5px",
                          backgroundColor: "red",
                          color: "white",
                          borderRadius: "50%",
                          padding: "2px 6px",
                          fontSize: "12px",
                        }}
                      >
                        {this.state.unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Toggle */}
                  <button
                    className={styles.dropdownToggle}
                    onClick={this.toggleDropdown}
                  >
                    {this.state.shipperName} &#9660;
                  </button>

                  {this.state.isDropdownOpen && (
                    <div className={styles.dropdownMenu}>
                      <a
                        href="/shipper-account"
                        className={styles.dropdownItem}
                      >
                        Tài khoản
                      </a>
                      <a
                        href="/shipper-dashboard"
                        className={styles.dropdownItem}
                      >
                        Đơn hàng
                      </a>
                      <a
                        href="/dashboard/my-orders"
                        className={styles.dropdownItem}
                      >
                        Đơn đang giao
                      </a>
                      <a
                        href="/dashboard/history"
                        className={styles.dropdownItem}
                      >
                        Lịch sử đơn hàng
                      </a>
                      <a
                        href="/dashboard/revenue"
                        className={styles.dropdownItem}
                      >
                        Doanh thu
                      </a>
                      <button
                        onClick={this.handleLogout}
                        className={styles.dropdownItem}
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Notification Modal */}
        {!this.state.showLoginButton && this.state.showNotificationModal && (
          <div className={styles.notificationModal}>
            <div className={styles.notificationHeader}>
              <span className={styles.notificationTitle}>Thông Báo</span>
              <div className={styles.notificationActions}>
                <span
                  className={styles.markAllRead}
                  onClick={this.markAllAsRead}
                >
                  Đánh dấu tất cả đã đọc
                </span>
                <span
                  className={styles.closeNotification}
                  onClick={() =>
                    this.setState({ showNotificationModal: false })
                  }
                >
                  ✖
                </span>
              </div>
            </div>

            <div className={styles.notificationList}>
              {this.state.notifications.length > 0 ? (
                this.state.notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`${styles.notificationItem} ${
                      notif.unread ? styles.unread : ""
                    }`}
                    onClick={() => this.handleMarkAsRead(notif.id)}
                  >
                    <div className={styles.notificationMessage}>
                      {notif.message}
                    </div>
                    <div className={styles.notificationTime}>
                      {format(new Date(notif.timestamp), "dd/MM/yyyy HH:mm")}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyNotification}>
                  Không có thông báo mới
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    );
  }
}

export default Header;
