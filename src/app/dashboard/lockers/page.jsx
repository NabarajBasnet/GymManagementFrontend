'use client';

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
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";

const Lockers = () => {

    const [lockerFormState, setLockerFormState] = useState(false);

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

    const getAllLockers = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/lockers`);
            const responseBody = await response.json();
            console.log('Response Body: ', responseBody)
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
            const response = await fetch(`http://localhost:5000/api/members`);
            const responseBody = await response.json();
            console.log('Response Body: ', responseBody)
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
    console.log('Members: ', members)

    const registerLocker = async (data) => {
        try {
            const { renewDate, expireDate, fee, referenceCode, receiptNo } = data;
            const finalData = { lockerId, lockerNumber, memberId, memberName, renewDate, duration, expireDate, fee, paymentMethod, referenceCode, receiptNo };
            console.log("Final data: ", finalData);
            const response = await fetch(`http://localhost:5000/api/locker/create`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(finalData)
            });
            if (response.ok) {
                alert('Ok response')
            }
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
                                    <span className="sr-only">Toggle menu</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem>Documentation</DropdownMenuItem>
                                    <DropdownMenuItem>Themes</DropdownMenuItem>
                                    <DropdownMenuItem>GitHub</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/docs/components">Components</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-xl font-bold mt-3">Lockers</h1>
            </div>

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
                                        <Select
                                            onValueChange={(value) => {
                                                setMemberName(value);
                                                if (value) {
                                                    clearErrors('memberName');
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="rounded-lg border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none">
                                                <SelectValue placeholder="Select Member" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Select Member</SelectLabel>
                                                    <Input
                                                        className="rounded-lg mb-2 border-gray-300"
                                                        placeholder="Search member"
                                                    />
                                                    {isMemberLoading ? (
                                                        <h1>Loading members...</h1>
                                                    ) : (
                                                        members?.map((member) => (
                                                            <SelectItem
                                                                key={member._id}
                                                                value={member._id}
                                                                onClick={() => setMemberId(member._id)}
                                                            >
                                                                {member.fullName}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {errors.memberName && (
                                            <p className="text-sm font-semibold text-red-600">{errors.memberName.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Renew Date</Label>
                                        <Input
                                            {...register('renewDate', {
                                                required: { value: true, message: "Renew date is required" },
                                            })}
                                            type="date"
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
                                                <SelectValue placeholder="Select Duration" />
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
                                            {...register('expireDate', {
                                                required: { value: true, message: "Expire date is required" },
                                            })}
                                            type="date"
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
                                                <SelectValue placeholder="Select Payment Method" />
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
                                            className="rounded-lg border-gray-300 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                        />
                                        {errors.receiptNo && (
                                            <p className="text-sm font-semibold text-red-600">{errors.receiptNo.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full flex justify-center mt-8 space-x-4">
                                    <Button className="bg-blue-500 text-white font-semibold rounded-lg px-6 py-2 shadow-md hover:bg-blue-600 transition-all">
                                        Submit
                                    </Button>
                                    <Button
                                        onClick={() => setLockerFormState(false)}
                                        className="bg-red-500 text-white font-semibold rounded-lg px-6 py-2 shadow-md hover:bg-red-600 transition-all"
                                    >
                                        Close
                                    </Button>
                                    <Button className="bg-gray-200 text-gray-700 font-semibold rounded-lg px-6 py-2 shadow-md hover:bg-gray-500 hover:text-white transition-all">
                                        Reset
                                    </Button>
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
                {/* Filter Section */}
                <div className="w-full md:flex justify-start md:space-x-6 items-end bg-white p-6 rounded-xl shadow-lg">
                    <div className="w-full md:w-3/12">
                        <Label className="text-sm font-semibold text-gray-600">Locker Number</Label>
                        <Select className="w-full">
                            <SelectTrigger className="w-full rounded-lg border-gray-300 shadow-sm">
                                <SelectValue placeholder="Select a locker" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Lockers</SelectLabel>
                                    <SelectItem value="1">Locker 1</SelectItem>
                                    <SelectItem value="2">Locker 2</SelectItem>
                                    <SelectItem value="3">Locker 3</SelectItem>
                                    {/* Add more lockers */}
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
                                    <SelectItem value="empty">Empty</SelectItem>
                                    <SelectItem value="booked">Booked</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
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
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="occupied">Occupied</SelectItem>
                                    <SelectItem value="maintenance">Under Maintenance</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full md:w-3/12 flex justify-between items-end">
                        <Button className="rounded-lg bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 transition-all shadow-md">Submit</Button>
                        <div className="space-y-1">
                            <h1 className="font-medium text-gray-700 bg-white px-2 py-1 shadow-sm rounded-lg">Empty: 10</h1>
                            <h1 className="font-medium text-green-500 bg-white px-2 py-1 shadow-sm rounded-lg">Booked: 25</h1>
                            <h1 className="font-medium text-red-600 bg-white px-2 py-1 shadow-sm rounded-lg">Expired: 15</h1>
                        </div>
                    </div>
                </div>

                {/* Lockers Section */}
                {
                    isLoading ? (
                        <Loader />
                    ) : (
                        <div className="w-full mt-8">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {lockers.map((locker) => (
                                    <div key={locker.lockerNumber} className="bg-white border border-gray-100 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-transform duration-300 rounded-xl p-5">
                                        <div className="w-full">
                                            <div className="bg-blue-600 h-2 rounded-t-lg"></div>
                                            <h1 className="text-xl font-bold text-gray-800 mt-2">Locker {locker.lockerNumber}</h1>
                                            <p className="text-sm text-gray-700 font-semibold my-1">Member ID: {locker.memberId}</p>
                                            <p className="text-sm text-gray-700 font-semibold my-1">Member Name: {locker.memberName}</p>
                                            <p className="text-sm text-gray-700 font-semibold my-1">Renew Date: {locker.renewDate}</p>
                                            <p className="text-sm text-gray-700 font-semibold my-1">Duration: {locker.duration}</p>
                                            <p className="text-sm text-gray-700 font-semibold my-1">Expire Date: {locker.expireDate}</p>
                                            <p className="text-sm text-gray-700 font-semibold my-1">Fee: {locker.fee}</p>
                                            <p className="text-sm text-gray-700 font-semibold my-1">Status: {locker.isAssigned}</p>

                                            <Button onClick={() => {
                                                setCurrentLockerNumber(locker.lockerNumber);
                                                setLockerFormState(true);
                                                setLockerId(locker._id);
                                            }} className="rounded-lg bg-blue-600 text-white px-4 py-2 mt-4 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
                                                <FaLock
                                                    className="text-xl" /> Manage
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }

            </div>
        </div>
    )
}

export default Lockers;
