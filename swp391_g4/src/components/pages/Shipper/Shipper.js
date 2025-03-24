import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Shipper.css';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import ReactPaginate from 'react-paginate';
import { format } from 'date-fns';
import { Input, initMDB } from 'mdb-ui-kit';
import Header from '../../header/Header';
import ProfileShipper from '../../common/profileShipper';
initMDB({ Input });

const Shipper = () => {
  const navigate = useNavigate();
  const shipperID = localStorage.getItem('shipperId');

  // State management
  const [shipper, setShipper] = useState({});
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalOrders: 0,
    limit: 15
  });

  // Fetch shipper profile
  useEffect(() => {
    axios.get(`http://localhost:5000/api/shippers/${shipperID}`)
      .then(response => setShipper(response.data))
      .catch(error => console.error("Lỗi tải thông tin shipper:", error));
  }, [shipperID]);

  // Fetch orders
  const fetchOrders = () => {
    axios.get(`http://localhost:5000/api/getOrdersPending`, {
      params: {
        shipperId: shipperID,
        search: searchTerm,
        limit: pagination.limit,
        page: pagination.currentPage
      }
    })
    .then(response => {
      const { orders, totalRows, totalPages } = response.data;
      
      // Lọc theo trạng thái thanh toán nếu có
      const filteredOrders = paymentFilter 
        ? orders.filter(order => order.PaymentStatus === paymentFilter)
        : orders;

      setOrders(filteredOrders);
      setPagination(prev => ({
        ...prev, 
        totalOrders: filteredOrders.length,
        totalPages: totalPages
      }));
    })
    .catch(error => console.error("Lỗi tải đơn hàng:", error));
  };

  // Fetch orders when dependencies change
  useEffect(() => {
    fetchOrders();
  }, [pagination.currentPage, shipperID, paymentFilter, searchTerm]);

  // Xử lý chuyển trang
  const handlePageClick = (event) => {
    setPagination(prev => ({
      ...prev,
      currentPage: event.selected + 1
    }));
  };

  // Xử lý tìm kiếm
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchOrders();
  };

  return (
    <div className="form shipper">
      <div className='header'>
        <Header/>
      </div>

      <main className="mx-md-5">
        <div className="my-3 d-flex justify-content-between align-items-center">
          <img
            src="https://useless-gold-stingray.myfilebase.com/ipfs/QmTujYCZq9ZGX7tAEbPfY1uZUgp2qRd4Gyc85fbmcuDi6K"
            alt="Vận Chuyển Tiết Kiệm"
            className="service-image"
          />
          <div className='ProfileShipper'><ProfileShipper props={shipper} /></div>
        </div>
        
        <h2 className="text-center">Đơn Hàng Đang Chờ</h2>
        
        <div className="row mb-3">
          <div className='col-6 align-content-end'>
            <h5>Tổng Số Đơn Hàng: {pagination.totalOrders}</h5> 
          </div>
          <div className='col-6'>
            <div className='d-flex justify-content-end'>
              <div className="w-25 me-3">
                <select 
                  className="form-select" 
                  value={paymentFilter}
                  onChange={(e) => {
                    setPaymentFilter(e.target.value);
                    setPagination(prev => ({ ...prev, currentPage: 1 }));
                  }}
                >
                  <option value="">Tất Cả</option>
                  <option value="PrePaid">Trả Trước</option>
                  <option value="PostPaid">Trả Sau</option>
                </select>
              </div>
              <div className="input-group w-50">
                <input 
                  type="search" 
                  className="form-control rounded" 
                  placeholder="Tên, điện thoại hoặc email"
                  aria-label="Tìm Kiếm" 
                  aria-describedby="search-addon" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
            <thead className='table-light'>
              <tr>
                <th scope="col">Mã Đơn Hàng</th>
                <th scope="col">Tên Khách Hàng</th>
                <th scope="col">Số Điện Thoại</th>
                <th scope="col">Email</th>
                <th scope="col">Địa Chỉ</th>
                <th scope="col">Thanh Toán</th>
                <th scope="col">Ngày Đặt Hàng</th>
                <th scope="col">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center">Không Tìm Thấy Đơn Hàng</td>
                </tr>
              )}
              {orders.map((order, index) => (
                <tr 
                  className={`${index % 2 !== 0 ? 'table-active' : ''}`}  
                  key={order.OrderID}
                >
                  <td className="py-2 align-content-center">#{order.OrderID}</td>
                  <td className="py-2 align-content-center">{order.FullName}</td>
                  <td className="py-2 align-content-center">{order.PhoneNumber}</td>
                  <td className="py-2 align-content-center">{order.Email}</td>
                  <td className="py-2 align-content-center">{order.DeliveryAddress}</td>
                  <td className="py-2 align-content-center">
                    <span 
                      className={`badge ${order.PaymentStatus === 'PrePaid' 
                        ? 'bg-info text-dark' 
                        : 'bg-danger text-white'}`}
                    >
                      {order.PaymentStatus === 'PrePaid' ? 'Trả Trước' : 'Trả Sau'}
                    </span>
                  </td>
                  <td className="py-2 align-content-center">
                    {format(new Date(order.OrderDate), 'dd/MM/yyyy HH:mm:ss')}
                  </td>
                  <td className="py-2 align-content-center">
                    <button 
                      className="btn btn-success btn-sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/orderdetail/${order.OrderID}`);
                      }}
                    >
                      Nhận Đơn
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {pagination.totalPages > 0 &&
          <div className='d-flex justify-content-end'>
            <ReactPaginate
              nextLabel="Tiếp"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={pagination.totalPages}
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
};

export default Shipper;