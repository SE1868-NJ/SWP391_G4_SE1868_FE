import React, { useState } from "react";
import { Header } from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import "../../styles/ShipperRegister.css";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';

// Constants for validation and configuration
const VALIDATION_CONFIG = {
  fullName: {
    pattern: /^[\p{L}]+(\s[\p{L}]+){2,}$/u,
    maxLength: 30,
    message: "Họ tên phải có ít nhất 3 từ (VD: Nguyễn Văn A), chỉ chứa chữ cái và khoảng trắng giữa các từ (tối đa 30 ký tự)"
  },
  phone: {
    pattern: /^(0[0-9]{9})$/,
    maxLength: 10,
    message: "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)"
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 50,
    message: "Email không hợp lệ (tối đa 50 ký tự)"
  },
  citizenId: {
    pattern: /^[0-9]{12}$/,
    maxLength: 12,
    message: "Số CCCD phải có đúng 12 số"
  },
  licensePlate: {
    pattern: /^[0-9]{2}[A-Z]{1,2}[A-Z0-9]?-[0-9]{4,5}$/,
    maxLength: 10,
    message: "Biển số xe không hợp lệ (VD: 29A-12345, 29AA-12345, 29B2-12345)"
  },
  licenseNumber: {
    pattern: /^[A-Z][0-9]{11}$/,
    maxLength: 12,
    message: "Số GPLX không hợp lệ (1 chữ cái + 11 số)"
  },
  bankAccount: {
    pattern: /^[0-9]{10,20}$/,
    maxLength: 20,
    message: "Số tài khoản không hợp lệ (10-20 số)"
  },
  password: {
    pattern: /^[A-Za-z\d]{8,}$/,
    minLength: 8,
    maxLength: 20,
    message: "Mật khẩu phải chứa chữ cái hoặc số, từ 8-20 ký tự"
  },
  houseNumber: {
    pattern: /^[\p{L}\s\d.,-]{2,}$/u,
    maxLength: 50,
    message: "Số nhà và tên đường chỉ chứa chữ cái, số, dấu cách, dấu chấm, dấu phẩy, dấu gạch ngang (2-50 ký tự)"
  },
  ward: {
    pattern: /^[\p{L}\s]{2,}$/u,
    maxLength: 30,
    message: "Phường/Xã chỉ chứa chữ cái và dấu cách (2-30 ký tự)"
  },
  district: {
    pattern: /^[\p{L}\s]{2,}$/u,
    maxLength: 30,
    message: "Quận/Huyện chỉ chứa chữ cái và dấu cách (2-30 ký tự)"
  },
  city: {
    pattern: /^[\p{L}\s]{2,}$/u,
    maxLength: 30,
    message: "Tỉnh/Thành phố chỉ chứa chữ cái và dấu cách (2-30 ký tự)"
  },
  imageUrl: {
    pattern: /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i,
    maxLength: 150,
    message: "URL ảnh không hợp lệ (phải bắt đầu bằng http:// hoặc https://, tối đa 150 ký tự)"
  }
};


const BANK_LIST = [
  "Vietcombank", "Techcombank", "BIDV", "Agribank", "VPBank",
  "ACB", "MBBank", "TPBank", "Sacombank", "VietinBank",
  "SHB", "HDBank", "Eximbank", "VIB", "SCB",
  "OCB", "MSB", "SeABank", "LienVietPostBank", "PVcomBank",
  "NamABank", "BaoVietBank", "KienLongBank", "DongABank"
];


const VEHICLE_TYPES = [
  "Xe máy",
  "Xe máy điện",
  "Xe điện",
  "Xe ô tô con",
  "Xe van nhỏ"
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
  <div className="shipperRegister-input-wrapper">
    <label htmlFor={name}>
      {label} {required && <span className="shipperRegister-required">*</span>}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={`shipperRegister-form-input ${error ? 'shipperRegister-error' : ''} ${className}`}
      placeholder={placeholder}
      required={required}
      maxLength={maxLength}
      {...props}
    />
    {error && <span className="shipperRegister-error-message">{error}</span>}
  </div>
);

