import React, { useState } from 'react';
import { Card, CardContent } from '../../buttons/Card';
import { Button } from '../../buttons/Button1';
import { Checkbox } from '../../buttons/CheckBox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../buttons/Tabs';
import { Badge } from '../../buttons/Badges';
import { 
  Truck, User, Phone, Mail, MapPin, CreditCard, 
  FileCheck, AlertCircle, CheckCircle2, Shield, UserCheck,
  Clock, CircleDollarSign, Calendar, Package2
} from 'lucide-react';
import '../../../styles/ShipperDetail.css';
import axios from 'axios';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import moment from 'moment';
const ShipperDetail = () => {
  // const [activeTab, setActiveTab] = useState('personal');
  const [shippersList, setShippersList] = useState([]);
  const [selectedShipper, setSelectedShipper] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState({
    personalInfo: false,
    bankInfo: false,
    vehicleInfo: false,
    documents: false
  });
  const [tabVerificationStatus, setTabVerificationStatus] = useState({
    personal: false,
    vehicle: false,
    documents: false,
    bank: false
  });
  const [verifiedFields, setVerifiedFields] = useState({
    personal: {
      fullName: false,
      phone: false,
      email: false,
      citizenId: false,
      dateOfBirth: false,
      address: false
    },
    vehicle: {
      vehicleType: false,
      licensePlate: false,
      registrationDate: false
    },
    documents: {
      driverLicense: false,
      vehicleRegistration: false,
      idCard: false
    },
    bank: {
      bankName: false,
      accountNumber: false,
      bonusAmount: false
    }
  });
  const areAllFieldsVerifiedInSection = (section) => {
    return Object.values(verifiedFields[section]).every(value => value === true);
  };
  const handleVerifyField = (section, field) => {
    setVerifiedFields(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: true
      }
    }));
  };
  useEffect(() => {
    setVerificationStatus(prev => ({
      ...prev,
      personalInfo: areAllFieldsVerifiedInSection('personal'),
      vehicleInfo: areAllFieldsVerifiedInSection('vehicle'),
      documents: areAllFieldsVerifiedInSection('documents'),
      bankInfo: areAllFieldsVerifiedInSection('bank')
    }));
  }, [verifiedFields]);
  useEffect(() => {
    setTabVerificationStatus({
      personal: areAllFieldsVerifiedInSection('personal'),
      vehicle: areAllFieldsVerifiedInSection('vehicle'),
      documents: areAllFieldsVerifiedInSection('documents'),
      bank: areAllFieldsVerifiedInSection('bank')
    });
  }, [verifiedFields]);
  // Component cho tab
  const VerifiableTabsTrigger = ({ value, icon: Icon, children }) => {
    const isVerified = tabVerificationStatus[value];
    
    return (
      <TabsTrigger 
        value={value} 
        className={`shipper-tab ${isVerified ? 'tab-verified' : ''}`}
      >
        <div className="tab-content-wrapper">
          <div className="tab-icon-text">
            <Icon className="shipper-tab-icon" />
            {children}
          </div>
          {isVerified && (
            <CheckCircle2 className="verification-icon" />
          )}
        </div>
      </TabsTrigger>
    );
  };
  // Component cho nút xác minh
  const VerifyButton = ({ section, field, label }) => {
    return (
      <Button
        size="sm"
        variant={verifiedFields[section][field] ? "success" : "default"}
        onClick={() => handleVerifyField(section, field)}
        disabled={verifiedFields[section][field]}
        className={`verify-button ${verifiedFields[section][field] ? 'verified' : ''}`}
      >
        {verifiedFields[section][field] ? (
          <>
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Đã xác minh
          </>
        ) : (
          <>
            <Shield className="w-4 h-4 mr-1" />
            Xác minh {label}
          </>
        )}
      </Button>
    );
  };

