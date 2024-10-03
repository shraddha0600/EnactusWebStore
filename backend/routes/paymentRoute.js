const express = require("express"); // Importing Express.js
const {
  processPayment,
  sendStripeApiKey,
} = require("../controllers/paymentController"); // Import payment-related logic from paymentController
const router = express.Router(); // Create an instance of Express Router

// Import authentication middleware to ensure the user is logged in before performing actions
const { isAuthenticatedUser } = require("../middleware/auth");

// Route to process payments using Stripe. User must be authenticated
router.route("/payment/process").post(isAuthenticatedUser, processPayment);

// Route to retrieve the public Stripe API key (used by frontend to initialize Stripe). User must be authenticated
router.route("/stripeapikey").get(isAuthenticatedUser, sendStripeApiKey);

// Export the router to be used in app.js
module.exports = router;
