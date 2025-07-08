'use client';

import { IoIosWifi } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";
import { PiChartLineUpBold } from "react-icons/pi";
import Loader from '@/components/Loader/Loader';
import { useQuery } from '@tanstack/react-query';
import Pagination from '@/components/ui/CustomPagination';
import { QrCode, Search, User, Calendar, Timer } from 'lucide-react';
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
import { useEffect, useState } from "react";
import {
    Activity,
    Play,
    Square,
    UserCircle2Icon
} from "lucide-react";
import { useUser } from "@/components/Providers/LoggedInUserProvider";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
    transports: ['websocket'], // or ['websocket', 'polling']
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
    const multiBranchSupport = features?.find((feature) => {
        return feature.toString() === 'Multi Branch Support'
    });
    const onFreeTrail = user?.tenant?.freeTrailStatus === 'Active';
    const orgOrBranchId = (onFreeTrail || multiBranchSupport) ? user?.organizationBranch?._id : user?.organization?._id;

    // States
    const [sessionActive, setSessionActive] = useState(false)
    const [openMemberCheckInAlert, setMemberCheckInAlert] = useState(false);
    const [memberName, setMemberName] = useState('')
    const [memberId, setMemberId] = useState('')
    const [currentLat, setCurrentLat] = useState(null);
    const [currentLng, setCurrentLng] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const limit = 6;
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

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

            if (responseBody.type === 'DayShiftAlert' && response.status === 403) {
                toast.error(responseBody.message);
                const message = {
                    message: responseBody.message,
                    status: response.status
                };
                socket.emit('check-in-req-error', { message })
            }

            if (response.status === 200) {
                toast.success(responseBody.message);
                const message = {
                    message: responseBody.message,
                    status: response.status
                };
                socket.emit('check-in-req-successful', { message })
            };

            if (response.status === 403 && responseBody.member?.status === 'OnHold') {
                setMembershipHoldToggle(true);
                const message = {
                    message: responseBody.message,
                    status: response.status
                };
                socket.emit('check-in-req-error', { message })
                toast.error(responseBody.message);
            }

            if (response.status !== 403 && response.status !== 200) {
                toast.error(responseBody.message);
                const message = {
                    message: responseBody.message,
                    status: response.status
                };
                socket.emit('check-in-req-error', { message })
            }
            return response;
        } catch (error) {
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
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setCurrentLat(lat);
                    setCurrentLng(lng);
                },
                (error) => {
                    console.error("Failed to get location:", error.message);
                },
                { enableHighAccuracy: true }
            );

            setSessionActive(true);
            const orgOrBranchId = (multiBranchSupport || onFreeTrail) ? user?.organizationBranch?._id : user?.organization?._id
            socket.emit('start-member-checkin-session', { orgOrBranchId })
            toast.success('Member Check In Session Started');

            if (multiBranchSupport || onFreeTrail) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizationbranch/toggle-membercheckin-flag?status=${true}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ currentLat, currentLng })
                });
            } else {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organization/toggle-member-checkin?status=${true}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ currentLat, currentLng })
                });
            };

        } catch (error) {
            console.log('Error: ', error.message)
            toast.error(error.message);
        };
    };

    const disableCheckInSession = async () => {
        toast.success('Member Check In Session Closed');
        setSessionActive(false);
        const orgOrBranchId = (multiBranchSupport || onFreeTrail) ? user?.organizationBranch?._id : user?.organization?._id
        socket.emit('close-member-checkin-session', { orgOrBranchId })
        try {
            if (multiBranchSupport || onFreeTrail) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizationbranch/toggle-membercheckin-flag?status=${false}`, {
                    method: "PUT",
                });
            } else {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organization/toggle-member-checkin?status=${false}`, {
                    method: "PUT",
                });
            };
        } catch (error) {
            console.log("Error: ", error);
        }
    }

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

    const { data: temporaryMemberAttendanceHistory, isLoading: isAttendanceHistory } = useQuery({
        queryKey: ['temporaryMemberAttendanceHistory', currentPage, debouncedSearchQuery],
        queryFn: getTemporaryAttendanceHistory,
    });

    const { totalPages, totalAttendance } = temporaryMemberAttendanceHistory || {};

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
            <div className="w-full mx-auto">
                {/* Modern Header with Glassmorphism Effect */}
                <div className="relative mb-6 overflow-hidden">
                    <div className="mt-6 relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                                <div className="relative">
                                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-20"></div>
                                    <div className="relative p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl">
                                        <Activity className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-white dark:via-blue-400 dark:to-indigo-400">
                                        Member Attendance
                                    </h1>
                                    <p className="text-slate-600 dark:text-slate-300 font-medium mt-2">
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Session Control Panel */}
                    <div className="space-y-6">
                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl rounded-xl overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                        <PiChartLineUpBold className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Session Control Center</h2>
                                        <p className="text-blue-100 mt-1">Manage member check-in sessions</p>
                                    </div>
                                </div>
                            </div>

                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 gap-4 mb-6">
                                    <Button
                                        onClick={enableMemberCheckInFlag}
                                        disabled={sessionActive}
                                        className="group relative h-16 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-center space-x-3">
                                            <Play className="h-5 w-5" />
                                            <span>{sessionActive ? "Session Running" : "Start Session"}</span>
                                        </div>
                                        {sessionActive && (
                                            <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                        )}
                                    </Button>

                                    <Button
                                        onClick={disableCheckInSession}
                                        disabled={!sessionActive}
                                        className="group relative h-16 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center justify-center space-x-3">
                                            <Square className="h-5 w-5" />
                                            <span>Stop Session</span>
                                        </div>
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 gap-2">
                                    {/* Current Location Card */}
                                    <div className="relative group">
                                        <div className="relative bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                                                    <IoLocationOutline className="h-5 w-5 text-white" />
                                                </div>
                                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                                                    Current Location
                                                </h3>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">Latitude:</span>
                                                    <span className="text-xs font-mono text-slate-700 dark:text-slate-200">
                                                        {currentLat ? currentLat.toFixed(6) : "--"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">Longitude:</span>
                                                    <span className="text-xs font-mono text-slate-700 dark:text-slate-200">
                                                        {currentLng ? currentLng.toFixed(6) : "--"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detection Range Card */}
                                    <div className="relative group">
                                        <div className="relative bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg">
                                                    <IoIosWifi className="h-5 w-5 text-white" />
                                                </div>
                                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                                                    Detection Range
                                                </h3>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">50</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">meters</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <div className="relative bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg">
                                                    <IoIosWifi className="h-5 w-5 text-white" />
                                                </div>
                                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                                                    Detection Range
                                                </h3>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">50</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">meters</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Member Information Panel */}
                    <div className="">
                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl rounded-xl overflow-hidden h-fit">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                        <User className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Member Information</h2>
                                        <p className="text-indigo-100 mt-1">Real-time member details</p>
                                    </div>
                                </div>
                            </div>

                            <CardContent className="p-6 space-y-6">
                                {/* Personal Details */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Personal Details
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Full Name</Label>
                                            <div className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                                                Name
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Category</Label>
                                            <div className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                                                Type
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Membership Details */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Membership Details
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Membership Option</Label>
                                            <Input
                                                className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-lg h-12 dark:text-slate-200"
                                                value={'validationResult?.member?.membershipOption' || "—"}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Start Date</Label>
                                                <Input
                                                    className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-lg h-12 dark:text-slate-200"
                                                    value={'Date'}
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Expire Date</Label>
                                                <Input
                                                    className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-lg h-12 dark:text-slate-200"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* QR Code Scanner Area */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                        Attendance Message
                                    </h3>
                                    <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 border border-slate-200 dark:border-slate-600">
                                        <div className="flex flex-col items-center justify-center text-center space-y-4">
                                            <div className="relative">
                                                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur opacity-20"></div>
                                                <div className="relative p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
                                                    <QrCode className="h-8 w-8 text-white" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                                                    Ready to Scan
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    Scan a membership QR code to display information
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Attendance History */}
                <div className="mt-6">
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl rounded-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                        <Calendar className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Attendance History</h2>
                                        <p className="text-slate-200 mt-1">Track member check-ins and activity</p>
                                    </div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                                    <span className="text-sm font-medium text-white">
                                        {totalAttendance || 0} total records
                                    </span>
                                </div>
                            </div>
                        </div>

                        <CardContent className="p-6">
                            {/* Enhanced Search */}
                            <div className="mb-6">
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
                                        className="pl-12 pr-4 py-6 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Attendance Records */}
                            {isAttendanceHistory ? (
                                <Loader />
                            ) : temporaryMemberAttendanceHistory?.temporarymemberattendancehistory?.length > 0 ? (
                                <div className="space-y-3">
                                    {temporaryMemberAttendanceHistory.temporarymemberattendancehistory.map((attendance, index) => (
                                        <div
                                            key={attendance._id}
                                            className="group relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="relative">
                                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur opacity-20"></div>
                                                        <div className="relative w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                                            <span className="text-white font-bold text-sm">
                                                                {attendance.fullName?.charAt(0) || 'M'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                                                            {attendance.fullName}
                                                        </h3>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">
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
                                    className="flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 px-4 py-3 text-sm font-medium shadow-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                    Decline
                                </AlertDialogCancel>

                                <AlertDialogAction
                                    onClick={() => acceptCheckInReq()}
                                    className="flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
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