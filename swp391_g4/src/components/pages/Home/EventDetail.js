import React from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../../../styles/EventDetail.css';


const EventDetail = () => {
  const { eventId } = useParams(); // Lấy ID sự kiện từ URL
  const navigate = useNavigate();

  // Dữ liệu sự kiện
  const events = {
    1: {
      title: 'Khai trương chi nhánh EcoShipper tại Hà Nội',
      description: `
        EcoShipper chính thức khai trương chi nhánh mới tại Hà Nội, với đội ngũ shipper chuyên nghiệp và hệ thống kho bãi hiện đại.
        Chi nhánh này sẽ đáp ứng nhu cầu giao nhận hàng hóa nội khu, đặc biệt là tại các quận trung tâm như Quận Ba Đình, Quận Hoàng Mai.
        Hội thảo cũng đã thu hút sự tham gia của các đối tác và nhà cung cấp công nghệ, nơi các giải pháp sáng tạo như sử dụng AI và dữ liệu lớn để tối ưu hóa lộ trình giao hàng được trình bày chi tiết. Các chuyên gia nhấn mạnh tầm quan trọng của việc áp dụng công nghệ vào quy trình điều phối để giảm thiểu thời gian chờ đợi và chi phí vận hành. Một trong những sáng kiến đáng chú ý là việc tích hợp hệ thống theo dõi đơn hàng theo thời gian thực, giúp khách hàng có thể dễ dàng kiểm soát tình trạng giao hàng. Đồng thời, nhiều phương án để cải thiện đội ngũ giao hàng, nâng cao hiệu quả công việc của nhân viên cũng được đề xuất nhằm tạo ra một hệ thống giao nhận nhanh chóng và hiệu quả hơn.
      `,
      image: 'https://thietbidungcubuffet.com/images/tin-tuc/cau-chuc-khai-truong-nha-h%C3%A0ng.jpg',
    },
    2: {
      title: 'Hội thảo: Tối ưu giao nhận trong nội khu',
      description: `
        Hội thảo được tổ chức ngày 15/03/2024 tại Quận Hoàng Mai, với mục tiêu cải tiến và tối ưu các tuyến đường giao hàng nội khu.
        Nhiều chuyên gia đã chia sẻ về các phương pháp điều phối và ứng dụng công nghệ trong giao hàng nhanh.
        Các chuyên gia nhấn mạnh việc áp dụng công nghệ vào quy trình điều phối để tối ưu hóa các tuyến đường và giảm thiểu thời gian giao hàng. Ngoài ra, các giải pháp sử dụng dữ liệu lớn cũng giúp phân tích và dự đoán xu hướng giao nhận, từ đó tăng cường hiệu quả và giảm chi phí.
      `,
      image: 'https://dntt.mediacdn.vn/197608888129458176/2020/12/22/cns-1608623491956-16086234920821602536956.jpg',
    },
    3: {
      title: 'EcoShipper hỗ trợ giao hàng miễn phí cho các tiểu thương',
      description: `
        Chương trình đặc biệt diễn ra từ ngày 25/01/2025 đến ngày 30/01/2025, hỗ trợ các tiểu thương giao hàng miễn phí trong nội khu.
        Sáng kiến này giúp các cửa hàng nhỏ tại Quận 5 và Quận Tân Bình tiết kiệm chi phí và nâng cao hiệu quả kinh doanh.
        Chương trình nhận được sự ủng hộ nồng nhiệt từ cộng đồng các tiểu thương, vì đây là cơ hội giúp họ gia tăng khả năng cạnh tranh trên thị trường, đồng thời nâng cao chất lượng dịch vụ giao hàng.
      `,
      image: 'https://stdvietnam.vn/FileUpload/Images/mien_phi_nhu_khong.jpg',
    },
    4: {
      title: 'Chương trình "1 giờ giao hàng nội khu"',
      description: `
        EcoShipper ra mắt dịch vụ mới "Giao hàng trong 1 giờ" tại các khu vực trung tâm TP.HCM.
        Dịch vụ này cam kết giao hàng nhanh chóng, đảm bảo đáp ứng nhu cầu khẩn cấp của khách hàng trong nội khu.
        Dịch vụ này là một phần trong chiến lược phát triển của EcoShipper nhằm không ngừng cải tiến chất lượng và tốc độ giao hàng, tạo ra sự khác biệt so với các đối thủ cạnh tranh.
      `,
      image: 'https://xwatch.vn/upload_images/images/2023/01/11/1-ngay-co-bao-nhieu-gio-phut-giay.jpg',
    },
    5: {
      title: 'Trao thưởng cho Shipper xuất sắc tháng 1',
      description: `
        Vào cuối tháng 1, EcoShipper đã tổ chức lễ trao thưởng cho các shipper xuất sắc nhất tại Hà Nội.
        Chương trình nhằm ghi nhận những đóng góp và nỗ lực của đội ngũ shipper trong việc giao hàng nội khu nhanh và hiệu quả.
        Sự kiện này cũng là cơ hội để các shipper giao lưu, chia sẻ kinh nghiệm và cùng nhau nâng cao chất lượng công việc, đồng thời tạo động lực để tất cả nhân viên không ngừng cố gắng hoàn thiện bản thân.
      `,
      image: 'https://img.freepik.com/free-psd/3d-illustration-with-awards-sales-podium_23-2151262579.jpg',
    },
    6: {
      title: 'Ứng dụng xe đạp điện thân thiện môi trường',
      description: `
        EcoShipper tiên phong triển khai đội xe đạp điện tại các quận trung tâm.
        Sáng kiến này không chỉ giúp giảm thiểu khí thải mà còn mang lại tốc độ giao hàng nhanh và hiệu quả.
        Việc sử dụng xe đạp điện cũng giúp giảm tải cho giao thông thành phố, đồng thời khuyến khích các shipper sử dụng phương tiện giao thông xanh, bảo vệ môi trường.
      `,
      image: 'https://i.pinimg.com/originals/90/98/8a/90988a283f78e68a9349694554bc2d52.jpg',
    },
  };


  const event = events[eventId];

  // Kiểm tra nếu không tìm thấy sự kiện
  if (!event) {
    return (
      <div className="event-detail">
        <h2>Không tìm thấy sự kiện</h2>
        {/* <button onClick={() => navigate('/news')}>Quay lại trang Tin tức</button> */}
      </div>
    );
  }



  const relatedArticles = [
    {
      title: 'Khai trương chi nhánh EcoShipper tại Hà Nội',
      path: '/news/1',
      image: 'https://thietbidungcubuffet.com/images/tin-tuc/cau-chuc-khai-truong-nha-h%C3%A0ng.jpg',
    },
    {
      title: 'Hội thảo: Tối ưu giao nhận trong nội khu',
      path: '/news/2',
      image: 'https://dntt.mediacdn.vn/197608888129458176/2020/12/22/cns-1608623491956-16086234920821602536956.jpg',
    },
    {
      title: 'EcoShipper hỗ trợ giao hàng miễn phí cho các tiểu thương',
      path: '/news/3',
      image: 'https://stdvietnam.vn/FileUpload/Images/mien_phi_nhu_khong.jpg',
    },
    {
      title: 'Chương trình "1 giờ giao hàng nội khu"',
      path: '/news/4',
      image: 'https://xwatch.vn/upload_images/images/2023/01/11/1-ngay-co-bao-nhieu-gio-phut-giay.jpg',
    },
    {
      title: 'Trao thưởng cho Shipper xuất sắc tháng 1',
      path: '/news/5',
      image: 'https://img.freepik.com/free-psd/3d-illustration-with-awards-sales-podium_23-2151262579.jpg',
    },
    {
      title: 'Ứng dụng xe đạp điện thân thiện môi trường',
      path: '/news/6',
      image: 'https://i.pinimg.com/originals/90/98/8a/90988a283f78e68a9349694554bc2d52.jpg',
    },
  ];
  

  const filteredArticles = relatedArticles.filter(article => article.path !== `/news/${eventId}`);


  return (
    <div className="event-detail">
      <button className="back-button" onClick={() => navigate('/news')}>Quay lại</button>
      <h1>{event.title}</h1>
      <img src={event.image} alt={event.title} className="event-image" />
      <p>{event.description}</p>

      <h2>Bài viết khác</h2>
      <div className="related-articles">
        {relatedArticles.map((article, index) => (
          <div className="related-article-item" key={index}>
            <Link to={article.path}>
              <img src={article.image} alt={article.title} className="related-article-image" />
              <h3>{article.title}</h3>
            </Link>
          </div>
        ))}
      </div>



    </div>
  );
};

export default EventDetail;
