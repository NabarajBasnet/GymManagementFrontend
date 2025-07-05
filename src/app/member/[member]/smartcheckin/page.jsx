"use client";

import { useState, useEffect } from "react";
import { FaClock } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

export default function CheckInCard() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedTime = time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    const formattedDate = time.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 space-y-6">
                {/* Time & Date */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800">{formattedTime}</h1>
                    <p className="text-gray-500 text-sm">{formattedDate}</p>
                </div>

                {/* Location */}
                <div className="flex items-center justify-center text-sm text-gray-600 gap-2">
                    <MdLocationOn className="text-green-500 text-lg" />
                    <span className="text-center">
                        Paragon House, House 5, Mohakhali, Dhaka
                    </span>
                </div>

                {/* Check In / Out Times */}
                <div className="flex justify-between text-center text-sm">
                    <div className="flex-1">
                        <FaClock className="mx-auto text-gray-500" />
                        <p className="mt-1 font-semibold text-green-600">12:05 PM</p>
                        <p className="text-green-500">Check In</p>
                    </div>
                    <div className="flex-1">
                        <FaClock className="mx-auto text-gray-400" />
                        <p className="mt-1 font-semibold text-gray-400">--:--</p>
                        <p className="text-gray-400">Check Out</p>
                    </div>
                </div>

                {/* Check In Button */}
                <button className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl shadow hover:bg-emerald-700 transition">
                    ✅ Tap to Check In
                </button>

                {/* Tag Location (Secondary Action) */}
                <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition">
                    📍 Tag My Location
                </button>
            </div>
        </div>
    );
}
