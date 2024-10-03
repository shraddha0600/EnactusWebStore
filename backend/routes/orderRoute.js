const express = require("express"); // Importing Express.js framework
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController"); // Importing the functions from orderController to handle order logic
const router = express.Router(); // Creating an instance of the Express Router to define routes

// Import authentication middleware to ensure the user is logged in before performing actions
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

// Route to create a new order. User must be logged in (isAuthenticatedUser middleware is applied)
router.route("/order/new").post(isAuthenticatedUser, newOrder);

// Route to get a specific order by its ID. Only logged-in users can fetch their orders
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

// Route to get all orders of the logged-in user (Authenticated user can only see their own orders)
router.route("/orders/me").get(isAuthenticatedUser, myOrders);

// Route to get all orders in the system (Admin only). The user must be an admin to access this
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

// Route to update or delete an order (Admin only). Admins can change the order status or remove an order
router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

// Exporting the router so it can be used in app.js
module.exports = router;
