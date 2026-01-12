import React, { useState, useEffect } from "react";

const EventFeedback = ({
  eventId,
  disabled = false,
}: {
  eventId: string;
  disabled?: boolean;
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submittedFeedback, setSubmittedFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Check if user has already submitted feedback
  useEffect(() => {
    const checkExistingFeedback = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/feedback/check/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.hasSubmitted) {
            setHasSubmitted(true);
            setSubmittedFeedback(data.feedback);
          }
        } else if (response.status === 404) {
          // Route not found - this is expected if backend doesn't have the route yet
          console.log("Feedback check route not available, showing form");
        } else {
          console.error("Error checking feedback:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error checking feedback:", error);
        // Don't show error to user, just proceed with showing the form
      } finally {
        setLoading(false);
      }
    };

    if (eventId && token) {
      checkExistingFeedback();
    } else {
      setLoading(false);
    }
  }, [eventId, token]);

  const submitFeedback = async () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    const res = await fetch("http://localhost:5000/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ eventId, rating, comment }),
    });

    if (res.ok) {
      alert("Thank you for your feedback!");
      setHasSubmitted(true);
      setSubmittedFeedback({
        rating,
        comment,
        submittedAt: new Date().toISOString(),
      });
      setRating(0);
      setComment("");
    } else {
      const data = await res.json();
      alert(data.message);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-xl border">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded mb-3"></div>
          <div className="h-16 bg-gray-200 rounded mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  // Show submitted feedback status
  if (hasSubmitted && submittedFeedback) {
    return (
      <div className="bg-green-50 p-4 rounded-xl border border-green-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-green-800">✅ Feedback Submitted</h3>
          <span className="text-xs text-green-600">
            {new Date(submittedFeedback.submittedAt).toLocaleDateString()}
          </span>
        </div>
        
        <div className="mb-2">
          <span className="text-sm text-green-700">Your Rating: </span>
          <div className="inline-flex">
            {[1,2,3,4,5].map(n => (
              <span
                key={n}
                className={`text-lg ${n <= submittedFeedback.rating ? "text-yellow-500" : "text-gray-300"}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {submittedFeedback.comment && (
          <div className="mb-2">
            <span className="text-sm text-green-700">Your Comment: </span>
            <p className="text-sm text-gray-700 italic">"{submittedFeedback.comment}"</p>
          </div>
        )}

        <p className="text-xs text-green-600 mt-2">
          💾 Your feedback is stored in our database and helps improve future events!
        </p>
      </div>
    );
  }

  // Show feedback form if not submitted
  return (
    <div className="bg-white p-4 rounded-xl border">
      <h3 className="font-semibold mb-2">Event Feedback</h3>
      <p className="text-xs text-gray-500 mb-3">
        💾 Your feedback will be stored securely in our MongoDB database
      </p>

      {/* ⭐ Rating */}
      <div className="flex gap-1 mb-3">
        {[1,2,3,4,5].map(n => (
          <button
            key={n}
            onClick={() => setRating(n)}
            className={`text-2xl ${n <= rating ? "text-yellow-500" : "text-gray-300"}`}
          >
            ★
          </button>
        ))}
      </div>

      {/* Optional comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border rounded p-2 text-sm bg-white text-gray-900"
        placeholder="Optional feedback..."
      />

      <button
        onClick={submitFeedback}
        disabled={disabled}
        className={`mt-3 px-4 py-2 rounded text-white ${
          disabled ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600"
        }`}
      >
        {disabled ? "Feedback Submitted" : "Submit Feedback"}
      </button>
    </div>
  );
};

export default EventFeedback;
