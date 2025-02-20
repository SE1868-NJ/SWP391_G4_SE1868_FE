import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../header/Header";
import Footer from "../../footer/Footer";
import "../../../styles/JobDetail.css";
import Login from "../Login/Login";

const JobDetail = () => {
  const { jobId } = useParams();
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);

  // Navigation Items
  const navigationItems = [
    { text: "Trang chủ", path: "/home" },
    { text: "Về chúng tôi", path: "/about" },
    { text: "Tin tức", path: "/news" },
    { text: "Liên hệ", path: "/shipper-contact" },
  ];

  const openLoginPopup = () => {
    setIsLoginPopupOpen(true);
  };

  const closeLoginPopup = () => {
    setIsLoginPopupOpen(false);
  };

  const jobDetails = {
    "nhan-vien-van-phong": {
      title: "Nhân viên văn phòng",
      overview:
        "Làm việc trong môi trường văn phòng chuyên nghiệp, năng động tại EcoShipper",
      positions: [
        {
          role: "Nhân viên Hành chính kho",
          salary: "8-12 triệu",
          location: "TP.HCM, Hà Nội",
          requirements: [
            "Tốt nghiệp Cao đẳng/Đại học chuyên ngành Quản trị văn phòng hoặc tương đương",
            "Có ít nhất 1 năm kinh nghiệm trong lĩnh vực hành chính kho",
            "Thành thạo Microsoft Office",
            "Kỹ năng giao tiếp và xử lý tình huống tốt",
          ],
          responsibilities: [
            "Quản lý và theo dõi hàng hóa trong kho",
            "Lập báo cáo định kỳ về tình trạng kho",
            "Kiểm soát quy trình xuất nhập kho",
            "Phối hợp với các bộ phận liên quan để đảm bảo hoạt động kho diễn ra trơn tru",
          ],
          benefits: [
            "Lương cơ bản + thưởng theo hiệu quả công việc",
            "Bảo hiểm theo quy định",
            "Được đào tạo và phát triển kỹ năng chuyên môn",
            "Xét tăng lương 2 lần/năm",
            "Du lịch công ty hàng năm",
          ],
        },
        {
          role: "Chuyên viên Đào tạo",
          salary: "12-15 triệu",
          location: "TP.HCM",
          requirements: [
            "Tốt nghiệp Đại học chuyên ngành Quản trị nhân sự, Giáo dục hoặc tương đương",
            "Có ít nhất 2 năm kinh nghiệm trong lĩnh vực đào tạo",
            "Kỹ năng thuyết trình và truyền đạt tốt",
            "Có khả năng lập kế hoạch và tổ chức sự kiện",
          ],
          responsibilities: [
            "Xây dựng và phát triển chương trình đào tạo",
            "Tổ chức các khóa đào tạo nội bộ",
            "Đánh giá hiệu quả đào tạo",
            "Quản lý ngân sách đào tạo",
          ],
          benefits: [
            "Lương cơ bản hấp dẫn + thưởng dự án",
            "Chế độ bảo hiểm đầy đủ",
            "Cơ hội phát triển nghề nghiệp",
            "Môi trường làm việc chuyên nghiệp",
            "Các chế độ phúc lợi theo quy định công ty",
          ],
        },
      ],
    },
    "trung-tam-cong-nghe": {
      title: "Trung tâm công nghệ",
      overview:
        "Tham gia phát triển các giải pháp công nghệ tiên tiến cho ngành logistics",
      positions: [
        {
          role: "Java Developer",
          salary: "15-30 triệu",
          location: "TP.HCM",
          requirements: [
            "Tốt nghiệp Đại học chuyên ngành CNTT hoặc tương đương",
            "Có ít nhất 2 năm kinh nghiệm với Java",
            "Thành thạo Spring Framework, RESTful APIs",
            "Có kinh nghiệm với cơ sở dữ liệu SQL và NoSQL",
            "Hiểu biết về microservices architecture",
          ],
          responsibilities: [
            "Phát triển và maintain các ứng dụng Java",
            "Thiết kế và implement các features mới",
            "Tối ưu hiệu suất hệ thống",
            "Code review và mentor các thành viên junior",
          ],
          benefits: [
            "Lương cạnh tranh theo năng lực",
            "Thưởng project và thưởng năm",
            "Chế độ bảo hiểm cao cấp",
            "Làm việc với công nghệ mới",
            "Cơ hội đào tạo nước ngoài",
          ],
        },
        {
          role: "Data Scientist",
          salary: "20-35 triệu",
          location: "TP.HCM",
          requirements: [
            "Tốt nghiệp Đại học/Thạc sĩ chuyên ngành CNTT, Toán học hoặc tương đương",
            "Thành thạo Python và các thư viện ML",
            "Kinh nghiệm với big data tools",
            "Hiểu biết sâu về statistical modeling",
            "Kỹ năng phân tích và giải quyết vấn đề tốt",
          ],
          responsibilities: [
            "Phân tích dữ liệu và xây dựng mô hình dự đoán",
            "Tối ưu hóa quy trình logistics",
            "Phát triển các giải pháp AI/ML",
            "Làm việc với các team khác để implement các giải pháp",
          ],
          benefits: [
            "Lương thưởng cạnh tranh",
            "Được làm việc với dữ liệu lớn",
            "Tham gia các dự án nghiên cứu",
            "Cơ hội học tập và phát triển",
            "Môi trường làm việc quốc tế",
          ],
        },
      ],
    },
    "nhan-vien-van-hanh": {
      title: "Nhân viên vận hành",
      overview:
        "Đảm bảo hoạt động vận hành kho bãi và bưu cục diễn ra hiệu quả",
      positions: [
        {
          role: "Nhân viên Bưu cục",
          salary: "7-10 triệu",
          location: "Toàn quốc",
          requirements: [
            "Tốt nghiệp THPT trở lên",
            "Có khả năng giao tiếp tốt",
            "Thành thạo vi tính văn phòng cơ bản",
            "Chịu được áp lực công việc",
          ],
          responsibilities: [
            "Tiếp nhận và xử lý hàng hóa tại bưu cục",
            "Phân loại hàng hóa theo tuyến",
            "Hỗ trợ khách hàng với các vấn đề phát sinh",
            "Thực hiện các báo cáo hàng ngày",
          ],
          benefits: [
            "Lương cơ bản + thưởng",
            "Phụ cấp ca đêm, thâm niên",
            "Đóng BHXH đầy đủ",
            "Được đào tạo nghiệp vụ",
            "Cơ hội thăng tiến",
          ],
        },
        {
          role: "Giám sát Kho vận",
          salary: "12-18 triệu",
          location: "TP.HCM, Hà Nội",
          requirements: [
            "Tốt nghiệp Cao đẳng/Đại học",
            "Có ít nhất 2 năm kinh nghiệm quản lý kho",
            "Kỹ năng quản lý nhân sự tốt",
            "Có chứng chỉ vận hành xe nâng là lợi thế",
          ],
          responsibilities: [
            "Quản lý hoạt động kho hàng",
            "Điều phối nhân sự và phương tiện",
            "Đảm bảo an toàn kho hàng",
            "Tối ưu quy trình vận hành",
          ],
          benefits: [
            "Lương cạnh tranh theo năng lực",
            "Thưởng KPI hàng tháng",
            "Chế độ bảo hiểm đầy đủ",
            "Đào tạo nâng cao nghiệp vụ",
            "Phụ cấp trách nhiệm",
          ],
        },
      ],
    },
    "nhan-vien-lay-giao-tai-xe": {
      title: "Nhân viên lấy giao, tài xế",
      overview:
        "Đội ngũ vận chuyển chuyên nghiệp, đảm bảo hàng hóa đến tay khách hàng an toàn, đúng hẹn",
      positions: [
        {
          role: "Giám sát Xe tải",
          salary: "10-15 triệu",
          location: "TP.HCM, Hà Nội, Đà Nẵng",
          requirements: [
            "Có bằng lái xe B2 trở lên",
            "Ít nhất 2 năm kinh nghiệm lái xe tải",
            "Hiểu biết về luật giao thông",
            "Kỹ năng quản lý đội nhóm",
          ],
          responsibilities: [
            "Điều phối đội xe trong khu vực",
            "Đảm bảo lịch trình vận chuyển",
            "Kiểm tra an toàn phương tiện",
            "Báo cáo tình trạng vận chuyển",
          ],
          benefits: [
            "Lương cơ bản + phụ cấp",
            "Thưởng KPI theo doanh số",
            "Bảo hiểm tai nạn 24/24",
            "Đồng phục và công cụ làm việc",
            "Hỗ trợ nhiên liệu",
          ],
        },
        {
          role: "Nhân viên giao hàng",
          salary: "8-12 triệu",
          location: "Toàn quốc",
          requirements: [
            "Có xe máy và giấy tờ hợp lệ",
            "Thành thạo sử dụng smartphone",
            "Giao tiếp tốt, thân thiện",
            "Chịu được áp lực công việc",
          ],
          responsibilities: [
            "Giao hàng đúng thời gian",
            "Xử lý các vấn đề phát sinh",
            "Thu hộ COD chính xác",
            "Báo cáo tình trạng đơn hàng",
          ],
          benefits: [
            "Thu nhập theo số đơn hàng",
            "Thưởng doanh số",
            "Hỗ trợ xăng xe",
            "Bảo hiểm tai nạn",
            "Đào tạo nghiệp vụ miễn phí",
          ],
        },
      ],
    },
  };

  const currentJob = jobDetails[jobId];

  return (
    <div className="job-detail-page">
      <Header
        navigationItems={navigationItems}
        showLoginButton={true}
        onLoginClick={openLoginPopup}
      />
      <div className="job-banner">
        <img
          src="https://useless-gold-stingray.myfilebase.com/ipfs/Qmd9G4vTQzh48KmUSsMVjgSBBJvZe54Sj4tjLJoLW4ZZGp"
          alt="EcoShipper Career Banner"
          className="job-banner-image"
        />
        <div className="job-banner-overlay">
          <h1>Cơ Hội Nghề Nghiệp Tại EcoShipper</h1>
          <p>Khám phá và phát triển sự nghiệp cùng chúng tôi</p>
        </div>
      </div>
      <div className="job-detail-container">
        <h1 className="job-detail-title">{currentJob?.title}</h1>
        <p className="job-overview">{currentJob?.overview}</p>

        {currentJob?.positions.map((position, index) => (
          <div key={index} className="position-card">
            <div className="position-header">
              <h2 className="position-title">{position.role}</h2>
              <div className="position-meta">
                <span className="salary">Mức lương: {position.salary}</span>
                <span className="location">Địa điểm: {position.location}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Yêu cầu công việc</h3>
              <ul>
                {position.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="detail-section">
              <h3>Mô tả công việc</h3>
              <ul>
                {position.responsibilities.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </div>

            <div className="detail-section">
              <h3>Quyền lợi</h3>
              <ul>
                {position.benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="job-apply-section">
        <h3 className="job-apply-title">Cách thức ứng tuyển</h3>
        <div className="job-apply-grid">
          <div className="job-apply-method">
            <h4 className="method-title">Ứng tuyển trực tuyến</h4>
            <p className="method-text">
              Điền thông tin đăng kí vào trang web và chờ phản hồi của chúng tôi
            </p>
          </div>
          <div className="job-apply-method">
            <h4 className="method-title">Gửi CV qua email</h4>
            <p className="method-text">
              Gửi CV của bạn tới: ecoshipper2004@gmail.com
            </p>
          </div>
          <div className="job-apply-method">
            <h4 className="method-title">Liên hệ trực tiếp</h4>
            <p className="method-text">Hotline: 1900 xxxx</p>
            <p className="method-text">
              Địa chỉ: Trường Đại Học FPT, Hoà Lạc, Thạch Thất, Hà Nội
            </p>
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

export default JobDetail;
