import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./index.css";

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

import Login from "./components/pages/Login/Login";
import ForgotPassword from "./components/pages/Login/ForgotPassword";
import ResetPassword from "./components/pages/Login/ResetPassword";
import ShipperRegister from "./components/pages/Login/ShipperRegister";

import ManageShipper from "./components/pages/Operator/ManageShipper";
import ShipperDetail from "./components/pages/Operator/ShipperDetail";
import RevenueDashboard from "./components/pages/Operator/RevenueDashboard";
import IncidentManagement from "./components/pages/Operator/IncidentManagement";

import ShipperAccount from "./components/pages/ShipperAccount/ShipperAccount";
import UpdateShipperInfo from "./components/pages/ShipperAccount/UpdateShipperInfo";
import FinanceManagementPage from "./components/pages/ShipperAccount/FinanceManagementPage";
//Trang Shipper
import Shipper from "./components/pages/Shipper/Shipper";
import OrderDetails from "./components/pages/Shipper/OrderDetails";
import ShipperDashboard from "./components/pages/Shipper/ShipperDashboard";

import ReportIssue from "./components/pages/Shipper/ReportIssue";
import AdminReportHandling from "./components/pages/Operator/AdminReportHandling";
import CustomerReportTracking from "./components/pages/CustomerReportTracking";

// Import controllers
import ShipperRanking from "./components/pages/Shipper/ShipperRanking";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      localStorage.removeItem("token");
      localStorage.removeItem("shipperId");
      localStorage.removeItem("shipperName");
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("shipperId");
    localStorage.removeItem("shipperName");
    return <Navigate to="/login" replace />;
  }
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
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

        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<ShipperRegister />} />

        <Route
          path="/history-delivery-order"
          element={<Navigate to="/dashboard/history" />}
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <ShipperDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/pending"
          element={
            <PrivateRoute>
              <ShipperDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/my-orders"
          element={
            <PrivateRoute>
              <ShipperDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/history"
          element={
            <PrivateRoute>
              <ShipperDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/revenue"
          element={
            <PrivateRoute>
              <ShipperDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/shipper"
          element={
            <PrivateRoute>
              <Shipper />
            </PrivateRoute>
          }
        />
        <Route path="/orderdetail/:id" element={<OrderDetails />} />
        <Route
          path="/shipper-dashboard"
          element={<Navigate to="/dashboard" />}
        />

        {/* ** Trang ShipperAccount** */}
        <Route
          path="/shipper-account"
          element={
            <PrivateRoute>
              <ShipperAccount />
            </PrivateRoute>
          }
        />
        <Route path="/update-shipper-info" element={<UpdateShipperInfo />} />
        <Route path="/finance-management" element={<FinanceManagementPage />} />

        {/* ** Trang Operator** */}
        <Route path="/manage-shipper" element={<ManageShipper />} />
        <Route path="/manage-shipper" element={<ManageShipper />} />
        <Route path="/shipper-detail" element={<ShipperDetail />} />
        <Route path="/revenue-dashboard" element={<RevenueDashboard />} />

        <Route path="/shipper-detail" element={<ShipperDetail />} />
        <Route path="/revenue-dashboard" element={<RevenueDashboard />} />
        <Route path="/incident-management" element={<IncidentManagement />} />
        {/* ** Shipper Ranking** */}
        <Route
          path="/shipper-ranking"
          element={
            <PrivateRoute>
              <ShipperRanking />
            </PrivateRoute>
          }
        />

        {/* ** Phan bao cao su co** */}
        <Route path="/report-issue" element={<ReportIssue />} />
        <Route
          path="/admin-report-handling"
          element={<AdminReportHandling />}
        />
        <Route
          path="/customer-report-tracking"
          element={<CustomerReportTracking />}
        />
      </Routes>
    </Router>
  </React.StrictMode>
);
