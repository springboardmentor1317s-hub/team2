const Event = require("../models/Event");
const Feedback = require("../models/Feedback");
const Notification = require("../models/Notification");
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

    // 2. 🔔 Send Notification to the ADMIN who created this event
    const event = await Event.findById(eventId);

    if (event && event.adminId) {
      await Notification.create({
        recipient: event.adminId, // Send ONLY to the creator admin
        senderName: req.user.fullName,
        message: `${req.user.fullName} has registered for your event: ${event.title}. Please review the request.`,
        type: "registration",
        eventId: eventId,
      });
    }

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

    const registration = await Registration.findById(req.params.id).populate(
      "event",
      "title",
    );
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    registration.status = status;
    registration.reviewedBy = req.user.fullName; // Tracking admin name
    registration.reviewedAt = Date.now();

    await registration.save();
    // 3. 🔔 Send Notification back to the STUDENT
    await Notification.create({
      recipient: registration.student, // Send ONLY to the specific student
      senderName: req.user.fullName, // Admin's Name
      message: `Your registration for "${registration.event.title}" has been ${status.toUpperCase()} by the Admin.`,
      type: status === "approved" ? "approval" : "rejection",
      eventId: registration.event._id,
    });

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
