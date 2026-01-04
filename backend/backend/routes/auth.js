// backend/routes/auth.js

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

const router = express.Router();

// Helper function to create a JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d' // Token expires in 30 days
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        // 💡 NEW DIAGNOSTIC LINE
       // console.log('Data received by server:', req.body); // Check the data Express received
        const { fullName, email, university, role, password } = req.body; 

        // 1. Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // 2. Create the new user (Mongoose pre-save middleware handles password hashing)
        const user = await User.create({
            fullName,
            email,
            university,
            role,
            password,
        });

        // 3. Create a token for immediate login
        const token = createToken(user._id);

        res.status(201).json({ 
            success: true, 
            message: 'Registration successful!',
            token,
            // Return safe user data
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                university: user.university,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Registration Error:', error.message);

        if (error.name === 'ValidationError') {
            const message = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ 
                success: false, 
                message: message[0] // Return the first validation message
            });
        }

        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check for user by email (select: false in model forces password to be available)
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // 2. Check password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // 3. Create a token and send response
        const token = createToken(user._id);

        res.status(200).json({ 
            success: true, 
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                university: user.university,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
});

module.exports = router;
