const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { protect, isAdmin } = require("../middleware/auth");

// GET /api/notifications - Get user's notifications with pagination and filtering
router.get('/', protect, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const isRead = req.query.isRead;
        const type = req.query.type;
        const priority = req.query.priority;

        // Build filter object
        const filter = { recipient: req.user._id };
        
        if (isRead !== undefined) {
            filter.isRead = isRead === 'true';
        }
        
        if (type) {
            filter.type = type;
        }
        
        if (priority) {
            filter.priority = priority;
        }

        // Get notifications with pagination
        const notifications = await Notification.find(filter)
            .populate('sender', 'name email')
            .populate('relatedEvent', 'title startDate')
            .populate('relatedRegistration', 'status')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const total = await Notification.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);

        // Get unread count
        const unreadCount = await Notification.countDocuments({
            recipient: req.user._id,
            isRead: false
        });

        res.json({
            notifications,
            pagination: {
                currentPage: page,
                totalPages,
                totalNotifications: total,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            unreadCount
        });

    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ msg: 'Server error while fetching notifications' });
    }
});

// GET /api/notifications/unread-count - Get count of unread notifications
router.get('/unread-count', protect, async (req, res) => {
    try {
        const unreadCount = await Notification.countDocuments({
            recipient: req.user._id,
            isRead: false
        });

        res.json({ unreadCount });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ msg: 'Server error while fetching unread count' });
    }
});

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', protect, async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            recipient: req.user._id
        });

        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        if (!notification.isRead) {
            notification.isRead = true;
            notification.readAt = new Date();
            await notification.save();
        }

        res.json({ msg: 'Notification marked as read', notification });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ msg: 'Server error while marking notification as read' });
    }
});

// PUT /api/notifications/mark-all-read - Mark all notifications as read
router.put('/mark-all-read', protect, async (req, res) => {
    try {
        const result = await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { 
                isRead: true, 
                readAt: new Date() 
            }
        );

        res.json({ 
            msg: 'All notifications marked as read', 
            modifiedCount: result.modifiedCount 
        });
    } catch (error) {
        console.error('Mark all as read error:', error);
        res.status(500).json({ msg: 'Server error while marking all notifications as read' });
    }
});

// DELETE /api/notifications/:id - Delete a notification
router.delete('/:id', protect, async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            recipient: req.user._id
        });

        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        res.json({ msg: 'Notification deleted successfully' });
    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({ msg: 'Server error while deleting notification' });
    }
});

// POST /api/notifications - Create a new notification (Admin only)
router.post('/', protect, isAdmin, async (req, res) => {
    try {
        const {
            recipient,
            type,
            title,
            message,
            relatedEvent,
            relatedRegistration,
            priority = 'medium'
        } = req.body;

        // Validation
        if (!recipient || !type || !title || !message) {
            return res.status(400).json({ 
                msg: 'Recipient, type, title, and message are required' 
            });
        }

        const notification = new Notification({
            recipient,
            sender: req.user._id,
            type,
            title,
            message,
            relatedEvent,
            relatedRegistration,
            priority
        });

        await notification.save();

        // Populate the notification before sending response
        await notification.populate('sender', 'name email');
        await notification.populate('relatedEvent', 'title startDate');
        await notification.populate('relatedRegistration', 'status');

        res.status(201).json({
            msg: 'Notification created successfully',
            notification
        });

    } catch (error) {
        console.error('Create notification error:', error);
        res.status(500).json({ msg: 'Server error while creating notification' });
    }
});

// POST /api/notifications/broadcast - Send notification to multiple users (Admin only)
router.post('/broadcast', protect, isAdmin, async (req, res) => {
    try {
        const {
            recipients, // Array of user IDs
            type,
            title,
            message,
            relatedEvent,
            priority = 'medium'
        } = req.body;

        // Validation
        if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
            return res.status(400).json({ msg: 'Recipients array is required' });
        }

        if (!type || !title || !message) {
            return res.status(400).json({ 
                msg: 'Type, title, and message are required' 
            });
        }

        // Create notifications for all recipients
        const notifications = recipients.map(recipientId => ({
            recipient: recipientId,
            sender: req.user._id,
            type,
            title,
            message,
            relatedEvent,
            priority
        }));

        const createdNotifications = await Notification.insertMany(notifications);

        res.status(201).json({
            msg: `Broadcast sent to ${recipients.length} users`,
            count: createdNotifications.length
        });

    } catch (error) {
        console.error('Broadcast notification error:', error);
        res.status(500).json({ msg: 'Server error while broadcasting notifications' });
    }
});

module.exports = router;