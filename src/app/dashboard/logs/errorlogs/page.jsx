'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Pagination from "@/components/ui/CustomPagination";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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

const ErrorLogs = () => {

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

    const [endDate, setEndDate] = useState(formatDate(new Date()));

    const geterrorlogs = async ({ queryKey }) => {
        const [, page] = queryKey
        try {
            const response = await fetch(`http://localhost:3000/api/errorlogs?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`);
            const resBody = await response.json();
            console.log('Res body: ', resBody);
            return resBody;

        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const { data, isLoading } = useQuery({
        queryKey: ['errorlogs', currentPage, startDate, endDate,],
        queryFn: geterrorlogs
    });

    const { errorlogs, totalPages } = data || {};

    return (
        <div className="w-full bg-gray-100 px-4 py-6">

            {/* Breadcrumb menu */}
            <div className='w-full bg-white p-6 rounded-md shadow-sm border'>
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
                            <BreadcrumbPage>Error Logs</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className='w-full flex justify-between items-center'>
                    <h1 className="text-xl font-bold mt-3">Error Logs</h1>
                </div>
            </div>

            {/* Filters */}
            {!isLoading && errorlogs.length >= 1 && (
                <Card className='my-4'>
                    <CardHeader>
                        <CardTitle className="text-lg">Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" />
                            </div>
                            <div className="flex items-end">
                                <Button variant="outline" onClick={() => { const start = new Date(); start.setDate(1); setStartDate(start.toISOString().split("T")[0]); setEndDate(formatDate(new Date())); setCurrentPage(1); }} className="w-full" > Reset </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Content Menu */}
            <div>
                {isLoading ? (
                    <div className="my-4">
                        <Loader />
                    </div>
                ) : (
                    <div>
                        {Array.isArray(errorlogs) && errorlogs.length >= 1 ? (
                            <div className="space-y-4">
                                {errorlogs.map((log) => (
                                    <div key={log._id} className='overflow-x-auto my-2 bg-white rounded-sm border p-4 shadow-sm'>
                                        <div className="flex flex-col gap-2">
                                            {/* Error details header */}
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {log.route} [{log.method}] - Status: {log.statusCode}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(log.timestamp || log.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                                {log.user && (
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                                        User ID: {log.user.toString()}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Error message */}
                                            <div className="mt-2">
                                                <p className="text-sm font-semibold text-red-600">Error:</p>
                                                <p className="text-sm">{log.message}</p>
                                            </div>

                                            {/* Stack trace (collapsible) */}
                                            {log.stack && (
                                                <details className="mt-2">
                                                    <summary className="text-sm font-semibold cursor-pointer">Stack Trace</summary>
                                                    <pre className="text-xs bg-gray-100 p-2 mt-1 rounded overflow-x-auto">
                                                        {log.stack}
                                                    </pre>
                                                </details>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="w-full my-4 border bg-white p-4 rounded-sm shadow-sm">
                                <p className="text-sm font-medium text-center">No error logs found for the selected period</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="w-full flex bg-white rounded-sm p-4 justify-center md:justify-end my-4">
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
        </div>
    );
}

export default ErrorLogs;
