import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Home.css';
import Button from '../buttons/Button';


const Home = () => {
 const navigate = useNavigate();
 const [isLoggedIn, setIsLoggedIn] = useState(false);


 const orders = [
   {
     id: 1,
     name: 'Order A',
     details: 'Details of Order A',
     category: 'List Order',
     status: 'Pending',
   },
   {
     id: 2,
     name: 'Order B',
     details: 'Details of Order B',
     category: 'History Orders',
     status: 'Completed',
   },
   {
     id: 3,
     name: 'Order C',
     details: 'Details of Order C',
     category: 'List Order',
     status: 'In Progress',
   },
 ];


 const [selectedOrder, setSelectedOrder] = useState(null);


 useEffect(() => {
   const loggedInStatus = localStorage.getItem('isLoggedIn');
   if (loggedInStatus === 'true') {
     setIsLoggedIn(true);
   }
 }, []);


 const handleOrderClick = (order) => {
   setSelectedOrder(order);
 };


 const filteredOrders = orders;


 return (
   <div className="form home">
     <header className="form home-header">
       <div className="form home-header-left">
         <h1>Homepage Shipper</h1>
       </div>
       <div className="form home-header-right">
         {isLoggedIn ? (
           <Button variant="default">Logged In</Button>
         ) : (
           <Button variant="login" onClick={() => navigate('/login')}>
             Login
           </Button>
         )}
       </div>
     </header>


     <main className="form home-orders">
       <h2>All Orders</h2>
       <ul>
         {filteredOrders.map((order) => (
           <li
             key={order.id}
             className={`form home-order-item ${selectedOrder?.id === order.id ? 'form home-order-item-selected' : ''}`}
             onClick={() => handleOrderClick(order)}
           >
             <h3>{order.name}</h3>
             <p>{order.details}</p>
             <div className="form home-order-status">
               Status: <span className={`form status-${order.status.toLowerCase()}`}>{order.status}</span>
             </div>
           </li>
         ))}
       </ul>
     </main>


     {selectedOrder && (
       <section className="form home-selected-order">
         <h2>Order Details</h2>
         <div className="form home-order-details">
           <p>
             <strong>Order ID:</strong> #{selectedOrder.id}
           </p>
           <p>
             <strong>Order Name:</strong> {selectedOrder.name}
           </p>
           <p>
             <strong>Details:</strong> {selectedOrder.details}
           </p>
           <p>
             <strong>Status:</strong> {selectedOrder.status}
           </p>
         </div>
         <Button
           variant="default"
           onClick={() => setSelectedOrder(null)}
           style={{ marginTop: '1rem' }}
         >
           Close Details
         </Button>
       </section>
     )}


     <footer className="form home-footer">
       <h2>Contact Information</h2>
       <p>Email: contact@shippers.com</p>
       <p>Phone: 123-456-789</p>
     </footer>
   </div>
 );
};


export default Home;