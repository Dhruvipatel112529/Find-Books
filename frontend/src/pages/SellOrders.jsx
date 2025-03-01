import React from "react";
import { Navbar } from "../components/Navbar"; // Adjust based on your structure
import "../pages-css/SellOrder.css";
import { ProfileMenu } from "../components/ProfileMenu";
import { useState, useEffect } from "react";

export const SellOrders = () => {
  const [books, setBooks] = useState([]);

  useEffect(()=>{
    const getSellOrder = async () => {
        try{
            const response = await fetch("http://localhost:2606/api/SellOrders", {
                credentials: "include",
            });

            const json = await response.json();
            
           const  books = Array.isArray(json.books) ? json.books : [];
            setBooks(books);
            
        }catch(error){
            console.error("Error fetching SellOrder data:", error);
        }
    };

    getSellOrder();
  },[])

  return (
    <>
      <Navbar />
      <div className="sell-orders-container">
        <ProfileMenu />
        <div className="sell-orders-page">
          <div className="sell-orders-header">My Sell Orders</div>
          <div className="sell-orders-list">
            {books.length > 0 ? (
              books.map((book) => (
                <div key={book._id} className="sell-order-card">
                  <h2>{book.BookName}</h2>
                  <img
                    src={`http://localhost:2606/${book.BookImageURL}`}
                    alt={book.BookName}
                    className="img"
                  />
                  <p>
                    <strong>Order Date:</strong> {}
                  </p>
                  <p>
                    <strong>Buyer:</strong> {}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                     <span className={status}> {/*${order.status.toLowerCase()} */}
                     {/* {order.status} */}
                    </span>
                  </p>
                </div>
              ))
            ) : (
              <p className="no-sell-orders">No sell orders to display.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}; 