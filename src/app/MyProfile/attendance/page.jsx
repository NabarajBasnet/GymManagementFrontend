'use client';

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
import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Pagination from "@/components/ui/CustomPagination";
import { useQuery } from "@tanstack/react-query";
import { useStaff } from "@/components/Providers/LoggedInStaffProvider";
import Loader from '@/components/Loader/Loader';
import { format, parseISO } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import {
    Clock,
    Calendar,
    TrendingDown,
    DollarSign,
    User,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Timer,
    LogIn,
    LogOut,
    CalendarDays,
    Users,
    AlertCircle,
    ClockIcon
} from "lucide-react";

const Attendance = () => {
    const { staff } = useStaff();
    const loggedInStaff = staff?.loggedInStaff;
    const staffId = staff?.loggedInStaff?._id || '';
    const currencySymbol = loggedInStaff?.organization?.currency || '$';
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    const fetchAttendanceHistory = async ({ queryKey }) => {
        const [, page, id] = queryKey;
        try {
            const url = `https://fitbinary.com/api/staff-attendance-history/${id}?page=${page}&limit=${limit}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching attendance history: ", error);
            throw error;
        }
    };

    const {
        data: attendanceData,
        isLoading: isHistoryLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['attendancehistory', currentPage, staffId],
        queryFn: fetchAttendanceHistory,
        enabled: !!staffId,
        keepPreviousData: true
    });

    const {
        data: history = [],
        totalPages,
        totalLatePunchIns,
        salaryDeduction,
        deductionDays
    } = attendanceData || {};

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = parseISO(dateString);
        return (
            <>
                <div className="font-medium text-gray-900 dark:text-white">
                    {format(date, 'MMM dd, yyyy')}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {format(date, 'hh:mm:ss a')}
                </div>
            </>
        );
    };

    const getRemarkBadge = (remark) => {
        const badgeConfigs = {
            'LatePunchIn': {
                variant: "destructive",
                text: "Late Arrival",
                icon: <XCircle className="w-3 h-3" />,
                className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
            },
            'OnTime': {
                variant: "default",
                text: "On Time",
                icon: <CheckCircle className="w-3 h-3" />,
                className: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
            },
            'EarlyPunchOut': {
                variant: "secondary",
                text: "Early Out",
                icon: <AlertTriangle className="w-3 h-3" />,
                className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
            }
        };

        const config = badgeConfigs[remark] || {
            variant: "outline",
            text: remark || 'N/A',
            icon: <AlertCircle className="w-3 h-3" />
        };

        return (
            <Badge variant={config.variant} className={`flex items-center gap-1.5 px-2.5 py-1 ${config.className || ''}`}>
                {config.icon}
                <span className="font-medium">{config.text}</span>
            </Badge>
        );
    };

    const StatCard = ({ title, value, description }) => {
        // Get currency from organization
        const currencySymbol = loggedInStaff?.organization?.currency || '₹';

        return (
            <Card className="dark:bg-gray-800 border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    {title}
                                </p>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                {title === "Salary Deduction" ? `${currencySymbol} ${value}` : value}
                            </p>
                            {description && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {description}
                                </p>
                            )}
                        </div>
                        <div className={`p-3 rounded-xl ${title.includes('Late')
                            ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                            : title.includes('Deduction') && title.includes('Salary')
                                ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                                : title.includes('Deduction')
                                    ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                                    : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                            }`}>
                            {/* Display currency symbol instead of icon */}
                            <span className="text-xl font-medium">{currencySymbol}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
                <div className="max-w-md mx-auto pt-20">
                    <Card className="dark:bg-gray-800 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
                        <CardHeader className="text-center pb-4">
                            <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <CardTitle className="text-red-800 dark:text-red-400">Error Loading Data</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-red-600 dark:text-red-300">
                                {error?.message || 'Failed to load attendance history'}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="w-full mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Attendance History
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Track your attendance records and performance metrics
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        title="Late Punch-ins"
                        value={totalLatePunchIns || 0}
                        icon={Clock}
                        description="This month"
                    />
                    <StatCard
                        title="Deduction Days"
                        value={deductionDays || 0}
                        icon={CalendarDays}
                        description="Days with penalties"
                    />
                    <StatCard
                        title="Salary Deduction"
                        value={salaryDeduction || 0}
                        icon={DollarSign}
                        description="Total deducted amount"
                    />
                </div>

                {/* Main Content */}
                <Card className="dark:bg-gray-800 border-0 shadow-sm bg-white">
                    <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                <ClockIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                                Recent Activity
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isHistoryLoading ? (
                            <div className="flex justify-center items-center h-64 bg-gray-50 dark:bg-gray-800/50">
                                <div className="text-center">
                                    <Loader />
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                                        Loading attendance records...
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table className="min-w-full">
                                    <TableCaption className="mt-6 mb-4 text-gray-500 dark:text-gray-400">
                                        {history.length === 0 ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <AlertCircle className="w-4 h-4" />
                                                No attendance records found
                                            </div>
                                        ) : (
                                            `Showing ${history.length} of your recent attendance records`
                                        )}
                                    </TableCaption>
                                    <TableHeader>
                                        <TableRow className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    Date
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4" />
                                                    Employee
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4" />
                                                    Role
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <LogIn className="w-4 h-4" />
                                                    Check In
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <LogOut className="w-4 h-4" />
                                                    Check Out
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4" />
                                                    Status
                                                </div>
                                            </TableHead>
                                            <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-300">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Timer className="w-4 h-4" />
                                                    Late
                                                </div>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {history.length > 0 ? (
                                            history.map((attendance, index) => (
                                                <TableRow
                                                    key={attendance._id}
                                                    className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                                >
                                                    <TableCell className="py-4">
                                                        <div className="font-medium text-gray-900 dark:text-white">
                                                            {attendance.checkIn ?
                                                                format(parseISO(attendance.checkIn), 'MMM dd, yyyy') :
                                                                'N/A'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="font-medium text-gray-900 dark:text-white">
                                                            {attendance.fullName}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="text-gray-600 dark:text-gray-300">
                                                            {attendance.role}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="text-sm">
                                                            {attendance.checkIn ? (
                                                                <div className="text-gray-500 dark:text-gray-400">
                                                                    {new Date(attendance.checkIn).toLocaleString()}
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400 dark:text-gray-500">N/A</span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="text-sm">
                                                            {attendance.checkOut ? (
                                                                <div className="text-gray-500 dark:text-gray-400">
                                                                    {new Date(attendance.checkOut).toLocaleString()}
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400 dark:text-gray-500">N/A</span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        {getRemarkBadge(attendance.remark)}
                                                    </TableCell>
                                                    <TableCell className="text-right py-4">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${attendance.lateFlag
                                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                                            : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                                            }`}>
                                                            {attendance.lateFlag ? (
                                                                <>
                                                                    <XCircle className="w-3 h-3" />
                                                                    Yes
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <CheckCircle className="w-3 h-3" />
                                                                    No
                                                                </>
                                                            )}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-12">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                                                            <Calendar className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500 dark:text-gray-400 font-medium">
                                                                No attendance records found
                                                            </p>
                                                            <p className="text-sm text-gray-400 dark:text-gray-500">
                                                                Your attendance history will appear here
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>

                                {totalPages > 1 && (
                                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
                                        <Pagination
                                            total={totalPages}
                                            page={currentPage}
                                            onChange={setCurrentPage}
                                            withEdges={true}
                                            siblings={1}
                                            boundaries={1}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Attendance;