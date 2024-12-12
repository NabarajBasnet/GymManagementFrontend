'use client';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { IoSearch } from "react-icons/io5";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import React from 'react'
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useQuery } from "@tanstack/react-query";

const BookTrainer = () => {

    const fetchAllStaffs = async () => {
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/staffsmanagement`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        };
    };
    const { data, isLoading, error } = useQuery({
        queryKey: ['staffs'],
        queryFn: fetchAllStaffs
    })
    const { staffs } = data || {};
    console.log("Staffs: ", staffs);

    const getAllMembers = async () => {
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/members`);
            const resBody = await response.json();
            return resBody;
        } catch (error) {
            console.error('Error: ', error);
        }
    };
    const { data: allMembers, isLoading: isMemberLoading } = useQuery({
        queryKey: ['members'],
        queryFn: getAllMembers,
        keepPreviousData: true,
    });
    const { members } = allMembers || {};
    console.log("Members: ", members);


    const invoices = [
        {
            invoice: "INV001",
            paymentStatus: "Paid",
            totalAmount: "$250.00",
            paymentMethod: "Credit Card",
        }
    ];

    return (
        <div className='w-full'>
            <div className='w-full p-4'>
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
                            <BreadcrumbLink href="/docs/components">Book Trainer</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-xl font-bold mt-3">Book Trainer</h1>
            </div>

            <div className="w-full p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="w-full">
                    <Label>Select Trainer</Label>
                    <Select>
                        <SelectTrigger className="w-full rounded-none">
                            <SelectValue placeholder="Select Trainer" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <div className="flex justify-center p-2">
                                    <div className="w-full px-4 flex justify-start border border-gray-400 rounded-none items-center">
                                        <IoSearch className="text-xl" />
                                        <Input
                                            className='w-full border-none bg-none'
                                            placeholder='Search Trainer...'
                                        />
                                    </div>
                                </div>
                                <SelectLabel>Select Trainer</SelectLabel>
                                <SelectItem value="apple">Apple</SelectItem>
                                <SelectItem value="banana">Banana</SelectItem>
                                <SelectItem value="blueberry">Blueberry</SelectItem>
                                <SelectItem value="grapes">Grapes</SelectItem>
                                <SelectItem value="pineapple">Pineapple</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full">
                    <Label>Select Client</Label>
                    <Select>
                        <SelectTrigger className="w-full rounded-none">
                            <SelectValue placeholder="Select Client" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <div className="flex justify-center p-2">
                                    <div className="w-full px-4 flex justify-start border border-gray-400 rounded-none items-center">
                                        <IoSearch className="text-xl" />
                                        <Input
                                            className='w-full border-none bg-none'
                                            placeholder='Search Client...'
                                        />
                                    </div>
                                </div>
                                <SelectLabel>Select Client</SelectLabel>
                                <SelectItem value="apple">Apple</SelectItem>
                                <SelectItem value="banana">Banana</SelectItem>
                                <SelectItem value="blueberry">Blueberry</SelectItem>
                                <SelectItem value="grapes">Grapes</SelectItem>
                                <SelectItem value="pineapple">Pineapple</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full">
                    <Label>From</Label>
                    <Input
                        type='date'
                        placeholder='Select Date From'
                        className='w-full rounded-none'
                    />
                </div>

                <div className="w-full">
                    <Label>Training Duration</Label>
                    <Select>
                        <SelectTrigger className="w-full rounded-none">
                            <SelectValue placeholder="Training Duration" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Select</SelectLabel>
                                <SelectItem value="1 Month">1 Month</SelectItem>
                                <SelectItem value="3 Months">3 Months</SelectItem>
                                <SelectItem value="6 Months">6 Months</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full">
                    <Label>To</Label>
                    <Input
                        type='date'
                        placeholder='Select Date To'
                        className='w-full rounded-none'
                    />
                </div>

                <div className="w-full">
                    <Label>Charge/Fee</Label>
                    <Input
                        type='text'
                        placeholder='Charge Fee'
                        className='w-full rounded-none'
                    />
                </div>

                <div className="w-full">
                    <Label>Discount</Label>
                    <Input
                        type='text'
                        placeholder='Discount'
                        className='w-full rounded-none'
                    />
                </div>

                <div className="w-full">
                    <Label>Final Charge/Fee</Label>
                    <Input
                        type='text'
                        placeholder='Final Charge'
                        className='w-full rounded-none'
                    />
                </div>

                <div className="w-full">
                    <Label>Status</Label>
                    <Select>
                        <SelectTrigger className="w-full rounded-none">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Select</SelectLabel>
                                <SelectItem value="Booked">Booked</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                                <SelectItem value="Freezed">Freezed</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

            </div>

            <div className="flex items-center px-4 mb-2 space-x-3">
                <Button className='rounded-none'>Book</Button>
                <Button className='rounded-none'>Edit</Button>
            </div>

            <div className="w-full bg-white p-3">
                <div>
                    <div className="flex justify-center p-2">
                        <div className="w-full px-4 flex justify-start border border-gray-400 rounded-none items-center">
                            <IoSearch className="text-xl" />
                            <Input
                                className='w-full border-none bg-none'
                                placeholder='Search Member...'
                            />
                        </div>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Invoice</TableHead>
                                <TableHead>Status</TableHead>
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
                                    <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3}>Total Member Attendance</TableCell>
                                <TableCell className="text-right">5</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>

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
            </div>
        </div>
    )
}

export default BookTrainer;
