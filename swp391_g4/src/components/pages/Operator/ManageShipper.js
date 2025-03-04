import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../styles/ManageShipper.css";
import moment from "moment";
import BackButton from "../../buttons/BackButton";

const ManageShipper = () => {
  const [pendingRegisterShippers, setPendingRegisterShippers] = useState([]);
  const [updatingShippers, setUpdatingShippers] = useState([]);
  const [cancelingShippers, setCancelingShippers] = useState([]);
  const [approvedShippers, setApprovedShippers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [selectedShipper, setSelectedShipper] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelTime, setCancelTime] = useState("Forever");
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [shipperUpdateDetails, setShipperUpdateDetails] = useState(null); // Thông tin chi tiết của shipper đang update

  useEffect(() => {
    fetchShippers();
  }, []);

  const fetchShippers = () => {
    // Fetch data for each category
    axios
      .get("http://localhost:5000/api/pending-register-shippers")
      .then((response) => setPendingRegisterShippers(response.data))
      .catch((error) =>
        console.error("Error fetching pending register shippers:", error)
      );

    axios
      .get("http://localhost:5000/api/pending-update-shippers")
      .then((response) => setUpdatingShippers(response.data))
      .catch((error) =>
        console.error("Error fetching updating shippers:", error)
      );

    axios
      .get("http://localhost:5000/api/pending-cancel-shippers")
      .then((response) => setCancelingShippers(response.data))
      .catch((error) =>
        console.error("Error fetching canceling shippers:", error)
      );

    axios
      .get("http://localhost:5000/api/shippers")
      .then((response) => setApprovedShippers(response.data))
      .catch((error) =>
        console.error("Error fetching approved shippers:", error)
      );
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      fetchShippers(); // If search is empty, fetch all shippers
      return;
    }

    axios
      .get(`http://localhost:5000/api/search-pending-shippers?query=${query}`)
      .then((response) => setPendingRegisterShippers(response.data))
      .catch((error) =>
        console.error("Error searching pending register shippers:", error)
      );

    axios
      .get(`http://localhost:5000/api/search-updating-shippers?query=${query}`)
      .then((response) => setUpdatingShippers(response.data))
      .catch((error) =>
        console.error("Error searching updating shippers:", error)
      );

    axios
      .get(`http://localhost:5000/api/search-canceling-shippers?query=${query}`)
      .then((response) => setCancelingShippers(response.data))
      .catch((error) =>
        console.error("Error searching canceling shippers:", error)
      );

    axios
      .get(`http://localhost:5000/api/search-approved-shippers?query=${query}`)
      .then((response) => setApprovedShippers(response.data))
      .catch((error) =>
        console.error("Error searching approved shippers:", error)
      );
  };
  const fetchShipperUpdateDetails = (id) => {
    axios
      .get(`http://localhost:5000/api/shipper-update-details/${id}`)
      .then((response) => {
        setShipperUpdateDetails(response.data);
        setShowUpdatePopup(true);
      })
      .catch((error) =>
        console.error("Error fetching shipper update details:", error)
      );
  };

  const handleStateChange = (id, newStatus, currentStatus) => {
    // Nếu chuyển từ PendingCancel sang Inactive
    if (currentStatus === "PendingCancel" && newStatus === "Inactive") {
      // Tìm shipper để hiển thị thông tin trong popup
      const shipper = cancelingShippers.find((s) => s.ShipperID === id);
      if (shipper) {
        setSelectedShipper(shipper);
        setShowCancelPopup(true);
      }
    }
    // Nếu chuyển từ PendingUpdate sang Active
    else if (currentStatus === "PendingUpdate" && newStatus === "Active") {
      fetchShipperUpdateDetails(id);
    } else {
      // Xử lý các trường hợp khác
      axios
        .post("http://localhost:5000/api/change-shipper-status", {
          id,
          newStatus,
        })
        .then(() => {
          fetchShippers(); // Refresh the list after state change
        })
        .catch((error) =>
          console.error("Error changing shipper status:", error)
        );
    }
  };

  const handleConfirmCancel = () => {
    if (!selectedShipper || !cancelReason.trim()) {
      alert("Vui lòng nhập lý do hủy tài khoản");
      return;
    }

    axios
      .post("http://localhost:5000/api/change-shipper-status", {
        id: selectedShipper.ShipperID,
        newStatus: "Inactive",
        cancelReason: cancelReason,
        cancelTime: cancelTime,
      })
      .then(() => {
        setShowCancelPopup(false);
        setCancelReason("");
        setSelectedShipper(null);
        fetchShippers();
      })
      .catch((error) =>
        console.error("Error canceling shipper account:", error)
      );
  };
  const handleConfirmUpdate = () => {
    if (!shipperUpdateDetails) return;

    axios
      .post("http://localhost:5000/api/change-shipper-status", {
        id: shipperUpdateDetails.ShipperID,
        newStatus: "Active",
      })
      .then(() => {
        setShowUpdatePopup(false);
        setShipperUpdateDetails(null);
        fetchShippers();
      })
      .catch((error) =>
        console.error("Error updating shipper account:", error)
      );
  };
  const handleUpdatePopupClose = () => {
    setShowUpdatePopup(false);
    setShipperUpdateDetails(null);
  };

  const handleCancelPopupClose = () => {
    setShowCancelPopup(false);
    setCancelReason("");
    setSelectedShipper(null);
  };

  const handleShipperDetail = () => {
    window.location.href = `/shipper-detail`;
  };
  // Hàm để highlight thay đổi
  const highlightChange = (oldValue, newValue) => {
    if (oldValue !== newValue && newValue) {
      return { color: "#388e3c", fontWeight: "bold" };
    }
    return {};
  };
  return (
    <div className="manage-shipper-container">
      <h2>Quản lý Shipper</h2>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Tìm kiếm theo tên, số điện thoại, email..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="manage-shipper-search-bar"
      />

      {/* Pending Register */}
      <h2>Danh sách đăng ký chờ duyệt</h2>
      <table className="manage-shipper-table">
        <thead>
          <tr>
            <th>ID Shipper</th>
            <th>Họ tên</th>
            <th>Số điện thoại</th>
            <th>Email</th>
            <th>Ngày sinh</th>
            <th>Quận</th>
            <th>Ngân Hàng</th>
            <th>Loại xe</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {pendingRegisterShippers.map((shipper) => (
            <tr key={shipper.ShipperID}>
              <td>{shipper.ShipperID}</td>
              <td>{shipper.FullName}</td>
              <td>{shipper.PhoneNumber}</td>
              <td>{shipper.Email}</td>
              <td>{moment(shipper.DateOfBirth).format("DD-MM-YYYY")}</td>
              <td>{shipper.District}</td>
              <td>{shipper.BankName}</td>
              <td>{shipper.VehicleType}</td>
              <td>{shipper.Status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          className="manage-shipper-detail-button"
          onClick={handleShipperDetail}
        >
          Duyệt chi tiết
        </button>
      </div>

      {/* Pending Update */}
      <h2>Danh sách shipper đang chờ cập nhật</h2>
      <table className="manage-shipper-table">
        <thead>
          <tr>
            <th>ID Shipper</th>
            <th>Họ tên</th>
            <th>Số điện thoại</th>
            <th>Email</th>
            <th>Ngày sinh</th>
            <th>Quận</th>
            <th>Ngân Hàng</th>
            <th>Loại xe</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {updatingShippers.map((shipper) => (
            <tr key={shipper.ShipperID}>
              <td>{shipper.ShipperID}</td>
              <td>{shipper.FullName}</td>
              <td>{shipper.PhoneNumber}</td>
              <td>{shipper.Email}</td>
              <td>{moment(shipper.DateOfBirth).format("DD-MM-YYYY")}</td>
              <td>{shipper.District}</td>
              <td>{shipper.BankName}</td>
              <td>{shipper.VehicleType}</td>
              <td>
                <select
                  value={shipper.Status}
                  onChange={(e) =>
                    handleStateChange(
                      shipper.ShipperID,
                      e.target.value,
                      shipper.Status
                    )
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="PendingUpdate">Pending Update</option>
                  <option value="PendingCancel">Pending Cancel</option>
                  <option value="Updated">Updated</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pending Cancel */}
      <h2>Danh sách shipper đang chờ hủy tài khoản</h2>
      <table className="manage-shipper-table">
        <thead>
          <tr>
            <th>ID Shipper</th>
            <th>Họ tên</th>
            <th>Số điện thoại</th>
            <th>Email</th>
            <th>Ngày sinh</th>
            <th>Quận</th>
            <th>Ngân Hàng</th>
            <th>Loại xe</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {cancelingShippers.map((shipper) => (
            <tr key={shipper.ShipperID}>
              <td>{shipper.ShipperID}</td>
              <td>{shipper.FullName}</td>
              <td>{shipper.PhoneNumber}</td>
              <td>{shipper.Email}</td>
              <td>{moment(shipper.DateOfBirth).format("DD-MM-YYYY")}</td>
              <td>{shipper.District}</td>
              <td>{shipper.BankName}</td>
              <td>{shipper.VehicleType}</td>
              <td>
                <select
                  value={shipper.Status}
                  onChange={(e) =>
                    handleStateChange(
                      shipper.ShipperID,
                      e.target.value,
                      shipper.Status
                    )
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="PendingUpdate">Pending Update</option>
                  <option value="PendingCancel">Pending Cancel</option>
                  <option value="Updated">Updated</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Approved Shippers */}
      <h2>Danh sách shipper đã duyệt</h2>
      <table className="manage-shipper-table">
        <thead>
          <tr>
            <th>ID Shipper</th>
            <th>Họ tên</th>
            <th>Số điện thoại</th>
            <th>Email</th>
            <th>Ngày sinh</th>
            <th>Quận</th>
            <th>Ngân Hàng</th>
            <th>Loại xe</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {approvedShippers.map((shipper) => (
            <tr key={shipper.ShipperID}>
              <td>{shipper.ShipperID}</td>
              <td>{shipper.FullName}</td>
              <td>{shipper.PhoneNumber}</td>
              <td>{shipper.Email}</td>
              <td>{moment(shipper.DateOfBirth).format("DD-MM-YYYY")}</td>
              <td>{shipper.District}</td>
              <td>{shipper.BankName}</td>
              <td>{shipper.VehicleType}</td>
              <td>
                <select
                  value={shipper.Status}
                  onChange={(e) =>
                    handleStateChange(
                      shipper.ShipperID,
                      e.target.value,
                      shipper.Status
                    )
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="PendingUpdate">Pending Update</option>
                  <option value="PendingCancel">Pending Cancel</option>
                  <option value="Updated">Updated</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <BackButton />
      </div>
      {/* Cancel Confirmation Popup */}
      {showCancelPopup && selectedShipper && (
        <div className="manage-shipper-popup-overlay">
          <div className="manage-shipper-popup-container">
            <h3>Xác nhận hủy tài khoản Shipper</h3>
            <p>
              Bạn có chắc muốn hủy tài khoản của shipper{" "}
              <strong>{selectedShipper.FullName}</strong>?
            </p>

            <div className="manage-shipper-popup-form-group">
              <label>Lý do hủy:</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Nhập lý do hủy tài khoản"
                required
                rows={4}
              />
            </div>

            <div className="manage-shipper-popup-form-group">
              <label>Thời gian khóa tài khoản:</label>
              <select
                value={cancelTime}
                onChange={(e) => setCancelTime(e.target.value)}
                required
                className="manage-shipper-popup-select"
              >
                <option value="Warning">Cảnh báo</option>
                <option value="3Days">Khóa 3 ngày</option>
                <option value="7Days">Khóa 7 ngày</option>
                <option value="14Days">Khóa 14 ngày</option>
                <option value="Forever">Khóa vĩnh viễn</option>
              </select>
            </div>

            <div className="manage-shipper-popup-buttons">
              <button
                className="manage-shipper-detail-button manage-shipper-cancel-button"
                onClick={handleCancelPopupClose}
              >
                Hủy bỏ
              </button>
              <button
                className="manage-shipper-detail-button manage-shipper-confirm-button"
                onClick={handleConfirmCancel}
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Update Confirmation Popup */}
      {showUpdatePopup && shipperUpdateDetails && (
        <div className="manage-shipper-popup-overlay">
          <div
            className="manage-shipper-popup-container"
            style={{ width: "700px", maxWidth: "90%" }}
          >
            <h3>Xác nhận cập nhật thông tin Shipper</h3>
            <p>
              Xem xét các thay đổi thông tin của shipper{" "}
              <strong>{shipperUpdateDetails.FullName}</strong>:
            </p>

            <div className="manage-shipper-popup-form-group">
              <table
                className="manage-shipper-table"
                style={{ marginBottom: "20px" }}
              >
                <thead>
                  <tr>
                    <th>Thông tin</th>
                    <th>Giá trị hiện tại</th>
                    <th>Giá trị mới</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Số điện thoại</td>
                    <td>{shipperUpdateDetails.PhoneNumber}</td>
                    <td
                      style={highlightChange(
                        shipperUpdateDetails.PhoneNumber,
                        shipperUpdateDetails.TempPhoneNumber
                      )}
                    >
                      {shipperUpdateDetails.TempPhoneNumber ||
                        shipperUpdateDetails.PhoneNumber}
                    </td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>{shipperUpdateDetails.Email}</td>
                    <td
                      style={highlightChange(
                        shipperUpdateDetails.Email,
                        shipperUpdateDetails.TempEmail
                      )}
                    >
                      {shipperUpdateDetails.TempEmail ||
                        shipperUpdateDetails.Email}
                    </td>
                  </tr>
                  <tr>
                    <td>Phường/Xã</td>
                    <td>{shipperUpdateDetails.Ward}</td>
                    <td
                      style={highlightChange(
                        shipperUpdateDetails.Ward,
                        shipperUpdateDetails.TempWard
                      )}
                    >
                      {shipperUpdateDetails.TempWard ||
                        shipperUpdateDetails.Ward}
                    </td>
                  </tr>
                  <tr>
                    <td>Quận/Huyện</td>
                    <td>{shipperUpdateDetails.District}</td>
                    <td
                      style={highlightChange(
                        shipperUpdateDetails.District,
                        shipperUpdateDetails.TempDistrict
                      )}
                    >
                      {shipperUpdateDetails.TempDistrict ||
                        shipperUpdateDetails.District}
                    </td>
                  </tr>
                  <tr>
                    <td>Thành phố</td>
                    <td>{shipperUpdateDetails.City}</td>
                    <td
                      style={highlightChange(
                        shipperUpdateDetails.City,
                        shipperUpdateDetails.TempCity
                      )}
                    >
                      {shipperUpdateDetails.TempCity ||
                        shipperUpdateDetails.City}
                    </td>
                  </tr>
                  <tr>
                    <td>Ngân hàng</td>
                    <td>{shipperUpdateDetails.BankName}</td>
                    <td
                      style={highlightChange(
                        shipperUpdateDetails.BankName,
                        shipperUpdateDetails.TempBankName
                      )}
                    >
                      {shipperUpdateDetails.TempBankName ||
                        shipperUpdateDetails.BankName}
                    </td>
                  </tr>
                  <tr>
                    <td>Số tài khoản ngân hàng</td>
                    <td>{shipperUpdateDetails.BankAccountNumber}</td>
                    <td
                      style={highlightChange(
                        shipperUpdateDetails.BankAccountNumber,
                        shipperUpdateDetails.TempBankAccountNumber
                      )}
                    >
                      {shipperUpdateDetails.TempBankAccountNumber ||
                        shipperUpdateDetails.BankAccountNumber}
                    </td>
                  </tr>
                  <tr>
                    <td>Loại xe</td>
                    <td>{shipperUpdateDetails.VehicleType}</td>
                    <td
                      style={highlightChange(
                        shipperUpdateDetails.VehicleType,
                        shipperUpdateDetails.TempVehicleType
                      )}
                    >
                      {shipperUpdateDetails.TempVehicleType ||
                        shipperUpdateDetails.VehicleType}
                    </td>
                  </tr>
                  <tr>
                    <td>Biển số xe</td>
                    <td>{shipperUpdateDetails.LicensePlate}</td>
                    <td
                      style={highlightChange(
                        shipperUpdateDetails.LicensePlate,
                        shipperUpdateDetails.TempLicensePlate
                      )}
                    >
                      {shipperUpdateDetails.TempLicensePlate ||
                        shipperUpdateDetails.LicensePlate}
                    </td>
                  </tr>
                  <tr>
                    <td>Ngày đăng kiểm</td>
                    <td>{shipperUpdateDetails.RegistrationVehicle}</td>
                    <td
                      style={highlightChange(
                        shipperUpdateDetails.RegistrationVehicle,
                        shipperUpdateDetails.TempRegistrationVehicle
                      )}
                    >
                      {moment(
                        shipperUpdateDetails.TempRegistrationVehicle
                      ).format("DD-MM-YYYY") ||
                        moment(shipperUpdateDetails.RegistrationVehicle).format(
                          "DD-MM-YYYY"
                        )}
                    </td>
                  </tr>
                  <tr>
                    <td>Ngày hết hạn </td>
                    <td>{shipperUpdateDetails.ExpirationVehicle}</td>
                    <td
                      style={highlightChange(
                        shipperUpdateDetails.ExpirationVehicle,
                        shipperUpdateDetails.TempExpirationVehicle
                      )}
                    >
                      {moment(
                        shipperUpdateDetails.TempExpirationVehicle
                      ).format("DD-MM-YYYY") ||
                        moment(shipperUpdateDetails.ExpirationVehicle).format(
                          "DD-MM-YYYY"
                        )}
                    </td>
                  </tr>
                  <tr>
                    <td>Giấy đăng kiểm xe</td>
                    <td>{shipperUpdateDetails.VehicleRegistrationImage}</td>
                    <td
                      style={highlightChange(
                        shipperUpdateDetails.VehicleRegistrationImage,
                        shipperUpdateDetails.TempVehicleRegistrationImage
                      )}
                    >
                      {shipperUpdateDetails.TempVehicleRegistrationImage ||
                        shipperUpdateDetails.VehicleRegistrationImage}
                    </td>
                  </tr>
                  <tr>
                    <td>Ảnh thẻ Shipper</td>
                    <td>{shipperUpdateDetails.ImageShipper}</td>
                    <td
                      style={highlightChange(
                        shipperUpdateDetails.ImageShipper,
                        shipperUpdateDetails.TempImageShipper
                      )}
                    >
                      {shipperUpdateDetails.TempImageShipper ||
                        shipperUpdateDetails.ImageShipper}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="manage-shipper-popup-buttons">
              <button
                className="manage-shipper-detail-button manage-shipper-cancel-button"
                onClick={handleUpdatePopupClose}
              >
                Hủy bỏ
              </button>
              <button
                className="manage-shipper-detail-button manage-shipper-confirm-button"
                onClick={handleConfirmUpdate}
              >
                Xác nhận cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageShipper;