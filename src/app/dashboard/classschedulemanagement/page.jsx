'use client';

import { MdHome } from 'react-icons/md';
import { FiInfo } from 'react-icons/fi';
import { BsSpeedometer2, BsCalendar2Week } from 'react-icons/bs';
import { TiEye } from "react-icons/ti";
import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FiChevronRight, FiTrash2, FiEdit, FiPlus, FiEye, FiLoader, FiRefreshCcw, FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";
import { format } from 'date-fns';

// UI Components
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
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useForm, Controller } from "react-hook-form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Pagination from "@/components/ui/CustomPagination.jsx";
import Loader from "@/components/Loader/Loader";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const ScheduleManagement = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(6);
    const [activeTab, setActiveTab] = useState("view");
    const [isEditing, setIsEditing] = useState(false);
    const [editingScheduleId, setEditingScheduleId] = useState(null);
    const queryClient = useQueryClient();

    const [selectedRoom, setSelectedRoom] = useState('');
    const [trainer, setTrainerId] = useState('');

    // React hook form 
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        control,
        reset,
        setValue
    } = useForm();

    const onSubmit = async (data) => {
        const { className, capacity, startTime, endTime } = data;

        // Validate required fields
        if (!trainer || !selectedRoom) {
            toast.error('Please select a trainer and room');
            return;
        }

        const finalObj = {
            className,
            trainer,
            room: selectedRoom,
            startTime: new Date(startTime).toISOString(),
            endTime: new Date(endTime).toISOString(),
            capacity: parseInt(capacity),
        };

        try {
            const url = isEditing
                ? `http://88.198.112.156:3100/api/schedules/${editingScheduleId}`
                : 'http://88.198.112.156:3100/api/schedules';

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalObj),
            });

            const responseBody = await response.json();

            if (response.ok) {
                toast.success(responseBody.message);
                reset();
                setTrainerName('');
                setTrainerId('');
                setRenderTrainerDropdown(false);
                setTrainerSearchQuery('');
                setSelectedRoom('');
                setIsEditing(false);
                setEditingScheduleId(null);
                setActiveTab("view");
                // Refresh the schedules list
                queryClient.invalidateQueries(['schedules']);
            } else {
                toast.error(responseBody.message);
            }
        } catch (error) {
            console.log("Error: ", error);
            toast.error(isEditing ? "Failed to update schedule" : "Failed to create schedule");
        }
    };

    const handleEdit = (schedule) => {
        setIsEditing(true);
        setEditingScheduleId(schedule._id);
        setActiveTab("create");

        // Set form values
        setValue('className', schedule.className);
        setValue('capacity', schedule.capacity);
        setValue('startTime', format(new Date(schedule.startTime), "yyyy-MM-dd'T'HH:mm"));
        setValue('endTime', format(new Date(schedule.endTime), "yyyy-MM-dd'T'HH:mm"));

        // Set trainer and room
        setTrainerId(schedule.trainer._id);
        setTrainerName(schedule.trainer.fullName);
        setTrainerSearchQuery(schedule.trainer.fullName);
        setSelectedRoom(schedule.room);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingScheduleId(null);
        setActiveTab("view");
        reset();
        setTrainerName('');
        setTrainerId('');
        setRenderTrainerDropdown(false);
        setTrainerSearchQuery('');
        setSelectedRoom('');
    };

    // Get all staffs
    const getAllStaffs = async () => {
        try {
            const response = await fetch(`http://88.198.112.156:3100/api/staffsmanagement`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
            toast.error("Failed to fetch staffs");
        }
    };

    const { data: staffsData, isLoading: staffsLoading } = useQuery({
        queryKey: ['staffs'],
        queryFn: getAllStaffs
    });

    const { staffs } = staffsData || {};

    // Staff search states
    const [trainerSearchQuery, setTrainerSearchQuery] = useState('');
    const [trainerName, setTrainerName] = useState('');
    const [renderTrainerDropdown, setRenderTrainerDropdown] = useState(false);
    const trainerSearchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (trainerSearchRef.current && !trainerSearchRef.current.contains(event.target)) {
                setRenderTrainerDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [trainerSearchRef]);

    const handleTrainerSearchFocus = () => {
        setRenderTrainerDropdown(true);
    };

    // Get all schedules
    const getAllSchedules = async () => {
        try {
            const response = await fetch(`http://88.198.112.156:3100/api/schedules?page=${currentPage}&limit=${limit}`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
            toast.error("Failed to fetch schedules");
        }
    };

    const { data: schedulesData, isLoading: schedulesLoading } = useQuery({
        queryKey: ['schedules', currentPage],
        queryFn: getAllSchedules
    });

    const { schedules, totalPages } = schedulesData || {};
    const startEntry = (currentPage - 1) * limit + 1;
    const endEntry = startEntry + schedules?.length - 1;

    // Format datetime for display
    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const deleteSchedule = async (scheduleId) => {
        try {
            const response = await fetch(`http://88.198.112.156:3100/api/schedules/${scheduleId}`, {
                method: 'DELETE',
            });

            const responseBody = await response.json();
            if (response.ok) {
                toast.success(responseBody.message);
                queryClient.invalidateQueries(['schedules']);
            } else {
                toast.error(responseBody.message);
            }
        } catch (error) {
            console.log("Error: ", error);
            toast.error("Failed to delete schedule");
        }
    }

    return (
        <div className='w-full bg-gray-100 dark:bg-gray-900 flex justify-center min-h-screen px-4 py-6'>
            <div className="w-full">
                {/* Breadcrumb */}
                <div className='w-full mb-6'>
                    <Breadcrumb className="mb-6">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <MdHome className='w-4 h-4 text-gray-500 dark:text-gray-400' />
                                <BreadcrumbLink href="/" className="ml-2 font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <FiChevronRight className="h-4 w-4 text-gray-400" />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BsSpeedometer2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                <BreadcrumbLink className="ml-2 font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <FiChevronRight className="h-4 w-4 text-gray-400" />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BsCalendar2Week className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                <BreadcrumbPage className="ml-2 font-medium text-primary">Class Schedule Management</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    {/* Enhanced Header Card */}
                    <div className="flex flex-col md:flex-row justify-between items-start bg-gradient-to-r from-primary/5 to-blue-50 dark:from-gray-700/50 dark:to-gray-800 p-6 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm md:items-center gap-4">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-primary/10 dark:bg-primary/20">
                                <BsCalendar2Week className="w-6 h-6 text-primary dark:text-primary/80" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold mb-1.5 dark:text-white flex items-center gap-2">
                                    Class Schedule Management
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium flex items-center gap-1.5">
                                    <FiInfo className="w-4 h-4" />
                                    Create and manage class schedules efficiently
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={() => window.location.reload()}
                                className="h-10 px-4 py-2 border-gray-300 dark:bg-gray-900 dark:border-none hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-200 flex items-center gap-2"
                            >
                                <FiRefreshCcw className="w-4 h-4" />
                                <span>Refresh</span>
                            </Button>
                            <Button
                                onClick={() => setActiveTab('create')}
                                className="h-10 px-4 py-2 bg-primary dark:hover:bg-gray-700 dark:bg-gray-900 hover:bg-primary/90 text-white flex items-center gap-2">
                                <FiPlus className="w-4 h-4" />
                                <span>New Schedule</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Improved Tabs with dark mode */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6 dark:text-white bg-white dark:bg-gray-800">
                        <TabsTrigger
                            value="create"
                            className="flex items-center gap-2 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white"
                        >
                            {isEditing ? (
                                <>
                                    <FiEdit className="h-4 w-4" />
                                    Edit Schedule
                                </>
                            ) : (
                                <>
                                    <FiPlus className="h-4 w-4" />
                                    Create Schedule
                                </>
                            )}
                        </TabsTrigger>
                        <TabsTrigger
                            value="view"
                            className="flex items-center gap-2 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white"
                        >
                            <FiEye className="h-4 w-4" />
                            View Schedules
                        </TabsTrigger>
                    </TabsList>

                    {/* Create/Edit Tab */}
                    <TabsContent value="create">
                        <Card className="dark:bg-gray-800 dark:border-none">
                            <CardHeader>
                                <CardTitle className="dark:text-gray-100">
                                    {isEditing ? 'Edit Class Schedule' : 'Create New Class Schedule'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="className" className="dark:text-gray-300">Class Name *</Label>
                                            <Input
                                                id="className"
                                                name="className"
                                                {...register('className', { required: 'Class Name is required' })}
                                                placeholder="e.g., Morning Yoga, HIIT Training"
                                                required
                                                className="dark:bg-gray-900 bg-white py-6 rounded-sm dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
                                            />
                                            {errors.className && <p className="text-red-500 dark:text-red-400">{errors.className.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="trainer" className="dark:text-gray-300">Trainer *</Label>
                                            <div className='space-y-1.5'>
                                                <div ref={trainerSearchRef} className="relative">
                                                    <Controller
                                                        name="trainerName"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <div className="relative">
                                                                <Input
                                                                    {...field}
                                                                    autoComplete="off"
                                                                    value={trainerName || trainerSearchQuery}
                                                                    onChange={(e) => {
                                                                        setTrainerSearchQuery(e.target.value);
                                                                        field.onChange(e);
                                                                        setTrainerName('');
                                                                    }}
                                                                    onFocus={handleTrainerSearchFocus}
                                                                    className="w-full rounded-sm bg-white py-6 border border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-sm px-4 pl-10 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
                                                                    placeholder="Search staff..."
                                                                />
                                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
                                                                    <FiSearch className="h-5 w-5" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    />
                                                    {errors.trainerName && (
                                                        <p className="mt-1.5 text-sm font-medium text-red-600 dark:text-red-400">
                                                            {errors.trainerName.message}
                                                        </p>
                                                    )}

                                                    {renderTrainerDropdown && (
                                                        <div className="absolute w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-80 overflow-y-auto z-20 top-full left-0 mt-1">
                                                            {staffs?.length > 0 ? (
                                                                staffs
                                                                    .filter((staff) => {
                                                                        return staff.fullName
                                                                            .toLowerCase()
                                                                            .includes(trainerSearchQuery.toLowerCase());
                                                                    })
                                                                    .map((staff) => (
                                                                        <div
                                                                            onClick={() => {
                                                                                setTrainerName(staff.fullName);
                                                                                setTrainerSearchQuery(staff.fullName);
                                                                                setTrainerId(staff._id);
                                                                                setRenderTrainerDropdown(false);
                                                                            }}
                                                                            className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                                                                            key={staff._id}
                                                                        >
                                                                            {staff.fullName}
                                                                        </div>
                                                                    ))
                                                            ) : (
                                                                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                                                    {staffsLoading ? 'Loading...' : 'No staff found'}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="room" className="dark:text-gray-300">Room *</Label>
                                            <Select onValueChange={(value) => setSelectedRoom(value)} value={selectedRoom}>
                                                <SelectTrigger className="dark:bg-gray-900 py-6 rounded-sm dark:border-gray-700 dark:text-gray-100">
                                                    <SelectValue placeholder="Select Room" />
                                                </SelectTrigger>
                                                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                                                    <SelectItem value="Studio A" className="hover:bg-blue-600/30 cursor-pointer dark:text-gray-300 dark:hover:bg-gray-700">Studio A</SelectItem>
                                                    <SelectItem value="Studio B" className="hover:bg-blue-600/30 cursor-pointer dark:text-gray-300 dark:hover:bg-gray-700">Studio B</SelectItem>
                                                    <SelectItem value="Gym Floor" className="hover:bg-blue-600/30 cursor-pointer dark:text-gray-300 dark:hover:bg-gray-700">Gym Floor</SelectItem>
                                                    <SelectItem value="Cardio Room" className="hover:bg-blue-600/30 cursor-pointer dark:text-gray-300 dark:hover:bg-gray-700">Cardio Room</SelectItem>
                                                    <SelectItem value="Weight Room" className="hover:bg-blue-600/30 cursor-pointer dark:text-gray-300 dark:hover:bg-gray-700">Weight Room</SelectItem>
                                                    <SelectItem value="Yoga Room" className="hover:bg-blue-600/30 cursor-pointer dark:text-gray-300 dark:hover:bg-gray-700">Yoga Room</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.room && <p className="text-red-500 dark:text-red-400">{errors.room.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="capacity" className="dark:text-gray-300">Capacity *</Label>
                                            <Input
                                                type="number"
                                                id="capacity"
                                                name="capacity"
                                                placeholder="Maximum participants"
                                                {...register('capacity', { required: 'Capacity is required' })}
                                                min="1"
                                                max="100"
                                                required
                                                className="dark:bg-gray-900 bg-white py-6 rounded-sm dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
                                            />
                                            {errors.capacity && <p className="text-red-500 dark:text-red-400">{errors.capacity.message}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="startTime" className="dark:text-gray-300">Start Time *</Label>
                                            <Input
                                                type="datetime-local"
                                                id="startTime"
                                                name="startTime"
                                                {...register('startTime', { required: 'Start Time is required' })}
                                                required
                                                className="dark:bg-gray-900 py-6 bg-white rounded-sm dark:border-gray-700 dark:text-gray-100"
                                            />
                                            {errors.startTime && <p className="text-red-500 dark:text-red-400">{errors.startTime.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="endTime" className="dark:text-gray-300">End Time *</Label>
                                            <Input
                                                type="datetime-local"
                                                id="endTime"
                                                name="endTime"
                                                {...register('endTime', { required: 'End Time is required' })}
                                                required
                                                className="dark:bg-gray-900 bg-white py-6 rounded-sm dark:border-gray-700 dark:text-gray-100"
                                            />
                                            {errors.endTime && <p className="text-red-500 dark:text-red-400">{errors.endTime.message}</p>}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        {isEditing && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleCancelEdit}
                                                className="dark:bg-gray-800 py-6 rounded-sm dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                                            >
                                                Cancel Edit
                                            </Button>
                                        )}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                reset();
                                                setTrainerName('');
                                                setTrainerId('');
                                                setRenderTrainerDropdown(false);
                                                setTrainerSearchQuery('');
                                                setSelectedRoom('');
                                                setIsEditing(false);
                                                setEditingScheduleId(null);
                                            }}
                                            className="dark:bg-gray-800 py-6 rounded-sm dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                                        >
                                            Reset
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-blue-600 py-6 rounded-sm hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
                                        >
                                            {isSubmitting ? (
                                                <FiLoader className="animate-spin" />
                                            ) : isEditing ? (
                                                'Update Schedule'
                                            ) : (
                                                'Create Schedule'
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* View Tab */}
                    <TabsContent value="view">
                        {schedulesLoading ? (
                            <div className="flex justify-center items-center min-h-[400px]">
                                <Loader />
                            </div>
                        ) : Array.isArray(schedules) && schedules.length > 0 ? (
                            <Card className='dark:border-none dark:bg-gray-800'>
                                <CardHeader>
                                    <CardTitle>Scheduled Classes</CardTitle>
                                    <CardDescription>
                                        Total: <span className="font-semibold">{schedules?.length}</span> classes
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Class Name</TableHead>
                                                    <TableHead>Trainer</TableHead>
                                                    <TableHead>Room</TableHead>
                                                    <TableHead>Start Time</TableHead>
                                                    <TableHead>End Time</TableHead>
                                                    <TableHead>Capacity</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Members</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {schedules.map((schedule) => (
                                                    <TableRow key={schedule._id}>
                                                        <TableCell>{schedule.className}</TableCell>
                                                        <TableCell>{schedule.trainer?.fullName || 'N/A'}</TableCell>
                                                        <TableCell>{schedule.room}</TableCell>
                                                        <TableCell>{formatDateTime(schedule.startTime)}</TableCell>
                                                        <TableCell>{formatDateTime(schedule.endTime)}</TableCell>
                                                        <TableCell className="text-center">{schedule.capacity}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={
                                                                schedule.status === 'Pending' ? 'secondary' :
                                                                    schedule.status === 'OnGoing' ? 'default' :
                                                                        schedule.status === 'Completed' ? 'green' :
                                                                            'destructive'
                                                            }>
                                                                {schedule.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="flex items-center gap-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                                                                    >
                                                                        <TiEye className="h-4 w-4" />
                                                                        <span>{schedule.members?.length || 0}</span>
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent className="sm:max-w-[425px]">
                                                                    <DialogHeader>
                                                                        <DialogTitle>Class Members</DialogTitle>
                                                                        <DialogDescription>
                                                                            List of members enrolled in {schedule.className}
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <div className="py-4">
                                                                        {schedule.members && schedule.members.length > 0 ? (
                                                                            <div className="space-y-2">
                                                                                {schedule.members.map((member, index) => (
                                                                                    <div key={member._id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                                                                        <div className="flex items-center gap-2">
                                                                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                                                                <span className="text-blue-600 font-medium">
                                                                                                    {member.fullName.charAt(0)}
                                                                                                </span>
                                                                                            </div>
                                                                                            <span className="font-medium">{member.fullName}</span>
                                                                                        </div>
                                                                                        <Badge variant="outline">
                                                                                            {schedule.memberBookings[index]?.status || 'Booked'}
                                                                                        </Badge>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        ) : (
                                                                            <p className="text-center text-gray-500">No members enrolled yet</p>
                                                                        )}
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleEdit(schedule)}
                                                                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                                                                >
                                                                    <FiEdit className="h-4 w-4" />
                                                                </Button>
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="destructive"
                                                                            className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 dark:text-white"
                                                                        >
                                                                            <FiTrash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle className="dark:text-gray-100">Are you absolutely sure?</AlertDialogTitle>
                                                                            <AlertDialogDescription className="dark:text-gray-400">
                                                                                This action cannot be undone. This will permanently delete the schedule.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() => deleteSchedule(schedule._id)}
                                                                                className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 dark:text-white"
                                                                            >
                                                                                Continue
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
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="flex justify-center items-center min-h-[400px]">
                                <p className="text-gray-500">No schedules found</p>
                            </div>
                        )}

                        <div className='my-2'>
                            <div className="mt-4 px-4 md:flex justify-between items-center">
                                <p className="font-medium text-center text-sm text-gray-700">
                                    Showing <span className="font-semibold">{startEntry}</span> to <span className="font-semibold">{endEntry}</span> of <span className="font-semibold">{schedules?.length}</span> entries
                                </p>
                                <Pagination
                                    total={totalPages}
                                    page={currentPage}
                                    onChange={setCurrentPage}
                                    withEdges={true}
                                    siblings={1}
                                    boundaries={1}
                                />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default ScheduleManagement;
