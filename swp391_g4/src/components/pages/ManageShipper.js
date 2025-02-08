import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/ManageShipper.css";
import { FaUser, FaPhone, FaEnvelope, FaCalendar, FaMapMarkerAlt, FaTruck, FaUniversity,FaLock } from "react-icons/fa";

const ManageShipper = () => {
  const [shippers, setShippers] = useState([]);
  const [form, setForm] = useState({ 
    FullName: "", 
    PhoneNumber: "", 
    Email: "", 
    DateOfBirth: "", 
    Address: "", 
    BankAccountNumber: "", 
    VehicleDetails: "", 
    Status: "" ,
    Password: ""
  });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/shippers")
      .then((response) => {
        console.log("Shippers:", response.data);
        setShippers(response.data);
      })
      .catch((error) => console.error("Error fetching shippers:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const handleAddShipper = () => {
    setErrorMessage("");
    console.log("handleAddShipper is being called");
    axios
      .post("http://localhost:5000/api/shippers", form)
      .then((response) => {
        console.log("Shipper added successfully:", response.data);
        setShippers((prev) => [...prev, { ShipperID: response.data.ShipperID, ...form }]);
        setForm({ FullName: "", 
          PhoneNumber: "", 
          Email: "", 
          DateOfBirth: "", 
          Address: "", 
          BankAccountNumber: "", 
          VehicleDetails: "", 
          Status: "Active" ,
          Password: ""});
      })
      .catch((error) => {
        if (error.response && error.response.data.error) {
          setErrorMessage(error.response.data.error);  // Cập nhật lỗi từ backend
        } else {
          setErrorMessage("Lỗi không xác định!");
        }
      });
  };
  
  const handleEditShipper = (shipper) => {
    setForm({
      ShipperID: shipper.ShipperID,   // Set the ShipperID to identify which shipper to edit
      FullName: shipper.FullName,      // Set the FullName field
      PhoneNumber: shipper.PhoneNumber, // Set the PhoneNumber field
      Email: shipper.Email,            // Set the Email field
      DateOfBirth: shipper.DateOfBirth, // Set the DateOfBirth field
      Address: shipper.Address,        // Set the Address field
      BankAccountNumber: shipper.BankAccountNumber, // Set the BankAccountNumber field
      VehicleDetails: shipper.VehicleDetails, // Set the VehicleDetails field
      Status: shipper.Status           // Set the Status field (Active/Inactive)
    });
  };
  const handleSaveEdit = () => {
    axios
      .put("http://localhost:5000/api/shippers", form)  // Gửi form chứa thông tin cần cập nhật
      .then((response) => {
        setShippers((prev) =>
          prev.map((shipper) =>
            shipper.ShipperID === form.ShipperID
              ? { ...shipper, ...form }
              : shipper
          )
        );
        setForm({
          ShipperID: "",
          FullName: "", 
          PhoneNumber: "", 
          Email: "", 
          DateOfBirth: "", 
          Address: "", 
          BankAccountNumber: "", 
          VehicleDetails: "", 
          Status: "Active",
          Password: ""
        });
        alert("Shipper updated successfully!");
      })
      .catch((error) => console.error("Error updating shipper:", error));
  };
  
  return (
    <div className="container">
      <h1 className="title">Manage Shippers</h1>
      <table className="shipper-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Date of Birth</th>
            <th>Address</th>
            <th>Bank Account</th>
            <th>Vehicle Details</th>
            <th>Status</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shippers.map((shipper) => (
            <tr key={shipper.ShipperID}>
              <td>{shipper.FullName}</td>
              <td>{shipper.PhoneNumber}</td>
              <td>{shipper.Email}</td>
              <td>{shipper.DateOfBirth}</td>
              <td>{shipper.Address}</td>
              <td>{shipper.BankAccountNumber}</td>
              <td>{shipper.VehicleDetails}</td>
              <td>{shipper.Status}</td>
              <td>{shipper.Password}</td>
              <td>
                <button onClick={() => handleEditShipper(shipper)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="subtitle">Add New Shipper</h2>
      {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}
      <div className="form-container">
        <div className="input-group"><FaUser /><input type="text" name="FullName" placeholder="Full Name" value={form.FullName} onChange={handleInputChange} /></div>
        <div className="input-group"><FaPhone /><input type="text" name="PhoneNumber" placeholder="Phone Number" value={form.PhoneNumber} onChange={handleInputChange} /></div>
        <div className="input-group"><FaEnvelope /><input type="email" name="Email" placeholder="Email" value={form.Email} onChange={handleInputChange} /></div>
        <div className="input-group"><FaCalendar /><input type="date" name="DateOfBirth" value={form.DateOfBirth} onChange={handleInputChange} /></div>
        <div className="input-group"><FaMapMarkerAlt /><input type="text" name="Address" placeholder="Address" value={form.Address} onChange={handleInputChange} /></div>
        <div className="input-group"><FaUniversity /><input type="text" name="BankAccountNumber" placeholder="Bank Account Number" value={form.BankAccountNumber} onChange={handleInputChange} /></div>
        <div className="input-group"><FaTruck /><input type="text" name="VehicleDetails" placeholder="Vehicle Details" value={form.VehicleDetails} onChange={handleInputChange} /></div>
        <div className="input-group"><FaLock /><input type="password" name="Password" placeholder="Password" value={form.Password} onChange={handleInputChange} /></div>
        <select name="Status" value={form.Status} onChange={handleInputChange}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button className="add-button" onClick={handleAddShipper}>Add Shipper</button>
      </div>
      {form.ShipperID && (
      <div className="form-container edit-mode"> {}
      <div><h2 className="subtitle">Edit Shipper</h2></div>
        
        {/* Edit Shipper form */}
        <div className="input-group"><FaUser /><input type="text" name="FullName" placeholder="Full Name" value={form.FullName} onChange={handleInputChange} /></div>
        <div className="input-group"><FaPhone /><input type="text" name="PhoneNumber" placeholder="Phone Number" value={form.PhoneNumber} onChange={handleInputChange} /></div>
        <div className="input-group"><FaEnvelope /><input type="email" name="Email" placeholder="Email" value={form.Email} onChange={handleInputChange} /></div>
        <div className="input-group"><FaCalendar /><input type="date" name="DateOfBirth" value={form.DateOfBirth} onChange={handleInputChange} /></div>
        <div className="input-group"><FaMapMarkerAlt /><input type="text" name="Address" placeholder="Address" value={form.Address} onChange={handleInputChange} /></div>
        <div className="input-group"><FaUniversity /><input type="text" name="BankAccountNumber" placeholder="Bank Account Number" value={form.BankAccountNumber} onChange={handleInputChange} /></div>
        <div className="input-group"><FaTruck /><input type="text" name="VehicleDetails" placeholder="Vehicle Details" value={form.VehicleDetails} onChange={handleInputChange} /></div>
        <div className="input-group"><FaLock /><input type="password" name="Password" placeholder="Password" value={form.Password} onChange={handleInputChange} /></div>
        <select name="Status" value={form.Status} onChange={handleInputChange}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button className="save-button" onClick={handleSaveEdit}>Save Changes</button>
      </div>
    )}
    </div>
  );
};

export default ManageShipper;