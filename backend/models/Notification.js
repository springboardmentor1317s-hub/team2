const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

    type: {
        type: String,
        enum: [
            'registration_approved',
            'registration_rejected', 
            'event_created',
            'event_updated',
            'event_cancelled',
            'new_registration',
            'system_announcement'
        ],
        required: true
    },

    title: {
        type: String,
        required: true,
        maxLength: 100
    },

    message: {
        type: String,
        required: true,
        maxLength: 100
    },

    relatedEvent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        default: null
    },

    relatedRegistration: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Registration',
        default: null
    },

    isRead: {
        type: Boolean,
        default: false
    },

    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    
    readAt: {
        type: Date,
        default: null
    }
});

// Index for better query performance
NotificationSchema.index({ recipient: 1, createdAt: -1 });
NotificationSchema.index({ recipient: 1, isRead: 1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ priority: 1 });

// Instance method to mark as read
NotificationSchema.methods.markAsRead = function() {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
};

// Static method to get user's notifications with filters
NotificationSchema.statics.getUserNotifications = function(userId, options = {}) {
    const {
        page = 1,
        limit = 20,
        isRead,
        type,
        priority
    } = options;

    const filter = { recipient: userId };
    
    if (isRead !== undefined) filter.isRead = isRead;
    if (type) filter.type = type;
    if (priority) filter.priority = priority;

    const skip = (page - 1) * limit;

    return this.find(filter)
        .populate('sender', 'name email')
        .populate('relatedEvent', 'title startDate')
        .populate('relatedRegistration', 'status')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
};

module.exports = mongoose.model('Notification', NotificationSchema);
