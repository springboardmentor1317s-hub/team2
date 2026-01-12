// backend/models/User.js (FINALIZED VERSION)

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please add a full name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: [
      function () {
        // password required ONLY for manual signup
        return this.authProvider === "local";
      },
      "Password is required",
    ],
    minlength: 6,
    select: false,
  },
  university: {
    type: String,
    required: function () {
      return this.authProvider === "local";
    },
  },
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
    required: true,
  },
  profilePicture: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCS2wb0ixNEu-qFWrF9k1ml03x2jJ6Fc_eKA&s",
  },
  authProvider: {
    type: String,
    enum: ["local", "google", "github"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// --- Mongoose Middleware: Async Password Hashing ---
// CRITICAL: Use the 'function' keyword to maintain 'this' context.
// Mongoose implicitly handles the promise returned by this async function.
UserSchema.pre("save", async function () {
  // This hook runs before the document is saved.

  // Only hash the password if it's new or being modified
  if (!this.isModified("password")) {
    return;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// --- Custom Method for Login (No change needed, but included for completeness) ---
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
