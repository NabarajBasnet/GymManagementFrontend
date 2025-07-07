"use client";

import { MdSettings, MdCardMembership } from "react-icons/md";
import {
    ChevronRight,
} from "lucide-react";
import Pagination from "@/components/ui/CustomPagination.jsx";
import Loader from "@/components/Loader/Loader";
import { FaList } from "react-icons/fa6";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
    FiChevronRight,
    FiTrash2,
    FiEdit,
    FiPlus,
    FiX,
    FiSave,
    FiCheck,
    FiInfo,
    FiEye,
    FiLoader,
    FiFilter,
    FiRefreshCcw,
} from "react-icons/fi";
import toast from "react-hot-toast";

// UI Components
import { Switch } from "@/components/ui/switch";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectLabel,
    SelectGroup,
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
import { useUser } from "@/components/Providers/LoggedInUserProvider.jsx";

const MembershipPlanManagement = () => {
    // React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
    } = useForm();

    const { user, loading } = useUser();
    const checkMultiBranchSupport = user?.user?.companyBranch;

    const [tabValue, setTabValue] = useState("Current Plans");
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);

    const queryClient = useQueryClient();

    // Form Data
    const [availableToAllBranches, setAvailableToAllBranches] = useState(false);
    const [membershipPaymentType, setMembershipPaymentType] = useState();
    const [membershipShift, setMembershipShift] = useState();
    const [planStatus, setPlanStatus] = useState(false);

    const [selectedBranches, setSelectedBranches] = useState([]);
    const [allSelected, setAllSelected] = useState(false);

    const handleCheckboxChange = (branchId) => {
        if (allSelected) return;

        setSelectedBranches((prev) => {
            const updated = prev.includes(branchId)
                ? prev.filter((id) => id !== branchId)
                : [...prev, branchId];

            setValue("servicesIncluded", updated);
            return updated;
        });
    };

    const handleSwitchToggle = (checked) => {
        setAllSelected(checked);
        if (checked) {
            const all = branches.map((b) => b._id);
            setSelectedBranches(all);
            setValue("servicesIncluded", all);
        } else {
            setSelectedBranches([]);
            setValue("servicesIncluded", []);
        }
    };

    const getUserRelatedBranch = async () => {
        try {
            const response = await fetch(
                `https://fitbinary.com/api/gymbranch/tenant/${user?.user?.company?._id}`
            );
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
            toastMessage.error(error.message);
        }
    };

    const { data: userRelatedBranch } = useQuery({
        queryKey: ["userRelatedBranch"],
        queryFn: getUserRelatedBranch,
        enabled: !!user?.user?.company?._id,
    });

    const { branches } = userRelatedBranch || {};

    // Add resetForm function
    const resetForm = () => {
        // Reset form fields
        reset();
        // Reset all state variables
        setAvailableToAllBranches(false);
        setMembershipPaymentType();
        setMembershipShift();
        setPlanStatus(false);
        setAllSelected(false);
        setSelectedBranches([]);
    };

    const onSubmit = async (data) => {
        const { planName, duration, price, startTime, endTime, servicesIncluded } =
            data;

        const finalObj = {
            companyBranch: selectedBranches,
            planName,
            duration,
            price,
            membershipPaymentType,
            membershipShift,
            servicesIncluded: Array.isArray(servicesIncluded)
                ? servicesIncluded
                : [servicesIncluded],
            timeRestriction: { startTime, endTime },
            planStatus,
        };

        try {
            const url = isEditMode
                ? `https://fitbinary.com/api/membershipplans/${editingPlan._id}`
                : "https://fitbinary.com/api/membershipplans";

            const method = isEditMode ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                body: JSON.stringify(finalObj),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const responseBody = await response.json();
            if (responseBody.success || responseBody._id) {
                toast.success(
                    isEditMode
                        ? "Membership plan updated successfully"
                        : "Membership plan created successfully"
                );
                resetForm();
                setTabValue("Current Plans");
                setIsEditMode(false);
                setEditingPlan(null);
                queryClient.invalidateQueries(["membershipPlans"]);
            } else {
                toast.error(
                    responseBody.message ||
                    `Error ${isEditMode ? "updating" : "creating"} membership plan`
                );
            }
        } catch (error) {
            console.error(error);
            toast.error(
                `Error ${isEditMode ? "updating" : "creating"} membership plan`
            );
        }
    };

    // Add function to handle edit button click
    const handleEditClick = (plan) => {
        setIsEditMode(true);
        setEditingPlan(plan);
        setTabValue("Create Plans");

        // Set form values
        reset({
            planName: plan.planName,
            duration: plan.duration,
            price: plan.price,
            startTime: plan.timeRestriction?.startTime || "",
            endTime: plan.timeRestriction?.endTime || "",
            servicesIncluded: plan.servicesIncluded,
        });

        // Set state values
        setAvailableToAllBranches(plan.companyBranch);
        setMembershipPaymentType(plan.membershipPaymentType);
        setMembershipShift(plan.membershipShift);
        setPlanStatus(plan.planStatus);
        if (plan?.companyBranch?.length === branches?.length) {
            setAllSelected(true);
        }
        setSelectedBranches(plan.companyBranch);
    };

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 6;

    // Filter and search plans
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

    const [filterByPaymentType, setFilterByPaymentType] = useState("");
    const [filterByStatus, setFilterByStatus] = useState("");
    const [filterByAccessType, setFilterByAccessType] = useState("");
    const [filterByShift, setFilterByShift] = useState("");

    // Debounce search query
    useEffect(() => {
        const delayInputTimeoutId = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 400);
        return () => clearTimeout(delayInputTimeoutId);
    }, [searchQuery]);

    // Get All Membership Plans
    const getAllMembershipPlans = async ({ queryKey }) => {
        const [
            ,
            page,
            searchQuery,
            filterByPaymentType,
            filterByStatus,
            filterByAccessType,
            filterByShift,
            filterByCurrency,
        ] = queryKey;
        try {
            const response = await fetch(
                `https://fitbinary.com/api/membershipplans?page=${page}&limit=${limit}&search=${searchQuery}&paymentType=${filterByPaymentType}&status=${filterByStatus}&accessType=${filterByAccessType}&shift=${filterByShift}&currency=${filterByCurrency}`
            );
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const { data, isLoading, error } = useQuery({
        queryKey: [
            "membershipPlans",
            currentPage,
            debouncedSearchQuery,
            filterByPaymentType,
            filterByStatus,
            filterByAccessType,
            filterByShift,
        ],
        queryFn: getAllMembershipPlans,
    });

    const { membershipPlans, totalPages, totalDocuments } = data || {};

    const deleteMembershipPlan = async (id) => {
        try {
            const response = await fetch(
                `https://fitbinary.com/api/membershipplans/${id}`,
                {
                    method: "DELETE",
                }
            );
            const responseBody = await response.json();
            if (response.ok) {
                toast.success(responseBody.message);
                queryClient.invalidateQueries(["membershipPlans"]);
            } else {
                toast.error(responseBody.message || "Error deleting membership plan");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error deleting membership plan");
        }
    };

    return (
        <div className="w-full bg-gray-50 dark:bg-gray-900 min-h-screen p-4">
            {/* Breadcrumb with arrows */}
            <div className="w-full mb-4">
                <div className="flex flex-col space-y-3 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                            <MdCardMembership className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Membership Plans
                            </h1>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Portal
                                </span>
                                <ChevronRight className="w-4 h-4 mx-2" />
                                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Client Area
                                </span>
                                <ChevronRight className="w-4 h-4 mx-2" />
                                <span className="text-blue-600 dark:text-blue-400 font-medium">
                                    Membership Plans
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Tabs value={tabValue} onValueChange={setTabValue}>
                <TabsList className="mb-2 border border-gray-300 dark:border-gray-700 p-2 rounded-sm dark:bg-gray-800">
                    <TabsTrigger value="Current Plans">
                        {" "}
                        <FaList className="w-4 h-4 mr-2" /> Current Plans
                    </TabsTrigger>
                    <TabsTrigger value="Create Plans">
                        {" "}
                        <FiPlus className="w-4 h-4 mr-2" /> Create Plans
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="Current Plans">
                    <div className="space-y-4">
                        {/* Filter Card */}
                        <Card className="rounded-xl shadow-md border border-gray-100 dark:bg-gray-800 dark:border-none">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-2 justify-between">
                                    <div className="flex items-center gap-2">
                                        <FiFilter className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                                        <h3 className="text-lg font-bold">
                                            Search and Filter Plans
                                        </h3>
                                    </div>

                                    <Button
                                        variant="destructive"
                                        className="text-xs dark:bg-red-600 hover:dark:bg-red-700"
                                        onClick={() => {
                                            setSearchQuery("");
                                            setFilterByPaymentType("");
                                            setFilterByStatus("");
                                            setFilterByAccessType("");
                                            setFilterByShift("");
                                        }}
                                    >
                                        <FiRefreshCcw className="w-4 h-4 mr-2" />
                                        Reset
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                    {/* Payment Type Filter */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Search</Label>
                                        <Input
                                            className="rounded-sm py-6 dark:bg-gray-900 dark:border-none"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            type="text"
                                            placeholder="Search by name"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Payment Type</Label>
                                        <Select
                                            onValueChange={(value) => setFilterByPaymentType(value)}
                                        >
                                            <SelectTrigger className="py-6 rounded-sm dark:border-none dark:bg-gray-900">
                                                <SelectValue placeholder="All Types" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    value="all"
                                                    className="cursor-pointer hover:bg-blue-500"
                                                >
                                                    All Types
                                                </SelectItem>
                                                <SelectItem
                                                    value="Prepaid"
                                                    className="cursor-pointer hover:bg-blue-500"
                                                >
                                                    Prepaid
                                                </SelectItem>
                                                <SelectItem
                                                    value="Recurring"
                                                    className="cursor-pointer hover:bg-blue-500"
                                                >
                                                    Recurring
                                                </SelectItem>
                                                <SelectItem
                                                    value="Installment"
                                                    className="cursor-pointer hover:bg-blue-500"
                                                >
                                                    Installment
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Status Filter */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Status</Label>
                                        <Select onValueChange={(value) => setFilterByStatus(value)}>
                                            <SelectTrigger className="py-6 rounded-sm dark:border-none dark:bg-gray-900">
                                                <SelectValue placeholder="All Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    value="all"
                                                    className="cursor-pointer hover:bg-blue-500"
                                                >
                                                    All Status
                                                </SelectItem>
                                                <SelectItem
                                                    value="Active"
                                                    className="cursor-pointer hover:bg-blue-500"
                                                >
                                                    Active
                                                </SelectItem>
                                                <SelectItem
                                                    value="Inactive"
                                                    className="cursor-pointer hover:bg-blue-500"
                                                >
                                                    Inactive
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Access Type Filter */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Features</Label>
                                        <Select
                                            onValueChange={(value) => setFilterByAccessType(value)}
                                        >
                                            <SelectTrigger className="py-6 rounded-sm dark:border-none dark:bg-gray-900">
                                                <SelectValue placeholder="All Access" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    value="all"
                                                    className="cursor-pointer hover:bg-blue-500"
                                                >
                                                    All Access
                                                </SelectItem>
                                                <SelectItem
                                                    value="Gym"
                                                    className="cursor-pointer hover:bg-blue-500"
                                                >
                                                    Gym
                                                </SelectItem>
                                                <SelectItem
                                                    value="Gym & Cardio"
                                                    className="cursor-pointer hover:bg-blue-500"
                                                >
                                                    Gym & Cardio
                                                </SelectItem>
                                                <SelectItem
                                                    value="Cardio"
                                                    className="cursor-pointer hover:bg-blue-500"
                                                >
                                                    Cardio
                                                </SelectItem>
                                                <SelectItem
                                                    value="All Access"
                                                    className="cursor-pointer hover:bg-blue-500"
                                                >
                                                    All Access
                                                </SelectItem>
                                                <SelectItem
                                                    value="Time Based"
                                                    className="cursor-pointer hover:bg-blue-500"
                                                >
                                                    Time Based
                                                </SelectItem>
                                                <SelectItem
                                                    value="Group Classes"
                                                    className="cursor-pointer hover:bg-blue-500"
                                                >
                                                    Group Classes
                                                </SelectItem>
                                                <SelectItem
                                                    value="Zumba"
                                                    className="cursor-pointer hover:bg-blue-500"
                                                >
                                                    Zumba
                                                </SelectItem>
                                                <SelectItem
                                                    value="Swimming"
                                                    className="cursor-pointer hover:bg-blue-500"
                                                >
                                                    Swimming
                                                </SelectItem>
                                                <SelectItem
                                                    value="Sauna"
                                                    className="cursor-pointer hover:bg-blue-500"
                                                >
                                                    Sauna
                                                </SelectItem>
                                                <SelectItem
                                                    value="Online Classes"
                                                    className="cursor-pointer hover:bg-blue-500"
                                                >
                                                    Online Classes
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Shift Filter */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Shift</Label>
                                        <Select onValueChange={(value) => setFilterByShift(value)}>
                                            <SelectTrigger className="py-6 rounded-sm dark:border-none dark:bg-gray-900">
                                                <SelectValue placeholder="All Shifts" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    value="all"
                                                    className="cursor-pointer hover:bg-blue-500"
                                                >
                                                    All Shifts
                                                </SelectItem>
                                                <SelectItem
                                                    value="Morning"
                                                    className="cursor-pointer hover:bg-blue-500"
                                                >
                                                    Morning
                                                </SelectItem>
                                                <SelectItem
                                                    value="Daytime"
                                                    className="cursor-pointer hover:bg-blue-500"
                                                >
                                                    Daytime
                                                </SelectItem>
                                                <SelectItem
                                                    value="Evening"
                                                    className="cursor-pointer hover:bg-blue-500"
                                                >
                                                    Evening
                                                </SelectItem>
                                                <SelectItem
                                                    value="Flexible"
                                                    className="cursor-pointer hover:bg-blue-500"
                                                >
                                                    Flexible
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Plans Grid */}
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {isLoading ? (
                                <div className="col-span-full flex justify-center py-8">
                                    <Loader />
                                </div>
                            ) : Array.isArray(membershipPlans) &&
                                membershipPlans.length > 0 ? (
                                membershipPlans.map((plan) => (
                                    <Card
                                        key={plan._id}
                                        className="relative dark:bg-gray-800 dark:border-none dark:text-gray-200 overflow-hidden hover:shadow-lg cursor-pointer transition-all duration-300 border border-gray-200 group"
                                    >
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start gap-2">
                                                <div>
                                                    <h3 className="text-base font-semibold line-clamp-1">
                                                        {plan.planName}
                                                    </h3>
                                                </div>
                                                <Badge
                                                    variant={plan.planStatus ? "success" : "destructive"}
                                                    className="text-xs"
                                                >
                                                    {plan.planStatus ? "Active" : "Inactive"}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-2.5">
                                            {/* Price Details */}
                                            <div className="flex justify-between border items-center bg-gray-50 dark:bg-gray-900 dark:border-none py-4 px-4 rounded-sm">
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                    Price
                                                </span>
                                                <span className="font-semibold text-sm">
                                                    {plan.price}
                                                </span>
                                            </div>

                                            {/* Duration */}
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600 dark:text-gray-300">
                                                    Duration
                                                </span>
                                                <span className="font-medium">
                                                    {plan.duration} days
                                                </span>
                                            </div>

                                            {/* Access Details */}
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-600 dark:text-gray-300">
                                                        Timing
                                                    </span>
                                                </div>
                                                {plan.timeRestriction && (
                                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                                        <span className="dark:text-gray-300 text-gray-600">
                                                            Time
                                                        </span>
                                                        <span className="dark:text-gray-300 text-gray-600">
                                                            {plan.timeRestriction.startTime} -{" "}
                                                            {plan.timeRestriction.endTime}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Services */}
                                            <div>
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                                    Services
                                                </span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {plan.servicesIncluded.map((service, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="default"
                                                            className="text-xs py-1 px-2"
                                                        >
                                                            {service}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Additional Details */}
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div>
                                                    <span className="text-gray-600 dark:text-gray-300">
                                                        Payment
                                                    </span>
                                                    <p className="font-medium">
                                                        {plan.membershipPaymentType}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600 dark:text-gray-300">
                                                        Shift
                                                    </span>
                                                    <p className="font-medium">{plan.membershipShift}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                className="text-sm dark:border-none"
                                                onClick={() => handleEditClick(plan)}
                                            >
                                                <FiEdit className="w-3 h-3 mr-1" />
                                                Edit
                                            </Button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        size="lg"
                                                        className="text-sm dark:border-none dark:bg-red-600"
                                                    >
                                                        <FiTrash2 className="w-3 h-3 mr-1" />
                                                        Delete
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="dark:bg-gray-900 dark:border-none">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="dark:text-white">
                                                            Are you absolutely sure?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription className="dark:text-gray-300">
                                                            This action cannot be undone. This will
                                                            permanently delete your membership plan.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="dark:bg-gray-900 dark:hover:bg-gray-800 transition-all duration-500 dark:border-none dark:text-white">
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => deleteMembershipPlan(plan._id)}
                                                            className="bg-red-500 text-white hover:bg-red-600 dark:border-none transition-all duration-500"
                                                        >
                                                            Continue
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </CardFooter>
                                    </Card>
                                ))
                            ) : (
                                <Card className="col-span-full py-14 dark:bg-gray-800 dark:border-none">
                                    <CardHeader>
                                        <CardTitle>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                                                No plans found
                                            </p>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex justify-center">
                                        <Button
                                            onClick={() => setTabValue("Create Plans")}
                                            className=" rounded-sm"
                                        >
                                            <FiPlus className="w-4 h-4 mr-2" />
                                            Create Plan
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Pagination */}
                        <div className="w-full lg:flex justify-center lg:justify-between items-center">
                            <p className="text-xs font-medium text-gray-500 text-center md:text-left my-3 lg:my-0">
                                Showing {totalDocuments} membership out of {totalDocuments}{" "}
                                pages
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
                </TabsContent>

                <TabsContent value="Create Plans">
                    <div className="lg:flex space-y-4 mt-4 lg:space-y-0 lg:space-x-2 gap-4">
                        {/* Left Card - Settings */}
                        <Card className="rounded-xl w-full lg:w-3/12 shadow-md dark:bg-gray-800 dark:border-none">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <p className="text-md font-bold">Settings</p>
                                </div>
                            </CardHeader>
                            <CardContent className="w-full flex flex-col gap-4 justify-center items-center">
                                <div className="flex justify-center items-center">
                                    <h1 className="text-2xl font-bold dark:text-black rounded-full w-32 h-32 bg-green-200 flex justify-center items-center">
                                        N/A
                                    </h1>
                                </div>

                                {/* Status */}
                                <div className="flex flex-col items-center space-y-2">
                                    <Label htmlFor="isActive">Active Plan</Label>
                                    <Switch
                                        id="isActive"
                                        checked={planStatus}
                                        onCheckedChange={setPlanStatus}
                                        defaultChecked
                                    />
                                </div>

                                {/* Branch selection */}
                                {loading ? (
                                    <Loader />
                                ) : (
                                    <div>
                                        {checkMultiBranchSupport && (
                                            <div>
                                                <div className="space-y-2 md:mt-2">
                                                    <div className="flex items-center justify-center md:justify-start space-x-2 mb-8">
                                                        <Switch
                                                            id="allBranches"
                                                            checked={allSelected}
                                                            onCheckedChange={handleSwitchToggle}
                                                        />
                                                        <Label htmlFor="allBranches">
                                                            Available to All Branches
                                                        </Label>
                                                    </div>

                                                    <div className="grid grid-cols-3 md:grid-cols-1 mt-2 gap-4">
                                                        {branches?.map((branch) => (
                                                            <div
                                                                key={branch._id}
                                                                className="flex items-center justify-center md:justify-start space-x-2"
                                                            >
                                                                <Input
                                                                    type="checkbox"
                                                                    id={branch._id}
                                                                    value={branch._id}
                                                                    checked={selectedBranches.includes(
                                                                        branch._id
                                                                    )}
                                                                    onChange={() =>
                                                                        handleCheckboxChange(branch._id)
                                                                    }
                                                                    disabled={allSelected}
                                                                    className="w-5 h-5 rounded border-gray-300"
                                                                />
                                                                <Label
                                                                    htmlFor={branch._id}
                                                                    className="text-base"
                                                                >
                                                                    {branch.gymBranchName}
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Right Card - Form */}
                        <Card className="rounded-xl w-full lg:w-9/12 shadow-md dark:bg-gray-800 dark:border-none">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-bold">
                                        {isEditMode
                                            ? "Edit Membership Plan"
                                            : "New Membership Plan Form"}
                                    </p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    {/* Basic Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Plan Name</Label>
                                            <Input
                                                id="planName"
                                                className="py-6 rounded-sm dark:bg-gray-900 dark:border-none"
                                                {...register("planName", {
                                                    required: "Plan name is required",
                                                })}
                                                placeholder="Enter plan name"
                                            />
                                            {errors.planName && (
                                                <p className="text-red-500 text-sm">
                                                    {errors.planName.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="duration">Duration (in days)</Label>
                                            <Input
                                                id="duration"
                                                type="number"
                                                className="py-6 rounded-sm dark:bg-gray-900 dark:border-none"
                                                {...register("duration", {
                                                    required: "Duration is required",
                                                })}
                                                placeholder="Enter duration"
                                            />
                                            {errors.duration && (
                                                <p className="text-red-500 text-sm">
                                                    {errors.duration.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Duration and Price */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="amount">Price Amount</Label>
                                            <Input
                                                id="amount"
                                                type="number"
                                                className="py-6 rounded-sm dark:bg-gray-900 dark:border-none"
                                                {...register("price", {
                                                    required: "Price is required",
                                                })}
                                                placeholder="Enter price"
                                            />
                                            {errors.price && (
                                                <p className="text-red-500 text-sm">
                                                    {errors.price.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="paymentType">Payment Type</Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    setMembershipPaymentType(value)
                                                }
                                                value={membershipPaymentType}
                                            >
                                                <SelectTrigger className="py-6 rounded-sm dark:bg-gray-900 dark:border-none">
                                                    <SelectValue
                                                        placeholder={
                                                            membershipPaymentType || "Select payment type"
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Select Shift</SelectLabel>
                                                        <SelectItem
                                                            value="Prepaid"
                                                            className="hover:bg-blue-600 cursor-pointer"
                                                        >
                                                            Prepaid
                                                        </SelectItem>
                                                        <SelectItem
                                                            value="Recurring"
                                                            className="hover:bg-blue-600 cursor-pointer"
                                                        >
                                                            Recurring
                                                        </SelectItem>
                                                        <SelectItem
                                                            value="Installment"
                                                            className="hover:bg-blue-600 cursor-pointer"
                                                        >
                                                            Installment
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            {errors.paymentType && (
                                                <p className="text-red-500 text-sm">
                                                    {errors.paymentType.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Shift */}
                                        <div className="space-y-2">
                                            <Label htmlFor="shift">Shift</Label>
                                            <Select
                                                onValueChange={(value) => setMembershipShift(value)}
                                                value={membershipShift}
                                            >
                                                <SelectTrigger className="py-6 rounded-sm dark:bg-gray-900 dark:border-none">
                                                    <SelectValue
                                                        placeholder={membershipShift || "Select shift"}
                                                    />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-sm">
                                                    <SelectGroup>
                                                        <SelectLabel>Select Shift</SelectLabel>
                                                        <SelectItem
                                                            value="Flexible"
                                                            className="hover:bg-blue-600 cursor-pointer"
                                                        >
                                                            Flexible
                                                        </SelectItem>
                                                        <SelectItem
                                                            value="Morning"
                                                            className="hover:bg-blue-600 cursor-pointer"
                                                        >
                                                            Morning
                                                        </SelectItem>
                                                        <SelectItem
                                                            value="Daytime"
                                                            className="hover:bg-blue-600 cursor-pointer"
                                                        >
                                                            Daytime
                                                        </SelectItem>
                                                        <SelectItem
                                                            value="Evening"
                                                            className="hover:bg-blue-600 cursor-pointer"
                                                        >
                                                            Evening
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            {errors.shift && (
                                                <p className="text-red-500 text-sm">
                                                    {errors.shift.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Time Restrictions */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="startTime">Start Time</Label>
                                                <Input
                                                    id="startTime"
                                                    type="time"
                                                    className="py-6 rounded-sm dark:bg-gray-900 dark:border-none"
                                                    {...register("startTime")}
                                                />
                                                {errors.startTime && (
                                                    <p className="text-red-500 text-sm">
                                                        {errors.startTime.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="endTime">End Time</Label>
                                                <Input
                                                    id="endTime"
                                                    type="time"
                                                    className="py-6 rounded-sm dark:bg-gray-900 dark:border-none"
                                                    {...register("endTime")}
                                                />
                                                {errors.endTime && (
                                                    <p className="text-red-500 text-sm">
                                                        {errors.endTime.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Services Included */}
                                    <div className="space-y-2 md:mt-2">
                                        <Label>Services Included</Label>
                                        <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
                                            {[
                                                "Gym",
                                                "Gym & Cardio",
                                                "Cardio",
                                                "Group Classes",
                                                "Swimming",
                                                "Sauna",
                                                "Steam",
                                                "Online Classes",
                                                "Shower",
                                                "Locker",
                                            ].map((service) => (
                                                <div
                                                    key={service}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        id={service}
                                                        {...register("servicesIncluded", {
                                                            required: "Services included is required",
                                                        })}
                                                        value={service}
                                                        className="w-5 h-5 rounded border-gray-300"
                                                    />
                                                    <Label htmlFor={service} className="text-base">
                                                        {service}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="dark:border-none dark:hover:bg-gray-900"
                                            onClick={() => {
                                                resetForm();
                                                if (isEditMode) {
                                                    setIsEditMode(false);
                                                    setEditingPlan(null);
                                                    setTabValue("Current Plans");
                                                }
                                            }}
                                        >
                                            {isEditMode ? "Cancel" : "Reset"}
                                        </Button>
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <FiSave className="w-4 h-4 mr-2" />
                                            )}
                                            {isSubmitting
                                                ? isEditMode
                                                    ? "Updating..."
                                                    : "Creating..."
                                                : isEditMode
                                                    ? "Update Plan"
                                                    : "Create Plan"}
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
