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
import { format } from 'date-fns';
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
  const [totalPrice, setTotalPrice] = useState(0);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shipperBalance, setShipperBalance] = useState(0);

  // Calculated values
  const shippingFee = Math.round((14000 + distance * 1000) / 10) * 10;

  // Currency formatter
  const formatCurrency = (value) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/getOrderDetails/${id}`
        );

        const { order, shop, customer, products } = response.data;

        setOrderData({
          order,
          shop,
          customer,
          products,
          addresses: [order.DeliveryAddress, shop.Address]
        });

        setTotalPrice(order.TotalAmount || 0);

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
      const response = await axios.get(
        `http://localhost:4000/api/getShipperBalance/${shipperID}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setShipperBalance(response.data.balance || 0);
    } catch (error) {
      console.error('Lỗi lấy số dư:', error);
      setShipperBalance(0);
    }
  };

  // Order handling methods
  const pickOrder = async () => {
    try {
      // Lấy thông tin đơn hàng từ state orderData
      const deposit = orderData.order.Deposit || 0;

      const pickOrderData = {
        OrderID: id,
        ShipperID: shipperID,
        ShippingFee: shippingFee,
        Deposit: deposit, // Sử dụng deposit từ state
        EstimatedDeliveryTime: dayjs()
          .add(duration * 60 + 60, 'minutes')
          .format('YYYY-MM-DD HH:mm:ss'),
      };

      try {
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
    } catch (error) {
      console.error('Chi tiết lỗi:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi Hệ Thống',
        text: 'Đã có lỗi không mong muốn xảy ra'
      });
    }
  };

  const confirmOrder = async (status) => {
    try {
      let failureReason = null;

      // Lấy các giá trị tiền từ order
      const depositValue = parseFloat(orderData.order.Deposit || 0).toFixed(2);
      const calculatedShippingFee = parseFloat((14000 + distance * 1000).toFixed(2));

      console.log('Deposit Value:', depositValue);
      console.log('Calculated Shipping Fee:', calculatedShippingFee);
      console.log('Distance:', distance);

      // Hiển thị popup chọn lý do nếu giao hàng thất bại
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

        if (result.dismiss) {
          return; // Người dùng hủy popup
        }

        failureReason = result.value;
      }

      // Chuẩn bị dữ liệu gửi lên server
      const confirmData = {
        OrderID: id,
        Status: status,
        Deposit: Number(depositValue),
        ShippingFee: Number(calculatedShippingFee),
        FailureReason: failureReason
      };

      console.log('Dữ liệu xác nhận đơn hàng:', confirmData);

      // Gọi API xác nhận đơn hàng
      const response = await axios.put('http://localhost:4000/api/confirm-delivery-order', confirmData);

      console.log('Phản hồi xác nhận đơn hàng:', response.data);

      // Xử lý kết quả
      if (status === 'Delivered') {
        // Giao hàng thành công - hiện thông báo hoàn tiền cọc và phí ship
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
        // Giao hàng thất bại
        if (failureReason === 'shipper_error') {
          // Lỗi do shipper - không hoàn tiền
          Swal.fire({
            icon: 'warning',
            title: 'Giao Hàng Thất Bại',
            text: 'Đơn hàng giao thất bại do lỗi của Shipper. Bạn sẽ không được hoàn tiền cọc.',
            confirmButtonText: 'Xác Nhận'
          }).then(() => {
            window.location.href = '/dashboard';
          });
        } else {
          // Lỗi do khách hàng hoặc khác - hoàn tiền cọc
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
      console.error('Chi tiết lỗi khi xác nhận đơn hàng:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });

      Swal.fire({
        icon: 'error',
        title: 'Đã xảy ra lỗi',
        text: error.response?.data?.message || 'Không thể xác nhận đơn hàng',
        footer: `Mã lỗi: ${error.response?.status || 'Không xác định'}`
      });
    }
  };

  // Utility methods
  // Utility methods
  const getPaymentAmount = () => {
    console.log('Payment Status:', orderData.order.PaymentStatus);
    console.log('Total Price:', totalPrice);
    console.log('Shipping Fee:', shippingFee);

    if (orderData.order.PaymentStatus === 'PrePaid') {
      return 0;
    }

    // Trả về tổng tiền hàng + phí ship cho trạng thái PostPaid
    return totalPrice + shippingFee;
  };

  const getPaymentStatusLabel = () =>
    orderData.order.PaymentStatus === 'PrePaid'
      ? 'Trả trước'
      : 'Trả sau';

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
      <div className='header'><Header /></div>
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
              <h5>
                <i className="fa-solid fa-shop"></i> Địa Chỉ Lấy Hàng
              </h5>
              <h5>
                <strong>
                  <i className="fa-solid fa-user"></i> {orderData.shop.ShopName}
                </strong>
              </h5>
              <span>
                <i className="fa-solid fa-phone"></i> (+84) {orderData.shop.PhoneNumber}
              </span>
              <br />
              <span>
                <i className="fa-solid fa-location-dot"></i> {orderData.shop.Address}
              </span>
            </div>
          </div>
          <div
            className="w-100 p-5 rounded-end-4"
            style={{ background: '#caf4e0' }}
          >
            <div>
              <h5>
                <i className="fa-solid fa-house"></i> Địa Chỉ Nhận Hàng
              </h5>
              <h5>
                <strong>
                  <i className="fa-solid fa-user"></i> {orderData.customer.FullName}
                </strong>
              </h5>
              <span>
                <i className="fa-solid fa-phone"></i> (+84) {orderData.customer.PhoneNumber}
              </span>
              <br />
              <span>
                <i className="fa-solid fa-location-dot"></i> {orderData.order.DeliveryAddress}
              </span>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div
          className="w-100 p-5 rounded-4 my-4 shadow-2"
          style={{ background: '#caf4e0' }}
        >
          <h3>
            <i className="fa-solid fa-bag-shopping"></i> Đơn Hàng
          </h3>
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
                <TableCell className="fw-bold fs-5 text-end border-black">
                  Tổng tiền hàng:
                </TableCell>
                <TableCell className="fw-bold fs-6 text-end col-2 border-black">
                  <span className="me-4">{formatCurrency(totalPrice)}</span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="fw-bold fs-5 text-end border-black">
                  Phí vận chuyển:
                </TableCell>
                <TableCell className="fw-bold fs-6 text-end col-2 border-black">
                  <span className="me-4">{formatCurrency(shippingFee)}</span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="fw-bold fs-5 text-end border-black">
                  Tiền cọc yêu cầu:
                </TableCell>
                <TableCell className="fw-bold fs-6 text-end col-2 border-black">
                  <span className="me-4">
                    {formatCurrency(orderData.order.Deposit || 0)}
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="fw-bold fs-4 text-end border-black">
                  Tổng thanh toán (
                  {orderData.order.PaymentStatus === 'PrePaid'
                    ? 'Đã thanh toán trước'
                    : 'Thu từ khách hàng'}
                  ):
                </TableCell>
                <TableCell className="fw-bold fs-5 text-end col-2 border-black">
                  <span
                    className={`me-4 ${orderData.order.PaymentStatus === 'PrePaid'
                      ? 'text-success'
                      : ''
                      }`}
                  >
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