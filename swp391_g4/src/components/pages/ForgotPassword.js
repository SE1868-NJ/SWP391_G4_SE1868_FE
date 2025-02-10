import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  // const handleSubmit = async (e) => {
    // e.preventDefault();
    // setError('');
    // setSuccess('');
    // setLoading(true);

    // if (!email) {
      // setError('Vui lòng nhập email');
      // setLoading(false);
      // return;
    // }

    // try {
      // const response = await axios.post(
        // 'http://localhost:5000/api/forgot-password',
        // { email },
        // {
          // headers: {
            // 'Content-Type': 'application/json',
          // },
        // }
      // );

      // if (response.data.success) {
        // setSuccess('Đã gửi email reset mật khẩu. Vui lòng kiểm tra hộp thư.');
      // } else {
        // setError(response.data.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
      // }
    // } catch (error) {
      // console.error('Forgot password error:', error);
      // setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    // } finally {
      // setLoading(false);
    // }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
  
    if (!email) {
      setError('Vui lòng nhập email');
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:5000/api/forgot-password',
        { email },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      if (response.data.success) {
        navigate('/reset-password', { state: { email } }); // Điều hướng đến trang đặt lại mật khẩu
      } else {
        setError(response.data.message || 'Đã xảy ra lỗi.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError(error.response.data.message);
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
      {success && <p className="forgot-password-success">{success}</p>}

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
