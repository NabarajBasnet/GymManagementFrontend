'use client';

import { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaCalendar, FaFilter, FaUser, FaClock } from "react-icons/fa";

const ScheduleManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const [currentSchedule, setCurrentSchedule] = useState(null);

    const schedules = [
        { id: 1, title: "Yoga Class", day: "Monday", time: "8:00 AM - 9:00 AM", trainer: "Alice Smith" },
        { id: 2, title: "HIIT Workout", day: "Tuesday", time: "6:00 PM - 7:00 PM", trainer: "John Doe" },
        { id: 3, title: "Strength Training", day: "Wednesday", time: "5:00 PM - 6:00 PM", trainer: "Jane Doe" },
        { id: 4, title: "Pilates Class", day: "Thursday", time: "7:00 AM - 8:00 AM", trainer: "Bob Brown" },
        { id: 5, title: "Boxing", day: "Friday", time: "6:00 PM - 7:00 PM", trainer: "Jake Wilson" },
    ];

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const openModal = (schedule = null) => {
        setCurrentSchedule(schedule);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentSchedule(null);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center">
                    <FaCalendar className="mr-2 text-blue-500" /> Schedule Management
                </h1>
                <button
                    onClick={() => openModal()}
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg flex items-center text-white"
                >
                    <FaPlus className="mr-2" /> Add Schedule
                </button>
            </div>

            {/* Filters */}
            <div className="flex justify-between mb-4">
                <div className="flex items-center">
                    <FaFilter className="mr-2 text-yellow-500" />
                    <span>Filters:</span>
                </div>
                <div className="space-x-4">
                    <select className="p-2 bg-gray-800 rounded-lg text-gray-200">
                        <option>All Trainers</option>
                        <option>Alice Smith</option>
                        <option>John Doe</option>
                        <option>Jane Doe</option>
                    </select>
                    <select className="p-2 bg-gray-800 rounded-lg text-gray-200">
                        <option>All Days</option>
                        {days.map((day) => (
                            <option key={day}>{day}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Weekly Schedule Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {days.map((day) => (
                    <div key={day} className="bg-gray-800 rounded-lg shadow-md p-4">
                        <h2 className="text-lg font-semibold mb-4">{day}</h2>
                        <div className="space-y-4">
                            {schedules
                                .filter((schedule) => schedule.day === day)
                                .map((schedule) => (
                                    <div
                                        key={schedule.id}
                                        className="p-3 bg-gray-700 rounded-lg flex justify-between items-center"
                                    >
                                        <div>
                                            <h3 className="font-semibold">{schedule.title}</h3>
                                            <p className="text-sm text-gray-400 flex items-center">
                                                <FaClock className="mr-1" /> {schedule.time}
                                            </p>
                                            <p className="text-sm text-gray-400 flex items-center">
                                                <FaUser className="mr-1" /> {schedule.trainer}
                                            </p>
                                        </div>
                                        <div className="space-x-2">
                                            <button
                                                onClick={() => openModal(schedule)}
                                                className="text-blue-400 hover:text-blue-500"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button className="text-red-400 hover:text-red-500">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Schedule Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-4">
                            {currentSchedule ? "Edit Schedule" : "Add Schedule"}
                        </h2>
                        <form>
                            <div className="mb-4">
                                <label className="block text-gray-400 mb-2">Title</label>
                                <input
                                    type="text"
                                    defaultValue={currentSchedule?.title || ""}
                                    className="w-full p-2 rounded-lg bg-gray-700 text-gray-200"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-400 mb-2">Trainer</label>
                                <input
                                    type="text"
                                    defaultValue={currentSchedule?.trainer || ""}
                                    className="w-full p-2 rounded-lg bg-gray-700 text-gray-200"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-400 mb-2">Day</label>
                                <select
                                    defaultValue={currentSchedule?.day || ""}
                                    className="w-full p-2 rounded-lg bg-gray-700 text-gray-200"
                                >
                                    {days.map((day) => (
                                        <option key={day}>{day}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-400 mb-2">Time</label>
                                <input
                                    type="text"
                                    defaultValue={currentSchedule?.time || ""}
                                    className="w-full p-2 rounded-lg bg-gray-700 text-gray-200"
                                    placeholder="e.g., 8:00 AM - 9:00 AM"
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleManagement;
