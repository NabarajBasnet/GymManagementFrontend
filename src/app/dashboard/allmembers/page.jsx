'use client'

import { Pagination } from "@mantine/core";
import { MdError } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdDone } from "react-icons/md";
import { Button } from "@/components/ui/button.jsx";
import { IoMdClose } from "react-icons/io";
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
} from "./allmembertable.jsx";
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { debounce } from "@mui/material";
import { usePagination, DOTS } from "@/hooks/Pagination";

const AllMembers = () => {

    const queryClient = useQueryClient();
    const [toast, setToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState({ icon: MdDone, message: '' });
    const [errorMessage, setErrorMessage] = useState({ icon: MdError, message: '' });
    const [responseType, setResponseType] = useState('')
    const responseResultType = ['Success', 'Failure'];
    const [confirmDeleteMember, setConfirmDeleteMember] = useState(false);
    const [toDeleteMemberId, setToDeleteMemberId] = useState('');
    const [isMemberDeleting, setIsMemberDeleting] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const limit = 12;

    const getAllMembers = async ({ queryKey }) => {
        const [, page] = queryKey

        try {
            const response = await fetch(`http://88.198.112.156:3000/api/members?page=${page}&limit=${limit}`);
            const resBody = await response.json();
            return resBody;
        } catch (error) {
            console.log('Error: ', error);
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: (['members', currentPage]),
        queryFn: getAllMembers
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

    const searchRef = useRef(null);
    const [renderSearchDropdown, setRenderSearchDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState('');

    const fetchSearchResults = async (searchQuery) => {
        if (searchQuery.trim() === '') {
            setResults([]);
            return;
        };

        const response = await fetch(`http://88.198.112.156:3000/api/search-all-members?memberSearchQuery=${searchQuery}`)
        const data = await response.json();
        setResults(data.members);
    }

    const debouncedFetchResults = debounce(fetchSearchResults, 300);

    const handleChange = (event) => {
        setSearchQuery(event.target.value);
        debouncedFetchResults(event.target.value);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && searchRef.current.contains(event.target)) {
                setRenderSearchDropdown(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [searchRef]);

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
        setIsMemberDeleting(true);
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
                setIsMemberDeleting(false);
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
        <div className="w-full">
            <div className='w-full p-6'>
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
                            <BreadcrumbPage>All Members</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-xl font-bold mt-3">All Members</h1>
            </div>

            {isLoading ? (
                <Loader />
            ) : (
                <div className="w-full bg-white p-4">
                    <div className="w-full relative">
                        <div className="w-full flex items-center border px-4 my-2">
                            <IoSearch />
                            <Input
                                onFocus={() => setRenderSearchDropdown(true)}
                                className='rounded-none border-none'
                                placeholder='Search member...'
                                value={searchQuery}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                        {
                            renderSearchDropdown ? (
                                <div className="w-full absolute top-full bg-white shadow-2xl z-50 overflow-auto">
                                    <div className="w-full flex bg-gray-100 justify-between items-center py-3 px-4">
                                        <p></p>
                                        <IoMdClose
                                            className="cursor-pointer text-lg"
                                            onClick={() => setRenderSearchDropdown(false)}
                                        />
                                    </div>

                                    <div className="w-full h-full flex justify-center overflow-auto">
                                        <Table className="w-full">
                                            <TableHeader>
                                                <TableRow>
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
                                                {Array.isArray(results) && results.length > 0 ? (
                                                    results.map((member) => {
                                                        const textColor =
                                                            member.status === 'Active'
                                                                ? 'text-green-500'
                                                                : member.status === 'OnHold'
                                                                    ? 'text-yellow-500'
                                                                    : 'text-red-500';
                                                        return (
                                                            <TableRow key={member._id} className={textColor}>
                                                                <TableCell className='pl-2'>{member._id}</TableCell>
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
                                                                        <Link href={`/dashboard/allmembers/${member._id}`} target="_blank" rel="noopener noreferrer">
                                                                            <FaUserEdit className="cursor-pointer text-lg" />
                                                                        </Link>
                                                                        <MdEmail
                                                                            onClick={() => sendQrInEmail(member._id)}
                                                                            className="cursor-pointer text-lg"
                                                                        />
                                                                        <MdDelete
                                                                            onClick={() => {
                                                                                setConfirmDeleteMember(true);
                                                                                setToDeleteMemberId(member._id);
                                                                            }}
                                                                            className="cursor-pointer text-red-600 text-lg"
                                                                        />
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan="12" className="text-center">
                                                            No members found.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            ) : null
                        }
                    </div>

                    {renderSearchDropdown ? (
                        <></>
                    ) : (
                        <div className="w-full flex justify-start">
                            <div className="w-full overflow-x-auto">
                                <Table className='w-full overflow-x-auto'>
                                    <TableHeader>
                                        <TableRow className='bg-gray-200 text-black'>
                                            <TableHead>Member Id</TableHead>
                                            <TableHead>Full Name</TableHead>
                                            <TableHead>Duration</TableHead>
                                            <TableHead>
                                                <div className="flex items-center">
                                                    <h1>Option</h1>
                                                    <div className="flex flex-col justify-center -space-y-3">
                                                        <MdArrowDropUp className="text-xl" />
                                                        <MdArrowDropDown className="text-xl" />
                                                    </div>
                                                </div>
                                            </TableHead>
                                            <TableHead>
                                                <div className="flex items-center">
                                                    <h1>Renew</h1>
                                                    <div className="flex flex-col justify-center -space-y-3">
                                                        <MdArrowDropUp className="text-xl" />
                                                        <MdArrowDropDown className="text-xl" />
                                                    </div>
                                                </div>
                                            </TableHead>
                                            <TableHead>
                                                <div className="flex items-center">
                                                    <h1>Type</h1>
                                                    <div className="flex flex-col justify-center -space-y-3">
                                                        <MdArrowDropUp className="text-xl" />
                                                        <MdArrowDropDown className="text-xl" />
                                                    </div>
                                                </div>
                                            </TableHead>
                                            <TableHead>
                                                <div className="flex items-center">
                                                    <h1>Expire</h1>
                                                    <div className="flex flex-col justify-center -space-y-3">
                                                        <MdArrowDropUp className="text-xl" />
                                                        <MdArrowDropDown className="text-xl" />
                                                    </div>
                                                </div>
                                            </TableHead>
                                            <TableHead>Contact No</TableHead>
                                            <TableHead>
                                                <div className="flex items-center">
                                                    <h1>Shift</h1>
                                                    <div className="flex flex-col justify-center -space-y-3">
                                                        <MdArrowDropUp className="text-xl" />
                                                        <MdArrowDropDown className="text-xl" />
                                                    </div>
                                                </div>
                                            </TableHead>
                                            <TableHead>
                                                <div className="flex items-center">
                                                    <h1>Status</h1>
                                                    <div className="flex flex-col justify-center -space-y-3">
                                                        <MdArrowDropUp className="text-xl" />
                                                        <MdArrowDropDown className="text-xl" />
                                                    </div>
                                                </div>
                                            </TableHead>
                                            <TableHead>Fee</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {members && members.length > 0 ? (
                                            members.map((member) => {
                                                const textColor =
                                                    member.status === 'Active' ? 'text-green-500' :
                                                        member.status === 'OnHold' ? 'text-yellow-500' :
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
                                                                <Link href={`/dashboard/allmembers/${member._id}`}>
                                                                    <FaUserEdit className='cursor-pointer text-lg' />
                                                                </Link>
                                                                <MdEmail
                                                                    onClick={() => sendQrInEmail(member._id)}
                                                                    className='cursor-pointer text-lg'
                                                                />
                                                                <MdDelete
                                                                    onClick={() => {
                                                                        setConfirmDeleteMember(true);
                                                                        setToDeleteMemberId(member._id);
                                                                    }}
                                                                    className="cursor-pointer text-red-600 text-lg"
                                                                />
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
            )}
        </div>
    )
}

export default AllMembers;
