'use client';

import { useEffect, useState } from "react";


const Promotions = () => {

    const [searchQuery, setSearchQuery] = useState();

    const debounce = (func, delay) => {
        let timerId;
        return (...args) => {
            if (timerId) {
                clearTimeout(timerId)
            }
            timerId = setTimeout(() => func(...args), delay)
        };
    };

    const getAllMembers = async () => {
        const response = await fetch('http://88.198.112.156:3000/api/members');
        const resBody = await response.json();
        console.log('Response Body: ', resBody ? resBody.members : 'Nothing');
    };

    const debounceGetAllMembers = debounce(getAllMembers, 1000);

    useEffect(() => {
        debounceGetAllMembers()
    }, [searchQuery]);

    return (
        <div className="w-full flex flex-col items-center justify-center h-screen text-center px-6">
            <input
                className="p-4 w-full rounded-md"
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    );
}

export default Promotions;
