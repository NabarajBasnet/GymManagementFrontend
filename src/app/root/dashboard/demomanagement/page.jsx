'use client'

import Pagination from "@/components/ui/CustomPagination";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Loader2,
    RefreshCw,
    Users,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Building2,
    Filter,
    Search,
    Download,
    Plus,
    Eye,
    Clock,
    CheckCircle,
    PhoneCall,
    Play,
    Trophy,
    XCircle
} from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Loader from "@/components/Loader/Loader";

const DemoManagement = () => {
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(10);

    const fetchAllDemos = async ({ queryKey }) => {
        const [, page, limit] = queryKey;
        const response = await fetch(`http://localhost:3000/api/demo/get-demos?page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch demos');
        return await response.json();
    };

    const updateStatus = async ({ id, status }) => {
        const response = await fetch(`http://localhost:3000/api/demo/change-demo-status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, status }),
        });
        if (!response.ok) throw new Error('Failed to update status');
        return await response.json();
    };

    const { mutate: updateStatusMutation } = useMutation({
        mutationFn: updateStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['demos'] });
            toast.success('Status updated successfully');
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const { data, isLoading, isError } = useQuery({
        queryKey: ['demos', currentPage, limit],
        queryFn: fetchAllDemos,
    });

    const { demos, totalDemos, totalPages } = data || {};

    const handleStatusChange = (id, value) => {
        updateStatusMutation({ id, status: value });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <Clock className="h-3 w-3" />;
            case 'Approved': return <CheckCircle className="h-3 w-3" />;
            case 'Contacted': return <PhoneCall className="h-3 w-3" />;
            case 'Demo_Given': return <Play className="h-3 w-3" />;
            case 'Converted': return <Trophy className="h-3 w-3" />;
            case 'Rejected': return <XCircle className="h-3 w-3" />;
            default: return <Clock className="h-3 w-3" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Approved': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Contacted': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
            case 'Demo_Given': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'Converted': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    if (isLoading) return (
        <Loader />
    );

    if (isError) return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-lg font-medium text-red-600 dark:text-red-400">Error loading data</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Please try refreshing the page</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Demo Management</h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and track all demo requests from potential customers</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">{totalDemos || 0}</span>
                                <span>total requests</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => queryClient.invalidateQueries({ queryKey: ['demos'] })}
                                className="text-primary dark:bg-gray-700 dark:border-none"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
                <div className="w-full mx-auto">

                    {/* Demo Cards */}
                    <Card className="shadow-md border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                                            <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <Users className="h-4 w-4" />
                                                    <span>Contact</span>
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <Mail className="h-4 w-4" />
                                                    <span>Email</span>
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <Phone className="h-4 w-4" />
                                                    <span>Phone</span>
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <Building2 className="h-4 w-4" />
                                                    <span>Business</span>
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>Location</span>
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <Eye className="h-4 w-4" />
                                                    <span>Status</span>
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-900 dark:text-gray-100 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>Date</span>
                                                </div>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {demos?.map((demo) => (
                                            <TableRow
                                                key={demo._id}
                                                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
                                            >
                                                <TableCell className="py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                                                <span className="text-white font-medium text-sm">
                                                                    {demo.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-gray-100">{demo.fullName}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-gray-700 dark:text-gray-300">{demo.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-gray-700 dark:text-gray-300">{demo.phone}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-gray-700 dark:text-gray-300 font-medium">{demo.gymName}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-gray-600 dark:text-gray-400">{demo.location}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <Select
                                                        value={demo.status}
                                                        onValueChange={(value) => handleStatusChange(demo._id, value)}
                                                    >
                                                        <SelectTrigger className="w-36 border-0 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-0 focus:ring-offset-0">
                                                            <SelectValue>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={`${getStatusColor(demo.status)} border font-medium`}
                                                                >
                                                                    <div className="flex items-center space-x-1">
                                                                        {getStatusIcon(demo.status)}
                                                                        <span>{demo.status.replace('_', ' ')}</span>
                                                                    </div>
                                                                </Badge>
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                                            <SelectItem value="Pending" className="cursor-pointer">
                                                                <div className="flex items-center space-x-2">
                                                                    <Clock className="h-4 w-4 text-amber-500" />
                                                                    <span>Pending</span>
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="Approved" className="cursor-pointer">
                                                                <div className="flex items-center space-x-2">
                                                                    <CheckCircle className="h-4 w-4 text-blue-500" />
                                                                    <span>Approved</span>
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="Contacted" className="cursor-pointer">
                                                                <div className="flex items-center space-x-2">
                                                                    <PhoneCall className="h-4 w-4 text-indigo-500" />
                                                                    <span>Contacted</span>
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="Demo_Given" className="cursor-pointer">
                                                                <div className="flex items-center space-x-2">
                                                                    <Play className="h-4 w-4 text-purple-500" />
                                                                    <span>Demo Given</span>
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="Converted" className="cursor-pointer">
                                                                <div className="flex items-center space-x-2">
                                                                    <Trophy className="h-4 w-4 text-emerald-500" />
                                                                    <span>Converted</span>
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="Rejected" className="cursor-pointer">
                                                                <div className="flex items-center space-x-2">
                                                                    <XCircle className="h-4 w-4 text-red-500" />
                                                                    <span>Rejected</span>
                                                                </div>
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                                                            {new Date(demo.createdAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pagination */}
                    <div className="w-full mt-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Rows per page:</span>
                            <Select
                                value={limit.toString()}
                                onValueChange={(value) => setLimit(Number(value))}
                            >
                                <SelectTrigger className="w-32 dark:bg-gray-900 dark:border-none dark:text-white rounded-sm">
                                    <SelectValue placeholder="Select limit" />
                                </SelectTrigger>
                                <SelectContent className='dark:bg-gray-900 dark:border-none'>
                                    <SelectGroup>
                                        <SelectLabel>Select</SelectLabel>
                                        <SelectItem value="5" className='cursor-pointer hover:bg-blue-600/30'>5</SelectItem>
                                        <SelectItem value="10" className='cursor-pointer hover:bg-blue-600/30'>10</SelectItem>
                                        <SelectItem value="50" className='cursor-pointer hover:bg-blue-600/30'>50</SelectItem>
                                        <SelectItem value="all" className='cursor-pointer hover:bg-blue-600/30'>All</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Page {currentPage} of {totalPages || 1}
                            </span>
                            <Pagination
                                page={currentPage}
                                total={totalPages}
                                onChange={setCurrentPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemoManagement;
