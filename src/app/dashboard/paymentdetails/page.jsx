'use client';

import { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { BiLoaderCircle } from "react-icons/bi";
import { MdDelete, MdEdit, MdContentCopy, MdPrint, MdFileDownload } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Pagination from "@/components/ui/CustomPagination";
import Loader from "@/components/Loader/Loader";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { usePagination } from "@/hooks/Pagination";

const PaymentDetails = () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [memberName, setMemberName] = useState('');
    const [memberId, setMemberId] = useState('');
    const [renderDropdown, setRenderDropdown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isExporting, setIsExporting] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    const tableRef = useRef(null);

    const limit = 10;
    const queryClient = useQueryClient();

    const { control, formState: { errors } } = useForm();

    const getAllMembers = async () => {
        try {
            const response = await fetch(`gymmanagementbackend-o2l3.onrender.com/api/members`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
            toast.error("Failed to fetch members");
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ['members'],
        queryFn: getAllMembers
    });

    const { members } = data || {};

    const getPaymentDetails = async ({ queryKey }) => {
        const [, page, memberId] = queryKey;
        try {
            const response = await fetch(`gymmanagementbackend-o2l3.onrender.com/api/paymentdetails/${memberId}?page=${page}&limit=${limit}`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
            toast.error("Failed to fetch payment details");
        };
    };

    const { data: paymentDetails, isLoading: isPaymentDetailLoading } = useQuery({
        queryKey: ['paymentDetails', currentPage, memberId],
        queryFn: getPaymentDetails,
        enabled: !!memberId
    });

    const { paginatedPaymentDetails, totalPages, totalPaymentDetails } = paymentDetails || {};
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
            const response = await fetch(`gymmanagementbackend-o2l3.onrender.com/api/paymentdetails/${id}`,
                {
                    method: "DELETE",
                });
            const responseBody = await response.json();
            if (response.ok) {
                setIsDeleting(false);
                toast.success(responseBody.message);
                queryClient.invalidateQueries(['paymentDetails']);
            } else {
                toast.error(responseBody.message);
                setIsDeleting(false);
            }
        } catch (error) {
            console.log("Error: ", error);
            setIsDeleting(false);
            toast.error("An error occurred while deleting");
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                toast.success("ID copied to clipboard");
            })
            .catch(() => {
                toast.error("Failed to copy ID");
            });
    };

    const handlePrint = () => {
        if (!paginatedPaymentDetails || paginatedPaymentDetails.length === 0) {
            toast.error("No data to print");
            return;
        }

        setIsPrinting(true);

        const doc = new jsPDF();

        // Add title
        doc.setFontSize(16);
        doc.text("Payment Details Report", 14, 22);

        // Add member info if available
        if (memberName) {
            doc.setFontSize(12);
            doc.text(`Member: ${memberName}`, 14, 32);
        }

        // Add date
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 40);

        // Create table
        const tableColumn = ["Name", "Receipt No", "Amount", "Date", "Duration", "Method"];
        const tableRows = paginatedPaymentDetails.map(item => [
            item.member.fullName,
            item.receiptNo,
            item.paidAmmount,
            new Date(item.paymentDate).toLocaleDateString(),
            item.membershipDuration,
            item.paymentMethod
        ]);

        doc.autoTable({
            startY: 45,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246], textColor: 255 },
            styles: { fontSize: 9 }
        });

        doc.save(`Payment_Details_${new Date().toISOString().slice(0, 10)}.pdf`);
        setIsPrinting(false);
        toast.success("PDF has been generated");
    };

    const handleExportExcel = () => {
        if (!paginatedPaymentDetails || paginatedPaymentDetails.length === 0) {
            toast.error("No data to export");
            return;
        }

        setIsExporting(true);

        const worksheet = XLSX.utils.json_to_sheet(
            paginatedPaymentDetails.map(item => ({
                "Member Name": item.member.fullName,
                "Member ID": item.member._id,
                "Receipt No": item.receiptNo,
                "Amount": item.paidAmmount,
                "Payment Date": new Date(item.paymentDate).toLocaleDateString(),
                "Duration": item.membershipDuration,
                "Method": item.paymentMethod,
                "Discount": item.discount || "-",
                "Reference": item.referenceCode,
                "Action Taker": item.actionTaker
            }))
        );

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Payment Details");

        XLSX.writeFile(workbook, `Payment_Details_${new Date().toISOString().slice(0, 10)}.xlsx`);
        setIsExporting(false);
        toast.success("Excel file has been generated");
    };

    return (
        <div className="w-full bg-gray-50 min-h-screen">
            {/* Loading State */}
            {(isDeleting || isPrinting || isExporting) && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                    <div className="bg-white rounded-lg shadow-2xl p-6 flex items-center space-x-3 max-w-sm w-full mx-4">
                        <BiLoaderCircle className="text-2xl text-blue-600 animate-spin" />
                        <h1 className="text-lg font-medium text-gray-800">
                            {isDeleting ? "Deleting" : isPrinting ? "Generating PDF" : "Exporting Excel"}
                            <span className="animate-pulse">...</span>
                        </h1>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="w-full p-6 bg-white border-b shadow-sm sticky top-0 z-10">
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
                            <BreadcrumbLink href="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium text-gray-900">Payment Details</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4">
                    <h1 className="text-2xl font-bold text-gray-900">Payment Details</h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1400px] mx-auto p-4 md:p-6">
                {/* Search Form */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <form className="w-full md:flex justify-between items-center">
                        <div className="w-full md:max-w-md">
                            <Label className="block text-sm font-medium mb-1.5 text-gray-700">Search Member</Label>
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
                                                className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm px-4 py-2.5 pl-10"
                                                placeholder="Search members..."
                                            />
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                                <FiSearch className="h-5 w-5" />
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
                                        {members?.length > 0 ? (
                                            members
                                                .filter((member) => {
                                                    return member.fullName
                                                        .toLowerCase()
                                                        .includes(searchQuery.toLowerCase());
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
                                                ))
                                        ) : (
                                            <div className="px-4 py-3 text-sm text-gray-500">No members found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 mt-4 md:mt-0">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="rounded-md border border-gray-300 text-gray-700"
                                            onClick={handlePrint}
                                            disabled={!paginatedPaymentDetails || paginatedPaymentDetails.length === 0}
                                        >
                                            <MdPrint className="mr-1.5" /> Print
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Export as PDF</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="rounded-md border border-gray-300 text-gray-700"
                                            onClick={handleExportExcel}
                                            disabled={!paginatedPaymentDetails || paginatedPaymentDetails.length === 0}
                                        >
                                            <MdFileDownload className="mr-1.5" /> Export
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Export as Excel</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </form>
                </div>

                {/* Results Summary */}
                {memberId && paginatedPaymentDetails && paginatedPaymentDetails.length > 0 && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-800">
                                    Showing payment details for: <span className="font-bold">{memberName}</span>
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                    {totalPaymentDetails} total records found • Page {currentPage} of {totalPages}
                                </p>
                            </div>
                            <div className="mt-2 md:mt-0">
                                <Button
                                    variant="ghost"
                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 text-sm px-2 py-1"
                                    onClick={() => {
                                        setMemberId('');
                                        setMemberName('');
                                        setSearchQuery('');
                                    }}
                                >
                                    Clear Selection
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table Section */}
                <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden mb-6" ref={tableRef}>
                    {(isLoading || isPaymentDetailLoading) && !paginatedPaymentDetails ? (
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
                                            <TableCell sx={{ width: '120px' }}>ID</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell className="text-center">Action Taker</TableCell>
                                            <TableCell className="text-center">Receipt No</TableCell>
                                            <TableCell className="text-center">Paid Amount</TableCell>
                                            <TableCell className="text-center">Payment Date</TableCell>
                                            <TableCell className="text-center">Duration</TableCell>
                                            <TableCell className="text-center">Method</TableCell>
                                            <TableCell className="text-center">Discount</TableCell>
                                            <TableCell className="text-center">Reference Code</TableCell>
                                            {/* <TableCell align="center">Action</TableCell> */}
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
                                                    <TableCell component="th" scope="row" sx={{ width: '120px', maxWidth: '120px' }}>
                                                        <div className="flex items-center space-x-1 max-w-[100px]">
                                                            <span className="truncate font-mono text-xs">{detail.member._id}</span>
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <button
                                                                            onClick={() => copyToClipboard(detail.member._id)}
                                                                            className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                                                                        >
                                                                            <MdContentCopy size={14} />
                                                                        </button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>Copy ID</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{detail.member.fullName}</TableCell>
                                                    <TableCell className="text-center">{detail.actionTaker}</TableCell>
                                                    <TableCell className="text-center">{detail.receiptNo}</TableCell>
                                                    <TableCell className="text-center">{detail.paidAmmount}</TableCell>
                                                    <TableCell className="text-center">
                                                        {detail.paymentDate ? new Date(detail.paymentDate).toLocaleString('en-US', {
                                                            year: 'numeric',
                                                            month: '2-digit',
                                                            day: '2-digit',
                                                        }) : ''}
                                                    </TableCell >
                                                    <TableCell className="text-center">{detail.membershipDuration}</TableCell>
                                                    <TableCell className="text-center">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 text-center rounded-full text-xs font-medium ${detail.paymentMethod === 'Cash' ? 'bg-green-100 text-green-800' :
                                                            detail.paymentMethod === 'Card' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {detail.paymentMethod}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-center">{detail.discount || '-'}</TableCell>
                                                    <TableCell className="text-center">{detail.referenceCode}</TableCell>
                                                    {/* <TableCell>
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <button className="p-1.5 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors">
                                                                            <MdEdit className="text-blue-600 text-lg" />
                                                                        </button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>Edit details</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>

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
                                                    </TableCell> */}
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={11} className="text-center py-16 text-gray-500">
                                                    <div className="flex flex-col items-center justify-center space-y-3">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <p className="text-lg font-medium">No payment details found</p>
                                                        <p className="text-sm max-w-md text-center">
                                                            {memberId
                                                                ? "No payment records available for this member."
                                                                : "Start by searching and selecting a member above."}
                                                        </p>
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
                {paginatedPaymentDetails && paginatedPaymentDetails.length > 0 && totalPages > 1 && (
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
                )}
            </div>
        </div>
    );
};

export default PaymentDetails;