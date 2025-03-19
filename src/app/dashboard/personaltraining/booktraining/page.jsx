'use client';


import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Pagination from "@/components/ui/CustomPagination";
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
import React, { useState, useRef, useEffect } from 'react';
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePagination } from "@/hooks/Pagination";
import Loader from "@/components/Loader/Loader";
import { useForm, Controller } from "react-hook-form";
import { MdError, MdDelete, MdDone, MdClose } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const BookTrainer = () => {

    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const [trainerSearchQuery, setTrainerSearchQuery] = useState('');
    const [clientSearchQuery, setClientSearchQuery] = useState('');

    const [toast, setToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState({ icon: MdDone, message: '' });
    const [errorMessage, setErrorMessage] = useState({ icon: MdError, message: '' });
    const [responseType, setResponseType] = useState('');
    const responseResultType = ['Success', 'Failure'];
    const [deleting, setDeleting] = useState(false);
    const [updateDocument, setUpdateDocument] = useState(false);
    const [documentUpdateId, setUpdateDocumentId] = useState('');

    const { control, reset, register, setError, clearErrors, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const [submitting, setSubmitting] = useState(false);

    const trainerSearchRef = useRef(null);
    const clientSearchRef = useRef(null);

    const [renderTrainerDropdown, setRenderTrainerDropdown] = useState(false);
    const [renderClientDropdown, setRenderClientDropdown] = useState(false);

    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                trainerSearchRef.current &&
                !trainerSearchRef.current.contains(event.target)
            ) {
                setRenderTrainerDropdown(false);
            }
            if (
                clientSearchRef.current &&
                !clientSearchRef.current.contains(event.target)
            ) {
                setRenderClientDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleTrainerFocus = () => {
        setRenderTrainerDropdown(true);
        setRenderClientDropdown(false);
    };

    const handleClientFocus = () => {
        setRenderClientDropdown(true);
        setRenderTrainerDropdown(false);
    };
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


    const handleFormSubmit = async (data) => {
        setSubmitting(true);
        const { from, duration, to, fee, discount, finalCharge, status } = data;
        const finalData = { trainer: selectedTrainer, client: selectedClient, from, duration, to, fee, discount, finalCharge, status };

        try {
            const url = updateDocument
                ? `http://localhost:3000/api/personaltraining/${documentUpdateId}` :
                'http://localhost:3000/api/personaltraining'
            const response = await fetch(url, {
                method: updateDocument ? 'PATCH' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(finalData)
            });

            const responseBody = await response.json()
            if (response.ok) {
                setSubmitting(false);
                setUpdateDocument(false);
                reset();
                queryClient.invalidateQueries(['personaltrainings']);
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
            setSubmitting(false);
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

    const deletePersonalTraining = async (id) => {
        setDeleting(true);
        try {
            const response = await fetch(`http://localhost:3000/api/personaltraining/${id}`, {
                method: "DELETE",
            });
            const responseBody = await response.json();
            if (response.ok) {
                queryClient.invalidateQueries(['personaltrainings']);
                setResponseType(responseResultType[0]);
                setToast(true);
                setTimeout(() => {
                    setToast(false)
                }, 10000);
                setSuccessMessage({
                    icon: MdDone,
                    message: responseBody.message || 'Unauthorized action'
                });
                setDeleting(false);
            }
        } catch (error) {
            console.log("Error: ", error);
            setDeleting(false);
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
        <div
            className='w-full bg-gray-200'
            onClick={() => {
                setToast(false);
                setDeleting(false)
            }}
        >

            {submitting && (
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            )}

            {deleting && (
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            )}

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
                                    {responseType === 'Success' ? "Successfully!" : "Action required"}
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

            {deleting ? (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className={`bg-white border shadow-2xl flex items-center justify-between p-4 relative`}>
                        <h1 className="w-full text-xl font-bold animate-pulse duration-500 transition-all">Loading...</h1>
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
                            <BreadcrumbLink>Book Trainer</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Personal Trainer Booking</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-xl font-bold mt-3">Book Trainer</h1>
            </div>

            <div className="w-full bg-white">
                <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="w-full">
                        <Label>Select Trainer</Label>
                        <div ref={trainerSearchRef} className="w-full flex justify-center">
                            <div className="relative w-full">
                                <div className="w-full">
                                    <Input
                                        autoComplete="off"
                                        value={trainerSearchQuery}
                                        onChange={(e) => { setTrainerSearchQuery(e.target.value); }}
                                        onFocus={handleTrainerFocus}
                                        className="w-full rounded-lg"
                                        placeholder="Select Trainers..."
                                    />
                                    {errors.trainerName && (
                                        <p className="text-sm font-semibold text-red-600">
                                            {errors.trainerName.message}
                                        </p>
                                    )}
                                </div>
                                {renderTrainerDropdown && (
                                    <div className="w-full absolute bg-white shadow-2xl h-80 overflow-y-auto z-10">
                                        {staffs
                                            ?.filter((staff) => {
                                                const matchByName = staff.fullName
                                                    .toLowerCase()
                                                    .includes(trainerSearchQuery.toLowerCase());
                                                return matchByName;
                                            })
                                            .map((staff) => (
                                                <p
                                                    onClick={() => {
                                                        setRenderTrainerDropdown(false);
                                                        setSelectedTrainer(staff);
                                                        setTrainerSearchQuery(staff.fullName)
                                                    }}
                                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                    key={staff._id}
                                                    value={staff._id}
                                                >
                                                    {staff.fullName}
                                                </p>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <Label>Select Client</Label>
                        <div ref={clientSearchRef} className="w-full flex justify-center">
                            <div className="relative w-full">
                                <div className="w-full">
                                    <Input
                                        autoComplete="off"
                                        value={clientSearchQuery}
                                        onChange={(e) => { setClientSearchQuery(e.target.value); }}
                                        onFocus={handleClientFocus}
                                        className="w-full rounded-lg"
                                        placeholder="Select Clients..."
                                    />
                                    {errors.clientName && (
                                        <p className="text-sm font-semibold text-red-600">
                                            {errors.clientName.message}
                                        </p>
                                    )}
                                </div>
                                {renderClientDropdown && (
                                    <div className="w-full absolute bg-white shadow-2xl h-80 overflow-y-auto z-10">
                                        {members
                                            ?.filter((member) => {
                                                const matchByName = member.fullName
                                                    .toLowerCase()
                                                    .includes(clientSearchQuery.toLowerCase());
                                                return matchByName;
                                            })
                                            .map((member) => (
                                                <p
                                                    onClick={() => {
                                                        setRenderClientDropdown(false);
                                                        setSelectedClient(member);
                                                        setClientSearchQuery(member.fullName)
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

                    <div className="w-full">
                        <Label>From</Label>
                        <Input
                            {...register('from', {
                                required: {
                                    value: true,
                                    message: 'Please select date range'
                                }
                            })}
                            type='date'
                            placeholder='Select Date From'
                            className='w-full rounded-md'
                        />
                        {errors.from && (
                            <p className="text-sm font-semibold text-red-600">{errors.from.status}</p>
                        )}
                    </div>

                    <div className="w-full">
                        <Label>Training Duration</Label>
                        <select
                            {...register('duration', {
                                required: {
                                    value: true,
                                    message: 'Please select training duration'
                                }
                            })}
                            className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                        >
                            <option>Select</option>
                            <option value="1 Month">1 Month</option>
                            <option value="3 Months">3 Months</option>
                            <option value="6 Months">6 Months</option>
                        </select>
                        {errors.duration && (
                            <p className="text-sm font-semibold text-red-600">{errors.duration.status}</p>
                        )}
                    </div>

                    <div className="w-full">
                        <Label>To</Label>
                        <Input
                            type='date'
                            {...register('to', {
                                required: {
                                    value: true,
                                    message: 'Please select date range'
                                }
                            })}
                            placeholder='Select Date To'
                            className='w-full rounded-md'
                        />
                        {errors.to && (
                            <p className="text-sm font-semibold text-red-600">{errors.to.status}</p>
                        )}
                    </div>

                    <div className="w-full">
                        <Label>Fee</Label>
                        <Input
                            type='text'
                            {...register('fee', {
                                required: {
                                    value: true,
                                    message: "Fee is required"
                                }
                            })}
                            placeholder='Charge Fee'
                            className='w-full rounded-md'
                        />
                        {errors.fee && (
                            <p className="text-sm font-semibold text-red-600">{errors.fee.status}</p>
                        )}
                    </div>

                    <div className="w-full">
                        <Label>Discount</Label>
                        <Input
                            {...register('discount')}
                            type='text'
                            placeholder='Discount'
                            className='w-full rounded-md'
                        />
                    </div>

                    <div className="w-full">
                        <Label>Final Charge/Fee</Label>
                        <Input
                            {...register('finalCharge', {
                                required: {
                                    value: true,
                                    message: "Final charge/fee is required"
                                }
                            })}
                            type='text'
                            placeholder='Final Charge'
                            className='w-full rounded-md'
                        />
                        {errors.finalCharge && (
                            <p className="text-sm font-semibold text-red-600">{errors.finalCharge.status}</p>
                        )}
                    </div>

                    <div className="w-full">
                        <Label>Status</Label>
                        <select
                            {...register('status', {
                                required: {
                                    value: true,
                                    message: "Please select one status"
                                }
                            })}
                            className="w-full rounded-md border border-gray-300 p-2 text-gray-700 bg-white shadow-sm cursor-pointer focus:outline-none focus:ring- focus:ring-blue-600"
                        >
                            <option>Select</option>
                            <option value="Booked">Booked</option>
                            <option value="Pending">Pending</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Freezed">Freezed</option>
                        </select>
                        {errors.status && (
                            <p className="text-sm font-semibold text-red-600">{errors.message.status}</p>
                        )}
                    </div>

                    <div className="flex items-center mb-2 space-x-3">
                        <Button type='button' onClick={() => reset()} className='rounded-sm bg-red-600'>Reset</Button>
                        <Button type='button' onClick={() => window.location.reload()} className='rounded-sm mx-4'>Refresh</Button>
                        {updateDocument ? (
                            <Button type='submit' className='rounded-sm bg-green-600'>{isSubmitting ? 'Updating...' : 'Update'}</Button>
                        ) : (
                            <Button type='submit' className='rounded-sm bg-green-600'>{isSubmitting ? 'Submitting...' : 'Submit'}</Button>
                        )}
                    </div>
                </form>
            </div>

            <div className="w-full bg-white mt-5 p-3">
                <div>
                    <div className="flex justify-center p-2">
                        <div className="w-full px-4 flex justify-start border border-gray-400 rounded-sm items-center">
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
                                    personalTrainings.map((training) => {
                                        const textColor = training.status === 'Expired' ? 'text-red-600' :
                                            training.status === 'Paused' ? 'text-yellow-600' : 'text-black'
                                        return (
                                            <TableRow key={training._id} className={textColor}>
                                                <TableCell className="font-medium">{training.trainer ? training.trainer.fullName : ''}</TableCell>
                                                <TableCell>{training.from ? new Date(training.from).toISOString().split('T')[0] : ''}</TableCell>
                                                <TableCell>{training.to ? new Date(training.to).toISOString().split('T')[0] : ''}</TableCell>
                                                <TableCell>{training.client ? training.client.fullName : ''}</TableCell>
                                                <TableCell>{training.fee ? training.fee : ''}</TableCell>
                                                <TableCell>{training.discount ? training.discount : ''}</TableCell>
                                                <TableCell>{training.finalCharge ? training.finalCharge : ''}</TableCell>
                                                <TableCell>{training.status ? training.status : ''}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center">
                                                        <FaEdit onClick={() => {
                                                            setUpdateDocumentId(training._id);
                                                            setUpdateDocument(!updateDocument);
                                                            setTrainerSearchQuery(training.trainer.fullName);
                                                            setSelectedTrainer(training.trainer);
                                                            setSelectedClient(training.client);
                                                            setClientSearchQuery(training.client.fullName);
                                                            reset({
                                                                from: training.from ? new Date(training.from).toISOString().split('T')[0] : '',
                                                                duration: training.duration,
                                                                to: training.to ? new Date(training.to).toISOString().split('T')[0] : '',
                                                                fee: training.fee,
                                                                discount: training.discount,
                                                                finalCharge: training.finalCharge,
                                                                status: training.status
                                                            })
                                                        }} className="cursor-pointer text-xl mx-2" />
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <MdDelete className="cursor-pointer text-red-600 text-xl" />
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This action cannot be undone. This will permanently delete your
                                                                        personal training and remove data from server.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => deletePersonalTraining(training._id)}>Continue</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                ) : (
                                    <TableRow >
                                        <TableCell className="font-medium text-center" colSpan={12}>No Personal Trainings Available</TableCell>
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
