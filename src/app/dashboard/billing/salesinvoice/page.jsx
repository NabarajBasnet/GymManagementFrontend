'use client';

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
import { useForm, Controller } from "react-hook-form";
import Pagination from '@/components/ui/CustomPagination';
import { Plus, Search, Trash2, Save, X, ArrowUpDown } from 'lucide-react';

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
        <div className="w-full py-6 bg-gray-100 px-4  min-h-screen mx-auto">
            {/* Breadcrumb Navigation */}
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                {/* Enhanced Breadcrumb with Icons */}
                <div className="mb-6">
                    <Breadcrumb>
                        <BreadcrumbList className="flex items-center">
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    href="/"
                                    className="flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors"
                                >
                                    <Home className="h-4 w-4 mr-2" />
                                    Home
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="mx-2 text-gray-300" />
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    href="/dashboard"
                                    className="flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors"
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
                                    className="flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors"
                                >
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    <span>Billing</span>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="mx-2 text-gray-300" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="flex items-center text-sm font-medium text-primary">
                                    <FileText className="h-4 w-4 mr-2" />
                                    <span>Payment Invoice</span>
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Modern Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex items-center">
                        <FaFileInvoice className="h-6 w-6 mr-3" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Sales Invoices</h1>
                            <p className="text-sm text-gray-500 mt-1">
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
                                placeholder=" "
                                className="pl-10 pr-4 py-6 h-12 rounded-lg border-gray-200 focus-visible:ring-primary peer"
                            />
                            <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-10 peer-focus:left-10 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">
                                Search invoices...
                            </label>
                        </div>

                        {/* Premium Button with Transition */}
                        <Button
                            onClick={() => setOpenInvoiceForm(true)}
                            className="h-12 px-6 rounded-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md transition-all duration-300 hover:shadow-lg"
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
            <div className="w-full bg-white rounded-md my-4 shadow-md border border-gray-200">
                {/* Table Section */}
                <div className="w-full">
                    {Array.isArray(invoices) && invoices?.length > 0 ? (
                        <div className="w-full">
                            <div className="overflow-x-auto">
                                {isLoading ? (
                                    <Loader />
                                ) : (
                                    <table className="text-sm w-full">
                                        <thead>
                                            <tr className="border-b bg-muted/50">
                                                <th className="h-16 px-4 text-left font-medium">
                                                    <div className="flex text-sm font-semibold items-center">
                                                        Invoice No
                                                        <ArrowUpDown
                                                            onClick={() => {
                                                                setSortBy('invoiceNo');
                                                                setSortOrderDesc(!sortOrderDesc);
                                                            }}
                                                            className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                                    </div>
                                                </th>
                                                <th className="h-16 px-4 text-left font-medium">
                                                    <div className="flex text-sm font-semibold items-center">
                                                        Customer Name
                                                        <ArrowUpDown
                                                            onClick={() => {
                                                                setSortBy('customerName');
                                                                setSortOrderDesc(!sortOrderDesc);
                                                            }}
                                                            className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                                    </div>
                                                </th>
                                                <th className="h-10 px-4 text-left font-medium">
                                                    <div className="flex text-sm font-semibold items-center">
                                                        Due Date
                                                        <ArrowUpDown
                                                            onClick={() => {
                                                                setSortBy('dueDate');
                                                                setSortOrderDesc(!sortOrderDesc);
                                                            }}
                                                            className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                                    </div>
                                                </th>
                                                <th className="h-10 px-4 text-right font-medium">
                                                    <div className="flex text-sm font-semibold items-center">
                                                        Amount
                                                        <ArrowUpDown
                                                            onClick={() => {
                                                                setSortBy('amount');
                                                                setSortOrderDesc(!sortOrderDesc);
                                                            }}
                                                            className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                                    </div>
                                                </th>
                                                <th className="h-10 px-4 text-right font-medium">
                                                    <div className="flex text-sm font-semibold items-center">
                                                        Paid
                                                        <ArrowUpDown
                                                            onClick={() => {
                                                                setSortBy('paidAmount');
                                                                setSortOrderDesc(!sortOrderDesc);
                                                            }}
                                                            className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                                    </div>
                                                </th>
                                                <th className="h-10 px-4 text-right font-medium">
                                                    <div className="flex text-sm font-semibold items-center">
                                                        Amount Due
                                                        <ArrowUpDown
                                                            onClick={() => {
                                                                setSortBy('dueAmount');
                                                                setSortOrderDesc(!sortOrderDesc);
                                                            }}
                                                            className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                                    </div>
                                                </th>
                                                <th className="h-10 px-4 text-left font-medium">
                                                    <div className="flex text-sm font-semibold items-center">
                                                        Status
                                                        <ArrowUpDown
                                                            onClick={() => {
                                                                setSortBy('status');
                                                                setSortOrderDesc(!sortOrderDesc);
                                                            }}
                                                            className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                                    </div>
                                                </th>
                                                {loggedInUser?.role !== 'Gym Admin' && (
                                                    <th className="h-10 px-4 text-right text-sm font-semibold font-medium">Actions</th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoices?.map((invoice) => (
                                                <tr key={invoice._id} className="border-b text-sm hover:bg-muted/50">
                                                    <td className="p-3 align-middle font-medium">{invoice?.invoiceNo || 'N/A'}</td>
                                                    <td className="p-3 align-middle">{invoice?.customer?.fullName || 'N/A'}</td>
                                                    <td className="p-3 align-middle text-center">{new Date(invoice?.dueDate).toISOString().split('T')[0] || 'N/A'}</td>
                                                    <td className="p-3 align-middle text-center"> {invoice?.organization?.currency} {invoice?.amount || 0}</td>
                                                    <td className="p-3 align-middle text-center">{invoice?.organization?.currency} {invoice?.paidAmount || 0}</td>
                                                    <td className="p-3 align-middle text-center">{invoice?.organization?.currency} {invoice?.dueAmount || 0}</td>
                                                    <td className="p-3 align-middle text-start">{getInvoiceStatusBadge(invoice?.status)}</td>
                                                    {loggedInUser?.role !== 'Gym Admin' && (
                                                        <td className="flex items-center p-4 align-middle justify-end">
                                                            <PiPrinterBold
                                                                onClick={() => getSingleSalesInvoice(invoice._id)}
                                                                className="h-4 w-4 cursor-pointer hover:text-blue-600"
                                                            />
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        className="hover:bg-transparent hover:text-red-600 text-gray-800"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            This action cannot be undone. This will permanently delete this receipt.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction onClick={() => deleteSalesInvoice(invoice._id)}>Continue</AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
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
                        <div className="overflow-x-auto min-h-screen flex">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="h-16 px-4 text-left font-medium">
                                            <div className="flex text-sm font-semibold items-center">
                                                Bill No
                                                <ArrowUpDown
                                                    onClick={() => {
                                                        setSortBy('billNo');
                                                        setSortOrderDesc(!sortOrderDesc);
                                                    }}
                                                    className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                            </div>
                                        </th>
                                        <th className="h-16 px-4 text-left font-medium">
                                            <div className="flex text-sm font-semibold items-center">
                                                Bill Date
                                                <ArrowUpDown
                                                    onClick={() => {
                                                        setSortBy('billDate');
                                                        setSortOrderDesc(!sortOrderDesc);
                                                    }}
                                                    className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                            </div>
                                        </th>
                                        <th className="h-10 px-4 text-left font-medium">
                                            <div className="flex text-sm font-semibold items-center">
                                                Method
                                                <ArrowUpDown
                                                    onClick={() => {
                                                        setSortBy('paymentMethod');
                                                        setSortOrderDesc(!sortOrderDesc);
                                                    }}
                                                    className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                            </div>
                                        </th>
                                        <th className="h-10 px-4 text-right font-medium">
                                            <div className="flex text-sm font-semibold items-center">
                                                Discount
                                                <ArrowUpDown
                                                    onClick={() => {
                                                        setSortBy('totalGivenDiscountAmount');
                                                        setSortOrderDesc(!sortOrderDesc);
                                                    }}
                                                    className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                            </div>
                                        </th>
                                        <th className="h-10 px-4 text-right font-medium">
                                            <div className="flex text-sm font-semibold items-center">
                                                Discount %
                                                <ArrowUpDown
                                                    onClick={() => {
                                                        setSortBy('totalDiscountPercentage');
                                                        setSortOrderDesc(!sortOrderDesc);
                                                    }}
                                                    className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                            </div>
                                        </th>
                                        <th className="h-10 px-4 text-right font-medium">
                                            <div className="flex text-sm font-semibold items-center">
                                                Grand Total
                                                <ArrowUpDown
                                                    onClick={() => {
                                                        setSortBy('grandTotal');
                                                        setSortOrderDesc(!sortOrderDesc);
                                                    }}
                                                    className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                            </div>
                                        </th>
                                        <th className="h-10 px-4 text-left font-medium">
                                            <div className="flex text-sm font-semibold items-center">
                                                Fiscal Year
                                                <ArrowUpDown
                                                    onClick={() => {
                                                        setSortBy('fiscalYear');
                                                        setSortOrderDesc(!sortOrderDesc);
                                                    }}
                                                    className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                            </div>
                                        </th>
                                        {loggedInUser?.role !== 'Gym Admin' && (
                                            <th className="h-10 px-4 text-right text-sm font-semibold font-medium">Actions</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan={loggedInUser?.role === 'Gym Admin' ? 9 : 10} className="text-center py-6 text-sm text-muted-foreground">
                                            <h3 className="text-lg font-medium text-gray-700 mb-1">No payment invoices yet</h3>
                                            <p className="text-gray-500 mb-4 text-xs font-semibold w-full text-center align-center">Create your first payment receipt to get started</p>
                                            <Button
                                                onClick={() => setOpenInvoiceForm(true)}
                                                className="px-6">
                                                <Plus className="h-4 w-4 mr-2" />
                                                New Invoice
                                            </Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="flex items-center justify-between border-t px-4 py-4">
                        <div className="text-sm text-muted-foreground">
                            Showing <strong>{invoices?.length}</strong> of <strong>{invoices?.length}</strong> receipts
                        </div>
                        <div className="flex items-center space-x-2">
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
                </div>
            </div>
        </div>
    );
};

export default PaymentInvoice;
