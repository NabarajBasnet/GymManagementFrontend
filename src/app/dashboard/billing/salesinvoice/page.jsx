'use client';

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
} from "lucide-react";
import { FaFileInvoice } from "react-icons/fa6";
import { PiPrinterBold } from "react-icons/pi";
import { useRef, useEffect, useState } from 'react';
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
import Pagination from '@/components/ui/CustomPagination';
import { Plus, Search, Trash2, ArrowUpDown } from 'lucide-react';

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
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import toast from "react-hot-toast";
import Loader from "@/components/Loader/Loader";
import { useUser } from "@/components/Providers/LoggedInUserProvider";
import { useQuery, useQueryClient } from '@tanstack/react-query';

const PaymentInvoice = () => {

    const { user } = useUser();
    const loggedInUser = user ? user.user : null;

    const queryclient = useQueryClient();

    // Other states
    const [invoiceData, setInvoiceData] = useState(null);
    const [printInvoiceAlert, setPrintInvoiceAlert] = useState(false);

    // Pagination states
    let limit = 15;
    const [currentPage, setCurrentPage] = useState(1);

    // Search Query
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    // Sorting states
    const [sortBy, setSortBy] = useState('');
    const [sortOrderDesc, setSortOrderDesc] = useState(true);

    // Print Invoice
    const printInvoice = (invoiceData) => {
        const invoice = invoiceData.invoice;
        const printWindow = window.open('', '_blank', 'width=800,height=600');

        // Format date and currency
        const formatDate = (dateString) => {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('en-US', options);
        };

        const formatCurrency = (amount) => {
            return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        };

        // Calculate VAT amounts and totals
        const itemsWithVat = invoice.itemDetails.map(item => {
            const vatAmount = (item.total * item.selectedItem.taxRate) / 100;
            return {
                ...item,
                vatAmount: vatAmount,
                totalWithVat: item.total + vatAmount
            };
        });

        const totalVatAmount = itemsWithVat.reduce((sum, item) => sum + item.vatAmount, 0);
        const calculatedGrandTotal = invoice.subTotal + totalVatAmount;

        // HTML template for the invoice
        const invoiceHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${invoice.billNo}</title>
    <style>
        :root {
            --primary: #3a4f7a;
            --primary-light: #4f709c;
            --accent: #ff7b54;
            --text: #2d3748;
            --text-light: #718096;
            --border: #e2e8f0;
            --success: #38a169;
            --bg: #f8fafc;
            --header-bg: #ffffff;
            --footer-bg: #f1f5f9;
            --table-header: #3a4f7a;
            --table-row: #f8fafc;
            --table-alt-row: #ffffff;
        }
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: var(--text);
            background-color: white;
            padding: 0;
            margin: 0;
            font-size: 14px;
        }
        
        .print-button-container {
            position: sticky;
            top: 0;
            background-color: var(--header-bg);
            text-align: center;
            padding: 10px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            z-index: 100;
        }
        
        .print-button {
            background-color: var(--primary);
            color: white;
            border: none;
            padding: 10px 24px;
            font-size: 14px;
            font-weight: 600;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .print-button:hover {
            background-color: var(--primary-light);
            transform: translateY(-1px);
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .invoice-container {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 0;
            background-color: white;
            display: flex;
            flex-direction: column;
            position: relative;
            box-shadow: 0 0 20px rgba(0,0,0,0.05);
        }
        
        .invoice-header {
            padding: 24px 40px;
            background-color: var(--header-bg);
            border-bottom: 1px solid var(--border);
        }
        
        .invoice-title {
            font-size: 28px;
            color: var(--primary);
            margin-bottom: 8px;
            font-weight: 700;
            letter-spacing: -0.5px;
            text-align: center;
        }
        
        .company-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
        }
        
        .company-brand {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        
        .company-logo {
            width: 60px;
            height: 60px;
            background-color: var(--primary);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            font-weight: bold;
            font-size: 24px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .company-info {
            display: flex;
            flex-direction: column;
        }
        
        .company-name {
            font-size: 20px;
            font-weight: 700;
            color: var(--primary);
            margin-bottom: 4px;
        }
        
        .company-meta {
            font-size: 13px;
            color: var(--text-light);
        }
        
        .invoice-meta {
            text-align: right;
        }
        
        .invoice-number {
            font-size: 18px;
            font-weight: 600;
            color: var(--text);
            margin-bottom: 6px;
        }
        
        .invoice-date {
            color: var(--text-light);
            font-size: 14px;
        }
        
        .company-details {
            display: flex;
            justify-content: space-between;
            padding: 24px 40px;
            border-bottom: 1px solid var(--border);
            background-color: var(--bg);
        }
        
        .detail-box {
            flex: 1;
            padding: 0 10px;
        }
        
        .detail-title {
            font-weight: 600;
            margin-bottom: 12px;
            color: var(--primary);
            font-size: 16px;
            padding-bottom: 6px;
            border-bottom: 2px solid var(--primary);
        }
        
        .detail-row {
            display: flex;
            margin-bottom: 8px;
            font-size: 14px;
        }
        
        .detail-label {
            color: var(--text-light);
            min-width: 120px;
        }
        
        .detail-value {
            font-weight: 500;
        }
        
        .invoice-content {
            padding: 24px 40px;
            flex: 1;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 24px 0 32px;
            font-size: 14px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            border-radius: 8px;
            overflow: hidden;
        }
        
        .items-table th {
            background-color: var(--table-header);
            color: white;
            text-align: left;
            padding: 12px 16px;
            font-weight: 600;
        }
        
        .items-table td {
            padding: 14px 16px;
            border-bottom: 1px solid var(--border);
            vertical-align: top;
        }
        
        .items-table tr:last-child td {
            border-bottom: none;
        }
        
        .items-table tr:nth-child(odd) {
            background-color: var(--table-row);
        }
        
        .items-table tr:nth-child(even) {
            background-color: var(--table-alt-row);
        }
        
        .text-right {
            text-align: right;
        }
        
        .text-center {
            text-align: center;
        }
        
        .item-name {
            font-weight: 500;
        }
        
        .item-description {
            color: var(--text-light);
            font-size: 13px;
            margin-top: 6px;
            line-height: 1.4;
        }
        
        .summary-section {
            margin-top: 24px;
            width: 100%;
            display: flex;
            justify-content: flex-end;
        }
        
        .summary-table {
            width: 320px;
            border-collapse: collapse;
            font-size: 14px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            border-radius: 8px;
            overflow: hidden;
        }
        
        .summary-table td {
            padding: 12px 16px;
            border-bottom: 1px solid var(--border);
        }
        
        .summary-table .label {
            font-weight: 600;
            color: var(--text);
            background-color: var(--bg);
        }
        
        .summary-table .total-row {
            font-weight: 700;
            font-size: 15px;
            color: var(--primary);
            background-color: var(--bg);
        }
        
        .notes-section {
            margin-top: 32px;
            padding: 20px;
            background-color: var(--bg);
            border-radius: 8px;
            font-size: 14px;
            border-left: 4px solid var(--accent);
        }
        
        .notes-title {
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--primary);
            font-size: 15px;
        }
        
        .invoice-footer {
            padding: 24px 40px;
            background-color: var(--footer-bg);
            border-top: 1px solid var(--border);
            margin-top: auto;
        }
        
        .thank-you {
            text-align: center;
            margin-bottom: 16px;
            font-size: 15px;
            color: var(--primary);
            font-weight: 600;
        }
        
        .footer-meta {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
            color: var(--text-light);
        }
        
        .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 48px;
            padding-top: 24px;
            border-top: 1px solid var(--border);
        }
        
        .signature-box {
            width: 200px;
            text-align: center;
        }
        
        .signature-line {
            border-top: 1px solid var(--border);
            margin: 20px auto;
            width: 80%;
            padding-top: 12px;
        }
        
        .signature-label {
            font-size: 13px;
            color: var(--text-light);
            font-weight: 500;
        }
        
        .payment-status {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 13px;
            background-color: var(--success);
            color: white;
            margin-top: 12px;
        }
        
        @media print {
            @page {
                size: A4;
                margin: 0;
            }
            
            body {
                padding: 0;
                margin: 0;
            }
            
            .print-button-container {
                display: none;
            }
            
            .invoice-container {
                box-shadow: none;
                border: none;
                margin: 0;
                padding: 0;
                width: 210mm;
                min-height: 297mm;
            }
        }
    </style>
</head>
<body>
    <div class="print-button-container no-print">
        <button class="print-button" onclick="window.print()">
            Print Invoice
        </button>
    </div>
    
    <div class="invoice-container">
        <header class="invoice-header">
            <h1 class="invoice-title">TAX INVOICE</h1>
            <div class="company-header">
                <div class="company-brand">
                    <div class="company-logo">${invoice.company.name.charAt(0)}</div>
                    <div class="company-info">
                        <div class="company-name">${invoice.company.name}</div>
                        <div class="company-meta">PAN: ${invoice.company.pan} | VAT No: ${invoice.company.irdNo}</div>
                    </div>
                </div>
                <div class="invoice-meta">
                    <div class="invoice-number">Invoice #${invoice.billNo}</div>
                    <div class="invoice-date">Date: ${formatDate(invoice.billDate)}</div>
                    <div class="payment-status">PAID</div>
                </div>
            </div>
        </header>
        
        <div class="company-details">
            <div class="detail-box">
                <div class="detail-title">From</div>
                <div class="detail-row">
                    <span class="detail-label">Company:</span>
                    <span class="detail-value">${invoice.company.name}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Code:</span>
                    <span class="detail-value">${invoice.company.code}</span>
                </div>
            </div>
            <div class="detail-box">
                <div class="detail-title">Bill To</div>
                <div class="detail-row">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">${invoice.issuedTo.fullName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Contact:</span>
                    <span class="detail-value">${invoice.issuedTo.contactNo}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${invoice.issuedTo.email}</span>
                </div>
            </div>
        </div>
        
        <main class="invoice-content">
            <table class="items-table">
                <thead>
                    <tr>
                        <th width="5%">S.N.</th>
                        <th width="40%">Item Description</th>
                        <th width="10%">Qty</th>
                        <th width="12%">Unit Price</th>
                        <th width="12%">Discount</th>
                        <th width="10%">VAT %</th>
                        <th width="11%">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsWithVat.map((item, index) => `
                    <tr>
                        <td class="text-center">${index + 1}</td>
                        <td>
                            <div class="item-name">${item.selectedItem.itemName}</div>
                        </td>
                        <td class="text-center">${item.quantity}</td>
                        <td class="text-right">${formatCurrency(item.price)}</td>
                        <td class="text-right">${formatCurrency(item.discount)}</td>
                        <td class="text-center">${item.selectedItem.taxRate}%</td>
                        <td class="text-right">${formatCurrency(item.totalWithVat)}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="summary-section">
                <table class="summary-table">
                    <tr>
                        <td class="label">Subtotal:</td>
                        <td class="text-right">${formatCurrency(invoice.subTotal)}</td>
                    </tr>
                    <tr>
                        <td class="label">Total Discount:</td>
                        <td class="text-right">-${invoice.totalDiscount}</td>
                    </tr>
                    <tr>
                        <td class="label">VAT Amount:</td>
                        <td class="text-right">${formatCurrency(totalVatAmount)}</td>
                    </tr>
                    <tr class="total-row">
                        <td class="label">Grand Total:</td>
                        <td class="text-right">${formatCurrency(calculatedGrandTotal - invoice.totalDiscount)}</td>
                    </tr>
                </table>
            </div>
            
            ${invoice.additionalNotes || invoice.footerNote ? `
            <div class="notes-section">
                <div class="notes-title"></div>
                <p>${invoice.footerNote}</p>
            </div>
            ` : ''}
        </main>
        
        <footer class="invoice-footer">
            <div class="thank-you">Thank you for your business!</div>
            <div class="footer-meta">
                <div>Generated on ${formatDate(invoice.createdAt)}</div>
                <div>This is computer generated invoice no signature required.</div>
            </div>
        </footer>
    </div>
</body>
</html>
`;

        // Write the HTML to the new window
        printWindow.document.open();
        printWindow.document.write(invoiceHTML);
        printWindow.document.close();
    };

    // Get all services and products from server
    const getAllInvoices = async ({ queryKey }) => {
        const [, page, searchQuery, sortBy, sortOrderDesc] = queryKey;
        try {
            const response = await fetch(`http://localhost:3000/api/invoice/v2?page=${page}&limit=${limit}&searchQuery=${searchQuery}&sortBy=${sortBy}&sortOrderDesc=${sortOrderDesc}`);
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
    const getSingleSalesInvoice = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/accounting/invoicemanagement/${id}`);
            const responseBody = await response.json();

            if (response.ok && response.status === 200) {
                toast.success(responseBody.message || '');
                setInvoiceData(responseBody);
                printInvoice(responseBody);
            };
        } catch (error) {
            console.log("Error: ", error)
        };
    };

    const deleteSalesInvoice = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/accounting/invoicemanagement/${id}`, {
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

    return (
        <div className="w-full py-6 bg-gray-100 px-4 dark:bg-gray-900 bg-gray-100 min-h-screen mx-auto">
            {/* Breadcrumb Navigation */}
            <div className="p-4 rounded-md dark:bg-gray-800 bg-white shadow-sm">
                {/* Enhanced Breadcrumb with Icons */}
                <div className="mb-4">
                    <Breadcrumb>
                        <BreadcrumbList className="flex items-center">
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    href="/"
                                    className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-primary transition-colors"
                                >
                                    <Home className="h-4 w-4 mr-2" />
                                    Home
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="mx-2 text-gray-300" />
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    href="/dashboard"
                                    className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-primary transition-colors"
                                >
                                    <LayoutDashboard className="h-4 w-4 mr-2" />
                                    <span>
                                        Dashboard
                                    </span>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="mx-2 text-gray-300" />
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    href="/dashboard/billing"
                                    className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-primary transition-colors"
                                >
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    <span>Billing</span>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="mx-2 text-gray-300" />
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    href="/dashboard/billing"
                                    className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-primary transition-colors"
                                >
                                    <FileText className="h-4 w-4 mr-2" />
                                    <span>Billing</span>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Modern Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex items-center">
                        <FaFileInvoice className="h-6 w-6 mr-3 text-primary" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 text-primary">Sales Invoices</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                                Manage and track all your invoices
                            </p>
                        </div>
                    </div>

                    <div className="w-full md:w-auto flex flex-col-reverse md:flex-row gap-3 items-end">
                        {/* Enhanced Search with Floating Label */}
                        <div className="relative flex-1 min-w-[280px]">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search here..."
                                className="pl-10 pr-4 py-6 h-12 bg-white dark:bg-gray-900 dark:border-none rounded-sm focus-visible:ring-primary"
                            />
                        </div>

                        {/* Premium Button with Transition */}
                        <Button
                            onClick={() => setOpenInvoiceForm(true)}
                            className="h-12 px-6 rounded-sm bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md transition-all duration-300 hover:shadow-lg"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            <span className="font-semibold">New Invoice</span>
                        </Button>
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
                        <AlertDialogAction onClick={() => printInvoice(invoiceData)}>Print</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Content Area */}
            <div className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm my-6">
                {/* Table Section */}
                <div className="w-full">
                    {Array.isArray(invoices) && invoices?.length > 0 ? (
                        <div className="w-full">
                            <div className="overflow-x-auto">
                                {isLoading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <Loader className="h-8 w-8 text-primary animate-spin" />
                                    </div>
                                ) : (
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                                {[
                                                    { id: 'invoiceNo', label: 'Invoice No' },
                                                    { id: 'customerName', label: 'Customer' },
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
                                                                            onClick={() => getSingleSalesInvoice(invoice._id)}
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
                                                                        <TooltipContent>Delete Invoice</TooltipContent>
                                                                    </Tooltip>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                This will permanently delete invoice #{invoice.invoiceNo}. This action cannot be undone.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() => deleteSalesInvoice(invoice._id)}
                                                                                className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-500"
                                                                            >
                                                                                Delete Invoice
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
                                <Button
                                    onClick={() => setOpenInvoiceForm(true)}
                                    className="px-6"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Invoice
                                </Button>
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
        </div>
    );
};

export default PaymentInvoice;
