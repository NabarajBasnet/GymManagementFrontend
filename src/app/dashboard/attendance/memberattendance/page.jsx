'use client';

import Badge from '@mui/material/Badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    FaCheckCircle,
    FaInfoCircle,
    FaTimes,
    FaExclamationTriangle,
    FaPlayCircle,
    FaSpinner,
} from 'react-icons/fa';
import '../../../globals.css';
import { IoMdInformationCircleOutline } from "react-icons/io";
import Pagination from '@/components/ui/CustomPagination';
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
} from "@/components/ui/table";
import React from 'react';
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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, QrCode, RefreshCw, Search, User, Calendar, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";
import { useForm } from "react-hook-form";
import { MdError, MdClose, MdDone } from "react-icons/md";
import { usePagination, DOTS } from "@/hooks/Pagination.js";

const MemberAttendance = () => {
    const queryClient = useQueryClient();
    const [memberId, setMemberId] = useState('');
    const [validationResult, setValidationResult] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 6;
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [loading, setLoading] = useState();
    const [textareaColor, setTextAreaColor] = useState('');

    const [toast, setToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState({ icon: MdDone, message: '' });
    const [errorMessage, setErrorMessage] = useState({ icon: MdError, message: '' });
    const [responseType, setResponseType] = useState('');

    const {

        formState: { errors }
    } = useForm();

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const getTemporaryAttendanceHistory = async ({ queryKey }) => {
        const [, page, searchQuery] = queryKey;
        try {
            const response = await fetch(`https://gymmanagementbackend-o2l3.onrender.com/api/temporary-member-attendance-history?page=${page}&limit=${limit}&searchQuery=${searchQuery}`);
            return await response.json();
        } catch (error) {
            console.log('Error: ', error);
        }
    };

    const { data: temporaryMemberAttendanceHistory, isLoading: isAttendanceHistory } = useQuery({
        queryKey: ['temporaryMemberAttendanceHistory', currentPage, debouncedSearchQuery],
        queryFn: getTemporaryAttendanceHistory,
    });

    const { totalPages, totalAttendance } = temporaryMemberAttendanceHistory || {};

    const [membershipHoldToggle, setMembershipHoldToggle] = useState(false);

    const handleValidation = async () => {
        try {
            const response = await fetch(`https://gymmanagementbackend-o2l3.onrender.com/api/validate-qr/${memberId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ memberId }),
            });

            const responseBody = await response.json();
            setValidationResult(responseBody);
            const responseResultType = ['Success', 'Failure'];

            if (responseBody.type === 'DayShiftAlert' && response.status === 403) {
                setResponseType(responseResultType[1]);
                setToast(true);
                setErrorMessage({
                    icon: MdError,
                    message: responseBody.message
                });
                setTextAreaColor('text-red-800');
            };

            if (response.status === 200) {
                setTextAreaColor('text-green-800');
                setResponseType(responseResultType[0]);
                setToast(true);
                setSuccessMessage({
                    icon: MdDone,
                    message: responseBody.message
                });
            };

            if (response.status === 403 && responseBody.member.status === 'OnHold') {
                setMembershipHoldToggle(true);
                setTextAreaColor('text-yellow-800');
            };

            if (response.status !== 403 && response.status !== 200) {
                setResponseType(responseResultType[1]);
                setToast(true);
                setErrorMessage({
                    icon: MdError,
                    message: responseBody.message
                });
            };

            return response;
        } catch (error) {
            console.log('Error: ', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (memberId.length >= 24) {
            handleValidation();
        }
    }, [memberId]);

    const reloadPage = () => {
        queryClient.invalidateQueries('temporaryMemberAttendanceHistory');
        window.location.reload();
    };

    const [activating, setActivating] = useState(false);

    const activateMembership = async () => {
        setActivating(true);
        const responseResultType = ['Success', 'Failure'];
        const membershipHoldData = { status: 'Active' };

        try {
            const response = await fetch(`https://gymmanagementbackend-o2l3.onrender.com/api/members/resume-membership/${memberId}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(membershipHoldData)
            });

            const responseBody = await response.json();
            if (response.status === 200) {
                setResponseType(responseResultType[0]);
                setMembershipHoldToggle(false);
                setToast(true);
                setSuccessMessage({
                    icon: MdDone,
                    message: responseBody.message
                });
                setTimeout(() => setToast(false), 10000);
            }

            setActivating(false);
            queryClient.invalidateQueries(['members']);
        } catch (error) {
            console.error("Error:", error);
            setToast(true);
            setErrorMessage({
                icon: MdError,
                message: "An unexpected error occurred."
            });
            setTimeout(() => setToast(false), 10000);
        } finally {
            setActivating(false);
        }
    };

    // Mantine pagination hook
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
            <div className='w-full p-4' onClick={() => setToast(false)}>
                {toast && (
                    <div className="fixed inset-0 flex items-start justify-end z-50 pt-6 pr-6 backdrop-blur-sm">
                        <div className="absolute inset-0 bg-black/30 transition-opacity" />
                        <div className={`bg-white border-l-8 ${responseType === 'Success' ? 'border-green-600' : 'border-red-600'} rounded-xl shadow-3xl max-w-md w-full relative transform transition-all duration-700 animate-slide-in`}>
                            <div className="flex items-start p-6 space-x-4">
                                {/* Icon Container */}
                                <div className="flex-shrink-0">
                                    {responseType === 'Success' ? (
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                            <MdDone className='text-green-600' />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                            <IoMdInformationCircleOutline className='text-red-600' />
                                        </div>
                                    )}
                                </div>

                                {/* Text Content */}
                                <div className="flex-1">
                                    <h3 className={`text-xl font-bold ${responseType === 'Success' ? 'text-green-600' : 'text-red-600'} mb-1`}>
                                        {responseType === 'Success' ? 'Success!' : 'Oops!'}
                                    </h3>
                                    <p className={`${responseType === 'Success' ? 'text-green-600' : 'text-red-600'} text-sm font-medium leading-5`}>
                                        {responseType === 'Success'
                                            ? successMessage.message
                                            : errorMessage.message}
                                    </p>
                                </div>

                                {/* Close Button */}
                                <button
                                    onClick={() => setToast(false)}
                                    className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                                >
                                    <MdClose className='hover:scale-105 transition-all duration-700' />
                                </button>
                            </div>

                            {/* Progress Bar */}
                            {responseType === 'Success' && (
                                <div className="h-1 bg-green-100 rounded-b-lg">
                                    <div className="h-full bg-green-500 rounded-b-lg animate-progress"></div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {membershipHoldToggle && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
                        <div className="absolute inset-0 bg-black/30 transition-opacity" />
                        <div className="bg-white rounded-xl shadow-2xl p-8 relative w-full max-w-2xl transform transition-all">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-full ${responseType === 'Success' ? 'bg-green-100' : 'bg-red-100'}`}>
                                        {responseType === 'Success' ? (
                                            <FaCheckCircle className="w-8 h-8 text-green-600" />
                                        ) : (
                                            <IoMdInformationCircleOutline className="w-8 h-8 text-red-600" />
                                        )}
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Membership Status
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setMembershipHoldToggle(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <MdClose className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="pl-4 border-l-4 border-red-600 ml-14 mb-8">
                                <p className="text-lg font-bold text-gray-800 mb-2">
                                    Membership Paused
                                </p>
                                <p className="text-gray-600 text-sm font-medium">
                                    {`This membership has been paused for ${validationResult?.member?.pausedDays} days. Reactivating will restore full access immediately.`}
                                </p>
                                <div className="mt-4 p-3 bg-yellow-50 rounded-lg flex items-center gap-3">
                                    <FaExclamationTriangle className="text-yellow-600 flex-shrink-0" />
                                    <span className="text-sm text-yellow-700">
                                        Any pending transactions will be processed upon reactivation
                                    </span>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-4 border-t border-red-600 pt-6">
                                <Button
                                    onClick={() => setMembershipHoldToggle(false)}
                                    variant="outline"
                                    className="px-6 py-3 border-gray-300 hover:bg-red-600 hover:text-white transition-all duration-700 text-gray-700"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={activateMembership}
                                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white shadow-sm transition-all"
                                    disabled={activating}
                                >
                                    <div className="flex items-center gap-2">
                                        {activating ? (
                                            <>
                                                <FaSpinner className="animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <FaPlayCircle />
                                                Activate Membership
                                            </>
                                        )}
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

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
                            <BreadcrumbPage>Member Attendance</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-xl font-bold mt-3">Member Attendance</h1>
            </div>

            <div className="min-h-screen bg-gray-50 md:p-6 p-1 flex justify-center">
                <div className="w-full md:mx-4 mx-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
                        {/* Member Check-in Section */}
                        <Card className="p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">Member Check-in</h2>
                                <Button
                                    variant="outline"
                                    onClick={() => window.location.reload()}
                                    className="flex items-center gap-2"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Refresh
                                </Button>
                            </div>

                            <form className="space-y-4 max-w-2xl mx-1 md:mx-4">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                        <QrCode className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="Scan QR code or enter member ID"
                                        value={memberId}
                                        onChange={(e) => setMemberId(e.target.value)}
                                        autoFocus
                                        className="pl-10 border-gray-200"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                window.location.reload();
                                            }
                                        }}
                                    />
                                </div>

                                {errors.memberId && (
                                    <p className="text-sm font-medium text-red-600">
                                        {errors.memberId.message}
                                    </p>
                                )}

                                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                                    <div className="grid grid-cols-3 gap-4 items-center">
                                        <Label className="font-medium text-gray-700">Full Name</Label>
                                        <div className="col-span-2">
                                            <Input
                                                value={validationResult?.member?.fullName || ""}
                                                disabled
                                                className="bg-white border-gray-200 text-gray-900 disabled:text-gray-900 disabled:opacity-100"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 items-center">
                                        <Label className="font-medium text-gray-700">Membership Option</Label>
                                        <div className="col-span-2">
                                            <Input
                                                value={validationResult?.member?.membershipOption || ""}
                                                disabled
                                                className="bg-white border-gray-200 text-gray-900 disabled:text-gray-900 disabled:opacity-100"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 items-center">
                                        <Label className="font-medium text-gray-700">Category</Label>
                                        <div className="col-span-2">
                                            <Input
                                                value={validationResult?.member?.membershipType || ""}
                                                disabled
                                                className="bg-white border-gray-200 text-gray-900 disabled:text-gray-900 disabled:opacity-100"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 items-center">
                                        <Label className="font-medium text-gray-700">Start Date</Label>
                                        <div className="col-span-2">
                                            <Input
                                                value={
                                                    validationResult?.member?.membershipDate
                                                        ? new Date(validationResult.member.membershipDate)
                                                            .toISOString()
                                                            .split("T")[0]
                                                        : ""
                                                }
                                                disabled
                                                className="bg-white border-gray-200 text-gray-900 disabled:text-gray-900 disabled:opacity-100"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 items-center">
                                        <Label className="font-medium text-gray-700">Renew Date</Label>
                                        <div className="col-span-2">
                                            <Input
                                                value={
                                                    validationResult?.member?.membershipDate
                                                        ? new Date(validationResult.member.membershipDate)
                                                            .toISOString()
                                                            .split("T")[0]
                                                        : ""
                                                }
                                                disabled
                                                className="bg-white border-gray-200 text-gray-900 disabled:text-gray-900 disabled:opacity-100"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 items-center">
                                        <Label className="font-medium text-gray-700">Expire Date</Label>
                                        <div className="col-span-2">
                                            <Input
                                                value={
                                                    validationResult?.member?.membershipDate
                                                        ? new Date(validationResult.member.membershipExpireDate)
                                                            .toISOString()
                                                            .split("T")[0]
                                                        : ""
                                                }
                                                disabled
                                                className="bg-white border-gray-200 text-gray-900 disabled:text-gray-900 disabled:opacity-100"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 items-start">
                                        <Label className="font-medium text-gray-700 pt-2">Message</Label>
                                        <div className="col-span-2">
                                            <Textarea
                                                value={validationResult?.message || ""}
                                                disabled
                                                className={`h-32 bg-white font-semibold border-gray-200 ${textareaColor} resize-none`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </Card>

                        {/* Attendance History Section */}
                        <Card className="p-2 md:p-4 shadow-sm">
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800">Member Attendance Record</h2>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 border-gray-200"
                                        placeholder="Search member by name or ID..."
                                    />
                                </div>

                                {isAttendanceHistory ? (
                                    <div className="flex justify-center items-center h-64">
                                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50">
                                                    <TableHead className="font-semibold">Member ID</TableHead>
                                                    <TableHead className="font-semibold">Name</TableHead>
                                                    <TableHead className="font-semibold">Option</TableHead>
                                                    <TableHead className="font-semibold text-right">Check In</TableHead>
                                                    <TableHead className="font-semibold text-right">Expires</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {temporaryMemberAttendanceHistory?.temporarymemberattendancehistory.map((attendance) => (
                                                    <TableRow key={attendance._id} className="hover:bg-gray-50">
                                                        <TableCell className="font-medium">{attendance.memberId}</TableCell>
                                                        <TableCell>{attendance.fullName}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="secondary" className="font-normal">
                                                                {attendance.membershipOption}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-1 text-gray-600">
                                                                <Calendar className="h-4 w-4" />
                                                                {new Date(attendance.checkInTime).toLocaleDateString('en-GB')}
                                                                <Timer className="h-4 w-4 ml-2" />
                                                                {new Date(attendance.checkInTime).toLocaleTimeString('en-GB', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-1 text-gray-600">
                                                                <Calendar className="h-4 w-4" />
                                                                {new Date(attendance.expiration).toLocaleDateString('en-GB')}
                                                                <Timer className="h-4 w-4 ml-2" />
                                                                {new Date(attendance.expiration).toLocaleTimeString('en-GB', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                            <TableFooter>
                                                <TableRow>
                                                    <TableCell colSpan={1} className="text-left font-medium">Total Attendance</TableCell>
                                                    <TableCell className="text-left font-medium" colSpan={1}>
                                                        {totalAttendance} members
                                                    </TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        </Table>
                                    </div>
                                )}

                                <div className="flex justify-center pt-4">
                                    <Pagination
                                        total={totalPages || 1}
                                        siblings={1}
                                        boundaries={1}
                                        page={currentPage}
                                        onChange={setCurrentPage}
                                        withEdges
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MemberAttendance;
