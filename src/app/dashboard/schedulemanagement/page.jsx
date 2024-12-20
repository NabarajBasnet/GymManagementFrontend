'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaCalendar, FaFilter, FaUser, FaClock } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


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
        <div className="w-full">
            <div className='w-full p-6'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-1">
                                    <BreadcrumbEllipsis className="h-4 w-4" />
                                </DropdownMenuTrigger>
                            </DropdownMenu>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/docs/components">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Lockers</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-xl font-bold mt-3">Lockers</h1>
            </div>

            <div className="p-6 bg-gray-100">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold flex items-center">
                        <FaCalendar className="mr-2 text-blue-600" /> Schedule Management
                    </h1>
                    <Button
                        onClick={() => openModal()}
                        className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg flex items-center text-white"
                    >
                        <FaPlus className="mr-2" /> Add Schedule
                    </Button >
                </div>

                {/* Filters */}
                <div className="flex justify-between mb-4">
                    <div className="flex items-center">
                        <FaFilter className="mr-2 text-yellow-500" />
                        <span>Filters:</span>
                    </div>
                    <div className="space-x-4">
                        <select className="p-2 rounded-lg text-gray-800 px-2 shadow-sm">
                            <option>All Trainers</option>
                            <option>Alice Smith</option>
                            <option>John Doe</option>
                            <option>Jane Doe</option>
                        </select>
                        <select className="p-2 rounded-lg shadow-sm px-2 text-gray-800">
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
                        <div key={day} className="rounded-lg shadow-xl border-gray-400 bg-white p-4">
                            <h2 className="text-lg font-semibold mb-4">{day}</h2>
                            <div className="space-y-4">
                                {schedules
                                    .filter((schedule) => schedule.day === day)
                                    .map((schedule) => (
                                        <div
                                            key={schedule.id}
                                            className="p-3 rounded-lg flex justify-between items-center"
                                        >
                                            <div>
                                                <h3 className="font-semibold">{schedule.title}</h3>
                                                <p className="text-sm text-gray-800 flex items-center">
                                                    <FaClock className="mr-1" /> {schedule.time}
                                                </p>
                                                <p className="text-sm text-gray-800 flex items-center">
                                                    <FaUser className="mr-1" /> {schedule.trainer}
                                                </p>
                                            </div>
                                            <div className="space-x-3">
                                                <button
                                                    onClick={() => openModal(schedule)}
                                                    className="bg-transparent text-black hover:text-gray-700 transition-all duration-500"
                                                >
                                                    <FaEdit />
                                                </button >
                                                <button className="text-red-500 hover:text-red-600 bg-transparent">
                                                    <FaTrash />
                                                </button >
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add/Edit Schedule Modal */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
                        <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                            <h2 className="text-2xl font-bold mb-4">
                                {currentSchedule ? "Edit Schedule" : "Add Schedule"}
                            </h2>
                            <form>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold mb-2">Title</label>
                                    <Input
                                        type="text"
                                        defaultValue={currentSchedule?.title || ""}
                                        className="w-full rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold mb-2">Trainer</label>
                                    <Input
                                        type="text"
                                        defaultValue={currentSchedule?.trainer || ""}
                                        className="w-full rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold mb-2">Day</label>
                                    <select
                                        defaultValue={currentSchedule?.day || ""}
                                        className="w-full p-2 cursor-pointer rounded-lg border"
                                    >
                                        {days.map((day) => (
                                            <option key={day}>{day}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold mb-2">Time</label>
                                    <Input
                                        type="text"
                                        defaultValue={currentSchedule?.time || ""}
                                        className="w-full rounded-md"
                                        placeholder="e.g., 8:00 AM - 9:00 AM"
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <Button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500"
                                    >
                                        Cancel
                                    </Button >
                                    <Button
                                        type="submit"
                                        className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600"
                                    >
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScheduleManagement;
