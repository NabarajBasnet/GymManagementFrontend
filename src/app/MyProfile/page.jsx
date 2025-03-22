'use client';

import toast, { Toaster } from 'react-hot-toast';
import { Label } from '@/components/ui/label';
import Badge from '@mui/material/Badge';
import { Calendar } from "@/components/ui/calendar"
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox"
import Pagination from "@/components/ui/CustomPagination";
import {
    Cloud,
    CreditCard,
    Github,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
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
import { MdDone, MdDelete, MdClose, MdError } from "react-icons/md";
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

const MyProfile = () => {

    const [currentTime, setCurrentTime] = useState(null);
    const [staffDetails, setStaffDetails] = useState(null);
    const router = useRouter();
    const [toast, setToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState({ icon: MdDone, message: '' });
    const [errorMessage, setErrorMessage] = useState({ icon: MdError, message: '' });
    const [responseType, setResponseType] = useState('')
    const responseResultType = ['Success', 'Failure'];
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const fetchedLoggedStaffDetails = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/loggedin-staff`);
            const responseBody = await response.json();
            if (response.ok) {
                setStaffDetails(responseBody.loggedInStaff)
            }
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        }
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
        }
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
        }
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
                setResponseType(responseResultType[1]);
                setToast(true);
                setTimeout(() => {
                    setToast(false)
                }, 10000);
                setErrorMessage({
                    icon: MdError,
                    message: responseBody.message || 'Unauthorized action'
                });
            }
            else {
                if (response.status === 200) {
                    toast.success('Logout successful! Redirecting...');
                    router.push(responseBody.redirect);
                    setResponseType(responseResultType[0]);
                    setToast(true);
                    setTimeout(() => {
                        setToast(false)
                    }, 10000);
                    setSuccessMessage({
                        icon: MdError,
                        message: responseBody.message || 'Unauthorized action'
                    })
                }
            }
        } catch (error) {
            toast.error(error);
            console.log("Error: ", error);
        }
    };

    return (
        <div className="w-full">
            <div
                onClick={() => setToast(false)}
                className="w-full flex justify-center">
                <div className="w-11/12 md:w-10/12 flex justify-between items-center">
                    <img
                        src='/LOGO-BLACK.png'
                        className="w-20 h-20"
                    />

                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 hover:bg-gradient-to-l duration-500 transition-colors cursor-pointer p-2 rounded-sm shadow-lg">
                                    <h1 className="font-semibold text-white mx-2">My Profile</h1>
                                    <FaRegUserCircle className="text-2xl cursor-pointer text-white" />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <User />
                                        <span>Profile</span>
                                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <CreditCard />
                                        <span>Billing</span>
                                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Settings />
                                        <span>Settings</span>
                                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Keyboard />
                                        <span>Keyboard shortcuts</span>
                                        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <Users />
                                        <span>Team</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <UserPlus />
                                            <span>Invite users</span>
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem>
                                                    <Mail />
                                                    <span>Email</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <MessageSquare />
                                                    <span>Message</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>
                                                    <PlusCircle />
                                                    <span>More...</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                    <DropdownMenuItem>
                                        <Plus />
                                        <span>New Team</span>
                                        <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Github />
                                    <span>GitHub</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <LifeBuoy />
                                    <span>Support</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled>
                                    <Cloud />
                                    <span>API</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <div onClick={logoutStaff} className="cursor-pointer flex items-center">
                                        <LogOut />
                                        <span>Log out</span>
                                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            {isLoading ? (
                <Loader />
            ) : (
                <div>
                    {/* Top navigation tabs */}
                    <div className="w-full flex justify-center mt-2">
                        <div className="w-11/12 md:w-10/12">
                            <Tabs defaultValue="profile" className="w-full">
                                <TabsList className="w-full grid grid-cols-3 mb-4">
                                    <TabsTrigger value="profile">Profile</TabsTrigger>
                                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                                    <TabsTrigger value="attendance">Attendance</TabsTrigger>
                                </TabsList>

                                {/* Profile Tab */}
                                <TabsContent value="profile">
                                    <div className="w-full flex items-center justify-center p-1">
                                        <img src={data?.qrCode} alt="QR Code" />
                                    </div>
                                    <div className="w-full">
                                        <h1 className="text-center my-4 font-semibold">
                                            Current Time: {currentTime?.toISOString().split("T")[0]},{" "}
                                            {currentTime?.toLocaleTimeString("en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                                hour12: true,
                                            })}
                                        </h1>
                                    </div>
                                    <div className="w-full flex justify-center bg-gray-800 p-6 text-white">
                                        <div className="w-full md:w-11/12">
                                            <h1 className="text-2xl md:text-3xl text-white font-bold">
                                                {staffDetails?.fullName} - {staffDetails?.role}
                                            </h1>
                                            <p className='font-semibold text-sm'>Shift: {staffDetails?.shift}</p>
                                        </div>
                                    </div>
                                    <div className="w-full flex justify-center bg-blue-600 text-white shadow-xl my-4 rounded-lg p-6">
                                        <div className="md:w-11/12 w-full space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">Phone No:</span>
                                                <span className="font-semibold text-sm">{staffDetails?.contactNo}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">Email:</span>
                                                <span className="font-semibold text-sm">{staffDetails?.email}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">Date of Birth:</span>
                                                {
                                                    staffDetails ? (
                                                        <span className="font-semibold text-sm">
                                                            {new Date(staffDetails?.dob).toISOString().split("T")[0]}
                                                        </span>
                                                    ) : (
                                                        <p></p>
                                                    )
                                                }
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">Address:</span>
                                                <span className="font-semibold text-sm">{staffDetails?.address}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">Role:</span>
                                                <span className="font-semibold text-sm">{staffDetails?.role}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">Joined Date:</span>
                                                {
                                                    staffDetails ? (
                                                        <span className="font-semibold text-sm">
                                                            {new Date(staffDetails?.joinedDate).toISOString().split("T")[0]}
                                                        </span>
                                                    ) : (
                                                        <p></p>
                                                    )
                                                }
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">Gender:</span>
                                                <span className="font-semibold text-sm">{staffDetails?.gender}</span>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Tasks Tab */}
                                <TabsContent value="tasks">
                                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                        <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-500 to-blue-700 flex justify-between items-center">
                                            <h2 className="text-xl font-bold text-white">My Tasks</h2>
                                            <div className="flex space-x-2">
                                                <Select defaultValue="all">
                                                    <SelectTrigger className="w-[120px] bg-white">
                                                        <SelectValue placeholder="Filter" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All Tasks</SelectItem>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="inProgress">In Progress</SelectItem>
                                                        <SelectItem value="completed">Completed</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Button variant="secondary" size="sm" className="flex items-center">
                                                    <Plus className="h-4 w-4 mr-1" />
                                                    New Task
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Task statistics */}
                                        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50">
                                            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                                                <p className="text-sm text-gray-500">Total Tasks</p>
                                                <p className="text-2xl font-bold">24</p>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
                                                <p className="text-sm text-gray-500">In Progress</p>
                                                <p className="text-2xl font-bold">8</p>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                                                <p className="text-sm text-gray-500">Completed</p>
                                                <p className="text-2xl font-bold">14</p>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
                                                <p className="text-sm text-gray-500">Overdue</p>
                                                <p className="text-2xl font-bold">2</p>
                                            </div>
                                        </div>

                                        {/* Task List */}
                                        <div className="p-4">
                                            <div className="space-y-4">
                                                {/* High Priority Task */}
                                                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox id="task1" />
                                                            <div>
                                                                <Label htmlFor="task1" className="text-base font-medium">Complete monthly report</Label>
                                                                <p className="text-sm text-gray-500 mt-1">Prepare and submit the monthly performance report for department review</p>
                                                            </div>
                                                        </div>
                                                        <Badge variant="destructive">High Priority</Badge>
                                                    </div>
                                                    <div className="mt-4 flex items-center justify-between">
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Calendar className="h-4 w-4 mr-1" />
                                                            <span>Due: Mar 24, 2025</span>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Button variant="outline" size="sm" className="flex items-center">
                                                                {/* <ArrowRight className="h-4 w-4 mr-1" /> */}
                                                                Mark In Progress
                                                            </Button>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="sm">
                                                                        {/* <MoreHorizontal className="h-4 w-4" /> */}
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem>Edit Task</DropdownMenuItem>
                                                                    <DropdownMenuItem>Add Comment</DropdownMenuItem>
                                                                    <DropdownMenuItem>Share Task</DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem className="text-red-500">Delete Task</DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* In Progress Task */}
                                                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox id="task2" />
                                                            <div>
                                                                <Label htmlFor="task2" className="text-base font-medium">Update client database</Label>
                                                                <p className="text-sm text-gray-500 mt-1">Review and update client information in the CRM system</p>
                                                            </div>
                                                        </div>
                                                        <Badge variant="secondary">In Progress</Badge>
                                                    </div>
                                                    <div className="mt-3">
                                                        {/* <Progress value={60} className="h-2" /> */}
                                                        <p className="text-xs text-gray-500 mt-1 text-right">60% Complete</p>
                                                    </div>
                                                    <div className="mt-4 flex items-center justify-between">
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Calendar className="h-4 w-4 mr-1" />
                                                            <span>Due: Mar 25, 2025</span>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Button variant="outline" size="sm" className="flex items-center">
                                                                <Check className="h-4 w-4 mr-1" />
                                                                Mark Complete
                                                            </Button>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="sm">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem>Edit Task</DropdownMenuItem>
                                                                    <DropdownMenuItem>Add Comment</DropdownMenuItem>
                                                                    <DropdownMenuItem>Update Progress</DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem className="text-red-500">Delete Task</DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Completed Task */}
                                                <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox id="task3" checked={true} />
                                                            <div>
                                                                <Label htmlFor="task3" className="text-base font-medium line-through text-gray-500">Schedule team meeting</Label>
                                                                <p className="text-sm text-gray-400 mt-1">Coordinate with team members and schedule weekly progress meeting</p>
                                                            </div>
                                                        </div>
                                                        <Badge variant="outline" className="text-green-600 bg-green-50">Completed</Badge>
                                                    </div>
                                                    <div className="mt-4 flex items-center justify-between">
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Check className="h-4 w-4 mr-1 text-green-500" />
                                                            <span>Completed on Mar 21, 2025</span>
                                                        </div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem>Reopen Task</DropdownMenuItem>
                                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                                <DropdownMenuItem>Archive</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>

                                                {/* Normal Priority Task */}
                                                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox id="task4" />
                                                            <div>
                                                                <Label htmlFor="task4" className="text-base font-medium">Review training materials</Label>
                                                                <p className="text-sm text-gray-500 mt-1">Review and update the new employee onboarding materials</p>
                                                            </div>
                                                        </div>
                                                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Normal Priority</Badge>
                                                    </div>
                                                    <div className="mt-4 flex items-center justify-between">
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Calendar className="h-4 w-4 mr-1" />
                                                            <span>Due: Mar 29, 2025</span>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Button variant="outline" size="sm" className="flex items-center">
                                                                <ArrowRight className="h-4 w-4 mr-1" />
                                                                Mark In Progress
                                                            </Button>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="sm">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem>Edit Task</DropdownMenuItem>
                                                                    <DropdownMenuItem>Add Comment</DropdownMenuItem>
                                                                    <DropdownMenuItem>Share Task</DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem className="text-red-500">Delete Task</DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Pagination for tasks */}
                                            <div className="mt-6 flex justify-center">
                                                <Pagination>
                                                    <PaginationContent>
                                                        <PaginationItem>
                                                            <PaginationPrevious href="#" />
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationLink href="#" isActive>1</PaginationLink>
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationLink href="#">2</PaginationLink>
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationLink href="#">3</PaginationLink>
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationEllipsis />
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationNext href="#" />
                                                        </PaginationItem>
                                                    </PaginationContent>
                                                </Pagination>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Attendance Tab */}
                                <TabsContent value="attendance">
                                    <div>
                                        <h1 className="my-4 font-bold text-center">Attendance History</h1>
                                        <TableContainer component={Paper}>
                                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className="w-[100px]">Staff Id</TableCell>
                                                        <TableCell>Name</TableCell>
                                                        <TableCell>Email</TableCell>
                                                        <TableCell>Check In</TableCell>
                                                        <TableCell>Check Out</TableCell>
                                                        <TableCell>Remark</TableCell>
                                                        <TableCell>Late Flag</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {Array.isArray(history) && history.length >= 1 ? (
                                                        history.map((attendance) => (
                                                            <TableRow
                                                                key={attendance._id}
                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                            >
                                                                <TableCell component="th" scope="row">{attendance.staffId}</TableCell>
                                                                <TableCell component="th" scope="row">{attendance.fullName}</TableCell>
                                                                <TableCell component="th" scope="row">{attendance.email}</TableCell>
                                                                <TableCell component="th" scope="row">
                                                                    {attendance.checkIn
                                                                        ? new Date(attendance.checkIn).toLocaleString('en-US', {
                                                                            year: 'numeric',
                                                                            month: '2-digit',
                                                                            day: '2-digit',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                            second: '2-digit',
                                                                            hour12: true,
                                                                        })
                                                                        : ''}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row">
                                                                    {attendance.checkOut
                                                                        ? new Date(attendance.checkOut).toLocaleString('en-US', {
                                                                            year: 'numeric',
                                                                            month: '2-digit',
                                                                            day: '2-digit',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                            second: '2-digit',
                                                                            hour12: true,
                                                                        })
                                                                        : ''}
                                                                </TableCell>
                                                                <TableCell component="th" scope="row">{attendance.remark}</TableCell>
                                                                <TableCell component="th" scope="row">{attendance.remark === 'LatePunchIn' ? 'True' : 'False'}</TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow
                                                            key={'row.name'}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <TableCell component="th" scope="row"></TableCell>
                                                            <TableCell align="right">{'Attendance not found.'}</TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <div className="my-4">
                                            <Pagination
                                                total={totalPages || 1}
                                                page={currentPage || 1}
                                                onChange={setCurrentPage}
                                                withEdges={true}
                                                siblings={1}
                                                boundaries={1}
                                            />
                                        </div>
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
