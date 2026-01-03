const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authToken = async (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token") || req.header("authorization");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // allow Bearer token format
    const raw = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
    const decoded = jwt.verify(raw, process.env.JWT_SECRET);
    // Fetch user and attach minimal safe fields
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ msg: "User not found" });

    req.user = user; // mongoose doc (without password)
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ msg: "Not authorized" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Admin access required" });
  }
  next();
};

module.exports = { authToken, verifyAdmin };
