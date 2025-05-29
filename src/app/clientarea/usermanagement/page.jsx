"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Home,
  LoaderCircle,
  Search,
  Trash2,
  X,
  Users,
  User,
  AtSign,
  Phone,
  Lock,
  MapPin,
  Calendar,
  CheckCircle2,
  Plus,
  UserPlus,
  Settings,
  Filter,
  Download,
  RefreshCw,
  MoreVertical,
  Pencil,
  Trash,
} from "lucide-react";
import { TiHome } from "react-icons/ti";
import { IoClose, IoSearch } from "react-icons/io5";
import { LuLoaderCircle } from "react-icons/lu";
import { BiLoaderCircle } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Mock data for demonstration
const mockUsers = [
  {
    _id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "+1234567890",
    role: "Gym Admin",
    approval: "Approved",
    address: "123 Main St, City, Country",
    dob: "1990-01-15",
  },
  {
    _id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phoneNumber: "+1987654320",
    role: "Operation Manager",
    approval: "Pending",
    address: "456 Oak Ave, City, Country",
    dob: "1985-05-20",
  },
  {
    _id: "3",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@example.com",
    phoneNumber: "+1122334455",
    role: "HR Manager",
    approval: "Rejected",
    address: "789 Pine St, City, Country",
    dob: "1992-08-10",
  },
];

