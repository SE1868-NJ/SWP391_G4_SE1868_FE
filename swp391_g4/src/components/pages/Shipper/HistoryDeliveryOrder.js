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
  
    const FetchOrders = () => {
      axios.get(`http://localhost:5000/api/get-history-delivery-order?shipperId=${shipperID}&status=${status}&search=${searchTerm}&limit=${currentLimit}&page=${currentPage}`)
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
    }, [currentPage]);
    
    const handlePageClick = (event) => {
      setCurrentPage(+event.selected + 1);
    };
    
    const handleStatusChange = (event) => {
        console.log(event.target.value);
        setStatus(event.target.value);
      };
  
    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
    }
  
    const handleSearch = (event) => {
        console.log(status);
      FetchOrders();
    }
  
      return (
          <div className="form shipper">
            <main className="mx-md-5">
              <h2 className="text-center mt-5">History Delivery Orders</h2>
              <div className="row">
                <div className='col-6 align-content-end'>
                  <h5>Total Orders: {totalOrders}</h5> 
                </div>
                <div className='col-6' >
                  <div className='d-flex justify-content-end my-2'>
                    <div className=" w-25 me-3">
                        <select className="form-select" 
                                aria-label="Order Status Select" 
                                value={status}  
                                onChange={handleStatusChange}>
                            <option value="All" selected>All</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className="d-flex w-50">
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
                      <th scope="col">Address</th>
                      <th scope="col">Order Date</th>
                      <th scope="col">Estimated Time</th>
                      <th scope="col">Actual Delivery Time</th>
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
                        <td className="py-2 align-content-center">{order.DeliveryAddress}</td>
                        <td className="py-2 align-content-center">{format(new Date(order.OrderDate), 'MMMM dd, yyyy hh:mm:ss a')}</td>
                        <td className="py-2 align-content-center">{format(new Date(order.EstimatedDeliveryTime), 'MMMM dd, yyyy hh:mm:ss a')}</td>
                        <td className="py-2 align-content-center">{format(new Date(order.ActualDeliveryTime), 'MMMM dd, yyyy hh:mm:ss a')}</td>
                        <td className="py-2 align-content-center">
                            {order.OrderStatus === 'Delivered' && (
                                <span className="badge bg-success">Delivered</span>
                            )}

                            {order.OrderStatus === 'Cancelled' && (
                                <span className="badge bg-danger">Cancelled</span>
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
}

export default HistoryDeliveryOrder;