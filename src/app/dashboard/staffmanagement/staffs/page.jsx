"use client";

import { AiOutlineHome } from "react-icons/ai";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RiUserAddFill } from "react-icons/ri";
import { Dumbbell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MdContactEmergency } from "react-icons/md";
import { MdSecurity } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";
import { FaLocationDot } from "react-icons/fa6";
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { FiUser } from "react-icons/fi";
import { toast as toastMessage } from "react-hot-toast";
import { IoSearch } from "react-icons/io5";
import { useUser } from "@/components/Providers/LoggedInUserProvider.jsx";
import Pagination from "@/components/ui/CustomPagination.jsx";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdDelete, MdClose } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { PlusCircle } from "lucide-react";
import { TiUserAdd } from "react-icons/ti";
import Loader from "@/components/Loader/Loader.jsx";
import { useRouter } from "next/navigation.js";
import { useEffect } from "react";
import EditStaffDetails from "./editStaffDetails";

const StaffManagement = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    setValue,
    setError,
    clearErrors,
    watch,
  } = useForm();

  const [shifts, setShifts] = useState([
    { id: 1, role: "", type: "", checkIn: "", checkOut: "" },
  ]);
  const numberOfShifts = watch("numberOfShifts") || 1;

  // Update shifts array when number of shifts changes
  useEffect(() => {
    const shiftCount = parseInt(numberOfShifts, 10);
    if (!isNaN(shiftCount) && shiftCount > 0) {
      // Preserve existing shift data when possible
      if (shiftCount > shifts.length) {
        // Add new shifts
        const newShifts = [...shifts];
        for (let i = shifts.length + 1; i <= shiftCount; i++) {
          newShifts.push({ id: i, type: "", checkIn: "", checkOut: "" });
        }
        setShifts(newShifts);
      } else if (shiftCount < shifts.length) {
        // Remove excess shifts
        setShifts(shifts.slice(0, shiftCount));
      }
    }
  }, [numberOfShifts]);

  // Update form values when shifts change
  useEffect(() => {
    shifts.forEach((shift, index) => {
      setValue(`shift_${index + 1}_type`, shift.type);
      setValue(`shift_${index + 1}_checkIn`, shift.checkIn);
      setValue(`shift_${index + 1}_checkOut`, shift.checkOut);
    });
  }, [shifts, setValue]);

  // Handle shift type change
  const handleShiftRoleChange = (index, value) => {
    const updatedShifts = [...shifts];
    updatedShifts[index].role = value;
    setShifts(updatedShifts);
    setValue(`shift_${index + 1}_role`, value);
    clearErrors(`shift_${index + 1}_role`);
  };

  const handleShiftTypeChange = (index, value) => {
    const updatedShifts = [...shifts];
    updatedShifts[index].type = value;
    setShifts(updatedShifts);
    setValue(`shift_${index + 1}_type`, value);
    clearErrors(`shift_${index + 1}_type`);
  };

  // Handle check-in time change
  const handleCheckInChange = (index, value) => {
    const updatedShifts = [...shifts];
    updatedShifts[index].checkIn = value;
    setShifts(updatedShifts);
    setValue(`shift_${index + 1}_checkIn`, value);
    clearErrors(`shift_${index + 1}_checkIn`);
  };

  // Handle check-out time change
  const handleCheckOutChange = (index, value) => {
    const updatedShifts = [...shifts];
    updatedShifts[index].checkOut = value;
    setShifts(updatedShifts);
    setValue(`shift_${index + 1}_checkOut`, value);
    clearErrors(`shift_${index + 1}_checkOut`);
  };

  const { user, loading } = useUser();
  const checkMultiBranchSupport = user?.user?.companyBranch;
  const [selectedBranch, setSelectedBranch] = useState("");
  const router = useRouter();

  // States
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [currentStaffId, setCurrentStaffId] = useState();
  const [searchQuery, setSearchQuery] = useState();

  const queryclient = useQueryClient();
  const [openForm, setOpenForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [showAddressDetails, setShowAddressDetails] = useState(false);
  const [showShiftDetails, setShowShiftDetails] = useState(false);

  const [editStaff, setEditStaff] = useState(false);
  const [staffDetails, setStaffDetails] = useState(null);

  const totalSteps = 5;

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState();

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };
  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const getUserRelatedBranch = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/gymbranch/tenant/${user?.user?.company?._id}`
      );
      const responseBody = await response.json();
      return responseBody;
    } catch (error) {
      console.log("Error: ", error);
      toastMessage.error(error.message);
    }
  };

  const { data: userRelatedBranch } = useQuery({
    queryKey: ["userRelatedBranch"],
    queryFn: getUserRelatedBranch,
    enabled: !!user?.user?.company?._id,
  });

  const { branches } = userRelatedBranch || {};

  // Get branch name
  const getBranchName = (staffId) => {
    const branch = branches.find((branch) =>
      branch.gymBranchStaffs?.includes(staffId)
    );
    return branch?.gymBranchName || "N/A";
  };

  const getBadge = (status) => {
    switch (status) {
      case "Active":
        return (
          <Badge
            variant="default"
            className="bg-green-500 text-white dark:bg-green-600 hover:bg-green-600"
          >
            Active
          </Badge>
        );
      case "Inactive":
        return (
          <Badge
            variant="destructive"
            className="bg-red-500 text-white dark:bg-red-600 hover:bg-red-600"
          >
            Inactive
          </Badge>
        );
      case "On Leave":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-500 text-white dark:bg-blue-600 hover:bg-blue-700"
          >
            OnLeave
          </Badge>
        );
      default:
        return <Badge variant="default">Active</Badge>;
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, limit]);

  // Functions
  const fetchAllStaffs = async ({ queryKey }) => {
    const [, page, searchQuery, limit] = queryKey;
    try {
      const response = await fetch(
        `http://localhost:3000/api/staffsmanagement?page=${page}&limit=${limit}&staffSearchQuery=${searchQuery}`
      );
      const responseBody = await response.json();
      if (!response.ok) {
        toastMessage.error(responseBody.message);
        router.push(responseBody.redirect);
      }
      return responseBody;
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["staffs", currentPage, debouncedSearchQuery || "", limit],
    queryFn: fetchAllStaffs,
    enabled: !!user?.user._id,
  });

  const {
    staffs,
    totalPages,
    totalStaffs,
    gymAdmins,
    gymTrainers,
    personalTrainers,
  } = data || {};

  const startEntry = (currentPage - 1) * limit + 1;
  const endEntry = Math.min(currentPage * limit, totalStaffs);

  const handleSubmitStaff = async (data) => {
    // destructure numberOfShifts for destructuring shift object
    const shifts = {};
    const { numberOfShifts } = data;

    for (let i = 1; i <= numberOfShifts; i++) {
      shifts[`shift_${i}_role`] = data[`shift_${i}_role`] || "";
      shifts[`shift_${i}_checkIn`] = data[`shift_${i}_checkIn`] || "";
      shifts[`shift_${i}_checkOut`] = data[`shift_${i}_checkOut`] || "";
      shifts[`shift_${i}_type`] = data[`shift_${i}_type`] || "";
    }

    // destructure fields from data
    const {
      fullName,
      dob,
      gender,
      contactNo,
      email,
      currentAddress,
      permanentAddress,
      role,
      joinedDate,
      salary,
      status,
      username,
      password,
      emergencyContactName,
      emergencyContactNo,
      relationship,
    } = data;

    const finalData = {
      fullName,
      dob,
      gender,
      contactNo,
      email,
      currentAddress,
      permanentAddress,
      role,
      joinedDate,
      numberOfShifts,
      salary,
      status,
      shifts,
      username,
      password,
      emergencyContactName,
      emergencyContactNo,
      relationship,
      selectedBranch,
    };

    try {
      const url = currentStaffId
        ? `http://localhost:3000/api/staffsmanagement/changedetails/${currentStaffId}`
        : "http://localhost:3000/api/staffsmanagement/create";

      const method = currentStaffId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });
      const responseBody = await response.json();
      if (response.ok) {
        setOpenForm(false);
        toastMessage.success(responseBody.message);
        queryclient.invalidateQueries(["staffs"]);
      } else {
        toastMessage.error(responseBody.message || "Unauthorized action");
      }
    } catch (error) {
      console.log("Error message: ", error.message);
      toastMessage.error(error.message || "Unauthorized action");
    }
  };

  const deleteStaff = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/staffsmanagement/remove/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseBody = await response.json();

      if (response.ok) {
        toastMessage.success(responseBody.message);
        queryclient.invalidateQueries(["staffs"]);
      }

      if (!response.ok && response.status === 403) {
        toastMessage.error(responseBody.message);
      }
    } catch (error) {
      console.log("Error: ", error);
      toastMessage.error(error.message || "Unauthorized action");
    }
  };

  const editStaffDetails = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/staffsmanagement/${id}`
      );
      const responseBody = await response.json();
      if (response.ok) {
        setEditStaff(true);
        setStaffDetails(responseBody);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const populateAddressDetails = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/staffsmanagement/${id}`
      );
      const responseBody = await response.json();
      if (response.ok) {
        setShowAddressDetails(true);
      }

      // set current address value
      setValue(
        "currentAddress.street",
        responseBody.staff.permanentAddress.street
      );
      setValue("currentAddress.city", responseBody.staff.permanentAddress.city);
      setValue(
        "currentAddress.state",
        responseBody.staff.permanentAddress.state
      );
      setValue(
        "currentAddress.postalCode",
        responseBody.staff.permanentAddress.postalCode
      );
      setValue(
        "currentAddress.country",
        responseBody.staff.permanentAddress.country
      );

      // set permanent address value
      setValue(
        "permanentAddress.street",
        responseBody.staff.permanentAddress.street
      );
      setValue(
        "permanentAddress.city",
        responseBody.staff.permanentAddress.city
      );
      setValue(
        "permanentAddress.state",
        responseBody.staff.permanentAddress.state
      );
      setValue(
        "permanentAddress.postalCode",
        responseBody.staff.permanentAddress.postalCode
      );
      setValue(
        "permanentAddress.country",
        responseBody.staff.permanentAddress.country
      );
    } catch (error) {
      toastMessage.error("Something went wrong!");
    }
  };

  const populateShiftDetails = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/staffsmanagement/${id}`
      );
      const responseBody = await response.json();

      if (response.ok) {
        const dbShifts = responseBody.staff.shifts;

        if (dbShifts) {
          // Convert shifts object into an array
          const shiftArray = Object.keys(dbShifts)
            .filter((key) => key.includes("shift_"))
            .reduce((acc, key) => {
              const match = key.match(/shift_(\d+)_(\w+)/);
              if (match) {
                const index = parseInt(match[1]) - 1;
                const field = match[2];

                if (!acc[index]) acc[index] = {};
                acc[index][field] = dbShifts[key];
              }
              return acc;
            }, []);

          setShifts(shiftArray);
          setShowShiftDetails(true);
        }
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="w-full">
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full">
          <div
            className="w-full bg-gray-100 dark:bg-gray-900 px-4 py-6"
            onClick={() => {
              setShowAddressDetails(false);
              setShowShiftDetails(false);
            }}
          >
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="flex items-center gap-1">
                    <AiOutlineHome className="h-4 w-4 mr-2 font-bold" />
                    <span className="text-sm font-medium">Home</span>
                  </BreadcrumbLink>
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
                  <BreadcrumbLink className="font-semibold">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink className="font-semibold">
                    Staff Management
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Render staff details edit form */}
            {editStaff && (
              <EditStaffDetails
                staff={staffDetails}
                editStaff={editStaff}
                setEditStaff={setEditStaff}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 my-4 lg:grid-cols-4 gap-4">
              <Card className="bg-white dark:bg-gray-800 dark:border-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Staff
                  </CardTitle>
                  <Dumbbell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {staffs ? staffs.length : "Null"}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 dark:border-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Gym Admins
                  </CardTitle>
                  <Dumbbell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {gymAdmins ? gymAdmins.length : "Null"}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 dark:border-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Personal Trainers
                  </CardTitle>
                  <Dumbbell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {personalTrainers ? personalTrainers.length : "Null"}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 dark:border-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Gym Trainers
                  </CardTitle>
                  <Dumbbell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {gymTrainers ? gymTrainers.length : "Null"}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="w-full flex justify-center">
              <div className="w-full border bg-white dark:bg-gray-800 dark:border-none rounded-lg">
                <div className="w-full md:flex justify-between items-center px-4">
                  <div className="w-full md:w-6/12 flex py-2 md:py-0 items-center gap-3 rounded-lg">
                    <h1 className="text-sm font-semibold dark:text-gray-400 text-gray-700">
                      Show
                    </h1>
                    <select
                      onChange={(e) => setLimit(Number(e.target.value))}
                      className="px-3 py-1 border border-gray-300 dark:bg-gray-900 dark:text-white dark:border-blue-500 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="15">15</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value={totalStaffs}>All</option>
                    </select>
                    <h1 className="text-sm font-semibold dark:text-gray-400 text-gray-700">
                      staffs
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      Selected Limit: {limit}
                    </p>
                  </div>
                  <div className="w-full md:w-6/12 flex bg-white dark:bg-gray-900 dark:border-none items-center border rounded-lg active:border-indigo-600 px-4 my-2">
                    <IoSearch className="h-5 w-5 text-gray-700 dark:text-gray-400" />
                    <Input
                      className="rounded-none border-none dark:text-white bg-transparent"
                      placeholder="Search staffs..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div className="w-full flex justify-between items-start">
                  <div className="w-full bg-white">
                    <div className="w-full">
                      <div className="w-full overflow-x-auto">
                        {isLoading ? (
                          <Loader />
                        ) : (
                          <div className="w-full flex justify-center">
                            {loading ? (
                              <Loader />
                            ) : (
                              <div className="w-full">
                                <div className="w-full bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                  {/* Table Header with gradient background */}
                                  <div className="flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 px-6 py-4">
                                    <div>
                                      <h2 className="text-xl font-semibold text-white">
                                        Staff Management
                                      </h2>
                                      <p className="text-indigo-100 text-xs mt-1 font-medium">
                                        Manage your team members and their
                                        details
                                      </p>
                                    </div>
                                    <Button
                                      className="rounded-sm bg-white dark:bg-gray-800 text-black hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-100"
                                      onClick={() => {
                                        reset();
                                        setOpenForm(!openForm);
                                      }}
                                    >
                                      <RiUserAddFill className="h-6 w-6 text-black dark:text-gray-100" />
                                      Add New Staff
                                    </Button>
                                  </div>

                                  {/* Table Container with custom scrollbar */}
                                  <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                                    <Table className="w-full">
                                      <TableHeader>
                                        <TableRow className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                          <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">
                                            Avatar
                                          </TableHead>
                                          <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-left">
                                            Name
                                          </TableHead>
                                          <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-center">
                                            Contact Info
                                          </TableHead>
                                          {branches && (
                                            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-center">
                                              Branch
                                            </TableHead>
                                          )}
                                          <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-center">
                                            Address
                                          </TableHead>
                                          <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-center">
                                            Shifts
                                          </TableHead>
                                          <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-center">
                                            Schedule
                                          </TableHead>
                                          <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-center">
                                            Joined
                                          </TableHead>
                                          <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-center">
                                            Status
                                          </TableHead>
                                          <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-center">
                                            Role
                                          </TableHead>
                                          {user &&
                                          user.user.role === "Gym Admin" ? (
                                            <></>
                                          ) : (
                                            <TableHead className="text-gray-700 dark:text-gray-300 font-semibold py-4 text-center">
                                              Actions
                                            </TableHead>
                                          )}
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {Array.isArray(staffs) &&
                                        staffs.length > 0 ? (
                                          staffs?.map((staff, index) => (
                                            <TableRow
                                              key={staff._id}
                                              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all duration-200 group"
                                            >
                                              <TableCell className="py-4">
                                                <div className="flex items-center gap-3">
                                                  <div className="relative">
                                                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold w-12 h-12 flex items-center justify-center rounded-full shadow-lg ring-2 ring-white dark:ring-gray-800 group-hover:scale-105 transition-transform duration-200">
                                                      {(() => {
                                                        const nameParts =
                                                          staff.fullName
                                                            .trim()
                                                            .split(" ");
                                                        const firstInitial =
                                                          nameParts[0]
                                                            ?.charAt(0)
                                                            .toUpperCase() ||
                                                          "";
                                                        const secondInitial =
                                                          nameParts[1]
                                                            ?.charAt(0)
                                                            .toUpperCase() ||
                                                          "";
                                                        return (
                                                          firstInitial +
                                                          secondInitial
                                                        );
                                                      })()}
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                                                  </div>
                                                </div>
                                              </TableCell>
                                              <TableCell className="py-4">
                                                <div className="flex flex-col">
                                                  <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                                                    {staff.fullName}
                                                  </span>
                                                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    ID: {staff._id.slice(-6)}
                                                  </span>
                                                </div>
                                              </TableCell>
                                              <TableCell className="py-4">
                                                <div className="flex flex-col items-center gap-1">
                                                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                                      📱
                                                    </span>
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                      {staff.contactNo}
                                                    </span>
                                                  </div>
                                                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                                      📧
                                                    </span>
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
                                                      {staff.email}
                                                    </span>
                                                  </div>
                                                </div>
                                              </TableCell>
                                              {branches && (
                                                <TableCell className="py-4 text-center">
                                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                    {getBranchName(staff._id)}
                                                  </span>
                                                </TableCell>
                                              )}
                                              <TableCell className="py-4 text-center">
                                                <button
                                                  onClick={() =>
                                                    populateAddressDetails(
                                                      staff._id
                                                    )
                                                  }
                                                  className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors duration-200 cursor-pointer border border-indigo-200 dark:border-indigo-800"
                                                >
                                                  <span className="text-xs">
                                                    📍
                                                  </span>
                                                  View
                                                </button>
                                              </TableCell>
                                              <TableCell className="py-4 text-center">
                                                <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-bold rounded-full text-sm shadow-lg">
                                                  {staff.numberOfShifts}
                                                </div>
                                              </TableCell>
                                              <TableCell className="py-4 text-center">
                                                <button
                                                  className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg transition-colors duration-200 cursor-pointer border border-purple-200 dark:border-purple-800"
                                                  onClick={() =>
                                                    populateShiftDetails(
                                                      staff._id
                                                    )
                                                  }
                                                >
                                                  <span className="text-xs">
                                                    🕒
                                                  </span>
                                                  Details
                                                </button>
                                              </TableCell>
                                              <TableCell className="py-4 text-center">
                                                <div className="flex flex-col items-center">
                                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {new Date(
                                                      staff.joinedDate
                                                    ).toLocaleDateString(
                                                      "en-US",
                                                      {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                      }
                                                    )}
                                                  </span>
                                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {Math.floor(
                                                      (new Date() -
                                                        new Date(
                                                          staff.joinedDate
                                                        )) /
                                                        (1000 * 60 * 60 * 24)
                                                    )}{" "}
                                                    days ago
                                                  </span>
                                                </div>
                                              </TableCell>
                                              <TableCell className="py-4 text-center">
                                                <div className="flex justify-center">
                                                  {getBadge(staff.status)}
                                                </div>
                                              </TableCell>
                                              <TableCell className="py-4 text-center">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 dark:from-amber-900/30 dark:to-orange-900/30 dark:text-amber-200 ring-1 ring-amber-200 dark:ring-amber-800">
                                                  {staff.role}
                                                </span>
                                              </TableCell>
                                              <TableCell className="py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                  {user &&
                                                  user.user.role ===
                                                    "Gym Admin" ? (
                                                    <></>
                                                  ) : (
                                                    <>
                                                      <button
                                                        className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-all duration-200 group/btn"
                                                        onClick={() =>
                                                          editStaffDetails(
                                                            staff._id
                                                          )
                                                        }
                                                      >
                                                        <FaUserEdit className="text-lg group-hover/btn:scale-110 transition-transform" />
                                                      </button>
                                                      <AlertDialog>
                                                        <AlertDialogTrigger
                                                          asChild
                                                        >
                                                          <button className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-all duration-200 group/btn">
                                                            <MdDelete className="text-lg group-hover/btn:scale-110 transition-transform" />
                                                          </button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl">
                                                          <AlertDialogHeader>
                                                            <AlertDialogTitle className="text-gray-900 dark:text-gray-100 text-lg font-semibold">
                                                              Are you absolutely
                                                              sure?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                                                              This action cannot
                                                              be undone. This
                                                              will permanently
                                                              delete the staff
                                                              account and remove
                                                              all data from our
                                                              servers.
                                                            </AlertDialogDescription>
                                                          </AlertDialogHeader>
                                                          <AlertDialogFooter className="gap-2">
                                                            <AlertDialogCancel className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600">
                                                              Cancel
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                              onClick={() =>
                                                                deleteStaff(
                                                                  staff._id
                                                                )
                                                              }
                                                              className="bg-red-600 hover:bg-red-700 text-white"
                                                            >
                                                              Continue
                                                            </AlertDialogAction>
                                                          </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                      </AlertDialog>
                                                    </>
                                                  )}
                                                </div>
                                              </TableCell>
                                            </TableRow>
                                          ))
                                        ) : (
                                          <TableRow>
                                            <TableCell
                                              colSpan={14}
                                              className="text-center py-12"
                                            >
                                              <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                                  <span className="text-2xl text-gray-400 dark:text-gray-600">
                                                    👥
                                                  </span>
                                                </div>
                                                <div>
                                                  <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                                    No staff found
                                                  </p>
                                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    Add your first team member
                                                    to get started
                                                  </p>
                                                </div>
                                              </div>
                                            </TableCell>
                                          </TableRow>
                                        )}
                                      </TableBody>
                                      <TableFooter>
                                        <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700">
                                          <TableCell
                                            colSpan={
                                              user &&
                                              user.user.role === "Gym Admin"
                                                ? 10
                                                : 11
                                            }
                                            className="px-6 py-4"
                                          >
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">
                                                      👥
                                                    </span>
                                                  </div>
                                                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                                                    Total Staff Members
                                                  </span>
                                                </div>
                                                <div className="bg-indigo-100 dark:bg-indigo-900/30 px-4 py-2 rounded-full">
                                                  <span className="font-bold text-indigo-800 dark:text-indigo-200 text-lg">
                                                    {totalStaffs}
                                                  </span>
                                                </div>
                                              </div>
                                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                                Last updated:{" "}
                                                {new Date().toLocaleTimeString()}
                                              </div>
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                      </TableFooter>
                                    </Table>
                                  </div>
                                </div>
                                <style jsx>{`
                                  .scrollbar-thin::-webkit-scrollbar {
                                    height: 8px;
                                  }

                                  .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
                                    background-color: #d1d5db;
                                    border-radius: 4px;
                                  }

                                  .dark
                                    .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
                                    background-color: #4b5563;
                                  }

                                  .scrollbar-track-transparent::-webkit-scrollbar-track {
                                    background: transparent;
                                  }

                                  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                                    background-color: #9ca3af;
                                  }

                                  .dark
                                    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                                    background-color: #6b7280;
                                  }
                                `}</style>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="border-t border-gray-300 dark:bg-gray-900">
                        <div className="py-2 px-4 md:flex justify-between items-center dark:bg-gray-800 rounded-b-md dark:bg-gray-800 ">
                          <p className="font-medium text-center text-sm font-gray-700 dark:text-gray-100">
                            Showing{" "}
                            <span className="font-semibold text-sm font-gray-700">
                              {startEntry}
                            </span>{" "}
                            to{" "}
                            <span className="font-semibold text-sm font-gray-700">
                              {endEntry}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold">{totalStaffs}</span>{" "}
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
                    </div>
                  </div>

                  {/* Address Details Modal */}
                  {showAddressDetails && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-6xl max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 px-8 py-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white/20 rounded-lg">
                                <FaLocationDot className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h1 className="text-2xl font-bold text-white">
                                  Address Details
                                </h1>
                                <p className="text-indigo-100 text-sm mt-1">
                                  Current and permanent address information
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => setShowAddressDetails(false)}
                              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 group"
                            >
                              <MdClose className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
                            </button>
                          </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                          <form className="space-y-8">
                            <div className="grid lg:grid-cols-2 gap-8">
                              {/* Current Address Section */}
                              <div className="space-y-6">
                                <div className="border-l-4 border-indigo-500 pl-4">
                                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    Current Address
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Present residential information
                                  </p>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 space-y-4 border border-gray-200 dark:border-gray-700">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                      Street Address
                                    </Label>
                                    <Controller
                                      name="currentAddress.street"
                                      control={control}
                                      defaultValue=""
                                      render={({ field }) => (
                                        <Input
                                          {...field}
                                          placeholder="Enter street address"
                                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                        />
                                      )}
                                    />
                                    {errors.currentAddress?.street && (
                                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <span className="text-xs">⚠️</span>
                                        {errors.currentAddress.street.message}
                                      </p>
                                    )}
                                  </div>

                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                        City
                                      </Label>
                                      <Input
                                        {...register("currentAddress.city")}
                                        placeholder="Enter city"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                        State
                                      </Label>
                                      <Input
                                        {...register("currentAddress.state")}
                                        placeholder="Enter state"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                        Postal Code
                                      </Label>
                                      <Input
                                        {...register(
                                          "currentAddress.postalCode"
                                        )}
                                        placeholder="Enter postal code"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                        Country
                                      </Label>
                                      <Input
                                        {...register("currentAddress.country")}
                                        placeholder="Enter country"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Permanent Address Section */}
                              <div className="space-y-6">
                                <div className="border-l-4 border-purple-500 pl-4">
                                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    Permanent Address
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Permanent residential information
                                  </p>
                                </div>

                                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 space-y-4 border border-purple-200 dark:border-purple-800">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                      Street Address
                                    </Label>
                                    <Input
                                      {...register("permanentAddress.street")}
                                      placeholder="Enter street address"
                                      required
                                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                    />
                                  </div>

                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                        City
                                      </Label>
                                      <Input
                                        {...register("permanentAddress.city")}
                                        placeholder="Enter city"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                        State
                                      </Label>
                                      <Input
                                        {...register("permanentAddress.state")}
                                        placeholder="Enter state"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                        Postal Code
                                      </Label>
                                      <Input
                                        {...register(
                                          "permanentAddress.postalCode"
                                        )}
                                        placeholder="Enter postal code"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                        Country
                                      </Label>
                                      <Input
                                        {...register(
                                          "permanentAddress.country"
                                        )}
                                        placeholder="Enter country"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Shift Details Modal */}
                  {showShiftDetails && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-5xl max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 px-8 py-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white/20 rounded-lg">
                                <PlusCircle className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h2 className="text-2xl font-bold text-white">
                                  Shift Details
                                </h2>
                                <p className="text-emerald-100 text-sm mt-1">
                                  Schedule and timing information
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => setShowShiftDetails(false)}
                              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 group"
                            >
                              <MdClose className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
                            </button>
                          </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                          <form className="space-y-6">
                            {shifts.length > 0 ? (
                              shifts.map((shift, index) => (
                                <div
                                  key={index}
                                  className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                  <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold w-10 h-10 flex items-center justify-center rounded-full shadow-lg">
                                        {index + 1}
                                      </div>
                                      <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                          Shift {index + 1}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                          Daily schedule details
                                        </p>
                                      </div>
                                    </div>
                                    <div className="bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                                      <span className="text-xs font-medium text-emerald-800 dark:text-emerald-200">
                                        Active
                                      </span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <span className="text-blue-500">
                                          👤
                                        </span>
                                        Shift Role
                                      </Label>
                                      <div className="relative">
                                        <Input
                                          value={shift.role || ""}
                                          readOnly
                                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 cursor-default"
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                          <span className="text-xs text-gray-400">
                                            👔
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <span className="text-purple-500">
                                          📋
                                        </span>
                                        Shift Type
                                      </Label>
                                      <div className="relative">
                                        <Input
                                          value={shift.type || ""}
                                          readOnly
                                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 cursor-default"
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                          <span className="text-xs text-gray-400">
                                            ⚡
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <span className="text-green-500">
                                          🕐
                                        </span>
                                        Check In
                                      </Label>
                                      <div className="relative">
                                        <Input
                                          type="time"
                                          value={shift.checkIn || ""}
                                          readOnly
                                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 cursor-default"
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                          <span className="text-xs text-green-500">
                                            ▶️
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <span className="text-red-500">🕐</span>
                                        Check Out
                                      </Label>
                                      <div className="relative">
                                        <Input
                                          type="time"
                                          value={shift.checkOut || ""}
                                          readOnly
                                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 cursor-default"
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                          <span className="text-xs text-red-500">
                                            ⏹️
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Shift Duration Display */}
                                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-gray-600 dark:text-gray-400">
                                        Duration:{" "}
                                        {shift.checkIn && shift.checkOut
                                          ? (() => {
                                              const start = new Date(
                                                `2000-01-01T${shift.checkIn}`
                                              );
                                              const end = new Date(
                                                `2000-01-01T${shift.checkOut}`
                                              );
                                              const diff =
                                                (end - start) /
                                                (1000 * 60 * 60);
                                              return `${diff} hours`;
                                            })()
                                          : "Not calculated"}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          Shift #{index + 1}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-12">
                                <div className="flex flex-col items-center gap-4">
                                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                    <span className="text-3xl text-gray-400 dark:text-gray-600">
                                      📅
                                    </span>
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                      No shifts assigned
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                      This staff member doesn't have any shifts
                                      scheduled yet.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </form>
                        </div>
                      </div>
                    </div>
                  )}

                  {openForm && (
                    <>
                      <div className="fixed inset-0 bg-black bg-opacity-65 z-50"></div>
                      <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="w-full flex justify-center">
                          <div className="w-11/12 md:w-8/12 overflow-y-auto bg-white rounded-2xl shadow-2xl">
                            <div className="w-full flex justify-between bg-indigo-600 items-center py-2">
                              <h1 className="font-bold m-3 text-white text-md md:text-xl">
                                Staff Registration
                              </h1>
                              <MdClose
                                className="m-4 h-6 w-6 cursor-pointer text-white"
                                onClick={() => setOpenForm(!openForm)}
                              />
                            </div>
                            <div className="w-full md:flex md:justify-center md:items-center">
                              <form
                                className="w-full max-h-[90vh] p-4 transition-transform duration-500 overflow-y-auto"
                                onSubmit={handleSubmit(handleSubmitStaff)}
                              >
                                <div>
                                  {/* Progress bar */}
                                  <div className="mb-6 pt-4">
                                    <div className="h-2 bg-gray-200 rounded-full">
                                      <div
                                        className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                                        style={{
                                          width: `${
                                            (currentStep / totalSteps) * 100
                                          }%`,
                                        }}
                                      />
                                    </div>
                                    <div className="flex justify-between mt-2 text-sm text-gray-500">
                                      {Array.from({ length: totalSteps }).map(
                                        (_, idx) => (
                                          <div
                                            onClick={() =>
                                              setCurrentStep(idx + 1)
                                            }
                                            key={idx}
                                            className={`flex items-center cursor-pointer ${
                                              idx + 1 <= currentStep
                                                ? "text-black"
                                                : ""
                                            }`}
                                          >
                                            <CheckCircle2
                                              size={16}
                                              className="mr-1"
                                            />
                                            Step {idx + 1}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="rounded-md">
                                  <div className="grid grid-cols-1 gap-4">
                                    {currentStep === 1 && (
                                      <div>
                                        <div className="flex items-center space-x-2 mb-4">
                                          <FiUser className="w-6 h-6 text-indigo-500" />
                                          <h1 className="text-lg font-semibold text-indigo-500">
                                            Personal Information
                                          </h1>
                                        </div>

                                        <div className="grid border-b pb-4 border-indigo-500 grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                          <div>
                                            <Label>Full Name</Label>
                                            <Controller
                                              name="fullName"
                                              control={control}
                                              render={({ field }) => (
                                                <Input
                                                  {...field}
                                                  value={field.value}
                                                  {...register("fullName")}
                                                  onChange={(e) => {
                                                    field.onChange(e);
                                                  }}
                                                  className="rounded-md focus:outline-none"
                                                  placeholder="Full Name"
                                                />
                                              )}
                                            />

                                            {errors.fullName && (
                                              <p className="text-red-600 font-semibold text-sm">
                                                {errors.fullName.message}
                                              </p>
                                            )}
                                          </div>

                                          <div>
                                            <Label>Date Of Birth</Label>
                                            <Controller
                                              name="dob"
                                              control={control}
                                              render={({ field }) => (
                                                <Input
                                                  {...field}
                                                  value={field.value}
                                                  onChange={(e) => {
                                                    field.onChange(e);
                                                  }}
                                                  {...register("dob")}
                                                  type="date"
                                                  className="rounded-md focus:outline-none"
                                                />
                                              )}
                                            />
                                            {errors.dob && (
                                              <p className="text-red-600 font-semibold text-sm">
                                                {errors.dob.message}
                                              </p>
                                            )}
                                          </div>

                                          <div>
                                            <Label>Gender</Label>
                                            <Controller
                                              name="gender"
                                              control={control}
                                              render={({ field }) => (
                                                <select
                                                  {...field}
                                                  value={field.value}
                                                  onChange={(e) => {
                                                    setValue(
                                                      "gender",
                                                      e.target.value
                                                    );
                                                    field.onChange(e);
                                                    clearErrors("gender");
                                                  }}
                                                  className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                                >
                                                  <option>Select</option>
                                                  <option value="Male">
                                                    Male
                                                  </option>
                                                  <option value="Female">
                                                    Female
                                                  </option>
                                                  <option value="Other">
                                                    Other
                                                  </option>
                                                </select>
                                              )}
                                            />
                                            {errors.gender && (
                                              <p className="text-red-600 font-semibold text-sm">
                                                {errors.gender.message}
                                              </p>
                                            )}
                                          </div>

                                          <div>
                                            <Label>Contact Number</Label>
                                            <Controller
                                              name="contactNo"
                                              control={control}
                                              render={({ field }) => (
                                                <Input
                                                  {...field}
                                                  value={field.value}
                                                  onChange={(e) => {
                                                    field.onChange(e);
                                                  }}
                                                  {...register("contactNo")}
                                                  className="rounded-md focus:outline-none"
                                                  placeholder="Contact Number"
                                                />
                                              )}
                                            />
                                            {errors.contactNo && (
                                              <p className="text-red-600 font-semibold text-sm">
                                                {errors.contactNo.message}
                                              </p>
                                            )}
                                          </div>

                                          <div>
                                            <Label>Email Address</Label>
                                            <Controller
                                              name="email"
                                              control={control}
                                              render={({ field }) => (
                                                <Input
                                                  {...field}
                                                  value={field.value}
                                                  {...register("email")}
                                                  onChange={(e) => {
                                                    field.onChange(e);
                                                  }}
                                                  className="rounded-md focus:outline-none"
                                                  placeholder="Email address"
                                                />
                                              )}
                                            />
                                            {errors.email && (
                                              <p className="text-red-600 font-semibold text-sm">
                                                {errors.email.message}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {currentStep === 2 && (
                                      <div>
                                        <div className="flex items-center space-x-2 mb-4">
                                          <FaLocationDot className="w-6 h-6 text-indigo-500" />
                                          <h1 className="text-lg font-semibold text-indigo-500">
                                            Address Details
                                          </h1>
                                        </div>

                                        <div className="w-full space-x-6 flex justify-between">
                                          {/* Current Address Section */}
                                          <div className="w-full border-b pb-4 border-indigo-500">
                                            <h3 className="text-md font-semibold mb-4">
                                              Current Address
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-4">
                                              <div>
                                                <Label>Street Address</Label>
                                                <Controller
                                                  name="currentAddress.street"
                                                  control={control}
                                                  defaultValue=""
                                                  render={({ field }) => (
                                                    <Input
                                                      {...field}
                                                      placeholder="Enter street address"
                                                      className="rounded-md focus:outline-none"
                                                    />
                                                  )}
                                                />
                                                {errors.currentAddress
                                                  ?.street && (
                                                  <p className="text-red-600 font-semibold text-sm">
                                                    {
                                                      errors.currentAddress
                                                        .street.message
                                                    }
                                                  </p>
                                                )}
                                              </div>
                                              <div>
                                                <Label>City</Label>
                                                <Input
                                                  {...register(
                                                    "currentAddress.city"
                                                  )}
                                                  placeholder="Enter city"
                                                  required
                                                />
                                              </div>
                                              <div>
                                                <Label>State</Label>
                                                <Input
                                                  {...register(
                                                    "currentAddress.state"
                                                  )}
                                                  placeholder="Enter state"
                                                  required
                                                />
                                              </div>
                                              <div>
                                                <Label>Postal Code</Label>
                                                <Input
                                                  {...register(
                                                    "currentAddress.postalCode"
                                                  )}
                                                  placeholder="Enter postal code"
                                                  required
                                                />
                                              </div>
                                              <div className="md:col-span-2">
                                                <Label>Country</Label>
                                                <Input
                                                  {...register(
                                                    "currentAddress.country"
                                                  )}
                                                  placeholder="Enter country"
                                                  required
                                                />
                                              </div>
                                            </div>
                                          </div>

                                          {/* Permanent Address Section */}
                                          <div className="w-full border-b pb-4 border-indigo-500">
                                            <h3 className="text-md font-semibold mb-4">
                                              Permanent Address
                                            </h3>
                                            <div className="grid md:grid-cols-2 gap-4">
                                              <div>
                                                <Label>Street Address</Label>
                                                <Input
                                                  {...register(
                                                    "permanentAddress.street"
                                                  )}
                                                  placeholder="Enter street address"
                                                  required
                                                />
                                              </div>
                                              <div>
                                                <Label>City</Label>
                                                <Input
                                                  {...register(
                                                    "permanentAddress.city"
                                                  )}
                                                  placeholder="Enter city"
                                                  required
                                                />
                                              </div>
                                              <div>
                                                <Label>State</Label>
                                                <Input
                                                  {...register(
                                                    "permanentAddress.state"
                                                  )}
                                                  placeholder="Enter state"
                                                  required
                                                />
                                              </div>
                                              <div>
                                                <Label>Postal Code</Label>
                                                <Input
                                                  {...register(
                                                    "permanentAddress.postalCode"
                                                  )}
                                                  placeholder="Enter postal code"
                                                  required
                                                />
                                              </div>
                                              <div className="md:col-span-2">
                                                <Label>Country</Label>
                                                <Input
                                                  {...register(
                                                    "permanentAddress.country"
                                                  )}
                                                  placeholder="Enter country"
                                                  required
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {currentStep === 3 && (
                                      <div>
                                        <div className="flex items-center space-x-2 mb-4">
                                          <TbListDetails className="w-6 h-6 text-indigo-500" />
                                          <h1 className="text-lg font-semibold text-indigo-500">
                                            Job Details
                                          </h1>
                                        </div>

                                        <div className="grid border-b border-indigo-500 pb-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                          <div>
                                            <Label>Role</Label>
                                            <Controller
                                              name="role"
                                              control={control}
                                              render={({ field }) => (
                                                <select
                                                  {...field}
                                                  value={field.value}
                                                  onChange={(e) => {
                                                    const selectedValue =
                                                      e.target.value;
                                                    setValue(
                                                      "role",
                                                      selectedValue
                                                    );
                                                    clearErrors("role");
                                                    field.onChange(
                                                      selectedValue
                                                    );
                                                  }}
                                                  className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                                >
                                                  <option>Select</option>
                                                  <option value="Super Admin">
                                                    Super Admin
                                                  </option>
                                                  <option value="Gym Admin">
                                                    Gym Admin
                                                  </option>
                                                  <option value="Floor Trainer">
                                                    Trainer
                                                  </option>
                                                  <option value="Personal Trainer">
                                                    Personal Trainer
                                                  </option>
                                                  <option value="Operational Manager">
                                                    Operational Manager
                                                  </option>
                                                  <option value="HR Manager">
                                                    HR Manager
                                                  </option>
                                                  <option value="CEO">
                                                    CEO
                                                  </option>
                                                  <option value="Developer">
                                                    Developer
                                                  </option>
                                                  <option value="Intern">
                                                    Intern
                                                  </option>
                                                </select>
                                              )}
                                            />
                                            {errors.role && (
                                              <p className="text-red-600 font-semibold text-sm">
                                                {errors.role.message}
                                              </p>
                                            )}
                                          </div>

                                          <div>
                                            <Label>Joined Date</Label>
                                            <Controller
                                              name="joinedDate"
                                              control={control}
                                              render={({ field }) => (
                                                <Input
                                                  {...field}
                                                  value={field.value}
                                                  onChange={(e) => {
                                                    field.onChange(e);
                                                  }}
                                                  {...register("joinedDate")}
                                                  type="date"
                                                  className="rounded-md focus:outline-none"
                                                />
                                              )}
                                            />
                                            {errors.joinedDate && (
                                              <p className="text-red-600 font-semibold text-sm">
                                                {errors.joinedDate.message}
                                              </p>
                                            )}
                                          </div>

                                          <div>
                                            <Label>No. Of Shifts</Label>
                                            <Controller
                                              name="numberOfShifts"
                                              control={control}
                                              render={({ field }) => (
                                                <Input
                                                  {...field}
                                                  type="number"
                                                  min="1"
                                                  max="5"
                                                  placeholder="Enter Number Of Shifts"
                                                  className="rounded-md focus:outline-none"
                                                  onChange={(e) => {
                                                    const value = Math.min(
                                                      Math.max(
                                                        parseInt(
                                                          e.target.value
                                                        ) || 1,
                                                        1
                                                      ),
                                                      5
                                                    );
                                                    field.onChange(value);
                                                    setValue(
                                                      "numberOfShifts",
                                                      value
                                                    );
                                                  }}
                                                />
                                              )}
                                            />
                                            {errors.numberOfShifts && (
                                              <p className="text-red-600 font-semibold text-sm">
                                                {errors.numberOfShifts.message}
                                              </p>
                                            )}
                                          </div>

                                          <div>
                                            <Label>Salary</Label>
                                            <Controller
                                              name="salary"
                                              control={control}
                                              render={({ field }) => (
                                                <Input
                                                  {...field}
                                                  value={field.value}
                                                  onChange={(e) => {
                                                    field.onChange(e);
                                                  }}
                                                  {...register("salary")}
                                                  type="text"
                                                  className="rounded-md focus:outline-none"
                                                  placeholder="Salary"
                                                />
                                              )}
                                            />
                                            {errors.salary && (
                                              <p className="text-red-600 font-semibold text-sm">
                                                {errors.salary.message}
                                              </p>
                                            )}
                                          </div>

                                          <div>
                                            <Label>Status</Label>
                                            <Controller
                                              name="status"
                                              control={control}
                                              render={({ field }) => (
                                                <select
                                                  {...field}
                                                  value={field.value}
                                                  onChange={(e) => {
                                                    const selectedValue =
                                                      e.target.value;
                                                    setValue(
                                                      "status",
                                                      selectedValue
                                                    );
                                                    clearErrors("status");
                                                    field.onChange(
                                                      selectedValue
                                                    );
                                                  }}
                                                  className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                                >
                                                  <option>Status</option>
                                                  <option value="Active">
                                                    Active
                                                  </option>
                                                  <option value="On Leave">
                                                    On Leave
                                                  </option>
                                                  <option value="Inactive">
                                                    Inactive
                                                  </option>
                                                </select>
                                              )}
                                            />
                                            {errors.status && (
                                              <p className="text-red-600 font-semibold text-sm">
                                                {errors.status.message}
                                              </p>
                                            )}
                                          </div>

                                          {checkMultiBranchSupport && (
                                            <div>
                                              <Label>Branch</Label>
                                              <Select
                                                onValueChange={(value) =>
                                                  setSelectedBranch(value)
                                                }
                                              >
                                                <SelectTrigger className="w-full">
                                                  <SelectValue placeholder="Select Branch" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectGroup>
                                                    <SelectLabel>
                                                      Branches
                                                    </SelectLabel>
                                                    {branches?.map((branch) => (
                                                      <SelectItem
                                                        value={branch._id}
                                                        key={branch._id}
                                                      >
                                                        {branch.gymBranchName}
                                                      </SelectItem>
                                                    ))}
                                                  </SelectGroup>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                          )}
                                        </div>

                                        {/* Dynamic Shifts Section */}
                                        <div className="mt-6 mb-4">
                                          <div className="flex items-center space-x-2 mb-4">
                                            <PlusCircle className="w-5 h-5 text-indigo-500" />
                                            <h2 className="text-lg font-semibold text-indigo-500">
                                              Shift Details
                                            </h2>
                                          </div>

                                          <div className="space-y-4">
                                            {shifts.map((shift, index) => (
                                              <div
                                                key={shift.id}
                                                className="p-4 border border-gray-200 rounded-md bg-gray-50"
                                              >
                                                <div className="flex justify-between items-center mb-3">
                                                  <h3 className="font-medium text-indigo-600">
                                                    Shift {index + 1}
                                                  </h3>
                                                </div>
                                                <div className="grid grid-cols-4 overflow-x-auto gap-4">
                                                  <div>
                                                    <Label>Shift Role</Label>
                                                    <Controller
                                                      name={`shift_${
                                                        index + 1
                                                      }_role`}
                                                      control={control}
                                                      defaultValue={shift.role}
                                                      render={({ field }) => (
                                                        <select
                                                          {...field}
                                                          value={field.value}
                                                          onChange={(e) => {
                                                            const selectedValue =
                                                              e.target.value;
                                                            handleShiftRoleChange(
                                                              index,
                                                              selectedValue
                                                            );
                                                            field.onChange(
                                                              selectedValue
                                                            );
                                                          }}
                                                          className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                                        >
                                                          <option>
                                                            Select
                                                          </option>
                                                          <option value="Super Admin">
                                                            Super Admin
                                                          </option>
                                                          <option value="Gym Admin">
                                                            Gym Admin
                                                          </option>
                                                          <option value="Floor Trainer">
                                                            Trainer
                                                          </option>
                                                          <option value="Personal Trainer">
                                                            Personal Trainer
                                                          </option>
                                                          <option value="Operational Manager">
                                                            Operational Manager
                                                          </option>
                                                          <option value="HR Manager">
                                                            HR Manager
                                                          </option>
                                                          <option value="CEO">
                                                            CEO
                                                          </option>
                                                          <option value="Developer">
                                                            Developer
                                                          </option>
                                                          <option value="Intern">
                                                            Intern
                                                          </option>
                                                        </select>
                                                      )}
                                                    />
                                                    {errors[
                                                      `shift_${index + 1}_role`
                                                    ] && (
                                                      <p className="text-red-600 font-semibold text-sm">
                                                        {
                                                          errors[
                                                            `shift_${
                                                              index + 1
                                                            }_role`
                                                          ].message
                                                        }
                                                      </p>
                                                    )}
                                                  </div>

                                                  <div>
                                                    <Label>Shift Type</Label>
                                                    <Controller
                                                      name={`shift_${
                                                        index + 1
                                                      }_type`}
                                                      control={control}
                                                      defaultValue={shift.type}
                                                      render={({ field }) => (
                                                        <select
                                                          {...field}
                                                          value={field.value}
                                                          onChange={(e) => {
                                                            const selectedValue =
                                                              e.target.value;
                                                            handleShiftTypeChange(
                                                              index,
                                                              selectedValue
                                                            );
                                                            field.onChange(
                                                              selectedValue
                                                            );
                                                          }}
                                                          className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                                        >
                                                          <option value="">
                                                            Select Shift
                                                          </option>
                                                          <option value="Morning">
                                                            Morning
                                                          </option>
                                                          <option value="Day">
                                                            Day
                                                          </option>
                                                          <option value="Evening">
                                                            Evening
                                                          </option>
                                                        </select>
                                                      )}
                                                    />
                                                    {errors[
                                                      `shift_${index + 1}_type`
                                                    ] && (
                                                      <p className="text-red-600 font-semibold text-sm">
                                                        {
                                                          errors[
                                                            `shift_${
                                                              index + 1
                                                            }_type`
                                                          ].message
                                                        }
                                                      </p>
                                                    )}
                                                  </div>

                                                  <div>
                                                    <Label>Check In</Label>
                                                    <Controller
                                                      name={`shift_${
                                                        index + 1
                                                      }_checkIn`}
                                                      control={control}
                                                      defaultValue={
                                                        shift.checkIn
                                                      }
                                                      render={({ field }) => (
                                                        <Input
                                                          {...field}
                                                          type="time"
                                                          value={field.value}
                                                          onChange={(e) => {
                                                            handleCheckInChange(
                                                              index,
                                                              e.target.value
                                                            );
                                                            field.onChange(e);
                                                          }}
                                                          className="rounded-md focus:outline-none"
                                                        />
                                                      )}
                                                    />
                                                    {errors[
                                                      `shift_${
                                                        index + 1
                                                      }_checkIn`
                                                    ] && (
                                                      <p className="text-red-600 font-semibold text-sm">
                                                        {
                                                          errors[
                                                            `shift_${
                                                              index + 1
                                                            }_checkIn`
                                                          ].message
                                                        }
                                                      </p>
                                                    )}
                                                  </div>

                                                  <div>
                                                    <Label>Check Out</Label>
                                                    <Controller
                                                      name={`shift_${
                                                        index + 1
                                                      }_checkOut`}
                                                      control={control}
                                                      defaultValue={
                                                        shift.checkOut
                                                      }
                                                      render={({ field }) => (
                                                        <Input
                                                          {...field}
                                                          type="time"
                                                          value={field.value}
                                                          onChange={(e) => {
                                                            handleCheckOutChange(
                                                              index,
                                                              e.target.value
                                                            );
                                                            field.onChange(e);
                                                          }}
                                                          className="rounded-md focus:outline-none"
                                                        />
                                                      )}
                                                    />
                                                    {errors[
                                                      `shift_${
                                                        index + 1
                                                      }_checkOut`
                                                    ] && (
                                                      <p className="text-red-600 font-semibold text-sm">
                                                        {
                                                          errors[
                                                            `shift_${
                                                              index + 1
                                                            }_checkOut`
                                                          ].message
                                                        }
                                                      </p>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {currentStep === 4 && (
                                      <div className="pb-4 border-b border-indigo-500">
                                        <div className="flex items-center space-x-2 mb-4">
                                          <MdSecurity className="w-6 h-6 text-indigo-500" />
                                          <h1 className="text-lg font-semibold text-indigo-500">
                                            Credentials
                                          </h1>
                                        </div>

                                        <div>
                                          <Label>Username</Label>
                                          <Controller
                                            name="username"
                                            control={control}
                                            render={({ field }) => (
                                              <Input
                                                {...field}
                                                value={field.value}
                                                onChange={(e) => {
                                                  field.onChange(e);
                                                }}
                                                {...register("username")}
                                                type="text"
                                                className="rounded-md focus:outline-none"
                                                placeholder="Username"
                                              />
                                            )}
                                          />
                                          {errors.username && (
                                            <p className="text-red-600 font-semibold text-sm">
                                              {errors.username.message}
                                            </p>
                                          )}
                                        </div>

                                        <div>
                                          <Label>Password</Label>
                                          <Controller
                                            name="password"
                                            control={control}
                                            render={({ field }) => (
                                              <Input
                                                {...field}
                                                value={field.value}
                                                onChange={(e) => {
                                                  field.onChange(e);
                                                }}
                                                {...register("password")}
                                                type="password"
                                                className="rounded-md focus:outline-none"
                                                placeholder="Password"
                                              />
                                            )}
                                          />
                                          {errors.password && (
                                            <p className="text-red-600 font-semibold text-sm">
                                              {errors.password.message}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {currentStep === 5 && (
                                      <div className="border-b pb-4 border-indigo-500">
                                        <div className="flex items-center space-x-2 mb-4">
                                          <MdContactEmergency className="w-6 h-6 text-indigo-500" />
                                          <h1 className="text-lg font-semibold text-indigo-500">
                                            Emergency Details
                                          </h1>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div>
                                            <Label>
                                              Emergency Contact Name
                                            </Label>
                                            <Controller
                                              name="emergencyContactName"
                                              control={control}
                                              render={({ field }) => (
                                                <Input
                                                  {...field}
                                                  value={field.value}
                                                  onChange={(e) => {
                                                    field.onChange(e);
                                                  }}
                                                  {...register(
                                                    "emergencyContactName"
                                                  )}
                                                  className="rounded-md focus:outline-none"
                                                  placeholder="Emergency Contact Name"
                                                />
                                              )}
                                            />
                                            {errors.emergencyContactName && (
                                              <p className="text-red-600 font-semibold text-sm">
                                                {
                                                  errors.emergencyContactName
                                                    .message
                                                }
                                              </p>
                                            )}

                                            <div className="my-2">
                                              <Label>
                                                Emergency Contact Number
                                              </Label>
                                              <Controller
                                                name="emergencyContactNo"
                                                control={control}
                                                render={({ field }) => (
                                                  <Input
                                                    {...field}
                                                    value={field.value}
                                                    onChange={(e) => {
                                                      field.onChange(e);
                                                    }}
                                                    {...register(
                                                      "emergencyContactNo"
                                                    )}
                                                    className="rounded-md focus:outline-none"
                                                    placeholder="Emergency Contact No"
                                                  />
                                                )}
                                              />
                                              {errors.emergencyContactNo && (
                                                <p className="text-red-600 font-semibold text-sm">
                                                  {
                                                    errors.emergencyContactNo
                                                      .message
                                                  }
                                                </p>
                                              )}
                                            </div>

                                            <div>
                                              <Label>Relationship</Label>
                                              <Controller
                                                name="relationship"
                                                control={control}
                                                render={({ field }) => (
                                                  <Input
                                                    {...field}
                                                    value={field.value}
                                                    onChange={(e) => {
                                                      field.onChange(e);
                                                    }}
                                                    {...register(
                                                      "relationship"
                                                    )}
                                                    className="rounded-md focus:outline-none"
                                                    placeholder="Relationship"
                                                  />
                                                )}
                                              />
                                              {errors.relationship && (
                                                <p className="text-red-600 font-semibold text-sm">
                                                  {errors.relationship.message}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex justify-between items-center my-4">
                                  <button
                                    onClick={handlePrev}
                                    disabled={currentStep === 1}
                                    type="button"
                                    className={`flex items-center px-4 py-2 rounded-sm transition-colors duration-100 
                                      ${
                                        currentStep === 1
                                          ? "cursor-not-allowed text-gray-400"
                                          : "cursor-pointer hover:bg-gray-100 text-black"
                                      }`}
                                  >
                                    <ChevronLeft />
                                    Previous
                                  </button>

                                  {currentStep < totalSteps && (
                                    <button
                                      onClick={handleNext}
                                      type="button"
                                      className="cursor-pointer flex items-center bg-indigo-500 rounded-sm text-white px-4 py-2"
                                    >
                                      Next <ChevronRight />
                                    </button>
                                  )}

                                  {currentStep === totalSteps && (
                                    <button
                                      type="submit"
                                      className="bg-green-600 px-4 py-2 rounded-sm text-white"
                                    >
                                      {isSubmitting
                                        ? "Processing..."
                                        : "Submit"}
                                    </button>
                                  )}
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
