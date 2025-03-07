import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../header/Header";
import Footer from "../../footer/Footer";
import "../../../styles/UpdateShipperInfo.css";
import { toast } from 'react-toastify';
import axios from 'axios';


// Constants for validation and configuration
const VALIDATION_CONFIG = {
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
    pattern: /^[0-9]{2}[A-Z][0-9]-[0-9]{4,5}$/,
    maxLength: 15,
    message: "Biển số xe không hợp lệ (VD: 51F1-12345)"
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

// FormInput Component
const FormInput = ({ label, name, type, value, onChange, onBlur, error, required = false, className = "", placeholder = "", maxLength, ...props }) => (
  <div className="UpdateShipperInfo-input-wrapper">
    <label htmlFor={name}>
      {label} {required && <span className="UpdateShipperInfo-required">*</span>}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value || ''}
      onChange={onChange}
      onBlur={onBlur}
      className={`UpdateShipperInfo-form-input ${error ? 'error' : ''} ${className}`}
      placeholder={placeholder}
      required={required}
      maxLength={maxLength}
      {...props}
    />
    {error && <span className="UpdateShipperInfo-error-message">{error}</span>}
  </div>
 );

// UpdateField Component để hiển thị trường thông tin và nút cập nhật
const UpdateField = ({ label, value, canUpdate, onUpdate, type = "text" }) => (
  <div className="UpdateShipperInfo-field-container">
    <div className="UpdateShipperInfo-field-info">
      <span className="UpdateShipperInfo-field-label">{label}:</span>
      <span className="UpdateShipperInfo-field-value">{value || "Chưa có thông tin"}</span>
    </div>
    {canUpdate && (
      <button
        type="button"
        className="UpdateShipperInfo-update-field-btn"
        onClick={onUpdate}
      >
        Cập nhật
      </button>
    )}
  </div>
 );

