

import React from 'react';
import '../../../styles/Home.css';
import { Link } from 'react-router-dom';

const News = () => {
  return (
    <div className="news">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img
            src="https://via.placeholder.com/150x50?text=EcoShipper+Logo"
            alt="EcoShipper"
          />
        </div>
        <nav className="nav">
          <ul>
            <li><Link to="/home">Trang chủ</Link></li>
            <li><Link to="/about">Về chúng tôi</Link></li>
            <li><Link to="/news">Tin tức</Link></li>
            <li><Link to="/contact">Liên hệ</Link></li>
          </ul>
        </nav>
      </header>

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

  {/* Sự kiện 7 */}
  <div className="news-item">
    <Link to="/news/7">
      <img
        src="https://hoaphatmiennam.vn/wp-content/uploads/2023/01/tet-nguyen-dan-va-nhung-dieu-ban-chua-biet-1.jpg"
        alt="Tăng cường giao nhận nội khu dịp lễ Tết"
        className="news-image"
      />
      <h3>Tăng cường giao nhận nội khu dịp lễ Tết</h3>
      <p>
        EcoShipper triển khai dịch vụ đặc biệt dịp Tết Nguyên Đán, đảm bảo giao hàng nhanh chóng cho khách hàng tại nội khu.
      </p>
    </Link>
  </div>  




        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Liên hệ</h3>
            <p>Email: support@ecoshipper.vn</p>
            <p>Điện thoại: 1900 1234 56</p>
          </div>
          <div className="footer-section">
            <h3>Liên kết nhanh</h3>
            <ul>
              <li><Link to="/home">Trang chủ</Link></li>
              <li><Link to="/about">Về chúng tôi</Link></li>
              <li><Link to="/news">Tin tức</Link></li>
              <li><Link to="/contact">Liên hệ</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 EcoShipper. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default News;

