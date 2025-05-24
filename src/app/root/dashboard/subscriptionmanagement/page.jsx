'use client';

import { TiEye } from "react-icons/ti";
import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FiChevronRight, FiTrash2, FiEdit, FiPlus, FiEye, FiLoader,  FiRefreshCcw, FiSearch } from "react-icons/fi";
import { MdHome } from "react-icons/md";
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
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
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
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const SubscriptionManagement = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(6);
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

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState(null);

    // Fetch all subscriptions
    const { data: subscriptions, isLoading } = useQuery({
        queryKey: ['subscriptions'],
        queryFn: async () => {
            const response = await fetch('http://localhost:3000/api/subscription/getall');
            const data = await response.json();
            return data.subscriptions;
        }
    });

    const onSubmit = async (data) => {
        try {
            const url = editingSubscription 
                ? `http://localhost:3000/api/subscription/update/${editingSubscription._id}`
                : 'http://localhost:3000/api/subscription/create';
            
            const method = editingSubscription ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    subscriptionPrice: Number(data.subscriptionPrice),
                    subscriptionDuration: Number(data.subscriptionDuration),
                    subscriptionFeatures: data.subscriptionFeatures.split(',').map(feature => feature.trim()),
                    subscriptionAccess: data.subscriptionAccess.split(',').map(access => access.trim())
                }),
            });

            const responseData = await response.json();

            if (response.ok) {
                toast.success(responseData.message);
                setIsDialogOpen(false);
                reset();
                setEditingSubscription(null);
                queryClient.invalidateQueries(['subscriptions']);
            } else {
                toast.error(responseData.message);
            }
        } catch (error) {
            toast.error('An error occurred while saving the subscription');
        }
    };

    const handleEdit = (subscription) => {
        setEditingSubscription(subscription);
        reset({
            subscriptionName: subscription.subscriptionName,
            subscriptionDescription: subscription.subscriptionDescription,
            subscriptionPrice: subscription.subscriptionPrice,
            subscriptionDuration: subscription.subscriptionDuration,
            subscriptionFeatures: subscription.subscriptionFeatures.join(', '),
            subscriptionAccess: subscription.subscriptionAccess.join(', ')
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/subscription/delete/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                queryClient.invalidateQueries(['subscriptions']);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('An error occurred while deleting the subscription');
        }
    };

    const handleRefresh = () => {
        queryClient.invalidateQueries(['subscriptions']);
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
            const response = await fetch(`http://localhost:3000/api/schedules?page=${currentPage}&limit=${limit}`);
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
            const response = await fetch(`http://localhost:3000/api/schedules/${scheduleId}`, {
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
                                <BreadcrumbLink className="font-semibold">Subscription Management</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start bg-white p-5 py-5 border border-gray-200 shadow-sm rounded-sm md:items-center gap-4">
                        <div>
                            <h1 className="text-xl font-bold mb-2">Subscription Management</h1>
                            <p className="text-xs text-gray-500 font-medium">
                                Create and manage subscription plans
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={handleRefresh}>
                                <FiRefreshCcw className="mr-2" />
                                Refresh
                            </Button>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <FiPlus className="mr-2" />
                                        Create Subscription
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                        <DialogTitle>
                                            {editingSubscription ? 'Edit Subscription' : 'Create New Subscription'}
                                        </DialogTitle>
                                        <DialogDescription>
                                            Fill in the details for the subscription plan
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="subscriptionName">Subscription Name</Label>
                                            <Input
                                                id="subscriptionName"
                                                {...register('subscriptionName', { required: 'Name is required' })}
                                                placeholder="e.g., Premium Plan"
                                            />
                                            {errors.subscriptionName && (
                                                <p className="text-sm text-red-500">{errors.subscriptionName.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subscriptionDescription">Description</Label>
                                            <Textarea
                                                id="subscriptionDescription"
                                                {...register('subscriptionDescription', { required: 'Description is required' })}
                                                placeholder="Describe the subscription plan"
                                            />
                                            {errors.subscriptionDescription && (
                                                <p className="text-sm text-red-500">{errors.subscriptionDescription.message}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="subscriptionPrice">Price</Label>
                                                <Input
                                                    id="subscriptionPrice"
                                                    type="number"
                                                    {...register('subscriptionPrice', { required: 'Price is required' })}
                                                    placeholder="Enter price"
                                                />
                                                {errors.subscriptionPrice && (
                                                    <p className="text-sm text-red-500">{errors.subscriptionPrice.message}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="subscriptionDuration">Duration (months)</Label>
                                                <Input
                                                    id="subscriptionDuration"
                                                    type="number"
                                                    {...register('subscriptionDuration', { required: 'Duration is required' })}
                                                    placeholder="Enter duration"
                                                />
                                                {errors.subscriptionDuration && (
                                                    <p className="text-sm text-red-500">{errors.subscriptionDuration.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subscriptionFeatures">Features (comma-separated)</Label>
                                            <Textarea
                                                id="subscriptionFeatures"
                                                {...register('subscriptionFeatures', { required: 'Features are required' })}
                                                placeholder="e.g., Access to all classes, Personal trainer, Locker access"
                                            />
                                            {errors.subscriptionFeatures && (
                                                <p className="text-sm text-red-500">{errors.subscriptionFeatures.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subscriptionAccess">Access Rights (comma-separated)</Label>
                                            <Textarea
                                                id="subscriptionAccess"
                                                {...register('subscriptionAccess', { required: 'Access rights are required' })}
                                                placeholder="e.g., Gym access, Pool access, Sauna access"
                                            />
                                            {errors.subscriptionAccess && (
                                                <p className="text-sm text-red-500">{errors.subscriptionAccess.message}</p>
                                            )}
                                        </div>

                                        <DialogFooter>
                                            <Button type="submit" disabled={isSubmitting}>
                                                {isSubmitting ? 'Saving...' : editingSubscription ? 'Update' : 'Create'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>

                {/* Subscription List */}
                {isLoading ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <Loader />
                    </div>
                ) : subscriptions?.length > 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Subscription Plans</CardTitle>
                            <CardDescription>
                                Total: <span className="font-semibold">{subscriptions.length}</span> plans
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Duration</TableHead>
                                            <TableHead>Features</TableHead>
                                            <TableHead>Access Rights</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {subscriptions.map((subscription) => (
                                            <TableRow key={subscription._id}>
                                                <TableCell className="font-medium">{subscription.subscriptionName}</TableCell>
                                                <TableCell>{subscription.subscriptionDescription}</TableCell>
                                                <TableCell>${subscription.subscriptionPrice}</TableCell>
                                                <TableCell>{subscription.subscriptionDuration} months</TableCell>
                                                <TableCell>
                                                    <ul className="list-disc list-inside">
                                                        {subscription.subscriptionFeatures.map((feature, index) => (
                                                            <li key={index} className="text-sm">{feature}</li>
                                                        ))}
                                                    </ul>
                                                </TableCell>
                                                <TableCell>
                                                    <ul className="list-disc list-inside">
                                                        {subscription.subscriptionAccess.map((access, index) => (
                                                            <li key={index} className="text-sm">{access}</li>
                                                        ))}
                                                    </ul>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleEdit(subscription)}
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
                                                                        This action cannot be undone. This will permanently delete the subscription plan.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete(subscription._id)}>
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
                        <p className="text-gray-500">No subscription plans found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriptionManagement;
