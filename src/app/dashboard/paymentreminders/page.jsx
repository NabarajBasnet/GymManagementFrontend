'use client';

import {
    Home,
    LayoutDashboard,
} from "lucide-react";
import { TbSend } from "react-icons/tb";
import { ArrowUpDown, ChevronRight } from 'lucide-react';
import { HiMiniUsers } from "react-icons/hi2";

// UI
import { Checkbox } from "@/components/ui/checkbox";
import Pagination from "@/components/ui/CustomPagination";
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
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Loader from "@/components/Loader/Loader";
import { toast } from "sonner"

// Hooks
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/components/Providers/LoggedInUserProvider";
import { Button } from "@/components/ui/button";

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
        case "Active":
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
        case "Inactive":
            return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
        case "OnHold":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
};

const getReminderBadge = (reminderState) => {
    switch (reminderState) {
        case "Reminded":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
        case "Not Reminded":
            return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
        case "Failed":
            return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
};

const MembershipPaymentReminder = () => {
    const { user } = useUser();
    const loggedInUser = user?.user;

    const queryClient = useQueryClient()
    const [sendingReminder, setSendingReminder] = useState(false);
    const [sendingIds, setSendingIds] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);

    // Pagination and Sorting States
    const [currentPage, setCurrentPage] = useState(1);
    let limit = 10;
    const [sortBy, setSortBy] = useState("");
    const [sortOrderDesc, setSortOrderDesc] = useState(true);

    const getPaymentReminderList = async ({ queryKey }) => {
        const [, page, limit, sortBy, sortOrderDesc] = queryKey;
        try {
            const response = await fetch(`http://localhost:3000/api/org-members/member-payment-reminders?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrderDesc=${sortOrderDesc}`);
            const resBody = await response.json();
            return resBody;
        } catch (error) {
            console.log("Error: ", error)
            toast.error(error.message);
        }
    }

    const { data, isLoading } = useQuery({
        queryKey: ['memberlist', currentPage, limit, sortBy, sortOrderDesc],
        queryFn: getPaymentReminderList,
        keepPreviousData: true,
    });

    const { memberlist, totalMembers, totalPages } = data || {};

    const toggleMemberSelection = (memberId) => {
        setSelectedMembers(prev =>
            prev.includes(memberId)
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedMembers.length === memberlist?.length) {
            setSelectedMembers([]);
        } else {
            setSelectedMembers(memberlist?.map(member => member._id) || []);
        }
    };

    const sendBulkPaymentReminders = async () => {
        setSendingReminder(true);
        setSendingIds(selectedMembers);
        try {
            const response = await fetch(`http://localhost:3000/api/org-members/send-bulk-payment-reminder`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ selectedMembers })
            });
            const resBody = await response.json();
            if (response.ok) {
                setSendingIds([]);
                setSendingReminder(false);
                toast.success(resBody.message);
                queryClient.invalidateQueries(['memberlist']);
            }
        } catch (error) {
            setSendingIds([]);
            setSendingReminder(false);
            console.log("Error: ", error);
            toast.error(error.message);
        };
    };

    const sendPaymentReminderBySingle = async (id) => {
        setSendingIds(id);
        try {
            setSendingReminder(true);
            const response = await fetch(`http://localhost:3000/api/org-members/send-single-payment-reminder/${id}`, {
                method: "PUT"
            });
            const resBody = await response.json();
            if (response.ok) {
                setSendingIds([]);
                setSendingReminder(false);
                toast.success(resBody.message);
                queryClient.invalidateQueries(['memberlist']);
            }

        } catch (error) {
            setSendingIds([]);
            setSendingReminder(false)
            console.log("Error: ", error);
            toast.error(error.message);
        };
    };

    return (
        <div className="w-full p-4 md:pt-7 bg-gray-100 dark:bg-gray-900 min-h-screen mx-auto">

            <div className="rounded-sm dark:bg-gray-800 bg-white shadow-md px-4 py-2 mt-2 md:mt-3">
                {/* Enhanced Breadcrumb with Icons */}
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
                                    href="/dashboard/members"
                                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                                >
                                    <HiMiniUsers className="h-4 w-4 mr-2" />
                                    Members
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    href="/dashboard/paymentreminders"
                                    className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                                >
                                    <HiMiniUsers className="h-4 w-4 mr-2" />
                                    Payment Reminders
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Modern Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start space-x-4">
                            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/25">
                                <HiMiniUsers className="h-7 w-7 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                    Payment Reminders
                                </h1>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                                    Send payment reminder notification by email to expired in 7 days before or expiring 7 days later from today
                                </p>
                            </div>
                            {selectedMembers?.length >= 1 ? (
                                <Button
                                    className="flex items-center gap-2 text-sm disabled:opacity-60"
                                    onClick={sendBulkPaymentReminders}
                                    disabled={sendingReminder}
                                >
                                    {sendingReminder ? (
                                        <>
                                            <svg
                                                className="animate-spin h-4 w-4 text-current"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                                                ></path>
                                            </svg>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <TbSend className="text-lg" />
                                            Remind
                                        </>
                                    )}
                                </Button>
                            ) : (
                                <div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                {isLoading ? (
                    <Loader />
                ) : (
                    <div className="w-full rounded-sm border dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md">
                        {Array.isArray(memberlist) && memberlist?.length >= 1 ? (
                            <Table className='dark:bg-gray-800 rounded-sm'>
                                <TableHeader>
                                    <TableRow className="bg-gray-100 dark:bg-gray-800">
                                        <TableHead className="w-[40px] text-gray-700 dark:text-gray-300">
                                            <Checkbox
                                                checked={selectedMembers.length === memberlist?.length && memberlist?.length > 0}
                                                onCheckedChange={toggleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead className="text-gray-700 dark:text-gray-300">
                                            <div className="flex items-center">
                                                Full Name
                                                <ArrowUpDown
                                                    onClick={() => {
                                                        setSortBy("fullName");
                                                        setSortOrderDesc(!sortOrderDesc);
                                                    }}
                                                    className="ml-2 h-4 w-4 cursor-pointer" />
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-gray-700 dark:text-gray-300">
                                            <div className="flex items-center">
                                                Membership
                                                <ArrowUpDown
                                                    onClick={() => {
                                                        setSortBy("planName");
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
                                                        setSortBy("membershipRenewDate");
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
                                                        setSortBy("membershipExpireDate");
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
                                                Paid Amount
                                                <ArrowUpDown
                                                    onClick={() => {
                                                        setSortBy("paidAmmount");
                                                        setSortOrderDesc(!sortOrderDesc);
                                                    }}
                                                    className="ml-2 h-4 w-4 cursor-pointer" />
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-gray-700 dark:text-gray-300">
                                            <div className="flex items-center">
                                                Payment Method
                                                <ArrowUpDown
                                                    onClick={() => {
                                                        setSortBy("paymentMethod");
                                                        setSortOrderDesc(!sortOrderDesc);
                                                    }}
                                                    className="ml-2 h-4 w-4 cursor-pointer" />
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-gray-700 dark:text-gray-300">
                                            <div className="flex items-center">
                                                Reminder Status
                                                <ArrowUpDown
                                                    onClick={() => {
                                                        setSortBy("paymentReminderState");
                                                        setSortOrderDesc(!sortOrderDesc);
                                                    }}
                                                    className="ml-2 h-4 w-4 cursor-pointer" />
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-gray-700 dark:text-gray-300">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {memberlist.map((member) => (
                                        <TableRow
                                            key={member._id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <TableCell className="text-gray-900 dark:text-white">
                                                <Checkbox
                                                    checked={selectedMembers.includes(member._id)}
                                                    onCheckedChange={() => toggleMemberSelection(member._id)}
                                                />
                                            </TableCell>
                                            <TableCell className="text-gray-900 dark:text-white font-medium">
                                                {member?.fullName}
                                            </TableCell>
                                            <TableCell className="text-gray-800 dark:text-gray-300">
                                                {member?.membership?.planName}
                                            </TableCell>
                                            <TableCell className="text-gray-700 dark:text-gray-400">
                                                {formatDate(member.membershipRenewDate)}
                                            </TableCell>
                                            <TableCell className="text-gray-700 dark:text-gray-400">
                                                {formatDate(member.membershipExpireDate)}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(member.status)}`}
                                                >
                                                    {member.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-gray-700 text-center dark:text-gray-300 font-medium">
                                                {loggedInUser?.organization?.currency} {member.paidAmmount}
                                            </TableCell>
                                            <TableCell className="text-gray-700 text-center dark:text-gray-300">
                                                {member.paymentMethod}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${getReminderBadge(member?.paymentReminderState)}`}
                                                >
                                                    {member?.paymentReminderState || "Not Sent"}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <button
                                                    className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition disabled:opacity-50"
                                                    onClick={() => sendPaymentReminderBySingle(member._id)}
                                                    disabled={sendingIds.includes(member._id)}
                                                >
                                                    {sendingIds.includes(member._id) ? (
                                                        <svg
                                                            className="animate-spin h-4 w-4 text-current"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <circle
                                                                className="opacity-25"
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                            ></circle>
                                                            <path
                                                                className="opacity-75"
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                                                            ></path>
                                                        </svg>
                                                    ) : (
                                                        <>
                                                            <TbSend className="text-lg" />
                                                            Remind
                                                        </>
                                                    )}
                                                </button>

                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-10 text-gray-600 dark:text-gray-400 text-sm">
                                No members found for reminder.
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

export default MembershipPaymentReminder;
