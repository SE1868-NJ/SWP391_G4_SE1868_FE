// components/Header/Logo.js
import React from "react";
import styles from "./Header.module.css";

export const Logo = () => {
  return (
    <img
      loading="lazy"
      src="/EcoShipper_rbg.png"
      className={styles.img}
      alt="EcoShipper Logo"
    />
  );
};

