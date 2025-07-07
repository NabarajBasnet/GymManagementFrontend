"use client";

import { useMember } from "@/components/Providers/LoggedInMemberProvider";
import { useState, useEffect } from "react";
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
import io from 'socket.io-client';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const socket = io('http://localhost:5000', {
    transports: ['websocket'],
});

export default function CheckInCard() {
    const { member } = useMember();
    const loggedInMember = member?.loggedInMember;
    console.log(loggedInMember);
    const tenantFeatures = loggedInMember?.tenant?.subscription?.subscriptionFeatures;
    const multiBranchSupport = tenantFeatures?.find((feature) => {
        return feature.toString() === 'Multi Branch Support'
    });
    const onFreeTrail = loggedInMember?.tenant?.freeTrailStatus === 'Active';
    const orgOrBranchId = (multiBranchSupport || onFreeTrail)
        ? loggedInMember?.organizationBranch?._id
        : loggedInMember?.organization?._id;

    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const [checkInSuccess, setCheckInSuccess] = useState(false);
    const [memberLat, setMemberLat] = useState(null);
    const [memberLng, setMemberLng] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [refetchState, setRefetchState] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    const [organizationLat, setOrganizationLat] = useState(null);
    const [organizationLng, setOrganizationLng] = useState(null);

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
                new Notification("The gym is open", { body: "Lets start repping those gains 💪" });
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
            console.log('Closing incoming id: ', incomingId);
            new Notification('Gym session closed')
        })
    }, [orgOrBranchId])

    useEffect(() => {
        if ('geolocation' in navigator) {

            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setMemberLat(latitude)
                    setMemberLng(longitude)
                    setLocationError(null);
                },
                (error) => {
                    console.log('Geolocation error: ', error.message);
                    setLocationError(error.message)
                }, {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 1000
            })

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
            const orgOrBranchId = (multiBranchSupport || onFreeTrail) ? loggedInMember?.organizationBranch?._id : loggedInMember?.organization?._id;
            const roomId = `gym-room-${orgOrBranchId}`;
            const checkInReqMessage = `checkin_req-${loggedInMember?._id}-${orgOrBranchId}-${loggedInMember?.fullName}`;

            socket.emit('request-checkin', {
                roomId,
                message: checkInReqMessage
            });
        } catch (error) {
            setIsCheckingIn(false);
        }
    };

    // Get organization position with dependency member lat, lng
    useEffect(() => {
        if (loggedInMember?.organizationBranch?.currentLat && loggedInMember?.organizationBranch?.currentLng) {
            setOrganizationLat(loggedInMember.organizationBranch.currentLat);
            setOrganizationLng(loggedInMember.organizationBranch.currentLng);
        }
    }, [memberLat, memberLng, loggedInMember]);

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

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Card with Time */}
                <Card className="mb-6 bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm border-0 dark:border-none shadow-xl">
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-6 text-white rounded-t-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="bg-white/20 p-3 rounded-full">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">Gym Check-In</h1>
                                    <p className="text-white/90 text-sm">
                                        Welcome back, {loggedInMember?.fullName || 'Team Member'}!
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Check-In Button */}
                        <Card className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm border-0 dark:border-none shadow-xl">
                            <div className="p-6">
                                <Button
                                    onClick={requestForCheckin}
                                    disabled={disableButton}
                                    className={`w-full text-white py-6 rounded-xl text-lg font-semibold transition-all duration-300 ${disableButton
                                        ? 'bg-gray-400 hover:bg-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                                        }`}
                                >
                                    <CheckCircle className="w-6 h-6 mr-2" />
                                    {disableButton ? 'Too Far to Check In' : 'Check In Now'}
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
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Member Profile</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                        <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Full Name</p>
                                            <p className="font-medium text-gray-800 dark:text-white">{loggedInMember?.fullName || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                        <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                            <p className="font-medium text-gray-800 dark:text-white text-sm">{loggedInMember?.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                        <Phone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Contact</p>
                                            <p className="font-medium text-gray-800 dark:text-white">{loggedInMember?.contactNo || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                        <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                                            <p className="font-medium text-gray-800 dark:text-white text-sm">{loggedInMember?.address || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Membership Details Card */}
                        <Card className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm border-0 dark:border-none shadow-xl">
                            <div className="p-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-full">
                                        <CreditCard className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Membership Details</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-lg">
                                        <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Plan Name</p>
                                            <p className="font-medium text-gray-800 dark:text-white">{loggedInMember?.membership?.planName || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-lg">
                                        <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                                            <p className="font-medium text-gray-800 dark:text-white">{loggedInMember?.membership?.duration ? `${loggedInMember?.membership?.duration / 30} months` : 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-lg">
                                        <Timer className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Time Restriction</p>
                                            <p className="font-medium text-gray-800 dark:text-white text-sm">
                                                {loggedInMember?.membership?.timeRestriction?.startTime || 'N/A'} - {loggedInMember?.membership?.timeRestriction?.endTime || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-lg">
                                        <Users className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Shift</p>
                                            <p className="font-medium text-gray-800 dark:text-white">{loggedInMember?.membership?.membershipShift || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">

                        {/* Location Status Card */}
                        <Card className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm border-0 dark:border-none shadow-xl">
                            <div className="p-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-full">
                                        <Navigation className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Location Status</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Latitude</span>
                                        </div>
                                        <span className="font-medium text-gray-800 dark:text-white">{memberLat ? memberLat.toFixed(6) : 'Loading...'}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Longitude</span>
                                        </div>
                                        <span className="font-medium text-gray-800 dark:text-white">{memberLng ? memberLng.toFixed(6) : 'Loading...'}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <Navigation className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Distance</span>
                                        </div>
                                        <span className="font-medium text-gray-800 dark:text-white">
                                            {distance !== null ? `${distance.toFixed(2)}m` : 'Calculating...'}
                                        </span>
                                    </div>
                                    {distance !== null && distance > radius && (
                                        <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                            <span className="text-sm text-red-600 dark:text-red-400">You're too far from the gym location!</span>
                                        </div>
                                    )}
                                    {distance !== null && distance <= radius && (
                                        <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                            <span className="text-sm text-green-600 dark:text-green-400">You're within check-in range!</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};