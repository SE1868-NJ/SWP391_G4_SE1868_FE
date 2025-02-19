// ShipperRegister.js

import React, { useState } from "react";
import { Header } from "../../header/Header";
import Footer from "../../footer/Footer";
import "../../../styles/ShipperRegister.css";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const FormInput = ({
  label,
  name,
  type,
  value,
  onChange,
  error,
  required = false,
  className = "",
  placeholder = "",
  ...props
}) => (
  <div className="input-wrapper">
    <label htmlFor={name}>{label} {required && <span className="required">*</span>}</label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className={`form-input ${error ? 'error' : ''} ${className}`}
      placeholder={placeholder}
      required={required}
      {...props}
    />
    {error && <span className="error-message">{error}</span>}
  </div>
);

const vehicleTypes = ["Xe máy", "Xe tải nhỏ", "Xe tải lớn", "Xe van"];
const bankList = [
  "Vietcombank",
  "Techcombank",
  "BIDV",
  "Agribank",
  "VPBank",
  "ACB",
  "MBBank",
  "TPBank"
];

const ShipperRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    FullName: "",
    PhoneNumber: "",
    Email: "",
    DateOfBirth: "",
    HouseNumber: "",
    Ward: "",
    District: "",
    City: "",
    BankName: "",
    BankAccountNumber: "",
    VehicleType: "",
    LicensePlate: "",
    LicenseNumber: "",
    RegistrationVehicle: "",
    ExpiryVehicle: "",
    LicenseExpiryDate: "",
    DriverLicenseImage: null,
    VehicleRegistrationImage: null,
    CitizenID: "",
    IDCardImage: null,
    Password: "",
    ConfirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [previewImages, setPreviewImages] = useState({
    DriverLicenseImage: null,
    VehicleRegistrationImage: null,
    IDCardImage: null,
    PortraitImage: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      if (validateFile(file)) {
        setFormData(prev => ({ ...prev, [name]: file }));
        setPreviewImages(prev => ({
          ...prev,
          [name]: URL.createObjectURL(file)
        }));
        if (errors[name]) {
          setErrors(prev => ({ ...prev, [name]: "" }));
        }
      }
    }
  };

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận file JPG, JPEG hoặc PNG");
      return false;
    }
    if (file.size > maxSize) {
      toast.error("Kích thước file không được vượt quá 5MB");
      return false;
    }
    return true;
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    const minAge = 18;

    // Personal Information Validation
    if (!formData.FullName.trim()) {
      newErrors.FullName = "Vui lòng nhập họ tên";
    } else if (!/^[\p{L}\s]{2,50}$/u.test(formData.FullName)) {
      newErrors.FullName = "Họ tên chỉ được chứa chữ cái và khoảng trắng (2-50 ký tự)";
    }

    if (!formData.PhoneNumber) {
      newErrors.PhoneNumber = "Vui lòng nhập số điện thoại";
    } else if (!formData.PhoneNumber.match(/^(0[0-9]{9})$/)) {
      newErrors.PhoneNumber = "Số điện thoại không hợp lệ (10 số, bắt đầu bằng số 0)";
    }

    if (!formData.Email) {
      newErrors.Email = "Vui lòng nhập email";
    } else if (!formData.Email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.Email = "Email không hợp lệ";
    }

    if (!formData.DateOfBirth) {
      newErrors.DateOfBirth = "Vui lòng nhập ngày sinh";
    } else {
      const birthDate = new Date(formData.DateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < minAge) {
        newErrors.DateOfBirth = "Bạn phải trên 18 tuổi";
      }
    }

    // Address Validation
    if (!formData.HouseNumber.trim()) {
      newErrors.HouseNumber = "Vui lòng nhập số nhà và tên đường";
    }
    if (!formData.Ward.trim()) {
      newErrors.Ward = "Vui lòng nhập phường/xã";
    }
    if (!formData.District.trim()) {
      newErrors.District = "Vui lòng nhập quận/huyện";
    }
    if (!formData.City.trim()) {
      newErrors.City = "Vui lòng nhập tỉnh/thành phố";
    }

    // Bank Information Validation
    if (!formData.BankName) {
      newErrors.BankName = "Vui lòng chọn ngân hàng";
    }
    if (!formData.BankAccountNumber) {
      newErrors.BankAccountNumber = "Vui lòng nhập số tài khoản";
    } else if (!formData.BankAccountNumber.match(/^[0-9]{10,20}$/)) {
      newErrors.BankAccountNumber = "Số tài khoản không hợp lệ (10-20 số)";
    }

    // Vehicle Information Validation
    if (!formData.VehicleType) {
      newErrors.VehicleType = "Vui lòng chọn loại phương tiện";
    }
    if (!formData.LicensePlate) {
      newErrors.LicensePlate = "Vui lòng nhập biển số xe";
    } else if (!formData.LicensePlate.match(/^[0-9]{2}[A-Z]-[0-9]{4,5}$/)) {
      newErrors.LicensePlate = "Biển số xe không hợp lệ (VD: 51F-12345)";
    }

    if (!formData.LicenseNumber) {
      newErrors.LicenseNumber = "Vui lòng nhập số GPLX";
    } else if (!formData.LicenseNumber.match(/^[A-Z][0-9]{8,9}$/)) {
      newErrors.LicenseNumber = "Số GPLX không hợp lệ";
    }

    // Date Validations
    const validateFutureDate = (date, fieldName, errorMessage) => {
      if (!date) {
        newErrors[fieldName] = "Vui lòng nhập ngày";
      } else {
        const inputDate = new Date(date);
        if (inputDate <= today) {
          newErrors[fieldName] = errorMessage;
        }
      }
    };

    validateFutureDate(formData.RegistrationVehicle, "RegistrationVehicle",
      "Ngày đăng ký xe phải lớn hơn ngày hiện tại");
    validateFutureDate(formData.ExpiryVehicle, "ExpiryVehicle",
      "Ngày hết hạn đăng ký xe phải lớn hơn ngày hiện tại");
    validateFutureDate(formData.LicenseExpiryDate, "LicenseExpiryDate",
      "Ngày hết hạn GPLX phải lớn hơn ngày hiện tại");

    // Document Validation
    if (!formData.CitizenID) {
      newErrors.CitizenID = "Vui lòng nhập số CCCD";
    } else if (!formData.CitizenID.match(/^[0-9]{12}$/)) {
      newErrors.CitizenID = "Số CCCD không hợp lệ (12 số)";
    }

    // File Validation
    if (!formData.DriverLicenseImage) {
      newErrors.DriverLicenseImage = "Vui lòng tải lên ảnh GPLX";
    }
    if (!formData.VehicleRegistrationImage) {
      newErrors.VehicleRegistrationImage = "Vui lòng tải lên ảnh đăng ký xe";
    }
    if (!formData.IDCardImage) {
      newErrors.IDCardImage = "Vui lòng tải lên ảnh CCCD";
    }
    if (!formData.PortraitImage) {
      newErrors.PortraitImage = "Vui lòng tải lên ảnh chân dung";
    }

    // Password Validation
    if (!formData.Password) {
      newErrors.Password = "Vui lòng nhập mật khẩu";
    } else if (formData.Password.length < 8) {
      newErrors.Password = "Mật khẩu phải có ít nhất 8 ký tự";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.Password)) {
      newErrors.Password = "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt";
    }

    if (!formData.ConfirmPassword) {
      newErrors.ConfirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.Password !== formData.ConfirmPassword) {
      newErrors.ConfirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        if (['DriverLicenseImage', 'VehicleRegistrationImage', 'IDCardImage', 'PortraitImage'].includes(key)) {
          formDataToSend.append(key, formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // API call would go here
      // await axios.post('/api/shipper/register', formDataToSend);

      toast.success("Đăng ký thành công!");
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra");
    }
  };

  return (
    <div className="shipper-register-container">
      <header className="full-width-header">
        <Header />
      </header>

      <main className="register-main">
        <div className="register-form-container">
          <form onSubmit={handleSubmit} className="register-form">
            <h1 className="form-title">Đăng Ký Shipper</h1>

            <div className="form-section">
              <h2>Thông tin cá nhân</h2>
              <div className="input-grid">
                <FormInput
                  label="Họ và tên"
                  name="FullName"
                  type="text"
                  value={formData.FullName}
                  onChange={handleInputChange}
                  error={errors.FullName}
                  required
                  placeholder="Nguyễn Văn A"
                />
                <FormInput
                  label="Email"
                  name="Email"
                  type="email"
                  value={formData.Email}
                  onChange={handleInputChange}
                  error={errors.Email}
                  required
                  placeholder="example@email.com"
                />
                <FormInput
                  label="Số điện thoại"
                  name="PhoneNumber"
                  type="tel"
                  value={formData.PhoneNumber}
                  onChange={handleInputChange}
                  error={errors.PhoneNumber}
                  required
                  placeholder="0901234567"
                />
                <FormInput
                  label="Ngày sinh"
                  name="DateOfBirth"
                  type="date"
                  value={formData.DateOfBirth}
                  onChange={handleInputChange}
                  error={errors.DateOfBirth}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-section">
                <h2>Địa chỉ</h2>
                <div className="input-grid">
                  <FormInput
                    label="Số nhà, Tên đường"
                    name="HouseNumber"
                    type="text"
                    value={formData.HouseNumber}
                    onChange={handleInputChange}
                    error={errors.HouseNumber}
                    required
                    placeholder="123 Đường ABC"
                  />
                  <FormInput
                    label="Phường/Xã"
                    name="Ward"
                    type="text"
                    value={formData.Ward}
                    onChange={handleInputChange}
                    error={errors.Ward}
                    required
                    placeholder="Phường XYZ"
                  />
                  <FormInput
                    label="Quận/Huyện"
                    name="District"
                    type="text"
                    value={formData.District}
                    onChange={handleInputChange}
                    error={errors.District}
                    required
                    placeholder="Quận 1"
                  />
                  <FormInput
                    label="Tỉnh/Thành phố"
                    name="City"
                    type="text"
                    value={formData.City}
                    onChange={handleInputChange}
                    error={errors.City}
                    required
                    placeholder="TP.HCM"
                  />
                </div>
              </div>

              <div className="form-section">
                <h2>Thông tin ngân hàng</h2>
                <div className="input-grid">
                  <div className="input-wrapper">
                    <label htmlFor="BankName">Ngân hàng <span className="required">*</span></label>
                    <select
                      id="BankName"
                      name="BankName"
                      value={formData.BankName}
                      onChange={handleInputChange}
                      className={errors.BankName ? 'error' : ''}
                      required
                    >
                      <option value="">Chọn ngân hàng</option>
                      {bankList.map(bank => (
                        <option key={bank} value={bank}>{bank}</option>
                      ))}
                    </select>
                    {errors.BankName && <span className="error-message">{errors.BankName}</span>}
                  </div>
                  <FormInput
                    label="Số tài khoản"
                    name="BankAccountNumber"
                    type="text"
                    value={formData.BankAccountNumber}
                    onChange={handleInputChange}
                    error={errors.BankAccountNumber}
                    required
                    placeholder="1234567890"
                  />
                </div>
              </div>

              <div className="form-section">
                <h2>Thông tin phương tiện</h2>
                <div className="input-grid">
                  <div className="input-wrapper">
                    <label htmlFor="VehicleType">Loại phương tiện <span className="required">*</span></label>
                    <select
                      id="VehicleType"
                      name="VehicleType"
                      value={formData.VehicleType}
                      onChange={handleInputChange}
                      className={errors.VehicleType ? 'error' : ''}
                      required
                    >
                      <option value="">Chọn loại phương tiện</option>
                      {vehicleTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.VehicleType && <span className="error-message">{errors.VehicleType}</span>}
                  </div>
                  <FormInput
                    label="Biển số xe"
                    name="LicensePlate"
                    type="text"
                    value={formData.LicensePlate}
                    onChange={handleInputChange}
                    error={errors.LicensePlate}
                    required
                    placeholder="51F-12345"
                  />
                  <FormInput
                    label="Số GPLX"
                    name="LicenseNumber"
                    type="text"
                    value={formData.LicenseNumber}
                    onChange={handleInputChange}
                    error={errors.LicenseNumber}
                    required
                    placeholder="B123456789"
                  />
                  <FormInput
                    label="Ngày đăng ký xe"
                    name="RegistrationVehicle"
                    type="date"
                    value={formData.RegistrationVehicle}
                    onChange={handleInputChange}
                    error={errors.RegistrationVehicle}
                    required
                  />
                  <FormInput
                    label="Ngày hết hạn đăng ký xe"
                    name="ExpiryVehicle"
                    type="date"
                    value={formData.ExpiryVehicle}
                    onChange={handleInputChange}
                    error={errors.ExpiryVehicle}
                    required
                  />
                  <FormInput
                    label="Ngày hết hạn GPLX"
                    name="LicenseExpiryDate"
                    type="date"
                    value={formData.LicenseExpiryDate}
                    onChange={handleInputChange}
                    error={errors.LicenseExpiryDate}
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <h2>Giấy tờ tùy thân</h2>
                <div className="input-grid">
                  <FormInput
                    label="Số CCCD"
                    name="CitizenID"
                    type="text"
                    value={formData.CitizenID}
                    onChange={handleInputChange}
                    error={errors.CitizenID}
                    required
                    placeholder="012345678901"
                  />
                  <div className="file-input-wrapper">
                    <label>Ảnh GPLX <span className="required">*</span></label>
                    <input
                      type="file"
                      name="DriverLicenseImage"
                      onChange={handleFileChange}
                      accept="image/*"
                      className={errors.DriverLicenseImage ? 'error' : ''}
                    />
                    {previewImages.DriverLicenseImage && (
                      <img
                        src={previewImages.DriverLicenseImage}
                        alt="GPLX Preview"
                        className="file-preview"
                      />
                    )}
                    {errors.DriverLicenseImage && (
                      <span className="error-message">{errors.DriverLicenseImage}</span>
                    )}
                  </div>
                  <div className="file-input-wrapper">
                    <label>Ảnh đăng ký xe <span className="required">*</span></label>
                    <input
                      type="file"
                      name="VehicleRegistrationImage"
                      onChange={handleFileChange}
                      accept="image/*"
                      className={errors.VehicleRegistrationImage ? 'error' : ''}
                    />
                    {previewImages.VehicleRegistrationImage && (
                      <img
                        src={previewImages.VehicleRegistrationImage}
                        alt="Vehicle Registration Preview"
                        className="file-preview"
                      />
                    )}
                    {errors.VehicleRegistrationImage && (
                      <span className="error-message">{errors.VehicleRegistrationImage}</span>
                    )}
                  </div>
                  <div className="file-input-wrapper">
                    <label>Ảnh CCCD <span className="required">*</span></label>
                    <input
                      type="file"
                      name="IDCardImage"
                      onChange={handleFileChange}
                      accept="image/*"
                      className={errors.IDCardImage ? 'error' : ''}
                    />
                    {previewImages.IDCardImage && (
                      <img
                        src={previewImages.IDCardImage}
                        alt="ID Card Preview"
                        className="file-preview"
                      />
                    )}
                    {errors.IDCardImage && (
                      <span className="error-message">{errors.IDCardImage}</span>
                    )}
                  </div>
                  <div className="file-input-wrapper">
                    <label>Ảnh chân dung <span className="required">*</span></label>
                    <input
                      type="file"
                      name="PortraitImage"
                      onChange={handleFileChange}
                      accept="image/*"
                      className={errors.PortraitImage ? 'error' : ''}
                    />
                    {previewImages.PortraitImage && (
                      <img
                        src={previewImages.PortraitImage}
                        alt="Ảnh chân dung"
                        className="file-preview"
                      />
                    )}
                    {errors.PortraitImage && (
                      <span className="error-message">{errors.PortraitImage}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2>Bảo mật</h2>
                <div className="input-grid">
                  <FormInput
                    label="Mật khẩu"
                    name="Password"
                    type="password"
                    value={formData.Password}
                    onChange={handleInputChange}
                    error={errors.Password}
                    required
                    placeholder="Nhập mật khẩu"
                  />
                  <FormInput
                    label="Xác nhận mật khẩu"
                    name="ConfirmPassword"
                    type="password"
                    value={formData.ConfirmPassword}
                    onChange={handleInputChange}
                    error={errors.ConfirmPassword}
                    required
                    placeholder="Nhập lại mật khẩu"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="submit-button">
              Đăng Ký
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShipperRegister;