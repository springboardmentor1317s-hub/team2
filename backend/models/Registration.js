const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Point 1: Added studentName for easy display
  studentName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewedBy: {
    type: String, // Name of the Admin who acted on the request
    default: null
  },
  
  appliedAt: {
    type: Date,
    default: Date.now 
  },
  reviewedAt: {
    type: Date
  }
}, { 
 
  timestamps: true 
});

module.exports = mongoose.model('Registration', registrationSchema);
