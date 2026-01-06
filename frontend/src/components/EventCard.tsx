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
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full"
      onClick={() => onClick(event)}
    >
      {/* 🖼️ DYNAMIC IMAGE SECTION */}
      <div className="relative h-52 w-full overflow-hidden bg-gray-100">
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
        <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
          {event.title}
        </h3>

        <div className="flex items-center text-sm font-medium text-indigo-600 mb-3">
          <GraduationCap className="w-4 h-4 mr-1.5 flex-shrink-0" />
          <span className="line-clamp-1">
            {event.collegeName || "Campus Event"}
          </span>
        </div>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
          {event.description}
        </p>

        <div className="space-y-2.5 mt-auto mb-4 border-t border-gray-50 pt-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2.5 text-indigo-500 flex-shrink-0" />
            <span>{formatDate(event.startDate)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2.5 text-indigo-500 flex-shrink-0" />
            <span>
              {new Date(event.startDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2.5 text-indigo-500 flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2.5 text-indigo-500 flex-shrink-0" />
            <span className="font-medium text-gray-700">
              {participantCount ?? event.participantsCount ?? 0} /{" "}
              {event.maxParticipants}
            </span>
            <span className="ml-1 text-gray-400 text-xs">registered</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-2">
          {event.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded text-[10px] bg-gray-50 text-gray-600 border border-gray-200"
            >
              <Tag className="w-3 h-3 mr-1" /> {tag}
            </span>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400">
          {/* 🔑 Updated to use your consistent formatDate helper */}
          <span>Published {formatDate(event.createdAt)}</span>
          <span className="text-indigo-600 font-bold hover:underline uppercase tracking-tighter">
            View Details
          </span>
        </div>
      </div>
    </div>
  );
};

export { EventCard };
