'use client'

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


const AddStaff = () => {

    const [openForm, setOpenForm] = useState(false);
    const pathname = usePathname();

    const invoices = [
        {
            invoice: "INV001",
            paymentStatus: "Paid",
            totalAmount: "$250.00",
            paymentMethod: "Credit Card",
        },
        {
            invoice: "INV002",
            paymentStatus: "Pending",
            totalAmount: "$150.00",
            paymentMethod: "PayPal",
        },
        {
            invoice: "INV003",
            paymentStatus: "Unpaid",
            totalAmount: "$350.00",
            paymentMethod: "Bank Transfer",
        },
        {
            invoice: "INV004",
            paymentStatus: "Paid",
            totalAmount: "$450.00",
            paymentMethod: "Credit Card",
        },
        {
            invoice: "INV005",
            paymentStatus: "Paid",
            totalAmount: "$550.00",
            paymentMethod: "PayPal",
        },
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
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem>Documentation</DropdownMenuItem>
                                    <DropdownMenuItem>Themes</DropdownMenuItem>
                                    <DropdownMenuItem>GitHub</DropdownMenuItem>
                                </DropdownMenuContent>
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
                        <div>
                            <Table>
                                <TableCaption>A list of your recent invoices.</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Invoice</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoices.map((invoice) => (
                                        <TableRow key={invoice.invoice}>
                                            <TableCell className="font-medium">{invoice.invoice}</TableCell>
                                            <TableCell>{invoice.paymentStatus}</TableCell>
                                            <TableCell>{invoice.paymentMethod}</TableCell>
                                            <TableCell>{invoice.paymentMethod}</TableCell>
                                            <TableCell>{invoice.paymentMethod}</TableCell>
                                            <TableCell>{invoice.paymentMethod}</TableCell>
                                            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={3}>Total Staffs</TableCell>
                                        <TableCell className="text-right">5</TableCell>
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
                                        <div className="w-10/12 h-full overflow-y-auto bg-gray-100 rounded-md shadow-2xl px-3 py-7">
                                            <div className="w-full">
                                                <form className="w-full">
                                                    <div className="bg-gray-300 py-2 my-2 w-full">
                                                        <h1 className="mx-4 font-semibold">Personal Information</h1>
                                                    </div>
                                                    <div className="p-2 bg-white">
                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                                            <div>
                                                                <Label>First Name</Label>
                                                                <Input
                                                                    className='rounded-none focus:outline-none'
                                                                    placeholder='First Name'
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Last Name</Label>
                                                                <Input
                                                                    className='rounded-none focus:outline-none'
                                                                    placeholder='Last Name'
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Address</Label>
                                                                <Input
                                                                    className='rounded-none focus:outline-none'
                                                                    placeholder='Address'
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Phone Number</Label>
                                                                <Input
                                                                    className='rounded-none focus:outline-none'
                                                                    placeholder='Phone Number'
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Secondary Phone Number</Label>
                                                                <Input
                                                                    className='rounded-none focus:outline-none'
                                                                    placeholder='Secondary Phone Number'
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Email Address</Label>
                                                                <Input
                                                                    className='rounded-none focus:outline-none'
                                                                    placeholder='Email Address'
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Date Of Birth</Label>
                                                                <Input
                                                                    className='rounded-none focus:outline-none'
                                                                    placeholder='Date Of Birth'
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Date Of Birth</Label>
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
                                                        </div>
                                                    </div>

                                                    <div className="bg-gray-300 py-2 my-2 w-full">
                                                        <h1 className="mx-4 font-semibold">Membership Information</h1>
                                                    </div>
                                                    <div className="p-2 bg-white">
                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                                            <div>
                                                                <Label>Staff Role</Label>
                                                                <Select>
                                                                    <SelectTrigger className="w-full rounded-none">
                                                                        <SelectValue placeholder="Select Role" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectGroup>
                                                                            <SelectLabel>Role</SelectLabel>
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
                                                                            <SelectItem value="Gym">Gym</SelectItem>
                                                                            <SelectItem value="Gym & Cardio">Gym & Cardio</SelectItem>
                                                                        </SelectGroup>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div>
                                                                <Label>Joined Date</Label>
                                                                <Input
                                                                    type='date'
                                                                    className='rounded-none focus:outline-none'
                                                                    placeholder='Membership Date'
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Working Duration</Label>
                                                                <Select>
                                                                    <SelectTrigger className="w-full rounded-none">
                                                                        <SelectValue placeholder="Duration" />
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
                                                                <Label>Hours</Label>
                                                                <Select>
                                                                    <SelectTrigger className="w-full rounded-none">
                                                                        <SelectValue placeholder="Duration" />
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
                                                                <Label>Checkin Time</Label>
                                                                <Input
                                                                    type='date'
                                                                    className='rounded-none focus:outline-none'
                                                                    placeholder='Membership Renew Date'
                                                                />
                                                            </div>

                                                            <div>
                                                                <Label>Checkout Time</Label>
                                                                <Input
                                                                    type='date'
                                                                    className='rounded-none focus:outline-none'
                                                                    placeholder='Membership Expire Date'
                                                                />
                                                            </div>

                                                        </div>
                                                    </div>

                                                    <div className="flex justify-center items-center my-4 space-x-2 p-2">
                                                        <Button variant='destructive' className='rounded-none'>Reset Form</Button>
                                                        <Button className='rounded-none' onClick={() => setOpenForm(!openForm)}>Close Form</Button>
                                                        <Button className='rounded-none'>Add Staff</Button>
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
