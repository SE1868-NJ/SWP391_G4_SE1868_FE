import React, { useState } from "react";
import "../../../styles/ShipperContact.css";

function ShipperContact() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch("http://localhost:5000/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Có lỗi xảy ra, vui lòng thử lại.");
      }

      alert(result.message || `Cảm ơn, ${formData.name}! Chúng tôi sẽ liên hệ sớm nhất.`);
      setFormData({ name: "", email: "", phone: "", message: "" });

    } catch (error) {
      alert(`Lỗi: ${error.message}`);
      console.error("Lỗi gửi liên hệ:", error);
    }

    setIsSending(false);
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Liên hệ Shipper</h2>
        <p className="text-center">Hãy để lại thông tin, chúng tôi sẽ liên hệ bạn ngay!</p>

        <form className="mt-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Họ và Tên"
            value={formData.name}
            onChange={handleChange}
            className="form-group"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="form-group"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={handleChange}
            className="form-group"
            required
          />
          <textarea
            name="message"
            placeholder="Nội dung liên hệ"
            value={formData.message}
            onChange={handleChange}
            className="form-group"
            required
          />
          <button type="submit" className="button" disabled={isSending}>
            {isSending ? "Đang gửi..." : "Gửi liên hệ"}
          </button>
        </form>
      </div>

      <button
        className="home-button"
        style={{ position: "fixed", top: "20px", right: "20px", padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
        onClick={() => window.location.href = "/"}
      >
        Quay về Trang chủ
      </button>
    </div>
  );
}

export default ShipperContact;