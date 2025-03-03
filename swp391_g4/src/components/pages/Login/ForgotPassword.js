import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    setError('');
    setLoading(true);

    if (!email) {
      setError('Vui lòng nhập email');
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Định dạng email không hợp lệ');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/forgot-password',
        { email },
        { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
      );

      if (response.data.success) {
        navigate('/reset-password', { state: { email, resetToken: response.data.resetToken } });
      } else {
        setError(response.data.message || 'Đã xảy ra lỗi');
      }
    } catch (error) {
      console.error('Lỗi quên mật khẩu:', error);
      if (error.response) {
        setError(error.response.data.message || 'Không thể gửi yêu cầu');
      } else if (error.request) {
        setError('Không có phản hồi từ máy chủ');
      } else {
        setError('Đã xảy ra lỗi. Vui lòng thử lại');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-wrapper">
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
      <div className="forgot-password-image">
        <img src="https://giaohangtietkiem.vn/_next/image/?url=https%3A%2F%2Fcache.giaohangtietkiem.vn%2Fd%2Fda016201224ba6d2e2ee24f3bc51b89f.png&w=828&q=75" alt="Forgot Password" />
      </div>
    </div>
  );
};

export default ForgotPassword;
