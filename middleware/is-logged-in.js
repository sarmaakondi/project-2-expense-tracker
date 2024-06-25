// Middleware function to check if the current user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.session.user) return next();
  res.redirect("/auth/sign-in");
};

module.exports = isLoggedIn;
