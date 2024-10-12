'use client'

import React, { useState, useRef, useEffect } from 'react';

const SearchBar = () => {
    // State for search query and dropdown visibility
    const [searchQuery, setSearchQuery] = useState("");
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [recentSearches, setRecentSearches] = useState([
        'Gym Management',
        'Personal Training',
        'New Member Registration',
        'Payment Details',
    ]);

    const searchRef = useRef(null);  // Reference to detect click outside

    // Close dropdown when clicking outside the search bar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchRef]);

    // Handle search input changes
    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div className='w-full flex justify-center min-h-screen items-center'>
            <div className="relative w-96" ref={searchRef}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onFocus={() => setDropdownOpen(true)}
                    onChange={handleInputChange}
                    className="border border-gray-400 w-full px-4 py-2 rounded"
                />

                {isDropdownOpen && (
                    <div className="absolute w-full bg-white border border-gray-400 mt-1 rounded shadow-lg">
                        <ul>
                            {recentSearches.map((item, index) => (
                                <li
                                    key={index}
                                    onClick={() => {
                                        setSearchQuery(item);
                                        setDropdownOpen(false);
                                    }}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
