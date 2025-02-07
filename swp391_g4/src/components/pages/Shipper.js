import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Shipper.css';
import Button from '../buttons/Button';
import 'font-awesome/css/font-awesome.min.css';

const Shipper = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const orders = [
    { id: 1, name: 'Order A', details: 'Details of Order A', category: 'List Order', status: 'Pending' },
    { id: 2, name: 'Order B', details: 'Details of Order B', category: 'History Orders', status: 'Completed' },
    { id: 3, name: 'Order C', details: 'Details of Order C', category: 'List Order', status: 'In Progress' },
  ];

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }

    // Thêm sự kiện lắng nghe khi click ra ngoài menu
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.form.shipper-menu') && !event.target.closest('.form.shipper-header-right')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuOpen]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('shipperName');
    localStorage.removeItem('shipperId');
    setIsLoggedIn(false);
    setMenuOpen(false);
    navigate('/login');
  };

  const toggleMenu = (event) => {
    event.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
    setMenuOpen(!menuOpen);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <div className="form shipper">
      <header className="form shipper-header">
        <div className="form shipper-header-left">
          <h1>Homepage Shipper</h1>
        </div>
        <div className="form shipper-header-right">
          <Button variant="default" onClick={toggleMenu}>
          <span style={{ fontSize: '24px' }}>☰</span>
          </Button>
        </div>
      </header>

      {/* Sidebar menu */}
      <nav className={`form shipper-menu ${menuOpen ? 'open' : ''}`}>
        <ul>
            <>
              <li onClick={() => handleMenuClick('/shipperaccount')}>Shipper Account</li>
              <li onClick={() => handleMenuClick('/historyorder')}>History Order</li>
              <li onClick={() => handleMenuClick('/revenue')}>Revenue</li>
              <li onClick={handleLogout}>Logout</li>
            </>
        </ul>
      </nav>

      <main className="form shipper-orders">
        <h2>All Orders</h2>
        <ul>
          {orders.map((order) => (
            <li
              key={order.id}
              className={`form shipper-order-item ${selectedOrder?.id === order.id ? 'form shipper-order-item-selected' : ''}`}
              onClick={() => handleOrderClick(order)}
            >
              <h3>{order.name}</h3>
              <p>{order.details}</p>
              <div className="form shipper-order-status">
                Status: <span className={`form status-${order.status.toLowerCase()}`}>{order.status}</span>
              </div>
            </li>
          ))}
        </ul>
      </main>

      {selectedOrder && (
        <section className="form shipper-selected-order">
          <h2>Order Details</h2>
          <div className="form shipper-order-details">
            <p><strong>Order ID:</strong> #{selectedOrder.id}</p>
            <p><strong>Order Name:</strong> {selectedOrder.name}</p>
            <p><strong>Details:</strong> {selectedOrder.details}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
          </div>
          <Button variant="default" onClick={() => setSelectedOrder(null)} style={{ marginTop: '1rem' }}>
            Close Details
          </Button>
        </section>
      )}

      <footer className="form shipper-footer">
        <h2>Contact Information</h2>
        <p>Email: contact@shippers.com</p>
        <p>Phone: 123-456-789</p>
      </footer>
    </div>
  );
};

export default Shipper;
