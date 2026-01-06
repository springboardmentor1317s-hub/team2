const express = require('express');
const Event = require('../models/Event');
const User = require('../models/User');
const { protect, isAdmin } = require('../middleware/auth');
const NotificationService = require('../services/notificationService');

const router = express.Router();

// @route   GET /api/events
// @desc    Get events with pagination
// @access  Public
router.get('/', async (req, res) => {
    const startTime = Date.now();
    try {
        console.log('[Events API] Request received');
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        
        console.log(`[Events API] Querying DB - page: ${page}, limit: ${limit}`);
        const queryStart = Date.now();
        
        // DON'T include imageUrl in list view - it's too large (base64 images)
        const events = await Event.find()
            .select('title collegeName category location startDate endDate status participantsCount maxParticipants')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
            
        console.log(`[Events API] Query completed in ${Date.now() - queryStart}ms`);
        
        const total = await Event.countDocuments();
        
        console.log(`[Events API] Total time: ${Date.now() - startTime}ms`);
        
        res.status(200).json({
            success: true,
            count: events.length,
            total,
            page,
            pages: Math.ceil(total / limit),
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

// @route   GET /api/events/:id
// @desc    Get single event with full details including image
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).lean();
        
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error('Get Event Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error fetching event'
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
            adminId: req.user.id,
            imageUrl: imageUrl || `https://picsum.photos/seed/${Math.random()}/800/400`,
            participantsCount: 0,
            status: 'upcoming',
            tags: []
        });

        // 🔥 AUTO-TRIGGER: Notify all students about new event
        try {
            // Get all student user IDs (you might want to filter by university/college)
            const students = await User.find({ role: 'student' }).select('_id');
            const studentIds = students.map(student => student._id);
            
            if (studentIds.length > 0) {
                await NotificationService.notifyEventCreated(event, studentIds);
            }
        } catch (notificationError) {
            console.error('Failed to send event created notifications:', notificationError);
            // Don't fail event creation if notification fails
        }

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

// @route   PUT /api/events/:id
// @desc    Update an event
// @access  Private (Admin only)
router.put('/:id', protect, isAdmin, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if admin owns this event
        if (event.adminId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this event'
            });
        }

        // Update event
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        // 🔥 AUTO-TRIGGER: Notify registered students about event update
        try {
            const Registration = require('../models/Registration');
            const registrations = await Registration.find({ 
                event: req.params.id, 
                status: 'approved' 
            }).select('student');
            
            const registeredStudentIds = registrations.map(reg => reg.student);
            
            if (registeredStudentIds.length > 0) {
                await NotificationService.notifyEventUpdated(updatedEvent, registeredStudentIds);
            }
        } catch (notificationError) {
            console.error('Failed to send event updated notifications:', notificationError);
        }

        res.json({
            success: true,
            message: 'Event updated successfully',
            data: updatedEvent
        });

    } catch (error) {
        console.error('Update Event Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error updating event'
        });
    }
});

// @route   PUT /api/events/:id/cancel
// @desc    Cancel an event
// @access  Private (Admin only)
router.put('/:id/cancel', protect, isAdmin, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if admin owns this event
        if (event.adminId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this event'
            });
        }

        // Update event status to cancelled
        event.status = 'cancelled';
        await event.save();

        // 🔥 AUTO-TRIGGER: Notify registered students about event cancellation
        try {
            const Registration = require('../models/Registration');
            const registrations = await Registration.find({ 
                event: req.params.id, 
                status: 'approved' 
            }).select('student');
            
            const registeredStudentIds = registrations.map(reg => reg.student);
            
            if (registeredStudentIds.length > 0) {
                await NotificationService.notifyEventCancelled(event, registeredStudentIds);
            }
        } catch (notificationError) {
            console.error('Failed to send event cancelled notifications:', notificationError);
        }

        res.json({
            success: true,
            message: 'Event cancelled successfully',
            data: event
        });

    } catch (error) {
        console.error('Cancel Event Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error cancelling event'
        });
    }
});