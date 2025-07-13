'use client';

import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import { toast as sonnerToast } from 'sonner';
import { MdHome } from "react-icons/md";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
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
import {
    FaExclamationTriangle,
    FaPlayCircle,
    FaSpinner,
} from 'react-icons/fa';
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { QrCode, RefreshCw, Search, User, Calendar, Timer, Info, AlertCircle, CheckCircle } from 'lucide-react';
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
    const [membershipHoldToggle, setMembershipHoldToggle] = useState(false);
    const [activating, setActivating] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

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
            const response = await fetch(`https://fitbinary.com/api/temporary-member-attendance-history?page=${page}&limit=${limit}&searchQuery=${searchQuery}`);
            const data = await response.json();

            if (!response.ok) {
                setAlertMessage('Failed to load attendance history');
                setShowErrorAlert(true);
                setTimeout(() => setShowErrorAlert(false), 7000);
            }

            return data;
        } catch (error) {
            console.log('Error: ', error);
            setAlertMessage(error.message);
            setShowErrorAlert(true);
            setTimeout(() => setShowErrorAlert(false), 7000);
            sonnerToast.error(error.message)
        }
    };

    const { data, isLoading: isAttendanceHistory } = useQuery({
        queryKey: ['temporaryMemberAttendanceHistory', currentPage, debouncedSearchQuery],
        queryFn: getTemporaryAttendanceHistory,
    });
    const { temporarymemberattendancehistory, totalPages, totalAttendance } = data || {};

    const handleValidation = async () => {
        try {
            const response = await fetch(`https://fitbinary.com/api/validate-qr/${memberId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ memberId }),
            });

            const responseBody = await response.json();
            setValidationResult(responseBody);

            if (responseBody.type === 'DayShiftAlert' && response.status === 403) {
                sonnerToast.error(responseBody.message)
                setTextAreaColor('text-red-500');
                setAlertMessage(responseBody.message);
                setShowErrorAlert(true);
                setTimeout(() => setShowErrorAlert(false), 5000);
            }

            if (response.status === 200) {
                setTextAreaColor('text-green-600');
                sonnerToast.success(responseBody.message);
                setAlertMessage(responseBody.message);
                setShowSuccessAlert(true);
                setTimeout(() => setShowSuccessAlert(false), 5000);
            }

            if (response.status === 403 && responseBody.member?.status === 'OnHold') {
                setMembershipHoldToggle(true);
                setTextAreaColor('text-yellow-600');
                setAlertMessage(responseBody.message);
                setShowErrorAlert(true);
                setTimeout(() => setShowErrorAlert(false), 5000);
            }

            if (response.status !== 403 && response.status !== 200) {
                sonnerToast.error(responseBody.message);
                setTextAreaColor('text-red-600');
                setAlertMessage(responseBody.message);
                setShowErrorAlert(true);
                setTimeout(() => setShowErrorAlert(false), 5000);
            }
            return response;
        } catch (error) {
            console.log('Error: ', error);
            setTextAreaColor('text-red-600');
            sonnerToast.error(error.message);
            setAlertMessage(error.message);
            setShowErrorAlert(true);
            setTimeout(() => setShowErrorAlert(false), 5000);
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
        const membershipHoldData = { status: 'Active' };

        try {
            const response = await fetch(`https://fitbinary.com/api/members/resume-membership/${memberId}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(membershipHoldData)
            });

            const responseBody = await response.json();
            if (response.status === 200) {
                sonnerToast.success(responseBody.message);
                setMembershipHoldToggle(false);
                setAlertMessage(responseBody.message);
                setShowSuccessAlert(true);
                setTimeout(() => setShowSuccessAlert(false), 5000);
            } else {
                setAlertMessage(responseBody.message || 'Failed to activate membership');
                setShowErrorAlert(true);
                setTimeout(() => setShowErrorAlert(false), 5000);
            }

            queryClient.invalidateQueries(['members']);
        } catch (error) {
            console.error("Error:", error);
            sonnerToast.error(error.message);
            setAlertMessage(error.message);
            setShowErrorAlert(true);
            setTimeout(() => setShowErrorAlert(false), 5000);
        } finally {
            setActivating(false);
        }
    };

    // Helper function to format dates
    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString('en-GB');
    };

    // Helper function to format times
    const formatTime = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleTimeString();
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
        <div className='w-full bg-slate-50 dark:bg-gray-900 min-h-screen'>

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
                                className="px-4 py-2 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 text-gray-700 border-gray-300 hover:bg-gray-100 transition-colors"
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
            <div className='w-full p-4 md:pt-9 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 shadow-sm'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <MdHome className='w-5 h-5' /><BreadcrumbLink href="/" className="text-slate-600 dark:text-gray-200 hover:text-slate-800 font-medium">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink className="text-slate-600 dark:text-gray-200 hover:text-slate-800 font-medium">Attendance</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium text-slate-900 dark:text-gray-200 font-medium">Member Attendance</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex justify-between items-center">
                    <h1 className="text-2xl md:text-lg text-slate-900 dark:text-gray-200 font-medium">Member Attendance</h1>
                    <Button
                        variant="outline"
                        onClick={reloadPage}
                        className='flex items-center dark:bg-gray-900 dark:border-gray-600 rounded-sm bg-slate-800 hover:bg-slate-700 border text-gray-100 hover:text-gray-200'
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
                    <Card className="overflow-hidden bg-white dark:bg-gray-800 dark:border-none shadow-md border-0">
                        <CardHeader className="bg-gradient-to-r from-slate-800 dark:border-gray-600 dark:border-b to-slate-600 text-white p-6">
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
                                <Label htmlFor="qrcode" className="text-sm font-medium dark:text-gray-200 text-gray-700 mb-2 block">
                                    Scan QR Code or Enter Member ID
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <QrCode className="h-5 w-5 text-gray-400 dark:text-gray-200" />
                                    </div>
                                    <Input
                                        id="qrcode"
                                        type="text"
                                        placeholder="Scan QR code or enter member ID"
                                        value={memberId}
                                        onChange={(e) => setMemberId(e.target.value)}
                                        autoFocus
                                        className="pl-10 pr-3 py-6 bg-white dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm rounded-sm"
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

                            <div className="z-50 space-y-4 mb-4 w-full max-w-xl">
                                {showSuccessAlert && (
                                    <Alert className="animate-fade-in-up bg-green-600 shadow-lg">
                                        <CheckCircle2Icon className="h-5 w-5 text-white" />
                                        <AlertTitle className='text-white'>Success!</AlertTitle>
                                        <AlertDescription className='text-white'>
                                            {alertMessage}
                                        </AlertDescription>
                                    </Alert>
                                )}
                                {showErrorAlert && (
                                    <Alert className="animate-fade-in-up bg-red-600 shadow-lg">
                                        <AlertCircleIcon className="h-5 w-5 text-white" />
                                        <AlertTitle className='text-white'>Error</AlertTitle>
                                        <AlertDescription className='text-white'>
                                            {alertMessage}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Member Info */}
                            <div className="space-y-6">
                                {/* Personal Details */}
                                <div className="bg-gray-50 dark:bg-gray-800 border rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider dark:text-gray-200 mb-3">
                                        Personal Details
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-xs text-gray-600 block mb-1 dark:text-gray-200">Full Name</Label>
                                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-sm px-3 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">
                                                {validationResult?.member?.fullName || "—"}
                                            </div>
                                        </div>
                                        <div className="dark:text-gray-200">
                                            <Label className="text-xs text-gray-600 block mb-1 dark:text-gray-200">Category</Label>
                                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-sm px-3 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">
                                                {validationResult?.member?.membershipType || "—"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Membership Details */}
                                <div className="bg-gray-50 dark:bg-gray-800 border rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-3 dark:text-gray-200">
                                        Membership Details
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <Label className="text-xs text-gray-600 block mb-1 dark:text-gray-200">Membership Option</Label>
                                            <Input
                                                className="bg-white dark:bg-gray-800 py-6 rounded-sm dark:text-gray-200 dark:border-gray-600"
                                                value={validationResult?.member?.membershipOption || "—"}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-gray-600 block mb-1 dark:text-gray-200">Start Date</Label>
                                            <Input
                                                className="bg-white dark:bg-gray-800 py-6 rounded-sm dark:text-gray-200 dark:border-gray-600"
                                                value={formatDate(validationResult?.member?.membershipDate)}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-gray-600 block mb-1 dark:text-gray-200">Expire Date</Label>
                                            <Input
                                                className="bg-white dark:bg-gray-800 py-6 rounded-sm dark:text-gray-200 dark:border-gray-600"
                                                value={formatDate(validationResult?.member?.membershipExpireDate)}

                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* System Message */}
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-2 block dark:text-gray-200">
                                        Attendance Message
                                    </Label>
                                    <div className={`relative bg-gray-50 dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-600 p-4`}>
                                        {validationResult && (
                                            <div className={`flex items-start ${textareaColor}`}>
                                                <div className="flex-shrink-0 mt-0.5">
                                                    {textareaColor === 'text-green-600' ? (
                                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                                    ) : textareaColor === 'text-red-600' ? (
                                                        <AlertCircle className="h-5 w-5 text-red-600" />
                                                    ) : textareaColor === 'text-yellow-600' ? (
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
                                                <p className="text-sm dark:text-gray-200">Scan a membership QR code to display information</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attendance History Card */}
                    <Card className="overflow-hidden bg-white dark:bg-gray-800 dark:border-none shadow-md border-0">
                        <CardHeader className="bg-gradient-to-r from-slate-800 dark:border-gray-600 dark:border-b to-slate-600 text-white p-6">
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
                                <Label htmlFor="search" className="text-sm dark:text-gray-200 font-medium text-gray-700 mb-2 block">
                                    Search Attendance Records
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400 dark:text-gray-200" />
                                    </div>
                                    <Input
                                        id="search"
                                        type="text"
                                        placeholder="Search by name or member ID..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-white pl-10 pr-3 py-6 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm rounded-sm"
                                    />
                                </div>
                            </div>

                            {/* Attendance Table */}
                            {isAttendanceHistory ? (
                                <div className="flex justify-center items-center p-12">
                                    <Loader />
                                </div>
                            ) : temporarymemberattendancehistory?.length > 0 ? (
                                <div className="overflow-hidden border border-gray-200 rounded-lg dark:border-gray-700">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50 dark:bg-gray-900 dark:border-none">
                                                <TableHead className="font-medium text-xs uppercase tracking-wider text-slate-600 dark:text-gray-300 py-3">Member</TableHead>
                                                <TableHead className="font-medium text-xs uppercase tracking-wider text-slate-600 dark:text-gray-300 py-3">Membership Type</TableHead>
                                                <TableHead className="font-medium text-xs uppercase tracking-wider text-slate-600 dark:text-gray-300 py-3">Check-in</TableHead>
                                                <TableHead className="font-medium text-xs uppercase tracking-wider text-slate-600 dark:text-gray-300 py-3">Expiration</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {temporarymemberattendancehistory?.map((attendance) => (
                                                <TableRow key={attendance._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 overflow-x-auto transition-colors border-t border-gray-200 dark:border-gray-600">
                                                    <TableCell className="py-3 flex flex-col space-y-1">
                                                        <span className="text-indigo-600 font-semibold">{attendance.memberId?.fullName}</span>
                                                        <span className="text-xs font-semibold">{attendance.memberId?._id}</span>
                                                    </TableCell>
                                                    <TableCell className="py-3">
                                                        <Badge className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded">
                                                            {attendance.memberId?.membershipType}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="py-3 text-right">
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center text-slate-500 dark:text-gray-300 text-xs mt-0.5">
                                                                <Timer className="h-3 w-3 mr-1" />
                                                                {formatTime(attendance.checkInTime)}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-3">
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center text-slate-500 dark:text-gray-300 text-xs mt-0.5">
                                                                <Timer className="h-3 w-3 mr-1" />
                                                                00:00
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
                                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-1">No attendance records found</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-200 text-center">
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
