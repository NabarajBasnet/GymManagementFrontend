'use client';

import { toast as hotToast } from 'react-hot-toast';
import { toast as sonnerToast } from 'sonner';
import Pagination from "@/components/ui/CustomPagination";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, FilterIcon, DownloadIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LockerLogs = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [action, setAction] = useState("all");

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 3000);
        return () => clearTimeout(timer);
    }, [search]);

    // Fetch function
    const fetchLockerLogs = async ({ queryKey }) => {
        const [, page, limit, search, action] = queryKey;
        const res = await fetch(
            `http://localhost:3000/api/locker-logs?page=${page}&limit=${limit}&search=${search}&action=${action}`
        );
        const resBody = await res.json();
        return resBody;
    };

    // Using React Query
    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['lockerLogs', currentPage, limit, debouncedSearch, action],
        queryFn: fetchLockerLogs,
        keepPreviousData: true,
        staleTime: 5000,
    });

    const { logs, totalPages, total } = data || {};

    // Debounced search handler
    const handleSearch = (value) => {
        setPage(1);
        setSearch(value);
    };

    // Action filter handler
    const handleActionFilter = (value) => {
        setPage(1);
        setAction(value);
    };

    return (
        <Card className="w-full dark:bg-gray-800 dark:border-none">
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <CardTitle>Locker System Logs</CardTitle>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search logs..."
                                className="pl-9 w-full py-6 rounded-sm dark:bg-gray-900 dark:border-none sm:w-[200px]"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <Select value={action} onValueChange={handleActionFilter}>
                            <SelectTrigger className="w-[180px] dark:border-none dark:bg-gray-900 rounded-sm py-6">
                                <SelectValue placeholder="Filter by action" />
                            </SelectTrigger>
                            <SelectContent className='dark:border-none dark:bg-gray-900'>
                                <SelectItem value="all" className='cursor-pointer hover:bg-blue-500'>All Actions</SelectItem>
                                <SelectItem value="Created" className='cursor-pointer hover:bg-blue-500'>Created</SelectItem>
                                <SelectItem value="Assigned" className='cursor-pointer hover:bg-blue-500'>Assigned</SelectItem>
                                <SelectItem value="Released" className='cursor-pointer hover:bg-blue-500'>Released</SelectItem>
                                <SelectItem value="Status Changed" className='cursor-pointer hover:bg-blue-500'>Status Changed</SelectItem>
                                <SelectItem value="Maintenance" className='cursor-pointer hover:bg-blue-500'>Maintenance</SelectItem>
                                <SelectItem value="Reset" className='cursor-pointer hover:bg-blue-500'>Reset</SelectItem>
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
                                                <span className={`px-2 py-1 rounded-full text-xs ${log.action === 'Created' ? 'bg-blue-100 text-blue-800' :
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
                    </>
                )}
                <div className='w-full flex justify-end my-4'>
                    <Pagination
                        total={totalPages || 1}
                        page={currentPage || 1}
                        onChange={setCurrentPage}
                        withEdges={true}
                        siblings={1}
                        boundaries={1}
                        className="flex items-center space-x-1 dark:text-gray-100"
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default LockerLogs;
