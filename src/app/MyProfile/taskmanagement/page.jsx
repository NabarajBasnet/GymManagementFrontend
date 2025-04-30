'use client';

import { BsFilter } from "react-icons/bs";
import { HiOutlineSearch } from "react-icons/hi";
import { FaCircleCheck } from "react-icons/fa6";
import { FaLongArrowAltRight, FaCalendarAlt, FaClipboard, FaUserCircle } from "react-icons/fa";
import { PiBuildingOfficeFill } from "react-icons/pi";
import { FaRegClock } from "react-icons/fa";
import { LuMessageSquareText } from "react-icons/lu";
import { GoAlertFill } from "react-icons/go";
import { FiMoreHorizontal } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import Pagination from "@/components/ui/CustomPagination";
import Loader from "@/components/Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useStaff } from "@/components/Providers/LoggedInStaffProvider";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format, parseISO } from 'date-fns';
import toast from "react-hot-toast";

const CATEGORIES = [
    'Maintenance',
    'Inventory',
    'Training',
    'Customer Service',
    'Administration'
];

const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];
const STATUS_OPTIONS = ['Not Started', 'In Progress', 'Completed'];

const formatTo12Hour = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
};

const TaskManagement = () => {
    const { staff } = useStaff();
    const staffId = staff?.loggedInStaff?._id || '';

    const [currentPage, setCurrentPage] = useState(1);
    const [totalTasks, setTotalTasks] = useState(0);
    const limit = 10;

    // Filter states
    const [status, setStatus] = useState(undefined);
    const [priority, setPriority] = useState(undefined);
    const [category, setCategory] = useState(undefined);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchTasks = async () => {
        try {
            if (!staffId) return [];

            const url = new URL(`gymmanagementbackend-o2l3.onrender.com/api/tasks/get-my-tasks/${staffId}`);
            url.searchParams.append('page', currentPage.toString());
            url.searchParams.append('limit', limit.toString());

            if (status) url.searchParams.append('status', status);
            if (priority) url.searchParams.append('priority', priority);
            if (category) url.searchParams.append('category', category);
            if (searchQuery) url.searchParams.append('taskSearchQuery', searchQuery);

            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            const data = await response.json();
            setTotalTasks(data.myTotalTasks || 0);
            return data.myTasks || [];
        } catch (error) {
            console.error("Error fetching tasks:", error);
            toast.error(error.message);
            return [];
        }
    };

    const { data: tasks = [], isLoading, isError, refetch } = useQuery({
        queryKey: ['tasks', staffId, currentPage, status, priority, category, searchQuery],
        queryFn: fetchTasks,
        enabled: !!staffId,
        keepPreviousData: true,
        initialData: [],
    });

    useEffect(() => {
        refetch();
    }, [currentPage, status, priority, category, searchQuery, refetch]);

    const startTask = async (id) => {
        try {
            const response = await fetch(`gymmanagementbackend-o2l3.onrender.com/api/tasks/changestatus/${id}?status=${'In Progress'}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'In Progress' })
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(data.message);
                refetch();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const completeTask = async (id) => {
        try {
            const response = await fetch(`gymmanagementbackend-o2l3.onrender.com/api/tasks/changestatus/${id}?status=${'Completed'}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'Completed' })
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(data.message);
                refetch();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            toast.error('Internal server error');
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-500';
            case 'Medium': return 'bg-yellow-500';
            case 'Low': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Completed': return <Badge variant="success">Completed</Badge>;
            case 'In Progress': return <Badge variant="secondary">In Progress</Badge>;
            case 'Not Started': return <Badge variant="outline">Not Started</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (isError) {
        return (
            <div className="w-full flex items-center justify-center h-64">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-red-500">Failed to load tasks. Please try again.</p>
                        <Button onClick={refetch} className="mt-4">Retry</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container w-full mx-auto px-4 py-8">
            <Card className='w-full'>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl font-bold">Task Management</CardTitle>
                            <CardDescription>View and manage your assigned tasks</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative w-full md:w-64">
                                <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search tasks..."
                                    className="pl-10 pr-4 py-2"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-2">
                                        <BsFilter className="h-4 w-4" />
                                        <span className="hidden md:inline">Filters</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 p-2">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Status</label>
                                            <Select
                                                value={status}
                                                onValueChange={setStatus}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="All Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Status</SelectLabel>
                                                        {STATUS_OPTIONS.map((opt) => (
                                                            <SelectItem key={opt} value={opt}>
                                                                {opt}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Priority</label>
                                            <Select
                                                value={priority}
                                                onValueChange={setPriority}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="All Priority" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Priority</SelectLabel>
                                                        {PRIORITY_OPTIONS.map((opt) => (
                                                            <SelectItem key={opt} value={opt}>
                                                                {opt}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Category</label>
                                            <Select
                                                value={category}
                                                onValueChange={setCategory}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="All Categories" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Category</SelectLabel>
                                                        {CATEGORIES.map((cat) => (
                                                            <SelectItem key={cat} value={cat}>
                                                                {cat}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Tasks</p>
                                        <p className="text-2xl font-bold">{totalTasks}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-blue-100">
                                        <FaClipboard className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">In Progress</p>
                                        <p className="text-2xl font-bold">
                                            {tasks.filter(t => t.status === 'In Progress').length}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-yellow-100">
                                        <FaRegClock className="h-6 w-6 text-yellow-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Completed</p>
                                        <p className="text-2xl font-bold">
                                            {tasks.filter(t => t.status === 'Completed').length}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-green-100">
                                        <FaCircleCheck className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">High Priority</p>
                                        <p className="text-2xl font-bold">
                                            {tasks.filter(t => t.priority === 'High').length}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-red-100">
                                        <GoAlertFill className="h-6 w-6 text-red-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Task List */}
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader />
                        </div>
                    ) : tasks.length > 0 ? (
                        <div className="space-y-4">
                            {tasks.map((task) => (
                                <Card key={task._id} className="relative overflow-hidden hover:shadow-md transition-shadow">
                                    <div className={`absolute left-0 top-0 h-full w-1 ${getPriorityColor(task.priority)}`} />
                                    <div className="p-4">
                                        <div className="flex items-start gap-4">
                                            <Checkbox className="mt-1" />
                                            <div className="flex-1 space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-lg font-semibold">{task.title}</h3>
                                                    <Badge variant="outline">{task.category}</Badge>
                                                    {getStatusBadge(task.status)}
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {task.description || "No description provided"}
                                                </p>
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                                                    <div className="flex items-center gap-4 text-sm">
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <FaCalendarAlt className="h-4 w-4" />
                                                            <span>
                                                                {format(parseISO(task.dueDate), 'MMM dd, yyyy')} • {formatTo12Hour(task.dueTime)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {task.status !== 'Completed' && (
                                                            <>
                                                                {task.status === 'Not Started' && (
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => startTask(task._id)}
                                                                        className="gap-2"
                                                                    >
                                                                        <FaLongArrowAltRight />
                                                                        Start Task
                                                                    </Button>
                                                                )}
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button variant="outline" size="sm" className="gap-2">
                                                                            <FaCircleCheck className="text-green-600" />
                                                                            Complete
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Mark task as completed?</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                This will move the task to completed status. Are you sure?
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() => completeTask(task._id)}
                                                                                className="bg-green-600 hover:bg-green-700"
                                                                            >
                                                                                Confirm
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </>
                                                        )}
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                    <FiMoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem className="gap-2">
                                                                    <LuMessageSquareText className="h-4 w-4" />
                                                                    Add Comment
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
                            <PiBuildingOfficeFill className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium">No tasks found</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {searchQuery || status || priority || category
                                    ? "Try adjusting your filters"
                                    : "You don't have any tasks assigned yet"}
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalTasks > limit && (
                        <div className="mt-6">
                            <Pagination
                                total={Math.ceil(totalTasks / limit)}
                                page={currentPage}
                                onChange={setCurrentPage}
                                withEdges={true}
                                siblings={1}
                                boundaries={1}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default TaskManagement;