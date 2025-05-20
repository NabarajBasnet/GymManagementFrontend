'use client';

import { CiUndo } from "react-icons/ci";
import Loader from "@/components/Loader/Loader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { FiChevronRight, FiTrash2, FiEdit, FiEye, FiPlus, FiX, FiCheck, FiInfo, FiHelpCircle, FiCreditCard, FiBarChart, FiSettings, FiBell } from "react-icons/fi";
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
  AlertDialogTrigger ,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import Pagination from "@/components/ui/CustomPagination";

const PersonalTrainingBooking = () => {

    // Query
    const queryClient = useQueryClient();

    // React Hook Form
    const {
         register,
         handleSubmit,
         formState: {errors, isSubmitting},
         reset  
        } = useForm();

        // Pagination, filters and search
        const [currentPage, setCurrentPage] = useState(1);
        const limit = 10;
        const [search, setSearch] = useState('');
        const [status, setStatus] = useState('');
        const [debouncedSearch, setDebouncedSearch] = useState('');

        // Form Handlers
        const [openBookingModal, setOpenBookingModal] = useState(false);
        const [openEditBookingModal, setOpenEditBookingModal] = useState(false);

        // Book Training Function
        const onSubmit = (data) => {
            console.log(data);
        }

    // Debounce search
    useEffect(() => {
        const delayInputTimeoutId = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(delayInputTimeoutId);
    }, [search]);

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
                    >
                        <FiPlus className="h-4 w-4 mr-2" />
                            Book Training
                        </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="View Bookings" className="w-full">
              <TabsList className="flex w-full overflow-x-auto lg:grid lg:grid-cols-7">
                <TabsTrigger value="View Bookings" className="whitespace-nowrap">
                  <span className="hidden sm:inline">View Bookings</span>
                  <span className="sm:hidden"><FiEye className="h-4 w-4" /></span>
                </TabsTrigger>
                <TabsTrigger value="Register Training" className="whitespace-nowrap">
                  <FiPlus className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Register Training</span>
                </TabsTrigger>
                <TabsTrigger value="Billing" className="whitespace-nowrap">
                  <FiCreditCard className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Billing</span>
                </TabsTrigger>
                <TabsTrigger value="Reports" className="whitespace-nowrap">
                  <FiBarChart className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Reports</span>
                </TabsTrigger>
                <TabsTrigger value="Settings" className="whitespace-nowrap">
                  <FiSettings className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
                <TabsTrigger value="Notifications" className="whitespace-nowrap">
                  <FiBell className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="Support" className="whitespace-nowrap">
                  <FiHelpCircle className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Support</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="View Bookings">

                {/* Filter Section */}
                <Card className="my-2">
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="search">Search</Label>
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    id="search"
                                    placeholder="Search here..."
                                />
                            </div>
                            <div>
                                <Label htmlFor="status">Status</Label>
                                <Select
                                >
                                    <SelectTrigger>
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
                            <div className="flex items-end">
                                <Button 
                                    variant="outline" 
                                    className="w-full"
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
                    <CardDescription className="text-sm text-gray-500 font-medium">
                    View and manage all your personal training bookings. You can filter, sort and search through your bookings.
                    </CardDescription>
                  </CardHeader>
                  
                  {/* Table Section */}
                  <CardContent className="space-y-2">
                  <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Trainer Name</TableHead>
                                            <TableHead>Client Name</TableHead>
                                            <TableHead>Package</TableHead>
                                            <TableHead>Start Date</TableHead>
                                            <TableHead>End Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Total Amount</TableHead>
                                            <TableHead>Branch</TableHead>
                                            <TableHead>Payment Status</TableHead>
                                            <TableHead className="text-center">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                            <TableRow>
                                                <TableCell>Ronie Colemon</TableCell>
                                                <TableCell>John Doe</TableCell>
                                                <TableCell>1 Month</TableCell>
                                                <TableCell>2025-01-01</TableCell>
                                                <TableCell>2025-01-31</TableCell>
                                                <TableCell>Active</TableCell>
                                                <TableCell>$ 5000</TableCell>
                                                <TableCell>Branch 1</TableCell>
                                                <TableCell>
                                                    <Badge>Full Paid</Badge>
                                                </TableCell>
                                                <TableCell className="text-right space-x-2">
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
                                                    <AlertDialogAction className="bg-red-600 hover:bg-red-700">Continue</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                                </AlertDialog>

                                                </TableCell>
                                            </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                      Change your password here. After saving, you'll be logged out.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="current">Current password</Label>
                      <Input id="current" type="password" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="new">New password</Label>
                      <Input id="new" type="password" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save password</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Booking Modal */}
            {openBookingModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 px-16 lg:px-32 z-50">
                  <Card className="w-full">
                      <CardHeader>
                          <CardTitle className="flex justify-between items-center">
                              {isEditing ? "Edit Package" : "Create New Package"}
                              <button onClick={()=>setOpenBookingModal(false)} className="text-gray-500 hover:text-gray-700">
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
                                          <SelectValue placeholder={`${packageStatus?packageStatus:'Select Status'}`} />
                                      </SelectTrigger>
                                      <SelectContent>
                                          <SelectItem value="Active">Active</SelectItem>
                                          <SelectItem value="Inactive">Inactive</SelectItem>
                                      </SelectContent>
                                  </Select>
                              </div>
                              
                              <CardFooter className="flex justify-end gap-2 px-0 pb-0 pt-6">
                                  <Button variant="outline" onClick={()=>resetForm()}>
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

        </div>
    );
};

export default PersonalTrainingBooking;
