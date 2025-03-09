// // import React, { useState, useEffect } from 'react';
// // import { useNavigate, useLocation } from 'react-router-dom';
// // import axios from 'axios';
// // import '../../../styles/ResetPassword.css';

// // const ResetPassword = () => {
// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   // Lấy email và token từ trang trước
// //   const [email, setEmail] = useState(location.state?.email || '');
// //   const [resetToken, setResetToken] = useState(location.state?.resetToken || '');

// //   const [newPassword, setNewPassword] = useState('');
// //   const [confirmPassword, setConfirmPassword] = useState('');
// //   const [error, setError] = useState('');
// //   const [loading, setLoading] = useState(false);

// //   // Kiểm tra đã đến từ trang quên mật khẩu
// //   useEffect(() => {
// //     if (!email || !resetToken) {
// //       navigate('/forgot-password');
// //     }
// //   }, [email, resetToken, navigate]);

// //   // Xác thực mật khẩu mạnh
// //   const validatePassword = (password) => {
// //     const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
// //     return regex.test(password);
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError('');

// //     // Kiểm tra nhập liệu
// //     if (!newPassword || !confirmPassword) {
// //       setError('Vui lòng nhập đầy đủ thông tin.');
// //       return;
// //     }

// //     if (newPassword !== confirmPassword) {
// //       setError('Mật khẩu xác nhận không khớp.');
// //       return;
// //     }

