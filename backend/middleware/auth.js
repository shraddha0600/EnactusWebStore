// Import necessary modules and files for error handling, async error catching, JWT, and User model.
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Middleware function to check if a user is authenticated or not
// This function will be used for authentication in routes that require login
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  // Retrieve the token from the cookies of the incoming request
  const { token } = req.cookies;

  // If token is not present, throw an error asking the user to log in
  if (!token) {
    return next(new ErrorHander("Please Login to access this resource", 401)); // 401 indicates unauthorized access
  }

  // Decode the token to get user details using JWT secret key
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  // Find the user in the database using the decoded user ID and assign it to the request object
  req.user = await User.findById(decodedData.id);

  // Proceed to the next middleware or controller
  next();
});

// Middleware function to authorize user roles (e.g., admin, user) for accessing specific resources
// This will be used in routes that require specific roles, such as admin-only routes
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role is included in the allowed roles passed to this function
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `Role: ${req.user.role} is not allowed to access this resource`, // 403 indicates forbidden access
          403
        )
      );
    }

    // If the user has the correct role, proceed to the next middleware or controller
    next();
  };
};
