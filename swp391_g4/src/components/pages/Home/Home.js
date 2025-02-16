import React, { useState } from "react";
import "../../../styles/Home.css";
import { Header } from "../../header/Header";
import Footer from "../../footer/Footer";

const Home = () => {
  const homeNavigationItems = [
    { text: "Trang chủ", path: "/home", isActive: true },
    { text: "Về chúng tôi", path: "/about" },
    { text: "Tin tức", path: "/news" },
    { text: "Liên hệ", path: "/shipper-contact" },
  ];

  const bannerData = [
    {
      image:
        "https://useless-gold-stingray.myfilebase.com/ipfs/QmeU64hjvd6f4sGADM92sYVUC3m9scfTfVk48aeBkpqbGf",
      title: "GHTK Cùng Quỹ Hy Vọng Xây Cầu Tại Đồng Tháp",
      subtitle: "Cán mốc 400 cây cầu được xây dựng",
    },
    {
      image:
        "https://useless-gold-stingray.myfilebase.com/ipfs/QmWt3tW6Q4NFWG2iKUUFVH8K2M94ogiY34rZT2Xuf976f5",
      title: "Dịch Vụ Vận Chuyển Chuyên Nghiệp",
      subtitle: "Đảm bảo an toàn và uy tín cho mọi đơn hàng",
    },
    {
      image:
        "https://useless-gold-stingray.myfilebase.com/ipfs/QmQUTBK6HSgGfvduZ4aSrqkVDNckhiFZsS2E5EbjN5qJcg",
      title: "Phủ Sóng Toàn Quốc",
      subtitle: "Kết nối mọi miền, vận chuyển mọi nơi",
    },
  ];

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const nextBanner = () => {
    setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % bannerData.length);
  };

  const prevBanner = () => {
    setCurrentBannerIndex(
      (prevIndex) => (prevIndex - 1 + bannerData.length) % bannerData.length
    );
  };

  const goToBanner = (index) => {
    setCurrentBannerIndex(index);
  };

  return (
    <div className="home">
      <Header navigationItems={homeNavigationItems} />

      {/* Banner Slider */}
      <div className="banner">
        <div className="banner-slider">
          <button className="banner-nav-button prev" onClick={prevBanner}>
            &#10094;
          </button>
          <div className="slides-container">
            {bannerData.map((banner, index) => (
              <div
                key={index}
                className={`banner ${
                  index === currentBannerIndex ? "active" : ""
                }`}
                style={{
                  transform: `translateX(${
                    100 * (index - currentBannerIndex)
                  }%)`,
                }}
              >
                <img src={banner.image} alt={`Banner ${index + 1}`} />
                <div className="banner-overlay">
                  <h1>{banner.title}</h1>
                  <p>{banner.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="banner-dots">
          {bannerData.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentBannerIndex ? "active" : ""}`}
              onClick={() => goToBanner(index)}
            ></span>
          ))}
        </div>

        <button className="banner-nav-button next" onClick={nextBanner}>
          &#10095;
        </button>
      </div>

      {/* Services */}
      <section className="services">
        <h2>Dịch Vụ Của Chúng Tôi</h2>
        <div className="service-list">
          <div className="service-item">
            <h3>Giao Hàng Nhanh Chóng</h3>
            <p>Giao hàng nhanh chóng, tiết kiệm thời gian của bạn.</p>
          </div>
          <div className="service-item">
            <h3>Vận Chuyển Tiết Kiệm</h3>
            <p>Dịch vụ giao hàng với chi phí hiệu quả.</p>
          </div>
          <div className="service-item">
            <h3>Vận Chuyển Quốc Tế</h3>
            <p>Giao hàng đến bất kỳ nơi đâu trên thế giới.</p>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="valuesGrid">
          <article className="valueColumn">
            <div className="valueContent">
              <h1 className="mainTitle">Người GHTK</h1>
              <h2 className="sectionTitle">Young</h2>
              <p className="paragraph">
                GHTK tin rằng những người trẻ, không có kinh nghiệm sẽ tiếp thu
                và học hỏi nhanh. Không bị gò bó với khuôn mẫu cũ cũng khiến tư
                duy sáng tạo được phát triển. Trẻ cũng khiến con người dấn thân,
                xông xáo hơn, không ngại thử thách mình với nhiệm vụ mới.
              </p>
            </div>
          </article>

          <article className="secondColumn">
            <div className="secondContent">
              <h2 className="smartTitle">Smart</h2>
              <p className="paragraph">
                Sự thông minh và nhạy bén trong tư duy xử lý các tình huống bất
                ngờ luôn là yếu tố rất được đề cao. GHTK cam kết tạo nên không
                gian làm việc độc lập và sáng tạo, con người sử dụng máy móc để
                học hỏi và nâng cao trải nghiệm chứ không thể bị máy móc chi
                phối.
              </p>
            </div>
          </article>

          <article className="thirdColumn">
            <div className="thirdContent">
              <h2 className="toughTitle">Tough but Fair</h2>
              <p className="paragraph">
                Diễn biến nhanh chóng cùng những thay đổi linh hoạt tại GHTK đã
                tạo nên môi trường đầy khó khăn và thách thức, thành quả mà mỗi
                GHTK-er tạo ra là những giá trị chân thực và tức thời được mọi
                người công nhận và vinh danh.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="container">
        <div className="jobs-grid" background-color URL={"https://i.pinimg.com/736x/79/a9/11/79a911b32d94771d78aa269a826655f1.jpg"}>
          <article className="job-column first-job-column">
            <div className="job-card">
              <h2 className="job-title">Nhân viên văn phòng</h2>
              <p className="job-text">Nhân viên Hành chính kho</p>
              <div className="job-footer">
                <div className="job-footer-content">
                  <div>
                    <p className="job-footer-text">Chuyên viên Đào tạo</p>
                  </div>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/26a04c21c27e0b97271e9cf0ddf6c7c8164d9c9087456eeba525d5695b1bc552?placeholderIfAbsent=true&apiKey=d3c7d63cc85240fa9b02be10879aea8b"
                    alt=""
                  />
                </div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/494e0269a78ee5656b3ea72de4809592310766624f2e4bce46dd3a730f6df377?placeholderIfAbsent=true&apiKey=d3c7d63cc85240fa9b02be10879aea8b"
                  className="job-card-image"
                  alt=""
                />
              </div>
            </div>
          </article>

          <article className="job-column">
            <div className="job-card">
              <h2 className="job-title">Trung tâm công nghệ</h2>
              <div className="job-footer">
                <div className="job-footer-content">
                  <div>
                    <p className="job-footer-text">Java Developer</p>
                    <p className="job-footer-text">Data Scientist</p>
                  </div>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/78cba487e07efeee6d180405d0b7bded10ec2c18d04137d856093daf50c76694?placeholderIfAbsent=true&apiKey=d3c7d63cc85240fa9b02be10879aea8b"
                    alt=""
                  />
                </div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/d216ddc5022a32c3f04229c740815e9e9c5003f9397c1cd0be49cbe5ccea0cd6?placeholderIfAbsent=true&apiKey=d3c7d63cc85240fa9b02be10879aea8b"
                  className="job-card-image"
                  alt=""
                />
              </div>
            </div>
          </article>

          <article className="job-column">
            <div className="job-card">
              <h2 className="job-title">Nhân viên vận hành</h2>
              <p className="job-text">Nhân viên Bưu cục</p>
              <p className="job-text">Giám sát Kho vận</p>
              <div className="job-footer-content">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b73a2f3472f9c0fab5516728ca0ebc39123b357e9082950a18db590965668314?placeholderIfAbsent=true&apiKey=d3c7d63cc85240fa9b02be10879aea8b"
                  alt=""
                />
              </div>
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/7bbd21615b0b97711e3084f59325cecc832497e7f733ebaf0ee900d514f743ac?placeholderIfAbsent=true&apiKey=d3c7d63cc85240fa9b02be10879aea8b"
                className="job-card-image"
                alt=""
              />
            </div>
          </article>

          <article className="job-column">
            <div className="job-card">
              <h2 className="job-title">Nhân viên lấy giao, tài xế</h2>
              <p className="job-text">Giám sát Xe tải</p>
              <div className="job-footer">
                <div className="job-footer-content">
                  <div>
                    <p className="job-text">Nhân viên giao hàng</p>
                  </div>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/761bfcea9c9cd8aef19389aabfc1f9f96a22c3a9e55b58a2fed886c125386567?placeholderIfAbsent=true&apiKey=d3c7d63cc85240fa9b02be10879aea8b"
                    alt=""
                  />
                </div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/543006c1ed70b70af66b9021927fcee73a2db9240e17b821df89a3ab73376147?placeholderIfAbsent=true&apiKey=d3c7d63cc85240fa9b02be10879aea8b"
                  className="job-card-image"
                  alt=""
                />
              </div>
            </div>
          </article>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
