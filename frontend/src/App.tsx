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

// Define the pages for clarity
type UserRole = "student" | "admin";
type AppPages = "home" | "login" | "register" | "dashboard" | "discover";

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
      const response = await fetch("http://localhost:5000/api/events");
      if (response.ok) {
        const result = await response.json();
        setEvents(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Check localStorage for token on initial load and restore user session
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setIsAuthenticated(true);
        setCurrentUser(user);
        setCurrentPage("dashboard");
        console.log("User session restored from localStorage");
      } catch (error) {
        console.error("Error restoring user session:", error);
        localStorage.removeItem("token");
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

      setCurrentPage("dashboard");
      console.log("State updated. Should redirect to dashboard.");
    }, 0);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentPage("home"); // Logout always returns to home
    console.log("User logged out.");
  };

  // event/user pair //

  const handleCreateEvent = async (eventData: Partial<Event>) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User must be authenticated.");
        return;
      }

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
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error creating event:", error.message);
        return;
      }

      const result = await response.json();
      const createdEvent = result.data;

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
      console.log(`Event ${newEvent.title} created successfully in database.`);

      // Fetch fresh events from backend to ensure consistency
      await fetchEvents();
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
          onRegistrationSuccess={handleLoginSuccess}
        />
      );
    }
    if (currentPage === "login") {
      // If we are logged out and on the login page
      return (
        <Login
          setCurrentPage={(p: string) => setCurrentPage(p as AppPages)}
          onLoginSuccess={handleLoginSuccess}
        />
      );
    }

    // Default to Home (The starting page)
    return (
      <Hero setCurrentPage={(p: string) => setCurrentPage(p as AppPages)} />
    );
  };

  return (
    // 🔑 Structural Fix: This is the outer component that holds everything
    <div
      className="relative min-h-screen 
                       bg-gray-50 dark:bg-gray-900 
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
