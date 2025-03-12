import React, { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import "../pages-css/MyOrders.css";
import { ProfileMenu } from "../components/ProfileMenu";
//import { useNavigate } from "react-router-dom";

export const MyOrders = () => {
  const [order, setOrder] = useState([]);
  const [book, setBook] = useState([]);
  //const navigate = useNavigate();

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const response = await fetch("http://localhost:2606/api/Order", {
          credentials: "include",
        });

        const json = await response.json();
        console.log(json.books);
        console.log(json.orders);

        const newOrders = Array.isArray(json.orders) ? json.orders : [];
        const newBooks = Array.isArray(json.books) ? json.books : [];
        setOrder(newOrders);
        setBook(newBooks);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchCarts();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    // Optimistically update the UI before sending the request
    setOrder((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, Order_Status: newStatus } : order
      )
    );

    try {
      const response = await fetch(
        `http://localhost:2606/api/${orderId}/Order`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");

      // Revert the UI update if the request fails
      setOrder((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                Order_Status: newStatus === "Shipped" ? "Pending" : "Shipped",
              }
            : order
        )
      );
    }
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const dateObj = new Date(isoDate);
    return `${dateObj.getDate().toString().padStart(2, "0")}-${(dateObj.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${dateObj.getFullYear()}`;
  };

  return (
    <>
      <Navbar />
      <div className="orders-container">
        <ProfileMenu />
        <div className="orders-page">
          <div className="orders-header">My Orders</div>
          <div className="orders-list">
            {order.length > 0 ? (
              order.map((orderItem) => (
                <div key={orderItem._id} className="myordercard">
            
                  <p>
                    <strong>Order Date:</strong> <span>{formatDate(orderItem.Order_Date)}</span>
                  </p>
                  <p>
                    <strong>Total Amount:</strong> <span>₹{orderItem.Total_Amount}</span>
                  </p>
                  <p>
                    <strong>Status : </strong> <span>{orderItem.Order_Status}</span>
                  </p>

                  {/* Display Books in Each Order */}
                  <div className="book-list">
                    {console.log(orderItem)}
                    {book
                      .filter(
                        (bookItem, index, self) =>
                          orderItem.books.some(
                            (orderBook) => orderBook.book_id === bookItem._id
                          ) &&
                          index ===
                            self.findIndex((b) => b._id === bookItem._id)
                      )
                      .map((bookItem) => {
                        const matchedBook = orderItem.books.find(
                          (orderBook) => orderBook.book_id === bookItem._id
                        ); // Find the correct book quantity

                        return (
                          <div key={bookItem._id} className="book-card">
                            <img
                              src={`http://localhost:2606/${bookItem.BookImageURL}`}
                              alt={bookItem.BookName}
                              className="img"
                            />
                            <h5>
                              <b>Book :</b> <span>{bookItem.BookName}</span>
                            </h5>
                            <h5>
                              <b>Price :</b> <span>₹{bookItem.Price}</span>
                            </h5>
                            {matchedBook && (
                              <h5>
                                <b>Quantity :</b> {matchedBook.book_quantity}
                              </h5>
                            )}
                          </div>
                        );
                      })}
                  </div>
                  {orderItem.Order_Status === "Cancelled" || orderItem.Order_Status === "Shipped" || orderItem.Order_Status === "Delivered" ? "" :
                  <button
                      onClick={() => updateOrderStatus(orderItem._id, "Cancelled")}
                  >
                    Cancel Order
                  </button>}
                </div>
              ))
            ) : (
              <p className="no-orders">No orders to display.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
