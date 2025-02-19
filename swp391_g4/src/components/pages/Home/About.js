import React from "react";
import "../../../styles/About.css";
import { Header } from "../../header/Header";
import Footer from "../../footer/Footer";
import { useState } from "react";
import Login from "../Login/Login";

const About = () => {
    
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);

  const openLoginPopup = () => {
    setIsLoginPopupOpen(true);
  };

  const closeLoginPopup = () => {
    setIsLoginPopupOpen(false);
  };

  return (
    <div className="about">
      {/* Header */}
      <Header
        showLoginButton={true}
        onLoginClick={openLoginPopup}
      />

      {/* About Section */}
      <section className="about-section">
        <h2>Tầm nhìn</h2>
        <p>
          EcoShipper là nền tảng giao hàng nhanh và tiện lợi, tập trung vào việc
          cung cấp giải pháp hậu cần tối ưu cho các doanh nghiệp và người bán
          hàng trong nội khu. Chúng tôi luôn hướng tới việc tạo ra một hệ sinh
          thái giao hàng hiện đại, nơi mà mọi nhu cầu vận chuyển của khách hàng
          đều được giải quyết một cách nhanh chóng và hiệu quả. Với công nghệ
          tiên tiến và mạng lưới giao nhận địa phương đáng tin cậy, EcoShipper
          mang lại trải nghiệm giao hàng liền mạch, đảm bảo sự hài lòng cao nhất
          cho khách hàng.
        </p>
        <h2>Lịch sử phát triển</h2>
        <p>
          Được thành lập vào năm 2015, EcoShipper bắt đầu từ một dịch vụ giao
          hàng nhỏ lẻ, với tham vọng giải quyết những khó khăn trong vận chuyển
          nội khu. Qua nhiều năm nỗ lực, chúng tôi đã mở rộng phạm vi hoạt động,
          phục vụ hàng trăm doanh nghiệp và khách hàng cá nhân trong khu vực. Sự
          phát triển không ngừng của chúng tôi được xây dựng dựa trên cam kết
          chất lượng, đổi mới công nghệ, và sự hỗ trợ mạnh mẽ từ cộng đồng địa
          phương. Chúng tôi tự hào là đối tác đáng tin cậy trong mọi hoạt động
          giao nhận hàng hóa nội khu.
        </p>
        <h2>Cam kết với cộng đồng</h2>
        <p>
          EcoShipper không chỉ là một công ty giao hàng, mà còn là một phần của
          cộng đồng. Chúng tôi cam kết thúc đẩy các giá trị bền vững bằng cách
          sử dụng phương tiện vận chuyển thân thiện với môi trường và tối ưu hóa
          quy trình vận hành để giảm thiểu tác động tiêu cực lên môi trường.
          Đồng thời, chúng tôi luôn tìm cách hỗ trợ các doanh nghiệp địa phương,
          tạo điều kiện cho họ phát triển và thịnh vượng. Qua các chương trình
          hợp tác và hỗ trợ cộng đồng, EcoShipper đã góp phần xây dựng một mạng
          lưới kinh tế địa phương vững mạnh.
        </p>
        <img
          className="about-image"
          src="https://static.topcv.vn/cms/2628dcd474dd23.jpg"
          alt="EcoShipper Local Delivery"
        />
        <h2>Sứ mệnh</h2>
        <p>
          Với sứ mệnh kết nối hiệu quả giữa người bán và người mua trong nội
          khu, EcoShipper không ngừng đổi mới để đáp ứng nhu cầu ngày càng cao
          của khách hàng. Chúng tôi tập trung vào việc cung cấp các dịch vụ giao
          hàng chất lượng cao, nhanh chóng và đáng tin cậy, đồng thời đảm bảo
          rằng mọi đơn hàng được xử lý với sự tận tâm và chính xác. Sứ mệnh của
          chúng tôi là làm cho dịch vụ giao nhận trở nên dễ dàng và tiện lợi hơn
          bao giờ hết, giúp khách hàng có thêm thời gian để tập trung vào các
          khía cạnh khác trong công việc và cuộc sống.
        </p>
        <h2>Giá trị cốt lõi</h2>
        <ul>
          <li>
            <strong>Nhanh chóng & Chính xác:</strong> Đảm bảo thời gian giao
            hàng nhanh nhất nhờ vào mạng lưới địa phương được tối ưu hóa và quản
            lý chặt chẽ.
          </li>
          <li>
            <strong>Tin cậy & An toàn:</strong> Các đơn hàng được theo dõi và
            quản lý nghiêm ngặt, đảm bảo mọi sản phẩm đều đến tay khách hàng một
            cách an toàn và nguyên vẹn.
          </li>
          <li>
            <strong>Hỗ trợ cộng đồng:</strong> Chúng tôi coi trọng việc xây dựng
            mối quan hệ lâu dài với cộng đồng địa phương, thúc đẩy hợp tác và hỗ
            trợ phát triển bền vững.
          </li>
          <li>
            <strong>Công nghệ hiện đại:</strong> Ứng dụng công nghệ theo dõi
            thời gian thực và quản lý thông minh để nâng cao hiệu quả và sự hài
            lòng của khách hàng.
          </li>
        </ul>
      </section>

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

export default About;
