// backend/routes/auth.js
const express = require("express");
const {
  loginUser,
  loginWithGoogle,
  registerUser,
  redirectToAuthURL,
  loginWithGithub,
} = require("../controllers/authController");

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", loginWithGoogle);
router.get("/github", redirectToAuthURL);
router.get("/github/callback", loginWithGithub);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public

module.exports = router;
