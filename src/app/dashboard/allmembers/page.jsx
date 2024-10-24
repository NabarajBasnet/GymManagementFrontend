'use client'

import { Button } from "@/components/ui/button.jsx";
import { IoMdClose } from "react-icons/io";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
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
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
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
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { debounce } from "@mui/material";

const AllMembers = () => {

    const [qrState, setQrState] = useState('')
    const [qrMessage, setQrMessage] = useState('')

    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const getAllMembers = async ({ queryKey }) => {
        const [, page] = queryKey

        try {
            const response = await fetch(`http://localhost:5000/api/members?page=${page}&limit=${limit}`);
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

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const searchRef = useRef(null);
    const [renderSearchDropdown, setRenderSearchDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState('');


    const fetchSearchResults = async (searchQuery) => {
        if (searchQuery.trim() === '') {
            setResults([]);
            return;
        };

        const response = await fetch(`http://localhost:5000/api/search-all-members?memberSearchQuery=${searchQuery}`)
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
            const response = await fetch(`http://localhost:5000/api/qr/send-qr`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });
            const responseBody = await response.json();
            if (response.ok) {
                setQrState(true);
                setQrMessage(responseBody.message);
            }
        } catch (error) {
            console.log('Error: ', error);
        }
    };

    return (
        <div className="w-full">
            <div className='w-full p-6'>
                {
                    qrState ? (
                        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                            <div className="bg-white p-8 rounded-sm shadow-lg w-[45rem]">
                                <h2 className="text-lg font-bold mb-4">Email Alert</h2>
                                <p className="mb-6">{qrMessage}</p>
                                <div className="w-full flex justify-center">
                                    <Button
                                        onClick={() => setQrState(false)}
                                        className="w-full rounded-none bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4"
                                    >
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )
                }
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
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>Renew</TableHead>
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
                                                                <TableCell>{member.membershipType}</TableCell>
                                                                <TableCell>{new Date(member.membershipRenewDate).toISOString().split("T")[0]}</TableCell>
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
                                                    <h1>Type</h1>
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
                                                        <TableCell>{member.membershipType}</TableCell>
                                                        <TableCell>{new Date(member.membershipRenewDate).toISOString().split("T")[0]}</TableCell>
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
            )}
        </div>
    )
}

export default AllMembers;
