'use client';

import { BsThreeDots } from "react-icons/bs";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Loader from "@/components/Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const CustomerSupport = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const limit = 12;
    var [ellipseLocation, setEllipseLocation] = useState('left');

    const getAllMembers = async ({ queryKey }) => {
        const [, page] = queryKey

        try {
            const response = await fetch(`http://88.198.112.156:3000/api/members?page=${page}&limit=${limit}`);
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

    const calculatePagination = (currentPage, totalPages) => {
        var activePages = 'left';
        const pageNumbersToRender = 5;
        console.log("Current Page: ", currentPage);
        const centerPages = 3;
        if (currentPage <= pageNumbersToRender) {
            setEllipseLocation('right')
        } else if (currentPage > pageNumbersToRender && currentPage == totalPages - 5) {
            setEllipseLocation('both');
        }
        else {
            setEllipseLocation('left');
        };
        console.log("Elipse location: ", ellipseLocation);

        const lastPage = totalPages;
        var pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i)
        }
        console.log('Pages: ', pages);
    }

    useEffect(() => {
        calculatePagination(currentPage, totalPages ? totalPages : 16);
    }, [currentPage]);

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
                <div className="flex items-center space-x-2">
                    <FaAngleLeft className="cursor-pointer text-xl" />
                    <Button
                        className={`bg-transparent hover:bg-gray-100 text-black`}
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}>Previous</Button>
                    <p
                        className={`px-4 py-1 cursor-pointer ${ellipseLocation === 'left' ? 'flex' : 'hidden'} ${currentPage === totalPages ? 'hidden' : 'flex'} rounded-lg ${currentPage === 1 ? 'border border-blue-600' : ''}`}
                        onClick={() => handlePageChange(1)}
                    >{1}</p>
                    <BsThreeDots className={`${ellipseLocation === 'left' ? 'flex' : 'hidden'}`} />
                    {
                        [...Array(totalPages)].map((_, i) => {
                            return (
                                <p
                                    className={`px-4 py-1 cursor-pointer rounded-lg ${currentPage === i + 1 ? 'border border-blue-600' : ''}`}
                                    onClick={() => handlePageChange(i + 1)}
                                >{i + 1}</p>
                            )
                        })
                    }
                    <BsThreeDots className={`${ellipseLocation === 'right' ? 'flex' : 'hidden'}`} />
                    <p
                        className={`px-4 py-1 cursor-pointer ${ellipseLocation === 'right' ? 'flex' : 'hidden'} rounded-lg ${currentPage === totalPages ? 'border border-blue-600' : ''}`}
                        onClick={() => handlePageChange(totalPages)}
                    >{totalPages}</p>
                    <Button
                        className={`bg-transparent hover:bg-gray-100 text-black`}
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}>Next</Button>
                    <FaAngleRight className="cursor-pointer text-xl" />
                </div>
            </div>

            <div className="mt-10">
                <p>Current Page: {currentPage}</p>
                <p>Total Pages: {totalPages}</p>
            </div>
        </div>
    );
}

export default CustomerSupport;
