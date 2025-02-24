"use client";
import React from "react";
import styles from "./Header.module.css";
import { NavigationItem } from "./NavigationItem";
import { Logo } from "./Logo";
import { AuthButton } from "./AuthButton";

export class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoginButton: props.showLoginButton || false,
      showDropdownButton: props.showDropdownButton || false, // Thêm state mới
      isDropdownOpen: false
    };
  }

  // Hàm để thay đổi trạng thái hiển thị nút login
  showLoginButton = (isShow) => {
    this.setState({ showLoginButton: isShow });
  }

  // Hàm để thay đổi trạng thái hiển thị nút dropdown
  showDropdownButton = (isShow) => {
    this.setState({ showDropdownButton: isShow });
  }

  // Toggle dropdown menu
  toggleDropdown = () => {
    this.setState(prevState => ({
      isDropdownOpen: !prevState.isDropdownOpen
    }));
  }

  // Handle logout
  handleLogout = () => {
    // Add logout logic here
    if (this.props.onLogout) {
      this.props.onLogout();
    }
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
                
                {this.state.showDropdownButton && (
                  <div className={styles.dropdownWrapper}>
                    <button 
                      className={styles.dropdownToggle} 
                      onClick={this.toggleDropdown}
                    >
                      &#9660; {/* Dropdown arrow */}
                    </button>
                    
                    {this.state.isDropdownOpen && (
                      <div className={styles.dropdownMenu}>
                        <a href="/shipper-account" className={styles.dropdownItem}>
                          Tài khoản
                        </a>
                        <a href="/history-order" className={styles.dropdownItem}>
                          Lịch sử đơn hàng
                        </a>
                        <a href="/revenue" className={styles.dropdownItem}>
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
                )}
              </div>
            ) : (
              <div className={styles.authPlaceholder}></div>
            )}
          </div>
        </nav>
      </header>
    );
  }
}
export default Header;