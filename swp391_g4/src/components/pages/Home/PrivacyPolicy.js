import React, { useState } from "react";
import { Header } from "../../header/Header";
import Footer from "../../footer/Footer";
import "../../../styles/PrivacyPolicy.css";
import Login from "../Login/Login";

const PrivacyPolicy = () => {
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);

  const openLoginPopup = () => {
    setIsLoginPopupOpen(true);
  };

  const closeLoginPopup = () => {
    setIsLoginPopupOpen(false);
  };

  return (
    <div className="policy-wrapper">
      <div className="header">
              <Header
                showLoginButton={true}
                onLoginClick={openLoginPopup}
              />
            </div>

      <main className="policy-main">
        <div className="policy-content">
          <h1 className="policy-title">Điều Khoản Bảo Mật</h1>

          <section className="policy-section">
            <h2 className="section-title">1. Giới thiệu</h2>
            <p className="section-text">
              EcoShipper cam kết bảo vệ quyền riêng tư và thông tin cá nhân của
              khách hàng. Chính sách bảo mật này giải thích cách chúng tôi thu
              thập, sử dụng và bảo vệ thông tin của bạn.
            </p>
          </section>

          <section className="policy-section">
            <h2 className="section-title">2. Thông tin chúng tôi thu thập</h2>
            <p className="section-text">
              Chúng tôi thu thập các thông tin sau:
            </p>
            <ul className="policy-list">
              <li className="policy-list-item">
                Thông tin cá nhân (tên, địa chỉ, email, số điện thoại)
              </li>
              <li className="policy-list-item">
                Thông tin đơn hàng và lịch sử giao dịch
              </li>
              <li className="policy-list-item">
                Thông tin thiết bị và trình duyệt
              </li>
              <li className="policy-list-item">
                Dữ liệu vị trí (khi được cho phép)
              </li>
            </ul>
          </section>

          <section className="policy-section">
            <h2 className="section-title">3. Mục đích sử dụng thông tin</h2>
            <p className="section-text">Thông tin được sử dụng để:</p>
            <ul className="policy-list">
              <li className="policy-list-item">Xử lý và vận chuyển đơn hàng</li>
              <li className="policy-list-item">Cung cấp hỗ trợ khách hàng</li>
              <li className="policy-list-item">
                Cải thiện dịch vụ của chúng tôi
              </li>
              <li className="policy-list-item">
                Gửi thông tin cập nhật và khuyến mãi (khi được đồng ý)
              </li>
            </ul>
          </section>

          <section className="policy-section">
            <h2 className="section-title">4. Bảo mật thông tin</h2>
            <p className="section-text">
              Chúng tôi áp dụng các biện pháp bảo mật sau:
            </p>
            <ul className="policy-list">
              <li className="policy-list-item">Mã hóa dữ liệu</li>
              <li className="policy-list-item">Hệ thống bảo mật đa lớp</li>
              <li className="policy-list-item">
                Kiểm soát truy cập nghiêm ngặt
              </li>
              <li className="policy-list-item">Đào tạo nhân viên về bảo mật</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2 className="section-title">5. Chia sẻ thông tin</h2>
            <p className="section-text">Chúng tôi chỉ chia sẻ thông tin với:</p>
            <ul className="policy-list">
              <li className="policy-list-item">
                Đối tác vận chuyển để thực hiện giao hàng
              </li>
              <li className="policy-list-item">
                Cơ quan chức năng theo yêu cầu pháp lý
              </li>
              <li className="policy-list-item">
                Đối tác thanh toán để xử lý giao dịch
              </li>
            </ul>
          </section>

          <section className="policy-section">
            <h2 className="section-title">6. Quyền của người dùng</h2>
            <p className="section-text">Bạn có quyền:</p>
            <ul className="policy-list">
              <li className="policy-list-item">
                Truy cập thông tin cá nhân của mình
              </li>
              <li className="policy-list-item">
                Yêu cầu chỉnh sửa thông tin không chính xác
              </li>
              <li className="policy-list-item">Yêu cầu xóa thông tin</li>
              <li className="policy-list-item">
                Từ chối nhận thông tin tiếp thị
              </li>
            </ul>
          </section>

          <section className="policy-section">
            <h2 className="section-title">7. Thay đổi chính sách</h2>
            <p className="section-text">
              Chúng tôi có thể cập nhật chính sách này theo thời gian. Mọi thay
              đổi sẽ được thông báo trên website và qua email.
            </p>
          </section>

          <section className="policy-section">
            <h2 className="section-title">8. Liên hệ</h2>
            <p className="section-text">
              Nếu có thắc mắc về chính sách bảo mật, vui lòng liên hệ:
            </p>
            <div className="policy-contact">
              <p className="contact-item">Email: privacy@ecoshipper.com</p>
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

export default PrivacyPolicy;