// //     // Kiểm tra độ mạnh mật khẩu
// //     if (!validatePassword(newPassword)) {
// //       setError('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.');
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       const response = await axios.post(
// //         'http://localhost:5000/api/reset-password',
// //         {
// //           email,
// //           resetToken,
// //           newPassword
// //         },
// //         {
// //           headers: { 'Content-Type': 'application/json' },
// //           timeout: 10000
// //         }
// //       );

// //       if (response.data.success) {
// //         // Thông báo và chuyển hướng
// //         alert('Mật khẩu đã được cập nhật thành công!');
// //         navigate('/login');
// //       } else {
// //         setError(response.data.message || 'Đã xảy ra lỗi.');
// //       }
// //     } catch (error) {
// //       console.error('Lỗi đặt lại mật khẩu:', error);

// //       // Xử lý lỗi chi tiết
// //       if (error.response) {
// //         setError(error.response.data.message || 'Không thể đặt lại mật khẩu.');
// //       } else if (error.request) {
// //         setError('Không có phản hồi từ máy chủ. Vui lòng kiểm tra kết nối.');
// //       } else {
// //         setError('Đã xảy ra lỗi. Vui lòng thử lại.');
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="reset-password-container">
// //       <h1 className="reset-password-title">Đặt lại mật khẩu</h1>
// //       <form className="reset-password-form" onSubmit={handleSubmit}>
// //         <input
// //           className="reset-password-input"
// //           type="password"
// //           placeholder="Nhập mật khẩu mới"
// //           value={newPassword}
// //           onChange={(e) => setNewPassword(e.target.value)}
// //           required
// //         />
// //         <input
// //           className="reset-password-input"
// //           type="password"
// //           placeholder="Xác nhận mật khẩu"
// //           value={confirmPassword}
// //           onChange={(e) => setConfirmPassword(e.target.value)}
// //           required
// //         />
// //         <button
// //           className="reset-password-button"
// //           type="submit"
// //           disabled={loading}
// //         >
// //           {loading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
// //         </button>
// //       </form>

// //       {error && <p className="reset-password-error">{error}</p>}

// //       <button
// //         className="reset-password-back-button"
// //         onClick={() => navigate('/login')}
// //       >
// //         Quay lại đăng nhập
// //       </button>
// //       <div className="reset-password-image">
// //         <img src="https://giaohangtietkiem.vn/_next/image/?url=https%3A%2F%2Fcache.giaohangtietkiem.vn%2Fd%2Fda016201224ba6d2e2ee24f3bc51b89f.png&w=828&q=75" alt="Reset Password" />
// //       </div>
// //     </div>
// //   );
// // };

// // export default ResetPassword;





// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import '../../../styles/ResetPassword.css';

// const ResetPassword = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [email, setEmail] = useState(location.state?.email || '');
//   const [resetToken, setResetToken] = useState(location.state?.resetToken || '');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!email || !resetToken) {
//       navigate('/forgot-password');
//     }
//   }, [email, resetToken, navigate]);

//   const validatePassword = (password) => {
//     const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
//     return regex.test(password);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (!newPassword || !confirmPassword) {
//       setError('Vui lòng nhập đầy đủ thông tin.');
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setError('Mật khẩu xác nhận không khớp.');
//       return;
//     }

//     if (!validatePassword(newPassword)) {
//       setError('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.post(
//         'http://localhost:5000/api/reset-password',
//         { email, resetToken, newPassword },
//         { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
//       );

//       if (response.data.success) {
//         alert('Mật khẩu đã được cập nhật thành công!');
//         navigate('/login');
//       } else {
//         setError(response.data.message || 'Đã xảy ra lỗi.');
//       }
//     } catch (error) {
//       console.error('Lỗi đặt lại mật khẩu:', error);
//       if (error.response) {
//         setError(error.response.data.message || 'Không thể đặt lại mật khẩu.');
//       } else if (error.request) {
//         setError('Không có phản hồi từ máy chủ. Vui lòng kiểm tra kết nối.');
//       } else {
//         setError('Đã xảy ra lỗi. Vui lòng thử lại.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="reset-password-wrapper">
//       <div className="reset-password-container left">
//         <h1 className="reset-password-title">Đặt lại mật khẩu</h1>
//         <form className="reset-password-form" onSubmit={handleSubmit}>
//           <input
//             className="reset-password-input"
//             type="password"
//             placeholder="Nhập mật khẩu mới"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             required
//           />
//           <input
//             className="reset-password-input"
//             type="password"
//             placeholder="Xác nhận mật khẩu"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//           <button className="reset-password-button" type="submit" disabled={loading}>
//             {loading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
//           </button>
//         </form>
//         {error && <p className="reset-password-error">{error}</p>}
//         <button className="reset-password-back-button" onClick={() => navigate('/login')}>
//           Quay lại đăng nhập
//         </button>
//       </div>
//       <div className="reset-password-image right">
//         <img 
//           src="https://giaohangtietkiem.vn/_next/image/?url=https%3A%2F%2Fcache.giaohangtietkiem.vn%2Fd%2Fda016201224ba6d2e2ee24f3bc51b89f.png&w=828&q=75" 
//           alt="Reset Password" 
//           style={{ maxWidth: '90%', height: 'auto', maxHeight: '350px' }}
//         />
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;



import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/ResetPassword.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || '');
  const [resetToken, setResetToken] = useState(location.state?.resetToken || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email || !resetToken) {
      navigate('/forgot-password');
    }
  }, [email, resetToken, navigate]);

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (!validatePassword(newPassword)) {
      setError('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/reset-password',
        { 
          email, 
          resetToken,
          newPassword 
        },
        { 
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000 
        }
      );

      if (response.data.success) {
        alert('Mật khẩu đã được cập nhật thành công!');
        navigate('/login');
      } else {
        setError(response.data.message || 'Đã xảy ra lỗi.');
      }
    } catch (error) {
      console.error('Lỗi đặt lại mật khẩu:', error);
      if (error.response) {
        setError(error.response.data.message || 'Không thể đặt lại mật khẩu.');
      } else if (error.request) {
        setError('Không có phản hồi từ máy chủ. Vui lòng kiểm tra kết nối.');
      } else {
        setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-wrapper">
      <div className="reset-password-container left">
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
        <button className="reset-password-back-button" onClick={() => navigate('/login')}>
          Quay lại đăng nhập
        </button>
      </div>
      <div className="reset-password-image right">
        <img 
          src="https://giaohangtietkiem.vn/_next/image/?url=https%3A%2F%2Fcache.giaohangtietkiem.vn%2Fd%2Fda016201224ba6d2e2ee24f3bc51b89f.png&w=828&q=75" 
          alt="Reset Password" 
          style={{ maxWidth: '90%', height: 'auto', maxHeight: '350px' }}
        />
      </div>
    </div>
  );
};

export default ResetPassword;

