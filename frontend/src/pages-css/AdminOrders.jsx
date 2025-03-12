import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages-css/AdminDashboard.css";

export const AdminOrders = () => {
  const [bookdata, setBookdata] = useState([]);
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await fetch("http://localhost:2606/api/Orders", {
          credentials: "include",
        });
        const json = await response.json();
        setOrders(json.orders);
      } catch (error) {
        alert("An error occurred. Please try again later.");
        console.error(error);
      }
    };

    getOrders();

    const fetchBook = async () => {
      try {
        const res = await fetch("http://localhost:2606/api/Book");
        const data = await res.json();
        setBookdata(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBook();
  }, []);

  const viewOrder = (orderdata, bookdata) => {
    const userdata = users.find((data) => data._id === orderdata.User_id);

    const filteredBooks = orderdata.books
      .map((bdata) => {
        const bookInfo = bookdata.find((data) => data._id === bdata.book_id);
        return bookInfo
          ? { ...bookInfo, book_quantity: bdata.book_quantity }
          : null;
      })
      .filter((book) => book !== null);

    setOrderDetails({ orderdata, userdata, bookdata: filteredBooks });
    navigate("/Admin/ViewOrder");
  };

  return (
    <section className="data-table">
      <h2>Completed Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders
            .filter((order) => order.Order_Status === "completed" || order.Order_Status === "cancelled" )
            .map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.User_id}</td>
                <td>{order.Order_Status}</td>
                <td>{order.Total_Amount}</td>
                <td>
                  <button
                    className="action-btn"
                    onClick={() => viewOrder(order, bookdata)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  );
};
