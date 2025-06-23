'use client';

import { HiOutlineHome } from "react-icons/hi";
import { useState, useEffect, useRef } from "react";
import { Search, InfoIcon, CalendarIcon, Clock, User, UserCheck } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// UI Components
import {
    Alert,
    AlertDescription,
} from "@/components/ui/alert";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import Pagination from "@/components/ui/CustomPagination";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const AttendanceHistory = () => {
    // State variables
    const [isLoading, setIsLoading] = useState(false);
    const [body, setBody] = useState(null);
    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        today.setDate(0);
        return today;
    });
    const [endDate, setEndDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        return date.toISOString().split("T")[0];
    });
    const [membershipType, setMembershipType] = useState('Members');
    const [id, setId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [renderDropdown, setRenderDropdown] = useState(false);
    const [staffHistory, setStaffHistory] = useState();
    const [memberHistory, setMemberHistory] = useState();
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [persons, setPersons] = useState([]);
    const [activeTab, setActiveTab] = useState('filters');
    const limit = 10;
    const searchRef = useRef(null);

    // Fetch members data
    const fetchAllMembers = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`http://88.198.112.156:3100/api/members?startDate=${startDate}&endDate=${endDate}`);
            const responseBody = await response.json();
            setPersons(responseBody.members);
            setIsLoading(false);
            return responseBody.members;
        } catch (error) {
            console.log("Error: ", error);
            setIsLoading(false);
        }
    };

    // Fetch staff data
    const fetchAllStaffs = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`http://88.198.112.156:3100/api/staffsmanagement`);
            const responseBody = await response.json();
            setPersons(responseBody.staffs);
            setIsLoading(false);
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
            setIsLoading(false);
        }
    };

    // Effect to fetch data based on membership type
    useEffect(() => {
        if (membershipType === 'Staffs') {
            fetchAllStaffs();
        } else if (membershipType === 'Members') {
            fetchAllMembers();
        } else {
            setPersons([]);
        }
    }, [membershipType]);

    // Handle person selection
    const handlePersonSelect = (person) => {
        setSearchQuery(person.fullName);
        setId(person._id);
        setRenderDropdown(false);
    };

    // Fetch attendance history
    const fetchAttendanceHistory = async () => {
        if (!id) return;

        try {
            setIsLoading(true);
            const staffsAttendanceURL = `http://88.198.112.156:3100/api/staff-attendance-history/${id}?page=${currentPage}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`;
            const membersAttendanceURL = `http://88.198.112.156:3100/api/member-attendance-history/${id}?page=${currentPage}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`;

            const response = await fetch(membershipType === 'Staffs' ? staffsAttendanceURL : membersAttendanceURL);
            const responseBody = await response.json();

            if (response.ok) {
                setBody(responseBody);
                setActiveTab('results');
            }

            if (membershipType === 'Staffs') {
                setStaffHistory(responseBody.data);
                setTotalPages(responseBody.totalPages || 1);
            } else {
                setMemberHistory(responseBody.data);
                setTotalPages(responseBody.totalPages || 1);
            }
            setIsLoading(false);
        } catch (error) {
            console.log("Error: ", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchAttendanceHistory();
        }
    }, [id, membershipType, startDate, endDate, currentPage]);

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

    const startEntry = (currentPage - 1) * limit + 1;
    const totalEntries = membershipType === 'Members'
        ? memberHistory?.length || 0
        : staffHistory?.length || 0;
    const endEntry = Math.min(currentPage * limit, totalEntries);

    const formatDateTime = (dateTime) => {
        if (!dateTime) return '';
        const date = new Date(dateTime);
        return `${date.toLocaleDateString()} - ${date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })}`;
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-6">
            <div className="mb-5 mt-1">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/" className="text-blue-600 flex items-center space-x-2 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                <HiOutlineHome className="mr-2 font-bold" />
                                Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300">Attendance</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-gray-700 font-medium dark:text-gray-300">Attendance History</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <Card className="shadow-sm bg-white dark:bg-gray-800 border-gray-200 font-medium dark:border-gray-700">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">Attendance History</CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                        View and track attendance records for staff and members
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="mb-6">
                <Tabs
                    value={membershipType}
                    onValueChange={setMembershipType}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <TabsTrigger
                            value="Members"
                            className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-gray-700"
                            onClick={() => {
                                setMembershipType('Members');
                                setId('');
                                setSearchQuery('');
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Members
                            </div>
                        </TabsTrigger>
                        <TabsTrigger
                            value="Staffs"
                            className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-gray-700"
                            onClick={() => {
                                setMembershipType('Staffs');
                                setId('');
                                setSearchQuery('');
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <UserCheck className="h-4 w-4" />
                                Staff
                            </div>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <TabsTrigger value="filters" className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-gray-700">
                        <div className="flex items-center">
                            <Search className="mr-2 h-4 w-4" />
                            Filters & Search
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="results"
                        className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-gray-700"
                        disabled={!id}
                    >
                        <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            Attendance Results
                        </div>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="filters">
                    <Card className="shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <CardHeader className="pb-2">
                            <Alert className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 mb-4">
                                <InfoIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <AlertDescription className="text-blue-700 dark:text-blue-300 text-sm ml-2">
                                    Showing data from the beginning of the current month. Adjust dates below to view different periods.
                                </AlertDescription>
                            </Alert>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* From Date */}
                                <div className="space-y-2">
                                    <Label htmlFor="from-date" className="text-sm font-medium text-gray-700 dark:text-gray-300">From Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild className="py-6">
                                            <Button
                                                id="from-date"
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300",
                                                    !startDate && "text-gray-400 dark:text-gray-500"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                {startDate ? format(startDate, "PPP") : "Select start date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={startDate}
                                                onSelect={setStartDate}
                                                initialFocus
                                                className="rounded-md border dark:border-gray-700"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {/* To Date */}
                                <div className="space-y-2">
                                    <Label htmlFor="to-date" className="text-sm font-medium text-gray-700 dark:text-gray-300">To Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild className="py-6">
                                            <Button
                                                id="to-date"
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300",
                                                    !endDate && "text-gray-400 dark:text-gray-500"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                {endDate ? format(endDate, "PPP") : "Select end date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={endDate}
                                                onSelect={setEndDate}
                                                initialFocus
                                                className="rounded-md border dark:border-gray-700"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {/* Search Person */}
                                <div className="space-y-2" ref={searchRef}>
                                    <Label htmlFor="person-search" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {membershipType === 'Members' ? 'Member' : 'Staff'} Name
                                    </Label>
                                    <div className="relative">
                                        <div className="flex items-center border dark:border-gray-700 rounded-md transition-all focus-within:ring-2 focus-within:ring-blue-200 dark:focus-within:ring-blue-800 focus-within:border-blue-400 dark:focus-within:border-blue-600">
                                            <Search className="h-4 w-4 ml-3 text-gray-400 dark:text-gray-500" />
                                            <Input
                                                id="person-search"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onFocus={() => setRenderDropdown(true)}
                                                className="border-0 focus-visible:ring-0 py-6 focus-visible:ring-offset-0 dark:bg-gray-800 dark:text-gray-300"
                                                placeholder={`Search ${membershipType === 'Members' ? 'members' : 'staff'}...`}
                                            />
                                        </div>

                                        {renderDropdown && (
                                            <div className="absolute z-50 w-full mt-1 max-h-64 overflow-y-auto bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg">
                                                {isLoading ? (
                                                    <div className="p-4 space-y-2">
                                                        <Skeleton className="h-6 w-full dark:bg-gray-700" />
                                                        <Skeleton className="h-6 w-full dark:bg-gray-700" />
                                                        <Skeleton className="h-6 w-full dark:bg-gray-700" />
                                                    </div>
                                                ) : persons?.length > 0 ? (
                                                    persons
                                                        .filter((person) =>
                                                            person.fullName.toLowerCase().includes(searchQuery.toLowerCase())
                                                        )
                                                        .map((person) => (
                                                            <div
                                                                key={person._id}
                                                                onClick={() => handlePersonSelect(person)}
                                                                className="px-4 py-3 flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                            >
                                                                <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                                <span className="text-gray-900 dark:text-gray-100">{person.fullName}</span>
                                                            </div>
                                                        ))
                                                ) : (
                                                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                                        No {membershipType.toLowerCase()} found
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="mt-8 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white dark:border-none"
                                onClick={() => {
                                    if (id) fetchAttendanceHistory();
                                    setActiveTab('results');
                                }}
                                disabled={!id}
                            >
                                <UserCheck className="mr-2 h-4 w-4" />
                                View Attendance
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="results">
                    {id ? (
                        <Card className="shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl font-medium text-gray-900 dark:text-gray-100">
                                    {searchQuery ? `Attendance Record for ${searchQuery}` : 'Attendance Records'}
                                </CardTitle>
                                <CardDescription className="text-gray-500 dark:text-gray-400">
                                    {startDate && endDate ? (
                                        <span>Showing data from {format(startDate, "PP")} to {format(endDate, "PP")}</span>
                                    ) : (
                                        <span>Select date range to filter records</span>
                                    )}
                                </CardDescription>
                            </CardHeader>

                            {/* Summary Cards for Staff */}
                            {membershipType === 'Staffs' && body && (
                                <div className="px-6 py-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <Card className="bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800">
                                            <CardHeader className="py-3">
                                                <CardTitle className="text-sm font-medium text-amber-800 dark:text-amber-400">Late Check-ins</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-2xl font-bold text-amber-900 dark:text-amber-300">{body.totalLatePunchIns || 0}</p>
                                            </CardContent>
                                        </Card>

                                        <Card className="bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800">
                                            <CardHeader className="py-3">
                                                <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-400">Deduction Days</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">{body.deductionDays || 0}</p>
                                            </CardContent>
                                        </Card>

                                        <Card className="bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800">
                                            <CardHeader className="py-3">
                                                <CardTitle className="text-sm font-medium text-red-800 dark:text-red-400">Salary Deducted</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-2xl font-bold text-red-900 dark:text-red-300">₹ {body.salaryDeduction ? Math.floor(body.salaryDeduction) : 0}</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            )}

                            <CardContent>
                                {isLoading ? (
                                    <div className="space-y-4">
                                        <Skeleton className="h-10 w-full dark:bg-gray-700" />
                                        <Skeleton className="h-32 w-full dark:bg-gray-700" />
                                        <Skeleton className="h-32 w-full dark:bg-gray-700" />
                                    </div>
                                ) : membershipType === 'Staffs' ? (
                                    <div className="rounded-md border dark:border-gray-700">
                                        <Table>
                                            <TableHeader className="bg-gray-50 dark:bg-gray-800">
                                                <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                    <TableHead className="font-medium text-gray-900 dark:text-gray-100">Staff ID</TableHead>
                                                    <TableHead className="font-medium text-gray-900 dark:text-gray-100">Full Name</TableHead>
                                                    <TableHead className="font-medium text-gray-900 dark:text-gray-100">Role</TableHead>
                                                    <TableHead className="font-medium text-gray-900 dark:text-gray-100">Check In</TableHead>
                                                    <TableHead className="font-medium text-gray-900 dark:text-gray-100">Check Out</TableHead>
                                                    <TableHead className="font-medium text-gray-900 dark:text-gray-100">Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {staffHistory && staffHistory.length > 0 ? (
                                                    staffHistory.map((attendance) => (
                                                        <TableRow key={attendance._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                            <TableCell className="font-medium text-gray-900 dark:text-gray-100">{attendance.staff._id}</TableCell>
                                                            <TableCell className="text-gray-900 dark:text-gray-100">{attendance.staff.fullName}</TableCell>
                                                            <TableCell className="text-gray-900 dark:text-gray-100">{attendance.role}</TableCell>
                                                            <TableCell className="text-gray-900 dark:text-gray-100">
                                                                {attendance.checkIn ? (
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <span className="text-sm cursor-help underline decoration-dotted underline-offset-2">
                                                                                    {attendance.checkIn ? new Date(attendance.checkIn).toLocaleTimeString() : 'N/A'}
                                                                                </span>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                <p>
                                                                                    {attendance.checkIn ? new Date(attendance.checkIn).toLocaleString() : 'N/A'}
                                                                                </p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                ) : (
                                                                    <span className="text-gray-400">--</span>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-gray-900 dark:text-gray-100">
                                                                {attendance.checkOut ? (
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <span className="text-sm cursor-help underline decoration-dotted underline-offset-2">
                                                                                    {attendance.checkOut ? new Date(attendance.checkOut).toLocaleTimeString() : 'N/A'}
                                                                                </span>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                <p>
                                                                                    {attendance.checkOut ? new Date(attendance.checkOut).toLocaleString() : 'N/A'}
                                                                                </p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                ) : (
                                                                    <span className="text-gray-400">--</span>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {attendance.remark === 'LatePunchIn' ? (
                                                                    <Badge variant="outline" className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800">
                                                                        Late
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                                                                        On Time
                                                                    </Badge>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={6} className="h-24 text-center text-gray-500 dark:text-gray-400">
                                                            No attendance records found
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                            {staffHistory && staffHistory.length > 0 && (
                                                <TableFooter>
                                                    <TableRow className="bg-gray-50 dark:bg-gray-800">
                                                        <TableCell colSpan={2} className="font-medium text-gray-900 dark:text-gray-100">Total Check-in Time</TableCell>
                                                        <TableCell colSpan={4} className="text-gray-900 dark:text-gray-100">{body ? body.totalStaffAttendance : '--'}</TableCell>
                                                    </TableRow>
                                                </TableFooter>
                                            )}
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="rounded-md border dark:border-gray-700">
                                        <Table>
                                            <TableHeader className="bg-gray-50 dark:bg-gray-800">
                                                <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                    <TableHead className="font-medium text-gray-900 dark:text-gray-100">Member ID</TableHead>
                                                    <TableHead className="font-medium text-gray-900 dark:text-gray-100">Full Name</TableHead>
                                                    <TableHead className="font-medium text-gray-900 dark:text-gray-100">Membership Option</TableHead>
                                                    <TableHead className="font-medium text-gray-900 dark:text-gray-100">Check In Date</TableHead>
                                                    <TableHead className="font-medium text-gray-900 dark:text-gray-100">Check In Time</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {memberHistory && memberHistory.length > 0 ? (
                                                    memberHistory.map((attendance) => (
                                                        <TableRow key={attendance._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                            <TableCell className="font-medium text-gray-900 dark:text-gray-100">{attendance.memberId}</TableCell>
                                                            <TableCell className="text-gray-900 dark:text-gray-100">{attendance.fullName}</TableCell>
                                                            <TableCell className='text-start'>
                                                                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                                                                    {attendance.membershipOption}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-gray-900 dark:text-gray-100">
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <span className="text-sm cursor-help underline decoration-dotted underline-offset-2">
                                                                                {formatDateTime(attendance.checkInTime).split('-')[0]}
                                                                            </span>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>
                                                                                {new Date(attendance.checkInTime).toLocaleString('en-US', {
                                                                                    weekday: 'long',
                                                                                    year: 'numeric',
                                                                                    month: 'long',
                                                                                    day: 'numeric',
                                                                                })}
                                                                            </p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            </TableCell>
                                                            <TableCell className="text-gray-900 dark:text-gray-100">
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <span className="text-sm cursor-help underline decoration-dotted underline-offset-2">
                                                                                {formatDateTime(attendance.checkInTime).split('-')[1]}
                                                                            </span>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>
                                                                                {new Date(attendance.checkInTime).toLocaleString('en-US', {
                                                                                    hour: 'numeric',
                                                                                    minute: '2-digit',
                                                                                    hour12: true
                                                                                })}
                                                                            </p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="h-24 text-center text-gray-500 dark:text-gray-400">
                                                            No attendance records found
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                            {memberHistory && memberHistory.length > 0 && (
                                                <TableFooter>
                                                    <TableRow className="bg-gray-50 dark:bg-gray-800">
                                                        <TableCell colSpan={2} className="font-medium text-gray-900 dark:text-gray-100">Total Check-ins</TableCell>
                                                        <TableCell colSpan={2} className="text-gray-900 dark:text-gray-100">{memberHistory ? memberHistory.length : '--'}</TableCell>
                                                    </TableRow>
                                                </TableFooter>
                                            )}
                                        </Table>
                                    </div>
                                )}
                            </CardContent>

                            {(staffHistory?.length > 0 || memberHistory?.length > 0) && (
                                <CardFooter className="flex flex-col sm:flex-row justify-between items-center pt-6 pb-4 gap-4 border-t dark:border-gray-700">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Showing <span className="font-medium text-gray-900 dark:text-gray-100">{startEntry}</span> to{" "}
                                        <span className="font-medium text-gray-900 dark:text-gray-100">{endEntry}</span> of{" "}
                                        <span className="font-medium text-gray-900 dark:text-gray-100">{totalEntries}</span> entries
                                    </div>

                                    <Pagination
                                        total={totalPages}
                                        page={currentPage}
                                        onChange={setCurrentPage}
                                        withEdges={true}
                                        siblings={1}
                                        boundaries={1}
                                    />
                                </CardFooter>
                            )}
                        </Card>
                    ) : (
                        <Card className="shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="rounded-full bg-blue-50 dark:bg-blue-900/30 p-3 mb-4">
                                    <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No Person Selected</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
                                    Please select a {membershipType === 'Staffs' ? 'staff member' : 'member'} from the search to view their attendance history.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => setActiveTab('filters')}
                                    className="dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Go to Search
                                </Button>
                            </div>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AttendanceHistory;