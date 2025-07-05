'use client';

import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdClose, MdDone, MdError } from "react-icons/md";
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import * as React from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import Loader from "@/components/Loader/Loader";

const StaffDetails = ({ staffId }) => {
    // States
    const [checkInTime, setCheckInTime] = useState(null);
    const [checkOutTime, setCheckOutTime] = useState(null);

    const handleCheckInTimeChange = (e) => {
        const timeValue = e.target.value;
        const [hours, minutes] = timeValue.split(':').map(Number);
        const checkInTime = new Date();
        checkInTime.setHours(hours);
        checkInTime.setMinutes(minutes);
        setCheckInTime(checkInTime);
    };

    const handleCheckOutTimeChange = (e) => {
        const timeValue = e.target.value;
        const [hours, minutes] = timeValue.split(':').map(Number);
        const checkOutTime = new Date();
        checkOutTime.setHours(hours);
        checkOutTime.setMinutes(minutes);
        setCheckOutTime(checkOutTime);
    };

    const queryclient = useQueryClient();
    const [toast, setToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState({ icon: MdDone, message: '' });
    const [errorMessage, setErrorMessage] = useState({ icon: MdError, message: '' });
    const [responseType, setResponseType] = useState('');
    const responseResultType = ['Success', 'Failure'];

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
        control,
        setValue,
        setError,
        clearErrors
    } = useForm();

    // Functions

    const fetchStaffDetails = async () => {
        try {
            const response = await fetch(`http://88.198.112.156:3100/api/staffsmanagement/${staffId}`);
            const responseBody = await response.json();
            if (response.status === 200 && responseBody.staff) {
                reset({
                    fullName: responseBody.staff.fullName,
                    email: responseBody.staff.email,
                    contactNo: responseBody.staff.contactNo,
                    emergencyContactNo: responseBody.staff.emergencyContactNo,
                    address: responseBody.staff.address,
                    dob: responseBody.staff.dob ? new Date(responseBody.staff.dob).toISOString().split("T")[0] : '',
                    checkIn: responseBody.staff.checkIn ? new Date(responseBody.staff.checkIn).toISOString().split('T')[1] : '',
                    checkOut: responseBody.staff.checkIn ? new Date(responseBody.staff.checkOut).toISOString().split('T')[1] : '',
                    gender: responseBody.staff.gender,
                    shift: responseBody.staff.shift,
                    joinedDate: responseBody.staff.joinedDate ? new Date(responseBody.staff.joinedDate).toISOString().split("T")[0] : '',
                    workingHours: responseBody.staff.workingHours,
                    status: responseBody.staff.status,
                    salary: responseBody.staff.salary,
                    role: responseBody.staff.role
                });

                const staffCheckInTime = new Date(responseBody.staff.checkInTime).getTime();
                const updatedCheckInTime = new Date().setTime(staffCheckInTime);
                const formattedCheckInTime = new Date(updatedCheckInTime).toLocaleString('en-US', {
                    timeZone: "UTC",
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const staffCheckOutTime = new Date(responseBody.staff.checkOutTime).getTime();
                const updatedCheckOutTime = new Date().setTime(staffCheckOutTime);
                const formattedCheckOutTime = new Date(updatedCheckOutTime).toLocaleString('en-US', {
                    timeZone: "UTC",
                    hour: '2-digit',
                    minute: '2-digit'
                });
            };
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ['staff'],
        queryFn: fetchStaffDetails,
        enabled: !!staffId
    });

    const { staff } = data || {}

    const handleSubmitStaff = async (data) => {

        const {
            fullName, email, contactNo, emergencyContactNo, address, dob, gender, shift, joinedDate, workingHours, status, salary, role
        } = data;

        // Prepare final data
        const finalData = {
            fullName, email, contactNo, emergencyContactNo, address, dob,
            checkInTime: checkInTime,
            checkOutTime: checkOutTime,
            gender, shift, joinedDate, workingHours, status, salary, role
        };
        try {
            const url = `http://88.198.112.156:3100/api/staffsmanagement/changedetails/${staffId}`
            const method = "PATCH";

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(finalData),
            });
            const responseBody = await response.json();
            if (response.ok) {
                setResponseType(responseResultType[0]);
                setToast(true);
                setTimeout(() => {
                    setToast(false)
                }, 10000);
                setSuccessMessage({
                    icon: MdDone,
                    message: responseBody.message
                });
            };

            if (response.status === 200) {
                queryclient.invalidateQueries(['staff']);
            };
            if (responseBody.errors && response.status === 400) {
                responseBody.errors.forEach((error) => {
                    setError(error.field, {
                        type: 'manual',
                        message: error.message
                    });
                });
            }
            else if (response.status === 401) {
                setResponseType(responseResultType[1]);
                setToast(true);
                setTimeout(() => {
                    setToast(false)
                }, 10000);
                setErrorMessage({
                    icon: MdError,
                    message: responseBody.message
                });
            }
            else {
                setResponseType(responseResultType[0]);
                setToast(true);
                setTimeout(() => {
                    setToast(false)
                }, 10000);
                setSuccessMessage({
                    icon: MdDone,
                    message: responseBody.message
                });
            };

        } catch (error) {
            console.log("Error message: ", error.message);
            setResponseType(responseResultType[1]);
            setToast(true);
            setTimeout(() => {
                setToast(false)
            }, 10000);
            setErrorMessage({
                icon: MdError,
                message: error.message || 'Unauthorized action'
            });
        }
    };

    return (
        <div className="w-full">
            <div className='w-full bg-gray-100'
                onClick={() => setToast(false)}>
                <Breadcrumb className='p-6'>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard" className='font-medium text-gray-600'>Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-1">
                                    <BreadcrumbEllipsis className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </DropdownMenuTrigger>
                            </DropdownMenu>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink className='text-gray-600 font-medium'>{'Staff Management'}</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink className='text-blue-600 font-medium'>{staff ? staff.fullName : ''}</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                    </BreadcrumbList>
                </Breadcrumb>

                {toast && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-fade-in"
                            onClick={() => setToast(false)}
                        ></div>

                        <div className="fixed top-4 right-4 z-50 animate-slide-in">
                            <div className={`relative flex items-start gap-3 px-4 py-3 bg-white shadow-lg border-l-[5px] rounded-xl
                            transition-all duration-300 ease-in-out w-80
                            ${responseType === 'Success' ? 'border-emerald-500' : 'border-rose-500'}`}>

                                <div className={`flex items-center justify-center p-2 rounded-full 
                                    ${responseType === 'Success' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                                    {responseType === 'Success' ? (
                                        <MdDone className="text-xl text-emerald-600" />
                                    ) : (
                                        <MdError className="text-xl text-rose-600" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3 className={`text-base font-semibold mb-1
                                    ${responseType === 'Success' ? 'text-emerald-800' : 'text-rose-800'}`}>
                                        {responseType === 'Success' ? "Successfully sent!" : "Action required"}
                                    </h3>

                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {responseType === 'Success'
                                            ? "Your request has been successful."
                                            : "Couldn't process your request. Check your network or try different credentials."}
                                    </p>

                                    <div className="mt-3 flex items-center gap-2">
                                        {responseType === 'Success' ? (
                                            <button className="text-xs font-medium text-emerald-700 hover:text-emerald-900 underline">
                                                Done
                                            </button>
                                        ) : (
                                            <button className="text-xs font-medium text-rose-700 hover:text-rose-900 underline">
                                                Retry Now
                                            </button>
                                        )}
                                        <span className="text-gray-400">|</span>
                                        <button
                                            className="text-xs font-medium text-gray-500 hover:text-gray-700 underline"
                                            onClick={() => setToast(false)}>
                                            Dismiss
                                        </button>
                                    </div>
                                </div>

                                <MdClose
                                    onClick={() => setToast(false)}
                                    className="cursor-pointer text-lg text-gray-400 hover:text-gray-600 transition mt-0.5"
                                />
                            </div>
                        </div>
                    </>
                )}

                <div className="w-full flex justify-between items-start">
                    <div className="w-full bg-white">
                        {
                            isLoading ? (
                                <Loader />
                            ) : (
                                <div className="w-full flex justify-center">
                                    <div className="w-full bg-gray-100">
                                        <div className="w-full md:flex md:justify-center md:items-center">
                                            <form className="w-full" onSubmit={handleSubmit(handleSubmitStaff)}>
                                                <div className="bg-blue-500 py-2 text-white my-2 w-full">
                                                    <h1 className="mx-4 font-semibold">{staff ? staff.fullName : 'Staff'}</h1>
                                                </div>
                                                <div className="p-4 bg-white">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                                                                            field.onChange(e)
                                                                        }}
                                                                        className="rounded-md focus:outline-none"
                                                                        placeholder="Full Name"
                                                                    />
                                                                )}
                                                            />
                                                            {errors.fullName && (
                                                                <p className="text-red-600 font-semibold text-sm">{errors.fullName.message}</p>
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
                                                                            field.onChange(e)
                                                                        }}
                                                                        className="rounded-md focus:outline-none"
                                                                        placeholder="Email address"
                                                                    />
                                                                )}
                                                            />
                                                            {errors.email && (
                                                                <p className="text-red-600 font-semibold text-sm">{errors.email.message}</p>
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
                                                                            field.onChange(e)
                                                                        }}
                                                                        {...register("contactNo")}
                                                                        className="rounded-md focus:outline-none"
                                                                        placeholder="Contact Number"
                                                                    />
                                                                )}
                                                            />
                                                            {errors.contactNo && (
                                                                <p className="text-red-600 font-semibold text-sm">{errors.contactNo.message}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <Label>Emergency Contact Number</Label>
                                                            <Controller
                                                                name='emergencyContactNo'
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        value={field.value}
                                                                        onChange={(e) => {
                                                                            field.onChange(e)
                                                                        }}
                                                                        {...register("emergencyContactNo")}
                                                                        className="rounded-md focus:outline-none"
                                                                        placeholder="Emergency Contact Number"
                                                                    />
                                                                )}
                                                            />
                                                            {errors.emergencyContactNo && (
                                                                <p className="text-red-600 font-semibold text-sm">{errors.emergencyContactNo.message}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <Label>Address</Label>
                                                            <Controller
                                                                name='address'
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        value={field.value}
                                                                        onChange={(e) => {
                                                                            field.onChange(e)
                                                                        }}
                                                                        {...register("address")}
                                                                        className="rounded-md focus:outline-none"
                                                                        placeholder="Address"
                                                                    />
                                                                )}
                                                            />
                                                            {errors.address && (
                                                                <p className="text-red-600 font-semibold text-sm">{errors.address.message}</p>
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
                                                                            field.onChange(e)
                                                                        }}
                                                                        {...register("dob")}
                                                                        type="date"
                                                                        className="rounded-md focus:outline-none"
                                                                    />
                                                                )}
                                                            />
                                                            {errors.dob && (
                                                                <p className="text-red-600 font-semibold text-sm">{errors.dob.message}</p>
                                                            )}
                                                        </div>

                                                        <div className="w-full">
                                                            <div className="w-full space-y-2">
                                                                <label className="text-sm font-medium text-gray-700">Check In</label>
                                                                <Controller
                                                                    name="checkInTime"
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <Input
                                                                            {...field}
                                                                            {...register('checkInTime')}
                                                                            value={field.value}
                                                                            onChange={(e) => {
                                                                                handleCheckInTimeChange(e);
                                                                                field.onChange(e);
                                                                            }}
                                                                            type='time'
                                                                            className='rounded-md focus:outline-none'
                                                                        />
                                                                    )}
                                                                />
                                                            </div>
                                                            {errors.checkInHour && (
                                                                <p className="text-sm font-medium text-red-600">
                                                                    {errors.checkInHour.message}
                                                                </p>
                                                            )}
                                                            {errors.checkInMinute && (
                                                                <p className="text-sm font-medium text-red-600">
                                                                    {errors.checkInMinute.message}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="w-full space-y-2">
                                                            <label className="text-sm font-medium text-gray-700">Check Out</label>
                                                            <Controller
                                                                name='checkOutTime'
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        {...register('checkOutTime')}
                                                                        value={field.value}
                                                                        onChange={(e) => {
                                                                            field.onChange(e);
                                                                            handleCheckOutTimeChange(e);
                                                                        }}
                                                                        type='time'
                                                                        className='rounded-md focus:outline-none'
                                                                    />
                                                                )}
                                                            />
                                                            {errors.checkOutHour && (
                                                                <p className="text-sm font-medium text-red-600">
                                                                    {errors.checkOutHour.message}
                                                                </p>
                                                            )}
                                                            {errors.checkOutMinute && (
                                                                <p className="text-sm font-medium text-red-600">
                                                                    {errors.checkOutMinute.message}
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
                                                                            setValue('gender', e.target.value);
                                                                            field.onChange(e);
                                                                            clearErrors('gender');
                                                                        }}
                                                                        className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                                                    >
                                                                        <option>Select</option>
                                                                        <option value="Male">Male</option>
                                                                        <option value="Female">Female</option>
                                                                        <option value="Other">Other</option>
                                                                    </select>
                                                                )}
                                                            />
                                                            {errors.gender && (
                                                                <p className="text-red-600 font-semibold text-sm">{errors.gender.message}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <Label>Select Shift</Label>
                                                            <Controller
                                                                name='shift'
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <select
                                                                        {...field}
                                                                        value={field.value}
                                                                        onChange={(e) => {
                                                                            const selectedValue = e.target.value
                                                                            setValue('shift', selectedValue);
                                                                            field.onChange(selectedValue);
                                                                            clearErrors('shift')
                                                                        }}
                                                                        className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                                                    >
                                                                        <option>Shift</option>
                                                                        <option value="Morning">Morning</option>
                                                                        <option value="Day">Day</option>
                                                                        <option value="Evening">Evening</option>
                                                                    </select>
                                                                )}
                                                            />
                                                            {errors.shift && (
                                                                <p className="text-red-600 font-semibold text-sm">{errors.shift.message}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <Label>Joined Date</Label>
                                                            <Controller
                                                                name='joinedDate'
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        value={field.value}
                                                                        onChange={(e) => {
                                                                            field.onChange(e)
                                                                        }}
                                                                        {...register("joinedDate")}
                                                                        type="date"
                                                                        className="rounded-md focus:outline-none"
                                                                    />
                                                                )}

                                                            />
                                                            {errors.joinedDate && (
                                                                <p className="text-red-600 font-semibold text-sm">{errors.joinedDate.message}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <Label>Working Hours</Label>
                                                            <Controller
                                                                name="workingHours"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <select
                                                                        {...field}
                                                                        value={field.value}
                                                                        onChange={(e) => {
                                                                            const selectedValue = e.target.value
                                                                            setValue('workingHours', selectedValue);
                                                                            clearErrors('workingHours');
                                                                            field.onChange(selectedValue);
                                                                        }}
                                                                        className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                                                    >
                                                                        <option>Select</option>
                                                                        <option value="1 Hour">1 Hour</option>
                                                                        <option value="2 Hours">2 Hours</option>
                                                                        <option value="3 Hours">3 Hours</option>
                                                                        <option value="4 Hours">4 Hours</option>
                                                                        <option value="5 Hours">5 Hours</option>
                                                                        <option value="6 Hours">6 Hours</option>
                                                                        <option value="7 Hours">7 Hours</option>
                                                                        <option value="8 Hours">8 Hours</option>
                                                                        <option value="9 Hours">9 Hours</option>
                                                                        <option value="10 Hours">10 Hours</option>
                                                                    </select>
                                                                )}
                                                            />
                                                            {errors.workingHours && (
                                                                <p className="text-red-600 font-semibold text-sm">{errors.workingHours.message}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <Label>Status</Label>

                                                            <Controller
                                                                name='status'
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <select
                                                                        {...field}
                                                                        value={field.value}
                                                                        onChange={(e) => {
                                                                            const selectedValue = e.target.value;
                                                                            setValue('status', selectedValue);
                                                                            clearErrors('status')
                                                                            field.onChange(selectedValue)
                                                                        }}
                                                                        className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                                                    >
                                                                        <option>Status</option>
                                                                        <option value="Active">Active</option>
                                                                        <option value="On Leave">On Leave</option>
                                                                        <option value="Inactive">Inactive</option>
                                                                    </select>
                                                                )}
                                                            />
                                                            {errors.status && (
                                                                <p className="text-red-600 font-semibold text-sm">{errors.status.message}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <Label>Salary</Label>
                                                            <Controller
                                                                name='salary'
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
                                                                <p className="text-red-600 font-semibold text-sm">{errors.salary.message}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <Label>Role</Label>
                                                            <Controller
                                                                name='role'
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <select
                                                                        {...field}
                                                                        value={field.value}
                                                                        onChange={(e) => {
                                                                            const selectedValue = e.target.value;
                                                                            setValue('role', selectedValue);
                                                                            clearErrors("role");
                                                                            field.onChange(selectedValue);
                                                                        }}
                                                                        className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                                                    >
                                                                        <option>Select</option>
                                                                        <option value="Super Admin">Super Admin</option>
                                                                        <option value="Gym Admin">Gym Admin</option>
                                                                        <option value="Floor Trainer">Trainer</option>
                                                                        <option value="Personal Trainer">Personal Trainer</option>
                                                                        <option value="Operational Manager">Operational Manager</option>
                                                                        <option value="HR Manager">HR Manager</option>
                                                                        <option value="CEO">CEO</option>
                                                                        <option value="Developer">Developer</option>
                                                                        <option value="Intern">Intern</option>
                                                                    </select>
                                                                )}
                                                            />
                                                            {errors.role && (
                                                                <p className="text-red-600 font-semibold text-sm">{errors.role.message}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-center items-center mt-5 space-x-2 p-2">
                                                    <Button variant="destructive" type="button" className="rounded-md" onClick={() => window.location.reload()}>Reload</Button>
                                                    <Button className="rounded-md bg-green-500 hover:bg-green-600 transition-all duration-500" type='submit'>{isSubmitting ? 'Processing...' : 'Submit'}</Button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDetails;