const ShipperRegister = () => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);


    switch (name) {
      case 'FullName':
        if (!value || !value.trim()) return "Vui lòng nhập họ tên";
        const trimmedValue = value.trim();
        if (!VALIDATION_CONFIG.fullName.pattern.test(trimmedValue))
          return VALIDATION_CONFIG.fullName.message;
        if (trimmedValue.length > VALIDATION_CONFIG.fullName.maxLength)
          return `Họ tên không được vượt quá ${VALIDATION_CONFIG.fullName.maxLength} ký tự`;
        return "";


      case 'PhoneNumber':
        if (!value) return "Vui lòng nhập số điện thoại";
        if (!VALIDATION_CONFIG.phone.pattern.test(value) || value.length !== VALIDATION_CONFIG.phone.maxLength)
          return VALIDATION_CONFIG.phone.message;
        return "";


      case 'CitizenID':
        if (!value) return "Vui lòng nhập số CCCD";
        if (!VALIDATION_CONFIG.citizenId.pattern.test(value) || value.length !== VALIDATION_CONFIG.citizenId.maxLength)
          return VALIDATION_CONFIG.citizenId.message;
        return "";


      case 'Password':
        if (!value) return "Vui lòng nhập mật khẩu";
        if (!VALIDATION_CONFIG.password.pattern.test(value) || value.length < VALIDATION_CONFIG.password.minLength || value.length > VALIDATION_CONFIG.password.maxLength)
          return VALIDATION_CONFIG.password.message;
        return "";


      case 'ConfirmPassword':
        if (!value) return "Vui lòng xác nhận mật khẩu";
        if (value !== formData.Password) return "Mật khẩu xác nhận không khớp";
        return "";


      case 'Email':
        if (value && (!VALIDATION_CONFIG.email.pattern.test(value) || value.length > VALIDATION_CONFIG.email.maxLength))
          return VALIDATION_CONFIG.email.message;
        return "";


      case 'LicensePlate':
        if (!value) return "Vui lòng nhập biển số xe";
        if (!VALIDATION_CONFIG.licensePlate.pattern.test(value) || value.length > VALIDATION_CONFIG.licensePlate.maxLength)
          return VALIDATION_CONFIG.licensePlate.message;
        return "";


      case 'LicenseNumber':
        if (!value) return "Vui lòng nhập số GPLX";
        if (!VALIDATION_CONFIG.licenseNumber.pattern.test(value) || value.length > VALIDATION_CONFIG.licenseNumber.maxLength)
          return VALIDATION_CONFIG.licenseNumber.message;
        return "";


      case 'BankAccountNumber':
        if (!value) return "Vui lòng nhập số tài khoản";
        if (!VALIDATION_CONFIG.bankAccount.pattern.test(value) || value.length > VALIDATION_CONFIG.bankAccount.maxLength)
          return VALIDATION_CONFIG.bankAccount.message;
        return "";


      case 'RegistrationVehicle':
        if (!value) return "Vui lòng nhập ngày đăng kiểm xe";
        const regDate = new Date(value);
        if (isNaN(regDate.getTime())) return "Ngày đăng kiểm không hợp lệ";
        if (regDate > today) return "Ngày đăng kiểm không được là ngày trong tương lai";
        const tenYearsAgo = new Date(today);
        tenYearsAgo.setFullYear(today.getFullYear() - 10);
        if (regDate < tenYearsAgo) return "Ngày đăng kiểm quá cũ (trước 10 năm)";
        return "";


      case 'ExpiryVehicle':
        if (!value) return "Vui lòng nhập ngày hết hạn đăng kiểm";
        const expiryDate = new Date(value);
        const regVehicleDate = new Date(formData.RegistrationVehicle);
        if (isNaN(expiryDate.getTime())) return "Ngày hết hạn đăng kiểm không hợp lệ";
        if (formData.RegistrationVehicle && expiryDate <= regVehicleDate)
          return "Ngày hết hạn đăng kiểm phải sau ngày đăng kiểm";
        if (expiryDate < today) return "Ngày hết hạn đăng kiểm đã quá hạn";
        const twoYearsLater = new Date(today);
        twoYearsLater.setFullYear(today.getFullYear() + 2);
        if (expiryDate > twoYearsLater) return "Ngày hết hạn đăng kiểm không được quá 2 năm từ hiện tại";
        return "";


      case 'LicenseExpiryDate':
        if (!value) return "Vui lòng nhập ngày hết hạn GPLX";
        const licenseExpiryDate = new Date(value);
        if (isNaN(licenseExpiryDate.getTime())) return "Ngày hết hạn GPLX không hợp lệ";
        if (licenseExpiryDate <= today) return "GPLX đã hết hạn, vui lòng gia hạn trước khi đăng ký";
        const tenYearsLater = new Date(today);
        tenYearsLater.setFullYear(today.getFullYear() + 10);
        if (licenseExpiryDate > tenYearsLater) return "Ngày hết hạn GPLX không được quá 10 năm từ hiện tại";
        return "";


      case 'DateOfBirth':
        if (!value) return "Vui lòng nhập ngày sinh";
        const dob = new Date(value);
        if (isNaN(dob.getTime())) return "Ngày sinh không hợp lệ";
        if (dob > today) return "Ngày sinh không được là ngày trong tương lai";
        const age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        const dayDiff = today.getDate() - dob.getDate();
        if (age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0))))
          return "Bạn phải ít nhất 18 tuổi để đăng ký";
        if (age > 100) return "Ngày sinh không hợp lý (tuổi vượt quá 100)";
        return "";


      case 'HouseNumber':
        if (!value) return "Vui lòng nhập số nhà và tên đường";
        if (!VALIDATION_CONFIG.houseNumber.pattern.test(value) || value.length > VALIDATION_CONFIG.houseNumber.maxLength)
          return VALIDATION_CONFIG.houseNumber.message;
        return "";


      case 'Ward':
        if (!value) return "Vui lòng nhập phường/xã";
        if (!VALIDATION_CONFIG.ward.pattern.test(value) || value.length > VALIDATION_CONFIG.ward.maxLength)
          return VALIDATION_CONFIG.ward.message;
        return "";


      case 'District':
        if (!value) return "Vui lòng nhập quận/huyện";
        if (!VALIDATION_CONFIG.district.pattern.test(value) || value.length > VALIDATION_CONFIG.district.maxLength)
          return VALIDATION_CONFIG.district.message;
        return "";


      case 'City':
        if (!value) return "Vui lòng nhập tỉnh/thành phố";
        if (!VALIDATION_CONFIG.city.pattern.test(value) || value.length > VALIDATION_CONFIG.city.maxLength)
          return VALIDATION_CONFIG.city.message;
        return "";


      case 'BankName':
        if (!value) return "Vui lòng chọn ngân hàng";
        if (!BANK_LIST.includes(value)) return "Ngân hàng không hợp lệ";
        return "";


      case 'VehicleType':
        if (!value) return "Vui lòng chọn loại phương tiện";
        if (!VEHICLE_TYPES.includes(value)) return "Loại phương tiện không hợp lệ";
        return "";


      case 'DriverLicenseImage':
      case 'VehicleRegistrationImage':
      case 'ImageShipper':
      case 'IDCardImage':
        if (!value) return `Vui lòng nhập URL ảnh ${name === 'DriverLicenseImage' ? 'GPLX' : name === 'VehicleRegistrationImage' ? 'đăng ký xe' : name === 'ImageShipper' ? 'chân dung' : 'CCCD'}`;
        if (!VALIDATION_CONFIG.imageUrl.pattern.test(value) || value.length > VALIDATION_CONFIG.imageUrl.maxLength)
          return VALIDATION_CONFIG.imageUrl.message;
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

  const handleBlur = async (e) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    let error = validateField(name, value);

    // Real-time checking for PhoneNumber, Email, and CitizenID
    if (name === 'PhoneNumber' && !error && value) {
      const phoneExists = await checkPhoneExists(value);
      if (phoneExists) {
        error = "Số điện thoại đã được đăng ký";
      }
    }

    if (name === 'Email' && !error && value) {
      const emailExists = await checkEmailExists(value);
      if (emailExists) {
        error = "Email đã được đăng ký";
      }
    }

    if (name === 'CitizenID' && !error && value) {
      const citizenIdExists = await checkCitizenIDExists(value);
      if (citizenIdExists) {
        error = "Số CCCD đã được đăng ký";
      }
    }

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
      // Check if phone number exists
      const phoneExists = await checkPhoneExists(formData.PhoneNumber);
      if (phoneExists) {
        setErrors(prev => ({
          ...prev,
          PhoneNumber: "Số điện thoại đã được đăng ký"
        }));
        toast.error("Số điện thoại đã được đăng ký");
        return;
      }

      // Check if email exists (if provided)
      if (formData.Email) {
        const emailExists = await checkEmailExists(formData.Email);
        if (emailExists) {
          setErrors(prev => ({
            ...prev,
            Email: "Email đã được đăng ký"
          }));
          toast.error("Email đã được đăng ký");
          return;
        }
      }

      // Check if CitizenID exists
      const citizenIdExists = await checkCitizenIDExists(formData.CitizenID);
      if (citizenIdExists) {
        setErrors(prev => ({
          ...prev,
          CitizenID: "Số CCCD đã được đăng ký"
        }));
        toast.error("Số CCCD đã được đăng ký");
        return;
      }
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
        setShowConfirmation(true);
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
    <div className="shipperRegister-shipper-register-container">
      <Header />
      <main className="shipperRegister-register-main">
        <div className="shipperRegister-register-form-container">
          <form onSubmit={handleSubmit} className="shipperRegister-register-form">
            <h1 className="shipperRegister-form-title">Đăng Ký Tài Khoản Shipper</h1>

            {/* Personal Information Section */}
            <section className="shipperRegister-form-section">
              <h2>Thông tin cá nhân</h2>
              <div className="shipperRegister-input-grid">
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
            <section className="shipperRegister-form-section">
              <h2>Địa chỉ</h2>
              <div className="shipperRegister-input-grid">
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
            <section className="shipperRegister-form-section">
              <h2>Thông tin ngân hàng</h2>
              <div className="shipperRegister-input-grid">
                <div className="shipperRegister-input-wrapper">
                  <label htmlFor="BankName">
                    Ngân hàng <span className="shipperRegister-required">*</span>
                  </label>
                  <select
                    id="BankName"
                    name="BankName"
                    value={formData.BankName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`shipperRegister-form-input ${errors.BankName ? 'shipperRegister-error' : ''}`}
                    required
                  >
                    <option value="">Chọn ngân hàng</option>
                    {BANK_LIST.map(bank => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                  {errors.BankName && (
                    <span className="shipperRegister-error-message">{errors.BankName}</span>
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
            <section className="shipperRegister-form-section">
              <h2>Thông tin phương tiện</h2>
              <div className="shipperRegister-input-grid">
                <div className="shipperRegister-input-wrapper">
                  <label htmlFor="VehicleType">
                    Loại phương tiện <span className="shipperRegister-required">*</span>
                  </label>
                  <select
                    id="VehicleType"
                    name="VehicleType"
                    value={formData.VehicleType}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`shipperRegister-form-input ${errors.VehicleType ? 'shipperRegister-error' : ''}`}
                    required
                  >
                    <option value="">Chọn loại phương tiện</option>
                    {VEHICLE_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.VehicleType && (
                    <span className="shipperRegister-error-message">{errors.VehicleType}</span>
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
            <section className="shipperRegister-form-section">
              <h2>Giấy tờ tùy thân</h2>
              <div className="shipperRegister-input-grid">
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
            <section className="shipperRegister-form-section">
              <h2>Bảo mật</h2>
              <div className="shipperRegister-input-grid">
                <div className="shipperRegister-password-input-wrapper">
                  <label htmlFor="Password">
                    Mật khẩu <span className="shipperRegister-required">*</span>
                  </label>
                  <div className="shipperRegister-password-input-container">
                    <input
                      id="Password"
                      name="Password"
                      type={showPassword ? "text" : "password"}
                      value={formData.Password}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`shipperRegister-form-input ${errors.Password ? 'shipperRegister-error' : ''}`}
                      required
                      placeholder="Nhập mật khẩu"
                    />
                    <button
                      type="button"
                      className="shipperRegister-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.Password && (
                    <span className="shipperRegister-error-message">{errors.Password}</span>
                  )}
                </div>

                <div className="shipperRegister-password-input-wrapper">
                  <label htmlFor="ConfirmPassword">
                    Xác nhận mật khẩu <span className="shipperRegister-required">*</span>
                  </label>
                  <div className="shipperRegister-password-input-container">
                    <input
                      id="ConfirmPassword"
                      name="ConfirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.ConfirmPassword}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`shipperRegister-form-input ${errors.ConfirmPassword ? 'shipperRegister-error' : ''}`}
                      required
                      placeholder="Nhập lại mật khẩu"
                    />
                    <button
                      type="button"
                      className="shipperRegister-password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.ConfirmPassword && (
                    <span className="shipperRegister-error-message">{errors.ConfirmPassword}</span>
                  )}
                </div>
              </div>
            </section>
            {
              showConfirmation && (
                <div className="shipperRegister-confirmation-modal">
                  <div className="shipperRegister-confirmation-content">
                    <p>YÊU CẦU CỦA BẠN ĐANG CHỜ XÁC NHẬN. VUI LÒNG ĐỢI!</p>
                    <button
                      type="button"
                      className="shipperRegister-confirmation-button"
                      onClick={() => navigate('/home')}
                    >
                      OK
                    </button>
                  </div>
                </div>
              )
            }
            <button type="submit" className="shipperRegister-submit-button">
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