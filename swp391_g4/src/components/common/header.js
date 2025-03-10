// import { Logo } from '../header/Logo'; 
// import styles from '../../styles/Header.module.css'; 
// import { useEffect, useState } from "react"; 
// import { useNavigate } from "react-router-dom"; 
// import Button from '../buttons/Button';
// import axios from 'axios';

// const Header = () => {
//     const navigate = useNavigate();
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [menuOpen, setMenuOpen] = useState(false);
//     const [notifications, setNotifications] = useState([]);
//     const [unreadCount, setUnreadCount] = useState(0);
//     const [showNotificationModal, setShowNotificationModal] = useState(false);

//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         const shipperId = localStorage.getItem('shipperId');

//         if (token && shipperId) {
//             setIsLoggedIn(true);
//             fetchNotifications(shipperId);
//         } else {
//             setIsLoggedIn(false);
//         }

//         const handleClickOutside = (event) => {
//             if (menuOpen && !event.target.closest('.form.shipper-menu') && !event.target.closest('.form.shipper-header-right')) {
//                 setMenuOpen(false);
//             }
//             if (showNotificationModal && !event.target.closest('.notification-modal')) {
//                 setShowNotificationModal(false);
//             }
//         };

//         document.addEventListener('click', handleClickOutside);

//         // Thiết lập polling để cập nhật thông báo
//         const notificationInterval = setInterval(() => {
//             if (token && shipperId) {
//                 fetchNotifications(shipperId);
//             }
//         }, 60000); // Cứ 1 phút kiểm tra thông báo một lần

//         return () => {
//             document.removeEventListener('click', handleClickOutside);
//             clearInterval(notificationInterval);
//         };
//     }, [menuOpen, showNotificationModal]);

//     const fetchNotifications = async (shipperId) => {
//         try {
//             const response = await axios.get(`http://localhost:5000/api/notifications?shipperId=${shipperId}`);
//             setNotifications(response.data.notifications);

//             // Đếm số thông báo chưa đọc
//             const unread = response.data.notifications.filter(notif => notif.unread === 1).length;
//             setUnreadCount(unread);
//         } catch (error) {
//             console.error("Lỗi lấy thông báo:", error);
//         }
//     };

//     const handleMarkAsRead = async (notificationId) => {
//         try {
//             await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`);

//             // Cập nhật lại danh sách thông báo
//             const shipperId = localStorage.getItem('shipperId');
//             if (shipperId) {
//                 fetchNotifications(shipperId);
//             }
//         } catch (error) {
//             console.error("Lỗi đánh dấu đã đọc:", error);
//         }
//     };

//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('shipperName');
//         localStorage.removeItem('shipperId');
//         setIsLoggedIn(false);
//         setMenuOpen(false);
//         navigate('/login');
//     };

//     const toggleMenu = (event) => {
//         event.stopPropagation();
//         setMenuOpen(!menuOpen);
//     };

//     const toggleNotificationModal = (event) => {
//         event.stopPropagation();
//         setShowNotificationModal(!showNotificationModal);
//     };

//     const handleMenuClick = (path) => {
//         navigate(path);
//         setMenuOpen(false);
//     };

