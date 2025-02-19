import Button from '../buttons/Button';
import '../../styles/Shipper.css';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false);

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
        <div>
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
            <nav className={`form shipper-menu ${menuOpen ? 'open' : ''}`} style={{ zIndex: 1000 }}>
                <ul>
                    <>
                    <li onClick={() => handleMenuClick('/shipperaccount')}>Shipper Account</li>
                    <li onClick={() => handleMenuClick('/historyorder')}>History Order</li>
                    <li onClick={() => handleMenuClick('/revenue')}>Revenue</li>
                    <li onClick={handleLogout}>Logout</li>
                    </>
                </ul>
            </nav>
        </div>
    );
};

export default Header