// Lấy danh sách shipper đang chờ duyệt
useEffect(() => {
  axios.get('http://localhost:4000/api/pending-register-shippers')
    .then(response => {
      setShippersList(response.data); // Lưu danh sách vào shippersList
    })
    .catch(error => {
      console.error('Có lỗi khi lấy dữ liệu shipper:', error);
    });
}, []);

  const allSectionsVerified = Object.values(verificationStatus).every(status => status);

  const handleVerifySection = (section) => {
    setVerificationStatus(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Lấy chi tiết shipper
  const handleShipperClick = (id) => {
    axios.get(`http://localhost:4000/api/shippers/${id}`)
      .then(response => {
        setSelectedShipper(response.data); // Lưu thông tin chi tiết vào selectedShipper
      })
      .catch(error => {
        console.error('Có lỗi khi lấy chi tiết shipper:', error);
      });
  };
  const handleRejectShipper = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/reject-shipper', {
        shipperId: selectedShipper.ShipperID
      });
  
      if (response.data.success) {
        // Cập nhật lại danh sách shipper
        const updatedList = shippersList.filter(
          shipper => shipper.ShipperID !== selectedShipper.ShipperID
        );
        setShippersList(updatedList);
        setSelectedShipper(null);
        // Hiển thị thông báo thành công
        alert('Đã từ chối đăng ký shipper thành công');
        window.location.reload();
      }
    } catch (error) {
      console.error('Lỗi khi từ chối shipper:', error);
      alert('Có lỗi xảy ra khi từ chối đăng ký shipper');
    }
  };
  const handleApproveShipper = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/approve-shipper', {
        shipperId: selectedShipper.ShipperID
      });
  
      if (response.data.success) {
        // Cập nhật lại trạng thái trong danh sách
        const updatedList = shippersList.map(shipper => {
          if (shipper.ShipperID === selectedShipper.ShipperID) {
            return { ...shipper, Status: 'Active' };
          }
          return shipper;
        });
        setShippersList(updatedList);
        setSelectedShipper({ ...selectedShipper, Status: 'Active' });
        // Hiển thị thông báo thành công
        alert('Đã duyệt đăng ký shipper thành công');
        window.location.reload();
      }
    } catch (error) {
      console.error('Lỗi khi duyệt shipper:', error);
      alert('Có lỗi xảy ra khi duyệt đăng ký shipper');
    }
  };
  const handleGoBack = () => {
    window.history.back();
  };
  
  return (
    <div className="shipper-container">
      {/* Enhanced Header */}
      <div className="back-button-container">
        <Button 
          variant="outline" 
          className="back-button" 
          onClick={handleGoBack}
        >
          <ArrowLeft className="w-5 h-5" /> {/* Bạn có thể thay bằng biểu tượng mũi tên */}
        </Button>
      </div>
      <div className="shipper-header">
        <div className="shipper-header-content">
          <div className="shipper-header-flex">
            <div className="shipper-icon-container">
              <Package2 className="shipper-icon" />
            </div>
            <div>
              <h1 className="shipper-title">Operator</h1>
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
                  <span className="shipper-pending-text">{shippersList.length} Đơn đang chờ xét duyệt</span>
                  <Badge className="shipper-active-badge">
                    Đang hoạt động
                  </Badge>
                </div>
              </div>
              
              <div className="shipper-list-container">
              {shippersList.map((shipper) => (
             <div
             key={shipper.ShipperID}
             onClick={() => handleShipperClick(shipper.ShipperID)}
             className={`shipper-list-item ${
               selectedShipper?.ShipperID === shipper.ShipperID ? 'shipper-list-item-selected' : ''
             }`}
              >
                    <div className="shipper-item-flex">
                      <img src={shipper.ImageShipper} alt="" className="shipper-avatar" />
                      <div className="shipper-info">
                        <p className="shipper-name">{shipper.FullName}</p>
                        <div className="shipper-phone-container">
                          <Phone className="shipper-phone-icon" />
                          <span className="shipper-phone-text">{shipper.PhoneNumber}</span>
                        </div>
                      </div>
                      <Badge className={`shipper-status-badge ${
                        shipper.Status === 'PendingRegister' ? 'Inactive' : 'Active'
                      }`}>
                        {shipper.Status === 'PendingRegister' ? 'Không duyệt' : 'Đã duyệt'}
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
                        <p className="shipper-stat-value">#{selectedShipper.ShipperID}</p>
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
                        <p className="shipper-stat-value">{moment(selectedShipper.RegistrationDate).format("DD-MM-YYYY")}</p>
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
                      <VerifiableTabsTrigger value="personal" icon={User}>
                        Thông Tin Cá Nhân
                      </VerifiableTabsTrigger>
                      <VerifiableTabsTrigger value="vehicle" icon={Truck}>
                        Thông Tin Phương Tiện
                      </VerifiableTabsTrigger>
                      <VerifiableTabsTrigger value="documents" icon={FileCheck}>
                        Tài Liệu
                      </VerifiableTabsTrigger>
                      <VerifiableTabsTrigger value="bank" icon={CircleDollarSign}>
                        Thông Tin Tài Chính
                      </VerifiableTabsTrigger>
                    </TabsList>
                  </div>

                    <div className="shipper-tab-content-container">
                    <TabsContent value="personal" className="tab-content">
          <Card>
            <CardContent>
              <div className="section-header">
                <h3 className="section-title">Thông Tin Cá Nhân</h3>
                <div className="verification-status">
                  <Checkbox 
                    checked={verificationStatus.personalInfo}
                    disabled={!areAllFieldsVerifiedInSection('personal')}
                  />
                  <span>
                    {verificationStatus.personalInfo ? 'Đã xác minh tất cả' : 'Cần xác minh tất cả thông tin'}
                  </span>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <div className="info-content">
                    <p className="info-label">Họ và Tên</p>
                    <p className="info-value">{selectedShipper?.FullName}</p>
                  </div>
                  <VerifyButton section="personal" field="fullName" label="họ tên" />
                </div>

                <div className="info-item">
                  <div className="info-content">
                    <p className="info-label">Số Điện Thoại</p>
                    <p className="info-value">{selectedShipper?.PhoneNumber}</p>
                  </div>
                  <VerifyButton section="personal" field="phone" label="số điện thoại" />
                </div>

                <div className="info-item">
                  <div className="info-content">
                    <p className="info-label">Email</p>
                    <p className="info-value">{selectedShipper?.Email}</p>
                  </div>
                  <VerifyButton section="personal" field="email" label="email" />
                </div>

                <div className="info-item">
                  <div className="info-content">
                    <p className="info-label">CMND/CCCD</p>
                    <p className="info-value">{selectedShipper?.CitizenID}</p>
                  </div>
                  <VerifyButton section="personal" field="citizenId" label="CMND/CCCD" />
                </div>

                <div className="info-item">
                  <div className="info-content">
                    <p className="info-label">Ngày Sinh</p>
                    <p className="info-value">{moment(selectedShipper.DateOfBirth).format("DD-MM-YYYY")}</p>
                  </div>
                  <VerifyButton section="personal" field="dateOfBirth" label="ngày sinh" />
                </div>

                <div className="info-item">
                  <div className="info-content">
                    <p className="info-label">Địa Chỉ</p>
                    <p className="info-value">{selectedShipper?.Ward}, {selectedShipper?.District}, {selectedShipper?.City}</p>
                  </div>
                  <VerifyButton section="personal" field="address" label="địa chỉ" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vehicle Information Tab */}
        <TabsContent value="vehicle" className="tab-content">
          <Card>
            <CardContent>
              <div className="section-header">
                <h3 className="section-title">Thông Tin Phương Tiện</h3>
                <div className="verification-status">
                  <Checkbox 
                    checked={verificationStatus.vehicleInfo}
                    disabled={!areAllFieldsVerifiedInSection('vehicle')}
                  />
                  <span>
                    {verificationStatus.vehicleInfo ? 'Đã xác minh tất cả' : 'Cần xác minh tất cả thông tin'}
                  </span>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <div className="info-content">
                    <p className="info-label">Loại Phương Tiện</p>
                    <p className="info-value">{selectedShipper?.VehicleType}</p>
                  </div>
                  <VerifyButton section="vehicle" field="vehicleType" label="loại xe" />
                </div>

                <div className="info-item">
                  <div className="info-content">
                    <p className="info-label">Biển Số Xe</p>
                    <p className="info-value">{selectedShipper?.LicensePlate}</p>
                  </div>
                  <VerifyButton section="vehicle" field="licensePlate" label="biển số" />
                </div>

                <div className="info-item">
                  <div className="info-content">
                    <p className="info-label">Ngày Đăng Kiểm</p>
                    <p className="info-value">{moment(selectedShipper.RegistrationVehicle).format("DD-MM-YYYY")}</p>
                  </div>
                  <VerifyButton section="vehicle" field="registrationDate" label="đăng kiểm" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="tab-content">
          <Card>
            <CardContent>
              <div className="section-header">
                <h3 className="section-title">Tài Liệu</h3>
                <div className="verification-status">
                  <Checkbox 
                    checked={verificationStatus.documents}
                    disabled={!areAllFieldsVerifiedInSection('documents')}
                  />
                  <span>
                    {verificationStatus.documents ? 'Đã xác minh tất cả' : 'Cần xác minh tất cả tài liệu'}
                  </span>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <div className="info-content">
                    <p className="info-label">Giấy Phép Lái Xe</p>
                    <img 
                      src="DriverLicense.png" 
                      alt="Driver License"
                      className="document-image"
                    />
                  </div>
                  <VerifyButton section="documents" field="driverLicense" label="GPLX" />
                </div>

                <div className="info-item">
                  <div className="info-content">
                    <p className="info-label">Đăng Ký Xe</p>
                    <img 
                      src="VehicleRegistration.png" 
                      alt="Vehicle Registration"
                      className="document-image"
                    />
                  </div>
                  <VerifyButton section="documents" field="vehicleRegistration" label="đăng ký xe" />
                </div>

                <div className="info-item">
                  <div className="info-content">
                    <p className="info-label">CMND/CCCD</p>
                    <img 
                      src="IDCard.png" 
                      alt="ID Card"
                      className="document-image"
                    />
                  </div>
                  <VerifyButton section="documents" field="idCard" label="CMND/CCCD" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bank Information Tab */}
        <TabsContent value="bank" className="tab-content">
          <Card>
            <CardContent>
              <div className="section-header">
                <h3 className="section-title">Thông Tin Tài Chính</h3>
                <div className="verification-status">
                  <Checkbox 
                    checked={verificationStatus.bankInfo}
                    disabled={!areAllFieldsVerifiedInSection('bank')}
                  />
                  <span>
                    {verificationStatus.bankInfo ? 'Đã xác minh tất cả' : 'Cần xác minh tất cả thông tin'}
                  </span>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <div className="info-content">
                    <p className="info-label">Tên Ngân Hàng</p>
                    <p className="info-value">{selectedShipper?.BankName}</p>
                  </div>
                  <VerifyButton section="bank" field="bankName" label="ngân hàng" />
                </div>

                <div className="info-item">
                  <div className="info-content">
                    <p className="info-label">Số Tài Khoản</p>
                    <p className="info-value">{selectedShipper?.BankAccountNumber}</p>
                  </div>
                  <VerifyButton section="bank" field="accountNumber" label="số tài khoản" />
                </div>

                <div className="info-item">
                  <div className="info-content">
                    <p className="info-label">Số Tiền Thưởng</p>
                    <p className="info-value">{selectedShipper?.BonusAmount}</p>
                  </div>
                  <VerifyButton section="bank" field="bonusAmount" label="tiền thưởng" />
                </div>
              </div>
            </CardContent>
          </Card>
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
                    <Button 
                      variant="outline" 
                      className="shipper-reject-button"
                      onClick={handleRejectShipper}
                    >
                      Từ Chối Đơn Đăng Ký
                    </Button>
                    <Button
                      variant="default"
                      disabled={!allSectionsVerified}
                      className={`shipper-approve-button ${!allSectionsVerified ? 'shipper-button-disabled' : ''}`}
                      onClick={handleApproveShipper}
                      styles={{ backgroundColor: '#3e8e41', color: 'white' }}
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