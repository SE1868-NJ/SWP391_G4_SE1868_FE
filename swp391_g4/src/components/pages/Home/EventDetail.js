import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EventDetail = () => {
const { eventId } = useParams(); // Lấy ID sự kiện từ URL
const navigate = useNavigate();


  const events = {
    1: {
      title: 'Khai trương chi nhánh EcoShipper tại Hà Nội',
      description: `
        EcoShipper chính thức khai trương chi nhánh mới tại TP.HCM, với đội ngũ shipper chuyên nghiệp và hệ thống kho bãi hiện đại.
        Chi nhánh này sẽ đáp ứng nhu cầu giao nhận hàng hóa nội khu, đặc biệt là tại các quận trung tâm như Quận Ba Đình, Quận Hoàng Mai.
      `,
      image: 'https://thietbidungcubuffet.com/images/tin-tuc/cau-chuc-khai-truong-nha-h%C3%A0ng.jpg',
    },
    2: {
      title: 'Hội thảo: Tối ưu giao nhận trong nội khu',
      description: `
        Hội thảo được tổ chức ngày 15/03/2024 tại Quận Hoàng Mai, với mục tiêu cải tiến và tối ưu các tuyến đường giao hàng nội khu.
        Nhiều chuyên gia đã chia sẻ về các phương pháp điều phối và ứng dụng công nghệ trong giao hàng nhanh.
      `,
      image: 'https://dntt.mediacdn.vn/197608888129458176/2020/12/22/cns-1608623491956-16086234920821602536956.jpg',
    },
    3: {
      title: 'EcoShipper hỗ trợ giao hàng miễn phí cho các tiểu thương',
      description: `
        Chương trình đặc biệt diễn ra từ ngày 25/01/2025 đến ngày 30/01/2025, hỗ trợ các tiểu thương giao hàng miễn phí trong nội khu.
        Sáng kiến này giúp các cửa hàng nhỏ tại Quận 5 và Quận Tân Bình tiết kiệm chi phí và nâng cao hiệu quả kinh doanh.
      `,
      image: 'https://stdvietnam.vn/FileUpload/Images/mien_phi_nhu_khong.jpg',
    },
    4: {
      title: 'Chương trình "1 giờ giao hàng nội khu"',
      description: `
        EcoShipper ra mắt dịch vụ mới "Giao hàng trong 1 giờ" tại các khu vực trung tâm TP.HCM. 
        Dịch vụ này cam kết giao hàng nhanh chóng, đảm bảo đáp ứng nhu cầu khẩn cấp của khách hàng trong nội khu.
      `,
      image: 'https://xwatch.vn/upload_images/images/2023/01/11/1-ngay-co-bao-nhieu-gio-phut-giay.jpg',
    },
    5: {
      title: 'Trao thưởng cho Shipper xuất sắc tháng 1',
      description: `
        Vào cuối tháng 1, EcoShipper đã tổ chức lễ trao thưởng cho các shipper xuất sắc nhất tại Hà Nội. 
        Chương trình nhằm ghi nhận những đóng góp và nỗ lực của đội ngũ shipper trong việc giao hàng nội khu nhanh và hiệu quả.
      `,
      image: 'https://img.freepik.com/free-psd/3d-illustration-with-awards-sales-podium_23-2151262579.jpg',
    },
    6: {
      title: 'Ứng dụng xe đạp điện thân thiện môi trường',
      description: `
        EcoShipper tiên phong triển khai đội xe đạp điện tại các quận trung tâm. 
        Sáng kiến này không chỉ giúp giảm thiểu khí thải mà còn mang lại tốc độ giao hàng nhanh và hiệu quả.
      `,
      image: 'https://i.pinimg.com/originals/90/98/8a/90988a283f78e68a9349694554bc2d52.jpg',
    },
  };
  

  const event = events[eventId];

  if (!event) {
    return (
      <div className="event-detail">
        <h2>Không tìm thấy sự kiện</h2>
        <button onClick={() => navigate('/news')}>Quay lại trang Tin tức</button>
      </div>
    );
  }

  return (
    <div className="event-detail">
      <button className="back-button" onClick={() => navigate('/news')}>Quay lại</button>
      <h1>{event.title}</h1>
      <img src={event.image} alt={event.title} className="event-image" />
      <p>{event.description}</p>
    </div>
  );
};

export default EventDetail;
