import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
} from "@mui/material";
import { Button } from "react-bootstrap"; // Bootstrap button
import "bootstrap/dist/css/bootstrap.min.css";
import { format } from "date-fns";
import MapBox from "../../common/mapbox";
import Header from "../../header/Header";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [shop, setShop] = useState({});
  const [customer, setCustomer] = useState({});
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [addresses, setAddresses] = useState({ delivery: "", shop: "" });

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/getOrderDetails/${id}`
        );
        setOrder(response.data.order);
        setShop(response.data.shop);
        setCustomer(response.data.customer);
        setProducts(response.data.products);
        setAddresses([
          response.data.order.DeliveryAddress,
          response.data.shop.Address,
        ]);
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

  return (
    <div>
      <div className="header">
        <Header />
      </div>
      <div style={{ padding: "5rem 10rem",margin: "100px", background: "rgb(245,245,245)"}}>
        <h2 className="text-center mb-5">Thông Tin đơn Hàng</h2>
        <div className="d-flex">
          <div
            className="w-100 p-5 bg-white d-flex justify-content-between rounded-start-4"
            
          >
            <div className="">
              <h5>Địa Chỉ Lấy Hàng</h5>
              <p>
                <strong>{shop.ShopName}</strong>
              </p>
              <p>(+84) {shop.PhoneNumber}</p>
              <p>{shop.Address}</p>
            </div>
          </div>
          <div className="w-100 bg-white p-5 rounded-end-4">
            <div className="">
              <h5>Địa Chỉ Nhận Hàng</h5>
              <p>
                <strong>{customer.FullName}</strong>
              </p>
              <p>(+84) {customer.PhoneNumber}</p>
              <p>{order.DeliveryAddress}</p>
              <span className="" style={{ fontSize: "14px", color: "gray" }}>
                {" "}
                ( Ngày nhận hàng dự kiến:{" "}
                {format(
                  new Date(
                    order.EstimatedDeliveryTime === undefined
                      ? null
                      : order.EstimatedDeliveryTime
                  ),
                  "MMMM dd, yyyy hh:mm:ss a"
                )}{" "}
                )
              </span>
            </div>
          </div>
        </div>
        <div className="w-100 bg-white p-5 rounded-4 my-2">
          <div className="">
            <h3>Đơn Hàng</h3>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="fw-bold fs-5">No </TableCell>
                  <TableCell className="fw-bold fs-5">Product </TableCell>
                  <TableCell className="fw-bold fs-5">Quantity </TableCell>
                  <TableCell className="fw-bold fs-5">Price </TableCell>
                  <TableCell className="fw-bold fs-5">Totall </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell className="col-1">{index + 1}</TableCell>
                    <TableCell className="col-6">
                      {product.ProductName}
                    </TableCell>
                    <TableCell className="col-1">{product.Quantity}</TableCell>
                    <TableCell className="col-1">{product.Price} $</TableCell>
                    <TableCell className="col-1">{product.Total} $</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="fw-bold fs-5 text-end ">
                    Totall:{" "}
                  </TableCell>
                  <TableCell className="fw-bold fs-6 text-end col-2 ">
                    {" "}
                    <span className="me-4">{totalPrice} $</span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="fw-bold fs-5 text-end ">
                    Shipping Fee:{" "}
                  </TableCell>
                  <TableCell className="fw-bold fs-6 text-end col-2">
                    {" "}
                    <span className="me-4">234asdsad $</span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="fw-bold fs-4 text-end ">
                    Total amount:{" "}
                  </TableCell>
                  <TableCell className="fw-bold fs-5 text-end col-2">
                    {" "}
                    <span className="me-4">234asdsad $</span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="w-100 bg-white p-5 rounded-4 d-flex justify-content-end">
          <Button variant="success" size="lg">
            Xác Nhận
          </Button>
        </div>
        <div>
          <MapBox addressData={addresses}></MapBox>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
