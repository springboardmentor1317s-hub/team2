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

module.exports = mongoose.model('Notification', NotificationSchema);
