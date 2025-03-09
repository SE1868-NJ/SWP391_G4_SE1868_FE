import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { Card } from "react-bootstrap";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import axios from "axios";

// const orders = [
//     { "OrderID": 1, "OrderStatus": "Cancelled", "ShippingFee": 46200.00, "ActualDeliveryTime": "2025-01-15T02:07:10.000Z" },
//     { "OrderID": 2, "OrderStatus": "InProgress", "ShippingFee": 45040.00, "ActualDeliveryTime": null },
//     { "OrderID": 3, "OrderStatus": "Delivered", "ShippingFee": 38000.00, "ActualDeliveryTime": "2025-02-10T02:07:55.000Z" },
//     { "OrderID": 4, "OrderStatus": "Delivered", "ShippingFee": 51000.00, "ActualDeliveryTime": "2025-02-20T02:07:55.000Z" },
//     { "OrderID": 5, "OrderStatus": "Delivered", "ShippingFee": 45040.00, "ActualDeliveryTime": "2025-03-03T02:07:55.000Z" }
// ];


const Revenue = () => {
    const pieChartRef = useRef(null);
    const barChartRef = useRef(null);
    const pieChartInstance = useRef(null);
    const barChartInstance = useRef(null);
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
    };
    const [orders, setOrders] = useState([]);
    const [labels, setLabels] = useState([]);
    const [data, setData] = useState([]);
    const [statusCounts, setStatusCounts] = useState({});
    const [totalRevenue, setTotalRevenue] = useState(0);
    //const totalRevenue = orders.reduce((acc, order) => acc + order.ShippingFee, 0);
    const id = localStorage.getItem("shipperId");

    useEffect(() => {
        const fetchAllOrders = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/get-all-my-delivery-orders/" + id);
                setOrders(response.data.orders);
                
                return response.data.orders;
            } catch (error) {
                console.error("Error fetching orders:", error);
                return [];
            }
        };

        fetchAllOrders();
    }, []);

    useEffect(() => {
            const newTotalRevenue = orders.reduce((acc, order) => acc + Number( order.ShippingFee), 0);
                setTotalRevenue(newTotalRevenue);

    }, [orders]);

    useEffect(() => {
        if (orders.length > 0) {
            const newStatusCounts = orders.reduce((acc, order) => {
                acc[order.OrderStatus] = (acc[order.OrderStatus] || 0) + 1;
                return acc;
            }, {});
            setStatusCounts(newStatusCounts);
    
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const shippingFeeByMonth = orders.reduce((acc, order) => {
                if (order.ActualDeliveryTime) {
                    try {
                        let dateObject;
    
                        dateObject = new Date(order.ActualDeliveryTime);
    
                        if (isNaN(dateObject.getTime())) {
                            const dateParts = order.ActualDeliveryTime.split(" ");
                            if (dateParts.length === 2) {
                                const [date, time] = dateParts;
                                const [year, month, day] = date.split("-").map(Number);
                                const [hours, minutes, seconds] = time.split(":").map(Number);
                                dateObject = new Date(year, month - 1, day, hours, minutes, seconds);
                            } else {
                                console.warn("Invalid date format for order:", order.ActualDeliveryTime);
                                return acc;
                            }
                        }
    
                        if (!isNaN(dateObject.getTime())) {
                            const monthIndex = dateObject.getMonth();
                            const fee = parseFloat(order.ShippingFee) || 0;
                            acc[months[monthIndex]] = (acc[months[monthIndex]] || 0) + fee;
                        } else {
                            console.warn("Invalid date for order:", order.ActualDeliveryTime);
                        }
                    } catch (error) {
                        console.error("Error parsing date for order:", order, error);
                    }
                }
                return acc;
            }, {});
    
            setLabels(months);
            setData(months.map(month => shippingFeeByMonth[month] || 0));
        }
    }, [orders]);

    useEffect(() => {
        if (pieChartInstance.current) pieChartInstance.current.destroy();
        if (barChartInstance.current) barChartInstance.current.destroy();

        if (pieChartRef.current && Object.keys(statusCounts).length > 0) {
            pieChartInstance.current = new Chart(pieChartRef.current, {
                type: "pie",
                data: {
                    labels: Object.keys(statusCounts),
                    datasets: [{
                        data: Object.values(statusCounts),
                        backgroundColor: ["#FF4F00", "#0b8ced", "#46e500"]
                    }]
                }
            });
        }

        if (barChartRef.current && labels.length > 0 && data.length > 0) {
            barChartInstance.current = new Chart(barChartRef.current, {
                type: "bar",
                data: {
                    labels,
                    datasets: [{
                        label: "Shipping Fee (VND)",
                        data,
                        backgroundColor: "#0b8ced"
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function (value) {
                                    return formatCurrency(value); 
                                }
                            }
                        }
                    }
                }
            });
        }
        return () => {
            pieChartInstance.current?.destroy();
            barChartInstance.current?.destroy();
        };
    }, [statusCounts, labels, data]);

    return (
        <div>
            <Header />
            <h1 className="text-center mt-3">Revenue</h1>
            <div className="container d-block">
                <div className="shadow-sm rounded-3 p-4 mb-4 d-flex" style={{ backgroundColor: "#cdf4e1" }} id="revenue">
                    <div className="w-50 text-center">
                        <span className="fs-1 font-bold">{orders.length}</span>
                        <h5>Orders</h5>
                    </div>
                    <div className="w-50 text-center" >
                        <span className="fs-1 font-bold">{formatCurrency(totalRevenue)}</span>
                        <h5>Total Revenue</h5>
                    </div>
                </div>
                <div className="d-flex w-100">
                    <div className="shadow-sm rounded-3 w-75 me-4" style={{ backgroundColor: "#cdf4e1" }}>
                        <div className="p-4">
                            <h2 className="text-xl font-bold mb-4">Shipping Fee by Month</h2>
                            <div style={{ height: "300px" }}>
                                <canvas ref={barChartRef}></canvas>
                            </div>
                        </div>
                    </div>

                    <div className="shadow-sm rounded-3" style={{ backgroundColor: "#cdf4e1" }}>
                        <div className="p-4">
                            <h2 className="text-xl font-bold mb-4">Order Overview</h2>
                            <div style={{ height: "300px" }}>
                                <canvas ref={pieChartRef}></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Revenue;
