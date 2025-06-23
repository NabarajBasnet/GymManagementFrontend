'use client';

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FiChevronRight, FiTrash2, FiEdit, FiPlus, FiRefreshCcw } from "react-icons/fi";
import { MdHome } from "react-icons/md";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";

// UI Components
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Badge
} from "@/components/ui/badge";
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

const currencies = [
    {
        name: "USD",
        symbol: "$",
    },
    {
        name: "NPR",
        symbol: "₨",
    },
    {
        name: "INR",
        symbol: "₹",
    },
    {
        name: "AUD",
        symbol: "A$",
    },
    {
        name: "CAD",
        symbol: "C$",
    },
]
const SubscriptionManagement = () => {

    const queryClient = useQueryClient();

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
    const [selectedCurrency, setSelectedCurrency] = useState();

    // Fetch all subscriptions
    const { data: subscriptions, isLoading } = useQuery({
        queryKey: ['subscriptions'],
        queryFn: async () => {
            const response = await fetch('http://88.198.112.156:8000/api/subscription/getall');
            const data = await response.json();
            return data.subscriptions;
        }
    });

    const featuresList = [
        "Attendance Management",
        "Locker Management",
        "Attendance Report",
        "Membership Analytics",
        "Staff Management",
        "Multi Branch Support",
        "Class Booking",
        "Personal Training",
        "Billing & Invoicing",
        "Equipment Management",
        "Progress Tracking",
        "Customer Support",
        "Customizable Features",
        "API Integration",
        "Email Notifications",
        "Multi-Language Support",    
        "Analytics & Reporting",
        "Member Web Portal",
        "Payment Gateway Integration",
        "Backup & Recovery",
        "Scheduled Maintenance",
        "AI Integration",
    ];

    const handleFeatureToggle = (feature) => {
        setSelectedFeatures(prev => 
            prev.includes(feature)
                ? prev.filter(f => f !== feature)
                : [...prev, feature]
        );
    };

    const onSubmit = async (data) => {
        try {
            const url = editingSubscription 
                ? `http://88.198.112.156:8000/api/subscription/update/${editingSubscription._id}`
                : 'http://88.198.112.156:8000/api/subscription/create';
            
            const method = editingSubscription ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    subscriptionPrice: Number(data.subscriptionPrice),
                    currency: selectedCurrency,
                    subscriptionFeatures: selectedFeatures
                }),
            });

            const responseData = await response.json();

            if (response.ok) {
                toast.success(responseData.message);
                setIsDialogOpen(false);
                reset();
                setSelectedFeatures([]);
                setEditingSubscription(null);
                queryClient.invalidateQueries(['subscriptions']);
            } else {
                toast.error(responseData.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const handleEdit = (subscription) => {
        setEditingSubscription(subscription);
        setSelectedFeatures(subscription.subscriptionFeatures);
        reset({
            subscriptionName: subscription.subscriptionName,
            subscriptionDescription: subscription.subscriptionDescription,
            subscriptionPrice: subscription.subscriptionPrice,
            currency: subscription.currency,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://88.198.112.156:8000/api/subscription/delete/${id}`, {
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

    return (
        <div className='w-full bg-gray-50 dark:bg-gray-900 flex justify-center min-h-screen p-4 md:p-6'>
            <div className="w-full max-w-7xl">
                {/* Breadcrumb */}
                <div className='w-full mb-6'>
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Subscription Management</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                Create and manage subscription plans for your gym
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button 
                                variant="outline" 
                                onClick={handleRefresh} 
                                className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <FiRefreshCcw className="mr-2" />
                                Refresh
                            </Button>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-blue-600 dark:text-gray-100 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
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
                                                <Label htmlFor="currency" className="text-gray-700 dark:text-gray-300">
                                                    Currency
                                                </Label>
                                                <Select onValueChange={(value) => setSelectedCurrency(value)}>
                                                    <SelectTrigger className="bg-white py-6 rounded-sm dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                                                    <SelectValue placeholder="Select a currency" />
                                                    </SelectTrigger>

                                                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                                                    {currencies.map((currency) => (
                                                        <SelectItem
                                                        key={currency.symbol}
                                                        className="text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-blue-900/30"
                                                        value={currency.symbol}
                                                        >
                                                        {currency.name} ({currency.symbol})
                                                        </SelectItem>
                                                    ))}
                                                    </SelectContent>
                                                </Select>

                                                {errors.currency && (
                                                    <p className="text-sm text-red-500 dark:text-red-400">
                                                    {errors.currency.message}
                                                    </p>
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
                                        </div>

                                        <DialogFooter>
                                            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 dark:text-gray-100 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subscriptions.map((subscription) => (
                            <Card key={subscription._id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                                <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                                {subscription.subscriptionName}
                                            </CardTitle>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {subscription.subscriptionDescription}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(subscription)}
                                                className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                <FiEdit className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="bg-red-600 dark:text-gray-100 dark:border-none hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                                                    >
                                                        <FiTrash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="bg-red-900 border-red-600">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription className="text-white dark:text-white">
                                                            This action cannot be undone. This will permanently delete the subscription plan.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="border-gray-200 dark:border-none border-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Cancel</AlertDialogCancel>
                                                        <AlertDialogAction 
                                                            onClick={() => handleDelete(subscription._id)}
                                                            className="bg-red-600 dark:text-gray-100 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                                                        >
                                                            Continue
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 flex-grow flex flex-col">
                                    <div className="space-y-6 flex-grow">
                                        {/* Price and Duration */}
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                                    {subscription.currency} {subscription.subscriptionPrice}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Per {subscription.subscriptionDuration} Year
                                                </p>
                                            </div>
                                            <Badge variant="green" className="text-white">
                                                Active
                                            </Badge>
                                        </div>

                                        {/* Features */}
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                                Features
                                            </h4>
                                            <div className="grid grid-cols-1 gap-2">
                                                {subscription.subscriptionFeatures.map((feature, index) => (
                                                    <div key={index} className="flex items-center text-sm">
                                                        <Check className="h-4 w-4 text-green-500 mr-2" />
                                                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats Footer - Always at bottom */}
                                    <div className="grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Purchased By</p>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                {subscription.purchasedBy?.length || 0}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                {new Date(subscription.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
                        <div className="text-center">
                            <FiPlus className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400 mb-2">No subscription plans found</h3>
                            <p className="text-gray-400 dark:text-gray-500 mb-6">Create your first subscription plan to get started</p>
                            <Button 
                                onClick={() => setIsDialogOpen(true)}
                                className="bg-blue-600 dark:text-gray-100 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                            >
                                <FiPlus className="mr-2" />
                                Create Subscription
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriptionManagement;
