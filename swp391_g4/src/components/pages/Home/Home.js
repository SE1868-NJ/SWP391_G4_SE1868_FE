import React, { useState } from 'react';
import '../../../styles/Home.css';
import { Header } from '../../header/Header';
import Footer from '../../footer/Footer';

const Home = () => {
  const homeNavigationItems = [
    { text: "Trang chủ", path: "/home", isActive: true },
    { text: "Về chúng tôi", path: "/about" },
    { text: "Tin tức", path: "/news" },
    { text: "Liên hệ", path: "/shipper-contact" }
  ];

  const bannerData = [
    {
      image: "https://useless-gold-stingray.myfilebase.com/ipfs/QmeU64hjvd6f4sGADM92sYVUC3m9scfTfVk48aeBkpqbGf",
      title: "GHTK Cùng Quỹ Hy Vọng Xây Cầu Tại Đồng Tháp",
      subtitle: "Cán mốc 400 cây cầu được xây dựng"
    },
    {
      image: "https://useless-gold-stingray.myfilebase.com/ipfs/QmWt3tW6Q4NFWG2iKUUFVH8K2M94ogiY34rZT2Xuf976f5",
      title: "Dịch Vụ Vận Chuyển Chuyên Nghiệp",
      subtitle: "Đảm bảo an toàn và uy tín cho mọi đơn hàng"
    },
    {
      image: "https://useless-gold-stingray.myfilebase.com/ipfs/QmQUTBK6HSgGfvduZ4aSrqkVDNckhiFZsS2E5EbjN5qJcg",
      title: "Phủ Sóng Toàn Quốc",
      subtitle: "Kết nối mọi miền, vận chuyển mọi nơi"
    }
  ];

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const nextBanner = () => {
    setCurrentBannerIndex((prevIndex) => 
      (prevIndex + 1) % bannerData.length
    );
  };

  const prevBanner = () => {
    setCurrentBannerIndex((prevIndex) => 
      (prevIndex - 1 + bannerData.length) % bannerData.length
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
        <button className="banner-nav-button prev" onClick={prevBanner}>&#10094;</button>
        <div className="slides-container">
          {bannerData.map((banner, index) => (
            <div 
              key={index}
              className={`banner ${index === currentBannerIndex ? 'active' : ''}`}
              style={{
                transform: `translateX(${100 * (index - currentBannerIndex)}%)`
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
        className={`dot ${index === currentBannerIndex ? 'active' : ''}`}
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
      <Footer />
    </div>
  );
};

export default Home;