// Importing the necessary modules and middlewares.
const Product = require("../models/productModel"); // Product model for interacting with the database.
const ErrorHandler = require("../utils/errorHandler"); // Utility for handling errors.
const catchAsyncErrors = require("../middleware/catchAsyncErrors"); // Middleware to catch async errors.
const APIFeatures = require("../utils/apiFeatures"); // Utility for filtering, searching, and paginating products.

// Create new Product (Admin only)
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id; // Attach the user ID to the product being created.

  const product = await Product.create(req.body); // Save the product in the database.

  res.status(201).json({
    success: true,
    product,
  });
});

// Get all products (for frontend and admin views)
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 8; // Number of products per page.
  const productsCount = await Product.countDocuments(); // Get the total number of products.

  const apiFeature = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const products = await apiFeature.query; // Execute the API feature (search, filter, pagination).
  
  res.status(200).json({
    success: true,
    products,
    productsCount,
  });
});

// Get single Product details by ID
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404)); // Return error if product is not found.
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Update Product (Admin only)
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404)); // Return error if product is not found.
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Return the updated product.
    runValidators: true, // Ensure the update respects the model schema.
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product (Admin only)
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404)); // Return error if product is not found.
  }

  await product.remove(); // Remove the product from the database.

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
