'use client'

import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label"

const StaffScheduling = () => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [recentSearches, setRecentSearches] = useState([
        'Gym Management',
        'Personal Training',
        'New Member Registration',
        'Payment Details',
    ]);

    const searchRef = useRef(null)
    console.log('Search Ref: ', searchRef)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [searchRef]);

    return (
        <div className="w-full flex justify-center min-h-screen items-center">
            <div>
                <div className="relative w-96" ref={searchRef}>
                    <Input
                        placeholder='Search something...'
                        onFocus={() => setIsDropdownOpen(true)}
                    />

                    {isDropdownOpen && (
                        <div>
                            <ul className="shadow-xl border bg-white">
                                {recentSearches.map((item, index) => (
                                    <li
                                        className="hover:bg-gray-200 cursor-pointer"
                                        key={index}
                                        onClick={() => setIsDropdownOpen(false)}
                                    >{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default StaffScheduling;
