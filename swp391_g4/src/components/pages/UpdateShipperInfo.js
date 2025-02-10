import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../styles/UpdateShipperInfo.css';

const UpdateShipperInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy thông tin shipper từ state được truyền từ ShipperAccount
  const [shipperInfo, setShipperInfo] = useState({
    FullName: '',
    PhoneNumber: '',
    Email: '',
    DateOfBirth: '',
    Address: '',
    BankAccountNumber: '',
    VehicleDetails: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy ShipperID từ localStorage
  const shipperId = localStorage.getItem("shipperId");

  useEffect(() => {
    // Nếu có thông tin được truyền từ trang ShipperAccount
    if (location.state && location.state.shipperInfo) {
      // Chuyển đổi định dạng ngày tháng
      const formattedShipperInfo = {
        ...location.state.shipperInfo,
        DateOfBirth: location.state.shipperInfo.DateOfBirth 
          ? new Date(location.state.shipperInfo.DateOfBirth).toISOString().split('T')[0] 
          : ''
      };
      setShipperInfo(formattedShipperInfo);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShipperInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formattedShipperInfo = {
        ...shipperInfo,
        DateOfBirth: shipperInfo.DateOfBirth 
          ? new Date(shipperInfo.DateOfBirth).toISOString().split('T')[0] 
          : null
      };

      console.log('Sending update request:', formattedShipperInfo);

      const response = await axios.put(
        `http://localhost:5000/api/shippers/${shipperId}`, 
        formattedShipperInfo,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Thông báo thành công
      alert('Cập nhật thông tin thành công!');
      
      // Chuyển hướng về trang ShipperAccount
      navigate('/ShipperAccount');
    } catch (error) {
      console.error("Lỗi cập nhật thông tin:", error);
      
      // Chi tiết lỗi từ phía server
      if (error.response) {
        console.error('Server response error:', error.response.data);
        setError(error.response.data.message || error.response.data.error || "Không thể cập nhật thông tin. Vui lòng thử lại.");
      } else if (error.request) {
        console.error('No response received:', error.request);
        setError("Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối.");
      } else {
        console.error('Error setting up request:', error.message);
        setError("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-shipper-info-container">
      <h2>Cập Nhật Thông Tin Shipper</h2>
      
      <form onSubmit={handleSubmit} className="update-shipper-form">
        <div className="form-group">
          <label>Họ và Tên</label>
          <input
            type="text"
            name="FullName"
            value={shipperInfo.FullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Số Điện Thoại</label>
          <input
            type="tel"
            name="PhoneNumber"
            value={shipperInfo.PhoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="Email"
            value={shipperInfo.Email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Ngày Sinh</label>
          <input
            type="date"
            name="DateOfBirth"
            value={shipperInfo.DateOfBirth}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Địa Chỉ</label>
          <input
            type="text"
            name="Address"
            value={shipperInfo.Address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Số Tài Khoản Ngân Hàng</label>
          <input
            type="text"
            name="BankAccountNumber"
            value={shipperInfo.BankAccountNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Thông Tin Phương Tiện</label>
          <input
            type="text"
            name="VehicleDetails"
            value={shipperInfo.VehicleDetails}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="form-actions">
          <button 
            type="submit" 
            className="update-button" 
            disabled={loading}
          >
            {loading ? 'Đang Cập Nhật...' : 'Cập Nhật Thông Tin'}
          </button>
          <button 
            type="button" 
            className="cancel-button" 
            onClick={() => navigate('/ShipperAccount')}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateShipperInfo;