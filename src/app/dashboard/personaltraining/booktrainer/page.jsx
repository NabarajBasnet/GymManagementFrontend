'use client';

import Pagination from "@/components/ui/CustomPagination";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import React, { useState } from 'react';
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
import { useQuery } from "@tanstack/react-query";
import { usePagination } from "@/hooks/Pagination";
import Loader from "@/components/Loader/Loader";
import { useForm } from "react-hook-form";
import { MdError, MdDelete, MdDone, MdClose } from "react-icons/md";

const BookTrainer = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    const [toast, setToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState({ icon: MdDone, message: '' });
    const [errorMessage, setErrorMessage] = useState({ icon: MdError, message: '' });
    const [responseType, setResponseType] = useState('');
    const responseResultType = ['Success', 'Failure'];

    const { control, register, setError, clearErrors, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const fetchAllStaffs = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/staffsmanagement`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        };
    };
    const { data, isLoading, error } = useQuery({
        queryKey: ['staffs'],
        queryFn: fetchAllStaffs
    })
    const { staffs } = data || {};

    const getAllMembers = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/members`);
            const resBody = await response.json();
            return resBody;
        } catch (error) {
            console.error('Error: ', error);
        }
    };
    const { data: allMembers, isLoading: isMemberLoading } = useQuery({
        queryKey: ['members'],
        queryFn: getAllMembers,
        keepPreviousData: true,
    });
    const { members } = allMembers || {};

    const fetchAllPersonalTrainings = async ({ queryKey }) => {
        const [, page] = queryKey;
        try {
            const response = await fetch(`http://localhost:3000/api/personaltraining?page=${page}&limit=${limit}`);
            return await response.json();
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const { data: personalTrainingsData, isLoading: isPersonalTrainingLoading } = useQuery({
        queryKey: ['personaltrainings', currentPage],
        queryFn: fetchAllPersonalTrainings
    })
    const { personalTrainings, totalPersonalTrainings, totalPages, } = personalTrainingsData || {}
    const { range, setPage, active } = usePagination({
        total: totalPages ? totalPages : 1,
        siblings: 1,
        boundaries: 1,
        page: currentPage,
        onChange: (page) => {
            setCurrentPage(page);
        },
    });

    const registerPersonalTraining = async (data) => {
        console.log("Data: ", data);
        try {
            const response = await fetch(`http://localhost:3000/api/personaltraining`, {
                method: "POST",
                headers: {
                    'Content-Type': 'applicatioin/json'
                },
                body: JSON.stringify(data)
            });

            const responseBody = await response.json()
            if (response.ok) {
                setResponseType(responseResultType[0]);
                setToast(true);
                setTimeout(() => {
                    setToast(false)
                }, 10000);
                setSuccessMessage({
                    icon: MdDone,
                    message: responseBody.message || 'Unauthorized action'
                });
            }
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
        };
    };

    return (
        <div className='w-full'>
            {toast ? (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className={`bg-white border shadow-2xl flex items-center justify-between p-4 relative`}>
                        <div>
                            {
                                responseType === 'Success' ? (
                                    <MdDone className="text-3xl mx-4 text-green-600" />
                                ) : (
                                    <MdError className="text-3xl mx-4 text-red-600" />
                                )
                            }
                        </div>
                        <div className="block">
                            {
                                responseType === 'Success' ? (
                                    <p className="text-sm font-semibold text-green-600">{successMessage.message}</p>
                                ) : (
                                    <p className="text-sm font-semibold text-red-600">{errorMessage.message}</p>
                                )
                            }
                        </div>
                        <div>
                            <MdClose
                                onClick={() => setToast(false)}
                                className="cursor-pointer text-3xl ml-4" />
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
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
                            <BreadcrumbLink href="/docs/components">Book Trainer</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-xl font-bold mt-3">Book Trainer</h1>
            </div>

            <div className="w-full bg-gray-100">
                <form onSubmit={handleSubmit(registerPersonalTraining)} className="w-full bg-white p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="w-full">
                        <Label>Select Trainer</Label>
                        <Select>
                            <SelectTrigger className="w-full rounded-none">
                                <SelectValue placeholder="Select Trainer" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <div className="flex justify-center p-2">
                                        <div className="w-full px-4 flex justify-start border border-gray-400 rounded-none items-center">
                                            <IoSearch className="text-xl" />
                                            <Input
                                                className='w-full border-none bg-none'
                                                placeholder='Search Trainer...'
                                            />
                                        </div>
                                    </div>
                                    <SelectLabel>Select Trainer</SelectLabel>
                                    <SelectItem value="apple">Apple</SelectItem>
                                    <SelectItem value="banana">Banana</SelectItem>
                                    <SelectItem value="blueberry">Blueberry</SelectItem>
                                    <SelectItem value="grapes">Grapes</SelectItem>
                                    <SelectItem value="pineapple">Pineapple</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-full">
                        <Label>Select Client</Label>
                        <Select>
                            <SelectTrigger className="w-full rounded-none">
                                <SelectValue placeholder="Select Client" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <div className="flex justify-center p-2">
                                        <div className="w-full px-4 flex justify-start border border-gray-400 rounded-none items-center">
                                            <IoSearch className="text-xl" />
                                            <Input
                                                className='w-full border-none bg-none'
                                                placeholder='Search Client...'
                                            />
                                        </div>
                                    </div>
                                    <SelectLabel>Select Client</SelectLabel>
                                    <SelectItem value="apple">Apple</SelectItem>
                                    <SelectItem value="banana">Banana</SelectItem>
                                    <SelectItem value="blueberry">Blueberry</SelectItem>
                                    <SelectItem value="grapes">Grapes</SelectItem>
                                    <SelectItem value="pineapple">Pineapple</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-full">
                        <Label>From</Label>
                        <Input
                            type='date'
                            placeholder='Select Date From'
                            className='w-full rounded-none'
                        />
                    </div>

                    <div className="w-full">
                        <Label>Training Duration</Label>
                        <Select>
                            <SelectTrigger className="w-full rounded-none">
                                <SelectValue placeholder="Training Duration" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Select</SelectLabel>
                                    <SelectItem value="1 Month">1 Month</SelectItem>
                                    <SelectItem value="3 Months">3 Months</SelectItem>
                                    <SelectItem value="6 Months">6 Months</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-full">
                        <Label>To</Label>
                        <Input
                            type='date'
                            placeholder='Select Date To'
                            className='w-full rounded-none'
                        />
                    </div>

                    <div className="w-full">
                        <Label>Charge/Fee</Label>
                        <Input
                            type='text'
                            placeholder='Charge Fee'
                            className='w-full rounded-none'
                        />
                    </div>

                    <div className="w-full">
                        <Label>Discount</Label>
                        <Input
                            type='text'
                            placeholder='Discount'
                            className='w-full rounded-none'
                        />
                    </div>

                    <div className="w-full">
                        <Label>Final Charge/Fee</Label>
                        <Input
                            type='text'
                            placeholder='Final Charge'
                            className='w-full rounded-none'
                        />
                    </div>

                    <div className="w-full">
                        <Label>Status</Label>
                        <Select>
                            <SelectTrigger className="w-full rounded-none">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Select</SelectLabel>
                                    <SelectItem value="Booked">Booked</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                                    <SelectItem value="Freezed">Freezed</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center px-4 mb-2 space-x-3">
                        <Button type='button' className='rounded-none'>Reset</Button>
                        <Button type='button' className='rounded-none'>Edit</Button>
                        <Button type='submit' className='rounded-none'>Sumit</Button>
                    </div>
                </form>
            </div>



            <div className="w-full bg-white p-3">
                <div>
                    <div className="flex justify-center p-2">
                        <div className="w-full px-4 flex justify-start border border-gray-400 rounded-none items-center">
                            <IoSearch className="text-xl" />
                            <Input
                                className='w-full border-none bg-none'
                                placeholder='Search Member...'
                            />
                        </div>
                    </div>
                    {isPersonalTrainingLoading ? (
                        <Loader />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Sn.</TableHead>
                                    <TableHead>Trainer</TableHead>
                                    <TableHead>From</TableHead>
                                    <TableHead>To</TableHead>
                                    <TableHead>Client Name</TableHead>
                                    <TableHead>Fee</TableHead>
                                    <TableHead>Discount</TableHead>
                                    <TableHead>Final Charge</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.isArray(personalTrainings) && personalTrainings.length >= 1 ? (
                                    personalTrainings.map((training) => (
                                        <TableRow key={training._id}>
                                            <TableCell className="font-medium">{training.trainer ? training.trainer.fullName : ''}</TableCell>
                                            <TableCell>{training.from ? new Date(training.from).toISOString().split('T')[0] : ''}</TableCell>
                                            <TableCell>{training.to ? new Date(training.to).toISOString().split('T')[0] : ''}</TableCell>
                                            <TableCell>{training.client ? training.client.fullName : ''}</TableCell>
                                            <TableCell>{training.fee ? training.fee : ''}</TableCell>
                                            <TableCell>{training.discount ? training.discount : ''}</TableCell>
                                            <TableCell>{training.finalCharge ? training.finalCharge : ''}</TableCell>
                                            <TableCell>{training.status ? training.status : ''}</TableCell>
                                            <TableCell className="text-right">
                                                <div>
                                                    <h1>Action</h1>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow >
                                        <TableCell className="font-medium text-center" colSpan={6}>No Personal Trainings Available</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={3}>Total Personal Trainings</TableCell>
                                    <TableCell className="text-right">{totalPersonalTrainings ? totalPersonalTrainings : ''}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    )}

                    <div className="py-3">
                        <Pagination
                            total={totalPages || 1}
                            page={currentPage || 1}
                            onChange={setCurrentPage}
                            withEdges={true}
                            siblings={1}
                            boundaries={1}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookTrainer;
