const Feedback = require("../models/Feedback");
const Registration = require("../models/Registration");

const registerForEvent = async (req, res) => {
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
      status: "pending",
      appliedAt: Date.now(),
    });

    res.status(201).json(registration);
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: Get all registrations
// GET /api/registrations/all
const getAllRegisteredEvents = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate("event", "title collegeName startDate")
      .populate("student", "fullName email")
      .sort("-createdAt")
      .lean(); // Faster processing
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyRegisteredEvents = async (req, res) => {
  try {
    const myRegs = await Registration.find({ student: req.user._id })
      .populate("event", "title startDate location imageUrl collegeName")
      .sort("-createdAt");

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
};

const updateRegistrationStatus = async (req, res) => {
  try {
    const { status } = req.body; // status is 'approved' or 'rejected'

    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    registration.status = status;
    registration.reviewedBy = req.user.fullName; // Tracking admin name
    registration.reviewedAt = Date.now();

    await registration.save();
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerForEvent,
  getAllRegisteredEvents,
  getMyRegisteredEvents,
  updateRegistrationStatus,
};
