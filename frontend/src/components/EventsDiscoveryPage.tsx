import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import { EventCard } from "./EventCard";
import EventModal from "./EventModal";
import { Event } from "../types";

interface EventsDiscoveryPageProps {
  events: Event[];
}

const MOCK_EVENTS_DATA: Event[] = [
  {
    _id: "1",
    title: "Intro to AI",
    collegeName: "Stanford University",
    location: "Tech Hall, R301",
    category: "hackathon",
    description: "Deep dive into LLMs and ML concepts.",
    status: "upcoming",
    tags: ["coding", "tech", "ai"],
    participantsCount: 40,
    maxParticipants: 100,
    imageUrl: "https://picsum.photos/seed/101/800/400",
    createdAt: new Date().toISOString(),
    endDate: new Date().toISOString(),
    collegeId: "C1",
    startDate: new Date().toISOString(),
    organizerId: "U1",
  },
  {
    _id: "2",
    title: "Annual Cultural Fest",
    collegeName: "MIT",
    location: "Auditorium",
    category: "cultural",
    description: "A vibrant display of arts and culture.",
    status: "ongoing",
    tags: ["music", "dance"],
    participantsCount: 150,
    maxParticipants: 150,
    imageUrl: "https://picsum.photos/seed/102/800/400",
    createdAt: new Date().toISOString(),
    endDate: new Date().toISOString(),
    collegeId: "C1",
    startDate: new Date().toISOString(),
    organizerId: "U2",
  },
];

export const EventsDiscoveryPage: React.FC<EventsDiscoveryPageProps> = ({
  events: propsEvents,
}) => {
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [events] = useState(
    propsEvents && propsEvents.length > 0 ? propsEvents : MOCK_EVENTS_DATA
  );
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isRegisteredMock, setIsRegisteredMock] = useState(false);
  const [dateFilter, setDateFilter] = useState<string>("");
  const [collegeFilter, setCollegeFilter] = useState<string>("all");
  const [maxParticipantsFilter, setMaxParticipantsFilter] = useState<string>("");

  // --- HANDLERS ---
  
  // FIX: Added the missing clearFilters function
  const clearFilters = () => {
    setSearchTerm("");
    setDateFilter("");
    setCollegeFilter("all");
    setMaxParticipantsFilter("");
  };

  const handleCardClick = (event: Event) => {
    setSelectedEvent(event);
    setIsRegisteredMock(false);
  };

  const handleRegistration = () => {
    alert(`Registered for ${selectedEvent?.title}!`);
    setIsRegisteredMock(true);
    setSelectedEvent((prev) =>
      prev
        ? {
            ...prev,
            isRegistered: true,
            participantsCount: prev.participantsCount + 1,
          }
        : null
    );
  };

  // --- FILTER LOGIC ---
  const collegeOptions = Array.from(
    new Set(events.map((e) => e.collegeName).filter(Boolean))
  );

  const filteredEvents = events.filter((event) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      event.title.toLowerCase().includes(q) ||
      event.category.toLowerCase().includes(q);

    const matchesCollege =
      collegeFilter === "all" || !collegeFilter
        ? true
        : event.collegeName === collegeFilter;

    const matchesMaxParticipants =
      !maxParticipantsFilter || maxParticipantsFilter === ""
        ? true
        : (event.maxParticipants ?? Infinity) <= Number(maxParticipantsFilter);

    const matchesDate = (() => {
      if (!dateFilter) return true;
      try {
        const selected = new Date(dateFilter);
        const evDate = event.startDate ? new Date(event.startDate) : (event.createdAt ? new Date(event.createdAt) : null);
        if (!evDate) return true;
        return (
          evDate.getFullYear() === selected.getFullYear() &&
          evDate.getMonth() === selected.getMonth() &&
          evDate.getDate() === selected.getDate()
        );
      } catch (e) {
        return true;
      }
    })();

    return matchesSearch && matchesCollege && matchesMaxParticipants && matchesDate;
  });

  return (
    <div className="discovery-page p-4 sm:p-8 min-h-screen bg-[#0f172a]">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
          Explore Campus Events
        </h1>
        <p className="text-gray-600 mb-8">
          Find the latest activities happening across the university.
        </p>

        {/* --- Search and Filter Bar --- */}
        <div className="flex flex-col gap-4 mb-8 bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <div className="flex flex-wrap gap-4 items-center w-full">
            <div className="relative flex-grow min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 items-center">
              <label className="text-sm text-gray-600">Date</label>
              <input
                type="date"
                className="border px-2 py-1 rounded-md bg-white text-gray-900"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>

            <div className="flex gap-2 items-center">
              <label className="text-sm text-gray-600">College</label>
              <select
                className="border px-2 py-1 rounded-md bg-white text-gray-900"
                value={collegeFilter}
                onChange={(e) => setCollegeFilter(e.target.value)}
              >
                <option value="all">All Colleges</option>
                {collegeOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 ml-auto">
              <button
                className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium"
                disabled
              >
                <Filter className="w-4 h-4" />
                Results ({filteredEvents.length})
              </button>

              <button
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                onClick={clearFilters}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* --- Event Grid --- */}
        <div className="event-grid">
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <h3 className="text-xl font-semibold text-gray-500">
                No Events Found Matching Your Criteria
              </h3>
              <button 
                onClick={clearFilters}
                className="mt-4 text-indigo-600 hover:underline"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>

        <EventModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onRegister={handleRegistration}
          isRegistered={isRegisteredMock}
        />
      </div>
    </div>
  );
};
