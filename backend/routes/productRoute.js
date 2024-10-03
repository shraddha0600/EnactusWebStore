const express = require("express"); // Importing Express.js
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts,
} = require("../controllers/productController"); // Import product-related logic from productController
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth"); // Import authentication and role-based access middleware
const router = express.Router(); // Create an instance of Express Router

// Route to get all products. This is a public route, so no authentication required
router.route("/products").get(getAllProducts);

// Admin-only route to fetch all products created by admin
router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);

// Admin-only route to create a new product. The request must include authenticated admin credentials
router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

// Admin-only routes to update or delete an existing product by its ID
router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

// Route to get details of a specific product by its ID. This is a public route
router.route("/product/:id").get(getProductDetails);

// Authenticated user route to submit a product review
router.route("/review").put(isAuthenticatedUser, createProductReview);

// Routes to get all reviews for a product or delete a review. Only authenticated users can perform these actions
router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteReview);

// Export the router to be used in app.js
module.exports = router;
