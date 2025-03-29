import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {Table,Card, CardHeader, CardTitle  } from "react-bootstrap"
import { Button } from "react-bootstrap";


// Components
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import BackButton from "../../components/buttons/BackButton";
import { CardContent, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

const DeliveredOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State management
  const [orderData, setOrderData] = useState({
    order: {},
    shop: {},
    customer: {},
    products: [],
    addresses: [],
  });

  // Currency formatter
  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/getOrderDetails/${id}`
        );
        console.log("Delivered Order Details Response:", response.data);

        const { order, shop, customer, products } = response.data;

        setOrderData({
          order,
          shop,
          customer,
          products,
          addresses: [order.DeliveryAddress, shop.Address],
        });
      } catch (error) {
        console.error("Lỗi khi tải thông tin đơn hàng:", error);
        // Optionally, show an error message or redirect
        navigate("/history-delivery");
      }
    };

    fetchOrderDetails();
  }, [id, navigate]);

  // Method to get payment status label
  const getPaymentStatusLabel = () =>
    orderData.order.PaymentStatus === "PrePaid" ? "Trả trước" : "Trả sau";

  // Render method for order status badge
  const renderOrderStatusBadge = () => {
    switch (orderData.order.OrderStatus) {
      case "Delivered":
        return <span className="badge bg-success">Giao Hàng Thành Công</span>;
      case "Cancelled":
        return <span className="badge bg-danger">Giao Hàng Thất Bại</span>;
      default:
        return null;
    }
  };

  return (
    <div>
      <Header />
      <div
        className="delivered-order-details-container"
        style={{
          padding: "5rem 10rem",
          background: "rgb(245,245,245)",
          paddingTop: "120px",
        }}
      >
        <Card className="mb-4">
          <CardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <CardTitle>Chi Tiết Đơn Hàng Đã Giao</CardTitle>
              {renderOrderStatusBadge()}
            </div>
          </CardHeader>
          <CardContent>
            {/* Order Information */}
            <div className="row mb-4">
              <div className="col-md-6">
                <h5>
                  <strong>Mã Đơn Hàng:</strong> #{orderData.order.OrderID}
                </h5>
                <h5>
                  <strong>Ngày Đặt Hàng:</strong>{" "}
                  {dayjs(orderData.order.OrderDate).format(
                    "DD/MM/YYYY HH:mm:ss"
                  )}
                </h5>
                <h5>
                  <strong>Ngày Giao Hàng:</strong>{" "}
                  {dayjs(orderData.order.ActualDeliveryTime).format(
                    "DD/MM/YYYY HH:mm:ss"
                  )}
                </h5>
              </div>
              <div className="col-md-6 text-end">
                <span
                  className={`badge ${
                    orderData.order.PaymentStatus === "PrePaid"
                      ? "bg-primary"
                      : "bg-warning text-dark"
                  } fs-6 px-3 py-2`}
                >
                  Phương thức thanh toán: {getPaymentStatusLabel()}
                </span>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="row mb-4">
              <div className="col-md-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Địa Chỉ Lấy Hàng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>{orderData.shop.ShopName}</strong>
                    </p>
                    <p>
                      <i className="fa-solid fa-phone me-2"></i>
                      (+84) {orderData.shop.PhoneNumber}
                    </p>
                    <p>
                      <i className="fa-solid fa-location-dot me-2"></i>
                      {orderData.shop.Address}
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="col-md-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Địa Chỉ Giao Hàng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>
                        {orderData.customer.FullName || "Không có tên"}
                      </strong>
                    </p>
                    <p>
                      <i className="fa-solid fa-phone me-2"></i>
                      (+84) {orderData.customer.PhoneNumber}
                    </p>
                    <p>
                      <i className="fa-solid fa-location-dot me-2"></i>
                      {orderData.order.DeliveryAddress}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Product Details */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Chi Tiết Sản Phẩm</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className="fw-bold">STT</TableCell>
                      <TableCell className="fw-bold">Sản Phẩm</TableCell>
                      <TableCell className="fw-bold text-center">
                        Số Lượng
                      </TableCell>
                      <TableCell className="fw-bold text-end">
                        Đơn Giá
                      </TableCell>
                      <TableCell className="fw-bold text-end">
                        Tổng Tiền
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderData.products.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{product.ProductName}</TableCell>
                        <TableCell className="text-center">
                          {product.Quantity}
                        </TableCell>
                        <TableCell className="text-end">
                          {formatCurrency(product.Price)}
                        </TableCell>
                        <TableCell className="text-end">
                          {formatCurrency(product.Total)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Tổng Quan Tài Chính</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="fw-bold text-end">
                        Tổng Tiền Hàng:
                      </TableCell>
                      <TableCell className="text-end">
                        {formatCurrency(orderData.order.TotalAmount)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="fw-bold text-end">
                        Phí Vận Chuyển:
                      </TableCell>
                      <TableCell className="text-end">
                        {formatCurrency(orderData.order.ShippingFee)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="fw-bold text-end">
                        Tiền Cọc:
                      </TableCell>
                      <TableCell className="text-end">
                        {formatCurrency(orderData.order.Deposit || 0)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="fw-bold fs-5 text-end">
                        Tổng Thanh Toán (
                        {orderData.order.PaymentStatus === "PrePaid"
                          ? "Đã Thanh Toán Trước"
                          : "Thu Từ Khách Hàng"}
                        ):
                      </TableCell>
                      <TableCell className="fw-bold text-end">
                        <span
                          className={
                            orderData.order.PaymentStatus === "PrePaid"
                              ? "text-success"
                              : ""
                          }
                        >
                          {formatCurrency(
                            orderData.order.TotalAmount +
                              (orderData.order.ShippingFee || 0)
                          )}
                        </span>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="d-flex justify-content-between mt-4">
          <BackButton />
          <Button variant="outline-secondary" onClick={() => window.print()}>
            <i className="fa-solid fa-print me-2"></i>
            In Hóa Đơn
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DeliveredOrderDetails;
