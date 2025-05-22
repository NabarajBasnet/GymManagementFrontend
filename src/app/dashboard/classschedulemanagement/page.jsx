'use client';

import { TiEye } from "react-icons/ti";
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
import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FiChevronRight, FiTrash2, FiEdit, FiPlus, FiX, FiSave, FiCheck, FiInfo, FiEye, FiLoader, FiFilter, FiRefreshCcw, FiSearch } from "react-icons/fi";
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
import { useForm, Controller } from "react-hook-form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Pagination from "@/components/ui/CustomPagination.jsx";
import Loader from "@/components/Loader/Loader";

const ScheduleManagement = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [activeTab, setActiveTab] = useState("view");
    const [isEditing, setIsEditing] = useState(false);
    const [editingScheduleId, setEditingScheduleId] = useState(null);
const queryClient = useQueryClient();

    const ref = useRef(null);

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
                ? `http://localhost:3000/api/schedules/${editingScheduleId}`
                : 'http://localhost:3000/api/schedules';
            
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
            const response = await fetch(`http://localhost:3000/api/staffsmanagement`);
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
            const response = await fetch(`http://localhost:3000/api/schedules`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
            toast.error("Failed to fetch schedules");
        }
    };

    const { data: schedulesData, isLoading: schedulesLoading } = useQuery({
        queryKey: ['schedules'],
        queryFn: getAllSchedules
    });

    const { schedules } = schedulesData || {};

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

    return (
        <div className='w-full bg-gray-100 flex justify-center min-h-screen p-4 md:p-6'>
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
                                <BreadcrumbLink className="font-semibold">Class Schedule Management</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start bg-white p-5 py-5 border border-gray-200 shadow-sm rounded-sm md:items-center gap-4">
                        <div>
                            <h1 className="text-xl font-bold mb-2">Class Schedule Management</h1>
                            <p className="text-xs text-gray-500 font-medium">
                                Create and manage class schedules
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={() => window.location.reload()}>
                                <FiRefreshCcw className="mr-2" />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-gray-800 via-stone-600 to-neutral-700 mb-6 text-white">
                        <TabsTrigger value="create" className="flex items-center gap-2">
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
                        <TabsTrigger value="view" className="flex items-center gap-2">
                            <FiEye className="h-4 w-4" />
                            View Schedules
                        </TabsTrigger>
                    </TabsList>

                    {/* Create/Edit Tab */}
                    <TabsContent value="create">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {isEditing ? 'Edit Class Schedule' : 'Create New Class Schedule'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="className">Class Name *</Label>
                                            <Input
                                                id="className"
                                                name="className"
                                                {...register('className', { required: 'Class Name is required' })}
                                                placeholder="e.g., Morning Yoga, HIIT Training"
                                                required
                                            />
                                            {errors.className && <p className="text-red-500">{errors.className.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="trainer">Trainer *</Label>
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
                                                                    className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm px-4 py-2.5 pl-10"
                                                                    placeholder="Search staff..."
                                                                />
                                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                                                    <FiSearch className="h-5 w-5" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    />
                                                    {errors.trainerName && (
                                                        <p className="mt-1.5 text-sm font-medium text-red-600">
                                                            {errors.trainerName.message}
                                                        </p>
                                                    )}

                                                    {renderTrainerDropdown && (
                                                        <div className="absolute w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto z-20 top-full left-0 mt-1">
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
                                                                            className="px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors"
                                                                            key={staff._id}
                                                                        >
                                                                            {staff.fullName}
                                                                        </div>
                                                                    ))
                                                            ) : (
                                                                <div className="px-4 py-3 text-sm text-gray-500">{staffsLoading ? 'Loading...' : 'No staff found'}</div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="room">Room *</Label>
                                            <Select onValueChange={(value)=>setSelectedRoom(value)} value={selectedRoom}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Room" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Studio A">Studio A</SelectItem>
                                                    <SelectItem value="Studio B">Studio B</SelectItem>
                                                    <SelectItem value="Gym Floor">Gym Floor</SelectItem>
                                                    <SelectItem value="Cardio Room">Cardio Room</SelectItem>
                                                    <SelectItem value="Weight Room">Weight Room</SelectItem>
                                                    <SelectItem value="Yoga Room">Yoga Room</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.room && <p className="text-red-500">{errors.room.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="capacity">Capacity *</Label>
                                            <Input
                                                type="number"
                                                id="capacity"
                                                name="capacity"
                                                placeholder="Maximum participants"
                                                {...register('capacity', { required: 'Capacity is required' })}
                                                min="1"
                                                max="100"
                                                required
                                            />
                                            {errors.capacity && <p className="text-red-500">{errors.capacity.message}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="startTime">Start Time *</Label>
                                            <Input
                                                type="datetime-local"
                                                id="startTime"
                                                name="startTime"
                                                {...register('startTime', { required: 'Start Time is required' })}
                                                required
                                            />
                                            {errors.startTime && <p className="text-red-500">{errors.startTime.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="endTime">End Time *</Label>
                                            <Input
                                                type="datetime-local"
                                                id="endTime"
                                                name="endTime"
                                                {...register('endTime', { required: 'End Time is required' })}
                                                required
                                            />
                                            {errors.endTime && <p className="text-red-500">{errors.endTime.message}</p>}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        {isEditing && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleCancelEdit}
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
                                        >
                                            Reset
                                        </Button>
                                        <Button type="submit" disabled={isSubmitting}>
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
                            <Card>
                                <CardHeader>
                                    <CardTitle>Scheduled Classes</CardTitle>
                                    <CardDescription>
                                        Total: {schedules.length} classes
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
                                                                schedule.status === 'Completed' ? 'success' :
                                                                'destructive'
                                                            }>
                                                                {schedule.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                                                <TiEye className="h-4 w-4" />
                                                                <span>{schedule.members?.length || 0}</span>
                                                            </Button>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleEdit(schedule)}
                                                                >
                                                                    <FiEdit className="h-4 w-4" />
                                                                </Button>
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="destructive"
                                                                        >
                                                                            <FiTrash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                This action cannot be undone. This will permanently delete the schedule.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction onClick={() => handleDelete(schedule._id)}>
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

                        {Array.isArray(schedules) && schedules.length > 0 && (
                            <div className='my-2'>
                                <div className="mt-4 px-4 md:flex justify-between items-center">
                                    <p className="font-medium text-center text-sm text-gray-700">
                                        Showing <span className="font-semibold">{1}</span> to <span className="font-semibold">{schedules.length}</span> of <span className="font-semibold">{schedules.length}</span> entries
                                    </p>
                                    <Pagination
                                        total={Math.ceil(schedules.length / limit)}
                                        page={currentPage}
                                        onChange={setCurrentPage}
                                        withEdges={true}
                                        siblings={1}
                                        boundaries={1}
                                    />
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default ScheduleManagement;
