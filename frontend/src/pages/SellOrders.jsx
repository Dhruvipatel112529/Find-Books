import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import "../pages-css/SellOrder.css";
import { ProfileMenu } from "../components/ProfileMenu";
import { Package, Calendar, CreditCard, Truck, XCircle } from "lucide-react";
import Load from "../components/Load";

export const SellOrders = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reseller, setReseller] = useState([]);


  console.log(books, reseller)
  useEffect(() => {
    const getSellOrder = async () => {
      try {
        const response = await fetch("http://localhost:2606/api/SellOrders", {
          credentials: "include",
        });
        const json = await response.json();
        const books = Array.isArray(json.books) ? json.books : [];
        const resellerdata = Array.isArray(json.resellerdata) ? json.resellerdata : [];
        setBooks(books);
        setReseller(resellerdata)
      } catch (error) {
        console.error("Error fetching SellOrder data:", error);
      } finally {
        setLoading(false);
      }
    };

    getSellOrder();
  }, []);


  const updatestatus = async (resellerid, bookid) => {
    try {
      const response = await fetch(`http://localhost:2606/api/${"Cancelled"}/SellOrders`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resellerid: resellerid, bookid: bookid }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      setReseller((prevReseller) =>
        prevReseller.map((res) =>
          res._id === resellerid ? { ...res, Resell_Status: "Cancelled" } : res
        )
      );






    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("An error occurred while updating the quantity");
    }
  }




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
            {reseller && reseller.length > 0 ? (
              reseller.map((reseller) => (
                <div key={reseller._id} className="sell-order-card">
                  <div className="order-header">
                    <div className="order-info">
                      {books
                        .filter((data) => reseller.Book_id === data._id)
                        .map((bookdata) => (
                          <div key={bookdata._id}>
                            <div className="order-date">
                              <span>Created At</span>
                              <Calendar size={20} />
                              <span>{bookdata.createdAt ? formatDate(bookdata.createdAt) : "N/A"}</span>
                              <span>Update Date</span>
                              <Calendar size={20} />
                              <span>{bookdata.updatedAt ? formatDate(bookdata.updatedAt) : "N/A"}</span>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                    <Truck size={20} />
                    <span>{reseller.Resell_Status || "Pending"}</span>
                  </div>

                  <div className="order-books">
                    <h3>Book Details</h3>
                    {books
                      .filter((data) => reseller.Book_id === data._id)
                      .map((bookdata) => (
                        <div key={bookdata._id}>
                          <div className="book-list">
                            <div className="book-card">
                              <div className="book-image">
                                <img
                                  src={`http://localhost:2606/${bookdata.BookImageURL}`}
                                  alt={bookdata.BookName}
                                />
                              </div>
                              <div className="book-details">
                                <h4>{bookdata.BookName}</h4>
                                <p className="book-price">₹{bookdata.Price}</p>
                                <p className="book-quantity">Quantity: {bookdata.Quantity || 1}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    }

                    <p>Reseller Address: {reseller.address}</p>
                    {reseller.Resell_Status === "Pending" ? (
                      <button onClick={() => updatestatus(reseller._id, reseller.Book_id)}>
                        Cancel Sell Book
                      </button>
                    ) : ""}
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