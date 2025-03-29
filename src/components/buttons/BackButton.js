// BackButton.js
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BackButton.module.css"; // Import CSS module

const BackButton = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  return (
    <button className={styles.backButton} onClick={handleGoBack}>
      Quay lại
    </button>
  );
};

export default BackButton;