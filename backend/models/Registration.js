// backend/models/Registration.js
const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
    eventId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Event', 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'cancelled'],
        default: 'approved' // Auto-approve for simplicity
    }
}, { timestamps: true });

// Ensure a user can only register once for the same event
RegistrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', RegistrationSchema);