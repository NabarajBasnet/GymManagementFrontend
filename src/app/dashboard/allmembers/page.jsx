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
import { useState } from "react";

const AllMembers = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const getAllMembers = async ({ queryKey }) => {
        const [, page] = queryKey
        try {
            const response = await fetch(`http://localhost:5000/api/members?page=${page}&limit=${limit}`);
            const resBody = await response.json();
            console.log('Res body: ', resBody);
            return resBody;
        } catch (error) {
            console.log('Error: ', error);
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: (['members', currentPage]),
        queryFn: getAllMembers
    });
    console.log('Data: ', data)
    const totalPages = data || data.totalPages;
    console.log("Total Pages: ", totalPages);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

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
                <div className="w-full bg-white p-4">
                    <div className="flex items-center border px-4 my-2">
                        <IoSearch />
                        <Input
                            className='rounded-none border-none'
                            placeholder='Search member...'
                        />
                    </div>
                    <div>
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
                                        <TableCell className="font-medium">{member._id}</TableCell>
                                        <TableCell>{member.firstName + ' ' + member.lastName}</TableCell>
                                        <TableCell>{member.address}</TableCell>
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
                                                <FaUserEdit className='cursor-pointer' />
                                                <MdEmail className='cursor-pointer' />
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
