import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/CancelShipperAccount.css';

const CancelShipperAccount = () => {
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [error, setError] = useState('');

  const reasons = [
    'Không còn nhu cầu sử dụng',
    'Dịch vụ không đáp ứng nhu cầu',
    'Chuyển sang nền tảng khác',
    'Khác'
  ];

  const handleReasonChange = (selectedReason) => {
    setReason(selectedReason);
  };

  const handleCancel = async () => {
    const shipperId = localStorage.getItem('shipperId');
    const token = localStorage.getItem('token');
    
    if (!shipperId || !token) {
      setError('Không tìm thấy thông tin tài khoản hoặc chưa đăng nhập');
      navigate('/login');
      return;
    }

    const finalReason = reason === 'Khác' ? otherReason : reason;
    if (!finalReason) {
      setError('Vui lòng chọn hoặc nhập lý do hủy tài khoản');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/shippers/${shipperId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: { reason: finalReason }
      });

      localStorage.removeItem('shipperId');
      localStorage.removeItem('shipperName');
      localStorage.removeItem('token');
      
      navigate('/');
      alert('Tài khoản đã được hủy thành công');
    } catch (error) {
      console.error('Lỗi hủy tài khoản:', error);
      setError('Không thể hủy tài khoản. Vui lòng thử lại.');
    }
  };

  return (
    <div className="cancel-account-container">
      <h2>Hủy Tài Khoản Shipper</h2>
      
      <div className="cancel-reasons">
        <p>Vui lòng cho chúng tôi biết lý do bạn muốn hủy tài khoản:</p>
        {reasons.map((r) => (
          <div key={r} className="reason-option">
            <input
              type="radio"
              id={r}
              name="cancelReason"
              checked={reason === r}
              onChange={() => handleReasonChange(r)}
            />
            <label htmlFor={r}>{r}</label>
          </div>
        ))}

        {reason === 'Khác' && (
          <textarea
            placeholder="Nhập lý do của bạn"
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
          />
        )}
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="cancel-actions">
        <button className="confirm-cancel-button" onClick={handleCancel}>
          Xác Nhận Hủy Tài Khoản
        </button>
        <button className="back-button" onClick={() => navigate('/ShipperAccount')}>
          Quay Lại
        </button>
      </div>
    </div>
  );
};

export default CancelShipperAccount;
