import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../../styles/ShiperContact.css";
import { Header } from "../../header/Header";
import Footer from "../../footer/Footer";
import Login from "../Login/Login";
import ChatPopup from "./ChatPopup";
import BackButton from "../../buttons/BackButton";

function ShipperContact() {
  // Quản lý trạng thái popup
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Quản lý popup đăng nhập
  /**
   * Closes the login popup.
   * @function
   * @name closeLoginPopup
   */
  const openLoginPopup = () => setIsLoginPopupOpen(true);
  const closeLoginPopup = () => setIsLoginPopupOpen(false);

  // Quản lý popup thành công
  const closeSuccessPopup = () => setShowSuccessPopup(false);

  // Cấu hình form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  // Xử lý submit form
  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:4000/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Có lỗi xảy ra, vui lòng thử lại.");
      }

      // Hiển thị popup thành công
      setSuccessMessage(`Cảm ơn, ${data.name}! Chúng tôi đã ghi nhận thông tin liên hệ và sẽ trả lời bạn sớm nhất.`);
      setShowSuccessPopup(true);
      reset();
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
      console.error("Lỗi gửi liên hệ:", error);
    }
  };

  return (
    <div>
    <div className="shippercontact-container">
      {/* Header */}
      <div className="shippercontact-header">
        <Header 
          showLoginButton={true} 
          onLoginClick={openLoginPopup} 
        />
      </div>

      {/* Nội dung chính */}
      <div className="shippercontact-content-container">
        <div className="shippercontact-card">
          <h2 className="shippercontact-title">Liên hệ</h2>
          <p className="shippercontact-subtitle">
            Hãy để lại thông tin, chúng tôi sẽ liên hệ bạn ngay!
          </p>

          {/* Form liên hệ */}
          <form className="shippercontact-form" onSubmit={handleSubmit(onSubmit)}>
            {/* Họ và Tên */}
            <div className="shippercontact-input-group">
              <input
                type="text"
                placeholder="Họ và Tên"
                {...register("name", {
                  required: "Vui lòng nhập họ và tên.",
                  minLength: { 
                    value: 3, 
                    message: "Tên phải có ít nhất 3 ký tự." 
                  },
                  maxLength: { 
                    value: 64, 
                    message: "Tên không được vượt quá 64 ký tự." 
                  }
                })}
                className="shippercontact-form-group"
              />
              {errors.name && (
                <p className="shippercontact-error">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="shippercontact-input-group">
              <input
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Vui lòng nhập email.",
                  pattern: { 
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 
                    message: "Email không hợp lệ." 
                  }
                })}
                className="shippercontact-form-group"
              />
              {errors.email && (
                <p className="shippercontact-error">{errors.email.message}</p>
              )}
            </div>

            {/* Số điện thoại */}
            <div className="shippercontact-input-group">
              <input
                type="tel"
                placeholder="Số điện thoại"
                {...register("phone", {
                  required: "Vui lòng nhập số điện thoại.",
                  pattern: { 
                    value: /^\+?[0-9]{7,15}$/, 
                    message: "Số điện thoại không hợp lệ." 
                  }
                })}
                className="shippercontact-form-group"
              />
              {errors.phone && (
                <p className="shippercontact-error">{errors.phone.message}</p>
              )}
            </div>

            {/* Nội dung liên hệ */}
            <div className="shippercontact-input-group">
              <textarea
                placeholder="Nội dung liên hệ"
                {...register("message", {
                  required: "Vui lòng nhập nội dung liên hệ.",
                  maxLength: { 
                    value: 500, 
                    message: "Nội dung không được vượt quá 500 ký tự." 
                  }
                })}
                className="shippercontact-form-group"
              />
              {errors.message && (
                <p className="shippercontact-error">{errors.message.message}</p>
              )}
            </div>

            {/* Nút gửi */}
            <button 
              type="submit" 
              className="shippercontact-button" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang gửi..." : "Gửi liên hệ"}
            </button>
          </form>
        </div>
      </div>

      {/* Popup đăng nhập */}
      {isLoginPopupOpen && (
        <div className="shippercontact-popup-overlay">
          <div className="shippercontact-popup-content">
            <button 
              className="shippercontact-popup-close" 
              onClick={closeLoginPopup}
            >
              &times;
            </button>
            <Login isPopup={true} onClose={closeLoginPopup} />
          </div>
        </div>
      )}

      {/* Popup thành công */}
      {showSuccessPopup && (
        <div className="shippercontact-popup-overlay">
          <div className="shippercontact-popup-content success-popup">
            <button 
              className="shippercontact-popup-close" 
              onClick={closeSuccessPopup}
            >
              &times;
            </button>
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h3 className="success-title">Gửi thành công!</h3>
            <p className="success-message">{successMessage}</p>
            <button 
              className="shippercontact-button" 
              onClick={closeSuccessPopup}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
            <div style={{marginLeft:"100px"}}><BackButton/></div>
      {/* Chat và Footer */}
      <ChatPopup />
      <Footer 
        showAccountSection={true} 
        onLoginClick={openLoginPopup} 
      />
    </div>
    </div>
  );
}

export default ShipperContact;