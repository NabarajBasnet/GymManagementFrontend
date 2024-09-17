'use client'

import React, { useState } from 'react';
import { RiDashboard2Line } from 'react-icons/ri';
import { FaRegUser, FaBox, FaChartLine, FaTags, FaCog } from 'react-icons/fa'; // Example React Icons

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Function to toggle the sidebar view
    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`fixed left-0 top-0 h-full ${isExpanded ? 'w-64' : 'w-20'} bg-gray-800 transition-all duration-300`}>
            {/* Sidebar header */}
            <div className="flex items-center justify-between p-4">
                {isExpanded && <span className="text-white text-2xl font-bold">Admin Panel</span>}
                <button onClick={toggleSidebar} className="text-white">
                    {isExpanded ? '←' : '→'}
                </button>
            </div>

            {/* Sidebar content */}
            <div className="h-full overflow-y-auto mt-10"> {/* This makes the sidebar scrollable */}
                <ul>
                    <li className="flex items-center p-4 text-white cursor-pointer hover:bg-gray-700 transition-colors">
                        <RiDashboard2Line size={24} />
                        {isExpanded && <span className="ml-4">Dashboard</span>}
                    </li>
                    <li className="flex items-center p-4 text-white cursor-pointer hover:bg-gray-700 transition-colors">
                        <FaRegUser size={24} />
                        {isExpanded && <span className="ml-4">Users</span>}
                    </li>
                    <li className="flex items-center p-4 text-white cursor-pointer hover:bg-gray-700 transition-colors">
                        <FaBox size={24} />
                        {isExpanded && <span className="ml-4">Products</span>}
                    </li>
                    <li className="flex items-center p-4 text-white cursor-pointer hover:bg-gray-700 transition-colors">
                        <FaChartLine size={24} />
                        {isExpanded && <span className="ml-4">Reports</span>}
                    </li>
                    <li className="flex items-center p-4 text-white cursor-pointer hover:bg-gray-700 transition-colors">
                        <FaTags size={24} />
                        {isExpanded && <span className="ml-4">Tags</span>}
                    </li>
                    <li className="flex items-center p-4 text-white cursor-pointer hover:bg-gray-700 transition-colors">
                        <FaCog size={24} />
                        {isExpanded && <span className="ml-4">Settings</span>}
                    </li>
                    <li className="flex items-center p-4 text-white cursor-pointer hover:bg-gray-700 transition-colors">
                        <FaRegUser size={24} />
                        {isExpanded && <span className="ml-4">Users</span>}
                    </li>
                    <li className="flex items-center p-4 text-white cursor-pointer hover:bg-gray-700 transition-colors">
                        <FaBox size={24} />
                        {isExpanded && <span className="ml-4">Products</span>}
                    </li>
                    <li className="flex items-center p-4 text-white cursor-pointer hover:bg-gray-700 transition-colors">
                        <FaChartLine size={24} />
                        {isExpanded && <span className="ml-4">Reports</span>}
                    </li>
                    <li className="flex items-center p-4 text-white cursor-pointer hover:bg-gray-700 transition-colors">
                        <FaTags size={24} />
                        {isExpanded && <span className="ml-4">Tags</span>}
                    </li>
                    <li className="flex items-center p-4 text-white cursor-pointer hover:bg-gray-700 transition-colors">
                        <FaCog size={24} />
                        {isExpanded && <span className="ml-4">Settings</span>}
                    </li>
                    <li className="flex items-center p-4 text-white cursor-pointer hover:bg-gray-700 transition-colors">
                        <FaRegUser size={24} />
                        {isExpanded && <span className="ml-4">Users</span>}
                    </li>
                    <li className="flex items-center p-4 text-white cursor-pointer hover:bg-gray-700 transition-colors">
                        <FaBox size={24} />
                        {isExpanded && <span className="ml-4">Products</span>}
                    </li>
                    <li className="flex items-center p-4 text-white cursor-pointer hover:bg-gray-700 transition-colors">
                        <FaChartLine size={24} />
                        {isExpanded && <span className="ml-4">Reports</span>}
                    </li>
                    <li className="flex items-center p-4 text-white cursor-pointer hover:bg-gray-700 transition-colors">
                        <FaTags size={24} />
                        {isExpanded && <span className="ml-4">Tags</span>}
                    </li>
                    <li className="flex items-center p-4 text-white cursor-pointer hover:bg-gray-700 transition-colors">
                        <FaCog size={24} />
                        {isExpanded && <span className="ml-4">Settings</span>}
                    </li>
                    {/* Repeat items */}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
