import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {  Table, TableHead, TableCell, TableBody, TableRow } from "@mui/material";
import { Button } from "react-bootstrap";  // Bootstrap button
import "bootstrap/dist/css/bootstrap.min.css";
import { format } from "date-fns";
import MapBox from "../../common/mapbox";
import Header from "../../header/Header";
import Swal from 'sweetalert2'
import Footer from "../../footer/Footer";

const OrderDetails = () => {
    const dayjs = require('dayjs');
    const shipperID = localStorage.getItem('shipperId');
    const { id } = useParams();
    const [order, setOrder] = useState({});
    const [shop, setShop] = useState({});
    const [customer, setCustomer] = useState({});
    const [products, setProducts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [addresses, setAddresses] = useState({ delivery: "", shop: "" });
    const [distance, setDistance] = useState(0);
    const [duration, setDuration] = useState(0);
    let shippingFee = 15000 + (distance * 1000);
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
    };
    useEffect(() => {
        const fetchOrderDetails = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/api/getOrderDetails/${id}`);
            setOrder(response.data.order);
            setShop(response.data.shop);
            setCustomer(response.data.customer);
            setProducts(response.data.products);
            setAddresses([
                response.data.order.DeliveryAddress,
                response.data.shop.Address
            ]);

            console.log(order);
            // Directly calculate the total after fetching products
            const total = response.data.products.reduce((acc, product) => {
              return acc + (Number(product.Total) || 0);
            }, 0);
    
            setTotalPrice(total);
          } catch (error) {
            console.error("Error fetching order details:", error);
          }
        };
    
        fetchOrderDetails();
      }, [id]); 

    const pickOrder = async () => {
        const orderData = {
            OrderID: id,
            ShipperID: shipperID,
            ShippingFee: shippingFee,
            EstimatedDeliveryTime: dayjs().add((duration * 60 ) + 60, "minutes").format("YYYY-MM-DD HH:mm:ss"),
        };

        try {
            const response = await axios.put("http://localhost:5000/api/pickOrder", orderData);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Order picked successfully",
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
               window.location.href = "/shipper";
            });
            return response.data;
        } catch (error) {
            console.error("Error picking order:", error.response?.data || error.message);
            throw error;
        }
    };

    const pickOrderHandler = () => {
        Swal.fire({
            title: "Do you want pick this order?",
            showCancelButton: true,
            confirmButtonText: "Save",
            icon: "question"
          }).then((result) => {
            if (result.isConfirmed) {
               pickOrder();
            }
        });
    };


    const confirmOrderHandler = async (status) => {
        Swal.fire({
            title: "Do you want confirm delivery this order?",
            showCancelButton: true,
            confirmButtonText: "Save",
            icon: "question"
          }).then((result) => {
            if (result.isConfirmed) {
                confirmOrder(status);
            }
        });
    };

    const confirmOrder = async (status) => {
        const orderData = {
            OrderID: id,
            Status: status
        };
        try {
            const response = await axios.put("http://localhost:5000/api/confirm-delivery-order", orderData);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Order picked successfully",
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                window.location.href = "/my-delivery-order";
            });
            return response.data;
        } catch (error) {
            console.error("Error confirming order:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            });
        }
    };
    
    return (
        <div>
            <Header/>
       
            <div style={{padding: "5rem 10rem",background:'rgb(245,245,245)'}}>
                <h2 className="text-center mb-5">
                 Thông Tin đơn Hàng
                </h2>
                <div className="d-flex">
                    <div className="w-100 p-5 d-flex justify-content-between rounded-start-4" style={ {background:'#88f3c1'}} >
                        <div className="">
                            <h5> <i className="fa-solid fa-shop"></i> &nbsp;Địa Chỉ Lấy Hàng</h5>
                            <h5><strong><i className="fa-solid fa-user"></i> &nbsp;{shop.ShopName}</strong></h5>
                            <span><i className="fa-solid fa-phone"></i> &nbsp; (+84) {shop.PhoneNumber}</span>
                            <br/>
                            <span><i className="fa-solid fa-location-dot"></i> &nbsp;{shop.Address}</span>
                        </div>
                    </div>
                    <div className="w-100 p-5 rounded-end-4" style={{background:'#caf4e0'}}>
                        <div className="">
                            
                            <h5> <i className="fa-solid fa-house"></i> &nbsp; Địa Chỉ Nhận Hàng</h5>
                            <h5><strong><i className="fa-solid fa-user"></i> &nbsp;{customer.FullName}</strong></h5>
                            <span><i className="fa-solid fa-phone"></i> &nbsp; (+84) {customer.PhoneNumber}</span>
                            <br/>
                            <span><i className="fa-solid fa-location-dot"></i> &nbsp;{order.DeliveryAddress}</span>
                            {/* <span className="" style={{fontSize: '14px', color: 'gray'}}> ( Ngày nhận hàng dự kiến: {format(new Date(order.EstimatedDeliveryTime === undefined ? null : order.EstimatedDeliveryTime), 'MMMM dd, yyyy hh:mm:ss a')} )</span> */}
                        </div>
                    </div>
                </div>
                <div className="w-100  p-5 rounded-4 my-4 shadow-2" style={{background:'#caf4e0'}}>
                    <div className="">
                        <h3><i className="fa-solid fa-bag-shopping"></i> &nbsp; Đơn Hàng</h3>
                        <h6>Khoảng cách: {distance} Km</h6>
                        <h6>Thời gian vận chuyển dự tính: {duration} h</h6>
                        <Table>
                            <TableHead >
                                <TableRow>
                                    <TableCell className="fw-bold fs-5">No </TableCell>
                                    <TableCell className="fw-bold fs-5">Product </TableCell>
                                    <TableCell className="fw-bold fs-5">Quantity </TableCell>
                                    <TableCell className="fw-bold fs-5 text-center">Price </TableCell>
                                    <TableCell className="fw-bold fs-5 text-center ">Totall </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product, index) => (
                                    <TableRow key={index} >
                                        <TableCell className="col-1 border-black">{index + 1}</TableCell>
                                        <TableCell className="col-6 border-black">{product.ProductName}</TableCell>
                                        <TableCell className="col-1 text-center border-black">{product.Quantity}</TableCell>
                                        <TableCell className="col-2 text-end border-black">
                                            <span className="me-4 border-black"> {formatCurrency(product.Price)} </span> 
                                        </TableCell>
                                        <TableCell className="col-2 text-end border-black">
                                            <span className="me-4"> {formatCurrency(product.Total)} </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="fw-bold fs-5 text-end border-black">Tổng tiền: </TableCell>
                                    <TableCell className="fw-bold fs-6 text-end col-2 border-black">
                                        <span className="me-4">{formatCurrency(totalPrice)}</span>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="fw-bold fs-5 text-end border-black">Phí vận chuyển: </TableCell>
                                    <TableCell className="fw-bold fs-6 text-end col-2 border-black">
                                        <span className="me-4">{formatCurrency(shippingFee)}</span>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="fw-bold fs-4 text-end border-black">Tổng thanh toán: </TableCell>
                                    <TableCell className="fw-bold fs-5 text-end col-2 border-black">
                                        <span className="me-4">{formatCurrency(totalPrice + shippingFee)}</span>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div className="w-100 p-5 rounded-4 d-flex justify-content-end" style={{background:'#caf4e0'}}>
                   
                    {order.OrderStatus === "Pending" && 
                        <Button variant="success" size="lg" onClick={pickOrderHandler} >Xác Nhận</Button>
                    }

                    {order.OrderStatus === "InProgress" &&
                        <div>
                            <Button variant="success" size="lg" className="me-2" onClick={() => confirmOrderHandler('Delivered')}  >Giao Hàng Thành Công</Button>
                            <Button variant="danger" size="lg" onClick={() => confirmOrderHandler('Cancelled')}  >Giao Hàng Thất Bại</Button>
                        </div>
                    }

                    {order.OrderStatus === "Delivered" &&
                        <span className="me-2 fs-4 fw-bold text-success">Đã Giao Hàng Thành Công</span>
                    }

                    {order.OrderStatus === "Cancelled" &&
                        <span className="me-2 fs-4 fw-bold text-danger">Giao Hàng Thất Bại</span>
                    }
                </div>
                <div className="mt-4">
                    <MapBox addressData={addresses} distance={setDistance} duration={setDuration} ></MapBox>
                </div>
            </div>
            <Footer/>
        </div>
        
    );
};

export default OrderDetails;