'use client';

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
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";

const TrainerAvailability = () => {

    const { data, isLoading } = useQuery({
        queryKey: ['personalTrainers'],
        queryFn: async () => {
            try {
                const response = await fetch('http://localhost:3000/api/staffsmanagement');
                const responseBody = await response.json();
                return responseBody;
            } catch (error) {
                console.log("Error: ", error);
            }
        }
    });

    const { totalStaffs, staffs, totalPages } = data || {};
    console.log("Data: ", staffs);

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
                            <BreadcrumbLink href="/docs/components">Trainer Availability</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Personal Trainers</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-xl font-bold mt-3">Trainer Availability</h1>
            </div>

            <div className="w-full bg-white">
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
                                <TableHead>Id</TableHead>
                                <TableHead>Full Name</TableHead>
                                <TableHead>Contact No</TableHead>
                                <TableHead>Joined At</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Avaibility Status</TableHead>
                                <TableHead>Shift</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Limit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.isArray(staffs) && staffs.length >= 1 ? (
                                staffs.map((staff) => (
                                    <TableRow key={staff._id}>
                                        <TableCell>{staff._id}</TableCell>
                                        <TableCell>{staff.fullName}</TableCell>
                                        <TableCell>{staff.contactNo}</TableCell>
                                        <TableCell>{staff.joinedDate ? new Date(staff.joinedDate).toISOString().split('T')[0] : ''}</TableCell>
                                        <TableCell>{staff.status}</TableCell>
                                        <TableCell>{staff.status}</TableCell>
                                        <TableCell>{staff.shift}</TableCell>
                                        <TableCell>{staff.role}</TableCell>
                                        <TableCell className="text-right">{5}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell className="font-medium">No Staffs Found</TableCell>
                                </TableRow>
                            )}
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

export default TrainerAvailability;
