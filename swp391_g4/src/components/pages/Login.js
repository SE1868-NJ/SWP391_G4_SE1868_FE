import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


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
   <div>
     <h1>Login Page</h1>
     <form onSubmit={handleLogin}>
       <input
         type="text"
         placeholder="Username"
         value={username}
         onChange={(e) => setUsername(e.target.value)}
       />
       <input
         type="password"
         placeholder="Password"
         value={password}
         onChange={(e) => setPassword(e.target.value)}
       />
       <button type="submit">Login</button>
     </form>
   </div>
 );
};


export default Login;



