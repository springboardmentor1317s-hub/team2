// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const authRoutes = require('./routes/auth');

const app = express();

// --- Middleware ---
// Enable CORS for frontend communication (adjust origin later for production)
app.use(cors({
    origin: 'http://localhost:3000', // Your React/Vite default port
    credentials: true,
}));

// Body parser for JSON data
app.use(express.json());

// --- Database Connection ---
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- API Routes ---
// Base route
app.get('/', (req, res) => {
    res.send('CampusEventHub Backend API is running!');
});

// Authentication routes (Register/Login)
app.use('/api/auth', authRoutes);

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // You can now run 'npm run dev' or 'nodemon server.js'
});