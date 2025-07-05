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

const AuditLogs = () => {

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
        const end = new Date();
        end.setDate(end.getDate() + 1);
        return end.toISOString().split('T')[0]
    });

    const getAuditLogs = async ({ queryKey }) => {
        const [, page] = queryKey
        try {
            const response = await fetch(`https://fitbinary.com/api/auditlogs?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`);
            const resBody = await response.json();
            return resBody;

        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const { data, isLoading } = useQuery({
        queryKey: ['auditlogs', currentPage, startDate, endDate,],
        queryFn: getAuditLogs
    });

    const { auditlogs, totalPages } = data || {};

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
                            <BreadcrumbPage>Audit Logs</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className='w-full flex justify-between items-center'>
                    <h1 className="text-xl font-bold mt-3">Audit Logs</h1>
                </div>
            </div>

            {/* Filters */}
            {!isLoading && auditlogs.length >= 1 && (
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
                        {Array.isArray(auditlogs) && auditlogs.length >= 1 ? (
                            <div className="space-y-4">
                                {auditlogs.map((log) => (
                                    <div key={log._id} className='overflow-x-auto my-2 bg-white rounded-sm border p-4 shadow-sm'>
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {log.who.user?.firstName} {log.who.user?.lastName} ({log.who.user?.email})
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(log.when).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                                    {log.what}
                                                </span>
                                                {log.to && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {log.to.status && `Status: ${log.to.status}`}
                                                        {log.to.membershipHoldDate && ` | Hold until: ${log.to.membershipHoldDate}`}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <p className="text-xs text-gray-500">
                                                From: {log.fromWhere.split('||')[0].trim()} | {log.fromWhere.split('||')[1].trim()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="w-full my-4 border bg-white p-4 rounded-sm shadow-sm">
                                <p className="text-sm font-medium text-center">No audit logs found for the selected period</p>
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

export default AuditLogs;
