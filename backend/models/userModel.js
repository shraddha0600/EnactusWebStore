// Import necessary modules: mongoose for database operations, validator for validation, bcrypt for password hashing, jwt for tokens, and crypto for generating tokens
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Define the schema for storing user details in the database
const userSchema = new mongoose.Schema({
  // User's name
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  // User's email with validation for correct format
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true, // Email must be unique
    validate: [validator.isEmail, "Please Enter a valid Email"], // Email format validation
  },
  // User's password (hashed before saving)
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false, // Prevent the password from being returned in queries
  },
  // User's avatar, stored as public ID and URL (likely for cloud storage)
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  // User's role (default is 'user', but could be 'admin' or other roles)
  role: {
    type: String,
    default: "user",
  },
  // Time when the user was created
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Token to reset password
  resetPasswordToken: String,
  // Expiry time for reset token
  resetPasswordExpire: Date,
});

// Middleware function to hash the password before saving a user
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    next(); // Proceed to the next middleware
  }

  // Hash the password with 10 rounds of salt
  this.password = await bcrypt.hash(this.password, 10);
});

// Instance method to generate a JWT token for the user
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE, // Token expiry is set in environment variables
  });
};

// Instance method to compare user's password with the hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Instance method to generate a reset password token
userSchema.methods.getResetPasswordToken = function () {
  // Generate a random token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash the token and set it to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set the expiry time for the token (currently 15 minutes)
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken; // Return the plain reset token
};

// Export the schema as the User model for use in other parts of the application
module.exports = mongoose.model("User", userSchema);
