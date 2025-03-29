'use client';

import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { toast as toastMessage } from "react-hot-toast";
import { FcSettings } from "react-icons/fc";
import { FcParallelTasks } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { GiConfirmed } from "react-icons/gi";
import { MdCloseFullscreen } from "react-icons/md";
import { RiResetRightFill } from "react-icons/ri";
import { IoSearch } from "react-icons/io5";
import { useUser } from '@/components/Providers/LoggedInUserProvider.jsx';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Pagination from "@/components/ui/CustomPagination.jsx";
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
import { MdDelete, MdClose, MdEmail, MdMenu, MdDone, MdError } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import * as React from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
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
import { TiUserAdd } from "react-icons/ti";
import Link from "next/link.js";
import { usePagination } from "@/hooks/Pagination.js";
import Loader from "@/components/Loader/Loader.jsx";
import { useRouter } from 'next/navigation.js';

const StaffManagement = () => {

    const { user, loading } = useUser();
    const router = useRouter()
    const checkUserPermission = () => {
        if (loading) {
            return <div>Loading...</div>
        } else {
            if (user && user.user.role === 'Gym Admin') {
                router.push('/unauthorized');
            }
        }
    };

    React.useEffect(() => {
        checkUserPermission();
    }, []);

    // States
    const [checkInTime, setCheckInTime] = useState(null);
    const [checkOutTime, setCheckOutTime] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(15);
    const [currentStaffId, setCurrentStaffId] = useState();
    const [searchQuery, setSearchQuery] = useState();

    const handleCheckInTimeChange = (e) => {
        const timeValue = e.target.value;
        const [hours, minutes] = timeValue.split(':').map(Number);
        const checkInTime = new Date();
        checkInTime.setHours(hours);
        checkInTime.setMinutes(minutes);
        setCheckInTime(checkInTime);
    };

    const handleCheckOutTimeChange = (e) => {
        const timeValue = e.target.value;
        const [hours, minutes] = timeValue.split(':').map(Number);
        const checkOutTime = new Date();
        checkOutTime.setHours(hours);
        checkOutTime.setMinutes(minutes);
        setCheckOutTime(checkOutTime);
    };

    const queryclient = useQueryClient();
    const [openForm, setOpenForm] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const totalSteps = 5;
    const [toast, setToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState({ icon: MdDone, message: '' });
    const [errorMessage, setErrorMessage] = useState({ icon: MdError, message: '' });
    const [responseType, setResponseType] = useState('');
    const responseResultType = ['Success', 'Failure'];
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState();
    const [deleting, setDeleting] = useState(false);

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
        control,
        setValue,
        setError,
        clearErrors
    } = useForm();

    // Functions

    const debounce = (func, delay) => {
        let timerId;
        return (...args) => {
            if (timerId) clearTimeout(timerId)
            timerId = setTimeout(() => func(...args), delay)
        };
    };

    const fetchAllStaffs = async ({ queryKey }) => {
        const [, page, searchQuery] = queryKey;
        try {
            const response = await fetch(`http://localhost:3000/api/staffsmanagement?page=${page}&limit=${limit}&staffSearchQuery=${searchQuery}`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ['staffs', currentPage, searchQuery || '', limit],
        queryFn: fetchAllStaffs,
        keepPreviousData: true,
    });

    const { staffs, totalPages, totalStaffs } = data || {}

    const { range, setPage, active } = usePagination({
        total: totalPages ? totalPages : 1,
        siblings: 1,
        boundaries: 1,
        page: currentPage,
        onChange: (page) => {
            setCurrentPage(page);
        },
    });

    React.useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
        return () => { clearTimeout(handler) }
    }, [searchQuery, limit]);

    React.useEffect(() => {
        fetchAllStaffs();
    }, [limit]);


    const startEntry = (currentPage - 1) * limit + 1;
    const endEntry = Math.min(currentPage * limit, totalStaffs);

    const handleSubmitStaff = async (data) => {
        console.log("Data: ", data);
        const {
            fullName, email, contactNo, emergencyContactNo, address, dob, gender, shift, joinedDate, workingHours, status, salary, role
        } = data;

        // Prepare final data
        const finalData = {
            fullName, email, contactNo, emergencyContactNo, address, dob, checkInTime, checkOutTime, gender, shift, joinedDate, workingHours, status, salary, role
        };

        try {
            const url = currentStaffId
                ? `http://localhost:3000/api/staffsmanagement/changedetails/${currentStaffId}`
                : 'http://localhost:3000/api/staffsmanagement/create';

            const method = currentStaffId ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(finalData),
            });
            const responseBody = await response.json();
            if (response.ok) {
                setOpenForm(false);
                setResponseType(responseResultType[0]);
                setToast(true);
                setTimeout(() => {
                    setToast(false)
                }, 10000);
                setSuccessMessage({
                    icon: MdDone,
                    message: responseBody.message
                });
            };

            if (response.status === 200) {
                setOpenForm(false);
                queryclient.invalidateQueries(['staffs']);
            };
            if (responseBody.errors && response.status === 400) {
                responseBody.errors.forEach((error) => {
                    setError(error.field, {
                        type: 'manual',
                        message: error.message
                    });
                });
            }
            else if (response.status === 401) {
                setResponseType(responseResultType[1]);
                setToast(true);
                setTimeout(() => {
                    setToast(false)
                }, 10000);
                setErrorMessage({
                    icon: MdError,
                    message: responseBody.message
                });
            }
            else {
                setResponseType(responseResultType[0]);
                setToast(true);
                setTimeout(() => {
                    setToast(false)
                }, 10000);
                setSuccessMessage({
                    icon: MdDone,
                    message: responseBody.message
                });
            };

        } catch (error) {
            console.log("Error message: ", error.message);
            setResponseType(responseResultType[1]);
            setToast(true);
            setTimeout(() => {
                setToast(false)
            }, 10000);
            setErrorMessage({
                icon: MdError,
                message: error.message || 'Unauthorized action'
            });
        }
    };

    const deleteStaff = async (id) => {
        setDeleting(true);
        try {
            const response = await fetch(`http://localhost:3000/api/staffsmanagement/remove/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const responseBody = await response.json();

            if (response.ok) {
                setResponseType(responseResultType[0]);
                setToast(true);
                setTimeout(() => {
                    setToast(false);
                }, 10000);
                setSuccessMessage({
                    icon: MdDone,
                    message: responseBody.message,
                });
                setDeleting(false);
            };

            if (!response.ok && response.status === 403) {
                setResponseType(responseResultType[1]);
                setToast(true);
                setTimeout(() => {
                    setToast(false);
                }, 10000);
                setErrorMessage({
                    icon: MdError,
                    message: responseBody.message,
                });
                setDeleting(false);
            };
        } catch (error) {
            console.log("Error: ", error);
            setResponseType(responseResultType[1]);
            setToast(true);
            setTimeout(() => {
                setToast(false);
            }, 10000);
            setErrorMessage({
                icon: MdError,
                message: error.message || 'Unauthorized action',
            });
            setDeleting(false);
        }
    };

    return (
        <div className="w-full">
            <div className='w-full bg-gray-100'
                onClick={() => {
                    setToast(false);
                    setDeleting(false);
                }}>
                <Breadcrumb className='p-6'>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-1">
                                    <BreadcrumbEllipsis className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </DropdownMenuTrigger>
                            </DropdownMenu>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard/staffmanagement">Staff Management</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard/staffmanagement/staffs">Staffs</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex justify-between items-center bg-blue-600 text-white p-4">
                    <h1 className="text-xl font-bold">Staff Management</h1>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <MdMenu className="text-3xl cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>
                                <Link href={'/MyProfile'} className='cursor-pointer'>
                                    My Account
                                </Link>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem className='cursor-pointer' onClick={() => {
                                    reset();
                                    setOpenForm(!openForm);
                                }
                                }>
                                    <TiUserAdd />
                                    <span>Add Staff</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem>
                                    <FcSettings />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {deleting ? (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className={`bg-white border shadow-2xl flex items-center justify-between p-4 relative`}>
                        <Box sx={{ display: 'flex' }}>
                            <CircularProgress />
                        </Box>
                    </div>
                </div>
            ) : (
                <></>
            )}

            {toast && (
                <>
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-fade-in"
                        onClick={() => setToast(false)}
                    ></div>

                    <div className="fixed top-4 right-4 z-50 animate-slide-in">
                        <div className={`relative flex items-start gap-3 px-4 py-3 bg-white shadow-lg border-l-[5px] rounded-xl
                                transition-all duration-300 ease-in-out w-80
                                ${responseType === 'Success' ? 'border-emerald-500' : 'border-rose-500'}`}>
                            <div className={`flex items-center justify-center p-2 rounded-full 
                                    ${responseType === 'Success' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                                {responseType === 'Success' ? (
                                    <MdDone className="text-xl text-emerald-600" />
                                ) : (
                                    <MdError className="text-xl text-rose-600" />
                                )}
                            </div>

                            <div className="flex-1">
                                <h3 className={`text-base font-semibold mb-1
                                    ${responseType === 'Success' ? 'text-emerald-800' : 'text-rose-800'}`}>
                                    {responseType === 'Success' ? "Successfully sent!" : "Action required"}
                                </h3>

                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {responseType === 'Success'
                                        ? (
                                            <>
                                                <p>{successMessage.message}</p>
                                            </>
                                        )
                                        :
                                        (
                                            <>
                                                <p>{errorMessage.message}</p>
                                            </>
                                        )
                                    }
                                </p>

                                <div className="mt-3 flex items-center gap-2">
                                    {responseType === 'Success' ? (
                                        <button className="text-xs font-medium text-emerald-700 hover:text-emerald-900 underline">
                                            Done
                                        </button>
                                    ) : (
                                        <button className="text-xs font-medium text-rose-700 hover:text-rose-900 underline">
                                            Retry Now
                                        </button>
                                    )}
                                    <span className="text-gray-400">|</span>
                                    <button
                                        className="text-xs font-medium text-gray-500 hover:text-gray-700 underline"
                                        onClick={() => setToast(false)}>
                                        Dismiss
                                    </button>
                                </div>
                            </div>

                            <MdClose
                                onClick={() => setToast(false)}
                                className="cursor-pointer text-lg text-gray-400 hover:text-gray-600 transition mt-0.5"
                            />
                        </div>
                    </div>
                </>
            )}

            <div className="w-full md:flex justify-between items-center bg-gray-100 px-4">
                <div className="w-full md:w-6/12 flex items-center gap-3 px-4 rounded-lg">
                    <h1 className="text-sm font-semibold text-gray-700">Show</h1>
                    <select
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="px-3 py-1 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="15">15</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value={totalStaffs}>All</option>
                    </select>
                    <h1 className="text-sm font-semibold text-gray-700">staffs</h1>
                    <p className="text-sm text-gray-500 italic">Selected Limit: {limit}</p>
                </div>
                <div className="w-full md:w-6/12 flex bg-white items-center border-b px-4 my-2">
                    <IoSearch />
                    <Input
                        className='rounded-none border-none bg-transparent'
                        placeholder='Search staffs...'
                        value={searchQuery}
                        onChange={(e) => {
                            setCurrentPage(1);
                            setSearchQuery(e.target.value);
                        }
                        }
                    />
                </div>
            </div>

            <div className="w-full flex justify-between items-start">
                <div className="w-full bg-white">
                    <div className="w-full">
                        <div className="w-full overflow-x-auto">
                            {isLoading ? (
                                <Loader />
                            ) : (
                                <div className="w-full flex justify-center">
                                    <Table className='w-full overflow-x-auto px-4'>
                                        <TableHeader>
                                            <TableRow className='bg-gray-200 text-black'>
                                                <TableHead>Id</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Number</TableHead>
                                                <TableHead>Address</TableHead>
                                                <TableHead>CheckIn</TableHead>
                                                <TableHead>CheckOut</TableHead>
                                                <TableHead>Joined At</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Role</TableHead>
                                                {user && user.user.role === 'Gym Admin' ? (
                                                    <></>
                                                ) : (
                                                    <TableHead>Action</TableHead>
                                                )}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className='pl-4 ml-4'>
                                            {Array.isArray(staffs) && staffs.length > 0 ? (
                                                staffs.map((staff) => (
                                                    <TableRow key={staff._id}>
                                                        <TableCell className="font-medium">{staff._id}</TableCell>
                                                        <TableCell>{staff.fullName}</TableCell>
                                                        <TableCell>{staff.contactNo}</TableCell>
                                                        <TableCell>{staff.address}</TableCell>
                                                        <TableCell>{staff.checkInTime
                                                            ? new Date(staff.checkInTime).toLocaleTimeString('en-US', {
                                                                hour: 'numeric',
                                                                minute: 'numeric',
                                                                hour12: true,
                                                                timeZone: 'UTC',
                                                            })
                                                            : ''}</TableCell>
                                                        <TableCell>{staff.checkOutTime
                                                            ? new Date(staff.checkOutTime).toLocaleTimeString('en-US', {
                                                                hour: 'numeric',
                                                                minute: 'numeric',
                                                                hour12: true,
                                                                timeZone: 'UTC',
                                                            })
                                                            : ''}</TableCell>
                                                        <TableCell>{new Date(staff.joinedDate).toISOString().split("T")[0]}</TableCell>
                                                        <TableCell>{staff.status}</TableCell>
                                                        <TableCell>{staff.role}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center space-x-1">
                                                                {user && user.user.role === 'Gym Admin' ? (
                                                                    <></>
                                                                ) : (
                                                                    <Link href={`/dashboard/staffmanagement/${staff._id}`}>
                                                                        <FaUserEdit className="cursor-pointer text-lg" />
                                                                    </Link>
                                                                )}
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        {user && user.user.role === 'Gym Admin' ? (
                                                                            <></>
                                                                        ) : (
                                                                            <MdDelete className="text-red-600 cursor-pointer text-lg" />
                                                                        )}
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                This action cannot be undone. This will permanently delete staff
                                                                                account and remove data from servers.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction onClick={() => deleteStaff(staff._id)}>Continue</AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={14} className="text-center text-sm font-semibold">
                                                        No staff found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow>
                                                <TableCell className="text-left" colSpan={1}>Total Staffs</TableCell>
                                                <TableCell className="text-left font-medium">{totalStaffs}</TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </div>
                            )}
                        </div>

                        <div className='border-t border-gray-600'>
                            <div className="mt-4 px-4 md:flex justify-between items-center">
                                <p className="font-medium text-center text-sm font-gray-700">
                                    Showing <span className="font-semibold text-sm font-gray-700">{startEntry}</span> to <span className="font-semibold text-sm font-gray-700">{endEntry}</span> of <span className="font-semibold">{totalStaffs}</span> entries
                                </p>
                                <Pagination
                                    total={totalPages}
                                    page={currentPage || 1}
                                    onChange={setCurrentPage}
                                    withEdges={true}
                                    siblings={1}
                                    boundaries={1}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {
                    openForm && (
                        <>
                            <div className="fixed inset-0 bg-black bg-opacity-85 z-40"></div>
                            <div className="fixed inset-0 z-40 flex items-center justify-center">
                                <div className="w-full flex justify-center">
                                    <div className="w-11/12 md:w-8/12 h-full overflow-y-auto bg-white rounded-2xl shadow-2xl">
                                        <div className="w-full flex justify-between bg-indigo-500 items-center py-2">
                                            <h1 className="font-bold m-3 text-white text-md md:text-xl">Staff Registration</h1>
                                            <MdClose className="m-4 h-6 w-6 cursor-pointer text-white" onClick={() => setOpenForm(!openForm)} />
                                        </div>
                                        <div className="w-full md:flex md:justify-center md:items-center">
                                            <form className="w-full max-h-[90vh] p-4 transition-transform duration-500 overflow-y-auto" onSubmit={handleSubmit(handleSubmitStaff)}>
                                                <div>

                                                    {/* Progress bar */}
                                                    <div className="px-6 mb-6 pt-4">
                                                        <div className="h-2 bg-gray-200 rounded-full">
                                                            <div
                                                                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                                                                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                                                            />
                                                        </div>
                                                        <div className="flex justify-between mt-2 text-sm text-gray-500">
                                                            {Array.from({ length: totalSteps }).map((_, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className={`flex items-center ${idx + 1 <= currentStep ? 'text-indigo-600' : ''
                                                                        }`}
                                                                >
                                                                    <CheckCircle2 size={16} className="mr-1" />
                                                                    Step {idx + 1}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>


                                                </div>
                                                <div className="rounded-md">
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {currentStep === 1 && (
                                                            <div>
                                                                <div className="flex items-center space-x-2 mb-4">
                                                                    <FiUser className="w-6 h-6 text-indigo-500" />
                                                                    <h1 className="text-lg font-semibold text-indigo-500">Personal Information</h1>
                                                                </div>

                                                                <div className="grid border-b pb-4 border-indigo-500 grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                                                    <div>
                                                                        <Label>Full Name</Label>
                                                                        <Controller
                                                                            name="fullName"
                                                                            control={control}
                                                                            render={({ field }) => (
                                                                                <Input
                                                                                    {...field}
                                                                                    value={field.value}
                                                                                    {...register("fullName")}
                                                                                    onChange={(e) => {
                                                                                        field.onChange(e)
                                                                                    }}
                                                                                    className="rounded-md focus:outline-none"
                                                                                    placeholder="Full Name"
                                                                                />
                                                                            )}
                                                                        />
                                                                        {errors.fullName && (
                                                                            <p className="text-red-600 font-semibold text-sm">{errors.fullName.message}</p>
                                                                        )}
                                                                    </div>

                                                                    <div>
                                                                        <Label>Date Of Birth</Label>
                                                                        <Controller
                                                                            name="dob"
                                                                            control={control}
                                                                            render={({ field }) => (
                                                                                <Input
                                                                                    {...field}
                                                                                    value={field.value}
                                                                                    onChange={(e) => {
                                                                                        field.onChange(e)
                                                                                    }}
                                                                                    {...register("dob")}
                                                                                    type="date"
                                                                                    className="rounded-md focus:outline-none"
                                                                                />
                                                                            )}
                                                                        />
                                                                        {errors.dob && (
                                                                            <p className="text-red-600 font-semibold text-sm">{errors.dob.message}</p>
                                                                        )}
                                                                    </div>

                                                                    <div>
                                                                        <Label>Gender</Label>
                                                                        <Controller
                                                                            name="gender"
                                                                            control={control}
                                                                            render={({ field }) => (
                                                                                <select
                                                                                    {...field}
                                                                                    value={field.value}
                                                                                    onChange={(e) => {
                                                                                        setValue('gender', e.target.value);
                                                                                        field.onChange(e);
                                                                                        clearErrors('gender');
                                                                                    }}
                                                                                    className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                                                                >
                                                                                    <option>Select</option>
                                                                                    <option value="Male">Male</option>
                                                                                    <option value="Female">Female</option>
                                                                                    <option value="Other">Other</option>
                                                                                </select>
                                                                            )}
                                                                        />
                                                                        {errors.gender && (
                                                                            <p className="text-red-600 font-semibold text-sm">{errors.gender.message}</p>
                                                                        )}
                                                                    </div>

                                                                    <div>
                                                                        <Label>Contact Number</Label>
                                                                        <Controller
                                                                            name="contactNo"
                                                                            control={control}
                                                                            render={({ field }) => (
                                                                                <Input
                                                                                    {...field}
                                                                                    value={field.value}
                                                                                    onChange={(e) => {
                                                                                        field.onChange(e)
                                                                                    }}
                                                                                    {...register("contactNo")}
                                                                                    className="rounded-md focus:outline-none"
                                                                                    placeholder="Contact Number"
                                                                                />
                                                                            )}
                                                                        />
                                                                        {errors.contactNo && (
                                                                            <p className="text-red-600 font-semibold text-sm">{errors.contactNo.message}</p>
                                                                        )}
                                                                    </div>

                                                                    <div>
                                                                        <Label>Email Address</Label>
                                                                        <Controller
                                                                            name="email"
                                                                            control={control}
                                                                            render={({ field }) => (
                                                                                <Input
                                                                                    {...field}
                                                                                    value={field.value}
                                                                                    {...register("email")}
                                                                                    onChange={(e) => {
                                                                                        field.onChange(e)
                                                                                    }}
                                                                                    className="rounded-md focus:outline-none"
                                                                                    placeholder="Email address"
                                                                                />
                                                                            )}
                                                                        />
                                                                        {errors.email && (
                                                                            <p className="text-red-600 font-semibold text-sm">{errors.email.message}</p>
                                                                        )}
                                                                    </div>

                                                                    <div>
                                                                        <Label>Profile Picture</Label>
                                                                        <Input
                                                                            type='file'
                                                                            {...register("profilePicture")}
                                                                            className="rounded-md focus:outline-none"
                                                                            placeholder="Profile picture"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {currentStep === 2 && (
                                                            <div>
                                                                <h1 className="text-lg font-bold mb-4">Address Details</h1>

                                                                <form className="w-full space-x-6 flex justify-between">
                                                                    {/* Current Address Section */}
                                                                    <div className="w-full border-b pb-4 border-indigo-500">
                                                                        <h3 className="text-md font-semibold mb-4">Current Address</h3>
                                                                        <div className="grid md:grid-cols-2 gap-4">
                                                                            <div>
                                                                                <Label>Street Address</Label>
                                                                                <Controller
                                                                                    name='address'
                                                                                    control={control}
                                                                                    render={({ field }) => (
                                                                                        <Input
                                                                                            {...field}
                                                                                            value={field.value}
                                                                                            onChange={(e) => {
                                                                                                field.onChange(e)
                                                                                            }}
                                                                                            {...register("address")}
                                                                                            className="rounded-md focus:outline-none"
                                                                                            placeholder="Address"
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                {errors.address && (
                                                                                    <p className="text-red-600 font-semibold text-sm">{errors.address.message}</p>
                                                                                )}
                                                                            </div>
                                                                            <div>
                                                                                <Label htmlFor="currentCity">City</Label>
                                                                                <Input
                                                                                    id="currentCity"
                                                                                    placeholder="Enter city"
                                                                                    required
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <Label htmlFor="currentState">State</Label>
                                                                                <Input
                                                                                    id="currentState"
                                                                                    placeholder="Enter state"
                                                                                    required
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <Label htmlFor="currentPostalCode">Postal Code</Label>
                                                                                <Input
                                                                                    id="currentPostalCode"
                                                                                    placeholder="Enter postal code"
                                                                                    required
                                                                                />
                                                                            </div>
                                                                            <div className="md:col-span-2">
                                                                                <Label htmlFor="currentCountry">Country</Label>
                                                                                <Input
                                                                                    id="currentCountry"
                                                                                    placeholder="Enter country"
                                                                                    required
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Permanent Address Section */}
                                                                    <div className="w-full border-indigo-500 border-b pb-4">
                                                                        <div>
                                                                            <h3 className="text-md font-semibold mb-4">Permanent Address</h3>
                                                                            <div className="grid md:grid-cols-2 gap-4">
                                                                                <div>
                                                                                    <Label htmlFor="permanentStreetAddress">Street Address</Label>
                                                                                    <Input
                                                                                        id="permanentStreetAddress"
                                                                                        placeholder="Enter street address"
                                                                                        required
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <Label htmlFor="permanentCity">City</Label>
                                                                                    <Input
                                                                                        id="permanentCity"
                                                                                        placeholder="Enter city"
                                                                                        required
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <Label htmlFor="permanentState">State</Label>
                                                                                    <Input
                                                                                        id="permanentState"
                                                                                        placeholder="Enter state"
                                                                                        required
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <Label htmlFor="permanentPostalCode">Postal Code</Label>
                                                                                    <Input
                                                                                        id="permanentPostalCode"
                                                                                        placeholder="Enter postal code"
                                                                                        required
                                                                                    />
                                                                                </div>
                                                                                <div className="md:col-span-2">
                                                                                    <Label htmlFor="permanentCountry">Country</Label>
                                                                                    <Input
                                                                                        id="permanentCountry"
                                                                                        placeholder="Enter country"
                                                                                        required
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </form>
                                                            </div>
                                                        )}

                                                        {currentStep === 3 && (
                                                            <div>
                                                                <h1 className="text-lg font-semibold mb-4">Job Details</h1>

                                                                <div className="grid border-b border-indigo-500 pb-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                    <div>
                                                                        <Label>Role</Label>
                                                                        <Controller
                                                                            name='role'
                                                                            control={control}
                                                                            render={({ field }) => (
                                                                                <select
                                                                                    {...field}
                                                                                    value={field.value}
                                                                                    onChange={(e) => {
                                                                                        const selectedValue = e.target.value;
                                                                                        setValue('role', selectedValue);
                                                                                        clearErrors("role");
                                                                                        field.onChange(selectedValue);
                                                                                    }}
                                                                                    className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                                                                >
                                                                                    <option>Select</option>
                                                                                    <option value="Super Admin">Super Admin</option>
                                                                                    <option value="Gym Admin">Gym Admin</option>
                                                                                    <option value="Floor Trainer">Trainer</option>
                                                                                    <option value="Personal Trainer">Personal Trainer</option>
                                                                                    <option value="Operational Manager">Operational Manager</option>
                                                                                    <option value="HR Manager">HR Manager</option>
                                                                                    <option value="CEO">CEO</option>
                                                                                    <option value="Developer">Developer</option>
                                                                                    <option value="Intern">Intern</option>
                                                                                </select>
                                                                            )}
                                                                        />
                                                                        {errors.role && (
                                                                            <p className="text-red-600 font-semibold text-sm">{errors.role.message}</p>
                                                                        )}
                                                                    </div>

                                                                    <div>
                                                                        <Label>Joined Date</Label>
                                                                        <Controller
                                                                            name='joinedDate'
                                                                            control={control}
                                                                            render={({ field }) => (
                                                                                <Input
                                                                                    {...field}
                                                                                    value={field.value}
                                                                                    onChange={(e) => {
                                                                                        field.onChange(e)
                                                                                    }}
                                                                                    {...register("joinedDate")}
                                                                                    type="date"
                                                                                    className="rounded-md focus:outline-none"
                                                                                />
                                                                            )}

                                                                        />
                                                                        {errors.joinedDate && (
                                                                            <p className="text-red-600 font-semibold text-sm">{errors.joinedDate.message}</p>
                                                                        )}
                                                                    </div>


                                                                    <div className="w-full">
                                                                        <div className="w-full">
                                                                            <Label>Check In</Label>
                                                                            <Controller
                                                                                name="checkInTime"
                                                                                control={control}
                                                                                render={({ field }) => (
                                                                                    <Input
                                                                                        {...field}
                                                                                        {...register('checkInTime')}
                                                                                        value={field.value}
                                                                                        onChange={(e) => {
                                                                                            handleCheckInTimeChange(e);
                                                                                            field.onChange(e);
                                                                                        }}
                                                                                        type='time'
                                                                                        className="rounded-md focus:outline-none"
                                                                                    />
                                                                                )}
                                                                            />
                                                                        </div>
                                                                        {errors.checkInHour && (
                                                                            <p className="text-sm font-medium text-red-600">
                                                                                {errors.checkInHour.message}
                                                                            </p>
                                                                        )}
                                                                        {errors.checkInMinute && (
                                                                            <p className="text-sm font-medium text-red-600">
                                                                                {errors.checkInMinute.message}
                                                                            </p>
                                                                        )}
                                                                    </div>

                                                                    <div className="w-full">
                                                                        <Label>Check Out</Label>
                                                                        <Controller
                                                                            name='checkOutTime'
                                                                            control={control}
                                                                            render={({ field }) => (
                                                                                <Input
                                                                                    {...field}
                                                                                    {...register('checkOutTime')}
                                                                                    value={field.value}
                                                                                    onChange={(e) => {
                                                                                        field.onChange(e);
                                                                                        handleCheckOutTimeChange(e);
                                                                                    }}
                                                                                    className='rounded-md focus:outline-none'
                                                                                    type='time'
                                                                                />
                                                                            )}
                                                                        />
                                                                        {errors.checkOutHour && (
                                                                            <p className="text-sm font-medium text-red-600">
                                                                                {errors.checkOutHour.message}
                                                                            </p>
                                                                        )}
                                                                        {errors.checkOutMinute && (
                                                                            <p className="text-sm font-medium text-red-600">
                                                                                {errors.checkOutMinute.message}
                                                                            </p>
                                                                        )}
                                                                    </div>

                                                                    <div>
                                                                        <Label>Select Shift</Label>
                                                                        <Controller
                                                                            name='shift'
                                                                            control={control}
                                                                            render={({ field }) => (
                                                                                <select
                                                                                    {...field}
                                                                                    value={field.value}
                                                                                    onChange={(e) => {
                                                                                        const selectedValue = e.target.value
                                                                                        setValue('shift', selectedValue);
                                                                                        field.onChange(selectedValue);
                                                                                        clearErrors('shift')
                                                                                    }}
                                                                                    className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                                                                >
                                                                                    <option>Shift</option>
                                                                                    <option value="Morning">Morning</option>
                                                                                    <option value="Day">Day</option>
                                                                                    <option value="Evening">Evening</option>
                                                                                </select>
                                                                            )}
                                                                        />
                                                                        {errors.shift && (
                                                                            <p className="text-red-600 font-semibold text-sm">{errors.shift.message}</p>
                                                                        )}
                                                                    </div>

                                                                    <div>
                                                                        <Label>Working Hours</Label>
                                                                        <Controller
                                                                            name="workingHours"
                                                                            control={control}
                                                                            render={({ field }) => (
                                                                                <select
                                                                                    {...field}
                                                                                    value={field.value}
                                                                                    onChange={(e) => {
                                                                                        const selectedValue = e.target.value
                                                                                        setValue('workingHours', selectedValue);
                                                                                        clearErrors('workingHours');
                                                                                        field.onChange(selectedValue);
                                                                                    }}
                                                                                    className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                                                                >
                                                                                    <option>Select</option>
                                                                                    <option value="1 Hour">1 Hour</option>
                                                                                    <option value="2 Hours">2 Hours</option>
                                                                                    <option value="3 Hours">3 Hours</option>
                                                                                    <option value="4 Hours">4 Hours</option>
                                                                                    <option value="5 Hours">5 Hours</option>
                                                                                    <option value="6 Hours">6 Hours</option>
                                                                                    <option value="7 Hours">7 Hours</option>
                                                                                    <option value="8 Hours">8 Hours</option>
                                                                                    <option value="9 Hours">9 Hours</option>
                                                                                    <option value="10 Hours">10 Hours</option>
                                                                                </select>
                                                                            )}
                                                                        />
                                                                        {errors.workingHours && (
                                                                            <p className="text-red-600 font-semibold text-sm">{errors.workingHours.message}</p>
                                                                        )}
                                                                    </div>

                                                                    <div>
                                                                        <Label>Salary</Label>
                                                                        <Controller
                                                                            name='salary'
                                                                            control={control}
                                                                            render={({ field }) => (
                                                                                <Input
                                                                                    {...field}
                                                                                    value={field.value}
                                                                                    onChange={(e) => {
                                                                                        field.onChange(e);
                                                                                    }}
                                                                                    {...register("salary")}
                                                                                    type="text"
                                                                                    className="rounded-md focus:outline-none"
                                                                                    placeholder="Salary"
                                                                                />
                                                                            )}
                                                                        />
                                                                        {errors.salary && (
                                                                            <p className="text-red-600 font-semibold text-sm">{errors.salary.message}</p>
                                                                        )}
                                                                    </div>

                                                                    <div>
                                                                        <Label>Status</Label>

                                                                        <Controller
                                                                            name='status'
                                                                            control={control}
                                                                            render={({ field }) => (
                                                                                <select
                                                                                    {...field}
                                                                                    value={field.value}
                                                                                    onChange={(e) => {
                                                                                        const selectedValue = e.target.value;
                                                                                        setValue('status', selectedValue);
                                                                                        clearErrors('status')
                                                                                        field.onChange(selectedValue)
                                                                                    }}
                                                                                    className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                                                                >
                                                                                    <option>Status</option>
                                                                                    <option value="Active">Active</option>
                                                                                    <option value="On Leave">On Leave</option>
                                                                                    <option value="Inactive">Inactive</option>
                                                                                </select>
                                                                            )}
                                                                        />
                                                                        {errors.status && (
                                                                            <p className="text-red-600 font-semibold text-sm">{errors.status.message}</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {currentStep === 4 && (
                                                            <div className='pb-4 border-b border-indigo-500'>
                                                                <h1 className="text-lg font-semibold mb-4">Credentials</h1>

                                                                <div>
                                                                    <Label>Salary</Label>
                                                                    <Controller
                                                                        name='username'
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <Input
                                                                                {...field}
                                                                                value={field.value}
                                                                                onChange={(e) => {
                                                                                    field.onChange(e);
                                                                                }}
                                                                                {...register("username")}
                                                                                type="text"
                                                                                className="rounded-md focus:outline-none"
                                                                                placeholder="Username"
                                                                            />
                                                                        )}
                                                                    />
                                                                    {errors.username && (
                                                                        <p className="text-red-600 font-semibold text-sm">{errors.username.message}</p>
                                                                    )}
                                                                </div>

                                                                <div>
                                                                    <Label>Password</Label>
                                                                    <Controller
                                                                        name='password'
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <Input
                                                                                {...field}
                                                                                value={field.value}
                                                                                onChange={(e) => {
                                                                                    field.onChange(e);
                                                                                }}
                                                                                {...register("password")}
                                                                                type="password"
                                                                                className="rounded-md focus:outline-none"
                                                                                placeholder="Password"
                                                                            />
                                                                        )}
                                                                    />
                                                                    {errors.password && (
                                                                        <p className="text-red-600 font-semibold text-sm">{errors.password.message}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {currentStep === 5 && (
                                                            <div className='border-b pb-4 border-indigo-500'>
                                                                <h1 className="text-lg font-semibold mb-4">Emergency Contact</h1>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div>
                                                                        <Label>Emergency Contact Name</Label>
                                                                        <Controller
                                                                            name='emergencyName'
                                                                            control={control}
                                                                            render={({ field }) => (
                                                                                <Input
                                                                                    {...field}
                                                                                    value={field.value}
                                                                                    onChange={(e) => {
                                                                                        field.onChange(e)
                                                                                    }}
                                                                                    {...register("emergencyName")}
                                                                                    className="rounded-md focus:outline-none"
                                                                                    placeholder="Emergency Contact Name"
                                                                                />
                                                                            )}
                                                                        />
                                                                        {errors.emergencyName && (
                                                                            <p className="text-red-600 font-semibold text-sm">{errors.emergencyName.message}</p>
                                                                        )}

                                                                        <div>
                                                                            <Label>Emergency Contact Number</Label>
                                                                            <Controller
                                                                                name='emergencyContactNo'
                                                                                control={control}
                                                                                render={({ field }) => (
                                                                                    <Input
                                                                                        {...field}
                                                                                        value={field.value}
                                                                                        onChange={(e) => {
                                                                                            field.onChange(e)
                                                                                        }}
                                                                                        {...register("emergencyContactNo")}
                                                                                        className="rounded-md focus:outline-none"
                                                                                        placeholder="Emergency Contact No"
                                                                                    />
                                                                                )}
                                                                            />
                                                                            {errors.emergencyContactNo && (
                                                                                <p className="text-red-600 font-semibold text-sm">{errors.emergencyContactNo.message}</p>
                                                                            )}
                                                                        </div>

                                                                        <div>
                                                                            <Label>Relationship</Label>
                                                                            <Controller
                                                                                name='relationship'
                                                                                control={control}
                                                                                render={({ field }) => (
                                                                                    <Input
                                                                                        {...field}
                                                                                        value={field.value}
                                                                                        onChange={(e) => {
                                                                                            field.onChange(e)
                                                                                        }}
                                                                                        {...register("relationship")}
                                                                                        className="rounded-md focus:outline-none"
                                                                                        placeholder="Relationship"
                                                                                    />
                                                                                )}
                                                                            />
                                                                            {errors.relationship && (
                                                                                <p className="text-red-600 font-semibold text-sm">{errors.relationship.message}</p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                    </div>
                                                </div>

                                                <div className='flex justify-between items-center my-4'>
                                                    <button
                                                        onClick={handlePrev}
                                                        disabled={currentStep === 1}
                                                        type='button'
                                                        className={`flex items-center px-4 py-2 rounded-sm transition-colors duration-100 
                                                            ${currentStep === 1
                                                                ? 'cursor-not-allowed text-gray-400'
                                                                : 'cursor-pointer hover:bg-gray-100 text-black'
                                                            }`}
                                                    ><ChevronLeft />Previous</button>

                                                    {currentStep < totalSteps && (
                                                        <button onClick={handleNext} type='button' className='cursor-pointer flex items-center bg-indigo-500 rounded-sm text-white px-4 py-2'>Next <ChevronRight /></button>
                                                    )}

                                                    {currentStep === totalSteps && (
                                                        <button type='submit' className='bg-green-600 px-4 py-2 rounded-sm text-white'>Submit</button>
                                                    )}
                                                </div>

                                            </form>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }
            </div>
        </div>
    );
};

export default StaffManagement;
