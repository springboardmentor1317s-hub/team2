// frontend/src/components/EventsDiscoveryPage.tsx (FINAL CODE)

import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
// Import all necessary components (assuming named imports are used for consistency)
import{EventCard }  from './EventCard'; 
import  EventModal from './EventModal'; 
// NOTE: EventForm is usually triggered from the Dashboard, not here, but can be managed.


// --- MOCK DATA STRUCTURES (Matching your component needs) ---
// Since types are external, we define the minimum structure for the mock data
interface Event {
    id: string; title: string; date: string; time: string; location: string; 
    category: string; organizer: string; isRegistered?: boolean; imageUrl?: string;
    description: string; status: string; tags: string[]; participantsCount: number; 
    maxParticipants: number; createdAt: string; endDate: string; collegeId: string; 
    startDate: string; // EventCard requires startDate
}

const MOCK_EVENTS_DATA: Event[] = [
    { 
        id: '1', title: 'Intro to AI', date: 'Dec 20, 2025', time: '10:00 AM', location: 'Tech Hall, R301', 
        category: 'hackathon', organizer: 'Coding Club', isRegistered: true, description: 'Deep dive into LLMs and ML concepts.',
        status: 'upcoming', tags: ['coding', 'tech', 'ai'], participantsCount: 40, maxParticipants: 100, 
        imageUrl: 'https://picsum.photos/seed/101/800/400', createdAt: new Date().toISOString(), endDate: new Date().toISOString(), collegeId: 'C1', startDate: new Date().toISOString()
    },
    { 
        id: '2', title: 'Annual Cultural Fest', date: 'Jan 5, 2026', time: '4:00 PM', location: 'Auditorium', 
        category: 'cultural', organizer: 'Art Society', isRegistered: false, description: 'A vibrant display of arts and culture.',
        status: 'ongoing', tags: ['music', 'dance'], participantsCount: 150, maxParticipants: 150, 
        imageUrl: 'https://picsum.photos/seed/102/800/400', createdAt: new Date().toISOString(), endDate: new Date().toISOString(), collegeId: 'C1', startDate: new Date().toISOString()
    },
    // Add more mock events here...
];


// --- MAIN DISCOVERY PAGE COMPONENT ---

export function EventsDiscoveryPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [events] = useState(MOCK_EVENTS_DATA); // Using mock events
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isRegisteredMock, setIsRegisteredMock] = useState(false); // Mock registration status

    
    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCardClick = (event: Event) => {
        setSelectedEvent(event); // Open the modal with the selected event data
        // In a real app, you'd fetch the specific registration status here
        setIsRegisteredMock(event.isRegistered || false);
    };

    const handleRegistration = () => {
        // Mock registration action
        alert(`Registered for ${selectedEvent?.title}!`);
        setIsRegisteredMock(true);
        setSelectedEvent(prev => prev ? {...prev, isRegistered: true, participantsCount: prev.participantsCount + 1} : null);
    };

    return (
        <div className="discovery-page p-4 sm:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Explore Campus Events</h1>
            <p className="text-gray-600 mb-8">Find the latest activities happening across the university.</p>

            {/* --- Search and Filter Bar --- */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white p-4 rounded-xl shadow-md border border-gray-100">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by title, club, or keyword..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button 
                    className="flex items-center justify-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors shadow-md text-sm font-medium"
                    onClick={() => alert("Filter functionality coming soon!")}
                >
                    <Filter className="w-5 h-5" />
                    Filter ({filteredEvents.length})
                </button>
            </div>

            {/* --- Event Grid --- */}
            <div className="event-grid">
                {filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredEvents.map(event => (
                            // Passes the new click handler
                            <EventCard 
                                key={event.id} 
                                event={event} 
                                onClick={handleCardClick} 
                            /> 
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-12 bg-white rounded-xl shadow-md border border-gray-100">
                        <h3 className="text-xl font-semibold text-gray-700">No Events Found</h3>
                    </div>
                )}
            </div>
            
            {/* 3. EVENT MODAL COMPONENT */}
            <EventModal
                event={selectedEvent}
                isOpen={!!selectedEvent}
                onClose={() => setSelectedEvent(null)}
                onRegister={handleRegistration}
                isRegistered={isRegisteredMock}
            />

        </div>
    );
}