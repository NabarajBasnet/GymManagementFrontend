"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MdContactEmergency } from "react-icons/md";
import { MdSecurity } from "react-icons/md";
import { TbListDetails } from "react-icons/tb";
import { FaLocationDot } from "react-icons/fa6";
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { FiUser } from "react-icons/fi";
import { toast as toastMessage } from "react-hot-toast";
import { useUser } from "@/components/Providers/LoggedInUserProvider.jsx";
import { MdClose } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation.js";
import { useEffect } from "react";

const EditStaffDetails = ({ staff, editStaff, setEditStaff }) => {
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
  const { user, loading } = useUser();

  // Populate staff details
  useEffect(() => {
    reset({
      fullName: staff.staff.fullName,
      dob: new Date(staff.staff.dob).toISOString().split("T")[0],
      gender: staff.staff.gender,
      contactNo: staff.staff.contactNo,
      email: staff.staff.email,
      role: staff.staff.role,
      joinedDate: new Date(staff.staff.dob).toISOString().split("T")[0],
      numberOfShifts: staff.staff.numberOfShifts,
      salary: staff.staff.salary,
      status: staff.staff.status,

      username: staff.staff.username,
      password: staff.staff.password,

      emergencyContactNo: staff.staff.emergencyContactNo,
    });

    // set current address value
    setValue("currentAddress.street", staff?.staff?.currentAddress?.street);
    setValue("currentAddress.city", staff?.staff?.currentAddress?.city);
    setValue("currentAddress.state", staff?.staff?.currentAddress?.state);
    setValue(
      "currentAddress.postalCode",
      staff?.staff?.currentAddress?.postalCode
    );
    setValue("currentAddress.country", staff?.staff?.currentAddress?.country);
    const dbShifts = staff.staff.shifts;

    // Populate time in form
    if (dbShifts) {
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
    }
  }, []);

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

  // Handle shift role change
  const handleShiftRoleChange = (index, value) => {
    const updatedShifts = [...shifts];
    updatedShifts[index].role = value;
    setShifts(updatedShifts);
    setValue(`shift_${index + 1}_role`, value);
    clearErrors(`shift_${index + 1}_role`);
  };

  // Handle shift type change
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

  // States
  const queryclient = useQueryClient();
  const [openForm, setOpenForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const totalSteps = 4;

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

  // Functions
  const handleSubmitStaff = async (data) => {
    const shifts = {};
    const { numberOfShifts } = data;

    for (let i = 1; i <= numberOfShifts; i++) {
      shifts[`shift_${i}_role`] = data[`shift_${i}_role`] || "";
      shifts[`shift_${i}_checkIn`] = data[`shift_${i}_checkIn`] || "";
      shifts[`shift_${i}_checkOut`] = data[`shift_${i}_checkOut`] || "";
      shifts[`shift_${i}_type`] = data[`shift_${i}_type`] || "";
    }

    const {
      fullName,
      dob,
      gender,
      contactNo,
      email,
      currentAddress,
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

    // Declare finalData first
    let finalData = {
      fullName,
      dob,
      gender,
      contactNo,
      email,
      currentAddress,
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
    };

    // Add selectedBranch conditionally

    try {
      const url = `https://fitbinary.com/api/staffsmanagement/changedetails/${staff.staff._id}`;
      const method = "PATCH";

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
        setEditStaff(!editStaff);
        queryclient.invalidateQueries(["staffs"]);
      } else {
        toastMessage.error(responseBody.message || "Unauthorized action");
      }
    } catch (error) {
      console.log("Error message: ", error.message);
      toastMessage.error(error);
    }
  };

  return (
    <div className="w-full">
      <div className="fixed inset-0 bg-black bg-opacity-80 z-50"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="w-full flex justify-center">
          <div className="w-11/12 md:w-8/12 h-full overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
            <div className="w-full flex justify-between bg-indigo-500 items-center py-2">
              <h1 className="font-bold m-3 text-white text-md md:text-xl">
                Edit Staff Details
              </h1>
              <MdClose
                className="m-4 h-6 w-6 cursor-pointer text-white"
                onClick={() => setEditStaff(!editStaff)}
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
                          width: `${(currentStep / totalSteps) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-gray-500">
                      {Array.from({ length: totalSteps }).map((_, idx) => (
                        <div
                          onClick={() => setCurrentStep(idx + 1)}
                          key={idx}
                          className={`flex items-center cursor-pointer ${idx + 1 <= currentStep ? "text-indigo-600" : ""
                            }`}
                        >
                          <CheckCircle2 size={16} className="mr-1" />
                          Step {idx + 1}
                        </div>
                      ))}
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
                            <Label className="dark:text-white">Full Name</Label>
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
                                  className="bg-white rounded-md py-6 dark:text-white dark:bg-gray-800 rounded-sm dark:border-none focus:outline-none"
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
                            <Label className="dark:text-white">
                              Date Of Birth
                            </Label>
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
                                  className="bg-white rounded-md py-6 dark:text-white dark:bg-gray-800 rounded-sm dark:border-none focus:outline-none"
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
                            <Label className="dark:text-white">Gender</Label>
                            <Controller
                              name="gender"
                              control={control}
                              render={({ field }) => (
                                <select
                                  {...field}
                                  value={field.value}
                                  onChange={(e) => {
                                    setValue("gender", e.target.value);
                                    field.onChange(e);
                                    clearErrors("gender");
                                  }}
                                  className="w-full rounded-sm py-3 dark:bg-gray-800 dark:text-white dark:border-none border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                >
                                  <option>Select</option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                  <option value="Other">Other</option>
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
                            <Label className="dark:text-white">
                              Contact Number
                            </Label>
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
                                  className="bg-white rounded-md py-6 dark:text-white dark:bg-gray-800 rounded-sm dark:border-none focus:outline-none"
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
                            <Label className="text-white">Email Address</Label>
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
                                  className="bg-white rounded-md py-6 dark:text-white dark:bg-gray-800 rounded-sm dark:border-none focus:outline-none"
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
                            <h3 className="text-md font-semibold mb-4 dark:text-white">
                              Current Address
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-white">
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
                                      className="bg-white rounded-md py-6 dark:text-white dark:bg-gray-800 rounded-sm dark:border-none focus:outline-none"
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
                                <Label className="text-white">City</Label>
                                <Input
                                  {...register("currentAddress.city")}
                                  placeholder="Enter city"
                                  required
                                  className="bg-white rounded-md py-6 dark:text-white dark:bg-gray-800 rounded-sm dark:border-none focus:outline-none"
                                />
                              </div>
                              <div>
                                <Label className="text-white">State</Label>
                                <Input
                                  {...register("currentAddress.state")}
                                  placeholder="Enter state"
                                  required
                                  className="bg-white rounded-md py-6 dark:text-white dark:bg-gray-800 rounded-sm dark:border-none focus:outline-none"
                                />
                              </div>
                              <div>
                                <Label className="text-white">
                                  Postal Code
                                </Label>
                                <Input
                                  {...register("currentAddress.postalCode")}
                                  placeholder="Enter postal code"
                                  required
                                  className="bg-white rounded-md py-6 dark:text-white dark:bg-gray-800 rounded-sm dark:border-none focus:outline-none"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label className="text-white">Country</Label>
                                <Input
                                  {...register("currentAddress.country")}
                                  placeholder="Enter country"
                                  required
                                  className="bg-white rounded-md py-6 dark:text-white dark:bg-gray-800 rounded-sm dark:border-none focus:outline-none"
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
                            <Label className="dark:text-white">Role</Label>
                            <Controller
                              name="role"
                              control={control}
                              render={({ field }) => (
                                <select
                                  {...field}
                                  value={field.value}
                                  onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    setValue("role", selectedValue);
                                    clearErrors("role");
                                    field.onChange(selectedValue);
                                  }}
                                  className="w-full rounded-sm border dark:border-none border-gray-300 py-3 dark:bg-gray-800 dark:text-white text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                >
                                  <option>Select</option>
                                  <option value="Super Admin">
                                    Super Admin
                                  </option>
                                  <option value="Gym Admin">Gym Admin</option>
                                  <option value="Floor Trainer">Trainer</option>
                                  <option value="Personal Trainer">
                                    Personal Trainer
                                  </option>
                                  <option value="Operational Manager">
                                    Operational Manager
                                  </option>
                                  <option value="HR Manager">HR Manager</option>
                                  <option value="CEO">CEO</option>
                                  <option value="Developer">Developer</option>
                                  <option value="Intern">Intern</option>
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
                            <Label className="dark:text-white">
                              Joined Date
                            </Label>
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
                                  className="bg-white rounded-md py-6 dark:text-white dark:bg-gray-800 rounded-sm dark:border-none focus:outline-none"
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
                            <Label className="dark:text-white">
                              No. Of Shifts
                            </Label>
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
                                  className="bg-white rounded-md py-6 dark:text-white dark:bg-gray-800 rounded-sm dark:border-none focus:outline-none"
                                  onChange={(e) => {
                                    const value = Math.min(
                                      Math.max(
                                        parseInt(e.target.value) || 1,
                                        1
                                      ),
                                      5
                                    );
                                    field.onChange(value);
                                    setValue("numberOfShifts", value);
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
                            <Label className="dark:text-white">Salary</Label>
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
                                  className="bg-white rounded-md py-6 dark:text-white dark:bg-gray-800 rounded-sm dark:border-none focus:outline-none"
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
                            <Label className="dark:text-white">Status</Label>
                            <Controller
                              name="status"
                              control={control}
                              render={({ field }) => (
                                <select
                                  {...field}
                                  value={field.value}
                                  onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    setValue("status", selectedValue);
                                    clearErrors("status");
                                    field.onChange(selectedValue);
                                  }}
                                  className="w-full py-3 rounded-sm dark:border-none dark:bg-gray-800 dark:text-white border border-gray-300 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                >
                                  <option>Status</option>
                                  <option value="Active">Active</option>
                                  <option value="On Leave">On Leave</option>
                                  <option value="Inactive">Inactive</option>
                                </select>
                              )}
                            />
                            {errors.status && (
                              <p className="text-red-600 font-semibold text-sm">
                                {errors.status.message}
                              </p>
                            )}
                          </div>

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
                                className="p-4 border dark:bg-gray-900 dark:border-gray-700 border-gray-200 rounded-sm bg-gray-50"
                              >
                                <div className="flex justify-between items-center mb-3">
                                  <h3 className="font-medium text-indigo-600">
                                    Shift {index + 1}
                                  </h3>
                                </div>
                                <div className="grid grid-cols-4 overflow-x-auto gap-4">
                                  <div>
                                    <Label className="dark:text-white">
                                      Shift Role
                                    </Label>
                                    <Controller
                                      name={`shift_${index + 1}_role`}
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
                                            field.onChange(selectedValue);
                                          }}
                                          className="w-full dark:bg-gray-800 py-3 dark:border-none dark:text-white rounded-sm border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
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
                                          <option value="CEO">CEO</option>
                                          <option value="Developer">
                                            Developer
                                          </option>
                                          <option value="Intern">Intern</option>
                                        </select>
                                      )}
                                    />
                                    {errors[`shift_${index + 1}_role`] && (
                                      <p className="text-red-600 font-semibold text-sm">
                                        {
                                          errors[`shift_${index + 1}_role`]
                                            .message
                                        }
                                      </p>
                                    )}
                                  </div>

                                  <div>
                                    <Label className="dark:text-white">
                                      Shift Type
                                    </Label>
                                    <Controller
                                      name={`shift_${index + 1}_type`}
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
                                            field.onChange(selectedValue);
                                          }}
                                          className="w-full dark:bg-gray-800 py-3 dark:border-none dark:text-white rounded-sm border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                        >
                                          <option value="">Select Shift</option>
                                          <option value="Morning">
                                            Morning
                                          </option>
                                          <option value="Day">Day</option>
                                          <option value="Evening">
                                            Evening
                                          </option>
                                        </select>
                                      )}
                                    />
                                    {errors[`shift_${index + 1}_type`] && (
                                      <p className="text-red-600 font-semibold text-sm">
                                        {
                                          errors[`shift_${index + 1}_type`]
                                            .message
                                        }
                                      </p>
                                    )}
                                  </div>

                                  <div>
                                    <Label className="dark:text-white">
                                      Check In
                                    </Label>
                                    <Controller
                                      name={`shift_${index + 1}_checkIn`}
                                      control={control}
                                      defaultValue={shift.checkIn}
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
                                          className="w-full dark:bg-gray-800 py-3 dark:border-none dark:text-white rounded-sm border border-gray-300 py-6 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                        />
                                      )}
                                    />
                                    {errors[`shift_${index + 1}_checkIn`] && (
                                      <p className="text-red-600 font-semibold text-sm">
                                        {
                                          errors[`shift_${index + 1}_checkIn`]
                                            .message
                                        }
                                      </p>
                                    )}
                                  </div>

                                  <div>
                                    <Label className="dark:text-white">
                                      Check Out
                                    </Label>
                                    <Controller
                                      name={`shift_${index + 1}_checkOut`}
                                      control={control}
                                      defaultValue={shift.checkOut}
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
                                          className="w-full dark:bg-gray-800 py-3 dark:border-none dark:text-white rounded-sm border border-gray-300 py-6 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                        />
                                      )}
                                    />
                                    {errors[`shift_${index + 1}_checkOut`] && (
                                      <p className="text-red-600 font-semibold text-sm">
                                        {
                                          errors[`shift_${index + 1}_checkOut`]
                                            .message
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
                      <div className="border-b pb-4 border-indigo-500">
                        <div className="flex items-center space-x-2 mb-4">
                          <MdContactEmergency className="w-6 h-6 text-indigo-500" />
                          <h1 className="text-lg font-semibold text-indigo-500">
                            Emergency Details
                          </h1>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="my-2">
                              <Label className="dark:text-white">
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
                                    {...register("emergencyContactNo")}
                                    className="w-full dark:bg-gray-800 py-3 dark:border-none dark:text-white rounded-sm border border-gray-300 py-6 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                    placeholder="Emergency Contact No"
                                  />
                                )}
                              />
                              {errors.emergencyContactNo && (
                                <p className="text-red-600 font-semibold text-sm">
                                  {errors.emergencyContactNo.message}
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
                    className={`flex items-center px-4 py-2 dark:text-white rounded-sm transition-colors duration-100 
                                                            ${currentStep === 1
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
                      className="cursor-pointer dark:text-white flex items-center bg-indigo-500 rounded-sm text-white px-4 py-2"
                    >
                      Next <ChevronRight />
                    </button>
                  )}

                  {currentStep === totalSteps && (
                    <button
                      type="submit"
                      className="bg-green-600 px-4 py-2 rounded-sm text-white"
                    >
                      {isSubmitting ? "Processing..." : "Submit"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStaffDetails;
