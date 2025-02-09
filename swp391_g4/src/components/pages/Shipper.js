import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Shipper.css';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import OrderStatusSelect from '../buttons/OrderStatusSelect';
import ReactPaginate from 'react-paginate';
import { format } from 'date-fns';
import { Input, initMDB } from 'mdb-ui-kit';
import Header from '../common/header';
import ProfileShipper from '../common/profileShipper';
initMDB({ Input });

const Shipper = () => {
  const navigate = useNavigate();
  const [shipper, setShipper] = useState([]);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(8);
  const [totalOrders, setTotalOrders] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const shipperID = localStorage.getItem('shipperId');
  const orderStatus = ["Pending", "InProgress", "Delivered", "Cancelled"];

  const FetchOrders = () => {
    axios.get(`http://localhost:5000/api/getOrders?shipperID=${shipperID}&search=${searchTerm}&limit=${currentLimit}&page=${currentPage}`)
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
    axios.get(`http://localhost:5000/api/getShipperById?id=${shipperID}`)
    .then((response) => {
      setShipper(response.data.shipper);
    }) 
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
      <Header/>

      <main className="mx-md-5">
        

        <div className="my-3">
          <ProfileShipper props={shipper} />
        </div>
        <h2 className="text-center">My Shipping Orders</h2>
        <div className="row">
          <div className='col-6 align-content-end'>
            <h5>Total Orders: {totalOrders}</h5> 
          </div>
          <div className='col-6' >
            <div className='d-flex justify-content-end my-2'>
              <div className="input-group w-50">
                <input type="search" className="form-control rounded" placeholder="Name, phone or email"
                      aria-label="Search" aria-describedby="search-addon" onChange={handleSearchChange} />
                <button type="button" className="btn btn-outline-primary" onClick={handleSearch} >search</button>
              </div>
            </div>
          </div>
        </div>
        <div className="table-orders">
          <table className="table table-hover" >
            <thead className='table-light'>
              <tr>
                <th scope="col">Order ID</th>
                <th scope="col">Customer Name</th>
                <th scope="col">Phone</th>
                <th scope="col">Email</th>
                <th scope="col">Address</th>
                <th scope="col">Estimated Time</th>
                <th scope="col">Fee</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody  >
              {orders.length === 0 && (
                <tr>
                  <td colSpan="9">No orders found</td>
                </tr>
              )}
              {orders.map((order, index) => (
                <tr className={`${index % 2 !== 0 ? 'table-active' : ''}`}  key={order.OrderID} onClick={() =>(navigate(`/orderdetail/${order.OrderID}`))}>
                  <td className="py-2 align-content-center">#{order.OrderID}</td>
                  <td className="py-2 align-content-center">{order.FullName}</td>
                  <td className="py-2 align-content-center">{order.PhoneNumber}</td>
                  <td className="py-2 align-content-center">{order.Email}</td>
                  <td className="py-2 align-content-center">{order.DeliveryAddress}</td>
                  <td className="py-2 align-content-center">{format(new Date(order.EstimatedDeliveryTime), 'MMMM dd, yyyy hh:mm:ss a')}</td>
                  <td className="py-2 align-content-center">{order.ShippingFee}$</td>
                  <td className="py-2 align-content-center" onClick={(e) => e.stopPropagation()}>
                    <OrderStatusSelect order={order} orderStatusList={orderStatus} handleStatusChange={handleStatusChange} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 0 &&
          <div className='d-flex justify-content-end'>
              <ReactPaginate
                nextLabel="next"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                pageCount={totalPages}
                previousLabel="previous"
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
