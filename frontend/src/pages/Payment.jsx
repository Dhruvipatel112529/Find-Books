import React, { useEffect, useState } from "react";
import "../pages-css/Payment.css";
import { useLocation, useNavigate } from "react-router-dom";
import { CreditCard, Package, Truck, Shield, ArrowLeft } from "lucide-react";
import { Navbar } from "../components/Navbar";

const deliveryChargesArray = [
  { pincode: "380001", charge: 30 }, { pincode: "380002", charge: 40 },
  { pincode: "380003", charge: 35 }, { pincode: "380004", charge: 45 },
  { pincode: "380005", charge: 30 }, { pincode: "380006", charge: 50 },
  { pincode: "380007", charge: 40 }, { pincode: "380008", charge: 35 },
  { pincode: "380009", charge: 50 }, { pincode: "380013", charge: 45 },
  { pincode: "380014", charge: 40 }, { pincode: "380015", charge: 55 },
  { pincode: "380016", charge: 50 }, { pincode: "380018", charge: 35 },
  { pincode: "380019", charge: 40 }, { pincode: "380021", charge: 45 },
  { pincode: "380022", charge: 50 }, { pincode: "380023", charge: 55 },
  { pincode: "380024", charge: 60 }, { pincode: "380026", charge: 65 },
  { pincode: "380027", charge: 70 }, { pincode: "380028", charge: 75 },
  { pincode: "380050", charge: 80 }, { pincode: "380051", charge: 85 },
  { pincode: "380052", charge: 90 }, { pincode: "380054", charge: 95 },
  { pincode: "380055", charge: 100 }, { pincode: "380058", charge: 105 },
  { pincode: "380059", charge: 110 }, { pincode: "380060", charge: 115 },
  { pincode: "380061", charge: 120 }, { pincode: "380063", charge: 125 },
  { pincode: "382110", charge: 130 }, { pincode: "382115", charge: 135 },
  { pincode: "382120", charge: 140 }, { pincode: "382130", charge: 145 },
  { pincode: "382140", charge: 150 }, { pincode: "382145", charge: 155 },
  { pincode: "382150", charge: 160 }, { pincode: "382170", charge: 165 },
  { pincode: "382210", charge: 170 }, { pincode: "382213", charge: 175 },
  { pincode: "382220", charge: 180 }, { pincode: "382225", charge: 185 },
  { pincode: "382230", charge: 190 }, { pincode: "382240", charge: 195 },
  { pincode: "382245", charge: 200 }, { pincode: "382250", charge: 205 },
  { pincode: "382255", charge: 210 }, { pincode: "382260", charge: 215 },
  { pincode: "382265", charge: 220 }, { pincode: "382315", charge: 225 },
  { pincode: "382330", charge: 230 }, { pincode: "382340", charge: 235 },
  { pincode: "382345", charge: 240 }, { pincode: "382350", charge: 245 },
  { pincode: "382405", charge: 250 }, { pincode: "382415", charge: 255 },
  { pincode: "382418", charge: 260 }, { pincode: "382421", charge: 265 },
  { pincode: "382424", charge: 270 }, { pincode: "382425", charge: 275 },
  { pincode: "382427", charge: 280 }, { pincode: "382430", charge: 285 },
  { pincode: "382433", charge: 290 }, { pincode: "382435", charge: 295 },
  { pincode: "382440", charge: 300 }, { pincode: "382443", charge: 305 },
  { pincode: "382445", charge: 310 }, { pincode: "382449", charge: 315 },
  { pincode: "382450", charge: 320 }, { pincode: "382455", charge: 325 }
];

