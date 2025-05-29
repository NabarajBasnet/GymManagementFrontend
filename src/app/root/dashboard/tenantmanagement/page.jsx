"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FiChevronRight,
  FiTrash2,
  FiEdit,
  FiPlus,
  FiEye,
  FiLoader,
  FiRefreshCcw,
  FiSearch,
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiDollarSign,
} from "react-icons/fi";
import { MdHome, MdBusiness } from "react-icons/md";
import toast from "react-hot-toast";
import { format } from "date-fns";

// UI Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const TenantManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const getAllTenants = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/tenant");
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Failed to get tenants");
    }
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["tenants"],
    queryFn: getAllTenants,
  });

  const { tenants } = data || {};

  // Get status badge variant
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "Active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-600">
            Active
          </Badge>
        );
      case "Pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-600">
            Pending
          </Badge>
        );
      case "Suspended":
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get trial status badge
  const getTrialStatusBadge = (tenant) => {
    if (tenant.tenantOnFreeTrial) {
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800">
          Free Trial
        </Badge>
      );
    }
    return null;
  };

  // Handle tenant actions
  const handleViewTenant = (tenant) => {
    setSelectedTenant(tenant);
    setIsViewDialogOpen(true);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full bg-gray-100 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex justify-center min-h-screen p-4 md:p-6">
      <div className="w-full">
        {/* Breadcrumb */}
        <div className="w-full mb-4">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <MdHome className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <BreadcrumbLink
                  href="/"
                  className="ml-2 font-semibold text-slate-800 dark:text-slate-200"
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <FiChevronRight className="h-4 w-4 text-slate-500 dark:text-slate-500" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink className="font-semibold text-slate-800 dark:text-slate-200">
                  Root
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <FiChevronRight className="h-4 w-4 text-slate-500 dark:text-slate-500" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink className="font-semibold text-slate-800 dark:text-slate-200">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <FiChevronRight className="h-4 w-4 text-slate-500 dark:text-slate-500" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink className="font-semibold text-slate-800 dark:text-slate-200">
                  Tenant Management
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-800/50">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <Input
                    placeholder="Search by organization, owner name, or email..."
                    className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select>
                  <SelectTrigger className="w-full rounded-md bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <SelectItem
                      value="all"
                      className="focus:bg-slate-50 dark:focus:bg-slate-700"
                    >
                      All Status
                    </SelectItem>
                    <SelectItem
                      value="active"
                      className="focus:bg-slate-50 dark:focus:bg-slate-700"
                    >
                      Active
                    </SelectItem>
                    <SelectItem
                      value="pending"
                      className="focus:bg-slate-50 dark:focus:bg-slate-700"
                    >
                      Pending
                    </SelectItem>
                    <SelectItem
                      value="suspended"
                      className="focus:bg-slate-50 dark:focus:bg-slate-700"
                    >
                      Suspended
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tenants Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-800/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Total Tenants
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {tenants?.length || 0}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <MdBusiness className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-800/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Active Tenants
                  </p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {tenants?.filter((t) => t.tenantStatus === "Active")
                      .length || 0}
                  </p>
                </div>
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-full">
                  <div className="h-8 w-8 bg-emerald-600 dark:bg-emerald-400 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-800/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    On Free Trial
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {tenants?.filter((t) => t.tenantOnFreeTrial).length || 0}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <FiClock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-800/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {tenants?.filter((t) => t.tenantStatus === "Pending")
                      .length || 0}
                  </p>
                </div>
                <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                  <div className="h-8 w-8 bg-amber-600 dark:bg-amber-400 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tenants Table */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-800/50">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-100">
              Tenant List
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Showing {tenants.length} of {tenants?.length || 0} tenants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 dark:border-slate-800">
                    <TableHead className="text-slate-700 dark:text-slate-300">
                      Organization & Business Type
                    </TableHead>
                    <TableHead className="text-slate-700 dark:text-slate-300">
                      Owner
                    </TableHead>
                    <TableHead className="text-slate-700 dark:text-slate-300">
                      Subscription
                    </TableHead>
                    <TableHead className="text-slate-700 dark:text-slate-300">
                      End Date
                    </TableHead>
                    <TableHead className="text-slate-700 dark:text-slate-300">
                      Contact
                    </TableHead>
                    <TableHead className="text-slate-700 dark:text-slate-300">
                      Status
                    </TableHead>
                    <TableHead className="text-slate-700 dark:text-slate-300">
                      Trial Days
                    </TableHead>
                    <TableHead className="text-slate-700 dark:text-slate-300 text-center">
                      Created
                    </TableHead>
                    <TableHead className="text-slate-700 dark:text-slate-300 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenants.map((tenant) => (
                    <TableRow
                      key={tenant._id}
                      className="border-slate-200 dark:border-slate-800"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            {tenant.organizationName} -{" "}
                            <span className="text-sm text-blue-500 dark:text-blue-400">
                              {tenant.businessType}
                            </span>
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                            <FiMapPin className="mr-1 h-3 w-3" />
                            {tenant.address}, {tenant.country}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {tenant.ownerName}
                        </p>
                      </TableCell>
                      <TableCell>
                        {tenant?.tenantSubscription.map(
                          (subscription, index) => {
                            return (
                              <p
                                key={index}
                                className="text-sm text-slate-500 dark:text-slate-400"
                              >
                                {" "}
                                {index + 1}. {subscription.subscriptionName}
                              </p>
                            );
                          }
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {" "}
                          {new Date(
                            tenant?.tenantSubscriptionEndDate
                          ).toLocaleString()}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm flex items-center text-slate-700 dark:text-slate-300">
                            <FiMail className="mr-1 h-3 w-3" />
                            {tenant.email}
                          </p>
                          <p className="text-sm flex items-center text-slate-700 dark:text-slate-300">
                            <FiPhone className="mr-1 h-3 w-3" />
                            {tenant.phone?.countryCode} {tenant.phone?.number}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(tenant.tenantSubscriptionStatus)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getTrialStatusBadge(tenant)}
                          {tenant.tenantOnFreeTrial ? (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {tenant.tenantFreeTrialDays} days
                            </p>
                          ) : (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              N/A
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {format(new Date(tenant.createdAt), "MMM dd, yyyy")}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {format(new Date(tenant.createdAt), "HH:mm")}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewTenant(tenant)}
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                          >
                            <FiEye className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                          >
                            <FiEdit className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400"
                              >
                                <FiTrash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-slate-900 dark:text-slate-100">
                                  Delete Tenant
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
                                  Are you sure you want to delete{" "}
                                  {tenant.organizationName}? This action cannot
                                  be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-700 text-white">
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

            {tenants?.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">
                  No tenants found matching your criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Tenant Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-slate-900 dark:text-slate-100">
                Tenant Details
              </DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400">
                Detailed information about {selectedTenant?.organizationName}
              </DialogDescription>
            </DialogHeader>

            {selectedTenant && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-slate-900 dark:text-slate-100">
                    Organization Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Organization Name
                      </Label>
                      <p className="text-sm text-slate-900 dark:text-slate-100">
                        {selectedTenant.organizationName}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Owner Name
                      </Label>
                      <p className="text-sm text-slate-900 dark:text-slate-100">
                        {selectedTenant.ownerName}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Email
                      </Label>
                      <p className="text-sm text-slate-900 dark:text-slate-100">
                        {selectedTenant.email}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Phone
                      </Label>
                      <p className="text-sm text-slate-900 dark:text-slate-100">
                        {selectedTenant.phone?.countryCode}{" "}
                        {selectedTenant.phone?.number}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Address
                      </Label>
                      <p className="text-sm text-slate-900 dark:text-slate-100">
                        {selectedTenant.address}, {selectedTenant.country}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-slate-900 dark:text-slate-100">
                    Subscription Details
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Status
                      </Label>
                      <div className="mt-1">
                        {getStatusBadge(selectedTenant.tenantStatus)}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Free Trial
                      </Label>
                      <div className="mt-1">
                        {selectedTenant.tenantOnFreeTrial ? (
                          <Badge
                            variant="outline"
                            className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300"
                          >
                            Active ({selectedTenant.tenantFreeTrialDays} days)
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300"
                          >
                            Not Active
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Currency
                      </Label>
                      <p className="text-sm text-slate-900 dark:text-slate-100">
                        {selectedTenant.tenantCurrency}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Language
                      </Label>
                      <p className="text-sm text-slate-900 dark:text-slate-100">
                        {selectedTenant.tenantLanguage}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Timezone
                      </Label>
                      <p className="text-sm text-slate-900 dark:text-slate-100">
                        {selectedTenant.tenantTimezone}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Created
                      </Label>
                      <p className="text-sm text-slate-900 dark:text-slate-100">
                        {format(
                          new Date(selectedTenant.createdAt),
                          "MMM dd, yyyy HH:mm"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsViewDialogOpen(false)}
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
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
