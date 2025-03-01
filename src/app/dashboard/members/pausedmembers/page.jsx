'use client';

import '../../../globals.css';
import { useUser } from '@/components/Providers/LoggedInUserProvider.jsx';
import { BiLoaderCircle } from "react-icons/bi";
import Pagination from "@/components/ui/CustomPagination.jsx";
import { MdError } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdDone } from "react-icons/md";
import { Button } from "@/components/ui/button.jsx";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import * as React from "react";
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
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePagination, DOTS } from "@/hooks/Pagination";

const PausedMembers = () => {

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
    const limit = 15;
    const [isDeleting, setIsDeleting] = useState(false);

    const debounce = (func, delay) => {
        let timerId;
        return (...args) => {
            if (timerId) clearTimeout(timerId);
            timerId = setTimeout(() => func(...args), delay);
        };
    };

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const getAllMembers = async ({ queryKey }) => {
        const [, page, searchQuery] = queryKey;

        try {
            const response = await fetch(
                `http://88.198.112.156:3000/api/members/pausedmembers?page=${page}&limit=${limit}&memberSearchQuery=${searchQuery}`
            );
            const resBody = await response.json();
            return resBody;
        } catch (error) {
            console.error('Error: ', error);
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ['members', currentPage, debouncedSearchQuery],
        queryFn: getAllMembers,
        keepPreviousData: true,
    });

    const { totalPages, totalMembers, members } = data || {};

    const { range, setPage, active } = usePagination({
        total: totalPages ? totalPages : 1,
        siblings: 1,
        boundaries: 1,
        page: currentPage,
        onChange: (page) => {
            setCurrentPage(page);
        },
    });

    const sendQrInEmail = async (id) => {
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/send-qr`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });
            const responseBody = await response.json();
            if (response.status !== 200) {
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
                    setResponseType(responseResultType[0]);
                    setToast(true);
                    setTimeout(() => {
                        setToast(false)
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
            setToast(true);
            setTimeout(() => {
                setToast(false)
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
            const response = await fetch(`http://88.198.112.156:3000/api/members/deleteMember/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': "application/json"
                },
                credentials: "include"
            });
            const responseBody = await response.json();

            if (response.status !== 200) {
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
                        setToast(false)
                    }, 10000);
                    setSuccessMessage({
                        icon: MdError,
                        message: responseBody.message || 'Unauthorized action'
                    })
                }
                setConfirmDeleteMember(false);
                queryClient.invalidateQueries(['members']);
            }

        } catch (error) {
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

    return (
        <div className="w-full flex justify-center">
            <div className="w-full" onClick={() => setToast(false)}>
                <div className='w-full p-6' onClick={() => setToast(false)}>
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
                                    <Button className='bg-red-600 rounded-md hover:bg-red-600' onClick={() => deleteMember(toDeleteMemberId)}>{isMemberDeleting ? 'Processing...' : "Delete"}</Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}

                    {isDeleting ? (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="absolute inset-0 bg-black opacity-50"></div>
                            <div className={`bg-white border shadow-2xl flex items-center justify-between p-4 relative`}>
                                <div className="w-full flex items-center">
                                    <BiLoaderCircle className="text-xl animate-spin duration-500 transition-all mx-6" />
                                    <h1>Deleting <span className="animate-pulse duration-500 transition-all">...</span></h1>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <></>
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
                                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Members</BreadcrumbPage>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Paused Members</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className="text-xl font-bold mt-3">All Members</h1>
                </div>

                <div className="w-full px-4">
                    <div className="w-full bg-white flex items-center border px-4 my-2">
                        <IoSearch />
                        <Input
                            className='rounded-none border-none'
                            placeholder='Search members...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <Loader />
                ) : (
                    <div className="w-full flex children-wrapper h-full justify-start bg-white px-2">
                        <div className="overflow-x-auto">
                            <Table className='min-w-full'>
                                <TableHeader>
                                    <TableRow className='bg-gray-200 text-black p-0'>
                                        <TableHead>Member Id</TableHead>
                                        <TableHead>Full Name</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Option</TableHead>
                                        <TableHead>Renew</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Expire</TableHead>
                                        <TableHead>Contact No</TableHead>
                                        <TableHead>Shift</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Fee</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {members && members.length > 0 ? (
                                        members.map((member) => {
                                            const textColor =
                                                member.status === 'Active' ? 'text-black' :
                                                    member.status === 'OnHold' ? 'text-yellow-600' :
                                                        'text-red-500';
                                            return (
                                                <TableRow key={member._id} className={textColor}>
                                                    <TableCell><p>{member._id}</p></TableCell>
                                                    <TableCell>{member.fullName}</TableCell>
                                                    <TableCell>{member.membershipDuration}</TableCell>
                                                    <TableCell>{member.membershipOption}</TableCell>
                                                    <TableCell>{new Date(member.membershipRenewDate).toISOString().split("T")[0]}</TableCell>
                                                    <TableCell>{member.membershipType}</TableCell>
                                                    <TableCell>{new Date(member.membershipExpireDate).toISOString().split("T")[0]}</TableCell>
                                                    <TableCell>{member.contactNo}</TableCell>
                                                    <TableCell>{member.membershipShift}</TableCell>
                                                    <TableCell>{member.status.charAt(0).toUpperCase() + member.status.slice(1)}</TableCell>
                                                    <TableCell>{member.paidAmmount}</TableCell>
                                                    <TableCell>
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
                                                                            {`This email will send membership details and QR Code to the ${member.fullName || 'member'}. If you are sure click continue`}
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
                                                                            {`This action cannot be undone. This will permanently delete ${member.fullName || 'member'}'s  detail
                                                                           and remove data from servers.`}
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction onClick={() => deleteMember(member._id)}>Continue</AlertDialogAction>
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
                                            <TableCell colSpan={13} className="text-center">
                                                No members found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={3}>Total Members</TableCell>
                                        <TableCell className="text-right">{totalMembers}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                    </div>
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
    )
}

export default PausedMembers;
