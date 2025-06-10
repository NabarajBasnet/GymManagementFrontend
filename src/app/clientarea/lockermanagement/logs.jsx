'use client';

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, FilterIcon, DownloadIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Fetch function
const fetchLockerLogs = async ({ page, search, action }) => {
    const response = await fetch(
        `/api/locker-logs?page=${page}&search=${search}&action=${action}`
    );
    
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data.data;
};

const LockerLogs = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [action, setAction] = useState("all");

    // Using React Query
    const {
        data,
        isLoading,
        isError,
        error,
        isFetching
    } = useQuery({
        queryKey: ['lockerLogs', page, search, action],
        queryFn: () => fetchLockerLogs({ page, search, action }),
        keepPreviousData: true, // Keep previous data while fetching new data
        staleTime: 5000, // Consider data fresh for 5 seconds
    });

    // Debounced search handler
    const handleSearch = (value) => {
        setPage(1); // Reset to first page on new search
        setSearch(value);
    };

    // Action filter handler
    const handleActionFilter = (value) => {
        setPage(1); // Reset to first page on new filter
        setAction(value);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <CardTitle>Locker System Logs</CardTitle>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search logs..."
                                className="pl-9 w-full sm:w-[200px]"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <Select value={action} onValueChange={handleActionFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by action" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Actions</SelectItem>
                                <SelectItem value="Created">Created</SelectItem>
                                <SelectItem value="Assigned">Assigned</SelectItem>
                                <SelectItem value="Released">Released</SelectItem>
                                <SelectItem value="Status Changed">Status Changed</SelectItem>
                                <SelectItem value="Maintenance">Maintenance</SelectItem>
                                <SelectItem value="Reset">Reset</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isError ? (
                    <div className="text-center text-red-500 py-4">
                        Error: {error.message}
                    </div>
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Locker ID</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : data?.logs?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">
                                            No logs found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data?.logs?.map((log) => (
                                        <TableRow key={log._id}>
                                            <TableCell>{log.lockerId}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    log.action === 'Created' ? 'bg-blue-100 text-blue-800' :
                                                    log.action === 'Assigned' ? 'bg-green-100 text-green-800' :
                                                    log.action === 'Released' ? 'bg-yellow-100 text-yellow-800' :
                                                    log.action === 'Status Changed' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {log.action}
                                                </span>
                                            </TableCell>
                                            <TableCell>{log.user}</TableCell>
                                            <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                                            <TableCell className="max-w-[200px] truncate">{log.details}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {data?.pagination && (
                            <div className="flex items-center justify-between mt-4">
                                <p className="text-sm text-gray-600">
                                    Showing {((page - 1) * data.pagination.limit) + 1} to {Math.min(page * data.pagination.limit, data.pagination.total)} of {data.pagination.total} entries
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        disabled={page === 1 || isLoading}
                                        onClick={() => setPage(old => Math.max(old - 1, 1))}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        disabled={page === data.pagination.pages || isLoading}
                                        onClick={() => setPage(old => Math.min(old + 1, data.pagination.pages))}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Loading overlay for subsequent fetches */}
                        {isFetching && !isLoading && (
                            <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                                Loading...
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default LockerLogs;
