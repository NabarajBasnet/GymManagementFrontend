'use client';

import '@mantine/core/styles.css';
import { Pagination } from "@mantine/core";
import Loader from "@/components/Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { usePagination, DOTS } from "@/hooks/Pagination";

const CustomerSupport = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const limit = 12;

    const getAllMembers = async ({ queryKey }) => {
        const [, page] = queryKey

        try {
            const response = await fetch(`http://localhost:3000/api/members?page=${page}&limit=${limit}`);
            const resBody = await response.json();
            return resBody;
        } catch (error) {
            console.log('Error: ', error);
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: (['members', currentPage]),
        queryFn: getAllMembers
    });

    const { totalPages, totalMembers, members } = data || {};
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const { range, setPage, active } = usePagination({
        total: totalPages || 1,
        siblings: 1,
        boundaries: 1,
        page: currentPage,
        onChange: (page) => {
            setCurrentPage(page);
        },
    });

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center px-6">
            {
                isLoading ? (
                    <Loader />
                ) : (
                    <div>
                        {data.members.map((member) => (
                            <p key={member._id}>{member.fullName}</p>
                        ))}
                    </div>
                )
            }
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
}

export default CustomerSupport;
