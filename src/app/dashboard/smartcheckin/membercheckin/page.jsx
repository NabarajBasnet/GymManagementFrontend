'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import Pagination from '@/components/ui/CustomPagination';
import { QrCode, RefreshCw, Search, User, Calendar, Timer, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { LuUsers } from "react-icons/lu";
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
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import io from 'socket.io-client';
const socket = io('http://localhost:5000', {
    transports: ['websocket'],
});

const SmartAttendanceDashboard = () => {
    const { user: loggedInUser } = useUser();
    const user = loggedInUser?.user;
    const features = user?.tenant?.subscription?.subscriptionFeatures
    const multiBranchSupport = features?.find((feature) => {
        return feature.toString() === 'Multi Branch Support'
    })
    const onFreeTrail = user?.tenant?.freeTrailStatus === 'Active';

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
            console.log("Request message: ", data);
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

    return (
        <div className="w-full min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:pt-8">
            <div className="w-full mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                            <Activity className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Socket Check In System
                        </h1>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">
                        Track member check-ins using socket and geo based availability
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className='p-6 border-none shadow-xl dark:bg-gray-800/30'>
                        <div className="flex gap-3">
                            <Button
                                onClick={enableMemberCheckInFlag}
                                disabled={sessionActive}
                                className="flex-1 py-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-sm transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                            >
                                <Play className="h-4 w-4 mr-2" />
                                {sessionActive ? "Session Running" : "Start Session"}
                            </Button>
                            <Button
                                onClick={disableCheckInSession}
                                disabled={!sessionActive}
                                className="flex-1 py-6 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold rounded-sm transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                            >
                                <Square className="h-4 w-4 mr-2" />
                                Stop Session
                            </Button>
                        </div>
                    </Card>

                    <Card className='dark:bg-gray-800 border-none shadow-xl p-6'>
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
                                            Name
                                        </div>
                                    </div>
                                    <div className="dark:text-gray-200">
                                        <Label className="text-xs text-gray-600 block mb-1 dark:text-gray-200">Category</Label>
                                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-sm px-3 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">
                                            {'Type'}
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
                                            value={'validationResult?.member?.membershipOption' || "—"}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs text-gray-600 block mb-1 dark:text-gray-200">Start Date</Label>
                                        <Input
                                            className="bg-white dark:bg-gray-800 py-6 rounded-sm dark:text-gray-200 dark:border-gray-600"
                                            value={'Date'}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs text-gray-600 block mb-1 dark:text-gray-200">Expire Date</Label>
                                        <Input
                                            className="bg-white dark:bg-gray-800 py-6 rounded-sm dark:text-gray-200 dark:border-gray-600"
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
                                    <div className={`flex items-start`}>
                                        <div className="flex-shrink-0 mt-0.5">
                                            <h1>Hi</h1>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium">
                                                {"No message available"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center py-4 text-center text-gray-500">
                                        <QrCode className="h-8 w-8 mb-2 opacity-50" />
                                        <p className="text-sm dark:text-gray-200">Scan a membership QR code to display information</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="my-6">
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
                            ) : temporaryMemberAttendanceHistory?.temporarymemberattendancehistory.length > 0 ? (
                                <div className="overflow-hidden border border-gray-200 rounded-lg dark:border-gray-700">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50 dark:bg-gray-900 dark:border-none">
                                                <TableHead className="font-medium text-xs uppercase tracking-wider text-slate-600 dark:text-gray-300 py-3">Member</TableHead>
                                                <TableHead className="font-medium text-xs uppercase tracking-wider text-slate-600 dark:text-gray-300 py-3">Membership</TableHead>
                                                <TableHead className="font-medium text-xs uppercase tracking-wider text-slate-600 dark:text-gray-300 py-3">Check-in</TableHead>
                                                <TableHead className="font-medium text-xs uppercase tracking-wider text-slate-600 dark:text-gray-300 py-3">Expiration</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {temporaryMemberAttendanceHistory.temporarymemberattendancehistory.map((attendance) => (
                                                <TableRow key={attendance._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 overflow-x-auto transition-colors border-t border-gray-200 dark:border-gray-600">
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

                <AlertDialog open={openMemberCheckInAlert} className="rounded-2xl">
                    <AlertDialogContent className="rounded-2xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-0 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)] backdrop-blur-sm overflow-hidden">
                        <div className="relative">
                            <AlertDialogHeader className="px-8 pt-6 pb-4">
                                <div className="mb-4 flex justify-center">
                                    <div className="relative">
                                        <div className="absolute -inset-3 rounded-full bg-blue-100/50 dark:bg-blue-900/30 blur-sm" />
                                        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="h-6 w-6 text-white"
                                            >
                                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
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
                                    onClick={() => setMemberCheckInAlert(false)}
                                    className="flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 px-4 py-3 text-sm font-medium shadow-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
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
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                    Decline
                                </AlertDialogCancel>

                                <AlertDialogAction
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
    )
}

export default SmartAttendanceDashboard;
