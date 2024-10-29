'use client'

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
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
import React, { useEffect } from 'react';
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
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";
import { useForm } from "react-hook-form";

const MemberAttendance = () => {
    const queryClient = useQueryClient();
    const [memberId, setMemberId] = useState('');
    const [validationResult, setValidationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurentPage] = useState(1);
    const limit = 6;
    const [membershipAlert, setMembershipAlert] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const {
        register,
        reset,
        handleSubmit,
        setError,
        clearErrors,
        formState: { isSubmitting, errors }
    } = useForm();

    const getTemporaryAttendanceHistory = async ({ queryKey }) => {
        const [, page] = queryKey;
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/temporary-member-attendance-history?page=${page}&limit=${limit}`);
            return await response.json();
        } catch (error) {
            console.log('Error: ', error);
        }
    };

    const { data: temporaryMemberAttendanceHistory, isLoading: isAttendanceHistory } = useQuery({
        queryKey: ['temporaryMemberAttendanceHistory', currentPage],
        queryFn: getTemporaryAttendanceHistory,
    });

    const { totalPages, totalAttendance } = temporaryMemberAttendanceHistory || {};
    const [returnedResponse, setReturnedResponse] = useState(null);
    console.log("Returned Response: ", returnedResponse);
    const handlePageChange = (page) => {
        setCurentPage(page);
    };

    const handleValidation = async () => {
        setLoading(true);
        console.log('Member Id: ', memberId.length);

        try {
            const response = await fetch(`http://88.198.112.156:3000/api/validate-qr/${memberId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ memberId }),
            });

            const validationResponseResult = await response.json();
            setValidationResult(validationResponseResult);

            if (response.status === 401) {
                setMembershipAlert(true);
                setAlertMessage(validationResponseResult.message);
            }

            if (response.status === 400) {
                setMembershipAlert(true);
                setAlertMessage(validationResponseResult.message);
            }

            if (response.status === 500) {
                setMembershipAlert(true);
                setAlertMessage(validationResponseResult.error);
            }

            if (response.status === 200) {
                queryClient.invalidateQueries('temporaryMemberAttendanceHistory');
            } else if (response.status === 403) {
                setMembershipAlert(true);
                setAlertMessage(validationResponseResult.message);
            }

            setLoading(false);
            setReturnedResponse(response);
            return response;
        } catch (error) {
            console.log('Error: ', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (memberId && memberId.length === 24) {  // Check if memberId has 24 characters
            setTimeout(() => {
                handleValidation();
            },);
        }
    }, [memberId]);

    const reloadPage = async () => {
        queryClient.invalidateQueries('temporaryMemberAttendanceHistory');
    };

    const onEnterPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setMembershipAlert(false);
            // window.location.reload();
        }
    };

    return (
        <div className='w-full'>
            <div className='w-full p-4'>
                {membershipAlert ? (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                        <div className="bg-white p-4 rounded-sm shadow-lg w-[30rem]">
                            <h2 className="text-lg font-bold mb-4">Membership Alert</h2>
                            <p className="mb-6">{alertMessage}</p>
                            <div className="w-full flex justify-center">
                                <Button
                                    onKeyPress={(e) => onEnterPress(e)}
                                    onClick={() => setMembershipAlert(false)}
                                    className="w-full rounded-none bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4"
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                    </>
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
                            <Button className='rounded-none' onClick={reloadPage}>Refresh</Button>
                        </div>
                        <form onSubmit={handleSubmit(handleValidation)} className="grid grid-cols-1 space-y-2 px-2">
                            <Input
                                type="text"
                                placeholder="Scan QR code here"
                                // {
                                //     ...register('memberId',{
                                //         required:{
                                //             value:true,
                                //             message:"Please scan qr code"
                                //         }
                                //     })
                                // }

                                value={memberId}
                                onChange={(e) => setMemberId(e.target.value)}
                                autoFocus
                                className="w-full focus:border-blue-600 rounded-none text-black"
                                onKeyPress={(e) => onEnterPress(e)}
                            />
                            {
                                errors.memberId && (
                                    <p className="text-sm font-semibold text-red-600">{`${errors.memberId.message}`}</p>
                                )
                            }

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

                                            <div className="py-4">
                                                <Pagination className={'cursor-pointer'}>
                                                    <PaginationContent>
                                                        <PaginationItem>
                                                            <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                                                        </PaginationItem>
                                                        {[...Array(totalPages)].map((_, i) => (
                                                            <PaginationItem key={i}>
                                                                <PaginationLink isActive={currentPage === i + 1} onClick={() => handlePageChange(i + 1)}>
                                                                    {i + 1}
                                                                </PaginationLink>
                                                            </PaginationItem>
                                                        ))}
                                                        <PaginationItem>
                                                            <PaginationEllipsis />
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationNext onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                                                        </PaginationItem>
                                                    </PaginationContent>
                                                </Pagination>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default MemberAttendance;
