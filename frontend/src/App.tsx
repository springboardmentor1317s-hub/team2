// frontend/src/App.tsx

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "./components/Header";
// Assuming Hero is imported, as mentioned in your flow
import { Hero } from "./components/Hero";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
// Renamed the main layout component back to Dashboard, assuming you didn't create DashboardHome yet
import { Dashboard } from "./components/Dashboard";
import { EventsDiscoveryPage } from "./components/EventsDiscoveryPage";
// Assuming these are needed elsewhere, keep them imported
import EventForm from "./components/EventForm";
import { EventCard } from "./components/EventCard";
import ChatBot from "./components/chatbot";
import WhatsAppBtn from "./components/WhatsAppBtn";
import { Event } from "./types";
import { useTheme } from "./context/ThemeContext";
import { toast } from "sonner";
import CompleteProfileModal from "./components/CompleteProfileModal";
export const BASE_URL = "http://localhost:5000";
// Define the pages for clarity
type UserRole = "student" | "admin";
type AppPages =
  | "home"
  | "login"
  | "register"
  | "dashboard"
  | "discover"
  | "complete-profile";

// Re-defining the types locally for clarity/completeness
interface User {
  id: string;
  fullName: string;
  name: string;
  university: string;
  role: UserRole;
  collegeId: string;
}

interface Registration {
  _id: string;
  eventId: { _id: string; title: string };
  userId: { _id: string; name: string; email: string };
  status: "pending" | "approved" | "rejected";
  timestamp: string;
}
type Role = "student" | "admin";
// Mock Initial Data (for testing the flow)
const MOCK_EVENTS: Event[] = [
  {
    _id: "e1",
    title: "College Hackathon 2026",
    collegeName: "Stanford University",
    category: "hackathon",
    location: "Lab 301",
    startDate: "2026-03-15T09:00",
    endDate: "2026-03-16T17:00",
    description: "Code all night!",
    maxParticipants: 50,
    collegeId: "C1",
    adminId: "U2",
    participantsCount: 5,
    status: "upcoming",
    tags: ["tech"],
    imageUrl: "https://picsum.photos/800/400?random=1",
    createdAt: new Date().toISOString(),
  },
  // This event will show for all users.
];

// Mock Registrations
const MOCK_REGISTRATIONS: Registration[] = [
  {
    _id: "r1",
    eventId: { _id: "e1", title: "College Hackathon 2026" },
    userId: { _id: "U3", name: "User 3", email: "user3@example.com" },
    status: "approved",
    timestamp: "2025-12-10T10:00:00Z",
  },
];

