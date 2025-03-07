"use client";
import React from "react";
import styles from "./Footer.module.css";

export class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAccountSection:
        props.showAccountSection !== undefined
          ? props.showAccountSection
          : true,
    };
    this.openLoginPopup = props.onLoginClick || (() => {});
  }

  toggleLoginPopup = () => {
    this.openLoginPopup();
  };

  // Hàm để thay đổi trạng thái hiển thị phần tài khoản
  showAccountSection = (isShow) => {
    this.setState({ showAccountSection: isShow });
  };

  render() {
    return (
      <footer className={styles.footer}>
        <div
          className={styles.background}
          style={{ backgroundImage: "url('/FrameFooter.png')" }}
        >
          <div className={styles.logoContainer}>
            <img
              loading="lazy"
              src="/EcoShipper_rbg.png"
              className={styles.logo}
              alt="Company logo"
            />
          </div>

          <div className={styles.mainContent}>
            <div className={styles.contentGrid}>
              <div className={styles.leftColumn}>
                <div className={styles.linksContainer}>
                  <div className={styles.linksGrid}>
                    <div className={styles.linkColumn}>
                      <nav className={styles.linkList}>
                        <h3 className={styles.linkHeader}>Giới thiệu</h3>
                        <a href="/about" className={styles.link}>
                          Về chúng tôi
                        </a>
                        <a href="/privacy-policy" className={styles.subLink}>
                          Điều khoản bảo mật
                        </a>
                        <a href="/terms-of-use" className={styles.subLink}>
                          Chính sách sử dụng
                        </a>
                      </nav>
                    </div>

                    {this.state.showAccountSection && (
                      <div className={styles.linkColumn}>
                        <nav className={styles.linkList}>
                          <h3 className={styles.linkHeader}>Tài khoản</h3>
                          <a
                            onClick={this.toggleLoginPopup}
                            className={styles.link}
                            style={{ cursor: "pointer" }}
                          >
                            Đăng nhập
                          </a>
                          <a href="/register" className={styles.subLink}>
                            Đăng kí làm shipper
                          </a>
                          <a href="/forgot-password" className={styles.subLink}>
                            Quên mật khẩu
                          </a>
                        </nav>
                      </div>
                    )}

                    <div className={styles.linkColumn}>
                      <nav className={styles.linkList}>
                        <h3 className={styles.linkHeader}>Tin tức</h3>
                        <a href="/news" className={styles.link}>
                          Sự kiện và tin tức
                        </a>
                        <a href="/news" className={styles.subLink}>
                          Hoạt động xã hội
                        </a>
                        <a href="/manage-shipper" className={styles.subLink}>
                          Admin
                        </a>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.rightColumn}>
                <div className={styles.contactContainer}>
                  <div className={styles.contactGrid}>
                    <div className={styles.contactInfo}>
                      <h3 className={styles.linkHeader}>Liên hệ</h3>
                      <div className={styles.socialContainer}>
                        <div className={styles.socialIcons}>
                          {[
                            "3e31ebef5f0b9660b20febcaecd6bf713524e7fbcd3cc4aa12f5c09e7643fb93",
                            "755d08d07d7a26ee76cc0ae58d1a350d92c916f22003ffdd6152df23601d7c0b",
                            "ea796d750d724eedbff71c3a1afe5887bf5ba0b90c3d716be09d49bb0c90937e",
                            "1837784e92f00502fc2ebdf6730e1238018d6c66a47e01d7a542239a5887ca6e",
                            "56ffa402fdd272c2d5a8288d1ff83e769899001cf2941e2a7a99448cf0417470",
                          ].map((id, index) => (
                            <img
                              key={index}
                              loading="lazy"
                              src={`https://cdn.builder.io/api/v1/image/assets/TEMP/${id}`}
                              className={styles.socialIcon}
                              alt={`Social media icon ${index + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className={styles.hotline}>Hotline</p>
                      <div className={styles.phoneContainer}>
                        <img
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/59f259ef679a40733cef0f6d3efeecf17b08ce3b46b368b19dddc8554b0b0b84"
                          className={styles.phoneIcon}
                          alt="Phone icon"
                        />
                        <p className={styles.phoneNumber}>091954393</p>
                      </div>
                    </div>

                    <div className={styles.supportContainer}>
                      <div className={styles.chatContainer}>
                        <a
                          href="/shipper-contact"
                          className={styles.chatButton}
                        >
                          <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/0a48f1a0153bf384238bdf10b2bf8e020d7bbdbd5222247288ca55cd87776731"
                            className={styles.chatIcon}
                            alt="Chat icon"
                          />
                          Liên hệ
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className={styles.emailContainer}>
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/e7240f862ff3f45212d69f50d8a6cd6bfa26416a2bf48358b78e9c9d73f39360"
                      className={styles.emailIcon}
                      alt="Email icon"
                    />
                    <a
                      href="mailto:ecoshipper2004@gmail.com"
                      className={styles.emailText}
                    >
                      ecoshipper2004@gmail.com
                    </a>
                  </div>

                  <div className={styles.addressContainer}>
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/aced43e5e40be842b15c9fd26d0d2e3ea3809b47c911492455075e13b477f6fb"
                      className={styles.addressIcon}
                      alt="Address icon"
                    />
                    <address className={styles.addressText}>
                      Trường Đại Học FPT, Hoà Lạc, Thạch Thất, Hà Nội
                    </address>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
