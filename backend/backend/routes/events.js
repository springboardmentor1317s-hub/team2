const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });

    } catch (error) {
        console.error('Get Events Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error fetching events'
        });
    }
});

// @route   GET /api/events/filter
// @desc    Get filtered events based on status, category, and date range
// @access  Public
router.get('/filter', async (req, res) => {
    try {
        const { status, category, dateFrom, dateTo } = req.query;

        // Build the filter query object
        const query = {};

        // Filter by status (can be comma-separated for multiple values)
        if (status) {
            const statusArray = status.split(',').map(s => s.trim());
            query.status = { $in: statusArray };
        }

        // Filter by category (can be comma-separated for multiple values)
        if (category) {
            const categoryArray = category.split(',').map(c => c.trim());
            query.category = { $in: categoryArray };
        }

        // Filter by date range
        if (dateFrom || dateTo) {
            query.startDate = {};
            if (dateFrom) {
                query.startDate.$gte = new Date(dateFrom);
            }
            if (dateTo) {
                // Add 1 day to include events on the end date
                const endDate = new Date(dateTo);
                endDate.setDate(endDate.getDate() + 1);
                query.startDate.$lt = endDate;
            }
        }

        // Execute the query
        const events = await Event.find(query).sort({ startDate: 1 });

        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });

    } catch (error) {
        console.error('Filter Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error filtering events'
        });
    }
});

// @route   POST /api/events
// @desc    Create a new event
// @access  Private (Organizer/Admin)
router.post('/', auth, async (req, res) => {
    try {
        const { title, collegeName, category, location, startDate, endDate, description, maxParticipants, collegeId, imageUrl } = req.body;

        // Validate required fields
        if (!title || !collegeName || !category || !location || !startDate || !endDate || !description || !collegeId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Create event with organizerId from authenticated user
        const event = await Event.create({
            title,
            collegeName,
            category,
            location,
            startDate,
            endDate,
            description,
            maxParticipants: maxParticipants || 100,
            collegeId,
            organizerId: req.user.id,
            imageUrl: imageUrl || `https://picsum.photos/seed/${Math.random()}/800/400`,
            participantsCount: 0,
            status: 'upcoming',
            tags: []
        });

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event
        });

    } catch (error) {
        console.error('Create Event Error:', error.message);

        if (error.name === 'ValidationError') {
            const message = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: message[0]
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating event'
        });
    }
});

module.exports = router;
