'use client';

import { FaCalendarAlt, FaUsers, FaPhone, FaUserAlt, FaRegClock, FaBriefcase, FaUser } from "react-icons/fa";
import { HiIdentification, HiLocationMarker } from "react-icons/hi";
import { PiBuildingOfficeFill } from "react-icons/pi";
import { MdEmail } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Loader from "@/components/Loader/Loader";
import toast from "react-hot-toast";
import { useStaff } from "@/components/Providers/LoggedInStaffProvider";

const MyProfile = () => {
    const { staff } = useStaff();
    const staffId = staff?.loggedInStaff?._id;
    const [currentTime, setCurrentTime] = useState(new Date());
    const [staffDetails, setStaffDetails] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const fetchStaffDetails = async () => {
        try {
            const response = await fetch(`http://88.198.112.156:3100/api/loggedin-staff`);
            const responseBody = await response.json();
            if (response.ok) {
                setStaffDetails(responseBody.loggedInStaff);
                return responseBody.loggedInStaff;
            }
            throw new Error(responseBody.message || 'Failed to fetch staff details');
        } catch (error) {
            console.error("Error fetching staff details:", error);
            toast.error(error.message);
            throw error;
        }
    };

    const fetchStaffQr = async () => {
        try {
            if (!staffId) return null;
            const response = await fetch(`http://88.198.112.156:3100/api/staffqr/${staffId}`);
            const responseBody = await response.json();
            if (!response.ok) {
                throw new Error(responseBody.message || 'Failed to fetch QR code');
            }
            return responseBody;
        } catch (error) {
            console.error("Error fetching QR code:", error);
            toast.error(error.message);
            throw error;
        }
    };

    const { data: qrData, isLoading: isQrLoading } = useQuery({
        queryKey: ['qrcode', staffId],
        queryFn: fetchStaffQr,
        enabled: !!staffId
    });

    const { isLoading: isStaffLoading } = useQuery({
        queryKey: ['staffDetails'],
        queryFn: fetchStaffDetails,
        enabled: !staffDetails
    });

    // Helper components
    const InfoItem = ({ label, value, icon }) => (
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center dark:text-gray-100 space-x-2 text-gray-500">
                {icon}
                <span className="text-sm">{label}</span>
            </div>
            <span className="text-sm dark:text-gray-100 font-medium text-gray-700">{value || 'N/A'}</span>
        </div>
    );

    const ContactPerson = ({ name, phone }) => (
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <FaUsers className="w-5 h-5" />
                    </div>
                </div>
                <div>
                    <h4 className="font-medium dark:text-gray-100 text-gray-800">{name}</h4>
                    <p className="text-sm text-blue-600 font-medium">{phone}</p>
                </div>
            </div>
        </div>
    );

    if (isStaffLoading || isQrLoading) {
        return <Loader />;
    }

    return (
        <div className="w-full dark:bg-gray-900 max-w-4xl mx-auto px-4 py-8 space-y-6">
            {/* QR Code Section */}
            <div className="w-full bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl dark:text-white font-bold text-gray-800 mb-4">My QR Code</h2>
                <div className="flex flex-col items-center space-y-4">
                    {qrData?.qrCode ? (
                        <>
                            <div className="p-3 bg-white rounded-lg border-2 border-dashed dark:border-blue-500 border-blue-100">
                                <img
                                    src={qrData.qrCode}
                                    alt="QR Code"
                                    className="w-48 h-48 object-contain"
                                />
                            </div>
                            <p className="text-sm text-gray-500 text-center dark:text-gray-300">
                                Scan this code for your daily check-in and check-out
                            </p>
                        </>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-300">QR Code not available</p>
                    )}
                </div>
            </div>

            {/* Time Display */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 shadow-lg">
                <div className="flex flex-col items-center space-y-2">
                    <span className="text-white font-medium text-sm opacity-90">
                        {currentTime.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                    <div className="flex items-center space-x-3">
                        <span className="text-white font-bold text-3xl tracking-wide">
                            {currentTime.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true
                            })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                        <h1 className="w-20 h-20 rounded-full bg-blue-600 flex justify-center items-center text-2xl font-bold text-white cursor-pointer">
                            {staffDetails?.fullName?.split(' ').map((word) => word[0]).join('')}
                        </h1>
                    </div>
                    <div>
                        <h1 className="text-md md:text-2xl dark:text-white font-bold text-gray-800">
                            {staffDetails?.fullName}
                            <span className="ml-2 bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                {staffDetails?.role}
                            </span>
                        </h1>
                        <div className="flex items-center space-x-2 mt-1">
                            <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-600">
                                <FaRegClock className="w-4 h-4 mr-1" />
                                {staffDetails?.shift} Shift
                            </span>
                            <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-600">
                                <FaUserAlt className="w-4 h-4 mr-1" />
                                {staffDetails?.gender}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information Card */}
                <div className="bg-white dark:bg-gray-800 dark:text-white rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 dark:text-white">Personal Information</h3>
                    <dl className="space-y-4 dark:text-white">
                        <InfoItem label="Contact Number" className='dark:text-white' value={staffDetails?.contactNo} icon={<FaPhone />} />
                        <InfoItem label="Email Address" value={staffDetails?.email} icon={<MdEmail />} />
                        <InfoItem
                            label="Date of Birth"
                            value={staffDetails?.dob ? new Date(staffDetails.dob).toLocaleDateString() : 'N/A'}
                            icon={<FaCalendarAlt />}
                        />
                        <InfoItem
                            label="Address"
                            value={staffDetails?.currentAddress?.street}
                            icon={<HiLocationMarker />}
                        />
                    </dl>
                </div>

                {/* Employment Information Card */}
                <div className="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-lg dark:text-white font-semibold text-gray-800 mb-4">Employment Details</h3>
                    <dl className="space-y-4">
                        <InfoItem
                            label="Join Date"
                            value={staffDetails?.joinedDate ? new Date(staffDetails.joinedDate).toLocaleDateString() : 'N/A'}
                            icon={<FaBriefcase />}
                        />
                        <InfoItem label="Employee ID" value={staffDetails?._id} icon={<HiIdentification />} />
                        <InfoItem label="Role" value={staffDetails?.role} icon={<FaUser />} />
                    </dl>
                </div>
            </div>

            {/* Emergency Contact Section */}
            <div className="bg-white dark:bg-gray-800 dark:border-700 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg dark:text-white font-semibold text-gray-800 mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 dark:bg-gray-800">
                    <ContactPerson
                        name="Emergency Contact"
                        phone={staffDetails?.emergencyContactName}
                    />
                    <ContactPerson
                        name="Emergency Phone"
                        phone={staffDetails?.emergencyContactNo}
                    />
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
