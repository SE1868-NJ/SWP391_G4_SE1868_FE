// components/header/NavigationItem.js
import React from "react";
import { useNavigate } from 'react-router-dom';
import styles from "./Header.module.css";

export const NavigationItem = ({ text, path, isActive }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <button 
      className={isActive ? styles.item : styles.item2}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};