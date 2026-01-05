// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

const app = express();

// --- Middleware ---
// Enable CORS for frontend communication (adjust origin later for production)
app.use(cors({
    origin: 'http://localhost:3000', // Your React/Vite default port
    credentials: true,
}));

// Body parser for JSON data
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// --- Database Connection ---
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  // Connection timeout settings
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  // Connection pool settings for better performance
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 5,  // Maintain a minimum of 5 socket connections
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
}).then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- API Routes ---
// Base route
app.get('/', (req, res) => {
    res.send('CampusEventHub Backend API is running!');
});

// Authentication routes (Register/Login)
app.use('/api/auth', authRoutes);

// Events routes (Get, Filter, Create)
app.use('/api/events', eventRoutes);

// Registration routes (Apply, Approve/Reject)
app.use('/api/registrations', require('./routes/registration'));

// Notification routes (Get, Mark as read, Delete, Create, Broadcast)
app.use('/api/notifications', require('./routes/notification'));

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // You can now run 'npm run dev' or 'nodemon server.js'
});