export default function App() {
  const { theme, setThemeExplicit } = useTheme();
  // 1. Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 2. Page Navigation State
  const [currentPage, setCurrentPage] = useState<AppPages>("home");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // NEW: State to manage the visibility of the Complete Profile Modal
  const [showModal, setShowModal] = useState<boolean>(false);
  // 3. Application Data & UI State
  // NEW: State to manage the visibility of the Event Form
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  // You are using 'events' and 'registrations' state variables inside handleCreateEvent and handleRegister
  // These need to be explicitly declared to prevent runtime errors.
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [registrations, setRegistrations] =
    useState<Registration[]>(MOCK_REGISTRATIONS);

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/events`);
      if (response.ok) {
        const result = await response.json();
        setEvents(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Check localStorage for user on initial load and restore user session
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setIsAuthenticated(true);
        setCurrentUser(user);
        setCurrentPage("dashboard");
      } catch (error) {
        console.error("Error restoring user session:", error);
        localStorage.removeItem("user");
      }
    } else {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }

    // Fetch events on app load
    fetchEvents();
  }, []); // Run only once on mount

  // Force landing page to stay in dark mode regardless of user preference
  useEffect(() => {
    if (currentPage === "home" && theme !== "dark") {
      setThemeExplicit("dark");
    }
  }, [currentPage, theme, setThemeExplicit]);

  // --- Core Functions ---
  const handleLoginSuccess = (user: User) => {
    setTimeout(() => {
      // Ensure user has all required properties
      const fullUser: User = {
        id: user.id || "U1",
        fullName: user.fullName || user.name || "Guest User",
        name: user.name || user.fullName || "Guest User",
        university: user.university || "Default University",
        role: user.role || "student",
        collegeId: user.collegeId || "C1",
      };
      setIsAuthenticated(true);
      setCurrentUser(fullUser);

      // Save user to localStorage for persistence
      localStorage.setItem("user", JSON.stringify(fullUser));
      // After successful login, navigate to dashboard
      setCurrentPage("dashboard");
    }, 0);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/logout`, {
        // for access token
        credentials: "include",
      });
      const data = await response.json();
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      setCurrentUser(null);
      setCurrentPage("home"); // Logout always returns to home
      toast.success(data.message);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // event/user pair //

  const handleCreateEvent = async (eventData: Partial<Event>) => {
    try {
      // Prepare payload for backend
      const payload = {
        title: eventData.title,
        collegeName: eventData.collegeName,
        category: eventData.category,
        location: eventData.location,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        description: eventData.description,
        maxParticipants: eventData.maxParticipants,
        collegeId: currentUser!.collegeId,
        imageUrl: eventData.imageUrl,
      };

      // Call backend API
      const response = await fetch(`${BASE_URL}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // for access token
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message);
        return;
      }

      const result = await response.json();
      const createdEvent = result.data;

      toast.success(result.message);

      // Update local state with the created event from backend
      const newEvent: Event = {
        _id: createdEvent._id,
        title: createdEvent.title,
        collegeName: createdEvent.collegeName,
        category: createdEvent.category,
        location: createdEvent.location,
        startDate: createdEvent.startDate,
        endDate: createdEvent.endDate,
        description: createdEvent.description,
        maxParticipants: createdEvent.maxParticipants,
        collegeId: createdEvent.collegeId,
        adminId: createdEvent.adminId,
        participantsCount: createdEvent.participantsCount,
        status: createdEvent.status,
        tags: createdEvent.tags,
        imageUrl: createdEvent.imageUrl,
        createdAt: createdEvent.createdAt,
      };

      setEvents([newEvent, ...events]);
      setIsEventFormOpen(false);
      // Fetch fresh events from backend to ensure consistency
      fetchEvents();
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };
  // Student/Public Registration

  const handleRegister = (eventId: string) => {
    if (!currentUser) return;

    const newReg: any = {
      id: `r${registrations.length + 1}`,
      eventId,
      userId: currentUser.id,
      status: "pending",
      timestamp: new Date().toISOString(),
    };
    setRegistrations([...registrations, newReg]);

    // Update event participant count locally for UI
    setEvents(
      events.map((e) =>
        e._id === eventId
          ? { ...e, participantsCount: e.participantsCount + 1 }
          : e
      )
    );
  };

  const handleLoginWithGoogle = async (code: any) => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/google`, {
        method: "POST",
        body: JSON.stringify({ code }),
        headers: {
          "Content-Type": "application/json",
        },
        // for access token
        credentials: "include",
      });

      const responseData = await response.json();

      if (response.ok) {
        if (!responseData.user.role && !responseData.user.university) {
          setShowModal(true);
          setCurrentPage("complete-profile");
        } else {
          toast.success(responseData.message);
          handleLoginSuccess(responseData.user);
        }
      } else {
        // Failure: status is 400 or 500. The error message is already in the 'data' object.
        toast.error(responseData.message);
      }
    } catch (error) {
      console.error("Network Error or Stream Failure:", error);
    }
  };

  const handleCompleteProfile = async ({
    role,
    university,
  }: {
    role: Role;
    university: string;
  }) => {
    try {
      const res = await fetch(`${BASE_URL}/api/users/complete-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role, university }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      setShowModal(false);
      handleLoginSuccess(data.user);
      if (location.pathname === "/oauth-success") {
        window.history.replaceState(null, "", window.location.origin);
      }
    } catch (error) {
      console.error("Error completing profile:", error);
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/profile`, {
        credentials: "include",
      });
      const responseData = await response.json();
      if (response.ok) {
        if (!responseData.user.role && !responseData.user.university) {
          setShowModal(true);
          setCurrentPage("complete-profile");
        } else {
          window.history.replaceState(null, "", window.location.origin);
          toast.success(responseData.message);
          handleLoginSuccess(responseData.user);
        }
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };


  useEffect(() => {
    if (location.pathname === "/oauth-success") {
      getUserDetails();
    }
  }, []);

  // --- Render Logic: Determines which primary component to render ---
  const renderPageContent = () => {
    // --- AUTHENTICATED PAGES ---
    if (isAuthenticated && currentUser) {
      // Special handling for discover events page - show it with dashboard layout
      if (currentPage === "discover") {
        return (
          <Dashboard
            user={currentUser}
            handleLogout={handleLogout}
            setCurrentPage={(p: string) => setCurrentPage(p as AppPages)}
            onCreateEventClick={() => setIsEventFormOpen(true)}
          >
            <EventsDiscoveryPage events={events} />
          </Dashboard>
        );
      }

      // If logged in, wrap authenticated content in the Dashboard Layout
      // We use the Dashboard component as the Authenticated Layout wrapper now
      return (
        <Dashboard
          user={currentUser}
          handleLogout={handleLogout}
          setCurrentPage={(p: string) => setCurrentPage(p as AppPages)}
          onCreateEventClick={() => setIsEventFormOpen(true)}
        />
      );
    }

    // --- PUBLIC PAGES ---
    if (currentPage === "register") {
      return (
        <Register
          setCurrentPage={(p: string) => setCurrentPage(p as AppPages)}
          handleLoginWithGoogle={handleLoginWithGoogle}
        />
      );
    }
    if (currentPage === "login") {
      // If we are logged out and on the login page
      return (
        <Login
          setCurrentPage={(p: string) => setCurrentPage(p as AppPages)}
          onLoginSuccess={handleLoginSuccess}
          handleLoginWithGoogle={handleLoginWithGoogle}
        />
      );
    }

    // Default to Home (The starting page)
    return (
      <>
        <Hero setCurrentPage={(p: string) => setCurrentPage(p as AppPages)} />
        {showModal && (
          <CompleteProfileModal
            onSubmit={handleCompleteProfile}
            isOpen={showModal}
          />
        )}
      </>
    );
  };

  return (
    // 🔑 Structural Fix: This is the outer component that holds everything
    <div
      className="relative min-h-screen 
                       bg-gray-100 dark:bg-gray-900 
                       text-gray-900 dark:text-white
                       transition-colors duration-300"
    >
      {/* RENDER HEADER ONLY ON PUBLIC PAGES (home, login, register) */}
      {!isAuthenticated &&
        (currentPage === "home" ||
          currentPage === "login" ||
          currentPage === "register") && (
          // NOTE: Your Header.tsx only accepts (currentPage, setCurrentPage)
          <Header
            currentPage={currentPage}
            setCurrentPage={(p: string) => setCurrentPage(p as AppPages)}
          />
        )}

      {/* RENDER THE MAIN PAGE CONTENT (Authenticated Layout or Public Page) */}
      {renderPageContent()}

      {/* NEW: Conditional Rendering for the Modal EventForm */}
      {isAuthenticated && isEventFormOpen && currentUser && (
        <EventForm
          onClose={() => setIsEventFormOpen(false)}
          onSubmit={handleCreateEvent}
          currentUserCollegeId={currentUser.collegeId || "default-college-id"}
        />
      )}

      {/* Render floating widgets ONLY for the authenticated dashboard view */}
      {isAuthenticated && currentPage === "dashboard" && currentUser && (
        <>
          <WhatsAppBtn />
          <ChatBot />
        </>
      )}
    </div>
  );
}
