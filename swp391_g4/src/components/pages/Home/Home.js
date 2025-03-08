import React, { useState, useEffect } from "react";
import "../../../styles/Home.css";
import Footer from "../../footer/Footer";
import Header from "../../header/Header";
import Login from "../Login/Login";
import { useNavigate } from "react-router-dom";
import ChatPopup from "../Home/ChatPopup";

const Home = () => {
  // Navigation Items
  const homeNavigationItems = [
    { text: "Trang chủ", path: "/home", isActive: true },
    { text: "Về chúng tôi", path: "/about" },
    { text: "Tin tức", path: "/news" },
    { text: "Liên hệ", path: "/shipper-contact" },
  ];

  // Banner Data
  const bannerData = [
    {
      image:
        "https://useless-gold-stingray.myfilebase.com/ipfs/QmeU64hjvd6f4sGADM92sYVUC3m9scfTfVk48aeBkpqbGf",
      title: "EcoShipper Cùng Quỹ Hy Vọng Xây Cầu Tại Đồng Tháp",
      subtitle: "Cán mốc 400 cây cầu được xây dựng",
    },
    {
      image:
        "https://useless-gold-stingray.myfilebase.com/ipfs/QmQUTBK6HSgGfvduZ4aSrqkVDNckhiFZsS2E5EbjN5qJcg",
      title: "Dịch Vụ Vận Chuyển Chuyên Nghiệp",
      subtitle: "Đảm bảo an toàn và uy tín cho mọi đơn hàng",
    },
    {
      image:
        "https://useless-gold-stingray.myfilebase.com/ipfs/QmaGUSB9pARbkDWMAipkkWA7LZQp4JdHkWrX9wUz61fy4f",
      title: "Phủ Sóng Toàn Quốc",
      subtitle: "Kết nối mọi miền, vận chuyển mọi nơi",
    },
  ];

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [direction, setDirection] = useState("left");

  // Auto-sliding Effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDirection("left");
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % bannerData.length);
    }, 5000); // Change banner every 5 seconds

    return () => clearInterval(intervalId);
  }, [bannerData.length]);

  // Manual Navigation Functions
  const nextBanner = () => {
    setDirection("left");
    setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % bannerData.length);
  };

  const prevBanner = () => {
    setDirection("right");
    setCurrentBannerIndex(
      (prevIndex) => (prevIndex - 1 + bannerData.length) % bannerData.length
    );
  };

  const goToBanner = (index) => {
    setDirection(index > currentBannerIndex ? "left" : "right");
    setCurrentBannerIndex(index);
  };

  const servicesData = [
    {
      id: "fast-delivery",
      title: "Giao Hàng Nhanh Chóng",
      description: "Giao hàng nhanh chóng, tiết kiệm thời gian.",
    },
    {
      id: "eco-delivery",
      title: "Vận Chuyển Tiết Kiệm",
      description: "Dịch vụ giao hàng với chi phí hiệu quả.",
    },
    {
      id: "safe-delivery",
      title: "Vận Chuyển An Toàn",
      description: "Giao hàng đến bất kỳ nơi đâu với chất lượng đảm bảo.",
    },
  ];

  // Job Roles Data
  const jobRolesData = [
    {
      id: "nhan-vien-van-phong",
      title: "Nhân viên văn phòng",
      roles: ["Nhân viên Hành chính kho", "Chuyên viên Đào tạo"],
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/494e0269a78ee5656b3ea72de4809592310766624f2e4bce46dd3a730f6df377",
    },
    {
      id: "trung-tam-cong-nghe",
      title: "Trung tâm công nghệ",
      roles: ["Java Developer", "Data Scientist"],
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/d216ddc5022a32c3f04229c740815e9e9c5003f9397c1cd0be49cbe5ccea0cd6",
    },
    {
      id: "nhan-vien-van-hanh",
      title: "Nhân viên vận hành",
      roles: ["Nhân viên Bưu cục", "Giám sát Kho vận"],
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/7bbd21615b0b97711e3084f59325cecc832497e7f733ebaf0ee900d514f743ac",
    },
    {
      id: "nhan-vien-lay-giao-tai-xe",
      title: "Nhân viên lấy giao, tài xế",
      roles: ["Giám sát Xe tải", "Nhân viên giao hàng"],
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/543006c1ed70b70af66b9021927fcee73a2db9240e17b821df89a3ab73376147",
    },
  ];

  const openLoginPopup = () => {
    setIsLoginPopupOpen(true);
  };

  const closeLoginPopup = () => {
    setIsLoginPopupOpen(false);
  };

  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const navigate = useNavigate();

  

  return (
    <div className="home">
      <div className="header">
      <Header
        navigationItems={homeNavigationItems}
        showLoginButton={true}
        onLoginClick={openLoginPopup}
      />
      </div>

      {/* Banner Section */}
      <div className="banner">
        <div className="banner-slider">
          <button
            className="banner-nav-button prev"
            onClick={prevBanner}
            aria-label="Previous Banner"
          >
            &#10094;
          </button>

          <div className="slides-container">
            {bannerData.map((banner, index) => {
              let slideClass = "banner-slide";

              if (index === currentBannerIndex) {
                slideClass += " active";
              } else if (
                (direction === "left" &&
                  index ===
                    (currentBannerIndex - 1 + bannerData.length) %
                      bannerData.length) ||
                (direction === "right" &&
                  index === (currentBannerIndex + 1) % bannerData.length)
              ) {
                slideClass += " prev";
              }

              return (
                <div key={index} className={slideClass}>
                  <img
                    src={banner.image}
                    alt={banner.title}
                    onError={(e) => {
                      e.target.src = "path/to/default/image.jpg";
                    }}
                  />
                  <div className="banner-overlay">
                    <h1>{banner.title}</h1>
                    <p>{banner.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            className="banner-nav-button next"
            onClick={nextBanner}
            aria-label="Next Banner"
          >
            &#10095;
          </button>
        </div>

        <div className="banner-dots">
          {bannerData.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentBannerIndex ? "active" : ""}`}
              onClick={() => goToBanner(index)}
              aria-label={`Go to banner ${index + 1}`}
            ></span>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <section className="services">
        <h2>Dịch Vụ Của Chúng Tôi</h2>
        <div className="service-list">
          {servicesData.map((service) => (
            <button
              key={service.id}
              className="service-item"
              onClick={() => navigate(`/service/${service.id}`)}
            >
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Core Values Section */}
      <section className="container">
        <div className="valuesGrid">
          <article className="valueColumn">
            <div className="valueContent">
              <h1 className="mainTitle">EcoShipper</h1>
              <h2 className="sectionTitle">Young</h2>
              <p className="paragraph">
                EcoShipper tin rằng những người trẻ, không có kinh nghiệm sẽ
                tiếp thu và học hỏi nhanh. Không bị gò bó với khuôn mẫu cũ cũng
                khiến tư duy sáng tạo được phát triển. Trẻ cũng khiến con người
                dấn thân, xông xáo hơn, không ngại thử thách mình với nhiệm vụ
                mới.
              </p>
            </div>
          </article>

          <article className="secondColumn">
            <div className="secondContent">
              <h2 className="smartTitle">Smart</h2>
              <p className="paragraph">
                Sự thông minh và nhạy bén trong tư duy xử lý các tình huống bất
                ngờ luôn là yếu tố rất được đề cao. EcoShipper cam kết tạo nên
                không gian làm việc độc lập và sáng tạo, con người sử dụng máy
                móc để học hỏi và nâng cao trải nghiệm chứ không thể bị máy móc
                chi phối.
              </p>
            </div>
          </article>

          <article className="thirdColumn">
            <div className="thirdContent">
              <h2 className="toughTitle">Tough but Fair</h2>
              <p className="paragraph">
                Diễn biến nhanh chóng cùng những thay đổi linh hoạt tại
                EcoShipper đã tạo nên môi trường đầy khó khăn và thách thức,
                thành quả mà mỗi EcoShipper-er tạo ra là những giá trị chân thực
                và tức thời được mọi người công nhận và vinh danh.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="jobs-section">
        <div className="container">
          <h1>
            Mỗi cá nhân được trao quyền làm việc độc lập trong môi trường khuyến
            khích tự chủ và sáng tạo
          </h1>
          <div className="jobs-grid">
            {jobRolesData.map((job, index) => (
              <article
                key={index}
                className="job-column"
                onClick={() => navigate(`/job/${job.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="job-card">
                  <h2 className="job-title">{job.title}</h2>
                  {job.roles.map((role, roleIndex) => (
                    <p key={roleIndex} className="job-text">
                      {role}
                    </p>
                  ))}
                  <img
                    loading="lazy"
                    src={job.icon}
                    className="job-card-image"
                    alt={`${job.title} icon`}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
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
      <ChatPopup />
      <Footer showAccountSection={true} onLoginClick={openLoginPopup} />
    </div>
  );
};

export default Home;