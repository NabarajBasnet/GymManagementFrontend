'use client';

import { TiEye } from "react-icons/ti";
import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FiChevronRight, FiTrash2, FiEdit, FiPlus, FiEye, FiLoader,  FiRefreshCcw, FiSearch } from "react-icons/fi";
import { MdHome } from "react-icons/md";
import toast from "react-hot-toast";
import { format } from 'date-fns';
import { Checkbox } from "@/components/ui/checkbox";

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
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [selectedAccess, setSelectedAccess] = useState([]);

    // Fetch all subscriptions
    const { data: subscriptions, isLoading } = useQuery({
        queryKey: ['subscriptions'],
        queryFn: async () => {
            const response = await fetch('http://localhost:3000/api/subscription/getall');
            const data = await response.json();
            return data.subscriptions;
        }
    });

    const featuresList = [
        "QR Check-in",
        "Locker Management",
        "Attendance Report",
        "Membership Analytics",
        "Staff Management",
        "Branch Access",
        "Class Booking",
        "Personal Training",
        "Group Classes",
        "Equipment Access",
        "Nutrition Planning",
        "Progress Tracking"
    ];

    const accessList = [
        "Gym Access",
        "Pool Access",
        "Sauna Access",
        "Spa Access",
        "Group Class Access",
        "Personal Training Access",
        "Locker Access",
        "Equipment Access",
        "24/7 Access",
        "VIP Lounge Access"
    ];

    const handleFeatureToggle = (feature) => {
        setSelectedFeatures(prev => 
            prev.includes(feature)
                ? prev.filter(f => f !== feature)
                : [...prev, feature]
        );
    };

    const handleAccessToggle = (access) => {
        setSelectedAccess(prev => 
            prev.includes(access)
                ? prev.filter(a => a !== access)
                : [...prev, access]
        );
    };

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
                    subscriptionFeatures: selectedFeatures,
                    subscriptionAccess: selectedAccess
                }),
            });

            const responseData = await response.json();

            if (response.ok) {
                toast.success(responseData.message);
                setIsDialogOpen(false);
                reset();
                setSelectedFeatures([]);
                setSelectedAccess([]);
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
        setSelectedFeatures(subscription.subscriptionFeatures);
        setSelectedAccess(subscription.subscriptionAccess);
        reset({
            subscriptionName: subscription.subscriptionName,
            subscriptionDescription: subscription.subscriptionDescription,
            subscriptionPrice: subscription.subscriptionPrice,
            subscriptionDuration: subscription.subscriptionDuration,
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
        <div className='w-full bg-gray-100 dark:bg-gray-900 flex justify-center min-h-screen p-4 md:p-6'>
            <div className="w-full">
                {/* Breadcrumb */}
                <div className='w-full mb-4'>
                    <Breadcrumb className="mb-4">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <MdHome className='w-4 h-4' />
                                <BreadcrumbLink href="/" className="ml-2 font-semibold text-gray-600 dark:text-gray-300">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <FiChevronRight className="h-4 w-4 text-gray-400" />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbLink className="font-semibold text-gray-600 dark:text-gray-300">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <FiChevronRight className="h-4 w-4 text-gray-400" />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbLink className="font-semibold text-gray-900 dark:text-gray-100">Subscription Management</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start bg-white dark:bg-gray-800 p-5 py-5 border border-gray-200 dark:border-gray-700 shadow-sm rounded-sm md:items-center gap-4">
                        <div>
                            <h1 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Subscription Management</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                Create and manage subscription plans
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={handleRefresh} className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                                <FiRefreshCcw className="mr-2" />
                                Refresh
                            </Button>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
                                        <FiPlus className="mr-2" />
                                        Create Subscription
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="w-11/12 lg:max-w-[1000px] overflow-y-auto max-h-[90vh] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                                    <DialogHeader>
                                        <DialogTitle className="text-gray-900 dark:text-gray-100">
                                            {editingSubscription ? 'Edit Subscription' : 'Create New Subscription'}
                                        </DialogTitle>
                                        <DialogDescription className="text-gray-500 dark:text-gray-400">
                                            Fill in the details for the subscription plan
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="subscriptionName" className="text-gray-700 dark:text-gray-300">Subscription Name</Label>
                                            <Input
                                                id="subscriptionName"
                                                className='py-6 rounded-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100'
                                                {...register('subscriptionName', { required: 'Name is required' })}
                                                placeholder="e.g., Premium Plan"
                                            />
                                            {errors.subscriptionName && (
                                                <p className="text-sm text-red-500 dark:text-red-400">{errors.subscriptionName.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subscriptionDescription" className="text-gray-700 dark:text-gray-300">Description</Label>
                                            <Textarea
                                                id="subscriptionDescription"
                                                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                                                {...register('subscriptionDescription', { required: 'Description is required' })}
                                                placeholder="Describe the subscription plan"
                                            />
                                            {errors.subscriptionDescription && (
                                                <p className="text-sm text-red-500 dark:text-red-400">{errors.subscriptionDescription.message}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="subscriptionPrice" className="text-gray-700 dark:text-gray-300">Price</Label>
                                                <Input
                                                    id="subscriptionPrice"
                                                    type="number"
                                                    className='py-6 rounded-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100'
                                                    {...register('subscriptionPrice', { required: 'Price is required' })}
                                                    placeholder="Enter price"
                                                />
                                                {errors.subscriptionPrice && (
                                                    <p className="text-sm text-red-500 dark:text-red-400">{errors.subscriptionPrice.message}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="subscriptionDuration" className="text-gray-700 dark:text-gray-300">Duration (months)</Label>
                                                <Input
                                                    id="subscriptionDuration"
                                                    type="number"
                                                    className='py-6 rounded-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100'
                                                    {...register('subscriptionDuration', { required: 'Duration is required' })}
                                                    placeholder="Enter duration"
                                                />
                                                {errors.subscriptionDuration && (
                                                    <p className="text-sm text-red-500 dark:text-red-400">{errors.subscriptionDuration.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">Features</Label>
                                                <div className="grid grid-cols-2 gap-3 mt-2">
                                                    {featuresList.map((feature) => (
                                                        <div key={feature} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={feature}
                                                                checked={selectedFeatures.includes(feature)}
                                                                onCheckedChange={() => handleFeatureToggle(feature)}
                                                                className="border-gray-300 dark:border-gray-600"
                                                            />
                                                            <label
                                                                htmlFor={feature}
                                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300"
                                                            >
                                                                {feature}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <Label className="text-base font-semibold text-gray-700 dark:text-gray-300">Access Rights</Label>
                                                <div className="grid grid-cols-2 gap-3 mt-2">
                                                    {accessList.map((access) => (
                                                        <div key={access} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={access}
                                                                checked={selectedAccess.includes(access)}
                                                                onCheckedChange={() => handleAccessToggle(access)}
                                                                className="border-gray-300 dark:border-gray-600"
                                                            />
                                                            <label
                                                                htmlFor={access}
                                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300"
                                                            >
                                                                {access}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <DialogFooter>
                                            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
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
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-gray-900 dark:text-gray-100">Subscription Plans</CardTitle>
                            <CardDescription className="text-gray-500 dark:text-gray-400">
                                Total: <span className="font-semibold text-gray-900 dark:text-gray-100">{subscriptions.length}</span> plans
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b border-gray-200 dark:border-gray-700">
                                            <TableHead className="text-gray-600 dark:text-gray-400">Name</TableHead>
                                            <TableHead className="text-gray-600 dark:text-gray-400">Description</TableHead>
                                            <TableHead className="text-gray-600 dark:text-gray-400">Price</TableHead>
                                            <TableHead className="text-gray-600 dark:text-gray-400">Duration</TableHead>
                                            <TableHead className="text-gray-600 dark:text-gray-400">Features</TableHead>
                                            <TableHead className="text-gray-600 dark:text-gray-400">Access Rights</TableHead>
                                            <TableHead className="text-right text-gray-600 dark:text-gray-400">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {subscriptions.map((subscription) => (
                                            <TableRow key={subscription._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <TableCell className="font-medium text-gray-900 dark:text-gray-100">{subscription.subscriptionName}</TableCell>
                                                <TableCell className="text-gray-700 dark:text-gray-300">{subscription.subscriptionDescription}</TableCell>
                                                <TableCell className="text-gray-700 dark:text-gray-300">${subscription.subscriptionPrice}</TableCell>
                                                <TableCell className="text-gray-700 dark:text-gray-300">{subscription.subscriptionDuration} months</TableCell>
                                                <TableCell>
                                                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                                                        {subscription.subscriptionFeatures.map((feature, index) => (
                                                            <li key={index} className="text-sm">{feature}</li>
                                                        ))}
                                                    </ul>
                                                </TableCell>
                                                <TableCell>
                                                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
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
                                                            className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                        >
                                                            <FiEdit className="h-4 w-4" />
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                                                                >
                                                                    <FiTrash2 className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle className="text-gray-900 dark:text-gray-100">Are you absolutely sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription className="text-gray-500 dark:text-gray-400">
                                                                        This action cannot be undone. This will permanently delete the subscription plan.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction 
                                                                        onClick={() => handleDelete(subscription._id)}
                                                                        className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
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
                        <p className="text-gray-500 dark:text-gray-400">No subscription plans found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriptionManagement;
