'use client';

import { LiaHomeSolid } from "react-icons/lia";
import { MdAdd } from "react-icons/md";
import { RiResetRightFill } from "react-icons/ri";
import { MdError, MdClose, MdDone } from "react-icons/md";
import Badge from '@mui/material/Badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaLock } from "react-icons/fa";
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
import * as React from "react"
import { useForm, Controller } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";

const Lockers = () => {

    const queryClient = useQueryClient()
    const [lockerFormState, setLockerFormState] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [toast, setToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState({ icon: MdDone, message: '' });
    const [errorMessage, setErrorMessage] = useState({ icon: MdError, message: '' });
    const [responseType, setResponseType] = useState('')
    const responseResultType = ['Success', 'Failure'];
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

    const getAllLockers = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/lockers?order=${lockerOrder}&status=${lockerStatus}`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
            throw error;
        };
    };

    const { data, isLoading } = useQuery({
        queryKey: ['lockers', lockerOrder, lockerStatus],
        queryFn: getAllLockers,
    });

    const { Lockers, totalLockers, assignedLockers, notAssignedLockers, bookedLockers, emptyLockers, expiredLockers, underMaintenanceLockers } = data || {}

    // Pululate lockers data
    const getAllMembers = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/members`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
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
                setError(
                    "renewDate",
                    {
                        type: 'manual',
                        message: 'Please select renew date'
                    }
                )
            };

            if (!expireDate) {
                setError(
                    "expireDate",
                    {
                        type: 'manual',
                        message: 'Please select expire date'
                    }
                )
            };

            const { fee, referenceCode, receiptNo } = data;
            const finalData = { lockerId, lockerNumber, memberId, memberName, renewDate, duration, expireDate, fee, paymentMethod, referenceCode, receiptNo };

            const response = await fetch('http://localhost:3000/api/lockers/put', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalData),
                credentials: 'include',
            });

            if (response.ok) {
                window.location.reload();
                queryClient.invalidateQueries(
                    {
                        queryKey: ['lockers'],
                        exact: true
                    }
                );
            };

            const responseBody = await response.json();
            setResponseMessage(responseBody.message);

            if (response.status === 500) {
                setResponseType(responseResultType[1]);
                setToast(true);
                setTimeout(() => {
                    setToast(false)
                }, 10000);
                setErrorMessage({
                    icon: MdError,
                    message: responseBody.message || 'Unauthorized action',
                });
                queryClient.invalidateQueries({
                    queryKey: ['lockers'],
                    exact: true
                });
            };

            if (!response.status === 200) {
                setResponseType(responseResultType[1]);
                setToast(true);
                setTimeout(() => {
                    setToast(false)
                }, 10000);
                setErrorMessage({
                    icon: MdError,
                    message: responseBody.message || 'Unauthorized action'
                });
                queryClient.invalidateQueries({
                    queryKey: ['lockers'],
                    exact: true
                });
            } else {
                setResponseType(responseResultType[0]);
                setToast(true);
                setTimeout(() => {
                    setToast(false)
                }, 10000);
                setSuccessMessage({
                    icon: MdDone,
                    message: responseBody.message || 'Unauthorized action'
                });
                setLockerFormState(false);
                queryClient.invalidateQueries({
                    queryKey: ['lockers'],
                    exact: true
                });
            };

        } catch (error) {
            console.log("Error: ", error);
            setResponseType(responseResultType[1]);
            setToast(true);
            setTimeout(() => {
                setToast(false)
            }, 10000);
            setErrorMessage({
                icon: MdError,
                message: responseBody.message || 'Unauthorized action'
            });
            queryClient.invalidateQueries({
                queryKey: ['lockers'],
                exact: true
            });
        }
    };

    const getSingleLockerInfo = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/lockers/${id}`);
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
            console.log('Error: ', error);
        }
    };

    const resetLocker = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/lockers/patch/${id}`, {
                method: "PATCH",
            })
            const responseBody = await response.json();
            if (response.ok) {
                window.location.reload();
                queryClient.invalidateQueries(
                    {
                        queryKey: ['lockers'],
                        exact: true
                    }
                );
                setLockerFormState(false);
                setToast(true)
                setResponseType(responseResultType[0]);
                setTimeout(() => {
                    setToast(false)
                }, 7000);
                setSuccessMessage({
                    icon: MdDone,
                    message: responseBody.message || 'Unauthorized action'
                });
            }
            setResponseMessage(responseBody.message);
        } catch (error) {
            console.log("Error: ", error);
            setResponseType(responseResultType[1]);
            setToast(true);
            setTimeout(() => {
                setToast(false)
            }, 10000);
            setErrorMessage({
                icon: MdError,
                message: responseBody.message || 'Unauthorized action'
            });
            queryClient.invalidateQueries({
                queryKey: ['lockers'],
                exact: true
            });
        }
    };

    return (
        <div className="w-full bg-gray-100 dark:bg-gradient-to-br from-gray-800 via-slate-700 to-neutral-800 py-7 px-4" onClick={() => setToast(false)}>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink className='flex items-center font-medium' href="/"> <LiaHomeSolid className="mr-2 w-4 h-4" /> Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className={'font-medium'} />
                    <BreadcrumbItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1">
                                <BreadcrumbEllipsis className="h-4 w-4 font-medium" />
                            </DropdownMenuTrigger>
                        </DropdownMenu>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className={'font-medium'} />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard" className='font-medium'>Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className={'font-medium'} />
                    <BreadcrumbItem>
                        <BreadcrumbPage className='font-medium'>Lockers</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className='w-full dark:border-none bg-white dark:bg-gradient-to-br from-gray-700 to-gray-600 mt-4 p-6 rounded-md shadow-dm border' onClick={() => setToast(false)}>
                <div className='w-full flex justify-between items-center'>
                    <h1 className="text-2xl font-bold dark:text-white">Lockers</h1>
                    <Button className='rounded-sm hover:bg-blue-500 bg-blue-600 dark:text-white'><MdAdd className='w-4 h-4' />Add Lockers</Button>
                </div>
            </div>

            {
                lockerFormState && data?.Lockers ? (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-500 ease-out opacity-100">
                        <div className="bg-white md:rounded-lg rounded-none shadow-xl p-10 md:w-1/2 w-11/12 max-h-screen overflow-y-auto">
                            <h1 className="text-2xl font-bold text-gray-800 mb-6">Locker Details</h1>
                            <form className="space-y-3 h-full" onSubmit={handleSubmit(registerLocker)}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Locker Number</Label>
                                        <Input
                                            {...register('lockerNumber')}
                                            disabled
                                            className="rounded-lg border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                            placeholder="Locker Number"
                                        />
                                        {errors.lockerNumber && (
                                            <p className="text-sm font-semibold text-red-600">{errors.lockerNumber.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label>Member Name</Label>

                                        <div ref={searchRef} className="w-full flex justify-center">
                                            <div className="relative w-full">
                                                <div className="w-full">
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
                                                                className="w-full rounded-lg"
                                                                placeholder="Search members..."
                                                            />
                                                        )}
                                                    />
                                                    {errors.memberName && (
                                                        <p className="text-sm font-semibold text-red-600">
                                                            {errors.memberName.message}
                                                        </p>
                                                    )}
                                                </div>
                                                {renderDropdown && (
                                                    <div className="w-full absolute bg-white shadow-2xl h-80 overflow-y-auto z-10">
                                                        {members
                                                            ?.filter((member) => {
                                                                const matchByName = member.fullName
                                                                    .toLowerCase()
                                                                    .includes(searchQuery.toLowerCase());
                                                                return matchByName;
                                                            })
                                                            .map((member) => (
                                                                <p
                                                                    onClick={() => {
                                                                        setMemberName(member.fullName);
                                                                        setSearchQuery(member.fullName);
                                                                        setMemberId(member._id);
                                                                        setRenderDropdown(false);
                                                                    }}
                                                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                                    key={member._id}
                                                                    value={member._id}
                                                                >
                                                                    {member.fullName}
                                                                </p>
                                                            ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Renew Date</Label>
                                        <Controller
                                            name='renewDate'
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    {...register('renewDate')}
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        setRenewDate(e.target.value);
                                                        field.onChange(e);
                                                        clearErrors('renewDate');
                                                    }}
                                                    type="date"
                                                    className="rounded-lg border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                                />
                                            )}
                                        />
                                        {errors.renewDate && (
                                            <p className="text-sm font-semibold text-red-600">{errors.renewDate.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label>Duration</Label>
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
                                                    className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                                >
                                                    <option>Select</option>
                                                    <option value='1 Month'>1 Month</option>
                                                    <option value='3 Months'>3 Months</option>
                                                    <option value='6 Months'>6 Months</option>
                                                    <option value='12 Months'>12 Months</option>
                                                </select>
                                            )}
                                        />
                                        {errors.duration && (
                                            <p className="text-sm font-semibold text-red-600">{errors.duration.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Expire Date</Label>
                                        <Controller
                                            name='expireDate'
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    {...register('expireDate')}
                                                    value={expireDate}
                                                    onChange={(e) => {
                                                        setExpireDate(e.target.value);
                                                        field.onChange(e);
                                                        clearErrors('expireDate');
                                                    }}
                                                    type="date"
                                                    className="rounded-lg border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                                />
                                            )}
                                        />
                                        {errors.expireDate && (
                                            <p className="text-sm font-semibold text-red-600">{errors.expireDate.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label>Fee</Label>
                                        <Controller
                                            name='fee'
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    {...register('fee')}
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                    }}
                                                    className="rounded-lg border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                                />
                                            )}
                                        />
                                        {errors.fee && (
                                            <p className="text-sm font-semibold text-red-600">{errors.fee.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Payment Method</Label>
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
                                                    className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                                                >
                                                    <option>Select</option>
                                                    <option value='Fonepay'>Fonepay</option>
                                                    <option value='Cash'>Cash</option>
                                                    <option value='Card'>Card</option>
                                                </select>
                                            )}
                                        />
                                        {errors.paymentMethod && (
                                            <p className="text-sm font-semibold text-red-600">{errors.paymentMethod.message}</p>
                                        )}
                                    </div>

                                    {paymentMethod === 'Fonepay' && (
                                        <div>
                                            <Label>Reference Code</Label>
                                            <Controller
                                                control={control}
                                                name='referenceCode'
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        value={field.value}
                                                        {...register('referenceCode')}
                                                        onChange={(e) => field.onChange(e)}
                                                        className="rounded-lg border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                                    />
                                                )}
                                            />

                                            {errors.referenceCode && (
                                                <p className="text-sm font-semibold text-red-600">{errors.referenceCode.message}</p>
                                            )}
                                        </div>
                                    )}

                                    <div>
                                        <Label>Receipt No</Label>
                                        <Controller
                                            name='receiptNo'
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    {...register('receiptNo')}
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(e)}
                                                    className="rounded-lg border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                                />
                                            )}
                                        />
                                        {errors.receiptNo && (
                                            <p className="text-sm font-semibold text-red-600">{errors.receiptNo.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full flex justify-center mt-8 space-x-4">
                                    <Button type='submit' className="bg-green-500 text-white font-semibold rounded-lg px-6 py-2 shadow-md hover:bg-green-600 transition-all">
                                        {isSubmitting ? 'Submitting...' : "Submit"}
                                    </Button>
                                    <Button
                                        type='button'
                                        onClick={() => setLockerFormState(false)}
                                        className="bg-red-500 text-white font-semibold rounded-lg px-6 py-2 shadow-md hover:bg-red-600 transition-all"
                                    >
                                        Close
                                    </Button>
                                    {
                                        fetchedLocker ? (
                                            <Button
                                                type='button'
                                                onClick={() => resetLocker(fetchedLocker._id)}
                                                className="bg-red-500 text-white font-semibold rounded-lg px-6 py-2 shadow-md hover:bg-red-600 hover:text-white transition-all">
                                                Reset
                                            </Button>
                                        ) : (
                                            <>
                                            </>
                                        )
                                    }
                                </div>
                            </form>
                        </div>
                    </div>
                ) : (
                    <>
                    </>
                )
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
                                <div className="bg-white dark:bg-gradient-to-br from-gray-700 to-gray-600 dark:border-none rounded-xl mt-4 shadow-sm border p-4 md:p-6 space-y-6 md:space-y-0 md:flex md:gap-6 items-end">
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
                                                className="relative group rounded-2xl overflow-hidden my-4 md:my-0 transition-all duration-500 hover:duration-300 hover:-translate-y-1"
                                            >
                                                {/* Sophisticated gray gradient background */}
                                                <div className="absolute inset-0 bg-gradient-to-br opacity-20 group-hover:opacity-30 transition-opacity duration-300 dark:opacity-15 dark:group-hover:opacity-25
          from-gray-600 via-gray-700 to-gray-800" />

                                                <div className="relative backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/40 dark:border-gray-700/60 rounded-2xl overflow-hidden">
                                                    {/* Status bar with gray-based gradients */}
                                                    <div className={`h-1.5 ${locker.status === 'Expired'
                                                        ? 'bg-gradient-to-r from-gray-600 to-rose-700'
                                                        : locker.status === 'Booked'
                                                            ? 'bg-gradient-to-r from-gray-600 to-emerald-600'
                                                            : locker.status === 'Empty'
                                                                ? 'bg-gradient-to-r from-gray-600 to-amber-600'
                                                                : 'bg-gradient-to-r from-gray-600 to-blue-600'
                                                        }`}
                                                    />

                                                    <div className="p-5">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div>
                                                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                                                    Locker <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-600 dark:from-gray-400 dark:to-gray-300">
                                                                        #{locker.lockerNumber}
                                                                    </span>
                                                                </h2>
                                                                <div className="flex items-center mt-1">
                                                                    <span className={`w-2 h-2 rounded-full mr-2 ${locker.status === 'Expired'
                                                                        ? 'bg-rose-600'
                                                                        : locker.status === 'Booked'
                                                                            ? 'bg-emerald-600'
                                                                            : locker.status === 'Empty'
                                                                                ? 'bg-amber-500'
                                                                                : 'bg-blue-600'
                                                                        }`} />
                                                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                                        {locker.isAssigned ? 'Assigned' : 'Not Assigned'}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${locker.status === 'Expired'
                                                                ? 'bg-rose-600/10 text-rose-800 dark:text-rose-300 border border-rose-600/20'
                                                                : locker.status === 'Booked'
                                                                    ? 'bg-emerald-600/10 text-emerald-800 dark:text-emerald-300 border border-emerald-600/20'
                                                                    : locker.status === 'Empty'
                                                                        ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20'
                                                                        : 'bg-blue-600/10 text-blue-800 dark:text-blue-300 border border-blue-600/20'
                                                                }`}>
                                                                {locker.status}
                                                            </span>
                                                        </div>

                                                        {/* Locker details with subtle hover effect */}
                                                        <div className="space-y-3 text-sm mb-4">
                                                            {[
                                                                ['Member ID', locker.memberId],
                                                                ['Member Name', locker.memberName],
                                                                ['Renew Date', new Date(locker.renewDate).toLocaleDateString()],
                                                                ['Duration', locker.duration],
                                                                ['Expire Date', new Date(locker.expireDate).toLocaleDateString()],
                                                                ['Fee', `$${locker.fee}`]
                                                            ].map(([label, value]) => (
                                                                <div
                                                                    key={label}
                                                                    className="flex justify-between py-2 px-3 -mx-3 rounded-lg hover:bg-gray-100/70 dark:hover:bg-gray-700/50 transition-colors"
                                                                >
                                                                    <span className="text-gray-700 dark:text-gray-300">{label}</span>
                                                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                                                        {value || '-'}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Button with gray-based gradient */}
                                                        <button
                                                            onClick={() => {
                                                                setCurrentLockerNumber(locker.lockerNumber);
                                                                setLockerFormState(true);
                                                                setLockerId(locker._id);
                                                                getSingleLockerInfo(locker._id);
                                                            }}
                                                            className={`w-full mt-2 py-3 px-4 rounded-xl font-medium text-white relative overflow-hidden transition-all duration-300 shadow-md
              ${locker.status === 'Expired'
                                                                    ? 'bg-gradient-to-r from-gray-700 to-rose-700 hover:shadow-rose-700/20'
                                                                    : locker.status === 'Booked'
                                                                        ? 'bg-gradient-to-r from-gray-700 to-emerald-700 hover:shadow-emerald-700/20'
                                                                        : locker.status === 'Empty'
                                                                            ? 'bg-gradient-to-r from-gray-700 to-amber-600 hover:shadow-amber-600/20'
                                                                            : 'bg-gradient-to-r from-gray-700 to-blue-700 hover:shadow-blue-700/20'
                                                                }`}
                                                        >
                                                            <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all duration-300" />
                                                            <div className="relative flex items-center justify-center gap-2">
                                                                <FaLock className="text-lg" />
                                                                <span>Manage Locker</span>
                                                            </div>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Subtle decorative elements */}
                                                <div className="absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 bg-gray-600/10 rounded-full filter blur-xl" />
                                                <div className="absolute bottom-0 left-0 w-32 h-32 -ml-10 -mb-10 bg-gray-700/10 rounded-full filter blur-xl" />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-12">
                                            <div className="text-gray-600 dark:text-gray-400">
                                                <div className="inline-block p-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-700/60">
                                                    <FaLockOpen className="mx-auto text-4xl text-gray-500 dark:text-gray-400 mb-3" />
                                                    <p className="text-lg text-gray-800 dark:text-gray-200">No lockers available</p>
                                                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">Create a new locker to get started</p>
                                                </div>
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
