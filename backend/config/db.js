// backend/config/db.js

const mongoose = require('mongoose');

// The MONGODB_URI is loaded from the backend/.env file via dotenv in index.js
const db = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using Mongoose
        await mongoose.connect(db);
        
        console.log('✅ MongoDB Atlas Connected Successfully!');
    } catch (err) {
        console.error('❌ Database Connection Failed:', err.message);
        // Exit process with failure code
        process.exit(1);
    }
};

module.exports = connectDB;