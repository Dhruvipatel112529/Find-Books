import React, { useState } from "react";
import "../pages-css/Useraddress.css"; // Import the CSS file
import {useNavigate } from "react-router-dom";
import { useCart } from "../Context/order";

export const Useraddress = () => {
    const Navigate = useNavigate();
    const { cartData } = useCart();
    const [order, setOrder] = useState({});

    console.log("cccccc",cartData)
    const [formData, setFormData] = useState({
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:2606/api/Order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    cartid:cartData.cartid,
                    // totalamount: cartData.totalamount
                }),
                credentials: "include"
            });

            const json = await response.json();

            if (json.order) {
                setOrder(json.order)
                alert("Address saved successfully!");
                Navigate("/payment", { state: { total: cartData.totalamount, address: json.order, cartDatas: cartData }});
            } else {
                alert(json.message || "Address not added");
                Navigate("/cart");
            }
        } catch (error) {
            alert("An error occurred. Please try again later.");
            console.error("Error occurred during submission:", error);
        }
    };    

    return (
        <form onSubmit={handleSubmit} className="address-form">
            <div className="form-group">
                <label htmlFor="address">Address:</label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    className="form-input"
                    value={formData.address}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="city">City:</label>
                <input
                    type="text"
                    id="city"
                    name="city"
                    className="form-input"
                    value={formData.city}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="state">State:</label>
                <input
                    type="text"
                    id="state"
                    name="state"
                    className="form-input"
                    value={formData.state}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="country">Country:</label>
                <input
                    type="text"
                    id="country"
                    name="country"
                    className="form-input"
                    value={formData.country}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="pincode">Pincode:</label>
                <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    className="form-input"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit" className="submit-btn" >Submit</button>
        </form>
    );
};