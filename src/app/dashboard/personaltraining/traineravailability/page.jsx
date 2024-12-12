'use client';

import Pagination from "@/components/ui/CustomPagination";
import { IoSearch } from "react-icons/io5";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import React from 'react'
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { usePagination } from "@/hooks/Pagination";
import Loader from "@/components/Loader/Loader";
import { useState } from "react";
import { useEffect } from "react";

const TrainerAvailability = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    const fetchAllStaffs = async ({ queryKey }) => {
        const [, page, searchQuery] = queryKey
        try {
            const response = await fetch(`http://localhost:3000/api/staffsmanagement?page=${page}&limit=${limit}&staffSearchQuery=${searchQuery}`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ['personalTrainers', currentPage, debouncedSearchQuery],
        queryFn: fetchAllStaffs
    })

    const { totalStaffs, staffs, totalPages } = data || {};
    const { range, setPage, active } = usePagination({
        total: totalPages ? totalPages : 1,
        siblings: 1,
        boundaries: 1,
        page: currentPage,
        onChange: (page) => {
            setCurrentPage(page);
        },
    });

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    return (
        <div className='w-full'>
            <div className='w-full p-4'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-1">
                                    <BreadcrumbEllipsis className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem>Documentation</DropdownMenuItem>
                                    <DropdownMenuItem>Themes</DropdownMenuItem>
                                    <DropdownMenuItem>GitHub</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/docs/components">Trainer Availability</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Personal Trainers</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-xl font-bold mt-3">Trainer Availability</h1>
            </div>

            <div className="w-full bg-white">
                <div>
                    <div className="flex justify-center p-2">
                        <div className="w-full px-4 flex justify-start border border-gray-400 rounded-none items-center">
                            <IoSearch className="text-xl" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className='w-full border-none bg-none'
                                placeholder='Search Member...'
                            />
                        </div>
                    </div>
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <Table className='w-full overflow-x-auto'>
                            <TableHeader>
                                <TableRow className='bg-gray-200 text-black'>
                                    <TableHead>Id</TableHead>
                                    <TableHead>Full Name</TableHead>
                                    <TableHead>Contact No</TableHead>
                                    <TableHead>Joined At</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Avaibility Status</TableHead>
                                    <TableHead>Shift</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Limit</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.isArray(staffs) && staffs.length > 0 ? (
                                    staffs.map((staff) => (
                                        <TableRow key={staff._id}>
                                            <TableCell>{staff._id}</TableCell>
                                            <TableCell>{staff.fullName}</TableCell>
                                            <TableCell>{staff.contactNo}</TableCell>
                                            <TableCell>{staff.joinedDate ? new Date(staff.joinedDate).toISOString().split('T')[0] : ''}</TableCell>
                                            <TableCell>{staff.status}</TableCell>
                                            <TableCell>{staff.status}</TableCell>
                                            <TableCell>{staff.shift}</TableCell>
                                            <TableCell>{staff.role}</TableCell>
                                            <TableCell className="text-right">{5}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={14} className="text-center text-sm font-semibold">
                                            No staff found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={3}>Total Staffs</TableCell>
                                    <TableCell className="text-right font-medium">{totalStaffs}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    )}

                    <div className="py-3">
                        <Pagination
                            total={totalPages || 1}
                            page={currentPage || 1}
                            onChange={setCurrentPage}
                            withEdges={true}
                            siblings={1}
                            boundaries={1}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TrainerAvailability;
