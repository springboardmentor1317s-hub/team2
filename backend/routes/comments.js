const express = require('express');
const Comment = require('../models/Comment');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/comments
// @desc    Create a new comment on an event
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { eventId, content } = req.body;
        const userId = req.user._id;

        // Validation
        if (!eventId || !content) {
            return res.status(400).json({
                success: false,
                message: 'Event ID and comment content are required'
            });
        }

        // Get userName from user object (fullName field)
        const userName = req.user.fullName || req.user.name || 'Anonymous';

        const newComment = new Comment({
            eventId,
            userId,
            userName: userName,
            userRole: req.user.role,
            userEmail: req.user.email,
            content
        });

        await newComment.save();

        res.status(201).json({
            success: true,
            message: 'Comment created successfully',
            data: newComment
        });
    } catch (error) {
        console.error('Create Comment Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error creating comment',
            error: error.message
        });
    }
});

// @route   GET /api/comments/event/:eventId
// @desc    Get all comments for an event
// @access  Public
router.get('/event/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;

        const comments = await Comment.find({ eventId })
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            count: comments.length,
            data: comments
        });
    } catch (error) {
        console.error('Get Comments Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error fetching comments',
            error: error.message
        });
    }
});

// @route   PUT /api/comments/:commentId
// @desc    Update a comment
// @access  Private
router.put('/:commentId', protect, async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.user._id;

        // Find comment and check ownership
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        // Check if user is the comment author or admin
        if (comment.userId.toString() !== userId.toString() && req.user.role !== 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this comment'
            });
        }

        comment.content = content;
        comment.isEdited = true;
        comment.editedAt = new Date();

        await comment.save();

        res.status(200).json({
            success: true,
            message: 'Comment updated successfully',
            data: comment
        });
    } catch (error) {
        console.error('Update Comment Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error updating comment',
            error: error.message
        });
    }
});

// @route   DELETE /api/comments/:commentId
// @desc    Delete a comment
// @access  Private
router.delete('/:commentId', protect, async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;

        // Find comment and check ownership
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        // Check if user is the comment author or admin
        if (comment.userId.toString() !== userId.toString() && req.user.role !== 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this comment'
            });
        }

        await Comment.findByIdAndDelete(commentId);

        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully'
        });
    } catch (error) {
        console.error('Delete Comment Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error deleting comment',
            error: error.message
        });
    }
});

// @route   POST /api/comments/:commentId/like
// @desc    Like a comment
// @access  Private
router.post('/:commentId/like', protect, async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        // Check if user already liked
        const hasLiked = comment.likedBy.includes(userId);

        if (hasLiked) {
            // Remove like
            comment.likedBy = comment.likedBy.filter(id => id.toString() !== userId.toString());
            comment.likes = Math.max(0, comment.likes - 1);
        } else {
            // Add like
            comment.likedBy.push(userId);
            comment.likes += 1;
        }

        await comment.save();

        res.status(200).json({
            success: true,
            message: hasLiked ? 'Like removed' : 'Comment liked',
            data: comment
        });
    } catch (error) {
        console.error('Like Comment Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error liking comment',
            error: error.message
        });
    }
});

// @route   POST /api/comments/:commentId/reply
// @desc    Reply to a comment
// @access  Private
router.post('/:commentId/reply', protect, async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.user._id;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Reply content is required'
            });
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        const reply = {
            userId,
            userName: req.user.name,
            userRole: req.user.role,
            userEmail: req.user.email,
            content,
            createdAt: new Date()
        };

        comment.replies.push(reply);
        await comment.save();

        res.status(201).json({
            success: true,
            message: 'Reply added successfully',
            data: comment
        });
    } catch (error) {
        console.error('Reply Comment Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error adding reply',
            error: error.message
        });
    }
});

module.exports = router;
