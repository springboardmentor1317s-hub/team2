const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The Admin OR the Student
  senderName: { type: String }, // e.g., Student Name or Admin Name
  message: { type: String, required: true },
  type: { type: String, enum: ['registration', 'approval', 'rejection'] },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
