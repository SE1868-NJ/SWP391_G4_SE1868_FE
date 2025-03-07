import React, { useState } from "react";
import { Header } from "../../header/Header";
import Footer from "../../footer/Footer";
import "../../../styles/ShipperRegister.css";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';

// Constants for validation and configuration
const VALIDATION_CONFIG = {
  fullName: {
    pattern: /^[\p{L}\s]{2,}$/u,
    maxLength: 100,
    message: "Họ tên chỉ được chứa chữ cái và khoảng trắng (2-100 ký tự)"
  },
  phone: {
    pattern: /^(0[0-9]{9})$/,
    maxLength: 15,
    message: "Số điện thoại không hợp lệ (10 số, bắt đầu bằng số 0)"
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 100,
    message: "Email không hợp lệ"
  },
  citizenId: {
    pattern: /^[0-9]{12}$/,
    maxLength: 12,
    message: "Số CCCD phải có đúng 12 số"
  },
  licensePlate: {
    pattern: /^[0-9]{2}[A-Z]-[0-9]{4,5}$/,
    maxLength: 15,
    message: "Biển số xe không hợp lệ (VD: 51F-12345)"
  },
  licenseNumber: {
    pattern: /^[A-Z][0-9]{11}$/,
    maxLength: 20,
    message: "Số GPLX không hợp lệ (1 chữ cái và 11 số)"
  },
  bankAccount: {
    pattern: /^[0-9]{10,20}$/,
    maxLength: 20,
    message: "Số tài khoản không hợp lệ (10-20 số)"
  },
  password: {
    pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
    minLength: 8,
    maxLength: 100,
    message: "Mật khẩu phải chứa ít nhất 1 chữ cái và 1 số, tối thiểu 8 ký tự"
  }
};

const BANK_LIST = [
  "Vietcombank", "Techcombank", "BIDV", "Agribank",
  "VPBank", "ACB", "MBBank", "TPBank"
];

const VEHICLE_TYPES = [
  "Xe máy", "Xe tải nhỏ", "Xe tải lớn", "Xe van"
];
// FormInput Component
const FormInput = ({
  label,
  name,
  type,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  className = "",
  placeholder = "",
  maxLength,
  ...props
}) => (
  <div className="input-wrapper">
    <label htmlFor={name}>
      {label} {required && <span className="required">*</span>}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={`form-input ${error ? 'error' : ''} ${className}`}
      placeholder={placeholder}
      required={required}
      maxLength={maxLength}
      {...props}
    />
    {error && <span className="error-message">{error}</span>}
  </div>
);

