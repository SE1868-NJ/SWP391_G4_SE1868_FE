import React, { useState } from "react";
import { Header } from "../../header/Header";
import Footer from "../../footer/Footer";
import "../../../styles/TermOfUse.css";
import Login from "../Login/Login";

const TermsOfUse = () => {
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);


  const openLoginPopup = () => {
    setIsLoginPopupOpen(true);
  };

  const closeLoginPopup = () => {
    setIsLoginPopupOpen(false);
  };


  return (
    <div className="terms-wrapper">
      <div className="header">
        <Header
          showLoginButton={true}
          onLoginClick={openLoginPopup}
        />
      </div>

      <main className="terms-main">
        <div className="terms-content">
          <h1 className="terms-title">Chính Sách Sử Dụng</h1>

          <section className="terms-section">
            <h2 className="section-title">1. Điều Khoản Chung</h2>
            <p className="section-text">
              Bằng cách truy cập và sử dụng dịch vụ của EcoShipper, bạn đồng ý
              tuân theo các điều khoản và điều kiện được quy định trong chính
              sách này. Vui lòng đọc kỹ trước khi sử dụng dịch vụ.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="section-title">2. Điều Kiện Sử Dụng Dịch Vụ</h2>
            <p className="section-text">
              Để sử dụng dịch vụ của chúng tôi, bạn cần:
            </p>
            <ul className="terms-list">
              <li className="terms-list-item">
                Đủ 18 tuổi hoặc được sự đồng ý của người giám hộ
              </li>
              <li className="terms-list-item">
                Cung cấp thông tin chính xác và đầy đủ
              </li>
              <li className="terms-list-item">
                Đảm bảo tính hợp pháp của hàng hóa vận chuyển
              </li>
              <li className="terms-list-item">
                Tuân thủ quy định vận chuyển của địa phương
              </li>
            </ul>
          </section>

          <section className="terms-section">
            <h2 className="section-title">3. Quy Định Về Hàng Hóa</h2>
            <p className="section-text">
              Các loại hàng hóa không được phép vận chuyển:
            </p>
            <ul className="terms-list">
              <li className="terms-list-item">
                Hàng cấm theo quy định pháp luật
              </li>
              <li className="terms-list-item">Vũ khí, chất nổ, chất dễ cháy</li>
              <li className="terms-list-item">Động vật hoang dã</li>
              <li className="terms-list-item">Hàng giả, hàng nhái</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2 className="section-title">4. Quy Trình Vận Chuyển</h2>
            <p className="section-text">Quy trình vận chuyển cơ bản:</p>
            <ul className="terms-list">
              <li className="terms-list-item">Đặt đơn hàng trên hệ thống</li>
              <li className="terms-list-item">
                Xác nhận thông tin và thanh toán
              </li>
              <li className="terms-list-item">
                Lấy hàng tại địa chỉ người gửi
              </li>
              <li className="terms-list-item">Vận chuyển và giao hàng</li>
              <li className="terms-list-item">Xác nhận giao hàng thành công</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2 className="section-title">5. Chính Sách Thanh Toán</h2>
            <p className="section-text">
              Chúng tôi chấp nhận các hình thức thanh toán:
            </p>
            <ul className="terms-list">
              <li className="terms-list-item">
                Thanh toán khi nhận hàng (COD)
              </li>
              <li className="terms-list-item">Chuyển khoản ngân hàng</li>
              <li className="terms-list-item">Ví điện tử</li>
              <li className="terms-list-item">Thẻ tín dụng/ghi nợ</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2 className="section-title">6. Chính Sách Bồi Thường</h2>
            <p className="section-text">
              Trong trường hợp hàng hóa bị hư hỏng hoặc thất lạc:
            </p>
            <ul className="terms-list">
              <li className="terms-list-item">
                Bồi thường theo giá trị khai báo
              </li>
              <li className="terms-list-item">Tối đa 100% giá trị hàng hóa</li>
              <li className="terms-list-item">Xử lý khiếu nại trong 24h</li>
              <li className="terms-list-item">
                Hoàn tiền trong 7 ngày làm việc
              </li>
            </ul>
          </section>

          <section className="terms-section">
            <h2 className="section-title">7. Quyền Và Trách Nhiệm</h2>
            <div className="terms-subsection">
              <h3 className="subsection-title">Quyền của người dùng:</h3>
              <ul className="terms-list">
                <li className="terms-list-item">
                  Được cung cấp dịch vụ như cam kết
                </li>
                <li className="terms-list-item">
                  Yêu cầu bồi thường thiệt hại
                </li>
                <li className="terms-list-item">Khiếu nại và góp ý dịch vụ</li>
              </ul>
            </div>
            <div className="terms-subsection">
              <h3 className="subsection-title">Trách nhiệm của người dùng:</h3>
              <ul className="terms-list">
                <li className="terms-list-item">
                  Cung cấp thông tin chính xác
                </li>
                <li className="terms-list-item">Đóng gói hàng hóa an toàn</li>
                <li className="terms-list-item">
                  Thanh toán đầy đủ và đúng hạn
                </li>
              </ul>
            </div>
          </section>

          <section className="terms-section">
            <h2 className="section-title">8. Liên Hệ Hỗ Trợ</h2>
            <p className="section-text">
              Nếu có thắc mắc về chính sách sử dụng, vui lòng liên hệ:
            </p>
            <div className="terms-contact">
              <p className="contact-item">Email: support@ecoshipper.com</p>
              <p className="contact-item">Điện thoại: 091954393</p>
              <p className="contact-item">
                Địa chỉ: Trường Đại Học FPT, Hoà Lạc, Thạch Thất, Hà Nội
              </p>
            </div>
          </section>
        </div>
      </main>

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

export default TermsOfUse;