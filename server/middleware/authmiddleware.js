// Middleware to check if the user is logged in
const requireLogin = function (req, res, next) {
  // If session or user data is missing, return unauthorized
  if (!req.session || !req.session.user || !req.session.user._id) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  // Store user ID in request object for downstream use
  req.userId = req.session.user._id;
  next(); // Continue to the next middleware or route
};

// Middleware to restrict access to admin users only
const requireAdmin = (req, res, next) => {
  // If the user's role is admin, allow access
  if (req.session?.user?.role === 'admin') {
    next(); // Continue to next
  } else {
    // If not admin, return forbidden
    res.status(403).json({ success: false, message: "Forbidden" });
  }
};

// Export both middlewares for use in routes
module.exports = { requireLogin, requireAdmin };
