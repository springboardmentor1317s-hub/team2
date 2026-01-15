const express = require("express");
const { authToken } = require("../middleware/auth");
const {
  createComment,
  getAllComments,
  updateComment,
  deleteComment,
  giveLikeToComment,
  giveReplyToComment,
} = require("../controllers/commentController");

const router = express.Router();

// @route   POST /api/comments
// @desc    Create a new comment on an event
// @access  Private
router.post("/", authToken, createComment);
// @route   GET /api/comments/event/:eventId
// @desc    Get all comments for an event
// @access  Public
router.get("/event/:eventId", getAllComments);

// @route   PUT /api/comments/:commentId
// @desc    Update a comment
// @access  Private
router.put("/:commentId", authToken, updateComment);

// @route   DELETE /api/comments/:commentId
// @desc    Delete a comment
// @access  Private
router.delete("/:commentId", authToken, deleteComment);

// @route   POST /api/comments/:commentId/like
// @desc    Like a comment
// @access  Private
router.post("/:commentId/like", authToken, giveLikeToComment);

// @route   POST /api/comments/:commentId/reply
// @desc    Reply to a comment
// @access  Private
router.post("/:commentId/reply", authToken, giveReplyToComment);

module.exports = router;
