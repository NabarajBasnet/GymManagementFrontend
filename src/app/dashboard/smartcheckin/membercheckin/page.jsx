'use client';

import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import {
    FaExclamationTriangle,
    FaPlayCircle,
    FaSpinner,
} from 'react-icons/fa';
import { MdClose } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import Loader from '@/components/Loader/Loader';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Pagination from '@/components/ui/CustomPagination';
import { Activity, Search, User, Calendar, Timer, Info, AlertCircle, CheckCircle } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState, useRef } from "react";
import { useUser } from "@/components/Providers/LoggedInUserProvider";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { TbReload } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
});

const SmartAttendanceDashboard = () => {
    const { user: loggedInUser } = useUser();
    const user = loggedInUser?.user;
    const features = user?.tenant?.subscription?.subscriptionFeatures
    const multiBranchSupport = features?.some(feature => feature.toString() === 'Multi Branch Support');
    const onFreeTrail = user?.tenant?.freeTrailStatus === 'Active';
    const orgOrBranchId = (onFreeTrail || multiBranchSupport) ? user?.organizationBranch?._id : user?.organization?._id;

    // States
    const queryClient = useQueryClient();
    const [sessionActive, setSessionActive] = useState(false)
    const [openMemberCheckInAlert, setMemberCheckInAlert] = useState(false);
    const [memberName, setMemberName] = useState('')
    const [memberId, setMemberId] = useState('')
    const [currentLat, setCurrentLat] = useState(null);
    const [currentLng, setCurrentLng] = useState(null);
    const [membershipHoldToggle, setMembershipHoldToggle] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 6;
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [locationPermission, setLocationPermissionState] = useState('');
    const [responseData, setResponseData] = useState(null);
    const [responseMessage, setResponseMessage] = useState(null);
    const [textareaColor, setTextAreaColor] = useState('');
    const [activating, setActivating] = useState(false);

    // Helper function to format dates
    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString('en-GB');
    };

    useEffect(() => {
        // Check if we're in the browser before using navigator
        if (typeof window !== 'undefined') {
            navigator.permissions?.query?.({ name: 'geolocation' })
                .then((permissionStatus) => {
                    console.log('Geolocation permission state:', permissionStatus.state);
                    setLocationPermissionState(permissionStatus.state);

                    permissionStatus.onchange = () => {
                        setLocationPermissionState(permissionStatus.state);
                        console.log('Geolocation permission changed to:', permissionStatus.state);
                    };
                })
                .catch((err) => {
                    console.error('Permission check failed:', err);
                });
        }
    }, []);

    useEffect(() => {
        const handleChatMessage = (data) => {
            toast.success(data);
        };

        const handleRequestCheckin = (data) => {
            if (data.split('-')[0] === 'checkin_req') {
                setMemberCheckInAlert(true);
                setMemberName(data.split('-')[3]);
                setMemberId(data.split('-')[1]);
            };
        };

        socket.on('chat message', handleChatMessage);
        socket.on('request-checkin', handleRequestCheckin);

        // Cleanup on unmount or re-render
        return () => {
            socket.off('chat message', handleChatMessage);
            socket.off('request-checkin', handleRequestCheckin);
        };
    }, []);

    const handleMemberValidation = async (memberId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/validate-qr/${memberId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ memberId }),
            });

            const responseBody = await response.json();
            setResponseData(responseBody);
            setResponseMessage(responseBody.message);
            if (responseBody.type === 'DayShiftAlert' && response.status === 403) {
                toast.error(responseBody.message);
                setTextAreaColor('text-red-500');
                const message = {
                    message: responseBody.message,
                    status: response.status
                };
                socket.emit('check-in-req-error', { message })
            }

            if (response.status === 200) {
                setTextAreaColor('text-green-600');
                toast.success(responseBody.message);
                const message = {
                    message: responseBody.message,
                    status: response.status
                };
                socket.emit('check-in-req-successful', { message })
            };

            if (response.status === 403 && responseBody.member?.status === 'OnHold') {
                setMembershipHoldToggle(true);
                setMembershipHoldToggle(true);
                setTextAreaColor('text-yellow-600');
                const message = {
                    message: responseBody.message,
                    status: response.status
                };
                socket.emit('check-in-req-error', { message })
                toast.error(responseBody.message);
            }

            if (response.status !== 403 && response.status !== 200) {
                toast.error(responseBody.message);
                setTextAreaColor('text-red-600');
                const message = {
                    message: responseBody.message,
                    status: response.status
                };
                socket.emit('check-in-req-error', { message })
            }
            return response;
        } catch (error) {
            setTextAreaColor('text-red-600');
            console.log('Error: ', error);
            const message = {
                message: responseBody.message,
                status: response.status
            };
            socket.emit('check-in-req-error', { message })
            toast.error(error.message);
        }
    };

    const acceptCheckInReq = async () => {
        handleMemberValidation(memberId)
    }

    const rejectCheckInReq = async () => {
        socket.emit('checkin-req-rejected', { orgOrBranchId })
    }

    const enableMemberCheckInFlag = async () => {
        try {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    setCurrentLat(lat);
                    setCurrentLng(lng);
                    setSessionActive(true);

                    const orgOrBranchId = (multiBranchSupport || onFreeTrail)
                        ? user?.organizationBranch?._id
                        : user?.organization?._id;

                    socket.emit('start-member-checkin-session', { orgOrBranchId });
                    const apiUrl = (multiBranchSupport || onFreeTrail)
                        ? `http://localhost:3000/api/organizationbranch/toggle-membercheckin-flag`
                        : `http://localhost:3000/api/organization/toggle-member-checkin`;

                    const response = await fetch(apiUrl, {
                        method: "PUT",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ currentLat: lat, currentLng: lng })
                    });

                    const resBody = await response.json();

                    if (!response.ok) {
                        toast.error(resBody.message || "Failed to update location");
                    };
                },
                (error) => {
                    console.error("Failed to get location:", error.message);
                    toast.error("Location permission denied or error occurred");
                },
                { enableHighAccuracy: true }
            );

        } catch (error) {
            console.log('Error:', error.message);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        const run = async () => {
            await enableMemberCheckInFlag();
        };

        run();
    }, [orgOrBranchId]);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const getTemporaryAttendanceHistory = async ({ queryKey }) => {
        const [, page, searchQuery] = queryKey;
        try {
            const response = await fetch(`http://localhost:3000/api/temporary-member-attendance-history?page=${page}&limit=${limit}&searchQuery=${searchQuery}`);
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

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    const activateMembership = async () => {
        setActivating(true);
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
                toast.success(responseBody.message);
                setMembershipHoldToggle(false);
            } else {
                toast.error(responseBody.message)
            }

            queryClient.invalidateQueries(['members']);
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.message);
        } finally {
            setActivating(false);
        }
    };

    // Authorize focus
    const authorizeBtnRef = useRef(null);

    useEffect(() => {
        authorizeBtnRef.current?.focus();

        const handleKeyDown = (e) => {
            if (e.key === "Enter") {
                acceptCheckInReq();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div className="w-full mx-auto">

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
                                                This membership has been paused for {responseData?.member?.pausedDays || 0} days.
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
                                            <p className="font-medium">{responseData?.member?.fullName || "N/A"}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-500 font-medium">MEMBERSHIP TYPE</p>
                                            <p className="font-medium">{responseData?.member?.membershipType || "N/A"}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-500 font-medium">START DATE</p>
                                            <p className="font-medium">{formatDate(responseData?.member?.membershipDate)}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-500 font-medium">EXPIRATION DATE</p>
                                            <p className="font-medium">{formatDate(responseData?.member?.membershipExpireDate)}</p>
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

                {/* Modern Header with Glassmorphism Effect */}
                <div className="relative mb-4 overflow-hidden">
                    <div className="mt-6 relative bg-white dark:bg-gray-800 rounded-md p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <div className="relative p-3 bg-sky-500 rounded-xl">
                                        <Activity className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-black dark:text-gray-200 bg-clip-text">
                                        Member Attendance
                                    </h1>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm font-medium mt-2">
                                        Real-time member check-ins with geolocation validation
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${sessionActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                                    <div className={`w-2 h-2 rounded-full ${sessionActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                                    <span className="text-sm font-medium">
                                        {sessionActive ? 'Session Active' : 'Session Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Member Information Panel */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                    <Card className="min-h-[75vh] bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl rounded-md overflow-hidden">
                        <div className="flex justify-between border-b dark:border-gray-600 items-center bg-white dark:bg-gray-800 p-3">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <User className="h-6 w-6 dark:text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold dark:text-white">Member Information</h2>
                                    <p className="text-sm text-gray-700 dark:text-indigo-100 mt-1">Real-time member details</p>
                                </div>
                            </div>

                            <Button onClick={() => window.location.reload()}>
                                <TbReload />
                                Reload
                            </Button>
                        </div>

                        <CardContent className="p-3 space-y-4">
                            {/* Personal Details */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3">
                                    <div className="w-full">
                                        <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Full Name</Label>
                                        <div className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                                            {responseData?.member?.fullName || 'Member Name'}
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Category</Label>
                                        <div className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                                            {responseData?.membershipType || 'Type'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Membership Details */}
                            <div className="space-y-2">
                                <div className="space-y-3">
                                    <div>
                                        <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Membership Option</Label>
                                        <Input
                                            className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-lg h-12 dark:text-slate-200"
                                            value={responseData?.member?.membership?.servicesIncluded || "—"}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Start Date</Label>
                                            <Input
                                                className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-lg h-12 dark:text-slate-200"
                                                value={formatDate(responseData?.member?.membershipRenewDate)}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Expire Date</Label>
                                            <Input
                                                className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-lg h-12 dark:text-slate-200"
                                                value={formatDate(responseData?.membershipExpireDate)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* QR Code Scanner Area */}
                            <div>
                                <Label className="text-sm font-medium text-gray-700 mb-2 block dark:text-gray-200">
                                    Attendance Message
                                </Label>
                                <div className={`relative bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4`}>
                                    {responseMessage && (
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
                                                    {responseMessage || "No message available"}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {!responseMessage && (
                                        <p className="text-sm dark:text-gray-200">Scan a membership QR code to display information</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="min-h-[75vh]">
                        <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl rounded-md overflow-hidden">
                            <div className="dark:bg-gray-700 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                            <Calendar className="h-6 w-6 dark:text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold dark:text-white">Attendance History</h2>
                                            <p className="text-gray-700 dark:text-slate-200 mt-1">Track member check-ins and activity</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                                        <span className="text-sm font-medium text-white">
                                            {totalAttendance || 0} total records
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <CardContent className="p-4">
                                {/* Enhanced Search */}
                                <div className="mb-4">
                                    <Label htmlFor="search" className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3 block">
                                        Search Attendance Records
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Search className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <Input
                                            id="search"
                                            type="text"
                                            placeholder="Search by name or member ID..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-12 pr-4 py-6 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                                        />
                                    </div>
                                </div>

                                {/* Attendance Records */}
                                {isAttendanceHistory ? (
                                    <Loader />
                                ) : temporarymemberattendancehistory?.length > 0 ? (
                                    <div className="space-y-3">
                                        {temporarymemberattendancehistory?.map((attendance, index) => (
                                            <div
                                                key={attendance._id}
                                                className="group relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-sm p-2 hover:shadow-lg transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="relative">
                                                            <div className="relative w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                                                <span className="text-white font-bold text-sm">
                                                                    {attendance.fullName?.charAt(0) || 'M'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                                                                {attendance.fullName}
                                                            </h3>
                                                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                                ID: {attendance.memberId}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-6">
                                                        <div className="text-center">
                                                            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                                {attendance.membershipOption}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="flex items-center text-slate-600 dark:text-slate-300 text-sm">
                                                                <Timer className="h-4 w-4 mr-2" />
                                                                {formatTime ? formatTime(attendance.checkInTime) : attendance.checkInTime}
                                                            </div>
                                                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                                Check-in time
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16">
                                        <div className="relative mb-6">
                                            <div className="absolute -inset-4 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full blur opacity-20"></div>
                                            <div className="relative w-16 h-16 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full flex items-center justify-center mx-auto">
                                                <Search className="h-8 w-8 text-white" />
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
                                            No attendance records found
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                                            {debouncedSearchQuery
                                                ? "No records match your search criteria. Try adjusting your search terms."
                                                : "Attendance records will appear here once members start checking in"}
                                        </p>
                                    </div>
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-8">
                                        <Pagination
                                            total={totalPages}
                                            page={currentPage}
                                            onChange={setCurrentPage}
                                            withEdges={true}
                                            siblings={1}
                                            boundaries={1}
                                            className="justify-center"
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Check-In Authorization Dialog */}
                <AlertDialog open={openMemberCheckInAlert} onOpenChange={setMemberCheckInAlert}>
                    <AlertDialogContent className="max-w-xl rounded-2xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-0 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)] backdrop-blur-sm overflow-hidden">
                        <div className="relative">
                            <AlertDialogHeader className="px-8 pt-6 pb-4">
                                <div className="mb-4 flex justify-center">
                                    <div className="relative">
                                        <div className="absolute -inset-3 rounded-full bg-blue-100/50 dark:bg-blue-900/30 blur-sm" />
                                        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                                            <User className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                </div>

                                <AlertDialogTitle className="text-center text-2xl font-semibold text-gray-900 dark:text-white">
                                    Check-In Authorization
                                </AlertDialogTitle>
                                <AlertDialogDescription className="mt-2 text-center text-gray-600 dark:text-gray-300">
                                    <span className="font-medium text-indigo-600 dark:text-indigo-400">
                                        {memberName || "A member"} is requesting to check in. Would you like to approve this request?
                                    </span>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                        </div>

                        <AlertDialogFooter className="px-8 pb-6 pt-4">
                            <div className="flex w-full gap-3">
                                <AlertDialogCancel
                                    onClick={() => rejectCheckInReq()}
                                    className="flex-1 items-center justify-center gap-2 rounded-sm border border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 px-4 py-6 text-sm font-medium shadow-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md"
                                >
                                    <IoClose />
                                    Decline
                                </AlertDialogCancel>

                                <AlertDialogAction
                                    ref={authorizeBtnRef}
                                    onClick={() => acceptCheckInReq()}
                                    className="flex-1 items-center justify-center gap-2 rounded-sm bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-6 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                                >
                                    <FaCheck />
                                    Authorize
                                </AlertDialogAction>
                            </div>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default SmartAttendanceDashboard;
