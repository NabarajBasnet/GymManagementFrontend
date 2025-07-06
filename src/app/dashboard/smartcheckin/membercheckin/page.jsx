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
    AlertDialogTrigger,
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
const socket = io.connect('http://localhost:5000');

const SmartAttendanceDashboard = () => {
    const { user: loggedInUser } = useUser();
    const user = loggedInUser?.user;

    // States
    const [openMemberCheckInAlert, setMemberCheckInAlert] = useState(false);
    const [memberName, setMemberName] = useState('')
    const [memberId, setMemberId] = useState('')

    const features = user?.tenant?.subscription?.subscriptionFeatures
    const multiBranchSupport = features?.find((feature) => {
        return feature.toString() === 'Multi Branch Support'
    })
    const onFreeTrail = user?.tenant?.freeTrailStatus === 'Active';

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
            const orgOrBranchId = (multiBranchSupport || onFreeTrail) ? user?.organizationBranch?._id : user?.organization?._id
            socket.emit('start-member-checkin-session', { orgOrBranchId })
            toast.success('Member checkin session started at room id: ', orgOrBranchId);

        } catch (error) {
            console.log('Error: ', error.message)
            toast.error(error.message);
        };
    };

    const [sessionActive, setSessionActive] = useState(false)

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
                        disabled={user?.organizationBranch?.memberAttendanceAvailable}
                        className="flex-1 py-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-sm transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                    >
                        <Play className="h-4 w-4 mr-2" />
                        {sessionActive ? "Session Running" : "Start Session"}
                    </Button>
                    <Button
                        onClick={enableMemberCheckInFlag}
                        disabled={!user?.organizationBranch?.memberAttendanceAvailable}
                        className="flex-1 py-6 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold rounded-sm transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                    >
                        <Square className="h-4 w-4 mr-2" />
                        Stop Session
                    </Button>
                </div>

                <AlertDialog open={openMemberCheckInAlert}>
                    <AlertDialogContent className="max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
                        <AlertDialogHeader className="flex flex-col items-center text-center">
                            <div className="mb-4 rounded-full bg-blue-50 p-3">
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
                                    className="h-6 w-6 text-blue-600"
                                >
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                            <AlertDialogTitle className="text-xl font-semibold text-gray-900">
                                Member Check-In Request
                            </AlertDialogTitle>
                            <AlertDialogDescription className="mt-2 text-gray-600">
                                {memberName || 'A member'} is requesting to check in. Would you like to approve this request?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-6 flex flex-row justify-end gap-3">
                            <AlertDialogCancel
                                onClick={() => setMemberCheckInAlert(false)}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                Approve Check-In
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}

export default SmartAttendanceDashboard;
