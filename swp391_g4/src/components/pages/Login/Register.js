import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Register.css';


const Register = () => {
 const navigate = useNavigate();
 const [formData, setFormData] = useState({
   phoneNumber: '',
   email: '',
   dateOfBirth: '',
   address: '',
   bankAccount: '',
   vehicleType: '',
   licensePlate: ''
 });


 const handleChange = (e) => {
   setFormData({
     ...formData,
     [e.target.name]: e.target.value
   });
 };


 const handleSubmit = (e) => {
   e.preventDefault();
   console.log('Form submitted:', formData);
   navigate('/login');
 };


 return (
   <div className="register-container">
     <h1 className="register-title">Đăng ký Shipper</h1>
     <form className="register-form" onSubmit={handleSubmit}>
       <input
         className="register-input"
         type="tel"
         name="phoneNumber"
         placeholder="Số điện thoại"
         value={formData.phoneNumber}
         onChange={handleChange}
         required
       />
       <input
         className="register-input"
         type="email"
         name="email"
         placeholder="Email"
         value={formData.email}
         onChange={handleChange}
         required
       />
       <input
         className="register-input"
         type="date"
         name="dateOfBirth"
         value={formData.dateOfBirth}
         onChange={handleChange}
         required
       />
       <input
         className="register-input"
         type="text"
         name="address"
         placeholder="Địa chỉ"
         value={formData.address}
         onChange={handleChange}
         required
       />
       <input
         className="register-input"
         type="text"
         name="bankAccount"
         placeholder="Số tài khoản ngân hàng"
         value={formData.bankAccount}
         onChange={handleChange}
         required
       />
       <select
         className="register-input"
         name="vehicleType"
         value={formData.vehicleType}
         onChange={handleChange}
         required
       >
         <option value="">Chọn loại xe</option>
         <option value="motorcycle">Xe máy</option>
         <option value="bike">Xe đạp</option>
         <option value="car">Ô tô</option>
       </select>
       <input
         className="register-input"
         type="text"
         name="licensePlate"
         placeholder="Biển số xe"
         value={formData.licensePlate}
         onChange={handleChange}
         required
       />
       <button className="register-button" type="submit">
         Đăng ký
       </button>
     </form>
     <button
       className="register-transparent-button"
       onClick={() => navigate('/login')}
     >
       Đã có tài khoản? Đăng nhập
     </button>
   </div>
 );
};


export default Register;