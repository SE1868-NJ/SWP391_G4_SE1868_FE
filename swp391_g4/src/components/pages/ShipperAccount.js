import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ShipperAccount.css';

const getShipperInfo = async (shipperId) => {
  const response = await fetch(`/api/shippers/${shipperId}`);
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Không thể lấy thông tin shipper");
  }
};

const ShipperAccount = () => {
  const navigate = useNavigate();
  const [shipperInfo, setShipperInfo] = useState({});

  // Lấy ShipperID từ localStorage
  const shipperId = localStorage.getItem("shipperId");

  useEffect(() => {
    if (shipperId) {
      getShipperInfo(shipperId)
        .then(info => setShipperInfo(info))
        .catch(error => console.error(error));
    }
  }, [shipperId]);

  const handleUpdateClick = () => {
    navigate('/update-personal-info', { state: { shipperInfo } });
  };

  const handleCancelClick = () => {
    navigate('/cancel-shipper-account');
  };

  return (
    <div className="shipper-account">
      <h2>Thông tin tài khoản shipper</h2>
      <div>
        <p><strong>Họ và tên:</strong> {shipperInfo.FullName}</p>
        <p><strong>Số điện thoại:</strong> {shipperInfo.PhoneNumber}</p>
        <p><strong>Email:</strong> {shipperInfo.Email}</p>
        <p><strong>Ngày sinh:</strong> {shipperInfo.DateOfBirth}</p>
        <p><strong>Địa chỉ:</strong> {shipperInfo.Address}</p>
        <p><strong>Số tài khoản ngân hàng:</strong> {shipperInfo.BankAccountNumber}</p>
        <p><strong>Loại phương tiện:</strong> {shipperInfo.VehicleType}</p>
        <p><strong>Biển số xe:</strong> {shipperInfo.LicensePlate}</p>
      </div>

      <div className="shipper-account-actions">
        <button onClick={handleUpdateClick}>Cập nhật thông tin cá nhân</button>
        <button onClick={handleCancelClick}>Huỷ tài khoản shipper</button>
      </div>
    </div>
  );
};

export default ShipperAccount;
