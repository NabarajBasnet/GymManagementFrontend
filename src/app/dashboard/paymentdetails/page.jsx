'use client';

import { BiLoaderCircle } from "react-icons/bi";
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
import { MdDelete, MdEdit, MdError, MdDone, MdClose } from "react-icons/md";
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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Loader from "@/components/Loader/Loader";
import { usePagination } from "@/hooks/Pagination";

const PaymentDetails = () => {

    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [memberName, setMemberName] = useState('');
    const [memberId, setMemberId] = useState('');
    const [renderDropdown, setRenderDropdown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1)
    const limit = 10;
    const queryClient = useQueryClient();

    const [toast, setToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState({ icon: MdDone, message: '' });
    const [errorMessage, setErrorMessage] = useState({ icon: MdError, message: '' });
    const [responseType, setResponseType] = useState('');
    const responseResultType = ['Success', 'Failure'];

    const { control, formState: { errors, isSubmitting } } = useForm();

    const getAllMembers = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/members`);
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
            const response = await fetch(`http://localhost:3000/api/paymentdetails/${memberId}?page=${page}&limit=${limit}`);
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

    const deletePaymentDetail = async (id) => {
        setIsDeleting(true);
        try {
            const response = await fetch(`http://localhost:3000/api/paymentdetails/${id}`,
                {
                    method: "DELETE",
                });
            const responseBody = await response.json();
            if (response.ok) {
                setIsDeleting(false);
                setResponseType(responseResultType[0]);
                setToast(true);
                setTimeout(() => {
                    setToast(false)
                }, 10000);
                setSuccessMessage({
                    icon: MdDone,
                    message: responseBody.message || 'Unauthorized action'
                });
                queryClient.invalidateQueries(['paymentDetails']);
            }
        } catch (error) {
            console.log("Error: ", error);
            setIsDeleting(true);
            setResponseType(responseResultType[1]);
            setToast(false);
            setTimeout(() => {
                setToast(false)
            }, 10000);
            setErrorMessage({
                icon: MdError,
                message: error.message || 'Unauthorized action'
            });
        };
    };

    return (
        <div className="w-full bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="w-full p-6 bg-white border-b shadow-sm">
                <Breadcrumb>
                    <BreadcrumbList className="text-sm">
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/" className="text-gray-600 hover:text-blue-600">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
                                    <BreadcrumbEllipsis className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="rounded-lg shadow-lg">
                                    <DropdownMenuItem className="hover:bg-gray-100">Documentation</DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-gray-100">Themes</DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-gray-100">GitHub</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard" className="text-gray-600 hover:text-blue-600">dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium text-gray-900">Paymentdetails</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-2xl font-bold mt-4 text-gray-900">Payment Details</h1>
            </div>

            {/* Toast Notifications */}
            {toast && (
                <div className="fixed inset-0 flex items-center justify-center z-50" onClick={() => setToast(false)}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                    <div
                        className={`bg-white rounded-lg shadow-2xl flex items-center justify-between p-4 relative max-w-md w-full mx-4 ${responseType === 'Success' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
                            }`}
                    >
                        <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-full ${responseType === 'Success' ? 'bg-green-100' : 'bg-red-100'}`}>
                                {responseType === 'Success' ? (
                                    <MdDone className="text-2xl text-green-600" />
                                ) : (
                                    <MdError className="text-2xl text-red-600" />
                                )}
                            </div>
                            <div>
                                <p className={`font-semibold ${responseType === 'Success' ? 'text-green-700' : 'text-red-700'}`}>
                                    {responseType === 'Success' ? 'Success' : 'Error'}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {responseType === 'Success' ? successMessage.message : errorMessage.message}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setToast(false)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <MdClose className="text-gray-500 text-xl" />
                        </button>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {isDeleting && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                    <div className="bg-white rounded-lg shadow-2xl p-6 flex items-center space-x-3 max-w-sm w-full mx-4">
                        <BiLoaderCircle className="text-2xl text-blue-600 animate-spin" />
                        <h1 className="text-lg font-medium text-gray-800">Deleting<span className="animate-pulse">...</span></h1>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="md:w-7xl lg:w-8xl xl:w-auto p-4 md:p-6">
                {/* Search Form */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <form className="w-full">
                        <div className="w-full md:max-w-md">
                            <Label className="block text-sm font-medium mb-1.5 text-gray-700">Member Name</Label>
                            <div ref={searchRef} className="relative">
                                <Controller
                                    name="memberName"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                autoComplete="off"
                                                value={searchQuery}
                                                onChange={(e) => {
                                                    setSearchQuery(e.target.value);
                                                    field.onChange(e);
                                                }}
                                                onFocus={handleSearchFocus}
                                                className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm px-4 py-2.5 pr-10"
                                                placeholder="Search members..."
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                />
                                {errors.memberName && (
                                    <p className="mt-1.5 text-sm font-medium text-red-600">
                                        {errors.memberName.message}
                                    </p>
                                )}

                                {renderDropdown && (
                                    <div className="absolute w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto z-20 top-full left-0 mt-1">
                                        {members
                                            ?.filter((member) => {
                                                const matchByName = member.fullName
                                                    .toLowerCase()
                                                    .includes(searchQuery.toLowerCase());
                                                return matchByName;
                                            })
                                            .map((member) => (
                                                <div
                                                    onClick={() => {
                                                        setMemberName(member.fullName);
                                                        setSearchQuery(member.fullName);
                                                        setMemberId(member._id);
                                                        setRenderDropdown(false);
                                                    }}
                                                    className="px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors"
                                                    key={member._id}
                                                    value={member._id}
                                                >
                                                    {member.fullName}
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Table Section */}
                <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                    {isLoading ? (
                        <div className="py-16 flex items-center justify-center">
                            <Loader />
                        </div>
                    ) : (
                        <div className="w-full">
                            <TableContainer component={Paper} elevation={0} className="w-full rounded-none border-0">
                                <Table sx={{ minWidth: 400 }} aria-label="payment details table">
                                    <TableHead>
                                        <TableRow sx={{
                                            '& th': {
                                                backgroundColor: '#f9fafb',
                                                fontWeight: 600,
                                                color: '#374151',
                                                fontSize: '0.875rem',
                                                padding: '0.75rem 1rem',
                                                whiteSpace: 'nowrap'
                                            }
                                        }}>
                                            <TableCell>MemberId</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Action Taker</TableCell>
                                            <TableCell>Receipt No</TableCell>
                                            <TableCell>Paid Amount</TableCell>
                                            <TableCell>Payment Date</TableCell>
                                            <TableCell>Duration</TableCell>
                                            <TableCell>Method</TableCell>
                                            <TableCell>Discount</TableCell>
                                            <TableCell>Reference Code</TableCell>
                                            <TableCell align="center">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody className="w-full mx-6">
                                        {Array.isArray(paginatedPaymentDetails) && paginatedPaymentDetails.length >= 1 ? (
                                            paginatedPaymentDetails.map((detail) => (
                                                <TableRow
                                                    key={detail._id}
                                                    sx={{
                                                        '&:hover': { backgroundColor: '#f9fafb' },
                                                        '& td': {
                                                            padding: '0.75rem 1rem',
                                                            fontSize: '0.875rem',
                                                            color: '#4b5563',
                                                            borderBottom: '1px solid #e5e7eb'
                                                        }
                                                    }}
                                                >
                                                    <TableCell component="th" scope="row" sx={{ fontWeight: 500, color: '#374151' }}>{detail.member._id}</TableCell>
                                                    <TableCell>{detail.member.fullName}</TableCell>
                                                    <TableCell>{detail.actionTaker}</TableCell>
                                                    <TableCell>{detail.receiptNo}</TableCell>
                                                    <TableCell sx={{ fontWeight: 500 }}>{detail.paidAmmount}</TableCell>
                                                    <TableCell>
                                                        {detail.paymentDate ? new Date(detail.paymentDate).toLocaleString('en-US', {
                                                            year: 'numeric',
                                                            month: '2-digit',
                                                            day: '2-digit',
                                                        }) : ''}
                                                    </TableCell>
                                                    <TableCell>{detail.membershipDuration}</TableCell>
                                                    <TableCell>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${detail.paymentMethod === 'Cash' ? 'bg-green-100 text-green-800' :
                                                            detail.paymentMethod === 'Card' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {detail.paymentMethod}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>{detail.discount || '-'}</TableCell>
                                                    <TableCell>{detail.referenceCode}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center justify-center space-x-3">
                                                            <button className="p-1.5 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors">
                                                                <MdEdit className="text-blue-600 text-lg" />
                                                            </button>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <button className="p-1.5 rounded-full bg-red-50 hover:bg-red-100 transition-colors">
                                                                        <MdDelete className="text-red-600 text-lg" />
                                                                    </button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent className="rounded-lg">
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle className="text-gray-900">Are you absolutely sure?</AlertDialogTitle>
                                                                        <AlertDialogDescription className="text-gray-600">
                                                                            This action cannot be undone. This will permanently delete this payment detail
                                                                            and remove data from servers.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel className="rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() => deletePaymentDetail(detail._id)}
                                                                            className="rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                                        >
                                                                            Delete
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={12} className="text-center py-12 text-gray-500">
                                                    <div className="flex flex-col items-center justify-center space-y-3">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <p className="text-lg font-medium">No payment details recorded</p>
                                                        <p className="text-sm">When payment records are available, they will appear here.</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="flex justify-center py-4">
                    <Pagination
                        total={totalPages || 1}
                        page={currentPage || 1}
                        onChange={setCurrentPage}
                        withEdges={true}
                        siblings={1}
                        boundaries={1}
                        classNames={{
                            item: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 relative inline-flex items-center px-4 py-2 text-sm font-medium",
                            active: "z-10 bg-blue-600 border-blue-600 text-white hover:bg-blue-700",
                            dots: "relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default PaymentDetails;
