import React from 'react';
import { useNavigate } from 'react-router-dom';

const CancelShipperAccount = () => {
  const navigate = useNavigate();

  const handleCancel = async () => {
    const confirmCancel = window.confirm('Bạn có chắc muốn huỷ tài khoản này?');

    if (confirmCancel) {
      // Gọi API để huỷ tài khoản
      const response = await fetch('/api/shippers/cancel', {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Tài khoản đã bị huỷ');
        navigate('/');
      } else {
        alert('Lỗi khi huỷ tài khoản');
      }
    }
  };

  return (
    <div className="cancel-shipper-account">
      <h2>Huỷ tài khoản shipper</h2>
      <p>Việc huỷ tài khoản sẽ xoá vĩnh viễn dữ liệu của bạn. Bạn có chắc chắn muốn tiếp tục?</p>
      <button onClick={handleCancel}>Huỷ tài khoản</button>
    </div>
  );
};

export default CancelShipperAccount;
