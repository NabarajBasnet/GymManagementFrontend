'use client';

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import React, { useEffect } from 'react';
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const AttendanceHistory = () => {

    const [endDate, setEndDate] = useState();
    const [startDate, setStartDate] = useState();
    const [membershipType, setMembershipType] = useState();
    const [id, setId] = useState('');

    const getAllMembers = async () => {
        try {
            const response = await fetch(`http:localhost:3000/api/members`);
            const responseBody = await response.json();
            console.log("Response body: ", responseBody);
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const { data: membersDetails, isLoading } = useQuery({
        queryKey: ['members'],
        queryFn: getAllMembers
    });

    console.log("Members: ", membersDetails);

    const getAllStaffs = async () => {
        try {

        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const getMemberAttendanceHistory = async () => {
        try {

        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const getStaffAttendanceHistory = async () => {
        try {

        } catch (error) {
            console.log("Error: ", error);
        }
    };

    useEffect(() => {
        if (membershipType === 'Members') {
            getMemberAttendanceHistory()
        }
        else if (membershipType === 'Staffs') {
            getStaffAttendanceHistory
        }
    }, [membershipType]);

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
            <div className='w-full p-6'>
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
                            <BreadcrumbLink>Attendance</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Attendance History</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-xl font-bold mt-3">Attendance History</h1>
            </div>

            <div className='w-full flex justify-center'>
                <div className='w-full bg-white mx-4'>
                    <div className="w-full p-4 space-y-4">
                        <div className="w-full flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                            <div className="w-full">
                                <Label>From</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal p-2 rounded-md border",
                                                !startDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2" />
                                            {startDate ? format(startDate, "PPP") : <span>Start Date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="w-full">
                                <Label>To</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal p-2 rounded-md border",
                                                !endDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2" />
                                            {endDate ? format(endDate, "PPP") : <span>End Date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="w-full flex flex-col space-y-2">
                                <Label>Membership Type</Label>
                                <Select className="w-full" onValueChange={(value) => setMembershipType(value)}>
                                    <SelectTrigger className="w-full rounded-md border p-2">
                                        <SelectValue placeholder="Membership Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Select Type</SelectLabel>
                                            <SelectItem value="Staffs">Staff</SelectItem>
                                            <SelectItem value="Members">Members</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="w-full flex flex-col space-y-2">
                                <Label>Person</Label>
                                <Select className="w-full">
                                    <SelectTrigger className="w-full rounded-md border p-2">
                                        <SelectValue placeholder="Select Person" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <Input className="w-full p-2 border-b mb-2" placeholder="Search..." />
                                            <SelectLabel>Select</SelectLabel>
                                            <SelectItem value="member1">Member 1</SelectItem>
                                            <SelectItem value="member2">Member 2</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="w-full flex justify-center">
                            <Button className="w-full max-w-xs rounded-md bg-blue-600 text-white p-2 hover:bg-blue-700">
                                Submit
                            </Button>
                        </div>
                    </div>

                    <div className="w-full flex justify-between items-center py-4 bg-gray-100">
                        <Input
                            placeholder='Search...'
                            className='w-full md:w-4/12 rounded-none'
                        />
                    </div>
                    <div className="w-full">
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
                                    <TableCell colSpan={3}>Total</TableCell>
                                    <TableCell className="text-right">$2,500.00</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>

                        <div className="py-4">
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
        </div>
    )
}

export default AttendanceHistory;
