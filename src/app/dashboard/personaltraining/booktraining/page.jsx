'use client';

import { ArrowUpDown } from 'lucide-react';
import { CiUndo } from "react-icons/ci";
import Loader from "@/components/Loader/Loader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { FiChevronRight, FiTrash2, FiEdit, FiLoader, FiEye, FiSearch, FiPlus, FiX, FiCheck, FiInfo, FiHelpCircle, FiCreditCard, FiBarChart, FiSettings, FiBell, FiSave, FiRefreshCw } from "react-icons/fi";
import { MdHome } from "react-icons/md";
import toast from "react-hot-toast";

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
import { Switch } from "@/components/ui/switch";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
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
import Pagination from "@/components/ui/CustomPagination";
import { useUser } from '@/components/Providers/LoggedInUserProvider';

const PersonalTrainingBooking = () => {

  // Query
  const queryClient = useQueryClient();

  // React hooks
  const ref = useRef(null);

  // Custom Hooks
  const { user } = useUser();
  const loggedInUser = user?.user;

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control
  } = useForm();

  // Pagination, filters and search
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Form States and data
  const [tabValue, setTabValue] = useState('View Bookings');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [isEndDateAuto, setIsEndDateAuto] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packagePrice, setPackagePrice] = useState(0);
  const [packageId, setPackageId] = useState('');
  const [memberId, setMemberId] = useState('');
  const [trainerId, setTrainerId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [status, setPackageStatus] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [discount, setDiscount] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [sendEmailNotification, setSendEmailNotification] = useState(false);
  const [sendPaymentInfo, setSendPaymentInfo] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');

  // Add new state for edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Calculate total amount when price or discount changes

  useEffect(() => {
    if (!isEditMode) {
      const total = packagePrice - (Number(discount) || 0);
      setTotalAmount(total);
    }
  }, [packagePrice, discount, isEditMode]);

  // Auto adjust end date
  useEffect(() => {
    if (startDate && selectedPackage?.duration && isEndDateAuto) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + selectedPackage.duration);
      setEndDate(end.toISOString().split('T')[0]);
      setPackagePrice(selectedPackage.price);
    }
  }, [startDate, selectedPackage, isEndDateAuto]);

  // Update the getTrainingDetails function
  const getTrainingDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/personaltraining/${id}`);
      const { personalTraining } = await response.json();

      if (response.ok && personalTraining) {
        // Populate form with fetched data
        setSelectedPackage(personalTraining.packageId);
        setPackagePrice(personalTraining.packageId.price);
        setPackageId(personalTraining.packageId._id);
        setMemberId(personalTraining.memberId._id);
        setTrainerId(personalTraining.trainerId._id);
        setBranchId(personalTraining.branchId);
        setPackageStatus(personalTraining.status);
        setStartDate(new Date(personalTraining.startDate).toISOString().split('T')[0]);
        setEndDate(new Date(personalTraining.endDate).toISOString().split('T')[0]);
        setPaidAmount(personalTraining.paidAmount);
        setDiscount(personalTraining.discount);
        setTotalAmount(personalTraining.totalAmount);
        setSendEmailNotification(personalTraining.sendEmailNotification);
        setSendPaymentInfo(personalTraining.sendPaymentInfo);
        setPaymentStatus(personalTraining.paymentStatus);
        setMemberName(personalTraining.memberId.fullName);
        setStaffName(personalTraining.trainerId.fullName);
        setPackageName(personalTraining?.packageId?.packagename || '');

        // Set form values using react-hook-form
        reset({
          paidAmount: personalTraining.paidAmount,
          discount: personalTraining.discount,
          registerBy: personalTraining.registerBy
        });

        setIsEditMode(true);
        setEditId(id);
      } else {
        toast.error("Failed to fetch training details");
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Failed to fetch training details");
    }
  };

  // Modify the handleEditTraining function
  const handleEditTraining = (id) => {
    getTrainingDetails(id);
    setTabValue('Register Training');
  };

  // Modify the onSubmit function to handle both create and update
  const onSubmit = async (data) => {
    const { paidAmount, discount, totalAmount, registerBy } = data;

    const finalData = {
      sendEmailNotification,
      sendPaymentInfo,
      trainerId,
      memberId,
      packageId,
      status,
      startDate,
      endDate,
      paidAmount: Number(paidAmount),
      discount: Number(discount),
      totalAmount: Number(totalAmount),
      registerBy,
      branchId,
      paymentStatus
    }

    try {
      const url = isEditMode
        ? `http://localhost:3000/api/personaltraining/${editId}`
        : 'http://localhost:3000/api/personaltraining';

      const method = isEditMode ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(finalData)
      });

      const responseBody = await response.json();

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['personalTrainingBookings'] });
        toast.success(responseBody.message);

        // Reset form and states
        reset();
        setSelectedPackage(null);
        setPackagePrice(0);
        setMemberName('');
        setStaffName('');
        setPackageName('');
        setMemberSearchQuery('');
        setStaffSearchQuery('');
        setPackageSearchQuery('');
        setPaymentStatus('');
        setPackageStatus('');
        setSendEmailNotification(false);
        setSendPaymentInfo(false);
        setBranchId('');
        setStartDate(new Date().toISOString().split('T')[0]);
        setEndDate(new Date().toISOString().split('T')[0]);
        setPaidAmount('');
        setDiscount('');
        setTotalAmount('');
        setPackageId('');
        setMemberId('');
        setTrainerId('');
        setBranchId('');

        // Reset edit mode
        setIsEditMode(false);
        setEditId(null);

        // Switch back to View Bookings tab
        setTabValue('View Bookings');
      } else {
        toast.error(responseBody.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Add reset form function
  const handleResetForm = () => {
    reset();
    setSelectedPackage(null);
    setPackagePrice(0);
    setMemberName('');
    setStaffName('');
    setPackageName('');
    setMemberSearchQuery('');
    setStaffSearchQuery('');
    setPackageSearchQuery('');
    setPaymentStatus('');
    setPackageStatus('');
    setSendEmailNotification(false);
    setSendPaymentInfo(false);
    setBranchId('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date().toISOString().split('T')[0]);
    setPaidAmount('');
    setDiscount('');
    setTotalAmount('');
    setPackageId('');
    setMemberId('');
    setTrainerId('');
    setBranchId('');
    setIsEditMode(false);
    setEditId(null);
  };

  // Debounce package search
  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(delayInputTimeoutId);
  }, [search]);

  // Search states
  // Member search states
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [memberName, setMemberName] = useState('');
  const [renderMemberDropdown, setRenderMemberDropdown] = useState(false);
  const memberSearchRef = useRef(null);

  // Staff search states
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [staffName, setStaffName] = useState('');
  const [renderStaffDropdown, setRenderStaffDropdown] = useState(false);
  const staffSearchRef = useRef(null);

  //  Package search states
  const [packageSearchQuery, setPackageSearchQuery] = useState('');
  const [packageName, setPackageName] = useState('');
  const [renderPackageDropdown, setRenderPackageDropdown] = useState(false);
  const packageSearchRef = useRef(null);

  // Handle click outside for all dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (memberSearchRef.current && !memberSearchRef.current.contains(event.target)) {
        setRenderMemberDropdown(false);
      }
      if (staffSearchRef.current && !staffSearchRef.current.contains(event.target)) {
        setRenderStaffDropdown(false);
      }
      if (packageSearchRef.current && !packageSearchRef.current.contains(event.target)) {
        setRenderPackageDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [memberSearchRef, staffSearchRef, packageSearchRef]);

  const handleMemberSearchFocus = () => {
    setRenderMemberDropdown(true);
  };

  const handleStaffSearchFocus = () => {
    setRenderStaffDropdown(true);
  };

  const handlePackageSearchFocus = () => {
    setRenderPackageDropdown(true);
  };

  // Get all staffs
  const getAllTrainers = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/staffsmanagement`);
      const responseBody = await response.json();
      return responseBody;
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Failed to fetch staffs");
      return { staffs: [] };
    }
  };

  const { data: trainersData, isLoading: staffsLoading } = useQuery({
    queryKey: ['trainers'],
    queryFn: getAllTrainers
  });
  const { staffs = [] } = trainersData || {};

  // Get all members
  const getAllMembers = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/members`);
      const responseBody = await response.json();
      return responseBody;
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Failed to fetch members");
      return { members: [] };
    }
  };

  const { data: membersData, isLoading: membersLoading } = useQuery({
    queryKey: ['members'],
    queryFn: getAllMembers
  });
  const { members = [] } = membersData || {};

  // Get all packages
  const getAllPackages = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/personaltraining/packages`);
      const responseBody = await response.json();
      return responseBody;
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Failed to fetch packages");
      return { packages: [] };
    }
  };

  const { data: packagesData, isLoading: packagesLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: getAllPackages
  });
  const { packages = [] } = packagesData || {};

  // Debounce search trainings
  const [serachTraining, setSearchTraining] = useState('');
  const [debouncedSearchTraining, setDebouncedSearchTraining] = useState('');
  // Sorting States
  const [sortBy, setSortBy] = useState('');
  const [sortOrderDesc, setSortOrderDesc] = useState(true);


  useEffect(() => {
    const searchTrainingTimerId = setTimeout(() => {
      setDebouncedSearchTraining(serachTraining);
    }, 300);
    return () => clearTimeout(searchTrainingTimerId);
  }, [serachTraining]);


  // Get all personal training bookings
  const getAllPersonalTrainingBookings = async ({ queryKey }) => {
    const [, page, status, paymentStatus, search, sortBy, sortOrderDesc] = queryKey;
    try {
      const response = await fetch(`http://localhost:3000/api/personaltraining?page=${page}&limit=${limit}&status=${status}&paymentStatus=${paymentStatus}&search=${search}&sortBy=${sortBy}&sortOrderDesc=${sortOrderDesc}`);
      const responseBody = await response.json();
      return responseBody;
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Failed to fetch personal training bookings");
      return { personalTrainingBookings: [] };
    }
  };

  const { data: personalTrainingBookingsData, isLoading: personalTrainingBookingsLoading } = useQuery({
    queryKey: ['personalTrainingBookings', currentPage, status, paymentStatus, debouncedSearchTraining, sortBy, sortOrderDesc],
    queryFn: getAllPersonalTrainingBookings
  });
  const { personalTrainings = [], totalPersonalTrainings, totalPages } = personalTrainingBookingsData || {};

  // Delete personal training booking
  const deletePersonalTrainingBooking = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/personaltraining/${id}`, {
        method: 'DELETE'
      });
      const responseBody = await response.json();
      if (response.ok) {
        toast.success(responseBody.message);
        queryClient.invalidateQueries({ queryKey: ['personalTrainingBookings'] });
      } else {
        toast.error(responseBody.message);
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Failed to delete personal training booking");
    }
  };

  // Add this function near the top of the component
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Full Paid':
        return 'bg-green-100 text-green-800';
      case 'Partial Paid':
        return 'bg-blue-100 text-blue-800';
      case 'Unpaid':
        return 'bg-red-100 text-red-800';
      case 'Refunded':
        return 'bg-purple-100 text-purple-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Add this function near the top of the component, after getPaymentStatusColor
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'border-green-200 text-green-800 bg-green-200 px-4 py-1';
      case 'Inactive':
        return 'border-gray-200 text-gray-800 bg-gray-200 px-4 py-1';
      case 'Cancelled':
        return 'border-red-200 text-red-800 bg-red-200 px-4 py-1';
      case 'Completed':
        return 'border-blue-200 text-blue-800 bg-blue-200 px-4 py-1';
      case 'Pending':
        return 'border-yellow-200 text-yellow-800 bg-yellow-200 px-4 py-1';
      case 'Refunded':
        return 'border-purple-200 text-purple-800 bg-purple-200 px-4 py-1';
      case 'Expired':
        return 'border-gray-200 text-gray-800 bg-gray-200 px-4 py-1';
      default:
        return 'border-none text-gray-800 bg-transparent';
    }
  };

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
              <BreadcrumbLink className="font-semibold">Personal Training</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <FiChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink className="font-semibold">Booking</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row justify-between items-start bg-white p-4 py-6 border border-gray-200 shadow-sm rounded-md md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Personal Training Bookings</h1>
            <p className="text-sm text-gray-500">
              Register and manage your personal training bookings.
            </p>
          </div>
          <Button
            className="rounded-sm"
            onClick={() => setTabValue('Register Training')}
          >
            <FiPlus className="h-4 w-4 mr-2" />
            Book Training
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
        <TabsList className="flex w-full overflow-x-auto lg:grid lg:grid-cols-6 border border-gray-300 overflow-y-hidden">
          <TabsTrigger value="View Bookings" className="whitespace-nowrap">
            <span><FiEye className="h-4 w-4 lg:mr-2" /></span>
            <span className="hidden md:inline">View Bookings</span>
          </TabsTrigger>
          <TabsTrigger value="Register Training" className="whitespace-nowrap">
            <FiPlus className="h-4 w-4 lg:mr-2" />
            <span className="hidden md:inline">Register Training</span>
          </TabsTrigger>
          <TabsTrigger value="Reports" className="whitespace-nowrap">
            <FiBarChart className="h-4 w-4 lg:mr-2" />
            <span className="hidden md:inline">Reports</span>
          </TabsTrigger>
          <TabsTrigger value="Settings" className="whitespace-nowrap">
            <FiSettings className="h-4 w-4 lg:mr-2" />
            <span className="hidden md:inline">Settings</span>
          </TabsTrigger>
          <TabsTrigger value="Notifications" className="whitespace-nowrap">
            <FiBell className="h-4 w-4 lg:mr-2" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="Support" className="whitespace-nowrap">
            <FiHelpCircle className="h-4 w-4 lg:mr-2" />
            <span className="hidden md:inline">Support</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="View Bookings">
          {/* Filter Section */}
          <Card className="my-2">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="search">Search</Label>
                  <Input
                    value={serachTraining}
                    onChange={(e) => setSearchTraining(e.target.value)}
                    id="search"
                    placeholder="Search here..."
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select onValueChange={(value) => setPackageStatus(value)}>
                    <SelectTrigger className="rounded-md">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Refunded">Refunded</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="paymentStatus">Payment Status</Label>
                  <Select onValueChange={(value) => setPaymentStatus(value)}>
                    <SelectTrigger className="rounded-md">
                      <SelectValue placeholder="Filter by payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Full Paid">Full Paid</SelectItem>
                      <SelectItem value="Unpaid">Unpaid</SelectItem>
                      <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Refunded">Refunded</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSearch('');
                      setPackageStatus('');
                      setPaymentStatus('');
                    }}
                  >
                    <CiUndo className="h-5 w-5 mr-2" />
                    Reset Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">All Bookings</CardTitle>
              <CardDescription className="text-xs text-gray-500 font-medium">
                Showing {personalTrainings?.length} training sessions out of {totalPersonalTrainings} total training sessions
              </CardDescription>
            </CardHeader>

            {/* Table Section */}
            <CardContent className="space-y-2">
              <div className="overflow-x-auto rounded-lg border">
                {personalTrainingBookingsLoading ? (
                  <Loader />
                ) : (
                  <>
                    {Array.isArray(personalTrainings) && personalTrainings.length > 0 ? (
                      <Table>
                        <TableHeader className="bg-gray-50">
                          <TableRow className="whitespace-nowrap">
                            {/* Trainer Name */}
                            <TableHead className="py-3 cursor-pointer">
                              <div className="flex items-center gap-1">
                                Trainer Name
                                <ArrowUpDown
                                  onClick={() => {
                                    setSortBy('trainerName');
                                    setSortOrderDesc(!sortOrderDesc);
                                  }}
                                  className="w-4 h-4 flex-shrink-0" />
                              </div>
                            </TableHead>

                            {/* Client Name */}
                            <TableHead className="py-3 cursor-pointer">
                              <div className="flex items-center gap-1">
                                Client Name
                                <ArrowUpDown
                                  onClick={() => {
                                    setSortBy('clientName');
                                    setSortOrderDesc(!sortOrderDesc);
                                  }}
                                  className="w-4 h-4 flex-shrink-0" />
                              </div>
                            </TableHead>

                            {/* Package */}
                            <TableHead className="py-3 cursor-pointer">
                              <div className="flex items-center gap-1">
                                Package
                                <ArrowUpDown
                                  onClick={() => {
                                    setSortBy('package');
                                    setSortOrderDesc(!sortOrderDesc);
                                  }}
                                  className="w-4 h-4 flex-shrink-0" />
                              </div>
                            </TableHead>

                            {/* Start Date */}
                            <TableHead className="py-3 cursor-pointer">
                              <div className="flex items-center gap-1">
                                Start Date
                                <ArrowUpDown
                                  onClick={() => {
                                    setSortBy('startDate');
                                    setSortOrderDesc(!sortOrderDesc);
                                  }}
                                  className="w-4 h-4 flex-shrink-0" />
                              </div>
                            </TableHead>

                            {/* End Date */}
                            <TableHead className="py-3 cursor-pointe">
                              <div className="flex items-center gap-1">
                                End Date
                                <ArrowUpDown
                                  onClick={() => {
                                    setSortBy('endDate');
                                    setSortOrderDesc(!sortOrderDesc);
                                  }}
                                  className="w-4 h-4 flex-shrink-0" />
                              </div>
                            </TableHead>

                            {/* Status */}
                            <TableHead className="py-3 cursor-pointer">
                              <div className="flex items-center gap-1">
                                Status
                                <ArrowUpDown
                                  onClick={() => {
                                    setSortBy('status');
                                    setSortOrderDesc(!sortOrderDesc);
                                  }}
                                  className="w-4 h-4 flex-shrink-0" />
                              </div>
                            </TableHead>

                            {/* Total Amount */}
                            <TableHead className="py-3 cursor-pointer">
                              <div className="flex items-center gap-1">
                                Total Amount
                                <ArrowUpDown
                                  onClick={() => {
                                    setSortBy('totalAmount');
                                    setSortOrderDesc(!sortOrderDesc);
                                  }}
                                  className="w-4 h-4 flex-shrink-0" />
                              </div>
                            </TableHead>

                            {/* Branch */}
                            <TableHead className="py-3 cursor-pointer">
                              <div className="flex items-center gap-1">
                                Branch
                                <ArrowUpDown
                                  onClick={() => {
                                    setSortBy('branch');
                                    setSortOrderDesc(!sortOrderDesc);
                                  }}
                                  className="w-4 h-4 flex-shrink-0" />
                              </div>
                            </TableHead>

                            {/* Payment Status */}
                            <TableHead className="py-3 cursor-pointer">
                              <div className="flex items-center gap-1">
                                Payment Status
                                <ArrowUpDown
                                  onClick={() => {
                                    setSortBy('paymentStatus');
                                    setSortOrderDesc(!sortOrderDesc);
                                  }}
                                  className="w-4 h-4 flex-shrink-0" />
                              </div>
                            </TableHead>

                            {/* Actions */}
                            <TableHead className="py-3 text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {personalTrainings.map((personalTraining) => (
                            <TableRow key={personalTraining._id}>
                              <TableCell className="py-3">{personalTraining.trainerId.fullName}</TableCell>
                              <TableCell className="py-3">{personalTraining.memberId.fullName}</TableCell>
                              <TableCell className="py-3">{personalTraining?.packageId?.packagename}</TableCell>
                              <TableCell className="py-3">{new Date(personalTraining.startDate).toISOString().split('T')[0]}</TableCell>
                              <TableCell className="py-3">{new Date(personalTraining.endDate).toISOString().split('T')[0]}</TableCell>
                              <TableCell className="py-3">
                                <Badge variant="outline" className={getStatusColor(personalTraining.status)}>
                                  {personalTraining.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center py-3">${personalTraining.totalAmount}</TableCell>
                              <TableCell className="py-3">{personalTraining.branchId}</TableCell>
                              <TableCell className="py-3">
                                <Badge className={`${getPaymentStatusColor(personalTraining.paymentStatus)} text-center hover:bg-transparent`}>
                                  {personalTraining.paymentStatus}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-3 text-right space-x-1">
                                <Button
                                  onClick={() => handleEditTraining(personalTraining._id)}
                                  variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <FiEdit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                                    >
                                      <FiTrash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your training session.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => deletePersonalTrainingBooking(personalTraining._id)} className="bg-red-600 hover:bg-red-700">
                                        Continue
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="flex justify-center items-center h-full py-8">
                        <p className="text-gray-500 text-sm font-medium">No personal training bookings found</p>
                      </div>
                    )}
                  </>
                )}

              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-medium">{personalTrainings?.length}</span> of <span className="font-medium">{totalPersonalTrainings}</span> training sessions
                </p>
                <Pagination
                  total={totalPages}
                  page={currentPage}
                  onChange={setCurrentPage}
                  withEdges={true}
                  siblings={1}
                  boundaries={1}
                  className="justify-center sm:justify-end"
                />
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="Register Training">
          <div className="lg:flex space-y-4 mt-4 lg:space-y-0 lg:space-x-2 gap-4">
            <Card className="rounded-xl w-full lg:w-3/12">
              <CardHeader>
                <div className='flex justify-between items-center'>
                  <p className='text-lg font-bold'>{isEditMode ? 'Edit Training' : 'New Training'}</p>
                  <Badge className={getStatusColor(status)}>
                    {status || 'New'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='flex flex-col gap-4 justify-center items-center'>
                <div className='flex justify-center items-center'>
                  <h1 className='text-2xl font-bold rounded-full w-32 h-32 bg-green-200 flex justify-center items-center'>
                    {loggedInUser ? `${loggedInUser.firstName.charAt(0)}${loggedInUser.lastName.charAt(0)}`.toUpperCase() : ''}
                  </h1>
                </div>

                <div className='flex flex-col mt-4 gap-2'>
                  <div className='flex items-center gap-2'>
                    <div>
                      <h1 className='text-lg font-bold'>Email Notification</h1>
                      <p className='text-xs font-medium text-gray-500'>Send email notifications to the client when a training session is booked.</p>
                    </div>
                    <Switch
                      checked={sendEmailNotification}
                      onCheckedChange={(checked) => setSendEmailNotification(checked)}
                      className="bg-green-600 text-green-600"
                    />
                  </div>
                </div>

                <div className='flex flex-col mt-4 gap-2'>
                  <div className='flex items-center gap-2'>
                    <div>
                      <h1 className='text-lg font-bold'>Send Payment Information</h1>
                      <p className='text-xs font-medium text-gray-500'>Send payment information to the client when a training session is booked.</p>
                    </div>
                    <Switch
                      checked={sendPaymentInfo}
                      onCheckedChange={(checked) => setSendPaymentInfo(checked)}
                      className="bg-green-600 text-green-600"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
              </CardFooter>
            </Card>

            <Card className="rounded-xl w-full lg:my-2 lg:w-9/12">
              <CardContent className="space-y-2">
                <form onSubmit={handleSubmit(onSubmit)} className="px-2 space-y-4 py-6">

                  {/* First Row */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <div className='space-y-1.5'>
                        <Label className="block text-sm font-medium mb-1.5 text-gray-700">Select Trainer</Label>
                        <div ref={staffSearchRef} className="relative">
                          <Controller
                            name="staffName"
                            control={control}
                            render={({ field }) => (
                              <div className="relative">
                                <Input
                                  {...field}
                                  autoComplete="off"
                                  value={staffName || staffSearchQuery}
                                  onChange={(e) => {
                                    setStaffSearchQuery(e.target.value);
                                    field.onChange(e);
                                    setStaffName('');
                                  }}
                                  onFocus={handleStaffSearchFocus}
                                  className="w-full p-6 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm p-6 pl-10"
                                  placeholder="Search staff..."
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                  <FiSearch className="h-5 w-5" />
                                </div>
                              </div>
                            )}
                          />
                          {errors.staffName && (
                            <p className="mt-1.5 text-sm font-medium text-red-600">
                              {errors.staffName.message}
                            </p>
                          )}

                          {renderStaffDropdown && (
                            <div className="absolute w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto z-20 top-full left-0 mt-1">
                              {staffs?.length > 0 ? (
                                staffs
                                  .filter((staff) => {
                                    return staff.fullName
                                      .toLowerCase()
                                      .includes(staffSearchQuery.toLowerCase());
                                  })
                                  .map((staff) => (
                                    <div
                                      onClick={() => {
                                        setStaffName(staff.fullName);
                                        setStaffSearchQuery(staff.fullName);
                                        setTrainerId(staff._id);
                                        setRenderStaffDropdown(false);
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
                    <div className='space-y-1.5'>
                      <Label className="block text-sm font-medium text-gray-700">Select Member</Label>
                      <div ref={memberSearchRef} className="relative">
                        <Controller
                          name="memberName"
                          control={control}
                          render={({ field }) => (
                            <div className="relative">
                              <Input
                                {...field}
                                autoComplete="off"
                                value={memberName || memberSearchQuery}
                                onChange={(e) => {
                                  setMemberSearchQuery(e.target.value);
                                  field.onChange(e);
                                  setMemberName('');
                                }}
                                onFocus={handleMemberSearchFocus}
                                className="w-full p-6 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm pl-10"
                                placeholder="Search members..."
                              />
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <FiSearch className="h-5 w-5" />
                              </div>
                            </div>
                          )}
                        />
                        {errors.memberName && (
                          <p className="mt-1.5 text-sm font-medium text-red-600">
                            {errors.memberName.message}
                          </p>
                        )}

                        {renderMemberDropdown && (
                          <div className="absolute w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto z-20 top-full left-0 mt-1">
                            {members?.length > 0 ? (
                              members
                                .filter((member) => {
                                  return member.fullName
                                    .toLowerCase()
                                    .includes(memberSearchQuery.toLowerCase());
                                })
                                .map((member) => (
                                  <div
                                    onClick={() => {
                                      setMemberName(member.fullName);
                                      setMemberSearchQuery(member.fullName);
                                      setMemberId(member._id);
                                      setRenderMemberDropdown(false);
                                    }}
                                    className="px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors"
                                    key={member._id}
                                  >
                                    {member.fullName}
                                  </div>
                                ))
                            ) : (
                              <div className="px-4 py-3 text-sm text-gray-500">{membersLoading ? 'Loading...' : 'No members found'}</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Second Row */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-1.5'>
                      <Label className="block text-sm font-medium mb-1.5 text-gray-700">Select Package</Label>
                      <div ref={packageSearchRef} className="relative">
                        <Controller
                          name="packageName"
                          control={control}
                          render={({ field }) => (
                            <div className="relative">
                              <Input
                                {...field}
                                autoComplete="off"
                                value={packageName || packageSearchQuery}
                                onChange={(e) => {
                                  setPackageSearchQuery(e.target.value);
                                  field.onChange(e);
                                  setPackageName('');
                                }}
                                onFocus={handlePackageSearchFocus}
                                className="w-full p-6 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm p-6 pl-10"
                                placeholder="Search package..."
                              />
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <FiSearch className="h-5 w-5" />
                              </div>
                            </div>
                          )}
                        />
                        {errors.packageName && (
                          <p className="mt-1.5 text-sm font-medium text-red-600">
                            {errors.packageName.message}
                          </p>
                        )}

                        {renderPackageDropdown && (
                          <div className="absolute w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto z-20 top-full left-0 mt-1">
                            {packagesLoading ? (
                              <div className="px-4 py-3 text-sm text-gray-500">Loading packages...</div>
                            ) : packages.length > 0 ? (
                              packages
                                .filter((pkg) => {
                                  return pkg.packagename && pkg.packagename.toLowerCase().includes(packageSearchQuery.toLowerCase());
                                })
                                .map((pkg) => (
                                  <div
                                    onClick={() => {
                                      setSelectedPackage(pkg);
                                      setPackageName(pkg.packagename);
                                      setPackageSearchQuery(pkg.packagename);
                                      setPackageId(pkg._id);
                                      setRenderPackageDropdown(false);
                                    }}
                                    className="px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors"
                                    key={pkg._id}
                                  >
                                    {pkg.packagename} - ${pkg.price}
                                  </div>
                                ))
                            ) : (
                              <div className="px-4 py-3 text-sm text-gray-500">No packages found</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Status</Label>
                      <Select onValueChange={(value) => setPackageStatus(value)}>
                        <SelectTrigger className="rounded-md p-6">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Refunded">Refunded</SelectItem>
                          <SelectItem value="Expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Third Row */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        id="startDate"
                        className="p-6"
                        type="date"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={endDate}
                          onChange={(e) => {
                            setEndDate(e.target.value);
                            setIsEndDateAuto(false);
                          }}
                          id="endDate"
                          className="p-6"
                          type="date"
                        />
                        {!isEndDateAuto && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsEndDateAuto(true);
                              if (startDate && selectedPackage?.duration) {
                                const start = new Date(startDate);
                                const end = new Date(start);
                                end.setDate(end.getDate() + selectedPackage.duration);
                                setEndDate(end.toISOString().split('T')[0]);
                              }
                            }}
                            className="h-10"
                          >
                            <FiRefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Fourth Row */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Label htmlFor="paidAmount">Paid Amount</Label>
                      <Input
                        id="paidAmount"
                        {...register("paidAmount", { required: "Paid Amount is required" })}
                        placeholder='Paid amount'
                        className="p-6"
                        type="number" />
                    </div>
                    <div>
                      <Label htmlFor="discount">Discount Amount</Label>
                      <Input
                        id="discount"
                        {...register("discount")}
                        placeholder='Discount amount'
                        className="p-6"
                        type="number" />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Label htmlFor="totalAmount">Total Amount</Label>
                      <Input
                        id="totalAmount"
                        {...register("totalAmount", { required: "Total Amount is required" })}
                        placeholder='Total amount'
                        className="p-6"
                        type="number" />
                    </div>
                    <div>
                      <Label htmlFor="user">Register By</Label>
                      <Input
                        id="user"
                        className="p-6"
                        {...register("registerBy", { required: "Register By is required" })}
                        placeholder='Your name'
                        type="text" />
                    </div>
                  </div>

                  {/* Sixth Row */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Label htmlFor="branch">Branch</Label>
                      <Select onValueChange={(value) => setBranchId(value)}>
                        <SelectTrigger className="rounded-md p-6">
                          <SelectValue placeholder="Select Branch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Branch</SelectItem>
                          <SelectItem value="Branch One">Branch One</SelectItem>
                          <SelectItem value="Branch Two">Branch Two</SelectItem>
                          <SelectItem value="Branch Three">Branch Three</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="paymentStatus">Payment Status</Label>
                      <Select onValueChange={(value) => setPaymentStatus(value)}>
                        <SelectTrigger className="rounded-md p-6">
                          <SelectValue placeholder="Select Payment Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Payment Status</SelectItem>
                          <SelectItem value="Full Paid">Full Paid</SelectItem>
                          <SelectItem value="Partial Paid">Partial Paid</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Unpaid">Unpaid</SelectItem>
                          <SelectItem value="Refunded">Refunded</SelectItem>
                          <SelectItem value="Failed">Failed</SelectItem>
                          <SelectItem value="Expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Add reset button in the form */}
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResetForm}
                      className="bg-gray-100 hover:bg-gray-200 rounded-md p-6"
                    >
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 rounded-md p-6"
                    >
                      {isSubmitting ? <FiLoader className="animate-spin" /> : <FiSave />}
                      {isSubmitting ? 'Submitting...' : isEditMode ? 'Update Training' : 'Submit & Save'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="Reports">
          <div className="p-4">
            <h2>Reports Content</h2>
          </div>
        </TabsContent>

        <TabsContent value="Settings">
          <div className="p-4">
            <h2>Settings Content</h2>
          </div>
        </TabsContent>

        <TabsContent value="Notifications">
          <div className="p-4">
            <h2>Notifications Content</h2>
          </div>
        </TabsContent>

        <TabsContent value="Support">
          <div className="p-4">
            <h2>Support Content</h2>
          </div>
        </TabsContent>
      </Tabs>

    </div>
  );
};

export default PersonalTrainingBooking;
