import React from 'react';
import { Event } from '../types';
import { Calendar, MapPin, Users, Tag, Clock } from 'lucide-react';

interface EventCardProps {
  event: Event;
  onClick: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'hackathon': return 'bg-purple-100 text-purple-800';
      case 'cultural': return 'bg-pink-100 text-pink-800';
      case 'sports': return 'bg-orange-100 text-orange-800';
      case 'workshop': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-indigo-100 text-indigo-800';
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full"
      onClick={() => onClick(event)}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getCategoryColor(event.category)} uppercase tracking-wide`}>
            {event.category}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)} uppercase tracking-wide`}>
            {event.status}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{event.title}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{event.description}</p>
        
        <div className="space-y-2.5 mt-auto mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2.5 text-indigo-500 flex-shrink-0" />
            <span>{new Date(event.startDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
             <Clock className="w-4 h-4 mr-2.5 text-indigo-500 flex-shrink-0" />
             <span>{new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2.5 text-indigo-500 flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2.5 text-indigo-500 flex-shrink-0" />
            <span>{event.participantsCount} / {event.maxParticipants} participants</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
            {event.tags.slice(0, 3).map(tag => (
                <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-50 text-gray-600 border border-gray-200">
                    <Tag className="w-3 h-3 mr-1" /> {tag}
                </span>
            ))}
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
            <span>Created {new Date(event.createdAt).toLocaleDateString()}</span>
            <span className="text-indigo-600 font-medium hover:underline">View Details</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
