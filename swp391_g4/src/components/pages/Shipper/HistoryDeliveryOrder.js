import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const HistoryDeliveryOrder = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(15);
    const [totalOrders, setTotalOrders] = useState('');
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [status, setStatus] = useState('All');
    const shipperID = localStorage.getItem('shipperId');
    const orderStatus = ["Pending", "InProgress", "Delivered", "Cancelled"];
    const [searchDate, setSearchDate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
  
    const FetchOrders = () => {
      axios.get(`http://localhost:4000/api/get-history-delivery-order?shipperId=${shipperID}&status=${status}&search=${searchTerm}&startDate=${startDate}&endDate=${endDate}&limit=${currentLimit}&page=${currentPage}`)
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

    useEffect( ()  => {
      FetchOrders();
    }, [status, currentPage]);
    
    const handlePageClick = (event) => {
      setCurrentPage(+event.selected + 1);
    };
    
    const handleStatusChange = (event) => {
        const selectedStatus = event.target.value;
        console.log(selectedStatus);
        setStatus(selectedStatus);
        setCurrentPage(1);
    };
  
    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
    }
  
    const handleDateChange = (event) => {
      setSearchDate(event.target.value);
    };
  
    const handleSearch = (event) => {
        console.log(status);
        console.log(searchDate);
        FetchOrders();
    }
  
    const handleStartDateChange = (event) => {
      setStartDate(event.target.value);
    };
  
    const handleEndDateChange = (event) => {
      setEndDate(event.target.value);
    };
  
      return (
          <div className="form shipper">
            <main className="mx-md-5">
              <h2 className="text-center mt-5">Lịch Sử Đơn Hàng Đã Giao</h2>
              <div className="row">
                <div className='col-6 align-content-end d-flex align-items-center'>
                  <h5 className="me-3 mb-0">Tổng Số Đơn Hàng: {totalOrders}</h5>
                  <div className="d-flex align-items-center gap-2">
                    <input 
                      type="date" 
                      className="form-control" 
                      value={startDate}
                      onChange={handleStartDateChange}
                      placeholder="Từ ngày"
                      style={{width: '150px'}}
                    />
                    <span>-</span>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={endDate}
                      onChange={handleEndDateChange}
                      placeholder="Đến ngày"
                      style={{width: '150px'}}
                    />
                  </div>
                </div>
                <div className='col-6' >
                  <div className='d-flex justify-content-end my-2'>
                    <div className=" w-25 me-3">
                        <select className="form-select" 
                                aria-label="Chọn Trạng Thái Đơn Hàng" 
                                value={status}  
                                onChange={handleStatusChange}>
                            <option value="All">Tất Cả</option>
                            <option value="Delivered">Đã Giao</option>
                            <option value="Cancelled">Đã Hủy</option>
                        </select>
                    </div>
                    <div className="d-flex w-50" >
                      <input type="search" className="form-control rounded" placeholder="Tên, điện thoại hoặc email"
                            aria-label="Tìm Kiếm" aria-describedby="search-addon" onChange={handleSearchChange } style={{width: '60%'}}/>
                      <button type="button" className="btn btn-outline-primary" onClick={handleSearch} >Tìm Kiếm</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="table-orders">
                <table className="table table-hover" >
                  <thead className='table-light'>
                    <tr>
                      <th scope="col">Mã Đơn Hàng</th>
                      <th scope="col">Tên Khách Hàng</th>
                      <th scope="col">Số Điện Thoại</th>
                      <th scope="col">Địa Chỉ</th>
                      <th scope="col">Ngày Đặt Hàng</th>
                      <th scope="col">Thời Gian Dự Kiến</th>
                      <th scope="col">Thời Gian Giao Thực Tế</th>
                      <th scope="col">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody  >
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="9">Không Tìm Thấy Đơn Hàng</td>
                      </tr>
                    )}
                    {orders.map((order, index) => (
                      <tr className={`${index % 2 !== 0 ? 'table-active' : ''}`}  key={order.OrderID} onClick={() =>(navigate(`/orderdetail/${order.OrderID}`))}>
                        <td className="py-2 align-content-center">#{order.OrderID}</td>
                        <td className="py-2 align-content-center">{order.FullName}</td>
                        <td className="py-2 align-content-center">{order.PhoneNumber}</td>
                        <td className="py-2 align-content-center">{order.DeliveryAddress}</td>
                        <td className="py-2 align-content-center">{format(new Date(order.OrderDate), 'dd/MM/yyyy HH:mm:ss')}</td>
                        <td className="py-2 align-content-center">{format(new Date(order.EstimatedDeliveryTime), 'dd/MM/yyyy HH:mm:ss')}</td>
                        <td className="py-2 align-content-center">{format(new Date(order.ActualDeliveryTime), 'dd/MM/yyyy HH:mm:ss')}</td>
                        <td className="py-2 align-content-center">
                            {order.OrderStatus === 'Delivered' && (
                                <span className="badge bg-success">Hoàn thành</span>
                            )}

                            {order.OrderStatus === 'Cancelled' && (
                                <span className="badge bg-danger">Không hoàn thành</span>
                            )}
                        </td>   
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 0 &&
                <div className='d-flex justify-content-end'>
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
              }
            </main>
          </div>
        );
}

export default HistoryDeliveryOrder;