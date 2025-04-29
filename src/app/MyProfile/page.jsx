'use client';

import { FaCircleCheck } from "react-icons/fa6";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
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
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import { FaUserCircle } from "react-icons/fa";
import { FaTasks } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa";
import { BsChatFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { HiIdentification } from "react-icons/hi2";
import { PiBuildingOfficeFill } from "react-icons/pi";
import { FaBriefcase, FaUser } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa";
import { LuMessageSquareText } from "react-icons/lu";
import { GoAlertFill } from "react-icons/go";
import { FaClipboard } from "react-icons/fa";
import { Label } from '@/components/ui/label';
import Badge from '@mui/material/Badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox"
import Pagination from "@/components/ui/CustomPagination";
import { FiMoreHorizontal } from "react-icons/fi";
import {
    LogOut,
    Clock,
    Settings,
    User,
    UserPlus,
    Users,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaRegUserCircle } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader/Loader";
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { usePagination } from "@/hooks/Pagination";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useStaff } from "@/components/Providers/LoggedInStaffProvider";

const CATEGORIES = [
    'Maintenance',
    'Inventory',
    'Training',
    'Customer Service',
    'Administration'
];

const MyProfile = () => {

    const { staff } = useStaff();
    const staffId = staff?.loggedInStaff?._id || '';
    const [currentTime, setCurrentTime] = useState(null);
    const [staffDetails, setStaffDetails] = useState(null);
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const [myTasks, setMyTasks] = useState(null);

    // States for flitering tasks
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const getMyTasks = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/tasks/get-my-tasks/${id}?page=${currentPage}&limit=${limit}&status=${status}&priority=${priority}&category=${category}`);
            const responseBody = await response.json();
            if (response.ok) {
                setMyTasks(responseBody.myTasks);
            } else {
                toast.error(responseBody.message);
            };
        } catch (error) {
            toast.error(error.message);
            console.log("Error: ", error);
        };
    };

    useEffect(() => {
        const fetchTasks = async () => {
            if (loggedinStaff) {
                await getMyTasks(loggedinStaff._id);
            };
        };
        fetchTasks();
    }, [status, priority, category, limit]);

    const fetchedLoggedStaffDetails = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/loggedin-staff`);
            const responseBody = await response.json();
            if (response.ok) {
                await getMyTasks(responseBody.loggedInStaff._id);
                setStaffDetails(responseBody.loggedInStaff)
            };
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const { data: loggedinStaff, isLoading: isLoggedinStaffLoading } = useQuery({
        queryKey: ['loggedstaff'],
        queryFn: fetchedLoggedStaffDetails
    });

    const fetchStaffQr = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/staffqr/${staffDetails._id}`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const { data, isLoading } = useQuery({
        queryKey: ['qrcode'],
        queryFn: fetchStaffQr,
        enabled: !!staffDetails?._id
    });

    const fetchAttendanceHistory = async ({ queryKey }) => {
        const [, page, id] = queryKey;
        try {
            const url = `http://localhost:3000/api/staff-attendance-history/${id}?page=${page}&limit=${limit}`;
            const response = await fetch(url);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const { data: AttendanceHistory, isLoading: isHistoryLoading } = useQuery({
        queryKey: ['attendancehistory', currentPage, staffDetails?._id || ''],
        queryFn: fetchAttendanceHistory,
        enabled: !!staffDetails?._id
    })

    const { data: history, totalPages } = AttendanceHistory || {};
    const { range, setPage, active } = usePagination({
        total: totalPages ? totalPages : 1,
        siblings: 1,
        boundaries: 1,
        page: currentPage,
        onChange: (page) => {
            setCurrentPage(page);
        },
    });

    const logoutStaff = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/staff-login/logout`, {
                method: "POST",
            })
            const responseBody = await response.json();
            if (response.status !== 200) {
                toast.error('An unexpected error occurred. Please try again.');
            }
            else {
                if (response.status === 200) {
                    toast.success('Logout successful! Redirecting...');
                    router.push(responseBody.redirect);
                }
            }
        } catch (error) {
            toast.error(error);
            console.log("Error: ", error);
        }
    };

    const startTask = async (id) => {
        try {
            const status = 'In Progress';
            const response = await fetch(`http://localhost:3000/api/tasks/changestatus/${id}?status=${'In Progress'}`, {
                method: "PATCH",
                body: JSON.stringify(status)
            });

            const responseBody = await response.json();

            if (response.ok) {
                toast.success(responseBody.message);
            } else {
                toast.error(responseBody.message);
            };
        } catch (error) {
            console.log("Error: ", error);
            toast.error(error.message);
        };
    };

    const completeTask = async (id) => {
        try {
            const status = 'Completed';
            const response = await fetch(`http://localhost:3000/api/tasks/changestatus/${id}?status=${status}`, {
                method: "PATCH",
                body: JSON.stringify(status)
            });

            const responseBody = await response.json();

            if (response.ok && response.status === 200) {
                toast.success(responseBody.message);
            } else {
                toast.error(responseBody.message);
            };
        } catch (error) {
            console.log("Error: ", error);
            toast.error(error.message);
        };
    };

    const formatTo12Hour = (timeStr) => {
        const [hour, minute] = timeStr.split(":").map(Number);
        const ampm = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
    };

    // Helper components
    const InfoItem = ({ label, value, icon }) => (
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-2 text-gray-500">
                {icon}
                <span className="text-sm">{label}</span>
            </div>
            <span className="text-sm font-medium text-gray-700">{value}</span>
        </div>
    );

    const ContactPerson = ({ name, relationship, phone }) => (
        <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <FaUsers className="w-5 h-5" />
                    </div>
                </div>
                <div>
                    <h4 className="font-medium text-gray-800">{name}</h4>
                    <p className="text-sm text-gray-500">{relationship}</p>
                    <p className="text-sm text-blue-600 font-medium">{phone}</p>
                </div>
            </div>
        </div>
    )

    return (
        <div className="w-full">
            {isLoading ? (
                <Loader />
            ) : (
                <div>
                    <div className="w-full flex justify-center mt-2">
                        <div className="w-11/12 md:w-10/12">
                            <Tabs defaultValue="profile" className="w-full">
                                <TabsList className="w-full grid grid-cols-4 mb-4">
                                    <TabsTrigger value="profile" className="flex items-center justify-center gap-2">
                                        <FaUserCircle className="hidden md:flex" /> <span>Profile</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="tasks" className="flex items-center justify-center gap-2">
                                        <FaTasks className="hidden md:flex" /> <span>Tasks</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="attendance" className="flex items-center justify-center gap-2">
                                        <FaUserCheck className="hidden md:flex" /> <span>Attendance</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="chats" className="flex items-center justify-center gap-2">
                                        <BsChatFill className="hidden md:flex" /> <span>Chats</span>
                                    </TabsTrigger>
                                </TabsList>

                                {/* Profile Tab */}
                                <TabsContent value="profile" className="space-y-6">
                                    {/* QR Code Section */}
                                    <div className="w-full bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                        <h2 className="text-xl font-bold text-gray-800 mb-4">My QR Code</h2>
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="p-3 bg-white rounded-lg border-2 border-dashed border-blue-100">
                                                <img
                                                    src={data?.qrCode}
                                                    alt="QR Code"
                                                    className="w-48 h-48 object-contain"
                                                />
                                            </div>
                                            <p className="text-sm text-gray-500 text-center">
                                                Scan this code for your daily checkin and checkout
                                            </p>
                                        </div>
                                    </div>

                                    {/* Time Display */}
                                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 shadow-lg">
                                        <div className="flex flex-col items-center space-y-2">
                                            <span className="text-white font-medium text-sm opacity-90">
                                                {currentTime?.toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                            <div className="flex items-center space-x-3">
                                                <span className="text-white font-bold text-3xl tracking-wide">
                                                    {currentTime?.toLocaleTimeString('en-US', {
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
                                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={`http://localhost:5000${staffDetails?.imageUrl}`}
                                                    className="w-20 h-20 rounded-full cursor-pointer" />
                                            </div>
                                            <div>
                                                <h1 className="text-md md:text-2xl font-bold text-gray-800">
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
                                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                                            <dl className="space-y-4">
                                                <InfoItem label="Contact Number" value={staffDetails?.contactNo} icon={<FaPhone />} />
                                                <InfoItem label="Email Address" value={staffDetails?.email} icon={<MdEmail />} />
                                                <InfoItem
                                                    label="Date of Birth"
                                                    value={new Date(staffDetails?.dob).toLocaleDateString()}
                                                    icon={<FaCalendarAlt />}
                                                />
                                                <InfoItem label="Address" value={staffDetails?.currentAddress.street} icon={<HiLocationMarker />} />
                                            </dl>
                                        </div>

                                        {/* Employment Information Card */}
                                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Employment Details</h3>
                                            <dl className="space-y-4">
                                                <InfoItem
                                                    label="Join Date"
                                                    value={new Date(staffDetails?.joinedDate).toLocaleDateString()}
                                                    icon={<FaBriefcase />}
                                                />
                                                <InfoItem label="Department" value="Human Resources" icon={<PiBuildingOfficeFill />} />
                                                <InfoItem label="Employee ID" value={staffDetails ? staffDetails._id : 'Loading...'} icon={<HiIdentification />} />
                                                <InfoItem label="Role" value={staffDetails ? staffDetails.role : 'Loading...'} icon={<FaUser />} />
                                            </dl>
                                        </div>
                                    </div>

                                    {/* Emergency Contact Section */}
                                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contact</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <ContactPerson
                                                name="Emergency Contact Name"
                                                phone={staffDetails?.emergencyContactName}
                                            />
                                            <ContactPerson
                                                name="Emergency Contact No"
                                                phone={staffDetails?.emergencyContactNo}
                                            />
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Chat Tab */}
                                <TabsContent value="chats">
                                    <div>
                                        <h1 className="my-4 font-bold text-center">Chat section</h1>
                                        <p className="text-center">This feature will be implemented soon</p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyProfile;
