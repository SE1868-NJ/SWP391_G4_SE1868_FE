import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import "../../../styles/EscrowDeposit.css";
import Footer from "../../footer/Footer";
import styles from "../../header/Header.module.css";
import { Logo } from "../../header/Logo";
import { NavigationItem } from "../../header/NavigationItem";

const EscrowHeader = ({ navigationItems }) => {
  const defaultNavItems = [
    { text: "Trang chủ", path: "/home", isActive: true },
    { text: "Về chúng tôi", path: "/about" },
    { text: "Tin tức", path: "/news" },
    { text: "Liên hệ", path: "/shipper-contact" },
  ];

  const navItems = navigationItems || defaultNavItems;
  const handleNavigation = (path) => {
    localStorage.clear();
    window.location.href = path;
  };
  return (
    <header className={styles.header}>
      <nav className={styles.backgroundShadow}>
        <Logo />
        <div className={styles.navigationItems}>
          {navItems.map((item, index) => (
            <NavigationItem
              key={index}
              text={item.text}
              path={item.path}
              isActive={item.isActive}
              onClick={() => handleNavigation(item.path)}
            />
          ))}
        </div>
        
      </nav>
    </header>
  );
};

// Component chính EscrowDeposit
export default function EscrowDeposit() {
  const [escrowData, setEscrowData] = useState({
    escrowBalance: 0,
    maxDeposit: 100000000,
    processingTime: "5-10 phút",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDepositConfirmation, setShowDepositConfirmation] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [selectedDepositAmount, setSelectedDepositAmount] = useState(null);
  const [showDepositSuccess, setShowDepositSuccess] = useState(false);

  const navigationItems = [
    { text: "Trang chủ", path: "/home" },
    { text: "Về chúng tôi", path: "/about" },
    { text: "Tin tức", path: "/news" },
    { text: "Liên hệ", path: "/contact" },
  ];

  useEffect(() => {
    const fetchEscrowBalance = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/escrow/balance",
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        if (response.data.success) {
          setEscrowData((prev) => ({
            ...prev,
            escrowBalance: response.data.data.escrowBalance,
          }));
        }
      } catch (err) {
        setError("Không thể tải số dư ví ký quỹ");
      }
    };
    fetchEscrowBalance();
  }, []);

  const handleDepositSelect = (amount) => {
    setSelectedDepositAmount(amount);
    setDepositAmount(amount);
  };

  const handleDepositAmountChange = (e) => {
    setDepositAmount(e.target.value);
  };

  const handleDepositConfirmClick = () => {
    const amount = Number(depositAmount);
    if (!amount || amount <= 0) {
      setError("Vui lòng nhập số tiền hợp lệ");
      return;
    }
    if (amount > escrowData.maxDeposit) {
      setError(`Số tiền nạp tối đa là ${formatCurrency(escrowData.maxDeposit)}`);
      return;
    }
    setError(null);
    setShowDepositConfirmation(true);
  };

  const handleDeposit = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/escrow/deposit",
        { amount: Number(depositAmount) },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        window.location.href = response.data.payUrl;
      } else {
        throw new Error(response.data.message || "Không thể khởi tạo thanh toán");
      }
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi nạp tiền");
    } finally {
      setLoading(false);
    }
  };

  const updateShipperStatus = async () => {
    if (escrowData.escrowBalance >= 1000000) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/shipper/update-status",
          { status: "Active" },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        if (response.data.success) {
          localStorage.clear();
          navigate("/login");
        }
      } catch (err) {
        setError("Không thể cập nhật trạng thái shipper");
      }
    }
  };

  const remainingAmount =
    escrowData.escrowBalance < 1000000
      ? 1000000 - escrowData.escrowBalance
      : 0;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resultCode = urlParams.get("resultCode");
    const extraData = urlParams.get("extraData");

    if (resultCode === "0" && extraData) {
      const decodedExtraData = JSON.parse(atob(extraData));
      const { depositAmount } = decodedExtraData;
      setDepositAmount(depositAmount);

      const updateEscrow = async () => {
        try {
          const response = await axios.post(
            "http://localhost:5000/api/escrow/deposit",
            { amount: Number(depositAmount), isManualUpdate: true },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (response.data.success) {
            const newBalance = response.data.data.newEscrowBalance;
            setEscrowData((prev) => ({ ...prev, escrowBalance: newBalance }));
            setShowDepositConfirmation(false);
            setShowDepositSuccess(true);
            if (newBalance >= 1000000) {
              await updateShipperStatus();
            }
          }
        } catch (err) {
          setError(err.message || "Đã xảy ra lỗi khi cập nhật ví ký quỹ");
        }
      };
      updateEscrow();
    }
  }, []);

  const handleDepositSuccessOk = () => {
    setShowDepositSuccess(false);
    setDepositAmount("");
    setSelectedDepositAmount(null);
    if (escrowData.escrowBalance >= 1000000) {
      updateShipperStatus();
      navigate("/home");
    }
  };

  const formatCurrency = (amount) =>
    amount
      ? new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(amount)
      : "0 VNĐ";

  return (
    <div>
      <div className="EscrowDeposit-header">
        <EscrowHeader navigationItems={navigationItems} />
      </div>
      <div className="EscrowDeposit-container" style={{ marginTop: "20px" }}>
        <main className="EscrowDeposit-main">
          <div className="EscrowDeposit-content-container">
            {/* Bên trái: Ảnh */}
            <div className="EscrowDeposit-image-section">
              <img
                src="https://useless-gold-stingray.myfilebase.com/ipfs/QmY5rdJJjedoY1jRgoYPYR9YbBvF8BGjyYf8HkPUavAVNo"
                alt="Escrow Deposit Illustration"
                className="EscrowDeposit-image"
              />
            </div>

            {/* Bên phải: Form nạp tiền */}
            <div className="EscrowDeposit-form-section">
              <h1>Nạp tiền vào ví ký quỹ</h1>
              <div className="EscrowDeposit-main-content">
                {error && (
                  <div className="EscrowDeposit-error-message">{error}</div>
                )}

                {showDepositSuccess ? (
                  <div className="EscrowDeposit-success-message">
                    <FaCheckCircle className="EscrowDeposit-success-icon" />
                    <h3>Nạp tiền thành công!</h3>
                    <p>
                      {escrowData.escrowBalance >= 1000000
                        ? "Bạn đã đủ điều kiện để hoạt động."
                        : "Số tiền trong ví ký quỹ của bạn chưa đủ để hoạt động, vui lòng nạp thêm!"}
                    </p>
                    <button
                      className="EscrowDeposit-ok-button"
                      onClick={handleDepositSuccessOk}
                    >
                      OK
                    </button>
                  </div>
                ) : showDepositConfirmation ? (
                  <div className="EscrowDeposit-confirmation-section">
                    <h3>Xác nhận thông tin nạp tiền</h3>
                    <div className="EscrowDeposit-beneficiary-info">
                      <p>
                        <strong>Số tiền nạp:</strong>{" "}
                        {formatCurrency(Number(depositAmount))}
                      </p>
                      <p>
                        <strong>Phương thức:</strong> MoMo
                      </p>
                    </div>
                    <div className="EscrowDeposit-confirmation-actions">
                      <button
                        className="EscrowDeposit-confirm-button"
                        onClick={handleDeposit}
                        disabled={loading}
                      >
                        {loading ? "Đang xử lý..." : "Xác nhận nạp tiền"}
                      </button>
                      <button
                        className="EscrowDeposit-cancel-button"
                        onClick={() => setShowDepositConfirmation(false)}
                        disabled={loading}
                      >
                        Quay lại
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="EscrowDeposit-form-group">
                      <label>Số tiền nạp</label>
                      <div className="EscrowDeposit-deposit-options">
                        {[100000, 200000, 300000, 500000, 1000000, 2000000].map(
                          (amount) => (
                            <button
                              key={amount}
                              className={`EscrowDeposit-deposit-option ${
                                selectedDepositAmount === amount ? "selected" : ""
                              }`}
                              onClick={() => handleDepositSelect(amount)}
                            >
                              {formatCurrency(amount)}
                            </button>
                          )
                        )}
                      </div>
                      <div className="EscrowDeposit-input-wrapper">
                        <span className="EscrowDeposit-currency-symbol">₫</span>
                        <input
                          type="number"
                          placeholder="Nhập số tiền khác"
                          value={depositAmount}
                          onChange={handleDepositAmountChange}
                          className="EscrowDeposit-amount-input"
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <button
                      className="EscrowDeposit-deposit-button"
                      onClick={handleDepositConfirmClick}
                      disabled={!depositAmount || Number(depositAmount) <= 0 || loading}
                    >
                      Nạp tiền
                    </button>
                  </>
                )}
              </div>

              <div className="EscrowDeposit-account-summary">
                <h2>Tóm tắt ví ký quỹ</h2>
                <div>
                  <div className="EscrowDeposit-summary-item">
                    <span className="EscrowDeposit-summary-label">
                      Số dư hiện tại
                    </span>
                    <span className="EscrowDeposit-summary-value">
                      {formatCurrency(escrowData.escrowBalance)}
                    </span>
                  </div>
                  <div className="EscrowDeposit-summary-item">
                    <span className="EscrowDeposit-summary-label">
                      Số tiền tối thiểu để hoạt động
                    </span>
                    <span className="EscrowDeposit-summary-value">
                      {formatCurrency(1000000)}
                    </span>
                  </div>
                  {remainingAmount > 0 && (
                    <div className="EscrowDeposit-summary-item">
                      <span className="EscrowDeposit-summary-label">
                        Số tiền còn thiếu
                      </span>
                      <span className="EscrowDeposit-summary-value">
                        {formatCurrency(remainingAmount)}
                      </span>
                    </div>
                  )}
                </div>
                {escrowData.escrowBalance < 1000000 ? (
                  <p className="EscrowDeposit-warning">
                    Số tiền trong ví ký quỹ của bạn chưa đủ để hoạt động, vui lòng
                    nạp thêm ít nhất {formatCurrency(remainingAmount)} để đủ điều
                    kiện hoạt động!
                  </p>
                ) : (
                  <p className="EscrowDeposit-success">
                    Bạn đã đủ điều kiện để hoạt động.
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}