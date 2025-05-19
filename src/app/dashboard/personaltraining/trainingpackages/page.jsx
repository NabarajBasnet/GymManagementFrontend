'use client';

import Loader from "@/components/Loader/Loader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
  AlertDialogTrigger ,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import Pagination from "@/components/ui/CustomPagination";

const CreatePersonalTrainingPackages = () => {

    // Query
    const queryClient = useQueryClient();
    // React Hook Form
    const {
         register,
         handleSubmit,
         formState: {errors, isSubmitting},
         reset  
        } = useForm();

    // Form States and handlers
    const [showForm, setShowForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [packageStatus, setPackageStatus] = useState('');

    const resetForm = () => {
        reset();
        setIsEditing(false);
        setShowForm(false);
        setPackageStatus('');
      };

    const onSubmit = async(data) => {
    const {packagename, sessions, duration, price, description} = data;
    const packageData = {packagename, sessions, duration, price, description, packageStatus};
    try {
        const response = await fetch('http://localhost:3000/api/personaltraining/packages', {
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(packageData)
        });
        const responseBody = await response.json();         
        if(response.ok) {
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

    const getPackages = async() => {
     try {
        const response = await fetch(`http://localhost:3000/api/personaltraining/packages`);
        const responseBody = await response.json();
        return responseBody;
     } catch (error) {
        console.log(error);
        throw error;
     };
    };

    const {data, isLoading, isError} = useQuery({
        queryKey: ['packages'],
        queryFn: getPackages
    });

    const {packages = [], totalPages = 1} = data || {};

    // State for form
    const [isEditing, setIsEditing] = useState(false);

    // Form handlers
    const handleEdit = (pkg) => {
        setIsEditing(true);
        setShowForm(true);
        setPackageStatus(pkg.packageStatus);
        reset({
            packagename: pkg.packagename,
            sessions: pkg.sessions,
            duration: pkg.duration,
            price: pkg.price,
            description: pkg.description
        });
    };

    const deletePackage = async(id) => {
        try {
           const response = await fetch(`http://localhost:3000/api/personaltraining/packages/${id}`,{
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
           });
           const responseBody = await response.json();
           if(response.ok) {
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

       const toggleStatus = async(id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/personaltraining/packages/toggle/${id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const responseBody = await response.json();
            if(response.ok) {
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
        <div className='w-full bg-gray-50 min-h-screen p-4 md:p-6'>
            {/* Breadcrumb with arrows */}
            <div className='w-full mb-6'>
                <Breadcrumb className="mb-4">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <MdHome className='w-4 h-4' />
                            <BreadcrumbLink href="/" className="ml-2">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <FiChevronRight className="h-4 w-4" />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink>Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <FiChevronRight className="h-4 w-4" />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink>Personal Training</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <FiChevronRight className="h-4 w-4" />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink className="font-semibold">Packages</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-2xl font-bold">Personal Training Packages</h1>
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
            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="search">Search</Label>
                            <Input
                                id="search"
                                placeholder="Search by name or description..."
                            />
                        </div>
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end">
                            <Button 
                                variant="outline" 
                                className="w-full"
                            >
                                Reset Filters
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Package Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 px-16 lg:px-32 z-50">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                {isEditing ? "Edit Package" : "Create New Package"}
                                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                                    <FiX className="h-5 w-5" />
                                </button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <Label htmlFor="packagename">Package Name *</Label>
                                    <Input
                                        id="packagename"
                                        {...register("packagename", {required: true})}
                                        placeholder="e.g., Premium Package"
                                        required
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="sessions">Number of Sessions *</Label>
                                        <Input
                                            id="sessions"
                                            type="number"
                                            {...register("sessions", {required: true})}
                                            placeholder="e.g., 12"
                                            min="1"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="duration">Duration (days) *</Label>
                                        <Input
                                            id="duration"
                                            type="number"
                                            {...register("duration", {required: true})}
                                            placeholder="e.g., 30"
                                            min="1"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <Label htmlFor="price">Price ($) *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        {...register("price", {required: true})}
                                        placeholder="e.g., 299"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        {...register("description")}
                                        placeholder="Describe the package benefits..."
                                        rows={3}
                                    />
                                </div>
                                
                                <div>
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={packageStatus}
                                        onValueChange={(value) => setPackageStatus(value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={`${packageStatus} || 'Select Status'}`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <CardFooter className="flex justify-end gap-2 px-0 pb-0 pt-6">
                                    <Button variant="outline" onClick={resetForm}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                                        {isSubmitting ? "Submitting..." : (isEditing ? "Update Package" : "Create Package")}
                                    </Button>
                                </CardFooter>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Packages Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Current Packages</CardTitle>
                    <p className="text-xs font-medium text-gray-600">
                        Create and manage you personal training packages.
                    </p>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <Loader />
                    ) : isError ? (
                        <div className="text-center py-8">
                            <FiInfo className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading packages</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Please try again later
                            </p>
                        </div>
                    ) : packages.length === 0 ? (
                        <div className="text-center py-8">
                            <FiInfo className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No packages found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Get started by creating a new package
                            </p>
                            <div className="mt-6">
                                <Button
                                    onClick={() => setShowForm(true)}
                                    className="bg-blue-600 hover:bg-blue-700"
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
                                        <TableRow>
                                            <TableHead>Package Name</TableHead>
                                            <TableHead>Sessions</TableHead>
                                            <TableHead>Duration</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {packages.map((pkg) => (
                                            <TableRow key={pkg._id}>
                                                <TableCell className="font-medium">
                                                    {pkg.packagename}
                                                    {pkg.description && (
                                                        <p className="text-sm text-gray-500 mt-1">{pkg.description}</p>
                                                    )}
                                                </TableCell>
                                                <TableCell>{pkg.sessions}</TableCell>
                                                <TableCell>{pkg.duration} days</TableCell>
                                                <TableCell>${pkg.price.toFixed(2)}</TableCell>
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

                            {/* Pagination */}
                            <div className="w-full flex justify-center my-4 lg:justify-end">
                                <Pagination
                                    total={totalPages}
                                    page={currentPage || 1}
                                    onChange={setCurrentPage}
                                    withEdges={true}
                                    siblings={1}
                                    boundaries={1}
                                />
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default CreatePersonalTrainingPackages;
