import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
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

  // State management
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

  // Currency formatter
  const formatCurrency = (value) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0, // Không hiển thị phần thập phân thừa
      maximumFractionDigits: 0
    }).format(value || 0);

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/getOrderDetails/${id}`
        );
        console.log('Order Details Response:', response.data);

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
      }
    };

    fetchOrderDetails();
  }, [id, shipperID]);

  // Fetch shipper balance
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
      if (error.response?.status === 401) {
        console.warn('Token không hợp lệ, cần đăng nhập lại');
      }
      setShipperBalance(0);
    }
  };

  // Hàm tính ShippingFee (dùng để cập nhật nếu cần)
  const calculateShippingFee = () => {
    const fee = Math.round((14000 + distance * 1000) / 10) * 10;
    console.log('Calculated ShippingFee:', fee, 'Distance:', distance);
    return fee;
  };

  // Cập nhật ShippingFee lên server khi distance thay đổi
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
          console.log('Updated ShippingFee to DB:', shippingFee);
        } catch (error) {
          console.error('Lỗi khi cập nhật ShippingFee:', error);
        }
      }
    };

    updateShippingFee();
  }, [distance, orderData.order.OrderID]);

  // Utility methods
  const getPaymentAmount = () => {
    const totalAmount = orderData.order.TotalAmount || 0;
    const shippingFee = orderData.order.ShippingFee || calculateShippingFee();

    // Nhân ShippingFee và TotalAmount với 1000 để loại bỏ sai số thập phân, rồi chia lại
    const multiplier = 1000;
    const adjustedTotalAmount = totalAmount * multiplier;
    const adjustedShippingFee = shippingFee * multiplier;
    const result = (adjustedTotalAmount + adjustedShippingFee) / multiplier;

    console.log('Payment Amount Calc:', {
      PaymentStatus: orderData.order.PaymentStatus,
      TotalAmount: totalAmount,
      ShippingFee: shippingFee,
      AdjustedTotalAmount: adjustedTotalAmount,
      AdjustedShippingFee: adjustedShippingFee,
      Result: result
    });

    return orderData.order.PaymentStatus === 'PrePaid' ? 0 : result;
  };

  const getPaymentStatusLabel = () =>
    orderData.order.PaymentStatus === 'PrePaid' ? 'Trả trước' : 'Trả sau';

  // Order handling methods
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

  const confirmOrder = async (status) => {
    try {
      let failureReason = null;
      const depositValue = parseFloat(orderData.order.Deposit || 0).toFixed(2);
      const shippingFee = orderData.order.ShippingFee;

      if (status === 'Cancelled') {
        const result = await Swal.fire({
          title: 'Lý Do Giao Hàng Thất Bại',
          input: 'select',
          inputOptions: {
            'shipper_error': 'Lỗi do Shipper',
            'customer_error': 'Lỗi do Khách Hàng',
            'other': 'Lý Do Khác'
          },
          inputPlaceholder: 'Chọn lý do giao hàng thất bại',
          showCancelButton: true,
          confirmButtonText: 'Xác Nhận',
          cancelButtonText: 'Hủy',
          inputValidator: (value) => {
            return new Promise((resolve) => {
              if (value) {
                resolve();
              } else {
                resolve('Bạn cần chọn lý do giao hàng thất bại');
              }
            });
          }
        });

        if (result.dismiss) return;
        failureReason = result.value;
      }

      const confirmData = {
        OrderID: id,
        Status: status,
        Deposit: Number(depositValue),
        ShippingFee: shippingFee,
        FailureReason: failureReason
      };

      const response = await axios.put('http://localhost:4000/api/confirm-delivery-order', confirmData);

      if (status === 'Delivered') {
        Swal.fire({
          icon: 'success',
          title: 'Giao Hàng Thành Công',
          html: `
            <p>Tiền cọc: <strong>${formatCurrency(response.data.deposit || 0)}</strong> đã được hoàn</p>
            <p>Phí vận chuyển: <strong>${formatCurrency(response.data.shippingFee || 0)}</strong> đã được cộng vào tài khoản</p>
          `,
          confirmButtonText: 'Xác Nhận'
        }).then(() => {
          window.location.href = '/dashboard';
        });
      } else if (status === 'Cancelled') {
        if (failureReason === 'shipper_error') {
          Swal.fire({
            icon: 'warning',
            title: 'Giao Hàng Thất Bại',
            text: 'Đơn hàng giao thất bại do lỗi của Shipper. Bạn sẽ không được hoàn tiền cọc.',
            confirmButtonText: 'Xác Nhận'
          }).then(() => {
            window.location.href = '/dashboard';
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Giao Hàng Thất Bại',
            html: `
              <p>Tiền cọc: <strong>${formatCurrency(response.data.deposit || 0)}</strong> đã được hoàn</p>
            `,
            confirmButtonText: 'Xác Nhận'
          }).then(() => {
            window.location.href = '/dashboard';
          });
        }
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

  // Render methods
  const renderOrderActions = () => {
    const { order } = orderData;

    if (order.OrderStatus === 'Pending') {
      return (
        <Button
          variant="success"
          size="lg"
          onClick={() => {
            Swal.fire({
              title: 'Xác nhận đơn hàng này?',
              html: `Đơn hàng này yêu cầu đặt cọc <strong>${formatCurrency(order.Deposit || 0)}</strong>.<br>
                     Số dư tài khoản hiện tại: <strong>${formatCurrency(shipperBalance)}</strong>`,
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
          Xác Nhận
        </Button>
      );
    }

    if (order.OrderStatus === 'InProgress') {
      return (
        <div className="d-flex gap-2">
          <Button
            variant="success"
            size="lg"
            onClick={() => {
              Swal.fire({
                title: 'Xác nhận đơn hàng này?',
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
                title: 'Xác nhận đơn hàng này?',
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

    if (order.OrderStatus === 'Delivered') {
      return (
        <span className="me-2 fs-4 fw-bold text-success">
          Đã Giao Hàng Thành Công
        </span>
      );
    }

    if (order.OrderStatus === 'Cancelled') {
      return (
        <span className="me-2 fs-4 fw-bold text-danger">
          Giao Hàng Thất Bại
        </span>
      );
    }

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
        <h2 className="text-center mb-5">Thông Tin Đơn Hàng</h2>

        {/* Payment Status Badge */}
        {orderData.order.PaymentStatus && (
          <div className="text-center mb-3">
            <span
              className={`badge ${orderData.order.PaymentStatus === 'PrePaid'
                ? 'bg-primary'
                : 'bg-warning text-dark'
              } fs-6 px-3 py-2`}
            >
              <i
                className={`fa-solid ${orderData.order.PaymentStatus === 'PrePaid'
                  ? 'fa-credit-card'
                  : 'fa-money-bill-wave'
                } me-2`}
              ></i>
              Phương thức thanh toán: {getPaymentStatusLabel()}
            </span>
          </div>
        )}

        {/* Address Information */}
        <div className="d-flex">
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

        {/* Order Details */}
        <div
          className="w-100 p-5 rounded-4 my-4 shadow-2"
          style={{ background: '#caf4e0' }}
        >
          <h3><i className="fa-solid fa-bag-shopping"></i> Đơn Hàng</h3>
          <h6>Khoảng cách: {distance} Km</h6>
          <h6>Thời gian vận chuyển dự tính: {duration} giờ</h6>

          {/* Product Table */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="fw-bold fs-5">STT</TableCell>
                <TableCell className="fw-bold fs-5">Sản phẩm</TableCell>
                <TableCell className="fw-bold fs-5">Số lượng</TableCell>
                <TableCell className="fw-bold fs-5 text-center">Đơn giá</TableCell>
                <TableCell className="fw-bold fs-5 text-center">Tổng tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderData.products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell className="col-1 border-black">{index + 1}</TableCell>
                  <TableCell className="col-6 border-black">{product.ProductName}</TableCell>
                  <TableCell className="col-1 text-center border-black">{product.Quantity}</TableCell>
                  <TableCell className="col-2 text-end border-black">
                    <span className="me-4">{formatCurrency(product.Price)}</span>
                  </TableCell>
                  <TableCell className="col-2 text-end border-black">
                    <span className="me-4">{formatCurrency(product.Total)}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Price Breakdown */}
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="fw-bold fs-5 text-end border-black">Tổng tiền hàng:</TableCell>
                <TableCell className="fw-bold fs-6 text-end col-2 border-black">
                  <span className="me-4">{formatCurrency(orderData.order.TotalAmount)}</span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="fw-bold fs-5 text-end border-black">Phí vận chuyển:</TableCell>
                <TableCell className="fw-bold fs-6 text-end col-2 border-black">
                  <span className="me-4">{formatCurrency(orderData.order.ShippingFee || calculateShippingFee())}</span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="fw-bold fs-5 text-end border-black">Tiền cọc yêu cầu:</TableCell>
                <TableCell className="fw-bold fs-6 text-end col-2 border-black">
                  <span className="me-4">{formatCurrency(orderData.order.Deposit || 0)}</span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="fw-bold fs-4 text-end border-black">
                  Tổng thanh toán (
                  {orderData.order.PaymentStatus === 'PrePaid' ? 'Đã thanh toán trước' : 'Thu từ khách hàng'}):
                </TableCell>
                <TableCell className="fw-bold fs-5 text-end col-2 border-black">
                  <span className={`me-4 ${orderData.order.PaymentStatus === 'PrePaid' ? 'text-success' : ''}`}>
                    {formatCurrency(getPaymentAmount())}
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Action Buttons */}
        <div
          className="w-100 p-5 rounded-4 d-flex justify-content-between"
          style={{ background: '#caf4e0' }}
        >
          <BackButton />
          {renderOrderActions()}
        </div>

        {/* Map */}
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