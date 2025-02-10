import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './components/pages/Login';
import Home from './components/pages/Home';
import Register from './components/pages/Register';
import Shipper from './components/pages/Shipper';
import ManageShipper from './components/pages/ManageShipper';
import ForgotPassword from './components/pages/ForgotPassword';
import ResetPassword from './components/pages/ResetPassword';
import ShipperContact from './components/pages/ShipperContact';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <Router>
   <Routes>
     <Route path="/" element={<Home />} />
     <Route path="/home" element={<Home />} />
     <Route path="/login" element={<Login />} />
     <Route path="/register" element={<Register />} />
     <Route path="/shipper" element={<Shipper />}></Route>
    <Route path="/manage-shipper" element={<ManageShipper />}></Route>
    <Route path="/forgot-password" element={<ForgotPassword />}></Route>
    <Route path="/reset-password" element={<ResetPassword />}></Route>  
    <Route path="/shipper-contact" element={<ShipperContact />}></Route>
   </Routes>
 </Router>
);