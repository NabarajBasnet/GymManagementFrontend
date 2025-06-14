'use client';

import { CiUndo } from "react-icons/ci";
import Loader from "@/components/Loader/Loader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { FiChevronRight, FiTrash2, FiEdit, FiPlus, FiX, FiCheck, FiInfo } from "react-icons/fi";
import { MdHome } from "react-icons/md";
import toast from "react-hot-toast";

// UI Components
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

const CreatePersonalTrainingPackages = () => {

    const [packageId, setPackageId] = useState('');

    // Query
    const queryClient = useQueryClient();

    // React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm();

    // Pagination, filters and search
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const delayInputTimeoutId = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(delayInputTimeoutId);
    }, [search]);


    // Form States and handlers
    const [showForm, setShowForm] = useState(false);
    const [packageStatus, setPackageStatus] = useState('');

    const resetForm = () => {
        reset({
            packagename: '',
            sessions: '',
            duration: '',
            price: '',
            description: ''
        });
        setIsEditing(false);
        setShowForm(false);
        setPackageStatus('');
    };

    const onSubmit = async (data) => {
        const { packagename, sessions, duration, price, description } = data;
        const packageData = { packagename, sessions, duration, price, description, packageStatus };
        try {
            const baseURL = 'http://localhost:3000/api/personaltraining/packages';
            const response = await fetch(isEditing ? `${baseURL}/${packageId}` : baseURL, {
                method: isEditing ? "PATCH" : "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(packageData),
            });
            const responseBody = await response.json();
            if (response.ok) {
                toast.success(responseBody.message);
                setShowForm(false);
                resetForm();
                queryClient.invalidateQueries(['packages']);
            } else {
                toast.error(responseBody.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred while creating the package");
        }
    };

    const getPackages = async ({ queryKey }) => {
        const [, currentPage] = queryKey;
        try {
            const response = await fetch(`http://localhost:3000/api/personaltraining/packages?page=${currentPage}&limit=${limit}&page=${currentPage}&limit=${limit}&search=${debouncedSearch}&status=${status}`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log(error);
            throw error;
        };
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ['packages', currentPage, debouncedSearch, status],
        queryFn: getPackages
    });

    const { packages, totalPages, totalPackages } = data || {};

    // State for form
    const [isEditing, setIsEditing] = useState(false);

    // Form handlers
    const handleEdit = (pkg) => {
        setIsEditing(true);
        setShowForm(true);
        setPackageId(pkg._id);
        setPackageStatus(pkg.packageStatus);
        reset({
            packagename: pkg.packagename,
            sessions: pkg.sessions,
            duration: pkg.duration,
            price: pkg.price,
            description: pkg.description
        });
    };

    const deletePackage = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/personaltraining/packages/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const responseBody = await response.json();
            if (response.ok) {
                toast.success(responseBody.message);
                queryClient.invalidateQueries(['packages']);
            } else {
                toast.error(responseBody.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            throw error;
        };
    };

    const toggleStatus = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/personaltraining/packages/toggle/${id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const responseBody = await response.json();
            if (response.ok) {
                toast.success(responseBody.message);
                queryClient.invalidateQueries(['packages']);
            } else {
                toast.error(responseBody.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
            throw error;
        };
    };

    return (
        <div className='w-full bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-6'>
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
                            <BreadcrumbLink className="font-semibold">Packages</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex flex-col md:flex-row justify-between items-start bg-white dark:bg-gray-800 p-4 py-6 border border-gray-200 dark:border-none shadow-sm rounded-md md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold dark:text-gray-100">Personal Training Packages</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Create and manage your personal training packages.
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="rounded-sm"
                    >
                        <FiPlus className="h-4 w-4 mr-2" />
                        Create Package
                    </Button>
                </div>
            </div>

            {/* Filter Section */}
            <Card className="mb-4 dark:bg-gray-800 dark:border-none">
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="search" className="dark:text-gray-200">Search</Label>
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                id="search"
                                placeholder="Search by name or description..."
                                className="dark:bg-gray-900 dark:border-none dark:text-gray-100"
                            />
                        </div>
                        <div>
                            <Label htmlFor="status" className="dark:text-gray-200">Status</Label>
                            <Select
                                onValueChange={(value) => setStatus(value)}
                            >
                                <SelectTrigger className="dark:bg-gray-900 dark:border-none dark:text-gray-100">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-gray-900 dark:border-none">
                                    <SelectItem value="all" className="dark:text-gray-100">All Status</SelectItem>
                                    <SelectItem value="Active" className="dark:text-gray-100">Active</SelectItem>
                                    <SelectItem value="Inactive" className="dark:text-gray-100">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end">
                            <Button
                                variant="outline"
                                className="w-full dark:border-none dark:bg-gray-900 dark:text-gray-100"
                                onClick={() => {
                                    setSearch('');
                                    setStatus('');
                                    setCurrentPage(1);
                                }}
                            >
                                <CiUndo className="h-5 w-5 mr-2" />
                                Reset Filters
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Package Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 px-16 lg:px-32 z-50">
                    <Card className="w-full dark:bg-gray-800 dark:border-none">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center dark:text-gray-100">
                                {isEditing ? "Edit Package" : "Create New Package"}
                                <button onClick={() => resetForm()} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                    <FiX className="h-5 w-5" />
                                </button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <Label htmlFor="packagename" className="dark:text-gray-200">Package Name *</Label>
                                    <Input
                                        id="packagename"
                                        {...register("packagename", { required: true })}
                                        placeholder="e.g., Premium Package"
                                        required
                                        className="dark:bg-gray-900 dark:border-none dark:text-gray-100"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="sessions">Number of Sessions *</Label>
                                        <Input
                                            id="sessions"
                                            type="number"
                                            {...register("sessions", { required: true })}
                                            placeholder="e.g., 12"
                                            min="1"
                                            required
                                            className="dark:bg-gray-900 dark:border-none dark:text-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="duration">Duration (days) *</Label>
                                        <Input
                                            id="duration"
                                            type="number"
                                            {...register("duration", { required: true })}
                                            placeholder="e.g., 30"
                                            min="1"
                                            required
                                            className="dark:bg-gray-900 dark:border-none dark:text-gray-100"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="price">Price ($) *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        {...register("price", { required: true })}
                                        placeholder="e.g., 299"
                                        min="0"
                                        step="0.01"
                                        required
                                        className="dark:bg-gray-900 dark:border-none dark:text-gray-100"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        {...register("description")}
                                        placeholder="Describe the package benefits..."
                                        className="dark:bg-gray-900 dark:border-none dark:text-gray-100"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={packageStatus}
                                        onValueChange={(value) => setPackageStatus(value)}
                                    >
                                        <SelectTrigger className='dark:rounded-sm bg-gray-900 dark:border-none dark:text-gray-100'>
                                            <SelectValue placeholder={`${packageStatus ? packageStatus : 'Select Status'}`} />
                                        </SelectTrigger>
                                        <SelectContent className="dark:bg-gray-900 dark:border-none">
                                            <SelectItem value="Active" className="dark:text-gray-100 cursor-pointer bg-blue-500 hover:bg-blue-600">Active</SelectItem>
                                            <SelectItem value="Inactive" className="dark:text-gray-100 cursor-pointer bg-red-500 hover:bg-red-600">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <CardFooter className="flex justify-end gap-2 px-0 pb-0 pt-6">
                                    <Button variant="outline" onClick={() => resetForm()} className="dark:border-none dark:bg-gray-900 dark:text-gray-100">
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 dark:text-white" disabled={isSubmitting}>
                                        {isSubmitting ? "Submitting..." : (isEditing ? "Update Package" : "Create Package")}
                                    </Button>
                                </CardFooter>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Packages Table */}
            <Card className="dark:bg-gray-800 dark:border-none">
                <CardHeader>
                    <CardTitle className="dark:text-gray-100">Current Packages</CardTitle>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        This table shows all the packages that are currently available.
                    </p>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <Loader />
                    ) : isError ? (
                        <div className="text-center py-8">
                            <FiInfo className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Error loading packages</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Please try again later
                            </p>
                        </div>
                    ) : packages.length === 0 ? (
                        <div className="text-center py-8">
                            <FiInfo className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No packages found</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Get started by creating a new package
                            </p>
                            <div className="mt-6">
                                <Button
                                    onClick={() => setShowForm(true)}
                                    className="bg-blue-600 hover:bg-blue-700 dark:text-white"
                                >
                                    <FiPlus className="h-4 w-4 mr-2" />
                                    New Package
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="dark:border-gray-700">
                                            <TableHead className="dark:text-gray-100">Package Name</TableHead>
                                            <TableHead className="dark:text-gray-100">Sessions</TableHead>
                                            <TableHead className="dark:text-gray-100">Duration</TableHead>
                                            <TableHead className="dark:text-gray-100">Price</TableHead>
                                            <TableHead className="dark:text-gray-100">Status</TableHead>
                                            <TableHead className="text-right dark:text-gray-100">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {packages.map((pkg) => (
                                            <TableRow key={pkg._id} className="dark:border-gray-700">
                                                <TableCell className="font-medium dark:text-gray-100">
                                                    {pkg.packagename}
                                                    {pkg.description && (
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{pkg.description}</p>
                                                    )}
                                                </TableCell>
                                                <TableCell className="dark:text-gray-100">{pkg.sessions}</TableCell>
                                                <TableCell className="dark:text-gray-100">{pkg.duration} days</TableCell>
                                                <TableCell className="dark:text-gray-100">$ {pkg.price.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Badge variant={pkg.packageStatus === "Active" ? "green" : "destructive"}>
                                                        {pkg.packageStatus}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => toggleStatus(pkg._id)}
                                                    >
                                                        {pkg.packageStatus === "Active" ? <FiX className="h-4 w-4" /> : <FiCheck className="h-4 w-4" />}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEdit(pkg)}
                                                    >
                                                        <FiEdit className="h-4 w-4" />
                                                    </Button>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                                            >
                                                                <FiTrash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. This will permanently delete your package.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deletePackage(pkg._id)}>Continue</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>

                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    )}
                    {/* Pagination */}
                    <div className="w-full md:flex justify-center my-4 lg:justify-between">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            Showing {packages?.length || 0} packages out of {totalPackages || 0}
                        </p>
                        <Pagination
                            total={totalPages}
                            page={currentPage}
                            onChange={setCurrentPage}
                            withEdges={true}
                            siblings={1}
                            boundaries={1}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreatePersonalTrainingPackages;
