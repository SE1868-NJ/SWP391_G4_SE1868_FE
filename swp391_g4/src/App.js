// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import Button from './components/buttons/Button';
// 
// 
// const App = () => {
//  const navigate = useNavigate();
// 
// 
//  const handleLoginClick = () => {
  //  navigate('/login'); // Điều hướng sang trang login
//  };
// 
// 
//  return (
  //  <div>
     {/* <h1>Welcome to the Homepage</h1> */}
     {/* <Button onClick={handleLoginClick}>Login</Button> */}
   {/* </div> */}
//  );
// };
// 
// 
// export default App;



import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Button from './components/buttons/Button';  // Đảm bảo đường dẫn đúng
import Login from './components/Login';  // Import trang Login
import Register from './components/Register';  // Import trang Register
import ForgotPassword from './components/ForgotPassword';  // Import trang ForgotPassword

const App = () => {
 const navigate = useNavigate();

 const handleLoginClick = () => {
   navigate('/login'); // Điều hướng sang trang login
 };

 return (
   <div>
     <h1>Welcome to the Homepage</h1>
     <Button onClick={handleLoginClick}>Login</Button>
   </div>
 );
};

export default App;
