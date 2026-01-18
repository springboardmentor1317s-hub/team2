const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event'); // 🔑 Added to find event creator
const Notification = require('../models/Notification'); // 🔑 Added for notifications
const Feedback = require('../models/Feedback');
const { protect, isAdmin } = require('../middleware/auth');

// 1. STUDENT: Register for an event
// POST /api/registrations
router.post('/', protect, async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    // Check if already registered
    const existing = await Registration.findOne({ event: eventId, student: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "You are already registered for this event" });
    }

    // 1. Create the Registration
    const registration = await Registration.create({
      event: eventId,      
      student: req.user._id, 
      studentName: req.user.fullName,
      status: 'pending',
      appliedAt: Date.now()
    });

    // 2. 🔔 Send Notification to the ADMIN who created this event
    const event = await Event.findById(eventId);
    if (event && event.adminId) {
      await Notification.create({
        recipient: event.adminId, // Send ONLY to the creator admin
        senderName: req.user.fullName,
        message: `${req.user.fullName} has registered for your event: ${event.title}. Please review the request.`,
        type: 'registration',
        eventId: eventId
      });
    }

    res.status(201).json(registration);
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// 2. STUDENT: Get my registrations
// GET /api/registrations/my
router.get('/my', protect, async (req, res) => {
  try {
    const myRegs = await Registration.find({ student: req.user._id })
      .populate('event', 'title startDate location imageUrl collegeName')
      .sort('-createdAt')
      .lean();

    for (let reg of myRegs) {
      const eventId = reg.event?._id || reg.event;
      reg.feedbackSubmitted = await Feedback.exists({
        userId: req.user._id,
        eventId: eventId,
      });
    }

    res.json(myRegs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. ADMIN: Approve or Reject a registration
// PUT /api/registrations/:id/status
router.put('/:id/status', protect, isAdmin, async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'

    // Find registration and populate event title for the notification
    const registration = await Registration.findById(req.params.id).populate('event', 'title');
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    registration.status = status;
    registration.reviewedBy = req.user.fullName; 
    registration.reviewedAt = Date.now();

    await registration.save();

    // 3. 🔔 Send Notification back to the STUDENT
    await Notification.create({
      recipient: registration.student, // Send ONLY to the specific student
      senderName: req.user.fullName, // Admin's Name
      message: `Your registration for "${registration.event.title}" has been ${status.toUpperCase()} by the Admin.`,
      type: status === 'approved' ? 'approval' : 'rejection',
      eventId: registration.event._id
    });

    res.json(registration);
  } catch (error) {
    console.error("Approval Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// 4. ADMIN: Get all registrations
// GET /api/registrations/all
router.get('/all', protect, isAdmin, async (req, res) => {
  try {
    const regs = await Registration.find()
      .populate('event', 'title collegeName startDate')
      .populate('student', 'fullName email')
      .sort('-createdAt');

    res.json(regs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
