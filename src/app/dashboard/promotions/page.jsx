'use client';

import { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaTags, FaClock, FaCalendarAlt } from "react-icons/fa";

const Promotions = () => {
    const [showModal, setShowModal] = useState(false);
    const [currentPromotion, setCurrentPromotion] = useState(null);

    const promotions = [
        {
            id: 1,
            title: "New Year Discount",
            description: "Get 20% off on all memberships!",
            discount: "20%",
            startDate: "2024-01-01",
            endDate: "2024-01-15",
            status: "Active",
        },
        {
            id: 2,
            title: "Summer Special",
            description: "15% off for the first 50 signups.",
            discount: "15%",
            startDate: "2024-06-01",
            endDate: "2024-06-30",
            status: "Upcoming",
        },
        {
            id: 3,
            title: "Black Friday Deal",
            description: "30% discount on yearly memberships.",
            discount: "30%",
            startDate: "2023-11-24",
            endDate: "2023-11-30",
            status: "Expired",
        },
    ];

    const openModal = (promotion = null) => {
        setCurrentPromotion(promotion);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentPromotion(null);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center">
                    <FaTags className="mr-2 text-yellow-400" /> Promotions Management
                </h1>
                <button
                    onClick={() => openModal()}
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg flex items-center text-white"
                >
                    <FaPlus className="mr-2" /> Add Promotion
                </button>
            </div>

            {/* Promotions List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {promotions.map((promotion) => (
                    <div
                        key={promotion.id}
                        className="bg-gray-800 rounded-lg p-4 shadow-md hover:bg-gray-700 transition"
                    >
                        <div className="flex justify-between mb-2">
                            <h2 className="text-lg font-bold">{promotion.title}</h2>
                            <span
                                className={`text-sm font-semibold px-2 py-1 rounded ${promotion.status === "Active"
                                    ? "bg-green-600"
                                    : promotion.status === "Upcoming"
                                        ? "bg-blue-500"
                                        : "bg-red-600"
                                    }`}
                            >
                                {promotion.status}
                            </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{promotion.description}</p>
                        <p className="text-yellow-400 text-sm flex items-center mb-2">
                            <FaClock className="mr-2" /> {promotion.discount} Discount
                        </p>
                        <p className="text-gray-400 text-xs flex items-center mb-4">
                            <FaCalendarAlt className="mr-2" /> {promotion.startDate} - {promotion.endDate}
                        </p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => openModal(promotion)}
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

            {/* Add/Edit Promotion Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-4">
                            {currentPromotion ? "Edit Promotion" : "Add Promotion"}
                        </h2>
                        <form>
                            <div className="mb-4">
                                <label className="block text-gray-400 mb-2">Title</label>
                                <input
                                    type="text"
                                    defaultValue={currentPromotion?.title || ""}
                                    className="w-full p-2 rounded-lg bg-gray-700 text-gray-200"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-400 mb-2">Description</label>
                                <textarea
                                    defaultValue={currentPromotion?.description || ""}
                                    className="w-full p-2 rounded-lg bg-gray-700 text-gray-200"
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-400 mb-2">Discount</label>
                                <input
                                    type="text"
                                    defaultValue={currentPromotion?.discount || ""}
                                    className="w-full p-2 rounded-lg bg-gray-700 text-gray-200"
                                    placeholder="e.g., 20%"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-400 mb-2">Start Date</label>
                                <input
                                    type="date"
                                    defaultValue={currentPromotion?.startDate || ""}
                                    className="w-full p-2 rounded-lg bg-gray-700 text-gray-200"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-400 mb-2">End Date</label>
                                <input
                                    type="date"
                                    defaultValue={currentPromotion?.endDate || ""}
                                    className="w-full p-2 rounded-lg bg-gray-700 text-gray-200"
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

export default Promotions;
