const mongoose = require("mongoose");

module.exports = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      // If it can't connect in 5 seconds, throw an error immediately
      serverSelectionTimeoutMS: 5000,
      // Close the socket if it's inactive for 45s
      socketTimeoutMS: 45000,
    })
    .then(() => console.log("MongoDB connected successfully!"))
    .catch((err) => console.error("MongoDB connection err:", err));
};
