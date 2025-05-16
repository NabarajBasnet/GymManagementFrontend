'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
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
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Loader from "@/components/Loader/Loader";

const LearnAggregation = () => {

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

    const getAccessLogs = async ({ queryKey }) => {
        const [, page] = queryKey
        try {
            const response = await fetch(`http://localhost:3000/api/accesslogs?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`);
            const resBody = await response.json();
            console.log('Res body: ', resBody);
            return resBody;

        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const { data, isLoading } = useQuery({
        queryKey: ['accesslogs', startDate, endDate, currentPage, limit],
        queryFn: getAccessLogs
    });

    const { accessLogs } = data || {};

    console.log('Data: ', data);

    return (
        <div className="w-full px-4 py-6">

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
                            <BreadcrumbPage>Access Logs</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className='w-full flex justify-between items-center'>
                    <h1 className="text-xl font-bold mt-3">Access Logs</h1>
                </div>
            </div>

            {/* Filters */}
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
                            <Button onClick={() => refetch()} className="w-full" > Apply Filters </Button>
                        </div>
                        <div className="flex items-end">
                            <Button variant="outline" onClick={() => { const start = new Date(); start.setDate(1); setStartDate(start.toISOString().split("T")[0]); setEndDate(formatDate(new Date())); setCurrentPage(1); }} className="w-full" > Reset </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>


            {/* Content Menu */}
            <div>
                {isLoading ? (
                    <Loader />
                ) : (
                    <div>
                        {Array.isArray(accessLogs) && accessLogs.length >= 1 ? (
                            <div>
                                {accessLogs.map((log) => (
                                    <div key={log._id} className='overflow-x-auto rounded-sm border p-4 shadow-sm'>
                                        <h1>{log.logMessage}</h1>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="border p-4 rounded-sm shadow-sm">
                                <p>Logs are not recorded</p>
                            </div>
                        )}
                    </div>
                )}

                {!isLoading && accessLogs.length >= limit && (
                    <Pagination
                        total={1}
                        page={currentPage || 1}
                        onChange={setCurrentPage}
                        withEdges={true}
                        siblings={1}
                        boundaries={1}
                        classNames={{
                            item: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 relative inline-flex items-center px-4 py-2 text-sm font-medium",
                            active: "z-10 bg-blue-600 border-blue-600 text-white hover:bg-blue-700",
                            dots: "relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default LearnAggregation;
