import React, { useState } from 'react';
import { Card, CardContent } from '../buttons/Card';
import { Button } from '../buttons/Button1';
import { Checkbox } from '../buttons/CheckBox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../buttons/Tabs';
import { Badge } from '../buttons/Badges';
import { 
  Truck, User, Phone, Mail, MapPin, CreditCard, 
  FileCheck, AlertCircle, CheckCircle2, Shield, UserCheck,
  Clock, CircleDollarSign, Calendar, Package2
} from 'lucide-react';
import '../../styles/ShipperDetail.css';

const ShipperDetail = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [selectedShipper, setSelectedShipper] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState({
    personalInfo: false,
    addressInfo: false,
    bankInfo: false,
    vehicleInfo: false,
    documents: false
  });

  const shippersList = [
    {
      id: 1,
      FullName: "Lý Minh Tài",
      PhoneNumber: "0905647382",
      Email: "lyminhtai@example.com",
      Status: "Pending",
      SubmitDate: "2024-02-15",
      Avatar: "/api/placeholder/32/32"
    }
  ];

  const allSectionsVerified = Object.values(verificationStatus).every(status => status);

  const handleVerifySection = (section) => {
    setVerificationStatus(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="shipper-container">
      {/* Enhanced Header */}
      <div className="shipper-header">
        <div className="shipper-header-content">
          <div className="shipper-header-flex">
            <div className="shipper-icon-container">
              <Package2 className="shipper-icon" />
            </div>
            <div>
              <h1 className="shipper-title">Quản lý Shipper</h1>
              <p className="shipper-subtitle">Xem xét và xác minh các đơn đăng ký của shipper</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="shipper-main-container">
        <div className="shipper-grid">
          {/* Sidebar */}
          <div className="shipper-sidebar">
            <Card className="shipper-sidebar-card">
              <div className="shipper-sidebar-header">
                <h2 className="shipper-sidebar-title">Các Đơn Đăng Ký</h2>
                <div className="shipper-sidebar-stats">
                  <span className="shipper-pending-text">5 đơn đang chờ xét duyệt</span>
                  <Badge className="shipper-active-badge">
                    Đang hoạt động
                  </Badge>
                </div>
              </div>
              
              <div className="shipper-list-container">
                {shippersList.map((shipper) => (
                  <div
                    key={shipper.id}
                    onClick={() => setSelectedShipper(shipper)}
                    className={`shipper-list-item ${
                      selectedShipper?.id === shipper.id ? 'shipper-list-item-selected' : ''
                    }`}
                  >
                    <div className="shipper-item-flex">
                      <img src={shipper.Avatar} alt="" className="shipper-avatar" />
                      <div className="shipper-info">
                        <p className="shipper-name">{shipper.FullName}</p>
                        <div className="shipper-phone-container">
                          <Phone className="shipper-phone-icon" />
                          <span className="shipper-phone-text">{shipper.PhoneNumber}</span>
                        </div>
                      </div>
                      <Badge className={`shipper-status-badge ${
                        shipper.Status === 'Pending' ? 'shipper-status-pending' : 'shipper-status-approved'
                      }`}>
                        {shipper.Status === 'Pending' ? 'Đang chờ' : 'Đã duyệt'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="shipper-content">
            {selectedShipper ? (
              <>
                {/* Stats Cards */}
                <div className="shipper-stats-grid">
                  <Card className="shipper-stat-card">
                    <div className="shipper-stat-flex">
                      <div className="shipper-stat-icon-container shipper-icon-blue">
                        <Shield className="shipper-stat-icon" />
                      </div>
                      <div className="shipper-stat-text">
                        <p className="shipper-stat-label">Mã Shipper</p>
                        <p className="shipper-stat-value">#{selectedShipper.id}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="shipper-stat-card">
                    <div className="shipper-stat-flex">
                      <div className="shipper-stat-icon-container shipper-icon-green">
                        <Calendar className="shipper-stat-icon" />
                      </div>
                      <div className="shipper-stat-text">
                        <p className="shipper-stat-label">Ngày Đăng Ký</p>
                        <p className="shipper-stat-value">{selectedShipper.SubmitDate}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="shipper-stat-card">
                    <div className="shipper-stat-flex">
                      <div className="shipper-stat-icon-container shipper-icon-purple">
                        <AlertCircle className="shipper-stat-icon" />
                      </div>
                      <div className="shipper-stat-text">
                        <p className="shipper-stat-label">Trạng Thái Hiện Tại</p>
                        <p className="shipper-stat-value">Đang xem xét</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Tabs Section */}
                <Card className="shipper-tabs-card">
                  <Tabs defaultValue="personal" className="shipper-tabs">
                    <div className="shipper-tabs-header">
                      <TabsList className="shipper-tabslist">
                        <TabsTrigger value="personal" className="shipper-tab">
                          <User className="shipper-tab-icon" />
                          Thông Tin Cá Nhân
                        </TabsTrigger>
                        <TabsTrigger value="vehicle" className="shipper-tab">
                          <Truck className="shipper-tab-icon" />
                          Thông Tin Phương Tiện
                        </TabsTrigger>
                        <TabsTrigger value="documents" className="shipper-tab">
                          <FileCheck className="shipper-tab-icon" />
                          Tài Liệu
                        </TabsTrigger>
                        <TabsTrigger value="bank" className="shipper-tab">
                          <CircleDollarSign className="shipper-tab-icon" />
                          Thông Tin Tài Chính
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <div className="shipper-tab-content-container">
                      <TabsContent value="personal">
                        <div className="shipper-personal-info">
                          <div className="shipper-section-header">
                            <h3 className="shipper-section-title">Thông Tin Cá Nhân</h3>
                            <div className="shipper-verification-checkbox">
                              <Checkbox 
                                checked={verificationStatus.personalInfo}
                                onCheckedChange={() => handleVerifySection('personalInfo')}
                                className="shipper-checkbox"
                              />
                              <span className="shipper-verification-text">Đánh dấu là đã xác minh</span>
                            </div>
                          </div>

                          <div className="shipper-info-grid">
                            <div className="shipper-info-item">
                              <p className="shipper-info-label">Họ và Tên</p>
                              <p className="shipper-info-value">Lý Minh Tài</p>
                            </div>
                            <div className="shipper-info-item">
                              <p className="shipper-info-label">Số Điện Thoại</p>
                              <p className="shipper-info-value">0905647382</p>
                            </div>
                            <div className="shipper-info-item">
                              <p className="shipper-info-label">Địa Chỉ Email</p>
                              <p className="shipper-info-value">lyminhtai@example.com</p>
                            </div>
                            <div className="shipper-info-item">
                              <p className="shipper-info-label">Số CMND</p>
                              <p className="shipper-info-value">079201001234</p>
                            </div>
                            <div className="shipper-info-item">
                              <p className="shipper-info-label">Ngày Sinh</p>
                              <p className="shipper-info-value">15/11/1990</p>
                            </div>
                            <div className="shipper-info-item">
                              <p className="shipper-info-label">Địa Chỉ Hiện Tại</p>
                              <p className="shipper-info-value">234 Lý Tự Trọng, P. An Lạc, Q. Tân Bình</p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </div>
                  </Tabs>
                </Card>

                {/* Verification Status Grid */}
                <Card className="shipper-verification-card">
                  <h3 className="shipper-verification-title">Tiến Độ Xác Minh</h3>
                  <div className="shipper-verification-grid">
                    {Object.entries(verificationStatus).map(([key, value]) => (
                      <div
                        key={key}
                        className={`shipper-verification-item ${
                          value 
                            ? 'shipper-verification-complete' 
                            : 'shipper-verification-incomplete'
                        }`}
                      >
                        <CheckCircle2 className={`shipper-verification-icon ${
                          value ? 'shipper-verification-icon-complete' : 'shipper-verification-icon-incomplete'
                        }`} />
                        <p className="shipper-verification-label">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Action Buttons */}
                <div className="shipper-actions">
                  <Button variant="outline" className="shipper-reject-button">
                    Từ Chối Đơn Đăng Ký
                  </Button>
                  <Button
                    variant="default"
                    disabled={!allSectionsVerified}
                    className={`shipper-approve-button ${!allSectionsVerified ? 'shipper-button-disabled' : ''}`}
                  >
                    Duyệt Đơn Đăng Ký
                  </Button>
                </div>
              </>
            ) : (
              <Card className="shipper-empty-state">
                <UserCheck className="shipper-empty-icon" />
                <h3 className="shipper-empty-title">Chọn Hồ Sơ</h3>
                <p className="shipper-empty-text">Chọn một shipper từ danh sách để xem chi tiết</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperDetail;