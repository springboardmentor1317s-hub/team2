// import githubClient from "../services/githubAuthService";
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import the User model
const { verifyGoogleCode } = require("../services/googleService");
const { githubClient } = require("../services/githubAuthService");

// Helper function to create a JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expires in 30 days
  });
};

const registerUser = async (req, res) => {
  try {
    // 💡 NEW DIAGNOSTIC LINE
    // console.log('Data received by server:', req.body); // Check the data Express received
    const { fullName, email, university, role, password } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // 2. Create the new user (Mongoose pre-save middleware handles password hashing)
    const user = await User.create({
      fullName,
      email,
      password,
      university,
      role,
      authProvider: "local",
    });

    res.status(201).json({
      success: true,
      message: "Registration successful!",
      // Return safe user data
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        university: user.university,
        role: user.role,
        authProvider: "local",
      },
    });
  } catch (error) {
    console.error("Registration Error:", error.message);

    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: message[0], // Return the first validation message
      });
    }

    res
      .status(500)
      .json({ success: false, message: "Server error during registration" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check for user by email (select: false in model forces password to be available)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // 2. Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // 3. Create a token and set it as a cookie
    const token = createToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      signed: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error during login" });
  }
};

const loginWithGoogle = async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.json({ message: "Invalid credentials!" });
  }
  try {
    // Verify the Google code
    const { name, email, picture, email_verified } = await verifyGoogleCode(
      code
    );
    // Check if the email is verified
    if (!email_verified) {
      return res.status(401).json({
        success: false,
        message: "Google email is not verified",
      });
    }
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (!user) {
      // If the user doesn't exist, create a new one
      user = await User.create({
        fullName: name,
        email: email,
        profilePicture: picture,
        authProvider: "google",
      });
      const token = createToken(user._id);
      // Set the token as a cookie
      res.cookie("token", token, {
        httpOnly: true,
        signed: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({
        success: true,
        message: "Login successful!",
        user: {
          id: user._id,
          fullName: name,
          email: email,
          profilePicture: picture,
          authProvider: "google",
        },
      });
    } else {
      // If the user already exists, return the user's details
      const token = createToken(user._id);
      // Set the token as a cookie
      res.cookie("token", token, {
        httpOnly: true,
        signed: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
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
          authProvider: user.authProvider,
        },
      });
    }
  } catch (error) {
    console.error("Google login error:", error);

    res.status(500).json({
      success: false,
      message: "Server error during Google login",
    });
  }
};

const loginWithGithub = async (req, res) => {
  const { code, state } = req.query;
  if (!code || !state) {
    return res.status(400).json({
      success: false,
      message: "Missing code or state",
    });
  }
  // Decode the state
  const decodedState = JSON.parse(
    Buffer.from(state, "base64").toString("utf-8")
  );

  const { clientOrigin } = decodedState;

  try {
    // Verify the GitHub code
    const { email, name, picture } = await githubClient.getUserDetails(code);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "GitHub email not available",
      });
    }

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (!user) {
      // If the user doesn't exist, create a new one
      user = await User.create({
        fullName: name,
        email: email,
        profilePicture: picture,
        authProvider: "github",
      });
    }
    const token = createToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      signed: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
     // redirect to the client origin
    res.redirect(`${clientOrigin}/oauth-success`);
  } catch (error) {
    console.error("GitHub login error:", error);
  }
};

const redirectToAuthURL = async (req, res) => {
  const referer = req.get("referer");
  // Get the client origin
  const clientOrigin = referer ? new URL(referer).origin : null;
  // Get the GitHub authorization URL
  const { state: githubState, url } = githubClient.getWebFlowAuthorizationUrl({
    scopes: ["read:user", "user:email"],
    redirectUrl: `http://localhost:5000/api/auth/github/callback`,
  });
  // Create a combined state
  const combinedState = Buffer.from(
    JSON.stringify({
      githubState,
      clientOrigin,
    })
  ).toString("base64");
  
  const redirectURL = `${url}&state=${combinedState}`;
  // Redirect to the GitHub authorization URL
  res.redirect(redirectURL);
  res.end();
};

const logoutUser = async (req, res) => {
  // Clear the token cookie
  res
    .clearCookie("token")
    .status(200)
    .json({ success: true, message: "Logout successful!" });
};

module.exports = {
  registerUser,
  loginUser,
  loginWithGoogle,
  redirectToAuthURL,
  loginWithGithub,
  logoutUser,
};
