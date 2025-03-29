import React from 'react';
import { CheckCircle, X, AlertTriangle } from 'lucide-react';
import '../../styles/IncidentManagement.css';


const IncidentManagementExportPopup = ({ type, message, onClose }) => {
  const isSuccess = type === 'success';
  
  return (
    <div className="incident_management_export-popup-overlay">
      <div className="incident_management_export-popup">
        <div className="incident_management_export-popup-header">
          <div className={`incident_management_export-popup-icon ${isSuccess ? 'success' : 'error'}`}>
            {isSuccess ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
          </div>
          <button className="incident_management_export-popup-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="incident_management_export-popup-content">
          <h3>{isSuccess ? 'Xuất báo cáo thành công' : 'Xuất báo cáo thất bại'}</h3>
          <p>{message}</p>
        </div>
        <div className="incident_management_export-popup-footer">
          <button className="incident_management_export-popup-button" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncidentManagementExportPopup;