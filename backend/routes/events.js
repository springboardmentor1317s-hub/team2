const express = require("express");
const {
  getEvents,
  createEvent,
  updateEvent,
  getFilteredEvents,
  deleteEvent,
} = require("../controllers/eventController");
const { verifyAdmin, authToken } = require("../middleware/auth");
const router = express.Router();

// @route   POST /api/events
// @desc    Create a new event
// @access  Private (Organizer/Admin)
router.post("/", authToken, verifyAdmin, createEvent);
// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get("/", getEvents);
// protected route for getting current admin events
// @route   GET /api/events/filter
// @desc    Get filtered events based on status, category, and date range
// @access  Public
router.get("/filter", getFilteredEvents);
// @route   PUT /api/events/:id
// @desc    Update an existing event (admin-owned)
// @access  Private (Admin only)
router.put('/:id', authToken, verifyAdmin, updateEvent);
// @route   DELETE /api/events/:id
// @desc    Delete an existing event (admin-owned)
// @access  Private (Admin only)
router.delete('/:id', authToken, verifyAdmin, deleteEvent);

module.exports = router;
