// backend/routes/registrations.js
const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const auth = require('../middleware/auth'); // <--- JWT Middleware

// @route   POST /api/registrations
// @desc    Register a user for an event (Protected)
router.post('/', auth, async (req, res) => {
    const { eventId } = req.body;
    const userId = req.user.id; // User ID comes directly from the verified token

    try {
        const newRegistration = new Registration({ eventId, userId });
        await newRegistration.save();
        
        // Note: In a production app, you would also use a MongoDB transaction 
        // here to atomically increment the event's participantsCount field.
        
        res.status(201).json(newRegistration);
    } catch (err) {
        // Handle the unique index error (duplicate registration)
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'Already registered for this event.' });
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/registrations/my
// @desc    Get all registrations for the logged-in user (Protected)
router.get('/my', auth, async (req, res) => {
    try {
        // Find registrations where the userId matches the ID from the token
        const myRegistrations = await Registration.find({ userId: req.user.id });
        res.json(myRegistrations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;