'use client';

import { TiHome } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { LuLoaderCircle } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import toast from 'react-hot-toast'
import { IoSearch } from "react-icons/io5";
import { BiLoaderCircle } from "react-icons/bi";
import Pagination from "@/components/ui/CustomPagination";
import { MdDelete } from "react-icons/md";
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
import { FaUserEdit } from "react-icons/fa";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader/Loader";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { usePagination } from "@/hooks/Pagination";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const Users = () => {

    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [editForm, setEditForm] = useState(false);
    const [userId, setUserId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(15);
    const [isUserDeleting, setIsUserDeleting] = useState(false);
    const [user, setUser] = useState();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
        reset,
        control
    } = useForm();

    const [role, setUserRole] = useState('');
    const [approval, setUserApproval] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
        return () => clearTimeout(handler);
    }, [searchQuery, limit]);

    const fetchAllUsers = async ({ queryKey }) => {
        const [, page, searchQuery] = queryKey;
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/users?page=${page}&limit=${limit}&searchQuery=${searchQuery}`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const { data: allUsers, isLoading } = useQuery({
        queryKey: ['users', currentPage, debouncedSearchQuery, limit],
        queryFn: fetchAllUsers
    });

    const { users, totalUsers, totalPages } = allUsers || {};

    const { range, setPage, active } = usePagination({
        total: totalPages ? totalPages : 1,
        siblings: 1,
        boundaries: 1,
        page: currentPage,
        onChange: (page) => {
            setCurrentPage(page);
        },
    });

    useEffect(() => {
        fetchAllUsers();
    }, [limit]);

    const startEntry = (currentPage - 1) * limit + 1;
    const endEntry = Math.min(currentPage * limit, totalUsers);

    const fetchSingleUser = async (id) => {
        reset();
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/users/${id}`);
            const responseBody = await response.json();
            setUser(responseBody.user);
            setUserId(responseBody.user._id)
            if (response.status !== 200) {
                toast.error(responseBody.message);
            };
            if (response.status === 200 && response.ok) {
                toast.success(responseBody.message);
                reset({
                    firstName: responseBody.user.firstName,
                    lastName: responseBody.user.lastName,
                    role: responseBody.user.role,
                    approval: responseBody.user.approval,
                    email: responseBody.user.email,
                    phoneNumber: responseBody.user.phoneNumber,
                    address: responseBody.user.address,
                    dob: responseBody.user.dob ? new Date(responseBody.user.dob).toISOString().split('T')[0] : ''
                });
                setEditForm(true);
            }
            return responseBody;
        } catch (error) {
            toast.error(error);
            console.log("Error: ", error);
        }
    };

    const editUser = async (data) => {
        try {
            const { firstName, lastName, email, phoneNumber, dob, address } = data;
            const finalData = { firstName, lastName, email, phoneNumber, dob, address, role, approval };
            const response = await fetch(`http://88.198.112.156:3000/api/users/update/${userId}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(finalData),
                credentials: 'include'
            });
            const responseBody = await response.json();
            if (response.status === 200) {
                toast.success(responseBody.message);
                setEditForm(false);
                queryClient.invalidateQueries(['users'])
            }

            if (response.status !== 200) {
                toast.error(responseBody.message);
            }
        } catch (error) {
            console.log("Error: ", error);
            toast.error(error);
        }
    };

    const deleteUser = async (id) => {
        setIsDeleting(true);
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/users/remove/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            const responseBody = await response.json();
            if (response.status === 200) {
                setIsDeleting(false);
                toast.success(responseBody.message);
                queryClient.invalidateQueries(['users']);
                setIsUserDeleting(false);
            }

            if (response.status !== 200) {
                toast.error(responseBody.message);
            }
        } catch (error) {
            console.log("Error: ", error);
            setIsDeleting(false);
            toast.error(error);
        }
    };

    return (
        <div className="w-full bg-gray-100 px-4 py-6">
            <div className="w-full">
                <div className="w-full p-4 mb-4 bg-white border shadow-sm rounded-md">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <TiHome className="w-4 h-4" /><BreadcrumbLink href="/">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-1">
                                        <BreadcrumbEllipsis className="h-4 w-4" />
                                    </DropdownMenuTrigger>
                                </DropdownMenu>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Users</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className="text-xl font-bold my-1">User Management</h1>
                </div>

                {isDeleting ? (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className={`bg-white border shadow-2xl flex items-center justify-between p-4 relative`}>
                            <div className="w-full flex items-center">
                                <BiLoaderCircle className="text-xl animate-spin duration-500 transition-all mx-6" />
                                <h1>Deleting <span className="animate-pulse duration-500 transition-all">...</span></h1>
                            </div>
                        </div>
                    </div>
                ) : (
                    <></>
                )}

                {
                    editForm ? (
                        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex rounded-md items-center justify-center z-50 p-4">
                            <div className="flex justify-center w-full max-w-2xl rounded-md">
                                <div className="bg-white rounded-xl shadow-2xl w-full flex flex-col max-h-[90vh]">

                                    {/* Header Section */}
                                    <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-800">Edit User Profile</h2>
                                                <p className="text-gray-500 text-sm mt-1">Update the user information</p>
                                            </div>
                                            <button
                                                onClick={() => setEditForm(false)}
                                                className="text-gray-400 hover:text-gray-500 transition-colors p-1 -mr-1"
                                                aria-label="Close"
                                            >
                                                <IoClose className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Body Section - Scrollable Content */}
                                    <div className="flex-1 overflow-y-auto">
                                        <form onSubmit={handleSubmit(editUser)}>
                                            <div className="p-6 space-y-6">
                                                {/* Personal Information Section */}
                                                <div className="space-y-6">
                                                    <h3 className="text-base font-medium text-gray-900">Personal Information</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <Label>First Name</Label>
                                                            <Controller
                                                                name="firstName"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        className="mt-1"
                                                                        placeholder="John"
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Last Name</Label>
                                                            <Controller
                                                                name="lastName"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        className="mt-1"
                                                                        placeholder="Doe"
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <Label>Date of Birth</Label>
                                                            <Controller
                                                                name="dob"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        type="date"
                                                                        className="mt-1"
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Phone Number</Label>
                                                            <Controller
                                                                name="phoneNumber"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        type="tel"
                                                                        className="mt-1"
                                                                        placeholder="+1 (555) 123-4567"
                                                                    />
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Account Information Section */}
                                                <div className="space-y-6">
                                                    <h3 className="text-base font-medium text-gray-900">Account Information</h3>
                                                    <div>
                                                        <Label>Email Address</Label>
                                                        <Controller
                                                            name="email"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Input
                                                                    {...field}
                                                                    type="email"
                                                                    className="mt-1"
                                                                    placeholder="user@example.com"
                                                                />
                                                            )}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <Label>User Role</Label>
                                                            <Controller
                                                                name="role"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Select
                                                                        {...field}
                                                                        onValueChange={(value) => {
                                                                            setUserRole(value);
                                                                            field.onChange(value);
                                                                        }}
                                                                    >
                                                                        <SelectTrigger className="mt-1">
                                                                            <SelectValue placeholder="Select role" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="Super Admin">Super Admin</SelectItem>
                                                                            <SelectItem value="Gym Admin">Gym Admin</SelectItem>
                                                                            <SelectItem value="Operation Manager">Operation Manager</SelectItem>
                                                                            <SelectItem value="Developer">Developer</SelectItem>
                                                                            <SelectItem value="CEO">CEO</SelectItem>
                                                                            <SelectItem value="HR Manager">HR Manager</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                )}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label>Account Status</Label>
                                                            <Controller
                                                                name="approval"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Select
                                                                        {...field}
                                                                        onValueChange={(value) => {
                                                                            setUserApproval(value);
                                                                            field.onChange(value);
                                                                        }}
                                                                    >
                                                                        <SelectTrigger className="mt-1">
                                                                            <SelectValue placeholder="Select status" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="Approved">Approved</SelectItem>
                                                                            <SelectItem value="Rejected">Rejected</SelectItem>
                                                                            <SelectItem value="Pending">Pending</SelectItem>
                                                                            <SelectItem value="Blocked">Blocked</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Address Section */}
                                                <div className="space-y-6">
                                                    <h3 className="text-base font-medium text-gray-900">Address Information</h3>
                                                    <div>
                                                        <Label>Street Address</Label>
                                                        <Controller
                                                            name="address"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Input
                                                                    {...field}
                                                                    className="mt-1"
                                                                    placeholder="123 Main St, City, Country"
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Footer Section */}
                                            <div className="p-6 border-t border-gray-200 sticky bottom-0 bg-white rounded-b-xl">
                                                <div className="flex justify-end space-x-3">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => setEditForm(false)}
                                                        className="min-w-[100px]"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        className="min-w-[100px] bg-blue-600 hover:bg-blue-700"
                                                        disabled={isSubmitting}
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <LuLoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                                                Saving...
                                                            </>
                                                        ) : "Save Changes"}
                                                    </Button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null
                }

                <div className="w-full space-y-4">
                    {/* Controls Section */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            {/* Items Per Page Selector */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-600">Show</span>
                                <select
                                    onChange={(e) => setLimit(Number(e.target.value))}
                                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                >
                                    <option value="15">15</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value={totalUsers}>All</option>
                                </select>
                                <span className="text-sm font-medium text-gray-600">users</span>
                                <span className="text-xs text-gray-500 ml-2">(Selected: {limit})</span>
                            </div>

                            {/* Search Bar */}
                            <div className="relative w-full md:w-auto min-w-[250px]">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <IoSearch className="text-gray-400" />
                                </div>
                                <Input
                                    className="pl-10 w-full py-2 text-sm border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Search users..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setCurrentPage(1);
                                        setSearchQuery(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Main Table Section */}
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader />
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table className="min-w-full divide-y divide-gray-200">
                                    <TableHeader className="bg-gray-50">
                                        <TableRow>
                                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                User
                                            </TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Role
                                            </TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Phone
                                            </TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                DOB
                                            </TableHead>
                                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </TableHead>
                                            <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="bg-white divide-y divide-gray-200">
                                        {Array.isArray(users) && users.length > 0 ? (
                                            users.map((user) => (
                                                <TableRow key={user._id} className="hover:bg-gray-50">
                                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                                                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {user.firstName} {user.lastName}
                                                                </div>
                                                                <div className="text-xs font-medium text-gray-500">
                                                                    ID: {user._id}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{user.role}</div>
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{user.email}</div>
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{user.phoneNumber || '-'}</div>
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {user.dob ? new Date(user.dob).toLocaleDateString() : '-'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.approval === 'Approved' ? 'bg-green-100 text-green-800' :
                                                            user.approval === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                user.approval === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                                    user.approval === 'Blocked' ? 'bg-gray-100 text-gray-800' :
                                                                        'bg-blue-100 text-blue-800'
                                                            }`}>
                                                            {user.approval}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end">
                                                            <button
                                                                onClick={() => fetchSingleUser(user._id)}
                                                                className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                                                                title="Edit user"
                                                            >
                                                                <FaUserEdit className="h-5 w-5" />
                                                            </button>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <button className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50" title="Delete user">
                                                                        <MdDelete className="h-5 w-5" />
                                                                    </button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Confirm User Deletion</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            This will permanently delete {user.firstName}'s account and all associated data. This action cannot be undone.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() => deleteUser(user._id)}
                                                                            className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-500"
                                                                        >
                                                                            Delete User
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="px-6 py-4 text-center">
                                                    <div className="text-gray-500 py-8">
                                                        <div className="mx-auto flex flex-col items-center">
                                                            <FiUsers className="h-12 w-12 text-gray-400" />
                                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                {searchQuery ? 'Try a different search term' : 'No users available'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination Section */}
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-b-lg">
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">{startEntry}</span> to <span className="font-medium">{endEntry}</span> of{' '}
                                            <span className="font-medium">{totalUsers}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <Pagination
                                            total={totalPages || 1}
                                            page={currentPage || 1}
                                            onChange={setCurrentPage}
                                            withEdges={true}
                                            siblings={1}
                                            boundaries={1}
                                            className="flex items-center space-x-1"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Users;
