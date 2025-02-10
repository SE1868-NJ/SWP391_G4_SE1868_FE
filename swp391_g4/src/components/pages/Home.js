import React from 'react';
import '../../styles/Home.css';
import { useNavigate } from 'react-router-dom';
import Button from '../buttons/Button';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img
            src="https://via.placeholder.com/150x50?text=EcoShipper+Logo"
            alt="EcoShipper"
          />
        </div>
        <nav className="nav">
          <ul>
            <li>
              <Button onClick={() => navigate('/home')}>Home</Button>
            </li>
            <li>
              <Button onClick={() => navigate('/about')}>About Us</Button>
            </li>
            <li>
              <Button onClick={() => navigate('/news')}>News</Button>
            </li>
            <li>
              <Button onClick={() => navigate('/contact')}>Contact</Button>
            </li>
          </ul>
        </nav>
        <div className="form shipper-header-right">
         {(
           <Button variant="login" onClick={() => navigate('/login')}>
             Login
           </Button>
         )}
       </div>
      </header>

      {/* Banner */}
      <div className="banner">
        <img src="https://via.placeholder.com/1200x400?text=EcoShipper+Banner" alt="Banner" />
      </div>

      {/* Services */}
      <section className="services">
        <h2>Our Services</h2>
        <div className="service-list">
          <div className="service-item">
            <h3>Fast Delivery</h3>
            <p>Quick delivery, saving your time.</p>
          </div>
          <div className="service-item">
            <h3>Economical Shipping</h3>
            <p>Cost-effective delivery service.</p>
          </div>
          <div className="service-item">
            <h3>International Shipping</h3>
            <p>Delivery to anywhere in the world.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: support@ecoshipper.com</p>
            <p>Phone: 1900 1234 56</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Button onClick={() => navigate('/home')}>Home</Button>
              </li>
              <li>
                <Button onClick={() => navigate('/about')}>About Us</Button>
              </li>
              <li>
                <Button onClick={() => navigate('/news')}>News</Button>
              </li>
              <li>
                <Button onClick={() => navigate('/contact')}>Contact</Button>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 EcoShipper. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;