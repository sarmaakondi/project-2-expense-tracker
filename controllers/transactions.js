// Instances and Imports
const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Routes
router.get("/", (req, res) => {
  try {
    res.render("transactions/index.ejs");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// Display for to create new transaction
router.get("/new", async (req, res) => {
  res.render("transactions/new.ejs");
});

module.exports = router;
