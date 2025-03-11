import React from "react";
import styles from "./Header.module.css";
import ecoShipperLogo from "../../images/EcoShipper_rbg.png";


export const Logo = () => {
  return (
    <img
      loading="lazy"
      src={ecoShipperLogo}
      className={styles.img}
      alt="EcoShipper Logo"
    />
  );
};