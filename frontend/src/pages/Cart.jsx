import React, { useState, useEffect } from "react";
import "../pages-css/Cart.css";
import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/order";


export const Cart = () => {
    const [carts, setCarts] = useState([]);
    const [bookdetail, setBookdetail] = useState([]);
    const [quantities, setQuantities] = useState({});
    const Navigate = useNavigate();
    const { setCartData } = useCart();

    const handleRemoveItem = async (bookid) => {
        try {
            const response = await fetch("http://localhost:2606/api/Cart", {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ book_id: bookid }),
                credentials: 'include',
            });

            const json = await response.json();
            if (json.cart.cart_quantity === 0) { 
                clearcart();
            }


            if (response.ok) {
                alert('Item removed from the cart');
                setCarts(json.cart);
                setBookdetail(json.books);
            } else {
                alert('Failed to remove item');
            }
        } catch (error) {
            console.error('Error removing item:', error);
            alert('An error occurred while removing the item');
        }
    };


    const getTotalPrice = () => {
        return bookdetail.reduce((total, item) => {
            return total + item.Price * (quantities[item._id] || 1); 
        }, 0);
    };

    useEffect(() => {
        const fetchCarts = async () => {
            try {
                const response = await fetch("http://localhost:2606/api/Cart", {
                    credentials: "include",
                });
                const json = await response.json();
                setCarts(json.cart);
                setBookdetail(json.books);

                // Store updated quantities in state
                const quantityMap = {};
                json.cart.forEach((cartItem) => {
                    cartItem.books.forEach((book) => {
                        quantityMap[book.book_id] = book.book_quantity;
                    });
                });
                setQuantities(quantityMap); // Update state with latest values
            } catch (error) {
                console.error("Error fetching book data:", error);
            }
        };
        fetchCarts();
    }, []);


    const handleQuantityChange = async (bookid, action) => {
        try {
            const response = await fetch("http://localhost:2606/api/updatequantity", {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ book_id: bookid, action }),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error("Failed to update quantity");
            }

            const json = await response.json();
            setCarts(json.cart);
            setBookdetail(json.books);

            // Update quantity state from backend response
            const updatedQuantities = {};
            json.cart.books.forEach(book => {
                updatedQuantities[book.book_id] = book.book_quantity;
            });
            setQuantities(updatedQuantities);
        } catch (error) {
            console.error("Error updating quantity:", error);
            alert("An error occurred while updating the quantity");
        }
    };



    const clearcart = async() => {
        try {
            const response = await fetch("http://localhost:2606/api/Cart", {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            const json = await response.json();

            if (response.ok) {
                alert('Cart cleared successfully');
                setCarts(json.cart);
                setBookdetail(json.books);
            } else {
                alert('Failed');
            }
        } catch (error) {
            console.error('Error removing item:', error);
            alert('An error occurred while removing the item');
        }
    }

    const checkout = async () => {
        try {
            const cartid = carts.length > 0 ? carts[0]._id : null;
            const totalamount = getTotalPrice();

            // Save cartid and totalamount in context
            setCartData({ cartid, totalamount, bookdetail });

            // Navigate to the UserAddress page
            Navigate("/Useraddress");
        } catch (error) {
            alert("An error occurred. Please try again later.");
            console.error("Error occurred during submission:", error);
        }
    };


    return (
        <>
            <Navbar flag={true}/>
            <div className="cart-container">
                <h1 className="cart-title">Shopping Cart</h1>
                {carts.length === 0 ? (
                    <p className="empty-cart">Your cart is empty!</p>
                ) : (
                    <>
                        <div className="cart-items">
                            {bookdetail.map((item) => {
                                const quantity = quantities[item._id] || 1;
                                return (
                                    <div key={item._id} className="cart-item">
                                        {item && (
                                            <>
                                                {item.Isoldbook==true?"Resell":"New"}
                                                <img
                                                    src={`http://localhost:2606/${item.BookImageURL}`}
                                                    alt={item.BookName}
                                                    className="img"
                                                />
                                                <div className="item-details">
                                                    <b>{item.BookName}</b>
                                                    <p>
                                                        Price: <b>₹{item.Price}</b>
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                        <div className="item-actions">
                                            <label>Quantity:</label>
                                            <div className="quantity">
                                                <button
                                                    onClick={() => handleQuantityChange(item._id, "D")}
                                                    disabled={item.Isoldbook}
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="text"
                                                    min="1"
                                                    value={quantities[item._id] || 1} // Fetch updated quantity from state
                                                    readOnly
                                                />
                                                <button
                                                    onClick={() => handleQuantityChange(item._id, "I")}
                                                    disabled={item.Isoldbook}
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                className="remove-button"
                                                onClick={() => handleRemoveItem(item._id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="cart-summary">
                                <h2>Total: ₹{getTotalPrice()}</h2>
                                <button className="remove-button" onClick={clearcart}>Clear Cart</button>
                            <button
                                className="checkout-button"
                                onClick={checkout}
                            >
                                Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};