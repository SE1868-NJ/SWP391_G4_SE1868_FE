import React from 'react';
import {  useNavigate } from 'react-router-dom';
import Button from './components/buttons/Button'; 

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