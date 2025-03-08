import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../../styles/ShiperContact.css";
import { Header } from "../../header/Header";
import Footer from "../../footer/Footer";
import Login from "../Login/Login";

function ShipperContact() {
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);

  const openLoginPopup = () => {
    setIsLoginPopupOpen(true);
  };

  const closeLoginPopup = () => {
    setIsLoginPopupOpen(false);
  };
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:5000/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Có lỗi xảy ra, vui lòng thử lại.");
      }

      alert(result.message || `Cảm ơn, ${data.name}! Chúng tôi sẽ liên hệ sớm nhất.`);
      reset();
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
      console.error("Lỗi gửi liên hệ:", error);
    }
  };

  return (
    <div className="shippercontact-container">
      <div className="shippercontact-header">
        <Header 
          showLoginButton={true} 
          onLoginClick={openLoginPopup} 
        />
      </div>

      <div className="shippercontact-content-container">
        <div className="shippercontact-card">
          <h2 className="shippercontact-title">Liên hệ </h2>
          <p className="shippercontact-subtitle">Hãy để lại thông tin, chúng tôi sẽ liên hệ bạn ngay!</p>

          <form className="shippercontact-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="shippercontact-input-group">
              <input
                type="text"
                placeholder="Họ và Tên"
                {...register("name", {
                  required: "Vui lòng nhập họ và tên.",
                  minLength: { value: 3, message: "Tên phải có ít nhất 3 ký tự." },
                  maxLength: { value: 64, message: "Tên không được vượt quá 64 ký tự." },
                  pattern: { value: /^[a-zA-Z\s]+$/, message: "Tên chỉ chứa chữ cái và khoảng trắng." }
                })}
                className="shippercontact-form-group"
              />
              <p className="shippercontact-error">{errors.name?.message}</p>
            </div>

            <div className="shippercontact-input-group">
              <input
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Vui lòng nhập email.",
                  pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: "Email không hợp lệ." }
                })}
                className="shippercontact-form-group"
              />
              <p className="shippercontact-error">{errors.email?.message}</p>
            </div>

            <div className="shippercontact-input-group">
              <input
                type="tel"
                placeholder="Số điện thoại"
                {...register("phone", {
                  required: "Vui lòng nhập số điện thoại.",
                  pattern: { value: /^\+?[0-9]{7,15}$/, message: "Số điện thoại không hợp lệ." }
                })}
                className="shippercontact-form-group"
              />
              <p className="shippercontact-error">{errors.phone?.message}</p>
            </div>

            <div className="shippercontact-input-group">
              <textarea
                placeholder="Nội dung liên hệ"
                {...register("message", {
                  required: "Vui lòng nhập nội dung liên hệ.",
                  maxLength: { value: 500, message: "Nội dung không được vượt quá 500 ký tự." }
                })}
                className="shippercontact-form-group"
              />
              <p className="shippercontact-error">{errors.message?.message}</p>
            </div>

            <button type="submit" className="shippercontact-button" disabled={isSubmitting}>
              {isSubmitting ? "Đang gửi..." : "Gửi liên hệ"}
            </button>
          </form>
        </div>
      </div>

      {isLoginPopupOpen && (
        <div className="shippercontact-popup-overlay">
          <div className="shippercontact-popup-content">
            <button className="shippercontact-popup-close" onClick={closeLoginPopup}>
              &times;
            </button>
            <Login isPopup={true} onClose={closeLoginPopup} />
          </div>
        </div>
      )}

      <Footer showAccountSection={true} onLoginClick={openLoginPopup} />
    </div>
  );
}

export default ShipperContact;