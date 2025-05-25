'use client';

import { TiEye } from "react-icons/ti";
import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FiChevronRight, FiTrash2, FiEdit, FiPlus, FiEye, FiLoader, FiRefreshCcw, FiSearch, FiMail, FiPhone, FiMapPin, FiClock, FiDollarSign } from "react-icons/fi";
import { MdHome, MdBusiness } from "react-icons/md";
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

const BranchManagement = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(6);
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedTenant, setSelectedTenant] = useState(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const queryClient = useQueryClient();

    const ref = useRef(null);

    // React hook form 
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        control,
        reset,
        setValue
    } = useForm();

    const getAllTenants = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/tenant');
            const data = await response.json();
            console.log("Data: ", data);
            return data;
        } catch (error) {
            console.log("Error: ", error);
            toast.error("Failed to get tenants");
        }
    }

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['tenants'],
        queryFn: getAllTenants
    });

    const { tenants } = data || {};

    // Filter tenants based on search and status
    const filteredTenants = tenants?.filter(tenant => {
        const matchesSearch = 
            tenant.organizationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tenant.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tenant.email?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === "all" || 
            tenant.tenantStatus?.toLowerCase() === statusFilter.toLowerCase();
        
        return matchesSearch && matchesStatus;
    }) || [];

    // Get status badge variant
    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
            case 'pending':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
            case 'suspended':
                return <Badge variant="destructive">Suspended</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // Get trial status badge
    const getTrialStatusBadge = (tenant) => {
        if (tenant.tenantOnFreeTrial) {
            return <Badge variant="outline" className="bg-blue-100 text-blue-800">Free Trial</Badge>;
        }
        return null;
    };

    // Handle tenant actions
    const handleViewTenant = (tenant) => {
        setSelectedTenant(tenant);
        setIsViewDialogOpen(true);
    };

    const handleDeleteTenant = async (tenantId) => {
        try {
            // Add your delete API call here
            toast.success("Tenant deleted successfully");
            refetch();
        } catch (error) {
            toast.error("Failed to delete tenant");
        }
    };

    const handleUpdateTenantStatus = async (tenantId, newStatus) => {
        try {
            // Add your update API call here
            toast.success("Tenant status updated successfully");
            refetch();
        } catch (error) {
            toast.error("Failed to update tenant status");
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className='w-full bg-gray-100 dark:bg-gray-900 flex justify-center min-h-screen p-7'>
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
                                <BreadcrumbLink className="font-semibold">Tenant</BreadcrumbLink>
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
                                <BreadcrumbLink className="font-semibold">Branch Management</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="registerbranch" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-gray-800 rounded-md dark:border-gray-600 dark:text-white">
                        <TabsTrigger value="registerbranch">Register Branch</TabsTrigger>
                        <TabsTrigger value="viewbranches">View Branches</TabsTrigger>
                    </TabsList>
                    <TabsContent value="registerbranch">
                        <Card>
                            
                        </Card>
                    </TabsContent>
                    <TabsContent value="viewbranches">
                        <Card>
                    
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Filters and Search */}
                <Card className="mb-6 bg-white dark:bg-gray-800 dark:border-none">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="Search by organization, owner name, or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 bg-white dark:bg-transparent dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="w-full md:w-48">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full rounded-md bg-white dark:bg-transparent dark:border-gray-600 dark:text-white">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-gray-800 rounded-md dark:border-gray-600 dark:text-white">
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Pending">Pending</SelectItem>
                                        <SelectItem value="Suspended">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tenants Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Tenants</p>
                                    <p className="text-2xl font-bold">{tenants?.length || 0}</p>
                                </div>
                                <MdBusiness className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Active Tenants</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {tenants?.filter(t => t.tenantStatus === 'Active').length || 0}
                                    </p>
                                </div>
                                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <div className="h-4 w-4 bg-green-600 rounded-full"></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">On Free Trial</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {tenants?.filter(t => t.tenantOnFreeTrial).length || 0}
                                    </p>
                                </div>
                                <FiClock className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Pending</p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {tenants?.filter(t => t.tenantStatus === 'Pending').length || 0}
                                    </p>
                                </div>
                                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <div className="h-4 w-4 bg-yellow-600 rounded-full"></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default BranchManagement;