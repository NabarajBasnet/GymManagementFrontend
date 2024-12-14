'use client';

import Pagination from "@/components/ui/CustomPagination";
import { Label } from "@/components/ui/label";
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
} from "../allmembers/allmembertable";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Loader from "@/components/Loader/Loader";
import { usePagination } from "@/hooks/Pagination";

const PaymentDetails = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [memberName, setMemberName] = useState('');
    const [memberId, setMemberId] = useState('');
    const [renderDropdown, setRenderDropdown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1)
    const limit = 10;

    const { control, formState: { errors, isSubmitting } } = useForm();

    const getAllMembers = async () => {
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/members`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const { data, isLoading } = useQuery({
        queryKey: ['members'],
        queryFn: getAllMembers
    });

    const { members } = data || {};

    const getPaymentDetails = async ({ queryKey }) => {
        const [, page, memberId] = queryKey
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/paymentdetails/${memberId}?page=${page}&limit=${limit}`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const { data: paymentDetails, isLoading: isPaymentDetailLoading } = useQuery({
        queryKey: ['paymentDetails', currentPage, memberId],
        queryFn: getPaymentDetails,
        enabled: !!memberId
    });

    const { paginatedPaymentDetails, totalPages, totalPaymentDetails } = paymentDetails || {}
    const { range, setPage, active } = usePagination({
        total: totalPages ? totalPages : 1,
        siblings: 1,
        boundaries: 1,
        page: currentPage,
        onChange: (page) => {
            setCurrentPage(page);
        },
    });

    const searchRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setRenderDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchRef]);

    const handleSearchFocus = () => {
        setRenderDropdown(true);
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
                            <BreadcrumbLink href="/dashboard">dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>paymentdetails</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-xl font-bold mt-3">Payment Details</h1>
            </div>

            <div className="w-full bg-white p-4">
                <form className="w-full flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
                    <div className="w-full">
                        <Label className="block text-sm font-medium text-gray-700">Member Name</Label>
                        <div ref={searchRef} className="relative md:flex items-center m-2">
                            <Controller
                                name="memberName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        autoComplete="off"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            field.onChange(e);
                                        }}
                                        onFocus={handleSearchFocus}
                                        className="w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm px-4 md:py-0 py-2"
                                        placeholder="Search members..."
                                    />
                                )}
                            />
                            {errors.memberName && (
                                <p className="mt-1 text-sm font-semibold text-red-600">
                                    {errors.memberName.message}
                                </p>
                            )}

                            {renderDropdown && (
                                <div className="absolute w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-80 overflow-y-auto z-20 top-full left-0">
                                    {members
                                        ?.filter((member) => {
                                            const matchByName = member.fullName
                                                .toLowerCase()
                                                .includes(searchQuery.toLowerCase());
                                            return matchByName;
                                        })
                                        .map((member) => (
                                            <p
                                                onClick={() => {
                                                    setMemberName(member.fullName);
                                                    setSearchQuery(member.fullName);
                                                    setMemberId(member._id);
                                                    setRenderDropdown(false);
                                                }}
                                                className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 cursor-pointer"
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
                </form>

                <div>
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className='bg-gray-200 text-black'>
                                    <TableHead>MemberId</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Action Taker</TableHead>
                                    <TableHead>Receipt No</TableHead>
                                    <TableHead>Paid Amount</TableHead>
                                    <TableHead>Payment Date</TableHead>
                                    <TableHead>Renew</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Expire</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Discount</TableHead>
                                    <TableHead>Reference Code</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.isArray(paginatedPaymentDetails) && paginatedPaymentDetails.length >= 1 ? (
                                    <>
                                        {paginatedPaymentDetails.map((detail) => (
                                            <TableRow key={detail._id}>
                                                <TableCell className="font-medium">{paginatedPaymentDetails ? detail.member._id : ''}</TableCell>
                                                <TableCell className="font-medium">{paginatedPaymentDetails ? detail.member.fullName : ''}</TableCell>
                                                <TableCell>{detail.actionTaker}</TableCell>
                                                <TableCell>{detail.receiptNo}</TableCell>
                                                <TableCell>{detail.paidAmmount}</TableCell>
                                                <TableCell>{detail.paymentDate ? new Date(detail.paymentDate).toISOString().split('T')[0] : ''}</TableCell>
                                                <TableCell className="font-medium">{paginatedPaymentDetails ? new Date(detail.member.membershipRenewDate).toISOString().split('T')[0] : ''}</TableCell>
                                                <TableCell>{detail.membershipDuration}</TableCell>
                                                <TableCell className="font-medium">{paginatedPaymentDetails ? new Date(detail.member.membershipExpireDate).toISOString().split('T')[0] : ''}</TableCell>
                                                <TableCell>{detail.paymentMethod}</TableCell>
                                                <TableCell>{detail.discount ? detail.discount : 'Null'}</TableCell>
                                                <TableCell>{detail.referenceCode}</TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                ) : (
                                    <TableRow>
                                        <TableCell className="text-center">No payment details recorded.</TableCell>
                                    </TableRow>
                                )}


                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={3}>Total Payments</TableCell>
                                    <TableCell className="text-right">5</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    )}
                </div>

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

export default PaymentDetails;
