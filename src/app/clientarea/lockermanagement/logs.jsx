'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, FilterIcon, DownloadIcon } from "lucide-react";

const logsData = [
    {
        id: "LOG001",
        action: "Locker Created",
        lockerId: "LKR-101",
        user: "admin@example.com",
        timestamp: "2023-05-15 10:30:45",
        details: "Created new locker with size Medium"
    },
    {
        id: "LOG002",
        action: "Status Changed",
        lockerId: "LKR-042",
        user: "staff@example.com",
        timestamp: "2023-05-15 09:15:22",
        details: "Changed status from Available to Maintenance"
    },
    {
        id: "LOG003",
        action: "Locker Assigned",
        lockerId: "LKR-078",
        user: "client@example.com",
        timestamp: "2023-05-14 16:45:10",
        details: "Assigned to Client ID: CLT-556"
    },
    {
        id: "LOG004",
        action: "Locker Released",
        lockerId: "LKR-033",
        user: "system",
        timestamp: "2023-05-14 14:20:33",
        details: "Automatically released after 24 hours"
    },
    {
        id: "LOG005",
        action: "Access Denied",
        lockerId: "LKR-112",
        user: "client@example.com",
        timestamp: "2023-05-13 11:05:17",
        details: "Invalid access attempt"
    },
    {
        id: "LOG006",
        action: "Maintenance Complete",
        lockerId: "LKR-042",
        user: "staff@example.com",
        timestamp: "2023-05-13 10:15:09",
        details: "Completed maintenance work"
    },
    {
        id: "LOG007",
        action: "Locker Disabled",
        lockerId: "LKR-089",
        user: "admin@example.com",
        timestamp: "2023-05-12 17:30:41",
        details: "Disabled due to damage"
    }
];

const LockerLogs = () => {
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
                            />
                        </div>
                        <Button variant="outline">
                            <FilterIcon className="mr-2 h-4 w-4" />
                            Filters
                        </Button>
                        <Button variant="outline">
                            <DownloadIcon className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Log ID</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Locker ID</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logsData.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell className="font-medium">{log.id}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${log.action.includes('Created') ? 'bg-blue-100 text-blue-800' :
                                        log.action.includes('Changed') ? 'bg-purple-100 text-purple-800' :
                                            log.action.includes('Assigned') ? 'bg-green-100 text-green-800' :
                                                log.action.includes('Denied') ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                        }`}>
                                        {log.action}
                                    </span>
                                </TableCell>
                                <TableCell>{log.lockerId}</TableCell>
                                <TableCell>{log.user}</TableCell>
                                <TableCell>{log.timestamp}</TableCell>
                                <TableCell className="max-w-[200px] truncate">{log.details}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-600">
                        Showing 1 to {logsData.length} of {logsData.length} entries
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" disabled>
                            Previous
                        </Button>
                        <Button variant="outline">
                            Next
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default LockerLogs;
