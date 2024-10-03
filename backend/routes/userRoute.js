const express = require("express"); // Importing Express.js
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController"); // Import user-related logic from userController
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth"); // Import authentication and role-based access middleware
const router = express.Router(); // Create an instance of Express Router

// Route for new user registration (public)
router.route("/register").post(registerUser);

// Route for user login (public)
router.route("/login").post(loginUser);

// Route for requesting a password reset link (public)
router.route("/password/forgot").post(forgotPassword);

// Route for resetting the password via a token sent to the user’s email (public)
router.route("/password/reset/:token").put(resetPassword);

// Route to log out the user (authenticated)
router.route("/logout").get(logout);

// Route for logged-in users to view their details (authenticated)
router.route("/me").get(isAuthenticatedUser, getUserDetails);

// Route to update the logged-in user’s password (authenticated)
router.route("/password/update").put(isAuthenticatedUser, updatePassword);

// Route for updating the logged-in user’s profile (authenticated)
router.route("/me/update").put(isAuthenticatedUser, updateProfile);

// Admin-only route to fetch all users
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);

// Admin-only routes to get a single user by ID, update user roles, or delete a user
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

// Export the router to be used in app.js
module.exports = router;