//     return (
//       <div>
//         <header className={styles.header}>
//             <nav className={styles.backgroundShadow}>
//                 <div className={styles.logoContainer}>
//                     <Logo />
//                 </div>
//                 <div className="form shipper-header-left">
//                 <h1>Homepage Shipper</h1>
//                 </div>
//                 <div className="form shipper-header-right">
//                     <div style={{ 
//                         display: 'flex', 
//                         alignItems: 'center', 
//                         justifyContent: 'center' 
//                     }}>
//                         {isLoggedIn && (
//                             <div style={{ 
//                                 position: 'relative', 
//                                 marginRight: '10px' 
//                             }}>
//                                 <Button variant="default" onClick={toggleNotificationModal}>
//                                     <span style={{ fontSize: '24px' }}>🔔</span>
//                                     {unreadCount > 0 && (
//                                         <span 
//                                             style={{
//                                                 position: 'absolute', 
//                                                 top: '-5px', 
//                                                 right: '-5px', 
//                                                 backgroundColor: 'red', 
//                                                 color: 'white', 
//                                                 borderRadius: '50%', 
//                                                 padding: '2px 6px', 
//                                                 fontSize: '12px'
//                                             }}
//                                         >
//                                             {unreadCount}
//                                         </span>
//                                     )}
//                                 </Button>
//                             </div>
//                         )}
//                         <Button variant="default" onClick={toggleMenu}>
//                             <span style={{ fontSize: '24px' }}>☰</span>
//                         </Button>
//                     </div>
//                 </div>
//             </nav>
//         </header>
//         {/* Sidebar menu */}
//         <nav className={`form shipper-menu ${menuOpen ? 'open' : ''}`} style={{ zIndex: 1000 }}>
//             <ul>
//                 <>
//                 <li onClick={() => handleMenuClick('/shipperaccount')}>Shipper Account</li>
//                 <li onClick={() => handleMenuClick('/my-delivery-order')}>My Delivery Order</li>
//                 <li onClick={() => handleMenuClick('/history-delivery-order')}>History Delivery Order</li>
//                 <li onClick={() => handleMenuClick('/revenue')}>Revenue</li>
//                 <li onClick={handleLogout}>Logout</li>
//                 </>
//             </ul>
//         </nav>

//         {/* Modal thông báo */}
//         {isLoggedIn && showNotificationModal && notifications.length > 0 && (
//             <div 
//                 className="notification-modal"
//                 style={{
//                     position: 'fixed', 
//                     top: '70px', 
//                     right: '20px', 
//                     backgroundColor: 'white', 
//                     boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
//                     borderRadius: '8px', 
//                     padding: '10px', 
//                     maxWidth: '300px', 
//                     zIndex: 1100,
//                     maxHeight: '400px',
//                     overflowY: 'auto'
//                 }}
//             >
//                 <h3 style={{ 
//                     borderBottom: '1px solid #eee', 
//                     paddingBottom: '10px',
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center'
//                 }}>
//                     Thông Báo
//                     <span 
//                         onClick={() => setShowNotificationModal(false)} 
//                         style={{ 
//                             cursor: 'pointer', 
//                             fontSize: '20px', 
//                             color: '#888' 
//                         }}
//                     >
//                         ✖
//                     </span>
//                 </h3>
//                 {notifications.map((notif) => (
//                     <div 
//                         key={notif.id} 
//                         style={{
//                             borderBottom: '1px solid #eee', 
//                             padding: '10px 0',
//                             backgroundColor: notif.unread ? '#f0f0f0' : 'white',
//                             cursor: 'pointer'
//                         }}
//                         onClick={() => handleMarkAsRead(notif.id)}
//                     >
//                         {notif.message}
//                     </div>
//                 ))}
//             </div>
//         )}
//       </div>
//     );
// };

// export default Header;


import { Logo } from '../header/Logo';
import styles from '../../styles/Header.module.css';
import '../../styles/Notifications.css';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from '../buttons/Button';
import axios from 'axios';
import { format } from 'date-fns'; // Thêm import format từ date-fns để format thời gian

