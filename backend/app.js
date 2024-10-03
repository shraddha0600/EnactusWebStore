const express = require("express"); // Importing Express.js
const app = express(); // Initialize Express app
const cookieParser = require("cookie-parser"); // Import cookie-parser to parse cookies in incoming requests
const bodyParser = require("body-parser"); // Import body-parser to parse URL-encoded request bodies
const fileUpload = require("express-fileupload"); // Import express-fileupload to handle file uploads (e.g., images)
const path = require("path"); // Import path for working with file and directory paths

const errorMiddleware = require("./middleware/error"); // Import custom error handling middleware

// Load environment variables from config file if not in production environment
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

// Middleware to parse incoming JSON requests
app.use(express.json());
// Middleware to parse cookies
app.use(cookieParser());
// Middleware to parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware to handle file uploads
app.use(fileUpload());

// Importing routes
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");

// Using routes. All routes will be prefixed with `/api/v1`
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

// Serve static files (frontend) from the React build folder in production mode
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

// Middleware to handle errors globally across the app
app.use(errorMiddleware);

// Export the app instance to be used in server.js
module.exports = app;
