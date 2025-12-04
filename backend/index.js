// backend/index.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
// 💡 NEW: Import the dedicated database connection function
const connectDB = require('./config/db'); 

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// We no longer need this line since we use connectDB:
// const db = process.env.MONGODB_URI; 

// --- 💡 MODIFICATION: Call the centralized database connection function ---
connectDB(); 

// Middleware Setup
app.use(cors()); 
app.use(express.json()); 

// Test Route (Sanity Check)
app.get('/', (req, res) => {
    res.send('CampusEventHub Backend is up and running!');
});

// Import Routers
const authRouter = require('./routes/auth'); 
const eventsRouter = require('./routes/events'); 
const registrationsRouter = require('./routes/registrations'); 

// API Routes
app.use('/api/auth', authRouter); 
app.use('/api/events', eventsRouter); 
app.use('/api/registrations', registrationsRouter); 

// Start the Server
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));