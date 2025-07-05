'use client';

import { LiaHomeSolid } from "react-icons/lia";
import { FiChevronRight } from "react-icons/fi";
import { BsThreeDots, BsBoxSeam } from "react-icons/bs";
import { toast as sonnerToast } from 'sonner';
import { RiResetRightFill } from "react-icons/ri";
import { FaLockOpen, FaLock } from "react-icons/fa";
import Badge from '@mui/material/Badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";

const Lockers = () => {

    const queryClient = useQueryClient()
    const [lockerFormState, setLockerFormState] = useState(false);

    const [renderDropdown, setRenderDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchRef = React.useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setRenderDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchRef]);

    const handleSearchFocus = () => {
        setRenderDropdown(true);
    };

    const {
        register,
        reset,
        handleSubmit,
        setError,
        clearErrors,
        formState: { isSubmitting, errors },
        control,
    } = useForm();

    const [lockerId, setLockerId] = useState('');
    const [memberId, setMemberId] = useState('');
    const [lockerNumber, setCurrentLockerNumber] = useState('');
    const [memberName, setMemberName] = useState('');
    const [duration, setDuration] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [fetchedLocker, setFetchedLocker] = useState({});

    // Locker filteration states
    const [lockerStatus, setLockerStatus] = useState('');
    const [lockerOrder, setLockerOrder] = useState('');
    const [Lockers, setLockers] = useState();

    const getAllLockers = async () => {
        try {
            const response = await fetch(`https://fitbinary.com/api/lockers/by-org-branch`);
            const responseBody = await response.json();
            if (response.ok) {
                setLockers(responseBody.lockers);
                return responseBody;
            };
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
            sonnerToast.error(error.message || 'Unexpected error');
            throw error;
        };
    };

    const { data, isLoading } = useQuery({
        queryKey: ['lockers', lockerOrder, lockerStatus],
        queryFn: getAllLockers,
        onSuccess: (data) => {
            setLockers(data?.lockers);
        }
    });

    const { totalLockers, assignedLockers, notAssignedLockers, bookedLockers, emptyLockers, expiredLockers, underMaintenanceLockers } = data || {}

    // Pululate lockers data
    const getAllMembers = async () => {
        try {
            const response = await fetch(`https://fitbinary.com/api/members`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
            sonnerToast.error(error.message || 'Unexpected error');
            throw error;
        };
    };

    const { data: allmembers, isLoading: isMemberLoading } = useQuery({
        queryKey: ['members'],
        queryFn: getAllMembers
    });

    const { members } = allmembers || {}

    // Manage locker membrship expire date
    const [renewDate, setRenewDate] = useState(new Date());
    const [expireDate, setExpireDate] = useState(new Date());

    const handleLockerExpireDate = (duration) => {

        const newLockerExpireDate = new Date(expireDate);

        switch (duration) {
            case '1 Month':
                newLockerExpireDate.setMonth(newLockerExpireDate.getMonth() + 1)
                break;

            case '3 Months':
                newLockerExpireDate.setMonth(newLockerExpireDate.getMonth() + 3);
                break;

            case '6 Months':
                newLockerExpireDate.setMonth(newLockerExpireDate.getMonth() + 6);
                break;

            case '9 Months':
                newLockerExpireDate.setMonth(newLockerExpireDate.getMonth() + 9);
                break;

            case '12 Months':
                newLockerExpireDate.setFullYear(newLockerExpireDate.getFullYear() + 1)
                break;

            default:
                break;
        }

        setExpireDate(newLockerExpireDate.toISOString().split('T')[0]);
    };

    useEffect(() => {
        handleLockerExpireDate(duration);
    }, [renewDate, duration]);

    const registerLocker = async (data) => {
        try {
            if (!renewDate) {
                setError("renewDate", {
                    type: 'manual',
                    message: 'Please select renew date'
                });
            };

            if (!expireDate) {
                setError("expireDate", {
                    type: 'manual',
                    message: 'Please select expire date'
                });
            };

            const { fee, referenceCode, receiptNo } = data;
            const finalData = { lockerId, lockerNumber, memberId, memberName, renewDate, duration, expireDate, fee, paymentMethod, referenceCode, receiptNo };

            const response = await fetch('https://fitbinary.com/api/lockers/put', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalData),
                credentials: 'include',
            });
            const responseBody = await response.json();

            if (response.ok) {
                sonnerToast.success(responseBody.message);
                setLockerFormState(false);
                const updatedLockers = await getAllLockers();
                setLockers(updatedLockers.lockers);
                queryClient.invalidateQueries({
                    queryKey: ['lockers'],
                    exact: true
                });
            } else {
                sonnerToast.error(responseBody.message);
                setLockerFormState(false);
            };

        } catch (error) {
            console.log("Error: ", error);
            sonnerToast.error(error.message);
        }
    };


    const getSingleLockerInfo = async (id) => {
        try {
            const response = await fetch(`https://fitbinary.com/api/lockers/${id}`);
            const responseBody = await response.json();
            setFetchedLocker(responseBody.lockerDetails);
            if (response.ok) {
                reset({
                    lockerNumber: responseBody.lockerDetails.lockerNumber,
                    memberName: responseBody.lockerDetails.memberName,
                    renewDate: responseBody.lockerDetails.renewDate ? new Date(responseBody.lockerDetails.renewDate).toISOString().split("T")[0] : '',
                    duration: responseBody.lockerDetails.duration,
                    expireDate: responseBody.lockerDetails.expireDate ? new Date(responseBody.lockerDetails.expireDate).toISOString().split("T")[0] : '',
                    fee: responseBody.lockerDetails.fee,
                    paymentMethod: responseBody.lockerDetails.paymentMethod,
                    referenceCode: responseBody.lockerDetails.referenceCode,
                    receiptNo: responseBody.lockerDetails.receiptNo
                });
            }
            return responseBody;
        } catch (error) {
            sonnerToast.error(error.message);
            console.log('Error: ', error);
        }
    };

    const resetLocker = async (id) => {
        try {
            const response = await fetch(`https://fitbinary.com/api/lockers/patch/${id}`, {
                method: "PATCH",
            })
            const responseBody = await response.json();
            if (response.ok) {
                setLockerFormState(false);
                const updatedLockers = await getAllLockers();
                setLockers(updatedLockers.lockers);
                setLockerFormState(false);
                sonnerToast.success(responseBody.message);
                queryClient.invalidateQueries({
                    queryKey: ['lockers'],
                    exact: true
                });
            }
        } catch (error) {
            sonnerToast.error(error.message);
            console.log("Error: ", error);
        }
    };

    return (
        <div className="w-full bg-gray-100 dark:bg-gray-800 py-5 px-4">

            <div className="w-full space-y-4">
                {/* Enhanced Breadcrumb */}
                <Breadcrumb>
                    <BreadcrumbList className="flex items-center gap-2">
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                href="/"
                                className="flex items-center font-medium text-sm text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
                            >
                                <LiaHomeSolid className="mr-2 w-4 h-4" />
                                Home
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator>
                            <FiChevronRight className="h-3 w-3 text-gray-400" />
                        </BreadcrumbSeparator>

                        <BreadcrumbItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center focus:outline-none">
                                    <BsThreeDots className="h-4 w-4 text-gray-500" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    {/* Dropdown content here */}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator>
                            <FiChevronRight className="h-3 w-3 text-gray-400" />
                        </BreadcrumbSeparator>

                        <BreadcrumbItem>
                            <BreadcrumbLink
                                href="/dashboard"
                                className="font-medium text-sm text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
                            >
                                Dashboard
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator>
                            <FiChevronRight className="h-3 w-3 text-gray-400" />
                        </BreadcrumbSeparator>

                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium text-sm text-primary dark:text-primary">
                                <div className="flex items-center">
                                    <BsBoxSeam className="mr-2 w-4 h-4" />
                                    Lockers
                                </div>
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Enhanced Card */}
                <div className="w-full dark:border-none bg-white dark:bg-gray-700 p-6 rounded-md shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg">
                                <BsBoxSeam className="w-5 h-5 text-primary dark:text-primary/90" />
                            </div>
                            <h1 className="text-2xl font-bold dark:text-white">Lockers</h1>
                        </div>
                    </div>
                </div>
            </div>

            {
                lockerFormState && Lockers ? (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
                            {/* Header with gradient border */}
                            <div className="border-b-2 border-transparent bg-gradient-to-r from-gray-700 to-gray-600 dark:from-gray-600 dark:to-gray-500 h-1 rounded-full mb-6"></div>

                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                                <FaLock className="text-gray-600 dark:text-gray-300" />
                                <span>Locker #{lockerNumber} Details</span>
                            </h1>

                            <form className="space-y-5" onSubmit={handleSubmit(registerLocker)}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Locker Number */}
                                    <div className="space-y-1">
                                        <Label className="text-gray-700 dark:text-gray-300 font-medium">Locker Number</Label>
                                        <Input
                                            {...register('lockerNumber')}
                                            disabled
                                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:text-white"
                                            placeholder="Locker Number"
                                        />
                                        {errors.lockerNumber && (
                                            <p className="text-sm font-medium text-red-500 dark:text-red-400 mt-1">
                                                {errors.lockerNumber.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Member Search */}
                                    <div className="space-y-1" ref={searchRef}>
                                        <Label className="text-gray-700 dark:text-gray-300 font-medium">Member Name</Label>
                                        <div className="relative">
                                            <Controller
                                                name="memberName"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        autoComplete="off"
                                                        value={searchQuery}
                                                        onChange={(e) => {
                                                            setSearchQuery(e.target.value);
                                                            field.onChange(e);
                                                        }}
                                                        onFocus={handleSearchFocus}
                                                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:text-white"
                                                        placeholder="Search members..."
                                                    />
                                                )}
                                            />
                                            {renderDropdown && (
                                                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg rounded-lg max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-600">
                                                    {members
                                                        ?.filter((member) => member.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
                                                        .map((member) => (
                                                            <div
                                                                key={member._id}
                                                                onClick={() => {
                                                                    setMemberName(member.fullName);
                                                                    setSearchQuery(member.fullName);
                                                                    setMemberId(member._id);
                                                                    setRenderDropdown(false);
                                                                }}
                                                                className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
                                                            >
                                                                {member.fullName}
                                                            </div>
                                                        ))}
                                                </div>
                                            )}
                                        </div>
                                        {errors.memberName && (
                                            <p className="text-sm font-medium text-red-500 dark:text-red-400 mt-1">
                                                {errors.memberName.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Dates and Duration */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Renew Date */}
                                    <div className="space-y-1">
                                        <Label className="text-gray-700 dark:text-gray-300 font-medium">Renew Date</Label>
                                        <Controller
                                            name='renewDate'
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    type="date"
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        setRenewDate(e.target.value);
                                                        field.onChange(e);
                                                        clearErrors('renewDate');
                                                    }}
                                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:text-white"
                                                />
                                            )}
                                        />
                                        {errors.renewDate && (
                                            <p className="text-sm font-medium text-red-500 dark:text-red-400 mt-1">
                                                {errors.renewDate.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Duration */}
                                    <div className="space-y-1">
                                        <Label className="text-gray-700 dark:text-gray-300 font-medium">Duration</Label>
                                        <Controller
                                            name='duration'
                                            control={control}
                                            render={({ field }) => (
                                                <select
                                                    {...field}
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        setDuration(e.target.value)
                                                        field.onChange(e)
                                                    }}
                                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 p-2.5 bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-gray-500 focus:outline-none dark:text-white"
                                                >
                                                    <option className="dark:bg-gray-700">Select</option>
                                                    <option className="dark:bg-gray-700" value='1 Month'>1 Month</option>
                                                    <option className="dark:bg-gray-700" value='3 Months'>3 Months</option>
                                                    <option className="dark:bg-gray-700" value='6 Months'>6 Months</option>
                                                    <option className="dark:bg-gray-700" value='9 Months'>9 Months</option>
                                                    <option className="dark:bg-gray-700" value='12 Months'>12 Months</option>
                                                </select>
                                            )}
                                        />
                                        {errors.duration && (
                                            <p className="text-sm font-medium text-red-500 dark:text-red-400 mt-1">
                                                {errors.duration.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Expire Date and Fee */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Expire Date */}
                                    <div className="space-y-1">
                                        <Label className="text-gray-700 dark:text-gray-300 font-medium">Expire Date</Label>
                                        <Controller
                                            name='expireDate'
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    type="date"
                                                    value={expireDate}
                                                    onChange={(e) => {
                                                        setExpireDate(e.target.value);
                                                        field.onChange(e);
                                                        clearErrors('expireDate');
                                                    }}
                                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:text-white"
                                                />
                                            )}
                                        />
                                        {errors.expireDate && (
                                            <p className="text-sm font-medium text-red-500 dark:text-red-400 mt-1">
                                                {errors.expireDate.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Fee */}
                                    <div className="space-y-1">
                                        <Label className="text-gray-700 dark:text-gray-300 font-medium">Fee</Label>
                                        <Controller
                                            name='fee'
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:text-white"
                                                />
                                            )}
                                        />
                                        {errors.fee && (
                                            <p className="text-sm font-medium text-red-500 dark:text-red-400 mt-1">
                                                {errors.fee.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Payment Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Payment Method */}
                                    <div className="space-y-1">
                                        <Label className="text-gray-700 dark:text-gray-300 font-medium">Payment Method</Label>
                                        <Controller
                                            name='paymentMethod'
                                            control={control}
                                            render={({ field }) => (
                                                <select
                                                    {...field}
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        setPaymentMethod(e.target.value);
                                                        field.onChange(e)
                                                    }}
                                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 p-2.5 bg-white dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-gray-500 focus:outline-none dark:text-white"
                                                >
                                                    <option className="dark:bg-gray-700">Select</option>
                                                    <option className="dark:bg-gray-700" value='Fonepay'>Fonepay</option>
                                                    <option className="dark:bg-gray-700" value='Cash'>Cash</option>
                                                    <option className="dark:bg-gray-700" value='Card'>Card</option>
                                                </select>
                                            )}
                                        />
                                        {errors.paymentMethod && (
                                            <p className="text-sm font-medium text-red-500 dark:text-red-400 mt-1">
                                                {errors.paymentMethod.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Conditional Reference Code */}
                                    {paymentMethod === 'Fonepay' && (
                                        <div className="space-y-1">
                                            <Label className="text-gray-700 dark:text-gray-300 font-medium">Reference Code</Label>
                                            <Controller
                                                control={control}
                                                name='referenceCode'
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(e)}
                                                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:text-white"
                                                    />
                                                )}
                                            />
                                            {errors.referenceCode && (
                                                <p className="text-sm font-medium text-red-500 dark:text-red-400 mt-1">
                                                    {errors.referenceCode.message}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Receipt No */}
                                    <div className="space-y-1">
                                        <Label className="text-gray-700 dark:text-gray-300 font-medium">Receipt No</Label>
                                        <Controller
                                            name='receiptNo'
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(e)}
                                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:text-white"
                                                />
                                            )}
                                        />
                                        {errors.receiptNo && (
                                            <p className="text-sm font-medium text-red-500 dark:text-red-400 mt-1">
                                                {errors.receiptNo.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex flex-wrap justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    {fetchedLocker && (
                                        <Button
                                            type='button'
                                            onClick={() => resetLocker(fetchedLocker._id)}
                                            className="px-6 py-2.5 rounded-lg font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-sm"
                                        >
                                            Reset
                                        </Button>
                                    )}

                                    <Button
                                        type='button'
                                        onClick={() => setLockerFormState(false)}
                                        className="px-6 py-2.5 rounded-lg font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors shadow-sm"
                                    >
                                        Close
                                    </Button>

                                    <Button
                                        type='submit'
                                        className="px-6 py-2.5 rounded-lg font-medium bg-gradient-to-r from-gray-700 to-gray-600 dark:from-gray-600 dark:to-gray-500 text-white hover:from-gray-600 hover:to-gray-500 dark:hover:from-gray-500 dark:hover:to-gray-400 transition-all shadow-md"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </span>
                                        ) : "Submit"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : null
            }

            <div className="min-h-screen">
                {isLoading ? (
                    <>
                        <Loader />
                    </>
                ) : (
                    <div className="w-full">
                        {!isLoading && (
                            <div className="max-w-full">
                                <div className="bg-white dark:bg-gradient-to-br from-gray-700 to-gray-600 dark:border-none rounded-md mt-4 shadow-sm border p-4 md:p-6 space-y-6 md:space-y-0 md:flex md:gap-6 items-end">
                                    <div className="flex-1">
                                        <Label className="text-sm font-semibold text-gray-600 dark:text-gray-200 mb-2 block">
                                            Locker Number
                                        </Label>
                                        <Select value={lockerOrder} onValueChange={setLockerOrder}>
                                            <SelectTrigger className="w-full rounded-sm dark:bg-gray-800 dark:border-none dark:text-white">
                                                <SelectValue placeholder="Sort by order" />
                                            </SelectTrigger>
                                            <SelectContent className='dark:bg-gray-800 dark:border-none'>
                                                <SelectGroup>
                                                    <SelectLabel>Order</SelectLabel>
                                                    <SelectItem value="asc" className='dark:text-white hover:cursor-pointer hover:bg-blue-500'>Ascending</SelectItem>
                                                    <SelectItem value="desc" className='dark:text-white hover:cursor-pointer hover:bg-blue-500'>Descending</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex-1">
                                        <Label className="text-sm font-semibold text-gray-600 dark:text-gray-200 mb-2 block">
                                            Status
                                        </Label>
                                        <Select value={lockerStatus} onValueChange={setLockerStatus}>
                                            <SelectTrigger className="w-full rounded-sm dark:bg-gray-800 dark:border-none dark:text-white">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent className='dark:bg-gray-800 dark:border-none'>
                                                <SelectGroup>
                                                    <SelectLabel>Status</SelectLabel>
                                                    <SelectItem value="Empty" className='dark:text-white hover:cursor-pointer hover:bg-blue-500'>Empty</SelectItem>
                                                    <SelectItem value="Booked" className='dark:text-white hover:cursor-pointer hover:bg-blue-500'>Booked</SelectItem>
                                                    <SelectItem value="Expired" className='dark:text-white hover:cursor-pointer hover:bg-blue-500'>Expired</SelectItem>
                                                    <SelectItem value="Under Maintenance" className='dark:text-white hover:cursor-pointer hover:bg-blue-500'>Under Maintenance</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button
                                        className="bg-red-600 hover:bg-red-600 cursor-pointer flex items-center dark:text-white justify-around"
                                        onClick={() => {
                                            setLockerOrder('');
                                            setLockerStatus('');
                                        }}>
                                        <RiResetRightFill className="h-5 w-5 space-x-2 mx-2" />
                                        Reset Filter
                                    </Button>

                                    <div className="flex-shrink-0">
                                        <Label className="text-sm font-semibold text-gray-600 dark:text-gray-200 mb-2 block">
                                            Lockers Status
                                        </Label>
                                        <div className="flex gap-3">

                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Badge badgeContent={String(bookedLockers ? bookedLockers : "0")} color="primary">
                                                            <FaLock className="h-5 w-5 text-green-600 cursor-pointer" />
                                                        </Badge>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Booked Lockers</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Badge badgeContent={emptyLockers ? emptyLockers : 0} color="primary">
                                                            <FaLock className="h-5 w-5 text-yellow-500 cursor-pointer" />
                                                        </Badge>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Empty Lockers</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Badge badgeContent={expiredLockers ? expiredLockers : 0} color="primary">
                                                            <FaLock className="h-5 w-5 text-red-600 cursor-pointer" />
                                                        </Badge>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Expired Lockers</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Badge badgeContent={underMaintenanceLockers ? underMaintenanceLockers : 0} color="primary">
                                                            <FaLock className="h-5 w-5 text-blue-600 dark:text-blue-500 cursor-pointer" />
                                                        </Badge>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Under Maintenance Lockers</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 my-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
                                    {Array.isArray(Lockers) && Lockers.length > 0 ? (
                                        Lockers.map((locker) => (
                                            <div
                                                key={locker.lockerNumber}
                                                className="relative group rounded-lg overflow-hidden my-4 md:my-0 transition-all duration-300 hover:shadow-lg"
                                            >
                                                {/* Clean card background */}
                                                <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                                                    {/* Clean status indicator */}
                                                    <div className={`h-2 ${locker.status === 'Expired'
                                                        ? 'bg-red-500'
                                                        : locker.status === 'Booked'
                                                            ? 'bg-green-500'
                                                            : locker.status === 'Empty'
                                                                ? 'bg-orange-500'
                                                                : 'bg-blue-500'
                                                        }`} />

                                                    <div className="p-4">
                                                        {/* Header section */}
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div>
                                                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                                    Locker #{locker.lockerNumber}
                                                                </h2>
                                                                <div className="flex items-center mt-1">
                                                                    <div className={`w-2 h-2 rounded-full mr-2 ${locker.status === 'Expired'
                                                                        ? 'bg-red-500'
                                                                        : locker.status === 'Booked'
                                                                            ? 'bg-green-500'
                                                                            : locker.status === 'Empty'
                                                                                ? 'bg-orange-500'
                                                                                : 'bg-blue-500'
                                                                        }`} />
                                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                        {locker.isAssigned ? 'Assigned' : 'Not Assigned'}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Status badge */}
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${locker.status === 'Expired'
                                                                ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
                                                                : locker.status === 'Booked'
                                                                    ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
                                                                    : locker.status === 'Empty'
                                                                        ? 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800'
                                                                        : 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
                                                                }`}>
                                                                {locker.status}
                                                            </span>
                                                        </div>

                                                        {/* Locker details */}
                                                        <div className="space-y-2 mb-4">
                                                            {[
                                                                ['Locker ID', locker.lockerId],
                                                                ['Member Name', locker.memberName],
                                                                ['Renew Date', new Date(locker.renewDate).toLocaleDateString()],
                                                                ['Duration', locker.duration],
                                                                ['Expire Date', new Date(locker.expireDate).toLocaleDateString()],
                                                                ['Fee', `$${locker.fee}`],
                                                                ['Size', `${locker.lockerSize}`]
                                                            ].map(([label, value]) => (
                                                                <div
                                                                    key={label}
                                                                    className="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                                                                >
                                                                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                                                        {label}
                                                                    </span>
                                                                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                                        {value || '-'}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Action button */}
                                                        <button
                                                            onClick={() => {
                                                                setCurrentLockerNumber(locker.lockerNumber);
                                                                setLockerFormState(true);
                                                                setLockerId(locker._id);
                                                                getSingleLockerInfo(locker._id);
                                                            }}
                                                            className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center gap-2 ${locker.status === 'Expired'
                                                                ? 'bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-200 dark:focus:ring-red-800'
                                                                : locker.status === 'Booked'
                                                                    ? 'bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-200 dark:focus:ring-green-800'
                                                                    : locker.status === 'Empty'
                                                                        ? 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800'
                                                                        : 'bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-700'
                                                                } focus:outline-none active:scale-95`}
                                                        >
                                                            <FaLock className="text-sm" />
                                                            <span>Manage Locker</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-16">
                                            <div className="max-w-sm mx-auto">
                                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                                                    <FaLockOpen className="text-2xl text-gray-500 dark:text-gray-400" />
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                                    No lockers available
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    Create a new locker to get started with your locker management system.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div >
    )
}

export default Lockers;
