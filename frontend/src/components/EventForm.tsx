import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  Calendar as CalendarIcon,
  MapPin,
  Type,
  Layers,
  Image as ImageIcon,
} from "lucide-react";
import { Event } from "../types";
import sportsBanner from "../public/banners/sports.png";
import hackathonBanner from "../public/banners/hackathon.png";
import workshopBanner from "../public/banners/workshop.png";
import culturalBanner from "../public/banners/cultural.png";
import otherbanner from "../public/banners/other.png";

interface EventFormProps {
  onClose: () => void;
  onSubmit: (eventData: Partial<Event>) => void;
  currentUserCollegeId: string;
  initialEvent?: Event; // optional: prefill for edit
  mode?: "create" | "edit"; // optional: controls labels
}

// 🔑 High-quality thematic mapping for auto-generated banners
const CATEGORY_IMAGES: Record<string, string> = {
  cultural: culturalBanner,
  sports: sportsBanner,
  hackathon: hackathonBanner,
  workshop: workshopBanner,
  other: otherbanner,
};

const EventForm: React.FC<EventFormProps> = ({
  onClose,
  onSubmit,
  currentUserCollegeId,
  initialEvent,
  mode = "create",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    collegeName: "",
    category: "cultural", // default
    location: "",
    startDate: "",
    endDate: "",
    description: "",
    maxParticipants: "",
    collegeId: currentUserCollegeId,
  });

  // Prefill for edit mode
  useEffect(() => {
    if (initialEvent) {
      setFormData({
        title: initialEvent.title || "",
        collegeName: initialEvent.collegeName || "",
        category: initialEvent.category || "cultural",
        location: initialEvent.location || "",
        startDate: initialEvent.startDate || "",
        endDate: initialEvent.endDate || "",
        description: initialEvent.description || "",
        maxParticipants: String(initialEvent.maxParticipants || ""),
        collegeId: initialEvent.collegeId || currentUserCollegeId,
      });
      setPreviewUrl(initialEvent.imageUrl || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialEvent]);

  const baseInput =
    "!bg-white !text-gray-900 !border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-lg p-2.5 border placeholder-gray-400";
  const iconInput = `${baseInput} pl-10`;
  const textAreaInput =
    "!bg-white !text-gray-900 !border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border rounded-lg p-2.5 mt-1 placeholder-gray-400";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🖼️ Handle Image Selection (User Upload)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔑 If user hasn't uploaded a custom image, use the category default
    const finalImageUrl =
      previewUrl ||
      CATEGORY_IMAGES[formData.category as keyof typeof CATEGORY_IMAGES];

    onSubmit({
      title: formData.title,
      collegeName: formData.collegeName,
      category: formData.category,
      location: formData.location,
      startDate: formData.startDate,
      endDate: formData.endDate,
      description: formData.description,
      maxParticipants: parseInt(formData.maxParticipants) || 100,
      collegeId: formData.collegeId,
      imageUrl: finalImageUrl,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto light"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      style={{ colorScheme: "light" }}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom !bg-white !text-gray-900 rounded-xl text-left overflow-hidden shadow-xl border !border-gray-200 transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
          <div className="!bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b !border-gray-200">
            <div className="flex justify-between items-center">
              <h3
                className="text-xl leading-6 font-bold !text-gray-900"
                id="modal-title"
              >
                {mode === "edit" ? "Edit Event" : "Create New Event"}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 bg-gray-100 p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="px-4 py-5 sm:p-6 space-y-6 !bg-white"
          >
            {/* 🖼️ Improved Image Preview Section */}
            <div>
              <label className="block text-sm font-medium !text-gray-700 mb-1">
                Event Banner
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="mt-1 flex justify-center border-2 !border-gray-300 border-dashed rounded-lg hover:border-indigo-400 transition-all duration-300 cursor-pointer !bg-gray-50 relative overflow-hidden group h-[300px]"
              >
                {/* 🔑 SHOWS PREVIEW URL IF UPLOADED, ELSE SHOWS CATEGORY DEFAULT */}
                <img
                  src={
                    previewUrl ||
                    CATEGORY_IMAGES[
                      formData.category as keyof typeof CATEGORY_IMAGES
                    ]
                  }
                  alt="Banner Preview"
                  className="w-full h-full absolute inset-0 object-cover"
                />

                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="w-8 h-8 text-white mb-2" />
                  <p className="text-white text-sm font-medium">
                    {previewUrl
                      ? "Change Custom Image"
                      : "Upload Custom Banner"}
                  </p>
                  <p className="text-white text-xs opacity-75 mt-1">
                    Currently showing category default
                  </p>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <p className="mt-2 text-xs !text-gray-500 text-center">
                Select a category below to change the default banner instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium !text-gray-700"
                >
                  Event Title
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Type className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className={iconInput}
                    placeholder="e.g. Annual Tech Symposium"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="collegeName"
                  className="block text-sm font-medium !text-gray-700"
                >
                  College Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Layers className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="collegeName"
                    id="collegeName"
                    className={iconInput}
                    placeholder="e.g. Stanford University"
                    value={formData.collegeName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium !text-gray-700"
                >
                  Category
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Layers className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="category"
                    name="category"
                    className={`${iconInput} !bg-white`}
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="cultural">Cultural</option>
                    <option value="sports">Sports</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="workshop">Workshop</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium !text-gray-700"
                >
                  Location
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    className={iconInput}
                    placeholder="e.g. Main Auditorium"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium !text-gray-700"
                >
                  Start Date & Time
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="datetime-local"
                    name="startDate"
                    id="startDate"
                    className={iconInput}
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium !text-gray-700"
                >
                  End Date & Time
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="datetime-local"
                    name="endDate"
                    id="endDate"
                    className={iconInput}
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="maxParticipants"
                  className="block text-sm font-medium !text-gray-700"
                >
                  Maximum Participants
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  id="maxParticipants"
                  className={`${baseInput} mt-1`}
                  placeholder="e.g. 200"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium !text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className={textAreaInput}
                  placeholder="Describe your event..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t !border-gray-200 !bg-white">
              <button
                type="button"
                onClick={onClose}
                className="!bg-white py-2 px-4 border !border-gray-300 rounded-lg shadow-sm text-sm font-medium !text-gray-700 hover:bg-gray-50 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                {mode === "edit" ? "Save Changes" : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
