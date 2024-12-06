'use client';

import { useEffect, useState } from "react";


const Promotions = () => {

    const [searchQuery, setSearchQuery] = useState();

    const debounce = (func, delay) => {
        let timer; // A variable to store the timeout Id

        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    const printMessage = (message) => {
        console.log('Search Query: ', message);
    };

    const debouncePrint = debounce(printMessage, 2000);

    useEffect(() => {
        debouncePrint(searchQuery)
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
