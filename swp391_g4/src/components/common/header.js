import { Logo } from '../header/Logo'; // Import Logo component
import styles from '../../styles/Header.module.css'; // Import the new styles
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from '../buttons/Button';


const Header = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const loggedInStatus = localStorage.getItem('isLoggedIn');
        if (loggedInStatus === 'true') {
            setIsLoggedIn(true);
        }

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
        event.stopPropagation();
        setMenuOpen(!menuOpen);
    };

    const handleMenuClick = (path) => {
        navigate(path);
        setMenuOpen(false);
    };

    return (
      <div>
        <header className={styles.header}> {/* Sử dụng styles từ Header.module.css */}
            <nav className={styles.backgroundShadow}>
                <div className={styles.logoContainer}> {/* Container cho logo */}
                    <Logo />
                </div>
                <div className="form shipper-header-left">
                <h1>Homepage Shipper</h1>
                </div>
                <div className="form shipper-header-right">
                <Button variant="default" onClick={toggleMenu}>
                    <span style={{ fontSize: '24px' }}>☰</span>
                </Button>
                </div>
                
            </nav>
        </header>
        {/* Sidebar menu */}
            <nav className={`form shipper-menu ${menuOpen ? 'open' : ''}`} style={{ zIndex: 1000 }}>
                <ul>
                    <>
                    <li onClick={() => handleMenuClick('/shipperaccount')}>Shipper Account</li>
                    <li onClick={() => handleMenuClick('/my-delivery-order')}>My Delivery Order</li>
                    <li onClick={() => handleMenuClick('/history-delivery-order')}>History Delivery Order</li>
                    <li onClick={() => handleMenuClick('/revenue')}>Revenue</li>
                    <li onClick={handleLogout}>Logout</li>
                    </>
                </ul>
            </nav>
        </div>
    );
};

export default Header;
