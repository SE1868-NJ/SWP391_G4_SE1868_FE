import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './components/pages/Login/Login';
import Home from './components/pages/Home/Home';
import Shipper from './components/pages/Shipper';
import ManageShipper from './components/pages/ShipperAccount/ManageShipper';
import ForgotPassword from './components/pages/Login/ForgotPassword';
import ResetPassword from './components/pages/Login/ResetPassword';
import ShipperContact from './components/pages/Home/ShipperContact';
import EventDetail from './components/pages/Home/EventDetail';
import About from './components/pages/Home/About';
import News from './components/pages/Home/News';
import ShipperRegister from './components/pages/Login/ShipperRegister';
import ShipperAccount from './components/pages/ShipperAccount/ShipperAccount';
import UpdateShipperInfo from './components/pages/ShipperAccount/UpdateShipperInfo';
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <navigate to="/login" />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<ShipperRegister />} />
      {/* Các route yêu cầu đăng nhập */}
      <Route
        path="/shipper"
        element={
          <PrivateRoute>
            <Shipper />
          </PrivateRoute>
        }
      />
      <Route
        path="/shipper-account"
        element={
          <PrivateRoute>
            <ShipperAccount />
          </PrivateRoute>
        }
      />
      <Route path='/update-shipper-info' element={<UpdateShipperInfo />}/>
      <Route path="/manage-shipper" element={<ManageShipper />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/shipper-contact" element={<ShipperContact />} />
      <Route path="/eventdetail" element={<EventDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/news" element={<News />} />
    </Routes>
  </Router>
);