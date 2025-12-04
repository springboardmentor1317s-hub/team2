// backend/routes/events.js
const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth'); // <--- JWT Middleware
const router = express.Router();

// @route   GET /api/events
// @desc    Get all events (Protected)
router.get('/', auth, async (req, res) => { // <-- Protected by 'auth'
    try {
        // Fetches all events, sorted newest first
        const events = await Event.find().sort({ createdAt: -1 }); 
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/events
// @desc    Create a new event (Protected & Role-Restricted)
router.post('/', auth, async (req, res) => { // <-- Protected by 'auth'
    
    // --- Authorization Check (Role Enforcement) ---
    // Check if the user making the request has the necessary role
    if (req.user.role !== 'organizer' && req.user.role !== 'admin') {
        // 403 Forbidden - User identity is confirmed, but role is insufficient
        return res.status(403).json({ msg: 'Access denied. Only College Admins or Admins can create events.' });
    }

    const { title, description, startDate, location, category, imageUrl, maxParticipants, collegeId } = req.body;
    
    const event = new Event({
        title,
        description,
        startDate,
        location,
        category,
        imageUrl,
        maxParticipants,
        // CRUCIAL: Link the event to the creator's ID from the token
        creator: req.user.id, 
        // We assume the College Admin passes their collegeId in the request body
        collegeId: collegeId 
    });

    try {
        const newEvent = await event.save();
        res.status(201).json(newEvent); 
    } catch (err) {
        // Handle validation errors (e.g., missing required fields)
        res.status(400).json({ message: err.message }); 
    }
});

// NOTE: You would typically add PUT (Update) and DELETE (Delete) routes here, 
// which would also be protected by 'auth' and role-restricted.

module.exports = router;