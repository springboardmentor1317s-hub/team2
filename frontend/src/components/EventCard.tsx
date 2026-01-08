import React from "react";
import { Event } from "../types";
import {
  Calendar,
  MapPin,
  Users,
  Tag,
  Clock,
  GraduationCap,
} from "lucide-react";
import { formatDate } from "../utils/formatters";
import { getEventStatus } from "../utils/eventStatus";
import { useTheme } from "../context/ThemeContext";
import sportsBanner from "../public/banners/sports.png";
import hackathonBanner from "../public/banners/hackathon.png";
import workshopBanner from "../public/banners/workshop.png";
import culturalBanner from "../public/banners/cultural.png";
import otherbanner from "../public/banners/other.png";

interface EventCardProps {
  event: Event;
  onClick: (event: Event) => void;
  participantCount?: number;
}

// 🔑 Consistent thematic mapping (Same as EventForm)
const CATEGORY_IMAGES: Record<string, string> = {
  cultural: culturalBanner,
  sports: sportsBanner,
  hackathon: hackathonBanner,
  workshop: workshopBanner,
  other: otherbanner,
};

const EventCard: React.FC<EventCardProps> = ({
  event,
  onClick,
  participantCount,
}) => {
  const { theme } = useTheme();
  
  // Calculate the current status based on dates
  const currentStatus = getEventStatus(event.startDate, event.endDate);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case "hackathon":
        return "bg-purple-100 text-purple-800";
      case "cultural":
        return "bg-pink-100 text-pink-800";
      case "sports":
        return "bg-orange-100 text-orange-800";
      case "workshop":
        return "bg-cyan-100 text-cyan-800";
      default:
        return "bg-indigo-100 text-indigo-800";
    }
  };

  return (
    <div
      className="event-card rounded-xl overflow-hidden cursor-pointer flex flex-col h-full transition-all duration-300 hover:scale-105"
      style={{
        background: theme === 'dark' 
          ? 'linear-gradient(145deg, #1f2937 0%, #111827 100%)' 
          : 'linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)',
        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        boxShadow: theme === 'dark' 
          ? '0 10px 25px rgba(0, 0, 0, 0.3), 0 4px 10px rgba(0, 0, 0, 0.2)' 
          : '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
        border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`
      }}
      onMouseEnter={(e) => {
        if (theme === 'dark') {
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4), 0 8px 16px rgba(0, 0, 0, 0.3)';
        } else {
          e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05)';
        }
      }}
      onMouseLeave={(e) => {
        if (theme === 'dark') {
          e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3), 0 4px 10px rgba(0, 0, 0, 0.2)';
        } else {
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)';
        }
      }}
      onClick={() => onClick(event)}
    >
      {/* 🖼️ DYNAMIC IMAGE SECTION */}
      <div 
        className="relative h-52 w-full overflow-hidden"
        style={{
          backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6'
        }}
      >
        <img
          src={
            event.imageUrl ||
            CATEGORY_IMAGES[
              event.category?.toLowerCase() as keyof typeof CATEGORY_IMAGES
            ]
          }
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
              event.category
            )} uppercase tracking-wide shadow-sm`}
          >
            {event.category}
          </span>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(
              currentStatus
            )} uppercase tracking-wide shadow-sm`}
          >
            {currentStatus}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 
          className="text-xl font-bold mb-1 line-clamp-1"
          style={{
            color: theme === 'dark' ? '#ffffff' : '#111827'
          }}
        >
          {event.title}
        </h3>

        <div 
          className="flex items-center text-sm font-medium mb-3"
          style={{
            color: theme === 'dark' ? '#818cf8' : '#4f46e5'
          }}
        >
          <GraduationCap className="w-4 h-4 mr-1.5 shrink-0" />
          <span className="line-clamp-1">
            {event.collegeName || "Campus Event"}
          </span>
        </div>

        <p 
          className="text-sm mb-4 line-clamp-2 flex-1"
          style={{
            color: theme === 'dark' ? '#9ca3af' : '#6b7280'
          }}
        >
          {event.description}
        </p>

        <div 
          className="space-y-2.5 mt-auto mb-4 border-t pt-4"
          style={{
            borderColor: theme === 'dark' ? '#374151' : '#f9fafb'
          }}
        >
          <div 
            className="flex items-center text-sm"
            style={{
              color: theme === 'dark' ? '#d1d5db' : '#6b7280'
            }}
          >
            <Calendar 
              className="w-4 h-4 mr-2.5 shrink-0"
              style={{
                color: theme === 'dark' ? '#818cf8' : '#4f46e5'
              }}
            />
            <span>{formatDate(event.startDate)}</span>
          </div>
          <div 
            className="flex items-center text-sm"
            style={{
              color: theme === 'dark' ? '#d1d5db' : '#6b7280'
            }}
          >
            <Clock 
              className="w-4 h-4 mr-2.5 shrink-0"
              style={{
                color: theme === 'dark' ? '#818cf8' : '#4f46e5'
              }}
            />
            <span>
              {new Date(event.startDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div 
            className="flex items-center text-sm"
            style={{
              color: theme === 'dark' ? '#d1d5db' : '#6b7280'
            }}
          >
            <MapPin 
              className="w-4 h-4 mr-2.5 shrink-0"
              style={{
                color: theme === 'dark' ? '#818cf8' : '#4f46e5'
              }}
            />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div 
            className="flex items-center text-sm"
            style={{
              color: theme === 'dark' ? '#d1d5db' : '#6b7280'
            }}
          >
            <Users 
              className="w-4 h-4 mr-2.5 shrink-0"
              style={{
                color: theme === 'dark' ? '#818cf8' : '#4f46e5'
              }}
            />
            <span 
              className="font-medium"
              style={{
                color: theme === 'dark' ? '#e5e7eb' : '#374151'
              }}
            >
              {participantCount ?? event.participantsCount ?? 0} /{" "}
              {event.maxParticipants}
            </span>
            <span 
              className="ml-1 text-xs"
              style={{
                color: theme === 'dark' ? '#6b7280' : '#9ca3af'
              }}
            >
              registered
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-2">
          {event.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105"
              style={{
                background: theme === 'dark' 
                  ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' 
                  : 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                color: theme === 'dark' ? '#ffffff' : '#4338ca',
                boxShadow: theme === 'dark' 
                  ? '0 2px 8px rgba(79, 70, 229, 0.3)' 
                  : '0 1px 3px rgba(67, 56, 202, 0.2)',
                border: `1px solid ${theme === 'dark' ? '#6366f1' : '#a5b4fc'}`
              }}
            >
              <Tag 
                className="w-3 h-3 mr-1" 
                style={{
                  color: theme === 'dark' ? '#c7d2fe' : '#6366f1'
                }}
              /> 
              {tag}
            </span>
          ))}
        </div>

        <div 
          className="pt-4 border-t flex justify-between items-center text-[10px]"
          style={{
            borderColor: theme === 'dark' ? '#374151' : '#f3f4f6',
            color: theme === 'dark' ? '#6b7280' : '#9ca3af'
          }}
        >
          {/* 🔑 Updated to use your consistent formatDate helper */}
          <span>Published {formatDate(event.createdAt)}</span>
          <span 
            className="font-bold hover:underline uppercase tracking-tighter"
            style={{
              color: theme === 'dark' ? '#818cf8' : '#4f46e5'
            }}
          >
            View Details
          </span>
        </div>
      </div>
    </div>
  );
};

export { EventCard };
