import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../pages-css/Bookdetail.css";
import { Navbar } from "../components/Navbar";
import { FaStar, FaShoppingCart, FaCheckCircle, FaBookOpen, FaCalendarAlt, FaUser, FaBuilding, FaInfoCircle, FaTag, FaBookmark } from "react-icons/fa";
import Cookies from "js-cookie";

export const Bookdetail = () => {
    const location = useLocation();
    const Navigate = useNavigate();
    const { bookid, book } = location.state || {}; // Handle if state is undefined
    
    const [rating, setRating] = useState(0);
    const [isNewRelease, setIsNewRelease] = useState(false);

    useEffect(() => {
        // Check if book is a new release (published within last 30 days)
        if (book?.Publication_Date) {
            const publicationDate = new Date(book.Publication_Date);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            setIsNewRelease(publicationDate > thirtyDaysAgo);
        }

        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, [book]);

    const addtocart = async (event) => {
        event.preventDefault(); // Prevent default behavior
        event.stopPropagation(); // Prevents the book card click event from triggering
        const token = Cookies.get('token');
        if (!token) {
            Navigate("/login");
        } else {
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

    const buynow = async (event) => {
        event.preventDefault(); // Prevent default behavior
        event.stopPropagation(); // Prevents the book card click event from triggering
        const token = Cookies.get('token');
        if (!token) {
            Navigate("/login");
        } else {
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

    const addRatings = async (currentRating) => {
        setRating(currentRating);
        try {
            const response = await fetch("http://localhost:2606/api/Ratings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ book_id: book._id, rate: currentRating }),
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to add rating");
        } catch (error) {
            console.error("Error adding ratings:", error.message);
        }
    };

    // Function to format date as DD-MM-YYYY
    const formatDate = (isoDate) => {
        if (!isoDate) return "";
        const dateObj = new Date(isoDate);
        return `${dateObj.getDate().toString().padStart(2, "0")}-${(dateObj.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${dateObj.getFullYear()}`;
    };

    if (!book) {
        return (
            <>
                <Navbar />
                <div className="bookdetails-maincontainer">
                    <div className="bookdetails-container">
                        <p>Book details not found. Please go back to the home page.</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="bookdetails-maincontainer"> 
                <div className="bookdetails-container">
                    <div className="book-img">
                        <img src={`http://localhost:2606/${book.BookImageURL}`} alt={book.BookName} />
                    </div>
                    <div className="book-data">
                        <div className="book-badges">
                            {isNewRelease && <span className="badge badge-new"><FaCheckCircle /> New Release</span>}
                            {book.Isoldbook ? 
                                <span className="badge badge-bestseller"><FaBookmark /> Pre-owned</span> : 
                                <span className="badge badge-bestseller"><FaTag /> New</span>
                            }
                        </div>
                        
                        <h2 className="book-name">{book.BookName}</h2>
                        
                        <div className="book-info-grid">
                            <p><b><FaUser /> Author</b> {book.Author}</p>
                            <p><b><FaBookOpen /> Edition</b> {book.Edition || "Standard"}</p>
                            <p><b><FaCalendarAlt /> Published</b> {formatDate(book.Publication_Date)}</p>
                            <p><b><FaBuilding /> Publisher</b> {book.Publisher}</p>
                        </div>
                        
                        <div className="book-description">
                            <h3><FaInfoCircle /> About this book</h3>
                            <p>{book.Description || "No description available for this book."}</p>
                        </div>

                        {/* Rating System */}
                        <div className="rating-container">
                            <b>Rate this book:</b>
                            {[...Array(5)].map((_, index) => {
                                const currentRating = index + 1;
                                return (
                                    <FaStar
                                        key={index}
                                        className="star"
                                        size={20}
                                        color={currentRating <= rating ? "#ffc107" : "#e4e5e9"}
                                        onClick={() => addRatings(currentRating)}
                                    />
                                ); 
                            })}
                        </div>

                        <div className="price-btn">
                            <div className="price">
                                <p><b>Price: </b><span className="price-tag">₹{book.Price}</span></p>
                            </div>   
                            <button className="buynow-btn" onClick={buynow}>
                                <FaCheckCircle /> Buy Now
                            </button>
                            <button className="addtocart-btn" onClick={addtocart}>
                                <FaShoppingCart /> Add To Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
