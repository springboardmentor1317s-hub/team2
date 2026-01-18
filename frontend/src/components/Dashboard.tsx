import React, { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  TrendingUp,
  Activity,
  AlertCircle,
  Plus,
  FileText,
  CheckCircle,
  Filter,
  Shield,
  MoreHorizontal,
  LayoutDashboard,
  Clock,
  Check,
  X as XIcon,
  Download,
  Home,
  ChevronRight,
  LogOut,
  Settings,
  ClipboardList,
  BarChart,
  Moon,
  Sun,
  Search,
  Compass,
  Bell,
  User,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useTheme } from "../context/ThemeContext";
import { formatDate } from "../utils/formatters";
import { getEventStatus } from "../utils/eventStatus";
import EventForm from "./EventForm";
import EventFeedback from "./EventFeedback";
import FeedbackAnalytics from "./FeedbackAnalytics";

// --- 💡 MOCK STRUCTURES (From your previous working code) ---
// Define the roles explicitly for comparison

const UserRole = {
  STUDENT: "student",
  ADMIN: "admin",
};

// Mock User structure based on what you pass from App.tsx
interface AppUser {
  id?: string; // Added ID for helper functions
  fullName: string;
  university: string;
  role: "student" | "admin";
  collegeId?: string;
}

const MOCK_REGISTRATIONS = [
  {
    id: "r1",
    userId: "u1",
    eventId: "e1",
    timestamp: new Date(),
    status: "approved",
  },
  {
    id: "r2",
    userId: "u1",
    eventId: "e2",
    timestamp: new Date(),
    status: "pending",
  },
  {
    id: "r3",
    userId: "u2",
    eventId: "e1",
    timestamp: new Date(),
    status: "approved",
  },
  {
    id: "r4",
    userId: "u3",
    eventId: "e2",
    timestamp: new Date(),
    status: "pending",
  },
];
const MOCK_ALL_USERS = [
  {
    id: "u1",
    name: "Ajay S.",
    university: "Mahendra College",
    role: UserRole.STUDENT,
    lastActive: "2 hours ago",
    status: "Active",
  },
  {
    id: "u2",
    name: "Admin B.",
    university: "Surya University",
    role: UserRole.ADMIN,
    lastActive: "1 day ago",
    status: "Active",
  },
  {
    id: "u3",
    name: "Admin Z.",
    university: "Global Campus",
    role: UserRole.ADMIN,
    lastActive: "10 mins ago",
    status: "Active",
  },
];
const MOCK_ADMIN_LOGS = [
  {
    id: "l1",
    timestamp: new Date(),
    userId: "u3",
    action: "Approved User",
    details: "Ajay S. approved by Admin Z.",
    status: "completed",
  },
  {
    id: "l2",
    timestamp: new Date(),
    userId: "u1",
    action: "Flagged Content",
    details: "Event 'Test Event' flagged for review.",
    status: "pending",
  },
];

const allUsers = MOCK_ALL_USERS;
const adminLogs = MOCK_ADMIN_LOGS;
// 🔑 ADD THIS BLOCK BACK for the Registration Trends Chart
const data = [
  { name: "Nov 2024", events: 15, participants: 1200 },
  { name: "Dec 2024", events: 20, participants: 1600 },
  { name: "Jan 2025", events: 12, participants: 980 },
  { name: "Feb 2025", events: 14, participants: 1150 },
  { name: "Mar 2025", events: 17, participants: 1350 },
];

// --- DASHBOARD PROPS (Simplified to use working components/functions) ---
interface DashboardProps {
  user: AppUser;
  handleLogout: () => void; // From App.tsx
  setCurrentPage: (page: string) => void; // From App.tsx
  // Optional props for actions (you may need to implement these functions in App.tsx)
  onCreateEventClick: () => void;
  onUpdateRegistrationStatus?: (
    id: string,
    status: "approved" | "rejected"
  ) => void;
  onDeleteEvent?: (eventId: string) => void;
  onDeleteUser?: (userId: string) => void;
  children?: React.ReactNode; // Add children prop to render custom content
}

