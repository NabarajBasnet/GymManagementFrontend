'use client'

import { BiDotsHorizontalRounded } from "react-icons/bi";
import { TiHome } from "react-icons/ti";
import { ArrowUpDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast as notify } from "react-hot-toast";
import { MdContentCopy } from "react-icons/md";
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
import * as React from "react"
import { MdEmail } from "react-icons/md";
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
import { toast as hotToast } from 'react-hot-toast';
import { toast as sonnerToast } from 'sonner';

const PausedMembers = () => {

    const { user, loading } = useUser();
    const queryClient = useQueryClient();
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
                `http://localhost:3000/api/members/pausedmembers?page=${page}&limit=${limit}&memberSearchQuery=${searchQuery}&sortBy=${sortBy}&sortOrderDesc=${sortOrderDesc}`
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
        totalMembers,
        totalPages,
        totalOnHoldCount } = data || {};

    useEffect(() => {
        getAllMembers();
    }, [limit]);

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
                sonnerToast.error(responseBody.message);
                hotToast.error(responseBody.message);
            }
            else {
                if (response.status === 200) {
                    sonnerToast.success(responseBody.message);
                    hotToast.success(responseBody.message);
                }
            }
        } catch (error) {
            console.log('Error: ', error);
            sonnerToast.error(error.message);
            hotToast.error(error.message);
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
                sonnerToast.error(responseBody.message);
                hotToast.error(responseBody.message);
            }
            else {
                if (response.status === 200) {
                    setIsDeleting(false);
                    sonnerToast.success(responseBody.message);
                    hotToast.success(responseBody.message);

                }
                setIsMemberDeleting(false);
                setConfirmDeleteMember(false);
                queryClient.invalidateQueries(['members']);
            }

        } catch (error) {
            setIsDeleting(false);
            console.log("Error: ", error);
            sonnerToast.error(responseBody.message);
            hotToast.error(responseBody.message);
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
    const endEntry = Math.min(currentPage * limit, totalOnHoldCount);

    return (
        <div className="w-full bg-gray-100 dark:bg-gray-900 min-h-screen">
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

                <Breadcrumb className='mb-6 mt-1'>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <TiHome className="w-4 h-4" /><BreadcrumbLink href="/" className='font-medium text-sm'>Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className='font-medium text-sm' />
                        <BreadcrumbItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-1">
                                    <BreadcrumbEllipsis className="h-4 w-4" />
                                </DropdownMenuTrigger>
                            </DropdownMenu>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className='font-medium text-sm' />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard" className='font-medium text-sm'>Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className='font-medium text-sm' />
                        <BreadcrumbItem>
                            <BreadcrumbLink className='font-medium text-sm'>Paused Members</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-sm border dark:border-none px-4 py-5">
                    <h1 className="text-xl font-bold dark:text-gray-300">Paused Members</h1>
                </div>
            </div>

            <div className="mx-4 bg-white dark:bg-gray-800 shadow-lg rounded-sm dark:border-none border">
                <div className="w-full md:flex justify-between items-center">
                    <div className="w-full md:w-6/12 py-2 md:my-0 flex items-center gap-3 px-4 rounded-lg">
                        <h1 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Display</h1>
                        <select
                            onChange={(e) => setLimit(Number(e.target.value))}
                            className="px-3 py-1 border border-gray-300 rounded-md bg-white dark:bg-gray-900 dark:border-none dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="15">15</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value={totalOnHoldCount}>All</option>
                        </select>
                        <h1 className="text-sm font-semibold text-gray-700 dark:text-gray-300">members</h1>
                        <p className="text-sm text-gray-500 italic dark:text-gray-300 font-medium">Selected Limit: {limit}</p>
                    </div>

                    <div className="w-full flex justify-end">
                        <div className="w-full md:w-6/12 flex bg-white dark:bg-gray-900 items-center border dark:border-none px-4 my-2 rounded-full mx-2">
                            <IoSearch className="dark:text-gray-100" />
                            <Input
                                className='dark:text-gray-100 rounded-none border-none bg-transparent'
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
                    <div className="w-full bg-white dark:bg-gray-800">
                        <div className="w-full flex justify-start">
                            <div className="w-full overflow-x-auto">
                                <Table className='w-full overflow-x-auto'>
                                    <TableHeader>
                                        <TableRow className='bg-gray-200 dark:border-none dark:bg-gray-800 text-black'>
                                            <TableHead className="dark:text-white">
                                                <div className="flex items-center">
                                                    Avatar
                                                    <ArrowUpDown
                                                        onClick={() => {
                                                            setSortBy("_id");
                                                            setSortOrderDesc(!sortOrderDesc);
                                                        }}
                                                        className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500"
                                                    />
                                                </div>
                                            </TableHead>
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
                                                        <TableCell>
                                                            {member?.fullName ? (
                                                                <div className="flex items-center justify-center h-9 w-9 rounded-full bg-red-600/85 text-white font-medium group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                                                                    {member.fullName
                                                                        .split(' ')
                                                                        .map((word) => word.charAt(0))
                                                                        .slice(0, 2)
                                                                        .join('')
                                                                        .toUpperCase()}
                                                                </div>
                                                            ) : (
                                                                <div className="bg-transparent p-1 md:p-2 rounded-full transition-colors group-hover:bg-gray-100 dark:group-hover:bg-gray-700">
                                                                    <FaUserCircle className="text-2xl text-blue-600 dark:text-blue-400 transition-colors group-hover:text-blue-700 dark:group-hover:text-blue-300" />
                                                                </div>
                                                            )}
                                                        </TableCell>
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
                                                        <TableCell className='text-start'>
                                                            {member?.membershipOption ||
                                                                member?.membership?.servicesIncluded?.map(
                                                                    (service, index) => {
                                                                        return `${service} & `;
                                                                    }
                                                                )}</TableCell>
                                                        <TableCell className='text-start'>{new Date(member.membershipRenewDate).toISOString().split("T")[0]}</TableCell>
                                                        <TableCell className='text-start'>{member.membershipType}</TableCell>
                                                        <TableCell className='text-center'>{new Date(member.membershipExpireDate).toISOString().split("T")[0]}</TableCell>
                                                        <TableCell className='text-center'>{member.contactNo}</TableCell>
                                                        <TableCell className='text-center'>{member.membershipShift}</TableCell>
                                                        <TableCell className='text-start'>{member.status.charAt(0).toUpperCase() + member.status.slice(1)}</TableCell>
                                                        <TableCell className='text-start'>{member.paidAmmount}</TableCell>
                                                        <TableCell className='text-center'>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <button className="rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                                                        <BiDotsHorizontalRounded className="w-5 h-5" />
                                                                    </button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent
                                                                    className="w-40 dark:bg-gray-800 dark:border-gray-700 shadow-lg"
                                                                    align="end"
                                                                    onInteractOutside={(e) => {
                                                                        // Prevent closing when interacting with the alert dialog
                                                                        if (
                                                                            e.target.closest(
                                                                                ".alert-dialog-content"
                                                                            )
                                                                        ) {
                                                                            e.preventDefault();
                                                                        }
                                                                    }}
                                                                >
                                                                    <DropdownMenuLabel className="font-medium dark:text-gray-300">
                                                                        Member Actions
                                                                    </DropdownMenuLabel>
                                                                    <DropdownMenuSeparator className="dark:bg-gray-700" />
                                                                    <DropdownMenuGroup>
                                                                        {/* Edit Member */}
                                                                        <DropdownMenuItem
                                                                            className="cursor-pointer px-3 py-2"
                                                                            asChild
                                                                        >
                                                                            <Link
                                                                                href={`/dashboard/members/${member._id}`}
                                                                                className="flex items-center w-full"
                                                                            >
                                                                                <FaUserEdit className="mr-2 h-4 w-4" />
                                                                                <span>Edit</span>
                                                                            </Link>
                                                                        </DropdownMenuItem>

                                                                        {/* Send QR via Email */}
                                                                        <DropdownMenuItem
                                                                            className="cursor-pointer px-3 py-2"
                                                                            onSelect={(e) => e.preventDefault()}
                                                                        >
                                                                            <AlertDialog>
                                                                                <AlertDialogTrigger className="flex items-center w-full text-left">
                                                                                    <MdEmail className="mr-2 h-4 w-4" />
                                                                                    <span>Send QR</span>
                                                                                </AlertDialogTrigger>
                                                                                <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700 alert-dialog-content">
                                                                                    <AlertDialogHeader>
                                                                                        <AlertDialogTitle className="dark:text-white">
                                                                                            Confirm QR Email
                                                                                        </AlertDialogTitle>
                                                                                        <AlertDialogDescription className="dark:text-gray-400">
                                                                                            This will send a QR code to{" "}
                                                                                            {member.fullName}'s email.
                                                                                        </AlertDialogDescription>
                                                                                    </AlertDialogHeader>
                                                                                    <AlertDialogFooter>
                                                                                        <AlertDialogCancel className="dark:border-none dark:text-white dark:hover:bg-gray-700">
                                                                                            Cancel
                                                                                        </AlertDialogCancel>
                                                                                        <AlertDialogAction
                                                                                            className="bg-blue-600 dark:text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                sendQrInEmail(member._id);
                                                                                            }}
                                                                                        >
                                                                                            Send
                                                                                        </AlertDialogAction>
                                                                                    </AlertDialogFooter>
                                                                                </AlertDialogContent>
                                                                            </AlertDialog>
                                                                        </DropdownMenuItem>

                                                                        {/* Delete Member */}
                                                                        <DropdownMenuItem
                                                                            className="cursor-pointer px-3 py-2"
                                                                            onSelect={(e) => e.preventDefault()}
                                                                        >
                                                                            <AlertDialog>
                                                                                <AlertDialogTrigger className="flex items-center w-full text-left text-red-600 dark:text-red-400">
                                                                                    <MdDelete className="mr-2 h-4 w-4" />
                                                                                    <span>Delete</span>
                                                                                </AlertDialogTrigger>
                                                                                <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700 alert-dialog-content">
                                                                                    <AlertDialogHeader>
                                                                                        <AlertDialogTitle className="dark:text-white">
                                                                                            Confirm Deletion
                                                                                        </AlertDialogTitle>
                                                                                        <AlertDialogDescription className="dark:text-gray-400">
                                                                                            This will permanently delete{" "}
                                                                                            {member.fullName}'s account and
                                                                                            all associated data.
                                                                                        </AlertDialogDescription>
                                                                                    </AlertDialogHeader>
                                                                                    <AlertDialogFooter>
                                                                                        <AlertDialogCancel className="dark:border-none dark:text-white dark:hover:bg-gray-700">
                                                                                            Cancel
                                                                                        </AlertDialogCancel>
                                                                                        <AlertDialogAction
                                                                                            className="bg-red-600 hover:bg-red-700 dark:text-white dark:bg-red-700 dark:hover:bg-red-800"
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                deleteMember(member._id);
                                                                                            }}
                                                                                        >
                                                                                            Delete
                                                                                        </AlertDialogAction>
                                                                                    </AlertDialogFooter>
                                                                                </AlertDialogContent>
                                                                            </AlertDialog>
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuGroup>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={13} className="text-center">
                                                    No memberships found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                    <TableFooter className="text-center text-black dark:border-none dark:text-white p-4 dark:bg-gray-700">
                                        <TableRow className="p-4">
                                            <TableCell className="text-left p-4" colSpan={3}>
                                                Total Paused Memberships
                                            </TableCell>
                                            <TableCell className="text-right p-4 rounded-r-md">
                                                {totalOnHoldCount}
                                            </TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </div>
                        </div>
                    </div>
                )}
                <div className="w-full px-4 py-4 md:flex items-center justify-between">
                    <p className="font-medium text-center text-sm font-gray-700 dark:text-gray-100">
                        Showing{" "}
                        <span className="font-semibold text-sm font-gray-700">
                            {startEntry}
                        </span>{" "}
                        to{" "}
                        <span className="font-semibold text-sm font-gray-700">
                            {endEntry}
                        </span>{" "}
                        of <span className="font-semibold">{totalOnHoldCount}</span> entries
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
    )
}

export default PausedMembers;
