'use client';

import { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { BiLoaderCircle } from "react-icons/bi";
import { MdContentCopy, MdPrint, MdFileDownload, MdReceipt } from "react-icons/md";
import { FiSearch, FiCalendar, FiDollarSign, FiCreditCard } from "react-icons/fi";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
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
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { usePagination } from "@/hooks/Pagination";

const PaymentHistory = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isExporting, setIsExporting] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [memberName, setMemberName] = useState('');
    const [memberId, setMemberId] = useState('');
    const [renderDropdown, setRenderDropdown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [timeframe, setTimeframe] = useState("all");
    const tableRef = useRef(null);

    const limit = 10;
    const queryClient = useQueryClient();

    const { control, formState: { errors } } = useForm();

    // Set default date ranges
    useEffect(() => {
        if (timeframe === "all") {
            setStartDate("");
            setEndDate("");
        } else if (timeframe === "today") {
            const today = new Date().toISOString().split('T')[0];
            setStartDate(today);
            setEndDate(today);
        } else if (timeframe === "thisWeek") {
            const today = new Date();
            const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
            const lastDay = new Date(today.setDate(today.getDate() - today.getDay() + 6));
            setStartDate(firstDay.toISOString().split('T')[0]);
            setEndDate(lastDay.toISOString().split('T')[0]);
        } else if (timeframe === "thisMonth") {
            const today = new Date();
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            setStartDate(firstDay.toISOString().split('T')[0]);
            setEndDate(lastDay.toISOString().split('T')[0]);
        } else if (timeframe === "lastMonth") {
            const today = new Date();
            const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
            setStartDate(firstDay.toISOString().split('T')[0]);
            setEndDate(lastDay.toISOString().split('T')[0]);
        }
    }, [timeframe]);

    // Get all members
    const getAllMembers = async () => {
        try {
            const response = await fetch(`https://gymmanagementbackend-o2l3.onrender.com/api/members`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
            toast.error("Failed to fetch members");
            return { members: [] };
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ['members'],
        queryFn: getAllMembers
    });

    const { members } = data || { members: [] };

    // Get payment history for selected member
    const getPaymentHistory = async ({ queryKey }) => {
        const [, page, memberId, start, end] = queryKey;
        if (!memberId) return { totalPages: 0, total: 0, paymenthistories: [] };

        try {
            const dateParams = start && end ? `&startDate=${start}&endDate=${end}` : "";
            const response = await fetch(`https://gymmanagementbackend-o2l3.onrender.com/api/members/paymenthistory/${memberId}?page=${page}&limit=${limit}${dateParams}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
            toast.error("Failed to fetch payment history");
            return { totalPages: 0, total: 0, paymenthistories: [] };
        }
    };

    const { data: paymentHistory, isLoading: isHistoryLoading, refetch } = useQuery({
        queryKey: ['paymentHistory', currentPage, memberId, startDate, endDate],
        queryFn: getPaymentHistory,
        enabled: !!memberId
    });

    const { totalPages, total, paymenthistories } = paymentHistory || { totalPages: 0, total: 0, paymenthistories: [] };

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

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [startDate, endDate, memberId]);

    const handleSearchFocus = () => {
        setRenderDropdown(true);
    };

    const handleApplyFilters = () => {
        if (memberId) {
            refetch();
        } else {
            toast.error("Please select a member first");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatAmount = (amount) => {
        if (amount === null || amount === undefined) return "N/A";
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getPaymentMethodStyle = (method) => {
        switch (method?.toLowerCase()) {
            case 'cash':
                return 'bg-green-100 text-green-800';
            case 'card':
                return 'bg-blue-100 text-blue-800';
            case 'upi':
                return 'bg-purple-100 text-purple-800';
            case 'bank transfer':
                return 'bg-indigo-100 text-indigo-800';
            case 'cheque':
                return 'bg-amber-100 text-amber-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const exportToExcel = () => {
        if (!paymenthistories || paymenthistories.length === 0) {
            toast.error("No data to export");
            return;
        }

        setIsExporting(true);
        setTimeout(() => {
            try {
                const formattedData = paymenthistories.map(payment => ({
                    'Receipt No': payment.receiptNo || 'N/A',
                    'Payment Date': formatDate(payment.paymentDate),
                    'Membership Option': payment.membershipOption || 'N/A',
                    'Duration': payment.membershipDuration || 'N/A',
                    'Renewal Date': formatDate(payment.membershipRenewDate),
                    'Expiry Date': formatDate(payment.membershipExpireDate),
                    'Amount Paid': payment.paidAmmount || 0,
                    'Discount': payment.discount || 0,
                    'Payment Method': payment.paymentMethod || 'N/A',
                    'Staff': payment.actionTaker || 'N/A'
                }));

                const worksheet = XLSX.utils.json_to_sheet(formattedData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Payment History");

                // Generate filename with member name and date
                const fileName = `${memberName}_Payment_History_${new Date().toISOString().split('T')[0]}.xlsx`;
                XLSX.writeFile(workbook, fileName);

                toast.success("Successfully exported to Excel");
            } catch (error) {
                console.error("Export error:", error);
                toast.error("Failed to export data");
            } finally {
                setIsExporting(false);
            }
        }, 500);
    };

    const generatePDF = () => {
        if (!paymenthistories || paymenthistories.length === 0) {
            toast.error("No data to export");
            return;
        }

        setIsPrinting(true);
        setTimeout(() => {
            try {
                const doc = new jsPDF();

                // Add title
                doc.setFontSize(18);
                doc.text(`Payment History: ${memberName}`, 14, 20);

                // Add date range if applicable
                if (startDate && endDate) {
                    doc.setFontSize(12);
                    doc.text(`Period: ${formatDate(startDate)} to ${formatDate(endDate)}`, 14, 30);
                }

                // Table data
                const tableColumn = ["Receipt", "Date", "Membership", "Duration", "Amount", "Method"];
                const tableRows = paymenthistories.map(payment => [
                    payment.receiptNo || 'N/A',
                    formatDate(payment.paymentDate),
                    payment.membershipOption || 'N/A',
                    payment.membershipDuration || 'N/A',
                    formatAmount(payment.paidAmmount).replace('₹', 'Rs.'),
                    payment.paymentMethod || 'N/A'
                ]);

                // Create the table
                doc.autoTable({
                    head: [tableColumn],
                    body: tableRows,
                    startY: 40,
                    styles: { fontSize: 10 },
                    headStyles: { fillColor: [66, 139, 202] }
                });

                // Add summary
                const finalY = doc.lastAutoTable.finalY + 10;
                doc.setFontSize(12);
                doc.text(`Total Records: ${total}`, 14, finalY);

                // Generate filename with member name and date
                const fileName = `${memberName}_Payment_History_${new Date().toISOString().split('T')[0]}.pdf`;
                doc.save(fileName);

                toast.success("Successfully generated PDF");
            } catch (error) {
                console.error("PDF generation error:", error);
                toast.error("Failed to generate PDF");
            } finally {
                setIsPrinting(false);
            }
        }, 500);
    };

    // Get total paid amount
    const getTotalPaidAmount = () => {
        if (!paymenthistories || paymenthistories.length === 0) return 0;
        return paymenthistories.reduce((sum, payment) => sum + (payment.paidAmmount || 0), 0);
    };

    // Get total discount amount
    const getTotalDiscountAmount = () => {
        if (!paymenthistories || paymenthistories.length === 0) return 0;
        return paymenthistories.reduce((sum, payment) => sum + (payment.discount || 0), 0);
    };

    // Get most common payment method
    const getMostCommonPaymentMethod = () => {
        if (!paymenthistories || paymenthistories.length === 0) return "N/A";

        const methods = paymenthistories.map(p => p.paymentMethod);
        const counts = methods.reduce((acc, method) => {
            if (!method) return acc;
            acc[method] = (acc[method] || 0) + 1;
            return acc;
        }, {});

        if (Object.keys(counts).length === 0) return "N/A";

        const topMethod = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
        return topMethod?.[0] || "N/A";
    };

    return (
        <div className="w-full bg-gray-50 min-h-screen">
            {/* Loading States */}
            {(isPrinting || isExporting) && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                    <div className="bg-white rounded-lg shadow-2xl p-6 flex items-center space-x-3 max-w-sm w-full mx-4">
                        <BiLoaderCircle className="text-2xl text-blue-600 animate-spin" />
                        <h1 className="text-lg font-medium text-gray-800">
                            {isPrinting ? "Generating PDF" : "Exporting Excel"}
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
                                    <DropdownMenuItem className="hover:bg-gray-100">Members</DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-gray-100">Reports</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium text-gray-900">Payment History</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4">
                    <h1 className="text-2xl font-bold text-gray-900">Member Payment History</h1>
                    <div className="flex space-x-2 mt-4 md:mt-0">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={exportToExcel}
                                        disabled={!paymenthistories || paymenthistories.length === 0}
                                        className="text-gray-700 border-gray-300"
                                    >
                                        <MdFileDownload className="mr-1 h-4 w-4" />
                                        Excel
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Export to Excel</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={generatePDF}
                                        disabled={!paymenthistories || paymenthistories.length === 0}
                                        className="text-gray-700 border-gray-300"
                                    >
                                        <MdPrint className="mr-1 h-4 w-4" />
                                        PDF
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Generate PDF</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1400px] mx-auto p-4 md:p-6">
                {/* Search and Filters */}
                <Card className="mb-6">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Payment History Filters</CardTitle>
                        <CardDescription>Search for a member and filter payment records</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* Member Search - 5 columns */}
                            <div className="md:col-span-5">
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
                                                    className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm px-4 py-2.5 pl-10"
                                                    placeholder="Search by member name..."
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
                                            {isLoading ? (
                                                <div className="flex justify-center py-4">
                                                    <BiLoaderCircle className="h-6 w-6 text-blue-600 animate-spin" />
                                                </div>
                                            ) : members?.length > 0 ? (
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
                                                            className="px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors flex justify-between items-center"
                                                            key={member._id}
                                                            value={member._id}
                                                        >
                                                            <span>{member.fullName}</span>
                                                            {member.membershipId && (
                                                                <span className="text-gray-500 text-xs">
                                                                    ID: {member.membershipId}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))
                                            ) : (
                                                <div className="px-4 py-3 text-sm text-gray-500">No members found</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Time Period Select - 3 columns */}
                            <div className="md:col-span-3">
                                <Label className="block text-sm font-medium mb-1.5 text-gray-700">Time Period</Label>
                                <Select
                                    value={timeframe}
                                    onValueChange={setTimeframe}
                                >
                                    <SelectTrigger className="w-full rounded-md border-gray-300">
                                        <SelectValue placeholder="Select period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Time</SelectItem>
                                        <SelectItem value="today">Today</SelectItem>
                                        <SelectItem value="thisWeek">This Week</SelectItem>
                                        <SelectItem value="thisMonth">This Month</SelectItem>
                                        <SelectItem value="lastMonth">Last Month</SelectItem>
                                        <SelectItem value="custom">Custom Range</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Start Date - 2 columns */}
                            <div className="md:col-span-2">
                                <Label className="block text-sm font-medium mb-1.5 text-gray-700">Start Date</Label>
                                <div className="relative">
                                    <Input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => {
                                            setTimeframe("custom");
                                            setStartDate(e.target.value);
                                        }}
                                        className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    />
                                </div>
                            </div>

                            {/* End Date - 2 columns */}
                            <div className="md:col-span-2">
                                <Label className="block text-sm font-medium mb-1.5 text-gray-700">End Date</Label>
                                <div className="relative">
                                    <Input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => {
                                            setTimeframe("custom");
                                            setEndDate(e.target.value);
                                        }}
                                        className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end border-t pt-4">
                        <Button
                            onClick={handleApplyFilters}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={!memberId}
                        >
                            Apply Filters
                        </Button>
                    </CardFooter>
                </Card>

                {/* Summary Cards */}
                {paymenthistories && paymenthistories.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg text-gray-700">Total Payments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center">
                                    <div className="mr-3 bg-blue-100 p-2 rounded-full">
                                        <MdReceipt className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{total}</p>
                                        <p className="text-sm text-gray-500">Records found</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg text-gray-700">Total Amount</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center">
                                    <div className="mr-3 bg-green-100 p-2 rounded-full">
                                        <FiDollarSign className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{formatAmount(getTotalPaidAmount())}</p>
                                        <p className="text-sm text-gray-500">
                                            Total paid
                                            {getTotalDiscountAmount() > 0 && (
                                                <span className="ml-1 text-xs text-green-600">
                                                    (Discount: {formatAmount(getTotalDiscountAmount())})
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg text-gray-700">Latest Payment</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center">
                                    <div className="mr-3 bg-purple-100 p-2 rounded-full">
                                        <FiCalendar className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold">{formatDate(paymenthistories[0]?.paymentDate)}</p>
                                        <p className="text-sm text-gray-500">Last transaction</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg text-gray-700">Common Method</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center">
                                    <div className="mr-3 bg-amber-100 p-2 rounded-full">
                                        <FiCreditCard className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold">{getMostCommonPaymentMethod()}</p>
                                        <p className="text-sm text-gray-500">Most used payment method</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Payment History Table */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Payment Records</CardTitle>
                        <CardDescription>
                            {memberName ?
                                `Showing payment history for ${memberName}` :
                                "Select a member to view payment history"
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isHistoryLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader size="lg" />
                            </div>
                        ) : paymenthistories && paymenthistories.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table ref={tableRef}>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Receipt No</TableHead>
                                            <TableHead>Payment Date</TableHead>
                                            <TableHead className='text-center'>Membership</TableHead>
                                            <TableHead>Duration</TableHead>
                                            <TableHead>Renewal Date</TableHead>
                                            <TableHead>Expiry Date</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead className='text-center'>Discount</TableHead>
                                            <TableHead className='text-center'>Payment Method</TableHead>
                                            <TableHead className='text-center'>Staff</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paymenthistories.map((payment) => (
                                            <TableRow key={payment._id}>
                                                <TableCell className="font-medium flex items-center justify-between">
                                                    {payment.receiptNo || 'N/A'}
                                                    <TooltipProvider className='flex justify-end'>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8"
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(payment.receiptNo || '');
                                                                        toast.success('Receipt number copied');
                                                                    }}
                                                                >
                                                                    <MdContentCopy className="h-4 w-4 text-gray-500" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Copy Receipt No</TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </TableCell>
                                                <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                                                <TableCell className='text-center'>{payment.membershipOption || 'N/A'}</TableCell>
                                                <TableCell>{payment.membershipDuration || 'N/A'}</TableCell>
                                                <TableCell>{formatDate(payment.membershipRenewDate)}</TableCell>
                                                <TableCell>{formatDate(payment.membershipExpireDate)}</TableCell>
                                                <TableCell className="font-medium">
                                                    {formatAmount(payment.paidAmmount)}
                                                </TableCell>
                                                <TableCell className='text-center'>
                                                    {payment.discount ? formatAmount(payment.discount) : 'N/A'}
                                                </TableCell>
                                                <TableCell className='text-center'>
                                                    <span className={`px-2 py-1 rounded-full text-xs ${getPaymentMethodStyle(payment.paymentMethod)}`}>
                                                        {payment.paymentMethod || 'N/A'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className='text-center'>{payment.actionTaker || 'N/A'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="bg-gray-100 p-4 rounded-full mb-4">
                                    <FiCreditCard className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">
                                    {memberId ? 'No payment records found' : 'Select a member to view payment history'}
                                </h3>
                                <p className="text-sm text-gray-500 text-center max-w-md">
                                    {memberId ?
                                        'This member has no payment records for the selected period.' :
                                        'Search and select a member from the filters above to view their payment history.'
                                    }
                                </p>
                            </div>
                        )}
                    </CardContent>
                    {paymenthistories && paymenthistories.length > 0 && (
                        <CardFooter className="flex justify-between border-t pt-4">
                            <div className="text-sm text-gray-500">
                                Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{' '}
                                <span className="font-medium">
                                    {Math.min(currentPage * limit, total)}
                                </span>{' '}
                                of <span className="font-medium">{total}</span> results
                            </div>
                            <Pagination
                                range={range}
                                active={active}
                                setPage={setPage}
                                totalPages={totalPages}
                            />
                        </CardFooter>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default PaymentHistory;