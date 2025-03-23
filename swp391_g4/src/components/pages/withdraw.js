"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { FaCheckCircle, FaHistory, FaWallet } from "react-icons/fa"
import "../../styles/withdraw.css"

export default function WithdrawPage() {
  const [walletData, setWalletData] = useState({
    totalWallet: 0,
    minWithdrawal: 100000,
    maxWithdrawal: 5000000,
    processingTime: "1-3 ngày làm việc",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [shipperData, setShipperData] = useState(null)

  // State cho rút tiền
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [selectedWithdrawAmount, setSelectedWithdrawAmount] = useState(null)
  const [showWithdrawConfirmation, setShowWithdrawConfirmation] = useState(false)
  const [showWithdrawSuccess, setShowWithdrawSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("bank")

  // State cho tab và lịch sử giao dịch
  const [activeTab, setActiveTab] = useState("withdraw") // "withdraw" hoặc "history"
  const [transactionHistory, setTransactionHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [lastTransactionId, setLastTransactionId] = useState(null)

  // Giả sử ID của shipper được lưu trong localStorage hoặc context
  const shipperId = localStorage.getItem("shipperId") || "1" // Mặc định là '1' nếu không có

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

  // Hàm lấy lịch sử giao dịch
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

  // Lấy lịch sử giao dịch khi chuyển sang tab lịch sử hoặc sau khi rút tiền thành công
  useEffect(() => {
    if (activeTab === "history") {
      fetchTransactionHistory()
    }
  }, [activeTab])

  // Highlight giao dịch mới nhất
  useEffect(() => {
    if (lastTransactionId) {
      // Tự động xóa highlight sau 5 giây
      const timer = setTimeout(() => {
        setLastTransactionId(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [lastTransactionId])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value)
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

  // Cập nhật hàm handleWithdraw để xử lý rút tiền đúng cách
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

      // Gửi yêu cầu rút tiền đến backend
      const response = await axios.post(
        `http://localhost:5000/api/shipper/${shipperId}/withdraw`,
        {
          amount,
          paymentMethod,
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

  const handleWithdrawSuccessOk = () => {
    setShowWithdrawSuccess(false)
    setWithdrawAmount("")
    setSelectedWithdrawAmount(null)
    // Chuyển sang tab lịch sử giao dịch sau khi rút tiền thành công
    setActiveTab("history")
    // Tải lại lịch sử giao dịch để hiển thị giao dịch mới nhất
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

  // Render lịch sử giao dịch
  const renderTransactionHistory = () => {
    if (historyLoading) {
      return <div className="loading">Đang tải lịch sử giao dịch...</div>
    }

    if (transactionHistory.length === 0) {
      return <div className="empty-history">Không có giao dịch nào</div>
    }

    return (
      <div className="transaction-history">
        <table className="transaction-table">
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
                className={`transaction-row ${transaction.type} ${transaction.id === lastTransactionId ? "highlight" : ""}`}
              >
                <td>{formatDate(transaction.date)}</td>
                <td>
                  {transaction.type === "withdraw" ? (
                    <span className="transaction-type withdraw">Rút tiền</span>
                  ) : transaction.type === "deposit" ? (
                    <span className="transaction-type deposit">Nạp tiền</span>
                  ) : (
                    <span className="transaction-type order">Đơn hàng</span>
                  )}
                </td>
                <td className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === "withdraw" ? "-" : "+"}
                  {formatCurrency(transaction.amount)}
                </td>
                <td>
                  <span className={`transaction-status ${transaction.status}`}>
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
    )
  }

  return (
    <div className="finance-management">
      <h1>Quản lý tài chính</h1>

      <div className="tabs">
        <div className={`tab ${activeTab === "withdraw" ? "active" : ""}`} onClick={() => handleTabChange("withdraw")}>
          <FaWallet className="tab-icon" /> Rút tiền
        </div>
        <div className={`tab ${activeTab === "history" ? "active" : ""}`} onClick={() => handleTabChange("history")}>
          <FaHistory className="tab-icon" /> Lịch sử giao dịch
        </div>
      </div>

      <div className="content-container">
        <div className="main-content">
          {activeTab === "withdraw" ? (
            // Tab rút tiền
            <div className="withdrawal-form">
              <h2>Rút tiền</h2>
              <p>Nhập số tiền và chọn phương thức thanh toán để rút tiền từ ví của bạn.</p>

              {error && <div className="error-message">{error}</div>}

              {showWithdrawSuccess ? (
                // Thông báo rút tiền thành công
                <div className="success-message">
                  <div className="success-icon">
                    <FaCheckCircle />
                  </div>
                  <h3>Rút tiền thành công!</h3>
                  <p>Số tiền {formatCurrency(Number(withdrawAmount))} đã được chuyển đến tài khoản của bạn</p>
                  <button className="ok-button" onClick={handleWithdrawSuccessOk}>
                    Xem lịch sử giao dịch
                  </button>
                </div>
              ) : showWithdrawConfirmation ? (
                // Màn hình xác nhận rút tiền
                <div className="confirmation-section">
                  <h3>Xác nhận thông tin rút tiền</h3>
                  <div className="beneficiary-info withdraw-info">
                    <div className="beneficiary-details">
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
                        <strong>Phương thức thanh toán:</strong>{" "}
                        {paymentMethod === "bank"
                          ? "Chuyển khoản ngân hàng"
                          : paymentMethod === "card"
                            ? "Thẻ tín dụng/ghi nợ"
                            : "Tiền mặt"}
                      </p>
                    </div>
                  </div>
                  <div className="confirmation-actions">
                    <button className="confirm-button" onClick={handleWithdraw} disabled={loading}>
                      {loading ? "Đang xử lý..." : "Xác nhận rút tiền"}
                    </button>
                    <button className="cancel-button" onClick={handleCancelConfirmation} disabled={loading}>
                      Quay lại
                    </button>
                  </div>
                </div>
              ) : (
                // Màn hình nhập số tiền rút
                <>
                  <div className="form-group">
                    <label>Số tiền rút</label>
                    <div className="deposit-options">
                      {[50000, 100000, 200000, 500000, 1000000, 2000000].map((amount) => (
                        <button
                          key={amount}
                          className={`deposit-option ${selectedWithdrawAmount === amount ? "selected" : ""}`}
                          onClick={() => handleAmountSelect(amount)}
                          disabled={amount > walletData.totalWallet}
                        >
                          {formatCurrency(amount)}
                        </button>
                      ))}
                    </div>
                    <div className="input-wrapper">
                      <span className="currency-symbol">₫</span>
                      <input
                        type="number"
                        placeholder="Nhập số tiền khác"
                        value={withdrawAmount}
                        onChange={handleAmountChange}
                        className="amount-input"
                        disabled={loading}
                      />
                    </div>
                    <div className="min-amount">Số tiền rút tối thiểu: {formatCurrency(walletData.minWithdrawal)}</div>
                    {withdrawAmount > walletData.totalWallet && (
                      <p className="error-message">Số dư trong ví không đủ</p>
                    )}
                    {Number(withdrawAmount) < walletData.minWithdrawal && withdrawAmount && (
                      <p className="error-message">
                        Số tiền rút tối thiểu là {formatCurrency(walletData.minWithdrawal)}
                      </p>
                    )}
                    {Number(withdrawAmount) > walletData.maxWithdrawal && (
                      <p className="error-message">Số tiền rút tối đa là {formatCurrency(walletData.maxWithdrawal)}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Phương thức thanh toán</label>
                    <div className="payment-methods">
                      <div className="payment-method">
                        <input
                          type="radio"
                          id="bank"
                          name="paymentMethod"
                          value="bank"
                          checked={paymentMethod === "bank"}
                          onChange={handlePaymentMethodChange}
                          disabled={loading}
                        />
                        <label htmlFor="bank">
                          <span className="radio-custom"></span>
                          <span className="icon bank-icon">💳</span>
                          <span>Chuyển khoản ngân hàng</span>
                        </label>
                      </div>

                      <div className="payment-method">
                        <input
                          type="radio"
                          id="card"
                          name="paymentMethod"
                          value="card"
                          checked={paymentMethod === "card"}
                          onChange={handlePaymentMethodChange}
                          disabled={loading}
                        />
                        {/* <label htmlFor="card">
                          <span className="radio-custom"></span>
                          <span className="icon card-icon">💳</span>
                          <span>Thẻ tín dụng/ghi nợ</span>
                        </label> */}
                      </div>

                      <div className="payment-method">
                        <input
                          type="radio"
                          id="cash"
                          name="paymentMethod"
                          value="cash"
                          checked={paymentMethod === "cash"}
                          onChange={handlePaymentMethodChange}
                          disabled={loading}
                        />
                        {/* <label htmlFor="cash">
                          <span className="radio-custom"></span>
                          <span className="icon cash-icon">💰</span>
                          <span>Tiền mặt</span>
                        </label> */}
                      </div>
                    </div>
                    {paymentMethod === "bank" && shipperData && (
                      <div className="bank-info-display">
                        <h3>Thông tin tài khoản ngân hàng của bạn</h3>
                        <div className="bank-info-item">
                          <span className="bank-info-label">Ngân hàng:</span>
                          <span className="bank-info-value">{shipperData.BankName || "Chưa cập nhật"}</span>
                        </div>
                        <div className="bank-info-item">
                          <span className="bank-info-label">Số tài khoản:</span>
                          <span className="bank-info-value">{shipperData.BankAccountNumber || "Chưa cập nhật"}</span>
                        </div>
                        <div className="bank-info-item">
                          <span className="bank-info-label">Chủ tài khoản:</span>
                          <span className="bank-info-value">{shipperData.FullName || "Chưa cập nhật"}</span>
                        </div>
                        {(!shipperData.BankName || !shipperData.BankAccountNumber) && (
                          <p className="bank-info-warning">
                            Vui lòng cập nhật thông tin ngân hàng trong trang cá nhân để sử dụng phương thức này.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    className="withdraw-button"
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
            // Tab lịch sử giao dịch
            <div className="history-section">
              <h2>Lịch sử giao dịch</h2>
              <p>Danh sách các giao dịch nạp và rút tiền của bạn</p>
              {renderTransactionHistory()}
            </div>
          )}
        </div>

        <div className="account-summary">
          <h2>Tóm tắt tài khoản</h2>
          <p>Thông tin về số dư và hạn mức rút tiền của bạn</p>

          {loading ? (
            <div className="loading">Đang tải dữ liệu...</div>
          ) : (
            <div>
              <div className="summary-item">
                <div className="summary-label">Số dư hiện tại</div>
                <div className="summary-value">{formatCurrency(walletData.totalWallet)}</div>
              </div>

              <div className="summary-item">
                <div className="summary-label">Hạn mức rút tối thiểu</div>
                <div className="summary-value">{formatCurrency(walletData.minWithdrawal)}</div>
              </div>

              <div className="summary-item">
                <div className="summary-label">Hạn mức rút tối đa</div>
                <div className="summary-value">{formatCurrency(walletData.maxWithdrawal)}</div>
              </div>

              <div className="summary-item">
                <div className="summary-label">
                  <span className="icon time-icon">⏱️</span>
                  Thời gian xử lý:
                </div>
                <div className="summary-value">{walletData.processingTime}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

