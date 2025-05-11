'use client';

import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RiUserAddFill } from "react-icons/ri";
import {
    Calendar,
    Dumbbell,
    Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MdContactEmergency, MdImage } from "react-icons/md";
import { MdSecurity } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";
import { FaLocationDot } from "react-icons/fa6";
import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { FiUser } from "react-icons/fi";
import { toast as toastMessage } from "react-hot-toast";
import { FcSettings } from "react-icons/fc";
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
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdDelete, MdClose, MdMenu, MdDone, MdError } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import * as React from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { PlusCircle } from "lucide-react";
import { TiUserAdd } from "react-icons/ti";
import Link from "next/link.js";
import { usePagination } from "@/hooks/Pagination.js";
import Loader from "@/components/Loader/Loader.jsx";
import { useRouter } from 'next/navigation.js';
import { useEffect } from "react";
import EditStaffDetails from "./editStaffDetails";

const StaffManagement = () => {

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
        control,
        setValue,
        setError,
        clearErrors,
        watch
    } = useForm();

    const [shifts, setShifts] = useState([{ id: 1, role: '', type: '', checkIn: '', checkOut: '' }]);
    const numberOfShifts = watch('numberOfShifts') || 1;
    const defaultStaffAvatar = '/images/defaultavatar.jpg';
    const [renderAvatarAlert, setRenderAvatarAlert] = useState(false);


    // Update shifts array when number of shifts changes
    useEffect(() => {
        const shiftCount = parseInt(numberOfShifts, 10);
        if (!isNaN(shiftCount) && shiftCount > 0) {
            // Preserve existing shift data when possible
            if (shiftCount > shifts.length) {
                // Add new shifts
                const newShifts = [...shifts];
                for (let i = shifts.length + 1; i <= shiftCount; i++) {
                    newShifts.push({ id: i, type: '', checkIn: '', checkOut: '' });
                }
                setShifts(newShifts);
            } else if (shiftCount < shifts.length) {
                // Remove excess shifts
                setShifts(shifts.slice(0, shiftCount));
            }
        }
    }, [numberOfShifts]);

    // Update form values when shifts change
    useEffect(() => {
        shifts.forEach((shift, index) => {
            setValue(`shift_${index + 1}_type`, shift.type);
            setValue(`shift_${index + 1}_checkIn`, shift.checkIn);
            setValue(`shift_${index + 1}_checkOut`, shift.checkOut);
        });
    }, [shifts, setValue]);

    // Handle shift type change
    const handleShiftRoleChange = (index, value) => {
        const updatedShifts = [...shifts];
        updatedShifts[index].role = value;
        setShifts(updatedShifts);
        setValue(`shift_${index + 1}_role`, value);
        clearErrors(`shift_${index + 1}_role`);
    };

    const handleShiftTypeChange = (index, value) => {
        const updatedShifts = [...shifts];
        updatedShifts[index].type = value;
        setShifts(updatedShifts);
        setValue(`shift_${index + 1}_type`, value);
        clearErrors(`shift_${index + 1}_type`);
    };

    // Handle check-in time change
    const handleCheckInChange = (index, value) => {
        const updatedShifts = [...shifts];
        updatedShifts[index].checkIn = value;
        setShifts(updatedShifts);
        setValue(`shift_${index + 1}_checkIn`, value);
        clearErrors(`shift_${index + 1}_checkIn`);
    };

    // Handle check-out time change
    const handleCheckOutChange = (index, value) => {
        const updatedShifts = [...shifts];
        updatedShifts[index].checkOut = value;
        setShifts(updatedShifts);
        setValue(`shift_${index + 1}_checkOut`, value);
        clearErrors(`shift_${index + 1}_checkOut`);
    };

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
    let [staffImage, setStaffImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const [renderImage, setRenderImage] = useState(false);
    const [dbImage, setDbImage] = useState(null);

    const [checkInTime, setCheckInTime] = useState(null);
    const [checkOutTime, setCheckOutTime] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(15);
    const [currentStaffId, setCurrentStaffId] = useState();
    const [searchQuery, setSearchQuery] = useState();

    const queryclient = useQueryClient();
    const [openForm, setOpenForm] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const [showAddressDetails, setShowAddressDetails] = useState(false);
    const [showShiftDetails, setShowShiftDetails] = useState(false);

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

    // Functions

    const setDefaultStaffAvatar = async () => {
        setValidating(false);
        const response = await fetch(defaultStaffAvatar);
        const blob = await response.blob();

        const file = new File([blob], 'defaultavatar.jpg', { type: blob.type });
        setRenderAvatarAlert(false);
        setStaffImage(file)
        return file;
    }

    const handleUpload = async () => {
        if (!staffImage) {
            toastMessage.error('Staff image is not selected');
            setRenderAvatarAlert(true);
            return;
        }
        const formData = new FormData();
        formData.append("staffImage", staffImage);

        try {
            const response = await fetch("http://88.198.115.156:3000/api/staffsmanagement/upload-image", {
                method: "POST",
                body: formData,
            });

            const responseBody = await response.json();
            if (response.ok) {
                const { imageUrl, message } = responseBody;
                setValue('imageUrl', imageUrl);
                toastMessage.success(responseBody.message);
            } else {
                toastMessage.error(responseBody.message);
            };
            return responseBody;
        } catch (error) {
            console.log("Error: ", error.message);
            toastMessage.error(error.message);
        }
    };

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
            const response = await fetch(`http://88.198.115.156:3000/api/staffsmanagement?page=${page}&limit=${limit}&staffSearchQuery=${searchQuery}`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const { data, isLoading } = useQuery({
        queryKey: ['staffs', currentPage, searchQuery || '', limit],
        queryFn: fetchAllStaffs,
        keepPreviousData: true,
    });

    const { staffs, totalPages, totalStaffs, gymAdmins, gymTrainers, personalTrainers } = data || {}

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

    const [validating, setValidating] = useState(false);
    const runDataValidation = async () => {
        try {
            setValidating(true);
            if (!staffImage) {
                setRenderAvatarAlert(true);
            };
            if (staffImage) {
                setValidating(false);
            }
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const handleSubmitStaff = async (data) => {

        // destructure numberOfShifts for destructuring shift object
        const shifts = {};
        const { numberOfShifts } = data;

        for (let i = 1; i <= numberOfShifts; i++) {
            shifts[`shift_${i}_role`] = data[`shift_${i}_role`] || "";
            shifts[`shift_${i}_checkIn`] = data[`shift_${i}_checkIn`] || "";
            shifts[`shift_${i}_checkOut`] = data[`shift_${i}_checkOut`] || "";
            shifts[`shift_${i}_type`] = data[`shift_${i}_type`] || "";
        };

        const { imageUrl, message } = await handleUpload();

        // destructure fields from data
        const {
            fullName,
            dob,
            gender,
            contactNo,
            email,
            currentAddress,
            permanentAddress,
            role,
            joinedDate,
            salary,
            status,
            username,
            password,
            emergencyContactName,
            emergencyContactNo,
            relationship
        } = data;

        const finalData = {
            fullName,
            dob,
            gender,
            contactNo,
            email,
            imageUrl,
            currentAddress,
            permanentAddress,
            role,
            joinedDate,
            numberOfShifts,
            salary,
            status,
            shifts,
            username,
            password,
            emergencyContactName,
            emergencyContactNo,
            relationship
        };

        try {
            const url = currentStaffId
                ? `http://88.198.115.156:3000/api/staffsmanagement/changedetails/${currentStaffId}`
                : 'http://88.198.115.156:3000/api/staffsmanagement/create';

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
            const response = await fetch(`http://88.198.115.156:3000/api/staffsmanagement/remove/${id}`, {
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

    const [editStaff, setEditStaff] = useState(false);
    const [staffDetails, setStaffDetails] = useState(null);

    const editStaffDetails = async (id) => {
        try {
            const response = await fetch(`http://88.198.115.156:3000/api/staffsmanagement/${id}`);
            const responseBody = await response.json();
            if (response.ok) {
                setEditStaff(true);
                setStaffDetails(responseBody);
            };
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const populateAddressDetails = async (id) => {
        try {

            const response = await fetch(`http://88.198.115.156:3000/api/staffsmanagement/${id}`);
            const responseBody = await response.json();
            if (response.ok) {
                setShowAddressDetails(true);
            };

            // set current address value
            setValue('currentAddress.street', responseBody.staff.permanentAddress.street);
            setValue('currentAddress.city', responseBody.staff.permanentAddress.city);
            setValue('currentAddress.state', responseBody.staff.permanentAddress.state);
            setValue('currentAddress.postalCode', responseBody.staff.permanentAddress.postalCode);
            setValue('currentAddress.country', responseBody.staff.permanentAddress.country);

            // set permanent address value
            setValue('permanentAddress.street', responseBody.staff.permanentAddress.street);
            setValue('permanentAddress.city', responseBody.staff.permanentAddress.city);
            setValue('permanentAddress.state', responseBody.staff.permanentAddress.state);
            setValue('permanentAddress.postalCode', responseBody.staff.permanentAddress.postalCode);
            setValue('permanentAddress.country', responseBody.staff.permanentAddress.country);
        } catch (error) {
            toastMessage.error('Something went wrong!');
        };
    };

    const populateShiftDetails = async (id) => {
        try {
            const response = await fetch(`http://88.198.115.156:3000/api/staffsmanagement/${id}`);
            const responseBody = await response.json();

            if (response.ok) {
                const dbShifts = responseBody.staff.shifts;

                if (dbShifts) {
                    // Convert shifts object into an array
                    const shiftArray = Object.keys(dbShifts)
                        .filter((key) => key.includes("shift_"))
                        .reduce((acc, key) => {
                            const match = key.match(/shift_(\d+)_(\w+)/);
                            if (match) {
                                const index = parseInt(match[1]) - 1;
                                const field = match[2];

                                if (!acc[index]) acc[index] = {};
                                acc[index][field] = dbShifts[key];
                            }
                            return acc;
                        }, []);

                    setShifts(shiftArray);
                    setShowShiftDetails(true);
                }
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

    const renderStaffImage = async (id) => {
        try {
            const response = await fetch(`http://88.198.115.156:3000/api/staffsmanagement/${id}`);
            const responseBody = await response.json();
            if (response.ok) {
                setRenderImage(true);
                setDbImage(responseBody.staff.imageUrl);
            };
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    // Sorting handler
    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    return (
        <div className="w-full">
            <div className='w-full'
                onClick={() => {
                    setToast(false);
                    setDeleting(false);
                    setShowAddressDetails(false);
                    setShowShiftDetails(false);
                }}>

                <div className="p-6">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-1">
                                        <BreadcrumbEllipsis className="h-4 w-4" />
                                    </DropdownMenuTrigger>
                                </DropdownMenu>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/docs/components">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Staff Management</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="flex justify-between border-b border-gray-500 items-center p-4">
                    <h1 className="text-xl font-bold">Staff Management</h1>
                    <Button className='rounded-sm' onClick={() => {
                        reset();
                        setOpenForm(!openForm);
                    }
                    }><RiUserAddFill className="h-6 w-6" />Add New Staff</Button>
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

            {/* Render staff details edit form */}
            {editStaff && (
                <EditStaffDetails staff={staffDetails} editStaff={editStaff} setEditStaff={setEditStaff} />
            )}

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{staffs ? staffs.length : 'Null'}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Gym Admins</CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{gymAdmins ? gymAdmins.length : 'Null'}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Personal Trainers</CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{personalTrainers ? personalTrainers.length : 'Null'}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Gym Trainers</CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{gymTrainers ? gymTrainers.length : 'Null'}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="w-full flex justify-center">
                <div className="w-full border mx-4 rounded-lg">
                    <div className="w-full md:flex justify-between items-center px-4">
                        <div className="w-full md:w-6/12 flex py-2 md:py-0 items-center gap-3 rounded-lg">
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
                        <div className="w-full md:w-6/12 flex bg-white items-center border rounded-lg active:border-indigo-600 px-4 my-2">
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
                                                        <TableHead>Avatar</TableHead>
                                                        <TableHead>Name</TableHead>
                                                        <TableHead className='text-center'>Contact</TableHead>
                                                        <TableHead className='text-center'>Address</TableHead>
                                                        <TableHead className='text-center'>No Of Shifts</TableHead>
                                                        <TableHead className='text-center'>Shift Details</TableHead>
                                                        <TableHead className='text-center'>Joined At</TableHead>
                                                        <TableHead className='text-center'>Status</TableHead>
                                                        <TableHead className='text-center'>Role</TableHead>
                                                        {user && user.user.role === 'Gym Admin' ? (
                                                            <></>
                                                        ) : (
                                                            <TableHead className='text-center'>Action</TableHead>
                                                        )}
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody className='pl-4 ml-4'>
                                                    {Array.isArray(staffs) && staffs.length > 0 ? (
                                                        staffs.map((staff) => (
                                                            <TableRow key={staff._id}>
                                                                <TableCell className='font-semibold'>
                                                                    <img
                                                                        onClick={() => renderStaffImage(staff._id)}
                                                                        src={`http://http://88.198.115.156:3000:5000${staff.imageUrl}`}
                                                                        className="w-10 h-10 cursor-pointer rounded-full border border-indigo-500"
                                                                    />
                                                                </TableCell>
                                                                <TableCell className='font-semibold'>{staff.fullName}</TableCell>
                                                                <TableCell className='text-center'>
                                                                    <p className="flex flex-col text-[11px] items-center">
                                                                        <span className="text-sm">
                                                                            {staff.contactNo}
                                                                        </span>
                                                                        <span className="text-sm">
                                                                            {staff.email}
                                                                        </span>
                                                                    </p></TableCell>
                                                                <TableCell className='text-center'>
                                                                    <p
                                                                        onClick={() => populateAddressDetails(staff._id)}
                                                                        className="text-center text-sm font-semibold text-indigo-600 cursor-pointer">View</p></TableCell>
                                                                <TableCell className='text-center'>{staff.numberOfShifts}</TableCell>
                                                                <TableCell className='text-center'><p className='text-center text-sm font-semibold text-indigo-600 cursor-pointer'
                                                                    onClick={() => populateShiftDetails(staff._id)}
                                                                >View</p></TableCell>
                                                                <TableCell className='text-center'>{new Date(staff.joinedDate).toISOString().split("T")[0]}</TableCell>
                                                                <TableCell className='text-center'> <p className={`text-center ${staff.status === 'Active' ? 'bg-green-400' : ''} ${staff.status === 'Inactive' ? 'bg-red-400' : ''} ${staff.status === 'On Leave' ? 'bg-yellow-400' : ''} rounded-3xl`}>{staff.status}</p> </TableCell>
                                                                <TableCell className='text-center'>{staff.role}</TableCell>
                                                                <TableCell className='text-end items-end'>
                                                                    <div className="flex items-end justify-center space-x-1">
                                                                        {user && user.user.role === 'Gym Admin' ? (
                                                                            <></>
                                                                        ) : (
                                                                            <FaUserEdit className="cursor-pointer text-lg" onClick={() => editStaffDetails(staff._id)} />
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
                                                        <div className='my-4'>
                                                            <TableCell className="text-left" colSpan={1}>Total Staffs</TableCell>
                                                            <TableCell className="text-left font-medium">{totalStaffs}</TableCell>
                                                        </div>
                                                    </TableRow>
                                                </TableFooter>
                                            </Table>
                                        </div>
                                    )}
                                </div>

                                <div className='border-t border-gray-600'>
                                    <div className="my-2 px-4 md:flex justify-between items-center">
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

                        {/* Render address and shift details of staff */}
                        {showAddressDetails && (
                            <div className="fixed inset-0 bg-black bg-opacity-70 z-50">
                                <div className="fixed inset-0 flex justify-center items-center">
                                    <div className="bg-white rounded-md p-4">
                                        <div>
                                            <div className="flex justify-between items-center space-x-2 mb-4 bg-white">
                                                <div className="flex items-center">
                                                    <FaLocationDot className="w-6 h-6 text-indigo-500" />
                                                    <h1 className="text-lg font-semibold text-indigo-500">Address Details</h1>
                                                </div>
                                                <MdClose className="h-6 w-6 cursor-pointer" onClick={() => setShowAddressDetails(false)} />
                                            </div>

                                            <form className="w-full space-x-6 flex justify-between">
                                                {/* Current Address Section */}
                                                <div className="w-full border-b pb-4 border-indigo-500">
                                                    <h3 className="text-md font-semibold mb-4">Current Address</h3>
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label>Street Address</Label>
                                                            <Controller
                                                                name="currentAddress.street"
                                                                control={control}
                                                                defaultValue=""
                                                                render={({ field }) => (
                                                                    <Input {...field} placeholder="Enter street address" className="rounded-md focus:outline-none" />
                                                                )}
                                                            />
                                                            {errors.currentAddress?.street && <p className="text-red-600 font-semibold text-sm">{errors.currentAddress.street.message}</p>}
                                                        </div>
                                                        <div>
                                                            <Label>City</Label>
                                                            <Input {...register("currentAddress.city")} placeholder="Enter city" required />
                                                        </div>
                                                        <div>
                                                            <Label>State</Label>
                                                            <Input {...register("currentAddress.state")} placeholder="Enter state" required />
                                                        </div>
                                                        <div>
                                                            <Label>Postal Code</Label>
                                                            <Input {...register("currentAddress.postalCode")} placeholder="Enter postal code" required />
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <Label>Country</Label>
                                                            <Input {...register("currentAddress.country")} placeholder="Enter country" required />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Permanent Address Section */}
                                                <div className="w-full border-b pb-4 border-indigo-500">
                                                    <h3 className="text-md font-semibold mb-4">Permanent Address</h3>
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label>Street Address</Label>
                                                            <Input {...register("permanentAddress.street")} placeholder="Enter street address" required />
                                                        </div>
                                                        <div>
                                                            <Label>City</Label>
                                                            <Input {...register("permanentAddress.city")} placeholder="Enter city" required />
                                                        </div>
                                                        <div>
                                                            <Label>State</Label>
                                                            <Input {...register("permanentAddress.state")} placeholder="Enter state" required />
                                                        </div>
                                                        <div>
                                                            <Label>Postal Code</Label>
                                                            <Input {...register("permanentAddress.postalCode")} placeholder="Enter postal code" required />
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <Label>Country</Label>
                                                            <Input {...register("permanentAddress.country")} placeholder="Enter country" required />
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {showShiftDetails && (
                            <div className="fixed inset-0 bg-black bg-opacity-70 z-50">
                                <div className="fixed inset-0 flex justify-center items-center">
                                    <div className="bg-white pb-4 pr-4 pl-4 rounded-md">
                                        <div className="mt-6 mb-4">
                                            <div className="flex items-center justify-between space-x-2 mb-4">
                                                <div className="flex items-center">
                                                    <PlusCircle className="w-5 h-5 text-indigo-500" />
                                                    <h2 className="text-lg font-semibold text-indigo-500 mx-2">Shift Details</h2>
                                                </div>
                                                <MdClose className="h-6 w-6 cursor-pointer" onClick={() => setShowShiftDetails(false)} />
                                            </div>

                                            <form className="space-y-4">
                                                {shifts.map((shift, index) => (
                                                    <div key={index} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                                                        <div className="flex justify-between items-center mb-3">
                                                            <h3 className="font-medium text-indigo-600">Shift {index + 1}</h3>
                                                        </div>
                                                        <div className="grid grid-cols-4 overflow-x-auto gap-4">
                                                            <div>
                                                                <Label>Shift Role</Label>
                                                                <Input value={shift.role || ''} readOnly />
                                                            </div>
                                                            <div>
                                                                <Label>Shift Type</Label>
                                                                <Input value={shift.type || ''} readOnly />
                                                            </div>
                                                            <div>
                                                                <Label>Check In</Label>
                                                                <Input type="time" value={shift.checkIn || ''} readOnly />
                                                            </div>
                                                            <div>
                                                                <Label>Check Out</Label>
                                                                <Input type="time" value={shift.checkOut || ''} readOnly />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Show staff image */}
                        {renderImage && (
                            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50">
                                <div className="relative bg-transparent p-4">
                                    <Button
                                        onClick={() => setRenderImage(false)}
                                        className="absolute top-2 right-2 bg-red-500 text-white px-3 hover:bg-red-500 rounded-md"
                                    >
                                        <MdClose />
                                        Close
                                    </Button>
                                    <div className="flex justify-center">
                                        <img src={`http://http://88.198.115.156:3000:5000${dbImage}`} alt="Preview" className="max-w-full max-h-[80vh] rounded-xl" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {
                            openForm && (
                                <>
                                    <div className="fixed inset-0 bg-black bg-opacity-65 z-50"></div>
                                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                                        <div className="w-full flex justify-center">

                                            <div className="w-11/12 md:w-8/12 h-full overflow-y-auto bg-white rounded-2xl shadow-2xl">
                                                <div className="w-full flex justify-between bg-indigo-600 items-center py-2">
                                                    <h1 className="font-bold m-3 text-white text-md md:text-xl">Staff Registration</h1>
                                                    <MdClose className="m-4 h-6 w-6 cursor-pointer text-white" onClick={() => setOpenForm(!openForm)} />
                                                </div>
                                                <div className="w-full md:flex md:justify-center md:items-center">
                                                    <form className="w-full max-h-[90vh] p-4 transition-transform duration-500 overflow-y-auto" onSubmit={handleSubmit(handleSubmitStaff)}>
                                                        <div>

                                                            {/* Progress bar */}
                                                            <div className="mb-6 pt-4">
                                                                <div className="h-2 bg-gray-200 rounded-full">
                                                                    <div
                                                                        className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                                                                        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                                                                    />
                                                                </div>
                                                                <div className="flex justify-between mt-2 text-sm text-gray-500">
                                                                    {Array.from({ length: totalSteps }).map((_, idx) => (
                                                                        <div
                                                                            onClick={() => setCurrentStep(idx + 1)}
                                                                            key={idx}
                                                                            className={`flex items-center cursor-pointer ${idx + 1 <= currentStep ? 'text-black' : ''
                                                                                }`}
                                                                        >
                                                                            <CheckCircle2 size={16} className="mr-1" />
                                                                            Step {idx + 1}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Default image chose alert */}
                                                            {renderAvatarAlert && (
                                                                <AlertDialog open={renderAvatarAlert} onOpenChange={setRenderAvatarAlert}>
                                                                    <AlertDialogContent className="max-w-md">
                                                                        <AlertDialogHeader className="flex flex-col gap-2">
                                                                            <h1 className="font-bold ">Are you absolutely sure?</h1>
                                                                            <AlertDialogDescription className="text-sm text-start mt-2">
                                                                                Staff avatar is not selected. If you want to use your own avatar please select from form or click continue to use default.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel onClick={() => setValidating(false)} className="bg-white hover:bg-gray-50 text-black hover:text-black">
                                                                                Cancel
                                                                            </AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() => {
                                                                                    setDefaultStaffAvatar()
                                                                                    setRenderAvatarAlert(false)
                                                                                }}
                                                                            >
                                                                                Continue
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            )}

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
                                                                                    onChange={(e) => {
                                                                                        const file = e.target.files[0];
                                                                                        if (file) {
                                                                                            if (file.size > 10 * 1024 * 1024) {
                                                                                                toastMessage.error("File size must be less than 10MB")
                                                                                                return;
                                                                                            }

                                                                                            setStaffImage(file);
                                                                                            setPreview(URL.createObjectURL(file));
                                                                                        }
                                                                                    }}
                                                                                    accept="image/*"
                                                                                    className="rounded-md focus:outline-none"
                                                                                    placeholder="Profile picture"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {currentStep === 2 && (
                                                                    <div>
                                                                        <div className="flex items-center space-x-2 mb-4">
                                                                            <FaLocationDot className="w-6 h-6 text-indigo-500" />
                                                                            <h1 className="text-lg font-semibold text-indigo-500">Address Details</h1>
                                                                        </div>

                                                                        <div className="w-full space-x-6 flex justify-between">
                                                                            {/* Current Address Section */}
                                                                            <div className="w-full border-b pb-4 border-indigo-500">
                                                                                <h3 className="text-md font-semibold mb-4">Current Address</h3>
                                                                                <div className="grid md:grid-cols-2 gap-4">
                                                                                    <div>
                                                                                        <Label>Street Address</Label>
                                                                                        <Controller
                                                                                            name="currentAddress.street"
                                                                                            control={control}
                                                                                            defaultValue=""
                                                                                            render={({ field }) => (
                                                                                                <Input {...field} placeholder="Enter street address" className="rounded-md focus:outline-none" />
                                                                                            )}
                                                                                        />
                                                                                        {errors.currentAddress?.street && <p className="text-red-600 font-semibold text-sm">{errors.currentAddress.street.message}</p>}
                                                                                    </div>
                                                                                    <div>
                                                                                        <Label>City</Label>
                                                                                        <Input {...register("currentAddress.city")} placeholder="Enter city" required />
                                                                                    </div>
                                                                                    <div>
                                                                                        <Label>State</Label>
                                                                                        <Input {...register("currentAddress.state")} placeholder="Enter state" required />
                                                                                    </div>
                                                                                    <div>
                                                                                        <Label>Postal Code</Label>
                                                                                        <Input {...register("currentAddress.postalCode")} placeholder="Enter postal code" required />
                                                                                    </div>
                                                                                    <div className="md:col-span-2">
                                                                                        <Label>Country</Label>
                                                                                        <Input {...register("currentAddress.country")} placeholder="Enter country" required />
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {/* Permanent Address Section */}
                                                                            <div className="w-full border-b pb-4 border-indigo-500">
                                                                                <h3 className="text-md font-semibold mb-4">Permanent Address</h3>
                                                                                <div className="grid md:grid-cols-2 gap-4">
                                                                                    <div>
                                                                                        <Label>Street Address</Label>
                                                                                        <Input {...register("permanentAddress.street")} placeholder="Enter street address" required />
                                                                                    </div>
                                                                                    <div>
                                                                                        <Label>City</Label>
                                                                                        <Input {...register("permanentAddress.city")} placeholder="Enter city" required />
                                                                                    </div>
                                                                                    <div>
                                                                                        <Label>State</Label>
                                                                                        <Input {...register("permanentAddress.state")} placeholder="Enter state" required />
                                                                                    </div>
                                                                                    <div>
                                                                                        <Label>Postal Code</Label>
                                                                                        <Input {...register("permanentAddress.postalCode")} placeholder="Enter postal code" required />
                                                                                    </div>
                                                                                    <div className="md:col-span-2">
                                                                                        <Label>Country</Label>
                                                                                        <Input {...register("permanentAddress.country")} placeholder="Enter country" required />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {currentStep === 3 && (
                                                                    <div>
                                                                        <div className="flex items-center space-x-2 mb-4">
                                                                            <TbListDetails className="w-6 h-6 text-indigo-500" />
                                                                            <h1 className="text-lg font-semibold text-indigo-500">Job Details</h1>
                                                                        </div>

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

                                                                            <div>
                                                                                <Label>No. Of Shifts</Label>
                                                                                <Controller
                                                                                    name='numberOfShifts'
                                                                                    control={control}
                                                                                    render={({ field }) => (
                                                                                        <Input
                                                                                            {...field}
                                                                                            type='number'
                                                                                            min="1"
                                                                                            max="5"
                                                                                            placeholder='Enter Number Of Shifts'
                                                                                            className="rounded-md focus:outline-none"
                                                                                            onChange={(e) => {
                                                                                                const value = Math.min(Math.max(parseInt(e.target.value) || 1, 1), 5);
                                                                                                field.onChange(value);
                                                                                                setValue('numberOfShifts', value);
                                                                                            }}
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                {errors.numberOfShifts && (
                                                                                    <p className="text-red-600 font-semibold text-sm">{errors.numberOfShifts.message}</p>
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

                                                                        {/* Dynamic Shifts Section */}
                                                                        <div className="mt-6 mb-4">
                                                                            <div className="flex items-center space-x-2 mb-4">
                                                                                <PlusCircle className="w-5 h-5 text-indigo-500" />
                                                                                <h2 className="text-lg font-semibold text-indigo-500">Shift Details</h2>
                                                                            </div>

                                                                            <div className="space-y-4">
                                                                                {shifts.map((shift, index) => (
                                                                                    <div key={shift.id} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                                                                                        <div className="flex justify-between items-center mb-3">
                                                                                            <h3 className="font-medium text-indigo-600">Shift {index + 1}</h3>
                                                                                        </div>
                                                                                        <div className="grid grid-cols-4 overflow-x-auto gap-4">
                                                                                            <div>
                                                                                                <Label>Shift Role</Label>
                                                                                                <Controller
                                                                                                    name={`shift_${index + 1}_role`}
                                                                                                    control={control}
                                                                                                    defaultValue={shift.role}
                                                                                                    render={({ field }) => (
                                                                                                        <select
                                                                                                            {...field}
                                                                                                            value={field.value}
                                                                                                            onChange={(e) => {
                                                                                                                const selectedValue = e.target.value;
                                                                                                                handleShiftRoleChange(index, selectedValue);
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
                                                                                                {errors[`shift_${index + 1}_role`] && (
                                                                                                    <p className="text-red-600 font-semibold text-sm">{errors[`shift_${index + 1}_role`].message}</p>
                                                                                                )}
                                                                                            </div>

                                                                                            <div>
                                                                                                <Label>Shift Type</Label>
                                                                                                <Controller
                                                                                                    name={`shift_${index + 1}_type`}
                                                                                                    control={control}
                                                                                                    defaultValue={shift.type}
                                                                                                    render={({ field }) => (
                                                                                                        <select
                                                                                                            {...field}
                                                                                                            value={field.value}
                                                                                                            onChange={(e) => {
                                                                                                                const selectedValue = e.target.value;
                                                                                                                handleShiftTypeChange(index, selectedValue);
                                                                                                                field.onChange(selectedValue);
                                                                                                            }}
                                                                                                            className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                                                                                        >
                                                                                                            <option value="">Select Shift</option>
                                                                                                            <option value="Morning">Morning</option>
                                                                                                            <option value="Day">Day</option>
                                                                                                            <option value="Evening">Evening</option>
                                                                                                        </select>
                                                                                                    )}
                                                                                                />
                                                                                                {errors[`shift_${index + 1}_type`] && (
                                                                                                    <p className="text-red-600 font-semibold text-sm">{errors[`shift_${index + 1}_type`].message}</p>
                                                                                                )}
                                                                                            </div>

                                                                                            <div>
                                                                                                <Label>Check In</Label>
                                                                                                <Controller
                                                                                                    name={`shift_${index + 1}_checkIn`}
                                                                                                    control={control}
                                                                                                    defaultValue={shift.checkIn}
                                                                                                    render={({ field }) => (
                                                                                                        <Input
                                                                                                            {...field}
                                                                                                            type="time"
                                                                                                            value={field.value}
                                                                                                            onChange={(e) => {
                                                                                                                handleCheckInChange(index, e.target.value);
                                                                                                                field.onChange(e);
                                                                                                            }}
                                                                                                            className="rounded-md focus:outline-none"
                                                                                                        />
                                                                                                    )}
                                                                                                />
                                                                                                {errors[`shift_${index + 1}_checkIn`] && (
                                                                                                    <p className="text-red-600 font-semibold text-sm">{errors[`shift_${index + 1}_checkIn`].message}</p>
                                                                                                )}
                                                                                            </div>

                                                                                            <div>
                                                                                                <Label>Check Out</Label>
                                                                                                <Controller
                                                                                                    name={`shift_${index + 1}_checkOut`}
                                                                                                    control={control}
                                                                                                    defaultValue={shift.checkOut}
                                                                                                    render={({ field }) => (
                                                                                                        <Input
                                                                                                            {...field}
                                                                                                            type="time"
                                                                                                            value={field.value}
                                                                                                            onChange={(e) => {
                                                                                                                handleCheckOutChange(index, e.target.value);
                                                                                                                field.onChange(e);
                                                                                                            }}
                                                                                                            className="rounded-md focus:outline-none"
                                                                                                        />
                                                                                                    )}
                                                                                                />
                                                                                                {errors[`shift_${index + 1}_checkOut`] && (
                                                                                                    <p className="text-red-600 font-semibold text-sm">{errors[`shift_${index + 1}_checkOut`].message}</p>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {currentStep === 4 && (
                                                                    <div className='pb-4 border-b border-indigo-500'>
                                                                        <div className="flex items-center space-x-2 mb-4">
                                                                            <MdSecurity className="w-6 h-6 text-indigo-500" />
                                                                            <h1 className="text-lg font-semibold text-indigo-500">Credentials</h1>
                                                                        </div>

                                                                        <div>
                                                                            <Label>Username</Label>
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
                                                                        <div className="flex items-center space-x-2 mb-4">
                                                                            <MdContactEmergency className="w-6 h-6 text-indigo-500" />
                                                                            <h1 className="text-lg font-semibold text-indigo-500">Emergency Details</h1>
                                                                        </div>

                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                            <div>
                                                                                <Label>Emergency Contact Name</Label>
                                                                                <Controller
                                                                                    name='emergencyContactName'
                                                                                    control={control}
                                                                                    render={({ field }) => (
                                                                                        <Input
                                                                                            {...field}
                                                                                            value={field.value}
                                                                                            onChange={(e) => {
                                                                                                field.onChange(e)
                                                                                            }}
                                                                                            {...register("emergencyContactName")}
                                                                                            className="rounded-md focus:outline-none"
                                                                                            placeholder="Emergency Contact Name"
                                                                                        />
                                                                                    )}
                                                                                />
                                                                                {errors.emergencyContactName && (
                                                                                    <p className="text-red-600 font-semibold text-sm">{errors.emergencyContactName.message}</p>
                                                                                )}

                                                                                <div className="my-2">
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

                                                            {currentStep === totalSteps && !staffImage && (
                                                                <button
                                                                    type='button'
                                                                    className='bg-blue-600 px-4 py-2 rounded-sm text-white'
                                                                    onClick={() => runDataValidation()}
                                                                >
                                                                    {validating ? 'Wait...' : 'Run Validation'}</button>
                                                            )}

                                                            {currentStep === totalSteps && staffImage && (
                                                                <button type='submit' className='bg-green-600 px-4 py-2 rounded-sm text-white'>{isSubmitting ? 'Processing...' : 'Submit'}</button>
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
            </div>
        </div>
    );
};

export default StaffManagement;
