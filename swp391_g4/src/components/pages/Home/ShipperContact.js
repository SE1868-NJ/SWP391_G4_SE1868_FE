import React from "react";
import { useForm } from "react-hook-form";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../../styles/ShiperContact.css";
import { Header } from "../../header/Header";
import Footer from "../../footer/Footer";

function ShipperContact() {
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
    <>
      <Header showLoginButton = {true} /> {/* Thêm Header vào đầu trang */}

      <div className="container">
        <div className="card">
          <h2 className="title">Contact Us </h2>
          <p className="text-center">Hãy để lại thông tin, chúng tôi sẽ liên hệ bạn ngay!</p>

          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Họ và Tên"
                {...register("name", {
                  required: "Vui lòng nhập họ và tên.",
                  minLength: { value: 3, message: "Tên phải có ít nhất 3 ký tự." },
                  maxLength: { value: 64, message: "Tên không được vượt quá 64 ký tự." },
                  pattern: { value: /^[a-zA-Z\s]+$/, message: "Tên chỉ chứa chữ cái và khoảng trắng." }
                })}
                className="form-group"
              />
              <p className="error">{errors.name?.message}</p>
            </div>

            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Vui lòng nhập email.",
                  pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: "Email không hợp lệ." }
                })}
                className="form-group"
              />
              <p className="error">{errors.email?.message}</p>
            </div>

            <div className="input-group">
              <input
                type="tel"
                placeholder="Số điện thoại"
                {...register("phone", {
                  required: "Vui lòng nhập số điện thoại.",
                  pattern: { value: /^\+?[0-9]{7,15}$/, message: "Số điện thoại không hợp lệ." }
                })}
                className="form-group"
              />
              <p className="error">{errors.phone?.message}</p>
            </div>

            <div className="input-group">
              <textarea
                placeholder="Nội dung liên hệ"
                {...register("message", {
                  required: "Vui lòng nhập nội dung liên hệ.",
                  maxLength: { value: 500, message: "Nội dung không được vượt quá 500 ký tự." }
                })}
                className="form-group"
              />
              <p className="error">{errors.message?.message}</p>
            </div>

            <button type="submit" className="button" disabled={isSubmitting}>
              {isSubmitting ? "Đang gửi..." : "Gửi liên hệ"}
            </button>
          </form>
        </div>

      </div>

      <Footer /> {/* Thêm Footer vào cuối trang */}
    </>
  );
}

export default ShipperContact;
