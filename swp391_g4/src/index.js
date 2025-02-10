import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './components/pages/Login';
import Home from './components/pages/Home';
import Register from './components/pages/Register';
import Shipper from './components/pages/Shipper';
import Contact from './components/pages/Contact';
import ShipperAccount from './components/pages/ShipperAccount';
import UpdateShipperInfo from './components/pages/UpdateShipperInfo';
import CancelShipperAccount from './components/pages/CancelShipperAccount';


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
     <Route path="/ShipperAccount" element={<ShipperAccount />}></Route>\
     <Route path="/update-personal-info" element={<UpdateShipperInfo />}></Route>
     <Route path="/cancel-shipper-account" element={<CancelShipperAccount />}></Route>
   </Routes>
 </Router>
);