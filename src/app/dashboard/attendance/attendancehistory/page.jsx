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
    Table,
    TableBody,
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
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

const AttendanceHistory = () => {

    const [endDate, setEndDate] = useState();
    const [startDate, setStartDate] = useState();
    const [membershipType, setMembershipType] = useState();
    const [id, setId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [renderDropdown, setRenderDropdown] = useState(false);
    const [PermanentMemberAttendance, setPermanentMemberAttendance] = useState([]);
    const [totalPages, setTotalPages] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    const fetchAllMembers = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/members`);
            const responseBody = await response.json();
            console.log("Response body", responseBody);
            return responseBody.members;
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const { data: allMembers, isLoading } = useQuery({
        queryKey: ['members'],
        queryFn: fetchAllMembers,
    });

    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setRenderDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchRef]);

    const handleSearchFocus = () => {
        setRenderDropdown(true);
    };

    const fetchAttendanceHistory = async ({ queryKey }) => {
        const [, id, page] = queryKey;
        try {
            const response = await fetch(`http://localhost:3000/api/members-attendance-history/${id}?page=${page}&limit=${limit}`);
            const responseBody = await response.json();
            setPermanentMemberAttendance(responseBody.memberAttendance);
            setTotalPages(responseBody.totalPages);
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const { data: attendanceData } = useQuery({
        queryKey: ['attendance', id, currentPage],
        queryFn: fetchAttendanceHistory,
        enabled: !!id,
    });

    const { totalMemberAttendance } = attendanceData || {}

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

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
                                    <BreadcrumbSeparator />
                                </DropdownMenuTrigger>
                            </DropdownMenu>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink>Attendance</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            Attendance History
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

                            <div className="w-full">
                                <Label>Member Name</Label>
                                <div ref={searchRef} className="w-full flex justify-center">
                                    <div className="relative w-full">
                                        <div className="w-full">
                                            <Input
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onFocus={handleSearchFocus}
                                                className="w-full rounded-lg"
                                                placeholder="Search members..."
                                            />
                                        </div>
                                        {renderDropdown && (
                                            <div className="w-full absolute bg-white shadow-2xl max-h-96 overflow-y-auto z-10">
                                                {allMembers?.filter((member) =>
                                                    member.fullName.toLowerCase().includes(searchQuery.toLowerCase())
                                                ).map((member) => (
                                                    <p
                                                        onClick={() => {
                                                            setSearchQuery(member.fullName);
                                                            setId(member._id);
                                                            setRenderDropdown(false);
                                                        }}
                                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                        key={member._id}
                                                        value={member._id}
                                                    >
                                                        {member.fullName}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className="w-full">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Member Id</TableHead>
                                    <TableHead>Full Name</TableHead>
                                    <TableHead>Membership Option</TableHead>
                                    <TableHead className="text-right">Check In Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {PermanentMemberAttendance && PermanentMemberAttendance.length > 0 ? (
                                    PermanentMemberAttendance.map((attendance) => (
                                        <TableRow key={attendance._id}>
                                            <TableCell className="font-medium">{attendance.memberId}</TableCell>
                                            <TableCell>{attendance.fullName}</TableCell>
                                            <TableCell>{attendance.membershipOption}</TableCell>
                                            <TableCell className='text-right'>
                                                {new Date(attendance.checkInTime).toLocaleDateString()} -  {new Date(attendance.checkInTime).toLocaleTimeString('en-US', {
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                    hour12: true
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan="4" className="text-center text-sm font-semibold">Member attendance not found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell >Total checked in time</TableCell>
                                    <TableCell className="text-left">{totalMemberAttendance}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </div>
            </div>
            <div className="py-3">
                <Pagination className={'cursor-pointer'}>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink isActive={currentPage === i + 1} onClick={() => handlePageChange(i + 1)}>
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
};

export default AttendanceHistory;
