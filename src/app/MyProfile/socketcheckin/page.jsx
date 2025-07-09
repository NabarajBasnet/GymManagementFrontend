"use client";

import { BiLoaderCircle } from "react-icons/bi";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import { PiHandTapBold } from "react-icons/pi";
import {
    Clock,
    MapPin,
    CheckCircle,
    User,
    Phone,
    Mail,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MdClose } from "react-icons/md";
import { io } from 'socket.io-client';
import { useStaff } from "@/components/Providers/LoggedInStaffProvider";

const socket = io('http://localhost:5000', {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
});

export default function CheckInCard() {
    const { staff } = useStaff();
    const loggedInStaff = staff?.loggedInStaff;
    const tenantFeatures = loggedInStaff?.tenant?.subscription?.subscriptionFeatures;
    const multiBranchSupport = tenantFeatures?.find((feature) => {
        return feature.toString() === 'Multi Branch Support'
    });
    const onFreeTrail = loggedInStaff?.tenant?.freeTrailStatus === 'Active';
    const orgOrBranchId = (multiBranchSupport || onFreeTrail)
        ? loggedInStaff?.organizationBranch?._id
        : loggedInStaff?.organization?._id;
    const [memberLat, setMemberLat] = useState(null);
    const [memberLng, setMemberLng] = useState(null);
    const [checkInRequested, setCheckInRequested] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [organizationLat, setOrganizationLat] = useState(null);
    const [organizationLng, setOrganizationLng] = useState(null);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString('en-GB');
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    useEffect(() => {
        if (!orgOrBranchId) {
            return;
        }
        const roomId = `staff-join-room-${orgOrBranchId}`;
        socket.emit('staff-join-room', { roomId })
    }, [orgOrBranchId]);

    useEffect(() => {
        const handleStaffCheckInSession = (incomingData) => {
            if (incomingData === orgOrBranchId) {
            }
        }
        socket.on('staff-checkin-session-started', handleStaffCheckInSession);
        return () => {
            socket.off('staff-checkin-session-started', handleStaffCheckInSession);
        }
    }, [orgOrBranchId]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        socket.emit('member-join-room', orgOrBranchId || '');
    }, [orgOrBranchId]);

    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        if (!orgOrBranchId) return;
        const handleDeclinedReq = (incomingId) => {
            if (incomingId.toString() === orgOrBranchId.toString()) {
                setCheckInRequested(false);
                if (Notification.permission === 'granted') {
                    toast.error("Request was rejected.");
                    new Notification('Request Rejected', {
                        body: 'Your check-in request was declined by the gym.'
                    });
                } else {
                    toast.error("Request was rejected.");
                }
            }
        }
        socket.on('staff-checkin-req-declined', handleDeclinedReq);
        return () => socket.off('staff-checkin-req-declined', handleDeclinedReq)
    }, [orgOrBranchId]);

    useEffect(() => {
        if ('geolocation' in navigator) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setMemberLat(latitude);
                    setMemberLng(longitude);
                },
                (error) => {
                    console.log('Geolocation error: ', error.message);
                    toast.error(error.message)
                }, {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 1000
            });
            return () => {
                navigator.geolocation.clearWatch(watchId);
            };
        } else {
            toast.error('Geolocation not supported');
        }
    }, []);

    const requestForCheckin = async () => {
        try {
            const orgOrBranchId = (multiBranchSupport || onFreeTrail) ? loggedInStaff?.organizationBranch?._id : loggedInStaff?.organization?._id;
            const roomId = `gym-room-${orgOrBranchId}`;
            const checkInReqMessage = `staff_checkin_req-${loggedInStaff?._id}-${orgOrBranchId}-${loggedInStaff?.fullName}`;
            socket.emit('staff_request_checkin', {
                roomId,
                message: checkInReqMessage
            });
            setCheckInRequested(true);
        } catch (error) {
            setCheckInRequested(false);
        }
    };

    useEffect(() => {
        const handleSuccessFulResponse = (data) => {
            const { status, id, message } = data;
            if (status === 200 && id.toString() === orgOrBranchId.toString()) {
                toast.success(message);
                setCheckInRequested(false);
            }
        };
        socket.on('staff-checkin-req-successful', handleSuccessFulResponse);
        return () => socket.off('staff-checkin-req-successful', handleSuccessFulResponse);
    }, [orgOrBranchId]);

    useEffect(() => {
        const handleErrorResponse = (data) => {
            const { status, id, message, } = data;
            if (status !== 200 && id.toString() === orgOrBranchId.toString()) {
                toast.error(message);
                setCheckInRequested(false);
            }
        };
        socket.on('staff-checkin-req-unsuccessful', handleErrorResponse);
        return () => socket.off('staff-checkin-req-unsuccessful', handleErrorResponse);
    }, [orgOrBranchId]);

    useEffect(() => {
        const handleSuccessFulResponse = (data) => {
            const { status, id, message } = data;
            if (status === 200 && id.toString() === orgOrBranchId.toString()) {
                toast.success(message);
                setCheckInRequested(false);
            }
        };
        socket.on('staff-checkout-req-successful', handleSuccessFulResponse);
        return () => socket.off('staff-checkout-req-successful', handleSuccessFulResponse);
    }, [orgOrBranchId]);

    useEffect(() => {
        const handleErrorResponse = (data) => {
            const { status, id, message, } = data;
            if (status !== 200 && id.toString() === orgOrBranchId.toString()) {
                toast.error(message);
                setCheckInRequested(false);
            }
        };
        socket.on('staff-checkout-req-unsuccessful', handleErrorResponse);
        return () => socket.off('staff-checkout-req-unsuccessful', handleErrorResponse);
    }, [orgOrBranchId]);

    useEffect(() => {
        const handleErrorResponse = (data) => {
            const { orgOrBranchId } = data;
            if (orgOrBranchId.toString() === orgOrBranchId.toString()) {
                toast.error('Your checkin request has been declined');
                setCheckInRequested(false);
            };
        };
        socket.on('staff-checkin-req-declined', handleErrorResponse);
        return () => socket.off('staff-checkin-req-declined', handleErrorResponse);
    }, [orgOrBranchId]);

    useEffect(() => {
        const handleErrorResponse = (data) => {
            const { orgOrBranchId } = data;
            if (orgOrBranchId.toString() === orgOrBranchId.toString()) {
                toast.error('Your checkout request has been declined');
                setCheckInRequested(false);
            };
        };
        socket.on('staff-checkout-req-declined', handleErrorResponse);
        return () => socket.off('staff-checkout-req-declined', handleErrorResponse);
    }, [orgOrBranchId]);

    useEffect(() => {
        if (loggedInStaff?.organizationBranch?.currentLat && loggedInStaff?.organizationBranch?.currentLng) {
            setOrganizationLat(loggedInStaff.organizationBranch.currentLat);
            setOrganizationLng(loggedInStaff.organizationBranch.currentLng);
        }
    }, [memberLat, memberLng, loggedInStaff]);

    const getDistanceFromLatLonInMeteer = (Lat1, Lon1, Lat2, Lon2) => {
        const R = 6371000;
        const dLat = deg2rad(Lat2 - Lat1);
        const dLon = deg2rad(Lon2 - Lon2);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(Lat1)) * Math.cos(deg2rad(Lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    const distance = organizationLat && organizationLng && memberLat && memberLng
        ? getDistanceFromLatLonInMeteer(organizationLat, organizationLng, memberLat, memberLng)
        : null;

    const radius = 50;
    let disableButton = distance >= radius;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Loading Dialog */}
                <AlertDialog open={checkInRequested}>
                    <AlertDialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg w-full max-w-md">
                        <AlertDialogHeader className="space-y-4">
                            <div className="flex items-center gap-3">
                                <BiLoaderCircle className="w-5 h-5 text-blue-600 animate-spin" />
                                <AlertDialogTitle className="flex-1 text-gray-900 dark:text-white font-medium">
                                    Sending Check-In/Out Request
                                </AlertDialogTitle>
                                <MdClose
                                    className="text-gray-400 hover:text-gray-500 cursor-pointer"
                                    onClick={() => setCheckInRequested(false)}
                                />
                            </div>
                            <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                                Your attendance check-in/out request has been sent. Please wait for the response.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="py-4 flex justify-center">
                            <div className="flex flex-col items-center space-y-2">
                                <BiLoaderCircle className="w-8 h-8 animate-spin text-blue-600" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">Awaiting response...</p>
                            </div>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Header Card */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center space-x-4 mb-4 md:mb-0">
                                <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                                    <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Check-In System</h1>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Welcome back, {loggedInStaff?.fullName || 'Team Member'}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm">Current Time</span>
                                </div>
                                <div className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                                    {formatTime(currentTime)}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDate(currentTime)}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Main Content */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Check-In Button Card */}
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="p-6 space-y-4">
                            <h2 className="text-center text-gray-700 dark:text-gray-300 font-medium">
                                Tap to request Check In/Out
                            </h2>
                            <div className="flex justify-center">
                                <Button
                                    onClick={requestForCheckin}
                                    disabled={disableButton}
                                    className={`w-full max-w-md py-8 rounded-lg text-base font-medium transition-colors ${disableButton
                                        ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                                        }`}
                                >
                                    <div className="flex flex-col items-center space-y-2">
                                        <PiHandTapBold className="w-8 h-8" />
                                        <span>
                                            {disableButton ? 'Too Far to Check-In/Out' : 'Request Check-In/Out'}
                                        </span>
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Profile Card */}
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="p-6 space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
                                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Profile</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Full Name</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {loggedInStaff?.fullName || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {loggedInStaff?.email || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Contact</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {loggedInStaff?.contactNo || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {loggedInStaff?.permanentAddress?.city || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
