import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/UpdatePersonalInfo.css';

const UpdatePersonalInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { shipperInfo } = location.state;

  const [newInfo, setNewInfo] = useState({
    FullName: shipperInfo.FullName || '',
    PhoneNumber: shipperInfo.PhoneNumber || '',
    Email: shipperInfo.Email || '',
    DateOfBirth: shipperInfo.DateOfBirth || '',
    Address: shipperInfo.Address || '',
    BankAccountNumber: shipperInfo.BankAccountNumber || '',
    VehicleType: shipperInfo.VehicleType || '',
    LicensePlate: shipperInfo.LicensePlate || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInfo({ ...newInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`/api/shippers/${shipperInfo.ShipperID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInfo),
    });

    if (response.ok) {
      alert('Thông tin đã được cập nhật');
      navigate('/shipper-account');
    } else {
      alert('Lỗi khi cập nhật thông tin');
    }
  };

  return (
    <div className="update-personal-info">
      <h2>Cập nhật thông tin cá nhân</h2>
      <form onSubmit={handleSubmit}>
        <label>Họ và tên</label>
        <input type="text" name="FullName" value={newInfo.FullName} onChange={handleInputChange} required />

        <label>Số điện thoại</label>
        <input type="text" name="PhoneNumber" value={newInfo.PhoneNumber} onChange={handleInputChange} required />

        <label>Email</label>
        <input type="email" name="Email" value={newInfo.Email} onChange={handleInputChange} required />

        <label>Ngày sinh</label>
        <input type="date" name="DateOfBirth" value={newInfo.DateOfBirth} onChange={handleInputChange} required />

        <label>Địa chỉ</label>
        <input type="text" name="Address" value={newInfo.Address} onChange={handleInputChange} required />

        <label>Số tài khoản ngân hàng</label>
        <input type="text" name="BankAccountNumber" value={newInfo.BankAccountNumber} onChange={handleInputChange} required />

        <label>Loại phương tiện</label>
        <input type="text" name="VehicleType" value={newInfo.VehicleType} onChange={handleInputChange} required />

        <label>Biển số xe</label>
        <input type="text" name="LicensePlate" value={newInfo.LicensePlate} onChange={handleInputChange} required />

        <button type="submit">Lưu thay đổi</button>
      </form>
    </div>
  );
};

export default UpdatePersonalInfo;
