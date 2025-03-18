import React from 'react';
import NotificationBell from './NotificationBell';
import '../../../styles/NotificationBell.css';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <header>
        <NotificationBell />
      </header>
      {children}
    </div>
  );
};

export default AdminLayout;