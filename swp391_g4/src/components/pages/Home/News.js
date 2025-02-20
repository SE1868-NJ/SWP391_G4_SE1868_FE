import React, { useState } from 'react';
import '../../../styles/News.css';
import { Header } from "../../header/Header";
import Footer from "../../footer/Footer";
import Login from "../Login/Login";
import { Link } from 'react-router-dom';

const News = () => {
  // Navigation Items
  const newsNavigationItems = [
    { text: "Trang chủ", path: "/home" },
    { text: "Về chúng tôi", path: "/about" },
    { text: "Tin tức", path: "/news", isActive: true },
    { text: "Liên hệ", path: "/shipper-contact" },
  ];

  // Login Popup State
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);

  const openLoginPopup = () => {
    setIsLoginPopupOpen(true);
  };

  const closeLoginPopup = () => {
    setIsLoginPopupOpen(false);
  };

  return (
    <div className="news">
      {/* Header */}
      <div className='header'>
      <Header
        navigationItems={newsNavigationItems}
        showLoginButton={true}
        onLoginClick={openLoginPopup}
      />
      </div>

      {/* News Section */}
      <section className="news-section">
        <h2>Tin tức & Sự kiện</h2>

        <div className="news-list">
          {/* Sự kiện 1 */}
          <div className="news-item">
            <Link to="/news/1">
              <img
                src="https://thietbidungcubuffet.com/images/tin-tuc/cau-chuc-khai-truong-nha-h%C3%A0ng.jpg"
                alt="Khai trương chi nhánh mới"
                className="news-image"
              />
              <h3>Khai trương chi nhánh EcoShipper tại Hà Nội</h3>
              <p>
                Ngày 15/02/2024, EcoShipper chính thức mở chi nhánh tại Hà Nội nhằm đáp ứng nhu cầu vận chuyển tăng cao của khách hàng.
              </p>
            </Link>
          </div>

          {/* Sự kiện 2 */}
          <div className="news-item">
            <Link to="/news/2">
              <img
                src="https://dntt.mediacdn.vn/197608888129458176/2020/12/22/cns-1608623491956-16086234920821602536956.jpg"
                alt="Hội thảo công nghệ giao nhận"
                className="news-image"
              />
              <h3>Hội thảo: Tối ưu giao nhận trong nội khu</h3>
              <p>
                Hội thảo về cải tiến giao hàng nội khu, tập trung vào các phương pháp tối ưu tuyến đường và giao hàng nhanh.
              </p>
            </Link>
          </div>

          {/* Sự kiện 3 */}
          <div className="news-item">
            <Link to="/news/3">
              <img
                src="https://stdvietnam.vn/FileUpload/Images/mien_phi_nhu_khong.jpg"
                alt="EcoShipper đồng hành cùng cộng đồng"
                className="news-image"
              />
              <h3>EcoShipper hỗ trợ giao hàng miễn phí cho các tiểu thương</h3>
              <p>
                Hỗ trợ giao hàng miễn phí trong nội khu cho các tiểu thương trong thời gian lễ Tết, giúp việc kinh doanh dễ dàng hơn.
              </p>
            </Link>
          </div>

          {/* Sự kiện 4 */}
          <div className="news-item">
            <Link to="/news/4">
              <img
                src="https://xwatch.vn/upload_images/images/2023/01/11/1-ngay-co-bao-nhieu-gio-phut-giay.jpg"
                alt="Cam kết phát triển bền vững"
                className="news-image"
              />
              <h3>Chương trình "1 giờ giao hàng nội khu"</h3>
              <p>
                Ra mắt dịch vụ "Giao hàng 1 giờ" tại các quận trung tâm, đảm bảo tốc độ giao hàng nhanh nhất cho khách hàng nội khu.
              </p>
            </Link>
          </div>

          {/* Sự kiện 5 */}
          <div className="news-item">
            <Link to="/news/5">
              <img
                src="https://img.freepik.com/free-psd/3d-illustration-with-awards-sales-podium_23-2151262579.jpg"
                alt="Giải thưởng Sao Vàng Đất Việt"
                className="news-image"
              />
              <h3>Trao thưởng cho Shipper xuất sắc tháng 1</h3>
              <p>
                Tôn vinh những shipper đạt hiệu quả cao nhất trong tháng với chương trình trao thưởng "Shipper xuất sắc nội khu".
              </p>
            </Link>
          </div>

          {/* Sự kiện 6 */}
          <div className="news-item">
            <Link to="/news/6">
              <img
                src="https://i.pinimg.com/originals/90/98/8a/90988a283f78e68a9349694554bc2d52.jpg"
                alt="Ứng dụng xe đạp điện trong nội khu"
                className="news-image"
              />
              <h3>Ứng dụng xe đạp điện thân thiện môi trường</h3>
              <p>
                EcoShipper triển khai đội xe đạp điện tại các quận trung tâm, vừa nhanh chóng vừa bảo vệ môi trường.
              </p>
            </Link>
          </div>
        </div>
      </section>


      {/* Hoạt động xã hội */}
      <section className="social-activities">
        <h2>Hoạt động xã hội</h2>

        <div className="activities-list">
          {/* Hoạt động 1 */}
          <div className="activity-item">
            <Link to="/activities/1">
              <img
                src="https://media.vietnamplus.vn/images/c14f6479e83e315b4cf3a2906cc6a51e8c0218388a4fa14bb99ff693072eeaaa3140efc03a1d1799838b71e0b417720205720abe0655a383a80f69e89e8e18ddb81cc02e8ad39d0721b4417e86f96300/lich-nghi-tet-2-6526.jpg.webp"
                alt="Chương trình thiện nguyện Tết yêu thương"
                className="activity-image"
              />
              <h3>Chương trình thiện nguyện "Tết yêu thương"</h3>
              <p>
                EcoShipper phối hợp cùng các tổ chức từ thiện để mang đến những món quà Tết cho các gia đình khó khăn tại vùng sâu vùng xa.
              </p>
            </Link>
          </div>

          {/* Hoạt động 2 */}
          <div className="activity-item">
            <Link to="/activities/2">
              <img
                src="https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/07/anh-cay-xanh.jpg"
                alt="EcoShipper trồng cây xanh tại khu dân cư"
                className="activity-image"
              />
              <h3>EcoShipper trồng cây xanh tại khu dân cư</h3>
              <p>
                Hưởng ứng chiến dịch bảo vệ môi trường, EcoShipper tổ chức trồng cây xanh tại các khu đô thị để tạo không gian xanh sạch đẹp.
              </p>
            </Link>
          </div>

          {/* Hoạt động 3 */}
          <div className="activity-item">
            <Link to="/activities/3">
              <img
                src="https://kfo.edu.vn/wp-content/uploads/2023/03/hoc-bong-toan-phan-11.jpg"
                alt="Chương trình học bổng cho trẻ em nghèo"
                className="activity-image"
              />
              <h3>Chương trình học bổng cho trẻ em nghèo</h3>
              <p>
                EcoShipper cam kết hỗ trợ giáo dục bằng việc trao tặng học bổng và dụng cụ học tập cho trẻ em có hoàn cảnh khó khăn.
              </p>
            </Link>
          </div>

          {/* Hoạt động 4 */}
          <div className="activity-item">
            <Link to="/activities/4">
              <img
                src="https://biogency.com.vn/wp-content/uploads/2022/06/tinh-trang-o-nhiem-moi-truong-dang-o-muc-bao-dong-tren-khap-toan-cau.jpg"
                alt="Chiến dịch dọn dẹp môi trường"
                className="activity-image"
              />
              <h3>Chiến dịch dọn dẹp môi trường</h3>
              <p>
                Cùng cộng đồng tham gia dọn dẹp rác thải, bảo vệ môi trường xanh sạch đẹp tại các khu vực đông dân cư.
              </p>
            </Link>
          </div>

          {/* Hoạt động 5 */}
          <div className="activity-item">
            <Link to="/activities/5">
              <img
                src="https://karaoke.com.vn/wp-content/uploads/2020/02/Hi%E1%BA%BFn-m%C3%A1u.jpg"
                alt="Chiến dịch hiến máu nhân đạo"
                className="activity-image"
              />
              <h3>Chiến dịch hiến máu nhân đạo</h3>
              <p>
                EcoShipper kêu gọi nhân viên và cộng đồng tham gia hiến máu nhân đạo, góp phần cứu sống nhiều bệnh nhân cần truyền máu.
              </p>
            </Link>
          </div>

          {/* Hoạt động 6  */}
          <div className="activity-item small">
            <Link to="/activities/6">
              <img
                src="https://media.istockphoto.com/id/1569228589/vi/vec-to/2306-m10-s-st-t%E1%BB%AB-thi%E1%BB%87n-cho-ng%C6%B0%E1%BB%9Di-v%C3%B4-gia-c%C6%B0-phim-ho%E1%BA%A1t-h%C3%ACnh-gi%C3%BAp-%C4%91%E1%BB%A1-nh%C3%A2n-%C4%91%E1%BA%A1o-v%C3%A0-h%E1%BB%97-tr%E1%BB%A3-ng%C6%B0%E1%BB%9Di.jpg?s=612x612&w=0&k=20&c=0ThgrKEp_K1eYOEEW9Mz0A372a45AzgZngE4oUF0eNE="
                alt="Chương trình hỗ trợ người vô gia cư"
                className="activity-image"
              />
              <h3>Chương trình hỗ trợ người vô gia cư</h3>
              <p>
                EcoShipper triển khai chiến dịch phát cơm và quần áo ấm cho người vô gia cư tại các thành phố lớn vào mùa đông.
              </p>
            </Link>
          </div>
          </div>
      </section>
      {/* Login Popup */}
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

      {/* Footer */}
      <Footer
        showAccountSection={true}
        onLoginClick={openLoginPopup}
      />
    </div>
  );
};

export default News;