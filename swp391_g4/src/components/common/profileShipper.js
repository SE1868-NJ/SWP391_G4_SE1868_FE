import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Rating from '@mui/material/Rating';
import axios from 'axios';

const ProfileShipper = () => {
  const navigate = useNavigate();
  const [shipperInfo, setShipperInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // Giải mã token
      const decodedToken = jwtDecode(token);
      
      // Fetch thêm thông tin chi tiết từ API nếu cần
      const fetchShipperDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/shippers/${decodedToken.shipperId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.data.success) {
            // Kết hợp thông tin từ token và API
            setShipperInfo({...decodedToken, ...response.data.data});
          } else {
            // Nếu API lỗi, sử dụng thông tin từ token
            setShipperInfo(decodedToken);
          }
        } catch (error) {
          console.error("Error fetching shipper details:", error);
          setShipperInfo(decodedToken);
        } finally {
          setLoading(false);
        }
      };

      fetchShipperDetails();
    } catch (error) {
      console.error("Invalid token:", error);
      navigate('/login');
    }
  }, [navigate]);

  if (loading) {
    return <div>Đang tải thông tin...</div>;
  }

  if (!shipperInfo) {
    return <div>Không tìm thấy thông tin</div>;
  }

  return (
    <div className="row d-flex">
      <div className="card p-0" style={{ borderRadius: '15px' }}>
        <div className="card-body p-4">
          <div className="d-flex">
            <div className="flex-grow-1 ms-3">
              <div className="d-flex justify-content-between mb-3">
                <div className="flex-shrink-0 me-3">
                  <img
                    src={shipperInfo.ImageShipper || "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"}
                    alt="Shipper Avatar"
                    className="img-fluid rounded-3"
                    style={{ width: '90px' }}
                  />
                </div>
                <div className="align-content-center">
                  <h6 className="mb-1">{shipperInfo.FullName}</h6>
                  <span>{shipperInfo.PhoneNumber}</span>
                  <p className="mb-2 pb-1">{shipperInfo.Email}</p>
                  <Rating 
                    name="half-rating-read" 
                    value={Number(shipperInfo.AverageRating || 0)} 
                    precision={0.1} 
                    readOnly 
                  />
                </div>
              </div>
              <div 
                className="d-flex justify-content-start rounded-3 p-2 mb-2 bg-body-tertiary" 
                style={{ width: 'fit-content' }}
              >
                <div>
                  <p className="small text-muted mb-1">Code</p>
                  <p className="mb-0">#{shipperInfo.ShipperID}</p>
                </div>
                <div className="px-3">
                  <p className="small text-muted mb-1">Bonus Amount</p>
                  <p className="mb-0">{shipperInfo.BonusAmount || 0} $</p>
                </div>
                <div className="px-3">
                  <p className="small text-muted mb-1">Total Rating</p>
                  <p className="mb-0">{shipperInfo.TotalRatings || 0}</p>
                </div>
              </div>
              <p className="mb-2 pb-1">Vehicle: {shipperInfo.VehicleType}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileShipper;