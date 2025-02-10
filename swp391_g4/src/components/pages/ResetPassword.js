import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
// import '../../styles/ResetPassword.css';
import '../../styles/ResetPassword.css';


const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || ''; // Lấy email từ trang trước

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!newPassword || !confirmPassword) {
            setError('Vui lòng nhập đầy đủ thông tin.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                'http://localhost:5000/api/reset-password',
                { email, newPassword },
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.data.success) {
                setSuccess('Mật khẩu đã được cập nhật. Quay lại đăng nhập.');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(response.data.message || 'Đã xảy ra lỗi.');
            }
        } catch (error) {
            console.error('Reset password error:', error);
            setError('Không thể kết nối đến máy chủ.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <h1 className="reset-password-title">Đặt lại mật khẩu</h1>
            <form className="reset-password-form" onSubmit={handleSubmit}>
                <input
                    className="reset-password-input"
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <input
                    className="reset-password-input"
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button className="reset-password-button" type="submit" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
                </button>
            </form>

            {error && <p className="reset-password-error">{error}</p>}
            {success && <p className="reset-password-success">{success}</p>}

            <button className="reset-password-back-button" onClick={() => navigate('/login')}>
                Quay lại đăng nhập
            </button>
        </div>
    );
};

export default ResetPassword;
