// backend/server.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const { authToken } = require("./middleware/auth");
const connectDB = require("./config/db");
const User = require("./models/User");

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
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// --- Database Connection ---
const PORT = process.env.PORT || 5000;



// --- API Routes ---
// Base route
app.get('/', (req, res) => {
    res.send('CampusEventHub Backend API is running!');
});

// Authentication routes (Register/Login)
app.use('/api/auth', authRoutes);

// Events routes (Get, Filter, Create)
app.use("/api/events", eventRoutes);
app.use('/api/registrations', require('./routes/registration'));

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // You can now run 'npm start'
});
