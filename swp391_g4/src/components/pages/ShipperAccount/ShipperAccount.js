import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../header/Header";
import Footer from "../../footer/Footer";
import "../../../styles/ShipperAccount.css";
import axios from 'axios';
import Qrcode from "../../../images/QRcode.png";
import { FaEye, FaEyeSlash, FaTimes, FaCheckCircle } from 'react-icons/fa';
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
    <div className="shipperAccount-popup-overlay">
      <div className="shipperAccount-popup-content">
        <h2>Hủy tài khoản</h2>
        <p>Vui lòng cho chúng tôi biết lý do bạn muốn hủy tài khoản:</p>

        <div className="shipperAccount-reason-options">
          {cancelReasons.map(reason => (
            <div key={reason.id} className="shipperAccount-reason-option">
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
            className="shipperAccount-other-reason-input"
          />
        )}

        <div className="shipperAccount-popup-actions">
          <button
            className="shipperAccount-cancel-button"
            onClick={handleSubmit}
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận hủy'}
          </button>
          <button className="shipperAccount-close-button" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const ShipperAccount = () => {
  const newsNavigationItems = [
    { text: "Trang chủ", path: "/home" },
    { text: "Về chúng tôi", path: "/about" },
    { text: "Tin tức", path: "/news", isActive: true },
    { text: "Liên hệ", path: "/shipper-contact" },
  ];
  const navigate = useNavigate();
  const [shipperData, setShipperData] = useState(null);
  const [selectedSection, setSelectedSection] = useState('personal-info');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
  const [isAccountCollapsed, setIsAccountCollapsed] = useState(false);
  const [walletData, setWalletData] = useState([]);
  const [totals, setTotals] = useState({ totalShippingFee: 0, totalExtraMoney: 0, totalBonus: 0 });
  const [totalWallet, setTotalWallet] = useState(0);
  const [filterDate, setFilterDate] = useState('');
  const [weekRange, setWeekRange] = useState('');
  const [isMoneyVisible, setIsMoneyVisible] = useState(false);
  const [showDepositPopup, setShowDepositPopup] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showWithdrawPopup, setShowWithdrawPopup] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [selectedWithdrawAmount, setSelectedWithdrawAmount] = useState(null);
  const [showWithdrawConfirmation, setShowWithdrawConfirmation] = useState(false);
  const [showWithdrawSuccess, setShowWithdrawSuccess] = useState(false);

  // Login Popup State
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);

  const openLoginPopup = () => {
    setIsLoginPopupOpen(true);
  };

  const closeLoginPopup = () => {
    setIsLoginPopupOpen(false);
  };

  useEffect(() => {
    const fetchShipperData = async () => {
      try {
        const shipperId = localStorage.getItem('shipperId');
        const token = localStorage.getItem('token');

        if (!shipperId || !token) {
          navigate('/login');
          return;
        }

        console.log('Fetching with Token:', token);
        console.log('Fetching Shipper ID:', shipperId);

        const response = await axios.get(`http://localhost:5000/api/shippers-auth/${shipperId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Full API Response:', response.data);

        if (response.data.success) {
          setShipperData(response.data.data);
        } else {
          throw new Error(response.data.message || 'Không thể tải thông tin');
        }
      } catch (err) {
        console.error('Detailed Fetch Error:', err.response ? err.response.data : err);
        setError(err.message || 'Đã xảy ra lỗi khi tải thông tin');
      } finally {
        setLoading(false);
      }
    };

    fetchShipperData();
  }, [navigate]);

  const fetchTotalWallet = async () => {
    try {
      const shipperId = localStorage.getItem('shipperId');
      const token = localStorage.getItem('token');

      if (!shipperId || !token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/shipper/${shipperId}/total-wallet`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      if (response.data.success) {
        setTotalWallet(response.data.data.totalWallet);
      } else {
        throw new Error(response.data.message || 'Không thể tải dữ liệu tổng ví');
      }
    } catch (err) {
      console.error('Fetch Total Wallet Error:', err);
      setTotalWallet(0); // Đặt mặc định là 0 nếu lỗi
    }
  };

  fetchTotalWallet();

  useEffect(() => {
    if (selectedSection === 'wallet') {
      fetchWalletData();
      fetchTotalWallet();
    }
  }, [selectedSection, filterDate, navigate]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const shipperId = localStorage.getItem('shipperId');
      const token = localStorage.getItem('token');

      if (!shipperId || !token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/shipper/${shipperId}/wallet`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: { week: filterDate }
      });
      if (response.data.success) {
        setWalletData(response.data.data.dailyData);
        setTotals(response.data.data.totals);
      } else {
        throw new Error(response.data.message || 'Không thể tải dữ liệu ví');
      }
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu ví');
    } finally {
      setLoading(false);
    }
  };
  const handleCancelAccount = async (reason) => {
    setIsSubmitting(true);
    try {
      const shipperId = localStorage.getItem('shipperId');
      const response = await axios.put(
        `http://localhost:5000/api/shippers-auth/${shipperId}/cancel`,
        {
          reason,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data.success) {
        setShowCancelPopup(false);
        setShowConfirmationMessage(true);
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
  const handleWithdraw = async () => {
    try {
      const shipperId = localStorage.getItem('shipperId');
      const token = localStorage.getItem('token');

      if (!shipperId || !token) {
        navigate('/login');
        return;
      }

      // Kiểm tra số dư ví có đủ không
      if (withdrawAmount > totalWallet) {
        setError('Số dư trong ví không đủ để thực hiện giao dịch');
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/shipper/${shipperId}/withdraw`,
        { amount: withdrawAmount },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setTotalWallet(response.data.data.newBalance);
        setShowWithdrawConfirmation(false);
        setShowWithdrawSuccess(true);
      } else {
        throw new Error(response.data.message || 'Không thể rút tiền');
      }
    } catch (err) {
      console.error('Error withdrawing money:', err);
      setError(err.message || 'Đã xảy ra lỗi khi rút tiền');
    }
  };
  const handleWithdrawSuccessOk = () => {
    setShowWithdrawSuccess(false);
    setShowWithdrawPopup(false);
    setSelectedSection('wallet');
  };
  const handlePaymentSuccessOk = () => {
    setShowPaymentSuccess(false);
    setShowDepositPopup(false);
    setSelectedSection('wallet');
  };
  const handleOkClick = () => {
    navigate('/home');
  };

  const InfoItem = ({ label, value }) => (
    <div className="shipperAccount-info-item">
      <span className="shipperAccount-label">{label}:</span>
      <span className="shipperAccount-value">{value || "Chưa cập nhật"}</span>
    </div>
  );

  const DocumentItem = ({ title, image }) => {
    if (!image) return null;
    return (
      <div className="shipperAccount-document-item">
        <h3>{title}</h3>
        <img src={image} alt={title} className="shipperAccount-document-image" />
      </div>
    );
  };
  const navItems = [
    { id: 'personal-info', label: 'Thông tin cá nhân' },
    { id: 'vehicle-info', label: 'Thông tin phương tiện' },
    { id: 'address-info', label: 'Địa chỉ' },
    { id: 'bank-info', label: 'Thông tin ngân hàng' },
    { id: 'documents', label: 'Giấy tờ' },
    { id: 'wallet', label: 'Ví của Shipper' }
  ];

  const handleAccountClick = () => {
    setIsAccountCollapsed(!isAccountCollapsed);
  };
  const handleCompletePayment = async () => {
    try {
      const shipperId = localStorage.getItem('shipperId');
      const token = localStorage.getItem('token');

      if (!shipperId || !token) {
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/shipper/${shipperId}/deposit`,
        { amount: depositAmount },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setTotalWallet(response.data.data.newBalance);
        setShowConfirmation(false);
        setShowPaymentSuccess(true);
      } else {
        throw new Error(response.data.message || 'Không thể nạp tiền');
      }
    } catch (err) {
      console.error('Error depositing money:', err);
      setError(err.message || 'Đã xảy ra lỗi khi nạp tiền');
    }
  };

  const getWeekRange = (weekString) => {
    if (!weekString) return '';
    const [year, week] = weekString.split('-W');
    const weekNum = parseInt(week, 10);
    const firstDayOfYear = new Date(year, 0, 1);
    const dayOfWeek = firstDayOfYear.getDay();
    const offset = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
    const firstMonday = new Date(firstDayOfYear);
    firstMonday.setDate(firstDayOfYear.getDate() + offset);
    const startDate = new Date(firstMonday);
    startDate.setDate(firstMonday.getDate() + (weekNum - 1) * 7);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    return `${formatData.date(startDate)} - ${formatData.date(endDate)}`;
  };

  useEffect(() => {
    setWeekRange(getWeekRange(filterDate));
  }, [filterDate]);

  const renderSectionContent = () => {
    if (!shipperData) return null;

    const sections = {
      'personal-info': (
        <div className="shipperAccount-section-content">
          <h2>Thông tin cá nhân</h2>
          <div className="shipperAccount-info-grid">
            <InfoItem label="Họ và tên" value={shipperData.FullName} />
            <InfoItem label="Ngày sinh" value={formatData.date(shipperData.DateOfBirth)} />
            <InfoItem label="Số điện thoại" value={shipperData.PhoneNumber} />
            <InfoItem label="Email" value={shipperData.Email} />
            <InfoItem label="Căn cước công dân" value={shipperData.CitizenID} />
          </div>
        </div>
      ),
      'vehicle-info': (
        <div className="shipperAccount-section-content">
          <h2>Thông tin phương tiện</h2>
          <div className="shipperAccount-info-grid">
            <InfoItem label="Loại xe" value={shipperData.VehicleType} />
            <InfoItem label="Biển số xe" value={shipperData.LicensePlate} />
            <InfoItem label="Số GPLX" value={shipperData.LicenseNumber} />
            <InfoItem label="Ngày hết hạn GPLX" value={formatData.date(shipperData.LicenseExpiryDate)} />
            <InfoItem label="Ngày hết hạn đăng kiểm xe" value={formatData.date(shipperData.ExpiryVehicle)} />
          </div>
        </div>
      ),
      'address-info': (
        <div className="shipperAccount-section-content">
          <h2>Địa chỉ</h2>
          <div className="shipperAccount-info-grid">
            <InfoItem label="Số nhà" value={shipperData.HouseNumber} />
            <InfoItem label="Phường/Xã" value={shipperData.Ward} />
            <InfoItem label="Quận/Huyện" value={shipperData.District} />
            <InfoItem label="Tỉnh/Thành phố" value={shipperData.City} />
          </div>
        </div>
      ),
      'bank-info': (
        <div className="shipperAccount-section-content">
          <h2>Thông tin ngân hàng</h2>
          <div className="shipperAccount-info-grid">
            <InfoItem label="Tên ngân hàng" value={shipperData.BankName} />
            <InfoItem label="Số tài khoản" value={shipperData.BankAccountNumber} />
          </div>
        </div>
      ),
      'documents': (
        <div className="shipperAccount-section-content">
          <h2>Giấy tờ</h2>
          <div className="shipperAccount-documents-grid">
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
      ),
      'wallet': (
        <div className="shipperAccount-section-content">
          <div className="shipperAccount-date-filter">
            <label htmlFor="filterWeek">Chọn tuần: </label>
            <input
              type="week"
              id="filterWeek"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
            {weekRange && <p>Ngày: {weekRange}</p>}
          </div>
          <div className="shipperAccount-wallet-table-container">
            <table className="shipperAccount-wallet-table">
              <thead>
                <tr>
                  <th>Ngày giao hàng</th>
                  <th>Tổng đơn hàng</th>
                  <th>Tổng phí giao hàng</th>
                  <th>Tổng tiền tip</th>
                  <th>Tổng theo ngày</th>
                </tr>
              </thead>
              <tbody>
                {walletData.length > 0 ? (
                  walletData.map((day) => (
                    <tr key={day.deliveryDate}>
                      <td>{formatData.date(day.deliveryDate)}</td>
                      <td>{day.orderCount}</td>
                      <td>{formatData.currency(day.totalShippingFee)}</td>
                      <td>{formatData.currency(day.totalExtraMoney)}</td>
                      <td>{formatData.currency(day.dailyTotal)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">Không có dữ liệu</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="shipperAccount-wallet-total">
                  <td>Tổng</td>
                  <td>{totals.totalOrderCount}</td>
                  <td>{formatData.currency(totals.totalShippingFee)}</td>
                  <td>{formatData.currency(totals.totalExtraMoney)}</td>
                  <td>{formatData.currency(totals.total)}</td>
                </tr>
              </tfoot>
            </table>
            <div className="shipperAccount-wallet-balance">
              <p>
                Số dư ví:{' '}
                {isMoneyVisible ? formatData.currency(totalWallet) : '******'}
                <button
                  className="shipperAccount-toggle-money-btn"
                  onClick={() => setIsMoneyVisible(!isMoneyVisible)}
                  aria-label={isMoneyVisible ? 'Ẩn số tiền' : 'Hiện số tiền'}
                >
                  {isMoneyVisible ? <FaEye /> : <FaEyeSlash />}
                </button>
              </p>
              <div className="shipperAccount-wallet-buttons">
                <button className="shipperAccount-deposit-button" onClick={() => setShowDepositPopup(true)}>
                  Nạp Tiền
                </button>
                <button
                  className="shipperAccount-withdraw-button"
                  onClick={() => setShowWithdrawPopup(true)}
                >
                  Rút Tiền
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    };

    return sections[selectedSection] || sections['personal-info'];
  };

  if (loading) {
    return (
      <div className="shipperAccount-container">
        <Header />
        <div className="shipperAccount-loading-container">
          <div className="shipperAccount-loading-spinner"></div>
          <p>Đang tải thông tin...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="shipperAccount-container">
        <Header />
        <div className="shipperAccount-error-container">
          <p>Lỗi: {error}</p>
          <button onClick={() => window.location.reload()}>Tải lại</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="shipperAccount-container">
      <div className='header'>
        <Header
          navigationItems={newsNavigationItems}
          showLoginButton={true}
          onLoginClick={openLoginPopup}
        />
      </div>
      <main className="shipperAccount-main">
        {showConfirmationMessage && (
          <div className="shipperAccount-popup-overlay">
            <div className="shipperAccount-popup-content">
              <h2>TÀI KHOẢN CỦA BẠN ĐANG CHỜ XÁC NHẬN. VUI LÒNG ĐỢI.</h2>
              <button className="shipperAccount-ok-button" onClick={handleOkClick}>OK</button>
            </div>
          </div>
        )}

        {!showConfirmationMessage && (
          <div className="shipperAccount-account-layout">
            <div className="shipperAccount-left-sidebar">
              {navItems.map(item => (
                <div
                  key={item.id}
                  className={`shipperAccount-sidebar-item ${selectedSection === item.id ? 'active' : ''}`}
                  onClick={() => setSelectedSection(item.id)}
                >
                  {item.label}
                </div>
              ))}
            </div>
            <div className="shipperAccount-right-content">
              {loading ? (
                <div className="shipperAccount-loading-container">
                  <div className="shipperAccount-loading-spinner"></div>
                  <p>Đang tải thông tin...</p>
                </div>
              ) : error ? (
                <div className="shipperAccount-error-container">
                  <p>Lỗi: {error}</p>
                  <button onClick={() => window.location.reload()}>Tải lại</button>
                </div>
              ) : (
                renderSectionContent()
              )}
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

      {!showConfirmationMessage && (
        <div className="shipperAccount-account-actions">
          <button
            className="shipperAccount-update-button"
            onClick={() => navigate('/update-shipper-info')}
          >
            Cập nhật thông tin
          </button>
          <button
            className="shipperAccount-cancel-account-button"
            onClick={() => setShowCancelPopup(true)}
          >
            Hủy tài khoản
          </button>
        </div>
      )}
      {/* Popup nạp tiền - Cập nhật */}
      {showDepositPopup && (
        <div className="shipperAccount-popup-overlay">
          <div className="shipperAccount-popup-content">
            {/* Thêm button đóng popup */}
            <button
              className="shipperAccount-popup-close"
              onClick={() => setShowDepositPopup(false)}
              aria-label="Đóng"
            >
              <FaTimes />
            </button>

            {showPaymentSuccess ? (
              // Thông báo thanh toán thành công
              <div className="shipperAccount-success-message">
                <div className="shipperAccount-success-icon">
                  <FaCheckCircle />
                </div>
                <h3>Thanh toán thành công!</h3>
                <p>Số tiền {formatData.currency(depositAmount)} đã được nạp vào tài khoản của bạn</p>
                <button
                  className="shipperAccount-ok-button"
                  onClick={handlePaymentSuccessOk}
                >
                  OK
                </button>
              </div>
            ) : !showConfirmation ? (
              // Màn hình chọn số tiền
              <>
                <h2>Nạp Tiền</h2>
                <p>Số tiền cần nạp:</p>
                <div className="shipperAccount-deposit-options">
                  {[50000, 100000, 200000, 500000, 1000000, 2000000].map((amount) => (
                    <button
                      key={amount}
                      className={`shipperAccount-deposit-option ${selectedAmount === amount ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setDepositAmount(amount);
                      }}
                    >
                      {formatData.currency(amount)}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Nhập số tiền khác"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                />
                <div className="shipperAccount-popup-actions">
                  <button
                    className="shipperAccount-confirm-deposit-button"
                    onClick={() => setShowConfirmation(true)}
                    disabled={!depositAmount}
                  >
                    Xác nhận
                  </button>
                  <button
                    className="shipperAccount-close-button"
                    onClick={() => setShowDepositPopup(false)}
                  >
                    Đóng
                  </button>
                </div>
              </>
            ) : (
              // Màn hình hiển thị thông tin người thụ hưởng
              <>
                <h2>Thông tin chuyển khoản</h2>
                <div className="shipperAccount-beneficiary-info">
                  <div className="beneficiary-details">
                    <p><strong>Số tài khoản:</strong> 1018133987</p>
                    <p><strong>Ngân hàng:</strong> Vietcombank</p>
                    <p><strong>Chủ tài khoản:</strong> Trần Hữu Tài</p>
                    <p><strong>Số tiền:</strong> {formatData.currency(depositAmount)}</p>
                  </div>
                  <div className="qr-code-container">
                    <img src={Qrcode} alt="QR Code" />
                  </div>
                </div>
                <div className="shipperAccount-popup-actions">
                  <button
                    className="shipperAccount-complete-payment-button"
                    onClick={handleCompletePayment}
                  >
                    Tôi đã hoàn thành thanh toán
                  </button>
                  <button
                    className="shipperAccount-close-button"
                    onClick={() => setShowConfirmation(false)}
                  >
                    Quay lại
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {showWithdrawPopup && (
        <div className="shipperAccount-popup-overlay">
          <div className="shipperAccount-popup-content">
            {/* Nút đóng popup */}
            <button
              className="shipperAccount-popup-close"
              onClick={() => setShowWithdrawPopup(false)}
              aria-label="Đóng"
            >
              <FaTimes />
            </button>

            {showWithdrawSuccess ? (
              // Thông báo rút tiền thành công
              <div className="shipperAccount-success-message">
                <div className="shipperAccount-success-icon">
                  <FaCheckCircle />
                </div>
                <h3>Rút tiền thành công!</h3>
                <p>Số tiền {formatData.currency(withdrawAmount)} đã được chuyển đến tài khoản của bạn</p>
                <button
                  className="shipperAccount-ok-button"
                  onClick={handleWithdrawSuccessOk}
                >
                  OK
                </button>
              </div>
            ) : !showWithdrawConfirmation ? (
              // Màn hình chọn số tiền rút
              <>
                <h2>Rút Tiền</h2>
                <p>Số tiền cần rút:</p>
                <div className="shipperAccount-deposit-options">
                  {[50000, 100000, 200000, 500000, 1000000, 2000000].map((amount) => (
                    <button
                      key={amount}
                      className={`shipperAccount-deposit-option ${selectedWithdrawAmount === amount ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedWithdrawAmount(amount);
                        setWithdrawAmount(amount);
                      }}
                    >
                      {formatData.currency(amount)}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Nhập số tiền khác"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                />
                <div className="shipperAccount-popup-actions">
                  <button
                    className="shipperAccount-confirm-deposit-button"
                    onClick={() => setShowWithdrawConfirmation(true)}
                    disabled={!withdrawAmount || withdrawAmount <= 0 || withdrawAmount > totalWallet}
                  >
                    Xác nhận
                  </button>
                  <button
                    className="shipperAccount-close-button"
                    onClick={() => setShowWithdrawPopup(false)}
                  >
                    Đóng
                  </button>
                </div>
                {withdrawAmount > totalWallet && (
                  <p className="shipperAccount-error-message">Số dư trong ví không đủ</p>
                )}
              </>
            ) : (
              // Màn hình hiển thị thông tin người nhận
              <>
                <h2>Thông tin người nhận</h2>
                <div className="shipperAccount-beneficiary-info withdraw-info">
                  <div className="beneficiary-details">
                    <p><strong>Số tài khoản:</strong> {shipperData.BankAccountNumber}</p>
                    <p><strong>Ngân hàng:</strong> {shipperData.BankName}</p>
                    <p><strong>Chủ tài khoản:</strong> {shipperData.FullName}</p>
                    <p><strong>Số tiền cần rút:</strong> {formatData.currency(withdrawAmount)}</p>
                  </div>
                </div>
                <div className="shipperAccount-popup-actions">
                  <button
                    className="shipperAccount-complete-payment-button"
                    onClick={handleWithdraw}
                  >
                    Xác nhận
                  </button>
                  <button
                    className="shipperAccount-close-button"
                    onClick={() => setShowWithdrawConfirmation(false)}
                  >
                    Quay lại
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ShipperAccount;