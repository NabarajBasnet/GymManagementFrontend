'use client'

import { MdDelete, MdEmail } from "react-icons/md";
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

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
        control,
        setValue,
        setError,
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
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const invoices = [
        {
            invoice: "INV001",
            paymentStatus: "Paid",
            totalAmount: "$250.00",
            paymentMethod: "Credit Card",
        }
    ];

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

            <div className="w-full md:flex justify-between items-center space-x-4 p-2">
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
                                        <TableHead>Check In Time</TableHead>
                                        <TableHead>Check Out Time</TableHead>
                                        <TableHead>Joined Date</TableHead>
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
                                                            </div>

                                                            <div>
                                                                <Label>Email Address</Label>
                                                                <Input
                                                                    {...register("email")}
                                                                    className="rounded-none focus:outline-none"
                                                                    placeholder="Email address"
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Contact Number</Label>
                                                                <Input
                                                                    {...register("contactNo")}
                                                                    className="rounded-none focus:outline-none"
                                                                    placeholder="Contact Number"
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Emergency Contact Number</Label>
                                                                <Input
                                                                    {...register("emergencyContactNo")}
                                                                    className="rounded-none focus:outline-none"
                                                                    placeholder="Emergency Contact Number"
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Address</Label>
                                                                <Input
                                                                    {...register("address")}
                                                                    className="rounded-none focus:outline-none"
                                                                    placeholder="Address"
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Date Of Birth</Label>
                                                                <Input
                                                                    {...register("dob")}
                                                                    type="date"
                                                                    className="rounded-none focus:outline-none"
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Check In</Label>
                                                                <Input
                                                                    {...register("checkInTime")}
                                                                    type="time"
                                                                    className="rounded-none focus:outline-none"
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Check out</Label>
                                                                <Input
                                                                    {...register("checkOutTime")}
                                                                    type="time"
                                                                    className="rounded-none focus:outline-none"
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Gender</Label>
                                                                <Select onValueChange={(value) => setValue(value, 'gender')}>
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
                                                            </div>

                                                            <div>
                                                                <Label>Select Shift</Label>
                                                                <Select onValueChange={(value) => setValue(value, 'shift')}>
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
                                                            </div>

                                                            <div>
                                                                <Label>Joined Date</Label>
                                                                <Input
                                                                    {...register("joinedDate")}
                                                                    type="date"
                                                                    className="rounded-none focus:outline-none"
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Working Hours</Label>
                                                                <Select onValueChange={(value) => setValue(value, 'workingHours')}>
                                                                    <SelectTrigger className="w-full rounded-none">
                                                                        <SelectValue placeholder="Working Hours" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectGroup>
                                                                            <SelectLabel>Duration</SelectLabel>
                                                                            <SelectItem value="1 Month">1 Month</SelectItem>
                                                                            <SelectItem value="3 Months">3 Months</SelectItem>
                                                                            <SelectItem value="6 Months">6 Months</SelectItem>
                                                                            <SelectItem value="12 Months">12 Months</SelectItem>
                                                                        </SelectGroup>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div>
                                                                <Label>Status</Label>
                                                                <Select onValueChange={(value) => setValue(value, 'status')}>
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
                                                            </div>

                                                            <div>
                                                                <Label>Salary</Label>
                                                                <Input
                                                                    {...register("salary")}
                                                                    type="text"
                                                                    className="rounded-none focus:outline-none"
                                                                    placeholder="Salary"
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Role</Label>
                                                                <Select onValueChange={(value) => setValue(value, 'role')}>
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
