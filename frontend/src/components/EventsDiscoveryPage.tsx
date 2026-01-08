import React, { useState, useEffect } from "react";
import { Search, Filter, Loader2 } from "lucide-react";
import { EventCard } from "./EventCard";
import EventModal from "./EventModal";
import { Event } from "../types";
import { useTheme } from "../context/ThemeContext";

interface EventsDiscoveryPageProps {
  initialEvents?: Event[];
}

export const EventsDiscoveryPage: React.FC<EventsDiscoveryPageProps> = ({
  initialEvents = [],
}) => {
  const { theme } = useTheme();
  
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // 🔑 Tracks which events the student has already registered for in DB
  const [userRegistrations, setUserRegistrations] = useState<string[]>([]);

  // 🔑 Tracks all registrations for calculating participant counts
  const [allRegistrations, setAllRegistrations] = useState<any[]>([]);

  // Filters
  const [dateFilter, setDateFilter] = useState<string>("");
  const [collegeFilter, setCollegeFilter] = useState<string>("all");
  const [maxParticipantsFilter, setMaxParticipantsFilter] =
    useState<string>("");

  // --- 1. FETCH LIVE DATA FROM MONGODB ---
  useEffect(() => {
    let isMounted = true; // Prevents state updates on unmounted components

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [eventsRes, regRes, allRegRes] = await Promise.all([
          fetch("http://localhost:5000/api/events"),
          token
            ? fetch("http://localhost:5000/api/registrations/my", {
                headers: { Authorization: `Bearer ${token}` },
              })
            : Promise.resolve(null),
          token
            ? fetch("http://localhost:5000/api/registrations/all", {
                headers: { Authorization: `Bearer ${token}` },
              })
            : Promise.resolve(null),
        ]);

        const [eventsData, regData, allRegData] = await Promise.all([
          eventsRes.json(),
          regRes ? regRes.json() : Promise.resolve(null),
          allRegRes.json(),
        ]);

        if (isMounted) {
          if (eventsData.success) setEvents(eventsData.data);
          if (Array.isArray(regData)) {
            setUserRegistrations(regData.map((r: any) => r.event?._id));
          }
          // Handle both array format and {success: true, data: [...]} format
          if (Array.isArray(allRegData)) {
            console.log("All registrations (array):", allRegData);
            setAllRegistrations(allRegData);
          } else if (allRegData?.success && Array.isArray(allRegData.data)) {
            console.log("All registrations (data):", allRegData.data);
            setAllRegistrations(allRegData.data);
          } else {
            console.log("All registrations response:", allRegData);
          }
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Fetch error:", error);
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    }; // Cleanup function
  }, []);

  // --- 2. REGISTRATION HANDLER ---
  const handleRegister = async (eventId: string) => {
    console.log("Registering for Event ID:", eventId); // 👈 Add this
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to register for events!");
        return;
      }

      const response = await fetch("http://localhost:5000/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Registration submitted! Waiting for Admin approval.");
        // Update local state so UI reflects "Registered" immediately
        setUserRegistrations((prev) => [...prev, eventId]);
        setSelectedEvent(null);
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  // --- 3. FILTER LOGIC ---
  const clearFilters = () => {
    setSearchTerm("");
    setDateFilter("");
    setCollegeFilter("all");
    setMaxParticipantsFilter("");
  };

  const collegeOptions = Array.isArray(events)
    ? Array.from(new Set(events.map((e) => e.collegeName).filter(Boolean)))
    : [];

  // 🔑 Helper function to get total participant count (all registrations - approved + pending)
  const getParticipantCount = (eventId: string) => {
    const count = allRegistrations.filter(
      (reg: any) =>
        String(reg.eventId) === String(eventId) ||
        String(reg.event?._id) === String(eventId) ||
        String(reg.event?.id) === String(eventId)
    ).length;
    console.log(
    );
    return count;
  };

  const filteredEvents = events.filter((event) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      event.title.toLowerCase().includes(q) ||
      event.category.toLowerCase().includes(q);
    const matchesCollege =
      collegeFilter === "all" ? true : event.collegeName === collegeFilter;
    const matchesMax = !maxParticipantsFilter
      ? true
      : (event.maxParticipants ?? Infinity) <= Number(maxParticipantsFilter);

    const matchesDate = (() => {
      if (!dateFilter) return true;
      const selected = new Date(dateFilter).toDateString();
      const evDate = new Date(event.startDate).toDateString();
      return selected === evDate;
    })();

    return matchesSearch && matchesCollege && matchesMax && matchesDate;
  });

  // --- RENDER LOADING STATE ---
  if (loading) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center"
        style={{
          backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb'
        }}
      >
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p 
          className="font-medium"
          style={{
            color: theme === 'dark' ? '#9ca3af' : '#6b7280'
          }}
        >
          Fetching latest events...
        </p>
      </div>
    );
  }

  return (
    <div 
      className="discovery-page p-4 sm:p-8 min-h-screen"
      style={{
        backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb'
      }}
      data-theme={theme}
    >
      <div 
        className="max-w-7xl mx-auto rounded-2xl p-6 sm:p-8 shadow-lg border"
        style={{
          backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
          borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
        }}
        data-theme={theme}
      >
        <h1 
          className="text-3xl sm:text-4xl font-extrabold mb-2"
          style={{
            color: theme === 'dark' ? '#ffffff' : '#111827'
          }}
        >
          Explore Campus Events
        </h1>
        <p 
          className="mb-8"
          style={{
            color: theme === 'dark' ? '#d1d5db' : '#6b7280'
          }}
        >
          Find and register for the latest activities across the university.
        </p>

        {/* --- Search and Filter Bar --- */}
        <div 
          className="flex flex-col gap-4 mb-8 p-4 rounded-xl border"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb',
            borderColor: theme === 'dark' ? '#4b5563' : '#e5e7eb'
          }}
        >
          <div className="flex flex-wrap gap-4 items-center w-full">
            <div className="relative grow min-w-[250px]">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{
                  color: theme === 'dark' ? '#6b7280' : '#9ca3af'
                }}
              />
              <input
                type="text"
                placeholder="Search by title or category..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                style={{
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                  borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                  color: theme === 'dark' ? '#ffffff' : '#111827'
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 items-center">
              <label 
                className="text-sm font-medium"
                style={{
                  color: theme === 'dark' ? '#d1d5db' : '#6b7280'
                }}
              >
                Date
              </label>
              <input
                type="date"
                className="border px-2 py-1 rounded-md"
                style={{
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                  borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                  color: theme === 'dark' ? '#ffffff' : '#111827'
                }}
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>

            <div className="flex gap-2 items-center">
              <label 
                className="text-sm font-medium"
                style={{
                  color: theme === 'dark' ? '#d1d5db' : '#6b7280'
                }}
              >
                College
              </label>
              <select
                className="border px-2 py-1 rounded-md"
                style={{
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                  borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                  color: theme === 'dark' ? '#ffffff' : '#111827'
                }}
                value={collegeFilter}
                onChange={(e) => setCollegeFilter(e.target.value)}
              >
                <option value="all">All Colleges</option>
                {collegeOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 ml-auto">
              <button
                className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium"
                style={{
                  backgroundColor: theme === 'dark' ? '#4f46e5' : '#6366f1'
                }}
                disabled
              >
                <Filter className="w-4 h-4" />
                Results ({filteredEvents.length})
              </button>

              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm"
                style={{
                  backgroundColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
                  color: theme === 'dark' ? '#e5e7eb' : '#374151'
                }}
                onClick={clearFilters}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* --- Event Grid --- */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onClick={(ev) => setSelectedEvent(ev)}
                participantCount={getParticipantCount(event._id)}
              />
            ))}
          </div>
        ) : (
          <div 
            className="text-center p-12 rounded-xl border-2 border-dashed"
            style={{
              backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb',
              borderColor: theme === 'dark' ? '#4b5563' : '#e5e7eb'
            }}
          >
            <h3 
              className="text-xl font-semibold"
              style={{
                color: theme === 'dark' ? '#9ca3af' : '#6b7280'
              }}
            >
              No Events Found Matching Your Criteria
            </h3>
            <button
              onClick={clearFilters}
              className="mt-4 font-medium hover:underline"
              style={{
                color: theme === 'dark' ? '#818cf8' : '#4f46e5'
              }}
            >
              Reset all filters
            </button>
          </div>
        )}

        {/* --- Event Details & Registration Modal --- */}
        <EventModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onRegister={handleRegister}
          // 🔑 Pass TRUE if the student is already in the database for this event
          isRegistered={
            selectedEvent
              ? userRegistrations.includes(selectedEvent._id)
              : false
          }
        />
      </div>
    </div>
  );
};
