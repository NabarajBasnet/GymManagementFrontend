'use client';

import { MdHome } from "react-icons/md";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { usePagination } from "@/hooks/Pagination.js";

// UI Components
import Badge from '@mui/material/Badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Pagination from '@/components/ui/CustomPagination';
import Loader from "@/components/Loader/Loader";

// Icons
import {
    FaExclamationTriangle,
    FaPlayCircle,
    FaSpinner,
} from 'react-icons/fa';
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdError, MdClose, MdDone } from "react-icons/md";
import { QrCode, RefreshCw, Search, User, Calendar, Timer, Info, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';

// Styles
import '../../../globals.css';

const MemberAttendance = () => {
    const queryClient = useQueryClient();
    const [memberId, setMemberId] = useState('');
    const [validationResult, setValidationResult] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 6;
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [textareaColor, setTextAreaColor] = useState('');

    const [toast, setToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState({ icon: MdDone, message: '' });
    const [errorMessage, setErrorMessage] = useState({ icon: MdError, message: '' });
    const [responseType, setResponseType] = useState('');
    const [membershipHoldToggle, setMembershipHoldToggle] = useState(false);
    const [activating, setActivating] = useState(false);

    const {
        formState: { errors }
    } = useForm();

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Auto-hide toast after 5 seconds
    useEffect(() => {
        let timer;
        if (toast) {
            timer = setTimeout(() => setToast(false), 5000);
        }
        return () => clearTimeout(timer);
    }, [toast]);

    const getTemporaryAttendanceHistory = async ({ queryKey }) => {
        const [, page, searchQuery] = queryKey;
        try {
            const response = await fetch(`http://localhost:3000/api/temporary-member-attendance-history?page=${page}&limit=${limit}&searchQuery=${searchQuery}`);
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

    const handleValidation = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/validate-qr/${memberId}`, {
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
            }

            if (response.status === 200) {
                setTextAreaColor('text-green-800');
                setResponseType(responseResultType[0]);
                setToast(true);
                setSuccessMessage({
                    icon: MdDone,
                    message: responseBody.message
                });
            }

            if (response.status === 403 && responseBody.member?.status === 'OnHold') {
                setMembershipHoldToggle(true);
                setTextAreaColor('text-yellow-800');
            }

            if (response.status !== 403 && response.status !== 200) {
                setResponseType(responseResultType[1]);
                setToast(true);
                setErrorMessage({
                    icon: MdError,
                    message: responseBody.message
                });
            }

            return response;
        } catch (error) {
            console.log('Error: ', error);
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

    const activateMembership = async () => {
        setActivating(true);
        const responseResultType = ['Success', 'Failure'];
        const membershipHoldData = { status: 'Active' };

        try {
            const response = await fetch(`http://localhost:3000/api/members/resume-membership/${memberId}`, {
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
            }

            queryClient.invalidateQueries(['members']);
        } catch (error) {
            console.error("Error:", error);
            setToast(true);
            setErrorMessage({
                icon: MdError,
                message: "An unexpected error occurred."
            });
        } finally {
            setActivating(false);
        }
    };

    // Pagination hook
    const { range, setPage, active } = usePagination({
        total: totalPages || 1,
        siblings: 1,
        boundaries: 1,
        page: currentPage,
        onChange: (page) => {
            setCurrentPage(page);
        },
    });

    // Helper function to format dates
    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString('en-GB');
    };

    // Helper function to format times
    const formatTime = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Helper function to determine membership status color
    const getMembershipStatusColor = (member) => {
        if (!member) return "";

        const today = new Date();
        const expireDate = new Date(member.membershipExpireDate);
        const daysLeft = Math.ceil((expireDate - today) / (1000 * 60 * 60 * 24));

        if (member.status === 'OnHold') return "text-yellow-600 bg-yellow-50";
        if (daysLeft <= 0) return "text-red-600 bg-red-50";
        if (daysLeft <= 7) return "text-orange-600 bg-orange-50";
        return "text-green-600 bg-green-50";
    };

    // Function to get status text
    const getMembershipStatusText = (member) => {
        if (!member) return "";

        const today = new Date();
        const expireDate = new Date(member.membershipExpireDate);
        const daysLeft = Math.ceil((expireDate - today) / (1000 * 60 * 60 * 24));

        if (member.status === 'OnHold') return "On Hold";
        if (daysLeft <= 0) return "Expired";
        if (daysLeft <= 7) return `Expires in ${daysLeft} days`;
        return "Active";
    };

    return (
        <div className='w-full bg-slate-50 min-h-screen'>
            {/* Toast Notification */}
            {toast && (
                <>
                    {/* Dark overlay */}
                    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" />

                    {/* Toast component */}
                    <div className="fixed top-6 right-6 z-50 animate-fade-in-down">
                        <div
                            className={`max-w-sm rounded-xl shadow-lg overflow-hidden backdrop-blur-md
                    ${responseType === 'Success'
                                    ? 'bg-white/90 border-4 border-emerald-500'
                                    : 'bg-white/90 border-4 border-red-500'}`}
                        >
                            <div className="flex p-4">
                                {/* Icon */}
                                <div className="flex-shrink-0 mr-4">
                                    {responseType === 'Success' ? (
                                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                            <CheckCircle className="h-6 w-6 text-emerald-500" />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                            <AlertCircle className="h-6 w-6 text-red-500" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className={`font-medium ${responseType === 'Success' ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {responseType === 'Success' ? 'Success' : 'Error'}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-700">
                                        {responseType === 'Success' ? successMessage.message : errorMessage.message}
                                    </p>
                                </div>

                                {/* Close button */}
                                <button
                                    onClick={() => setToast(false)}
                                    className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <MdClose className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Progress bar */}
                            <div className="h-1 w-full bg-gray-200">
                                <div className={`h-full ${responseType === 'Success' ? 'bg-emerald-500' : 'bg-red-500'} animate-shrink`}></div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Membership Hold Modal */}
            {membershipHoldToggle && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMembershipHoldToggle(false)}></div>
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative z-10 animate-scale-in-center">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-amber-100 rounded-full">
                                    <FaExclamationTriangle className="w-6 h-6 text-amber-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Membership On Hold</h2>
                            </div>
                            <button
                                onClick={() => setMembershipHoldToggle(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <MdClose className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="mb-6">
                            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 mb-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <IoMdInformationCircleOutline className="w-5 h-5 text-amber-600 mt-0.5" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-amber-700 font-medium">
                                            This membership has been paused for {validationResult?.member?.pausedDays || 0} days.
                                        </p>
                                        <p className="text-amber-600 text-sm mt-1">
                                            Reactivating will restore full access immediately.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500 font-medium">MEMBER</p>
                                        <p className="font-medium">{validationResult?.member?.fullName || "N/A"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500 font-medium">MEMBERSHIP TYPE</p>
                                        <p className="font-medium">{validationResult?.member?.membershipOption || "N/A"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500 font-medium">START DATE</p>
                                        <p className="font-medium">{formatDate(validationResult?.member?.membershipDate)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500 font-medium">EXPIRATION DATE</p>
                                        <p className="font-medium">{formatDate(validationResult?.member?.membershipExpireDate)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end gap-3">
                            <Button
                                onClick={() => setMembershipHoldToggle(false)}
                                variant="outline"
                                className="px-4 py-2 text-gray-700 border-gray-300 hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={activateMembership}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-2"
                                disabled={activating}
                            >
                                {activating ? (
                                    <>
                                        <FaSpinner className="animate-spin w-4 h-4" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FaPlayCircle className="w-4 h-4" />
                                        Activate Membership
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Breadcrumb and Header */}
            <div className='w-full p-6  border-b border-gray-200 bg-gray-50 shadow-sm'>
                <Breadcrumb className="mb-4">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <MdHome className='w-4 h-4' /><BreadcrumbLink href="/" className="text-slate-600 hover:text-slate-800">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink className="text-slate-600 hover:text-slate-800">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink className="text-slate-600 hover:text-slate-800">Attendance</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium text-slate-900">Member Attendance</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl md:text-lg font-bold text-slate-900">Member Attendance</h1>
                    <Button
                        variant="outline"
                        onClick={reloadPage}
                        className='flex items-center rounded-sm bg-slate-800 hover:bg-slate-700 border text-gray-100 hover:text-gray-200'
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full mx-auto p-4">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Check-in Card */}
                    <Card className="overflow-hidden bg-white shadow-md border-0">
                        <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-600 text-white p-6">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center space-x-2">
                                    <User className="h-5 w-5" />
                                    <span>Member Check-in</span>
                                </CardTitle>
                                {validationResult?.member && (
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getMembershipStatusColor(validationResult.member)}`}>
                                        {getMembershipStatusText(validationResult.member)}
                                    </div>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="p-6">
                            {/* QR Code Input */}
                            <div className="mb-6">
                                <Label htmlFor="qrcode" className="text-sm font-medium text-gray-700 mb-2 block">
                                    Scan QR Code or Enter Member ID
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <QrCode className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        id="qrcode"
                                        type="text"
                                        placeholder="Scan QR code or enter member ID"
                                        value={memberId}
                                        onChange={(e) => setMemberId(e.target.value)}
                                        autoFocus
                                        className="pl-10 pr-3 py-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm rounded-md"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                window.location.reload();
                                            }
                                        }}
                                    />
                                </div>
                                {errors.memberId && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.memberId.message}
                                    </p>
                                )}
                            </div>

                            {/* Member Info */}
                            <div className="space-y-6">
                                {/* Personal Details */}
                                <div className="bg-gray-50 border rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-3">
                                        Personal Details
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-xs text-gray-600 block mb-1">Full Name</Label>
                                            <div className="bg-white border border-gray-200 rounded-md px-3 py-2 text-sm font-medium text-gray-800">
                                                {validationResult?.member?.fullName || "—"}
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-gray-600 block mb-1">Category</Label>
                                            <div className="bg-white border border-gray-200 rounded-md px-3 py-2 text-sm font-medium text-gray-800">
                                                {validationResult?.member?.membershipType || "—"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Membership Details */}
                                <div className="bg-gray-50 border rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-3">
                                        Membership Details
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <Label className="text-xs text-gray-600 block mb-1">Membership Option</Label>
                                            <Input
                                                value={validationResult?.member?.membershipOption || "—"}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-gray-600 block mb-1">Start Date</Label>
                                            <Input
                                                value={formatDate(validationResult?.member?.membershipDate)}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-gray-600 block mb-1">Expire Date</Label>
                                            <Input
                                                value={formatDate(validationResult?.member?.membershipExpireDate)}

                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* System Message */}
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                        System Message
                                    </Label>
                                    <div className={`relative bg-gray-50 rounded-lg border border-gray-200 p-4`}>
                                        {validationResult && (
                                            <div className={`flex items-start ${textareaColor}`}>
                                                <div className="flex-shrink-0 mt-0.5">
                                                    {textareaColor === 'text-green-800' ? (
                                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                                    ) : textareaColor === 'text-red-800' ? (
                                                        <AlertCircle className="h-5 w-5 text-red-600" />
                                                    ) : textareaColor === 'text-yellow-800' ? (
                                                        <FaExclamationTriangle className="h-5 w-5 text-yellow-600" />
                                                    ) : (
                                                        <Info className="h-5 w-5 text-slate-600" />
                                                    )}
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium">
                                                        {validationResult?.message || "No message available"}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {!validationResult && (
                                            <div className="flex flex-col items-center justify-center py-4 text-center text-gray-500">
                                                <QrCode className="h-8 w-8 mb-2 opacity-50" />
                                                <p className="text-sm">Scan a membership QR code to display information</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attendance History Card */}
                    <Card className="overflow-hidden bg-white shadow-md border-0">
                        <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-600 text-white p-6">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center space-x-2">
                                    <Calendar className="h-5 w-5" />
                                    <span>Attendance History</span>
                                </CardTitle>
                                <div className="text-sm font-medium text-slate-200">
                                    {totalAttendance} total records
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6">
                            {/* Search Input */}
                            <div className="mb-4">
                                <Label htmlFor="search" className="text-sm font-medium text-gray-700 mb-2 block">
                                    Search Attendance Records
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        id="search"
                                        type="text"
                                        placeholder="Search by name or member ID..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 pr-3 py-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm rounded-md"
                                    />
                                </div>
                            </div>

                            {/* Attendance Table */}
                            {isAttendanceHistory ? (
                                <div className="flex justify-center items-center p-12">
                                    <Loader />
                                </div>
                            ) : temporaryMemberAttendanceHistory?.temporarymemberattendancehistory.length > 0 ? (
                                <div className="overflow-hidden border border-gray-200 rounded-lg">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50">
                                                <TableHead className="font-medium text-xs uppercase tracking-wider text-slate-600 py-3">Member</TableHead>
                                                <TableHead className="font-medium text-xs uppercase tracking-wider text-slate-600 py-3">Membership</TableHead>
                                                <TableHead className="font-medium text-xs uppercase tracking-wider text-slate-600 py-3">Check-in</TableHead>
                                                <TableHead className="font-medium text-xs uppercase tracking-wider text-slate-600 py-3">Expiration</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {temporaryMemberAttendanceHistory.temporarymemberattendancehistory.map((attendance) => (
                                                <TableRow key={attendance._id} className="hover:bg-gray-50 transition-colors border-t border-gray-200">
                                                    <TableCell className="py-3 flex flex-col space-y-1">
                                                        <span className="text-indigo-600 font-semibold">{attendance.fullName}</span>
                                                        <span className="text-xs font-semibold">{attendance.memberId}</span>
                                                    </TableCell>
                                                    <TableCell className="py-3">
                                                        <Badge className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded">
                                                            {attendance.membershipOption}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="py-3 text-right">
                                                        <div className="flex flex-col items-end">
                                                            <div className="flex items-center text-slate-500 text-xs mt-0.5">
                                                                <Timer className="h-3 w-3 mr-1" />
                                                                {formatTime(attendance.checkInTime)}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-3 text-center">
                                                        <div className="flex flex-col items-end">
                                                            <div className="flex items-center text-slate-500 text-xs mt-0.5">
                                                                <Timer className="h-3 w-3 mr-1" />
                                                                {formatTime(attendance.expiration)}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-12 border border-dashed border-gray-300 rounded-lg">
                                    <Search className="h-10 w-10 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-700 mb-1">No attendance records found</h3>
                                    <p className="text-sm text-gray-500 text-center">
                                        {debouncedSearchQuery
                                            ? "No records match your search criteria"
                                            : "Attendance records will appear here once members start checking in"}
                                    </p>
                                </div>
                            )}

                            {/* Pagination */}
                            <div className="mt-6">
                                <Pagination
                                    total={totalPages || 0}
                                    page={currentPage || 0}
                                    onChange={setCurrentPage}
                                    withEdges={true}
                                    siblings={1}
                                    boundaries={1}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MemberAttendance;
