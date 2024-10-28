'use client';

import Badge from '@mui/material/Badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { MdDone } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { FaLock } from "react-icons/fa";
import { FaUnlock } from "react-icons/fa";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";

const Lockers = () => {

    const queryClient = useQueryClient()
    const [lockerFormState, setLockerFormState] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [toast, setToast] = useState(false);
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
        formState: { isSubmitting, errors }
    } = useForm();

    const [lockerId, setLockerId] = useState('');
    const [memberId, setMemberId] = useState('');
    const [lockerNumber, setCurrentLockerNumber] = useState('');
    const [memberName, setMemberName] = useState('');
    const [duration, setDuration] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [fetchedLocker, setFetchedLocker] = useState({})

    const getAllLockers = async () => {
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/lockers`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ['lockers'],
        queryFn: getAllLockers
    });

    const { lockers } = data || {}

    const getAllMembers = async () => {
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/members`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        }
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

            const response = await fetch('http://88.198.112.156:3000/api/lockers/put', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalData),
                credentials: 'include',
            })

            if (response.status === 400) {
                setToast(true)
                setTimeout(() => {
                    setToast(false)
                }, 5000);
                queryClient.invalidateQueries(['lockers']);
            }

            if (response.status === 500) {
                setToast(true)
                setTimeout(() => {
                    setToast(false)
                }, 5000);
                queryClient.invalidateQueries(['lockers']);
            }

            if (response.ok) {
                setLockerFormState(false);
                setToast(true)
                setTimeout(() => {
                    setToast(false)
                }, 5000);
                queryClient.invalidateQueries(['lockers']);
            }
            const responseBody = await response.json();
            console.log('Reponse body: ', responseBody);
            setResponseMessage(responseBody.message);
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const getSingleLockerInfo = async (id) => {
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/lockers/${id}`);
            const responseBody = await response.json();
            setFetchedLocker(responseBody.lockerDetails);
            return responseBody;
        } catch (error) {
            console.log('Error: ', error);
        }
    };

    const resetLocker = async (id) => {
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/lockers/patch/${id}`, {
                method: "PATCH",
                body: JSON.stringify({})
            })
            if (response.ok) {
                setLockerFormState(false);
                setToast(true)
                setTimeout(() => {
                    setToast(false)
                }, 5000);
                queryClient.invalidateQueries(['lockers']);
            }
            const responseBody = await response.json();
            setResponseMessage(responseBody.message);
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    return (
        <div className="w-full">
            <div className='w-full p-6'>
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
                            <BreadcrumbLink href="/docs/components">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Lockers</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-xl font-bold mt-3">Lockers</h1>
            </div>

            {toast ? (
                <div className="w-full flex justify-center">
                    <div className="fixed top-5 bg-white border shadow-2xl flex z-50 items-center justify-between p-4">
                        <div>
                            <MdDone className="text-4xl mx-4 text-green-600" />
                        </div>
                        <div className="block">
                            <p className="text-sm font-semibold">{responseMessage}</p>
                        </div>
                        <div>
                            <IoMdClose
                                onClick={() => setToast(false)}
                                className="cursor-pointer ml-4" />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                </>
            )}

            {
                lockerFormState && lockerNumber ? (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-500 ease-out opacity-100">
                        <div className="bg-white md:rounded-lg rounded-none shadow-xl p-8 md:w-1/2 w-11/12 max-h-screen overflow-y-auto">
                            <h1 className="text-2xl font-bold text-gray-800 mb-6">Locker Details</h1>
                            <form className="space-y-3 h-full" onSubmit={handleSubmit(registerLocker)}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Locker Number</Label>
                                        <Input
                                            {...register('lockerNumber')}
                                            disabled
                                            defaultValue={lockerNumber}
                                            className="rounded-lg border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                            placeholder="Locker Number"
                                        />
                                        {errors.lockerNumber && (
                                            <p className="text-sm font-semibold text-red-600">{errors.lockerNumber.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label>Member Name</Label>

                                        <div ref={searchRef} className='w-full flex justify-center'>
                                            <div className='relative w-full'>
                                                <div className='w-full'>
                                                    <Input
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        onFocus={handleSearchFocus}
                                                        className='w-full rounded-lg'
                                                        placeholder='Search members...'
                                                    />
                                                    {errors.memberName && (
                                                        <p className="text-sm font-semibold text-red-600">{errors.memberName.message}</p>
                                                    )}
                                                </div>
                                                {renderDropdown && (
                                                    <div className='w-full absolute bg-white shadow-2xl max-h-screen overflow-y-auto z-10'>
                                                        {members?.filter((member) => {
                                                            const matchByName = member.fullName.toLowerCase().includes(searchQuery.toLowerCase());
                                                            return matchByName;
                                                        })
                                                            .map((member) => (
                                                                <p
                                                                    onClick={() => {
                                                                        setMemberName(member.fullName);
                                                                        setSearchQuery(member.fullName);
                                                                        setMemberId(member._id)
                                                                        setRenderDropdown(false);
                                                                    }}
                                                                    className='px-4 py-2 cursor-pointer hover:bg-gray-100'
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
                                        <Input
                                            value={renewDate.toISOString().split('T')[0]}
                                            onChange={(e) => {
                                                setRenewDate(e.target.value);
                                                clearErrors('renewDate');
                                            }}
                                            type="date"
                                            defaultValue={fetchedLocker ? new Date(fetchedLocker.renewDate) : ''}
                                            className="rounded-lg border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                        />
                                        {errors.renewDate && (
                                            <p className="text-sm font-semibold text-red-600">{errors.renewDate.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label>Duration</Label>
                                        <Select onValueChange={(value) => {
                                            setDuration(value);
                                            if (value) {
                                                clearErrors('duration')
                                            }
                                        }}>
                                            <SelectTrigger className="rounded-lg border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none">
                                                <SelectValue placeholder={fetchedLocker ? fetchedLocker.duration : ''} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Select Duration</SelectLabel>
                                                    <SelectItem value="1 Month">1 Month</SelectItem>
                                                    <SelectItem value="3 Months">3 Months</SelectItem>
                                                    <SelectItem value="6 Months">6 Months</SelectItem>
                                                    <SelectItem value="12 Months">12 Months</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {errors.duration && (
                                            <p className="text-sm font-semibold text-red-600">{errors.duration.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Expire Date</Label>
                                        <Input
                                            value={expireDate}
                                            onChange={(e) => {
                                                setExpireDate(e.target.value);
                                                clearErrors('expireDate');
                                            }}
                                            type="date"
                                            defaultValue={
                                                fetchedLocker && fetchedLocker.expireDate && !isNaN(new Date(fetchedLocker.expireDate))
                                                    ? new Date(fetchedLocker.expireDate).toISOString().split('T')[0]
                                                    : ''
                                            }
                                            className="rounded-lg border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                        />
                                        {errors.expireDate && (
                                            <p className="text-sm font-semibold text-red-600">{errors.expireDate.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label>Fee</Label>
                                        <Input
                                            {...register('fee', {
                                                required: { value: true, message: "Fee is required" },
                                            })}
                                            defaultValue={fetchedLocker ? fetchedLocker.fee : ''}
                                            className="rounded-lg border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                        />
                                        {errors.fee && (
                                            <p className="text-sm font-semibold text-red-600">{errors.fee.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Payment Method</Label>
                                        <Select onValueChange={(value) => {
                                            setPaymentMethod(value);
                                            if (value) {
                                                clearErrors('paymentMethod')
                                            }
                                        }}>
                                            <SelectTrigger className="rounded-lg border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none">
                                                <SelectValue placeholder={fetchedLocker ? fetchedLocker.paymentMethod : ''} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Payment Method</SelectLabel>
                                                    <SelectItem value="Fonepay">Fonepay</SelectItem>
                                                    <SelectItem value="Cash">Cash</SelectItem>
                                                    <SelectItem value="Card">Card</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {errors.paymentMethod && (
                                            <p className="text-sm font-semibold text-red-600">{errors.paymentMethod.message}</p>
                                        )}
                                    </div>

                                    {paymentMethod === 'Fonepay' && (
                                        <div>
                                            <Label>Reference Code</Label>
                                            <Input
                                                {...register('referenceCode', {
                                                    required: { value: true, message: "Reference code is required" },
                                                })}
                                                defaultValue={fetchedLocker ? fetchedLocker.referenceCode : ''}
                                                className="rounded-lg border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                            />
                                            {errors.referenceCode && (
                                                <p className="text-sm font-semibold text-red-600">{errors.referenceCode.message}</p>
                                            )}
                                        </div>
                                    )}

                                    <div>
                                        <Label>Receipt No</Label>
                                        <Input
                                            {...register('receiptNo', {
                                                required: { value: true, message: "Receipt number is required" },
                                            })}
                                            defaultValue={fetchedLocker ? fetchedLocker.receiptNo : ''}
                                            className="rounded-lg border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                        />
                                        {errors.receiptNo && (
                                            <p className="text-sm font-semibold text-red-600">{errors.receiptNo.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full flex justify-center mt-8 space-x-4">
                                    <Button className="bg-blue-500 text-white font-semibold rounded-lg px-6 py-2 shadow-md hover:bg-blue-600 transition-all">
                                        {isSubmitting ? 'Submitting...' : "Submit"}
                                    </Button>
                                    <Button
                                        onClick={() => setLockerFormState(false)}
                                        className="bg-red-500 text-white font-semibold rounded-lg px-6 py-2 shadow-md hover:bg-red-600 transition-all"
                                    >
                                        Close
                                    </Button>
                                    {
                                        fetchedLocker ? (
                                            <Button
                                                onClick={() => resetLocker(fetchedLocker._id)}
                                                className="bg-gray-200 text-gray-700 font-semibold rounded-lg px-6 py-2 shadow-md hover:bg-gray-500 hover:text-white transition-all">
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

            <div className="w-full bg-gray-50 min-h-screen p-8">
                {isLoading ? (
                    <></>
                ) : (
                    <div className="w-full md:flex justify-start md:space-x-6 items-end bg-white p-6 rounded-xl shadow-lg">
                        <div className="w-full md:w-3/12">
                            <Label className="text-sm font-semibold text-gray-600">Locker Number</Label>
                            <Select className="w-full">
                                <SelectTrigger className="w-full rounded-lg border-gray-300 shadow-sm">
                                    <SelectValue placeholder="Sort by order" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Order</SelectLabel>
                                        <SelectItem value="Ascending">Ascending</SelectItem>
                                        <SelectItem value="Descending">Descending</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full md:w-3/12">
                            <Label className="text-sm font-semibold text-gray-600">Status</Label>
                            <Select className="w-full">
                                <SelectTrigger className="w-full rounded-lg border-gray-300 shadow-sm">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Status</SelectLabel>
                                        <SelectItem value="Empty">Empty</SelectItem>
                                        <SelectItem value="Booked">Booked</SelectItem>
                                        <SelectItem value="Expired">Expired</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full md:w-3/12">
                            <Label className="text-sm font-semibold text-gray-600">Locker Filter</Label>
                            <Select className="w-full">
                                <SelectTrigger className="w-full rounded-lg border-gray-300 shadow-sm">
                                    <SelectValue placeholder="Filter lockers" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Filter</SelectLabel>
                                        <SelectItem value="Available">Available</SelectItem>
                                        <SelectItem value="Occupied">Occupied</SelectItem>
                                        <SelectItem value="UnderMaintenance">Under Maintenance</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full md:w-3/12 flex justify-between items-end">
                            <Button className="rounded-lg mt-4 md:mt-0 bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 transition-all shadow-md">Submit</Button>
                            <div className="space-x-2 md:space-y-0">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Badge badgeContent={4} color="primary">
                                                <div className='bg-green-600 w-6 h-6 rounded-full shadow-lg cursor-pointer'>
                                                </div>
                                            </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Assigned lockers</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Badge badgeContent={4} color="primary">
                                                <div className='bg-yellow-400 w-6 h-6 rounded-full shadow-lg cursor-pointer'>
                                                </div>
                                            </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Empty lockers</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Badge badgeContent={4} color="primary">
                                                <div className='bg-red-600 w-6 h-6 rounded-full shadow-lg cursor-pointer'>
                                                </div>
                                            </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Expired lockers</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    </div>
                )}

                {
                    isLoading ? (
                        <Loader />
                    ) : (
                        <div className="w-full mt-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {Array.isArray(lockers) && lockers.length > 0 ? (
                                    lockers.map((locker) => (
                                        <div key={locker.lockerNumber} className="bg-white border border-gray-100 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-transform duration-300 rounded-xl p-3">
                                            <div className="w-full">
                                                <div className={`${locker.isAssigned ? 'bg-green-600' : 'bg-yellow-400'} h-2 rounded-t-lg`}></div>
                                                <h1 className="w-full text-xl space-x-4 font-bold text-gray-800 mt-2">
                                                    <span>Locker</span> <span>{locker.lockerNumber}</span>
                                                </h1>
                                                <p className="w-full text-sm space-x-4 text-gray-700 font-semibold my-1">
                                                    <span>Member ID:</span> <span>{locker.memberId}</span>
                                                </p>
                                                <p className="w-full text-sm space-x-4 text-gray-700 font-semibold my-1">
                                                    <span> Member Name:</span> <span>{locker.memberName}</span>
                                                </p>
                                                <p className="w-full text-sm space-x-4 text-gray-700 font-semibold my-1">
                                                    <span>Renew Date:</span>
                                                    <span>{locker.renewDate ? new Date(locker.renewDate).toISOString().split('T')[0] : ''}</span>
                                                </p>
                                                <p className="w-full text-sm space-x-4 text-gray-700 font-semibold my-1">
                                                    <span>Duration:</span> <span>{locker.duration}</span>
                                                </p>
                                                <p className="w-full text-sm space-x-4 text-gray-700 font-semibold my-1">
                                                    <span>Expire Date:</span>
                                                    <span>{locker.expireDate ? new Date(locker.expireDate).toISOString().split('T')[0] : ''}</span>
                                                </p>
                                                <p className="w-full text-sm space-x-4 text-gray-700 font-semibold my-1">
                                                    <span>Fee:</span> <span>{locker.fee}</span>
                                                </p>
                                                <p className="w-full text-sm space-x-4 text-gray-700 font-semibold my-1">
                                                    <span>Status: </span> <span>{locker.isAssigned ? 'Assigned' : 'Empty'}</span>
                                                </p>
                                                <Button onClick={() => {
                                                    setCurrentLockerNumber(locker.lockerNumber);
                                                    setLockerFormState(true);
                                                    setLockerId(locker._id);
                                                    getSingleLockerInfo(locker._id);
                                                }} className={`rounded-lg ${locker.isAssigned ? 'bg-green-600' : 'bg-yellow-400'} text-white px-4 py-2 mt-4 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all`}>
                                                    <FaLock className="text-xl" /> Manage
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>Locker not found.</p>
                                )}
                            </div>
                        </div>
                    )
                }
            </div>
        </div >
    )
}

export default Lockers;
