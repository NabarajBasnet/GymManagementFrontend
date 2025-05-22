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
import { FiChevronRight, FiTrash2, FiEdit, FiPlus, FiX, FiSave, FiCheck, FiInfo, FiEye, FiLoader, FiFilter, FiRefreshCcw } from "react-icons/fi";
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

const ScheduleManagement = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [activeTab, setActiveTab] = useState("create");

    // State for form data
    const [formData, setFormData] = useState({
        className: '',
        trainer: '',
        room: '',
        startTime: '',
        endTime: '',
        capacity: ''
    });

    // State for scheduled classes
    const [scheduledClasses, setScheduledClasses] = useState([
        {
            id: 1,
            className: 'Morning Yoga',
            trainer: 'Sarah Johnson',
            room: 'Studio A',
            startTime: '2024-01-15T08:00',
            endTime: '2024-01-15T09:00',
            capacity: 20
        },
        {
            id: 2,
            className: 'HIIT Training',
            trainer: 'Mike Wilson',
            room: 'Gym Floor',
            startTime: '2024-01-15T10:00',
            endTime: '2024-01-15T11:00',
            capacity: 15
        },
        {
            id: 3,
            className: 'Zumba Dance',
            trainer: 'Maria Garcia',
            room: 'Studio B',
            startTime: '2024-01-15T18:00',
            endTime: '2024-01-15T19:00',
            capacity: 25
        }
    ]);

    // State for editing
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    // Sample data for dropdowns
    const trainers = [
        'Sarah Johnson',
        'Mike Wilson',
        'Maria Garcia',
        'David Lee',
        'Emily Brown',
        'Chris Taylor'
    ];

    const rooms = [
        'Studio A',
        'Studio B',
        'Gym Floor',
        'Cardio Room',
        'Weight Room',
        'Yoga Room'
    ];

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.className || !formData.trainer || !formData.room || 
            !formData.startTime || !formData.endTime || !formData.capacity) {
            toast.error('Please fill in all fields');
            return;
        }

        // Create new class
        const newClass = {
            id: Date.now(),
            className: formData.className,
            trainer: formData.trainer,
            room: formData.room,
            startTime: formData.startTime,
            endTime: formData.endTime,
            capacity: parseInt(formData.capacity)
        };

        setScheduledClasses(prev => [...prev, newClass]);
        
        // Reset form
        setFormData({
            className: '',
            trainer: '',
            room: '',
            startTime: '',
            endTime: '',
            capacity: ''
        });

        toast.success('Class scheduled successfully!');
    };

    // Handle edit
    const handleEdit = (classItem) => {
        setEditingId(classItem.id);
        setEditFormData({ ...classItem });
    };

    // Handle edit save
    const handleEditSave = () => {
        setScheduledClasses(prev =>
            prev.map(item =>
                item.id === editingId ? { ...editFormData } : item
            )
        );
        setEditingId(null);
        setEditFormData({});
        toast.success('Class updated successfully!');
    };

    // Handle edit cancel
    const handleEditCancel = () => {
        setEditingId(null);
        setEditFormData({});
    };

    // Handle edit input change
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle delete
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this class?')) {
            setScheduledClasses(prev => prev.filter(item => item.id !== id));
            toast.success('Class deleted successfully!');
        }
    };

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
                                <BreadcrumbLink className="font-semibold">Schedule Management</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start bg-white p-5 py-5 border border-gray-200 shadow-sm rounded-sm md:items-center gap-4">
                        <div>
                            <h1 className="text-xl font-bold mb-2">Schedule Management</h1>
                            <p className="text-xs text-gray-500 font-medium">
                                Manage and respond to member schedules
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
                <Tabs defaultValue="create" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-gray-800 via-stone-600 to-neutral-700 mb-6 text-white">
                        <TabsTrigger value="create" className="flex items-center gap-2">
                            <FiPlus className="h-4 w-4" />
                            Create Schedule
                        </TabsTrigger>
                        <TabsTrigger value="view" className="flex items-center gap-2">
                            <FiEye className="h-4 w-4" />
                            View Schedules
                        </TabsTrigger>
                    </TabsList>

                    {/* Create Tab */}
                    <TabsContent value="create">
                        <Card>
                            <CardHeader>
                                <CardTitle>Create New Class Schedule</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="className">Class Name *</Label>
                                            <Input
                                                id="className"
                                                name="className"
                                                value={formData.className}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Morning Yoga, HIIT Training"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="trainer">Trainer *</Label>
                                            <Select
                                                value={formData.trainer}
                                                onValueChange={(value) => handleInputChange({ target: { name: 'trainer', value } })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Trainer" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {trainers.map((trainer, index) => (
                                                        <SelectItem key={index} value={trainer}>
                                                            {trainer}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="room">Room *</Label>
                                            <Select
                                                value={formData.room}
                                                onValueChange={(value) => handleInputChange({ target: { name: 'room', value } })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Room" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {rooms.map((room, index) => (
                                                        <SelectItem key={index} value={room}>
                                                            {room}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="capacity">Capacity *</Label>
                                            <Input
                                                type="number"
                                                id="capacity"
                                                name="capacity"
                                                value={formData.capacity}
                                                onChange={handleInputChange}
                                                placeholder="Maximum participants"
                                                min="1"
                                                max="100"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="startTime">Start Time *</Label>
                                            <Input
                                                type="datetime-local"
                                                id="startTime"
                                                name="startTime"
                                                value={formData.startTime}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="endTime">End Time *</Label>
                                            <Input
                                                type="datetime-local"
                                                id="endTime"
                                                name="endTime"
                                                value={formData.endTime}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setFormData({
                                                className: '',
                                                trainer: '',
                                                room: '',
                                                startTime: '',
                                                endTime: '',
                                                capacity: ''
                                            })}
                                        >
                                            Reset
                                        </Button>
                                        <Button type="submit">
                                            Create Schedule
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* View Tab */}
                    <TabsContent value="view">
                        <Card>
                            <CardHeader>
                                <CardTitle>Scheduled Classes</CardTitle>
                                <CardDescription>
                                    Total: {scheduledClasses.length} classes
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
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {scheduledClasses.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center py-8">
                                                        No classes scheduled yet. Create your first class above.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                scheduledClasses.map((classItem) => (
                                                    <TableRow key={classItem.id}>
                                                        <TableCell>
                                                            {editingId === classItem.id ? (
                                                                <Input
                                                                    name="className"
                                                                    value={editFormData.className}
                                                                    onChange={handleEditInputChange}
                                                                />
                                                            ) : (
                                                                classItem.className
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {editingId === classItem.id ? (
                                                                <Select
                                                                    value={editFormData.trainer}
                                                                    onValueChange={(value) => handleEditInputChange({ target: { name: 'trainer', value } })}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {trainers.map((trainer, index) => (
                                                                            <SelectItem key={index} value={trainer}>
                                                                                {trainer}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            ) : (
                                                                classItem.trainer
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {editingId === classItem.id ? (
                                                                <Select
                                                                    value={editFormData.room}
                                                                    onValueChange={(value) => handleEditInputChange({ target: { name: 'room', value } })}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {rooms.map((room, index) => (
                                                                            <SelectItem key={index} value={room}>
                                                                                {room}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            ) : (
                                                                classItem.room
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {editingId === classItem.id ? (
                                                                <Input
                                                                    type="datetime-local"
                                                                    name="startTime"
                                                                    value={editFormData.startTime}
                                                                    onChange={handleEditInputChange}
                                                                />
                                                            ) : (
                                                                formatDateTime(classItem.startTime)
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {editingId === classItem.id ? (
                                                                <Input
                                                                    type="datetime-local"
                                                                    name="endTime"
                                                                    value={editFormData.endTime}
                                                                    onChange={handleEditInputChange}
                                                                />
                                                            ) : (
                                                                formatDateTime(classItem.endTime)
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {editingId === classItem.id ? (
                                                                <Input
                                                                    type="number"
                                                                    name="capacity"
                                                                    value={editFormData.capacity}
                                                                    onChange={handleEditInputChange}
                                                                    min="1"
                                                                    max="100"
                                                                />
                                                            ) : (
                                                                classItem.capacity
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center justify-end gap-2">
                                                                {editingId === classItem.id ? (
                                                                    <>
                                                                        <Button
                                                                            size="sm"
                                                                            onClick={handleEditSave}
                                                                        >
                                                                            Save
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            onClick={handleEditCancel}
                                                                        >
                                                                            Cancel
                                                                        </Button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            onClick={() => handleEdit(classItem)}
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
                                                                                    This action cannot be undone. This will permanently delete your
                                                                                    account and remove your data from our servers.
                                                                                </AlertDialogDescription>
                                                                                </AlertDialogHeader>
                                                                                <AlertDialogFooter>
                                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                <AlertDialogAction>Continue</AlertDialogAction>
                                                                                </AlertDialogFooter>
                                                                            </AlertDialogContent>
                                                                            </AlertDialog>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default ScheduleManagement;
