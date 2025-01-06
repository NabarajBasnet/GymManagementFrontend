'use client';

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
            console.log("Error: ", error);
        }
    };

    return (
        <div className="w-full">
            <div className="w-full flex justify-center">
                {toast ? (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="absolute inset-0 bg-stone-800 opacity-50"></div>
                        <div className={`bg-white border shadow-2xl flex items-center justify-between p-4 relative`}>
                            <div>
                                {
                                    responseType === 'Success' ? (
                                        <MdDone className="text-3xl mx-4 text-green-600" />
                                    ) : (
                                        <MdError className="text-3xl mx-4 text-red-600" />
                                    )
                                }
                            </div>
                            <div className="block">
                                {
                                    responseType === 'Success' ? (
                                        <p className="text-sm font-semibold text-green-600">{successMessage.message}</p>
                                    ) : (
                                        <p className="text-sm font-semibold text-red-600">{errorMessage.message}</p>
                                    )
                                }
                            </div>
                            <div>
                                <MdClose
                                    onClick={() => setToast(false)}
                                    className="cursor-pointer text-3xl ml-4" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
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
                </div>
            )}
        </div>
    )
}

export default MyProfile;
