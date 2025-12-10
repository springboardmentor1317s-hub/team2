import React, { useState } from 'react';
import { X, Upload, Calendar as CalendarIcon, MapPin, Type, Layers } from 'lucide-react';
import { Event } from '../types';

interface EventFormProps {
  onClose: () => void;
  onSubmit: (eventData: Partial<Event>) => void;
}

const EventForm: React.FC<EventFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'cultural',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    maxParticipants: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, validation and processing would happen here
    onSubmit({
        ...formData,
        category: formData.category as any,
        maxParticipants: parseInt(formData.maxParticipants) || 100,
        status: 'upcoming',
        tags: ['new', 'event'],
        participantsCount: 0,
        imageUrl: `https://picsum.photos/seed/${Math.random()}/800/400`
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-100">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl leading-6 font-bold text-gray-900" id="modal-title">
                        Create New Event
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 bg-gray-100 p-1.5 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Banner</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-400 transition-colors cursor-pointer bg-gray-50">
                        <div className="space-y-1 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                                <span className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                    Upload a file
                                </span>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                         <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
                         <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Type className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 border"
                                placeholder="e.g. Annual Tech Symposium"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                         </div>
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                         <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Layers className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                id="category"
                                name="category"
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 border bg-white"
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
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="location"
                                id="location"
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 border"
                                placeholder="e.g. Main Auditorium"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date & Time</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CalendarIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="datetime-local"
                                name="startDate"
                                id="startDate"
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 border"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date & Time</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CalendarIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="datetime-local"
                                name="endDate"
                                id="endDate"
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg p-2.5 border"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700">Maximum Participants</label>
                        <input
                            type="number"
                            name="maxParticipants"
                            id="maxParticipants"
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg p-2.5 border mt-1"
                            placeholder="e.g. 200"
                            value={formData.maxParticipants}
                            onChange={handleChange}
                            required
                        />
                    </div>

                     <div className="sm:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-lg p-2.5 mt-1"
                            placeholder="Describe your event..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Create Event
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export{ EventForm };
