'use client';

import Pagination from "@/components/ui/CustomPagination";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";
import { usePagination } from "@/hooks/Pagination";

const StaffAttendance = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const queryClient = useQueryClient();
    const [qrDetails, setQrDetails] = useState();
    const { iv, tv } = qrDetails ? qrDetails : { "iv": '', "tv": "" };

    const StaffAttendance = async (iv, tv) => {
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/validate-staff`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({ iv, tv })
            })

            const responseBody = await response.json();
            if (response.status && responseBody.type === 'CheckedIn') {
                const userConfirmed = window.confirm(responseBody.message);
                if (userConfirmed) {
                    console.log('User confirm checkout. Processing...');
                    await checkoutStaff(iv, tv);
                } else {
                    console.log("User cancelled checkout. Aborting...");
                }
            };

            if (response.ok && responseBody.type !== 'CheckedIn') {
                alert('CheckIn successfull');
                window.location.reload();
                queryClient.invalidateQueries(['temporarystaffattendance']);
            };
        } catch (error) {
            console.log("Error: ", error);
            alert('Request unsuccessfull');
        }
    };

    const handleQrDetails = (value) => {
        setQrDetails(JSON.parse(value));
    };

    const checkoutStaff = async (iv, tv) => {
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/validate-staff/check-out-staff`, {
                method: "PATCH",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({ iv, tv })
            });

            const responseBody = await response.json();
            if (response.ok) {
                queryClient.invalidateQueries(['temporarystaffattendance']);
                alert("Successfully checked out!");
                window.location.reload();
            };
        } catch (error) {
            console.error("Error during checkout: ", error);
            alert("Failed to check out staff. Please try again.");
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Fetch all temporary staff attendances
    const fetchAllTemporaryStaffAttendances = async ({ queryKey }) => {
        const [, page, searchQuery] = queryKey
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/validate-staff/temporary-staffattendance-history?page=${page}&limit=${limit}&searchQuery=${searchQuery}`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const { data: temporarystaffattendance, isLoading: AttendanceFetching } = useQuery({
        queryKey: ['temporarystaffattendance', currentPage, debouncedSearchQuery],
        queryFn: fetchAllTemporaryStaffAttendances
    });

    const { TemporaryAttendanceHistory, TotalTemporaryAttendanceHistory, totalPages } = temporarystaffattendance || {};

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
                                </DropdownMenuTrigger>
                            </DropdownMenu>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink>Attendance</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Staff Attendance</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-xl font-bold mt-3">Staff Attendance</h1>
            </div>

            <div className="w-full flex justify-center">
                <div className="w-full mx-4">
                    <div className="w-full">
                        <form className="w-full md:flex bg-white justify-between shadow-md items-center my-4">
                            <div className='md:w-10/12 w-full flex justify-start items-center p-2'>
                                <Input
                                    placeholder='Scan qr code here'
                                    className='focus:border-blue-500 rounded-none'
                                    autoFocus
                                    onChange={(e) => {
                                        clearTimeout(debounceTimeout);
                                        const data = e.target.value.trim();

                                        debounceTimeout = setTimeout(() => {
                                            try {
                                                const parsedData = JSON.parse(data);
                                                let { iv, tv } = parsedData;
                                                if (iv && tv && iv.length >= 24) {
                                                    setQrDetails(parsedData);
                                                    alert('Continue?');
                                                    StaffAttendance(iv, tv);
                                                }
                                            } catch (error) {
                                                alert(error.message);
                                                window.location.reload();
                                                console.error("Invalid QR Code Data:", error.message);
                                            }
                                        }, 300);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleQrDetails(e.target.value);
                                        }
                                    }}
                                />
                            </div>

                            <div className='w-full md:w-2/12 flex justify-start items-center p-2'>
                                <Button type='submit' className='rounded-sm w-full'>Refresh</Button>
                            </div>
                        </form>

                        <div className="flex justify-center p-2 bg-white">
                            <div className="w-full px-4 flex justify-between border border-gray-400 rounded-none items-center">
                                <IoSearch className="text-xl" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className='w-full border-none bg-none'
                                    placeholder='Search...'
                                />
                            </div>
                        </div>

                        <div className="w-full bg-white">
                            {AttendanceFetching ? (
                                <Loader />
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Staff Id</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>CheckIn</TableHead>
                                            <TableHead>CheckOut</TableHead>
                                            <TableHead>Remark</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Array.isArray(TemporaryAttendanceHistory) && TemporaryAttendanceHistory.length > 0 ? (
                                            TemporaryAttendanceHistory.map((attendance) => (
                                                <TableRow key={attendance._id}>
                                                    <TableCell className="font-medium text-sm">{attendance.staffId}</TableCell>
                                                    <TableCell className="text-sm">{attendance.fullName}</TableCell>
                                                    <TableCell className="text-sm">{attendance.role}</TableCell>
                                                    <TableCell className="text-sm">{attendance.checkIn ? new Date(attendance.checkIn).toISOString().split('T')[0] : ''} - {attendance.checkIn ? new Date(attendance.checkIn).toISOString().split('T')[1].split('.')[0] : ''} {attendance.checkIn ? new Date(attendance.checkIn).toISOString().split('T')[1].split('.')[0] > 12 ? 'PM' : "AM" : ''}</TableCell>
                                                    <TableCell className="text-sm">{attendance.checkOut ? new Date(attendance.checkOut).toISOString().split('T')[0] : ''} - {attendance.checkOut ? new Date(attendance.checkOut).toISOString().split('T')[1].split('.')[0] : ''} {attendance.checkOut ? new Date(attendance.checkOut).toISOString().split('T')[1].split('.')[0] > 12 ? 'PM' : "AM" : ''}</TableCell>
                                                    <TableCell className="text-sm">{attendance.remark}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center">
                                                    Showing 0 out of 0 entries
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell colSpan={1}>Total Entries</TableCell>
                                            <TableCell className="text-right">{TotalTemporaryAttendanceHistory}</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            )}
                        </div>
                    </div>

                    <div className="py-2 my-2">
                        <Pagination
                            total={totalPages ? totalPages : 1}
                            siblings={1}
                            boundaries={1}
                            page={currentPage}
                            onChange={setCurrentPage}
                            withEdges
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StaffAttendance
