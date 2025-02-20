import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../header/Header";
import Footer from "../../footer/Footer";
import "../../../styles/UpdateShipperInfo.css";
import { toast } from 'react-toastify';
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
  }
};

const BANK_LIST = [
  "Vietcombank",
  "Techcombank",
  "BIDV",
  "Agribank",
  "VPBank",
  "ACB",
  "MBBank",
  "TPBank"
];

const VEHICLE_TYPES = [
  "Xe máy",
  "Xe tải nhỏ",
  "Xe tải lớn",
  "Xe van"
];

const FILE_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
  errorMessages: {
    type: "Chỉ chấp nhận file JPG, JPEG hoặc PNG",
    size: "Kích thước file không được vượt quá 5MB"
  }
};

// FormInput Component
const FormInput = ({ label, name, type, value, onChange, onBlur, error, required = false, className = "", placeholder = "", maxLength, ...props }) => (
  <div className="input-wrapper">
    <label htmlFor={name}>
      {label} {required && <span className="required">*</span>}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value || ''}
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

const UpdateShipperInfo = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
    ImageShipper: null
  });

  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [previewImages, setPreviewImages] = useState({
    DriverLicenseImage: null,
    VehicleRegistrationImage: null,
    ImageShipper: null
  });

  // Fetch current shipper data
  useEffect(() => {
    const fetchShipperData = async () => {
      try {
        const shipperId = localStorage.getItem('shipperId');
        if (!shipperId) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/shippers/${shipperId}`);
        
        if (response.data.success) {
          const shipperData = response.data.data;
          setFormData(prev => ({
            ...prev,
            ...shipperData,
            DateOfBirth: shipperData.DateOfBirth ? new Date(shipperData.DateOfBirth).toISOString().split('T')[0] : '',
            RegistrationVehicle: shipperData.RegistrationVehicle ? new Date(shipperData.RegistrationVehicle).toISOString().split('T')[0] : '',
            ExpiryVehicle: shipperData.ExpiryVehicle ? new Date(shipperData.ExpiryVehicle).toISOString().split('T')[0] : '',
            LicenseExpiryDate: shipperData.LicenseExpiryDate ? new Date(shipperData.LicenseExpiryDate).toISOString().split('T')[0] : ''
          }));

          // Set preview images
          setPreviewImages({
            DriverLicenseImage: shipperData.DriverLicenseImage,
            VehicleRegistrationImage: shipperData.VehicleRegistrationImage,
            ImageShipper: shipperData.ImageShipper
          });
        }
      } catch (error) {
        toast.error("Không thể tải thông tin shipper");
      } finally {
        setLoading(false);
      }
    };

    fetchShipperData();
  }, [navigate]);

  // Validation
  const validateField = (name, value) => {
    if (!value && name !== 'Email') {
      return `Vui lòng nhập ${name}`;
    }

    switch (name) {
      case 'FullName':
        if (!VALIDATION_CONFIG.fullName.pattern.test(value)) {
          return VALIDATION_CONFIG.fullName.message;
        }
        break;

      case 'PhoneNumber':
        if (!VALIDATION_CONFIG.phone.pattern.test(value)) {
          return VALIDATION_CONFIG.phone.message;
        }
        break;

      case 'Email':
        if (value && !VALIDATION_CONFIG.email.pattern.test(value)) {
          return VALIDATION_CONFIG.email.message;
        }
        break;

      case 'LicensePlate':
        if (!VALIDATION_CONFIG.licensePlate.pattern.test(value)) {
          return VALIDATION_CONFIG.licensePlate.message;
        }
        break;

      case 'LicenseNumber':
        if (!VALIDATION_CONFIG.licenseNumber.pattern.test(value)) {
          return VALIDATION_CONFIG.licenseNumber.message;
        }
        break;

      case 'BankAccountNumber':
        if (!VALIDATION_CONFIG.bankAccount.pattern.test(value)) {
          return VALIDATION_CONFIG.bankAccount.message;
        }
        break;

      default:
        break;
    }

    return "";
  };

  // Event handlers
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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      if (!FILE_CONFIG.allowedTypes.includes(file.type)) {
        toast.error(FILE_CONFIG.errorMessages.type);
        return;
      }
      if (file.size > FILE_CONFIG.maxSize) {
        toast.error(FILE_CONFIG.errorMessages.size);
        return;
      }

      setFormData(prev => ({ ...prev, [name]: file }));
      setPreviewImages(prev => ({
        ...prev,
        [name]: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      if (field !== 'Email' && !formData[field]) {
        newErrors[field] = `Vui lòng nhập ${field}`;
      } else {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    try {
      const shipperId = localStorage.getItem('shipperId');
      const formDataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        if (formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        } else if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.put(
        `http://localhost:5000/api/shippers/${shipperId}/update`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast.success("Cập nhật thông tin thành công");
        navigate('/shipper-account');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật thông tin thất bại");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div className="update-shipper-container">
      <Header />
      <main className="update-main">
        <div className="update-form-container">
          <form onSubmit={handleSubmit} className="update-form">
            <h1 className="form-title">Cập Nhật Thông Tin</h1>

            {/* Thông tin cá nhân */}
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
                />
                <FormInput
                  label="Email"
                  name="Email"
                  type="email"
                  value={formData.Email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.Email}
                  maxLength={100}
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
                />
              </div>
            </section>

            {/* Địa chỉ */}
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
                  maxLength={50}
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
                  maxLength={100}
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
                  maxLength={100}
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
                  maxLength={100}
                />
              </div>
            </section>

            {/* Thông tin ngân hàng */}
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
                  maxLength={20}
                />
              </div>
            </section>

            {/* Thông tin phương tiện */}
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
                  maxLength={15}
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
                  maxLength={20}
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

            {/* Giấy tờ */}
            <section className="form-section">
              <h2>Giấy tờ</h2>
              <div className="input-grid">
                <div className="file-input-wrapper">
                  <label>
                    Ảnh GPLX {!previewImages.DriverLicenseImage && <span className="required">*</span>}
                  </label>
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
                      className="image-preview"
                    />
                  )}
                </div>

                <div className="file-input-wrapper">
                  <label>
                    Ảnh đăng ký xe {!previewImages.VehicleRegistrationImage && <span className="required">*</span>}
                  </label>
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
                      className="image-preview"
                    />
                  )}
                </div>

                <div className="file-input-wrapper">
                  <label>
                    Ảnh thẻ Shipper {!previewImages.ImageShipper && <span className="required">*</span>}
                  </label>
                  <input
                    type="file"
                    name="ImageShipper"
                    onChange={handleFileChange}
                    accept="image/*"
                    className={errors.ImageShipper ? 'error' : ''}
                  />
                  {previewImages.ImageShipper && (
                    <img
                      src={previewImages.ImageShipper}
                      alt="Shipper Image Preview"
                      className="image-preview"
                    />
                  )}
                </div>
              </div>
            </section>

            <div className="form-actions">
              <button type="submit" className="submit-button">
                Cập Nhật
              </button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => navigate('/shipper-account')}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UpdateShipperInfo;