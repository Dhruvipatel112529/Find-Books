import { useNavigate } from "react-router-dom";
import "../components-css/Bookcard.css";
import Cookies from "js-cookie";

export const Bookcard = ({ book }) => {
    const navigate = useNavigate();

    const navigateToBookDetail = () => {
            navigate("/bookdetail", { state: { bookid: book._id, book } });
    };

    const handleAddToCart = async (event) => {
        event.stopPropagation(); // Prevents the book card click event from triggering
        const token = Cookies.get('token');
        if(!token){
            navigate("/login");
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

                navigate("/cart"); // Redirect to cart page on success
            } catch (error) {
                console.error("Error adding to cart:", error.message);
            }
        }
    };

    return (
        <div className="book-card-container" onClick={navigateToBookDetail}>
            <div className="book-card">
                <div className="book-card-box">
                    <div className="book-card-contant">
                        {book.Isoldbook ? <div className="old-lable">Resell</div> : <div className="lable">New</div>}
                        <div className="book-img">
                            <img src={`http://localhost:2606/${book.BookImageURL}`} alt={book.BookName} />
                        </div>
                        <div className="book-detail">
                            <h2 className="book-name">
                                {book.BookName.length > 15 ? book.BookName.slice(0, 15) + "..." : book.BookName}
                            </h2>
                            <p className="book-text">{book.Author}</p>
                            <p className="book-text">Price: ₹<b>{book.Price}</b></p>
                            <button className="book-btn" onClick={handleAddToCart}>Add To Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
