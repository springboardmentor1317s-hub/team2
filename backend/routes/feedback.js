const express = require("express");
const router = express.Router();
const { authToken } = require("../middleware/auth");
const {
  submitFeedback,
  getAdminFeedback,
  getStudentFeedback,
  getFeedbackAnalytics,
} = require("../controllers/feedbackController");

// Test route to verify feedback routes are working
// GET /api/feedback/test
router.get("/test", (req, res) => {
  res.json({ message: "Feedback routes are working!", timestamp: new Date() });
});

// STUDENT: Submit feedback
// POST /api/feedback
router.post("/", authToken, submitFeedback);

// ADMIN: Get feedback for an event
// GET /api/feedback/event/:eventId
router.get("/event/:eventId", authToken, getAdminFeedback);

// STUDENT: Check if user has already submitted feedback for an event
// GET /api/feedback/check/:eventId
router.get("/check/:eventId", authToken, getStudentFeedback);

// ADMIN: Get feedback analytics for admin's events
// GET /api/feedback/analytics
router.get("/analytics", authToken, getFeedbackAnalytics);

module.exports = router;
