import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Xác thực định dạng email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Đặt lại trạng thái
    setError('');
    setLoading(true);

    // Kiểm tra email
    if (!email) {
      setError('Vui lòng nhập email');
      setLoading(false);
      return;
    }

    // Kiểm tra định dạng email
    if (!validateEmail(email)) {
      setError('Định dạng email không hợp lệ');
      setLoading(false);
      return;
    }

    try {
      // Gửi request
      const response = await axios.post(
        'http://localhost:5000/api/forgot-password', // Đảm bảo đúng endpoint
        { email },
        { 
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000 // Timeout 10 giây
        }
      );

      // Xử lý phản hồi thành công
      if (response.data.success) {
        // Chuyển hướng sang trang đặt lại mật khẩu
        navigate('/reset-password', { 
          state: { 
            email, 
            resetToken: response.data.resetToken 
          } 
        });
      } else {
        // Xử lý phản hồi không thành công
        setError(response.data.message || 'Đã xảy ra lỗi');
      }
    } catch (error) {
      // Xử lý lỗi
      console.error('Lỗi quên mật khẩu:', error);
      
      if (error.response) {
        // Máy chủ trả về lỗi
        setError(error.response.data.message || 'Không thể gửi yêu cầu');
      } else if (error.request) {
        // Không nhận được phản hồi
        setError('Không có phản hồi từ máy chủ');
      } else {
        // Lỗi khác
        setError('Đã xảy ra lỗi. Vui lòng thử lại');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h1 className="forgot-password-title">Quên mật khẩu</h1>
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <input
          className="forgot-password-input"
          type="email"
          name="email"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={handleChange}
          required
        />
        <button
          className="forgot-password-button"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : 'Gửi yêu cầu'}
        </button>
      </form>

      {error && <p className="forgot-password-error">{error}</p>}

      <button
        className="forgot-password-back-button"
        onClick={() => navigate('/login')}
      >
        Quay lại đăng nhập
      </button>
    </div>
  );
};

export default ForgotPassword;