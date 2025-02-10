import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './components/pages/Login';
import Home from './components/pages/Home';
import Register from './components/pages/Register';
import Shipper from './components/pages/Shipper';
import Contact from './components/pages/Contact';
<<<<<<< Updated upstream
import ManageShipper from './components/pages/ManageShipper';
=======
import ShipperAccount from './components/pages/ShipperAccount';
import UpdatePersonalInfo from './components/pages/UpdatePersonalInfo';
import CancelShipperAccount from './components/pages/CancelShipperAccount';
import ForgotPassword from './components/pages/ForgotPassword';
import ResetPassword from './components/pages/ResetPassword';


>>>>>>> Stashed changes
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <Router>
   <Routes>
     <Route path="/" element={<Home />} />
     <Route path="/home" element={<Home />} />
     <Route path="/login" element={<Login />} />
     <Route path="/register" element={<Register />} />
     <Route path="/shipper" element={<Shipper />}></Route>
     <Route path="/contact" element={<Contact />}></Route>
<<<<<<< Updated upstream
    <Route path="/manage-shipper" element={<ManageShipper />}></Route>
=======
     <Route path="/ShipperAccount" element={<ShipperAccount />}></Route>
     <Route path="/update-personal-info" element={<UpdatePersonalInfo />}></Route>
     <Route path="/cancel-shipper-account" element={<CancelShipperAccount />}></Route>
     <Route path="/forgot-password" element={<ForgotPassword />}></Route>
     <Route path="/reset-password" element={<ResetPassword />} />
>>>>>>> Stashed changes
   </Routes>
 </Router>
);