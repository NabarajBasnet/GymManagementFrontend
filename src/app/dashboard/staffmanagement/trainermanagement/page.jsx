// 'use client'

// import React, { useState, useRef, useEffect } from 'react';

// const SearchBar = () => {
//     // State for search query and dropdown visibility
//     const [searchQuery, setSearchQuery] = useState("");
//     const [isDropdownOpen, setDropdownOpen] = useState(false);
//     const [recentSearches, setRecentSearches] = useState([
//         'Gym Management',
//         'Personal Training',
//         'New Member Registration',
//         'Payment Details',
//     ]);

//     const searchRef = useRef(null);  // Reference to detect click outside

//     // Close dropdown when clicking outside the search bar
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (searchRef.current && !searchRef.current.contains(event.target)) {
//                 setDropdownOpen(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, [searchRef]);

//     // Handle search input changes
//     const handleInputChange = (event) => {
//         setSearchQuery(event.target.value);
//     };

//     return (
//         <div className='w-full flex justify-center min-h-screen items-center'>
//             <div className="relative w-96" ref={searchRef}>
//                 <input
//                     type="text"
//                     placeholder="Search..."
//                     value={searchQuery}
//                     onFocus={() => setDropdownOpen(true)}
//                     onChange={handleInputChange}
//                     className="border border-gray-400 w-full px-4 py-2 rounded"
//                 />

//                 {isDropdownOpen && (
//                     <div className="absolute w-full bg-white border border-gray-400 mt-1 rounded shadow-lg">
//                         <ul>
//                             {recentSearches.map((item, index) => (
//                                 <li
//                                     key={index}
//                                     onClick={() => {
//                                         setSearchQuery(item);
//                                         setDropdownOpen(false);
//                                     }}
//                                     className="px-4 py-2 cursor-pointer hover:bg-gray-200"
//                                 >
//                                     {item}
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SearchBar;


'use client'

import { Input } from "@/components/ui/input";
import { useRef, useState, useEffect } from "react";

const TrainerManagement = () => {
    const searchRef = useRef(null);
    const [renderDropdown, setRenderDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const history = ['History 1', 'History 2', 'History 3', 'History 4'];

    // Handle click outside to close the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setRenderDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchRef]);

    const handleSearchFocus = () => {
        setRenderDropdown(true);
    };

    const handleSelectHistory = (item) => {
        setSearchQuery(item); // Set the input value to the selected history
        setRenderDropdown(false);
    };

    return (
        <div className='w-full flex justify-center items-center min-h-screen'>
            <div ref={searchRef} className='w-9/12 flex justify-center'>
                <div className='relative w-full'>
                    <div className='w-full'>
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={handleSearchFocus}
                            className='w-full rounded-none'
                            placeholder='Search...'
                        />
                    </div>
                    {renderDropdown && (
                        <div className='w-full absolute bg-white shadow-xl max-h-40 overflow-y-auto z-10'>
                            {history.map((item, index) => (
                                <div 
                                    key={index} 
                                    onClick={() => handleSelectHistory(item)} 
                                    className="hover:bg-gray-200 cursor-pointer px-4 py-2"
                                >
                                    <p>{item}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TrainerManagement;
