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
              <Button onClick={() => navigate('/home')}>Trang chủ</Button>
            </li>
            <li>
              <Button onClick={() => navigate('/infor')}>Về chúng tôi</Button>
            </li>
            <li>
              <Button onClick={() => navigate('/news')}>Tin tức</Button>
            </li>
            <li>
              <Button onClick={() => navigate('/contact')}>Liên hệ</Button>
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
        <h2>Dịch vụ của chúng tôi</h2>
        <div className="service-list">
          <div className="service-item">
            <h3>Giao hàng nhanh</h3>
            <p>Giao hàng nhanh chóng, tiết kiệm thời gian.</p>
          </div>
          <div className="service-item">
            <h3>Giao hàng tiết kiệm</h3>
            <p>Tiết kiệm chi phí với dịch vụ giá rẻ.</p>
          </div>
          <div className="service-item">
            <h3>Giao hàng quốc tế</h3>
            <p>Giao hàng đến mọi nơi trên thế giới.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Liên hệ</h3>
            <p>Email: support@ecoshipper.vn</p>
            <p>Điện thoại: 1900 1234 56</p>
          </div>
          <div className="footer-section">
            <h3>Liên kết nhanh</h3>
            <ul>
              <li>
                <Button onClick={() => navigate('/home')}>Trang chủ</Button>
              </li>
              <li>
                <Button onClick={() => navigate('/infor')}>Về chúng tôi</Button>
              </li>
              <li>
                <Button onClick={() => navigate('/news')}>Tin tức</Button>
              </li>
              <li>
                <Button onClick={() => navigate('/contact')}>Liên hệ</Button>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2023 EcoShipper. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;