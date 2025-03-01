const express = require("express");
const { body, validationResult } = require('express-validator');
const router = express.Router();
const authenticateToken = require("../middleware/AuthMid");
const ResellerPaymentModel = require("../Schema/Reseller");

router.post("/ResellerPaymentForm", authenticateToken, [
    body("address").notEmpty().withMessage("Please enter an address").trim(),
    body("upi_id"),
    body("bank_acc_no"),
    body("ifsc_code"),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        console.log("User ID:", req.userId);
        if (!req.userId) {
            return res.status(401).json({ error: "User authentication failed" });
        }

        const resellerPayment = new ResellerPaymentModel({
            user_id: req.userId,
            address: req.body.address,
            upi_id: req.body.upi_id,
            bank_acc_no: req.body.bank_acc_no,
            ifsc_code: req.body.ifsc_code,
        });


        const savedResellerPayment = await resellerPayment.save();
        res.status(201).json({ data: savedResellerPayment });

    } catch (error) {
        console.error("Error saving reseller payment details:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;