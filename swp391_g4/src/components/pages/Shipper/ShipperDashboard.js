import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../header/Header';
import Footer from '../../footer/Footer';

// Import các component con
import Shipper from '../Shipper/Shipper';
import MyDeliveryOrder from '../Shipper/MyDeliveryOrder';
import HistoryDeliveryOrder from '../Shipper/HistoryDeliveryOrder';
import Revenue from '../Shipper/Revenue';

// CSS styles
const styles = {
  headerContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  contentContainer: {
    marginTop: '30px',
    padding: '20px 0'
  },
  tabButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '20px'
  }
};

const ShipperDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePage, setActivePage] = useState('pendingOrders');

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/dashboard/pending')) {
      setActivePage('pendingOrders');
    } else if (path.includes('/dashboard/my-orders')) {
      setActivePage('myDeliveryOrders');
    } else if (path.includes('/dashboard/history')) {
      setActivePage('historyDeliveryOrders');
    } else if (path.includes('/dashboard/revenue')) {
      setActivePage('revenue');
    }
  }, [location.pathname]);

  const handlePageChange = (page) => {
    setActivePage(page);
    switch(page) {
      case 'pendingOrders':
        navigate('/dashboard/pending');
        break;
      case 'myDeliveryOrders':
        navigate('/dashboard/my-orders');
        break;
      case 'historyDeliveryOrders':
        navigate('/dashboard/history');
        break;
      case 'revenue':
        navigate('/dashboard/revenue');
        break;
      default:
        navigate('/dashboard/pending');
    }
  };

  const renderContent = () => {
    switch(activePage) {
      case 'pendingOrders':
        return <div className="content-container"><Shipper /></div>;
      case 'myDeliveryOrders':
        return <div className="content-container"><MyDeliveryOrder /></div>;
      case 'historyDeliveryOrders':
        return <div className="content-container"><HistoryDeliveryOrder /></div>;
      case 'revenue':
        return <div className="content-container"><Revenue /></div>;
      default:
        return <div className="content-container"><Shipper /></div>;
    }
  };

  return (
    <div className="shipper-dashboard">
      <div style={styles.headerContainer}>
        <Header />
      </div>
      
      <div style={styles.contentContainer}>
        <div className="container-fluid" style={{ marginTop: '100px' }}>
          <div style={styles.tabButtons}>
            <button 
              className={`tab-button ${activePage === 'pendingOrders' ? 'active' : ''}`}
              onClick={() => handlePageChange('pendingOrders')}
            >
              Pending Orders
            </button>
            <button 
              className={`tab-button ${activePage === 'myDeliveryOrders' ? 'active' : ''}`}
              onClick={() => handlePageChange('myDeliveryOrders')}
            >
              My Delivery Orders
            </button>
            <button 
              className={`tab-button ${activePage === 'historyDeliveryOrders' ? 'active' : ''}`}
              onClick={() => handlePageChange('historyDeliveryOrders')}
            >
              History Delivery Orders
            </button>
            <button 
              className={`tab-button ${activePage === 'revenue' ? 'active' : ''}`}
              onClick={() => handlePageChange('revenue')}
            >
              Revenue
            </button>
          </div>
          
          {renderContent()}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ShipperDashboard;