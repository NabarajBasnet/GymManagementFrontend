'use client';

import { FaInfoCircle, FaCalendarAlt, FaUsers, FaPhone, FaUserAlt, FaRegClock, FaBriefcase, FaUser, FaIdBadge, FaMapMarkerAlt } from "react-icons/fa";
import { HiIdentification, HiLocationMarker } from "react-icons/hi";
import { PiBuildingOfficeFill } from "react-icons/pi";
import { MdEmail, MdWorkHistory } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
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

    // Format time to local string
    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';

        // Create a date object with today's date and the time from the string
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours, 10));
        date.setMinutes(parseInt(minutes, 10));
        date.setSeconds(0);

        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Helper components
    const InfoItem = ({ label, value, icon }) => (
        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center dark:text-gray-300 space-x-3 text-gray-500">
                <span className="text-blue-500 dark:text-blue-400">{icon}</span>
                <span className="text-sm font-medium">{label}</span>
            </div>
            <span className="text-sm dark:text-gray-100 font-medium text-gray-700 truncate max-w-[180px] text-right">
                {value || 'N/A'}
            </span>
        </div>
    );

    const ContactPerson = ({ name, phone, relation }) => (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300">
                        <FaUsers className="w-5 h-5" />
                    </div>
                </div>
                <div className="min-w-0">
                    <h4 className="font-medium dark:text-gray-100 text-gray-800 truncate">{name}</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{phone}</p>
                    {relation && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Relation: {relation}</p>}
                </div>
            </div>
        </div>
    );

    const ShiftCard = ({ shiftNumber, shift }) => {
        // Get today's date for the shift
        const today = new Date();
        const todayDateString = today.toLocaleDateString([], {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-100 dark:border-gray-700 mb-3">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium dark:text-white text-gray-800">
                        Shift {shiftNumber} <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full">
                            {shift[`shift_${shiftNumber}_type`]}
                        </span>
                    </h4>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
                        {shift[`shift_${shiftNumber}_role`]}
                    </span>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {todayDateString}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="flex items-center space-x-2 text-sm">
                        <IoMdTime className="text-green-500" />
                        <span className="dark:text-gray-300">
                            Check-in: {formatTime(shift[`shift_${shiftNumber}_checkIn`])}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                        <IoMdTime className="text-red-500" />
                        <span className="dark:text-gray-300">
                            Check-out: {formatTime(shift[`shift_${shiftNumber}_checkOut`])}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    if (isStaffLoading || isQrLoading) {
        return <Loader />;
    }

    // Extract shifts data
    const shifts = staffDetails?.shifts || {};
    const shiftCount = staffDetails?.numberOfShifts || 0;
    const shiftItems = [];

    for (let i = 1; i <= shiftCount; i++) {
        if (shifts[`shift_${i}_type`]) {
            shiftItems.push(
                <ShiftCard
                    key={i}
                    shiftNumber={i}
                    shift={shifts}
                />
            );
        }
    }

    return (
        <div className="w-full dark:bg-gray-900 max-w-2xl mx-auto px-4 py-6 space-y-6">
            {/* Header with Time */}
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold dark:text-white text-gray-800 mb-2">My Profile</h1>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 w-full text-center">
                    <div className="flex flex-col items-center space-y-1">
                        <span className="text-white font-medium text-sm opacity-90">
                            {currentTime.toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                        <span className="text-white font-bold text-xl tracking-wide">
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

            {/* QR Code Section - Now at the top */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold dark:text-white text-gray-800 mb-4 flex items-center justify-center">
                    <FaIdBadge className="mr-2 text-blue-500" />
                    My QR Code
                </h2>
                <div className="flex flex-col items-center space-y-4">
                    {qrData?.qrCode ? (
                        <>
                            <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border-2 border-dashed border-blue-100 dark:border-blue-500">
                                <img
                                    src={qrData.qrCode}
                                    alt="QR Code"
                                    className="w-48 h-48 object-contain"
                                />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-300 text-center">
                                Scan this code for your daily check-in and check-out
                            </p>
                        </>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-300">QR Code not available</p>
                    )}
                </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-blue-600 flex justify-center items-center text-2xl font-bold text-white">
                        {staffDetails?.fullName?.split(' ').map(word => word[0]).join('')}
                    </div>
                    <div className="text-center">
                        <h1 className="text-xl font-bold dark:text-white text-gray-800">
                            {staffDetails?.fullName}
                        </h1>
                        <div className="mt-2 flex justify-center">
                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium px-3 py-1 rounded-full">
                                {staffDetails?.role}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 w-full">
                        <span className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
                            <FaRegClock className="w-3 h-3 mr-1" />
                            {staffDetails?.shift} Shift
                        </span>
                        <span className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
                            <FaUserAlt className="w-3 h-3 mr-1" />
                            {staffDetails?.gender}
                        </span>
                        {staffDetails?.organizationBranch?.orgBranchName && (
                            <span className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
                                <PiBuildingOfficeFill className="w-3 h-3 mr-1" />
                                {staffDetails.organizationBranch.orgBranchName}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Personal Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold dark:text-white text-gray-800 mb-4 flex items-center">
                    <FaUserAlt className="mr-2 text-blue-500" />
                    Personal Information
                </h3>
                <div className="space-y-4">
                    <InfoItem label="Employee ID" value={staffDetails?._id} icon={<HiIdentification />} />
                    <InfoItem label="Contact Number" value={staffDetails?.contactNo} icon={<FaPhone />} />
                    <InfoItem label="Email Address" value={staffDetails?.email} icon={<MdEmail />} />
                    <InfoItem
                        label="Date of Birth"
                        value={staffDetails?.dob ? new Date(staffDetails.dob).toLocaleDateString() : 'N/A'}
                        icon={<FaCalendarAlt />}
                    />
                    <InfoItem
                        label="Current Address"
                        value={staffDetails?.currentAddress?.street ?
                            `${staffDetails.currentAddress.street}, ${staffDetails.currentAddress.city}` : 'N/A'
                        }
                        icon={<FaMapMarkerAlt />}
                    />
                    <InfoItem
                        label="Permanent Address"
                        value={staffDetails?.permanentAddress?.street ?
                            `${staffDetails.permanentAddress.street}, ${staffDetails.permanentAddress.city}` : 'N/A'
                        }
                        icon={<HiLocationMarker />}
                    />
                </div>
            </div>

            {/* Employment Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold dark:text-white text-gray-800 mb-4 flex items-center">
                    <MdWorkHistory className="mr-2 text-blue-500" />
                    Employment Details
                </h3>
                <div className="space-y-4">
                    <InfoItem
                        label="Join Date"
                        value={staffDetails?.joinedDate ? new Date(staffDetails.joinedDate).toLocaleDateString() : 'N/A'}
                        icon={<FaBriefcase />}
                    />
                    <InfoItem label="Role" value={staffDetails?.role} icon={<FaUser />} />
                    <InfoItem label="Salary" value={staffDetails?.salary ? `${staffDetails?.organization?.currency} ${staffDetails.salary.toLocaleString()}` : 'N/A'} icon={<FaBriefcase />} />
                    <InfoItem label="Status" value={staffDetails?.status} icon={<FaUser />} />
                </div>
            </div>

            {/* Shifts Section */}
            {shiftCount > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold dark:text-white text-gray-800 mb-4 flex items-center">
                        <FaRegClock className="mr-2 text-blue-500" />
                        My Shifts
                    </h3>
                    <div className="space-y-3">
                        {shiftItems}
                    </div>
                </div>
            )}

            {/* Organization Info */}
            {staffDetails?.organization && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold dark:text-white text-gray-800 mb-4 flex items-center">
                        <PiBuildingOfficeFill className="mr-2 text-blue-500" />
                        Organization
                    </h3>
                    <div className="space-y-3">
                        <InfoItem label="Name" value={staffDetails.organization.name} icon={<PiBuildingOfficeFill />} />
                        <InfoItem label="Type" value={staffDetails.organization.businessType} icon={<FaBriefcase />} />
                        <InfoItem
                            label="Branch"
                            value={staffDetails.organizationBranch?.orgBranchName || 'Main Branch'}
                            icon={<PiBuildingOfficeFill />}
                        />
                        <InfoItem
                            label="Location"
                            value={staffDetails.organizationBranch?.orgBranchAddress}
                            icon={<HiLocationMarker />}
                        />
                    </div>
                </div>
            )}

            {/* Emergency Contact Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold dark:text-white text-gray-800 mb-4 flex items-center">
                    <FaUsers className="mr-2 text-blue-500" />
                    Emergency Contacts
                </h3>
                <div className="space-y-4">
                    <ContactPerson
                        name={staffDetails?.emergencyContactName || 'Not specified'}
                        phone={staffDetails?.emergencyContactNo || 'N/A'}
                        relation={staffDetails?.relationship}
                    />
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 pt-0.5">
                                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-300">
                                    <FaPhone className="w-5 h-5" />
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium dark:text-white text-gray-800">HR Contact</h4>
                                <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                                    {staffDetails?.organization?.phoneNumber || 'N/A'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {staffDetails?.organization?.businessEmail || 'No email provided'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold dark:text-white text-gray-800 mb-4 flex items-center">
                    <FaInfoCircle className="mr-2 text-blue-500" />
                    Additional Information
                </h3>
                <div className="space-y-4">
                    <InfoItem
                        label="Account Created"
                        value={staffDetails?.createdAt ? new Date(staffDetails.createdAt).toLocaleDateString() : 'N/A'}
                        icon={<FaCalendarAlt />}
                    />
                    <InfoItem
                        label="Last Updated"
                        value={staffDetails?.updatedAt ? new Date(staffDetails.updatedAt).toLocaleDateString() : 'N/A'}
                        icon={<FaCalendarAlt />}
                    />
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
