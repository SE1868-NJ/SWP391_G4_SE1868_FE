import { useEffect, useState } from "react";
import ProfileShipper from "../../common/profileShipper";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import ReactPaginate from "react-paginate";

const MyDeliveryOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(15);
  const [totalOrders, setTotalOrders] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const shipperID = localStorage.getItem("shipperId");
  const orderStatus = ["Pending", "InProgress", "Delivered", "Cancelled"];

  
  const FetchOrders = () => {
    axios
      .get(
        `http://localhost:4000/api/get-my-delivery-order?shipperId=${shipperID}&search=${searchTerm}&limit=${currentLimit}&page=${currentPage}`
      )
      .then((response) => {
        console.log(response);

        setTotalOrders(response.data.totalRows);
        setTotalPages(response.data.totalPages);
        setOrders(response.data.orders);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    FetchOrders();
  }, [currentPage]);

  const handlePageClick = (event) => {
    setCurrentPage(+event.selected + 1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (event) => {
    FetchOrders();
  };

  const handleReportIssue = () => {
    navigate('/report-issue');
  };

  return (
    <div className="form shipper">
      <main className="mx-md-5">
        <h2 className="text-center mt-5">Đơn Hàng Đang Giao</h2>
        <div className="row">
          <div className="col-6 align-content-end">
            <h5>Tổng Số Đơn Hàng: {totalOrders}</h5>
          </div>
          <div className="col-6">
            <div className="d-flex justify-content-end my-2">
              <div className="input-group w-50">
                <input
                  type="search"
                  className="form-control rounded"
                  placeholder="Tên, điện thoại hoặc email"
                  aria-label="Tìm Kiếm"
                  aria-describedby="search-addon"
                  onChange={handleSearchChange}
                />
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={handleSearch}
                >
                  Tìm Kiếm
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="table-orders">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th scope="col">Mã Đơn Hàng</th>
                <th scope="col">Tên Khách Hàng</th>
                <th scope="col">Số Điện Thoại</th>
                <th scope="col">Email</th>
                <th scope="col">Địa Chỉ</th>
                <th scope="col">Ngày Đặt Hàng</th>
                <th scope="col">Thời Gian Dự Kiến</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan="9">Không Tìm Thấy Đơn Hàng</td>
                </tr>
              )}
              {orders.map((order, index) => (
                <tr
                  className={`${index % 2 !== 0 ? "table-active" : ""}`}
                  key={order.OrderID}
                  onClick={() => navigate(`/orderdetail/${order.OrderID}`)}
                >
                  <td className="py-2 align-content-center">
                    #{order.OrderID}
                  </td>
                  <td className="py-2 align-content-center">
                    {order.FullName}
                  </td>
                  <td className="py-2 align-content-center">
                    {order.PhoneNumber}
                  </td>
                  <td className="py-2 align-content-center">{order.Email}</td>
                  <td className="py-2 align-content-center">
                    {order.DeliveryAddress}
                  </td>
                  <td className="py-2 align-content-center">
                    {format(
                      new Date(order.OrderDate),
                      "dd/MM/yyyy HH:mm:ss"
                    )}
                  </td>
                  <td className="py-2 align-content-center">
                    {format(
                      new Date(order.EstimatedDeliveryTime),
                      "dd/MM/yyyy HH:mm:ss"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 0 && (
          <div className="d-flex justify-content-end">
            <ReactPaginate
              nextLabel="Tiếp"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={totalPages}
              previousLabel="Trước"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakLabel="..."
              breakClassName="page-item"
              breakLinkClassName="page-link"
              containerClassName="pagination"
              activeClassName="active"
              renderOnZeroPageCount={null}
            />
          </div>
        )}

        {/* Nút Sự cố đơn hàng */}
        <div className="d-flex justify-content-end mt-3">
          <button 
            className="btn btn-warning"
            onClick={handleReportIssue}
          >
            Sự Cố Đơn Hàng
          </button>
        </div>
      </main>
    </div>
  );
};

export default MyDeliveryOrder;