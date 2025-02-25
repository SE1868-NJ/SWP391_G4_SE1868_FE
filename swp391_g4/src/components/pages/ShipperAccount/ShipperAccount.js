import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../header/Header";
import Footer from "../../footer/Footer";
import "../../../styles/ShipperAccount.css";
import axios from 'axios'; 

const formatData = {
  date: (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  },
  currency: (amount) => {
    if (!amount || isNaN(amount)) return "0 VNĐ";
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  },
};

// Cancel Account Popup Component
const CancelAccountPopup = ({ onClose, onConfirm, isSubmitting }) => {
  const [cancelReason, setCancelReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  const cancelReasons = [
    { id: 'inactive', label: 'Không còn hoạt động' },
    { id: 'unsatisfied', label: 'Không hài lòng với dịch vụ' },
    { id: 'income_unsatisfied', label: 'Không hài lòng với thu nhập' },
    { id: 'workload_too_heavy', label: 'Khối lượng công việc quá tải' },
    { id: 'system_issue', label: 'Vấn đề với hệ thống hoặc ứng dụng' },
    { id: 'work_condition', label: 'Điều kiện làm việc không thoải mái' },
    { id: 'customer_issue', label: 'Vấn đề với khách hàng' },
    { id: 'other', label: 'Lý do khác' }
  ];

  const handleSubmit = () => {
    const finalReason = cancelReason === 'other' ? otherReason : cancelReason;
    onConfirm(finalReason);
  };

  const isValid = cancelReason && (cancelReason !== 'other' || otherReason.trim());

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Hủy tài khoản</h2>
        <p>Vui lòng cho chúng tôi biết lý do bạn muốn hủy tài khoản:</p>
        
        <div className="reason-options">
          {cancelReasons.map(reason => (
            <div key={reason.id} className="reason-option">
              <input
                type="radio"
                id={reason.id}
                name="cancelReason"
                value={reason.id}
                checked={cancelReason === reason.id}
                onChange={(e) => setCancelReason(e.target.value)}
              />
              <label htmlFor={reason.id}>{reason.label}</label>
            </div>
          ))}
        </div>

        {cancelReason === 'other' && (
          <textarea
            placeholder="Vui lòng nhập lý do của bạn..."
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            className="other-reason-input"
          />
        )}

        <div className="popup-actions">
          <button 
            className="cancel-button"
            onClick={handleSubmit}
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận hủy'}
          </button>
          <button className="close-button" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const ShipperAccount = () => {
  const navigate = useNavigate();
  const [shipperData, setShipperData] = useState(null);
  const [selectedSection, setSelectedSection] = useState('personal-info');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false); 


  const navItems = [
    { id: 'personal-info', label: 'Thông tin cá nhân' },
    { id: 'vehicle-info', label: 'Thông tin phương tiện' },
    { id: 'address-info', label: 'Địa chỉ' },
    { id: 'bank-info', label: 'Thông tin ngân hàng' },
    { id: 'documents', label: 'Giấy tờ' }
  ];

  useEffect(() => {
    const fetchShipperData = async () => {
      try {
        const shipperId = localStorage.getItem('shipperId');
        if (!shipperId) {
          navigate('/login');
          return;
        }
        axios.interceptors.response.use(
          response => response,
          error => {
            console.error('Axios error:', error);
            if (error.response?.status === 401) {
              localStorage.removeItem('shipperId');
              navigate('/login');
            }
            return Promise.reject(error);
          }
        );
        const response = await axios.get(`http://localhost:5000/api/shippers/${shipperId}`, {
          headers: {
            'Content-Type': 'application/json',
            // Thêm token nếu cần
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          }
        });

        if (response.data.success) {
          setShipperData(response.data.data);
        } else {
          throw new Error(response.data.message || 'Không thể tải thông tin');
        }
      } catch (err) {
        setError(err.message || 'Đã xảy ra lỗi khi tải thông tin');
        console.error('Error fetching shipper data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShipperData();
  }, [navigate]);

  const handleCancelAccount = async (reason) => {
    setIsSubmitting(true);
    try {
      const shipperId = localStorage.getItem('shipperId');
      const response = await axios.put(
        `http://localhost:5000/api/shippers/${shipperId}/cancel`,
        {
          reason,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setShowCancelPopup(false);  // Hide the popup
        setShowConfirmationMessage(true);  // Show confirmation message
      } else {
        throw new Error(response.data.message || 'Không thể hủy tài khoản');
      }
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi khi hủy tài khoản');
      console.error('Error canceling account:', err);
    } finally {
      setIsSubmitting(false);
      setShowCancelPopup(false);
    }
  };
  const handleOkClick = () => {
    navigate('/home'); // Redirect to the ShipperAccount page
  };
  
  const InfoItem = ({ label, value }) => (
    <div className="info-item">
      <span className="label">{label}:</span>
      <span className="value">{value || "Chưa cập nhật"}</span>
    </div>
  );

  const DocumentItem = ({ title, image }) => {
    if (!image) return null;
    return (
      <div className="document-item">
        <h3>{title}</h3>
        <img src={image} alt={title} className="document-image" />
      </div>
    );
  };

  const renderSectionContent = () => {
    if (!shipperData) return null;

    const sections = {
      'personal-info': (
        <div className="section-content">
          <h2>Thông tin cá nhân</h2>
          <div className="info-grid">
            <InfoItem label="Họ và tên" value={shipperData.FullName} />
            <InfoItem label="Ngày sinh" value={formatData.date(shipperData.DateOfBirth)} />
            <InfoItem label="Số điện thoại" value={shipperData.PhoneNumber} />
            <InfoItem label="Email" value={shipperData.Email} />
            <InfoItem label="Căn cước công dân" value={shipperData.CitizenID} />
          </div>
        </div>
      ),
      'vehicle-info': (
        <div className="section-content">
          <h2>Thông tin phương tiện</h2>
          <div className="info-grid">
            <InfoItem label="Loại xe" value={shipperData.VehicleType} />
            <InfoItem label="Biển số xe" value={shipperData.LicensePlate} />
            <InfoItem label="Số GPLX" value={shipperData.LicenseNumber} />
            <InfoItem label="Ngày hết hạn GPLX" value={formatData.date(shipperData.LicenseExpiryDate)} />
            <InfoItem label="Ngày hết hạn đăng kiểm xe" value={formatData.date(shipperData.ExpiryVehicle)} />
          </div>
        </div>
      ),
      'address-info': (
        <div className="section-content">
          <h2>Địa chỉ</h2>
          <div className="info-grid">
            <InfoItem label="Số nhà" value={shipperData.HouseNumber} />
            <InfoItem label="Phường/Xã" value={shipperData.Ward} />
            <InfoItem label="Quận/Huyện" value={shipperData.District} />
            <InfoItem label="Tỉnh/Thành phố" value={shipperData.City} />
          </div>
        </div>
      ),
      'bank-info': (
        <div className="section-content">
          <h2>Thông tin ngân hàng</h2>
          <div className="info-grid">
            <InfoItem label="Tên ngân hàng" value={shipperData.BankName} />
            <InfoItem label="Số tài khoản" value={shipperData.BankAccountNumber} />
          </div>
        </div>
      ),
      'documents': (
        <div className="section-content">
          <h2>Giấy tờ</h2>
          <div className="documents-grid">
            <DocumentItem 
              title="Giấy phép lái xe"
              image={shipperData.DriverLicenseImage}
            />
            <DocumentItem 
              title="Đăng ký xe"
              image={shipperData.VehicleRegistrationImage}
            />
            <DocumentItem 
              title="Ảnh thẻ Shipper"
              image={shipperData.ImageShipper}
            />
          </div>
        </div>
      )
    };

    return sections[selectedSection] || sections['personal-info'];
  };

  if (loading) {
    return (
      <div className="shipper-container">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="shipper-container">
        <Header />
        <div className="error-container">
          <p>Lỗi: {error}</p>
          <button onClick={() => window.location.reload()}>Tải lại</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="shipper-container">
      <Header />
      <main className="shipper-main">
        {/* Show confirmation popup after successful cancellation */}
        {showConfirmationMessage && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h2>TÀI KHOẢN CỦA BẠN ĐANG CHỜ XÁC NHẬN. VUI LÒNG ĐỢI.</h2>
              <button className="ok-button" onClick={handleOkClick}>OK</button>
            </div>
          </div>
        )}
  
        {/* Display the normal layout if no confirmation message */}
        {!showConfirmationMessage && (
          <div className="shipper-account-layout">
            <div className="left-sidebar">
              {navItems.map(item => (
                <div
                  key={item.id}
                  className={`sidebar-item ${selectedSection === item.id ? 'active' : ''}`}
                  onClick={() => setSelectedSection(item.id)}
                >
                  {item.label}
                </div>
              ))}
            </div>
            <div className="right-content">
              {renderSectionContent()}
            </div>
          </div>
        )}
      </main>
      
  
      {showCancelPopup && (
        <CancelAccountPopup 
          onClose={() => setShowCancelPopup(false)}
          onConfirm={handleCancelAccount}
          isSubmitting={isSubmitting}
        />
      )}
  
      {/* Update and Cancel Account Buttons */}
      {!showConfirmationMessage && (
        <div className="account-actions">
          <button 
            className="update-button"
            onClick={() => navigate('/update-shipper-info')}
          >
            Cập nhật thông tin
          </button>
          <button 
            className="cancel-account-button"
            onClick={() => setShowCancelPopup(true)}
          >
            Hủy tài khoản
          </button>
        </div>
      )}
      <Footer />
    </div>
    
  );
  
  
};

export default ShipperAccount;