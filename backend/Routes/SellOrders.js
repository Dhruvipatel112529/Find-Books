const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const Authmid = require("../middleware/AuthMid");
const Book = require("../Schema/Book");

router.get("/SellOrders",Authmid, async(req,res) => {
    try{
        const books = await Book.find({User_id : req.userId})

        if(!books){
            return res.status(404).json({ error: "no Books found by the user" });
        }

        res.json({books : books});
    }catch(error){
        console.error("Error fetching Sell Order data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

module.exports = router;