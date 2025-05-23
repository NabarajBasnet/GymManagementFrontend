'use client';

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

const PaymentReceipts = () => {
    const { user } = useUser();
    const loggedInUser = user ? user.user : null;

    // React Hook Form
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        setError,
        control
    } = useForm();

    const queryclient = useQueryClient();

    // Form states
    const [openReceiptForm, setOpenReceiptForm] = useState(false);

    // Data states
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [memberId, setMemberId] = useState('');
    const [staffId, setStaffId] = useState('');
    const [assignedStaffName, setAssignedStaffName] = useState('');
    const [assignedMemberName, setAssignedMemberName] = useState('');

    // Member search states
    const [memberSearchQuery, setMemberSearchQuery] = useState('');
    const [memberName, setMemberName] = useState('');
    const [renderMemberDropdown, setRenderMemberDropdown] = useState(false);
    const memberSearchRef = useRef(null);

    // Staff search states
    const [staffSearchQuery, setStaffSearchQuery] = useState('');
    const [staffName, setStaffName] = useState('');
    const [renderStaffDropdown, setRenderStaffDropdown] = useState(false);
    const staffSearchRef = useRef(null);

    // Other states
    const [receiptData, setReceiptData] = useState(null);
    const [printReceiptAlert, setPrintReceiptAlert] = useState(false);

    // Pagination states
    let limit = 15;
    const [currentPage, setCurrentPage] = useState(1);

    // Search Query
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    // Sorting states
    const [sortBy, setSortBy] = useState('');
    const [sortOrderDesc, setSortOrderDesc] = useState(true);

    // Get all members
    const getAllMembers = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/members`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
            toast.error("Failed to fetch members");
        }
    };

    const { data: membersData, isLoading: membersLoading } = useQuery({
        queryKey: ['members'],
        queryFn: getAllMembers
    });

    const { members } = membersData || {};

    // Get all staffs
    const getAllStaffs = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/staffsmanagement`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
            toast.error("Failed to fetch staffs");
        }
    };

    const { data: staffsData, isLoading: staffsLoading } = useQuery({
        queryKey: ['staffs'],
        queryFn: getAllStaffs
    });

    const { staffs } = staffsData || {};

    // Handle click outside for all dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (memberSearchRef.current && !memberSearchRef.current.contains(event.target)) {
                setRenderMemberDropdown(false);
            }
            if (staffSearchRef.current && !staffSearchRef.current.contains(event.target)) {
                setRenderStaffDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [memberSearchRef, staffSearchRef]);

    const handleMemberSearchFocus = () => {
        setRenderMemberDropdown(true);
    };

    const handleStaffSearchFocus = () => {
        setRenderStaffDropdown(true);
    };

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

    const postReceipt = async (data) => {
        try {
            const {
                paymentReceiptNo,
                paymentDate,
                referenceNo,
                receivedAmount,
                discountAmount,
                dueAmount,
                totalAmount,
                notes
            } = data;

            const finalData = {
                paymentReceiptNo,
                paymentDate,
                memberId,
                staffId,
                paymentMethod,
                paymentStatus,
                referenceNo,
                receivedAmount,
                discountAmount,
                dueAmount,
                totalAmount,
                notes
            };

            if (!memberId) {
                toast.error('Please select customer name');
                return
            }

            if (!staffId) {
                toast.error('Please select staff name');
                return
            };

            if (!paymentMethod) {
                toast.error('Please select payment method');
                return
            };

            if (!paymentStatus) {
                toast.error('Please select payment status');
                return
            };

            const response = await fetch(`http://localhost:3000/api/accounting/paymentreceipts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalData),
            });

            const responseBody = await response.json();

            if (response.ok && response.status === 200) {
                queryclient.invalidateQueries(['paymentreceipts']);
                setReceiptData(responseBody.receipt);
                toast.success(responseBody.message);
                reset();
                setOpenReceiptForm(false);
                setMemberId('');
                setStaffId('');
                setMemberName('');
                setStaffName('');
                setStaffSearchQuery('');
                setMemberSearchQuery('');
                setAssignedStaffName(responseBody.assignedStaffName);
                setAssignedMemberName(responseBody.assignedMemberName);
                setPrintReceiptAlert(true);
            } else {
                toast.error(responseBody.message);
            };
        } catch (error) {
            console.log("Error: ", error);
            toast.error('Internal Server Error!');
            toast.error(error.message);
        };
    };

    // Get all services and products from server
    const getAllPaymentReceipts = async ({ queryKey }) => {
        const [, page, searchQuery, sortBy, sortOrderDesc] = queryKey;
        try {
            const response = await fetch(`http://localhost:3000/api/accounting/paymentreceipts?page=${page}&limit=${limit}&searchQuery=${searchQuery}&sortBy=${sortBy}&sortOrderDesc=${sortOrderDesc}`);
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

    const { paymentreceipts, totalPages } = data || {};

    // Debounce
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Get Single Receipt Details
    const getSingleReceiptDetails = async (id) => {
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
            const response = await fetch(`http://localhost:3000/api/accounting/paymentreceipts/${id}`, {
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
        <div className="w-full py-6 bg-gray-100 min-h-screen px-4 mx-auto">
            {/* Breadcrumb Navigation */}
            <div className="bg-white p-4 rounded-md">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/" className="text-sm font-medium text-gray-600 hover:text-primary">
                                Home
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-gray-400" />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-primary">
                                Dashboard
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-gray-400" />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard/billing" className="text-sm font-medium text-gray-600 hover:text-primary">
                                Billing
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-gray-400" />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-sm font-medium text-primary">
                                Payment Receipts
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Header Section */}
                <div className="flex flex-col mt-2 md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Payment Receipts</h1>
                    </div>

                    <div className="w-full md:w-auto flex flex-col-reverse md:flex-row gap-3">
                        {/* Search Bar */}
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search receipts..."
                                className="pl-10 pr-4 py-2 h-10 rounded-md border-gray-300 focus-visible:ring-primary"
                            />
                        </div>

                        {/* New Receipt Button */}
                        <Button
                            onClick={() => setOpenReceiptForm(true)}
                            className="h-10 px-4 rounded-md bg-primary hover:bg-primary/90">
                            <Plus className="h-4 w-4 mr-2" />
                            New Receipt
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
            <div className="w-full my-4 bg-white rounded-md shadow-md border border-gray-200">
                {/* Table Section */}
                <div className="w-full">
                    {Array.isArray(paymentreceipts) && paymentreceipts.length > 0 ? (
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
                                                        Receipt No
                                                        <ArrowUpDown
                                                            onClick={() => {
                                                                setSortBy('paymentReceiptNo');
                                                                setSortOrderDesc(!sortOrderDesc);
                                                            }}
                                                            className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                                    </div>
                                                </th>
                                                <th className="h-16 px-4 text-left font-medium">
                                                    <div className="flex text-sm font-semibold items-center">
                                                        Payment Date
                                                        <ArrowUpDown
                                                            onClick={() => {
                                                                setSortBy('paymentDate');
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
                                                        Received
                                                        <ArrowUpDown
                                                            onClick={() => {
                                                                setSortBy('receivedAmount');
                                                                setSortOrderDesc(!sortOrderDesc);
                                                            }}
                                                            className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                                    </div>
                                                </th>
                                                <th className="h-10 px-4 text-right font-medium">
                                                    <div className="flex text-sm font-semibold items-center">
                                                        Due
                                                        <ArrowUpDown
                                                            onClick={() => {
                                                                setSortBy('dueAmount');
                                                                setSortOrderDesc(!sortOrderDesc);
                                                            }}
                                                            className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                                    </div>
                                                </th>
                                                <th className="h-10 px-4 text-right font-medium">
                                                    <div className="flex text-sm font-semibold items-center">
                                                        Total
                                                        <ArrowUpDown
                                                            onClick={() => {
                                                                setSortBy('totalAmount');
                                                                setSortOrderDesc(!sortOrderDesc);
                                                            }}
                                                            className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                                    </div>
                                                </th>
                                                <th className="h-10 px-4 text-left font-medium">
                                                    <div className="flex text-sm font-semibold items-center">
                                                        Member
                                                    </div>
                                                </th>
                                                <th className="h-10 px-4 text-left font-medium">
                                                    <div className="flex text-sm font-semibold items-center">
                                                        Staff
                                                    </div>
                                                </th>
                                                <th className="h-10 px-4 text-left font-medium">
                                                    <div className="flex text-sm font-semibold items-center">
                                                        Status
                                                        <ArrowUpDown
                                                            onClick={() => {
                                                                setSortBy('paymentStatus');
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
                                            {paymentreceipts.map((receipt) => (
                                                <tr key={receipt._id} className="border-b text-sm hover:bg-muted/50">
                                                    <td className="p-3 align-middle font-medium">{receipt.paymentReceiptNo}</td>
                                                    <td className="p-3 align-middle">{new Date(receipt.paymentDate).toISOString().split('T')[0]}</td>
                                                    <td className="p-3 align-middle text-start">{receipt.paymentMethod}</td>
                                                    <td className="p-3 align-middle text-start">${receipt.receivedAmount}</td>
                                                    <td className="p-3 align-middle text-start">${receipt.dueAmount}</td>
                                                    <td className="p-3 align-middle text-start">${receipt.totalAmount}</td>
                                                    <td className="p-3 align-middle">{receipt.member?.name || 'N/A'}</td>
                                                    <td className="p-3 align-middle">{receipt.staff?.name || 'N/A'}</td>
                                                    <td className="p-3 align-middle">
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${receipt.paymentStatus === 'Paid'
                                                                ? 'bg-green-100 text-green-800'
                                                                : receipt.paymentStatus === 'Pending'
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                                }`}
                                                        >
                                                            {receipt.paymentStatus}
                                                        </span>
                                                    </td>
                                                    {loggedInUser?.role !== 'Gym Admin' && (
                                                        <td className="flex items-center p-4 align-middle justify-end">
                                                            <PiPrinterBold
                                                                onClick={() => getSingleReceiptDetails(receipt._id)}
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
                                                                        <AlertDialogAction onClick={() => deleteReceipt(receipt._id)}>Continue</AlertDialogAction>
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
                                    <tr className="border-b text-sm bg-muted/50">
                                        <th className="h-16 px-4 text-left text-sm font-semibold font-medium">Receipt No</th>
                                        <th className="h-16 px-4 text-left text-sm font-semibold font-medium">Payment Date</th>
                                        <th className="h-10 px-4 text-left text-sm font-semibold font-medium">Method</th>
                                        <th className="h-10 px-4 text-right text-sm font-semibold font-medium">Received</th>
                                        <th className="h-10 px-4 text-right text-sm font-semibold font-medium">Due</th>
                                        <th className="h-10 px-4 text-right text-sm font-semibold font-medium">Total</th>
                                        <th className="h-10 px-4 text-left text-sm font-semibold font-medium">Member</th>
                                        <th className="h-10 px-4 text-left text-sm font-semibold font-medium">Staff</th>
                                        <th className="h-10 px-4 text-left text-sm font-semibold font-medium">Status</th>
                                        {loggedInUser?.role !== 'Gym Admin' && (
                                            <th className="h-10 px-4 text-right text-sm font-semibold font-medium">Actions</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan={loggedInUser?.role === 'Gym Admin' ? 9 : 10} className="text-center py-6 text-sm text-muted-foreground">
                                            <h3 className="text-lg font-medium text-gray-700 mb-1">No payment receipts yet</h3>
                                            <p className="text-gray-500 mb-4 text-xs font-semibold w-full text-center align-center">Create your first payment receipt to get started</p>
                                            <Button
                                                onClick={() => setOpenReceiptForm(true)}
                                                className="px-6">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Create Receipt
                                            </Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="flex items-center justify-between border-t px-4 py-4">
                        <div className="text-sm text-muted-foreground">
                            Showing <strong>{paymentreceipts?.length}</strong> of <strong>{paymentreceipts?.length}</strong> receipts
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

            {/* Form Section */}
            {openReceiptForm && (
                <div className="w-full flex justify-center items-center bg-black bg-opacity-70 backdrop-blur-sm fixed inset-0 z-50">
                    <form onSubmit={handleSubmit(postReceipt)} className="bg-white w-11/12 max-w-8xl h-[90vh] rounded-lg shadow-xl flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="w-full flex justify-between p-6 items-center border-b border-gray-100">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Create New Receipt</h1>
                                <p className="text-sm text-gray-500 mt-1">Generate and print payment receipts</p>
                            </div>
                            <button
                                onClick={() => setOpenReceiptForm(false)}
                                className="p-2 rounded-full hover:bg-gray-50 transition-colors duration-200"
                                aria-label="Close form"
                            >
                                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Step 1: Customer & Basic Info */}
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2 mb-4">Basic Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="space-y-1.5">
                                        <Label className="text-sm font-medium text-gray-700">Receipt Number</Label>
                                        <Input
                                            type="text"
                                            {...register('paymentReceiptNo', { required: 'Receipt no is required' })}
                                            placeholder="Receipt No"
                                            className="h-10 text-sm rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.paymentReceiptNo && (
                                            <p className="text-xs font-semibold text-red-600">{`${errors.paymentReceiptNo.message}`}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-sm font-medium text-gray-700">Payment Date</Label>
                                        <Input
                                            type="date"
                                            {...register('paymentDate', { required: 'Receipt no is required' })}
                                            className="h-10 text-sm rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.paymentDate && (
                                            <p className="text-xs font-semibold text-red-600">{`${errors.paymentDate.message}`}</p>
                                        )}
                                    </div>

                                    {/* Member dropdown */}
                                    <div className='space-y-1.5'>
                                        <Label className="block text-sm font-medium text-gray-700">Search Member</Label>
                                        <div ref={memberSearchRef} className="relative">
                                            <Controller
                                                name="memberName"
                                                control={control}
                                                render={({ field }) => (
                                                    <div className="relative">
                                                        <Input
                                                            {...field}
                                                            autoComplete="off"
                                                            value={memberName || memberSearchQuery}
                                                            onChange={(e) => {
                                                                setMemberSearchQuery(e.target.value);
                                                                field.onChange(e);
                                                                setMemberName('');
                                                            }}
                                                            onFocus={handleMemberSearchFocus}
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

                                            {renderMemberDropdown && (
                                                <div className="absolute w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto z-20 top-full left-0 mt-1">
                                                    {members?.length > 0 ? (
                                                        members
                                                            .filter((member) => {
                                                                return member.fullName
                                                                    .toLowerCase()
                                                                    .includes(memberSearchQuery.toLowerCase());
                                                            })
                                                            .map((member) => (
                                                                <div
                                                                    onClick={() => {
                                                                        setMemberName(member.fullName);
                                                                        setMemberSearchQuery(member.fullName);
                                                                        setMemberId(member._id);
                                                                        setRenderMemberDropdown(false);
                                                                    }}
                                                                    className="px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors"
                                                                    key={member._id}
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

                                    {/* Staff Dropdown */}
                                    <div className='space-y-1.5'>
                                        <Label className="block text-sm font-medium mb-1.5 text-gray-700">Issued By</Label>
                                        <div ref={staffSearchRef} className="relative">
                                            <Controller
                                                name="staffName"
                                                control={control}
                                                render={({ field }) => (
                                                    <div className="relative">
                                                        <Input
                                                            {...field}
                                                            autoComplete="off"
                                                            value={staffName || staffSearchQuery}
                                                            onChange={(e) => {
                                                                setStaffSearchQuery(e.target.value);
                                                                field.onChange(e);
                                                                setStaffName('');
                                                            }}
                                                            onFocus={handleStaffSearchFocus}
                                                            className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm px-4 py-2.5 pl-10"
                                                            placeholder="Search staff..."
                                                        />
                                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                                            <FiSearch className="h-5 w-5" />
                                                        </div>
                                                    </div>
                                                )}
                                            />
                                            {errors.staffName && (
                                                <p className="mt-1.5 text-sm font-medium text-red-600">
                                                    {errors.staffName.message}
                                                </p>
                                            )}

                                            {renderStaffDropdown && (
                                                <div className="absolute w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto z-20 top-full left-0 mt-1">
                                                    {staffs?.length > 0 ? (
                                                        staffs
                                                            .filter((staff) => {
                                                                return staff.fullName
                                                                    .toLowerCase()
                                                                    .includes(staffSearchQuery.toLowerCase());
                                                            })
                                                            .map((staff) => (
                                                                <div
                                                                    onClick={() => {
                                                                        setStaffName(staff.fullName);
                                                                        setStaffSearchQuery(staff.fullName);
                                                                        setStaffId(staff._id);
                                                                        setRenderStaffDropdown(false);
                                                                    }}
                                                                    className="px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors"
                                                                    key={staff._id}
                                                                >
                                                                    {staff.fullName}
                                                                </div>
                                                            ))
                                                    ) : (
                                                        <div className="px-4 py-3 text-sm text-gray-500">No staff found</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3: Payment Details */}
                            <div className="border-t border-gray-200 py-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Payment Method Column */}
                                    <div className="space-y-4">
                                        <h2 className="text-lg font-semibold text-gray-800 pb-3 border-b border-gray-200">Payment Method</h2>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700 block">Payment Method</Label>
                                            <Select onValueChange={(value) => setPaymentMethod(value)}>
                                                <SelectTrigger className="h-10 w-full text-sm rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500">
                                                    <SelectValue placeholder="Select payment method" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Payment Methods</SelectLabel>
                                                        <SelectItem value="Cash">Cash</SelectItem>
                                                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                                                        <SelectItem value="Debit Card">Debit Card</SelectItem>
                                                        <SelectItem value="E Banking">E Banking</SelectItem>
                                                        <SelectItem value="Cheque">Cheque</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700 block">Payment Status</Label>
                                            <Select onValueChange={(value) => setPaymentStatus(value)}>
                                                <SelectTrigger className="h-10 w-full text-sm rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500">
                                                    <SelectValue placeholder="Select payment method" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Payment Methods</SelectLabel>
                                                        <SelectItem value="Paid">Paid</SelectItem>
                                                        <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                                                        <SelectItem value="Pending">Pending</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700 block">Reference No.</Label>
                                            <Input
                                                type="text"
                                                {...register('referenceNo')}
                                                placeholder="Payment reference number"
                                                className="h-10 w-full text-sm rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Amount Summary Column */}
                                    <div className="space-y-4">
                                        <h2 className="text-lg font-semibold text-gray-800 pb-3 border-b border-gray-200">Amount Summary</h2>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700 block">Received Amount</Label>
                                            <Input
                                                type="number"
                                                {...register('receivedAmount', { required: 'receivedAmount is required' })}
                                                placeholder="0.00"
                                                className="h-10 w-full text-sm rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700 block">Discount Amount</Label>
                                            <Input
                                                type="number"
                                                {...register('discountAmount')}
                                                placeholder="0.00"
                                                className="h-10 w-full text-sm rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700 block">Due Amount</Label>
                                            <Input
                                                type="number"
                                                {...register('dueAmount')}
                                                placeholder="0.00"
                                                className="h-10 w-full text-sm rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Notes Column */}
                                    <div className="space-y-4">
                                        <h2 className="text-lg font-semibold text-gray-800 pb-3 border-b border-gray-200">Total Amount & Notes</h2>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700 block">Total Amount</Label>
                                            <Input
                                                {...register('totalAmount', { required: 'Total amount is required' })}
                                                type="number"
                                                placeholder="0.00"
                                                className="h-10 w-full text-sm rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700 block">Additional Notes</Label>
                                            <textarea
                                                {...register('notes')}
                                                rows={1}
                                                className="w-full p-2.5 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Any additional notes or comments..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="w-full flex justify-end gap-3 p-6 border-t border-gray-100">
                            <Button
                                type="button"
                                onClick={() => setOpenReceiptForm(false)}
                                variant="outline"
                                className="h-10 px-6 rounded-md border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="h-10 px-6 rounded-md bg-primary hover:bg-primary/90 text-white"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <BiLoaderAlt className="animate-spin h-4 w-4" />
                                        Processing...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Save className="h-4 w-4" />
                                        Save Receipt
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PaymentReceipts;
