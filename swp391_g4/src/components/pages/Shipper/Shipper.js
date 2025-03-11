import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Shipper.css';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import ReactPaginate from 'react-paginate';
import { format } from 'date-fns';
import { Input, initMDB } from 'mdb-ui-kit';
import Header from '../../header/Header';
import Footer from '../../footer/Footer';
import ProfileShipper from '../../common/profileShipper';
initMDB({ Input });

const Shipper = () => {
  const navigate = useNavigate();
  const [shipper, setShipper] = useState([]);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(15);
  const [totalOrders, setTotalOrders] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const shipperID = localStorage.getItem('shipperId');
  const orderStatus = ["Pending", "InProgress", "Delivered", "Cancelled"];

  const FetchOrders = () => {
    axios.get(`http://localhost:5000/api/getOrdersPending?search=${searchTerm}&limit=${currentLimit}&page=${currentPage}`)
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
    axios.get(`http://localhost:5000/api/shippers/${shipperID}`)
    .then((response) => {
      setShipper(response.data);  // Kiểm tra cấu trúc response
    }) 
    .catch(error => {
      console.error("Error fetching shipper:", error);
    });
  }, []);


  const ChangeOrderStatus = async (orderId, newStatus) => {
    const postData = {
      "OrderID": orderId,
      "Status": newStatus
    };
  
    try {
      const response = await axios.post('http://localhost:5000/api/changeStatusOrder', postData);
      console.log(response);
    } catch (error) {
      console.error("Error changing order status:", error);
    }
  }

  useEffect( ()  => {
    FetchOrders();
  }, [currentPage]);
  
  const handlePageClick = (event) => {
    setCurrentPage(+event.selected + 1);
  };
  
  const handleStatusChange = (orderId, newStatus) => {
    ChangeOrderStatus(orderId, newStatus);
    FetchOrders();
    console.log("Change status for order ID", orderId, "to", newStatus);
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  }

  const handleSearch = (event) => {
    FetchOrders();
  }
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
        <div className="row">
          <div className='col-6 align-content-end'>
            <h5>Tổng Số Đơn Hàng: {totalOrders}</h5> 
          </div>
          <div className='col-6' >
            <div className='d-flex justify-content-end my-2'>
              <div className="input-group w-50">
                <input type="search" className="form-control rounded" placeholder="Tên, điện thoại hoặc email"
                      aria-label="Tìm Kiếm" aria-describedby="search-addon" onChange={handleSearchChange} />
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
                <th scope="col">Email</th>
                <th scope="col">Địa Chỉ</th>
                <th scope="col">Ngày Đặt Hàng</th>
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
                  <td className="py-2 align-content-center">{order.Email}</td>
                  <td className="py-2 align-content-center">{order.DeliveryAddress}</td>
                  <td className="py-2 align-content-center">{format(new Date(order.OrderDate), 'dd/MM/yyyy HH:mm:ss')}</td>
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
};

export default Shipper;