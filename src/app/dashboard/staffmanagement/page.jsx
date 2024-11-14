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
} from "@/components/ui/table";
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

const AddStaff = () => {

    // States
    const [openForm, setOpenForm] = useState(false);
    const pathname = usePathname();

    // Functions
    const fetchAllStaffs = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/staffsmanagement`);
            const responseBody = await response.json();
            console.log("Response Body: ", responseBody);
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
    console.log("Data: ", data);

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

            <div className="w-full flex justify-between items-center p-2">
                <Select>
                    <SelectTrigger className="w-[180px]">
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
                    <SelectTrigger className="w-[180px]">
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
                    <SelectTrigger className="w-[180px]">
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
                    <SelectTrigger className="w-[180px]">
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
                    <SelectTrigger className="w-[180px]">
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
                    <SelectTrigger className="w-[180px]">
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
                        <div className="w-full">
                            <Table>
                                <TableCaption>A list of staffs.</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Staff Id</TableHead>
                                        <TableHead>Full Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Contact Number</TableHead>
                                        <TableHead>Address</TableHead>
                                        <TableHead>DOB</TableHead>
                                        <TableHead>Check In Time</TableHead>
                                        <TableHead>Check Out Time</TableHead>
                                        <TableHead>Joined Date</TableHead>
                                        <TableHead>Work Hours</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Salary</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Array.isArray(staffs) && staffs.length > 0 ? (
                                        <TableBody>
                                            {staffs.map((staff) => (
                                                <TableRow key={staff._id}>
                                                    <TableCell className="font-medium">{staff._id}</TableCell>
                                                    <TableCell>{staff.fullName}</TableCell>
                                                    <TableCell>{staff.email}</TableCell>
                                                    <TableCell>{staff.contactNo}</TableCell>
                                                    <TableCell>{staff.address}</TableCell>
                                                    <TableCell>{staff.dob}</TableCell>
                                                    <TableCell>{staff.checkInTime}</TableCell>
                                                    <TableCell>{staff.checkOutTime}</TableCell>
                                                    <TableCell>{staff.joinedDate}</TableCell>
                                                    <TableCell>{staff.totalHoursToWork}</TableCell>
                                                    <TableCell>{staff.employmentStatus}</TableCell>
                                                    <TableCell>{staff.salary}</TableCell>
                                                    <TableCell>{staff.role}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center">
                                                            <MdEmail className="cursor-pointer" />
                                                            <FaUserEdit className="cursor-pointer" />
                                                            <MdDelete className="text-red-600 cursor-pointer" />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    ) : (
                                        <div className="w-full flex justify-center">
                                            <p className="text-sm font-semibold text-center">No staff found.</p>
                                        </div>
                                    )}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={3}>Total Staffs</TableCell>
                                        <TableCell className="text-right">{staffs ? staffs.length : ''}</TableCell>
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
                                            <div className="w-full">
                                                <form className="w-full max-h-[90vh] overflow-y-auto md:h-auto min-h-screen">
                                                    <div className="bg-gray-300 py-2 my-2 w-full">
                                                        <h1 className="mx-4 font-semibold">Staff Registration Information</h1>
                                                    </div>
                                                    <div className="p-4 bg-white">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                            <div>
                                                                <Label>Full Name</Label>
                                                                <Input
                                                                    className="rounded-none focus:outline-none"
                                                                    placeholder="Full Name"
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Email Address</Label>
                                                                <Input
                                                                    className="rounded-none focus:outline-none"
                                                                    placeholder="Email address"
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Contact Number</Label>
                                                                <Input
                                                                    className="rounded-none focus:outline-none"
                                                                    placeholder="Contact Number"
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Emergency Contact Number</Label>
                                                                <Input
                                                                    className="rounded-none focus:outline-none"
                                                                    placeholder="Secondary Phone Number"
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Address</Label>
                                                                <Input
                                                                    className="rounded-none focus:outline-none"
                                                                    placeholder="Address"
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Date Of Birth</Label>
                                                                <Input
                                                                    type="date"
                                                                    className="rounded-none focus:outline-none"
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Check In</Label>
                                                                <Input
                                                                    type="time"
                                                                    className="rounded-none focus:outline-none"
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Check out</Label>
                                                                <Input
                                                                    type="time"
                                                                    className="rounded-none focus:outline-none"
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Gender</Label>
                                                                <Select>
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
                                                                <Label>Working Days</Label>
                                                                <Select>
                                                                    <SelectTrigger className="w-full rounded-none">
                                                                        <SelectValue placeholder="Select working days" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectGroup>
                                                                            <SelectLabel>Select</SelectLabel>
                                                                            <SelectItem value="Regular">Regular</SelectItem>
                                                                            <SelectItem value="Day Time">Day Time</SelectItem>
                                                                            <SelectItem value="Temporary">Temporary</SelectItem>
                                                                        </SelectGroup>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div>
                                                                <Label>Select Shift</Label>
                                                                <Select>
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
                                                                    type="date"
                                                                    className="rounded-none focus:outline-none"
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Working Hours</Label>
                                                                <Select>
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
                                                                <Select>
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
                                                                    type="text"
                                                                    className="rounded-none focus:outline-none"
                                                                    placeholder="Salary"
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Role</Label>
                                                                <Select>
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

                                                    <div className="flex justify-center items-center my-4 space-x-2 p-2">
                                                        <Button variant="destructive" className="rounded-none">Reset Form</Button>
                                                        <Button className="rounded-none" onClick={() => setOpenForm(!openForm)}>Close Form</Button>
                                                        <Button className="rounded-none">Add Staff</Button>
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
