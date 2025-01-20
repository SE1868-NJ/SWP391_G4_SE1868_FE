import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Login from './components/pages/Login';
import Home from './components/pages/Home';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <Router>
   <Routes>
     <Route path="/" element={<Home />} />{/* Điều hướng trực tiếp đến trang Home */}
     <Route path="/Home" element={<App />} />
     <Route path="/login" element={<Login />} />
   </Routes>
 </Router>
);


export default App;

