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
    const [invoiceData, setInvoiceData] = useState(null);
    const [printInvoiceAlert, setPrintInvoiceAlert] = useState(false);
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

    // Invoice Data
    const [subTotal, setSubTotal] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [calculatedTotal, setCalculatedTotal] = useState(0);

    const postInvoice = async (data) => {

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
                queryclient.invalidateQueries(['salesinvoice']);
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
            const response = await fetch(`http://localhost:3000/api/accounting/invoicemanagement/${id}`);
            const responseBody = await response.json();

            if (response.ok && response.status === 200) {
                toast.success(responseBody.message || '');
                setAssignedMemberName(responseBody.invoice.issuedTo.fullName || '');
                setAssignedStaffName(responseBody.invoice.issuedBy.fullName || '');
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
            <div className="bg-white p-4 rounded-md border shadow-sm">
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

                {/* Header Section */}
                <div className="flex flex-col md:flex-row mt-2 bg-white rounded-md justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Sales Invoice</h1>
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
                                            {salesinvoice.map((invoice) => (
                                                <tr key={invoice._id} className="border-b text-sm hover:bg-muted/50">
                                                    <td className="p-3 align-middle font-medium">{invoice.billNo}</td>
                                                    <td className="p-3 align-middle">{new Date(invoice.billDate).toISOString().split('T')[0]}</td>
                                                    <td className="p-3 align-middle text-center">{invoice.paymentMethod}</td>
                                                    <td className="p-3 align-middle text-center">{invoice.totalGivenDiscountAmount}</td>
                                                    <td className="p-3 align-middle text-center">{invoice.totalDiscountPercentage} %</td>
                                                    <td className="p-3 align-middle text-center">{invoice.grandTotal}</td>
                                                    <td className="p-3 align-middle text-start">{invoice.fiscalYear}</td>
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
                    <form onSubmit={handleSubmit(postInvoice)} className="bg-white w-11/12 md:w-9/12 max-w-8xl h-[95vh] rounded-lg shadow-xl flex flex-col overflow-hidden">
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
