'use client'

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
} from "@/components/ui/table";
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

const AllMembers = () => {

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

    const { totalPages } = data || {};

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Search Bar Dropdown
    const [searchMemberHistory, setSearchMemberHistory] = useState([
        'Nabaraj Basnet',
        'Phill Heath',
        'Ronie Colemon',
        'Jay Cutlar',
        'Lee Hany',
        'Big Ramy',
    ]);

    const searchRef = useRef(null);
    const [renderSearchDropdown, setRenderSearchDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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

    return (
        <div className="w-full">
            <div className='w-full p-6'>
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
                            <BreadcrumbPage>allmembers</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-xl font-bold mt-3">All Members</h1>
            </div>

            {isLoading ? (
                <Loader />
            ) : (
                <div className="w-full bg-white p-4" ref={searchRef}>
                    <div className="w-full relative">
                        <div className="w-full flex items-center border px-4 my-2">
                            <IoSearch />
                            <Input
                                onFocus={() => setRenderSearchDropdown(!renderSearchDropdown)}
                                className='rounded-none border-none'
                                placeholder='Search member...'
                            />
                        </div>
                        {
                            renderSearchDropdown ? (
                                <div className="w-full absolute top-full bg-white shadow-2xl z-50">
                                    {searchMemberHistory.map((item) => (
                                        <div className="w-full">
                                            <p className="hover:bg-gray-200 cursor-pointer py-2 px-4">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                </>
                            )
                        }
                    </div>
                    <div className="w-full">
                        <Table>
                            <TableHeader>
                                <TableRow className='bg-gray-200 text-black'>
                                    <TableHead>Member Id</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Option</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Renew</TableHead>
                                    <TableHead>Expire Date</TableHead>
                                    <TableHead>Contact No</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Fee</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.members.map((member) => (
                                    <TableRow key={member._id}>
                                        <TableCell><p className='text-sm font-semibold'>{member._id}</p></TableCell>
                                        <TableCell className='text-sm'>{member.firstName} {member.lastName}</TableCell>
                                        <TableCell className='text-sm'>{member.address}</TableCell>
                                        <TableCell>{member.membershipOption}</TableCell>
                                        <TableCell>{member.membershipType}</TableCell>
                                        <TableCell>{member.membershipDuration}</TableCell>
                                        <TableCell>{member.membershipRenewDate}</TableCell>
                                        <TableCell>{member.membershipExpireDate}</TableCell>
                                        <TableCell>{member.phoneNumber}</TableCell>
                                        <TableCell>{'Active'}</TableCell>
                                        <TableCell>{member.paidAmmount}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-between">
                                                <Link href={`/dashboard/allmembers/${member._id}`}>
                                                    <FaUserEdit className='cursor-pointer text-md' />
                                                </Link>
                                                <MdEmail className='cursor-pointer text-md' />
                                            </div>
                                        </TableCell>
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
                    </div>

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
