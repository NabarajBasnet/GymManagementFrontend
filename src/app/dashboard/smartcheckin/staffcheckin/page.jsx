'use client';

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
import { MdLocationPin } from "react-icons/md";
import { IoIosWifi } from "react-icons/io";
import Loader from '@/components/Loader/Loader';
import { useQuery } from '@tanstack/react-query';
import Pagination from '@/components/ui/CustomPagination';
import { Activity, Search, User, Calendar, Timer, CheckCircle, X, QrCode, RefreshCw } from 'lucide-react';
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
import { useUser } from "@/components/Providers/LoggedInUserProvider";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
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

const SmartStaffCheckin = () => {
    const { user: loggedInUser } = useUser();
    const user = loggedInUser?.user;
    const features = user?.tenant?.subscription?.subscriptionFeatures;
    const multiBranchSupport = features?.some(feature => feature.toString() === 'Multi Branch Support');
    const onFreeTrail = user?.tenant?.freeTrailStatus === 'Active';
    const orgOrBranchId = (onFreeTrail || multiBranchSupport) ? user?.organizationBranch?._id : user?.organization?._id;

    // States
    const [sessionActive, setSessionActive] = useState(false);
    const [staffName, setStaffName] = useState('');
    const [staffId, setStaffId] = useState('');
    const [currentLat, setCurrentLat] = useState(null);
    const [currentLng, setCurrentLng] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [locationPermission, setLocationPermissionState] = useState('');
    const [confirmCheckInState, setConfirmCheckInState] = useState(false);
    const [confirmCheckOutState, setConfirmCheckOutState] = useState(false);

    const limit = 6;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            navigator.permissions?.query?.({ name: 'geolocation' })
                .then((permissionStatus) => {
                    setLocationPermissionState(permissionStatus.state);
                    permissionStatus.onchange = () => {
                        setLocationPermissionState(permissionStatus.state);
                    };
                })
                .catch(console.error);
        }
    }, []);

    useEffect(() => {
        if (!orgOrBranchId) return;

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
                        headers: { 'Content-Type': "application/json" },
                        body: JSON.stringify({ iv: data.split('-')[1], currentTime })
                    });

                    const responseData = await response.json();
                    responseData.checkedIn ? setConfirmCheckOutState(true) : setConfirmCheckInState(true);
                }
            }
        };

        socket.on('staff-request-checkin', handleRequestCheckin);
        return () => socket.off('staff-request-checkin', handleRequestCheckin);
    }, [orgOrBranchId]);

    const checkInStaff = async () => {
        try {
            const currentDateTime = new Date();
            const response = await fetch(`http://localhost:3000/api/validate-staff`, {
                method: "POST",
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify({ iv: staffId, tv: currentDateTime })
            });

            const responseStatus = response.status;
            const responseBody = await response.json();

            if (response.status === 201 && responseBody.type === 'QrExpired') {
                toast.error(responseBody.message);
                socket.emit('staff-checkin-req-unsuccessful', {
                    status: responseStatus,
                    id: orgOrBranchId,
                    message: responseBody.message
                });
                return;
            }

            if (response.ok && responseBody.type !== 'CheckedIn') {
                setConfirmCheckInState(false);
                socket.emit('staff-checkin-req-successful', {
                    status: responseStatus,
                    id: orgOrBranchId,
                    message: responseBody.message
                });
                toast.success(responseBody.message);
                window.location.reload();
            } else {
                toast.error(responseBody.message);
                socket.emit('staff-checkin-req-unsuccessful', {
                    status: responseStatus,
                    id: orgOrBranchId,
                    message: responseBody.message
                });
            }
        } catch (error) {
            console.error("Error:", error);
            socket.emit('staff-checkin-req-unsuccessful', {
                status: 500,
                id: orgOrBranchId,
                message: error.message
            });
        }
    };

    const checkoutStaff = async () => {
        const currentDateTime = new Date();
        try {
            const response = await fetch(`http://localhost:3000/api/validate-staff/checkout`, {
                method: "POST",
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify({ iv: staffId, tv: currentDateTime })
            });

            const responseStatus = response.status;
            const responseBody = await response.json();

            if (!response.ok) {
                socket.emit('staff-checkout-req-unsuccessful', {
                    status: responseStatus,
                    id: orgOrBranchId,
                    message: responseBody.message
                });
                throw new Error(responseBody.message || "Checkout failed");
            }

            if (responseBody.success) {
                socket.emit('staff-checkout-req-successful', {
                    status: responseStatus,
                    id: orgOrBranchId,
                    message: responseBody.message
                });
                setConfirmCheckOutState(false);
                toast.success(responseBody.message);
                setTimeout(() => window.location.reload(), 1000);
            } else {
                socket.emit('staff-checkout-req-unsuccessful', {
                    status: responseStatus,
                    id: orgOrBranchId,
                    message: responseBody.message
                });
                toast.error(responseBody.message);
            }
        } catch (error) {
            console.error("Error:", error);
            socket.emit('staff-checkout-req-unsuccessful', {
                status: 500,
                id: orgOrBranchId,
                message: error.message
            });
            toast.error("Failed to checkout staff. Please try again.");
        }
    };

    const rejectCheckInReq = () => {
        setConfirmCheckInState(false);
        socket.emit('staff-checkin-req-declined', { orgOrBranchId });
    };

    const handleCancelCheckOut = () => {
        setConfirmCheckOutState(false);
        socket.emit('staff-checkout-req-declined', { orgOrBranchId });
    };

    const startStaffCheckInSession = async () => {
        try {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLat(position.coords.latitude);
                    setCurrentLng(position.coords.longitude);
                    setSessionActive(true);
                    socket.emit('start-staff-checkin-session', { orgOrBranchId });
                },
                (error) => {
                    console.error("Location error:", error);
                    toast.error("Location permission denied or error occurred");
                },
                { enableHighAccuracy: true }
            );
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        startStaffCheckInSession();
    }, [orgOrBranchId]);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const getTemporaryAttendanceHistory = async ({ queryKey }) => {
        const [, page, searchQuery] = queryKey;
        try {
            const response = await fetch(
                `http://localhost:3000/api/staff-attendance-history/todays?page=${page}&limit=${limit}&searchQuery=${searchQuery}`
            );
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message);
            return { temporaryStaffAttendanceHistories: [], todaysTotalStaffAttendance: 0, totalPages: 0 };
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ['temporaryMemberAttendanceHistory', currentPage, debouncedSearchQuery],
        queryFn: getTemporaryAttendanceHistory,
    });

    const { temporaryStaffAttendanceHistories = [], todaysTotalStaffAttendance = 0, totalPages = 0 } = data || {};

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full mx-auto space-y-6">

                {/* Check-in/out Dialogs */}
                <AlertDialog open={confirmCheckInState} onOpenChange={setConfirmCheckInState}>
                    <AlertDialogContent className="max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <AlertDialogHeader>
                            {/* Header with gradient background */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 px-6 py-5 border-b border-gray-100 dark:border-gray-600">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                                        <QrCode className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <AlertDialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Confirm Check-In Request
                                        </AlertDialogTitle>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                            From {staffName || "staff"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Content area */}
                            <div className="px-6 py-6">
                                <AlertDialogDescription className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                                    Are you sure you want to continue with the check-in process?
                                </AlertDialogDescription>

                                {/* Visual confirmation indicator */}
                                <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                                            Ready to check in
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 gap-3">
                            <AlertDialogCancel
                                onClick={rejectCheckInReq}
                                className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 dark:border-gray-600 font-medium py-2.5 px-4 rounded-lg transition-colors"
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={checkInStaff}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm"
                            >
                                Continue Check-In
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={confirmCheckOutState} onOpenChange={setConfirmCheckOutState}>
                    <AlertDialogContent className="max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <AlertDialogHeader>
                            {/* Header with gradient background */}
                            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-700 px-6 py-5 border-b border-gray-100 dark:border-gray-600">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                                        <QrCode className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div>
                                        <AlertDialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Confirm Check-Out
                                        </AlertDialogTitle>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                            End session for {staffName || 'Staff'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Content area */}
                            <div className="px-6 py-6">
                                <AlertDialogDescription className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                                    {staffName || 'Staff'} is currently checked in. Do you want to proceed with checkout?
                                </AlertDialogDescription>

                                {/* Visual status indicator */}
                                <div className="mt-6 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                                        <span className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                                            Currently checked in
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 gap-3">
                            <AlertDialogCancel
                                onClick={handleCancelCheckOut}
                                className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 dark:border-gray-600 font-medium py-2.5 px-4 rounded-lg transition-colors"
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={checkoutStaff}
                                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm"
                            >
                                Continue Check-Out
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Header Section */}
                <Card className="w-full border border-gray-200 dark:border-none dark:bg-gray-950 shadow-sm mt-2 md:mt-6">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                                    <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-semibold">Staff Attendance System</h1>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Real-time staff check-ins with geolocation validation
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${sessionActive
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                                    <div className={`w-2 h-2 rounded-full ${sessionActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                                    {sessionActive ? 'Session Active' : 'Session Inactive'}
                                </div>
                                <Button variant="outline" size="sm" className='dark:bg-gray-900 rounded-sm py-5 dark:border-none' onClick={() => window.location.reload()}>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Refresh
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Dashboard Cards */}
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Location Card */}
                    <Card className="border border-gray-200 dark:border-none dark:bg-gray-950">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                                    <IoLocationOutline className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="font-medium">Current Location</h3>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Latitude:</span>
                                    <span className="font-mono">
                                        {currentLat ? currentLat.toFixed(6) : "--"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Longitude:</span>
                                    <span className="font-mono">
                                        {currentLng ? currentLng.toFixed(6) : "--"}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Range Card */}
                    <Card className="border border-gray-200 dark:border-none dark:bg-gray-950">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                                    <IoIosWifi className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="font-medium">Detection Range</h3>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">50m</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">radius</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Permission Card */}
                    <Card className="border border-gray-200 dark:border-none dark:bg-gray-950">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                                    <MdLocationPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="font-medium">Location Permission</h3>
                            </div>
                            <div>
                                <div className={`text-sm font-medium ${locationPermission === 'granted' ? 'text-green-600 dark:text-green-400' :
                                    locationPermission === 'denied' ? 'text-red-600 dark:text-red-400' :
                                        'text-amber-600 dark:text-amber-400'
                                    }`}>
                                    {locationPermission === 'granted' && 'Enabled'}
                                    {locationPermission === 'prompt' && 'Pending'}
                                    {locationPermission === 'denied' && 'Disabled'}
                                </div>
                                {locationPermission === 'denied' && (
                                    <p className="text-xs text-red-500 mt-1">
                                        Location access is blocked. Enable in browser settings.
                                    </p>
                                )}
                                {locationPermission === 'prompt' && (
                                    <button
                                        className="text-xs text-blue-600 dark:text-blue-400 underline mt-1"
                                        onClick={() => navigator.geolocation.getCurrentPosition(
                                            () => { },
                                            console.error
                                        )}
                                    >
                                        Click to allow location access
                                    </button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Attendance History */}
                <Card className="border border-gray-200 dark:border-none dark:bg-gray-950">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Attendance History</h2>
                                    <p className="text-gray-600 dark:text-gray-400">Track staff check-ins and activity</p>
                                </div>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full text-sm">
                                {todaysTotalStaffAttendance} total records
                            </div>
                        </div>

                        {/* Search */}
                        <div className="mb-6">
                            <Label htmlFor="search" className="mb-2 block">Search Records</Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <Input
                                    id="search"
                                    placeholder="Search by staff name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 dark:border-none rounded-sm bg-white dark:bg-gray-900"
                                />
                            </div>
                        </div>

                        {/* Table */}
                        {isLoading ? (
                            <Loader />
                        ) : temporaryStaffAttendanceHistories.length > 0 ? (
                            <div className="border dark:border-none rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-gray-100 dark:bg-gray-800">
                                        <TableRow>
                                            <TableHead>Staff ID</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Check In</TableHead>
                                            <TableHead>Check Out</TableHead>
                                            <TableHead>Remark</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {temporaryStaffAttendanceHistories.map((attendance) => (
                                            <TableRow key={attendance._id}>
                                                <TableCell className="font-medium text-sm">{attendance.staff?._id}</TableCell>
                                                <TableCell>{attendance.staff?.fullName}</TableCell>
                                                <TableCell>{attendance.role}</TableCell>
                                                <TableCell>
                                                    {attendance.checkIn ? new Date(attendance.checkIn).toLocaleTimeString() : 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    {attendance.checkOut ? new Date(attendance.checkOut).toLocaleTimeString() : 'N/A'}
                                                </TableCell>
                                                <TableCell>{attendance.remark}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                    <Search className="w-6 h-6 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium mb-2">No attendance records found</h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {debouncedSearchQuery
                                        ? "No records match your search"
                                        : "Records will appear here once staff start checking in"}
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-6">
                                <Pagination
                                    total={totalPages}
                                    page={currentPage}
                                    onChange={setCurrentPage}
                                    className="justify-center"
                                />
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SmartStaffCheckin;
