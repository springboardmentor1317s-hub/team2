const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) return res.json({ msg: "User already exists" });

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role
  });

  await newUser.save();
  res.json({ msg: "Registration successful" });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check user
  const user = await User.findOne({ email });
  if (!user) return res.json({ msg: "User not found" });

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.json({ msg: "Wrong password" });

  // JWT Token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({
    msg: "Login successful",
    token,
    role: user.role,
    name: user.name
  });
});

module.exports = router;
