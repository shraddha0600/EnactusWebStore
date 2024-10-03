// Importing the necessary modules and middlewares.
const User = require("../models/userModel"); // User model for interacting with the database.
const ErrorHandler = require("../utils/errorHandler"); // Utility for handling errors.
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // Middleware to catch async errors.
const sendToken = require("../utils/jwtToken"); // Utility to generate JWT tokens.

// Register a new User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "default_avatar",
      url: "default_avatar_url", // Default avatar values, you may customize this based on your needs.
    },
  });

  sendToken(user, 201, res); // Send the JWT token upon successful registration.
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400)); // Validation for missing credentials.
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401)); // Error if user is not found.
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401)); // Error if password does not match.
  }

  sendToken(user, 200, res); // Send the JWT token upon successful login.
});

// Get User details (logged in user)
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User password (logged in user)
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400)); // Error if old password does not match.
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400)); // Error if new and confirm passwords don't match.
  }

  user.password = req.body.newPassword;
  await user.save(); // Save the updated password to the database.

  sendToken(user, 200, res); // Send the JWT token after password update.
});
