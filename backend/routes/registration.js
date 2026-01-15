const express = require("express");
const router = express.Router();
const { authToken, verifyAdmin } = require("../middleware/auth");
const {
  registerForEvent,
  getAllRegisteredEvents,
  updateRegistrationStatus,
  getMyRegisteredEvents,
} = require("../controllers/registrationController");

// 1. STUDENT: Register for an event
// POST /api/registrations
router.post("/", authToken, registerForEvent);

// 2. ADMIN: Get all registrations (to show on Admin Dashboard)
// GET /api/registrations/all
router.get("/all", authToken, verifyAdmin, getAllRegisteredEvents);

// 3. ADMIN: Approve or Reject a registration
// PUT /api/registrations/:id/status
router.put("/:id/status", authToken, verifyAdmin, updateRegistrationStatus);

// 4. STUDENT: Get my registrations (to see status and admin action)
// GET /api/registrations/my
router.get("/my", authToken, getMyRegisteredEvents);

module.exports = router;