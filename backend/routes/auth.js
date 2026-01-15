// backend/routes/auth.js
const express = require("express");
const {
  loginUser,
  loginWithGoogle,
  registerUser,
  redirectToAuthURL,
  loginWithGithub,
  logoutUser,
} = require("../controllers/authController");

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", registerUser);
// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", loginUser);
// @route   POST /api/auth/google
// @desc    Google authentication
// @access  Public
router.post("/google", loginWithGoogle);
// @route   GET /api/auth/github
// @desc    Github authentication
// @access  Public
router.get("/github", redirectToAuthURL);
// @route   GET /api/auth/github/callback
// @desc    Github authentication callback
// @access  Public
router.get("/github/callback", loginWithGithub);
// @route   GET /api/auth/logout
// @desc    Logout user
// @access  Public
router.get("/logout", logoutUser);


module.exports = router;
