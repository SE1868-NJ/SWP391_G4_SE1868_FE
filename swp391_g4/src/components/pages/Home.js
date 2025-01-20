import React, { useState } from 'react';
import '../../styles/Home.css';
import Button from '../buttons/Button';

const Home = () => {
  const categories = [
    { id: 1, name: 'Shipper Account' },
    { id: 2, name: 'List Order' },
    { id: 3, name: 'History Orders' },
  ];

  const orders = [
    { 
      id: 1, 
      name: 'Order A', 
      details: 'Details of Order A',
      category: 'List Order',
      status: 'Pending'
    },
    { 
      id: 2, 
      name: 'Order B', 
      details: 'Details of Order B',
      category: 'History Orders',
      status: 'Completed'
    },
    { 
      id: 3, 
      name: 'Order C', 
      details: 'Details of Order C',
      category: 'List Order',
      status: 'In Progress'
    },
  ];

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setSelectedOrder(null);
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const filteredOrders = selectedCategory 
    ? orders.filter(order => order.category === selectedCategory)
    : orders;

  return (
    <div className="Home">
      <header className="Home-header">
        <div className="header-left">
          <h1>Homepage Shipper</h1>
        </div>
        <div className="header-right">
          <Button variant="login">Login</Button>
        </div>
      </header>

      <section className="categories">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="category"
            onClick={() => handleCategoryClick(category.name)}
            style={{
              backgroundColor: selectedCategory === category.name ? '#4a5568' : '#6c757d'
            }}
          >
            {category.name}
          </Button>
        ))}
      </section>

      {selectedCategory && (
        <section className="selected-category">
          <h2>{selectedCategory}</h2>
        </section>
      )}

      <main className="orders">
        <h2>{selectedCategory || 'All Orders'}</h2>
        <ul>
          {filteredOrders.map((order) => (
            <li 
              key={order.id} 
              className={`order-item ${selectedOrder?.id === order.id ? 'selected' : ''}`}
              onClick={() => handleOrderClick(order)}
            >
              <h3>{order.name}</h3>
              <p>{order.details}</p>
              <div className="order-status">
                Status: <span className={`status-${order.status.toLowerCase()}`}>{order.status}</span>
              </div>
            </li>
          ))}
        </ul>
      </main>

      {selectedOrder && (
        <section className="selected-order">
          <h2>Order Details</h2>
          <div className="order-details">
            <p><strong>Order ID:</strong> #{selectedOrder.id}</p>
            <p><strong>Order Name:</strong> {selectedOrder.name}</p>
            <p><strong>Details:</strong> {selectedOrder.details}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
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

      <footer className="footer">
        <h2>Contact Information</h2>
        <p>Email: contact@shippers.com</p>
        <p>Phone: 123-456-789</p>
      </footer>
    </div>
  );
}

export default Home;
