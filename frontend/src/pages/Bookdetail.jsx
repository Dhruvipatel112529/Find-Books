import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../pages-css/Bookdetail.css";
import { Navbar } from "../components/Navbar";
import { FaStar } from "react-icons/fa";
import Cookies from "js-cookie";

export const Bookdetail = () => {
    const location = useLocation();
    const Navigate = useNavigate();
    const { bookid, book } = location.state || {}; // Handle if state is undefined
    
    const [rating, setRating] = useState(0);

    const addtocart = async (event) => {
            event.stopPropagation(); // Prevents the book card click event from triggering
            const token = Cookies.get('token');
            if(!token){
                Navigate("/login");
            }
            else{
                try {
                    const response = await fetch("http://localhost:2606/api/Cart", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ book_id: book._id, cart_quantity: 1 }),
                        credentials: "include",
                    });
    
                    const data = await response.json();
    
                    if (!response.ok) throw new Error(data.message || "Failed to add to cart");
    
                    Navigate("/cart"); // Redirect to cart page on success
                } catch (error) {
                    console.error("Error adding to cart:", error.message);
                }
            }
        };

    const addRatings = async (currentRating,book) => {
        setRating(currentRating);
            try{
            const response = await fetch("http://localhost:2606/api/Ratings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ book_id: book._id, rate:currentRating}),
                credentials: "include",
            });

            const data = response.json();

            if (!response.ok) throw new Error(data.message || "Failed to add to rating");
        }catch (error) {
            console.error("Error to adding ratings:", error.message);
        }
    };

    return (
        <>
            <Navbar />
            <div className="bookdetails-maincontainer"> 
                <div className="bookdetails-container">
                    <div className="book-img">
                        <img src={`http://localhost:2606/${book?.BookImageURL}`} alt={book?.BookName} />
                    </div>
                    <div className="book-data">
                        <h2 className="book-name">{book?.BookName}</h2>
                        <p><b>Author :</b> {book?.Author}</p>
                        <p><b>Edition :</b> {book?.Edition}</p>
                        <p><b>Publication Date :</b> {book?.Publication_Date}</p>
                        <p><b>Publisher :</b> {book?.Publisher}</p>
                        <p><b>Description :</b> {book?.Description}</p>

                        {/* Rating System */}
                        <div className="rating-container">
                            <b>Rate this book : </b>&nbsp;
                            {[...Array(5)].map((_, index) => {
                                const currentRating = index + 1;
                                return (
                                    <FaStar
                                        key={index}
                                        className="star"
                                        size={24}
                                        color={currentRating <= rating ? "#ffc107" : "#e4e5e9"}
                                        onClick={() => {addRatings(currentRating,book)}}
                                    />
                                ); 
                            })}
                        </div>

                        <div className="price-btn">
                            <div className="price">
                                <p><b>Price:</b> ₹{book?.Price}</p>
                            </div>   
                            <button className="buynow-btn" onClick={addtocart}>Buy Now</button>
                            <button className="addtocart-btn" onClick={addtocart}>Add To Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};