const express = require("express");
const {
  filterEvent,
  getEvents,
  createEvent,
  getMyEvents,
} = require("../controllers/eventController");
const { verifyAdmin, authToken } = require("../middleware/auth");
const router = express.Router();

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get("/", getEvents);
// protected route for getting current admin events
router.get("/my", authToken, verifyAdmin, getMyEvents);
// @route   GET /api/events/filter
// @desc    Get filtered events based on status, category, and date range
// @access  Public
router.get("/filter", filterEvent);

// @route   POST /api/events
// @desc    Create a new event
// @access  Private (Organizer/Admin)
router.post("/", authToken, verifyAdmin, createEvent);

module.exports = router;
