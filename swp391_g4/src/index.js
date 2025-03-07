import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

// Trang home
import Home from "./components/pages/Home/Home";
import About from "./components/pages/Home/About";
import News from "./components/pages/Home/News";
import ServiceDetailPage from "./components/pages/Home/ServiceDetailPage";
import PrivacyPolicy from "./components/pages/Home/PrivacyPolicy";
import TermsOfUse from "./components/pages/Home/TermOfUse";
import JobDetail from "./components/pages/Home/JobDetail";
import ShipperContact from "./components/pages/Home/ShipperContact";
import EventDetail from "./components/pages/Home/EventDetail";
import ActivityDetail from "./components/pages/Home/ActivityDetail";

//Trang login
import Login from "./components/pages/Login/Login";
import ForgotPassword from "./components/pages/Login/ForgotPassword";
import ResetPassword from "./components/pages/Login/ResetPassword";
import ShipperRegister from "./components/pages/Login/ShipperRegister";

//Trang Operator
import ManageShipper from "./components/pages/Operator/ManageShipper";
import ShipperDetail from "./components/pages/Operator/ShipperDetail";

import RevenueDashboard from "./components/pages/Operator/RevenueDashboard";


//Trang Shipper Account
import ShipperAccount from "./components/pages/ShipperAccount/ShipperAccount";
import UpdateShipperInfo from "./components/pages/ShipperAccount/UpdateShipperInfo";

//Trang Shipper
import Shipper from "./components/pages/Shipper/Shipper";
import OrderDetails from "./components/pages/Shipper/OrderDetails";


//Phan bao cao su co
import ReportIssue from "./components/pages/ReportIssue";
import AdminReportHandling from "./components/pages/AdminReportHandling";
import CustomerReportTracking from "./components/pages/CustomerReportTracking";


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <navigate to="/login" />;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Routes>
      {/* ** Trang Home ** */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/shipper-contact" element={<ShipperContact />} />
      <Route path="/eventdetail" element={<EventDetail />} />
      <Route path="/news" element={<News />} />
      <Route path="/news/:eventId" element={<EventDetail />} />
      <Route path="/activities/:activityId" element={<ActivityDetail />} />
      <Route path="/service/:serviceId" element={<ServiceDetailPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-use" element={<TermsOfUse />} />
      <Route path="/job/:jobId" element={<JobDetail />} />
      <Route path="/about" element={<About />} />

      {/* ** Trang Login ** */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/register" element={<ShipperRegister />} />


      {/* ** Trang Shipper** */}
      <Route
        path="/shipper"
        element={
          <PrivateRoute>
            <Shipper />
          </PrivateRoute>
        }
      />
      <Route path="/orderdetail/:id" element={<OrderDetails />} />

      {/* ** Trang ShipperAccount** */}
      <Route
        path="/shipper-account"
        element={
          <PrivateRoute>
            <ShipperAccount />
          </PrivateRoute>
        }
      />
      <Route path='/update-shipper-info' element={<UpdateShipperInfo />} />

      {/* ** Trang Operator** */}
      <Route path="/manage-shipper" element={<ManageShipper />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/shipper-contact" element={<ShipperContact />} />
      <Route path="/update-personal-info" element={<UpdateShipperInfo />} />
      <Route path="/eventdetail" element={<EventDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/news" element={<News />} />
      <Route path="/register" element={<ShipperRegister />} />
      <Route path="/news/:eventId" element={<EventDetail />} />
      <Route path="/service/:serviceId" element={<ServiceDetailPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-use" element={<TermsOfUse />} />
      <Route path="/job/:jobId" element={<JobDetail />} />
      <Route path='/shipper-detail' element={<ShipperDetail />} />
      <Route path='/revenue-dashboard' element={<RevenueDashboard />} />
      <Route path="/shipper-detail" element={<ShipperDetail />} />

      {/* ** Phan bao cao su co** */}
      <Route path="/report-issue" element={<ReportIssue />} />
      <Route path="/admin-report-handling" element={<AdminReportHandling />} />
      <Route path="/customer-report-tracking" element={<CustomerReportTracking />} />
    </Routes>
  </Router>
);
