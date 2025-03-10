import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import "../pages-css/SellOrder.css";
import { ProfileMenu } from "../components/ProfileMenu";
import { Package, Calendar, CreditCard, Truck, XCircle } from "lucide-react";
import Load from "../components/Load";

export const SellOrders = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSellOrder = async () => {
      try {
        const response = await fetch("http://localhost:2606/api/SellOrders", {
          credentials: "include",
        });
        const json = await response.json();
        const books = Array.isArray(json.books) ? json.books : [];
        setBooks(books);
      } catch (error) {
        console.error("Error fetching SellOrder data:", error);
      } finally {
        setLoading(false);
      }
    };

    getSellOrder();
  }, []);

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const dateObj = new Date(isoDate);
    return `${dateObj.getDate().toString().padStart(2, "0")}-${(dateObj.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${dateObj.getFullYear()}`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "sold":
        return "status-sold";
      case "pending":
        return "status-pending";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-default";
    }
  };

  if (loading) {
    return <Load />;
  }

  return (
    <>
      <Navbar />
      <div className="sell-orders-container">
        <ProfileMenu />
        <div className="sell-orders-page">
          <div className="sell-orders-header">
            <h1>My Sell Orders</h1>
            <p className="sell-orders-subtitle">Track and manage your book sales</p>
          </div>
          <div className="sell-orders-list">
            {books.length > 0 ? (
              books.map((book) => (
                <div key={book._id} className="sell-order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <div className="order-date">
                        <Calendar size={20} />
                        <span>{formatDate(book.Order_Date)}</span>
                      </div>
                      <div className="order-amount">
                        <CreditCard size={20} />
                        <span>₹{book.Price}</span>
                      </div>
                    </div>
                    <div className={`order-status ${getStatusColor(book.status)}`}>
                      <Truck size={20} />
                      <span>{book.status || "Pending"}</span>
                    </div>
                  </div>

                  <div className="order-books">
                    <h3>Book Details</h3>
                    <div className="book-list">
                      <div className="book-card">
                        <div className="book-image">
                          <img
                            src={`http://localhost:2606/${book.BookImageURL}`}
                            alt={book.BookName}
                          />
                        </div>
                        <div className="book-details">
                          <h4>{book.BookName}</h4>
                          <p className="book-price">₹{book.Price}</p>
                          <p className="book-quantity">Quantity: {book.Quantity || 1}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-orders">
                <Package size={48} />
                <h2>No Sell Orders Yet</h2>
                <p>Start selling books to see your orders here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}; 