'use client';

import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Loader2, X, QrCode, RefreshCw, Search, User, Calendar, Timer, Home } from 'lucide-react';
import {
    FaCheckCircle,
} from 'react-icons/fa';
import '../../../globals.css';
import Pagination from "@/components/ui/CustomPagination";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";

const StaffAttendance = () => {

    // Toast and dialogs UI states
    const [confirmCheckInState, setConfirmCheckInState] = useState(false);
    const [confirmCheckOutState, setConfirmCheckOutState] = useState(false);
    const [successfulAlert, setSuccessfulAlert] = useState(false);
    const [successfulMessage, setSuccessfulMessage] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const [qrDetails, setQrDetails] = useState();
    const { iv, tv } = qrDetails ? qrDetails : { "iv": '', "tv": "" };

    const checkIfStaffCheckedIn = async (iv, tv) => {
        try {
            const response = await fetch(`https://fitbinary.com/api/validate-staff/checkedin`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({ iv, tv })
            });

            const responseBody = await response.json();
            if (response.status === 200 && responseBody.checkedIn) {
                return responseBody.checkedIn
            };
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const checkInStaff = async (iv, tv) => {
        try {
            const response = await fetch(`https://fitbinary.com/api/validate-staff`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({ iv, tv })
            });

            const responseBody = await response.json();
            console.log(responseBody);
            if (response.status === 201 && responseBody.type === 'QrExpired') {
                toast.error(responseBody.message);
                return;
            };

            if (response.ok && responseBody.type !== 'CheckedIn') {
                setConfirmCheckInState(false);
                setSuccessfulMessage(responseBody.message);
                setSuccessfulAlert(true);
                toast.success(responseBody.message);
            } else {
                toast.error(responseBody.message);
            }
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const handleQrDetails = (value) => {
        setQrDetails(JSON.parse(value));
    };

    const checkoutStaff = async (iv, tv) => {
        try {
            const response = await fetch(`https://fitbinary.com/api/validate-staff/checkout`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ iv, tv })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseBody = await response.json();

            if (responseBody.success) {
                setConfirmCheckOutState(false);
                setSuccessfulMessage(responseBody.message);
                setSuccessfulAlert(true);
                toast.success(responseBody.message);
                setTimeout(() => window.location.reload(), 1000);
            } else {
                toast.error(responseBody.message || "Checkout failed");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            console.log("Error: ", error)
            toast.error("Failed to checkout staff. Please try again.");
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Fetch all temporary staff attendances
    const fetchAllTemporaryStaffAttendances = async ({ queryKey }) => {
        const [, page, searchQuery] = queryKey;
        try {
            const response = await fetch(`https://fitbinary.com/api/validate-staff/temporary-staffattendance-history?page=${page}&limit=${limit}&searchQuery=${searchQuery}`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.error("Error:", error);
        };
    };

    const { data: temporarystaffattendance, isLoading: AttendanceFetching } = useQuery({
        queryKey: ['temporarystaffattendance', currentPage, debouncedSearchQuery],
        queryFn: fetchAllTemporaryStaffAttendances
    });

    const { TemporaryAttendanceHistory, TotalTemporaryAttendanceHistory, totalPages } = temporarystaffattendance || {};

    let debounceTimeout;

    const handleInputChange = async (e) => {
        try {
            clearTimeout(debounceTimeout);
            const data = e.target.value.trim();

            debounceTimeout = setTimeout(async () => {
                try {
                    const parsedData = JSON.parse(data);
                    const { iv, tv } = parsedData;

                    if (iv && tv && iv.length >= 24) {
                        setQrDetails(parsedData);
                        const response = await fetch(`https://fitbinary.com/api/validate-staff/checkedin`, {
                            method: "POST",
                            headers: {
                                'Content-Type': "application/json"
                            },
                            body: JSON.stringify({ iv, tv })
                        });

                        const responseData = await response.json();

                        if (responseData.checkedIn) {
                            setConfirmCheckOutState(true);
                        } else {
                            setConfirmCheckInState(true);
                        }
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    toast.error("Invalid QR code");
                }
            }, 300);
        } catch (err) {
            console.error('Error in handleInputChange:', err);
            toast.error("Error processing input");
        }
    };

    return (
        <div className='w-full bg-gray-100 dark:bg-gray-900 px-4 py-7'>

            {successfulAlert && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"></div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white border shadow-2xl px-6 py-4 rounded-xl relative w-full max-w-sm"
                    >
                        <div className="flex items-center justify-between border-b pb-3">
                            <h1 className="flex items-center font-semibold text-gray-800">
                                <FaCheckCircle className="text-green-600 text-lg mr-2" />
                                Request Successful
                            </h1>
                            <Button
                                className="bg-transparent hover:bg-gray-100 p-2 rounded-full"
                                onClick={() => setSuccessfulAlert(false)}
                            >
                                <X className="text-gray-600 text-lg" />
                            </Button>
                        </div>

                        <p className="text-gray-600 text-sm mt-3">
                            {successfulMessage}
                        </p>

                        <div className="flex justify-end space-x-3 mt-4">
                            <Button
                                onClick={() => {
                                    setSuccessfulAlert(false);
                                    window.location.reload();
                                }}
                                className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg"
                            >
                                Done
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}

            {confirmCheckInState && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"></div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white border shadow-2xl px-6 py-4 rounded-xl relative w-full max-w-sm"
                    >
                        <div className="flex items-center justify-between border-b pb-3">
                            <h1 className="flex items-center font-semibold text-gray-800">
                                <QrCode className="text-blue-600 text-lg mr-2" />
                                Confirm Check-In
                            </h1>
                            <Button
                                className="bg-transparent hover:bg-gray-100 p-2 rounded-full"
                                onClick={() => setConfirmCheckInState(false)}
                            >
                                <X className="text-gray-600 text-lg" />
                            </Button>
                        </div>

                        <p className="text-gray-600 text-sm mt-3">
                            Are you sure you want to continue check-in?
                        </p>

                        <div className="flex justify-end space-x-3 mt-4">
                            <Button
                                onClick={() => setConfirmCheckInState(false)}
                                className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-4 py-2 rounded-lg"
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg"
                                onClick={() => {
                                    checkInStaff(qrDetails.iv, qrDetails.tv);
                                }}
                            >
                                Continue
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}

            {confirmCheckOutState && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"></div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white border shadow-2xl px-6 py-4 rounded-xl relative w-full max-w-sm"
                    >
                        <div className="flex items-center justify-between border-b pb-3">
                            <h1 className="flex items-center font-semibold text-gray-800">
                                <QrCode className="text-blue-600 text-lg mr-2" />
                                Confirm Check-Out
                            </h1>
                            <Button
                                className="bg-transparent hover:bg-gray-100 p-2 rounded-full"
                                onClick={() => setConfirmCheckOutState(false)}
                            >
                                <X className="text-gray-600 text-lg" />
                            </Button>
                        </div>

                        <p className="text-gray-600 text-sm mt-3">
                            You have already checkedin, Do you want to checkout?
                        </p>

                        <div className="flex justify-end space-x-3 mt-4">
                            <Button
                                onClick={() => setConfirmCheckOutState(false)}
                                className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-4 py-2 rounded-lg"
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg"
                                onClick={() => checkoutStaff(iv, tv)}
                            >
                                Continue
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}

            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/" className="dark:text-gray-200 font-medium flex items-center gap-2"><Home className="h-4 w-4" /> Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1">
                                <BreadcrumbEllipsis className="h-4 w-4 dark:text-gray-200" />
                            </DropdownMenuTrigger>
                        </DropdownMenu>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink className="dark:text-gray-200 font-medium">Attendance</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="dark:text-gray-200 font-medium">Staff Attendance</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className='w-full bg-white mt-4 dark:bg-gray-800 p-4 border dark:border-none rounded-md'>
                <div className='w-full md:flex items-center justify-between'>
                    <div className="md:w-6/12 w-full">
                        <h1 className="w-full text-xl font-bold mt-2 dark:text-gray-200">Staff Attendance</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                            Daily staff check-in and check-out records.</p>
                    </div>
                    <div className="md:w-6/12 w-full flex justify-center p-2">
                        <div className="w-full px-4 flex justify-between border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-500 rounded-sm items-center">
                            <Search className="h-5 w-5 text-gray-400 dark:text-gray-200" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className='w-full border-none bg-none dark:bg-transparent dark:text-gray-200'
                                placeholder='Search...'
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full flex bg-white dark:bg-gray-800 dark:border-none mt-4 rounded-md border justify-center">
                <div className="w-full mx-4">
                    <div className="w-full">
                        <form className="w-full md:flex justify-between items-center my-4">
                            <div className='w-full flex justify-start items-center p-2'>
                                <div className='w-full flex border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-500 px-2 rounded-sm items-center'>
                                    <QrCode className='h-5 w-5 text-gray-400' />
                                    <Input
                                        placeholder='Scan qr code here'
                                        className='rounded-md dark:bg-transparent dark:text-gray-200 border-none outline-none focus:outline-none focus:border-none'
                                        autoFocus
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleQrDetails(e.target.value);
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div className='w-full md:w-2/12 flex justify-start items-center p-2'>
                                <Button type='submit' className='w-full dark:bg-gray-900 dark:border-none dark:text-gray-200 flex items-center rounded-sm bg-slate-800 hover:bg-slate-700 border text-gray-100 hover:text-gray-200'>
                                    <RefreshCw className='h-4 w-4 hover:text-gray-800 text-gray-100 mr-2' />Refresh</Button>
                            </div>
                        </form>

                        <div className="w-full bg-white dark:bg-gray-800">
                            {AttendanceFetching ? (
                                <Loader />
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px] dark:text-gray-200">Staff Id</TableHead>
                                            <TableHead className="dark:text-gray-200">Name</TableHead>
                                            <TableHead className="dark:text-gray-200">Role</TableHead>
                                            <TableHead className="dark:text-gray-200">Check In</TableHead>
                                            <TableHead className="dark:text-gray-200">Check Out</TableHead>
                                            <TableHead className="dark:text-gray-200">Remark</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Array.isArray(TemporaryAttendanceHistory) && TemporaryAttendanceHistory.length > 0 ? (
                                            TemporaryAttendanceHistory.map((attendance) => (
                                                <TableRow key={attendance._id}>
                                                    <TableCell className="font-medium text-xs dark:text-gray-200">{attendance.staff._id}</TableCell>
                                                    <TableCell className="text-sm dark:text-gray-200">{attendance.staff.fullName}</TableCell>
                                                    <TableCell className="text-sm dark:text-gray-200">{attendance.role}</TableCell>
                                                    <TableCell className="text-sm dark:text-gray-200">
                                                        {attendance.checkIn ? new Date(attendance.checkIn).toLocaleTimeString() : 'N/A'}
                                                    </TableCell>
                                                    <TableCell className="text-sm dark:text-gray-200">
                                                        {attendance.checkOut ? new Date(attendance.checkOut).toLocaleTimeString() : 'N/A'}
                                                    </TableCell>
                                                    <TableCell className="text-sm dark:text-gray-200">{attendance.remark}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center" className="dark:text-gray-200">
                                                    Showing 0 out of 0 entries
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TableCell colSpan={1} className="dark:text-gray-200">Total Entries</TableCell>
                                            <TableCell className="text-right dark:text-gray-200">{TotalTemporaryAttendanceHistory}</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            )}
                        </div>
                    </div>

                    <div className="py-2 my-2 dark:text-gray-200">
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

export default StaffAttendance;