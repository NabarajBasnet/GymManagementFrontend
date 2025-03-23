'use client';

import { FiRotateCw } from "react-icons/fi";
import { BiSolidCalendarCheck } from "react-icons/bi";
import { BiSolidCheckCircle } from "react-icons/bi";
import { RiArrowRightCircleFill } from "react-icons/ri";
import { IoMdTrash } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { LuMessageSquareText } from "react-icons/lu";
import { Progress } from "@/components/ui/progress"
import { FaCalendarAlt } from "react-icons/fa";
import { GoAlertFill } from "react-icons/go";
import { FaClipboard } from "react-icons/fa";
import {
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import toast, { Toaster } from 'react-hot-toast';
import { Label } from '@/components/ui/label';
import Badge from '@mui/material/Badge';
import { Calendar } from "@/components/ui/calendar"
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox"
import Pagination from "@/components/ui/CustomPagination";
import { FiMoreHorizontal } from "react-icons/fi";
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
                                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                                        {/* Header Section */}
                                        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <h2 className="text-2xl font-bold text-white">Task Management</h2>
                                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                                <Select defaultValue="all">
                                                    <SelectTrigger className="bg-white/90 hover:bg-white/100 transition-colors w-full sm:w-[180px]">
                                                        <SelectValue placeholder="Filter tasks" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all" className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-blue-500" /> All Tasks
                                                        </SelectItem>
                                                        <SelectItem value="pending">
                                                            <span className="w-2 h-2 rounded-full bg-yellow-500" /> Pending
                                                        </SelectItem>
                                                        <SelectItem value="inProgress">
                                                            <span className="w-2 h-2 rounded-full bg-purple-500" /> In Progress
                                                        </SelectItem>
                                                        <SelectItem value="completed">
                                                            <span className="w-2 h-2 rounded-full bg-green-500" /> Completed
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Button className="shrink-0 bg-white/90 hover:bg-white text-blue-600 hover:text-blue-700 shadow-sm">
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    New Task
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Stats Cards */}
                                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-6 bg-gray-50 border-b">
                                            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-sm text-gray-500 mb-1">Total Tasks</p>
                                                        <p className="text-2xl font-bold">24</p>
                                                    </div>
                                                    <div className="bg-blue-100 p-2 rounded-lg">
                                                        <FaClipboard className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Repeat similar structure for other stats cards with different colors */}
                                        </div>

                                        {/* Task List */}
                                        <div className="p-6 space-y-4">
                                            {/* High Priority Task */}
                                            <div className="group bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all">
                                                <div className="flex items-start justify-between gap-4">
                                                    <Checkbox id="task1" className="mt-1.5 h-5 w-5 border-2" />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <Label htmlFor="task1" className="text-base font-semibold">
                                                                Complete monthly report
                                                            </Label>
                                                            <Badge variant="destructive" className="rounded-md px-2 py-1">
                                                                <GoAlertFill className="h-4 w-4 mr-1" /> High Priority
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-4">
                                                            Prepare and submit the monthly performance report for department review
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                                                <FaCalendarAlt className="h-4 w-4" />
                                                                <span>Due: Mar 24, 2025</span>
                                                                <Progress value={30} className="h-2 w-32" />
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="sm" className="rounded-lg">
                                                                            <FiMoreHorizontal className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end" className="min-w-[200px]">
                                                                        <DropdownMenuItem className="gap-2">
                                                                            <MdEdit className="h-4 w-4" /> Edit Task
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem className="gap-2">
                                                                            <LuMessageSquareText className="h-4 w-4" /> Add Comment
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem className="text-red-600 gap-2">
                                                                            <IoMdTrash className="h-4 w-4" /> Delete Task
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                                <Button variant="outline" size="sm" className="rounded-lg gap-2">
                                                                    <RiArrowRightCircleFill className="h-4 w-4" /> Start Task
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Completed Task */}
                                            <div className="group bg-green-50 p-4 rounded-lg border border-green-200 opacity-75 hover:opacity-100 transition-opacity">
                                                <div className="flex items-start justify-between gap-4">
                                                    <Checkbox
                                                        id="task3"
                                                        checked={true}
                                                        className="mt-1.5 h-5 w-5 border-2 data-[state=checked]:border-green-600"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <Label
                                                                htmlFor="task3"
                                                                className="text-base font-medium line-through text-green-800"
                                                            >
                                                                Schedule team meeting
                                                            </Label>
                                                            <Badge variant="outline" className="border-green-300 text-green-800">
                                                                <BiSolidCheckCircle className="h-4 w-4 mr-1" /> Completed
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center justify-between text-sm text-green-700">
                                                            <div className="flex items-center gap-3">
                                                                <BiSolidCalendarCheck className="h-4 w-4" />
                                                                <span>Completed on Mar 21, 2025</span>
                                                            </div>
                                                            <Button variant="ghost" size="sm" className="text-green-700 hover:bg-green-100">
                                                                <FiRotateCw className="h-4 w-4 mr-2" /> Reopen
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Enhanced Pagination */}
                                        <div className="p-6 border-t">
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
