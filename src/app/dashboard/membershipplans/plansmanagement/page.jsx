"use client";

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
import { MdHome } from "react-icons/md";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

const MembershipPlanManagement = () => {
  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const [tabValue, setTabValue] = useState("Current Plans");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const queryClient = useQueryClient();

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

  const onSubmit = async (data) => {
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
    const tagsArray = customTags
      ? customTags.split(",").map((tag) => tag.trim())
      : [];

    const finalObj = {
      availableForAllBranches: availableToAllBranches,
      availableToClients,
      name,
      description,
      duration: parseInt(duration),
      priceDetails: {
        amount: parseFloat(price),
        currency: currency,
      },
      membershipPaymentType,
      membershipShift,
      accessDetails: {
        type: membershipAccessType,
        timeRestrictions: {
          startTime,
          endTime,
        },
      },
      servicesIncluded: Array.isArray(servicesIncluded)
        ? servicesIncluded
        : [servicesIncluded],
      targetAudience,
      isActive: planStatus,
      customTags: tagsArray,
    };

    try {
      const url = isEditMode
        ? `http://localhost:3000/api/membershipplans/${editingPlan._id}`
        : "http://localhost:3000/api/membershipplans";

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
        queryClient.invalidateQueries({ queryKey: ["membershipPlans"] });
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
      name: plan.name,
      description: plan.description,
      duration: plan.duration,
      price: plan.priceDetails.amount,
      startTime: plan.accessDetails.timeRestrictions?.startTime || "",
      endTime: plan.accessDetails.timeRestrictions?.endTime || "",
      servicesIncluded: plan.servicesIncluded,
      customTags: plan.customTags?.join(", ") || "",
    });

    // Set state values
    setAvailableToAllBranches(plan.availableForAllBranches);
    setAvailableToClients(plan.availableToClients);
    setMembershipPaymentType(plan.membershipPaymentType);
    setMembershipAccessType(plan.accessDetails.type);
    setMembershipShift(plan.membershipShift);
    setTargetAudience(plan.targetAudience);
    setPlanStatus(plan.isActive);
    setCurrency(plan.priceDetails.currency);
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
  const [filterByCurrency, setFilterByCurrency] = useState("");

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
        `http://localhost:3000/api/membershipplans?page=${page}&limit=${limit}&search=${searchQuery}&paymentType=${filterByPaymentType}&status=${filterByStatus}&accessType=${filterByAccessType}&shift=${filterByShift}&currency=${filterByCurrency}`
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
      filterByCurrency,
    ],
    queryFn: getAllMembershipPlans,
  });

  const { membershipPlans, totalPages, totalDocuments } = data || {};

  const deleteMembershipPlan = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/membershipplans/${id}`,
        {
          method: "DELETE",
        }
      );
      const responseBody = await response.json();
      if (response.ok) {
        toast.success(responseBody.message);
        queryClient.invalidateQueries({ queryKey: ["membershipPlans"] });
      } else {
        toast.error(responseBody.message || "Error deleting membership plan");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting membership plan");
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen p-4 md:p-6">
      {/* Breadcrumb with arrows */}
      <div className="w-full mb-4">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <MdHome className="w-4 h-4" />
              <BreadcrumbLink href="/" className="ml-2 font-semibold">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <FiChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink className="font-semibold">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <FiChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink className="font-semibold">
                Membership Plan Management
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row justify-between items-start bg-white p-4 py-4 border border-gray-200 shadow-sm rounded-md md:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold mb-2">
              Membership Plans Management
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Create and manage your gym membership plans.
            </p>
          </div>
          <Button
            className="rounded-sm"
            onClick={() => setTabValue("Create Plans")}
          >
            <FiPlus className="h-4 w-4 mr-2" />
            Create Package
          </Button>
        </div>
      </div>

      <Tabs value={tabValue} onValueChange={setTabValue}>
        <TabsList className="mb-2 border rounded-sm border-gray-300">
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
            <Card className="rounded-xl shadow-md border border-gray-100">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <FiFilter className="w-5 h-5 text-gray-500" />
                    <h3 className="text-lg font-bold">
                      Search and Filter Plans
                    </h3>
                  </div>

                  <Button
                    variant="destructive"
                    className="text-xs"
                    onClick={() => {
                      setSearchQuery("");
                      setFilterByPaymentType("");
                      setFilterByStatus("");
                      setFilterByAccessType("");
                      setFilterByShift("");
                      setFilterByCurrency("");
                    }}
                  >
                    <FiRefreshCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  {/* Payment Type Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Search</Label>
                    <Input
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
                      <SelectTrigger className="h-9 rounded-md">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Prepaid">Prepaid</SelectItem>
                        <SelectItem value="Recurring">Recurring</SelectItem>
                        <SelectItem value="Installment">Installment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Status</Label>
                    <Select onValueChange={(value) => setFilterByStatus(value)}>
                      <SelectTrigger className="h-9 rounded-md">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Access Type Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Access Type</Label>
                    <Select
                      onValueChange={(value) => setFilterByAccessType(value)}
                    >
                      <SelectTrigger className="h-9 rounded-md">
                        <SelectValue placeholder="All Access" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Access</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Gym & Cardio">
                          Gym & Cardio
                        </SelectItem>
                        <SelectItem value="Cardio">Cardio</SelectItem>
                        <SelectItem value="All Access">All Access</SelectItem>
                        <SelectItem value="Time Based">Time Based</SelectItem>
                        <SelectItem value="Location Based">
                          Location Based
                        </SelectItem>
                        <SelectItem value="Group Classes">
                          Group Classes
                        </SelectItem>
                        <SelectItem value="Zumba">Zumba</SelectItem>
                        <SelectItem value="Swimming">Swimming</SelectItem>
                        <SelectItem value="Sauna">Sauna</SelectItem>
                        <SelectItem value="Online Classes">
                          Online Classes
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Shift Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Shift</Label>
                    <Select onValueChange={(value) => setFilterByShift(value)}>
                      <SelectTrigger className="h-9 rounded-md">
                        <SelectValue placeholder="All Shifts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Shifts</SelectItem>
                        <SelectItem value="Morning">Morning</SelectItem>
                        <SelectItem value="Daytime">Daytime</SelectItem>
                        <SelectItem value="Evening">Evening</SelectItem>
                        <SelectItem value="Flexible">Flexible</SelectItem>
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
                    className="relative overflow-hidden hover:shadow-lg cursor-pointer transition-all duration-300 border border-gray-200 group"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="text-base font-semibold line-clamp-1">
                            {plan.name}
                          </h3>
                          <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                            {plan.description}
                          </p>
                        </div>
                        <Badge
                          variant={plan.isActive ? "success" : "destructive"}
                          className="text-xs"
                        >
                          {plan.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2.5">
                      {/* Price Details */}
                      <div className="flex justify-between border items-center bg-gray-50 p-2 rounded-md">
                        <span className="text-xs font-medium text-gray-600">
                          Price
                        </span>
                        <span className="font-semibold text-sm">
                          {plan.priceDetails.amount}{" "}
                          {plan.priceDetails.currency}
                        </span>
                      </div>

                      {/* Duration */}
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Duration</span>
                        <span className="font-medium">
                          {plan.duration} days
                        </span>
                      </div>

                      {/* Access Details */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Access</span>
                          <span className="font-medium">
                            {plan.accessDetails.type}
                          </span>
                        </div>
                        {plan.accessDetails.timeRestrictions && (
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>Time</span>
                            <span>
                              {plan.accessDetails.timeRestrictions.startTime} -{" "}
                              {plan.accessDetails.timeRestrictions.endTime}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Services */}
                      <div>
                        <span className="text-xs font-medium text-gray-600">
                          Services
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {plan.servicesIncluded.map((service, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-[10px] py-0"
                            >
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Payment</span>
                          <p className="font-medium">
                            {plan.membershipPaymentType}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Shift</span>
                          <p className="font-medium">{plan.membershipShift}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Target</span>
                          <p className="font-medium">{plan.targetAudience}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Available</span>
                          <p className="font-medium">
                            {plan.availableToClients
                              ? "To Clients"
                              : "Internal"}
                          </p>
                        </div>
                      </div>

                      {/* Tags */}
                      {plan.customTags && plan.customTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {plan.customTags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-[10px] py-0"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => handleEditClick(plan)}
                      >
                        <FiEdit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 text-xs"
                          >
                            <FiTrash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your membership plan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMembershipPlan(plan._id)}
                              className="bg-red-500 text-white"
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
                <Card className="col-span-full">
                  <CardHeader>
                    <CardTitle>
                      <p className="text-gray-500 text-sm text-center py-8">
                        No plans found
                      </p>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <Button onClick={() => setTabValue("Create Plans")}>
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
            <Card className="rounded-xl w-full lg:w-3/12 shadow-md">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <p className="text-md font-bold">Settings</p>
                </div>
              </CardHeader>
              <CardContent className="w-full flex flex-col gap-4 justify-center items-center">
                <div className="flex justify-center items-center">
                  <h1 className="text-2xl font-bold rounded-full w-32 h-32 bg-green-200 flex justify-center items-center">
                    NB
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
                <div className="space-y-2 md:mt-2">
                  <Label>Select Company Branch</Label>
                  <div className="grid grid-cols-3 md:grid-cols-1 gap-4">
                    {[
                      "Gym",
                      "Gym & Cardio",
                      "Cardio",
                      "Group Classes",
                      "Swimming",
                      "Sauna",
                      "Steam",
                      "Online Classes",
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
              </CardContent>
            </Card>

            {/* Right Card - Form */}
            <Card className="rounded-xl w-full lg:w-9/12 shadow-md">
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
                        className="py-6 rounded-sm"
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
                        className="py-6 rounded-sm"
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
                        className="py-6 rounded-sm"
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
                        <SelectTrigger className="py-6 rounded-sm">
                          <SelectValue
                            placeholder={
                              membershipPaymentType || "Select payment type"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Prepaid">Prepaid</SelectItem>
                          <SelectItem value="Recurring">Recurring</SelectItem>
                          <SelectItem value="Installment">
                            Installment
                          </SelectItem>
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
                        <SelectTrigger className="py-6 rounded-sm">
                          <SelectValue
                            placeholder={membershipShift || "Select shift"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Flexible">Flexible</SelectItem>
                          <SelectItem value="Morning">Morning</SelectItem>
                          <SelectItem value="Daytime">Daytime</SelectItem>
                          <SelectItem value="Evening">Evening</SelectItem>
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
                          className="py-6 rounded-sm"
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
                          className="py-6 rounded-sm"
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
