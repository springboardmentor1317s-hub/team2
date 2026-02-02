const express = require("express");
const { authToken } = require("../middleware/auth");
const {
  getNotifications,
  updateNotification,
  deleteNotification,
} = require("../controllers/notificationController");
const router = express.Router();

// @desc    Get notifications for the logged-in user
// @route   GET /api/notifications
router.get("/", authToken, getNotifications);
// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
router.put("/:id/read", authToken, updateNotification);
// @desc    Delete a notification (for auto-cleanup after viewing)
// @route   DELETE /api/notifications/:id
router.delete("/:id", authToken, deleteNotification);

module.exports = router;
