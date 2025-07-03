'use client';

import { LuFileSearch2 } from "react-icons/lu";
import {
    Home,
    LayoutDashboard,
    CreditCard,
    FileText,
} from "lucide-react";
import { FaFileInvoice } from "react-icons/fa6";
import { PiPrinterBold } from "react-icons/pi";
import { FiSearch } from "react-icons/fi";
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
import { BiLoaderAlt } from "react-icons/bi";
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
import { toast } from "sonner";
import Loader from "@/components/Loader/Loader";
import { useUser } from "@/components/Providers/LoggedInUserProvider";
import { useQuery, useQueryClient } from '@tanstack/react-query';

const PaymentReceipts = () => {
    const { user } = useUser();
    const loggedInUser = user ? user.user : null;

    const queryclient = useQueryClient();
    const [assignedStaffName, setAssignedStaffName] = useState('');
    const [assignedMemberName, setAssignedMemberName] = useState('');

    // Member search states
    const [memberName, setMemberName] = useState('');

    // Other states
    const [receiptData, setReceiptData] = useState(null);
    const [printReceiptAlert, setPrintReceiptAlert] = useState(false);

    // Pagination states
    let limit = 10;
    const [currentPage, setCurrentPage] = useState(1);

    // Search Query
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    // Sorting states
    const [sortBy, setSortBy] = useState('');
    const [sortOrderDesc, setSortOrderDesc] = useState(true);

    const printReceipt = (receiptData) => {
        // Create a new window
        const printWindow = window.open('', '_blank', 'width=800,height=600');

        // HTML template for the receipt
        const receiptHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Receipt ${receiptData.paymentReceiptNo}</title>
            <style>
                :root {
                    --primary-color: #1e3a8a;
                    --secondary-color: #3b82f6;
                    --text-color: #1f2937;
                    --light-text: #6b7280;
                    --border-color: #e5e7eb;
                    --success-color: #10b981;
                }
                
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
                
                body {
                    font-family: 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.5;
                    color: var(--text-color);
                    background-color: white;
                    padding: 0;
                    margin: 0;
                    font-size: 14px;
                }
                
                .print-button-container {
                    position: sticky;
                    top: 0;
                    background-color: #fff;
                    text-align: center;
                    padding: 10px 0;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    z-index: 100;
                }
                
                .print-button {
                    background-color: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 8px 20px;
                    font-size: 14px;
                    font-weight: 600;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .print-button:hover {
                    background-color: var(--secondary-color);
                }
                
                .receipt-container {
                    width: 210mm;
                    min-height: 297mm;
                    margin: 0 auto;
                    padding: 10mm;
                    background-color: white;
                }
                
                .receipt-header {
                    text-align: center;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid var(--primary-color);
                }
                
                .receipt-header h1 {
                    font-size: 24px;
                    color: var(--primary-color);
                    margin-bottom: 5px;
                    font-weight: 600;
                }
                
                .company-details {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid var(--border-color);
                }
                
                .company-info {
                    text-align: right;
                }
                
                .company-info p {
                    margin: 3px 0;
                    font-size: 13px;
                }
                
                .receipt-content {
                    margin-top: 10px;
                }
                
                .receipt-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 15px;
                }
                
                .receipt-section {
                    margin-bottom: 15px;
                }
                
                .section-title {
                    font-size: 15px;
                    font-weight: 600;
                    color: var(--primary-color);
                    margin-bottom: 8px;
                    padding-bottom: 3px;
                    border-bottom: 1px solid var(--border-color);
                }
                
                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                    font-size: 13px;
                }
                
                .detail-label {
                    color: var(--light-text);
                }
                
                .detail-value {
                    font-weight: 500;
                }
                
                .payment-summary {
                    margin-top: 20px;
                    margin-bottom: 20px;
                }
                
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 6px 0;
                    border-bottom: 1px solid var(--border-color);
                    font-size: 13px;
                }
                
                .total-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    margin-top: 8px;
                    font-weight: 600;
                    font-size: 14px;
                }
                
                .payment-status {
                    display: inline-block;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-weight: 600;
                    font-size: 13px;
                    margin-bottom: 15px;
                    background-color: #f0f0f0;
                }
                
                .payment-status.paid {
                    background-color: #e6f7ee;
                    color: var(--success-color);
                }
                
                .notes-section {
                    margin-top: 15px;
                    padding: 10px;
                    background-color: #f9f9f9;
                    border-radius: 4px;
                    font-size: 13px;
                }
                
                .thank-you-message {
                    margin-top: 20px;
                    text-align: center;
                    padding: 15px;
                    font-size: 13px;
                }
                
                .receipt-footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 10px;
                    border-top: 1px solid var(--border-color);
                    font-size: 12px;
                    color: var(--light-text);
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
                    
                    .receipt-container {
                        box-shadow: none;
                        border: none;
                        margin: 0;
                        padding: 10mm;
                        width: 210mm;
                        min-height: 297mm;
                    }
                }
            </style>
        </head>
        <body>
            <div class="print-button-container no-print">
                <button class="print-button" onclick="window.print()">
                    Print Receipt
                </button>
            </div>
            
            <div class="receipt-container">
                <div class="receipt-header">
                    <h1>PAYMENT RECEIPT</h1>
                    <div class="payment-status ${receiptData.paymentStatus.toLowerCase() === 'paid' ? 'paid' : ''}">
                       Payment Status: ${receiptData.paymentStatus}
                    </div>
                </div>
                
                <div class="company-details">
                    <div>
                        <p><strong>${loggedInUser?.firstName || ''} ${loggedInUser?.lastName || ''}</strong></p>
                        <p>${loggedInUser?.address || '123 Business Address'}</p>
                        <p>${loggedInUser?.city || 'City'}, ${loggedInUser?.country || 'Country'}</p>
                    </div>
                    <div class="company-info">
                        <p>Email: ${loggedInUser?.email || 'email@example.com'}</p>
                        <p>Phone: ${loggedInUser?.phoneNumber || '+1 234 567 890'}</p>
                        <p>Receipt: ${receiptData.paymentReceiptNo}</p>
                    </div>
                </div>
                
                <div class="receipt-content">
                    <div class="receipt-grid">
                        <div class="receipt-section">
                            <div class="section-title">Payment Details</div>
                            <div class="detail-row">
                                <span class="detail-label">Date:</span>
                                <span class="detail-value">${new Date(receiptData.paymentDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Time:</span>
                                <span class="detail-value">${new Date(receiptData.paymentDate).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Reference No:</span>
                                <span class="detail-value">${receiptData.referenceNo || 'N/A'}</span>
                            </div>
                        </div>
                        
                        <div class="receipt-section">
                            <div class="section-title">Customer Details</div>
                            <div class="detail-row">
                                <span class="detail-label">Customer Name:</span>
                                <span class="detail-value">${assignedMemberName}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Issued By:</span>
                                <span class="detail-value">${assignedStaffName}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Payment Method:</span>
                                <span class="detail-value">${receiptData.paymentMethod}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="payment-summary">
                        <div class="section-title">Payment Summary</div>
                        <div class="summary-row">
                            <span>Total Amount:</span>
                            <span>$${receiptData.totalAmount}</span>
                        </div>
                        <div class="summary-row">
                            <span>Discount:</span>
                            <span>$${receiptData.discountAmount}</span>
                        </div>
                        <div class="summary-row">
                            <span>Amount Received:</span>
                            <span>$${receiptData.receivedAmount}</span>
                        </div>
                        <div class="total-row">
                            <span>Due Amount:</span>
                            <span>$${receiptData.dueAmount}</span>
                        </div>
                    </div>
                    
                    ${receiptData.notes ? `
                    <div class="notes-section">
                        <div class="section-title">Notes</div>
                        <p>${receiptData.notes}</p>
                    </div>
                    ` : ''}
                    
                    <div class="thank-you-message">
                        <h3>Thank You for Your Business, #${memberName}!</h3>
                        <p>We greatly appreciate your trust in our services. Your support enables us to continue providing the quality service you deserve.</p>
                        <p>Should you have any questions about this receipt or our services, please don't hesitate to contact us.</p>
                        <p>We look forward to serving you again in the future!</p>
                    </div>

                    <div class="thank-you-message">
                        <p>Thank you for your business. Please retain this receipt for your records.</p>
                    </div>
                </div>
                
                <div class="receipt-footer">
                    <p>This is an electronically generated receipt and does not require a signature.</p>
                    <p>Generated on ${new Date(receiptData.createdAt).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}</p>
                </div>
            </div>
        </body>
        </html>
        `;

        // Write the HTML to the new window
        printWindow.document.open();
        printWindow.document.write(receiptHTML);
        printWindow.document.close();
    };

    // Get all services and products from server
    const getAllPaymentReceipts = async ({ queryKey }) => {
        const [, page, searchQuery, sortBy, sortOrderDesc] = queryKey;
        try {
            const response = await fetch(`http://localhost:3000/api/receipt/v2/?page=${page}&limit=${limit}&searchQuery=${searchQuery}&sortBy=${sortBy}&sortOrderDesc=${sortOrderDesc}`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const { data, isLoading } = useQuery({
        queryFn: getAllPaymentReceipts,
        queryKey: ['paymentreceipts', currentPage, debouncedSearchQuery, sortBy, sortOrderDesc],
    });

    const { receipts, totalPages, totalReceipts } = data || {};

    // Debounce
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Get Single Receipt Details
    const getSingleReceiptDetails = async (details) => {
        console.log("Details: ", details)
        printReceipt(details);
        try {
            const response = await fetch(`http://localhost:3000/api/accounting/paymentreceipts/${id}`);
            const responseBody = await response.json();
            if (response.ok && response.status === 200) {
                toast.success(responseBody.message || '');
                setAssignedMemberName(responseBody.paymentReceipt.customer.fullName || '');
                setAssignedStaffName(responseBody.paymentReceipt.issuedBy.fullName || '');
                printReceipt(responseBody.paymentReceipt);
            }
        } catch (error) {
            console.log("Error: ", error)
        };
    };

    const deleteReceipt = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/receipt/V2/${id}`, {
                method: "DELETE",
            });
            const responseBody = await response.json();
            if (response.ok) {
                toast.success(responseBody.message || '');
                queryclient.invalidateQueries(['paymentreceipts']);
            } else {
                toast.error(responseBody.message || '');
            }
        } catch (error) {
            console.log("Error: ", error)
        };
    }

    return (
        <div className="w-full py-7 bg-gray-100 dark:bg-gray-900 min-h-screen px-4 mx-auto">
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
                                    href="/dashboard/billing/receipts"
                                    className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-primary transition-colors"
                                >
                                    <FileText className="h-4 w-4 mr-2" />
                                    <span>Receipts</span>
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
                            <h1 className="text-2xl font-bold text-gray-800 text-primary">Payment Receipts</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                                Manage and track all your receipts
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
                            disabled
                            className="h-12 px-6 rounded-sm bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md transition-all duration-300 hover:shadow-lg"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            <span className="font-semibold">New Receipt</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Print alert dialog */}
            <AlertDialog open={printReceiptAlert} onOpenChange={setPrintReceiptAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Print Receipt?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Would you like to print the receipt now?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPrintReceiptAlert(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => printReceipt(receiptData)}>Print</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Content Area */}
            <div className="w-full my-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Table Section */}
                <div className="w-full">
                    {Array.isArray(receipts) && receipts?.length > 0 ? (
                        <div className="w-full">
                            {/* Table Header with gradient */}
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Receipts</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Total: {totalReceipts || 0} receipts
                                </p>
                            </div>

                            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader />
                                    </div>
                                ) : (
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                            <tr>
                                                <th className="px-4 py-4 text-left">
                                                    <div className="flex items-center space-x-2 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                                        <span>Receipt No</span>
                                                        <ArrowUpDown
                                                            onClick={() => {
                                                                setSortBy('receiptNo');
                                                                setSortOrderDesc(!sortOrderDesc);
                                                            }}
                                                            className="h-4 w-4 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                                        />
                                                    </div>
                                                </th>
                                                <th className="px-4 py-4 text-left">
                                                    <div className="flex items-center space-x-2 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                                        <span>Created Date</span>
                                                        <ArrowUpDown
                                                            onClick={() => {
                                                                setSortBy('createdAt');
                                                                setSortOrderDesc(!sortOrderDesc);
                                                            }}
                                                            className="h-4 w-4 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                                        />
                                                    </div>
                                                </th>
                                                <th className="px-4 py-4 text-left">
                                                    <div className="flex items-center space-x-2 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                                        <span>Membership Plan</span>
                                                        <ArrowUpDown
                                                            onClick={() => {
                                                                setSortBy('itemId.planName');
                                                                setSortOrderDesc(!sortOrderDesc);
                                                            }}
                                                            className="h-4 w-4 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                                        />
                                                    </div>
                                                </th>
                                                <th className="px-4 py-4 text-right">
                                                    <div className="flex items-center justify-end space-x-2 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                                        <span>Received</span>
                                                        <ArrowUpDown
                                                            onClick={() => {
                                                                setSortBy('receivedAmount');
                                                                setSortOrderDesc(!sortOrderDesc);
                                                            }}
                                                            className="h-4 w-4 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                                        />
                                                    </div>
                                                </th>
                                                <th className="px-4 py-4 text-right">
                                                    <div className="flex items-center justify-end space-x-2 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                                        <span>Due</span>
                                                        <ArrowUpDown
                                                            onClick={() => {
                                                                setSortBy('dueAmount');
                                                                setSortOrderDesc(!sortOrderDesc);
                                                            }}
                                                            className="h-4 w-4 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                                        />
                                                    </div>
                                                </th>
                                                <th className="px-4 py-4 text-right">
                                                    <div className="flex items-center justify-end space-x-2 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                                        <span>Total</span>
                                                        <ArrowUpDown
                                                            onClick={() => {
                                                                setSortBy('totalAmount');
                                                                setSortOrderDesc(!sortOrderDesc);
                                                            }}
                                                            className="h-4 w-4 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                                        />
                                                    </div>
                                                </th>
                                                <th className="px-4 py-4 text-left">
                                                    <div className="flex items-center space-x-2 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                                        <span>Member</span>
                                                        <ArrowUpDown
                                                            onClick={() => {
                                                                setSortBy('customer.fullName');
                                                                setSortOrderDesc(!sortOrderDesc);
                                                            }}
                                                            className="h-4 w-4 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                                        />
                                                    </div>
                                                </th>
                                                <th className="px-4 py-4 text-center">
                                                    <div className="flex items-center justify-center space-x-2 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                                        <span>Status</span>
                                                        <ArrowUpDown
                                                            onClick={() => {
                                                                setSortBy('dueAmount');
                                                                setSortOrderDesc(!sortOrderDesc);
                                                            }}
                                                            className="h-4 w-4 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                                        />
                                                    </div>
                                                </th>
                                                <th className="px-4 py-4 text-right">
                                                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                            {receipts?.map((receipt, index) => (
                                                <tr key={receipt._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
                                                    <td className="px-4 py-2 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                                                                <span className="text-xs font-medium text-blue-800 dark:text-blue-200">
                                                                    #{index + 1}
                                                                </span>
                                                            </div>
                                                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                {receipt.receiptNo}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900 dark:text-white font-medium">
                                                            {new Date(receipt.createdAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {new Date(receipt.createdAt).toLocaleTimeString('en-US', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                                            {receipt.itemId?.planName || receipt.membership?.[0] || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-right">
                                                        <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                            {receipt.organization?.currency} {receipt.receivedAmount?.toLocaleString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-right">
                                                        <div className={`text-sm font-semibold ${receipt.dueAmount > 0
                                                            ? 'text-red-600 dark:text-red-400'
                                                            : 'text-gray-500 dark:text-gray-400'
                                                            }`}>
                                                            {receipt.organization?.currency} {receipt.dueAmount?.toLocaleString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-right">
                                                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                                                            {receipt.organization?.currency} {(receipt.receivedAmount + receipt.dueAmount)?.toLocaleString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                                                                <span className="text-sm font-medium text-white">
                                                                    {receipt.customer?.fullName?.charAt(0) || 'N'}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {receipt.customer?.fullName || 'N/A'}
                                                                </div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {receipt.customer?.contactNo || 'No contact'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-2 text-center">
                                                        <span
                                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${receipt.dueAmount === 0
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                                                                }`}
                                                        >
                                                            <div className={`w-2 h-2 rounded-full mr-2 ${receipt.dueAmount === 0 ? 'bg-green-500' : 'bg-amber-500'
                                                                }`}></div>
                                                            {receipt.dueAmount === 0 ? 'Paid' : 'Partial'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-right">
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <button
                                                                onClick={() => getSingleReceiptDetails(receipt)}
                                                                className="inline-flex items-center p-2 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:text-blue-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-gray-600 transition-all duration-200"
                                                                title="Print Receipt"
                                                            >
                                                                <PiPrinterBold className="h-4 w-4" />
                                                            </button>
                                                            {loggedInUser?.role !== 'Gym Admin' ? (
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <button
                                                                            className="inline-flex items-center justify-center p-2 bg-red-100 text-red-600 border border-red-300 rounded-lg hover:bg-red-200 hover:text-red-700 transition-all duration-200 dark:bg-red-950 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900"
                                                                            title="Delete Receipt"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </button>
                                                                    </AlertDialogTrigger>

                                                                    <AlertDialogContent className="sm:max-w-md bg-white dark:bg-[#1a1a1a] border border-red-200 dark:border-red-700 shadow-lg rounded-xl">
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle className="text-xl font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                                                                                <Trash2 className="h-5 w-5" />
                                                                                Delete Receipt
                                                                            </AlertDialogTitle>
                                                                            <AlertDialogDescription className="text-gray-700 dark:text-gray-400 mt-2 text-sm">
                                                                                This action will permanently remove the receipt from your records. <br />
                                                                                Are you absolutely sure you want to proceed?
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>

                                                                        <AlertDialogFooter className="flex justify-end gap-2 mt-4">
                                                                            <AlertDialogCancel
                                                                                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                                                                            >
                                                                                Cancel
                                                                            </AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() => deleteReceipt(receipt._id)}
                                                                                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-all"
                                                                            >
                                                                                Delete Receipt
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            ) : (
                                                                <>
                                                                </>
                                                            )}

                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="w-full flex flex-col items-center justify-center py-20 px-4">
                            <div className="max-w-md text-center">
                                <div className="mx-auto h-24 w-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                                    <LuFileSearch2 className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                    No payment receipts found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                                    {searchQuery
                                        ? "We couldn't find any receipts matching your search criteria. Try adjusting your search terms."
                                        : "No receipts have been created yet. Receipts will appear here once payments are processed."}
                                </p>
                                {searchQuery && (
                                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                                        Clear Search
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Enhanced Pagination */}
                    <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                            <div className="flex items-center space-x-2">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Showing
                                    <span className="font-semibold text-gray-900 dark:text-white mx-1">
                                        {((currentPage - 1) * 10) + 1}
                                    </span>
                                    to
                                    <span className="font-semibold text-gray-900 dark:text-white mx-1">
                                        {Math.min(currentPage * 10, totalReceipts || 0)}
                                    </span>
                                    of
                                    <span className="font-semibold text-gray-900 dark:text-white mx-1">
                                        {totalReceipts || 0}
                                    </span>
                                    receipts
                                </div>
                            </div>
                            <Pagination
                                total={totalPages || 1}
                                page={currentPage || 1}
                                onChange={setCurrentPage}
                                withEdges={true}
                                siblings={1}
                                boundaries={1}
                                classNames={{
                                    root: "flex items-center space-x-1",
                                    item: "h-10 w-10 flex items-center justify-center border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 text-sm font-medium",
                                    active: "bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-700 border-blue-600 shadow-sm",
                                    dots: "text-gray-400 dark:text-gray-500 px-2"
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentReceipts;
