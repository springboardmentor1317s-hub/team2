const User = require("../models/User");

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res
        .status(401)
        .json({ success: false, message: "User does not exists!" });
    }
    // if user has a university it means they have completed their profile
    if (user.university) {
      res.status(200).json({
        success: true,
        message: "Login successful!",
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          university: user.university,
          role: user.role,
          profilePicture: user.profilePicture,
        },
      });
    } else {
      // if user has no university it means they have not completed their profile
      res.status(200).json({
        success: true,
        message: "Login successful!",
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          profilePicture: user.profilePicture,
        },
      });
    }
  } catch (error) {
    console.error("Error while getting user:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error while getting user" });
  }
};
const updateProfile = async (req, res) => {
  const { role, university } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res
        .status(401)
        .json({ success: false, message: "User does not exists!" });
    }
    user.role = role;
    user.university = university;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Login successful!",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        university: user.university,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
};

module.exports = { getUser, updateProfile };
