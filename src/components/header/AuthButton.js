import React from "react";
import { useNavigate } from 'react-router-dom';
import styles from "./Header.module.css";

export const AuthButton = ({ onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(); // Ưu tiên gọi hàm onClick nếu được truyền
    } else {
      navigate('/login'); // Mặc định chuyển trang login
    }
  };

  return (
    <button 
      className={styles.loginButton}
      onClick={handleClick}
    >
      Đăng nhập / Đăng kí
    </button>
  );
};