'use client';

import { IoIosRemoveCircleOutline, IoMdAddCircleOutline } from "react-icons/io";
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

const PaymentInvoice = () => {

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
    const [openInvoiceForm, setOpenInvoiceForm] = useState(false);

    // Invoice Form Data
    const [itemDetails, setItemDetails] = useState([{
        selectedItem: {},
        quantity: 0,
        price: 0,
        discount: 0,
        total: 0,
    }]);

    // Handle Add Item Line Fn
    const handleAddItemLine = () => {
        const prevItem = [...itemDetails];
        prevItem.push({
            selectedItem: {},
            quantity: 1,
            price: 0,
            discount: 0,
            total: 0,
        });
        setItemDetails(prevItem);

        // Add a new dropdown state for the new item
        setActiveDropdownIndex(-1);
    };

    // Data states
    const [paymentMethod, setPaymentMethod] = useState('');
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
    const itemSearchRef = useRef(null);

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

    // Get all services and tasks
    const getAllItems = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/accounting/serviceandproducts`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
            toast.error("Failed to fetch members");
        }
    };

    const { data: itemsData, isLoading: itemLoading } = useQuery({
        queryKey: ['items'],
        queryFn: getAllItems
    });

    const { serviceAndProducts } = itemsData || {};

    // Handle Remove Item Line
    const handleRemoveItemLine = (index) => {
        if (itemDetails.length > 1) {
            const updatedItems = [...itemDetails];
            updatedItems.splice(index, 1);
            setItemDetails(updatedItems);
        } else {
            toast.error("At least one item is required");
        };
    };

    // Item search states
    const [activeDropdownIndex, setActiveDropdownIndex] = useState(-1);
    const [itemSearchQueries, setItemSearchQueries] = useState(Array(itemDetails.length).fill(''));

    // Handle click outside for all dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (memberSearchRef.current && !memberSearchRef.current.contains(event.target)) {
                setRenderMemberDropdown(false);
            }
            if (staffSearchRef.current && !staffSearchRef.current.contains(event.target)) {
                setRenderStaffDropdown(false);
            }
            if (itemSearchRef.current && !itemSearchRef.current.contains(event.target)) {
                setActiveDropdownIndex(-1);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [memberSearchRef, staffSearchRef, itemSearchRef]);

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

    // Invoice Data
    const [subTotal, setSubTotal] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [calculatedTotal, setCalculatedTotal] = useState(0);

    const postReceipt = async (data) => {

        const { billDate, additionalNotes } = data;
        const finalData = {
            staffId,
            memberId,
            billDate,
            itemDetails,
            paymentMethod,
            discountAmount,
            discountPercentage,
            subTotal,
            calculatedTotal,
            additionalNotes
        };

        try {

            const response = await fetch(`http://localhost:3000/api/accounting/invoicemanagement/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalData),
            });

            const responseBody = await response.json();

            if (response.ok && response.status === 200) {
                toast.success(responseBody.message);
                setOpenInvoiceForm(false);
                reset();
                setStaffName('');
                setStaffId('');
                setMemberName('');
                setMemberId('');
                setItemDetails([{
                    selectedItem: {},
                    quantity: 0,
                    price: 0,
                    discount: 0,
                    total: 0,
                }]);
                setPaymentMethod('');
                setDiscountAmount(0);
                setDiscountPercentage(0);
                setCalculatedTotal(0);
                setSubTotal(0);
            } else {
                toast.error(responseBody.message);
            };

        } catch (error) {
            console.log("Error: ", error);
            toast.error(error.message);
        };
    };

    // Get all services and products from server
    const getAllInvoices = async ({ queryKey }) => {
        const [, page, searchQuery, sortBy, sortOrderDesc] = queryKey;
        try {
            const response = await fetch(`http://localhost:3000/api/accounting/invoicemanagement?page=${page}&limit=${limit}&searchQuery=${searchQuery}&sortBy=${sortBy}&sortOrderDesc=${sortOrderDesc}`);
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

    const { salesinvoice, totalPages } = data || {};

    // Debounce
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Get Single Receipt Details
    const getSingleSalesInvoice = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/accounting/paymentreceipts/${id}`);
            const responseBody = await response.json();
            if (response.ok && response.status === 200) {
                toast.success(responseBody.message || '');
                setAssignedMemberName(responseBody.paymentReceipt.customer.fullName || '');
                setAssignedStaffName(responseBody.paymentReceipt.issuedBy.fullName || '');
                printReceipt(responseBody.salesinvoice);
            }
        } catch (error) {
            console.log("Error: ", error)
        };
    };

    const deleteSalesInvoice = async (id) => {
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
    };

    // Handle Item Selection
    const handleItemSelection = (item, index) => {
        const updatedItemDetails = [...itemDetails];
        updatedItemDetails[index] = {
            ...updatedItemDetails[index],
            selectedItem: item,
            price: parseFloat(item.sellingPrice) || 0,
            total: (parseFloat(item.sellingPrice) || 0) * updatedItemDetails[index].quantity - updatedItemDetails[index].discount
        };

        setItemDetails(updatedItemDetails);

        // Update the item search query for the specific index
        const updatedQueries = [...itemSearchQueries];
        updatedQueries[index] = item.itemName;
        setItemSearchQueries(updatedQueries);

        // Close the dropdown
        setActiveDropdownIndex(-1);
    };

    // Handle quantity change
    const handleQuantityChange = (e, index) => {
        const quantity = parseInt(e.target.value) || 0;
        const updatedItems = [...itemDetails];
        const price = parseFloat(updatedItems[index].selectedItem?.sellingPrice) || 0;
        const discount = parseFloat(updatedItems[index].discount) || 0;

        updatedItems[index] = {
            ...updatedItems[index],
            quantity: quantity,
            total: (quantity * price) - discount
        };

        setItemDetails(updatedItems);
    };

    // Handle discount change
    const handleDiscountChange = (e, index) => {
        const discount = parseFloat(e.target.value) || 0;
        const updatedItems = [...itemDetails];
        const quantity = updatedItems[index].quantity || 0;
        const price = parseFloat(updatedItems[index].selectedItem?.sellingPrice) || 0;

        updatedItems[index] = {
            ...updatedItems[index],
            discount: discount,
            total: (quantity * price) - discount
        };

        setItemDetails(updatedItems);
    };

    // Handle item search
    const handleItemSearch = (e, index) => {
        const query = e.target.value;
        const updatedQueries = [...itemSearchQueries];
        updatedQueries[index] = query;
        setItemSearchQueries(updatedQueries);
    };

    // Calculate totals
    useEffect(() => {
        const totalBeforeDiscount = itemDetails.reduce((sum, item) => {
            const price = parseFloat(item.selectedItem?.sellingPrice) || 0;
            const quantity = item.quantity || 0;
            return sum + price * quantity;
        }, 0);

        const discountByPercent = (totalBeforeDiscount * discountPercentage) / 100;
        const totalDiscount = discountAmount + discountByPercent;

        setSubTotal(Number(totalBeforeDiscount.toFixed(2)));
        setCalculatedTotal(Number((totalBeforeDiscount - totalDiscount).toFixed(2)));
    }, [itemDetails, discountAmount, discountPercentage]);

    return (
        <div className="w-full py-6 bg-gray-100 px-4 max-w-7xl mx-auto">
            {/* Breadcrumb Navigation */}
            <div className="mb-6">
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
                                Payment Invoice
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Print alert dialog */}
            <AlertDialog open={printReceiptAlert} onOpenChange={setPrintReceiptAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Print Invoice?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Would you like to print the invoice now?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPrintReceiptAlert(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => printReceipt(receiptData)}>Print</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row bg-white p-3 rounded-md shadow-md justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Sales Invoice</h1>
                    <p className="text-xs text-gray-500 font-semibold mt-1">Manage and view all payment invoices</p>
                </div>

                <div className="w-full md:w-auto flex flex-col-reverse md:flex-row gap-3">
                    {/* Search Bar */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search invoices..."
                            className="pl-10 pr-4 py-2 h-10 rounded-md border-gray-300 focus-visible:ring-primary"
                        />
                    </div>

                    {/* New Receipt Button */}
                    <Button
                        onClick={() => setOpenInvoiceForm(true)}
                        className="h-10 px-4 rounded-md bg-primary hover:bg-primary/90">
                        <Plus className="h-4 w-4 mr-2" />
                        New Invoice
                    </Button>
                </div>
            </div>

            {/* Content Area */}
            <div className="w-full bg-white rounded-xl shadow-md border border-gray-200">
                {/* Table Section */}
                <div className="w-full">
                    {Array.isArray(salesinvoice) && salesinvoice.length > 0 ? (
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
                                                        Total Discount
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
                                                        Discount Percentage
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
                                                        Issued To
                                                    </div>
                                                </th>
                                                <th className="h-10 px-4 text-left font-medium">
                                                    <div className="flex text-sm font-semibold items-center">
                                                        Issued By
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
                                            {salesinvoice.map((invoice) => (
                                                <tr key={invoice._id} className="border-b text-sm hover:bg-muted/50">
                                                    <td className="p-3 align-middle font-medium">{invoice.billNo}</td>
                                                    <td className="p-3 align-middle">{new Date(invoice.billDate).toISOString().split('T')[0]}</td>
                                                    <td className="p-3 align-middle text-start">{invoice.paymentMethod}</td>
                                                    <td className="p-3 align-middle text-start">${invoice.totalGivenDiscountAmount}</td>
                                                    <td className="p-3 align-middle text-start">${invoice.totalDiscountPercentage}</td>
                                                    <td className="p-3 align-middle text-start">${invoice.grandTotal}</td>
                                                    <td className="p-3 align-middle">{invoice.member?.name || 'N/A'}</td>
                                                    <td className="p-3 align-middle">{invoice.staff?.name || 'N/A'}</td>
                                                    <td className="p-3 align-middle text-start">${invoice.fiscalYear}</td>
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
                        <div className="overflow-x-auto">
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
                            Showing <strong>{salesinvoice?.length}</strong> of <strong>{salesinvoice?.length}</strong> receipts
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
            {openInvoiceForm && (
                <div className="w-full flex justify-center items-center bg-black bg-opacity-70 backdrop-blur-sm fixed inset-0 z-50">
                    <form onSubmit={handleSubmit(postReceipt)} className="bg-white w-11/12 md:w-9/12 max-w-8xl h-[95vh] rounded-lg shadow-xl flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="w-full flex justify-between py-3 bg-gray-50 px-6 items-center border-b border-gray-100">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Sales Invoice</h1>
                                <p className="text-sm text-gray-500 mt-1">Generate and print payment invoices</p>
                            </div>
                            <button
                                onClick={() => setOpenInvoiceForm(false)}
                                className="p-2 rounded-full hover:bg-gray-50 transition-colors duration-200"
                                aria-label="Close form"
                            >
                                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Step 1: Customer & Basic Info */}
                            <div className="mb-4">
                                <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2 mb-4">Basic Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* Bill Issued By */}
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
                                                        <div className="px-4 py-3 text-sm text-gray-500">{staffsLoading ? 'Loading...' : 'No staff found'}</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Issued To */}
                                    <div className='space-y-1.5'>
                                        <Label className="block text-sm font-medium text-gray-700">Issued To</Label>
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
                                                        <div className="px-4 py-3 text-sm text-gray-500">{membersLoading ? 'Loading...' : 'No members found'}</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Bill Date */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5 my-2">
                                        <Label className="text-sm font-medium text-gray-700">Bill Date</Label>
                                        <Input
                                            type="date"
                                            {...register('billDate', { required: 'Bill date is required' })}
                                            className="h-10 text-sm rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.billDate && (
                                            <p className="text-xs font-semibold text-red-600">{`${errors.billDate.message}`}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Item Selection Form */}
                            <div className='bg-white border rounded-lg'>
                                <table className="w-full rounded-lg">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="h-12 px-4 text-left font-medium text-gray-700 text-sm w-[30%]">Select Item</th>
                                            <th className="h-12 px-4 text-left font-medium text-gray-700 text-sm w-[15%]">Quantity</th>
                                            <th className="h-12 px-4 text-left font-medium text-gray-700 text-sm w-[15%]">Price</th>
                                            <th className="h-12 px-4 text-left font-medium text-gray-700 text-sm w-[15%]">Discount</th>
                                            <th className="h-12 px-4 text-left font-medium text-gray-700 text-sm w-[15%]">Total</th>
                                            <th className="h-12 px-4 text-left font-medium text-gray-700 text-sm w-[10%]">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody ref={itemSearchRef}>
                                        {itemDetails.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                {/* Select Item */}
                                                <td className="p-1 md:p-2 align-middle">
                                                    <div className="relative">
                                                        <div className="relative">
                                                            <Input
                                                                autoComplete="off"
                                                                value={itemSearchQueries[index] || ''}
                                                                onChange={(e) => handleItemSearch(e, index)}
                                                                onFocus={() => setActiveDropdownIndex(index)}
                                                                className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm px-4 py-2 pl-10"
                                                                placeholder="Search items..."
                                                            />
                                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                                                <FiSearch className="h-4 w-4" />
                                                            </div>
                                                        </div>

                                                        {activeDropdownIndex === index && (
                                                            <div className="absolute w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-20 top-full left-0 mt-1">
                                                                {itemLoading ? (
                                                                    <div className="flex justify-center items-center py-4">
                                                                        <BiLoaderAlt className="animate-spin h-5 w-5 text-blue-500" />
                                                                    </div>
                                                                ) : serviceAndProducts?.length > 0 ? (
                                                                    serviceAndProducts
                                                                        .filter((prod) => {
                                                                            return prod.itemName
                                                                                .toLowerCase()
                                                                                .includes((itemSearchQueries[index] || '').toLowerCase());
                                                                        })
                                                                        .map((prod) => (
                                                                            <div
                                                                                onClick={() => handleItemSelection(prod, index)}
                                                                                className="px-2 py-2 text-sm hover:border text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors"
                                                                                key={prod.itemId}
                                                                            >
                                                                                {prod.itemName} ({prod.currency?.split('-')[0] || '$'} {prod.sellingPrice})
                                                                            </div>
                                                                        ))
                                                                ) : (
                                                                    <div className="px-4 py-2 text-sm text-gray-500">No items found</div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                {/* Quantity */}
                                                <td className="p-1 md:p-2 align-middle">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={item.quantity}
                                                        onChange={(e) => handleQuantityChange(e, index)}
                                                        placeholder="0"
                                                        className="h-10 w-full text-sm rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                                {/* Selling Price of an item */}
                                                <td className="p-1 md:p-2 align-middle">
                                                    <Input
                                                        type="text"
                                                        value={item.selectedItem?.sellingPrice || '0.00'}
                                                        readOnly
                                                        placeholder="0.00"
                                                        className="h-10 w-full text-sm rounded-md border-gray-300 bg-gray-50"
                                                    />
                                                </td>
                                                {/* Discount */}
                                                <td className="p-1 md:p-2 align-middle">
                                                    <Input
                                                        type="text"
                                                        min="0"
                                                        value={item.discount || ''}
                                                        onChange={(e) => handleDiscountChange(e, index)}
                                                        placeholder="0.00"
                                                        className="h-10 w-full text-sm rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                                {/* Total Price */}
                                                <td className="p-1 md:p-2 align-middle">
                                                    <Input
                                                        type="text"
                                                        value={item.total.toFixed(2) || '0.00'}
                                                        readOnly
                                                        placeholder="0.00"
                                                        className="h-10 w-full text-sm rounded-md border-gray-300 bg-gray-50"
                                                    />
                                                </td>
                                                <td className="p-1 md:p-2 align-middle">
                                                    <Button
                                                        type='button'
                                                        variant="ghost"
                                                        onClick={() => handleRemoveItemLine(index)}
                                                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 flex items-center gap-1"
                                                    >
                                                        <IoIosRemoveCircleOutline className="text-red-600 h-5 w-5" />
                                                        <span className="text-red-600 text-sm font-semibold">remove</span>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="p-2">
                                    <Button
                                        onClick={handleAddItemLine}
                                        type='button'
                                        variant="ghost"
                                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 flex items-center gap-1"
                                    >
                                        <IoMdAddCircleOutline className="h-5 w-5" />
                                        <span className="text-sm font-semibold">Add item line</span>
                                    </Button>
                                </div>
                            </div>

                            {/* Step 3: Payment Details */}
                            <div className=" mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Payment Method Column */}
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
                                                    <SelectItem value="Card">Card</SelectItem>
                                                    <SelectItem value="E Banking">E Banking</SelectItem>
                                                    <SelectItem value="Cheque">Cheque</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Amount Summary Column */}
                                    {/* Total Discount By Amount */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700 block">Total Discount Amount</Label>
                                        <Input
                                            type="number"
                                            value={discountAmount}
                                            onChange={(e) => setDiscountAmount(Number(e.target.value))}
                                            placeholder="0.00"
                                            className="..."
                                        />
                                    </div>

                                    {/* Total Discount By Percentage */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700 block">Total Discount Percentage</Label>
                                        <Input
                                            type="number"
                                            value={discountPercentage}
                                            onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                                            placeholder="0.00"
                                            className="..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Render final calculations */}
                            <div className="w-full bg-indigo-500 rounded-lg p-4 my-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Left side - empty or could add icon/illustration */}
                                    <div className="flex items-center justify-start">
                                        <div className="text-gray-400">
                                            <PiPrinterBold className="text-white w-16 h-16" />
                                        </div>
                                    </div>

                                    {/* Right side - summary */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center border-b border-white pb-1">
                                            <span className="text-white text-sm font-medium">Sub Total:</span>
                                            <span className="text-white text-sm font-semibold">RS {subTotal}</span>
                                        </div>

                                        <div className="flex justify-between items-center text-white border-b border-white pb-1">
                                            <span className="text-white text-sm font-medium">Discount:</span>
                                            <span className="text-white text-sm font-semibold">-RS {(Number(discountAmount) + (subTotal * discountPercentage / 100)).toFixed(2)}</span>
                                        </div>

                                        <div className="flex justify-between items-center pt-1">
                                            <span className="text-gray-100 text-sm font-bold text-xl">Total:</span>
                                            <span className="text-gray-100 text-sm font-bold text-xl">RS {calculatedTotal}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additiona notes and border */}
                            <div className='w-full border-t border-gray-300 mb-6 mt-10'></div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700 block">Additional Notes</Label>
                                    <textarea
                                        {...register('additionalNotes')}
                                        rows={2}
                                        className="w-full p-2.5 text-sm rounded-md border focus:outline-none border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Any additional notes or comments..."
                                    />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="w-full flex justify-end bg-gray-50 gap-3 p-6 border-t border-gray-100">
                                <Button
                                    type="button"
                                    onClick={() => setOpenInvoiceForm(false)}
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
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PaymentInvoice;
