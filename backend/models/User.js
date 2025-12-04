// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // Store their name or username
    name: { 
        type: String, 
        required: true 
    },
    // Used for logging in; must be unique
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    // The securely hashed password
    password: { 
        type: String, 
        required: true 
    },
    role: { // Optional: useful for distinguishing admins/organizers/students
        type: String,
        enum: ['student', 'organizer', 'admin'],
        default: 'student'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);