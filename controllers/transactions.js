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
    }).sort("-date");
    // object to store the sum of the categories to display in the dashboard
    const categorySum = {};
    for (const transaction of allTransactions) {
      const category = transaction["category"];
      const amount = transaction["amount"];
      if (category in categorySum) {
        categorySum[category] += amount;
      } else {
        categorySum[category] = amount;
      }
    }
    res.render("transactions/index.ejs", {
      transactions: allTransactions,
      totals: categorySum,
    });
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

// Route to view individual transaction
router.get("/:transactionId", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.transactionId);
    res.render("transactions/show-one.ejs", { transaction });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// Route to view all the transactions for the selected date
router.get("/date/:date", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const transactions = await Transaction.find({
      createdBy: currentUser._id,
      date: req.params.date,
    }).limit(8);
    res.render("transactions/show-multiple.ejs", {
      transactions,
      date: req.params.date,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// Route to view all the transactions for the selected category
router.get("/category/:category", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const transactions = await Transaction.find({
      createdBy: currentUser._id,
      category: req.params.category,
    }).limit(8);
    res.render("transactions/show-category.ejs", {
      transactions,
      category: req.params.category,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// Route to handle delete transaction feature
router.delete("/:transactionId", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.transactionId);
    res.redirect(`/users/${req.session.user._id}/transactions`);
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// Route to display the transaction edit form
router.get("/:transactionId/edit", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.transactionId);
    res.render("transactions/edit.ejs", { transaction });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// Route to update the transaction details provided by the user
router.put("/:transactionId", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.transactionId);
    transaction.set(req.body);
    await transaction.save();
    res.redirect(
      `/users/${req.session.user._id}/transactions/${req.params.transactionId}`
    );
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
