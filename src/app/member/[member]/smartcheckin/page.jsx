"use client";

import { useMember } from "@/components/Providers/LoggedInMemberProvider";
import { useState, useEffect } from "react";
import { FaClock, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import io from 'socket.io-client';
import { toast } from "sonner";

const socket = io.connect('http://localhost:5000');

export default function CheckInCard() {
    const { member } = useMember();
    const loggedInMember = member?.loggedInMember;
    const tenantFeatures = loggedInMember?.tenant?.subscription?.subscriptionFeatures;
    const multiBranchSupport = tenantFeatures?.find((feature) => {
        return feature.toString() === 'Multi Branch Support'
    });
    const onFreeTrail = loggedInMember?.tenant?.freeTrailStatus === 'Active';

    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const [checkInSuccess, setCheckInSuccess] = useState(false);
    const [memberLat, setMemberLat] = useState(null);
    const [memberLng, setMemberLng] = useState(null);
    const [locationError, setLocationError] = useState(null);

    useEffect(() => {
        new Notification("You checked in!", { body: "Welcome to the gym 💪" });

        window.navigator.permissions.query({ name: 'geolocation' })
            .then((permissionStatus) => {
                console.log("Location permision state: ", permissionStatus.state)
            })
            .catch((error) => {
                console.log("Failed to check permissions: ", error)
            });

        if ('geolocation' in navigator) {

            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setMemberLat(latitude)
                    setMemberLng(longitude)
                    setLocationError(null);
                    console.log('Latitude: ', latitude);
                    console.log('Longitude: ', longitude);
                },
                (error) => {
                    console.log('Geolocation error: ', error.message);
                    setLocationError(error.message)
                    toast.error(error.message);
                }, {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 1000
            }
            )

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

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
            <div className="w-full max-w-md">

                {/* Main Check-In Card */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
                        <h2 className="text-xl font-bold">Member Check-In</h2>
                        <p className="text-emerald-100 text-sm mt-1">
                            Welcome back, {loggedInMember?.fullName || 'Team Member'}!
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Check In Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={requestForCheckin}
                            disabled={isCheckingIn || checkInSuccess}
                            className={`w-full py-4 rounded-xl shadow-sm flex items-center justify-center space-x-2 transition-all
                                ${checkInSuccess ? 'bg-emerald-100 text-emerald-700' :
                                    isCheckingIn ? 'bg-gray-200 text-gray-600' :
                                        'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
                        >
                            {checkInSuccess ? (
                                <>
                                    <FaCheckCircle className="text-xl" />
                                    <span className="font-semibold">Checked In Successfully</span>
                                </>
                            ) : isCheckingIn ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="font-semibold">Processing...</span>
                                </>
                            ) : (
                                <>
                                    <div className="p-1 bg-white/20 rounded-full">
                                        <FaCheckCircle className="text-lg" />
                                    </div>
                                    <span className="font-semibold">Check In Now</span>
                                </>
                            )}
                        </motion.button>

                        {/* Divider */}
                        <div className="relative flex items-center">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        {/* Tag Location Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-white border border-blue-100 rounded-xl shadow-sm flex items-center justify-center space-x-2 text-blue-600 hover:bg-blue-50 transition-all"
                        >
                            <div className="p-1 bg-blue-100/50 rounded-full">
                                <FaMapMarkerAlt className="text-lg" />
                            </div>
                            <span className="font-semibold">Tag My Location</span>
                        </motion.button>

                        {/* User Info */}
                        <div className="pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-500 text-center">
                                Logged in as <span className="font-medium text-gray-700">{loggedInMember?.fullName}</span>
                            </p>
                            {loggedInMember?.organizationBranch?.name && (
                                <p className="text-xs text-gray-400 text-center mt-1">
                                    {loggedInMember.organizationBranch.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <h2>Live Member Location</h2>
                            {locationError ? (
                                <p style={{ color: "red" }}>{locationError}</p>
                            ) : (
                                <>
                                    <p>Latitude: {memberLat}</p>
                                    <p>Longitude: {memberLng}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}