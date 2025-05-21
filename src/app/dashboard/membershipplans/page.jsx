'use client';

import { CiUndo } from "react-icons/ci";
import Loader from "@/components/Loader/Loader";
import { FaList } from "react-icons/fa6";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { FiChevronRight, FiTrash2, FiEdit, FiPlus, FiX, FiSave,FiCheck, FiInfo, FiEye, FiLoader } from "react-icons/fi";
import { MdHome } from "react-icons/md";
import toast from "react-hot-toast";

// UI Components
import { Switch } from "@/components/ui/switch";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter
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
import Pagination from "@/components/ui/CustomPagination";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const MembershipPlanManagement = () => {

    // React Hook Form
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

    // Form Data
    const [availableToAllBranches, setAvailableToAllBranches] = useState(false);
    const [availableToClients, setAvailableToClients] = useState(false);
    const [membershipPaymentType, setMembershipPaymentType] = useState("Prepaid");
    const [membershipAccessType, setMembershipAccessType] = useState("General");
    const [membershipShift, setMembershipShift] = useState("Morning");
    const [targetAudience, setTargetAudience] = useState("General");
    const [planStatus, setPlanStatus] = useState(true);
    const [currency, setCurrency] = useState("NPR");

    // Add resetForm function
    const resetForm = () => {
        // Reset form fields
        reset();
        
        // Reset all state variables
        setAvailableToAllBranches(false);
        setAvailableToClients(false);
        setMembershipPaymentType("Prepaid");
        setMembershipAccessType("General");
        setMembershipShift("Morning");
        setTargetAudience("General");
        setPlanStatus(false);
        setCurrency("NPR");
    };

    const onSubmit = async(data) => {
        const {
            name,
            description,
            duration,
            price,
            startTime,
            endTime,
            servicesIncluded,
            customTags,
        } = data;

        // Convert customTags string to array
        const tagsArray = customTags ? customTags.split(',').map(tag => tag.trim()) : [];

        const finalObj = {
            availableForAllBranches: availableToAllBranches,
            availableToClients,
            name,
            description,
            duration: parseInt(duration),
            priceDetails: {
                amount: parseFloat(price),
                currency: currency
            },
            membershipPaymentType,
            membershipShift,
            accessDetails: {
                type: membershipAccessType,
                timeRestrictions: {
                    startTime,
                    endTime
                }
            },
            servicesIncluded: Array.isArray(servicesIncluded) ? servicesIncluded : [servicesIncluded],
            targetAudience,
            isActive: planStatus,
            customTags: tagsArray
        };

        try {
            const response = await fetch("http://localhost:3000/api/membershipplans", {
                method: "POST",
                body: JSON.stringify(finalObj),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const responseBody = await response.json();
            if(responseBody.success){
                toast.success("Membership plan created successfully");
                resetForm(); // Use the new resetForm function instead of just reset()
            } else {
                toast.error(responseBody.message || "Error creating membership plan");
            }
        } catch(error) {
            console.error(error);
            toast.error("Error creating membership plan");
        }
    };

    // Get All Membership Plans
    const getAllMembershipPlans = async ({queryKey}) => {
        try{
            const response = await fetch("http://localhost:3000/api/membershipplans");
            const data = await response.json();
            console.log(data);
            return data;
        } catch(error){
            console.error(error);
            throw error;
        }
    }   

    const { data: membershipPlans, isLoading, error } = useQuery({
        queryKey: ["membershipPlans"],
        queryFn: getAllMembershipPlans
    });

    console.log(membershipPlans);

    return (
        <div className='w-full bg-gray-50 min-h-screen p-4 md:p-6'>
            {/* Breadcrumb with arrows */}
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
                            <BreadcrumbLink className="font-semibold">Membership Plan Management</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex flex-col md:flex-row justify-between items-start bg-white p-4 py-4 border border-gray-200 shadow-sm rounded-md md:items-center gap-4">
                    <div>
                        <h1 className="text-xl font-bold mb-2">Membership Plans Management</h1>
                        <p className="text-xs text-gray-500 font-medium">
                            Create and manage your gym membership plans.
                        </p>
                    </div>
                    <Button className="rounded-sm">
                        <FiPlus className="h-4 w-4 mr-2" />
                        Create Package
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="Create Plans">
                <TabsList className="mb-2 border rounded-sm border-gray-300"> 
                    <TabsTrigger value="View Plans"> <FiEye className="w-4 h-4 mr-2" /> View Plans</TabsTrigger>
                    <TabsTrigger value="Current Plans"> <FaList className="w-4 h-4 mr-2" /> Current Plans</TabsTrigger>
                    <TabsTrigger value="Create Plans"> <FiPlus className="w-4 h-4 mr-2" /> Create Plans</TabsTrigger>
                </TabsList> 

                <TabsContent value="View Plans">  
                    <h1>View Plans</h1>
                </TabsContent>

                <TabsContent value="Current Plans">  
                    <Card className="rounded-xl w-full shadow-md">
                        <CardHeader>
                            <div className='flex justify-between items-center'>
                                <p className='text-md font-bold'>Current Available Plans</p>
                            </div>
                        </CardHeader>
                        <CardContent className='flex flex-col gap-4 justify-center items-center'>
                               
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Create plans tab */}
                <TabsContent value="Create Plans">
                    <div className="lg:flex space-y-4 mt-4 lg:space-y-0 lg:space-x-2 gap-4">
                        {/* Left Card - Settings */}
                        <Card className="rounded-xl w-full lg:w-3/12 shadow-md">
                            <CardHeader>
                                <div className='flex justify-between items-center'>
                                    <p className='text-md font-bold'>Settings</p>
                                </div>
                            </CardHeader>
                            <CardContent className='flex flex-col gap-4 justify-center items-center'>
                                <div className='flex justify-center items-center'>
                                    <h1 className='text-2xl font-bold rounded-full w-32 h-32 bg-green-200 flex justify-center items-center'>
                                        NB
                                    </h1>
                                </div>

                                <div className='flex flex-col mt-4 gap-2 w-full'>
                                    <div className='flex items-center gap-2'>
                                        <div>
                                            <h1 className='text-md font-bold'>All Branches</h1>
                                            <p className='text-xs font-medium text-gray-500'>This plan will be available for all branches.</p>
                                        </div>
                                        <Switch
                                            checked={availableToAllBranches}
                                            onCheckedChange={setAvailableToAllBranches}
                                            className="bg-green-600 text-green-600"
                                        />
                                    </div>
                                </div>

                                <div className='flex flex-col mt-4 gap-2 w-full'>
                                    <div className='flex items-center gap-2'>
                                        <div>
                                            <h1 className='text-md font-bold'>Available To Clients</h1>
                                            <p className='text-xs font-medium text-gray-500'>This plan will be available to clients for viewing and purchasing.</p>
                                        </div>
                                        <Switch
                                            checked={availableToClients}
                                            onCheckedChange={setAvailableToClients}
                                            className="bg-green-600 text-green-600"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Right Card - Form */}
                        <Card className="rounded-xl w-full lg:w-9/12 shadow-md">
                            <CardHeader>
                                <div className='flex justify-between items-center'>
                                    <p className='text-lg font-bold'>New Membership Plan Form</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    {/* Basic Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Plan Name</Label>
                                            <Input
                                                id="name"
                                                className="py-6"
                                                {...register("name", { required: "Plan name is required" })}
                                                placeholder="Enter plan name"
                                            />
                                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                rows={1}
                                                className="py-3"
                                                {...register("description", { required: "Description is required" })}
                                                placeholder="Enter plan description"
                                            />
                                            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                                        </div>
                                    </div>

                                    {/* Duration and Price */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="duration">Duration (in days)</Label>
                                            <Input
                                                id="duration"
                                                type="number"
                                                className="py-6"
                                                {...register("duration", { required: "Duration is required" })}
                                                placeholder="Enter duration"
                                            />
                                            {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="amount">Price Amount</Label>
                                            <Input
                                                id="amount"
                                                type="number"
                                                className="py-6"
                                                {...register("price", { required: "Price is required" })}
                                                placeholder="Enter price"
                                            />
                                            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="paymentType">Payment Type</Label>
                                            <Select onValueChange={(value) => setMembershipPaymentType(value)}>
                                                <SelectTrigger className="py-6 rounded-md">
                                                    <SelectValue placeholder="Select payment type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Prepaid">Prepaid</SelectItem>
                                                    <SelectItem value="Recurring">Recurring</SelectItem>
                                                    <SelectItem value="Installment">Installment</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.paymentType && <p className="text-red-500 text-sm">{errors.paymentType.message}</p>}
                                        </div>
                                    </div>

                                    {/* Access Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="accessType">Access Type</Label>
                                            <Select onValueChange={(value) => setMembershipAccessType(value)}>
                                                <SelectTrigger className="py-6 rounded-md">
                                                    <SelectValue placeholder="Select access type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="General">General</SelectItem>
                                                    <SelectItem value="Gym & Cardio">Gym & Cardio</SelectItem>
                                                    <SelectItem value="Cardio">Cardio</SelectItem>
                                                    <SelectItem value="All Access">All Access</SelectItem>
                                                    <SelectItem value="Time Based">Time Based</SelectItem>
                                                    <SelectItem value="Location Based">Location Based</SelectItem>
                                                    <SelectItem value="Group Classes">Group Classes</SelectItem>
                                                    <SelectItem value="Zumba">Zumba</SelectItem>
                                                    <SelectItem value="Swimming">Swimming</SelectItem>
                                                    <SelectItem value="Sauna">Sauna</SelectItem>
                                                    <SelectItem value="Online Classes">Online Classes</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.accessType && <p className="text-red-500 text-sm">{errors.accessType.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="shift">Shift</Label>
                                            <Select onValueChange={(value) => setMembershipShift(value)}>
                                                <SelectTrigger className="py-6 rounded-md">
                                                    <SelectValue placeholder="Select shift" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Flexible">Flexible</SelectItem>
                                                    <SelectItem value="Morning">Morning</SelectItem>
                                                    <SelectItem value="Daytime">Daytime</SelectItem>
                                                    <SelectItem value="Evening">Evening</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.shift && <p className="text-red-500 text-sm">{errors.shift.message}</p>}
                                        </div>
                                    </div>

                                    {/* Time Restrictions */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="startTime">Start Time</Label>
                                            <Input
                                                id="startTime"
                                                type="time"
                                                className="py-6"
                                                {...register("startTime")}
                                            />
                                            {errors.startTime && <p className="text-red-500 text-sm">{errors.startTime.message}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="endTime">End Time</Label>
                                            <Input
                                                id="endTime"
                                                type="time"
                                                className="py-6"
                                                {...register("endTime")}
                                            />
                                            {errors.endTime && <p className="text-red-500 text-sm">{errors.endTime.message}</p>}
                                        </div>
                                    </div>

                                    {/* Services Included */}
                                    <div className="space-y-2">
                                        <Label>Services Included</Label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {[
                                                'Gym',
                                                'Gym & Cardio',
                                                'Cardio',
                                                'Group Classes',
                                                'Personal Training',
                                                'Swimming',
                                                'Sauna',
                                                'Online Classes',
                                                'Locker'
                                            ].map((service) => (
                                                <div key={service} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id={service}
                                                        {...register("servicesIncluded", { required: "Services included is required" })}
                                                        value={service}
                                                        className="w-5 h-5 rounded border-gray-300"
                                                    />
                                                    <Label htmlFor={service} className="text-base">{service}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Target Audience */}
                                    <div className="space-y-2">
                                        <Label htmlFor="targetAudience">Target Audience</Label>
                                        <Select onValueChange={(value) => setTargetAudience(value)}>
                                            <SelectTrigger className="py-6 rounded-md">
                                                <SelectValue placeholder="Select target audience" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="General">General</SelectItem>
                                                <SelectItem value="Student">Student</SelectItem>
                                                <SelectItem value="Senior">Senior</SelectItem>
                                                <SelectItem value="Corporate">Corporate</SelectItem>
                                                <SelectItem value="Couple">Couple</SelectItem>
                                                <SelectItem value="Family">Family</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="isActive"
                                            checked={planStatus}
                                            onCheckedChange={setPlanStatus}
                                            defaultChecked
                                        />
                                        <Label htmlFor="isActive">Active Plan</Label>
                                    </div>

                                    {/* Custom Tags */}
                                    <div className="space-y-2">
                                        <Label htmlFor="customTags">Custom Tags (comma-separated)</Label>
                                        <Input
                                            id="customTags"
                                            className="py-6"
                                            {...register("customTags")}
                                            placeholder="Enter tags separated by commas"
                                        />
                                    </div>

                                    {/* Add Currency Selection */}
                                    <div className="space-y-2">
                                        <Label htmlFor="currency">Currency</Label>
                                        <Select 
                                            onValueChange={(value) => setCurrency(value)}
                                            defaultValue="NPR"
                                        >
                                            <SelectTrigger className="py-6 rounded-md">
                                                <SelectValue placeholder="Select currency" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="NPR">NPR</SelectItem>
                                                <SelectItem value="USD">USD</SelectItem>
                                                <SelectItem value="EUR">EUR</SelectItem>
                                                <SelectItem value="INR">INR</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex justify-end space-x-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={resetForm}
                                        >
                                            Reset
                                        </Button>
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? <FiLoader className="w-4 h-4 mr-2 animate-spin" />: <FiSave className="w-4 h-4 mr-2" />}
                                            {isSubmitting ? "Creating..." : "Create Plan"}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default MembershipPlanManagement;