export const Payment = () => {
  const [OrderData, setOrderData] = useState();
  const [paymentMethod, setPaymentMethod] = useState("Online");
  const [pcharge, setPcharge] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const Navigate = useNavigate();

  const { total, address, cartDatas } = location.state || {};

  const initPayment = async (data) => {
    const options = {
      key: data.key, // Use the key from the backend response
      amount: data.amount,
      currency: data.currency,
      name: "Find Books",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: data.id,
      handler: async (response) => {
        console.log("rrrrrrrrrrrrrrrrrrrrrrr", response)
        try {
          const verifyResponse = await fetch("http://localhost:2606/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_orderID: response.razorpay_order_id,
              razorpay_paymentID: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order: total + pcharge + deliveryCharge,
            }),
            credentials: "include",
          });
          const json = await verifyResponse.json();
          if (json.payment.payment_status == "Completed") {
            addorder();
          }
          alert("payment success");
          Navigate("/MyOrder");
        } catch (error) {
          console.error("Error verifying payment:", error);
        }
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const payment = async () => {
    try {
      const response = await fetch("http://localhost:2606/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total + pcharge + deliveryCharge }),
        credentials: "include",
      });

      const data = await response.json();
      console.log("hvjvvjhnvvvvvv", data.data);
      if (data.data) {
        initPayment(data.data); // Pass the response data to initPayment
      } else {
        console.error("Error creating order: No data received");
        Navigate("/cart");
      }
    } catch (error) {
      console.error("Error creating order:", error.message);
    }
  }

  const addorder = async () => {
    try {
      const response = await fetch("http://localhost:2606/api/addorder", {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartid: cartDatas, TotalAmount: total + pcharge + deliveryCharge }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }
      else {
        clearcart();
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("An error occurred while updating the quantity");
    }

  };

  const clearcart = async () => {
    try {
      const response = await fetch("http://localhost:2606/api/Cart", {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const json = await response.json();

    } catch (error) {
      console.error('Error removing item:', error);
      alert('An error occurred while removing the item');
    }
  }

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const response = await fetch("http://localhost:2606/api/CurrentOrder", {
          credentials: "include",
        });
        const json = await response.json();
        setOrderData(json.order);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchCarts();
  }, []);

  useEffect(() => {
    if (!cartDatas?.bookdetail || cartDatas.bookdetail.length === 0) {
      console.warn("No books found in cartData");
      return;
    }

    const hasOldBook = cartDatas.bookdetail.some((book) => book?.Isoldbook === true);
    setPcharge(hasOldBook ? 3 : 0);
  }, [cartDatas]);

  useEffect(() => {
    if (!OrderData || !OrderData.Address) return;

    const pincode = OrderData.Address.match(/\d{6}$/)?.[0];
    const chargeData = deliveryChargesArray.find((item) => item.pincode === pincode);
    setDeliveryCharge(chargeData ? chargeData.charge : 0);
  }, [OrderData]);

  const handlePayment = async () => {
    setLoading(true);
    try {
      await payment();
    } finally {
      setLoading(false);
    }
  };

  const handleCOD = async () => {
    setLoading(true);
    try {
      await clear();
    } finally {
      setLoading(false);
    }
  };

  const clear = async () => {
    try {
      // Ensure addorder() completes before proceeding
      await addorder();

      // Ensure OrderData is properly updated after addorder()
      if (!OrderData || !OrderData._id) {
        alert("Order data is missing. Please try again.");
        return;
      }

      const response = await fetch("http://localhost:2606/api/codpayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          order_id: OrderData._id,
          payment_method: paymentMethod,
          payment_status: "pending",
          total_payment: total + pcharge + deliveryCharge,
          transaction_Type: "credit",
        }),
        credentials: "include"
      });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const json = await response.json();

      if (json.payment) {
        alert("Data saved successfully!");
        Navigate("/Orders", { state: { paymentdetail: json.payment } });
      } else {
        alert("Payment data was not returned. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again later.");
      console.error("Error occurred during submission:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="payment-container">
        <div className="payment-header">
          <button className="back-button" onClick={() => Navigate(-1)}>
            <ArrowLeft size={20} />
            Back to Cart
          </button>
          <h1>Checkout</h1>
          <div className="checkout-steps">
            <div className="step active">
              <Package size={24} />
              <span>Order Summary</span>
            </div>
            <div className="step active">
              <CreditCard size={24} />
              <span>Payment</span>
            </div>
            <div className="step">
              <Truck size={24} />
              <span>Delivery</span>
            </div>
          </div>
        </div>

        <div className="payment-content">
          <div className="order-summary-section">
            <h2>Order Summary</h2>
            <div className="order-details">
              <div className="price-breakdown">
                <div className="price-item">
                  <span>Subtotal</span>
                  <span>₹{total}</span>
                </div>
                <div className="price-item">
                  <span>Platform Fee</span>
                  <span>₹{pcharge}</span>
                </div>
                <div className="price-item">
                  <span>Delivery Charges</span>
                  <span>{deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}</span>
                </div>
                <div className="price-item total">
                  <span>Total Amount</span>
                  <span>₹{total + pcharge + deliveryCharge}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="payment-section">
            <h2>Payment Method</h2>
            <div className="payment-methods">
              <div className={`payment-method-card ${paymentMethod === "Online" ? "selected" : ""}`}>
                <input
                  type="radio"
                  id="online"
                  name="paymentMethod"
                  value="Online"
                  checked={paymentMethod === "Online"}
                  onChange={() => setPaymentMethod("Online")}
                />
                <label htmlFor="online">
                  <CreditCard size={24} />
                  <div>
                    <span>Online Payment</span>
                    <small>Pay securely with card, UPI, or net banking</small>
                  </div>
                </label>
              </div>

              <div className={`payment-method-card ${paymentMethod === "COD" ? "selected" : ""}`}>
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                <label htmlFor="cod">
                  <Package size={24} />
                  <div>
                    <span>Cash on Delivery</span>
                    <small>Pay when you receive your order</small>
                  </div>
                </label>
              </div>
            </div>

            <div className="security-info">
              <Shield size={20} />
              <span>Your payment information is secure and encrypted</span>
            </div>

            <button 
              className="pay-button" 
              onClick={paymentMethod === "COD" ? handleCOD : handlePayment}
              disabled={loading}
            >
              {loading ? "Processing..." : paymentMethod === "COD" ? "Place Order" : `Pay ₹${total + pcharge + deliveryCharge}`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};