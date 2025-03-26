import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow
} from '@mui/material';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

// Components
import MapBox from '../../common/mapbox';
import Header from '../../header/Header';
import Footer from '../../footer/Footer';
import BackButton from '../../buttons/BackButton';

const OrderDetails = () => {
  const { id } = useParams();
  const shipperID = localStorage.getItem('shipperId');
  const navigate = useNavigate();

  // Quản lý trạng thái
  const [orderData, setOrderData] = useState({
    order: {},
    shop: {},
    customer: {},
    products: [],
    addresses: []
  });
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shipperBalance, setShipperBalance] = useState(null);

  // Định dạng tiền tệ
  const formatCurrency = (value) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value || 0);

  // Lấy chi tiết đơn hàng
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/getOrderDetails/${id}`
        );
        console.log('Chi tiết đơn hàng:', response.data);

        const { order, shop, customer, products } = response.data;

        setOrderData({
          order,
          shop,
          customer,
          products,
          addresses: [order.DeliveryAddress, shop.Address]
        });

        if (shipperID) {
          fetchShipperBalance(shipperID);
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin đơn hàng:', error);
        // Chuyển hướng nếu không tìm thấy đơn hàng
        navigate('/dashboard');
      }
    };

    fetchOrderDetails();
  }, [id, shipperID, navigate]);

  // Lấy số dư của shipper
  const fetchShipperBalance = async (shipperID) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token không tồn tại, hãy đăng nhập lại');
        setShipperBalance(0);
        return;
      }

      const response = await axios.get(
        `http://localhost:4000/api/getShipperBalance/${shipperID}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      setShipperBalance(response.data.balance || 0);
    } catch (error) {
      console.error('Lỗi lấy số dư:', error);
      setShipperBalance(0);
    }
  };

  // Tính phí vận chuyển
  const calculateShippingFee = () => {
    const fee = Math.round((15000 + distance * 1000) / 10) * 10;
    return fee;
  };

  // Cập nhật phí vận chuyển khi khoảng cách thay đổi
  useEffect(() => {
    const updateShippingFee = async () => {
      if (distance > 0 && orderData.order.OrderID) {
        const shippingFee = calculateShippingFee();
        try {
          await axios.put(`http://localhost:4000/api/updateShippingFee`, {
            OrderID: orderData.order.OrderID,
            ShippingFee: shippingFee
          });
          setOrderData((prevData) => ({
            ...prevData,
            order: { ...prevData.order, ShippingFee: shippingFee }
          }));
        } catch (error) {
          console.error('Lỗi khi cập nhật phí vận chuyển:', error);
        }
      }
    };

    updateShippingFee();
  }, [distance, orderData.order.OrderID]);

  // Xác nhận lấy đơn
  const pickOrder = async () => {
    try {
      if (shipperBalance === null) {
        Swal.fire({
          icon: 'warning',
          title: 'Lỗi',
          text: 'Không thể lấy số dư tài khoản. Vui lòng thử lại hoặc đăng nhập lại.',
        });
        return;
      }

      const deposit = orderData.order.Deposit || 0;

      const pickOrderData = {
        OrderID: id,
        ShipperID: shipperID,
        Deposit: deposit,
        EstimatedDeliveryTime: dayjs()
          .add(duration * 60 + 60, 'minutes')
          .format('YYYY-MM-DD HH:mm:ss'),
      };

      await axios.put('http://localhost:4000/api/pickOrder', pickOrderData);

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Xác nhận thành công',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        window.location.href = '/dashboard';
      });
    } catch (error) {
      if (error.response?.status === 400) {
        const { currentBalance, requiredDeposit } = error.response.data;
        Swal.fire({
          icon: 'warning',
          title: 'Số Dư Không Đủ',
          html: `
            <p>Số dư hiện tại: <strong>${formatCurrency(currentBalance)}</strong></p>
            <p>Số tiền cọc yêu cầu: <strong>${formatCurrency(requiredDeposit)}</strong></p>
            <p>Vui lòng nạp thêm tiền để nhận đơn.</p>
          `,
          confirmButtonText: 'Nạp Tiền Ngay',
          cancelButtonText: 'Đóng',
          showCancelButton: true
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '/shipper-account';
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: error.response?.data?.message || 'Có lỗi xảy ra khi xác nhận đơn hàng',
        });
      }
    }
  };

  // Xác nhận giao hàng
  const confirmOrder = async (status) => {
    try {
      if (status === 'Cancelled') {
        navigate('/report-issue', { 
          state: { 
            orderId: id, 
            orderStatus: 'Cancelled' 
          } 
        });
      } else {
        await axios.put('http://localhost:4000/api/confirm-delivery-order', {
          OrderID: id,
          Status: status
        });
  
        Swal.fire({
          icon: 'success',
          title: 'Xác Nhận Đơn Hàng',
          text: 'Đơn hàng đã được cập nhật thành công',
          confirmButtonText: 'Xác Nhận'
        }).then(() => {
          window.location.href = '/dashboard';
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Đã xảy ra lỗi',
        text: error.response?.data?.message || 'Không thể xác nhận đơn hàng',
        footer: `Mã lỗi: ${error.response?.status || 'Không xác định'}`
      });
    }
  };

  // Hiển thị các nút hành động cho đơn hàng
  const renderOrderActions = () => {
    const { order } = orderData;

    // Xác nhận lấy đơn (Pending)
    if (order.OrderStatus === 'Pending') {
      const predictedBalance = (shipperBalance - (order.Deposit || 0));
      return (
        <Button
          variant="success"
          size="lg"
          onClick={() => {
            Swal.fire({
              title: 'Xác nhận đơn hàng này?',
              html: `Đơn hàng này yêu cầu đặt cọc <strong>${formatCurrency(order.Deposit || 0)}</strong>.<br>
                     Số dư còn lại: <strong>${formatCurrency(predictedBalance)}</strong>`,
              showCancelButton: true,
              confirmButtonText: 'Xác nhận',
              cancelButtonText: 'Hủy',
              icon: 'question',
            }).then((result) => {
              if (result.isConfirmed) {
                pickOrder();
              }
            });
          }}
        >
          Xác Nhận Lấy Đơn
        </Button>
      );
    }

    // Xác nhận giao hàng (InProgress)
    if (order.OrderStatus === 'InProgress') {
      return (
        <div className="d-flex gap-2">
          <Button
            variant="success"
            size="lg"
            onClick={() => {
              Swal.fire({
                title: 'Xác nhận giao hàng thành công?',
                showCancelButton: true,
                confirmButtonText: 'Xác nhận',
                cancelButtonText: 'Hủy',
                icon: 'question',
              }).then((result) => {
                if (result.isConfirmed) {
                  confirmOrder('Delivered');
                }
              });
            }}
          >
            Giao Hàng Thành Công
          </Button>
          <Button
            variant="danger"
            size="lg"
            onClick={() => {
              Swal.fire({
                title: 'Xác nhận giao hàng thất bại?',
                showCancelButton: true,
                confirmButtonText: 'Xác nhận',
                cancelButtonText: 'Hủy',
                icon: 'question',
              }).then((result) => {
                if (result.isConfirmed) {
                  confirmOrder('Cancelled');
                }
              });
            }}
          >
            Giao Hàng Thất Bại
          </Button>
        </div>
      );
    }

    // Không hiển thị nút hành động cho các trạng thái khác
    return null;
  };

  return (
    <div>
      <div className="header"><Header /></div>
      <div
        className="orderdetail-container"
        style={{
          padding: '5rem 10rem',
          background: 'rgb(245,245,245)',
          paddingTop: '120px'
        }}
      >
        <h2 className="text-center mb-5">Thông Tin Chi Tiết Đơn Hàng</h2>

        {/* Thông Tin Địa Chỉ */}
        <div className="d-flex mb-4">
          <div
            className="w-100 p-5 d-flex justify-content-between rounded-start-4"
            style={{ background: '#88f3c1' }}
          >
            <div>
              <h5><i className="fa-solid fa-shop"></i> Địa Chỉ Lấy Hàng</h5>
              <h5><strong><i className="fa-solid fa-user"></i> {orderData.shop.ShopName}</strong></h5>
              <span><i className="fa-solid fa-phone"></i> (+84) {orderData.shop.PhoneNumber}</span><br />
              <span><i className="fa-solid fa-location-dot"></i> {orderData.shop.Address}</span>
            </div>
          </div>
          <div
            className="w-100 p-5 rounded-end-4"
            style={{ background: '#caf4e0' }}
          >
            <div>
              <h5><i className="fa-solid fa-house"></i> Địa Chỉ Nhận Hàng</h5>
              <h5><strong><i className="fa-solid fa-user"></i> {orderData.customer.FullName || 'Không có tên'}</strong></h5>
              <span><i className="fa-solid fa-phone"></i> (+84) {orderData.customer.PhoneNumber}</span><br />
              <span><i className="fa-solid fa-location-dot"></i> {orderData.order.DeliveryAddress}</span>
            </div>
          </div>
        </div>

        {/* Chi Tiết Đơn Hàng */}
        <div
          className="w-100 p-5 rounded-4 my-4 shadow-2"
          style={{ background: '#caf4e0' }}
        >
          <h3><i className="fa-solid fa-bag-shopping"></i> Đơn Hàng</h3>
          <h6>Khoảng cách: {distance} Km</h6>
          <h6>Thời gian vận chuyển dự tính: {duration} giờ</h6>

          {/* Bảng Sản Phẩm */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="fw-bold fs-5">STT</TableCell>
                <TableCell className="fw-bold fs-5">Sản phẩm</TableCell>
                <TableCell className="fw-bold fs-5 text-center">Số lượng</TableCell>
                <TableCell className="fw-bold fs-5 text-center">Đơn giá</TableCell>
                <TableCell className="fw-bold fs-5 text-end">Tổng tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderData.products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell className="col-1 border-black">{index + 1}</TableCell>
                  <TableCell className="col-6 border-black">{product.ProductName}</TableCell>
                  <TableCell className="col-1 text-center border-black">{product.Quantity}</TableCell>
                  <TableCell className="col-2 text-center border-black">
                    {formatCurrency(product.Price)}
                  </TableCell>
                  <TableCell className="col-2 text-end border-black">
                    {formatCurrency(product.Total)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Bảng Tổng Quan Tài Chính */}
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="fw-bold fs-5 text-end border-black">Tổng tiền hàng:</TableCell>
                <TableCell className="fw-bold fs-6 text-end col-2 border-black">
                  {formatCurrency(orderData.order.TotalAmount)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="fw-bold fs-5 text-end border-black">Phí vận chuyển:</TableCell>
                <TableCell className="fw-bold fs-6 text-end col-2 border-black">
                  {formatCurrency(orderData.order.ShippingFee || calculateShippingFee())}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="fw-bold fs-5 text-end border-black">Tiền cọc:</TableCell>
                <TableCell className="fw-bold fs-6 text-end col-2 border-black">
                  {formatCurrency(orderData.order.Deposit || 0)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="fw-bold fs-4 text-end border-black">
                  Tổng thanh toán:
                </TableCell>
                <TableCell className="fw-bold fs-5 text-end col-2 border-black">
                  {formatCurrency(
                    (orderData.order.TotalAmount || 0) + 
                    (orderData.order.ShippingFee || calculateShippingFee())
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Nút Hành Động */}
        <div
          className="w-100 p-5 rounded-4 d-flex justify-content-between"
          style={{ background: '#caf4e0' }}
        >
          <BackButton />
          {renderOrderActions()}
        </div>

        {/* Bản Đồ */}
        <div className="mt-4">
          <MapBox
            addressData={orderData.addresses}
            distance={setDistance}
            duration={setDuration}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderDetails;