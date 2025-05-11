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
import { usePagination } from "@/hooks/Pagination";
import Pagination from "@/components/ui/CustomPagination";
import { useQuery } from "@tanstack/react-query";
import { useStaff } from "@/components/Providers/LoggedInStaffProvider";
import Loader from '@/components/Loader/Loader';
import { format, parseISO } from 'date-fns';
import { Badge } from "@/components/ui/badge";

const Attendance = () => {
    const { staff } = useStaff();
    const staffId = staff?.loggedInStaff?._id || '';

    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    const fetchAttendanceHistory = async ({ queryKey }) => {
        const [, page, id] = queryKey;
        try {
            const url = `http://88.198.112.156:3000/api/staff-attendance-history/${id}?page=${page}&limit=${limit}`;
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

    const { range, setPage, active } = usePagination({
        total: totalPages,
        siblings: 1,
        boundaries: 1,
        page: currentPage,
        onChange: (page) => {
            setCurrentPage(page);
        },
    });

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = parseISO(dateString);
        return (
            <>
                <div>{format(date, 'MMM dd, yyyy')}</div>
                <div className="text-sm text-muted-foreground">
                    {format(date, 'hh:mm:ss a')}
                </div>
            </>
        );
    };

    const getRemarkBadge = (remark) => {
        switch (remark) {
            case 'LatePunchIn':
                return <Badge variant="destructive">Late</Badge>;
            case 'OnTime':
                return <Badge variant="success">On Time</Badge>;
            case 'EarlyPunchOut':
                return <Badge variant="warning">Early Out</Badge>;
            default:
                return <Badge variant="outline">{remark || 'N/A'}</Badge>;
        }
    };

    if (isError) {
        return (
            <div className="flex items-center justify-center h-64">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-red-500">
                            {error?.message || 'Failed to load attendance history'}
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Attendance History</CardTitle>
                </CardHeader>
                <CardContent>
                    {isHistoryLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Late Punch-ins
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{totalLatePunchIns}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Deduction Days
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{deductionDays}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            Salary Deduction
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">${salaryDeduction}</div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Table className="min-w-full">
                                <TableCaption className="mt-4">
                                    {history.length === 0 ? 'No attendance records found' : 'Your recent attendance history'}
                                </TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[120px]">Date</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Check In</TableHead>
                                        <TableHead>Check Out</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Late</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {history.length > 0 ? (
                                        history.map((attendance) => (
                                            <TableRow key={attendance._id}>
                                                <TableCell>
                                                    {attendance.checkIn ?
                                                        format(parseISO(attendance.checkIn), 'MMM dd, yyyy') :
                                                        'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    {attendance.fullName}
                                                </TableCell>
                                                <TableCell>
                                                    {attendance.role}
                                                </TableCell>

                                                <TableCell>
                                                    {
                                                        attendance.checkIn ?
                                                            `${new Date(attendance.checkIn).toISOString().split('T')[0]} - ` +
                                                            new Date(attendance.checkIn).toLocaleTimeString('en-US', {
                                                                hour12: true,
                                                                hour: 'numeric',
                                                                minute: '2-digit',
                                                                second: '2-digit',
                                                                timeZone: 'UTC'
                                                            })
                                                            : ''
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        attendance.checkOut ?
                                                            `${new Date(attendance.checkOut).toISOString().split('T')[0]} - ` +
                                                            new Date(attendance.checkOut).toLocaleTimeString('en-US', {
                                                                hour12: true,
                                                                hour: 'numeric',
                                                                minute: '2-digit',
                                                                second: '2-digit',
                                                                timeZone: 'UTC'
                                                            })
                                                            : ''
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {getRemarkBadge(attendance.remark)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {attendance.lateFlag ? 'Yes' : 'No'}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8">
                                                No attendance records found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            {totalPages > 1 && (
                                <div className="mt-6">
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
    );
};

export default Attendance;
