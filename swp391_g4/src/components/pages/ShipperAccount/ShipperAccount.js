import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../header/Header";
import Footer from "../../footer/Footer";
import "../../../styles/ShipperAccount.css";
import axios from 'axios';
import { FaEye, FaEyeSlash, FaTimes, FaCheckCircle } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { vi } from 'date-fns/locale';
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
  const [errorMessage, setErrorMessage] = useState('');

  const cancelReasons = [
    { id: 'inactive', label: 'Không còn hoạt động' },
    { id: 'workload_too_heavy', label: 'Khối lượng công việc quá tải' },
    { id: 'system_issue', label: 'Vấn đề với hệ thống hoặc ứng dụng' },
    { id: 'work_condition', label: 'Điều kiện làm việc không thoải mái' },
    { id: 'customer_issue', label: 'Vấn đề với khách hàng' },
    { id: 'other', label: 'Lý do khác' }
  ];

  const handleSubmit = () => {
    const finalReason = cancelReason === 'other' ? otherReason : cancelReason;
    const isValid = cancelReason && (cancelReason !== 'other' || otherReason.trim());

    if (!isValid) {
      setErrorMessage('Vui lòng chọn một lý do hủy hoặc nhập lý do khác.');
      return;
    }
    setErrorMessage('');
    console.log('Submitting cancel with reason:', finalReason);
    onConfirm(finalReason);
  };

  return (
    <div className="shipperAccount-cancel-popup-overlay">
      <div className="shipperAccount-cancel-popup-content">
        <h2>Hủy tài khoản</h2>
        <p>Vui lòng cho chúng tôi biết lý do bạn muốn hủy tài khoản:</p>

        <div className="shipperAccount-cancel-reason-options">
          {cancelReasons.map(reason => (
            <div key={reason.id} className="shipperAccount-cancel-reason-option">
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
            className="shipperAccount-cancel-other-reason-input"
          />
        )}

        {errorMessage && (
          <p className="shipperAccount-error-message" style={{ color: 'red', marginTop: '10px' }}>
            {errorMessage}
          </p>
        )}

        <div className="shipperAccount-cancel-popup-actions">
          <button
            className="shipperAccount-cancel-popup-button"
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận hủy'}
          </button>
          <button className="shipperAccount-cancel-close-button" onClick={onClose}>
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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isMoneyVisible, setIsMoneyVisible] = useState(false);
  const [showDepositPopup, setShowDepositPopup] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showWithdrawPopup, setShowWithdrawPopup] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [selectedWithdrawAmount, setSelectedWithdrawAmount] = useState(null);
  const [showWithdrawConfirmation, setShowWithdrawConfirmation] = useState(false);
  const [showWithdrawSuccess, setShowWithdrawSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [searchDate, setSearchDate] = useState('');

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
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('resultCode') === '0') {
      fetchWalletData();
      fetchTotalWallet();
      setShowPaymentSuccess(true);
      setSelectedSection('wallet');
      window.history.replaceState({}, document.title, '/shipper-account');
    }
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
      setTotalWallet(0);
    }
  };

  fetchTotalWallet();

  useEffect(() => {
    if (selectedSection === 'wallet') {
      fetchWalletData();
      fetchTotalWallet();
    }
  }, [selectedSection, startDate, endDate, searchDate]);
  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const shipperId = localStorage.getItem('shipperId');
      const token = localStorage.getItem('token');

      if (!shipperId || !token) {
        navigate('/login');
        return;
      }
      const params = {};
      if (searchDate) {
        params.searchDate = searchDate;
      } else {
        params.startDate = startDate;
        params.endDate = endDate;
      }
      const response = await axios.get(`http://localhost:5000/api/shipper/${shipperId}/raw-wallet`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params,
      });

      if (response.data.success) {
        const rawData = response.data.data;
        console.log('Received Raw Data:', rawData);

        const groupedData = rawData.reduce((acc, order) => {
          const date = order.deliveryDate;
          if (!acc[date]) {
            acc[date] = {
              deliveryDate: date,
              orderCount: 0,
              totalShippingFee: 0,
              totalExtraMoney: 0,
              dailyTotal: 0,
            };
          }
          acc[date].orderCount += 1;
          acc[date].totalShippingFee += order.shippingFee;
          acc[date].totalExtraMoney += order.extraMoney;
          acc[date].dailyTotal = acc[date].totalShippingFee + acc[date].totalExtraMoney;
          return acc;
        }, {});

        const dailyData = Object.values(groupedData).sort((a, b) => new Date(b.deliveryDate) - new Date(a.deliveryDate));

        const totals = dailyData.reduce(
          (acc, day) => ({
            totalOrderCount: acc.totalOrderCount + day.orderCount,
            totalShippingFee: acc.totalShippingFee + day.totalShippingFee,
            totalExtraMoney: acc.totalExtraMoney + day.totalExtraMoney,
            total: acc.total + day.dailyTotal,
          }),
          { totalOrderCount: 0, totalShippingFee: 0, totalExtraMoney: 0, total: 0 }
        );

        console.log('Processed Daily Data:', dailyData);
        console.log('Processed Totals:', totals);

        setWalletData(dailyData);
        setTotals(totals);
      } else {
        throw new Error(response.data.message || 'Không thể tải dữ liệu ví');
      }
    } catch (err) {
      console.error('Fetch Wallet Error:', err);
      setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu ví');
      setWalletData([]);
      setTotals({ totalOrderCount: 0, totalShippingFee: 0, totalExtraMoney: 0, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (date) => {
    try {
      setLoadingDetails(true);
      const shipperId = localStorage.getItem('shipperId');
      const token = localStorage.getItem('token');

      if (!shipperId || !token) {
        navigate('/login');
        return;
      }
      const formattedDate = date; 
      console.log('Fetching order details for date:', formattedDate);

      const response = await axios.get(`http://localhost:5000/api/shipper/${shipperId}/orders-by-date`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: { deliveryDate: formattedDate }, 
      });

      if (response.data.success) {
        setOrderDetails(response.data.data);
        setSelectedDate(formattedDate); 
      } else {
        throw new Error(response.data.message || 'Không thể tải chi tiết đơn hàng');
      }
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi khi tải chi tiết đơn hàng');
      setOrderDetails([]);
    } finally {
      setLoadingDetails(false);
    }
  };
  const handleCancelAccount = async (reason) => {
    console.log('Cancel account initiated with reason:', reason); 
    setIsSubmitting(true);
    try {
      const shipperId = localStorage.getItem('shipperId');
      const token = localStorage.getItem('token');
      if (!shipperId || !token) {
        console.log('Missing shipperId or token, redirecting to login');
        navigate('/login');
        return;
      }
      console.log('Sending request to cancel account:', { shipperId, reason });
      const response = await axios.put(
        `http://localhost:5000/api/shippers/${shipperId}/cancel`,
        { reason },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('API Response:', response.data);
      if (response.data.success) {
        setShowCancelPopup(false);
        setShowConfirmationMessage(true);
      } else {
        throw new Error(response.data.message || 'Không thể hủy tài khoản');
      }
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi khi hủy tài khoản');
      console.error('Error canceling account:', err.response ? err.response.data : err);
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
    setDepositAmount(0);
    setSelectedAmount(null);
    fetchWalletData();
    fetchTotalWallet();
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
        window.location.href = response.data.payUrl;
      } else {
        throw new Error(response.data.message || 'Không thể khởi tạo thanh toán');
      }
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi khi khởi tạo thanh toán');
    }
  };

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
            <DocumentItem
            title="Căn cước công dân"
            image={shipperData.IDCardImage} 
          />
          </div>
        </div>
      ),
      'wallet': (
        <div className="shipperAccount-section-content">
          <div className="shipperAccount-date-filter">
            <label htmlFor="shipperAccount-searchDate">Tìm kiếm ngày: </label>
            <DatePicker
              selected={searchDate ? new Date(searchDate) : null}
              onChange={(date) => {
                const formattedDate = date ? date.toISOString().split('T')[0] : '';
                setSearchDate(formattedDate);
                setStartDate('');
                setEndDate('');
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="Ngày/Tháng/Năm"
              customInput={<input id="shipperAccount-searchDate" />}
              locale={vi}
            />

            <label htmlFor="shipperAccount-startDate" style={{ marginLeft: '20px' }}>Từ ngày: </label>
            <DatePicker
              selected={startDate ? new Date(startDate) : null}
              onChange={(date) => {
                const formattedDate = date ? date.toISOString().split('T')[0] : '';
                setStartDate(formattedDate);
                setSearchDate('');
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="Ngày/Tháng/Năm"
              customInput={<input id="shipperAccount-startDate" />}
              disabled={searchDate !== ''}
              locale={vi}
            />

            <label htmlFor="shipperAccount-endDate" style={{ marginLeft: '20px' }}>Đến ngày: </label>
            <DatePicker
              selected={endDate ? new Date(endDate) : null}
              onChange={(date) => {
                const formattedDate = date ? date.toISOString().split('T')[0] : '';
                setEndDate(formattedDate);
                setSearchDate('');
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="Ngày/Tháng/Năm"
              customInput={<input id="shipperAccount-endDate" />}
              minDate={startDate ? new Date(startDate) : null}
              disabled={searchDate !== ''}
              locale={vi}
            />

            {(searchDate || startDate || endDate) && (
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                <p style={{ margin: 0 }}>
                  {searchDate
                    ? `Ngày tìm kiếm: ${searchDate ? formatData.date(searchDate) : 'Chưa chọn'}`
                    : `Khoảng thời gian: ${startDate ? formatData.date(startDate) : 'Chưa chọn'} - ${endDate ? formatData.date(endDate) : 'Chưa chọn'}`}
                </p>
                <button
                  className="shipperAccount-date-filter-reset-button"
                  onClick={() => {
                    setSearchDate('');
                    setStartDate('');
                    setEndDate('');
                    fetchWalletData(); 
                  }}
                  style={{ marginLeft: '10px' }}
                >
                  Xóa
                </button>
              </div>
            )}
          </div>
          {selectedDate ? (
            <div className="shipperAccount-order-details">
              <h3>Chi tiết đơn hàng ngày {formatData.date(selectedDate)}</h3>
              {loadingDetails ? (
                <p>Đang tải chi tiết...</p>
              ) : orderDetails.length > 0 ? (
                <table className="shipperAccount-order-details-table">
                  <thead>
                    <tr>
                      <th>Mã đơn hàng</th>
                      <th>Địa chỉ giao</th>
                      <th>Phí giao hàng</th>
                      <th>Tiền tip</th>
                      <th>Thời gian giao</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.map((order) => (
                      <tr key={order.orderId}>
                        <td>{order.orderId}</td>
                        <td>{order.deliveryAddress}</td>
                        <td>{formatData.currency(order.shippingFee)}</td>
                        <td>{formatData.currency(order.extraMoney)}</td>
                        <td>{new Date(order.deliveryTime).toLocaleString('vi-VN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Không có đơn hàng nào trong ngày này.</p>
              )}
              <button
                className="shipperAccount-back-button"
                onClick={() => setSelectedDate(null)}
              >
                Quay lại
              </button>
            </div>
          ) : (
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
                      <tr
                        key={day.deliveryDate}
                        onClick={() => fetchOrderDetails(day.deliveryDate)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>{formatData.date(day.deliveryDate)}</td>
                        <td>{day.orderCount || 0}</td>
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
                    <td>{totals.totalOrderCount || 0}</td>
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
                  >
                    {isMoneyVisible ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </p>
                <div className="shipperAccount-wallet-buttons">
                  <button
                    className="shipperAccount-deposit-button"
                    onClick={() => setShowDepositPopup(true)}
                  >
                    Nạp Tiền
                  </button>
                  <button
                    className="shipperAccount-withdraw-button"
                    onClick={() => setShowWithdrawPopup(true)}
                  >
                    Rút tiền
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
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
            <button
              className="shipperAccount-popup-close"
              onClick={() => setShowDepositPopup(false)}
            >
              <FaTimes />
            </button>
            {showPaymentSuccess ? (
              <div className="shipperAccount-success-message">
                <div className="shipperAccount-success-icon">
                  <FaCheckCircle />
                </div>
                <h3>Thanh toán thành công!</h3>
                <p>Số tiền {formatData.currency(depositAmount)} đã được nạp vào tài khoản của bạn</p>
                <button className="shipperAccount-ok-button" onClick={handlePaymentSuccessOk}>
                  OK
                </button>
              </div>
            ) : (
              <>
                <h2>Nạp Tiền qua MoMo</h2>
                <p>Chọn số tiền cần nạp:</p>
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
                    onClick={handleCompletePayment} // Gọi trực tiếp để chuyển hướng
                    disabled={!depositAmount || depositAmount <= 0}
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