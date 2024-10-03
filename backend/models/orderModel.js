// Import the mongoose module for creating schemas and models
const mongoose = require("mongoose");

// Define the schema for storing order details in the database
const orderSchema = new mongoose.Schema({
  // Shipping information (address, city, state, country, etc.)
  shippingInfo: {
    address: {
      type: String,
      required: true, // Field is mandatory
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    pinCode: {
      type: Number,
      required: true,
    },
    phoneNo: {
      type: Number,
      required: true,
    },
  },
  // Array of items in the order (name, price, quantity, etc.)
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      // Link to the product in the Product model
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
  // The user who placed the order, linked to the User model
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  // Payment details (id, status, and paid time)
  paymentInfo: {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  // Time when the order was paid for
  paidAt: {
    type: Date,
    required: true,
  },
  // Price details for items, tax, shipping, and total
  itemsPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  // Status of the order (Processing, Delivered, etc.)
  orderStatus: {
    type: String,
    required: true,
    default: "Processing",
  },
  // Time when the order was delivered
  deliveredAt: Date,
  // Time when the order was created
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to current date
  },
});

// Export the schema as the Order model for use in other parts of the application
module.exports = mongoose.model("Order", orderSchema);
