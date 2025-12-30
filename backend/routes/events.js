const express = require('express');
const { filterEvent, getEvents, createEvent } = require('../controllers/eventController');
const router = express.Router();

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', getEvents);

// @route   GET /api/events/filter
// @desc    Get filtered events based on status, category, and date range
// @access  Public
router.get('/filter', filterEvent);

// @route   POST /api/events
// @desc    Create a new event
// @access  Private (Organizer/Admin)
router.post('/', createEvent);

module.exports = router;
