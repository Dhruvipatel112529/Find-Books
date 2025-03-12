import React, { useState, useEffect } from "react";
import "../pages-css/DeliveryDashboard.css";
import { useNavigate } from "react-router-dom";
import { GoArrowRight, GoArrowLeft } from "react-icons/go";

export const DeliveryDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState([]);
    const [payment, setPayment] = useState([]);
    const [deliveryperson, setDeliveryperson] = useState(null);
    const [showCompleted, setShowCompleted] = useState(false);

    const navigate = useNavigate();

    console.log("Orders:", orders, "User:", user, "Payment:", payment);

    const updateStatus = (order) => {
        navigate("/deliverydetail", { state: { order, user, payment } });
    };

    useEffect(() => {
        const getOrders = async () => {
            try {
                const response = await fetch("http://localhost:2606/api/Orders", {
                    credentials: "include",
                });
                const json = await response.json();
                setOrders(json.orders || []);
                setUser(json.user || []);
                setPayment(json.payment || []);
                setDeliveryperson(json.delivery);
            } catch (error) {
                alert("An error occurred. Please try again later.");
                console.error(error);
            }
        };

        getOrders();
    }, []);

    const filteredOrders = showCompleted
        ? orders.filter(order => order.Order_Status === "Delivered" && order.Delivery_User_id === deliveryperson)
        : orders.filter(order => order.Order_Status === "Shipped");

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Delivery Dashboard</h1>
            <div className="stats-container">
                <div className="card">
                    <p className="card-title">Completed Deliveries</p>
                    <p className="card-value">
                        {orders.filter(order => order.Order_Status === "Delivered" && order.Delivery_User_id === deliveryperson).length}
                    </p>
                </div>
                <div className="card" onClick={() => setShowCompleted(!showCompleted)} style={{ cursor: "pointer" }}>
                    <b><p className="card-title">{showCompleted ? "Pending Deliveries" : "Completed Deliveries"}</p></b>
                    <b><p className="card-value">{showCompleted ? <GoArrowRight /> : <GoArrowLeft />}</p></b>
                </div>
                <div className="card">
                    <p className="card-title">Pending Deliveries</p>
                    <p className="card-value">{orders.filter(order => order.Order_Status === "Shipped").length}</p>
                </div>
            </div>
            <div className="orders-container">
                <h2 className="orders-title">{showCompleted ? "Completed Orders" : "Pending Orders"}</h2>
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Delivery Address</th>
                            <th>Status</th>
                            <th>Amount</th>
                            {!showCompleted && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order._id}>
                                <td>{order.Address}</td>
                                <td>{order.Order_Status}</td>
                                <td>${order.Total_Amount}</td>
                                {!showCompleted && (
                                    <td>
                                        <button
                                            onClick={() => updateStatus(order)}
                                            className="action-button yellow"
                                        >
                                            Start Delivery
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
