import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ShipperAccount.css';
import axios from 'axios';



const ShipperAccount = () => {
  const navigate = useNavigate();
  const [shipperInfo, setShipperInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy ShipperID từ localStorage
  const shipperId = localStorage.getItem("shipperId");

  useEffect(() => {
    const fetchShipperInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/shippers/${shipperId}`);
        setShipperInfo(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi lấy thông tin:", error);
        setError("Không thể tải thông tin tài khoản");
        setLoading(false);
      }
    };

    if (shipperId) {
      fetchShipperInfo();
    }
  }, [shipperId]);

  const handleUpdateClick = () => {
    navigate('/update-personal-info', { state: { shipperInfo } });
  };

  const handleCancelClick = () => {
    navigate('/cancel-shipper-account');
  };


  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

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
        <p><strong>Thông tin phương tiện:</strong> {shipperInfo.VehicleDetails}</p>
      </div>

      <div className="shipper-account-actions">
        <button onClick={handleUpdateClick}>Cập nhật thông tin cá nhân</button>
        <button onClick={handleCancelClick}>Huỷ tài khoản shipper</button>
      </div>
    </div>
  );
};

export default ShipperAccount;
