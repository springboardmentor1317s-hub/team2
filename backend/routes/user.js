const express = require("express");
const { updateProfile, getUser } = require("../controllers/userController");
const { authToken } = require("../middleware/auth");
const router = express.Router();

router.get("/profile", authToken, getUser);
router.patch("/complete-profile", authToken, updateProfile);


module.exports = router;
