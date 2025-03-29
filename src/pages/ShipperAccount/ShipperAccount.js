import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import "../../styles/ShipperAccount.css";
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
  const [walletData, setWalletData] = useState([]);
  const [totals, setTotals] = useState({ totalShippingFee: 0, totalExtraMoney: 0, totalBonus: 0 });
  const [totalWallet, setTotalWallet] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [searchDate, setSearchDate] = useState('');
  const location = useLocation();
  const [isBalanceHidden, setIsBalanceHidden] = useState(true);
  const [escrowBalance, setEscrowBalance] = useState(0);
  const [isEscrowHidden, setIsEscrowHidden] = useState(true);
  useEffect(() => {
    const fetchShipperData = async () => {
      try {
        const shipperId = localStorage.getItem('shipperId');
        const token = localStorage.getItem('token');
        if (!shipperId || !token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:4000/api/shippers-auth/${shipperId}`, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        });

        if (response.data.success) {
          setShipperData(response.data.data);
        } else {
          throw new Error(response.data.message || 'Không thể tải thông tin');
        }
      } catch (err) {
        setError(err.message || 'Đã xảy ra lỗi khi tải thông tin');
      } finally {
        setLoading(false);
      }
    };

    fetchShipperData();
  }, [navigate]);
  const fetchEscrowBalance = async () => {
    try {
      const shipperId = localStorage.getItem("shipperId");
      const token = localStorage.getItem("token");
      if (!shipperId || !token) return;

      const response = await axios.get(
        `http://localhost:4000/api/escrow/balance`,
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        setEscrowBalance(response.data.data.escrowBalance);
      }
    } catch (err) {
      console.error("Fetch Escrow Balance Error:", err);
      setEscrowBalance(0);
    }
  };
  const fetchTotalWallet = async () => {
    try {
      const shipperId = localStorage.getItem("shipperId");
      const token = localStorage.getItem("token");
      if (!shipperId || !token) return;

      const response = await axios.get(
        `http://localhost:4000/api/shipper/${shipperId}/total-wallet`,
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        setTotalWallet(response.data.data.totalWallet);
      }
    } catch (err) {
      console.error("Fetch Total Wallet Error:", err);
      setTotalWallet(0);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await fetchTotalWallet();
      await fetchEscrowBalance();
      if (selectedSection === "wallet") {
        await fetchWalletData();
      }
    };
    fetchData();
  }, [selectedSection]);
  useEffect(() => {
    if (selectedSection === "wallet") {
      fetchWalletData();
    }
  }, [startDate, endDate, searchDate]);
  useEffect(() => {
    if (location.state && location.state.section) {
      setSelectedSection(location.state.section);
    }
  }, [location]);
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
      const response = await axios.get(`http://localhost:4000/api/shipper/${shipperId}/raw-wallet`, {
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

      const response = await axios.get(`http://localhost:4000/api/shipper/${shipperId}/orders-by-date`, {
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
        `http://localhost:4000/api/shippers/${shipperId}/cancel`,
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

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden(!isBalanceHidden);
  };
  const toggleEscrowVisibility = () => {
    setIsEscrowHidden(!isEscrowHidden);
  };
  const formatLocalDate = (date) => {
    if (!date) return '';
    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
            <InfoItem label="Ngày đăng kiểm xe" value={formatData.date(shipperData.RegistrationVehicle)} /> 
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
          <div className="shipperAccount-escrow-balance">
            <p>
              Số dư ví ký quỹ:
              <span className="shipperAccount-balance-value">
                {isEscrowHidden ? "******" : formatData.currency(escrowBalance)}
              </span>
              <span
                className="shipperAccount-toggle-balance"
                onClick={toggleEscrowVisibility}
              >
                {isEscrowHidden ? <FaEyeSlash /> : <FaEye />}
              </span>
            </p>
          </div>
          <div className="shipperAccount-date-filter">
            <label htmlFor="shipperAccount-searchDate">Tìm kiếm ngày: </label>
            <DatePicker
              selected={searchDate ? new Date(searchDate) : null}
              onChange={(date) => {
                const formattedDate = formatLocalDate(date);
                setSearchDate(formattedDate);
                setStartDate('');
                setEndDate('');
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="Ngày/Tháng/Năm"
              customInput={<input id="shipperAccount-searchDate" />}
              locale={vi}
              showMonthDropdown
              showYearDropdown
              yearDropdownItemNumber={50}
              minDate={new Date("1980-01-01")}
              maxDate={new Date("2026-12-31")}
            />

            <label htmlFor="shipperAccount-startDate" style={{ marginLeft: '20px' }}>Từ ngày: </label>
            <DatePicker
              selected={startDate ? new Date(startDate) : null}
              onChange={(date) => {
                const formattedDate = formatLocalDate(date);
                setStartDate(formattedDate);
                setSearchDate('');
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="Ngày/Tháng/Năm"
              customInput={<input id="shipperAccount-startDate" />}
              disabled={searchDate !== ''}
              locale={vi}
              showMonthDropdown
              showYearDropdown
              yearDropdownItemNumber={50}
              maxDate={new Date("2026-12-31")}
            />

            <label htmlFor="shipperAccount-endDate" style={{ marginLeft: '20px' }}>Đến ngày: </label>
            <DatePicker
              selected={endDate ? new Date(endDate) : null}
              onChange={(date) => {
                const formattedDate = formatLocalDate(date);
                setEndDate(formattedDate);
                setSearchDate('');
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="Ngày/Tháng/Năm"
              customInput={<input id="shipperAccount-endDate" />}
              minDate={startDate ? new Date(startDate) : new Date("1980-01-01")}
              disabled={searchDate !== ''}
              locale={vi}
              showMonthDropdown
              showYearDropdown
              yearDropdownItemNumber={50}
              maxDate={new Date("2026-12-31")}
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
                  Số dư ví Shipper:
                  <span className="shipperAccount-balance-value">
                    {isBalanceHidden ? "******" : formatData.currency(totalWallet)}
                  </span>
                  <span
                    className="shipperAccount-toggle-balance"
                    onClick={toggleBalanceVisibility}
                  >
                    {isBalanceHidden ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </p>
                <button
                  className="shipperAccount-transaction-button"
                  onClick={() => navigate('/finance-management')}
                >
                  Giao dịch Ví
                </button>
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
      <Footer />
    </div>
  );
};

export default ShipperAccount;