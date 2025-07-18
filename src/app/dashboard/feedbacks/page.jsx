'use client';

import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider
} from "@/components/ui/tooltip";
import { MdSafetyCheck } from "react-icons/md";
import { MdStarBorderPurple500 } from "react-icons/md";
import { FaAddressCard } from "react-icons/fa";
import { GiBiceps } from "react-icons/gi";
import { FaDumbbell } from "react-icons/fa";
import { RiCustomerService2Line } from "react-icons/ri";
import { HiMiniUsers } from "react-icons/hi2";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FiChevronRight, FiTrash2, FiEdit, FiPlus, FiX, FiSave, FiInfo, FiEye, FiLoader, FiFilter, FiRefreshCcw } from "react-icons/fi";
import { MdHome } from "react-icons/md";
import toast from "react-hot-toast";
import { format } from 'date-fns';

// UI Components
import { Switch } from "@/components/ui/switch";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
    CardDescription
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Pagination from "@/components/ui/CustomPagination.jsx";
import Loader from "@/components/Loader/Loader";
import { FeedbackChart } from "./feedbackChart";

const AdminFeedBackManagement = () => {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [isRespondModalOpen, setIsRespondModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // Fetch feedbacks
    const getAllFeedbacks = async () => {
        try {
            const response = await fetch(`https://fitbinary.com/api/feedbacks?page=${currentPage}&limit=${limit}&search=${searchQuery}&status=${selectedStatus}&category=${selectedCategory}`);
            const responseBody = await response.json();

            if (!response.ok) toast.error(responseBody.message);

            return responseBody;
        } catch (error) {
            console.log('Error: ', error);
            toast.error(error.message);
        }
    }

    const { data, isLoading } = useQuery({
        queryKey: ['feedbacks', currentPage, searchQuery, selectedStatus, selectedCategory, limit],
        queryFn: getAllFeedbacks
    })

    const { feedbacks, totalPages, totalFeedbacks } = data || {};

    // Handle feedback status update
    const handleStatusUpdate = async (feedbackId, newStatus) => {
        try {
            const response = await fetch(`https://fitbinary.com/api/feedbacks/${feedbackId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) throw new Error('Failed to update status');

            toast.success('Status updated successfully');
            queryClient.invalidateQueries(['feedbacks']);
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Handle feedback deletion
    const handleDelete = async (feedbackId) => {
        try {
            const response = await fetch(`https://fitbinary.com/api/feedbacks/${feedbackId}`, {
                method: 'DELETE'
            });

            const responseBody = await response.json();
            if (!response.ok) throw new Error(responseBody.message);

            toast.success(responseBody.message);
            queryClient.invalidateQueries(['feedbacks']);
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Handle feedback response
    const handleRespond = async (feedbackId, response) => {
        try {
            const response = await fetch(`https://fitbinary.com/api/feedbacks/${feedbackId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    actionTaken: response,
                    status: 'Resolved',
                    resolvedAt: new Date()
                })
            });

            const responseBody = await response.json();
            if (!response.ok) throw new Error(responseBody.message);

            toast.success(responseBody.message);
            setIsRespondModalOpen(false);
            queryClient.invalidateQueries(['feedbacks']);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Resolved': return 'bg-green-100 text-green-800';
            case 'Closed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Equipment': return <FaDumbbell className="w-4 h-4" />;
            case 'Facility': return <RiCustomerService2Line className="w-4 h-4" />;
            case 'Staff': return <HiMiniUsers className="w-4 h-4" />;
            case 'Classes': return <GiBiceps className="w-4 h-4" />;
            case 'Membership': return <FaAddressCard className="w-4 h-4" />;
            case 'Cleanliness': return <MdStarBorderPurple500 className="w-4 h-4" />;
            case 'Safety': return <MdSafetyCheck className="w-4 h-4" />;
            default: return <FaAddressCard className="w-4 h-4" />;
        }
    };

    return (
        <div className='w-full bg-gray-100 dark:bg-gray-900 flex justify-center min-h-screen px-4 py-6'>
            <div className="w-full">
                {/* Breadcrumb */}
                <div className='w-full mb-4'>
                    <Breadcrumb className="mb-4">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <MdHome className='w-4 h-4' />
                                <BreadcrumbLink href="/" className="ml-2 font-semibold">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <FiChevronRight className="h-4 w-4" />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbLink className="font-semibold">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <FiChevronRight className="h-4 w-4" />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbLink className="font-semibold">Feedback Management</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    {/* Header with dark mode */}
                    <div className="flex flex-col md:flex-row justify-between items-start bg-white dark:bg-gray-800 p-4 py-4 border border-gray-200 dark:border-gray-700 shadow-sm rounded-md md:items-center gap-4">
                        <div>
                            <h1 className="text-xl font-bold mb-2 dark:text-gray-100">Feedback Management</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                Manage and respond to member feedbacks
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => window.location.reload()}
                                className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                            >
                                <FiRefreshCcw className="mr-2" />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Filters Card with dark mode */}
                <Card className="mb-6 dark:bg-gray-800 dark:border-none">
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <Label className="dark:text-gray-300">Search</Label>
                                <Input
                                    placeholder="Search feedbacks..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="dark:bg-gray-900 bg-white dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
                                />
                            </div>
                            <div>
                                <Label className="dark:text-gray-300">Status</Label>
                                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                    <SelectTrigger className="rounded-md dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                                        <SelectItem value="all" className="dark:text-gray-300 dark:hover:bg-gray-700">All Status</SelectItem>
                                        <SelectItem value="Pending" className="dark:text-gray-300 dark:hover:bg-gray-700">Pending</SelectItem>
                                        <SelectItem value="In Progress" className="dark:text-gray-300 dark:hover:bg-gray-700">In Progress</SelectItem>
                                        <SelectItem value="Resolved" className="dark:text-gray-300 dark:hover:bg-gray-700">Resolved</SelectItem>
                                        <SelectItem value="Closed" className="dark:text-gray-300 dark:hover:bg-gray-700">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="dark:text-gray-300">Category</Label>
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="rounded-md dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                                        <SelectItem value="all" className="dark:text-gray-300 dark:hover:bg-gray-700">All Categories</SelectItem>
                                        <SelectItem value="Equipment" className="dark:text-gray-300 dark:hover:bg-gray-700">Equipment</SelectItem>
                                        <SelectItem value="Facility" className="dark:text-gray-300 dark:hover:bg-gray-700">Facility</SelectItem>
                                        <SelectItem value="Staff" className="dark:text-gray-300 dark:hover:bg-gray-700">Staff</SelectItem>
                                        <SelectItem value="Classes" className="dark:text-gray-300 dark:hover:bg-gray-700">Classes</SelectItem>
                                        <SelectItem value="Membership" className="dark:text-gray-300 dark:hover:bg-gray-700">Membership</SelectItem>
                                        <SelectItem value="Cleanliness" className="dark:text-gray-300 dark:hover:bg-gray-700">Cleanliness</SelectItem>
                                        <SelectItem value="Safety" className="dark:text-gray-300 dark:hover:bg-gray-700">Safety</SelectItem>
                                        <SelectItem value="Other" className="dark:text-gray-300 dark:hover:bg-gray-700">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-end">
                                <Button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSelectedStatus("");
                                        setSelectedCategory("");
                                        setLimit(10);
                                        setCurrentPage(1);
                                    }}
                                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                                >
                                    Reset Filters
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Feedbacks Section */}
                <Tabs defaultValue="Graph" className="w-full">
                    <TabsList className="grid w-full bg-white dark:bg-gray-800 dark:text-white grid-cols-2">
                        <TabsTrigger
                            value="Graph"
                            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white"
                        >
                            Graph
                        </TabsTrigger>
                        <TabsTrigger
                            value="Table"
                            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white"
                        >
                            Table
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="Graph">
                        <FeedbackChart />
                    </TabsContent>

                    <TabsContent value="Table">
                        {isLoading ? <Loader /> : (
                            <Card className="dark:bg-gray-800 dark:border-none">
                                <CardContent className="p-0">
                                    <div className="p-4">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Display</p>
                                            <Select
                                                value={limit}
                                                onValueChange={(value) => setLimit(Number(value))}
                                            >
                                                <SelectTrigger className="rounded-md w-20 border dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
                                                    <SelectValue>
                                                        {limit === totalFeedbacks ? 'All' : limit}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                                                    <SelectItem value="15" className="dark:text-gray-300 dark:hover:bg-gray-700">15</SelectItem>
                                                    <SelectItem value="25" className="dark:text-gray-300 dark:hover:bg-gray-700">25</SelectItem>
                                                    <SelectItem value="50" className="dark:text-gray-300 dark:hover:bg-gray-700">50</SelectItem>
                                                    <SelectItem value={totalFeedbacks} className="dark:text-gray-300 dark:hover:bg-gray-700">All</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <p className="dark:text-gray-400">feedbacks.</p>
                                        </div>
                                    </div>
                                    <div className="w-full overflow-x-auto">
                                        {Array.isArray(feedbacks) && feedbacks.length > 0 ? (
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="dark:border-gray-700">
                                                        <TableHead className="dark:text-gray-300">Category</TableHead>
                                                        <TableHead className="dark:text-gray-300">Subject</TableHead>
                                                        <TableHead className="dark:text-gray-300">Member</TableHead>
                                                        <TableHead className="dark:text-gray-300">Rating</TableHead>
                                                        <TableHead className="dark:text-gray-300">Status</TableHead>
                                                        <TableHead className="dark:text-gray-300">Date</TableHead>
                                                        <TableHead className="dark:text-gray-300 text-center">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {feedbacks.map((feedback) => (
                                                        <TableRow key={feedback._id} className="dark:border-gray-700">
                                                            <TableCell className="dark:text-gray-300">
                                                                <div className="flex items-center gap-2">
                                                                    <span>{getCategoryIcon(feedback.category)}</span>
                                                                    <span className="truncate">{feedback.category}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="dark:text-gray-300">
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <span className="truncate block whitespace-nowrap cursor-default">
                                                                                {feedback.subject}
                                                                            </span>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent side="top">
                                                                            {feedback.subject}
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            </TableCell>
                                                            <TableCell className="dark:text-gray-300">
                                                                {feedback.isAnonymous ? (
                                                                    <Badge variant="secondary">Anonymous</Badge>
                                                                ) : (
                                                                    <span className="truncate block">{feedback.memberId?.fullName || 'N/A'}</span>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="dark:text-gray-300">
                                                                <div className="flex items-center">
                                                                    {Array.from({ length: feedback.rating }).map((_, i) => (
                                                                        <span key={i} className="text-yellow-400">★</span>
                                                                    ))}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="dark:text-gray-300">
                                                                <Badge className={getStatusColor(feedback.status)}>
                                                                    {feedback.status}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="dark:text-gray-300">
                                                                {format(new Date(feedback.createdAt), 'MMM d, yyyy')}
                                                            </TableCell>
                                                            <TableCell className="dark:text-gray-300">
                                                                <div className="flex items-center">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                                                                        onClick={() => {
                                                                            setSelectedFeedback(feedback);
                                                                            setIsViewModalOpen(true);
                                                                        }}
                                                                    >
                                                                        <FiEye className="h-4 w-4" />
                                                                    </Button>
                                                                    <Select
                                                                        value={feedback.status}
                                                                        onValueChange={(value) => handleStatusUpdate(feedback._id, value)}
                                                                    >
                                                                        <SelectTrigger className="w-28 rounded-sm dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
                                                                            <SelectValue placeholder="Update Status" />
                                                                        </SelectTrigger>
                                                                        <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                                                                            <SelectItem value="Pending" className="dark:text-gray-300 dark:hover:bg-gray-700">Pending</SelectItem>
                                                                            <SelectItem value="In Progress" className="dark:text-gray-300 dark:hover:bg-gray-700">In Progress</SelectItem>
                                                                            <SelectItem value="Resolved" className="dark:text-gray-300 dark:hover:bg-gray-700">Resolved</SelectItem>
                                                                            <SelectItem value="Closed" className="dark:text-gray-300 dark:hover:bg-gray-700">Closed</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <AlertDialog>
                                                                        <AlertDialogTrigger asChild>
                                                                            <Button variant="ghost" size="icon" className="dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
                                                                                <FiTrash2 className="h-4 w-4 text-red-500" />
                                                                            </Button>
                                                                        </AlertDialogTrigger>
                                                                        <AlertDialogContent>
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle>Delete Feedback</AlertDialogTitle>
                                                                                <AlertDialogDescription>
                                                                                    Are you sure you want to delete this feedback? This action cannot be undone.
                                                                                </AlertDialogDescription>
                                                                            </AlertDialogHeader>
                                                                            <AlertDialogFooter>
                                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                <AlertDialogAction
                                                                                    onClick={() => handleDelete(feedback._id)}
                                                                                    className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 dark:text-white"
                                                                                >
                                                                                    Delete
                                                                                </AlertDialogAction>
                                                                            </AlertDialogFooter>
                                                                        </AlertDialogContent>
                                                                    </AlertDialog>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        ) : (
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="min-w-[150px]">Category</TableHead>
                                                        <TableHead className="min-w-[200px]">Subject</TableHead>
                                                        <TableHead className="min-w-[150px]">Member</TableHead>
                                                        <TableHead className="min-w-[120px]">Rating</TableHead>
                                                        <TableHead className="min-w-[120px]">Status</TableHead>
                                                        <TableHead className="min-w-[120px]">Date</TableHead>
                                                        <TableHead className="min-w-[200px]">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell colSpan={7} className="text-center py-8">
                                                            <p className="text-center text-sm font-medium">No feedbacks found</p>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Pagination with dark mode */}
                        <div className="lg:flex justify-center my-4 items-center space-y-3 lg:space-y-0 lg:justify-between">
                            <p className="text-sm text-center lg:text-left font-medium text-gray-500 dark:text-gray-400">
                                Showing {feedbacks?.length || 0} out of {totalFeedbacks?.totalFeedbacks} feedbacks
                            </p>
                            <Pagination
                                total={totalPages}
                                page={currentPage || 1}
                                onChange={setCurrentPage}
                                withEdges={true}
                                siblings={1}
                                boundaries={1}
                            />
                        </div>
                    </TabsContent>
                </Tabs>


                {/* View Feedback Modal with dark mode */}
                <AlertDialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                    <AlertDialogContent className="max-w-5xl w-full dark:bg-gray-800 dark:border-gray-700">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="dark:text-gray-100">Feedback Details</AlertDialogTitle>
                        </AlertDialogHeader>
                        {selectedFeedback && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="dark:text-gray-300">Category</Label>
                                        <p className="text-sm dark:text-gray-400">{selectedFeedback.category}</p>
                                    </div>
                                    <div>
                                        <Label className="dark:text-gray-300">Status</Label>
                                        <Badge className={getStatusColor(selectedFeedback.status)}>
                                            {selectedFeedback.status}
                                        </Badge>
                                    </div>
                                    <div>
                                        <Label className="dark:text-gray-300">Subject</Label>
                                        <p className="text-sm dark:text-gray-400">{selectedFeedback.subject}</p>
                                    </div>
                                    <div>
                                        <Label className="dark:text-gray-300">Member</Label>
                                        <p className="text-sm dark:text-gray-400">
                                            {selectedFeedback.isAnonymous ? 'Anonymous' : selectedFeedback.memberId?.name}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <Label className="dark:text-gray-300">Message</Label>
                                    <p className="text-sm dark:text-gray-400 mt-1">{selectedFeedback.message}</p>
                                </div>
                                <div>
                                    <Label className="dark:text-gray-300">Detailed Ratings</Label>
                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                        {Object.entries(selectedFeedback.detailedRatings).map(([key, value]) => (
                                            <div key={key} className="flex items-center justify-between">
                                                <span className="text-sm capitalize dark:text-gray-400">{key}</span>
                                                <div className="flex">
                                                    {Array.from({ length: value }).map((_, i) => (
                                                        <span key={i} className="text-yellow-400">★</span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {selectedFeedback.staffDetails?.staffName && (
                                    <div>
                                        <Label className="dark:text-gray-300">Staff Details</Label>
                                        <p className="text-sm dark:text-gray-400 mt-1">
                                            {selectedFeedback.staffDetails.staffName} - {selectedFeedback.staffDetails.interactionType}
                                        </p>
                                    </div>
                                )}
                                {/* <div>
                                    <Label>Response</Label>
                                    <Textarea
                                        placeholder="Enter your response..."
                                        value={selectedFeedback.actionTaken || ''}
                                        onChange={(e) => setSelectedFeedback({
                                            ...selectedFeedback,
                                            actionTaken: e.target.value
                                        })}
                                        className="mt-1"
                                    />
                                </div> */}
                            </div>
                        )}
                        <AlertDialogFooter>
                            <AlertDialogCancel className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">Close</AlertDialogCancel>
                            <AlertDialogAction
                                disabled
                                className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
                            >
                                Save Response
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default AdminFeedBackManagement;
