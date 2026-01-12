const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const { protect, isAdmin } = require('../middleware/auth');
const Feedback = require('../models/Feedback');


// 1. STUDENT: Register for an event
// POST /api/registrations
router.post('/', protect, async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    // Use 'event' and 'student' to match your Registration.js schema
    const registration = await Registration.create({
      event: eventId,      
      student: req.user._id, 
      studentName: req.user.fullName,
      status: 'pending',
      appliedAt: Date.now()
      
    });

    res.status(201).json(registration);
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// 2. ADMIN: Get all registrations (to show on Admin Dashboard)
// GET /api/registrations/all
router.get('/my', protect, async (req, res) => {
  try {
    const myRegs = await Registration.find({ student: req.user._id })
      .populate('event', 'title startDate location imageUrl collegeName')
      .sort('-createdAt')
      .lean(); // IMPORTANT

    // 🔑 ADD feedbackSubmitted flag
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
    const { status } = req.body; // status is 'approved' or 'rejected'

    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    registration.status = status;
    registration.reviewedBy = req.user.fullName; // Tracking admin name
    registration.reviewedAt = Date.now();

    await registration.save();
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: Get all registrations
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
