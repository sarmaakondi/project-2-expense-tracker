// Middleware function to pass the user data to rest of the views
const passUserToViews = (req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
};

module.exports = passUserToViews;
