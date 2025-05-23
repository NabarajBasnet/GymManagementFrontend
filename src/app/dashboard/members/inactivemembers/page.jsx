'use client'

import { TiHome } from "react-icons/ti";
import { ArrowUpDown, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast as notify } from "react-hot-toast";
import { MdContentCopy, MdPrint, MdFileDownload } from "react-icons/md";
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
import '../../../globals.css';
import { useUser } from "@/components/Providers/LoggedInUserProvider.jsx";
import Pagination from "@/components/ui/CustomPagination.jsx";
import { MdError } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdDone } from "react-icons/md";
import { Button } from "@/components/ui/button.jsx";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import * as React from "react"
import { MdEmail, MdClose } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
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
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "../allmembertable.jsx";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePagination } from "@/hooks/Pagination.js";

const InactiveMembers = () => {

    const { user, loading } = useUser();
    const queryClient = useQueryClient();
    const [toast, setToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState({ icon: MdDone, message: '' });
    const [errorMessage, setErrorMessage] = useState({ icon: MdError, message: '' });
    const [responseType, setResponseType] = useState('');
    const responseResultType = ['Success', 'Failure'];
    const [confirmDeleteMember, setConfirmDeleteMember] = useState(false);
    const [toDeleteMemberId, setToDeleteMemberId] = useState('');
    const [isMemberDeleting, setIsMemberDeleting] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(15);
    const [isDeleting, setIsDeleting] = useState(false);

    // Sorting States
    const [sortBy, setSortBy] = useState('');
    const [sortOrderDesc, setSortOrderDesc] = useState(true);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
        return () => clearTimeout(handler);
    }, [searchQuery, limit]);

    const getAllMembers = async ({ queryKey }) => {
        const [, page, searchQuery, sortBy, sortOrderDesc, limit] = queryKey;
        try {
            const response = await fetch(
                `http://localhost:3000/api/members/inactivemembers?page=${page}&limit=${limit}&memberSearchQuery=${searchQuery}&sortBy=${sortBy}&sortOrderDesc=${sortOrderDesc}`
            );
            const resBody = await response.json();
            return resBody;
        } catch (error) {
            console.error('Error: ', error);
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ['members', currentPage, searchQuery, sortBy, sortOrderDesc, limit],
        queryFn: getAllMembers,
        keepPreviousData: true,
    });
    const { members,
        totalInactiveMembers,
        totalPages,
        totalInactiveCount } = data || {};

    useEffect(() => {
        getAllMembers();
    }, [limit]);

    const { range, setPage, active } = usePagination({
        total: totalPages,
        siblings: 1,
        boundaries: 1,
        page: currentPage,
        onChange: (page) => {
            setCurrentPage(page);
        },
    });

    const [emailSending, setEmailSending] = useState(false);
    const [emailToast, setEmailToast] = useState(false);

    const sendQrInEmail = async (id) => {
        setEmailSending(true);
        try {
            const response = await fetch(`http://localhost:3000/api/send-qr`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });
            const responseBody = await response.json();
            if (response.status !== 200) {
                setResponseType(responseResultType[1]);
                setEmailToast(true);
                setTimeout(() => {
                    setEmailToast(false);
                }, 10000);
                setErrorMessage({
                    icon: MdError,
                    message: responseBody.message || 'Unauthorized action'
                });
            }
            else {
                if (response.status === 200) {
                    setEmailSending(false);
                    setResponseType(responseResultType[0]);
                    setEmailToast(true);
                    setTimeout(() => {
                        setEmailToast(false);
                    }, 10000);
                    setSuccessMessage({
                        icon: MdError,
                        message: responseBody.message || 'Unauthorized action'
                    })
                }
            }
        } catch (error) {
            console.log('Error: ', error);
            setResponseType(responseResultType[1]);
            setEmailToast(true);
            setTimeout(() => {
                setEmailToast(true);
            }, 10000);
            setErrorMessage({
                icon: MdError,
                message: error.message || error
            });
        }
    };

    const deleteMember = async (id) => {
        setIsDeleting(true);
        try {
            const response = await fetch(`http://localhost:3000/api/members/deleteMember/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': "application/json"
                },
                credentials: "include"
            });
            const responseBody = await response.json();

            if (response.status !== 200) {
                setIsDeleting(false);
                setResponseType(responseResultType[1]);
                setToast(true);
                setTimeout(() => {
                    setToast(false)
                }, 10000);
                setErrorMessage({
                    icon: MdError,
                    message: responseBody.message || 'Unauthorized action'
                });
            }
            else {
                if (response.status === 200) {
                    setIsDeleting(false);
                    setResponseType(responseResultType[0]);
                    setToast(true);
                    setTimeout(() => {
                        setToast(false);
                    }, 10000);
                    setSuccessMessage({
                        icon: MdError,
                        message: responseBody.message || 'Unauthorized action'
                    })
                }
                setIsMemberDeleting(false);
                setConfirmDeleteMember(false);
                queryClient.invalidateQueries(['members']);
            }

        } catch (error) {
            setIsDeleting(false);
            console.log("Error: ", error);
            setToast(true);
            setTimeout(() => {
                setToast(false)
            }, 10000);
            setErrorMessage({
                icon: MdError,
                message: "An unexpected error occurred."
            })
        };
    };

    const copyToClipboard = (_id) => {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard.writeText(_id)
                .then(() => notify.success(`Member ID ${_id} copied to clipboard`))
                .catch(() => notify.error("Failed to copy ID"));
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = _id;
            textArea.style.position = "fixed";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    notify.success(`Member ID ${_id} copied to clipboard`);
                } else {
                    throw new Error();
                }
            } catch (err) {
                notify.error("Failed to copy ID");
            }
            document.body.removeChild(textArea);
        }
    };

    const startEntry = (currentPage - 1) * limit + 1;
    const endEntry = Math.min(currentPage * limit, totalInactiveMembers);

    return (
        <div className="w-full bg-gray-100">
            <div className='w-full px-4 pt-6 pb-3' onClick={() => {
                setToast(false)
                setEmailToast(false)
            }
            }>
                {emailSending && (
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress />
                    </Box>
                )}

                {isDeleting && (
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress />
                    </Box>
                )}

                {emailToast && (
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

                {toast && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 animate-fade-in"
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

                {confirmDeleteMember ? (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className={`bg-white border shadow-2xl px-3 rounded-md py-2 relative`}>
                            <div>
                                <p className="text-red-600 text-sm font-semibold px-6 text-center my-4">Are you sure want to delete? This action will remove all the data from the server and will not be recover.</p>
                            </div>
                            <div className="flex justify-center items-center space-x-4">
                                <Button onClick={() => setConfirmDeleteMember(false)}
                                    className='rounded-md'
                                >Cancel</Button>
                                <Button className='bg-red-600 rounded-md hover:bg-red-600' onClick={() => deleteMember(toDeleteMemberId)}>{isDeleting ? 'Deleting...' : "Delete"}</Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <></>
                )}

                <div className="bg-white shadow-sm rounded-sm border px-4 py-5">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <TiHome className="w-4 h-4" /><BreadcrumbLink href="/">Home</BreadcrumbLink>
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
                                <BreadcrumbPage>Inactive Members</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                <h1 className="text-xl font-bold mt-3">Inactive Members</h1>
                </div>
            </div>

            <div className="mx-4 bg-white shadow-lg rounded-lg border">
                <div className="w-full md:flex justify-between items-center">
                    <div className="w-full md:w-6/12 my-2 md:my-0 flex items-center gap-3 px-4 rounded-lg">
                        <h1 className="text-sm font-semibold text-gray-700">Display</h1>
                        <select
                            onChange={(e) => setLimit(Number(e.target.value))}
                            className="px-3 py-1 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="15">15</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value={totalInactiveMembers}>All</option>
                        </select>
                        <h1 className="text-sm font-semibold text-gray-700">members</h1>
                        <p className="text-sm text-gray-500 italic">Selected Limit: {limit}</p>
                    </div>

                    <div className="w-full flex justify-end">
                        <div className="w-full md:w-6/12 flex bg-white items-center border px-4 my-2 rounded-full mx-2">
                            <IoSearch />
                            <Input
                                className='rounded-none border-none bg-transparent'
                                placeholder='Search members...'
                                value={searchQuery}
                                onChange={(e) => {
                                    setCurrentPage(1);
                                    setSearchQuery(e.target.value);
                                }
                                }
                            />
                        </div>
                    </div>

                </div>

                {isLoading ? (
                    <Loader />
                ) : (
                    <div className="w-full bg-white">
                        <div className="w-full flex justify-start">
                            <div className="w-full overflow-x-auto">
                                <Table className='w-full overflow-x-auto'>
                                    <TableHeader>
                                        <TableRow className='bg-gray-200 text-black'>
                                            <TableHead>
                                                <div className="flex items-center">
                                                    Member Id
                                                    <ArrowUpDown
                                                        onClick={() => {
                                                            setSortBy('_id');
                                                            setSortOrderDesc(!sortOrderDesc);
                                                        }}
                                                        className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500"
                                                    />
                                                </div>
                                            </TableHead>
                                            <TableHead>
                                                <div className="flex items-center">
                                                    Full Name
                                                    <ArrowUpDown
                                                        onClick={() => {
                                                            setSortBy('fullName');
                                                            setSortOrderDesc(!sortOrderDesc);
                                                        }}
                                                        className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500"
                                                    />
                                                </div>
                                            </TableHead>
                                            <TableHead className='text-center'>
                                                <div className="flex items-center">
                                                    Duration
                                                    <ArrowUpDown
                                                        onClick={() => {
                                                            setSortBy('membershipDuration');
                                                            setSortOrderDesc(!sortOrderDesc);
                                                        }}
                                                        className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500"
                                                    />
                                                </div>
                                            </TableHead>
                                            <TableHead className='text-center'>
                                                <div className="flex items-center">
                                                    Option
                                                    <ArrowUpDown
                                                        onClick={() => {
                                                            setSortBy('membershipOption');
                                                            setSortOrderDesc(!sortOrderDesc);
                                                        }}
                                                        className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500"
                                                    />
                                                </div>
                                            </TableHead>
                                            <TableHead className='text-center'>
                                                <div className="flex items-center">
                                                    Renew
                                                    <ArrowUpDown
                                                        onClick={() => {
                                                            setSortBy('membershipRenewDate');
                                                            setSortOrderDesc(!sortOrderDesc);
                                                        }}
                                                        className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500"
                                                    />
                                                </div>
                                            </TableHead>
                                            <TableHead className='text-center'>
                                                <div className="flex items-center">
                                                    Type
                                                    <ArrowUpDown
                                                        onClick={() => {
                                                            setSortBy('membershipType');
                                                            setSortOrderDesc(!sortOrderDesc);
                                                        }}
                                                        className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500"
                                                    />
                                                </div>
                                            </TableHead>
                                            <TableHead className='text-center'>
                                                <div className="flex items-center">
                                                    Expire
                                                    <ArrowUpDown
                                                        onClick={() => {
                                                            setSortBy('membershipExpireDate');
                                                            setSortOrderDesc(!sortOrderDesc);
                                                        }}
                                                        className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500"
                                                    />
                                                </div>
                                            </TableHead>
                                            <TableHead className='text-center'>
                                                <div className="flex items-center">
                                                    Contact No
                                                    <ArrowUpDown
                                                        onClick={() => {
                                                            setSortBy('contactNo');
                                                            setSortOrderDesc(!sortOrderDesc);
                                                        }}
                                                        className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500"
                                                    />
                                                </div>
                                            </TableHead>
                                            <TableHead className='text-center'>
                                                <div className="flex items-center">
                                                    Shift
                                                    <ArrowUpDown
                                                        onClick={() => {
                                                            setSortBy('membershipShift');
                                                            setSortOrderDesc(!sortOrderDesc);
                                                        }}
                                                        className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500"
                                                    />
                                                </div>
                                            </TableHead>
                                            <TableHead className='text-center'>
                                                <div className="flex items-center">
                                                    Status
                                                    <ArrowUpDown
                                                        onClick={() => {
                                                            setSortBy('status');
                                                            setSortOrderDesc(!sortOrderDesc);
                                                        }}
                                                        className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500"
                                                    />
                                                </div>
                                            </TableHead>
                                            <TableHead className='text-center'>
                                                <div className="flex items-center">
                                                    Fee
                                                    <ArrowUpDown
                                                        onClick={() => {
                                                            setSortBy('paidAmmount');
                                                            setSortOrderDesc(!sortOrderDesc);
                                                        }}
                                                        className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500"
                                                    />
                                                </div>
                                            </TableHead>
                                            <TableHead className='text-center'>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {members && members.length > 0 ? (
                                            members.map((member) => {
                                                const textColor =
                                                    member.status === 'Active' ? 'text-black' :
                                                        member.status === 'OnHold' ? 'text-yellow-500' :
                                                            'text-red-500';
                                                return (
                                                    <TableRow key={member._id} className={textColor}
                                                        sx={{
                                                            '&:hover': { backgroundColor: '#f9fafb' },
                                                            '& td': {
                                                                padding: '0.75rem 1rem',
                                                                fontSize: '0.875rem',
                                                                color: '#4b5563',
                                                                borderBottom: '1px solid #e5e7eb'
                                                            }
                                                        }}>
                                                        <TableCell className="text-center flex justify-start items-center" component="th" scope="row" sx={{ width: '120px', maxWidth: '120px' }}>
                                                            <div className="flex items-center justify-end text-center space-x-1 max-w-[100px]">
                                                                <span className="truncate text-center font-mono text-xs">{member._id}</span>
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <button
                                                                                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                                                                            >
                                                                                <MdContentCopy
                                                                                    onClick={() => copyToClipboard(member._id)}
                                                                                    size={14} />
                                                                            </button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>Copy ID</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{member.fullName}</TableCell>
                                                        <TableCell className='text-start'>{member.membershipDuration}</TableCell>
                                                        <TableCell className='text-start'>{member.membershipOption}</TableCell>
                                                        <TableCell className='text-start'>{new Date(member.membershipRenewDate).toISOString().split("T")[0]}</TableCell>
                                                        <TableCell className='text-start'>{member.membershipType}</TableCell>
                                                        <TableCell className='text-center'>{new Date(member.membershipExpireDate).toISOString().split("T")[0]}</TableCell>
                                                        <TableCell className='text-center'>{member.contactNo}</TableCell>
                                                        <TableCell className='text-center'>{member.membershipShift}</TableCell>
                                                        <TableCell className='text-start'>{member.status.charAt(0).toUpperCase() + member.status.slice(1)}</TableCell>
                                                        <TableCell className='text-start'>{member.paidAmmount}</TableCell>
                                                        <TableCell className='text-center'>
                                                            <div className="flex items-center justify-center space-x-1">
                                                                <Link href={`/dashboard/members/${member._id}`}>
                                                                    <FaUserEdit className='cursor-pointer text-lg' />
                                                                </Link>
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <MdEmail
                                                                            className='cursor-pointer text-lg'
                                                                        />
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                This action will send QR attached to {member.fullName}, Are you sure about that?
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction onClick={() => sendQrInEmail(member._id)}>Continue</AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        {user && user.user.role === 'Gym Admin' ? (
                                                                            <></>
                                                                        ) : (
                                                                            <MdDelete
                                                                                className="cursor-pointer text-red-600 text-lg"
                                                                            />
                                                                        )}
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                This action cannot be undone. This will permanently delete member
                                                                                account and remove data from servers.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() => deleteMember(member._id)}
                                                                            >Continue</AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        ) : (
                                            <TableRow>
                                                <TableCell>
                                                    No inactive memberships found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                    <TableFooter className='text-black'>
                                        <TableRow>
                                            <TableCell>Total Inactive Memberships</TableCell>
                                            <TableCell>{totalInactiveMembers}</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </div>
                        </div>
                    </div>
                )}
                <div className='my-2'>
                    <div className="mt-4 px-4 md:flex justify-between items-center">
                        <p className="font-medium text-center text-sm font-gray-700">
                            Showing <span className="font-semibold text-sm font-gray-700">{startEntry}</span> to <span className="font-semibold text-sm font-gray-700">{endEntry}</span> of <span className="font-semibold">{totalInactiveMembers}</span> entries
                        </p>
                        <Pagination
                            total={totalPages}
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

export default InactiveMembers;