const Header = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    // Thêm hàm đánh dấu tất cả đã đọc
    const markAllAsRead = async () => {
        try {
            const shipperId = localStorage.getItem('shipperId');
            await axios.put(`http://localhost:5000/api/notifications/mark-all-read`, { shipperId });
            fetchNotifications(shipperId);
        } catch (error) {
            console.error("Lỗi đánh dấu tất cả:", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const shipperId = localStorage.getItem('shipperId');

        if (token && shipperId) {
            setIsLoggedIn(true);
            fetchNotifications(shipperId);
        } else {
            setIsLoggedIn(false);
        }

        const handleClickOutside = (event) => {
            if (menuOpen && !event.target.closest('.form.shipper-menu') && !event.target.closest('.form.shipper-header-right')) {
                setMenuOpen(false);
            }
            if (showNotificationModal && !event.target.closest('.notification-modal')) {
                setShowNotificationModal(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        // Thiết lập polling để cập nhật thông báo
        const notificationInterval = setInterval(() => {
            if (token && shipperId) {
                fetchNotifications(shipperId);
            }
        }, 60000); // Cứ 1 phút kiểm tra thông báo một lần

        return () => {
            document.removeEventListener('click', handleClickOutside);
            clearInterval(notificationInterval);
        };
    }, [menuOpen, showNotificationModal]);

    const fetchNotifications = async (shipperId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/notifications?shipperId=${shipperId}`);
            setNotifications(response.data.notifications);

            // Đếm số thông báo chưa đọc
            const unread = response.data.notifications.filter(notif => notif.unread === 1).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error("Lỗi lấy thông báo:", error);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`);

            // Cập nhật lại danh sách thông báo
            const shipperId = localStorage.getItem('shipperId');
            if (shipperId) {
                fetchNotifications(shipperId);
            }
        } catch (error) {
            console.error("Lỗi đánh dấu đã đọc:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
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

    const toggleNotificationModal = (event) => {
        event.stopPropagation();
        setShowNotificationModal(!showNotificationModal);
    };

    const handleMenuClick = (path) => {
        navigate(path);
        setMenuOpen(false);
    };

    return (
        <div>
            <header className={styles.header}>
                <nav className={styles.backgroundShadow}>
                    <div className={styles.logoContainer}>
                        <Logo />
                    </div>
                    <div className="form shipper-header-left">
                        <h1>Homepage Shipper</h1>
                    </div>
                    <div className="form shipper-header-right">
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {isLoggedIn && (
                                <div style={{
                                    position: 'relative',
                                    marginRight: '10px'
                                }}>
                                    <Button variant="default" onClick={toggleNotificationModal}>
                                        <span style={{ fontSize: '24px' }}>🔔</span>
                                        {unreadCount > 0 && (
                                            <span
                                                style={{
                                                    position: 'absolute',
                                                    top: '-5px',
                                                    right: '-5px',
                                                    backgroundColor: 'red',
                                                    color: 'white',
                                                    borderRadius: '50%',
                                                    padding: '2px 6px',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                {unreadCount}
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            )}
                            <Button variant="default" onClick={toggleMenu}>
                                <span style={{ fontSize: '24px' }}>☰</span>
                            </Button>
                        </div>
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

            {/* Modal thông báo */}
            {isLoggedIn && showNotificationModal && notifications.length > 0 && (
                <div
                    className="notification-modal"
                    style={{
                        position: 'fixed',
                        top: '70px',
                        right: '20px',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                        padding: '10px',
                        maxWidth: '300px',
                        zIndex: 1100,
                        maxHeight: '400px',
                        overflowY: 'auto'
                    }}
                >
                    <h3 style={{
                        borderBottom: '1px solid #eee',
                        paddingBottom: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        Thông Báo
                        <div>
                            <span
                                onClick={markAllAsRead}
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    color: '#007bff',
                                    marginRight: '10px'
                                }}
                            >
                                Đánh dấu tất cả đã đọc
                            </span>
                            <span
                                onClick={() => setShowNotificationModal(false)}
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '20px',
                                    color: '#888'
                                }}
                            >
                                ✖
                            </span>
                        </div>
                    </h3>
                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            style={{
                                borderBottom: '1px solid #eee',
                                padding: '10px 0',
                                backgroundColor: notif.unread ? '#f0f0f0' : 'white',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleMarkAsRead(notif.id)}
                        >
                            {notif.message}
                            <div style={{
                                fontSize: '0.8em',
                                color: '#888',
                                marginTop: '5px'
                            }}>
                                {format(new Date(notif.timestamp), 'dd/MM/yyyy HH:mm')}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Xử lý trường hợp không có thông báo */}
            {isLoggedIn && showNotificationModal && notifications.length === 0 && (
                <div
                    className="notification-modal"
                    style={{
                        position: 'fixed',
                        top: '70px',
                        right: '20px',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                        padding: '10px',
                        maxWidth: '300px',
                        zIndex: 1100
                    }}
                >
                    <h3 style={{
                        borderBottom: '1px solid #eee',
                        paddingBottom: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        Thông Báo
                        <span
                            onClick={() => setShowNotificationModal(false)}
                            style={{
                                cursor: 'pointer',
                                fontSize: '20px',
                                color: '#888'
                            }}
                        >
                            ✖
                        </span>
                    </h3>
                    <div style={{
                        textAlign: 'center',
                        padding: '20px',
                        color: '#888'
                    }}>
                        Không có thông báo mới
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;























