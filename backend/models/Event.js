const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true
    },
    collegeName: {
        type: String,
        required: [true, 'College name is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['cultural', 'sports', 'hackathon', 'workshop', 'other']
    },
    collegeId: {
        type: String,
        required: true
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        type: String,
        required: [true, 'Location is required']
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    maxParticipants: {
        type: Number,
        required: true,
        default: 100
    },
    participantsCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed'],
        default: 'upcoming'
    },
    imageUrl: {
        type: String,
        default: 'https://picsum.photos/800/400'
    },
    tags: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Event', EventSchema);
