// Instances and Imports
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Transaction = require("../models/transaction");
const { route } = require("./auth");

// Routes
// Route to transactions index page
router.get("/", async (req, res) => {
  try {
    const allTransactions = await Transaction.find({
      createdBy: req.session.user._id,
    });
    res.render("transactions/index.ejs", { transactions: allTransactions });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// Route to display form to add new transaction
router.get("/new", async (req, res) => {
  res.render("transactions/new.ejs");
});

// Route to handle and post the new transaction data
router.post("/", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const newTransactionData = {
      ...req.body,
      createdBy: currentUser._id,
    };
    await Transaction.create(newTransactionData);
    res.redirect(`/users/${currentUser._id}/transactions`);
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
