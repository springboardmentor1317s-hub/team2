import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../App";

interface Feedback {
  _id: string;
  rating: number;
  comment?: string;
  userId: {
    fullName?: string;
    email?: string;
  };
  createdAt: string;
}

interface Props {
  eventId: string;
}

const EventFeedbackAdmin: React.FC<Props> = ({ eventId }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/feedback/event/${eventId}`,
          {
            // for getting token from cookie
            withCredentials: true,
          }
        );
        // Ensure feedbacks is always an array
        const data = res.data;
        const feedbackArray = Array.isArray(data)
          ? data
          : data?.data || data?.feedbacks || [];
        setFeedbacks(feedbackArray);
      } catch (error) {
        console.error("Failed to load feedback", error);
        setFeedbacks([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [eventId]);

  if (loading) {
    return <p className="text-gray-500">Loading feedback...</p>;
  }

  if (feedbacks.length === 0) {
    return (
      <div className="mt-4 p-4 border rounded-lg bg-gray-50">
        <p className="text-gray-600 text-sm">No feedback submitted yet.</p>
      </div>
    );
  }

  const avgRating =
    feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length;

  return (
    <div className="mt-6 border rounded-xl p-4 bg-white">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Event Feedback (Admin View)</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Average Rating:{" "}
        <span className="font-bold">{avgRating.toFixed(1)} ⭐</span>
        <span className="text-xs text-gray-500 ml-2">
          ({feedbacks.length} total feedback{feedbacks.length !== 1 ? "s" : ""})
        </span>
      </p>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {feedbacks.map((f) => (
          <div key={f._id} className="border rounded-lg p-3 bg-gray-50">
            <div className="flex justify-between">
              <p className="font-medium text-sm text-gray-800">
                {f.userId?.fullName || "Student"}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm">{f.rating} ⭐</p>
                <span className="text-xs text-gray-400 bg-white px-1 rounded">
                  ID: {f._id.slice(-6)}
                </span>
              </div>
            </div>

            {f.comment && (
              <p className="text-sm text-gray-700 mt-1">{f.comment}</p>
            )}

            <p className="text-xs text-gray-400 mt-1">
              {new Date(f.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
        <strong>📊 Data Storage:</strong> All feedback is permanently stored in
        MongoDB with timestamps, user references, and event associations for
        analytics and reporting.
      </div>
    </div>
  );
};

export default EventFeedbackAdmin;
