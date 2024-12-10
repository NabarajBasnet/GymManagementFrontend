'use client';

import Pagination from '@/components/ui/CustomPagination';
import { IoSearch } from "react-icons/io5";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import React from 'react';
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";
import { useForm } from "react-hook-form";
import { MdError, MdClose, MdDone } from "react-icons/md";
import { usePagination, DOTS } from "@/hooks/Pagination.js";

const MemberAttendance = () => {
    const queryClient = useQueryClient();
    const [memberId, setMemberId] = useState('');
    const [validationResult, setValidationResult] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 6;
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    const [toast, setToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState({ icon: MdDone, message: '' });
    const [errorMessage, setErrorMessage] = useState({ icon: MdError, message: '' });
    const [responseType, setResponseType] = useState('');

    const {

        formState: { errors }
    } = useForm();

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const getTemporaryAttendanceHistory = async ({ queryKey }) => {
        const [, page, searchQuery] = queryKey;
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/temporary-member-attendance-history?page=${page}&limit=${limit}&searchQuery=${searchQuery}`);
            return await response.json();
        } catch (error) {
            console.log('Error: ', error);
        }
    };

    const { data: temporaryMemberAttendanceHistory, isLoading: isAttendanceHistory } = useQuery({
        queryKey: ['temporaryMemberAttendanceHistory', currentPage, debouncedSearchQuery],
        queryFn: getTemporaryAttendanceHistory,
    });

    const { totalPages, totalAttendance } = temporaryMemberAttendanceHistory || {};

    const [membershipHoldToggle, setMembershipHoldToggle] = useState(false);

    const handleValidation = async () => {
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/validate-qr/${memberId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ memberId }),
            });

            const responseBody = await response.json();
            setValidationResult(responseBody);
            const responseResultType = ['Success', 'Failure'];

            if (response.status === 200) {
                setResponseType(responseResultType[0]);
                setToast(true);
                setSuccessMessage({
                    icon: MdDone,
                    message: responseBody.message
                });
            };

            if (response.status === 403 && responseBody.member.status === 'OnHold') {
                setMembershipHoldToggle(true);
            };

            if (response.status !== 403 && response.status !== 200) {
                setResponseType(responseResultType[1]);
                setToast(true);
                setErrorMessage({
                    icon: MdError,
                    message: responseBody.message
                })
            };

            return response;
        } catch (error) {
            console.log('Error: ', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (memberId.length >= 24) {
            handleValidation();
        }
    }, [memberId]);

    const reloadPage = () => {
        queryClient.invalidateQueries('temporaryMemberAttendanceHistory');
        window.location.reload();
    };

    const [activating, setActivating] = useState(false);

    const activateMembership = async () => {
        setActivating(true);
        const responseResultType = ['Success', 'Failure'];
        const membershipHoldData = { status: 'Active' };

        try {
            const response = await fetch(`http://88.198.112.156:3000/api/members/resume-membership/${memberId}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(membershipHoldData)
            });

            const responseBody = await response.json();
            if (response.status === 200) {
                setResponseType(responseResultType[0]);
                setMembershipHoldToggle(false);
                setToast(true);
                setSuccessMessage({
                    icon: MdDone,
                    message: responseBody.message
                });
                setTimeout(() => setToast(false), 10000);
            }

            setActivating(false);
            queryClient.invalidateQueries(['members']);
        } catch (error) {
            console.error("Error:", error);
            setToast(true);
            setErrorMessage({
                icon: MdError,
                message: "An unexpected error occurred."
            });
            setTimeout(() => setToast(false), 10000);
        } finally {
            setActivating(false);
        }
    };

    // Mantine pagination hook
    const { range, setPage, active } = usePagination({
        total: totalPages || 1,
        siblings: 1,
        boundaries: 1,
        page: currentPage,
        onChange: (page) => {
            setCurrentPage(page);
        },
    });

    return (
        <div className='w-full'>
            <div className='w-full p-4'>
                {toast && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="bg-white border flex justify-between items-center shadow-2xl p-4 relative">
                            {responseType === 'Success' ? (
                                <MdDone className="text-3xl mx-4 text-green-600" />
                            ) : (
                                <MdError className="text-3xl mx-4 text-red-600" />
                            )}
                            <p className={`text-sm font-semibold ${responseType === 'Success' ? 'text-green-600' : 'text-red-600'}`}>
                                {responseType === 'Success' ? successMessage.message : errorMessage.message}
                            </p>
                            <MdClose onClick={() => setToast(false)} className="cursor-pointer text-3xl ml-4" />
                        </div>
                    </div>
                )}

                {membershipHoldToggle && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="bg-white border shadow-2xl p-4 relative">
                            <div className="flex items-center justify-between">
                                {responseType === 'Success' ? (
                                    <MdDone className="text-3xl mx-4 text-green-600" />
                                ) : (
                                    <MdError className="text-3xl mx-4 text-red-600" />
                                )}
                                <p className={`text-sm font-semibold text-red-600`}>
                                    Membership on hold
                                </p>
                                <MdClose onClick={() => setMembershipHoldToggle(false)} className="cursor-pointer text-3xl ml-4" />
                            </div>
                            <h1 className="my-4 text-sm font-semibold">
                                {`Membership paused for ${validationResult?.member?.pausedDays} Days. Are you sure you want to activate?`}
                            </h1>
                            <div className="w-full flex justify-end space-x-2">
                                <Button onClick={() => setMembershipHoldToggle(false)} className="bg-red-600 hover:bg-red-700 transition-all duration-500">Cancel</Button>
                                <Button onClick={activateMembership} className="bg-green-600 hover:bg-green-700 transition-all duration-500">
                                    {activating ? 'Processing...' : 'Activate'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

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
                            <BreadcrumbLink>Attendance</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Member Attendance</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-xl font-bold mt-3">Member Attendance</h1>
            </div>

            <div>
                <div className='w-full md:flex md:space-x-4 space-y-4 md:space-y-0 justify-between py-4 md:py-0 px-4'>
                    <div className='w-full md:w-6/12 bg-white rounded-lg'>
                        <div className='w-full flex justify-start p-2'>
                            <Button
                                className="rounded-md"
                                onClick={() => {
                                    window.location.reload();
                                }}
                            >
                                Refresh
                            </Button>
                        </div>
                        <form className="grid grid-cols-1 space-y-2 px-2">
                            <Input
                                type="text"
                                placeholder="Scan QR code here"
                                value={memberId}
                                onChange={(e) => setMemberId(e.target.value)}
                                autoFocus
                                className="w-full focus:border-blue-600 rounded-none text-black"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        window.location.reload();
                                    }
                                }}
                            />
                            {errors.memberId && (
                                <p className="text-sm font-semibold text-red-600">
                                    {errors.memberId.message}
                                </p>
                            )}
                            <div className="flex justify-between items-center">
                                <Label className="w-3/12">Full Name</Label>
                                <Input
                                    value={validationResult?.member?.fullName || ""}
                                    disabled
                                    className="w-9/12 disabled:text-black bg-gray-100 rounded-none text-black"
                                />
                            </div>

                            <div className="flex justify-between items-center">
                                <Label className="w-3/12">Membership Option</Label>
                                <Input
                                    value={validationResult?.member?.membershipOption || ""}
                                    disabled
                                    className="w-9/12 bg-gray-100 rounded-none disabled:text-black text-black"
                                />
                            </div>

                            <div className="flex justify-between items-center">
                                <Label className="w-3/12">Membership Category</Label>
                                <Input
                                    value={validationResult?.member?.membershipType || ""}
                                    disabled
                                    className="w-9/12 bg-gray-100 rounded-none disabled:text-black text-black"
                                />
                            </div>

                            <div className="flex justify-between items-center">
                                <Label className="w-3/12">Membership Date</Label>
                                <Input
                                    value={
                                        validationResult?.member?.membershipDate
                                            ? new Date(validationResult.member.membershipDate)
                                                .toISOString()
                                                .split("T")[0]
                                            : ""
                                    }
                                    disabled
                                    className="w-9/12 bg-gray-100 rounded-none text-black disabled:text-black"
                                />
                            </div>

                            <div className="flex justify-between items-center">
                                <Label className="w-3/12">Renew Date</Label>
                                <Input
                                    value={
                                        validationResult?.member?.membershipDate
                                            ? new Date(validationResult.member.membershipDate)
                                                .toISOString()
                                                .split("T")[0]
                                            : ""
                                    }
                                    disabled
                                    className="w-9/12 bg-gray-100 rounded-none text-black disabled:text-black"
                                />
                            </div>

                            <div className="flex justify-between items-center">
                                <Label className="3/12">Expire Date</Label>
                                <Input
                                    value={
                                        validationResult?.member?.membershipDate
                                            ? new Date(validationResult.member.membershipExpireDate)
                                                .toISOString()
                                                .split("T")[0]
                                            : ""
                                    }
                                    disabled
                                    className="w-9/12 bg-gray-100 rounded-none text-black disabled:text-black"
                                />
                            </div>

                            <div className="w-full flex justify-between items-start">
                                <Label className="w-3/12">Message</Label>
                                <Textarea
                                    value={validationResult?.message || ""}
                                    disabled
                                    className="w-9/12 bg-gray-100 text-green-600 font-semibold rounded-none disabled:text-green-600 cursor-not-allowed h-40"
                                />
                            </div>
                        </form>
                    </div>
                    <div className='w-full md:w-6/12 bg-white rounded-lg'>
                        <div className="w-full flex justify-center">
                            <div className="w-full">
                                <h1 className="p-2">Member Attendance Record</h1>
                                <div className="flex justify-center p-2">
                                    <div className="w-11/12 px-4 flex justify-between border border-gray-400 rounded-none items-center">
                                        <IoSearch className="text-xl" />
                                        <Input
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className='w-full border-none bg-none'
                                            placeholder='Search Member...'
                                        />
                                    </div>
                                </div>
                                {
                                    isAttendanceHistory ? (
                                        <Loader />
                                    ) : (
                                        <div>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-[100px]">Member Id</TableHead>
                                                        <TableHead>Full Name</TableHead>
                                                        <TableHead>Option</TableHead>
                                                        <TableHead className="text-right">Check In</TableHead>
                                                        <TableHead className="text-right">Expires In</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {temporaryMemberAttendanceHistory?.temporarymemberattendancehistory.map((attendance) => (
                                                        <TableRow key={attendance._id}>
                                                            <TableCell className="font-medium">{attendance.memberId}</TableCell>
                                                            <TableCell>{attendance.fullName}</TableCell>
                                                            <TableCell>{attendance.membershipOption}</TableCell>
                                                            <TableCell>
                                                                {new Date(attendance.checkInTime).toLocaleDateString('en-GB', {
                                                                    year: 'numeric',
                                                                    month: '2-digit',
                                                                    day: '2-digit',
                                                                })}{" "}
                                                                {new Date(attendance.checkInTime).toLocaleTimeString('en-GB', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    second: '2-digit',
                                                                })}
                                                            </TableCell>

                                                            <TableCell>
                                                                {new Date(attendance.expiration).toLocaleDateString('en-GB', {
                                                                    year: 'numeric',
                                                                    month: '2-digit',
                                                                    day: '2-digit',
                                                                })}{" "}
                                                                {new Date(attendance.expiration).toLocaleTimeString('en-GB', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                    second: '2-digit',
                                                                })}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                                <TableFooter>
                                                    <TableRow>
                                                        <TableCell colSpan={3}>Total Member Attendance</TableCell>
                                                        <TableCell className="text-right">{totalAttendance}</TableCell>
                                                    </TableRow>
                                                </TableFooter>
                                            </Table>
                                        </div>
                                    )
                                }
                                <div className="w-full flex justify-center py-4">
                                    <Pagination
                                        total={totalPages ? totalPages : 1}
                                        siblings={1}
                                        boundaries={1}
                                        page={currentPage}
                                        onChange={setCurrentPage}
                                        withEdges
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MemberAttendance;
