"use client";

import { BiLoaderCircle } from "react-icons/bi";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useMember } from "@/components/Providers/LoggedInMemberProvider";
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
    AlertCircle,
    Users
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MdClose } from "react-icons/md";
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
});

export default function CheckInCard() {
    const { member } = useMember();
    const loggedInMember = member?.loggedInMember;
    const tenantFeatures = loggedInMember?.tenant?.subscription?.subscriptionFeatures;
    const multiBranchSupport = tenantFeatures?.find((feature) => {
        return feature.toString() === 'Multi Branch Support'
    });
    const onFreeTrail = loggedInMember?.tenant?.freeTrailStatus === 'Active';
    const orgOrBranchId = (multiBranchSupport || onFreeTrail)
        ? loggedInMember?.organizationBranch?._id
        : loggedInMember?.organization?._id;
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
            hour12: true
        });
    };

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
            const orgOrBranchId = (multiBranchSupport || onFreeTrail) ? loggedInMember?.organizationBranch?._id : loggedInMember?.organization?._id;
            const roomId = `gym-room-${orgOrBranchId}`;
            const checkInReqMessage = `checkin_req-${loggedInMember?._id}-${orgOrBranchId}-${loggedInMember?.fullName}`;

            socket.emit('request-checkin', {
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
            const { message, status } = data;
            if (status === 200) {
                toast.success(message);
                setCheckInRequested(false);
            }
        };

        socket.on('checkin-req-successful', handleSuccessFulResponse);
        return () => socket.off('checkin-req-successful', handleSuccessFulResponse);
    }, [orgOrBranchId]);

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

    useEffect(() => {
        if (loggedInMember?.organizationBranch?.currentLat && loggedInMember?.organizationBranch?.currentLng) {
            setOrganizationLat(loggedInMember.organizationBranch.currentLat);
            setOrganizationLng(loggedInMember.organizationBranch.currentLng);
        }
    }, [memberLat, memberLng, loggedInMember]);

    const getDistanceFromLatLonInMeteer = (Lat1, Lon1, Lat2, Lon2) => {
        const R = 6371000;
        const dLat = deg2rad(Lat2 - Lat1);
        const dLon = deg2rad(Lon2 - Lon1);

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
    const disableButton = distance >= radius;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full mx-auto space-y-6">
                {/* Loading Dialog */}
                <AlertDialog open={checkInRequested}>
                    <AlertDialogContent className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <AlertDialogHeader>
                            {/* Header with gradient background */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 px-6 py-5 border-b border-gray-100 dark:border-gray-600">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                                <BiLoaderCircle className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
                                        </div>
                                        <div>
                                            <AlertDialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Processing Check-In
                                            </AlertDialogTitle>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                                Please wait a moment
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setCheckInRequested(false)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors group"
                                    >
                                        <MdClose className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                                    </button>
                                </div>
                            </div>

                            {/* Content area */}
                            <div className="px-6 py-6">
                                <AlertDialogDescription className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                                    Your attendance check-in request has been sent to the gym.
                                    We'll notify you once it's processed.
                                </AlertDialogDescription>

                                {/* Loading animation */}
                                <div className="flex flex-col items-center gap-4 py-8">
                                    <div className="relative">
                                        <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900/30 rounded-full" />
                                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 dark:border-blue-400 rounded-full border-t-transparent animate-spin" />
                                    </div>

                                    {/* Progress dots */}
                                    <div className="flex gap-2">
                                        {[0, 1, 2].map((i) => (
                                            <div
                                                key={i}
                                                className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"
                                                style={{ animationDelay: `${i * 0.2}s` }}
                                            />
                                        ))}
                                    </div>

                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                        Connecting...
                                    </p>
                                </div>

                                {/* Status indicator */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                        <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                                            Request sent successfully
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </AlertDialogHeader>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Header Card */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                                    <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-semibold">Check-In System</h1>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Welcome back, {loggedInMember?.fullName || 'Member'}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm">Current Time</span>
                                </div>
                                <div className="text-lg font-medium mt-1">
                                    {formatTime(currentTime)}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDate(currentTime)}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* How It Works Card */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1" className="border-none">
                            <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                <span className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    How Smart Location-Based Check-In Works
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-4 text-gray-600 dark:text-gray-300">
                                <p className="mb-3">
                                    Our smart check-in system uses your live location to make gym attendance faster, easier, and more secure.
                                </p>
                                <ul className="space-y-2 list-disc pl-5">
                                    <li><strong>Location Required:</strong> Allow location access when prompted by your browser.</li>
                                    <li><strong>Live Location Tracking:</strong> Your position updates in real-time (only while this screen is open).</li>
                                    <li><strong>Enter the Gym Area:</strong> You must be physically near the gym to unlock check-in.</li>
                                    <li><strong>Tap to Check In:</strong> Once inside the valid range, press the check-in button.</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </Card>

                {/* Check-In Button Card */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                        <h2 className="text-center text-gray-700 dark:text-gray-300 font-medium mb-4">
                            Tap to request Check In
                        </h2>
                        <Button
                            onClick={requestForCheckin}
                            disabled={disableButton}
                            className={`w-full py-8 text-base font-medium ${disableButton
                                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                        >
                            <div className="flex flex-col items-center gap-2">
                                <PiHandTapBold className="w-6 h-6" />
                                {disableButton ? 'Too Far to Check In' : 'Request Check In'}
                            </div>
                        </Button>
                    </div>
                </Card>

                {/* Profile Card */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold">Your Profile</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                                <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Full Name</p>
                                    <p className="font-medium">{loggedInMember?.fullName || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                                <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                    <p className="font-medium text-sm">{loggedInMember?.email || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                                <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Contact</p>
                                    <p className="font-medium">{loggedInMember?.contactNo || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                                <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                                    <p className="font-medium text-sm">{loggedInMember?.address || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Membership Card */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                                <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold">Membership Details</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                                <Building className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Plan Name</p>
                                    <p className="font-medium">{loggedInMember?.membership?.planName || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                                    <p className="font-medium">
                                        {loggedInMember?.membership?.duration ? `${loggedInMember?.membership?.duration / 30} months` : 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                                <Timer className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Time Restriction</p>
                                    <p className="font-medium text-sm">
                                        {loggedInMember?.membership?.timeRestriction?.startTime || 'N/A'} - {loggedInMember?.membership?.timeRestriction?.endTime || 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                                <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Shift</p>
                                    <p className="font-medium">{loggedInMember?.membership?.membershipShift || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Location Card */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                                <Navigation className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold">Location Status</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    <span className="text-sm">Latitude</span>
                                </div>
                                <span className="font-medium">{memberLat ? memberLat.toFixed(6) : 'Loading...'}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    <span className="text-sm">Longitude</span>
                                </div>
                                <span className="font-medium">{memberLng ? memberLng.toFixed(6) : 'Loading...'}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Navigation className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    <span className="text-sm">Distance</span>
                                </div>
                                <span className="font-medium">
                                    {distance !== null ? `${distance.toFixed(2)}m` : 'Calculating...'}
                                </span>
                            </div>
                            {distance !== null && distance > radius && (
                                <div className="flex items-center gap-2 p-3 bg-red-100 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                    <span className="text-sm text-red-600 dark:text-red-400">You're too far from the gym location!</span>
                                </div>
                            )}
                            {distance !== null && distance <= radius && (
                                <div className="flex items-center gap-2 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    <span className="text-sm text-green-600 dark:text-green-400">You're within check-in range!</span>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};