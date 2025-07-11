'use client';

import {
    Home,
    LayoutDashboard,
} from "lucide-react";
import { ArrowUpDown, ChevronRight } from 'lucide-react';
import { FaLock } from "react-icons/fa";

// UI
import { Checkbox } from "@/components/ui/checkbox";
import Pagination from "@/components/ui/CustomPagination";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Loader from "@/components/Loader/Loader";
import { toast } from "sonner"

// Hooks
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/components/Providers/LoggedInUserProvider";

// Helper functions
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const getStatusBadge = (status) => {
    switch (status) {
        case "Booked":
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
        case "Available":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
        case "Maintenance":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
};

const calculateDaysRemaining = (expireDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expireDate);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
};

const getDaysRemainingBadge = (days) => {
    if (days > 0) {
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    } else if (days < 0) {
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    } else {
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    }
};

const formatDaysText = (days) => {
    if (days > 0) {
        return `${days} day${days !== 1 ? 's' : ''} remaining`;
    } else if (days < 0) {
        return `${Math.abs(days)} day${days !== -1 ? 's' : ''} expired`;
    } else {
        return "Expires today";
    }
};

const LockerExpiry = () => {
    const { user } = useUser();
    const loggedInUser = user?.user;

    // Pagination and Sorting States
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const [sortBy, setSortBy] = useState("expireDate");
    const [sortOrderDesc, setSortOrderDesc] = useState(true);

    const getLockerExpiryList = async ({ queryKey }) => {
        const [, page, limit, sortBy, sortOrderDesc] = queryKey;
        try {
            const response = await fetch(
                `http://localhost:3000/api/lockers/expiry-list?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrderDesc=${sortOrderDesc}`
            );
            const resBody = await response.json();
            return resBody;
        } catch (error) {
            console.log("Error: ", error)
            toast.error(error.message);
        }
    }

    const { data, isLoading } = useQuery({
        queryKey: ['lockerExpiryList', currentPage, limit, sortBy, sortOrderDesc],
        queryFn: getLockerExpiryList,
        keepPreviousData: true,
    });

    const { lockers, totalLockers, totalPages } = data || {};

    return (
        <div className="w-full p-4 md:pt-7 bg-gray-100 dark:bg-gray-900 min-h-screen mx-auto">
            <div className="rounded-sm dark:bg-gray-800 bg-white shadow-md px-4 py-2 mt-2 md:mt-3">
                {/* Breadcrumb */}
                <div className="mb-4">
                    <Breadcrumb>
                        <BreadcrumbList className="flex items-center space-x-1">
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    href="/"
                                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                                >
                                    <Home className="h-4 w-4 mr-2" />
                                    Home
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    href="/dashboard"
                                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                                >
                                    <LayoutDashboard className="h-4 w-4 mr-2" />
                                    Dashboard
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    href="/dashboard/lockers"
                                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                                >
                                    <FaLock className="h-4 w-4 mr-2" />
                                    Lockers
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    href="/dashboard/lockers/expiry"
                                    className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                                >
                                    <FaLock className="h-4 w-4 mr-2" />
                                    Locker Expiry
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start space-x-4">
                            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/25">
                                <FaLock className="h-7 w-7 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                    Locker Expiry List
                                </h1>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                                    View lockers that are expiring within 7 days before or after today
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                {isLoading ? (
                    <Loader />
                ) : (
                    <div className="w-full rounded-md border dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
                        {Array.isArray(lockers) && lockers?.length >= 1 ? (
                            <Table>
                                <TableCaption className="text-sm text-gray-500 dark:text-gray-400">
                                    A list of lockers with upcoming or past expiry dates. Total {totalLockers} lockers found.
                                </TableCaption>
                                <TableHeader>
                                    <TableRow className="bg-gray-100 dark:bg-gray-800">
                                        <TableHead className="text-gray-700 dark:text-gray-300">
                                            <div className="flex items-center">
                                                Locker ID
                                                <ArrowUpDown
                                                    onClick={() => {
                                                        setSortBy("lockerId");
                                                        setSortOrderDesc(!sortOrderDesc);
                                                    }}
                                                    className="ml-2 h-4 w-4 cursor-pointer" />
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-gray-700 dark:text-gray-300">
                                            <div className="flex items-center">
                                                Locker No
                                                <ArrowUpDown
                                                    onClick={() => {
                                                        setSortBy("lockerNumber");
                                                        setSortOrderDesc(!sortOrderDesc);
                                                    }}
                                                    className="ml-2 h-4 w-4 cursor-pointer" />
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-gray-700 dark:text-gray-300">
                                            <div className="flex items-center">
                                                Size
                                                <ArrowUpDown
                                                    onClick={() => {
                                                        setSortBy("lockerSize");
                                                        setSortOrderDesc(!sortOrderDesc);
                                                    }}
                                                    className="ml-2 h-4 w-4 cursor-pointer" />
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-gray-700 dark:text-gray-300">
                                            <div className="flex items-center">
                                                Member
                                                <ArrowUpDown
                                                    onClick={() => {
                                                        setSortBy("memberName");
                                                        setSortOrderDesc(!sortOrderDesc);
                                                    }}
                                                    className="ml-2 h-4 w-4 cursor-pointer" />
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-gray-700 dark:text-gray-300">
                                            <div className="flex items-center">
                                                Renew Date
                                                <ArrowUpDown
                                                    onClick={() => {
                                                        setSortBy("renewDate");
                                                        setSortOrderDesc(!sortOrderDesc);
                                                    }}
                                                    className="ml-2 h-4 w-4 cursor-pointer" />
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-gray-700 dark:text-gray-300">
                                            <div className="flex items-center">
                                                Expire Date
                                                <ArrowUpDown
                                                    onClick={() => {
                                                        setSortBy("expireDate");
                                                        setSortOrderDesc(!sortOrderDesc);
                                                    }}
                                                    className="ml-2 h-4 w-4 cursor-pointer" />
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-gray-700 dark:text-gray-300">
                                            <div className="flex items-center">
                                                Days Remaining
                                                <ArrowUpDown
                                                    onClick={() => {
                                                        setSortBy("expireDate");
                                                        setSortOrderDesc(!sortOrderDesc);
                                                    }}
                                                    className="ml-2 h-4 w-4 cursor-pointer" />
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-gray-700 dark:text-gray-300">
                                            <div className="flex items-center">
                                                Status
                                                <ArrowUpDown
                                                    onClick={() => {
                                                        setSortBy("status");
                                                        setSortOrderDesc(!sortOrderDesc);
                                                    }}
                                                    className="ml-2 h-4 w-4 cursor-pointer" />
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-gray-700 dark:text-gray-300">
                                            <div className="flex items-center">
                                                Fee
                                                <ArrowUpDown
                                                    onClick={() => {
                                                        setSortBy("fee");
                                                        setSortOrderDesc(!sortOrderDesc);
                                                    }}
                                                    className="ml-2 h-4 w-4 cursor-pointer" />
                                            </div>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lockers.map((locker) => {
                                        const daysRemaining = calculateDaysRemaining(locker.expireDate);
                                        return (
                                            <TableRow
                                                key={locker._id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                <TableCell className="text-gray-900 dark:text-white font-medium">
                                                    {locker?.lockerId}
                                                </TableCell>
                                                <TableCell className="text-gray-800 text-center dark:text-gray-300">
                                                    {locker?.lockerNumber}
                                                </TableCell>
                                                <TableCell className="text-gray-700 dark:text-gray-400">
                                                    {locker?.lockerSize}
                                                </TableCell>
                                                <TableCell className="text-gray-700 dark:text-gray-400">
                                                    {locker?.memberName || "Unassigned"}
                                                </TableCell>
                                                <TableCell className="text-gray-700 dark:text-gray-400">
                                                    {formatDate(locker.renewDate)}
                                                </TableCell>
                                                <TableCell className="text-gray-700 dark:text-gray-400">
                                                    {formatDate(locker.expireDate)}
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getDaysRemainingBadge(daysRemaining)}`}
                                                    >
                                                        {formatDaysText(daysRemaining)}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(locker.status)}`}
                                                    >
                                                        {locker.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-gray-700 text-center dark:text-gray-300 font-medium">
                                                    {loggedInUser?.organization?.currency} {locker.fee}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-10 text-gray-600 dark:text-gray-400 text-sm">
                                No lockers found expiring within this period.
                            </div>
                        )}
                    </div>
                )}

                <div className="w-full flex justify-center md:justify-end py-4">
                    <Pagination
                        total={totalPages}
                        page={currentPage}
                        onChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    )
}

export default LockerExpiry;