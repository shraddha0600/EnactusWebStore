// Importing required modules and models
const Order = require("../models/orderModel"); // Importing Order model to interact with the orders in the database
const Product = require("../models/productModel"); // Importing Product model to manage products in the database
const ErrorHander = require("../utils/errorhander"); // Custom error handling utility
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // Middleware to handle errors in async functions

// Create a new order function. This will be used when a user places an order.
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  // Extracting order details from the request body (sent by frontend)
  const {
    shippingInfo,   // Information like address where the order will be delivered
    orderItems,     // List of items in the order (products, quantity, etc.)
    paymentInfo,    // Payment details (how the customer paid)
    itemsPrice,     // Total price of the items (before taxes and shipping)
    taxPrice,       // Total tax added to the items' price
    shippingPrice,  // Shipping cost for delivering the order
    totalPrice,     // Final amount customer needs to pay (itemsPrice + taxPrice + shippingPrice)
  } = req.body;

  // Creating a new order document in the database
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(), // Storing the current time when payment was made
    user: req.user._id, // Getting the ID of the currently logged-in user (provided by auth middleware)
  });

  // Sending a success response back to the client
  res.status(201).json({
    success: true, // Indicates the order was created successfully
    order,        // Returning the newly created order object
  });
});

// Get details of a single order by its ID
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  // Searching for the order in the database by its ID (received from URL params)
  const order = await Order.findById(req.params.id).populate(
    "user", // Populating 'user' field to get the user's name and email (not just their ID)
    "name email"
  );

  // If order is not found, send an error response
  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404)); // Custom error handling
  }

  // Sending success response with order details
  res.status(200).json({
    success: true,
    order, // Returning the order data
  });
});

// Get all orders placed by the logged-in user
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  // Searching for all orders made by the currently logged-in user
  const orders = await Order.find({ user: req.user._id }); // req.user._id is provided by the authentication middleware

  // Sending a response with all the user's orders
  res.status(200).json({
    success: true,
    orders, // Returning the list of orders
  });
});

// Admin function to get all orders in the system (for management)
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find(); // Fetching all orders from the database

  let totalAmount = 0; // Initializing a variable to hold the total sales amount

  // Looping through each order to calculate the total revenue
  orders.forEach((order) => {
    totalAmount += order.totalPrice; // Adding each order's total price to the overall totalAmount
  });

  // Sending a response with total revenue and the list of all orders
  res.status(200).json({
    success: true,
    totalAmount, // Total revenue
    orders,      // List of all orders
  });
});

// Admin function to update the status of an order (e.g., from "Processing" to "Shipped")
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id); // Finding the order by its ID

  // If the order is not found, send an error response
  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  // If the order has already been delivered, don't allow further updates
  if (order.orderStatus === "Delivered") {
    return next(new ErrorHander("You have already delivered this order", 400));
  }

  // If the new status is "Shipped", update stock for each item in the order
  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity); // Updating stock for each product
    });
  }
  
  // Updating the order's status
  order.orderStatus = req.body.status;

  // If the order is marked as "Delivered", record the delivery date
  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  // Save the updated order details back to the database
  await order.save({ validateBeforeSave: false });
  
  // Send a success response back to the admin
  res.status(200).json({
    success: true,
  });
});

// Helper function to update stock for products when an order is shipped
async function updateStock(id, quantity) {
  const product = await Product.findById(id); // Finding the product by its ID

  // Reducing the product's stock by the quantity ordered
  product.Stock -= quantity;

  // Saving the updated stock information
  await product.save({ validateBeforeSave: false });
}

// Admin function to delete an order from the system
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id); // Finding the order by its ID

  // If the order is not found, send an error response
  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  // Removing the order from the database
  await order.remove();

  // Send a success response back to the admin
  res.status(200).json({
    success: true,
  });
});
