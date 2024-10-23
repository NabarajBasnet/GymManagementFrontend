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


const MemberAttendance = () => {
    const queryClient = useQueryClient();
    const [memberId, setMemberId] = useState('');
    const [validationResult, setValidationResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const getTemporaryAttendanceHistory = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/temporary-member-attendance-history`);
            return await response.json();
        } catch (error) {
            console.log('Error: ', error);
        }
    };

    const { data: temporaryMemberAttendanceHistory, isLoading: isAttendanceHistory } = useQuery({
        queryKey: ['temporaryMemberAttendanceHistory'],
        queryFn: getTemporaryAttendanceHistory,
    });

    const postTemporaryAttendanceHistory = async () => {
        if (!validationResult || !validationResult.member) return;
        try {
            const response = await fetch(`http://localhost:5000/api/temporary-member-attendance-history/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    memberId,
                    fullName: validationResult.member.fullName,
                    membershipOption: validationResult.member.membershipOption,
                }),
            });
            return await response.json();
        } catch (error) {
            console.log('Error: ', error);
        }
    };

    const postPermamentAttendanceHistory = async () => {
        if (!validationResult || !validationResult.member) return;
        try {
            const response = await fetch(`http://localhost:5000/api/permanent-member-attendance-history/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    memberId,
                    fullName: validationResult.member.fullName,
                    membershipOption: validationResult.member.membershipOption,
                }),
            });
            return await response.json();
        } catch (error) {
            console.log('Error: ', error);
        }
    };

    const handleValidation = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/validate-qr/${memberId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ memberId }),
            });

            const validationResponseResult = await response.json();
            setValidationResult(validationResponseResult);

            if (response.status === 200) {
                await postPermamentAttendanceHistory();
                await postTemporaryAttendanceHistory();
                queryClient.invalidateQueries('temporaryMemberAttendanceHistory');
            } else if (response.status === 403) {
                alert('Membership has expired!');
            }

            setLoading(false);
        } catch (error) {
            console.log('Error: ', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (memberId) {
            handleValidation();
        }
    }, [memberId]);

    const reloadPage = async () => {
        queryClient.invalidateQueries('temporaryMemberAttendanceHistory');
        window.location.reload();
    };

    const onEnterPres = (e) => {
        if (e.key === 'Enter') {
            reloadPage();
        }
    };

    return (
        <div className='w-full'>
            <div className='w-full p-4'>
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
                <h1 className="text-xl font-bold mt-3">Member Attendance</h1>
            </div>

            <div>
                <div className='w-full md:flex md:space-x-4 space-y-4 md:space-y-0 justify-between py-4 md:py-0 px-4'>
                    <div className='w-full md:w-6/12 bg-white rounded-lg'>
                        <div className='w-full flex justify-start p-2'>
                            <Button className='rounded-none' onClick={reloadPage}>Refresh</Button>
                        </div>
                        <div className="grid grid-cols-1 space-y-2 px-2">
                            <Input
                                type='text'
                                placeholder='Scan QR code here'
                                value={memberId}
                                onChange={(e) => setMemberId(e.target.value)}
                                autoFocus
                                className='w-full focus:border-blue-600 rounded-none '
                                onKeyPress={(e) => onEnterPres(e)}
                            />

                            <div className="flex justify-between items-center">
                                <Label className='w-3/12'>Full Name</Label>
                                <Input
                                    value={validationResult?.member?.fullName || ''}
                                    disabled
                                    className='w-9/12 bg-gray-100 rounded-none '
                                />
                            </div>

                            <div className="flex justify-between items-center">
                                <Label className='w-3/12'>Membership Option</Label>
                                <Input
                                    value={validationResult?.member?.membershipOption || ''}
                                    disabled
                                    className='w-9/12 bg-gray-100 rounded-none '
                                />
                            </div>

                            <div className="flex justify-between items-center">
                                <Label className='w-3/12'>Membership Category</Label>
                                <Input
                                    value={validationResult?.member?.membershipType || ''}
                                    disabled
                                    className='w-9/12 bg-gray-100 rounded-none '
                                />
                            </div>

                            <div className="flex justify-between items-center">
                                <Label className='w-3/12'>Membership Date</Label>
                                <Input
                                    value={validationResult?.member?.membershipDate ? new Date(validationResult.member.membershipDate).toISOString().split('T')[0] : ''}
                                    disabled
                                    className='w-9/12 bg-gray-100 rounded-none '
                                />
                            </div>


                            <div className="flex justify-between items-center">
                                <Label className='w-3/12'>Renew Date</Label>
                                <Input
                                    value={validationResult?.member?.membershipDate ? new Date(validationResult.member.membershipDate).toISOString().split('T')[0] : ''}
                                    disabled
                                    className='w-9/12 bg-gray-100 rounded-none '
                                />
                            </div>

                            <div className="flex justify-between items-center">
                                <Label className='3/12'>Expire Date</Label>
                                <Input
                                    value={validationResult?.member?.membershipDate ? new Date(validationResult.member.membershipExpireDate).toISOString().split('T')[0] : ''}
                                    disabled
                                    className='w-9/12 bg-gray-100 rounded-none '
                                />
                            </div>


                            <div className="w-full flex justify-between items-start">
                                <Label className='w-3/12'>Message</Label>
                                <Textarea
                                    value={validationResult?.message || ''}
                                    disabled
                                    className='w-9/12 bg-gray-200 rounded-none cursor-not-allowed h-40'
                                />
                            </div>

                        </div>
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
                                                            <TableCell className="text-right">{attendance.checkInTime}</TableCell>
                                                            <TableCell className="text-right">{attendance.expiration}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                                <TableFooter>
                                                    <TableRow>
                                                        <TableCell colSpan={3}>Total Member Attendance</TableCell>
                                                        <TableCell className="text-right">5</TableCell>
                                                    </TableRow>
                                                </TableFooter>
                                            </Table>

                                            <div className="py-4">
                                                <Pagination>
                                                    <PaginationContent>
                                                        <PaginationItem>
                                                            <PaginationPrevious href="#" />
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationLink href="#">1</PaginationLink>
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationLink href="#" isActive>
                                                                2
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationLink href="#">3</PaginationLink>
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationEllipsis />
                                                        </PaginationItem>
                                                        <PaginationItem>
                                                            <PaginationNext href="#" />
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
