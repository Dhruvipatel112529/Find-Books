import React, { useState } from 'react';
import "../pages-css/ResellerPaymentForm.css";
import { useNavigate } from 'react-router-dom';

export const ResellerPaymentForm = () => {
    
    const [paymentMethod, setPaymentMethod] = useState('');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        address: '',
        upi_id: '',
        bank_acc_no: '',
        ifsc_code: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:2606/api/ResellerPaymentForm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            const json = await response.json();
            if (json.data) {
                alert("Payment details saved successfully");
                navigate("/");
            } else {
                alert("Failed to save payment details");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="payment-details-form">
            <h2>Payment Details Form</h2>

            <label>Address</label>
            <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
            />

        <label>Payment Method</label>
            <select className="payment-method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} required>
                <option value="">Select Payment Method</option>
                <option value="UPI">UPI</option>
                <option value="Banking Details">Banking Details</option>
            </select>

            {paymentMethod === "UPI" && (
                <>
                    <label>UPI ID</label>
                    <input
                        type="text"
                        name="upi_id"
                        value={formData.upi_id}
                        onChange={handleChange}
                        required
                    />
                </>
            )}

            {paymentMethod === "Banking Details" && (
                <>
                    <label>Bank Account Number</label>
                    <input
                        type="text"
                        name="bank_acc_no"
                        value={formData.bank_acc_no}
                        onChange={handleChange}
                        required
                    />

                    <label>IFSC Code</label>
                    <input
                        type="text"
                        name="ifsc_code"
                        value={formData.ifsc_code}
                        onChange={handleChange}
                        required
                    />
                </>
            )}

            <button type="submit" className="submit-btn">Submit</button>
        </form>
    );
};