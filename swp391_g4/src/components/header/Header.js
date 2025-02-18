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
      showLoginButton: props.showLoginButton || false
    };
  }

  // Hàm để thay đổi trạng thái hiển thị nút login
  showLoginButton = (isShow) => {
    this.setState({ showLoginButton: isShow });
  }

  render() {
    const defaultNavItems = [
      { text: "Trang chủ", path: "/home", isActive: true },
      { text: "Về chúng tôi", path: "/about" },
      { text: "Tin tức", path: "/news" },
      { text: "Liên hệ", path: "/contact" }
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
              <AuthButton onClick={this.props.onLoginClick} />
            ) : (
              <div className={styles.authPlaceholder}></div>
            )}
          </div>
        </nav>
      </header>
    );
  }
}