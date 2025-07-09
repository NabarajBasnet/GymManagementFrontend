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
    Calendar,
    Timer,
    Building,
    CreditCard,
    Navigation,
    Wifi,
    WifiOff,
    AlertCircle,
    Users
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
    console.log(loggedInStaff);
    const tenantFeatures = loggedInStaff?.tenant?.subscription?.subscriptionFeatures;
    const multiBranchSupport = tenantFeatures?.find((feature) => {
        return feature.toString() === 'Multi Branch Support'
    });
    const onFreeTrail = loggedInStaff?.tenant?.freeTrailStatus === 'Active';
    const orgOrBranchId = (multiBranchSupport || onFreeTrail)
        ? loggedInStaff?.organizationBranch?._id
        : loggedInStaff?.organization?._id;
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const [checkInSuccess, setCheckInSuccess] = useState(false);
    const [memberLat, setMemberLat] = useState(null);
    const [memberLng, setMemberLng] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [refetchState, setRefetchState] = useState(false);
    const [checkInRequested, setCheckInRequested] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    const [organizationLat, setOrganizationLat] = useState(null);
    const [organizationLng, setOrganizationLng] = useState(null);

    // Helper function to format date and time
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

    // Update current time every second
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
        const handleSessionStart = (incomingId) => {
            if (incomingId === orgOrBranchId) {
                setRefetchState((prev) => !prev);
            }
        };
        socket.on("member-checkin-session-started", handleSessionStart);

        return () => {
            socket.off("member-checkin-session-started", handleSessionStart);
        };
    }, [orgOrBranchId, memberLat, memberLng]);

    useEffect(() => {
        socket.on('checkin-session-disabled', (incomingId) => {
        })
    }, [orgOrBranchId])

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
                    console.log("Notification not shown: permission not granted.");
                }
            }
        }

        socket.on('checkin-req-declined', handleDeclinedReq);

        return () => socket.off('checkin-req-declined', handleDeclinedReq)
    }, [orgOrBranchId]);

    useEffect(() => {
        if ('geolocation' in navigator) {

            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setMemberLat(latitude);
                    setMemberLng(longitude);
                    setLocationError(null);
                },
                (error) => {
                    console.log('Geolocation error: ', error.message);
                    setLocationError(error.message);
                }, {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 1000
            });

            // Cleanup watcher on unmount
            return () => {
                navigator.geolocation.clearWatch(watchId);
            };
        } else {
            setLocationError('Geolocation not supported');
            toast.error('Geolocation not supported');
        }
    }, []);

    const requestForCheckin = async () => {
        try {
            const orgOrBranchId = (multiBranchSupport || onFreeTrail) ? loggedInStaff?.organizationBranch?._id : loggedInStaff?.organization?._id;
            const roomId = `gym-room-${orgOrBranchId}`;
            const checkInReqMessage = `checkin_req-${loggedInStaff?._id}-${orgOrBranchId}-${loggedInStaff?.fullName}`;

            socket.emit('request-checkin', {
                roomId,
                message: checkInReqMessage
            });
            setCheckInRequested(true);
        } catch (error) {
            setIsCheckingIn(false);
            setCheckInRequested(false);
        }
    };

    // Handle successful check in response
    useEffect(() => {
        const handleSuccessFulResponse = (data) => {
            const { message, status } = data;
            if (status === 200) {
                toast.success(message);
                setCheckInRequested(false);
            }
        };

        socket.on('checkin-req-successful', handleSuccessFulResponse);

        return () => socket.off('checkin-req-successful', handleSuccessFulResponse);
    }, [orgOrBranchId]);

    // Handle unsuccessful check in response
    useEffect(() => {
        const handleErrorResponse = (data) => {
            const { message, status } = data;
            if (status !== 200) {
                toast.error(message);
                setCheckInRequested(false);
            }
        };

        socket.on('checkin-req-unsuccessful', handleErrorResponse);

        return () => socket.off('checkin-req-unsuccessful', handleErrorResponse);
    }, [orgOrBranchId]);

    // Get organization position with dependency member lat, lng
    useEffect(() => {
        if (loggedInStaff?.organizationBranch?.currentLat && loggedInStaff?.organizationBranch?.currentLng) {
            setOrganizationLat(loggedInStaff.organizationBranch.currentLat);
            setOrganizationLng(loggedInStaff.organizationBranch.currentLng);
        }
    }, [memberLat, memberLng, loggedInStaff]);

    const getDistanceFromLatLonInMeteer = (Lat1, Lon1, Lat2, Lon2) => {
        const R = 6371000; // Earth radius in meters
        const dLat = deg2rad(Lat2 - Lat1);
        const dLon = deg2rad(Lon2 - Lon2);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(Lat1)) * Math.cos(deg2rad(Lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // in meters
        return distance
    }

    // Only calculate distance when all values are available
    const distance = organizationLat && organizationLng && memberLat && memberLng
        ? getDistanceFromLatLonInMeteer(organizationLat, organizationLng, memberLat, memberLng)
        : null;

    // Fix the deg2rad function (it's correct but just for completeness)
    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    const radius = 50;

    let disableButton = distance >= radius;

    // const formatTime = (date) => {
    //     return date.toLocaleTimeString('en-US', {
    //         hour: '2-digit',
    //         minute: '2-digit',
    //         second: '2-digit',
    //         hour12: true
    //     });
    // };

    // const formatDate = (date) => {
    //     return date.toLocaleDateString('en-US', {
    //         weekday: 'long',
    //         year: 'numeric',
    //         month: 'long',
    //         day: 'numeric'
    //     });
    // };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Card with Time */}
                <AlertDialog open={checkInRequested}>
                    <AlertDialogContent className="dark:bg-slate-800 bg-white dark:border-none border-none shadow-xl rounded-xl w-md md:max-w-md text-sm">
                        <AlertDialogHeader className="space-y-1">
                            <div className="flex items-center gap-2 text-primary">
                                <BiLoaderCircle className="w-5 h-5" />
                                <AlertDialogTitle className="w-full flex justify-between items-center text-base font-semibold">
                                    <span>
                                        Sending Check-In Request
                                    </span>
                                    <MdClose
                                        className="cursor-pointer"
                                        onClick={() => setCheckInRequested(false)}
                                    />
                                </AlertDialogTitle>
                            </div>
                            <AlertDialogDescription className="text-muted-foreground">
                                Your attendance check-in request has been sent. Please wait for the response from gym.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <div className="flex items-center justify-center pt-4">
                            <div className="flex flex-col items-center gap-1">
                                <BiLoaderCircle className="w-8 h-8 animate-spin text-primary" />
                                <p className="text-xs text-muted-foreground">Awaiting response...</p>
                            </div>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>

                <Card className="mb-6 bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm border-0 dark:border-none shadow-xl">
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-6 text-white rounded-t-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="bg-white/20 p-3 rounded-full">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">Check-In</h1>
                                    <p className="text-white/90 text-sm">
                                        Welcome back, {loggedInStaff?.fullName || 'Team Member'}!
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center space-x-2 text-white/90 mb-1">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm font-medium">Current Time</span>
                                </div>
                                <div className="text-xl font-bold">{formatTime(currentTime)}</div>
                                <div className="text-xs text-white/80">{formatDate(currentTime)}</div>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 gap-6">
                    {/* Check-In Button */}
                    <Card className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm border-0 dark:border-none shadow-xl">
                        <h1 className="text-center text-primary pt-4 text-xl font-medium">Tap to request Check In</h1>
                        <div className="w-full flex justify-center items-center p-6">
                            <Button
                                onClick={requestForCheckin}
                                disabled={disableButton}
                                className={`max-w-xl flex flex-col items-center justify-center text-white py-10 rounded-xl text-lg font-semibold transition-all duration-300 ${disableButton
                                    ? 'bg-gray-400 hover:bg-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                                    }`}
                            >
                                <PiHandTapBold className="w-10 h-10" />
                                {disableButton ? 'Too Far to Check In' : 'Request Check In'}
                            </Button>
                        </div>
                    </Card>

                    {/* Member Profile Card */}
                    <Card className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm border-0 dark:border-none shadow-xl">
                        <div className="p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-full">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Your Profile</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                    <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Full Name</p>
                                        <p className="font-medium text-gray-800 dark:text-white">{loggedInStaff?.fullName || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                    <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                        <p className="font-medium text-gray-800 dark:text-white text-sm">{loggedInStaff?.email || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                    <Phone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Contact</p>
                                        <p className="font-medium text-gray-800 dark:text-white">{loggedInStaff?.contactNo || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                    <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                                        <p className="font-medium text-gray-800 dark:text-white text-sm">{loggedInStaff?.permanentAddress?.city || 'N/A'}</p>
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
