import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaHistory, FaWallet } from "react-icons/fa"
import '../../../styles/FinanceManagementPage.css'
import { Header } from "../../header/Header";
import Footer from "../../footer/Footer";
export default function FinanceManagementPage() {
  const [walletData, setWalletData] = useState({
    totalWallet: 0,
    minWithdrawal: 50000,
    maxWithdrawal: 5000000,
    minDeposit: 50000,
    maxDeposit: 10000000,
    ProcessingTime: "5-10 phút",
  })
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [shipperData, setShipperData] = useState(null)

  // State cho nạp tiền
  const [showDepositPopup, setShowDepositPopup] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [selectedDepositAmount, setSelectedDepositAmount] = useState(null);
  const [showDepositConfirmation, setShowDepositConfirmation] = useState(false);
  const [showDepositSuccess, setShowDepositSuccess] = useState(false);
  // State cho rút tiền
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [selectedWithdrawAmount, setSelectedWithdrawAmount] = useState(null)
  const [showWithdrawConfirmation, setShowWithdrawConfirmation] = useState(false)
  const [showWithdrawSuccess, setShowWithdrawSuccess] = useState(false)
  // State cho tab và lịch sử giao dịch
  const [activeTab, setActiveTab] = useState("deposit")
  const [transactionHistory, setTransactionHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [lastTransactionId, setLastTransactionId] = useState(null)

  // Giả sử ID của shipper được lưu trong localStorage hoặc context
  const shipperId = localStorage.getItem("shipperId") || "1" // Mặc định là '1' nếu không có
  const newsNavigationItems = [
    { text: "Trang chủ", path: "/home" },
    { text: "Về chúng tôi", path: "/about" },
    { text: "Tin tức", path: "/news" },
    { text: "Liên hệ", path: "/shipper-contact" },
  ];

  
  // Cập nhật useEffect để lấy dữ liệu ví và thông tin shipper
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")

        if (!token) {
          setError("Bạn cần đăng nhập để sử dụng tính năng này")
          setLoading(false)
          return
        }

        // Fetch wallet balance
        const walletResponse = await axios.get(`http://localhost:5000/api/shipper/${shipperId}/total-wallet`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (walletResponse.data.success) {
          setWalletData({
            ...walletData,
            totalWallet: walletResponse.data.data.totalWallet,
          })
        } else {
          setError("Không thể lấy dữ liệu ví")
        }

        // Fetch shipper data for bank information
        const shipperResponse = await axios.get(`http://localhost:5000/api/shippers-auth/${shipperId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (shipperResponse.data.success) {
          setShipperData(shipperResponse.data.data)
        } else {
          setError("Không thể lấy thông tin tài khoản")
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Đã xảy ra lỗi khi kết nối với máy chủ")
      } finally {
        setLoading(false)
      }
    }

    fetchWalletData()
  }, [shipperId])
  // Hàm xử lý nạp tiền
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

    setError(null);
    setShowDepositConfirmation(true);
  };

  const handleDeposit = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/shipper/${shipperId}/deposit`,
        { amount: Number(depositAmount) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
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
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resultCode = urlParams.get("resultCode");
    const extraData = urlParams.get("extraData");

    if (resultCode === "0" && extraData) {
      const decodedExtraData = JSON.parse(atob(extraData));
      const { depositAmount } = decodedExtraData;
      setDepositAmount(depositAmount);

      const updateWallet = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.post(
            `http://localhost:5000/api/shipper/${shipperId}/deposit`,
            { amount: Number(depositAmount), isManualUpdate: true },
            {
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            }
          );

          if (response.data.success) {
            setWalletData({
              ...walletData,
              totalWallet: response.data.data.newBalance,
            });
            setShowDepositConfirmation(false);
            setShowDepositSuccess(true);
            setLastTransactionId(response.data.data.transactionId);
            setActiveTab("deposit");
          }
        } catch (err) {
          setError(err.message || "Đã xảy ra lỗi khi cập nhật ví");
        }
      };
      updateWallet();
    }
  }, [shipperId, navigate]);
  const fetchTransactionHistory = async () => {
    try {
      setHistoryLoading(true)
      const token = localStorage.getItem("token")

      if (!token) {
        setError("Bạn cần đăng nhập để sử dụng tính năng này")
        setHistoryLoading(false)
        return
      }

      // Gọi API lấy lịch sử giao dịch
      const response = await axios.get(`http://localhost:5000/api/shipper/${shipperId}/transaction-history`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.data.success) {
        setTransactionHistory(response.data.data || [])
      } else {
        throw new Error(response.data.message || "Không thể lấy lịch sử giao dịch")
      }
    } catch (err) {
      console.error("Error fetching transaction history:", err)
      setError("Đã xảy ra lỗi khi lấy lịch sử giao dịch")
    } finally {
      setHistoryLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === "history") {
      fetchTransactionHistory()
    }
  }, [activeTab])

  useEffect(() => {
    if (lastTransactionId) {
      const timer = setTimeout(() => {
        setLastTransactionId(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [lastTransactionId])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const handleAmountChange = (e) => {
    setWithdrawAmount(e.target.value)
  }

  const handleAmountSelect = (amount) => {
    setSelectedWithdrawAmount(amount)
    setWithdrawAmount(amount)
  }

  const handleConfirmClick = () => {
    // Kiểm tra số tiền rút có hợp lệ không
    const amount = Number(withdrawAmount)

    if (!amount || amount <= 0) {
      setError("Vui lòng nhập số tiền hợp lệ")
      return
    }

    if (amount < walletData.minWithdrawal) {
      setError(`Số tiền rút tối thiểu là ${formatCurrency(walletData.minWithdrawal)}`)
      return
    }

    if (amount > walletData.totalWallet) {
      setError("Số dư trong ví không đủ để thực hiện giao dịch")
      return
    }

    if (amount > walletData.maxWithdrawal) {
      setError(`Số tiền rút tối đa là ${formatCurrency(walletData.maxWithdrawal)}`)
      return
    }

    setError(null)
    setShowWithdrawConfirmation(true)
  }

  const handleCancelConfirmation = () => {
    setShowWithdrawConfirmation(false)
  }

  const handleWithdraw = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem("token")

      if (!token) {
        setError("Bạn cần đăng nhập để sử dụng tính năng này")
        setLoading(false)
        return
      }

      const amount = Number(withdrawAmount)

      const response = await axios.post(
        `http://localhost:5000/api/shipper/${shipperId}/withdraw`,
        {
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (response.data.success) {
        // Cập nhật số dư mới
        setWalletData({
          ...walletData,
          totalWallet: response.data.data.newBalance,
        })
        setShowWithdrawConfirmation(false)
        setShowWithdrawSuccess(true)

        // Lưu ID giao dịch mới để highlight
        setLastTransactionId(response.data.data.transactionId)
      } else {
        throw new Error(response.data.message || "Không thể rút tiền")
      }
    } catch (err) {
      console.error("Error withdrawing money:", err)
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError(err.message || "Đã xảy ra lỗi khi rút tiền")
      }
    } finally {
      setLoading(false)
    }
  }
  const handleDepositSuccessOk = () => {
    setShowDepositSuccess(false);
    setDepositAmount("");
    setSelectedDepositAmount(null);
    setActiveTab("history");
    fetchTransactionHistory();
  };
  const handleWithdrawSuccessOk = () => {
    setShowWithdrawSuccess(false)
    setWithdrawAmount("")
    setSelectedWithdrawAmount(null)
    setActiveTab("history")
    fetchTransactionHistory()
  }

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return "0 VNĐ"
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const renderTransactionHistory = () => {
    if (historyLoading) {
      return <div className="FinancialManagement-loading">Đang tải lịch sử giao dịch...</div>;
    }

    if (transactionHistory.length === 0) {
      return <div className="FinancialManagement-empty-history">Không có giao dịch nào</div>;
    }

    return (
      <div className="FinancialManagement-transaction-history">
        <div className="FinancialManagement-transaction-table-wrapper">
          <table className="FinancialManagement-transaction-table">
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Loại</th>
                <th>Số tiền</th>
                <th>Trạng thái</th>
                <th>Mô tả</th>
                <th>Mã tham chiếu</th>
              </tr>
            </thead>
            <tbody>
              {transactionHistory.map((transaction) => (
                <tr
                  key={transaction.id}
                  className={`FinancialManagement-transaction-row ${transaction.type} ${transaction.id === lastTransactionId ? "highlight" : ""
                    }`}
                >
                  <td>{formatDate(transaction.date)}</td>
                  <td>
                    {transaction.type === "withdraw" ? (
                      <span className="FinancialManagement-transaction-type withdraw">Rút tiền</span>
                    ) : transaction.type === "deposit" ? (
                      <span className="FinancialManagement-transaction-type deposit">Nạp tiền</span>
                    ) : (
                      <span className="FinancialManagement-transaction-type order">Đơn hàng</span>
                    )}
                  </td>
                  <td className={`FinancialManagement-transaction-amount ${transaction.type}`}>
                    {transaction.type === "withdraw" ? "-" : "+"}
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td>
                    <span className={`FinancialManagement-transaction-status ${transaction.status}`}>
                      {transaction.status === "success"
                        ? "Thành công"
                        : transaction.status === "pending"
                          ? "Đang xử lý"
                          : "Thất bại"}
                    </span>
                  </td>
                  <td>{transaction.description}</td>
                  <td>{transaction.referenceId || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="FinancialManagement-container">
      <div className="FinancialManagement-header">
        <Header navigationItems={newsNavigationItems} showLoginButton={true} />
      </div>
      <main className="FinancialManagement-main">
        <div className="FinancialManagement-finance-management">
          <h1>Quản lý tài chính</h1>

          <div className="FinancialManagement-tabs">
            <div className={`FinancialManagement-tab ${activeTab === "deposit" ? "active" : ""}`} onClick={() => handleTabChange("deposit")}>
              <FaWallet className="FinancialManagement-tab-icon" /> Nạp tiền
            </div>
            <div className={`FinancialManagement-tab ${activeTab === "withdraw" ? "active" : ""}`} onClick={() => handleTabChange("withdraw")}>
              <FaWallet className="FinancialManagement-tab-icon" /> Rút tiền
            </div>
            <div className={`FinancialManagement-tab ${activeTab === "history" ? "active" : ""}`} onClick={() => handleTabChange("history")}>
              <FaHistory className="FinancialManagement-tab-icon" /> Lịch sử giao dịch
            </div>
          </div>

          <div className="FinancialManagement-content-container">
            <div className="FinancialManagement-main-content">
              {activeTab === "deposit" ? (
                <div className="FinancialManagement-deposit-form">
                  <h2>Nạp tiền</h2>
                  <p>Nhập số tiền để nạp vào ví của bạn qua MoMo.</p>

                  {error && <div className="FinancialManagement-error-message">{error}</div>}

                  {showDepositSuccess ? (
                    <div className="FinancialManagement-success-message">
                      <div className="FinancialManagement-success-icon">
                        <FaCheckCircle />
                      </div>
                      <h3>Nạp tiền thành công!</h3>
                      <p>Số tiền {formatCurrency(Number(depositAmount))} đã được nạp vào ví của bạn</p>
                      <button className="FinancialManagement-ok-button" onClick={handleDepositSuccessOk}>
                        Xem lịch sử giao dịch
                      </button>
                    </div>
                  ) : showDepositConfirmation ? (
                    <div className="FinancialManagement-confirmation-section">
                      <h3>Xác nhận thông tin nạp tiền</h3>
                      <div className="FinancialManagement-beneficiary-info FinancialManagement-deposit-info">
                        <div className="FinancialManagement-beneficiary-details">
                          <p><strong>Số tiền nạp:</strong> {formatCurrency(Number(depositAmount))}</p>
                          <p><strong>Phương thức:</strong> MoMo</p>
                        </div>
                      </div>
                      <div className="FinancialManagement-confirmation-actions">
                        <button className="FinancialManagement-confirm-button" onClick={handleDeposit} disabled={loading}>
                          {loading ? "Đang xử lý..." : "Xác nhận nạp tiền"}
                        </button>
                        <button className="FinancialManagement-cancel-button" onClick={() => setShowDepositConfirmation(false)} disabled={loading}>
                          Quay lại
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="FinancialManagement-form-group">
                        <label>Số tiền nạp</label>
                        <div className="FinancialManagement-deposit-options">
                          {[50000, 100000, 200000, 500000, 1000000, 2000000].map((amount) => (
                            <button
                              key={amount}
                              className={`FinancialManagement-deposit-option ${selectedDepositAmount === amount ? "selected" : ""}`}
                              onClick={() => handleDepositSelect(amount)}
                            >
                              {formatCurrency(amount)}
                            </button>
                          ))}
                        </div>
                        <div className="FinancialManagement-input-wrapper">
                          <span className="FinancialManagement-currency-symbol">₫</span>
                          <input
                            type="number"
                            placeholder="Nhập số tiền khác"
                            value={depositAmount}
                            onChange={handleDepositAmountChange}
                            className="FinancialManagement-amount-input"
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <button
                        className="FinancialManagement-withdraw-button"
                        onClick={handleDepositConfirmClick}
                        disabled={!depositAmount || Number(depositAmount) <= 0 || loading}
                      >
                        Nạp tiền
                      </button>
                    </>
                  )}
                </div>
              ) : activeTab === "withdraw" ? (
                <div className="FinancialManagement-withdrawal-form">
                  <h2>Rút tiền</h2>
                  <p>Nhập số tiền và chọn phương thức thanh toán để rút tiền từ ví của bạn.</p>

                  {error && <div className="FinancialManagement-error-message">{error}</div>}

                  {showWithdrawSuccess ? (
                    <div className="FinancialManagement-success-message">
                      <div className="FinancialManagement-success-icon">
                        <FaCheckCircle />
                      </div>
                      <h3>Rút tiền thành công!</h3>
                      <p>Số tiền {formatCurrency(Number(withdrawAmount))} đã được chuyển đến tài khoản của bạn</p>
                      <button className="FinancialManagement-ok-button" onClick={handleWithdrawSuccessOk}>
                        Xem lịch sử giao dịch
                      </button>
                    </div>
                  ) : showWithdrawConfirmation ? (
                    <div className="FinancialManagement-confirmation-section">
                      <h3>Xác nhận thông tin rút tiền</h3>
                      <div className="FinancialManagement-beneficiary-info FinancialManagement-withdraw-info">
                        <div className="FinancialManagement-beneficiary-details">
                          <p>
                            <strong>Số tài khoản:</strong> {shipperData?.BankAccountNumber || "Chưa cập nhật"}
                          </p>
                          <p>
                            <strong>Ngân hàng:</strong> {shipperData?.BankName || "Chưa cập nhật"}
                          </p>
                          <p>
                            <strong>Chủ tài khoản:</strong> {shipperData?.FullName || "Chưa cập nhật"}
                          </p>
                          <p>
                            <strong>Số tiền cần rút:</strong> {formatCurrency(Number(withdrawAmount))}
                          </p>
                          <p>
                          <strong>Phương thức thanh toán:</strong> Chuyển khoản ngân hàng
                          </p>
                        </div>
                      </div>
                      <div className="FinancialManagement-confirmation-actions">
                        <button className="FinancialManagement-confirm-button" onClick={handleWithdraw} disabled={loading}>
                          {loading ? "Đang xử lý..." : "Xác nhận rút tiền"}
                        </button>
                        <button className="FinancialManagement-cancel-button" onClick={handleCancelConfirmation} disabled={loading}>
                          Quay lại
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="FinancialManagement-form-group">
                        <label>Số tiền rút</label>
                        <div className="FinancialManagement-deposit-options">
                          {[50000, 100000, 200000, 500000, 1000000, 2000000].map((amount) => (
                            <button
                              key={amount}
                              className={`FinancialManagement-deposit-option ${selectedWithdrawAmount === amount ? "selected" : ""}`}
                              onClick={() => handleAmountSelect(amount)}
                              disabled={amount > walletData.totalWallet}
                            >
                              {formatCurrency(amount)}
                            </button>
                          ))}
                        </div>
                        <div className="FinancialManagement-input-wrapper">
                          <span className="FinancialManagement-currency-symbol">₫</span>
                          <input
                            type="number"
                            placeholder="Nhập số tiền khác"
                            value={withdrawAmount}
                            onChange={handleAmountChange}
                            className="FinancialManagement-amount-input"
                            disabled={loading}
                          />
                        </div>
                        {withdrawAmount > walletData.totalWallet && (
                          <p className="FinancialManagement-error-message">Số dư trong ví không đủ</p>
                        )}
                        {Number(withdrawAmount) < walletData.minWithdrawal && withdrawAmount && (
                          <p className="FinancialManagement-error-message">
                            Số tiền rút tối thiểu là {formatCurrency(walletData.minWithdrawal)}
                          </p>
                        )}
                        {Number(withdrawAmount) > walletData.maxWithdrawal && (
                          <p className="FinancialManagement-error-message">Số tiền rút tối đa là {formatCurrency(walletData.maxWithdrawal)}</p>
                        )}
                      </div>

                      <div className="FinancialManagement-form-group">
                        <label>Phương thức thanh toán</label>
                        <div className="FinancialManagement-payment-methods">
                          <div className="FinancialManagement-payment-method">
                            <span className="FinancialManagement-icon bank-icon">💳</span>
                            <span>Chuyển khoản ngân hàng</span>
                          </div>
                        </div>
                        {shipperData && (
                          <div className="FinancialManagement-bank-info-display">
                            <h3>Thông tin tài khoản ngân hàng của bạn</h3>
                            <div className="FinancialManagement-bank-info-item">
                              <span className="FinancialManagement-bank-info-label">Ngân hàng:</span>
                              <span className="FinancialManagement-bank-info-value">{shipperData.BankName || "Chưa cập nhật"}</span>
                            </div>
                            <div className="FinancialManagement-bank-info-item">
                              <span className="FinancialManagement-bank-info-label">Số tài khoản:</span>
                              <span className="FinancialManagement-bank-info-value">{shipperData.BankAccountNumber || "Chưa cập nhật"}</span>
                            </div>
                            <div className="FinancialManagement-bank-info-item">
                              <span className="FinancialManagement-bank-info-label">Chủ tài khoản:</span>
                              <span className="FinancialManagement-bank-info-value">{shipperData.FullName || "Chưa cập nhật"}</span>
                            </div>
                            {(!shipperData.BankName || !shipperData.BankAccountNumber) && (
                              <p className="FinancialManagement-bank-info-warning">
                                Vui lòng cập nhật thông tin ngân hàng trong trang cá nhân để sử dụng phương thức này.
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        className="FinancialManagement-withdraw-button"
                        onClick={handleConfirmClick}
                        disabled={
                          loading ||
                          !withdrawAmount ||
                          Number(withdrawAmount) <= 0 ||
                          Number(withdrawAmount) > walletData.totalWallet ||
                          Number(withdrawAmount) < walletData.minWithdrawal ||
                          Number(withdrawAmount) > walletData.maxWithdrawal
                        }
                      >
                        Rút tiền
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="FinancialManagement-history-section">
                  <h2>Lịch sử giao dịch</h2>
                  <p>Danh sách các giao dịch nạp và rút tiền của bạn</p>
                  {renderTransactionHistory()}
                </div>
              )}
            </div>

            <div className="FinancialManagement-account-summary">
              <h2>Tóm tắt tài khoản</h2>
              <p>
                {activeTab === "deposit"
                  ? "Thông tin về số dư và hạn mức nạp tiền của bạn"
                  : activeTab === "withdraw"
                    ? "Thông tin về số dư và hạn mức rút tiền của bạn"
                    : "Thông tin tài khoản của bạn"}
              </p>

              {loading ? (
                <div className="FinancialManagement-loading">Đang tải dữ liệu...</div>
              ) : (
                <div>
                  <div className="FinancialManagement-summary-item">
                    <div className="FinancialManagement-summary-label">Số dư hiện tại</div>
                    <div className="FinancialManagement-summary-value">{formatCurrency(walletData.totalWallet)}</div>
                  </div>

                  {activeTab === "deposit" ? (
                    <>
                      <div className="FinancialManagement-summary-item">
                        <div className="FinancialManagement-summary-label">Số tiền nạp tối thiểu</div>
                        <div className="FinancialManagement-summary-value">{formatCurrency(walletData.minDeposit)}</div>
                      </div>
                      <div className="FinancialManagement-summary-item">
                        <div className="FinancialManagement-summary-label">Số tiền nạp tối đa</div>
                        <div className="FinancialManagement-summary-value">{formatCurrency(walletData.maxDeposit)}</div>
                      </div>
                      <div className="FinancialManagement-summary-item">
                        <div className="FinancialManagement-summary-label">
                          Thanh toán sẽ được xử lý trong:
                        </div>
                        <div className="FinancialManagement-summary-value">{walletData.ProcessingTime}</div>
                      </div>
                    </>
                  ) : activeTab === "withdraw" ? (
                    <>
                      <div className="FinancialManagement-summary-item">
                        <div className="FinancialManagement-summary-label">Số tiền rút tối thiểu</div>
                        <div className="FinancialManagement-summary-value">{formatCurrency(walletData.minWithdrawal)}</div>
                      </div>
                      <div className="FinancialManagement-summary-item">
                        <div className="FinancialManagement-summary-label">Số tiền rút tối đa</div>
                        <div className="FinancialManagement-summary-value">{formatCurrency(walletData.maxWithdrawal)}</div>
                      </div>
                      <div className="FinancialManagement-summary-item">
                        <div className="FinancialManagement-summary-label">
                          Thanh toán sẽ được xử lý trong:
                        </div>
                        <div className="FinancialManagement-summary-value">{walletData.ProcessingTime}</div>
                      </div>
                    </>
                  ) : null}
                </div>
              )}
            </div>
          </div>

        </div >
        <button
          className="FinancialManagement-back-to-wallet-button"
          onClick={() => navigate('/shipper-account', { state: { section: 'wallet' } })}
        >
          Quay về Ví của Shipper
        </button>
      </main>

      <Footer />
    </div>
  )
}


