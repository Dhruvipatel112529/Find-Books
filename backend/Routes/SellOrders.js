const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const Authmid = require("../middleware/AuthMid");
const Book = require("../Schema/Book");
const Reseller = require("../Schema/Reseller");
const User = require("../Schema/User");

router.get("/SellOrders", Authmid, async (req, res) => {
    try {
        // Fetch all reseller data of the logged-in user
        const Resellerdata = await Reseller.find({ User_id: req.userId });

        if (Resellerdata.length === 0) {
            return res.status(404).json({ error: "No books found by the user" });
        }

        // Extract all book IDs from reseller data
        const bookIds = Resellerdata.map(reseller => reseller.Book_id);

        // Fetch all books related to those book IDs
        const books = await Book.find({ _id: { $in: bookIds } });

        res.json({ books, resellerdata: Resellerdata });
    } catch (error) {
        console.error("Error fetching Sell Order data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/SellOrder", async (req, res) => {
    try {
        const reseller = await Reseller.find({});
        const bookid = reseller.map(reseller => reseller.Book_id);
        const userid = reseller.map(reseller => reseller.User_id);

        const books = await Book.find({ _id: { $in: bookid } });
        const users = await User.find({ _id: { $in: userid } });

        res.json({ reseller: reseller, books: books, users: users });

    } catch (error) {
        console.error("Error fetching Sell Order data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



router.put("/:Status/SellOrders", Authmid, async (req, res) => {
    try {
        const { Status } = req.params;
        const { resellerid, bookid } = req.body;

        // Update the reseller status
        const resellerUpdate = await Reseller.updateOne(
            { _id: resellerid },
            { $set: { Resell_Status: Status } }
        );

        // Check if reseller update was successful
        if (resellerUpdate.modifiedCount === 0) {
            return res.status(404).json({ error: "Reseller not found or already updated" });
        }

        // Optional: Delete the book (Ensure this is what you want)
        const bookDelete = await Book.deleteOne({ _id: bookid });

        // Check if the book was actually deleted
        if (bookDelete.deletedCount === 0) {
            return res.status(404).json({ error: "Book not found or already deleted" });
        }

        res.status(200).json({ message: "Sell order updated successfully" });

    } catch (error) {
        console.error("Error updating Sell Order:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



module.exports = router;