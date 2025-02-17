"use client";
import React from "react";
import styles from "./Header.module.css";
import { NavigationItem } from "./NavigationItem";
import { Logo } from "./Logo";
import { AuthButton } from "./AuthButton";

export const Header = ({ navigationItems }) => {
 // Mục điều hướng mặc định nếu không được cung cấp
 const defaultNavItems = [
   { text: "Trang chủ", path: "/home", isActive: true },
   { text: "Về chúng tôi", path: "/about" },
   { text: "Dịch vụ", path: "/services" },
   { text: "Tin tức", path: "/news" },
   { text: "Liên hệ", path: "/contact" }
 ];

 const navItems = navigationItems || defaultNavItems;

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
       <AuthButton />
     </nav>
   </header>
 );
};