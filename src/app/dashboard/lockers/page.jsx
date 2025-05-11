'use client';

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
            const response = await fetch(`http://88.198.115.156:3000/api/lockers?order=${lockerOrder}&status=${lockerStatus}`);
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
            const response = await fetch(`http://88.198.115.156:3000/api/members`);
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

            const response = await fetch('http://88.198.115.156:3000/api/lockers/put', {
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
            const response = await fetch(`http://88.198.115.156:3000/api/lockers/${id}`);
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
            const response = await fetch(`http://88.198.115.156:3000/api/lockers/patch/${id}`, {
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
        <div className="w-full" onClick={() => setToast(false)}>
            <div className='w-full p-6' onClick={() => setToast(false)}>
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
                            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Lockers</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-xl font-bold mt-3">Lockers</h1>
            </div>

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
                                        ? (
                                            <>
                                                <p>{successMessage.message}</p>
                                            </>
                                        )
                                        :
                                        (
                                            <>
                                                <p>{errorMessage.message}</p>
                                            </>
                                        )
                                    }
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

            {
                lockerFormState && data.Lockers ? (
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

            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                {isLoading ? (
                    <>
                        <Loader />
                    </>
                ) : (
                    <div className="w-full">
                        {!isLoading && (
                            <div className="max-w-full mx-4">
                                <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 space-y-6 md:space-y-0 md:flex md:gap-6 items-end">
                                    <div className="flex-1">
                                        <Label className="text-sm font-semibold text-gray-600 mb-2 block">
                                            Locker Number
                                        </Label>
                                        <Select value={lockerOrder} onValueChange={setLockerOrder}>
                                            <SelectTrigger className="w-full rounded-sm">
                                                <SelectValue placeholder="Sort by order" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Order</SelectLabel>
                                                    <SelectItem value="asc">Ascending</SelectItem>
                                                    <SelectItem value="desc">Descending</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex-1">
                                        <Label className="text-sm font-semibold text-gray-600 mb-2 block">
                                            Status
                                        </Label>
                                        <Select value={lockerStatus} onValueChange={setLockerStatus}>
                                            <SelectTrigger className="w-full rounded-sm">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Status</SelectLabel>
                                                    <SelectItem value="Empty">Empty</SelectItem>
                                                    <SelectItem value="Booked">Booked</SelectItem>
                                                    <SelectItem value="Expired">Expired</SelectItem>
                                                    <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button
                                        className="bg-red-600 hover:bg-red-600 cursor-pointer flex items-center justify-around"
                                        onClick={() => {
                                            setLockerOrder('');
                                            setLockerStatus('');
                                        }}>
                                        <RiResetRightFill className="h-5 w-5 space-x-2 mx-2" />
                                        Reset Filter
                                    </Button>

                                    <div className="flex-shrink-0">
                                        <Label className="text-sm font-semibold text-gray-600 mb-2 block">
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
                                                            <FaLock className="h-5 w-5 text-blue-600 cursor-pointer" />
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

                                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-4 lg:gap-8">
                                    {Array.isArray(Lockers) && Lockers.length > 0 ? (
                                        Lockers.map((locker) => (
                                            <div
                                                key={locker.lockerNumber}
                                                className="bg-white rounded-xl my-4 overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                                            >
                                                <div
                                                    className={`h-2 ${locker.status === 'Expired'
                                                        ? 'bg-red-600'
                                                        : locker.status === 'Booked'
                                                            ? 'bg-green-600'
                                                            : locker.status === 'Empty'
                                                                ? 'bg-yellow-400'
                                                                : 'bg-blue-600'
                                                        }`}
                                                />
                                                <div className="p-5">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <h2 className="text-xl font-bold text-gray-800">
                                                            Locker {locker.lockerNumber}
                                                        </h2>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${locker.status === 'Expired'
                                                            ? 'bg-red-100 text-red-800'
                                                            : locker.status === 'Booked'
                                                                ? 'bg-green-100 text-green-800'
                                                                : locker.status === 'Empty'
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : 'bg-blue-100 text-blue-800'
                                                            }`}>
                                                            {locker.status}
                                                        </span>
                                                    </div>

                                                    <div className="space-y-2 text-sm">
                                                        {[
                                                            ['Member ID', locker.memberId],
                                                            ['Member Name', locker.memberName],
                                                            ['Renew Date', new Date(locker.renewDate).toLocaleDateString()],
                                                            ['Duration', locker.duration],
                                                            ['Expire Date', new Date(locker.expireDate).toLocaleDateString()],
                                                            ['Fee', locker.fee],
                                                            ['Assignment', locker.isAssigned ? 'Assigned' : 'Not Assigned']
                                                        ].map(([label, value]) => (
                                                            <div key={label} className="flex justify-between">
                                                                <span className="text-gray-600">{label}</span>
                                                                <span className="font-medium text-gray-900">{value}</span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <Button
                                                        onClick={() => {
                                                            setCurrentLockerNumber(locker.lockerNumber);
                                                            setLockerFormState(true);
                                                            setLockerId(locker._id);
                                                            getSingleLockerInfo(locker._id);
                                                        }}
                                                        className={`w-full mt-6 gap-2 ${locker.status === 'Expired'
                                                            ? 'bg-red-600 hover:bg-red-700'
                                                            : locker.status === 'Booked'
                                                                ? 'bg-green-600 hover:bg-green-700'
                                                                : locker.status === 'Empty'
                                                                    ? 'bg-yellow-500 hover:bg-yellow-600'
                                                                    : 'bg-blue-600 hover:bg-blue-700'
                                                            }`}
                                                    >
                                                        <FaLock className="text-xl" />
                                                        Manage Locker
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-12">
                                            <div className="text-gray-500">No lockers found</div>
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
