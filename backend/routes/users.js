const express = require("express");
const { updateProfile, getUser } = require("../controllers/userController");
const { authToken } = require("../middleware/auth");
const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", authToken, getUser);
// @route   PATCH /api/users/complete-profile
// @desc    Complete user profile
// @access  Private
router.patch("/complete-profile", authToken, updateProfile);


module.exports = router;
