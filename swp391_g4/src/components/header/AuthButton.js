// AuthButton.js
import React from "react";
import { useNavigate } from 'react-router-dom';
import styles from "./Header.module.css";

export const AuthButton = () => {
  const navigate = useNavigate();

  return (
    <button 
      className={styles.loginButton}
      onClick={() => navigate('/login')}
    >
      Đăng nhập / Đăng kí
    </button>
  );
};