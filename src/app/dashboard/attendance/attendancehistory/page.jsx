'use client';

import { useState, useEffect, useRef } from "react";
import { Search, InfoIcon, CalendarIcon, ChevronDown, Clock, User, UserCheck } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/Pagination";

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
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [persons, setPersons] = useState([]);
    const limit = 10; // Set limit for pagination
    const searchRef = useRef(null);

    // Fetch members data
    const fetchAllMembers = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`http://88.198.112.156:3000/api/members?startDate=${startDate}&endDate=${endDate}`);
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
            const response = await fetch(`http://88.198.112.156:3000/api/staffsmanagement`);
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

    // Fetch attendance history
    const fetchAttendanceHistory = async () => {
        if (!id) return;

        try {
            setIsLoading(true);
            const staffsAttendanceURL = `http://88.198.112.156:3000/api/staff-attendance-history/${id}?page=${currentPage}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`;
            const membersAttendanceURL = `http://88.198.112.156:3000/api/member-attendance-history/${id}?page=${currentPage}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`;

            const response = await fetch(membershipType === 'Staffs' ? staffsAttendanceURL : membersAttendanceURL);
            const responseBody = await response.json();

            if (response.ok) {
                setBody(responseBody);
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

    // Effect to fetch attendance history when dependencies change
    useEffect(() => {
        if (id) {
            fetchAttendanceHistory();
        }
    }, [id, membershipType, startDate, endDate, currentPage]);

    // Handle click outside search dropdown
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

    // Pagination setup
    const { range, setPage, active } = usePagination({
        total: totalPages || 1,
        siblings: 1,
        boundaries: 1,
        page: currentPage,
        onChange: (page) => {
            setCurrentPage(page);
        },
    });

    // Calculate pagination details
    const startEntry = (currentPage - 1) * limit + 1;
    const totalEntries = membershipType === 'Members'
        ? memberHistory?.length || 0
        : staffHistory?.length || 0;
    const endEntry = Math.min(currentPage * limit, totalEntries);

    // Format date for display
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
        <div className="w-full min-h-screen bg-gray-50 px-4 py-6">
            <Card className="shadow-sm mb-6">
                <CardHeader className="pb-3">
                    <div className="flex items-center pb-2">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/" className="text-blue-600 hover:text-blue-800">Home</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink className="text-blue-600 hover:text-blue-800">Attendance</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Attendance History</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-800">Attendance History</CardTitle>
                    <CardDescription className="text-gray-500">
                        View and track attendance records for staff and members
                    </CardDescription>
                </CardHeader>
            </Card>

            <Tabs defaultValue="filters" className="w-full">
                <TabsList className="mb-6 bg-white">
                    <TabsTrigger value="filters" className="data-[state=active]:bg-blue-50">
                        <div className="flex items-center">
                            <Search className="mr-2 h-4 w-4" />
                            Filters & Search
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="results" className="data-[state=active]:bg-blue-50">
                        <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            Attendance Results
                        </div>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="filters">
                    <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                            <Alert className="bg-blue-50 border-blue-200 mb-4">
                                <InfoIcon className="h-4 w-4 text-blue-600" />
                                <AlertDescription className="text-blue-700 text-sm ml-2">
                                    Showing data from the beginning of the current month. Adjust dates below to view different periods.
                                </AlertDescription>
                            </Alert>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* From Date */}
                                <div className="space-y-2">
                                    <Label htmlFor="from-date" className="text-sm font-medium text-gray-700">From Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="from-date"
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal transition-all",
                                                    !startDate && "text-gray-400"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                                                {startDate ? format(startDate, "PPP") : "Select start date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={startDate}
                                                onSelect={setStartDate}
                                                initialFocus
                                                className="rounded-md border"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {/* To Date */}
                                <div className="space-y-2">
                                    <Label htmlFor="to-date" className="text-sm font-medium text-gray-700">To Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="to-date"
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal transition-all",
                                                    !endDate && "text-gray-400"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                                                {endDate ? format(endDate, "PPP") : "Select end date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={endDate}
                                                onSelect={setEndDate}
                                                initialFocus
                                                className="rounded-md border"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {/* Membership Type */}
                                <div className="space-y-2">
                                    <Label htmlFor="membership-type" className="text-sm font-medium text-gray-700">Membership Type</Label>
                                    <Select value={membershipType} onValueChange={(value) => {
                                        setMembershipType(value);
                                        setId(''); // Reset selected person when changing type
                                        setSearchQuery('');
                                    }}>
                                        <SelectTrigger id="membership-type" className="w-full">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Select Type</SelectLabel>
                                                <SelectItem value="Members">Members</SelectItem>
                                                <SelectItem value="Staffs">Staff</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Search Person */}
                                <div className="space-y-2" ref={searchRef}>
                                    <Label htmlFor="person-search" className="text-sm font-medium text-gray-700">
                                        {membershipType === 'Members' ? 'Member' : 'Staff'} Name
                                    </Label>
                                    <div className="relative">
                                        <div className="flex items-center border rounded-md transition-all focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-400">
                                            <Search className="h-4 w-4 ml-3 text-gray-400" />
                                            <Input
                                                id="person-search"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onFocus={() => setRenderDropdown(true)}
                                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                placeholder={`Search ${membershipType === 'Members' ? 'members' : 'staff'}...`}
                                            />
                                        </div>

                                        {renderDropdown && (
                                            <div className="absolute z-50 w-full mt-1 max-h-64 overflow-y-auto bg-white border rounded-md shadow-lg">
                                                {isLoading ? (
                                                    <div className="p-4 space-y-2">
                                                        <Skeleton className="h-6 w-full" />
                                                        <Skeleton className="h-6 w-full" />
                                                        <Skeleton className="h-6 w-full" />
                                                    </div>
                                                ) : persons?.length > 0 ? (
                                                    persons
                                                        .filter((person) =>
                                                            person.fullName.toLowerCase().includes(searchQuery.toLowerCase())
                                                        )
                                                        .map((person) => (
                                                            <div
                                                                key={person._id}
                                                                onClick={() => {
                                                                    setSearchQuery(person.fullName);
                                                                    setId(person._id);
                                                                    setRenderDropdown(false);
                                                                }}
                                                                className="px-4 py-3 flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
                                                            >
                                                                <User className="h-4 w-4 text-gray-500" />
                                                                <span>{person.fullName}</span>
                                                            </div>
                                                        ))
                                                ) : (
                                                    <div className="p-4 text-center text-gray-500">
                                                        No {membershipType.toLowerCase()} found
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="mt-8 bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => {
                                    if (id) fetchAttendanceHistory();
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
                        <Card className="shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl font-medium">
                                    {searchQuery ? `Attendance Record for ${searchQuery}` : 'Attendance Records'}
                                </CardTitle>
                                <CardDescription>
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
                                        <Card className="bg-amber-50 border-amber-200">
                                            <CardHeader className="py-3">
                                                <CardTitle className="text-sm font-medium text-amber-800">Late Check-ins</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-2xl font-bold text-amber-900">{body.totalLatePunchIns || 0}</p>
                                            </CardContent>
                                        </Card>

                                        <Card className="bg-purple-50 border-purple-200">
                                            <CardHeader className="py-3">
                                                <CardTitle className="text-sm font-medium text-purple-800">Deduction Days</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-2xl font-bold text-purple-900">{body.deductionDays || 0}</p>
                                            </CardContent>
                                        </Card>

                                        <Card className="bg-red-50 border-red-200">
                                            <CardHeader className="py-3">
                                                <CardTitle className="text-sm font-medium text-red-800">Salary Deducted</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-2xl font-bold text-red-900">₹ {body.salaryDeduction ? Math.floor(body.salaryDeduction) : 0}</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            )}

                            <CardContent>
                                {isLoading ? (
                                    <div className="space-y-4">
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-32 w-full" />
                                        <Skeleton className="h-32 w-full" />
                                    </div>
                                ) : membershipType === 'Staffs' ? (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader className="bg-gray-50">
                                                <TableRow>
                                                    <TableHead className="font-medium">Staff ID</TableHead>
                                                    <TableHead className="font-medium">Full Name</TableHead>
                                                    <TableHead className="font-medium">Role</TableHead>
                                                    <TableHead className="font-medium">Check In</TableHead>
                                                    <TableHead className="font-medium">Check Out</TableHead>
                                                    <TableHead className="font-medium">Status</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {staffHistory && staffHistory.length > 0 ? (
                                                    staffHistory.map((attendance) => (
                                                        <TableRow key={attendance._id} className="hover:bg-gray-50">
                                                            <TableCell className="font-medium">{attendance.staffId}</TableCell>
                                                            <TableCell>{attendance.fullName}</TableCell>
                                                            <TableCell>{attendance.role}</TableCell>
                                                            <TableCell>
                                                                {attendance.checkIn ? (
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <span className="text-sm cursor-help underline decoration-dotted underline-offset-2">
                                                                                    {formatDateTime(attendance.checkIn)}
                                                                                </span>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                <p>
                                                                                    {attendance.checkIn ?
                                                                                        `${new Date(attendance.checkIn).toISOString().split('T')[0]} - ` +
                                                                                        new Date(attendance.checkIn).toLocaleTimeString('en-US', {
                                                                                            hour12: true,
                                                                                            hour: 'numeric',
                                                                                            minute: '2-digit',
                                                                                            second: '2-digit',
                                                                                            timeZone: 'UTC'
                                                                                        })
                                                                                        : ''}
                                                                                </p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                ) : (
                                                                    <span className="text-gray-400">--</span>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {attendance.checkOut ? (
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <span className="text-sm cursor-help underline decoration-dotted underline-offset-2">
                                                                                    {formatDateTime(attendance.checkOut)}
                                                                                </span>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                <p>
                                                                                    {attendance.checkOut ?
                                                                                        `${new Date(attendance.checkOut).toISOString().split('T')[0]} - ` +
                                                                                        new Date(attendance.checkOut).toLocaleTimeString('en-US', {
                                                                                            hour12: true,
                                                                                            hour: 'numeric',
                                                                                            minute: '2-digit',
                                                                                            second: '2-digit',
                                                                                            timeZone: 'UTC'
                                                                                        })
                                                                                        : ''}
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
                                                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                                                        Late
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                                        On Time
                                                                    </Badge>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                                            No attendance records found
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                            {staffHistory && staffHistory.length > 0 && (
                                                <TableFooter>
                                                    <TableRow className="bg-gray-50">
                                                        <TableCell colSpan={2} className="font-medium">Total Check-in Time</TableCell>
                                                        <TableCell colSpan={4}>{body ? body.totalStaffAttendance : '--'}</TableCell>
                                                    </TableRow>
                                                </TableFooter>
                                            )}
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader className="bg-gray-50">
                                                <TableRow>
                                                    <TableHead className="font-medium">Member ID</TableHead>
                                                    <TableHead className="font-medium">Full Name</TableHead>
                                                    <TableHead className="font-medium">Membership Option</TableHead>
                                                    <TableHead className="font-medium">Check In Date</TableHead>
                                                    <TableHead className="font-medium">Check In Time</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {memberHistory && memberHistory.length > 0 ? (
                                                    memberHistory.map((attendance) => (
                                                        <TableRow key={attendance._id} className="hover:bg-gray-50">
                                                            <TableCell className="font-medium">{attendance.memberId}</TableCell>
                                                            <TableCell>{attendance.fullName}</TableCell>
                                                            <TableCell className='text-start'>
                                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                                    {attendance.membershipOption}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
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
                                                            <TableCell>
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
                                                        <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                                                            No attendance records found
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                            {memberHistory && memberHistory.length > 0 && (
                                                <TableFooter>
                                                    <TableRow className="bg-gray-50">
                                                        <TableCell colSpan={2} className="font-medium">Total Check-ins</TableCell>
                                                        <TableCell colSpan={2}>{memberHistory ? memberHistory.length : '--'}</TableCell>
                                                    </TableRow>
                                                </TableFooter>
                                            )}
                                        </Table>
                                    </div>
                                )}
                            </CardContent>

                            {(staffHistory?.length > 0 || memberHistory?.length > 0) && (
                                <CardFooter className="flex flex-col sm:flex-row justify-between items-center pt-6 pb-4 gap-4 border-t">
                                    <div className="text-sm text-gray-500">
                                        Showing <span className="font-medium">{startEntry}</span> to{" "}
                                        <span className="font-medium">{endEntry}</span> of{" "}
                                        <span className="font-medium">{totalEntries}</span> entries
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
                        <Card className="shadow-sm">
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="rounded-full bg-blue-50 p-3 mb-4">
                                    <User className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No Person Selected</h3>
                                <p className="text-gray-500 text-center max-w-md mb-6">
                                    Please select a {membershipType === 'Staffs' ? 'staff member' : 'member'} from the search to view their attendance history.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => document.querySelector('[value="filters"]').click()}
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