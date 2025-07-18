'use client';

import { PiPrinterBold } from "react-icons/pi";
import { useReactToPrint } from "react-to-print";
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
} from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox";
import { LuSend } from "react-icons/lu";
import { FiPrinter } from "react-icons/fi";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { LuFileSearch2 } from "react-icons/lu";
import { FaUser } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import {
    CircleDollarSign,
    RotateCcw,
    XCircle,
    Clock,
    CheckCircle2,
    AlertCircle,
    Home,
    LayoutDashboard,
    CreditCard,
    FileText,
    ChevronRight,
    Plus,
    Search,
    Trash2,
    ArrowUpDown
} from "lucide-react";
import { FaFileInvoice } from "react-icons/fa6";
import { useRef, useEffect, useState } from 'react';
import Pagination from '@/components/ui/CustomPagination';

// Import shadcn components
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Loader from "@/components/Loader/Loader";
import { useUser } from "@/components/Providers/LoggedInUserProvider";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ResendingInvoiceToMember from "@/components/Resending/ResendingInvoiceToMember";

const PaymentInvoice = () => {

    const { user } = useUser();
    const loggedInUser = user ? user.user : null;

    const queryclient = useQueryClient();

    // Other states
    const [printInvoiceAlert, setPrintInvoiceAlert] = useState(false);
    const [resendingInvoice, setResendingInvoice] = useState(false);
    const [viewInvoiceAlert, setViewInvoiceAlert] = useState([false, null]);
    const [selectedInvoices, setSelectedInvoices] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const invoiceContent = useRef(null);

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedInvoices([]);
        } else {
            setSelectedInvoices(invoices.map(invoice => invoice._id));
        }
        setIsAllSelected(!isAllSelected);
    };

    const handleSelectInvoice = (invoiceId) => {
        if (selectedInvoices.includes(invoiceId)) {
            setSelectedInvoices(selectedInvoices.filter(id => id !== invoiceId));
        } else {
            setSelectedInvoices([...selectedInvoices, invoiceId]);
        }
    };
    // Initialize useReactToPrint hook
    const handlePrint = useReactToPrint({
        contentRef: invoiceContent,
        documentTitle: "Invoice",
        onAfterPrint: () => {
            toast.success('Invoice printed');
        },
        onPrintError: (error) => {
            console.error('Print error:', error);
            toast.error('Failed to generate Invoice');
        }
    });

    const handleGenerateInvoice = () => {
        // Check if ref is properly attached
        if (!invoiceContent.current) {
            toast.error('Print component not ready. Please try again.');
            return;
        }
        // Add a small delay to ensure DOM is ready
        setTimeout(() => {
            handlePrint();
        }, 100);
    };

    // Pagination states
    let limit = 15;
    const [currentPage, setCurrentPage] = useState(1);

    // Search Query
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    // Sorting states
    const [sortBy, setSortBy] = useState('');
    const [sortOrderDesc, setSortOrderDesc] = useState(true);

    // Get all services and products from server
    const getAllInvoices = async ({ queryKey }) => {
        const [, page, searchQuery, sortBy, sortOrderDesc] = queryKey;
        try {
            const response = await fetch(`http://localhost:3000/api/invoice/v2?page=${page}&limit=${limit}&invoiceSearchQuery=${searchQuery}&sortBy=${sortBy}&sortOrderDesc=${sortOrderDesc}`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const { data, isLoading } = useQuery({
        queryFn: getAllInvoices,
        queryKey: ['salesinvoice', currentPage, debouncedSearchQuery, sortBy, sortOrderDesc],
    });

    const { invoices, totalPages } = data || {};

    // Debounce
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Get Single Receipt Details
    const getSingleSalesInvoice = async (invoice) => {
        setviewInvoiceAlert[1](invoice);
        printInvoice(invoice);
    };

    // Resend invoice to members email
    const resendInvoiceToMember = async (memberId, invoiceId) => {
        setResendingInvoice(true);
        try {
            const response = await fetch(`http://localhost:3000/api/invoice/v2/resend-invoice?memberId=${memberId}&invoiceId=${invoiceId}`)
            const resBody = await response.json();
            if (response.ok) {
                toast.success(resBody.message);
                setResendingInvoice(false);
            } else {
                setResendingInvoice(false);
                toast.error(resBody.message);
            }
        } catch (error) {
            console.log("Error: ", error);
            toast.error(error.message);
            setResendingInvoice(false);
        };
    };

    // Delete bulk billing
    const deleteSalesInvoice = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/invoice/V2/${id}`, {
                method: "DELETE",
            });
            const responseBody = await response.json();
            if (response.ok) {
                toast.success(responseBody.message || '');
                queryclient.invalidateQueries(['salesinvoice']);
            } else {
                toast.error(responseBody.message || '');
            }
        } catch (error) {
            console.log("Error: ", error)
        };
    };

    const handleBulkDelete = async () => {
        if (selectedInvoices.length === 0) {
            toast.warning('No invoices selected');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/invoice/v2/bulk-delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ invoiceIds: selectedInvoices }),
            });

            const responseBody = await response.json();
            if (response.ok) {
                toast.success(`${selectedInvoices.length} invoices deleted successfully`);
                setSelectedInvoices([]);
                setIsAllSelected(false);
                queryclient.invalidateQueries(['salesinvoice']);
            } else {
                toast.error(responseBody.message || 'Failed to delete invoices');
            }
        } catch (error) {
            console.log("Error: ", error);
            toast.error(error.message);
        }
    };

    // Get Badge
    const getInvoiceStatusBadge = (status) => {
        switch (status) {
            case "Paid":
                return (
                    <Badge className="bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Paid
                    </Badge>
                );

            case "Unpaid":
                return (
                    <Badge variant="destructive">
                        <XCircle className="h-3 w-3 mr-1" />
                        Unpaid
                    </Badge>
                );

            case "Refunded":
                return (
                    <Badge className="bg-purple-600 hover:bg-purple-700 text-white">
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Refunded
                    </Badge>
                );

            case "Cancelled":
                return (
                    <Badge variant="outline" className="border-red-400 text-red-600">
                        <XCircle className="h-3 w-3 mr-1" />
                        Cancelled
                    </Badge>
                );

            case "Overdue":
                return (
                    <Badge className="bg-amber-600 hover:bg-amber-700 text-white">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Overdue
                    </Badge>
                );

            case "Partial":
                return (
                    <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
                        <CircleDollarSign className="h-3 w-3 mr-1" />
                        Partial
                    </Badge>
                );

            default:
                return (
                    <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {status}
                    </Badge>
                );
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NP', {
            style: 'currency',
            currency: 'NPR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const calculateSubtotal = () => {
        return viewInvoiceAlert[1]?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    };

    return (
        <div className="w-full p-4 md:pt-8 bg-gray-100 dark:bg-gray-900 min-h-screen mx-auto">

            {resendingInvoice && <ResendingInvoiceToMember />}

            {/* Breadcrumb Navigation */}
            <div className="bg-slate-50 dark:bg-gray-800 rounded-sm mt-2 md:mt-3">
                {/* Professional Container */}
                <div className="bg-slate-50 dark:bg-gray-800 shadow-md rounded-sm border-b border-gray-200/50 dark:border-none">
                    <div className="w-full mx-auto px-4">
                        <div className="py-6 lg:py-8">
                            {/* Enhanced Breadcrumb Navigation */}
                            <div className="mb-8">
                                <Breadcrumb>
                                    <BreadcrumbList className="flex items-center space-x-1">
                                        <BreadcrumbItem>
                                            <BreadcrumbLink
                                                href="/"
                                                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                                            >
                                                <Home className="h-4 w-4 mr-2" />
                                                Home
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator>
                                            <ChevronRight className="h-4 w-4 text-gray-400" />
                                        </BreadcrumbSeparator>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink
                                                href="/dashboard"
                                                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                                            >
                                                <LayoutDashboard className="h-4 w-4 mr-2" />
                                                Dashboard
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator>
                                            <ChevronRight className="h-4 w-4 text-gray-400" />
                                        </BreadcrumbSeparator>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink
                                                href="/dashboard/billing/salesinvoice"
                                                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                                            >
                                                <CreditCard className="h-4 w-4 mr-2" />
                                                Billing
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator>
                                            <ChevronRight className="h-4 w-4 text-gray-400" />
                                        </BreadcrumbSeparator>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink
                                                href="/dashboard/billing/salesinvoice"
                                                className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                                            >
                                                <FileText className="h-4 w-4 mr-2" />
                                                Invoice
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
                            </div>

                            {/* Main Header Section */}
                            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
                                {/* Enhanced Title Section */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/25">
                                            <FaFileInvoice className="h-7 w-7 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                                Sales Invoices
                                            </h1>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                                                Manage and track all your invoices with precision and ease
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Action Controls */}
                                <div className="flex flex-col md:flex-row items-stretch gap-4 xl:min-w-0">
                                    {/* Bulk Delete Actions - Improved padding and spacing */}
                                    {selectedInvoices.length > 0 && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="py-6 rounded-sm px-4 bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg transition-all duration-200 border border-red-700 dark:border-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    ( {selectedInvoices.length} )
                                                    Delete
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="sm:max-w-md">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-xl font-semibold">
                                                        Confirm Bulk Delete
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription className="text-base leading-relaxed">
                                                        Are you sure you want to delete {selectedInvoices.length} selected invoice{selectedInvoices.length > 1 ? 's' : ''}?
                                                        This action cannot be undone and will permanently remove the data from your system.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter className="gap-3">
                                                    <AlertDialogCancel className="px-6">
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={handleBulkDelete}
                                                        className="bg-red-600 hover:bg-red-700 px-6"
                                                    >
                                                        Delete Invoices
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}

                                    {/* Enhanced Search Bar - Improved icon positioning */}
                                    <div className="relative flex-1 w-full">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search className="h-5 w-5 text-primary" />
                                        </div>
                                        <Input
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search invoices, customers, amounts..."
                                            className="pl-10 pr-4 text-primary py-6 rounded-sm bg-white/70 dark:bg-gray-800/70 border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:shadow-md"
                                        />
                                    </div>

                                    {/* Premium New Invoice Button */}
                                    <Button
                                        onClick={() => setOpenInvoiceForm(true)}
                                        disabled
                                        className="py-6 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-sm shadow-sm shadow-blue-500/25 hover:shadow-sm hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-100 whitespace-nowrap"
                                    >
                                        <Plus className="h-5 w-5 mr-2" />
                                        New Invoice
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print alert dialog */}
            <AlertDialog open={printInvoiceAlert} onOpenChange={setPrintInvoiceAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Print Invoice?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Would you like to print the invoice now?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPrintInvoiceAlert(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => printInvoice(viewInvoiceAlert[1])}>Print</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Content Area */}
            <div className="w-full bg-slate-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-none shadow-sm my-6">
                {/* Table Section */}
                <div className="shadow-md">
                    {Array.isArray(invoices) && invoices?.length > 0 ? (
                        <div className="w-full">
                            <div className="overflow-x-auto rounded-md">
                                {isLoading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <Loader className="h-8 w-8 text-primary animate-spin" />
                                    </div>
                                ) : (
                                    <table className="w-full text-sm shadow-md">
                                        <thead>
                                            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                                                {/* Added checkbox column header */}
                                                <th className="p-4 align-middle">
                                                    <Checkbox className="h-4 w-4"
                                                        checked={isAllSelected}
                                                        onCheckedChange={handleSelectAll} />
                                                </th>
                                                {[
                                                    { id: 'invoiceNo', label: 'Invoice No' },
                                                    { id: 'customer.fullName', label: 'Customer' },
                                                    { id: 'dueDate', label: 'Due Date' },
                                                    { id: 'amount', label: 'Amount', align: 'right' },
                                                    { id: 'paidAmount', label: 'Paid', align: 'right' },
                                                    { id: 'dueAmount', label: 'Due', align: 'right' },
                                                    { id: 'status', label: 'Status' },
                                                    ...(loggedInUser?.role !== 'Gym Admin' ? [{ id: 'actions', label: 'Actions', align: 'right' }] : [])
                                                ].map((column) => (
                                                    <th
                                                        key={column.id}
                                                        className={`h-12 px-4 ${column.align === 'right' ? 'text-right' : 'text-left'} font-medium text-gray-500 dark:text-gray-400`}
                                                    >
                                                        <div className="flex items-center justify-start gap-1">
                                                            {column.label}
                                                            {column.id !== 'actions' && (
                                                                <button
                                                                    onClick={() => {
                                                                        setSortBy(column.id);
                                                                        setSortOrderDesc(!sortOrderDesc);
                                                                    }}
                                                                    className="ml-1 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                                                >
                                                                    <ArrowUpDown className="h-3.5 w-3.5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoices?.map((invoice) => (
                                                <tr
                                                    key={invoice._id}
                                                    className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                                                >
                                                    {/* Added checkbox column cell */}
                                                    <td className="p-4 align-middle">
                                                        <Checkbox className="h-4 w-4"
                                                            checked={selectedInvoices.includes(invoice._id)}
                                                            onCheckedChange={() => handleSelectInvoice(invoice._id)} />
                                                    </td>

                                                    <td className="p-4 align-middle font-medium text-gray-900 dark:text-gray-100">
                                                        {invoice?.invoiceNo || 'N/A'}
                                                    </td>
                                                    <td className="p-4 align-middle text-gray-700 dark:text-gray-300">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                                                <FaUser className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                            </div>
                                                            <span>{invoice?.customer?.fullName || 'N/A'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 align-middle text-gray-600 dark:text-gray-400">
                                                        {invoice?.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : 'N/A'}
                                                    </td>
                                                    <td className="p-4 align-middle text-start font-medium text-gray-900 dark:text-gray-100">
                                                        {invoice?.organization?.currency} {invoice?.amount?.toLocaleString() || '0'}
                                                    </td>
                                                    <td className="p-4 align-middle text-start text-green-600 dark:text-green-400">
                                                        {invoice?.organization?.currency} {invoice?.paidAmount?.toLocaleString() || '0'}
                                                    </td>
                                                    <td className="p-4 align-middle text-start text-red-600 dark:text-red-400">
                                                        {invoice?.organization?.currency} {invoice?.dueAmount?.toLocaleString() || '0'}
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        {getInvoiceStatusBadge(invoice?.status)}
                                                    </td>
                                                    {loggedInUser?.role !== 'Gym Admin' && (
                                                        <td className="p-4 align-middle text-center">
                                                            <div className="flex justify-center gap-2">
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => setViewInvoiceAlert([true, invoice])}
                                                                            className="h-8 w-8 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                                                        >
                                                                            <FiPrinter className="h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>Print Invoice</p>
                                                                    </TooltipContent>
                                                                </Tooltip>

                                                                <AlertDialog>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <AlertDialogTrigger asChild>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-8 w-8 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                                                                                >
                                                                                    <Trash2 className="h-4 w-4" />
                                                                                </Button>
                                                                            </AlertDialogTrigger>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent className="text-sm">Delete Invoice</TooltipContent>
                                                                    </Tooltip>

                                                                    <AlertDialogContent className="bg-white dark:bg-[#1f1f1f] border border-red-200 dark:border-red-400 shadow-xl rounded-2xl">
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle className="text-red-600 dark:text-red-400 text-lg font-semibold">
                                                                                Confirm Deletion
                                                                            </AlertDialogTitle>
                                                                            <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                                                                                This will permanently delete invoice{" "}
                                                                                <span className="font-medium text-black dark:text-white">
                                                                                    #{invoice.invoiceNo}
                                                                                </span>. This action cannot be undone.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>

                                                                        <AlertDialogFooter className="mt-6">
                                                                            <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
                                                                                Cancel
                                                                            </AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() => deleteSalesInvoice(invoice._id)}
                                                                                className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600 focus-visible:ring-red-500"
                                                                            >
                                                                                Delete Invoice
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>

                                                                <AlertDialog>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <AlertDialogTrigger asChild>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-8 w-8 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                                                                >
                                                                                    <LuSend className="h-4 w-4" />
                                                                                </Button>
                                                                            </AlertDialogTrigger>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Send Invoice</TooltipContent>
                                                                    </Tooltip>

                                                                    <AlertDialogContent className="bg-white dark:bg-[#1f1f1f] border border-blue-200 dark:border-blue-400 shadow-xl rounded-2xl">
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle className="text-blue-600 dark:text-blue-400 text-lg font-semibold">
                                                                                Send Invoice?
                                                                            </AlertDialogTitle>
                                                                            <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                                                                                This will send invoice{" "}
                                                                                <span className="font-medium text-black dark:text-white">
                                                                                    #{invoice.invoiceNo}
                                                                                </span>{" "}
                                                                                to the member's email. You can’t undo this action.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>

                                                                        <AlertDialogFooter className="mt-6">
                                                                            <AlertDialogCancel className="bg-gray-100 dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
                                                                                Cancel
                                                                            </AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() => resendInvoiceToMember(invoice?.customer?._id, invoice?._id)}
                                                                                className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 focus-visible:ring-blue-500"
                                                                            >
                                                                                Send Invoice
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="w-full flex flex-col items-center justify-center py-16 px-4">
                            <div className="max-w-md text-center">
                                <LuFileSearch2 className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    No invoices found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    {searchQuery
                                        ? "No invoices match your search criteria"
                                        : "Get started by creating a new invoice"}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    {invoices?.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 dark:border-gray-800 px-6 py-4">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
                                Showing <span className="font-medium text-gray-700 dark:text-gray-300">{invoices.length}</span> invoices
                            </div>
                            <Pagination
                                total={totalPages || 1}
                                page={currentPage || 1}
                                onChange={setCurrentPage}
                                withEdges={true}
                                siblings={1}
                                boundaries={1}
                                classNames={{
                                    root: "gap-1",
                                    item: "h-9 w-9 border border-gray-300 dark:border-gray-700 bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                                    active: "bg-primary text-white hover:bg-primary/90 dark:hover:bg-primary/90 border-primary",
                                    dots: "text-gray-400 dark:text-gray-500"
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Render View Invoice Alert */}
            {viewInvoiceAlert[0] && (
                <AlertDialog open={viewInvoiceAlert[0]}>
                    <AlertDialogContent className="max-w-4xl max-h-[100vh] overflow-y-auto bg-white dark:bg-gray-900 shadow-2xl">
                        <AlertDialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-2">
                            <AlertDialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                                INVOICE
                            </AlertDialogTitle>
                        </AlertDialogHeader>

                        {viewInvoiceAlert[1] && (
                            <div className="space-y-4 p-4" ref={invoiceContent}>
                                {/* Professional Header */}
                                <div className="flex justify-between items-start bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-4 rounded-lg">
                                    <div className="space-y-1">
                                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                            {viewInvoiceAlert[1].organization?.name || 'Company Name'}
                                        </h1>
                                        <div className="text-gray-600 dark:text-gray-300 space-y-1 text-sm">
                                            <p className="font-medium">{viewInvoiceAlert[1].organizationBranch?.orgBranchName || 'Main Branch'}</p>
                                            <p>{viewInvoiceAlert[1].organizationBranch?.orgBranchAddress || viewInvoiceAlert[1].organization?.city}, {viewInvoiceAlert[1].organization?.state}</p>
                                            <p>{viewInvoiceAlert[1].organization?.country}</p>
                                            <p>Phone: {viewInvoiceAlert[1].organizationBranch?.orgBranchPhone || viewInvoiceAlert[1].organization?.phoneNumber}</p>
                                            <p>Email: {viewInvoiceAlert[1].organization?.businessEmail}</p>
                                        </div>
                                    </div>

                                    <div className="text-right space-y-1">
                                        <div className="bg-blue-600 text-white px-3 py-2 rounded-lg">
                                            <p className="text-xs font-medium">INVOICE #</p>
                                            <p className="text-sm font-bold">{viewInvoiceAlert[1].invoiceNo}</p>
                                        </div>
                                        <div className="text-gray-600 dark:text-gray-300 space-y-1 text-sm">
                                            <p><span className="font-medium">Date:</span> {formatDate(viewInvoiceAlert[1].createdAt)}</p>
                                            <p><span className="font-medium">Due Date:</span> {formatDate(viewInvoiceAlert[1].dueDate)}</p>
                                            <p>
                                                <span className="font-medium">Status:</span>
                                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${viewInvoiceAlert[1].status === 'Paid'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                                    }`}>
                                                    {viewInvoiceAlert[1].status}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bill To Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                                            BILL TO
                                        </h3>
                                        <div className="space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                                            <p className="font-medium">{viewInvoiceAlert[1].customer?.fullName}</p>
                                            <p>{viewInvoiceAlert[1].customer?.address}</p>
                                            <p>Phone: {viewInvoiceAlert[1].customer?.contactNo}</p>
                                            <p>Email: {viewInvoiceAlert[1].customer?.email}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                                            MEMBERSHIP DETAILS
                                        </h3>
                                        <div className="space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                                            <p><span className="font-medium">Type:</span> {viewInvoiceAlert[1].customer?.membershipType}</p>
                                            <p><span className="font-medium">Duration:</span> {viewInvoiceAlert[1].customer?.membershipDuration}</p>
                                            <p><span className="font-medium">Start Date:</span> {formatDate(viewInvoiceAlert[1].customer?.membershipDate)}</p>
                                            <p><span className="font-medium">Expires:</span> {formatDate(viewInvoiceAlert[1].customer?.membershipExpireDate)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Items Table */}
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-gray-800 dark:bg-gray-900">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-bold text-white uppercase tracking-wider">
                                                    DESCRIPTION
                                                </th>
                                                <th className="px-4 py-2 text-center text-xs font-bold text-white uppercase tracking-wider">
                                                    QTY
                                                </th>
                                                <th className="px-4 py-2 text-right text-xs font-bold text-white uppercase tracking-wider">
                                                    UNIT PRICE
                                                </th>
                                                <th className="px-4 py-2 text-right text-xs font-bold text-white uppercase tracking-wider">
                                                    TOTAL
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {viewInvoiceAlert[1].items?.map((item, index) => (
                                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                    <td className="px-4 py-2">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {item.name || 'Service'}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-2 text-center text-sm text-gray-900 dark:text-white">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="px-4 py-2 text-right text-sm text-gray-900 dark:text-white">
                                                        {formatCurrency(item.price)}
                                                    </td>
                                                    <td className="px-4 py-2 text-right text-sm font-medium text-gray-900 dark:text-white">
                                                        {formatCurrency(item.price * item.quantity)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Summary Section */}
                                <div className="flex justify-end">
                                    <div className="w-full max-w-sm bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                                        <div className="flex justify-between items-center py-1 border-b border-gray-200 dark:border-gray-700">
                                            <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">Subtotal:</span>
                                            <span className="font-medium text-gray-900 dark:text-white text-sm">{formatCurrency(calculateSubtotal())}</span>
                                        </div>

                                        {viewInvoiceAlert[1].discount > 0 && (
                                            <div className="flex justify-between items-center py-1">
                                                <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                                                    Discount ({viewInvoiceAlert[1].customer?.discountReason}):
                                                </span>
                                                <span className="font-medium text-red-600 dark:text-red-400 text-sm">
                                                    -{formatCurrency(viewInvoiceAlert[1].discount)}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center py-2 border-t-2 border-gray-300 dark:border-gray-600">
                                            <span className="text-base font-bold text-gray-900 dark:text-white">TOTAL:</span>
                                            <span className="text-base font-bold text-blue-600 dark:text-blue-400">{formatCurrency(viewInvoiceAlert[1].grandTotal)}</span>
                                        </div>

                                        <div className="space-y-1 border-t border-gray-200 dark:border-gray-700">
                                            {viewInvoiceAlert[1].dueAmount > 0 && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">Amount Due:</span>
                                                    <span className="font-medium text-red-600 dark:text-red-400">{formatCurrency(viewInvoiceAlert[1].dueAmount)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Notes Section */}
                                {viewInvoiceAlert[1].note && (
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                                        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1 text-sm">Notes:</h4>
                                        <p className="text-yellow-700 dark:text-yellow-300 text-sm">{viewInvoiceAlert[1].note}</p>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">Business Information</h4>
                                            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                                {viewInvoiceAlert[1].organization?.billing?.panNo && (
                                                    <p>PAN No: {viewInvoiceAlert[1].organization.billing.panNo}</p>
                                                )}
                                                {viewInvoiceAlert[1].organization?.billing?.vatNo && (
                                                    <p>VAT No: {viewInvoiceAlert[1].organization.billing.vatNo}</p>
                                                )}
                                                {viewInvoiceAlert[1].organization?.billing?.taxId && (
                                                    <p>Tax ID: {viewInvoiceAlert[1].organization.billing.taxId}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Thank you for your business!
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                This is computer generated invoice no signature required.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white dark:bg-gray-700 p-4 flex justify-end gap-4 backdrop-blur-sm">
                            <AlertDialogFooter className="border-gray-200 dark:border-gray-700 pt-2">
                                <AlertDialogCancel
                                    onClick={() => setViewInvoiceAlert([false, null])}
                                    className="bg-gray-100 py-6 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                                >
                                    Close
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleGenerateInvoice}
                                    className="bg-blue-600 py-6 hover:bg-blue-700 text-white"
                                >
                                    <PiPrinterBold className="h-4 w-4" />
                                    Print Invoice
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
};

export default PaymentInvoice;
