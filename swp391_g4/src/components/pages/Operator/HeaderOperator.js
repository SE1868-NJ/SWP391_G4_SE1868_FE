// HeaderOperator.js
import React from "react";
import NotificationBell from "./NotificationBell";

const HeaderOperator = () => {
  return (
    <div className="shipper-header">
      <div className="shipper-header-content">
        <div className="shipper-header-flex">
          <div className="shipper-icon-container" style={{
            width: '5rem',
            height: '5rem',
            backgroundColor: 'white',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent:' center',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          }}>
            <img
              src="https://useless-gold-stingray.myfilebase.com/ipfs/QmdjqTuFUF1yeoPh8GBh3SP5hegdQ16fasvUEVxYtaoBoR"
              alt="Operator Icon"
              className="shipper-icon"
              style={{width: "4rem",
                height: "4rem"}}
            />
          </div>
          <div>
            <h1 className="shipper-title">Operator</h1>
            <p className="shipper-subtitle" style={{color: 'white'}}><strong>Luồng chính của Operator</strong></p>
          </div>
          <div className="shipper-notification-container">
            <NotificationBell />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderOperator;
