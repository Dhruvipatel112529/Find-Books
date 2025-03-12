const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../Schema/Payment");
const Order = require("../Schema/Order");
const Cart = require("../Schema/Cart");
const authenticateToken = require("../middleware/AuthMid");

// Valid order statuses
const VALID_ORDER_STATUSES = ["Pending", "Shipped", "Delivered", "Cancelled"];

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET;

const instance = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_SECRET,
});

router.post("/orders", async (req, res) => {

    try {
        console.log("RP"+ req.body.amount);
        const options = {
            amount: req.body.amount * 100,
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        };  

        instance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Something Went Wrong!" });
            }
            res.status(200).json({ data: order });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
});

router.post("/verify", authenticateToken, async (req, res) => {
    try {
        const { razorpay_orderID, razorpay_paymentID, razorpay_signature, orderID } = req.body;
        const order = await Order.findOne({ User_id: req.userId }).sort({ createdAt: 1 });
        const sign = razorpay_orderID + "|" + razorpay_paymentID;
        const resultSign = crypto
            .createHmac("sha256", RAZORPAY_SECRET)
            .update(sign.toString())
            .digest("hex");
        console.log(razorpay_signature)
        console.log(resultSign)

        if (razorpay_signature === resultSign) {
            const payment = new Payment({
                payment_id: order._id,
                order_id: orderID,
                payment_date: new Date(),
                payment_method: "Razorpay",
                payment_status: "Completed",
                total_payment: req.body.order,
                transaction_Type: "credit"
            });

            const savedPayment = await payment.save();

            return res.status(200).json({ payment: savedPayment });
        } else {
            return res.status(400).json({ message: "Invalid signature" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
});

router.get("/verify", authenticateToken, async (req, res) => {
    try {
        const payment = await Payment.find({});
        if (!payment) {
          return res.status(404).json({ error: "No payment record found" });
        }
        res.json({payment: payment});
      } catch (error) {
        console.error("Error fetching payment data:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }


});

router.put('/addorder', authenticateToken, async (req, res) => {
    try {
        const { cartid, TotalAmount, status } = req.body;

        let cart = await Cart.findOne({_id: cartid.cartid });
        console.log('cartId', cart);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        let order = await Order.findOne({ Cart_id: cartid.cartid });
        console.log('order s', order);
        if (!order) {
            return res.status(404).json({ message: "Order not found for this cart" });
        }

        const updatedBooks = cart.books.map(item => ({
            book_id: item.book_id,
            book_quantity: item.book_quantity,
        }));

        // If status is provided and valid, update it
        if (status && VALID_ORDER_STATUSES.includes(status)) {
            order.Order_Status = status;
        }
        
        order.Total_Amount = TotalAmount;
        order.books = updatedBooks;
        console.log('order after', order);
        await order.save();

        res.status(200).json({ message: "Order updated successfully", order });
    } catch (error) {
        console.error("Error processing order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Add a new route for updating order status
router.put('/:orderId/status', authenticateToken, [
    body('status')
        .isIn(VALID_ORDER_STATUSES)
        .withMessage(`Status must be one of: ${VALID_ORDER_STATUSES.join(', ')}`),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.Order_Status = status;
        await order.save();

        res.status(200).json({ message: "Order status updated successfully", order });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post(
"/codpayment",
    authenticateToken,
    [
        body("order_id").notEmpty().withMessage("Order ID is required"),
        body("payment_method").notEmpty().withMessage("Payment method is required"),
        body("payment_status").notEmpty().withMessage("Payment status is required"),
        body("total_payment").isFloat({ gt: 0 }).withMessage("Total payment must be a positive number"),
        body("transaction_Type").notEmpty().withMessage("Transaction type is required"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error("Validation errors:", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { order_id, payment_method, payment_status, total_payment, transaction_Type } = req.body;

            const cod = new Payment({
                order_id,
                payment_method,
                payment_status,
                total_payment,
                transaction_Type,
            });

            const savedPayment = await cod.save();

            return res.status(201).json({ payment: savedPayment });
        } catch (error) {
            console.error("Error saving payment:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

module.exports = router;