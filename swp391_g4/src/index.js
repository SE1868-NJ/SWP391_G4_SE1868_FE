import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './components/pages/Login';
import Home from './components/pages/Home';
import Register from './components/pages/Register';
import Shipper from './components/pages/Shipper';
import Contact from './components/pages/Contact';
import ManageShipper from './components/pages/ManageShipper';
import ShipperDetail from './components/pages/ShipperDetail';
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
    <Route path="/manage-shipper" element={<ManageShipper />}></Route>
    <Route path="/shipper-detail" element={<ShipperDetail />}></Route>
   </Routes>
 </Router>
);