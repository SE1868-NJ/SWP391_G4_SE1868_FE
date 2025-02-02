import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Login.css';






const Login = () => {
 const navigate = useNavigate();
 const [username, setUsername] = useState('');
 const [password, setPassword] = useState('');


 const handleLogin = (e) => {
   e.preventDefault();
   if (username === 'admin' && password === 'password') {
     navigate('/home');
   } else {
     alert('Invalid credentials');
   }
 };


 return (
   <div className="login-container">
     <h1 className="login-title">Login</h1>
     <form className="login-form" onSubmit={handleLogin}>
       <input
         className="login-input"
         type="text"
         placeholder="Username"
         value={username}
         onChange={(e) => setUsername(e.target.value)}
       />
       <input
         className="login-input"
         type="password"
         placeholder="Password"
         value={password}
         onChange={(e) => setPassword(e.target.value)}
       />
       <button className="login-button" type="submit">Login</button>
     </form>


     <div className="login-links">
       <button
         className="login-transparent-button"
         onClick={() => navigate('/forgot-password')}
       >
         Quên mật khẩu
       </button>
       <button
         className="login-transparent-button"
         onClick={() => navigate('/register')}
       >
         Đăng ký
       </button>
     </div>
   </div>
 );
};


export default Login;