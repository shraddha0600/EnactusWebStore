// Import mongoose for schema and model creation
const mongoose = require("mongoose");

// Define the schema for storing product details
const productSchema = mongoose.Schema({
  // Name of the product
  name: {
    type: String,
    required: [true, "Please Enter product Name"], // Custom error message for missing name
    trim: true, // Removes whitespace from both sides of the string
  },
  // Description of the product
  description: {
    type: String,
    required: [true, "Please Enter product Description"],
  },
  // Price of the product
  price: {
    type: Number,
    required: [true, "Please Enter product Price"],
    maxLength: [8, "Price cannot exceed 8 characters"], // Max length restriction for price
  },
  // Average rating of the product (default is 0)
  ratings: {
    type: Number,
    default: 0,
  },
  // Array of images associated with the product (public_id and URL for cloud storage)
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  // Category of the product
  category: {
    type: String,
    required: [true, "Please Enter Product Category"],
  },
  // Stock count of the product (how many units are available)
  Stock: {
    type: Number,
    required: [true, "Please Enter product Stock"],
    maxLength: [4, "Stock cannot exceed 4 characters"], // Max limit on stock
    default: 1, // Default stock is 1
  },
  // Number of reviews on the product
  numOfReviews: {
    type: Number,
    default: 0,
  },
  // Array of review objects, each containing user info, name, rating, and comment
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User", // Linked to the User model
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  // The user who added the product, linked to the User model
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  // The date when the product was created (automatically set to the current date)
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the schema as the Product model for use in other parts of the application
module.exports = mongoose.model("Product", productSchema);
