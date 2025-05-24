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

const TenantManagement = () => {
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
                                <BreadcrumbLink className="font-semibold">Root</BreadcrumbLink>
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
                                <BreadcrumbLink className="font-semibold">Tenant Management</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                </div>

                {/* Filters and Search */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="Search by organization, owner name, or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="w-full md:w-48">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full rounded-md">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="suspended">Suspended</SelectItem>
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

                {/* Tenants Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tenant List</CardTitle>
                        <CardDescription>
                            Showing {filteredTenants.length} of {tenants?.length || 0} tenants
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Organization</TableHead>
                                        <TableHead>Owner</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Trial</TableHead>
                                        <TableHead className="text-center">Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTenants.map((tenant) => (
                                        <TableRow key={tenant._id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{tenant.organizationName}</p>
                                                    <p className="text-sm text-gray-500 flex items-center">
                                                        <FiMapPin className="mr-1 h-3 w-3" />
                                                        {tenant.address}, {tenant.country}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-medium">{tenant.ownerName}</p>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="text-sm flex items-center">
                                                        <FiMail className="mr-1 h-3 w-3" />
                                                        {tenant.email}
                                                    </p>
                                                    <p className="text-sm flex items-center">
                                                        <FiPhone className="mr-1 h-3 w-3" />
                                                        {tenant.phone?.countryCode} {tenant.phone?.number}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(tenant.tenantStatus)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    {getTrialStatusBadge(tenant)}
                                                    {tenant.tenantOnFreeTrial && (
                                                        <p className="text-xs text-gray-500">
                                                            {tenant.tenantFreeTrialDays} days
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <p className="text-sm">
                                                    {format(new Date(tenant.createdAt), 'MMM dd, yyyy')}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {format(new Date(tenant.createdAt), 'HH:mm')}
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-right flex justify-end">
                                                <div className="flex flex-col items-center space-y-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleViewTenant(tenant)}
                                                    >
                                                        <FiEye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <FiEdit className="h-4 w-4" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-red-600 hover:text-red-700"
                                                            >
                                                                <FiTrash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete Tenant</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to delete {tenant.organizationName}? This action cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDeleteTenant(tenant._id)}
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                >
                                                                    Delete
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

                        {filteredTenants.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No tenants found matching your criteria.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* View Tenant Dialog */}
                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Tenant Details</DialogTitle>
                            <DialogDescription>
                                Detailed information about {selectedTenant?.organizationName}
                            </DialogDescription>
                        </DialogHeader>
                        
                        {selectedTenant && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold mb-3">Organization Information</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <Label className="text-sm font-medium">Organization Name</Label>
                                            <p className="text-sm">{selectedTenant.organizationName}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium">Owner Name</Label>
                                            <p className="text-sm">{selectedTenant.ownerName}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium">Email</Label>
                                            <p className="text-sm">{selectedTenant.email}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium">Phone</Label>
                                            <p className="text-sm">
                                                {selectedTenant.phone?.countryCode} {selectedTenant.phone?.number}
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium">Address</Label>
                                            <p className="text-sm">{selectedTenant.address}, {selectedTenant.country}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="font-semibold mb-3">Subscription Details</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <Label className="text-sm font-medium">Status</Label>
                                            <div className="mt-1">
                                                {getStatusBadge(selectedTenant.tenantStatus)}
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium">Free Trial</Label>
                                            <div className="mt-1">
                                                {selectedTenant.tenantOnFreeTrial ? (
                                                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                                        Active ({selectedTenant.tenantFreeTrialDays} days)
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline">Not Active</Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium">Currency</Label>
                                            <p className="text-sm">{selectedTenant.tenantCurrency}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium">Language</Label>
                                            <p className="text-sm">{selectedTenant.tenantLanguage}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium">Timezone</Label>
                                            <p className="text-sm">{selectedTenant.tenantTimezone}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium">Created</Label>
                                            <p className="text-sm">
                                                {format(new Date(selectedTenant.createdAt), 'MMM dd, yyyy HH:mm')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default TenantManagement;