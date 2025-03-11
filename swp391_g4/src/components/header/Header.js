"use client";
import React from "react";
import styles from "./Header.module.css";
import { NavigationItem } from "./NavigationItem";
import { Logo } from "./Logo";
import { AuthButton } from "./AuthButton";

export class Header extends React.Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem('token');
    this.state = {
      showLoginButton: !token,
      showDropdownButton: !!token,
      isDropdownOpen: false,
      shipperName: localStorage.getItem('shipperName') || 'Shipper'
    };
  }

  showLoginButton = (isShow) => {
    this.setState({ showLoginButton: isShow });
  }

  showDropdownButton = (isShow) => {
    this.setState({ showDropdownButton: isShow });
  }

  toggleDropdown = () => {
    this.setState(prevState => ({
      isDropdownOpen: !prevState.isDropdownOpen
    }));
  }

  // Handle logout
  handleLogout = () => {
    // Xóa token và thông tin shipper khỏi localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('shipperId');
    localStorage.removeItem('shipperName');
    
    // Chuyển hướng về trang home thay vì login
    window.location.href = '/home';
  }

  render() {
    const defaultNavItems = [
      { text: "Trang chủ", path: "/home", isActive: true },
      { text: "Về chúng tôi", path: "/about" },
      { text: "Tin tức", path: "/news" },
      { text: "Liên hệ", path: "/shipper-contact" }
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
                  <button 
                    className={styles.dropdownToggle} 
                    onClick={this.toggleDropdown}
                  >
                    {this.state.shipperName} &#9660;
                  </button>
                  
                  {this.state.isDropdownOpen && (
                    <div className={styles.dropdownMenu}>
                      <a href="/shipper-account" className={styles.dropdownItem}>
                        Tài khoản
                      </a>
                      <a href="/shipper-dashboard" className={styles.dropdownItem}>
                        Đơn hàng
                      </a>
                      <a href="/dashboard/my-orders" className={styles.dropdownItem}>
                        Đơn đang giao
                      </a>
                      <a href="/dashboard/history" className={styles.dropdownItem}>
                        Lịch sử đơn hàng
                      </a>
                      <a href="/dashboard/revenue" className={styles.dropdownItem}>
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
      </header>
    );
  }
}
export default Header;