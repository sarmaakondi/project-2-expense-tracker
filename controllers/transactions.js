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

module.exports = router;
