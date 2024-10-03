// Import `catchAsyncErrors` middleware from the Middleware folder.  
// This middleware is used to catch and handle errors in the code and pass them to the global error handler.
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Import the Stripe library and initialize it with the secret key stored in environment variables (`.env` file).
// Stripe is used for processing online payments.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Function to process a payment through Stripe.
// This is called in the frontend when a user initiates a payment for their order.
exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  // Create a new payment intent on Stripe with the amount, currency (INR), and metadata.
  // The amount is received from the frontend as part of the request body (req.body.amount).
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "Ecommerce", // Custom metadata (can be used for tracking purposes)
    },
  });

  // Respond back with the client secret that Stripe uses to verify the payment on the frontend.
  res.status(200).json({ success: true, client_secret: myPayment.client_secret });
});

// Function to send the Stripe API key to the frontend.
// This is useful when you need the public key on the frontend for initiating payments.
exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  // Send the Stripe API public key from the environment variables.
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});
