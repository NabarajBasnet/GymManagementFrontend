"use client";

import { toast as soonerToast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowUpDown, MoreHorizontal, Trash2, Edit } from "lucide-react";
import Pagination from "@/components/ui/CustomPagination.jsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Loader from "@/components/Loader/Loader";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  FiPlus,
  FiTrash2,
  FiEdit,
  FiSearch,
  FiChevronRight,
  FiHome,
  FiPhone,
  FiMail,
  FiGlobe,
  FiMapPin,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { MdBusiness, MdOutlineSportsGymnastics } from "react-icons/md";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useTenant } from "../../../components/Providers/LoggedInTenantProvider";

const BranchManagement = () => {
  const { tenant, loading } = useTenant();
  const loggedInTenant = tenant?.tenant;
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("view");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBranch, setEditingBranch] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [sortBy, setSortBy] = useState("gymBranchName");
  const [sortOrderDesc, setSortOrderDesc] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const router = useRouter();

  // Debounce search query
  useEffect(() => {
    const delayedTimerId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to first page when searching
    }, 300);

    return () => clearTimeout(delayedTimerId);
  }, [searchQuery]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    setValue,
  } = useForm();

  const onSubmit = async (data) => {
    const tenantId = loggedInTenant?._id;
    try {
      const url = isEditing
        ? `http://localhost:3000/api/organizationbranch/${editingBranch._id}`
        : `http://localhost:3000/api/organizationbranch`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, tenantId }),
      });

      const responseBody = await response.json();
      if (response.ok && response.status === 200) {
        toast.success(responseBody.message);
        queryClient.invalidateQueries({ queryKey: ["branches"] });
        // Reset form and state
        reset();
        setEditingBranch(null);
        setIsEditing(false);
        setActiveTab("view");
      } else {
        toast.error(responseBody.message);
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Error: ", error.error);
    }
  };

  const handleEditBranch = (branch) => {
    setEditingBranch(branch);
    setIsEditing(true);

    // Set form values
    setValue("orgBranchName", branch.orgBranchName);
    setValue("orgBranchAddress", branch.orgBranchAddress);
    setValue("orgBranchPhone", branch.orgBranchPhone);
    setValue("orgBranchEmail", branch.orgBranchEmail);
    setValue("orgBranchWebsite", branch.orgBranchWebsite);
    setValue("orgBranchStatus", branch.orgBranchStatus);

    // Switch to register tab
    setActiveTab("register");
  };

  const handleCancel = () => {
    reset();
    setEditingBranch(null);
    setIsEditing(false);
    setActiveTab("view");
  };

  const handleDeleteBranch = async (branchId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/organizationbranch/${branchId}`,
        {
          method: "DELETE",
        }
      );

      const responseBody = await response.json();
      if (response.ok && response.status === 200) {
        queryClient.invalidateQueries({ queryKey: ["branches"] });
        toast.success(responseBody.message);
      } else {
        toast.error(responseBody.message);
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Error: ", error.message);
    }
  };

  const getAllBranches = async ({ queryKey }) => {
    const [, page, sortBy, sortOrderDesc, searchQuery] = queryKey;
    try {
      const response = await fetch(
        `http://localhost:3000/api/organizationbranch?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrderDesc=${sortOrderDesc}&search=${encodeURIComponent(
          searchQuery
        )}`
      );
      const responseBody = await response.json();
      console.log(responseBody);
      if (response.status === 201) {
        toast.error(responseBody.message);
        soonerToast.error(responseBody.message);
        router.push(responseBody.redirect);
        return { branches: [], totalPages: 0, totalBranches: 0 };
      }
      if (response.ok && response.status === 200) {
        return responseBody;
      } else {
        toast.error(responseBody.message);
        return { branches: [], totalPages: 0, totalBranches: 0 };
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error(error.message);
      return { branches: [], totalPages: 0, totalBranches: 0 };
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "branches",
      currentPage,
      sortBy,
      sortOrderDesc,
      debouncedSearchQuery,
    ],
    queryFn: getAllBranches,
  });

  const { branches, totalPages, totalBranches } = data || {};

  const startEntry = (currentPage - 1) * limit + 1;
  const endEntry = Math.min(currentPage * limit, totalBranches);

  const handleSort = (column) => {
    if (sortBy === column) {
      // If clicking the same column, toggle sort order
      setSortOrderDesc(!sortOrderDesc);
    } else {
      // If clicking a new column, set it as sort column and default to ascending
      setSortBy(column);
      setSortOrderDesc(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen p-6">
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full mx-auto">

          {/* Header */}
          <div className="flex justify-between items-center mb-8 dark:bg-gray-800 p-5 rounded-sm">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                Branch Management
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Manage your gym branches efficiently
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search branches..."
                  className="py-6 pl-12 dark:text-white w-[300px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 rounded-sm shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                onClick={() => {
                  setActiveTab("register");
                  setIsEditing(false);
                  setEditingBranch(null);
                  reset();
                }}
                className="h-12 px-6 dark:text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-sm shadow-lg"
              >
                <FiPlus className="mr-2 h-5 w-5" />
                Add Branch
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 border dark:border-none dark:bg-gray-800 rounded-sm p-1.5 h-16 mb-8">
              <TabsTrigger
                value="view"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 rounded-sm text-base font-medium"
              >
                <MdBusiness className="mr-2 h-5 w-5" />
                View Branches
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 rounded-sm text-base font-medium"
              >
                {isEditing ? (
                  <>
                    <FiEdit className="mr-2 h-5 w-5" />
                    Edit Branch
                  </>
                ) : (
                  <>
                    <FiPlus className="mr-2 h-5 w-5" />
                    Register Branch
                  </>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Register Branch Tab */}
            <TabsContent value="register" className="mt-8">
              <Card className="border-0 shadow-sm bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                <CardHeader className="border-b border-gray-100 dark:border-gray-700 pb-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                  <CardTitle className="flex items-center text-xl">
                    {isEditing ? (
                      <>
                        <FiEdit className="h-6 w-6 mr-2 text-blue-600" />
                        Edit Branch
                      </>
                    ) : (
                      <>
                        <MdOutlineSportsGymnastics className="h-6 w-6 mr-2 text-blue-600" />
                        Register New Branch
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-8">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Branch Name */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="orgBranchName"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Branch Name *
                        </Label>
                        <Input
                          id="orgBranchName"
                          placeholder="Enter branch name"
                          {...register("orgBranchName", {
                            required: "Branch name is required",
                          })}
                          className={`py-6 px-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 rounded-sm ${errors.gymBranchName ? "border-red-500" : ""
                            }`}
                        />
                        {errors.orgBranchName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.orgBranchName.message}
                          </p>
                        )}
                      </div>

                      {/* Branch Address */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="orgBranchAddress"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Address *
                        </Label>
                        <div className="relative">
                          <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input
                            id="orgBranchAddress"
                            placeholder="Enter full address"
                            className={`py-6 pl-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 rounded-sm ${errors.gymBranchAddress ? "border-red-500" : ""
                              }`}
                            {...register("orgBranchAddress", {
                              required: "Address is required",
                            })}
                          />
                        </div>
                        {errors.orgBranchAddress && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.orgBranchAddress.message}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="orgBranchPhone"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Phone *
                        </Label>
                        <div className="relative">
                          <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input
                            id="orgBranchPhone"
                            placeholder="Enter phone number"
                            className={`py-6 pl-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 rounded-sm ${errors.gymBranchPhone ? "border-red-500" : ""
                              }`}
                            {...register("orgBranchPhone", {
                              required: "Phone is required",
                              pattern: {
                                value: /^[0-9]{10,15}$/,
                                message: "Please enter a valid phone number",
                              },
                            })}
                          />
                        </div>
                        {errors.orgBranchPhone && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.orgBranchPhone.message}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="orgBranchEmail"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Email *
                        </Label>
                        <div className="relative">
                          <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input
                            id="orgBranchEmail"
                            type="email"
                            placeholder="Enter email address"
                            className={`py-6 pl-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 rounded-sm ${errors.gymBranchEmail ? "border-red-500" : ""
                              }`}
                            {...register("orgBranchEmail", {
                              required: "Email is required",
                              pattern: {
                                value:
                                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address",
                              },
                            })}
                          />
                        </div>
                        {errors.orgBranchEmail && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.orgBranchEmail.message}
                          </p>
                        )}
                      </div>

                      {/* Website */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="orgBranchWebsite"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Website
                        </Label>
                        <div className="relative">
                          <FiGlobe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input
                            id="orgBranchWebsite"
                            placeholder="Enter website URL"
                            className="py-6 pl-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 rounded-sm"
                            {...register("orgBranchWebsite")}
                          />
                        </div>
                      </div>

                      {/* Status */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="orgBranchStatus"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Status
                        </Label>
                        <Controller
                          name="orgBranchStatus"
                          control={control}
                          defaultValue="Active"
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger className="py-6 px-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 rounded-sm">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent className="py-6 px-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 rounded-sm">
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">
                                  Inactive
                                </SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                                <SelectItem value="Maintenance">
                                  Maintenance
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>

                    <CardFooter className="flex justify-end px-0 pb-0 pt-8">
                      <Button
                        type="button"
                        variant="outline"
                        className="mr-3 h-12 dark:bg-gray-800 border border-gray-600 dark:border-gray-600 px-6 rounded-sm"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="h-12 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-sm text-white shadow-lg"
                      >
                        {isSubmitting ? (
                          "Submitting..."
                        ) : (
                          <>{isEditing ? "Update Branch" : "Register Branch"}</>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* View Branches Tab */}
            <TabsContent value="view" className="mt-8">
              {isLoading ? (
                <Loader />
              ) : (
                <Card className="border-0 shadow-sm bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                  <CardHeader className="border-b border-gray-100 dark:border-gray-700 pb-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                    <CardTitle className="flex items-center text-xl">
                      <MdBusiness className="h-6 w-6 mr-2 text-blue-600" />
                      All Branches
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-8">
                    {Array.isArray(branches) && branches?.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16">
                        <MdOutlineSportsGymnastics className="h-20 w-20 text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">
                          No branches found
                        </h3>
                        <p className="text-gray-400 dark:text-gray-500 mt-2">
                          Register a new branch to get started
                        </p>
                        <Button
                          className="mt-6 h-12 px-6 dark:text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-lg"
                          onClick={() => {
                            setActiveTab("register");
                            setIsEditing(false);
                            setEditingBranch(null);
                            reset();
                          }}
                        >
                          <FiPlus className="mr-2 h-5 w-5" />
                          Add Branch
                        </Button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-b border-gray-200 dark:border-gray-700">
                              <TableHead className="text-gray-600 dark:text-gray-400 font-medium">
                                <div className="flex items-center">
                                  Branch Name
                                  <ArrowUpDown
                                    onClick={() => handleSort("orgBranchName")}
                                    className={`ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500 ${sortBy === "gymBranchName"
                                      ? "text-blue-600"
                                      : ""
                                      }`}
                                  />
                                </div>
                              </TableHead>
                              <TableHead className="text-gray-600 dark:text-gray-400 font-medium">
                                <div className="flex items-center">
                                  Address
                                  <ArrowUpDown
                                    onClick={() =>
                                      handleSort("orgBranchAddress")
                                    }
                                    className={`ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500 ${sortBy === "gymBranchAddress"
                                      ? "text-blue-600"
                                      : ""
                                      }`}
                                  />
                                </div>
                              </TableHead>
                              <TableHead className="text-gray-600 dark:text-gray-400 font-medium">
                                <div className="flex items-center">
                                  Contact
                                  <ArrowUpDown
                                    onClick={() => handleSort("orgBranchPhone")}
                                    className={`ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500 ${sortBy === "gymBranchPhone"
                                      ? "text-blue-600"
                                      : ""
                                      }`}
                                  />
                                </div>
                              </TableHead>
                              <TableHead className="text-gray-600 dark:text-gray-400 font-medium">
                                <div className="flex items-center">
                                  Status
                                  <ArrowUpDown
                                    onClick={() =>
                                      handleSort("orgBranchStatus")
                                    }
                                    className={`ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500 ${sortBy === "gymBranchStatus"
                                      ? "text-blue-600"
                                      : ""
                                      }`}
                                  />
                                </div>
                              </TableHead>
                              <TableHead className="text-gray-600 dark:text-gray-400 font-medium">
                                <div className="flex items-center">
                                  Created
                                  <ArrowUpDown
                                    onClick={() => handleSort("createdAt")}
                                    className={`ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500 ${sortBy === "createdAt"
                                      ? "text-blue-600"
                                      : ""
                                      }`}
                                  />
                                </div>
                              </TableHead>
                              <TableHead className="text-right text-gray-600 dark:text-gray-400 font-medium">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {branches?.map((branch) => (
                              <TableRow
                                key={branch._id}
                                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                              >
                                <TableCell className="font-medium">
                                  <div className="flex items-center">
                                    <MdOutlineSportsGymnastics className="h-5 w-5 mr-2 text-blue-600" />
                                    {branch.orgBranchName}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <FiMapPin className="h-4 w-4 mr-2 text-gray-400" />
                                    <span className="truncate max-w-[200px]">
                                      {branch.orgBranchAddress}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <div className="flex items-center">
                                      <FiPhone className="h-4 w-4 mr-2 text-gray-400" />
                                      {branch.orgBranchPhone}
                                    </div>
                                    <div className="flex items-center">
                                      <FiMail className="h-4 w-4 mr-2 text-gray-400" />
                                      <span className="truncate max-w-[180px]">
                                        {branch.orgBranchEmail}
                                      </span>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {branch.orgBranchStatus === "Active" ? (
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full">
                                      <FiCheck className="h-3 w-3 mr-1" />
                                      Active
                                    </Badge>
                                  ) : branch.orgBranchStatus === "Inactive" ? (
                                    <Badge
                                      variant="destructive"
                                      className="px-3 py-1 rounded-full"
                                    >
                                      <FiX className="h-3 w-3 mr-1" />
                                      Inactive
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-3 py-1 rounded-full">
                                      Maintenance
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {new Date(
                                    branch.orgBranchCreatedAt
                                  ).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end items-center space-x-2">
                                    <FiEdit
                                      className='h-4 w-4 bg-transparent hover:bg-transparent cursor-pointer'
                                      onClick={() => handleEditBranch(branch)}
                                    />

                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="destructive"
                                          size="icon"
                                          className='bg-transparent hover:text-red-600 hover:bg-transparent'
                                        >
                                          <FiTrash2 className="h-4 w-4 mr-1" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent className="dark:bg-gray-900 border border-red-500 shadow-lg dark:shadow-red-800/20 transition-all duration-300 rounded-xl">
                                        <AlertDialogHeader className="flex items-center gap-2">
                                          <div className="flex items-center gap-2 text-red-600 dark:text-red-500">
                                            <FiTrash2 className="h-6 w-6" />
                                            <AlertDialogTitle className="text-lg font-semibold">
                                              Are you absolutely sure?
                                            </AlertDialogTitle>
                                          </div>
                                          <AlertDialogDescription className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                            This action <span className="font-semibold text-red-600">cannot be undone</span>. It will permanently delete this branch and all associated data from our servers.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="mt-4 flex justify-end gap-3">
                                          <AlertDialogCancel className="px-4 py-2 rounded-lg text-gray-800 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600">
                                            Cancel
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700 font-semibold shadow-md"
                                            onClick={() => handleDeleteBranch(branch._id)}
                                          >
                                            Yes, delete permanently
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
                    )}
                  </CardContent>
                </Card>
              )}

              <div className="my-2">
                <div className="mt-4 px-4 md:flex justify-between items-center">
                  <p className="font-medium text-center text-sm dark:text-white font-gray-700">
                    Showing{" "}
                    <span className="font-semibold text-sm dark:text-white font-gray-700">
                      {startEntry}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-sm dark:text-white font-gray-700">
                      {endEntry}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold dark:text-white">
                      {totalBranches}
                    </span>{" "}
                    entries
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
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default BranchManagement;
