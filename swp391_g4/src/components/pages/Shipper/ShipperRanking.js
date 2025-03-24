import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import Header from "../../header/Header";
import Footer from "../../footer/Footer";
import "../../../styles/ShipperRanking.css";
import {
  FaTrophy,
  FaMedal,
  FaStar,
  FaShippingFast,
  FaChartLine,
  FaQuestionCircle,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaStarHalfAlt,
} from "react-icons/fa";

const ShipperRanking = () => {
  const [rankings, setRankings] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "yyyy-MM")
  );
  const [loading, setLoading] = useState(true);
  const [myRanking, setMyRanking] = useState(null);
  const [showRules, setShowRules] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  const fetchRankings = async () => {
    try {
      const token = localStorage.getItem("token");
      const shipperId = localStorage.getItem("shipperId");
      if (!token) {
        console.error("Không tìm thấy token xác thực");
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/shippers/rankings/calculate`,
        {
          params: {
            month: selectedMonth,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRankings(response.data);

      // Tìm xếp hạng của mình
      const myRank = response.data.find(
        (shipper) => shipper.ShipperID === parseInt(shipperId)
      );
      setMyRanking(myRank);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching rankings:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, [selectedMonth]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const getPrize = (rank) => {
    switch (rank) {
      case 1:
        return {
          icon: <FaTrophy className="prize-icon gold" />,
          title: "Giải Nhất",
          prize: "5.000.000đ",
          description: "Bằng khen thưởng",
        };
      case 2:
        return {
          icon: <FaMedal className="prize-icon silver" />,
          title: "Giải Nhì",
          prize: "3.000.000đ",
          description: "Bằng khen thưởng",
        };
      case 3:
        return {
          icon: <FaMedal className="prize-icon bronze" />,
          title: "Giải Ba",
          prize: "1.500.000đ",
          description: "Bằng khen thưởng",
        };
      case 4:
        return {
          icon: <FaTrophy className="prize-icon" />,
          title: "Giải Khuyến Khích",
          prize: "500.000đ",
          description: "Bằng khen thưởng",
        };
      default:
        return {
          icon: <FaTrophy className="prize-icon" />,
          title: `Giải ${rank}`,
          prize: "Bằng khen thưởng",
          description: "Chứng nhận tham gia",
        };
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FaTrophy className="rank-icon gold" />;
      case 2:
        return <FaMedal className="rank-icon silver" />;
      case 3:
        return <FaMedal className="rank-icon bronze" />;
      default:
        return <FaChartLine className="rank-icon" />;
    }
  };

  // Tính toán phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = rankings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(rankings.length / itemsPerPage);

  // Xử lý chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset về trang 1 khi thay đổi tháng
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonth]);

  return (
    <div className="shipper-ranking">
      <div className="shipper-ranking-header">
        <Header />
      </div>
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="ranking-title w-100 text-center" style={{marginTop: "45px"}}>
            Bảng Xếp Hạng Shipper
          </h2>
          <button
            className="rules-button"
            onClick={() => setShowRules(true)}
            title="Thể lệ chương trình"
          >
            <FaQuestionCircle />
          </button>
        </div>

        {myRanking && (
          <div className="my-ranking-card mb-4">
            <div className="my-ranking-content">
              <div className="my-ranking-info">
                <h4>Xếp Hạng Của Bạn</h4>
                <div className="d-flex align-items-center">
                  {getRankIcon(
                    rankings.findIndex(
                      (s) => s.ShipperID === myRanking.ShipperID
                    ) + 1
                  )}
                  <span className="ms-2">
                    Hạng{" "}
                    {rankings.findIndex(
                      (s) => s.ShipperID === myRanking.ShipperID
                    ) + 1}
                  </span>
                </div>
                <div className="my-ranking-stats">
                  <div className="stat-item">
                    <FaShippingFast className="stat-icon" />
                    <span>
                      {myRanking.SuccessfulOrders || 0} đơn thành công
                    </span>
                  </div>
                  <div className="stat-item">
                    <FaStar className="stat-icon" />
                    <span>{myRanking.RatingPoints || 0} điểm đánh giá</span>
                  </div>
                  <div className="stat-item">
                    <FaChartLine className="stat-icon" />
                    <span>{myRanking.TotalPoints || 0} tổng điểm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-md-8">
            <div className="card ranking-card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Xếp Hạng Theo Tháng</h5>
                <input
                  type="month"
                  className="form-control w-auto"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                />
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="text-center">Đang tải dữ liệu...</div>
                ) : (
                  <>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Hạng</th>
                            <th>Tên Shipper</th>
                            <th>Số Đơn Thành Công</th>
                            <th>Điểm Đánh Giá</th>
                            <th>Tổng Điểm</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.map((shipper, index) => (
                            <tr
                              key={shipper.ShipperID}
                              className={
                                shipper.ShipperID === myRanking?.ShipperID
                                  ? "my-rank-row"
                                  : ""
                              }
                            >
                              <td>
                                <div className="d-flex align-items-center">
                                  {getRankIcon(indexOfFirstItem + index + 1)}
                                  <span className="ms-2">
                                    {indexOfFirstItem + index + 1}
                                  </span>
                                </div>
                              </td>
                              <td>{shipper.FullName}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <FaShippingFast className="me-2" />
                                  {shipper.SuccessfulOrders || 0}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <FaStar className="me-2" />
                                  {shipper.RatingPoints || 0}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <FaChartLine className="me-2" />
                                  {shipper.TotalPoints || 0}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Phân trang */}
                    {totalPages > 1 && (
                      <div className="pagination-container">
                        <button
                          className="pagination-button"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <FaChevronLeft />
                        </button>

                        {[...Array(totalPages)].map((_, index) => (
                          <button
                            key={index + 1}
                            className={`pagination-button ${
                              currentPage === index + 1 ? "active" : ""
                            }`}
                            onClick={() => handlePageChange(index + 1)}
                          >
                            {index + 1}
                          </button>
                        ))}

                        <button
                          className="pagination-button"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <FaChevronRight />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card prize-card">
              <div className="card-header">
                <h5 className="mb-0">Thông Tin Giải Thưởng</h5>
              </div>
              <div className="card-body">
                {[1, 2, 3, 4].map((rank) => {
                  const prize = getPrize(rank);
                  return (
                    <div key={rank} className="prize-item mb-3">
                      <div className="prize-header">
                        {prize.icon}
                        <h6 className="prize-title">{prize.title}</h6>
                      </div>
                      <p className="prize-amount">{prize.prize}</p>
                      <p className="prize-description">{prize.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Modal Thể lệ chương trình */}
      {showRules && (
        <div className="rules-modal">
          <div className="rules-modal-content">
            <div className="rules-modal-header">
              <h3>Thể Lệ Chương Trình</h3>
              <button
                className="close-button"
                onClick={() => setShowRules(false)}
              >
                ×
              </button>
            </div>
            <div className="rules-modal-body">
              <h4>Cách Tính Điểm</h4>
              <ul>
                <li>
                  <FaShippingFast className="rule-icon" />
                  <span>10 điểm cho mỗi đơn hàng giao thành công</span>
                </li>
                <li>
                  <FaStar className="rule-icon" />
                  <span>3 điểm cho mỗi đánh giá 5 sao</span>
                </li>
                <li>
                  <FaStar className="rule-icon" />
                  <span>2 điểm cho mỗi đánh giá 4 sao</span>
                </li>
              </ul>

              <h4>Giải Thưởng</h4>
              <div className="prizes-list">
                {[1, 2, 3, 4].map((rank) => {
                  const prize = getPrize(rank);
                  return (
                    <div key={rank} className="prize-rule-item">
                      <div className="prize-rule-header">
                        {prize.icon}
                        <h5>{prize.title}</h5>
                      </div>
                      <p className="prize-rule-amount">{prize.prize}</p>
                      <p className="prize-rule-description">
                        {prize.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <h4>Lưu Ý</h4>
              <ul>
                <li>Xếp hạng được tính theo tháng</li>
                <li>Chỉ tính điểm cho các đơn hàng đã hoàn thành</li>
                <li>
                  Điểm đánh giá được tính dựa trên đánh giá của khách hàng
                </li>
                <li>Giải thưởng sẽ được trao vào đầu tháng sau</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipperRanking;
