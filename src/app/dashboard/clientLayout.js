'use client'

import Header from "./Header";
import Sidebar from "./Sidebar";
import { useState } from 'react';

export default function ClientLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Function to toggle the sidebar on smaller screens
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className='min-h-screen flex'>
            {/* Sidebar for larger screens */}
            <div className={`fixed inset-0 z-40 md:relative md:w-[14%] md:flex ${isSidebarOpen ? 'block' : 'hidden md:block'}`}>
                <Sidebar />
            </div>

            {/* Sidebar toggle button for smaller screens */}
            <button
                onClick={toggleSidebar}
                className={`fixed top-4 left-4 z-50 md:hidden p-2 bg-gray-800 text-white rounded-md`}
            >
                {isSidebarOpen ? 'Close' : 'Open'}
            </button>

            {/* Main content area */}
            <div className={`flex-1 md:ml-[14%] ${isSidebarOpen ? 'md:ml-[14%]' : 'md:ml-0'} transition-all duration-300`}>
                <div className="w-full">
                    <Header />
                </div>
                <div className="w-full h-screen bg-blue-400">{children}</div>
            </div>
        </div>
    );
}
