'use client';

import { RiSearchLine } from "react-icons/ri";
import { InfoIcon } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import Pagination from "@/components/ui/CustomPagination";
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
import { useState, useRef } from "react";
import { usePagination } from "@/hooks/Pagination";

const AttendanceHistory = () => {

    const [body, setBody] = useState(null);
    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        today.setDate(1);
        return today;
    });
    const [endDate, setEndDate] = useState(new Date());
    const [membershipType, setMembershipType] = useState('Members');
    const [id, setId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [renderDropdown, setRenderDropdown] = useState(false);
    const [staffHistory, setStaffHistory] = useState();
    const [memberHistory, setMemberHistory] = useState();
    const [totalPages, setTotalPages] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const limit = null;

    const [persons, setPersons] = useState(null);

    const fetchAllMembers = async () => {
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/members?startDate=${startDate}&endDate=${endDate}`);
            const responseBody = await response.json();
            setPersons(responseBody.members);
            return responseBody.members;
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const fetchAllStaffs = async () => {
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/staffsmanagement`);
            const responseBody = await response.json();
            setPersons(responseBody.staffs);
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    useEffect(() => {
        if (membershipType === 'Staffs') {
            fetchAllStaffs();
        } else if (membershipType === 'Members') {
            fetchAllMembers();
        }
        else {
            setPersons([]);
        };
    }, [membershipType]);

    const fetchAttendanceHistory = async () => {
        try {
            const staffsAttendanceURL = `http://88.198.112.156:3000/api/staff-attendance-history/${id}?page=${currentPage}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`;
            const membersAttendanceURL = `http://88.198.112.156:3000/api/member-attendance-history/${id}?page=${currentPage}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`;
            const response = await fetch(membershipType === 'Staffs' ? staffsAttendanceURL : membersAttendanceURL);
            const responseBody = await response.json();
            if (response.ok) {
                setBody(responseBody);
            };
            if (membershipType === 'Staffs') {
                setStaffHistory(responseBody.data);
                setTotalPages(responseBody.totalPages);
            } else {
                setMemberHistory(responseBody.data);
                setTotalPages(responseBody.totalPages)
            }
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    useEffect(() => {
        fetchAttendanceHistory();
    }, [id, membershipType, startDate, endDate, currentPage]);

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

    const { range, setPage, active } = usePagination({
        total: totalPages ? totalPages : 1,
        siblings: 1,
        boundaries: 1,
        page: currentPage,
        onChange: (page) => {
            setCurrentPage(page);
        },
    });

    return (
        <div className='w-full'>
            <div className='w-full'>
                <div className='w-full p-6 pb-0'>
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

                {membershipType === 'Staffs' ? (
                    <div>
                        <div className='w-full flex justify-center'>
                            <div className='w-full bg-white rounded-md mx-4'>
                                <div className="w-full p-4 space-y-4">
                                    <Alert className="bg-blue-50 border-blue-100">
                                        <InfoIcon className="h-4 w-4 text-blue-600" />
                                        <AlertDescription className="text-blue-700">
                                            Showing data from the beginning of the current month. Adjust dates below to view different periods.
                                        </AlertDescription>
                                    </Alert>
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
                                                        <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
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
                                                        <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
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
                                                        <SelectItem value="Staffs">Staffs</SelectItem>
                                                        <SelectItem value="Members">Members</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="w-full">
                                            <Label>Member Name</Label>
                                            <div ref={searchRef} className="w-full flex justify-center">
                                                <div className="relative w-full">
                                                    <div className="w-full flex items-center rounded-md border">
                                                        <RiSearchLine className='h-5 w-5 ml-2 text-gray-400' />
                                                        <Input
                                                            value={searchQuery}
                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                            onFocus={handleSearchFocus}
                                                            className="w-full rounded-lg border-none outline-none"
                                                            placeholder="Search members..."
                                                        />
                                                    </div>
                                                    {renderDropdown && (
                                                        <div className="w-full absolute bg-white shadow-2xl max-h-96 overflow-y-auto z-10">
                                                            {persons?.filter((person) =>
                                                                person.fullName.toLowerCase().includes(searchQuery.toLowerCase())
                                                            ).map((person) => (
                                                                <p
                                                                    onClick={() => {
                                                                        setSearchQuery(person.fullName);
                                                                        setId(person._id);
                                                                        setRenderDropdown(false);
                                                                    }}
                                                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                                    key={person._id}
                                                                    value={person._id}
                                                                >
                                                                    {person.fullName}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {membershipType === 'Staffs' ? (
                                    <>
                                        {body ? (
                                            <div className="w-full p-4 flex items-center justify-around bg-slate-200">
                                                <div className="w-full flex text-center space-x-2 items-center justify-center">
                                                    <h1 className="text-sm font-semibold">Late Count: </h1>
                                                    <span className="text-sm">{body ? body.totalLatePunchIns : 'Null'}</span>
                                                </div>

                                                <div className="w-full flex text-center space-x-2 items-center justify-center">
                                                    <h1 className="text-sm font-semibold">Deduction Days: </h1>
                                                    <span className="text-sm">{body ? body.deductionDays : 'Null'}</span>
                                                </div>

                                                <div className="w-full flex text-center space-x-2 items-center justify-center">
                                                    <h1 className="text-sm font-semibold">Deduced Salary Rs: </h1>
                                                    <span className="text-sm">{body ? Math.floor(body.salaryDeduction) : 'Null'}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <h1 className="text-center font-semibold animate-pulse text-sm">Loading...</h1>
                                        )}
                                    </>
                                ) : (
                                    <></>
                                )}

                                <div className="w-full">
                                    {staffHistory ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Staff Id</TableHead>
                                                    <TableHead>Full Name</TableHead>
                                                    <TableHead>Role</TableHead>
                                                    <TableHead>CheckIn</TableHead>
                                                    <TableHead>CheckOut</TableHead>
                                                    <TableHead>Remark</TableHead>
                                                    <TableHead>Late Flag</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {staffHistory && staffHistory.length > 0 ? (
                                                    staffHistory.map((attendance) => (
                                                        <TableRow key={attendance._id}>
                                                            <TableCell className="font-medium">{attendance.staffId}</TableCell>
                                                            <TableCell>{attendance.fullName}</TableCell>
                                                            <TableCell>{attendance.role}</TableCell>
                                                            <TableCell className="text-sm">
                                                                {attendance.checkIn ? new Date(attendance.checkIn).toISOString().split('T')[0] : ''}
                                                                {' - '}
                                                                {attendance.checkIn ? new Date(attendance.checkIn).toISOString().split('T')[1].split('.')[0] : ''}
                                                            </TableCell>
                                                            <TableCell className="text-sm">
                                                                {attendance.checkOut ? new Date(attendance.checkOut).toISOString().split('T')[0] : ''}
                                                                {' - '}
                                                                {attendance.checkOut ? new Date(attendance.checkOut).toISOString().split('T')[1].split('.')[0] : ''}
                                                            </TableCell>
                                                            <TableCell>{attendance.remark}</TableCell>
                                                            <TableCell>{attendance.remark === 'LatePunchIn' ? 'True' : 'False'}</TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan="6" className="text-center text-sm font-semibold">Staff attendance not found.</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                            <TableFooter>
                                                <TableRow>
                                                    <TableCell >Total checked in time</TableCell>
                                                    <TableCell className="text-left">{body ? body.totalStaffAttendance : ''}</TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        </Table>
                                    ) : (
                                        <div className="w-full flex justify-center">
                                            <h1 className="text-sm font-semibold text-center">Staff attendance not found.</h1>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="py-3">
                            <Pagination
                                total={totalPages || 1}
                                page={currentPage || 1}
                                onChange={setCurrentPage}
                                withEdges={true}
                                siblings={1}
                                boundaries={1}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="w-full">
                        <div className='w-full flex justify-center'>
                            <div className='w-full bg-white mx-4'>
                                <div className="w-full p-4 space-y-4">
                                    <Alert className="bg-blue-50 border-blue-100">
                                        <InfoIcon className="h-4 w-4 text-blue-600" />
                                        <AlertDescription className="text-blue-700">
                                            Showing data from the beginning of the current month. Adjust dates below to view different periods.
                                        </AlertDescription>
                                    </Alert>
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
                                                        <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
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
                                                        <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
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
                                                        <SelectItem value="Staffs">Staffs</SelectItem>
                                                        <SelectItem value="Members">Members</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="w-full">
                                            <Label>Member Name</Label>
                                            <div ref={searchRef} className="w-full flex justify-center">
                                                <div className="relative w-full">
                                                    <div className="w-full flex items-center border rounded-md" >
                                                        <RiSearchLine className='h-5 w-5 ml-2 text-gray-400' />
                                                        <Input
                                                            value={searchQuery}
                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                            onFocus={handleSearchFocus}
                                                            className="w-full rounded-lg border-none outline-none"
                                                            placeholder="Search members..."
                                                        />
                                                    </div>
                                                    {renderDropdown && (
                                                        <div className="w-full absolute bg-white shadow-2xl max-h-96 overflow-y-auto z-10">
                                                            {persons?.filter((person) =>
                                                                person.fullName.toLowerCase().includes(searchQuery.toLowerCase())
                                                            ).map((person) => (
                                                                <p
                                                                    onClick={() => {
                                                                        setSearchQuery(person.fullName);
                                                                        setId(person._id);
                                                                        setRenderDropdown(false);
                                                                    }}
                                                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                                    key={person._id}
                                                                    value={person._id}
                                                                >
                                                                    {person.fullName}
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
                                    {memberHistory ? (
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
                                                {memberHistory && memberHistory.length > 0 ? (
                                                    memberHistory.map((attendance) => (
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
                                                        <TableCell colSpan="6" className="text-center text-sm font-semibold">Member attendance not found.</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                            <TableFooter>
                                                <TableRow>
                                                    <TableCell >Total checked in time</TableCell>
                                                    <TableCell className="text-left">{memberHistory ? memberHistory.length : ''}</TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        </Table>
                                    ) : (
                                        <div className="w-full flex justify-center">
                                            <h1 className="text-sm font-semibold text-center">Member attendance not found.</h1>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="py-3">
                            <Pagination
                                total={totalPages || 1}
                                page={currentPage || 1}
                                onChange={setCurrentPage}
                                withEdges={true}
                                siblings={1}
                                boundaries={1}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceHistory;
