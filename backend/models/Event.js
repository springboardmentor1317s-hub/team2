// backend/models/Event.js

const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    location: { type: String, required: true },
    category: { type: String, enum: ['hackathon', 'cultural', 'sports', 'workshop', 'other'], default: 'other' },
    imageUrl: { type: String, default: 'https://placehold.co/800x400' },
    
    // Relationship fields:
    creator: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    collegeId: { 
        type: String, 
        required: true 
    },
    
    maxParticipants: { type: Number, default: 100 },
    participantsCount: { type: Number, default: 0 }, 
    status: { 
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);