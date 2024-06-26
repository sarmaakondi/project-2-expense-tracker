require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const isLoggedIn = require("./middleware/is-logged-in.js");
const passUserToViews = require("./middleware/pass-user-to-views.js");

const authController = require("./controllers/auth.js");
const transactionsController = require("./controllers/transactions.js");

const port = process.env.PORT ? process.env.PORT : 3000;

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);
app.use(passUserToViews);

app.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect(`/users/${req.session.user._id}/transactions`);
  } else {
    res.render("index.ejs");
  }
});

app.use("/auth", authController);
app.use(isLoggedIn);
app.use("/users/:userId/transactions", transactionsController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
