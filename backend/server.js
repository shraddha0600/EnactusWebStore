// Importing the Express app from the 'app.js' file
// 'app.js' is expected to contain the Express application logic such as routes, middlewares, etc.
const app = require("./app");

// Importing the Cloudinary library to handle image uploads to Cloudinary's cloud storage
// Cloudinary allows us to store and manage media assets like images and videos in the cloud
const cloudinary = require("cloudinary");

// Importing the function to connect to the MongoDB database
// 'database.js' file contains the logic to establish the connection with MongoDB using Mongoose
const connectDatabase = require("./config/database");

// Handling uncaught exceptions (errors that occur in the synchronous part of the code but are not caught by try-catch)
// For example, if we try to use an undefined variable, this block will catch that error.
// The `process.on` method listens for the 'uncaughtException' event, logs the error message, 
// and shuts down the server gracefully by calling 'process.exit(1)' to prevent any further issues.
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);  // Logs the error message
  console.log(`Shutting down the server due to Uncaught Exception`);  // Graceful shutdown message
  process.exit(1);  // Shuts down the server with exit code 1 (indicating failure)
});

// Configuring environment variables
// If we are not in production (e.g., in development or testing environment), 
// we load the environment variables from the 'config.env' file located in 'backend/config/'
// This file stores sensitive information like database credentials, API keys, etc.
// We use the 'dotenv' package to load these variables into `process.env`.
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

// Connecting to MongoDB database
// 'connectDatabase()' establishes the connection to the MongoDB instance.
// We call this function to ensure the application is connected to the database
// before handling any client requests.
connectDatabase();

// Configuring Cloudinary for cloud image storage
// The 'cloudinary.config()' method sets up the Cloudinary API with credentials for cloud_name, api_key, and api_secret.
// These credentials are stored in environment variables (from the .env file) to keep them secure.
// We'll use Cloudinary to store images uploaded by users (e.g., for user profiles, product images, etc.).
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,  // Your Cloudinary account name
  api_key: process.env.CLOUDINARY_API_KEY,  // API key for authenticating requests
  api_secret: process.env.CLOUDINARY_API_SECRET,  // Secret key for securing API calls
});

// Starting the Express server
// 'app.listen()' starts the server and listens for incoming HTTP requests on the specified port (defined in the .env file).
// Once the server is running, we log a message showing the local URL (http://localhost:<port>)
// This is important for verifying that the server is correctly running and accepting requests.
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

// Handling unhandled promise rejections (errors that occur in asynchronous code, e.g., when a promise is rejected without a .catch handler)
// For example, if the database connection fails (a promise rejection), this block will handle it.
// The `process.on` method listens for the 'unhandledRejection' event, logs the error, and shuts down the server gracefully.
// We first log the error message, then close the server using 'server.close()', 
// and finally call 'process.exit(1)' to prevent further operations.
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);  // Logs the error message
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);  // Graceful shutdown message

  // Gracefully closing the server and exiting the process with exit code 1 (failure)
  server.close(() => {
    process.exit(1);
  });
});
