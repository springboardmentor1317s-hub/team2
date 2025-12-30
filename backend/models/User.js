// backend/models/User.js (FINALIZED VERSION)

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please add a full name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    university: {
        type: String,
        required: [true, 'Please select a university']
    },
    role: {
        type: String,
        enum: ['student', 'organizer', 'admin'], 
        default: 'student',
        required: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// --- Mongoose Middleware: Async Password Hashing ---
// CRITICAL: Use the 'function' keyword to maintain 'this' context.
// Mongoose implicitly handles the promise returned by this async function.
UserSchema.pre('save', async function() { 
    // This hook runs before the document is saved.
    
    // Only hash the password if it's new or being modified
    if (!this.isModified('password')) {
        return; 
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// --- Custom Method for Login (No change needed, but included for completeness) ---
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User', UserSchema);
