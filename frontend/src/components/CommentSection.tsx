import React, { useState, useEffect } from "react";
import { Comment, Reply } from "../types";
import {
  Heart,
  Trash2,
  Edit2,
  MessageCircle,
  Send,
  Loader2,
} from "lucide-react";
import { formatDate } from "../utils/formatters";

interface CommentSectionProps {
  eventId: string;
  onCommentAdded?: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  eventId,
  onCommentAdded,
}) => {
  // ======== STATE MANAGEMENT ========
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(
    new Set()
  );
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // ======== GET CURRENT USER ========
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  // ======== FETCH COMMENTS ========
  useEffect(() => {
    fetchComments();
  }, [eventId]);

  const fetchComments = async () => {
    try {
      setIsLoadingComments(true);
      const response = await fetch(
        `http://localhost:5000/api/comments/event/${eventId}`
      );
      const data = await response.json();

      if (data.success) {
        setComments(data.data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  // ======== ADD NEW COMMENT ========
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      alert("Please write a comment");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to comment");
      return;
    }

    // Get user data directly from localStorage to ensure it's available
    let userName = "Anonymous";
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        userName = user.fullName || user.name || "Anonymous";
      }
    } catch (err) {
      console.warn("Could not parse user data from localStorage", err);
    }

    // Validate userName is not empty or undefined
    if (!userName || userName === "undefined") {
      userName = "Anonymous";
    }

    console.log("Submitting comment with userName:", userName);

    try {
      setIsSubmittingComment(true);
      const payload = {
        eventId,
        content: newComment,
        userName: userName,
      };

      console.log("Comment payload:", payload);

      const response = await fetch("http://localhost:5000/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setNewComment("");
        fetchComments();
        if (onCommentAdded) onCommentAdded();
        alert("Comment posted successfully!");
      } else {
        alert(data.message || "Failed to post comment");
      }
    } catch (error) {
      console.error("Create Comment Error:", error);
      alert("Error posting comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // ======== UPDATE COMMENT ========
  const handleUpdateComment = async (commentId: string) => {
    if (!editingContent.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: editingContent,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setEditingCommentId(null);
        setEditingContent("");
        fetchComments();
      } else {
        alert(data.message || "Failed to update comment");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  // ======== DELETE COMMENT ========
  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        fetchComments();
      } else {
        alert(data.message || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // ======== LIKE COMMENT ========
  const handleLikeComment = async (commentId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to like comments");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/comments/${commentId}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        fetchComments();
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  // ======== ADD REPLY ========
  const handleAddReply = async (commentId: string) => {
    if (!replyContent.trim()) {
      alert("Please write a reply");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to reply");
      return;
    }

    try {
      setIsSubmittingReply(true);
      const response = await fetch(
        `http://localhost:5000/api/comments/${commentId}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: replyContent,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setReplyContent("");
        setReplyingToId(null);
        fetchComments();
      } else {
        alert(data.message || "Failed to post reply");
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // ======== HELPER FUNCTIONS ========
  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-700";
      case "college_admin":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return "👑 Super Admin";
      case "college_admin":
        return "🔑 Admin";
      default:
        return "👤 Student";
    }
  };

  const toggleReplies = (commentId: string) => {
    const newSet = new Set(expandedReplies);
    if (newSet.has(commentId)) {
      newSet.delete(commentId);
    } else {
      newSet.add(commentId);
    }
    setExpandedReplies(newSet);
  };

  // ======== RENDER ========
  return (
    <div className="space-y-6">
      {/* Add Comment Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Share Your Thoughts
        </h3>
        <form onSubmit={handleAddComment} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment... (Max 1000 characters)"
            maxLength={1000}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
            disabled={isSubmittingComment}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {newComment.length}/1000
            </span>
            <button
              type="submit"
              disabled={isSubmittingComment || !newComment.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm"
            >
              {isSubmittingComment ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Post Comment
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Comments ({comments.length})
        </h3>

        {isLoadingComments ? (
          <div className="text-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-600" />
            <p className="text-gray-500 mt-2">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No comments yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
              >
                {/* Comment Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-semibold text-indigo-700">
                      {comment.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 text-sm">
                          {comment.userName}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${getRoleColor(
                            comment.userRole
                          )}`}
                        >
                          {getRoleBadge(comment.userRole)}
                        </span>
                        {comment.isEdited && (
                          <span className="text-xs text-gray-500">
                            (edited)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  {currentUser &&
                    (currentUser._id === comment.userId ||
                      currentUser.role === "super_admin") && (
                      <div className="flex gap-2 ml-2">
                        <button
                          onClick={() => {
                            setEditingCommentId(comment._id);
                            setEditingContent(comment.content);
                          }}
                          className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                </div>

                {/* Comment Content */}
                {editingCommentId === comment._id ? (
                  <div className="space-y-2 mb-3">
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateComment(comment._id)}
                        className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditingContent("");
                        }}
                        className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                    {comment.content}
                  </p>
                )}

                {/* Comment Actions */}
                <div className="flex items-center gap-4 text-sm">
                  <button
                    onClick={() => handleLikeComment(comment._id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                      currentUser && comment.likedBy.includes(currentUser._id)
                        ? "bg-pink-100 text-pink-600"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <Heart
                      className="w-4 h-4"
                      fill={
                        currentUser && comment.likedBy.includes(currentUser._id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                    {comment.likes > 0 && <span>{comment.likes}</span>}
                  </button>
                  <button
                    onClick={() => toggleReplies(comment._id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {comment.replies.length > 0 && (
                      <span>{comment.replies.length}</span>
                    )}
                  </button>
                </div>

                {/* Replies Section */}
                {comment.replies.length > 0 &&
                  expandedReplies.has(comment._id) && (
                    <div className="mt-4 space-y-3 bg-gray-50 rounded-lg p-3 border-l-4 border-indigo-300">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        {comment.replies.length} Repl
                        {comment.replies.length !== 1 ? "ies" : "y"}
                      </p>
                      {comment.replies.map((reply, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded p-3 border border-gray-200 text-sm"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">
                              {reply.userName}
                            </span>
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded font-medium ${getRoleColor(
                                reply.userRole
                              )}`}
                            >
                              {getRoleBadge(reply.userRole)}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed mb-1">
                            {reply.content}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(reply.createdAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                {/* Reply Form */}
                {replyingToId === comment._id ? (
                  <div className="mt-3 space-y-2 bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      maxLength={500}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none text-gray-700"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          setReplyingToId(null);
                          setReplyContent("");
                        }}
                        className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleAddReply(comment._id)}
                        disabled={isSubmittingReply || !replyContent.trim()}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {isSubmittingReply ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Posting...
                          </>
                        ) : (
                          <>
                            <Send className="w-3 h-3" />
                            Reply
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setReplyingToId(comment._id)}
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Reply to this comment
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
