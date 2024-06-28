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

// Security packages
const cors = require("cors");
const rateLimiter = require("express-rate-limit");
const { xss } = require("express-xss-sanitizer");

const port = process.env.PORT ? process.env.PORT : 3000;

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("trust proxy", 1);
const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter); // Disable during development/testing to avoid rate limit
app.use(express.json());
app.use(cors());
app.use(xss());
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