const ShipperRegister = () => {
  const navigate = useNavigate();
  const initialFormData = {
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
    CitizenID: "",
    Password: "",
    ConfirmPassword: "",
    DriverLicenseImage: "",
    VehicleRegistrationImage: "",
    ImageShipper: "",
    IDCardImage: ""
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const checkPhoneExists = async (phoneNumber) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/check-phone/${phoneNumber}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking phone:', error);
      return false;
    }
  };

  const checkEmailExists = async (email) => {
    if (!email) return false;
    try {
      const response = await axios.get(`http://localhost:4000/api/check-email/${email}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  const checkCitizenIDExists = async (citizenId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/check-citizenid/${citizenId}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking CitizenID:', error);
      return false;
    }
  };
  const validateField = (name, value) => {
    switch (name) {
      case 'FullName':
        if (!value.trim()) return "Vui lòng nhập họ tên";
        if (!VALIDATION_CONFIG.fullName.pattern.test(value))
          return VALIDATION_CONFIG.fullName.message;
        return "";

      case 'PhoneNumber':
        if (!value) return "Vui lòng nhập số điện thoại";
        if (!VALIDATION_CONFIG.phone.pattern.test(value))
          return VALIDATION_CONFIG.phone.message;
        return "";

      case 'CitizenID':
        if (!value) return "Vui lòng nhập số CCCD";
        if (!VALIDATION_CONFIG.citizenId.pattern.test(value))
          return VALIDATION_CONFIG.citizenId.message;
        return "";

      case 'Password':
        if (!value) return "Vui lòng nhập mật khẩu";
        if (!VALIDATION_CONFIG.password.pattern.test(value))
          return VALIDATION_CONFIG.password.message;
        return "";

      case 'ConfirmPassword':
        if (!value) return "Vui lòng xác nhận mật khẩu";
        if (value !== formData.Password) return "Mật khẩu xác nhận không khớp";
        return "";

      case 'Email':
        if (value && !VALIDATION_CONFIG.email.pattern.test(value))
          return VALIDATION_CONFIG.email.message;
        return "";

      case 'LicensePlate':
        if (!value) return "Vui lòng nhập biển số xe";
        if (!VALIDATION_CONFIG.licensePlate.pattern.test(value))
          return VALIDATION_CONFIG.licensePlate.message;
        return "";

      case 'LicenseNumber':
        if (!value) return "Vui lòng nhập số GPLX";
        if (!VALIDATION_CONFIG.licenseNumber.pattern.test(value))
          return VALIDATION_CONFIG.licenseNumber.message;
        return "";

      case 'BankAccountNumber':
        if (!value) return "Vui lòng nhập số tài khoản";
        if (!VALIDATION_CONFIG.bankAccount.pattern.test(value))
          return VALIDATION_CONFIG.bankAccount.message;
        return "";

      // Validate other required fields
      case 'DateOfBirth':
      case 'HouseNumber':
      case 'Ward':
      case 'District':
      case 'City':
      case 'BankName':
      case 'VehicleType':
      case 'RegistrationVehicle':
      case 'ExpiryVehicle':
      case 'LicenseExpiryDate':
      case 'DriverLicenseImage':
      case 'VehicleRegistrationImage':
      case 'ImageShipper':
      case 'IDCardImage':
        if (!value) return `Vui lòng điền thông tin này`;
        return "";

      default:
        return "";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touchedFields[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      if (field !== 'ConfirmPassword' && field !== 'Email') {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Vui lòng kiểm tra lại thông tin");
      console.log('Validation errors:', newErrors);
      return;
    }

    try {
      // Remove ConfirmPassword and format dates
      const { ConfirmPassword, ...submitData } = formData;

      const formattedData = {
        ...submitData,
        DateOfBirth: formatDate(submitData.DateOfBirth),
        RegistrationVehicle: formatDate(submitData.RegistrationVehicle),
        ExpiryVehicle: formatDate(submitData.ExpiryVehicle),
        LicenseExpiryDate: formatDate(submitData.LicenseExpiryDate)
      };

      console.log('Sending data:', formattedData);

      const response = await axios.post(
        'http://localhost:4000/api/shippers',
        formattedData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Đăng ký thành công! Vui lòng đợi xác nhận.');
        navigate('/home');
      }
    } catch (error) {
      console.error('Error details:', error.response?.data);
      if (error.response) {
        toast.error(error.response.data.message || 'Đăng ký không thành công');
      } else {
        toast.error('Đã có lỗi xảy ra');
      }
    }
  };
  return (
    <div className="shipper-register-container">
      <Header />
      <main className="register-main">
        <div className="register-form-container">
          <form onSubmit={handleSubmit} className="register-form">
            <h1 className="form-title">Đăng Ký Tài Khoản Shipper</h1>

            {/* Personal Information Section */}
            <section className="form-section">
              <h2>Thông tin cá nhân</h2>
              <div className="input-grid">
                <FormInput
                  label="Họ và tên"
                  name="FullName"
                  type="text"
                  value={formData.FullName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.FullName}
                  required
                  maxLength={100}
                  placeholder="Nguyễn Văn A"
                />

                <FormInput
                  label="Số điện thoại"
                  name="PhoneNumber"
                  type="tel"
                  value={formData.PhoneNumber}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.PhoneNumber}
                  required
                  maxLength={15}
                  placeholder="0901234567"
                />

                <FormInput
                  label="Email"
                  name="Email"
                  type="email"
                  value={formData.Email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.Email}
                  placeholder="example@email.com"
                />

                <FormInput
                  label="Ngày sinh"
                  name="DateOfBirth"
                  type="date"
                  value={formData.DateOfBirth}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.DateOfBirth}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </section>

            {/* Address Section */}
            <section className="form-section">
              <h2>Địa chỉ</h2>
              <div className="input-grid">
                <FormInput
                  label="Số nhà, Tên đường"
                  name="HouseNumber"
                  type="text"
                  value={formData.HouseNumber}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
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
                  onBlur={handleBlur}
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
                  onBlur={handleBlur}
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
                  onBlur={handleBlur}
                  error={errors.City}
                  required
                  placeholder="TP.HCM"
                />
              </div>
            </section>

            {/* Bank Information Section */}
            <section className="form-section">
              <h2>Thông tin ngân hàng</h2>
              <div className="input-grid">
                <div className="input-wrapper">
                  <label htmlFor="BankName">
                    Ngân hàng <span className="required">*</span>
                  </label>
                  <select
                    id="BankName"
                    name="BankName"
                    value={formData.BankName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`form-input ${errors.BankName ? 'error' : ''}`}
                    required
                  >
                    <option value="">Chọn ngân hàng</option>
                    {BANK_LIST.map(bank => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                  {errors.BankName && (
                    <span className="error-message">{errors.BankName}</span>
                  )}
                </div>

                <FormInput
                  label="Số tài khoản"
                  name="BankAccountNumber"
                  type="text"
                  value={formData.BankAccountNumber}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.BankAccountNumber}
                  required
                  placeholder="1234567890"
                />
              </div>
            </section>

            {/* Vehicle Information Section */}
            <section className="form-section">
              <h2>Thông tin phương tiện</h2>
              <div className="input-grid">
                <div className="input-wrapper">
                  <label htmlFor="VehicleType">
                    Loại phương tiện <span className="required">*</span>
                  </label>
                  <select
                    id="VehicleType"
                    name="VehicleType"
                    value={formData.VehicleType}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`form-input ${errors.VehicleType ? 'error' : ''}`}
                    required
                  >
                    <option value="">Chọn loại phương tiện</option>
                    {VEHICLE_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.VehicleType && (
                    <span className="error-message">{errors.VehicleType}</span>
                  )}
                </div>

                <FormInput
                  label="Biển số xe"
                  name="LicensePlate"
                  type="text"
                  value={formData.LicensePlate}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
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
                  onBlur={handleBlur}
                  error={errors.LicenseNumber}
                  required
                  placeholder="B123456789"
                />

                <FormInput
                  label="Ngày đăng kiểm xe"
                  name="RegistrationVehicle"
                  type="date"
                  value={formData.RegistrationVehicle}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.RegistrationVehicle}
                  required
                />

                <FormInput
                  label="Ngày hết hạn đăng kiểm"
                  name="ExpiryVehicle"
                  type="date"
                  value={formData.ExpiryVehicle}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.ExpiryVehicle}
                  required
                />

                <FormInput
                  label="Ngày hết hạn GPLX"
                  name="LicenseExpiryDate"
                  type="date"
                  value={formData.LicenseExpiryDate}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.LicenseExpiryDate}
                  required
                />
              </div>
            </section>

            {/* Documents Section */}
            <section className="form-section">
              <h2>Giấy tờ tùy thân</h2>
              <div className="input-grid">
                <FormInput
                  label="Số CCCD"
                  name="CitizenID"
                  type="text"
                  value={formData.CitizenID}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.CitizenID}
                  required
                  maxLength={12}
                  placeholder="012345678901"
                />

                <FormInput
                  label="Ảnh GPLX"
                  name="DriverLicenseImage"
                  type="text"
                  value={formData.DriverLicenseImage}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.DriverLicenseImage}
                  required
                  placeholder="URL ảnh GPLX"
                />

                <FormInput
                  label="Ảnh đăng ký xe"
                  name="VehicleRegistrationImage"
                  type="text"
                  value={formData.VehicleRegistrationImage}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.VehicleRegistrationImage}
                  required
                  placeholder="URL ảnh đăng ký xe"
                />

                <FormInput
                  label="Ảnh CCCD"
                  name="IDCardImage"
                  type="text"
                  value={formData.IDCardImage}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.IDCardImage}
                  required
                  placeholder="URL ảnh CCCD"
                />

                <FormInput
                  label="Ảnh Shipper"
                  name="ImageShipper"
                  type="text"
                  value={formData.ImageShipper}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.ImageShipper}
                  required
                  placeholder="URL ảnh chân dung"
                />
              </div>
            </section>

            {/* Password Section */}
            <section className="form-section">
              <h2>Bảo mật</h2>
              <div className="input-grid">
                <div className="password-input-wrapper">
                  <label htmlFor="Password">
                    Mật khẩu <span className="required">*</span>
                  </label>
                  <div className="password-input-container">
                    <input
                      id="Password"
                      name="Password"
                      type={showPassword ? "text" : "password"}
                      value={formData.Password}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`form-input ${errors.Password ? 'error' : ''}`}
                      required
                      placeholder="Nhập mật khẩu"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.Password && (
                    <span className="error-message">{errors.Password}</span>
                  )}
                </div>

                <div className="password-input-wrapper">
                  <label htmlFor="ConfirmPassword">
                    Xác nhận mật khẩu <span className="required">*</span>
                  </label>
                  <div className="password-input-container">
                    <input
                      id="ConfirmPassword"
                      name="ConfirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.ConfirmPassword}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`form-input ${errors.ConfirmPassword ? 'error' : ''}`}
                      required
                      placeholder="Nhập lại mật khẩu"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.ConfirmPassword && (
                    <span className="error-message">{errors.ConfirmPassword}</span>
                  )}
                </div>
              </div>
            </section>

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