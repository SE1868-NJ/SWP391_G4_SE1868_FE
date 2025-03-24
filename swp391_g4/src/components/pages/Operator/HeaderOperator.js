// HeaderOperator.js
import React from "react";
import NotificationBell from "./NotificationBell";

const HeaderOperator = () => {
  return (
    <div 
      className="shipper-header"
      style={{
        height: '100px' // Giới hạn chiều cao của header
      }}
    >
      <div className="shipper-header-content">
        <div 
          className="shipper-header-flex"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            marginTop: "-24px"
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div 
              className="shipper-icon-container" 
              style={{
                width: '60px', // Giảm từ 5rem (80px) xuống 60px
                height: '60px', // Giảm từ 5rem (80px) xuống 60px
                backgroundColor: 'white',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
            >
              <img
                src="https://useless-gold-stingray.myfilebase.com/ipfs/QmdjqTuFUF1yeoPh8GBh3SP5hegdQ16fasvUEVxYtaoBoR"
                alt="Operator Icon"
                className="shipper-icon"
                style={{
                  width: "48px", // Giảm từ 4rem (64px) xuống 48px
                  height: "48px" // Giảm từ 4rem (64px) xuống 48px
                }}
              />
            </div>
            <div style={{ marginLeft: '1rem' }}>
              <h1 
                className="shipper-title"
                style={{
                  fontSize: '1.5rem' // Giảm kích thước chữ để vừa với chiều cao
                }}
              >
                Operator
              </h1>
              <p 
                className="shipper-subtitle" 
                style={{ 
                  color: 'white',
                  fontSize: '0.9rem' // Giảm kích thước chữ phụ đề
                }}
              >
                <strong>Luồng chính của Operator</strong>
              </p>
            </div>
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