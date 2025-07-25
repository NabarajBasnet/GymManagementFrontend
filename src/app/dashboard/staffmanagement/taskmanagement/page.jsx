'use client';

import { TiHome } from "react-icons/ti";
import Pagination from "@/components/ui/CustomPagination.jsx";
import { usePagination } from "@/hooks/Pagination.js";
import { Checkbox } from "@/components/ui/checkbox"
import { IoCloseSharp } from "react-icons/io5";
import { useUser } from "@/components/Providers/LoggedInUserProvider";
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
import { useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import { useForm, Controller } from "react-hook-form";
import { useQuery, QueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TiEdit } from "react-icons/ti";
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React, { useEffect, useState } from 'react';
import {
    Calendar,
    CheckCircle2,
    Clock,
    Filter,
    Flag,
    MoreVertical,
    Plus,
    Search,
    Tags,
    Trash2,
    Users
} from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Loader from '@/components/Loader/Loader';
import Deleteing from "@/components/Deleting/Deleting";
import EditTaskDetails from "./editTaskDetails";

const CATEGORIES = [
    'Maintenance',
    'Inventory',
    'Training',
    'Customer Service',
    'Administration'
];

const StaffTaskManagement = () => {

    // States
    const [taskMode, setTaskMode] = useState(null);
    const [taskAssignedTo, setTaskAssignedTo] = useState(null);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const queryClient = useQueryClient();
    const [deleteing, setDeleting] = useState(false);
    const { user, loading } = useUser();
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(15);
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState();
    const [searchQuery, setSearchQuery] = useState();
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [category, setCategory] = useState('');

    const [selectedTasks, setSelectedTasks] = useState([]);

    // Toggle individual task selection
    const handleTaskSelect = (taskId) => {
        setSelectedTasks(prev => prev.includes(taskId)
            ? prev.filter(id => id !== taskId)
            : [...prev, taskId]
        );
    };

    // Toggle select all/none
    const handleSelectAll = () => {
        if (selectedTasks.length === data.tasks?.length) {
            setSelectedTasks([]);
        } else {
            setSelectedTasks(data.tasks?.map(task => task._id) || []);
        }
    };

    // Form states
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitSuccessful },
        setValue,
        setError,
        clearErrors,
        reset,
        control
    } = useForm();

    // Functions
    const getAllStaffMembers = async () => {
        try {
            const response = await fetch(`https://fitbinary.com/api/staffsmanagement`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const { data: STAFF_MEMBERS, isLoading: isStaffsLoading } = useQuery({
        queryKey: ['staffs'],
        queryFn: getAllStaffMembers
    });
    const staffs = STAFF_MEMBERS?.staffs || [];

    const getAllTasks = async ({ queryKey }) => {
        const [, page, searchQuery, status, priority, category] = queryKey;
        try {
            const response = await fetch(`https://fitbinary.com/api/tasks?page=${page}&limit=${limit}&taskSearchQuery=${searchQuery}&status=${status}&priority=${priority}&category=${category}`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const { data, isLoading } = useQuery({
        queryKey: ['tasks', currentPage, searchQuery || '', status, priority, category, limit],
        queryFn: getAllTasks
    });

    const { totalPages, tasks: satffTasks, totalTasks } = data || {};

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
        return () => { clearTimeout(handler) }
    }, [searchQuery, limit]);

    useEffect(() => {
        getAllTasks();
    }, [limit]);

    const startEntry = (currentPage - 1) * limit + 1;
    const endEntry = Math.min(currentPage * limit, totalTasks);

    const [currentTask, setCurrentTask] = useState(null);

    const [openEditTaskForm, setEditOpenTaskForm] = useState(false);

    const getSingleTask = async (id) => {
        try {
            const response = await fetch(`https://fitbinary.com/api/tasks/${id}`);
            const responseBody = await response.json();
            if (response.ok && response.status === 200) {
                setCurrentTask(responseBody.task)
                toast.success(responseBody.message);
                setTaskAssignedTo(responseBody.task.assignedTo);
                setEditOpenTaskForm(true);

            } else {
                toast.error(responseBody.message);
                toast.error(responseBody.error);
            };
        } catch (error) {
            console.log("Error: ", error);
            toast.error(error.message);
            toast.error(error.error);
        };
    };

    const addNewTask = async (data) => {
        try {
            const { title, description, assignedTo, category, priority, dueDate, dueTime } = data;
            const finalData = { title: title, description: description, assignedTo: assignedTo, status: 'Not Started', category: category, priority: priority, dueDate: dueDate, dueTime: dueTime };
            for (let key in finalData) {
                if (!finalData[key]) {
                    toast.error(`${key.charAt(0).toUpperCase() + key.slice(1)} field is missing, Please fill this field`);
                    return;
                };
            };
            const response = await fetch(`https://fitbinary.com/api/tasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(finalData),
            });

            const responseBody = await response.json();
            if (response.ok) {
                toast.success(responseBody.message);
                setIsAddingTask(false);
                queryClient.invalidateQueries(['tasks']);
            };
        } catch (error) {
            toast.error(error.message);
            console.log("Error: ", error);
            console.log("Error Message: ", error.message);
        };
    };

    const deleteSingleTask = async (id) => {
        setDeleting(true);
        try {
            const response = await fetch(`https://fitbinary.com/api/tasks/delete/${id}`, {
                method: "DELETE",
            });

            const responseBody = await response.json();
            if (response.ok) {
                setDeleting(false);
                toast.success(responseBody.message);
                queryClient.invalidateQueries(['tasks']);
            };
        } catch (error) {
            setDeleting(false);
            console.log("Error: ", error);
        };
    };

    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'in progress': return 'bg-blue-100 text-blue-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatTo12Hour = (timeStr) => {
        const [hour, minute] = timeStr.split(":").map(Number);
        const ampm = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
    };

    const deleteSelectedTask = async () => {
        setDeleting(true);
        try {
            const response = await fetch(`https://fitbinary.com/api/tasks/delete-multiple-tasks`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ taskIds: selectedTasks })
            });

            const responseBody = await response.json();
            if (response.ok) {
                setDeleting(false);
                toast.success(responseBody.message);
                queryClient.invalidateQueries(['tasks']);
                setSelectedTasks([]);
            } else {
                setDeleting(false);
                toast.error(responseBody.message);
                queryClient.invalidateQueries(['tasks']);
            }
        } catch (error) {
            setDeleting(false);
            console.log("Error: ", error);
        };
    };

    return (
        <div className="w-full bg-gray-100 dark:bg-gray-900">
            <div className="w-full p-4 md:pt-8">
                {/* Header Section */}
                <Breadcrumb className="w-full sm:w-auto overflow-x-auto mb-4">
                    <BreadcrumbList className="flex-nowrap">
                        <BreadcrumbItem>
                            <TiHome className="w-4 h-4" /><BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink>Staff Management</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink>Tasks</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex flex-col bg-white dark:bg-gray-800 dark:border-none p-4 border rounded-md sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <Button
                        onClick={() => setIsAddingTask(true)}
                        className="w-full rounded-sm sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        Add New Task
                    </Button>
                </div>

                {deleteing ? (
                    <Deleteing />
                ) : (
                    <></>
                )}

                {openEditTaskForm && (
                    <EditTaskDetails task={currentTask} id={currentTask ? currentTask._id : 'null'} />
                )}

                {/* Filters and Search */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm mb-6">
                    <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:space-x-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <Input
                                    type="text"
                                    placeholder="Search tasks..."
                                    className="w-full dark:text-white dark:border-none bg-white dark:bg-gray-900 pl-10 pr-4 py-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setCurrentPage(1);
                                        setSearchQuery(e.target.value);
                                    }
                                    }
                                />
                            </div>
                        </div>
                        <div className={`grid grid-cols-1 sm:grid-cols-3 ${selectedTasks.length === 0 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-4`}>
                            {selectedTasks.length === 0 ? (
                                <></>
                            ) : (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild className="dark:bg-gray-800 dark:border-none">
                                        <Button
                                            variant="destructive"
                                            disabled={selectedTasks.length === 0}
                                            className='dark:bg-red-600 dark:text-white dark:border-none'
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete Selected ({selectedTasks.length})
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="dark:bg-gray-800 dark:border-none">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className='dark:text-white'>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription className='dark:text-gray-200'>
                                                This action cannot be undone. This will permanently delete the assigned task
                                                and remove data from servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className='dark:text-white dark:border-none dark:hover:bg-gray-900'>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                className='bg-red-600 hover:bg-red-700 dark:text-white'
                                                onClick={() => deleteSelectedTask()}
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                            )}
                            <select
                                className="w-full border dark:bg-gray-900 dark:border-none dark:text-white rounded-sm px-3 py-2 bg-white"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                            <select
                                className="w-full border dark:bg-gray-900 dark:border-none dark:text-white rounded-sm px-3 py-2 bg-white"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option value="">All Priority</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                            <select
                                className="w-full border dark:bg-gray-900 dark:border-none dark:text-white rounded-sm px-3 py-2 bg-white"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {CATEGORIES.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Task List */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        {isLoading ? (
                            <Loader />
                        ) : (
                            <Table className='bg-white dark:bg-gray-800 border dark:border-none'>
                                <TableHeader className="bg-white dark:bg-gray-800">
                                    <TableRow>
                                        <TableHead>
                                            <Checkbox
                                                checked={data.tasks?.length > 0 && selectedTasks.length === data.tasks.length}
                                                onCheckedChange={handleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead>Task</TableHead>
                                        <TableHead>Assigned To</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Priority</TableHead>
                                        <TableHead>Due Date & Time</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead className='text-center'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Array.isArray(data.tasks) && data.tasks.length > 0 ? (
                                        data.tasks.map((task) => (
                                            <TableRow
                                                key={task._id}
                                                className={selectedTasks.includes(task._id) ? 'bg-blue-50 hover:bg-blue-100 dark:hover:bg-gray-900 dark:bg-gray-800' : 'dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 dark:border-none'}
                                            >
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedTasks.includes(task._id)}
                                                        onCheckedChange={() => handleTaskSelect(task._id)}
                                                    />
                                                </TableCell>

                                                <TableCell>
                                                    <div className="flex flex-col space-y-2">
                                                        <span className="font-semibold dark:text-gray-200 text-gray-900">{task.title}</span>
                                                        <span className="text-sm text-gray-500 dark:text-gray-200 line-clamp-2">{task.description}</span>
                                                        {task.comments.length > 0 && (
                                                            <div className="mt-2 text-sm text-gray-600 bg-gray-100 p-3 rounded-md">
                                                                <p className="font-medium text-gray-900">{task.comments[0].user}</p>
                                                                <p className="mt-1">{task.comments[0].text}</p>
                                                                <span className="text-xs text-gray-500 mt-2 block">{task.comments[0].time}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-sm dark:text-gray-200 font-medium text-gray-900 hover:cursor-pointer">
                                                            {(() => {
                                                                const assignedStaff = staffs.find((staff) => staff._id === task.assignedTo);
                                                                return assignedStaff ? assignedStaff.fullName : "Unknown Staff";
                                                            })()}
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                                        {task.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                                        {task.priority}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col dark:text-gray-200 text-gray-500 text-sm">
                                                        <div className="flex items-center">
                                                            <Calendar size={16} className="mr-2 dark:text-gray-200 text-gray-400" />
                                                            {new Date(task.dueDate).toISOString().split('T')[0]}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Clock size={16} className="mr-2 text-gray-400" />
                                                            {formatTo12Hour(task.dueTime)}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                                                        {task.category}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-end">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="transition-opacity dark:hover:bg-transparent hover:bg-gray-100"
                                                            onClick={() => getSingleTask(task._id)}
                                                        >
                                                            <TiEdit className="h-4 dark:text-gray-200 w-4 text-gray-600 hover:text-gray-800" />
                                                        </Button>

                                                        {user && user.user.role === 'Gym Admin' ? (
                                                            <></>
                                                        ) : (
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="transition-opacity dark:hover:bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent className='dark:border-none dark:bg-gray-800'>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle className='dark:text-white'>Are you absolutely sure?</AlertDialogTitle>
                                                                        <AlertDialogDescription className='dark:text-gray-200'>
                                                                            This action cannot be undone. This will permanently delete the assigned task
                                                                            and remove data from servers.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel className='dark:bg-gray-900 dark:text-white dark:border-none'>Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            className='bg-red-600 text-white hover:bg-red-700'
                                                                            onClick={() => deleteSingleTask(task._id)}
                                                                        >
                                                                            Delete
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        )}

                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan="8" className="text-center py-8">
                                                <div className="flex flex-col items-center justify-center space-y-2">
                                                    <p className="text-lg font-semibold text-gray-600 dark:text-gray-200">No tasks found</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-200">Create a new task to get started</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}

                        <div className='border-t border-gray-300 dark:border-gray-500'>
                            <div className="my-2 px-4 md:flex justify-between items-center">
                                <p className="dark:text-gray-200 font-medium text-center text-sm font-gray-700">
                                    Showing <span className="font-semibold text-sm font-gray-700 dark:text-gray-200">{startEntry}</span> to <span className="font-semibold text-sm font-gray-700">{endEntry}</span> of <span className="font-semibold">{totalTasks}</span> entries
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
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Task Modal */}
            {
                isAddingTask && (
                    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
                        <form onSubmit={handleSubmit(addNewTask)} className="bg-white dark:bg-gray-800 rounded-sm p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold dark:text-white">Add New Task</h2>
                                <IoCloseSharp className="cursor-pointer w-5 h-5 dark:text-white" onClick={() => setIsAddingTask(false)} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-1 md:col-span-2">
                                    <Label htmlFor="title" className="dark:text-gray-100 text-sm font-medium text-gray-700">Title</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        name="title"
                                        {...register('title')}
                                        className="mt-1 bg-white dark:bg-gray-900 dark:border-none py-6 rounded-sm dark:text-white"
                                        placeholder="Enter task title"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <Label htmlFor="description" className="dark:text-gray-100 text-sm font-medium text-gray-700">Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        {...register('description')}
                                        className="dark:bg-gray-900 dark:border-none dark:text-white focus-visible:ring-0 focus:ring-none mt-1 focus:outline-none rounded-sm"

                                        placeholder="Enter task description"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="assignedTo" className="dark:text-gray-100 text-sm font-medium text-gray-700">Assigned To</Label>
                                    {taskMode === 'Edit' ? (
                                        <select
                                            id="assignedTo"
                                            name="assignedTo"
                                            {...register("assignedTo", { required: "Please select a staff member" })}
                                            className="mt-1 bg-white block w-full py-4 dark:bg-gray-900 dark:text-white dark:border-none rounded-sm border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option value="">Select Staff</option>
                                            {STAFF_MEMBERS?.staffs?.length > 0 ? (
                                                STAFF_MEMBERS.staffs.map((staff) => (
                                                    <option key={staff._id} value={staff._id} selected={staff._id === currentTask.assignedTo}>
                                                        {staff.fullName}
                                                    </option>
                                                ))
                                            ) : (
                                                <option>Not registered</option>
                                            )}
                                        </select>
                                    ) : (
                                        <select
                                            id="assignedTo"
                                            name="assignedTo"
                                            {...register("assignedTo", { required: "Please select a staff member" })}
                                            className="mt-1 bg-white py-4 dark:bg-gray-900 dark:text-white dark:border-none block w-full rounded-sm border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option value="">Select Staff</option>
                                            {STAFF_MEMBERS ? STAFF_MEMBERS.staffs.map(staff => (
                                                <option key={staff._id} value={staff._id}>{staff.fullName}</option>
                                            )) :
                                                <option>Not registered</option>
                                            }
                                        </select>
                                    )}

                                </div>
                                <div>
                                    <Label htmlFor="category" className="dark:text-gray-100 text-sm font-medium text-gray-700">Category</Label>
                                    <select
                                        id="category"
                                        name="category"
                                        {...register("category", { required: "Please select a staff member" })}
                                        className="mt-1 bg-white block py-4 dark:bg-gray-900 dark:text-white dark:border-none w-full rounded-sm border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="">Select Category</option>
                                        {CATEGORIES.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="priority" className="dark:text-gray-100 text-sm font-medium text-gray-700">Priority</Label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        {...register("priority", { required: "Please select a staff member" })}
                                        className="mt-1 bg-white block w-full py-4 dark:bg-gray-900 dark:text-white dark:border-none rounded-sm border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="dueDate" className="dark:text-gray-100 text-sm font-medium text-gray-700">Due Date</Label>
                                    <div className="flex items-center space-x-4">
                                        <Input
                                            id="dueDate"
                                            type="date"
                                            name="dueDate"
                                            {...register('dueDate')}
                                            className="mt-1 bg-white py-6 dark:bg-gray-900 dark:text-white dark:border-none rounded-sm"
                                        />
                                        <Input
                                            id="dueDate"
                                            type="time"
                                            name="dueTime"
                                            {...register('dueTime')}
                                            className="mt-1 bg-white py-6 dark:bg-gray-900 dark:text-white dark:border-none rounded-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsAddingTask(false)}
                                    className="w-full rounded-sm dark:bg-gray-900 dark:text-white dark:border-none sm:w-auto"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type='submit'
                                    className="w-full sm:w-auto rounded-sm bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </Button>
                            </div>
                        </form>
                    </div>
                )
            }
        </div >
    );
};

export default StaffTaskManagement;
