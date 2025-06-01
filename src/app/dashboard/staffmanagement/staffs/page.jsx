"use client";

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
import { MdContactEmergency, MdImage } from "react-icons/md";
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
import Link from "next/link.js";
import { usePagination } from "@/hooks/Pagination.js";
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

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, limit]);

  // Functions
  const fetchAllStaffs = async ({ queryKey }) => {
    const [, page, searchQuery] = queryKey;
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
    queryKey: ["staffs", currentPage, debouncedSearchQuery],
    queryFn: fetchAllStaffs,
    enabled: !!user?.user?.company?._id,
  });

  const {
    staffs,
    totalPages,
    totalStaffs,
    gymAdmins,
    gymTrainers,
    personalTrainers,
  } = data || {};

  console.log("Staffs: ", staffs);

  useEffect(() => {
    fetchAllStaffs();
  }, [limit]);

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
      imageUrl,
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
      }

      if (response.status === 200) {
        setOpenForm(false);
        queryclient.invalidateQueries(["staffs"]);
      }
      if (responseBody.errors && response.status === 400) {
        responseBody.errors.forEach((error) => {
          setError(error.field, {
            type: "manual",
            message: error.message,
          });
        });
      } else if (response.status === 401) {
        toastMessage.error(responseBody.message || "Unauthorized action");
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
          <div className="w-full bg-gray-100 px-4 py-6">
            <div
              className="w-full bg-white border rounded-md"
              onClick={() => {
                setToast(false);
                setShowAddressDetails(false);
                setShowShiftDetails(false);
              }}
            >
              <div className="p-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">Home</BreadcrumbLink>
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
                      <BreadcrumbLink href="/docs/components">
                        Dashboard
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Staff Management</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              <div className="flex justify-between pb-4 px-4 items-center">
                <h1 className="text-xl font-bold">Staff Management</h1>
                <Button
                  className="rounded-sm"
                  onClick={() => {
                    reset();
                    setOpenForm(!openForm);
                  }}
                >
                  <RiUserAddFill className="h-6 w-6" />
                  Add New Staff
                </Button>
              </div>
            </div>

            {/* Render staff details edit form */}
            {editStaff && (
              <EditStaffDetails
                staff={staffDetails}
                editStaff={editStaff}
                setEditStaff={setEditStaff}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 my-4 lg:grid-cols-4 gap-4">
              <Card>
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
              <Card>
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
              <Card>
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
              <Card>
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
              <div className="w-full border bg-white rounded-lg">
                <div className="w-full md:flex justify-between items-center px-4">
                  <div className="w-full md:w-6/12 flex py-2 md:py-0 items-center gap-3 rounded-lg">
                    <h1 className="text-sm font-semibold text-gray-700">
                      Show
                    </h1>
                    <select
                      onChange={(e) => setLimit(Number(e.target.value))}
                      className="px-3 py-1 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="15">15</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value={totalStaffs}>All</option>
                    </select>
                    <h1 className="text-sm font-semibold text-gray-700">
                      staffs
                    </h1>
                    <p className="text-sm text-gray-500 italic">
                      Selected Limit: {limit}
                    </p>
                  </div>
                  <div className="w-full md:w-6/12 flex bg-white items-center border rounded-lg active:border-indigo-600 px-4 my-2">
                    <IoSearch />
                    <Input
                      className="rounded-none border-none bg-transparent"
                      placeholder="Search staffs..."
                      value={searchQuery}
                      onChange={(e) => {
                        setCurrentPage(1);
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
                              <Table className="w-full overflow-x-auto px-4">
                                <TableHeader>
                                  <TableRow className="bg-gray-100 text-black">
                                    <TableHead className="text-black">
                                      Avatar
                                    </TableHead>
                                    <TableHead className="text-black text-start">
                                      Name
                                    </TableHead>
                                    <TableHead className="text-black text-center">
                                      Contact
                                    </TableHead>
                                    {branches && (
                                      <TableHead className="text-black text-center">
                                        Branch
                                      </TableHead>
                                    )}
                                    <TableHead className="text-black text-center">
                                      Address
                                    </TableHead>
                                    <TableHead className="text-black text-center">
                                      No Of Shifts
                                    </TableHead>
                                    <TableHead className="text-black text-center">
                                      Shift Details
                                    </TableHead>
                                    <TableHead className="text-black text-center">
                                      Joined At
                                    </TableHead>
                                    <TableHead className="text-black text-center">
                                      Status
                                    </TableHead>
                                    <TableHead className="text-black text-center">
                                      Role
                                    </TableHead>
                                    {user && user.user.role === "Gym Admin" ? (
                                      <></>
                                    ) : (
                                      <TableHead className="text-black text-center">
                                        Action
                                      </TableHead>
                                    )}
                                  </TableRow>
                                </TableHeader>
                                <TableBody className="pl-4 ml-4">
                                  {Array.isArray(staffs) &&
                                  staffs.length > 0 ? (
                                    staffs?.map((staff, index) => (
                                      <TableRow key={staff._id}>
                                        <TableCell>
                                          <div className="bg-indigo-600 text-white font-semibold w-8 h-8 flex items-center justify-center rounded-full">
                                            {(() => {
                                              const nameParts = staff.fullName
                                                .trim()
                                                .split(" ");
                                              const firstInitial =
                                                nameParts[0]
                                                  ?.charAt(0)
                                                  .toUpperCase() || "";
                                              const secondInitial =
                                                nameParts[1]
                                                  ?.charAt(0)
                                                  .toUpperCase() || "";
                                              return (
                                                firstInitial + secondInitial
                                              );
                                            })()}
                                          </div>
                                        </TableCell>
                                        <TableCell className="font-semibold text-start">
                                          {staff.fullName}
                                        </TableCell>
                                        <TableCell className="text-center">
                                          <p className="flex flex-col text-[11px] items-center">
                                            <span className="text-sm">
                                              {staff.contactNo}
                                            </span>
                                            <span className="text-sm">
                                              {staff.email}
                                            </span>
                                          </p>
                                        </TableCell>
                                        {branches && (
                                          <TableCell className="text-center">
                                            {getBranchName(staff._id)}
                                          </TableCell>
                                        )}
                                        <TableCell className="text-center">
                                          <p
                                            onClick={() =>
                                              populateAddressDetails(staff._id)
                                            }
                                            className="text-center text-sm font-semibold text-indigo-600 cursor-pointer"
                                          >
                                            View
                                          </p>
                                        </TableCell>
                                        <TableCell className="text-center">
                                          {staff.numberOfShifts}
                                        </TableCell>
                                        <TableCell className="text-center">
                                          <p
                                            className="text-center text-sm font-semibold text-indigo-600 cursor-pointer"
                                            onClick={() =>
                                              populateShiftDetails(staff._id)
                                            }
                                          >
                                            View
                                          </p>
                                        </TableCell>
                                        <TableCell className="text-center">
                                          {
                                            new Date(staff.joinedDate)
                                              .toISOString()
                                              .split("T")[0]
                                          }
                                        </TableCell>
                                        <TableCell className="text-center">
                                          {" "}
                                          <p
                                            className={`text-center ${
                                              staff.status === "Active"
                                                ? "bg-green-400"
                                                : ""
                                            } ${
                                              staff.status === "Inactive"
                                                ? "bg-red-400"
                                                : ""
                                            } ${
                                              staff.status === "On Leave"
                                                ? "bg-yellow-400"
                                                : ""
                                            } rounded-3xl`}
                                          >
                                            {staff.status}
                                          </p>{" "}
                                        </TableCell>
                                        <TableCell className="text-center">
                                          {staff.role}
                                        </TableCell>
                                        <TableCell className="text-end items-end">
                                          <div className="flex items-end justify-center space-x-1">
                                            {user &&
                                            user.user.role === "Gym Admin" ? (
                                              <></>
                                            ) : (
                                              <FaUserEdit
                                                className="cursor-pointer text-lg"
                                                onClick={() =>
                                                  editStaffDetails(staff._id)
                                                }
                                              />
                                            )}
                                            <AlertDialog>
                                              <AlertDialogTrigger asChild>
                                                {user &&
                                                user.user.role ===
                                                  "Gym Admin" ? (
                                                  <></>
                                                ) : (
                                                  <MdDelete className="text-red-600 cursor-pointer text-lg" />
                                                )}
                                              </AlertDialogTrigger>
                                              <AlertDialogContent>
                                                <AlertDialogHeader>
                                                  <AlertDialogTitle>
                                                    Are you absolutely sure?
                                                  </AlertDialogTitle>
                                                  <AlertDialogDescription>
                                                    This action cannot be
                                                    undone. This will
                                                    permanently delete staff
                                                    account and remove data from
                                                    servers.
                                                  </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                  <AlertDialogCancel>
                                                    Cancel
                                                  </AlertDialogCancel>
                                                  <AlertDialogAction
                                                    onClick={() =>
                                                      deleteStaff(staff._id)
                                                    }
                                                  >
                                                    Continue
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
                                      <TableCell
                                        colSpan={14}
                                        className="text-center text-sm font-semibold"
                                      >
                                        No staff found.
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                                <TableFooter>
                                  <TableRow>
                                    <div className="my-4">
                                      <TableCell
                                        className="text-left"
                                        colSpan={1}
                                      >
                                        Total Staffs
                                      </TableCell>
                                      <TableCell className="text-left font-medium">
                                        {totalStaffs}
                                      </TableCell>
                                    </div>
                                  </TableRow>
                                </TableFooter>
                              </Table>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="border-t border-gray-300 rounded-b-md">
                        <div className="my-2 px-4 md:flex justify-between items-center">
                          <p className="font-medium text-center text-sm font-gray-700">
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

                  {/* Render address and shift details of staff */}
                  {showAddressDetails && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 z-50">
                      <div className="fixed inset-0 flex justify-center items-center">
                        <div className="bg-white rounded-md p-4">
                          <div>
                            <div className="flex justify-between items-center space-x-2 mb-4 bg-white">
                              <div className="flex items-center">
                                <FaLocationDot className="w-6 h-6 text-indigo-500" />
                                <h1 className="text-lg font-semibold text-indigo-500">
                                  Address Details
                                </h1>
                              </div>
                              <MdClose
                                className="h-6 w-6 cursor-pointer"
                                onClick={() => setShowAddressDetails(false)}
                              />
                            </div>

                            <form className="w-full space-x-6 flex justify-between">
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
                                    {errors.currentAddress?.street && (
                                      <p className="text-red-600 font-semibold text-sm">
                                        {errors.currentAddress.street.message}
                                      </p>
                                    )}
                                  </div>
                                  <div>
                                    <Label>City</Label>
                                    <Input
                                      {...register("currentAddress.city")}
                                      placeholder="Enter city"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label>State</Label>
                                    <Input
                                      {...register("currentAddress.state")}
                                      placeholder="Enter state"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label>Postal Code</Label>
                                    <Input
                                      {...register("currentAddress.postalCode")}
                                      placeholder="Enter postal code"
                                      required
                                    />
                                  </div>
                                  <div className="md:col-span-2">
                                    <Label>Country</Label>
                                    <Input
                                      {...register("currentAddress.country")}
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
                                      {...register("permanentAddress.street")}
                                      placeholder="Enter street address"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label>City</Label>
                                    <Input
                                      {...register("permanentAddress.city")}
                                      placeholder="Enter city"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label>State</Label>
                                    <Input
                                      {...register("permanentAddress.state")}
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
                                      {...register("permanentAddress.country")}
                                      placeholder="Enter country"
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {showShiftDetails && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 z-50">
                      <div className="fixed inset-0 flex justify-center items-center">
                        <div className="bg-white pb-4 pr-4 pl-4 rounded-md">
                          <div className="mt-6 mb-4">
                            <div className="flex items-center justify-between space-x-2 mb-4">
                              <div className="flex items-center">
                                <PlusCircle className="w-5 h-5 text-indigo-500" />
                                <h2 className="text-lg font-semibold text-indigo-500 mx-2">
                                  Shift Details
                                </h2>
                              </div>
                              <MdClose
                                className="h-6 w-6 cursor-pointer"
                                onClick={() => setShowShiftDetails(false)}
                              />
                            </div>

                            <form className="space-y-4">
                              {shifts.map((shift, index) => (
                                <div
                                  key={index}
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
                                      <Input
                                        value={shift.role || ""}
                                        readOnly
                                      />
                                    </div>
                                    <div>
                                      <Label>Shift Type</Label>
                                      <Input
                                        value={shift.type || ""}
                                        readOnly
                                      />
                                    </div>
                                    <div>
                                      <Label>Check In</Label>
                                      <Input
                                        type="time"
                                        value={shift.checkIn || ""}
                                        readOnly
                                      />
                                    </div>
                                    <div>
                                      <Label>Check Out</Label>
                                      <Input
                                        type="time"
                                        value={shift.checkOut || ""}
                                        readOnly
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </form>
                          </div>
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
