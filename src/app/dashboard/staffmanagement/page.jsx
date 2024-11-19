'use client'

import { MdDelete, MdEmail, MdDone, MdError } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "../allmembers/allmembertable.jsx";
import { usePathname } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import * as React from 'react';
import { useQuery } from "@tanstack/react-query";
import { DataArray } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";

const AddStaff = () => {

    // States
    const [openForm, setOpenForm] = useState(false);
    const pathname = usePathname();
    const [toast, setToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState({ icon: MdDone, message: '' });
    const [errorMessage, setErrorMessage] = useState({ icon: MdError, message: '' });
    const [responseType, setResponseType] = useState('')
    const responseResultType = ['Success', 'Failure'];

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
    const fetchAllStaffs = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/staffsmanagement`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ['staffs'],
        queryFn: fetchAllStaffs
    });

    const { staffs } = data || {}

    const registerNewStaff = async (data) => {
        console.log("Data: ", data);
        const { fullName, email, contactNo, emergencyContactNo, address, dob, checkInTime, checkOutTime, gender, shift, joinedDate, workingHours, status, salary, role } = data;
        const finalData = { fullName, email, contactNo, emergencyContactNo, address, dob, checkInTime, checkOutTime, gender, shift, joinedDate, workingHours, status, salary, role };

        try {
            const response = await fetch('http://localhost:3000/api/staffsmanagement/create', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(finalData)
            })
            const responseBody = await response.json();
            console.log("Response body: ", responseBody);
            if (responseBody.errors) {
                responseBody.errors.forEach((error) => {
                    setError(error.field, {
                        type: 'manual',
                        message: error.message
                    });
                });
            }

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
            <div className='w-full p-6 bg-gray-100'>
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
                                    <span className="sr-only">Toggle menu</span>
                                </DropdownMenuTrigger>
                            </DropdownMenu>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard/staffmanagement">Staff Management</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-xl font-bold mt-3">Staff Management</h1>
            </div>

            {toast ? (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
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

            <div className="w-full md:flex justify-between items-center md:space-x-4 space-y-4 p-2">
                <Select>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Fruits</SelectLabel>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="banana">Banana</SelectItem>
                            <SelectItem value="blueberry">Blueberry</SelectItem>
                            <SelectItem value="grapes">Grapes</SelectItem>
                            <SelectItem value="pineapple">Pineapple</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Fruits</SelectLabel>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="banana">Banana</SelectItem>
                            <SelectItem value="blueberry">Blueberry</SelectItem>
                            <SelectItem value="grapes">Grapes</SelectItem>
                            <SelectItem value="pineapple">Pineapple</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Fruits</SelectLabel>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="banana">Banana</SelectItem>
                            <SelectItem value="blueberry">Blueberry</SelectItem>
                            <SelectItem value="grapes">Grapes</SelectItem>
                            <SelectItem value="pineapple">Pineapple</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

            </div>

            <div className="p-2">
                <div className="flex items-center border bg-white">
                    <CiSearch
                        className="mx-2"
                    />
                    <Input
                        className='bg-none outline-none border-none'
                        placeholder='Search staff here...'
                    />
                </div>
            </div>

            <div className="w-full flex justify-between items-start">
                <div className="w-full bg-white">
                    <div className="w-full">
                        <div className="w-full overflow-x-auto">
                            <Table className='w-full overflow-x-auto'>
                                <TableHeader>
                                    <TableRow className='bg-gray-200 text-black'>
                                        <TableHead>Staff Id</TableHead>
                                        <TableHead>Full Name</TableHead>
                                        <TableHead>Contact Number</TableHead>
                                        <TableHead>Address</TableHead>
                                        <TableHead>CheckIn</TableHead>
                                        <TableHead>CheckOut</TableHead>
                                        <TableHead>Joined At</TableHead>
                                        <TableHead>Work Hours</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Array.isArray(staffs) && staffs.length > 0 ? (
                                        staffs.map((staff) => (
                                            <TableRow key={staff._id}>
                                                <TableCell className="font-medium">{staff._id}</TableCell>
                                                <TableCell>{staff.fullName}</TableCell>
                                                <TableCell>{staff.contactNo}</TableCell>
                                                <TableCell>{staff.address}</TableCell>
                                                <TableCell>{staff.checkInTime}</TableCell>
                                                <TableCell>{staff.checkOutTime}</TableCell>
                                                <TableCell>{new Date(staff.joinedDate).toISOString().split("T")[0]}</TableCell>
                                                <TableCell>{staff.totalHoursToWork}</TableCell>
                                                <TableCell>{staff.employmentStatus}</TableCell>
                                                <TableCell>{staff.role}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <MdEmail className="cursor-pointer" />
                                                        <FaUserEdit className="cursor-pointer" />
                                                        <MdDelete className="text-red-600 cursor-pointer" />
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
                                        <TableCell colSpan={3}>Total Staffs</TableCell>
                                        <TableCell className="text-right font-medium">{staffs ? staffs.length : 0}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>

                        <div className="py-3">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious href="#" />
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#">1</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#" isActive>
                                            2
                                        </PaginationLink>
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
                    <div className="flex justify-center items-center px-5 my-6 space-x-4">
                        <Button className='rounded-none' onClick={() => setOpenForm(!openForm)}>Add New Staff</Button>
                        <Button className='rounded-none' onClick={() => setOpenForm(!openForm)}>Add New Staff</Button>
                        <Button className='rounded-none' onClick={() => setOpenForm(!openForm)}>Add New Staff</Button>
                    </div>
                    {
                        openForm && (
                            <>
                                <div className="fixed inset-0 bg-black bg-opacity-85 z-40"></div>
                                <div className="fixed inset-0 z-50 flex items-center justify-center">
                                    <div className="w-full flex justify-center">
                                        <div className="w-full md:w-10/12 h-full overflow-y-auto bg-gray-100 rounded-md shadow-2xl px-3 py-7">
                                            <div className="w-full md:flex md:justify-center md:items-center">
                                                <form className="w-full max-h-[90vh] overflow-y-auto" onSubmit={handleSubmit(registerNewStaff)}>
                                                    <div className="bg-gray-300 py-2 my-2 w-full">
                                                        <h1 className="mx-4 font-semibold">Staff Registration Information</h1>
                                                    </div>
                                                    <div className="p-4 bg-white">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                            <div>
                                                                <Label>Full Name</Label>
                                                                <Input
                                                                    {...register("fullName")}
                                                                    className="rounded-none focus:outline-none"
                                                                    placeholder="Full Name"
                                                                />
                                                                {errors.fullName && (
                                                                    <p className="text-red-600 font-semibold text-sm">{errors.fullName.message}</p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <Label>Email Address</Label>
                                                                <Input
                                                                    {...register("email")}
                                                                    className="rounded-none focus:outline-none"
                                                                    placeholder="Email address"
                                                                />
                                                                {errors.email && (
                                                                    <p className="text-red-600 font-semibold text-sm">{errors.email.message}</p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <Label>Contact Number</Label>
                                                                <Input
                                                                    {...register("contactNo")}
                                                                    className="rounded-none focus:outline-none"
                                                                    placeholder="Contact Number"
                                                                />
                                                                {errors.contactNo && (
                                                                    <p className="text-red-600 font-semibold text-sm">{errors.contactNo.message}</p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <Label>Emergency Contact Number</Label>
                                                                <Input
                                                                    {...register("emergencyContactNo")}
                                                                    className="rounded-none focus:outline-none"
                                                                    placeholder="Emergency Contact Number"
                                                                />
                                                                {errors.emergencyContactNo && (
                                                                    <p className="text-red-600 font-semibold text-sm">{errors.emergencyContactNo.message}</p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <Label>Address</Label>
                                                                <Input
                                                                    {...register("address")}
                                                                    className="rounded-none focus:outline-none"
                                                                    placeholder="Address"
                                                                />
                                                                {errors.address && (
                                                                    <p className="text-red-600 font-semibold text-sm">{errors.address.message}</p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <Label>Date Of Birth</Label>
                                                                <Input
                                                                    {...register("dob")}
                                                                    type="date"
                                                                    className="rounded-none focus:outline-none"
                                                                />
                                                                {errors.dob && (
                                                                    <p className="text-red-600 font-semibold text-sm">{errors.dob.message}</p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <Label>Check In</Label>
                                                                <Input
                                                                    {...register("checkInTime")}
                                                                    type="time"
                                                                    className="rounded-none focus:outline-none"
                                                                />
                                                                {errors.checkInTime && (
                                                                    <p className="text-red-600 font-semibold text-sm">{errors.checkInTime.message}</p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <Label>Check out</Label>
                                                                <Input
                                                                    {...register("checkOutTime")}
                                                                    type="time"
                                                                    className="rounded-none focus:outline-none"
                                                                />
                                                                {errors.checkOutTime && (
                                                                    <p className="text-red-600 font-semibold text-sm">{errors.checkOutTime.message}</p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <Label>Gender</Label>
                                                                <Select onValueChange={(value) => {
                                                                    setValue('gender', value);
                                                                    clearErrors('gender');
                                                                }}>
                                                                    <SelectTrigger className="w-full rounded-none">
                                                                        <SelectValue placeholder="Select Gender" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectGroup>
                                                                            <SelectLabel>Gender</SelectLabel>
                                                                            <SelectItem value="Male">Male</SelectItem>
                                                                            <SelectItem value="Female">Female</SelectItem>
                                                                            <SelectItem value="Other">Other</SelectItem>
                                                                        </SelectGroup>
                                                                    </SelectContent>
                                                                </Select>
                                                                {errors.gender && (
                                                                    <p className="text-red-600 font-semibold text-sm">{errors.gender.message}</p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <Label>Select Shift</Label>
                                                                <Select onValueChange={(value) => {
                                                                    setValue('shift', value);
                                                                    clearErrors('shift')
                                                                }}>
                                                                    <SelectTrigger className="w-full rounded-none">
                                                                        <SelectValue placeholder="Select Shift" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectGroup>
                                                                            <SelectLabel>Membership Type</SelectLabel>
                                                                            <SelectItem value="Morning">Morning</SelectItem>
                                                                            <SelectItem value="Day">Day</SelectItem>
                                                                            <SelectItem value="Evening">Evening</SelectItem>
                                                                        </SelectGroup>
                                                                    </SelectContent>
                                                                </Select>
                                                                {errors.shift && (
                                                                    <p className="text-red-600 font-semibold text-sm">{errors.shift.message}</p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <Label>Joined Date</Label>
                                                                <Input
                                                                    {...register("joinedDate")}
                                                                    type="date"
                                                                    className="rounded-none focus:outline-none"
                                                                />
                                                                {errors.joinedDate && (
                                                                    <p className="text-red-600 font-semibold text-sm">{errors.joinedDate.message}</p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <Label>Working Hours</Label>
                                                                <Select onValueChange={(value) => {
                                                                    setValue('workingHours', value);
                                                                    clearErrors('workingHours');
                                                                }}>
                                                                    <SelectTrigger className="w-full rounded-none">
                                                                        <SelectValue placeholder="Working Hours" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectGroup>
                                                                            <SelectLabel>Select</SelectLabel>
                                                                            <SelectItem value="2 Hours">2 Hours</SelectItem>
                                                                            <SelectItem value="5 Hours">5 Hours</SelectItem>
                                                                            <SelectItem value="6 Hours">6 Hours</SelectItem>
                                                                            <SelectItem value="7 Hours">7 Hours</SelectItem>
                                                                            <SelectItem value="8 Hours">8 Hours</SelectItem>
                                                                        </SelectGroup>
                                                                    </SelectContent>
                                                                </Select>
                                                                {errors.workingHours && (
                                                                    <p className="text-red-600 font-semibold text-sm">{errors.workingHours.message}</p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <Label>Status</Label>
                                                                <Select onValueChange={(value) => {
                                                                    setValue('status', value);
                                                                    clearErrors('status')
                                                                }}>
                                                                    <SelectTrigger className="w-full rounded-none">
                                                                        <SelectValue placeholder="Status" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectGroup>
                                                                            <SelectLabel>Duration</SelectLabel>
                                                                            <SelectItem value="Active">Active</SelectItem>
                                                                            <SelectItem value="On Leave">On Leave</SelectItem>
                                                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                                                        </SelectGroup>
                                                                    </SelectContent>
                                                                </Select>
                                                                {errors.status && (
                                                                    <p className="text-red-600 font-semibold text-sm">{errors.status.message}</p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <Label>Salary</Label>
                                                                <Input
                                                                    {...register("salary")}
                                                                    type="text"
                                                                    className="rounded-none focus:outline-none"
                                                                    placeholder="Salary"
                                                                />
                                                                {errors.salary && (
                                                                    <p className="text-red-600 font-semibold text-sm">{errors.salary.message}</p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <Label>Role</Label>
                                                                <Select onValueChange={(value) => {
                                                                    setValue('role', value);
                                                                    clearErrors("role");
                                                                }}>
                                                                    <SelectTrigger className="w-full rounded-none">
                                                                        <SelectValue placeholder="Staff Role" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectGroup>
                                                                            <SelectLabel>Select</SelectLabel>
                                                                            <SelectItem value="Gym Admin">Gym Admin</SelectItem>
                                                                            <SelectItem value="Trainer">Trainer</SelectItem>
                                                                            <SelectItem value="Personal Trainer">Personal Trainer</SelectItem>
                                                                            <SelectItem value="Super Admin">Super Admin</SelectItem>
                                                                        </SelectGroup>
                                                                    </SelectContent>
                                                                </Select>
                                                                {errors.role && (
                                                                    <p className="text-red-600 font-semibold text-sm">{errors.role.message}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-center items-center mt-5 space-x-2 p-2">
                                                        <Button variant="destructive" className="rounded-none" onClick={() => reset()}>Reset Form</Button>
                                                        <Button className="rounded-none" onClick={() => setOpenForm(!openForm)}>Close Form</Button>
                                                        <Button className="rounded-none bg-green-500 hover:bg-green-600 transition-all duration-500" type='submit'>{isSubmitting ? 'Processing...' : 'Add Staff'}</Button>
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
    );
}

export default AddStaff;