const UpdateShipperInfo = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [shipperData, setShipperData] = useState({});
  const [updateData, setUpdateData] = useState({});
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  // Navigation Items
    const newsNavigationItems = [
      { text: "Trang chủ", path: "/home" },
      { text: "Về chúng tôi", path: "/about" },
      { text: "Tin tức", path: "/news", isActive: true },
      { text: "Liên hệ", path: "/shipper-contact" },
    ];
  
    // Login Popup State
    const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  
    const openLoginPopup = () => {
      setIsLoginPopupOpen(true);
    };
  
    const closeLoginPopup = () => {
      setIsLoginPopupOpen(false);
    };

  // State để theo dõi các trường đang được cập nhật
  const [activeUpdateFields, setActiveUpdateFields] = useState({
    PhoneNumber: false,
    Email: false,
    Ward: false,
    District: false,
    City: false,
    BankName: false,
    BankAccountNumber: false,
    VehicleType: false,
    LicensePlate: false,
    RegistrationVehicle: false,
    ExpiryVehicle: false,
    VehicleRegistrationImage: false,
    ImageShipper: false
  });

  // Fetch current shipper data
  useEffect(() => {
    const fetchShipperData = async () => {
      try {
        const shipperId = localStorage.getItem('shipperId');
        const token = localStorage.getItem('token');

        const formatDate = (dateString) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
          return localDate.toISOString().split('T')[0];
        };

        const getImageUrl = (imagePath) => {
          if (!imagePath) return '';
          return imagePath;
        };

        const response = await axios.get(`http://localhost:4000/api/shippers-auth/${shipperId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          const data = response.data.data;

          const formattedData = {
            ...data,
            RegistrationVehicle: formatDate(data.RegistrationVehicle),
            ExpiryVehicle: formatDate(data.ExpiryVehicle),
            DateOfBirth: formatDate(data.DateOfBirth),
            LicenseExpiryDate: formatDate(data.LicenseExpiryDate),

            VehicleRegistrationImage: getImageUrl(data.VehicleRegistrationImage),
            ImageShipper: getImageUrl(data.ImageShipper),
            DriverLicenseImage: getImageUrl(data.DriverLicenseImage)
          };

          setShipperData(formattedData);

          setUpdateData({
            TempPhoneNumber: formattedData.PhoneNumber || '',
            TempEmail: formattedData.Email || '',
            TempWard: formattedData.Ward || '',
            TempDistrict: formattedData.District || '',
            TempCity: formattedData.City || '',
            TempBankName: formattedData.BankName || '',
            TempBankAccountNumber: formattedData.BankAccountNumber || '',
            TempVehicleType: formattedData.VehicleType || '',
            TempLicensePlate: formattedData.LicensePlate || '',
            TempRegistrationVehicle: formattedData.RegistrationVehicle,
            TempExpiryVehicle: formattedData.ExpiryVehicle,
            TempVehicleRegistrationImage: formattedData.VehicleRegistrationImage,
            TempImageShipper: formattedData.ImageShipper
          });
        }
      } catch (error) {
        console.error("Error fetching shipper data:", error);
        toast.error("Không thể tải thông tin shipper");
      } finally {
        setLoading(false);
      }
    };

    fetchShipperData();
  }, [navigate]);

  // Toggle update field
  const toggleUpdateField = (field) => {
    setActiveUpdateFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Validation
  const validateField = (name, value) => {
    // Skip validation if field is empty
    if (!value && name !== 'TempEmail') {
      return "";
    }

    switch (name) {
      case 'TempPhoneNumber':
        if (!VALIDATION_CONFIG.phone.pattern.test(value)) {
          return VALIDATION_CONFIG.phone.message;
        }
        break;

      case 'TempEmail':
        if (value && !VALIDATION_CONFIG.email.pattern.test(value)) {
          return VALIDATION_CONFIG.email.message;
        }
        break;

      case 'TempLicensePlate':
        if (!VALIDATION_CONFIG.licensePlate.pattern.test(value)) {
          return VALIDATION_CONFIG.licensePlate.message;
        }
        break;

      case 'TempBankAccountNumber':
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
    setUpdateData(prev => ({ ...prev, [name]: value }));

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

    // Validate all active fields
    const newErrors = {};
    const tempFields = Object.keys(updateData);

    tempFields.forEach(field => {
      // Chỉ xác thực các trường được kích hoạt
      const originalField = field.replace('Temp', '');
      if (activeUpdateFields[originalField]) {
        const error = validateField(field, updateData[field]);
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
      const token = localStorage.getItem('token');

      if (!shipperId || !token) {
        navigate('/login');
        return;
      }

      // Chỉ gửi các trường thực sự được thay đổi
      const dataToUpdate = {};

      Object.keys(activeUpdateFields).forEach(field => {
        if (activeUpdateFields[field]) {
          const tempField = `Temp${field}`;
          dataToUpdate[tempField] = updateData[tempField];
        }
      });

      // Nếu không có trường nào được cập nhật
      if (Object.keys(dataToUpdate).length === 0) {
        toast.info("Không có thông tin nào được cập nhật");
        return;
      }

      console.log("Sending update to:", `http://localhost:4000/api/shippers/${shipperId}/update`);
      console.log("Update data:", dataToUpdate);

      const response = await axios.put(
        `http://localhost:4000/api/shippers/${shipperId}/update`,
        dataToUpdate,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setShowConfirmPopup(true);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Cập nhật thông tin thất bại");
    }
  };

  const handleConfirmPopup = () => {
    setShowConfirmPopup(false);
    navigate('/shipper-account');
  };

  if (loading) {
    return (
      <div className="UpdateShipperInfo-loading-container">
        <div className="UpdateShipperInfo-loading-spinner"></div>
        <p>Đang tải thông tin...</p>
      </div>
    );
  }
  console.log('Shipper Data:', shipperData);

  return (
    <div className="UpdateShipperInfo-container">
       <div className='header'>
            <Header
              navigationItems={newsNavigationItems}
              showLoginButton={true}
              onLoginClick={openLoginPopup}
            />
            </div>
      <main className="UpdateShipperInfo-main">
        {showConfirmPopup && (
          <div className="UpdateShipperInfo-confirm-popup-overlay">
            <div className="UpdateShipperInfo-confirm-popup">
              <div className="UpdateShipperInfo-confirm-popup-content">
                <h2>YÊU CẦU CỦA BẠN ĐANG CHỜ XÁC NHẬN</h2>
                <p>VUI LÒNG ĐỢI!</p>
                <button
                  className="UpdateShipperInfo-confirm-button"
                  onClick={handleConfirmPopup}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="UpdateShipperInfo-form-container">
          <form onSubmit={handleSubmit} className="UpdateShipperInfo-form">
            <h1 className="UpdateShipperInfo-form-title">Thông Tin Shipper</h1>
 
            {/* Thông tin cá nhân (chỉ xem) */}
            <section className="UpdateShipperInfo-form-section">
              <h2>Thông tin cá nhân</h2>
              <div className="UpdateShipperInfo-info-grid">
                <UpdateField
                  label="Họ và tên"
                  value={shipperData.FullName}
                  canUpdate={false}
                />
                <UpdateField
                  label="Ngày sinh"
                  value={shipperData.DateOfBirth}
                  type="date"
                  canUpdate={false}
                />
                <UpdateField
                  label="CCCD"
                  value={shipperData.CitizenID}
                  canUpdate={false}
                />
                <UpdateField
                  label="Số GPLX"
                  value={shipperData.LicenseNumber}
                  canUpdate={false}
                />
                <UpdateField
                  label="Ngày hết hạn GPLX"
                  value={shipperData.LicenseExpiryDate}
                  type="date"
                  canUpdate={false}
                />
              </div>
            </section>
 
            {/* Thông tin liên lạc */}
            <section className="UpdateShipperInfo-form-section">
              <h2>Thông tin liên lạc</h2>
              <div className="UpdateShipperInfo-info-grid">
                <div className="UpdateShipperInfo-field-row">
                  <UpdateField
                    label="Số điện thoại"
                    value={shipperData.PhoneNumber}
                    canUpdate={true}
                    onUpdate={() => toggleUpdateField('PhoneNumber')}
                  />
 
                  {activeUpdateFields.PhoneNumber && (
                    <div className="UpdateShipperInfo-update-input-container">
                      <FormInput
                        label="Số điện thoại mới"
                        name="TempPhoneNumber"
                        type="tel"
                        value={updateData.TempPhoneNumber}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={errors.TempPhoneNumber}
                        maxLength={15}
                        required
                      />
                    </div>
                  )}
                </div>
 
                <div className="UpdateShipperInfo-field-row">
                <UpdateField
                    label="Email"
                    value={shipperData.Email}
                    canUpdate={true}
                    onUpdate={() => toggleUpdateField('Email')}
                  />

                  {activeUpdateFields.Email && (
                    <div className="UpdateShipperInfo-update-input-container">
                      <FormInput
                        label="Email mới"
                        name="TempEmail"
                        type="email"
                        value={updateData.TempEmail}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={errors.TempEmail}
                        maxLength={100}
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Địa chỉ */}
            <section className="UpdateShipperInfo-form-section">
              <h2>Địa chỉ</h2>
              <div className="UpdateShipperInfo-info-grid">
                <div className="UpdateShipperInfo-field-row">
                  <UpdateField
                    label="Số nhà, tên đường"
                    value={shipperData.HouseNumber}
                    canUpdate={true}
                    onUpdate={() => toggleUpdateField('HouseNumber')}
                  />

                  {activeUpdateFields.HouseNumber && (
                    <div className="UpdateShipperInfo-update-input-container">
                      <FormInput
                        label="Số nhà, tên đường mới"
                        name="TempHouseNumber"
                        type="text"
                        value={updateData.TempHouseNumber}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={errors.TempHouseNumber}
                        maxLength={200}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="UpdateShipperInfo-field-row">
                  <UpdateField
                    label="Phường/Xã"
                    value={shipperData.Ward}
                    canUpdate={true}
                    onUpdate={() => toggleUpdateField('Ward')}
                  />

                  {activeUpdateFields.Ward && (
                    <div className="UpdateShipperInfo-update-input-container">
                      <FormInput
                        label="Phường/Xã mới"
                        name="TempWard"
                        type="text"
                        value={updateData.TempWard}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={errors.TempWard}
                        maxLength={100}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="UpdateShipperInfo-field-row">
                  <UpdateField
                    label="Quận/Huyện"
                    value={shipperData.District}
                    canUpdate={true}
                    onUpdate={() => toggleUpdateField('District')}
                  />

                  {activeUpdateFields.District && (
                    <div className="UpdateShipperInfo-update-input-container">
                      <FormInput
                        label="Quận/Huyện mới"
                        name="TempDistrict"
                        type="text"
                        value={updateData.TempDistrict}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={errors.TempDistrict}
                        maxLength={100}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="UpdateShipperInfo-field-row">
                  <UpdateField
                    label="Tỉnh/Thành phố"
                    value={shipperData.City}
                    canUpdate={true}
                    onUpdate={() => toggleUpdateField('City')}
                  />

                  {activeUpdateFields.City && (
                    <div className="UpdateShipperInfo-update-input-container">
                      <FormInput
                        label="Tỉnh/Thành phố mới"
                        name="TempCity"
                        type="text"
                        value={updateData.TempCity}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={errors.TempCity}
                        maxLength={100}
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Thông tin ngân hàng */}
            <section className="UpdateShipperInfo-form-section">
              <h2>Thông tin ngân hàng</h2>
              <div className="UpdateShipperInfo-info-grid">
                <div className="UpdateShipperInfo-field-row">
                  <UpdateField
                    label="Ngân hàng"
                    value={shipperData.BankName}
                    canUpdate={true}
                    onUpdate={() => toggleUpdateField('BankName')}
                  />

                  {activeUpdateFields.BankName && (
                    <div className="UpdateShipperInfo-update-input-container">
                      <div className="UpdateShipperInfo-input-wrapper">
                        <label htmlFor="TempBankName">
                          Ngân hàng mới <span className="UpdateShipperInfo-required">*</span>
                        </label>
                        <select
                          id="TempBankName"
                          name="TempBankName"
                          value={updateData.TempBankName}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={`UpdateShipperInfo-form-input ${errors.TempBankName ? 'error' : ''}`}
                          required
                        >
                          <option value="">Chọn ngân hàng</option>
                          {BANK_LIST.map(bank => (
                            <option key={bank} value={bank}>{bank}</option>
                          ))}
                        </select>
                        {errors.TempBankName && (
                          <span className="UpdateShipperInfo-error-message">{errors.TempBankName}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="UpdateShipperInfo-field-row">
                  <UpdateField
                    label="Số tài khoản"
                    value={shipperData.BankAccountNumber}
                    canUpdate={true}
                    onUpdate={() => toggleUpdateField('BankAccountNumber')}
                  />

                  {activeUpdateFields.BankAccountNumber && (
                    <div className="UpdateShipperInfo-update-input-container">
                      <FormInput
                        label="Số tài khoản mới"
                        name="TempBankAccountNumber"
                        type="text"
                        value={updateData.TempBankAccountNumber}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={errors.TempBankAccountNumber}
                        maxLength={20}
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Thông tin phương tiện */}
            <section className="UpdateShipperInfo-form-section">
              <h2>Thông tin phương tiện</h2>
              <div className="UpdateShipperInfo-info-grid">
                <div className="UpdateShipperInfo-field-row">
                  <UpdateField
                    label="Loại phương tiện"
                    value={shipperData.VehicleType}
                    canUpdate={true}
                    onUpdate={() => toggleUpdateField('VehicleType')}
                  />

                  {activeUpdateFields.VehicleType && (
                    <div className="UpdateShipperInfo-update-input-container">
                      <div className="UpdateShipperInfo-input-wrapper">
                        <label htmlFor="TempVehicleType">
                          Loại phương tiện mới <span className="UpdateShipperInfo-required">*</span>
                        </label>
                        <select
                          id="TempVehicleType"
                          name="TempVehicleType"
                          value={updateData.TempVehicleType}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={`UpdateShipperInfo-form-input ${errors.TempVehicleType ? 'error' : ''}`}
                          required
                        >
                          <option value="">Chọn loại phương tiện</option>
                          {VEHICLE_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        {errors.TempVehicleType && (
                          <span className="UpdateShipperInfo-error-message">{errors.TempVehicleType}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="UpdateShipperInfo-field-row">
                  <UpdateField
                    label="Biển số xe"
                    value={shipperData.LicensePlate}
                    canUpdate={true}
                    onUpdate={() => toggleUpdateField('LicensePlate')}
                  />

                  {activeUpdateFields.LicensePlate && (
                    <div className="UpdateShipperInfo-update-input-container">
                      <FormInput
                        label="Biển số xe mới"
                        name="TempLicensePlate"
                        type="text"
                        value={updateData.TempLicensePlate}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={errors.TempLicensePlate}
                        maxLength={15}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="UpdateShipperInfo-field-row">
                  <UpdateField
                    label="Ngày đăng kiểm xe"
                    value={shipperData.RegistrationVehicle}
                    type="date"
                    canUpdate={true}
                    onUpdate={() => toggleUpdateField('RegistrationVehicle')}
                  />

                  {activeUpdateFields.RegistrationVehicle && (
                    <div className="UpdateShipperInfo-update-input-container">
                      <FormInput
                        label="Ngày đăng kiểm xe mới"
                        name="TempRegistrationVehicle"
                        type="date"
                        value={updateData.TempRegistrationVehicle}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={errors.TempRegistrationVehicle}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="UpdateShipperInfo-field-row">
                  <UpdateField
                    label="Ngày hết hạn đăng kiểm"
                    value={shipperData.ExpiryVehicle}
                    type="date"
                    canUpdate={true}
                    onUpdate={() => toggleUpdateField('ExpiryVehicle')}
                  />

                  {activeUpdateFields.ExpiryVehicle && (
                    <div className="UpdateShipperInfo-update-input-container">
                      <FormInput
                        label="Ngày hết hạn đăng kiểm mới"
                        name="TempExpiryVehicle"
                        type="date"
                        value={updateData.TempExpiryVehicle}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={errors.TempExpiryVehicle}
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Giấy tờ */}
            <section className="UpdateShipperInfo-form-section">
              <h2>Giấy tờ (URL ảnh)</h2>
              <div className="UpdateShipperInfo-info-grid">
                <div className="UpdateShipperInfo-field-row">
                  <UpdateField
                    label="URL ảnh đăng ký xe"
                    value={shipperData.VehicleRegistrationImage}
                    canUpdate={true}
                    onUpdate={() => toggleUpdateField('VehicleRegistrationImage')}
                  />

                  {activeUpdateFields.VehicleRegistrationImage && (
                    <div className="UpdateShipperInfo-update-input-container">
                      <FormInput
                        label="URL ảnh đăng ký xe mới"
                        name="TempVehicleRegistrationImage"
                        type="text"
                        value={updateData.TempVehicleRegistrationImage}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={errors.TempVehicleRegistrationImage}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="UpdateShipperInfo-field-row">
                  <UpdateField
                    label="URL ảnh thẻ Shipper"
                    value={shipperData.ImageShipper}
                    canUpdate={true}
                    onUpdate={() => toggleUpdateField('ImageShipper')}
                  />

                  {activeUpdateFields.ImageShipper && (
                    <div className="UpdateShipperInfo-update-input-container">
                      <FormInput
                        label="URL ảnh thẻ Shipper mới"
                        name="TempImageShipper"
                        type="text"
                        value={updateData.TempImageShipper}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        error={errors.TempImageShipper}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="UpdateShipperInfo-field-row">
                  <UpdateField
                    label="URL ảnh GPLX"
                    value={shipperData.DriverLicenseImage}
                    canUpdate={false}
                  />
                </div>
              </div>
            </section>

            <div className="UpdateShipperInfo-form-actions">
              {Object.values(activeUpdateFields).some(value => value) && (
                <button type="submit" className="UpdateShipperInfo-submit-button">
                  Gửi Yêu Cầu Cập Nhật
                </button>
              )}
              <button
                type="button"
                className="UpdateShipperInfo-cancel-button"
                onClick={() => navigate('/shipper-account')}
              >
                Quay Lại
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