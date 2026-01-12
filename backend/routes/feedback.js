const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const { protect } = require("../middleware/auth");

// Test route to verify feedback routes are working
// GET /api/feedback/test
router.get("/test", (req, res) => {
  res.json({ message: "Feedback routes are working!", timestamp: new Date() });
});

// STUDENT: Submit feedback
// POST /api/feedback
router.post("/", protect, async (req, res) => {
  try {
    const { eventId, rating, comment } = req.body;

    if (!eventId || !rating) {
      return res.status(400).json({ message: "EventId and rating are required" });
    }

    // Prevent duplicate feedback
    const alreadySubmitted = await Feedback.exists({
      userId: req.user._id,
      eventId,
    });

    if (alreadySubmitted) {
      return res.status(400).json({ message: "Feedback already submitted" });
    }

    const feedback = await Feedback.create({
      userId: req.user._id,
      eventId,
      rating,
      comment,
    });

    res.status(201).json(feedback);
  } catch (error) {
    console.error("Feedback error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: Get feedback for an event
// GET /api/feedback/event/:eventId
router.get("/event/:eventId", protect, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ eventId: req.params.eventId })
      .populate("userId", "fullName email")
      .sort("-createdAt");

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// STUDENT: Check if user has already submitted feedback for an event
// GET /api/feedback/check/:eventId
router.get("/check/:eventId", protect, async (req, res) => {
  try {
    const existingFeedback = await Feedback.findOne({
      userId: req.user._id,
      eventId: req.params.eventId,
    });

    if (existingFeedback) {
      res.json({
        hasSubmitted: true,
        feedback: {
          rating: existingFeedback.rating,
          comment: existingFeedback.comment,
          submittedAt: existingFeedback.createdAt,
        },
      });
    } else {
      res.json({ hasSubmitted: false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: Get feedback analytics for admin's events
// GET /api/feedback/analytics
router.get("/analytics", protect, async (req, res) => {
  try {
    // Get all events created by this admin
    const adminEvents = await Event.find({ adminId: req.user._id });
    const eventIds = adminEvents.map(event => event._id);

    if (eventIds.length === 0) {
      return res.json({
        totalEvents: 0,
        totalFeedbacks: 0,
        totalParticipants: 0,
        overallRating: 0,
        ratingStatus: "No Data",
        eventAnalytics: [],
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
    }

    // Get all feedback for admin's events
    const feedbacks = await Feedback.find({ eventId: { $in: eventIds } })
      .populate("eventId", "title category")
      .populate("userId", "fullName");

    // Get total participants from registrations
    const totalParticipants = await Registration.countDocuments({ 
      event: { $in: eventIds },
      status: "approved"
    });

    // Calculate overall statistics
    const totalFeedbacks = feedbacks.length;
    const overallRating = totalFeedbacks > 0 
      ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalFeedbacks 
      : 0;

    // Rating status based on average
    const getRatingStatus = (rating) => {
      if (rating >= 4.5) return "Excellent";
      if (rating >= 3.5) return "Good";
      if (rating >= 2.5) return "Average";
      if (rating >= 1.5) return "Poor";
      return "Very Poor";
    };

    // Rating distribution
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedbacks.forEach(f => {
      ratingDistribution[f.rating]++;
    });

    // Per-event analytics
    const eventAnalytics = adminEvents.map(event => {
      const eventFeedbacks = feedbacks.filter(f => 
        f.eventId._id.toString() === event._id.toString()
      );
      
      const avgRating = eventFeedbacks.length > 0
        ? eventFeedbacks.reduce((sum, f) => sum + f.rating, 0) / eventFeedbacks.length
        : 0;

      return {
        eventId: event._id,
        eventTitle: event.title,
        category: event.category,
        totalFeedbacks: eventFeedbacks.length,
        averageRating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
        ratingStatus: getRatingStatus(avgRating),
        feedbackCount: eventFeedbacks.length
      };
    });

    res.json({
      totalEvents: adminEvents.length,
      totalFeedbacks,
      totalParticipants,
      overallRating: Math.round(overallRating * 10) / 10,
      ratingStatus: getRatingStatus(overallRating),
      eventAnalytics: eventAnalytics.sort((a, b) => b.averageRating - a.averageRating),
      ratingDistribution
    });

  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
