import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ActivityDetail = () => {
  const { activityId } = useParams(); // Lấy ID hoạt động từ URL
  const navigate = useNavigate();


  const activities = [
    {
      title: 'Chương trình thiện nguyện "Tết yêu thương"',
      description: 'EcoShipper phối hợp cùng các tổ chức từ thiện và tình nguyện viên để mang đến những món quà Tết ấm áp cho các gia đình khó khăn tại vùng sâu, vùng xa. Mỗi phần quà bao gồm thực phẩm thiết yếu như gạo, mắm, dầu ăn, kèm theo các vật dụng cần thiết như chăn ấm, áo mới, và một số món quà tinh thần như thiệp chúc Tết, giúp mang lại niềm vui cho những người dân nghèo không có điều kiện đón Tết. Chương trình này không chỉ giúp các gia đình có thêm niềm vui trong mùa xuân mà còn thể hiện tinh thần tương thân tương ái, sẻ chia với những hoàn cảnh khó khăn. Mỗi năm, chương trình thu hút sự tham gia của hàng nghìn tình nguyện viên từ các tổ chức cộng đồng và đội ngũ nhân viên EcoShipper.',
      image: 'https://media.vietnamplus.vn/images/c14f6479e83e315b4cf3a2906cc6a51e8c0218388a4fa14bb99ff693072eeaaa3140efc03a1d1799838b71e0b417720205720abe0655a383a80f69e89e8e18ddb81cc02e8ad39d0721b4417e86f96300/lich-nghi-tet-2-6526.jpg.webp',
      link: '/activities/1'
    },
    {
      title: 'EcoShipper trồng cây xanh tại khu dân cư',
      description: 'Trong chiến dịch bảo vệ môi trường, EcoShipper đã triển khai một chương trình trồng cây xanh tại các khu đô thị, đặc biệt tại những khu vực có mật độ dân số cao và ô nhiễm không khí nghiêm trọng như Quận 1 và Quận 3. Chương trình nhằm cải thiện chất lượng không khí, giảm thiểu tình trạng ô nhiễm môi trường, đồng thời tạo ra không gian sống trong lành, dễ chịu cho cư dân. Những cây xanh không chỉ góp phần vào việc làm đẹp cảnh quan thành phố mà còn giúp hạ nhiệt độ môi trường và cung cấp bóng mát cho người dân. Các tình nguyện viên của EcoShipper đã tích cực tham gia vào quá trình trồng cây và chăm sóc cây xanh sau khi trồng. Đây là một hoạt động có ý nghĩa lớn, thể hiện trách nhiệm của EcoShipper đối với cộng đồng và môi trường sống.',
      image: 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/07/anh-cay-xanh.jpg',
      link: '/activities/2'
    },
    {
      title: 'Chương trình học bổng cho trẻ em nghèo',
      description: 'EcoShipper cam kết hỗ trợ giáo dục cho trẻ em nghèo tại các vùng khó khăn thông qua chương trình học bổng. Mỗi học bổng không chỉ là một khoản tiền mà còn bao gồm các dụng cụ học tập cần thiết như sách vở, cặp sách, và các trang thiết bị học tập khác. Chương trình này nhằm giúp các em có thể tiếp cận với nền giáo dục chất lượng hơn và có cơ hội thay đổi tương lai của mình. Trong suốt các năm qua, chương trình đã giúp đỡ hàng nghìn em học sinh có hoàn cảnh khó khăn, tạo động lực cho các em vươn lên trong học tập, từ đó phá vỡ vòng luẩn quẩn của nghèo đói. Ngoài học bổng, EcoShipper còn tổ chức các buổi giao lưu, trao đổi và tặng quà cho các em, tạo cơ hội để các em được hòa nhập với cộng đồng và phát triển kỹ năng sống.',
      image: 'https://kfo.edu.vn/wp-content/uploads/2023/03/hoc-bong-toan-phan-11.jpg',
      link: '/activities/3'
    },
    {
      title: 'Chiến dịch dọn dẹp môi trường',
      description: 'Trong nỗ lực nâng cao nhận thức cộng đồng về bảo vệ môi trường, EcoShipper đã tổ chức chiến dịch dọn dẹp rác thải tại các khu vực công cộng, đặc biệt là những nơi đông dân cư như các công viên, bãi biển và các khu phố trung tâm. Chiến dịch này không chỉ nhằm mục đích làm sạch môi trường mà còn nâng cao ý thức của người dân về việc bảo vệ không gian sống chung. EcoShipper đã phối hợp với nhiều tổ chức cộng đồng và các nhóm tình nguyện để thu gom rác thải, phân loại rác, tái chế và tuyên truyền về thói quen vứt rác đúng nơi quy định. Chương trình thu hút sự tham gia của hàng trăm tình nguyện viên và người dân, tạo ra một cộng đồng cùng chung tay bảo vệ môi trường sống xanh, sạch, đẹp.',
      image: 'https://biogency.com.vn/wp-content/uploads/2022/06/tinh-trang-o-nhiem-moi-truong-dang-o-muc-bao-dong-tren-khap-toan-cau.jpg',
      link: '/activities/4'
    },
    {
      title: 'Chiến dịch hiến máu nhân đạo',
      description: 'Nhằm hỗ trợ những bệnh nhân cần truyền máu, EcoShipper đã tổ chức các buổi hiến máu nhân đạo, khuyến khích nhân viên và cộng đồng tham gia vào hoạt động này. Các chiến dịch hiến máu được tổ chức định kỳ tại các văn phòng của EcoShipper và tại các bệnh viện, nơi bệnh nhân cần máu để duy trì sự sống. Mỗi giọt máu hiến tặng có thể cứu sống nhiều người, và chiến dịch này đã góp phần không nhỏ vào việc cung cấp nguồn máu dự trữ cho các bệnh viện. Đặc biệt, các chương trình này cũng giúp nâng cao tinh thần cộng đồng, khuyến khích mọi người cùng chung tay vì một xã hội khỏe mạnh, hạnh phúc hơn.',
      image: 'https://karaoke.com.vn/wp-content/uploads/2020/02/Hi%E1%BA%BFn-m%C3%A1u.jpg',
      link: '/activities/5'
    },
    {
      title: 'Chương trình hỗ trợ người vô gia cư',
      description: 'Chương trình phát cơm và quần áo ấm cho người vô gia cư của EcoShipper nhằm giúp những người không nơi trú ẩn vượt qua mùa đông lạnh giá. Chương trình được triển khai tại các thành phố lớn như Hà Nội và TP.HCM, nơi có số lượng người vô gia cư lớn. Mỗi buổi phát quà gồm những suất cơm nóng hổi, áo ấm, chăn mền, và một số vật dụng thiết yếu để giúp họ duy trì sự sống trong thời tiết lạnh giá. Đây là một hoạt động nhân đạo, thể hiện sự quan tâm và lòng nhân ái của EcoShipper đối với những người có hoàn cảnh khó khăn, đồng thời cũng kêu gọi cộng đồng chung tay hỗ trợ những người vô gia cư để họ không cảm thấy cô đơn trong xã hội.',
      image: 'https://media.istockphoto.com/id/1569228589/vi/vec-to/2306-m10-s-st-t%E1%BB%AB-thi%E1%BB%87n-cho-ng%C6%B0%E1%BB%9Di-v%C3%B4-gia-c%C6%B0-phim-ho%E1%BA%A1t-h%C3%ACnh-gi%C3%BAp-%C4%91%E1%BB%A1-nh%C3%A2n-%C4%91%E1%BA%A1o-v%C3%A0-h%E1%BB%97-tr%E1%BB%A3-ng%C6%B0%E1%BB%9Di.jpg?s=612x612&w=0&k=20&c=0ThgrKEp_K1eYOEEW9Mz0A372a45AzgZngE4oUF0eNE=',
      link: '/activities/6'
    }
  ];
  


  const ReplatedActivities = [
    {
      title: 'Chương trình thiện nguyện "Tết yêu thương"',
      description: 'EcoShipper phối hợp cùng các tổ chức từ thiện và tình nguyện viên để mang đến những món quà Tết ấm áp cho các gia đình khó khăn tại vùng sâu, vùng xa...',
      image: 'https://media.vietnamplus.vn/images/c14f6479e83e315b4cf3a2906cc6a51e8c0218388a4fa14bb99ff693072eeaaa3140efc03a1d1799838b71e0b417720205720abe0655a383a80f69e89e8e18ddb81cc02e8ad39d0721b4417e86f96300/lich-nghi-tet-2-6526.jpg.webp',
      link: '/activities/1'
    },
    {
      title: 'EcoShipper trồng cây xanh tại khu dân cư',
      description: 'Trong chiến dịch bảo vệ môi trường, EcoShipper đã triển khai một chương trình trồng cây xanh tại các khu đô thị...',
      image: 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/07/anh-cay-xanh.jpg',
      link: '/activities/2'
    },
    {
      title: 'Chương trình học bổng cho trẻ em nghèo',
      description: 'EcoShipper cam kết hỗ trợ giáo dục cho trẻ em nghèo tại các vùng khó khăn thông qua chương trình học bổng...',
      image: 'https://kfo.edu.vn/wp-content/uploads/2023/03/hoc-bong-toan-phan-11.jpg',
      link: '/activities/3'
    },
    {
      title: 'Chiến dịch dọn dẹp môi trường',
      description: 'Trong nỗ lực nâng cao nhận thức cộng đồng về bảo vệ môi trường, EcoShipper đã tổ chức chiến dịch dọn dẹp rác thải tại các khu vực công cộng...',
      image: 'https://biogency.com.vn/wp-content/uploads/2022/06/tinh-trang-o-nhiem-moi-truong-dang-o-muc-bao-dong-tren-khap-toan-cau.jpg',
      link: '/activities/4'
    },
    {
      title: 'Chiến dịch hiến máu nhân đạo',
      description: 'Nhằm hỗ trợ những bệnh nhân cần truyền máu, EcoShipper đã tổ chức các buổi hiến máu nhân đạo...',
      image: 'https://karaoke.com.vn/wp-content/uploads/2020/02/Hi%E1%BA%BFn-m%C3%A1u.jpg',
      link: '/activities/5'
    },
    {
      title: 'Chương trình hỗ trợ người vô gia cư',
      description: 'Chương trình phát cơm và quần áo ấm cho người vô gia cư của EcoShipper nhằm giúp những người không nơi trú ẩn vượt qua mùa đông lạnh giá...',
      image: 'https://media.istockphoto.com/id/1569228589/vi/vec-to/2306-m10-s-st-t%E1%BB%AB-thi%E1%BB%87n-cho-ng%C6%B0%E1%BB%9Di-v%C3%B4-gia-c%C6%B0-phim-ho%E1%BA%A1t-h%C3%ACnh-gi%C3%BAp-%C4%91%E1%BB%A1-nh%C3%A2n-%C4%91%E1%BA%A1o-v%C3%A0-h%E1%BB%97-tr%E1%BB%A3-ng%C6%B0%E1%BB%9Di.jpg?s=612x612&w=0&k=20&c=0ThgrKEp_K1eYOEEW9Mz0A372a45AzgZngE4oUF0eNE=',
      link: '/activities/6'
    }
  ];





  const activity = activities[activityId];

  if (!activity) {
    return (
      <div className="activity-detail">
        <h2>Không tìm thấy hoạt động xã hội</h2>
        <button onClick={() => navigate('/activities')}>Quay lại trang Hoạt động xã hội</button>
      </div>
    );
  }


  const relatedActivities = activities.filter(a => a.link !== activity.link);

  return (
    <div className="activity-detail">
      <button className="back-button" onClick={() => navigate('/activities')}>Quay lại</button>
      <h1>{activity.title}</h1>
      <img src={activity.image} alt={activity.title} className="activity-image" />
      <p>{activity.description}</p>

<h2>Các hoạt động xã hội khác</h2>
      <div className="related-activities">
        {relatedActivities.map((act, index) => (
          <div className="related-activity-item" key={index}>
            <Link to={act.link}>
              <img src={act.image} alt={act.title} className="related-activity-image" />
              <h3>{act.title}</h3>
            </Link>
          </div>
        ))}
      </div>


    </div>
  );
};

export default ActivityDetail;