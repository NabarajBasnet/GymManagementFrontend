'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Pagination from "@/components/ui/CustomPagination";
import {
    DropdownMenu,
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
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Loader from "@/components/Loader/Loader";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, LogOut, UserPlus, AlertCircle, User, Calendar, Clock, HardDrive, Smartphone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const AuthLogs = () => {
    // Pagination states
    let limit = 20;
    const [currentPage, setCurrentPage] = useState(1);

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const [startDate, setStartDate] = useState(() => {
        let start = new Date();
        start.setDate(1);
        return start.toISOString().split("T")[0];
    });

    const [endDate, setEndDate] = useState(() => {
        let end = new Date();
        end.setDate(end.getDate() + 1);
        return end.toISOString().split("T")[0];
    });

    const getauthlogs = async ({ queryKey }) => {
        const [, page] = queryKey;
        try {
            const response = await fetch(`http://localhost:3000/api/authlogs?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`);
            const resBody = await response.json();
            return resBody;
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const { data, isLoading } = useQuery({
        queryKey: ['authlogs', currentPage, startDate, endDate],
        queryFn: getauthlogs
    });

    const { authlogs, totalPages } = data || {};

    // Action icons mapping
    const actionIcons = {
        login_success: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        login_failed: <XCircle className="h-4 w-4 text-red-500" />,
        logout: <LogOut className="h-4 w-4 text-blue-500" />,
        register: <UserPlus className="h-4 w-4 text-purple-500" />,
        unauthorized_access: <AlertCircle className="h-4 w-4 text-orange-500" />
    };

    // Action badge variants
    const actionBadgeVariants = {
        login_success: "success",
        login_failed: "destructive",
        logout: "outline",
        register: "secondary",
        unauthorized_access: "warning"
    };

    // Get device type from user agent
    const getDeviceType = (userAgent) => {
        if (!userAgent) return 'Unknown';
        if (/mobile/i.test(userAgent)) return 'Mobile';
        if (/tablet/i.test(userAgent)) return 'Tablet';
        if (/windows|linux|mac/i.test(userAgent)) return 'Desktop';
        return 'Unknown';
    };

    return (
        <div className="w-full bg-gray-50 px-4 py-6 min-h-screen">
            {/* Header Section */}
            <div className='w-full bg-white p-6 rounded-lg shadow-sm border mb-6'>
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
                            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Logs</BreadcrumbPage>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-semibold">Auth Logs</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className='w-full flex justify-between items-center mt-4'>
                    <div>
                        <h1 className="text-2xl font-bold">Authentication Logs</h1>
                        <p className="text-sm text-gray-500">Monitor all authentication activities</p>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <Card className='mb-6'>
                <CardHeader className="border-b">
                    <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                type="date"
                                className="bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                type="date"
                                className="bg-white"
                            />
                        </div>
                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    const start = new Date();
                                    start.setDate(1);
                                    setStartDate(start.toISOString().split("T")[0]);
                                    setEndDate(formatDate(new Date()));
                                    setCurrentPage(1);
                                }}
                                className="w-full"
                            >
                                Reset Filters
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Logs Section */}
            <Card>
                <CardHeader className="border-b">
                    <div className="flex justify-between items-center">
                        <CardTitle>Authentication Events</CardTitle>
                        {!isLoading && (
                            <span className="text-sm text-gray-500">
                                {authlogs?.length || 0} records found
                            </span>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-8 flex justify-center">
                            <Loader />
                        </div>
                    ) : (
                        <div>
                            {Array.isArray(authlogs) && authlogs.length >= 1 ? (
                                <div className="divide-y">
                                    {authlogs.map((log) => (
                                        <div key={log._id} className='p-6 hover:bg-gray-50 transition-colors'>
                                            <div className="flex flex-col gap-4">
                                                {/* Log Header */}
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex-shrink-0 mt-1">
                                                            {actionIcons[log.action]}
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <Avatar className="h-10 w-10">
                                                                {log.userDetails?.avatar ? (
                                                                    <AvatarImage src={log.userDetails.avatar} />
                                                                ) : (
                                                                    <AvatarFallback className="bg-gray-200">
                                                                        <User className="h-5 w-5 text-gray-600" />
                                                                    </AvatarFallback>
                                                                )}
                                                            </Avatar>
                                                            <div>
                                                                <h3 className="font-medium">
                                                                    {log.userDetails?.name || log.userDetails?.email || 'Unknown User'}
                                                                </h3>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <Badge variant={actionBadgeVariants[log.action]}>
                                                                        {log.action.replace(/_/g, ' ')}
                                                                    </Badge>
                                                                    <Badge variant={log.success ? "success" : "destructive"}>
                                                                        {log.success ? 'Success' : 'Failed'}
                                                                    </Badge>
                                                                    <Badge variant="outline" className="capitalize">
                                                                        {log.whoModel || 'user'}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                                                        <Clock className="h-4 w-4 ml-2" />
                                                        <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
                                                    </div>
                                                </div>

                                                <Separator className="my-2" />

                                                {/* Log Details */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {/* User Details */}
                                                    <div className="space-y-2">
                                                        <h4 className="text-sm font-medium text-gray-500">User Details</h4>
                                                        <div className="space-y-1 text-sm">
                                                            {log.userDetails?.email && (
                                                                <p><span className="font-medium">Email:</span> {log.userDetails.email}</p>
                                                            )}
                                                            {log.userDetails?.role && (
                                                                <p><span className="font-medium">Role:</span> <span className="capitalize">{log.userDetails.role}</span></p>
                                                            )}
                                                            {log.userDetails?.lastLogin && (
                                                                <p><span className="font-medium">Last Active:</span> {new Date(log.userDetails.lastLogin).toLocaleString()}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Device Details */}
                                                    <div className="space-y-2">
                                                        <h4 className="text-sm font-medium text-gray-500">Device Details</h4>
                                                        <div className="flex items-center gap-2">
                                                            {getDeviceType(log.userAgent) === 'Mobile' ? (
                                                                <Smartphone className="h-5 w-5 text-blue-500" />
                                                            ) : (
                                                                <HardDrive className="h-5 w-5 text-gray-500" />
                                                            )}
                                                            <div className="text-sm">
                                                                <p><span className="font-medium">Type:</span> {getDeviceType(log.userAgent)}</p>
                                                                <p className="truncate max-w-xs"><span className="font-medium">IP:</span> {log.ip || 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Activity Details */}
                                                    <div className="space-y-2">
                                                        <h4 className="text-sm font-medium text-gray-500">Activity</h4>
                                                        <div className="text-sm">
                                                            <p className="font-medium">{log.message}</p>
                                                            <p className="text-gray-500 mt-1 line-clamp-2">
                                                                {log.userAgent || 'No device information available'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <p className="text-gray-500">No authentication logs found for the selected period</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            <div className="w-full flex bg-white rounded-b-lg border-t p-4 justify-center md:justify-end mt-6">
                <Pagination
                    total={totalPages}
                    page={currentPage || 1}
                    onChange={setCurrentPage}
                    withEdges={true}
                    siblings={1}
                    boundaries={1}
                />
            </div>
        </div>
    );
}

export default AuthLogs;