const express = require('express');
const Event = require('../models/Event');
const { protect, isAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 }).lean();
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
// @access  Private (Admin only)
router.post('/', protect, isAdmin, async (req, res) => {
    try {
        const { title, collegeName, category, location, startDate, endDate, description, maxParticipants, collegeId, imageUrl } = req.body;

        // Validate required fields
        if (!title || !collegeName || !category || !location || !startDate || !endDate || !description || !collegeId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Create event with adminId from authenticated user
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
            adminId: req.user._id, // Use _id from Mongoose document
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

// @route   PUT /api/events/:id
// @desc    Update an existing event (admin-owned)
// @access  Private (Admin only)
router.put('/:id', protect, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        // Ensure the authenticated admin owns this event
        const ownsEvent = String(event.adminId) === String(req.user._id);
        if (!ownsEvent) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this event' });
        }

        const updatableFields = [
            'title', 'collegeName', 'category', 'location', 'startDate', 'endDate',
            'description', 'maxParticipants', 'imageUrl', 'status', 'tags'
        ];

        updatableFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                event[field] = req.body[field];
            }
        });

        await event.save();
        return res.status(200).json({ success: true, message: 'Event updated successfully', data: event });
    } catch (error) {
        console.error('Update Event Error:', error.message);
        return res.status(500).json({ success: false, message: 'Error updating event' });
    }
});

// @route   DELETE /api/events/:id
// @desc    Delete an existing event (admin-owned)
// @access  Private (Admin only)
router.delete('/:id', protect, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        // Ensure the authenticated admin owns this event
        const ownsEvent = String(event.adminId) === String(req.user._id);
        if (!ownsEvent) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this event' });
        }

        await Event.deleteOne({ _id: id });
        return res.status(200).json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Delete Event Error:', error.message);
        return res.status(500).json({ success: false, message: 'Error deleting event' });
    }
});

module.exports = router;
