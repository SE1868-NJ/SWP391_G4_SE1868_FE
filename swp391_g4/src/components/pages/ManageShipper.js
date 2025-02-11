import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/ManageShipper.css";


const ManageShipper = () => {
  const [pendingShippers, setPendingShippers] = useState([]);
  const [approvedShippers, setApprovedShippers] = useState([]);
  const [editingShipper, setEditingShipper] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    fetchShippers();
  }, []);
  const fetchShippers = () => {
    axios.get("http://localhost:5000/api/pending-shippers")
      .then((response) => setPendingShippers(response.data))
      .catch((error) => console.error("Error fetching pending shippers:", error));

    axios.get("http://localhost:5000/api/approved-shippers")
      .then((response) => setApprovedShippers(response.data))
      .catch((error) => console.error("Error fetching approved shippers:", error));
  };
  // Xử lý tìm kiếm
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      fetchShippers(); // Nếu ô tìm kiếm trống, lấy lại toàn bộ danh sách
      return;
    }

    axios.get(`http://localhost:5000/api/search-pending-shippers?query=${query}`)
      .then((response) => setPendingShippers(response.data))
      .catch((error) => console.error("Error searching pending shippers:", error));

    axios.get(`http://localhost:5000/api/search-approved-shippers?query=${query}`)
      .then((response) => setApprovedShippers(response.data))
      .catch((error) => console.error("Error searching approved shippers:", error));
  };
  const handleApprove = (id) => {
    axios.post("http://localhost:5000/api/approve-shipper", { id })
      .then(() => {
        setPendingShippers(pendingShippers.filter(shipper => shipper.id !== id));
        axios.get("http://localhost:5000/api/approved-shippers")
          .then((response) => setApprovedShippers(response.data));
      })
      .catch(error => console.error("Error approving shipper:", error));
  };

  const handleReject = (id) => {
    axios.post("http://localhost:5000/api/reject-shipper", { id })
      .then(() => {
        setPendingShippers(pendingShippers.filter(shipper => shipper.id !== id));
      })
      .catch(error => console.error("Error rejecting shipper:", error));
  };

  const handleUpdate = () => {
    if (!editingShipper || !editingShipper.ShipperID) {
      console.error("❌ Không có dữ liệu hợp lệ để cập nhật:", editingShipper);
      return;
    }

    // Định dạng lại DateOfBirth nếu có
    if (editingShipper.DateOfBirth) {
      editingShipper.DateOfBirth = new Date(editingShipper.DateOfBirth).toISOString().split('T')[0];
    }

    console.log("🔹 Sending update request:", editingShipper);

    axios.put("http://localhost:5000/api/update-shipper", editingShipper)
      .then((response) => {
        console.log("✅ Update successful:", response.data);
        setApprovedShippers(approvedShippers.map(s => s.ShipperID === editingShipper.ShipperID ? editingShipper : s));
        setEditingShipper(null);
      })
      .catch(error => console.error("❌ Error updating shipper:", error));
  };
  

  return (
    <div className="manage-shipper-container">
      <h2>Quản lý Shipper</h2>

      {/* Ô tìm kiếm */}
      <input
        type="text"
        placeholder="Tìm kiếm theo tên, số điện thoại, email..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="search-bar"
      />
      <h2>Danh sách đăng ký chờ duyệt</h2>
      <table className="shipper-table">
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Số điện thoại</th>
            <th>Email</th>
            <th>Ngày sinh</th>
            <th>Địa chỉ</th>
            <th>Số tài khoản</th>
            <th>Chi tiết phương tiện</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {pendingShippers.map((shipper) => (
            <tr key={shipper.id}>
              <td>{shipper.FullName}</td>
              <td>{shipper.PhoneNumber}</td>
              <td>{shipper.Email}</td>
              <td>{shipper.DateOfBirth}</td>
              <td>{shipper.Address}</td>
              <td>{shipper.BankAccountNumber}</td>
              <td>{shipper.VehicleDetails}</td>
              <td>{shipper.RegistrationStatus}</td>
              <td>
                <button className="approve-btn" onClick={() => handleApprove(shipper.id)}>Duyệt</button>
                <button className="reject-btn" onClick={() => handleReject(shipper.id)}>Từ chối</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Danh sách shipper đã duyệt</h2>
      <table className="shipper-table">
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Số điện thoại</th>
            <th>Email</th>
            <th>Ngày sinh</th>
            <th>Địa chỉ</th>
            <th>Số tài khoản</th>
            <th>Chi tiết phương tiện</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {approvedShippers.map((shipper) => (
            <tr key={shipper.ShipperID}>
              <td><input value={editingShipper?.ShipperID === shipper.ShipperID ? editingShipper.FullName : shipper.FullName} onChange={(e) => setEditingShipper({ ...shipper, FullName: e.target.value })} /></td>
              <td><input value={editingShipper?.ShipperID === shipper.ShipperID ? editingShipper.PhoneNumber : shipper.PhoneNumber} onChange={(e) => setEditingShipper({ ...shipper, PhoneNumber: e.target.value })} /></td>
              <td><input value={editingShipper?.ShipperID === shipper.ShipperID ? editingShipper.Email : shipper.Email} onChange={(e) => setEditingShipper({ ...shipper, Email: e.target.value })} /></td>
              <td><input type="date" value={editingShipper?.ShipperID === shipper.ShipperID ? editingShipper.DateOfBirth : shipper.DateOfBirth} onChange={(e) => setEditingShipper({ ...shipper, DateOfBirth: e.target.value })} /></td>
              <td><input value={editingShipper?.ShipperID === shipper.ShipperID ? editingShipper.Address : shipper.Address} onChange={(e) => setEditingShipper({ ...shipper, Address: e.target.value })} /></td>
              <td><input value={editingShipper?.ShipperID === shipper.ShipperID ? editingShipper.BankAccountNumber : shipper.BankAccountNumber} onChange={(e) => setEditingShipper({ ...shipper, BankAccountNumber: e.target.value })} /></td>
              <td><input value={editingShipper?.ShipperID === shipper.ShipperID ? editingShipper.VehicleDetails : shipper.VehicleDetails} onChange={(e) => setEditingShipper({ ...shipper, VehicleDetails: e.target.value })} /></td>
              <td><button onClick={handleUpdate}>Lưu</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ManageShipper;
