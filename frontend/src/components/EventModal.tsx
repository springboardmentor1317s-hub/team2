import React, { useState } from "react";
import { Event } from "../types";
import {
  X,
  Calendar,
  MapPin,
  Users,
  Clock,
  Share2,
  Heart,
  MessageSquare,
} from "lucide-react";
import { getEventStatus } from "../utils/eventStatus";
import { formatDate } from "../utils/formatters";
import CommentSection from "./CommentSection";
import { BASE_URL } from "../App";

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onRegister: (eventId: string) => void;
  isRegistered: boolean;
}

const EventModal: React.FC<EventModalProps> = ({
  event,
  isOpen,
  onClose,
  onRegister,
  isRegistered,
}) => {
  const [activeTab, setActiveTab] = useState<"details" | "comments">("details");
  const [commentCount, setCommentCount] = useState(0);

  // Fetch comment count when modal opens
  React.useEffect(() => {
    if (isOpen && event) {
      fetchCommentCount();
    }
  }, [isOpen, event]);

  const fetchCommentCount = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/comments/event/${event?._id}`
      );
      const data = await response.json();
      if (data.success) {
        setCommentCount(data.count || data.data?.length || 0);
      }
    } catch (error) {
      console.error("Error fetching comment count:", error);
    }
  };

  if (!isOpen || !event) return null;

  // Calculate the current status based on dates
  const currentStatus = getEventStatus(event.startDate, event.endDate);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
          <div className="relative h-64 sm:h-72">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-4 flex gap-2">
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-indigo-600 capitalize">
                {event.category}
              </span>
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-800 capitalize">
                {currentStatus}
              </span>
            </div>
          </div>

          <div className="px-6 py-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {event.title}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Hosted by{" "}
              <span className="font-semibold text-indigo-600">
                College ID: {event.collegeId}
              </span>
            </p>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "details"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Event Details
                </button>
                <button
                  onClick={() => setActiveTab("comments")}
                  className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === "comments"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Comments{" "}
                  <span className="bg-indigo-100 text-indigo-600 rounded-full px-2 text-xs font-bold">
                    {commentCount}
                  </span>
                </button>
              </nav>
            </div>

            {activeTab === "details" ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Start Time
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(event.startDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        End Time
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(event.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Location
                      </p>
                      <p className="text-sm text-gray-600">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Participants
                      </p>
                      <p className="text-sm text-gray-600">
                        {event.participantsCount} / {event.maxParticipants}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    About Event
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Requirements
                  </h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Valid College ID Card</li>
                    <li>Registration confirmation email</li>
                    <li>Laptop (for technical events)</li>
                  </ul>
                </div>
              </div>
            ) : (
              <CommentSection eventId={event._id} />
            )}
          </div>

          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-100">
            <div className="flex space-x-2">
              <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Register Button */}

            <button
              onClick={() => onRegister(event._id)} // 🔑 Pass the ID here
              disabled={
                isRegistered || event.participantsCount >= event.maxParticipants
              }
              className={`px-6 py-2.5 rounded-lg font-medium text-white transition-all shadow-sm
                    ${
                      isRegistered
                        ? "bg-green-500 cursor-default"
                        : event.participantsCount >= event.maxParticipants
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-md"
                    }`}
            >
              {isRegistered
                ? "Registered"
                : event.participantsCount >= event.maxParticipants
                ? "Full"
                : "Register Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;