'use client';

import { motion } from 'framer-motion';
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
import { IoLocationOutline } from "react-icons/io5";
import { MdLocationPin, MdClose } from "react-icons/md";
import { IoIosWifi } from "react-icons/io";
import { IoMdInformationCircleOutline } from "react-icons/io";
import Loader from '@/components/Loader/Loader';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Pagination from '@/components/ui/CustomPagination';
import { Activity, Search, User, Calendar, Timer, Info, AlertCircle, CheckCircle, X, QrCode, RefreshCw, Home } from 'lucide-react';
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

const socket = io('http://localhost:5000', {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
});

const SmartStaffCheckin = () => {
    const { user: loggedInUser } = useUser();
    const user = loggedInUser?.user;
    const features = user?.tenant?.subscription?.subscriptionFeatures
    const multiBranchSupport = features?.some(feature => feature.toString() === 'Multi Branch Support');
    const onFreeTrail = user?.tenant?.freeTrailStatus === 'Active';
    const orgOrBranchId = (onFreeTrail || multiBranchSupport) ? user?.organizationBranch?._id : user?.organization?._id;

    // States
    const [sessionActive, setSessionActive] = useState(false)
    const [openStaffCheckInAlert, setStaffCheckInAlert] = useState(false);
    const [staffName, setStaffName] = useState('');
    const [staffId, setStaffId] = useState('')
    const [currentLat, setCurrentLat] = useState(null);
    const [currentLng, setCurrentLng] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 6;
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [locationPermission, setLocationPermissionState] = useState('');
    const [confirmCheckInState, setConfirmCheckInState] = useState(false);
    const [confirmCheckOutState, setConfirmCheckOutState] = useState(false);

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

    // Organization join room on load
    useEffect(() => {
        if (!orgOrBranchId) {
            return;
        }
        const roomId = `gym-room-${orgOrBranchId}`;
        socket.emit("gym-join-room", { roomId });

        const handleRequestCheckin = async (data) => {
            if (data.split('-')[0] === 'staff_checkin_req') {
                setStaffName(data.split('-')[3]);
                setStaffId(data.split('-')[1]);
                const currentTime = new Date();
                if (data.split('-')[1].length >= 24 && currentTime) {
                    const response = await fetch(`http://localhost:3000/api/validate-staff/checkedin`, {
                        method: "POST",
                        headers: {
                            'Content-Type': "application/json"
                        },
                        body: JSON.stringify({ iv: data.split('-')[1], currentTime })
                    });

                    const responseData = await response.json();

                    if (responseData.checkedIn) {
                        setConfirmCheckOutState(true);
                    } else {
                        setConfirmCheckInState(true);
                    }
                }
            };
        };

        socket.on('staff-request-checkin', handleRequestCheckin);

        // Cleanup on unmount or re-render
        return () => {
            socket.off('staff-request-checkin', handleRequestCheckin);
        };
    }, [orgOrBranchId]);

    // Check in staff
    const checkInStaff = async () => {
        try {
            const currentDateTime = new Date();
            const response = await fetch(`http://localhost:3000/api/validate-staff`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({ iv: staffId, tv: currentDateTime })
            });

            const responseStatus = response.status;

            const responseBody = await response.json();
            if (response.status === 201 && responseBody.type === 'QrExpired') {
                toast.error(responseBody.message);
                const emitMessage = {
                    status: responseStatus,
                    id: orgOrBranchId,
                    message: responseBody.message
                }
                socket.emit('staff-checkin-req-unsuccessful', emitMessage);
                return;
            };

            if (response.ok && responseBody.type !== 'CheckedIn') {
                setConfirmCheckInState(false);
                const emitMessage = {
                    status: responseStatus,
                    id: orgOrBranchId,
                    message: responseBody.message
                }
                socket.emit('staff-checkin-req-successful', emitMessage);
                toast.success(responseBody.message);
                window.location.reload();
            } else {
                toast.error(responseBody.message);
                const emitMessage = {
                    status: responseStatus,
                    id: orgOrBranchId,
                    message: responseBody.message
                }
                socket.emit('staff-checkin-req-unsuccessful', emitMessage);
            }
        } catch (error) {
            console.log("Error: ", error);
            const emitMessage = {
                status: responseStatus,
                id: orgOrBranchId,
                message: error.message
            }
            socket.emit('staff-checkin-req-unsuccessful', emitMessage);
        };
    };

    // Check out staff
    const checkoutStaff = async () => {
        const currentDateTime = new Date();
        try {
            const response = await fetch(`http://localhost:3000/api/validate-staff/checkout`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ iv: staffId, tv: currentDateTime })
            });

            const responseStatus = response.status;
            const responseBody = await response.json();

            if (!response.ok) {
                const emitMessage = {
                    status: responseStatus,
                    id: orgOrBranchId,
                    message: responseBody.message
                }
                socket.emit('staff-checkout-req-unsuccessful', emitMessage);
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (responseBody.success) {
                const emitMessage = {
                    status: responseStatus,
                    id: orgOrBranchId,
                    message: responseBody.message
                }
                socket.emit('staff-checkout-req-successful', emitMessage);
                setConfirmCheckOutState(false);
                toast.success(responseBody.message);
                setTimeout(() => window.location.reload(), 1000);
            } else {
                const emitMessage = {
                    status: responseStatus,
                    id: orgOrBranchId,
                    message: responseBody.message
                }
                socket.emit('staff-checkout-req-unsuccessful', emitMessage);
                toast.error(responseBody.message || "Checkout failed");
            }
        } catch (error) {
            const emitMessage = {
                status: responseStatus,
                id: orgOrBranchId,
                message: error.message
            }
            socket.emit('staff-checkout-req-unsuccessful', emitMessage);
            console.log("Error: ", error)
            toast.error("Failed to checkout staff. Please try again.");
        }
    };

    const rejectCheckInReq = async () => {
        setConfirmCheckInState(false);
        socket.emit('staff-checkin-req-declined', { orgOrBranchId })
    };

    const startStaffCheckInSession = async () => {
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

                    socket.emit('start-staff-checkin-session', { orgOrBranchId });
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

    const handleCancelCheckOut = () => {
        setConfirmCheckOutState(false)
        socket.emit('staff-checkout-req-declined', { orgOrBranchId })
    }

    useEffect(() => {
        const run = async () => {
            await startStaffCheckInSession();
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
            const response = await fetch(`http://localhost:3000/api/staff-attendance-history/todays?page=${page}&limit=${limit}&searchQuery=${searchQuery}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Error: ', error);
            toast.error(error.message)
        };
    };

    const { data, isLoading } = useQuery({
        queryKey: ['temporaryMemberAttendanceHistory', currentPage, debouncedSearchQuery],
        queryFn: getTemporaryAttendanceHistory,
    });

    const { temporaryStaffAttendanceHistories,
        todaysTotalStaffAttendance,
        totalPages,
    } = data || {};

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
            <div className="w-full mx-auto">

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
                                    Confirm check-in request from {staffName || "staff"}?
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
                                    onClick={() => {
                                        rejectCheckInReq()
                                        setConfirmCheckInState(false)
                                    }}
                                    className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-4 py-2 rounded-lg"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg"
                                    onClick={() => {
                                        checkInStaff(staffId, new Date())
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
                                {staffName || 'Staff'} have already checkedin, Do you want to checkout?
                            </p>

                            <div className="flex justify-end space-x-3 mt-4">
                                <Button
                                    onClick={() => handleCancelCheckOut()}
                                    className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-4 py-2 rounded-lg"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg"
                                    onClick={() => checkoutStaff(staffId, new Date())}
                                >
                                    Continue
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Modern Header with Glassmorphism Effect */}
                <div className="relative mb-4 overflow-hidden">
                    <div className="mt-6 relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-20"></div>
                                    <div className="relative p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl">
                                        <Activity className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-white dark:via-blue-400 dark:to-indigo-400">
                                        Staff Attendance
                                    </h1>
                                    <p className="text-slate-600 dark:text-slate-300 font-medium mt-2">
                                        Real-time staff check-ins with geolocation validation
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

                {/* Cards */}
                <div className="grid grid-cols-1 my-4 gap-4">
                    {/* Session Control Panel */}
                    <div className="space-y-4">
                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl rounded-xl overflow-hidden">
                            <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 p-3">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                        <PiChartLineUpBold className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Session Control Center</h2>
                                        <p className="text-blue-100 mt-1">Manage staff check-in sessions</p>
                                    </div>
                                </div>
                                <div>
                                    <Button onClick={() => window.location.reload()}>
                                        <TbReload />
                                        Reload
                                    </Button>
                                </div>
                            </div>

                            <CardContent className="p-3">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Current Location Card */}
                                    <div className="flex flex-col h-full">
                                        <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl p-4 shadow-lg flex flex-col h-full">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                                                    <IoLocationOutline className="h-5 w-5 text-white" />
                                                </div>
                                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                                                    Current Location
                                                </h3>
                                            </div>
                                            <div className="space-y-2 flex-1 flex flex-col justify-between">
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
                                    </div>

                                    {/* Detection Range Card */}
                                    <div className="flex flex-col h-full">
                                        <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl p-4 shadow-lg flex flex-col h-full">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                                                    <IoIosWifi className="h-5 w-5 text-white" />
                                                </div>
                                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                                                    Detection Range
                                                </h3>
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div className="text-center">
                                                    <div className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">50</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">meters radius</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location Permission Card */}
                                    <div className="flex flex-col h-full">
                                        <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl p-4 shadow-lg flex flex-col h-full">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                                                    <MdLocationPin className="h-5 w-5 text-white" />
                                                </div>
                                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                                                    Location Permission
                                                </h3>
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div className="text-center">
                                                    <div className={`text-3xl font-bold ${locationPermission === 'granted' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                                                        locationPermission === 'denied' ? 'bg-gradient-to-r from-rose-500 to-red-500' :
                                                            'bg-gradient-to-r from-amber-500 to-yellow-500'
                                                        } bg-clip-text text-transparent`}>
                                                        {locationPermission === 'granted' && 'Enabled'}
                                                        {locationPermission === 'prompt' && 'Pending'}
                                                        {locationPermission === 'denied' && 'Disabled'}
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    {locationPermission === 'denied' && (
                                                        <p className="text-xs text-red-500 text-center">
                                                            Location access is blocked. Please enable it in your browser settings.
                                                        </p>
                                                    )}
                                                    {locationPermission === 'prompt' && (
                                                        <button
                                                            className="text-xs text-blue-600 dark:text-blue-400 underline w-full text-center block"
                                                            onClick={() => {
                                                                navigator.geolocation.getCurrentPosition(
                                                                    (pos) => console.log("Got location:", pos),
                                                                    (err) => console.error("Location error:", err)
                                                                );
                                                            }}
                                                        >
                                                            Click here to allow location access
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Attendance History */}
                <div>
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl rounded-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-sky-500 p-3">
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
                                        {todaysTotalStaffAttendance || 0} total records
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
                                        placeholder="Search by staff name..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-12 pr-4 py-6 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Attendance Records */}
                            {isLoading ? (
                                <Loader />
                            ) : temporaryStaffAttendanceHistories?.length > 0 ? (
                                <div className="space-y-3">
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
                                            {Array.isArray(temporaryStaffAttendanceHistories) && temporaryStaffAttendanceHistories?.length > 0 ? (
                                                temporaryStaffAttendanceHistories?.map((attendance) => (
                                                    <TableRow key={attendance?._id}>
                                                        <TableCell className="font-medium text-xs dark:text-gray-200">{attendance?.staff?._id}</TableCell>
                                                        <TableCell className="text-sm dark:text-gray-200">{attendance?.staff?.fullName}</TableCell>
                                                        <TableCell className="text-sm dark:text-gray-200">{attendance?.role}</TableCell>
                                                        <TableCell className="text-sm dark:text-gray-200">
                                                            {attendance?.checkIn ? new Date(attendance?.checkIn).toLocaleTimeString() : 'N/A'}
                                                        </TableCell>
                                                        <TableCell className="text-sm dark:text-gray-200">
                                                            {attendance?.checkOut ? new Date(attendance?.checkOut).toLocaleTimeString() : 'N/A'}
                                                        </TableCell>
                                                        <TableCell className="text-sm dark:text-gray-200">{attendance?.remark}</TableCell>
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
                                                <TableCell className="text-right dark:text-gray-200">{todaysTotalStaffAttendance || 0}</TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
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
        </div>
    );
};

export default SmartStaffCheckin;
