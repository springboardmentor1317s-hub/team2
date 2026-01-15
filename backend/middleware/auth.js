const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authToken = async (req, res, next) => {
  // Get token from cookie
  const { token } = req.signedCookies;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. Authentication token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Fetch user and attach minimal safe fields
    const user = await User.findById(decoded.id).select("-password");
    if (!user)
      return res
        .status(401)
        .json({ message: "Authentication failed. User does not exist!" });

    req.user = user; // mongoose doc (without password)
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    res
      .status(401)
      .json({ message: "Authentication failed. Invalid or expired token" });
  }
};

const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Access denied. Please login again" });
  }
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden. Admin access required" });
  }
  next();
};

module.exports = { authToken, verifyAdmin };