// --- STAT CARD UTILITY COMPONENT (No Change) ---
const StatCard: React.FC<any> = ({
  title,
  value,
  change,
  isPositive,
  icon,
  color,
}) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      {change && (
        <p
          className={`text-xs mt-2 font-medium ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? "+" : ""}
          {change}{" "}
          <span className="text-gray-400 font-normal">vs last month</span>
        </p>
      )}
    </div>
    <div className={`p-3 rounded-lg ${color} text-white`}>{icon}</div>
  </div>
);

export function Dashboard({
  user,
  handleLogout,
  setCurrentPage,
  onCreateEventClick,
  onUpdateRegistrationStatus,
  onDeleteEvent,
  onDeleteUser,
  children,
}: DashboardProps) {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [registrations, setRegistrations] = useState<any[]>([]);
  // 🔑 NEW: Dynamic State for Live Events
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  // --- 🔑 UPDATED CONNECTION LOGIC ---
  // We use lowercase comparison to match the backend exactly
  const isAdmin = user.role === "admin";
  const isStudent = user.role === "student";

  // 🔔 NEW: Notification State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.success) setNotifications(result.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Add this to your existing useEffect or create a new one
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Mark read
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      // Delete immediately (UI + DB)
      await fetch(`http://localhost:5000/api/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove from state
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  // 🔑 ADD THESE HELPER FUNCTIONS BACK:
  const getEventName = (id: string) =>
    events.find((e) => (e._id || e.id) === id)?.title || "Unknown Event";

  const getCollegeName = (id: string) =>
    events.find((e) => (e._id || e.id) === id)?.collegeName || "N/A";

  const getUserName = (id: string) =>
    allUsers.find((u) => u.id === id)?.name || "Unknown User";

  const getAdminName = (id: string) =>
    allUsers.find((u) => u.id === id)?.name || "System";

  const handleUpdateRegistrationStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/registrations/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        // 🔑 Update local state immediately so the UI refreshes
        setRegistrations((prev) =>
          prev.map((reg) =>
            reg._id === id ? { ...reg, status, reviewedBy: user.fullName } : reg
          )
        );
        alert(`Registration ${status}!`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteRegistration = (id: string) => {
    setRegistrations((prev) => prev.filter((reg) => reg.id !== id));
  };

  // 🔑 NEW: Fetch events from database

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        // 1. Fetch Events (You already have this, but ensure it matches backend structure)
        const eventRes = await fetch("http://localhost:5000/api/events");
        const eventResult = await eventRes.json();
        if (eventResult.success) setEvents(eventResult.data);

        // 2. Fetch Registrations (🔑 NEW)
        // If Admin: fetch /all, If Student: fetch /my
        const regUrl = isAdmin
          ? "http://localhost:5000/api/registrations/all"
          : "http://localhost:5000/api/registrations/my";

        const regRes = await fetch(regUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const regData = await regRes.json();
        setRegistrations(regData);
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.role]); // Refetch if role changes

  // --- Calculation Stubs (Needed for StatCards) ---
  const totalParticipants = events.reduce(
    (sum, e) => sum + (e.participantsCount || 0),
    0
  );
  const averageParticipants =
    events.length > 0 ? (totalParticipants / events.length).toFixed(1) : "0";

  // 🔑 FIX: Re-defining the missing variable
  const dashboardRegistrations = isStudent
    ? registrations.filter(
        (r) =>
          r.userId === MOCK_ALL_USERS.find((u) => u.name === user.fullName)?.id
      )
    : registrations;

  // 🔑 NEW: Filter events for admin - show only events created by this admin
  const userId = (user as any)._id || user.id;

  const adminOwnedEvents = isAdmin
    ? events.filter((event) => {
        const eventAdminId =
          typeof event.adminId === "object" ? event.adminId._id : event.adminId;

        return String(eventAdminId) === String(userId);
      })
    : events;

  // 🔑 NEW: Filter registrations for admin - show only registrations for events they created
  const adminOwnedRegistrations = isAdmin
    ? registrations.filter((reg) => {
        // Get the event ID from registration
        const eventId = String(reg.eventId || reg.event?._id || "");
        // Check if this event is in the admin's owned events
        const isOwnedEvent = adminOwnedEvents.some((event) => {
          const eid = String(event._id || event.id || "");
          return eid === eventId;
        });
        return isOwnedEvent;
      })
    : registrations;

  // 🔑 ADD THIS LINE: Filter events created ONLY by the current admin

  // Create CSV content
  const handleExportData = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let fileName = "";

    if (isAdmin) {
      // --- ADMIN EXPORT: My Created Events + Registration Stats ---
      headers = [
        "Event Title",
        "Category",
        "Location",
        "Event Date",
        "Total Registrations",
        "Approved Count",
        "Max Participants",
      ];

      // Filter the global registrations to find ones matching the admin's events
      rows = myCreatedEvents.map((event) => {
        const eventRegistrations = registrations.filter(
          (r) => r.event?._id === event._id || r.eventId === event._id
        );

        const approvedCount = eventRegistrations.filter(
          (r) => r.status === "approved"
        ).length;

        return [
          `"${event.title}"`,
          event.category,
          `"${event.location}"`,
          formatDate(event.startDate),
          eventRegistrations.length.toString(),
          approvedCount.toString(),
          event.maxParticipants.toString(),
        ];
      });

      fileName = `Admin_Events_Report_${user.fullName.replace(
        /\s+/g,
        "_"
      )}.csv`;
    } else {
      // --- STUDENT EXPORT: Events I have registered for ---
      headers = [
        "Event Name",
        "Organizer/College",
        "Registration Date",
        "My Status",
        "Reviewed By",
      ];

      rows = registrations.map((reg) => {
        // Get college name from event data
        const collegeNameValue =
          reg.event?.collegeName ||
          events.find((e) => String(e._id) === String(reg.eventId))
            ?.collegeName ||
          "Unknown College";
        return [
          `"${reg.event?.title || "Unknown Event"}"`,
          `"${collegeNameValue}"`,
          formatDate(reg.appliedAt || reg.createdAt),
          reg.status.toUpperCase(),
          reg.reviewedBy || "Pending Review",
        ];
      });

      fileName = `My_Registrations_${user.fullName.replace(/\s+/g, "_")}.csv`;
    }

    // --- CSV GENERATION ENGINE ---
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete event (admin-only)
  const handleDeleteEvent = async (eventId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication required");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          "x-auth-token": token,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        setEvents((prev) =>
          prev.filter((e) => String(e._id || e.id) !== String(eventId))
        );
        alert("Event deleted successfully!");
      } else {
        console.error("Delete response:", data);
        alert(data.message || `Failed to delete event (${res.status})`);
      }
    } catch (err) {
      console.error("Delete event error:", err);
      alert("Error deleting event. Please try again.");
    }
  };

  // Submit edit
  const handleEditEventSubmit = async (
    eventId: string,
    updated: Partial<any>
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication required");
        return;
      }

      // Remove fields that shouldn't be sent in update
      const payload = { ...updated };

      console.log("Submitting edit with payload:", payload);

      const res = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("Edit response status:", res.status);

      const data = await res.json();
      console.log("Edit response data:", data);

      // Check if response is OK (200-299 status code) OR if success field is true
      if ((res.ok || res.status === 200) && (data.success || data.data)) {
        const updatedEvent = data.data || data;
        setEvents((prev) =>
          prev.map((e) =>
            String(e._id || e.id) === String(eventId)
              ? { ...e, ...updatedEvent }
              : e
          )
        );
        setIsEditOpen(false);
        setSelectedEvent(null);
        alert("Event updated successfully!");
      } else {
        console.error("Update failed - response:", data);
        alert(data.message || `Failed to update event (${res.status})`);
      }
    } catch (err) {
      console.error("Update event error:", err);
      alert("Error updating event. Please try again.");
    }
  };

  // --- Tabs Configuration ---
  const adminTabs = [
    "Overview",
    "Discover Events",
    "User Management",
    "Event Management",
    "Registrations",
    "Feedback Analytics",
  ];
  const studentTabs = ["Overview", "Discover Events", "My Events"];
  const currentTabs = isAdmin ? adminTabs : studentTabs;

  // Layout helper
  const isFullWidth = [
    "user management",
    "event management",
    "registrations",
    "feedback analytics",
    "my events",
  ].includes(activeTab);

  // --- TABLE COMPONENTS (Updated to use MOCK data and props) ---

  const RecentEventsTable = ({
    events: eventList,
    limit,
  }: {
    events: any[];
    limit?: number;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">
          {activeTab === "event management"
            ? "Event Management"
            : "Recent Events"}
        </h3>
        {isAdmin && activeTab === "event management" && (
          <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            Approve Pending Flagged Events
          </button>
        )}
        {!isAdmin && activeTab !== "event management" && (
          <button
            onClick={() => setCurrentPage("discover")}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View All
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 font-medium">Event Name</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Status</th>
              {isAdmin && (
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {eventList.slice(0, limit || eventList.length).map((event) => (
              <tr
                key={event._id || event.id}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium line-clamp-1">
                        {event.title}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-1">
                        {event.location}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">
                    {event.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {formatDate(event.startDate)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                      getEventStatus(event.startDate, event.endDate) ===
                      "upcoming"
                        ? "bg-blue-50 text-blue-600"
                        : getEventStatus(event.startDate, event.endDate) ===
                          "ongoing"
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {getEventStatus(event.startDate, event.endDate)}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setIsEditOpen(true);
                        }}
                        className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
                        title="Edit Event"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event._id || event.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const UserActivityTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">User Activity</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
          View All Users
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 font-medium">User</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium">College</th>
              <th className="px-6 py-3 font-medium">Last Active</th>
              <th className="px-6 py-3 font-medium">Status</th>
              {isAdmin && (
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {allUsers.map((u) => (
              <tr
                key={u.id}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold uppercase ${
                        u.role === UserRole.STUDENT
                          ? "bg-blue-100 text-blue-700"
                          : u.role === UserRole.ADMIN
                          ? "bg-purple-100 text-purple-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {u.name.charAt(0)}
                    </div>
                    {u.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                      u.role === UserRole.STUDENT
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {u.university || "-"}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {u.lastActive || "Never"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-medium ${
                      u.status === "Active" ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {u.status || "Active"}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 text-right">
                    {onDeleteUser && (
                      <button
                        onClick={() => onDeleteUser(u.id)}
                        className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                        title="Ban/Delete User"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const RegistrationsTable = ({
    registrations: regList,
    showAdminActions = true,
  }: {
    registrations: any[];
    showAdminActions?: boolean;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">Event Registrations</h3>
        <div className="flex gap-2">
          <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg">
            <Filter className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportData}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Export CSV
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 font-medium">Student</th>
              <th className="px-6 py-3 font-medium">Event</th>
              <th className="px-6 py-3 font-medium">Date Registered</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {regList.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No registrations found.
                </td>
              </tr>
            ) : (
              regList.map((reg) => (
                <React.Fragment key={reg._id}>
                  {/* MAIN REGISTRATION ROW */}
                  <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {reg.student?.fullName || "User"}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {reg.event?.title || "Event Details"}
                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      {formatDate(reg.appliedAt || reg.createdAt)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                          reg.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : reg.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {showAdminActions && reg.status === "pending" ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              handleUpdateRegistrationStatus(
                                reg._id,
                                "approved"
                              )
                            }
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateRegistrationStatus(
                                reg._id,
                                "rejected"
                              )
                            }
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <XIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ) : showAdminActions ? (
                        <div className="text-xs text-gray-400 italic">
                          Processed
                        </div>
                      ) : reg.status === "pending" ? (
                        <div className="text-xs text-yellow-600 font-medium italic">
                          Waiting...
                        </div>
                      ) : (
                        <div className="text-xs text-gray-600 font-medium">
                          {getCollegeName(
                            reg.eventId || reg.event?._id || reg.event?.id
                          )}
                        </div>
                      )}
                    </td>
                  </tr>

                  {/* ⭐ FEEDBACK ROW (STUDENT + APPROVED ONLY) */}
                  {!isAdmin && reg.status === "approved" && (
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="px-6 py-4">
                        <EventFeedback
                          eventId={reg.event?._id || reg.eventId}
                          disabled={false}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // admin logs table
  const AdminLogsTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">System Logs</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
          <Download className="w-4 h-4" /> Download
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 font-medium">Timestamp</th>
              <th className="px-6 py-3 font-medium">Admin</th>
              <th className="px-6 py-3 font-medium">Action</th>
              <th className="px-6 py-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {adminLogs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-2 text-gray-400" />
                    {formatDate(log.timestamp)}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {getAdminName(log.userId)}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // --- MAIN RETURN ---

  return (
    <>
      <div className="dashboard-layout flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* 1. Sidebar Navigation */}
        <aside
          className={`
                 dark:bg-gray-800 shadow-2xl flex flex-col justify-between 
                transition-all duration-300 ease-in-out z-50 
                ${isCollapsed ? "w-20" : "w-64"}
            `}
          onMouseEnter={() => setIsCollapsed(false)}
          onMouseLeave={() => setIsCollapsed(true)}
        >
          <div className="flex flex-col h-full">
            <div className="logo-section px-3 pt-5 pb-8 overflow-hidden">
              <h1
                className={`font-extrabold text-xl text-indigo-700 dark:text-indigo-400 whitespace-nowrap 
                                    ${
                                      isCollapsed
                                        ? "opacity-0 h-0"
                                        : "opacity-100 h-auto transition-opacity duration-300"
                                    }`}
              >
                CampusEventHub
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">
                {user.role} Portal
              </p>
              {isCollapsed && (
                <LayoutDashboard className="w-8 h-8 text-indigo-600 mx-auto" />
              )}
            </div>

            <nav className="nav-menu space-y-2">
              {currentTabs.map((tab) => {
                const tabLower = tab.toLowerCase();
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      if (tabLower.includes("discover")) {
                        // If 'Discover Events' is clicked, redirect the main App page
                        setCurrentPage("discover");
                        setActiveTab(tabLower); // Also set active tab for styling
                      } else if (children && !tabLower.includes("discover")) {
                        // If children are shown (EventsDiscoveryPage) and user clicks a non-discover tab, navigate back to dashboard
                        setCurrentPage("dashboard");
                        setActiveTab(tabLower);
                      } else {
                        // For all other tabs, stay on the dashboard and switch content
                        setActiveTab(tabLower);
                      }
                    }}
                    className={`w-full flex items-center p-3 rounded-lg font-medium text-sm transition-all duration-200 
                               ${
                                 (children && tabLower.includes("discover")) ||
                                 activeTab === tabLower
                                   ? "bg-indigo-500 text-white shadow-md"
                                   : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                               }
                              `}
                  >
                    {tab === "Overview" ? (
                      <Home
                        className={`w-5 h-5 ${
                          !isCollapsed ? "mr-3" : "mx-auto"
                        }`}
                      />
                    ) : tab === "Discover Events" ? (
                      <Compass
                        className={`w-5 h-5 ${
                          !isCollapsed ? "mr-3" : "mx-auto"
                        }`}
                      /> // <-- NEW DISCOVER TAB
                    ) : tab === "My Events" || tab === "Event Management" ? (
                      <Calendar
                        className={`w-5 h-5 ${
                          !isCollapsed ? "mr-3" : "mx-auto"
                        }`}
                      />
                    ) : tab === "User Management" ? (
                      <Users
                        className={`w-5 h-5 ${
                          !isCollapsed ? "mr-3" : "mx-auto"
                        }`}
                      />
                    ) : tab === "Registrations" ? (
                      <ClipboardList
                        className={`w-5 h-5 ${
                          !isCollapsed ? "mr-3" : "mx-auto"
                        }`}
                      />
                    ) : tab === "Analytics" ? (
                      <TrendingUp
                        className={`w-5 h-5 ${
                          !isCollapsed ? "mr-3" : "mx-auto"
                        }`}
                      />
                    ) : tab === "Admin Logs" ? (
                      <FileText
                        className={`w-5 h-5 ${
                          !isCollapsed ? "mr-3" : "mx-auto"
                        }`}
                      />
                    ) : tab === "Event Management" ? (
                      <Activity
                        className={`w-5 h-5 ${
                          !isCollapsed ? "mr-3" : "mx-auto"
                        }`}
                      />
                    ) : (
                      <Settings
                        className={`w-5 h-5 ${
                          !isCollapsed ? "mr-3" : "mx-auto"
                        }`}
                      />
                    )}
                    {/* TEXT - Hidden when collapsed */}
                    <span
                      className={`whitespace-nowrap ${
                        isCollapsed ? "hidden" : ""
                      }`}
                    >
                      {tab}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* 🔑 NEW: Profile and Notification Icons (Always visible in collapsed state) */}
          <div className="mt-auto px-2 py-4 border-t border-gray-200 dark:border-gray-700">
            {/* 1. Notification Bell - Click to toggle */}
            <div className="relative w-full">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="w-full flex items-center justify-center p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 relative"
                title="Notifications"
              >
                <Bell
                  className={`w-5 h-5 mx-auto transition-colors ${
                    unreadCount > 0
                      ? "text-indigo-600 dark:text-indigo-400 animate-pulse"
                      : ""
                  }`}
                />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-4 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold border-2 border-white dark:border-gray-800 shadow-lg animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* 🔑 DROPDOWN PANEL - Shows on Click */}
              {isNotificationOpen && (
                <div className="notification-panel absolute left-full bottom-10 ml-2 w-[500px] bg-white shadow-2xl rounded-2xl border border-gray-200 z-[100] overflow-hidden backdrop-blur-sm">
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                          <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="font-bold text-base text-gray-900 dark:text-white">
                          Notifications
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <span className="text-xs bg-indigo-600 dark:bg-indigo-500 text-white px-3 py-1 rounded-full font-bold shadow-md">
                            {unreadCount} New
                          </span>
                        )}
                        <button
                          onClick={() => setIsNotificationOpen(false)}
                          className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Close"
                        >
                          <XIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Notification List */}
                  <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                          <Bell className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 font-medium">
                          No notifications yet
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          We'll notify you when something arrives
                        </p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          className={`notification-item p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:shadow-md bg-white ${
                            !n.read
                              ? "border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-50/80 to-purple-50/80"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex gap-3">
                            {/* Icon */}
                            <div
                              className={`flex-shrink-0 mt-1 p-2.5 rounded-xl shadow-sm ${
                                n.type === "approval"
                                  ? "bg-gradient-to-br from-green-100 to-emerald-100 text-green-600"
                                  : n.type === "rejection"
                                  ? "bg-gradient-to-br from-red-100 to-rose-100 text-red-600"
                                  : "bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600"
                              }`}
                            >
                              {n.type === "approval" ? (
                                <CheckCircle className="w-5 h-5" />
                              ) : n.type === "rejection" ? (
                                <XIcon className="w-5 h-5" />
                              ) : (
                                <Activity className="w-5 h-5" />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              {/* Type Badge */}
                              <div className="flex items-center gap-2 mb-1.5">
                                <span
                                  className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                                    n.type === "approval"
                                      ? "bg-green-100 text-green-700"
                                      : n.type === "rejection"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  {n.type === "approval"
                                    ? "Approved"
                                    : n.type === "rejection"
                                    ? "Rejected"
                                    : "New Request"}
                                </span>
                                {!n.read && (
                                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                                )}
                              </div>

                              {/* Message */}
                              <p className="text-sm text-gray-800 leading-relaxed font-medium mb-2">
                                {n.message}
                              </p>

                              {/* Timestamp + Action */}
                              <div className="flex items-center justify-between gap-2 text-gray-500">
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span className="text-xs">
                                    {formatDate(n.createdAt)}
                                  </span>
                                </div>
                                <button
                                  onClick={() => markAsRead(n._id)}
                                  className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
                                >
                                  Mark as read
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Profile Icon/Picture */}
            <div className="w-full mt-2 flex justify-center">
              {isCollapsed ? (
                // Collapsed State: Shows Initial/Generic Icon
                <div className="w-6 h-6 rounded-full bg-indigo-200 dark:bg-indigo-700 flex items-center justify-center text-indigo-800 dark:text-white font-bold text-sm">
                  {/* Shows first initial of user name */}
                  {user.fullName.charAt(0)}
                </div>
              ) : (
                // Expanded State: Shows Name and Role (Optional: This is the old logout/profile area replacement)
                <div className="flex items-center gap-3 w-full p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <User className="w-5 h-5 text-indigo-600 dark:text-white" />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {user.fullName}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-3 mb-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="flex items-center gap-3">
                {theme === "light" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-400" />
                )}
                <span
                  className={`text-sm font-medium whitespace-nowrap ${
                    isCollapsed ? "hidden" : ""
                  }`}
                >
                  {theme === "light" ? "Dark Mode" : "Light Mode"}
                </span>
              </span>
            </button>
            {/* Logout Button */}

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-start p-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors font-medium"
            >
              {" "}
              <LogOut className="w-5 h-5 mr-3" />
              <span
                className={`w-5 h-5 ${!isCollapsed ? "mr-3" : "mx-auto"}`}
              ></span>
              {/* Text hides */}
              <span
                className={`whitespace-nowrap ${isCollapsed ? "hidden" : ""}`}
              >
                Log Out
              </span>
            </button>
          </div>
        </aside>
        {/* 2. Main Content Area */}
        <main className="main-content flex-1 p-8 overflow-y-auto">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Header/Greeting */}
              <div>
                <h1 className="text-2xl font-bold inline-block px-4 py-2">
                  👋 {isAdmin ? "Admin Dashboard" : "My Dashboard"}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {isAdmin
                    ? "Manage platform, events, and monitor performance"
                    : `Welcome back, ${user.fullName}!`}
                </p>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-2">
                {isAdmin && (
                  <button
                    onClick={onCreateEventClick}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Create New Event
                  </button>
                )}
                {isAdmin && (
                  <>
                    <button className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium">
                      <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm font-medium">
                      <Shield className="w-4 h-4" /> Security
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Tabs Navigation (Matches the component logic) */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {currentTabs.map((tab) => {
                  const tabLower = tab.toLowerCase();
                  return (
                    <button
                      key={tab}
                      onClick={() => {
                        // If user clicks "Discover Events" tab, navigate to discover page
                        if (tabLower.includes("discover")) {
                          setCurrentPage("discover");
                          setActiveTab(tabLower);
                        } else if (children && !tabLower.includes("discover")) {
                          // If children are shown (EventsDiscoveryPage) and user clicks a non-discover tab, navigate back to dashboard
                          setCurrentPage("dashboard");
                          setActiveTab(tabLower);
                        } else {
                          setActiveTab(tabLower);
                        }
                      }}
                      className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        (children && tabLower.includes("discover")) ||
                        (!children && activeTab === tabLower)
                          ? "border-indigo-500 text-indigo-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Stats Grid - Always visible on Overview, maybe modified for others */}
            {!children && activeTab !== "feedback analytics" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title={
                    isStudent
                      ? "Events Registered"
                      : isAdmin
                      ? "Events Registered"
                      : "Total Events"
                  }
                  value={events.length}
                  //value={isStudent ? registrations.length : events.length}//
                  change="12%"
                  isPositive={true}
                  icon={<Calendar className="w-5 h-5" />}
                  color="bg-blue-500"
                />
                <StatCard
                  title={isAdmin ? "My College Events" : "Upcoming Events"}
                  value={
                    isAdmin
                      ? adminOwnedEvents.length
                      : events.filter(
                          (e) =>
                            getEventStatus(e.startDate, e.endDate) ===
                            "upcoming"
                        ).length
                  }
                  change="8%"
                  isPositive={true}
                  icon={
                    isAdmin ? (
                      <Calendar className="w-5 h-5" />
                    ) : (
                      <Activity className="w-5 h-5" />
                    )
                  }
                  color="bg-green-500"
                />
                <StatCard
                  title={
                    isStudent ? "Total Registrations" : "Total Participants"
                  }
                  value={
                    isStudent
                      ? registrations.length
                      : adminOwnedRegistrations.length
                  }
                  change="23%"
                  isPositive={true}
                  icon={<TrendingUp className="w-5 h-5" />}
                  color="bg-purple-500"
                />
                <StatCard
                  title={isAdmin ? "Pending Reviews" : "Approved Events"}
                  value={
                    isAdmin
                      ? adminOwnedRegistrations.filter(
                          (r) => r.status === "pending"
                        ).length
                      : registrations.filter((r) => r.status === "approved")
                          .length
                  }
                  change={isAdmin ? "-2%" : "0"}
                  isPositive={isStudent ? true : false}
                  icon={
                    isAdmin ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )
                  }
                  color={isStudent ? "bg-green-500" : "bg-orange-500"}
                />
              </div>
            )}

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-1">
              <div
                className={`${
                  children
                    ? "lg:col-span-3"
                    : isFullWidth
                    ? "lg:col-span-3"
                    : "lg:col-span-2"
                } space-y-6`}
              >
                {/* Show children (EventsDiscoveryPage) if provided */}
                {children ? (
                  children
                ) : (
                  <>
                    {/* Logic for switching tab content */}
                    {activeTab === "overview" && (
                      <>
                        {isAdmin && (
                          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-gray-900 mb-4">
                              Registration Trends
                            </h3>
                            <div className="h-64 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                {/* Using CHART_DATA from mock definition */}
                                <LineChart data={data}>
                                  <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#f3f4f6"
                                  />
                                  <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                                  />
                                  <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                                  />
                                  <Tooltip
                                    contentStyle={{
                                      backgroundColor: "#fff",
                                      borderRadius: "8px",
                                      border: "1px solid #e5e7eb",
                                      boxShadow:
                                        "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                    }}
                                    itemStyle={{ color: "#4f46e5" }}
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="participants"
                                    stroke="#4f46e5"
                                    strokeWidth={3}
                                    dot={{
                                      r: 4,
                                      fill: "#4f46e5",
                                      strokeWidth: 2,
                                      stroke: "#fff",
                                    }}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        )}
                        <RecentEventsTable
                          events={isAdmin ? adminOwnedEvents : events}
                          limit={5}
                        />
                      </>
                    )}
                    {activeTab === "user management" && <UserActivityTable />}
                    {activeTab === "event management" && (
                      <RecentEventsTable events={adminOwnedEvents} />
                    )}
                    {activeTab === "registrations" && (
                      <RegistrationsTable
                        registrations={
                          isAdmin ? adminOwnedRegistrations : registrations
                        }
                      />
                    )}
                    {activeTab === "feedback analytics" && (
                      <FeedbackAnalytics />
                    )}
                    {activeTab === "admin logs" && <AdminLogsTable />}
                    {activeTab === "my events" && (
                      <RegistrationsTable
                        registrations={
                          isAdmin ? adminOwnedRegistrations : registrations
                        }
                        showAdminActions={isAdmin}
                      />
                    )}
                    {activeTab !== "overview" &&
                      activeTab !== "user management" &&
                      activeTab !== "event management" &&
                      activeTab !== "registrations" &&
                      activeTab !== "feedback analytics" &&
                      activeTab !== "admin logs" &&
                      activeTab !== "my events" && (
                        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
                          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <h3 className="text-lg font-medium text-gray-900">
                            No content available
                          </h3>
                          <p>This section is under development.</p>
                        </div>
                      )}
                  </>
                )}
              </div>

              {/* Sidebar Area - Only visible for Overview and when not showing children */}
              {!isFullWidth && !children && (
                <div className="space-y-6">
                  {activeTab === "overview" ? (
                    <>
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">
                          Quick Actions
                        </h3>
                        <div className="space-y-3">
                          {isAdmin && (
                            <button
                              onClick={onCreateEventClick}
                              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2"
                            >
                              <Plus className="w-4 h-4" /> Create New Event
                            </button>
                          )}
                          <button
                            onClick={() => setActiveTab("my events")}
                            className="w-full bg-gray-50 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200"
                          >
                            View All Registrations
                          </button>

                          <button
                            onClick={handleExportData}
                            className="w-full bg-gray-50 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200"
                          >
                            Export Event Data
                          </button>
                        </div>
                      </div>

                      {/* system full box  */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">
                          System Health
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Server Status</span>
                            <span className="text-green-600 font-medium flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Healthy
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Database</span>
                            <span className="text-green-600 font-medium">
                              Connected
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">API Response</span>
                            <span className="text-gray-900 font-medium">
                              152ms
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Uptime</span>
                            <span className="text-gray-900 font-medium">
                              99.9%
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Information
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Select an item from the main list to view more details
                        here.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      {isEditOpen && selectedEvent && (
        <EventForm
          onClose={() => {
            setIsEditOpen(false);
            setSelectedEvent(null);
          }}
          onSubmit={(updated) =>
            handleEditEventSubmit(
              selectedEvent._id || selectedEvent.id,
              updated
            )
          }
          currentUserCollegeId={String(
            (user as any).collegeId || selectedEvent.collegeId || ""
          )}
          initialEvent={selectedEvent}
          mode="edit"
        />
      )}
    </>
  );
}

// Export the component as default for flexibility in imports
export default Dashboard;
