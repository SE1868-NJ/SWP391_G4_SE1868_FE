import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/ShipperAccount.css';

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000, // 10 giây timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor để thêm token vào mọi request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý lỗi token
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const ShipperAccount = () => {
  const navigate = useNavigate();
  const [shipperInfo, setShipperInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShipperInfo = async () => {
      const shipperId = localStorage.getItem("shipperId");
      
      // Kiểm tra đăng nhập
      if (!shipperId) {
        navigate('/login');
        return;
      }

      try {
        // Gọi API với xác thực
        const response = await api.get(`/shippers/${shipperId}`);
        
        // Kiểm tra dữ liệu trả về
        if (!response.data || !response.data.ShipperID) {
          throw new Error('Không tìm thấy thông tin shipper');
        }

        setShipperInfo(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi lấy thông tin:", error);
        
        // Xử lý các loại lỗi khác nhau
        if (error.response) {
          switch (error.response.status) {
            case 404:
              setError("Không tìm thấy thông tin tài khoản");
              break;
            case 403:
              setError("Bạn không có quyền truy cập");
              break;
            default:
              setError("Không thể tải thông tin tài khoản");
          }
        } else if (error.request) {
          setError("Không có phản hồi từ máy chủ");
        } else {
          setError("Đã có lỗi xảy ra");
        }
        
        setLoading(false);
      }
    };

    fetchShipperInfo();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // Gọi API logout nếu backend hỗ trợ
      await api.post('/logout');
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    } finally {
      // Luôn xóa local storage và chuyển hướng
      localStorage.clear();
      navigate('/login');
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="shipper-account">
      <h2>Thông tin tài khoản shipper</h2>
      <div className="shipper-info">
        <p><strong>Họ và tên:</strong> {shipperInfo.FullName}</p>
        <p><strong>Số điện thoại:</strong> {shipperInfo.PhoneNumber}</p>
        <p><strong>Email:</strong> {shipperInfo.Email}</p>
        <p><strong>Ngày sinh:</strong> {shipperInfo.DateOfBirth}</p>
        <p><strong>Địa chỉ:</strong> {shipperInfo.Address}</p>
        <p><strong>Số tài khoản ngân hàng:</strong> {shipperInfo.BankAccountNumber}</p>
        <p><strong>Thông tin phương tiện:</strong> {shipperInfo.VehicleDetails}</p>
      </div>

      <div className="shipper-account-actions">
        <button 
          onClick={() => navigate('/update-personal-info', { state: { shipperInfo } })}
        >
          Cập nhật thông tin cá nhân
        </button>
        <button onClick={handleLogout}>Đăng xuất</button>
      </div>
    </div>
  );
};

export default ShipperAccount;