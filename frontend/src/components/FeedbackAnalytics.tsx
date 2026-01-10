import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Star, TrendingUp, Award, AlertCircle, CheckCircle } from "lucide-react";

interface EventAnalytic {
  eventId: string;
  eventTitle: string;
  category: string;
  totalFeedbacks: number;
  averageRating: number;
  ratingStatus: string;
  feedbackCount: number;
}

interface AnalyticsData {
  totalEvents: number;
  totalFeedbacks: number;
  totalParticipants: number;
  overallRating: number;
  ratingStatus: string;
  eventAnalytics: EventAnalytic[];
  ratingDistribution: { [key: number]: number };
}

const FeedbackAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await fetch("http://localhost:5000/api/feedback/analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else if (response.status === 404) {
        setError("Analytics endpoint not available. Please ensure the backend is updated.");
      } else if (response.status === 401) {
        setError("Authentication failed. Please log in again.");
      } else {
        setError(`Failed to fetch analytics (${response.status})`);
      }
    } catch (err) {
      setError("Error connecting to server. Please check if the backend is running.");
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (status: string) => {
    switch (status) {
      case "Excellent": return "text-green-600 bg-green-100";
      case "Good": return "text-blue-600 bg-blue-100";
      case "Average": return "text-yellow-600 bg-yellow-100";
      case "Poor": return "text-orange-600 bg-orange-100";
      case "Very Poor": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getRatingIcon = (status: string) => {
    switch (status) {
      case "Excellent": return <Award className="w-4 h-4" />;
      case "Good": return <CheckCircle className="w-4 h-4" />;
      case "Average": return <TrendingUp className="w-4 h-4" />;
      case "Poor": return <AlertCircle className="w-4 h-4" />;
      case "Very Poor": return <AlertCircle className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Analytics</h3>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Prepare chart data
  const distributionData = Object.entries(analytics.ratingDistribution).map(([rating, count]) => ({
    rating: `${rating} Star${rating !== '1' ? 's' : ''}`,
    count,
    fill: rating === '5' ? '#10B981' : rating === '4' ? '#3B82F6' : rating === '3' ? '#F59E0B' : rating === '2' ? '#F97316' : '#EF4444'
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">📊 Feedback Analytics Dashboard</h2>
        <p className="text-gray-600">Analyze feedback for your events and track performance</p>
      </div>

      {/* Analytics Stats - 5 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalEvents}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Participants</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalParticipants}</p>
              <p className="text-xs text-gray-400 mt-1">Approved registrations</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Feedback</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalFeedbacks}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Overall Rating</p>
              <div className="flex items-center mt-1">
                {renderStars(analytics.overallRating)}
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Performance</p>
              <div className="flex items-center mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRatingColor(analytics.ratingStatus)}`}>
                  {getRatingIcon(analytics.ratingStatus)}
                  <span className="ml-1">{analytics.ratingStatus}</span>
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${getRatingColor(analytics.ratingStatus).split(' ')[1]}`}>
              {getRatingIcon(analytics.ratingStatus)}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Distribution Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  label={({ rating, count }) => count > 0 ? `${rating}: ${count}` : ''}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Events by Rating */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Rated Events</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {analytics.eventAnalytics.slice(0, 5).map((event) => (
              <div key={event.eventId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 truncate">{event.eventTitle}</p>
                  <p className="text-sm text-gray-500 capitalize">{event.category}</p>
                </div>
                <div className="text-right ml-4">
                  {renderStars(event.averageRating)}
                  <p className="text-xs text-gray-500 mt-1">{event.feedbackCount} feedback{event.feedbackCount !== 1 ? 's' : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Event Analytics Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Event Performance Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-medium">Event Name</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Feedback Count</th>
                <th className="px-6 py-3 font-medium">Average Rating</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {analytics.eventAnalytics.map((event) => (
                <tr key={event.eventId} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{event.eventTitle}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs capitalize">
                      {event.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{event.feedbackCount}</td>
                  <td className="px-6 py-4">
                    {event.feedbackCount > 0 ? renderStars(event.averageRating) : (
                      <span className="text-gray-400 text-sm">No feedback</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRatingColor(event.ratingStatus)}`}>
                      {getRatingIcon(event.ratingStatus)}
                      <span className="ml-1">{event.ratingStatus}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeedbackAnalytics;