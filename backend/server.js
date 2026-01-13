// backend/server.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

// Load environment variables from .env file
dotenv.config();

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const connectDB = require("./config/db");
const { port, secretKey } = require("./Constants");

const app = express();
connectDB();
// --- Middleware ---
// Enable CORS for frontend communication (adjust origin later for production)
app.use(
  cors({
    origin: "http://localhost:3000", // Your React/Vite default port
    credentials: true,
  })
);

// Body parser for JSON data
app.use(cookieParser(secretKey));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));


// --- API Routes ---
// Base route
app.get("/", (req, res) => {
  res.send("CampusEventHub Backend API is running!");
});

// Authentication routes (Register/Login)
app.use("/api/auth", authRoutes);
app.use("/api/users", require("./routes/user"));
// Events routes (Get, Filter, Create)
app.use("/api/events", eventRoutes);
app.use("/api/registrations", require("./routes/registration"));

// --- Start Server ---
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  // You can now run 'npm start'
});
