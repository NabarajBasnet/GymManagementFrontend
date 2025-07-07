'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Activity,
    Play,
    Square,
} from "lucide-react"
import { useUser } from "@/components/Providers/LoggedInUserProvider";
import { toast } from "sonner";
import io from 'socket.io-client'
const socket = io('https://fitbinary.com', {
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

    return (
        <div className="w-full min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-6">
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
