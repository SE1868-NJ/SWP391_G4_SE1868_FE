import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../../header/Header";
import Footer from "../../footer/Footer";
import Login from "../Login/Login";
import "../../../styles/ServiceDetailPage.css";

const ServiceDetailsPage = () => {
  const { serviceId } = useParams();
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);

  const openLoginPopup = () => {
    setIsLoginPopupOpen(true);
  };

  const closeLoginPopup = () => {
    setIsLoginPopupOpen(false);
  };

  const serviceDetailsData = {
    "fast-delivery": {
      title: "Giao Hàng Nhanh Chóng",
      description:
        "Dịch vụ giao hàng nhanh chóng của chúng tôi đảm bảo hàng hóa được vận chuyển trong thời gian ngắn nhất. Với đội ngũ shipper chuyên nghiệp và hệ thống quản lý hiện đại, chúng tôi cam kết mang đến trải nghiệm giao hàng tối ưu cho khách hàng.",
      features: [
        "Giao hàng trong 2-4 giờ nội thành",
        "Theo dõi đơn hàng thời gian thực",
        "Đội ngũ shipper chuyên nghiệp",
        "Bảo hiểm hàng hóa trong quá trình vận chuyển",
        "Hỗ trợ 24/7",
      ],
      benefits: [
        "Tiết kiệm thời gian cho doanh nghiệp",
        "Tăng sự hài lòng của khách hàng",
        "Giảm chi phí vận hành",
        "Tối ưu hóa quy trình giao hàng",
      ],
      priceRange: "25,000đ - 35,000đ/km",
      coverage: ["Nội khu"],
      image:
        "https://useless-gold-stingray.myfilebase.com/ipfs/QmTujYCZq9ZGX7tAEbPfY1uZUgp2qRd4Gyc85fbmcuDi6K",
    },
    "eco-delivery": {
      title: "Vận Chuyển Tiết Kiệm",
      description:
        "Giải pháp vận chuyển tiết kiệm chi phí nhưng vẫn đảm bảo chất lượng. Chúng tôi tối ưu hóa quy trình vận chuyển để mang đến giá cả hợp lý nhất cho khách hàng mà không làm giảm chất lượng dịch vụ.",
      features: [
        "Giá cước cạnh tranh",
        "Tối ưu hóa lộ trình",
        "Giao hàng theo lô với giá ưu đãi",
        "Dịch vụ gom hàng tiết kiệm",
        "Linh hoạt thời gian giao hàng",
      ],
      benefits: [
        "Giảm chi phí logistics",
        "Phù hợp với doanh nghiệp vừa và nhỏ",
        "Tối ưu chi phí vận chuyển",
        "Giảm tác động môi trường",
      ],
      priceRange: "15,000đ - 25,000đ/km",
      coverage: ["Nội khu"],
      image:
        "https://useless-gold-stingray.myfilebase.com/ipfs/QmTujYCZq9ZGX7tAEbPfY1uZUgp2qRd4Gyc85fbmcuDi6K",
    },
    "safe-delivery": {
      title: "Vận Chuyển An Toàn",
      description:
        "Dịch vụ vận chuyển với độ an toàn cao nhất cho hàng hóa của bạn. Chúng tôi áp dụng các tiêu chuẩn bảo quản nghiêm ngặt và quy trình đóng gói chuyên nghiệp để đảm bảo hàng hóa đến tay người nhận một cách nguyên vẹn.",
      features: [
        "Đóng gói cẩn thận theo tiêu chuẩn",
        "Bảo hiểm hàng hóa toàn diện",
        "Xử lý hàng hóa đặc biệt",
        "Kiểm tra chất lượng trước khi giao",
        "Quy trình bảo quản chuyên nghiệp",
      ],
      benefits: [
        "An tâm với hàng hóa giá trị cao",
        "Giảm thiểu rủi ro hư hỏng",
        "Bảo vệ toàn diện cho sản phẩm",
        "Đền bù nhanh chóng nếu có sự cố",
      ],
      priceRange: "35,000đ - 45,000đ/km",
      coverage: ["Nội khu"],
      image:
        "https://useless-gold-stingray.myfilebase.com/ipfs/QmTujYCZq9ZGX7tAEbPfY1uZUgp2qRd4Gyc85fbmcuDi6K",
    },
  };

  const serviceDetails = serviceDetailsData[serviceId];


  return (
    <div className="service-details-page">
      <div className="header">
        <Header
          showLoginButton={true}
          onLoginClick={openLoginPopup}
        />
      </div>

      <div className="service-details-content">
        <div className="service-hero">
          <img
            src={serviceDetails.image}
            alt={serviceDetails.title}
            className="service-image"
          />
          <div className="service-hero-content">
            <h1>{serviceDetails.title}</h1>
            <p className="description">{serviceDetails.description}</p>
          </div>
        </div>

        <div className="service-info-grid">
          <div className="features-section">
            <h2>Tính năng nổi bật</h2>
            <ul className="features-list">
              {serviceDetails.features.map((feature, index) => (
                <li key={index} className="feature-item">
                  <span className="feature-icon">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="benefits-section">
            <h2>Lợi ích khi sử dụng dịch vụ</h2>
            <ul className="benefits-list">
              {serviceDetails.benefits.map((benefit, index) => (
                <li key={index} className="benefit-item">
                  <span className="benefit-icon">•</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="service-details-footer">
          <div className="price-section">
            <h3>Biểu phí dịch vụ</h3>
            <p className="price-range">{serviceDetails.priceRange}</p>
          </div>

          <div className="coverage-section">
            <h3>Khu vực phục vụ</h3>
            <ul className="coverage-list">
              {serviceDetails.coverage.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {isLoginPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="popup-close" onClick={closeLoginPopup}>
              &times;
            </button>
            <Login isPopup={true} onClose={closeLoginPopup} />
          </div>
        </div>
      )}

      <Footer showAccountSection={true} onLoginClick={openLoginPopup} />
    </div>
  );
};

export default ServiceDetailsPage;
