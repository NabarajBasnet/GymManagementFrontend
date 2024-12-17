'use client';

import Pagination from '@/components/ui/CustomPagination';
import Loader from "@/components/Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { usePagination } from "@/hooks/Pagination";
import { Input } from '@/components/ui/input';

const CustomerSupport = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 12;

    // Debounce function to delay setting the debounced query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 1000);

        return () => clearTimeout(timer); // Cleanup on component unmount or searchQuery change
    }, [searchQuery]);

    const getAllMembers = async ({ queryKey }) => {
        const [, page, memberSearchQuery] = queryKey;
        try {
            const response = await fetch(`http://localhost:3000/api/members?page=${page}&limit=${limit}&memberSearchQuery=${memberSearchQuery}`);
            const resBody = await response.json();
            console.log("Response Body: ", resBody);
            return resBody;
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ['members', currentPage, debouncedSearchQuery],
        queryFn: getAllMembers,
    });

    const { totalPages = 1, members = [] } = data || {};

    // Handling Pagination
    const { range, setPage, active } = usePagination({
        total: totalPages,
        siblings: 1,
        boundaries: 1,
        page: currentPage,
        onChange: (page) => setCurrentPage(page),
    });

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center px-6">
            <div>
                <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-4 w-full rounded-md"
                    placeholder="Search members..."
                />
            </div>

            {isLoading ? (
                <Loader />
            ) : (
                <div>
                    {members.map((member) => (
                        <p key={member._id}>{member.fullName}</p>
                    ))}
                </div>
            )}

            <div className="mt-10">
                <Pagination
                    total={totalPages}
                    siblings={1}
                    boundaries={1}
                    page={currentPage}
                    onChange={setCurrentPage}
                    withEdges
                />
            </div>

            <div className="mt-10">
                <p>Current Page: {currentPage}</p>
                <p>Total Pages: {totalPages}</p>
            </div>
        </div>
    );
};

export default CustomerSupport;