const UserManagement = () => {
  // State management
  const [activeTab, setActiveTab] = useState("manage"); // 'manage' or 'add'
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [editForm, setEditForm] = useState(false);
  const [addForm, setAddForm] = useState(false);
  const [userId, setUserId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [user, setUser] = useState();
  const [statusFilter, setStatusFilter] = useState("all");

  // Form hooks
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { isSubmitting: isSubmittingEdit },
    reset: resetEdit,
    control: controlEdit,
  } = useForm();

  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    formState: { isSubmitting: isSubmittingAdd, errors: errorsAdd },
    reset: resetAdd,
    watch: watchAdd,
  } = useForm();

  const [role, setUserRole] = useState("");
  const [approval, setUserApproval] = useState("");

  const watchPassword = watchAdd("password", "");

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery, limit]);

  // Filter users based on search and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !debouncedSearchQuery ||
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      user.approval.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / limit);
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const startEntry = startIndex + 1;
  const endEntry = Math.min(endIndex, totalUsers);

  // Mock API functions
  const fetchSingleUser = async (id) => {
    resetEdit();
    const foundUser = users.find((u) => u._id === id);
    if (foundUser) {
      setUser(foundUser);
      setUserId(foundUser._id);
      resetEdit({
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        role: foundUser.role,
        approval: foundUser.approval,
        email: foundUser.email,
        phoneNumber: foundUser.phoneNumber,
        address: foundUser.address,
        dob: foundUser.dob
          ? new Date(foundUser.dob).toISOString().split("T")[0]
          : "",
      });
      setUserRole(foundUser.role);
      setUserApproval(foundUser.approval);
      setEditForm(true);
    }
  };

  const editUser = async (data) => {
    try {
      const { firstName, lastName, email, phoneNumber, dob, address } = data;
      const finalData = {
        firstName,
        lastName,
        email,
        phoneNumber,
        dob,
        address,
        role,
        approval,
      };

      // Update user in state
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === userId ? { ...u, ...finalData } : u))
      );

      setEditForm(false);
      // Mock success message
      console.log("User updated successfully");
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const addUser = async (data) => {
    try {
      const newUser = {
        _id: Date.now().toString(),
        ...data,
        role: "Gym Admin", // Default role
        approval: "Pending", // Default status
      };

      setUsers((prevUsers) => [...prevUsers, newUser]);
      resetAdd();
      setAddForm(false);
      console.log("User added successfully");
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const deleteUser = async (id) => {
    setIsDeleting(true);
    try {
      // Remove user from state
      setUsers((prevUsers) => prevUsers.filter((u) => u._id !== id));
      setIsDeleting(false);
      console.log("User deleted successfully");
    } catch (error) {
      console.log("Error: ", error);
      setIsDeleting(false);
    }
  };

  const approveUser = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u._id === id ? { ...u, approval: "Approved" } : u))
    );
  };

  const rejectUser = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u._id === id ? { ...u, approval: "Rejected" } : u))
    );
  };

  // Form field component for add user
  const FormField = ({
    label,
    name,
    type = "text",
    icon,
    validation,
    error,
    placeholder,
    register,
  }) => (
    <div className="space-y-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 block">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          id={name}
          type={type}
          className={`pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
            error ? "border-red-500 focus:border-red-500" : ""
          }`}
          placeholder={placeholder}
          {...register(name, validation)}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <X className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm font-medium text-red-500 mt-1">{error.message}</p>
      )}
    </div>
  );

  // Users List Component
  const UsersList = ({ users, isLoading }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="border border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-full w-12" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          users?.map((user) => (
            <Card 
              key={user._id} 
              className="border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200"
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-slate-900 dark:text-slate-100">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${user.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                      {user.status}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-gray-100 px-4 flex justify-center py-6">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="w-full p-4 mb-4 bg-white border shadow-sm rounded-md">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <TiHome className="w-4 h-4" />
            <span>Home</span>
            <span>/</span>
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-gray-900">User Management</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">
            User Management System
          </h1>
          <p className="text-gray-600 mt-1">
            Manage users, roles, and permissions
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("manage")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "manage"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Users className="w-4 h-4 inline-block mr-2" />
                Manage Users
              </button>
              <button
                onClick={() => setActiveTab("add")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "add"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <UserPlus className="w-4 h-4 inline-block mr-2" />
                Add New User
              </button>
            </nav>
          </div>
        </div>

        {/* Loading Overlay */}
        {isDeleting && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="bg-white border shadow-2xl flex items-center justify-between p-4 relative rounded-lg">
              <div className="w-full flex items-center">
                <BiLoaderCircle className="text-xl animate-spin duration-500 transition-all mx-6" />
                <h1>
                  Deleting{" "}
                  <span className="animate-pulse duration-500 transition-all">
                    ...
                  </span>
                </h1>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {editForm && (
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex rounded-md items-center justify-center z-50 p-4">
            <div className="flex justify-center w-full max-w-2xl rounded-md">
              <div className="bg-white rounded-xl shadow-2xl w-full flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Edit User Profile
                      </h2>
                      <p className="text-gray-500 text-sm mt-1">
                        Update the user information
                      </p>
                    </div>
                    <button
                      onClick={() => setEditForm(false)}
                      className="text-gray-400 hover:text-gray-500 transition-colors p-1 -mr-1"
                    >
                      <IoClose className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <form onSubmit={handleSubmitEdit(editUser)}>
                    <div className="p-6 space-y-6">
                      <div className="space-y-6">
                        <h3 className="text-base font-medium text-gray-900">
                          Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              First Name
                            </label>
                            <Controller
                              name="firstName"
                              control={controlEdit}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="John"
                                />
                              )}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Last Name
                            </label>
                            <Controller
                              name="lastName"
                              control={controlEdit}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Doe"
                                />
                              )}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Date of Birth
                            </label>
                            <Controller
                              name="dob"
                              control={controlEdit}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="date"
                                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                              )}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Phone Number
                            </label>
                            <Controller
                              name="phoneNumber"
                              control={controlEdit}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="tel"
                                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="+1 (555) 123-4567"
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-base font-medium text-gray-900">
                          Account Information
                        </h3>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Email Address
                          </label>
                          <Controller
                            name="email"
                            control={controlEdit}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="email"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="user@example.com"
                              />
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              User Role
                            </label>
                            <Controller
                              name="role"
                              control={controlEdit}
                              render={({ field }) => (
                                <select
                                  {...field}
                                  onChange={(e) => {
                                    setUserRole(e.target.value);
                                    field.onChange(e.target.value);
                                  }}
                                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="">Select role</option>
                                  <option value="Super Admin">
                                    Super Admin
                                  </option>
                                  <option value="Gym Admin">Gym Admin</option>
                                  <option value="Operation Manager">
                                    Operation Manager
                                  </option>
                                  <option value="Developer">Developer</option>
                                  <option value="CEO">CEO</option>
                                  <option value="HR Manager">HR Manager</option>
                                </select>
                              )}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Account Status
                            </label>
                            <Controller
                              name="approval"
                              control={controlEdit}
                              render={({ field }) => (
                                <select
                                  {...field}
                                  onChange={(e) => {
                                    setUserApproval(e.target.value);
                                    field.onChange(e.target.value);
                                  }}
                                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="">Select status</option>
                                  <option value="Approved">Approved</option>
                                  <option value="Rejected">Rejected</option>
                                  <option value="Pending">Pending</option>
                                  <option value="Blocked">Blocked</option>
                                </select>
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-base font-medium text-gray-900">
                          Address Information
                        </h3>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Street Address
                          </label>
                          <Controller
                            name="address"
                            control={controlEdit}
                            render={({ field }) => (
                              <input
                                {...field}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="123 Main St, City, Country"
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 border-t border-gray-200 sticky bottom-0 bg-white rounded-b-xl">
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setEditForm(false)}
                          className="min-w-[100px] px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="min-w-[100px] px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          disabled={isSubmittingEdit}
                        >
                          {isSubmittingEdit ? (
                            <>
                              <LuLoaderCircle className="mr-2 h-4 w-4 animate-spin inline" />
                              Saving...
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {activeTab === "manage" ? (
          // Manage Users Tab
          <div className="w-full space-y-4">
            {/* Controls Section */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">
                      Show
                    </span>
                    <select
                      value={limit}
                      onChange={(e) => setLimit(Number(e.target.value))}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="15">15</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value={totalUsers}>All</option>
                    </select>
                    <span className="text-sm font-medium text-gray-600">
                      users
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>
                </div>

                <div className="relative w-full md:w-auto min-w-[250px]">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IoSearch className="text-gray-400" />
                  </div>
                  <input
                    className="pl-10 w-full py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

            {/* User Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedUsers.length > 0 ? (
                      paginatedUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                                {user.firstName.charAt(0)}
                                {user.lastName.charAt(0)}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  ID: {user._id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user.role}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user.phoneNumber || "-"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.approval === "Approved"
                                  ? "bg-green-100 text-green-800"
                                  : user.approval === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : user.approval === "Rejected"
                                  ? "bg-red-100 text-red-800"
                                  : user.approval === "Blocked"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {user.approval}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              {user.approval === "Pending" && (
                                <>
                                  <button
                                    onClick={() => approveUser(user._id)}
                                    className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
                                    title="Approve user"
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => rejectUser(user._id)}
                                    className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                                    title="Reject user"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => fetchSingleUser(user._id)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                                title="Edit user"
                              >
                                <FaUserEdit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteUser(user._id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                                title="Delete user"
                              >
                                <MdDelete className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center">
                          <div className="text-gray-500 py-8">
                            <FiUsers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-sm font-medium text-gray-900">
                              No users found
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {searchQuery
                                ? "Try a different search term"
                                : "No users available"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing{" "}
                          <span className="font-medium">{startEntry}</span> to{" "}
                          <span className="font-medium">{endEntry}</span> of{" "}
                          <span className="font-medium">{totalUsers}</span>{" "}
                          results
                        </p>
                      </div>
                      <div>
                        <nav
                          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                          aria-label="Pagination"
                        >
                          <button
                            onClick={() =>
                              setCurrentPage(Math.max(1, currentPage - 1))
                            }
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>

                          {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => {
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }

                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    pageNum === currentPage
                                      ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            }
                          )}

                          <button
                            onClick={() =>
                              setCurrentPage(
                                Math.min(totalPages, currentPage + 1)
                              )
                            }
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Add New User Tab
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Add New User
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Create a new user account with the required information
                </p>
              </div>

              <form onSubmit={handleSubmitAdd(addUser)} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="First Name"
                      name="firstName"
                      icon={<User className="h-5 w-5 text-gray-400" />}
                      placeholder="Enter first name"
                      register={registerAdd}
                      validation={{
                        required: "First name is required",
                        minLength: {
                          value: 2,
                          message: "First name must be at least 2 characters",
                        },
                      }}
                      error={errorsAdd.firstName}
                    />
                    <FormField
                      label="Last Name"
                      name="lastName"
                      icon={<User className="h-5 w-5 text-gray-400" />}
                      placeholder="Enter last name"
                      register={registerAdd}
                      validation={{
                        required: "Last name is required",
                        minLength: {
                          value: 2,
                          message: "Last name must be at least 2 characters",
                        },
                      }}
                      error={errorsAdd.lastName}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Date of Birth"
                      name="dob"
                      type="date"
                      icon={<Calendar className="h-5 w-5 text-gray-400" />}
                      register={registerAdd}
                      validation={{
                        required: "Date of birth is required",
                      }}
                      error={errorsAdd.dob}
                    />
                    <FormField
                      label="Phone Number"
                      name="phoneNumber"
                      type="tel"
                      icon={<Phone className="h-5 w-5 text-gray-400" />}
                      placeholder="Enter phone number"
                      register={registerAdd}
                      validation={{
                        required: "Phone number is required",
                        pattern: {
                          value: /^[\+]?[1-9][\d]{0,15}$/,
                          message: "Please enter a valid phone number",
                        },
                      }}
                      error={errorsAdd.phoneNumber}
                    />
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    Account Information
                  </h3>
                  <FormField
                    label="Email Address"
                    name="email"
                    type="email"
                    icon={<AtSign className="h-5 w-5 text-gray-400" />}
                    placeholder="Enter email address"
                    register={registerAdd}
                    validation={{
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Please enter a valid email address",
                      },
                    }}
                    error={errorsAdd.email}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Password"
                      name="password"
                      type="password"
                      icon={<Lock className="h-5 w-5 text-gray-400" />}
                      placeholder="Enter password"
                      register={registerAdd}
                      validation={{
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                        pattern: {
                          value:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                          message:
                            "Password must contain uppercase, lowercase, number, and special character",
                        },
                      }}
                      error={errorsAdd.password}
                    />
                    <FormField
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      icon={<Lock className="h-5 w-5 text-gray-400" />}
                      placeholder="Confirm password"
                      register={registerAdd}
                      validation={{
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === watchPassword || "Passwords do not match",
                      }}
                      error={errorsAdd.confirmPassword}
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    Address Information
                  </h3>
                  <FormField
                    label="Street Address"
                    name="address"
                    icon={<MapPin className="h-5 w-5 text-gray-400" />}
                    placeholder="Enter street address"
                    register={registerAdd}
                    validation={{
                      required: "Address is required",
                      minLength: {
                        value: 10,
                        message: "Address must be at least 10 characters",
                      },
                    }}
                    error={errorsAdd.address}
                  />
                </div>

                {/* Form Actions */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        resetAdd();
                        setActiveTab("manage");
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingAdd}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingAdd ? (
                        <>
                          <LuLoaderCircle className="mr-2 h-4 w-4 animate-spin inline" />
                          Creating User...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4 inline" />
                          Create User
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
