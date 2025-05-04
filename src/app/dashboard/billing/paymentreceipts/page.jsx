'use client';

import { useState } from 'react';
import { Combobox } from '@headlessui/react';
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
import { Checkbox } from "@/components/ui/checkbox";
import { IoIosInformationCircle } from "react-icons/io";
import Pagination from '@/components/ui/CustomPagination';
import { BiChevronDown, BiLoaderAlt } from "react-icons/bi";
import { Check, Plus, Search, Filter, Trash2, Save, X, Edit, ArrowUpDown } from 'lucide-react';

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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";
import Loader from "@/components/Loader/Loader";
import { useUser } from "@/components/Providers/LoggedInUserProvider";

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

    // Form states
    const [openReceiptForm, setOpenReceiptForm] = useState(false);
    const [query, setQuery] = useState('');
    const [items, setItems] = useState([
        { description: "", quantity: 1, unitPrice: 0, total: 0 },
    ]);

    const handleChange = (index, field, value) => {
        const updatedItems = [...items];
        if (field === "quantity" || field === "unitPrice") {
            value = Number(value);
            updatedItems[index][field] = value;
            updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;
        } else {
            updatedItems[index][field] = value;
        }
        setItems(updatedItems);
    };

    const addItem = () => {
        setItems([...items, { description: "", quantity: 1, unitPrice: 0, total: 0 }]);
    };

    const removeItem = (index) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
    };

    const products = [
        { id: 1, name: 'Website Design', price: 500 },
        { id: 2, name: 'SEO Service', price: 300 },
        { id: 3, name: 'Consultation', price: 100 },
    ];

    const filteredProducts = query === ''
        ? products
        : products.filter((product) =>
            product.name.toLowerCase().includes(query.toLowerCase())
        );

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
                                Payment Receipts
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row bg-white p-3 rounded-md shadow-md justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Payment Receipts</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and view all payment receipts</p>
                </div>

                <div className="w-full md:w-auto flex flex-col-reverse md:flex-row gap-3">
                    {/* Search Bar */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
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

            {/* Content Area */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                {/* Placeholder for table/data grid */}
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-1">No payment receipts yet</h3>
                    <p className="text-gray-500 mb-4 max-w-md">Create your first payment receipt to get started</p>
                    <Button
                        onClick={() => setOpenReceiptForm(true)}
                        className="px-6">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Receipt
                    </Button>
                </div>

                {/* Pagination would go here */}
                <div className="mt-6 flex justify-end">
                    <Pagination
                        currentPage={1}
                        totalPages={1}
                        onPageChange={() => { }}
                    />
                </div>
            </div>

            {/* Form Section */}
            {openReceiptForm && (
                <div className="w-full flex justify-center items-center bg-black bg-opacity-70 backdrop-blur-sm fixed inset-0 z-50">
                    <form className="bg-white w-full max-w-6xl h-[90vh] rounded-lg shadow-xl flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="w-full flex justify-between p-6 items-center border-b border-gray-100">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Create New Receipt</h1>
                                <p className="text-sm text-gray-500 mt-1">Generate professional receipts for your customers</p>
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
                                <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2 mb-4">Customer Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium text-gray-700">Customer</Label>
                                            <Select>
                                                <SelectTrigger className="h-10 text-sm rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                                    <SelectValue placeholder="Select customer" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-lg shadow-lg border border-gray-200">
                                                    <SelectGroup>
                                                        <SelectLabel className="text-xs font-medium text-gray-500">Customers</SelectLabel>
                                                        <SelectItem value="customer1" className="text-sm">John Doe</SelectItem>
                                                        <SelectItem value="customer2" className="text-sm">Jane Smith</SelectItem>
                                                        <SelectItem value="customer3" className="text-sm">Acme Corporation</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium text-gray-700">Issued By</Label>
                                            <Select>
                                                <SelectTrigger className="h-10 text-sm rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                                    <SelectValue placeholder="Select staff" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-lg shadow-lg border border-gray-200">
                                                    <SelectGroup>
                                                        <SelectLabel className="text-xs font-medium text-gray-500">Staff Members</SelectLabel>
                                                        <SelectItem value="staff1" className="text-sm">Admin User</SelectItem>
                                                        <SelectItem value="staff2" className="text-sm">Sales Manager</SelectItem>
                                                        <SelectItem value="staff3" className="text-sm">Reception</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium text-gray-700">Receipt Number</Label>
                                            <Input
                                                type="text"
                                                placeholder="REC-2023-001"
                                                className="h-10 text-sm rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium text-gray-700">Payment Date</Label>
                                            <Input
                                                type="date"
                                                className="h-10 text-sm rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2: Items/Services */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Items & Services</h2>
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Item
                                    </button>
                                </div>

                                <div className="overflow-x-auto rounded-lg border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item/Service</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Qty</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Unit Price</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Total</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {items.map((item, index) => (
                                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <Combobox value={item.description} onChange={(value) => handleChange(index, "description", value)}>
                                                            <div className="relative">
                                                                <Combobox.Input
                                                                    className="w-full p-2 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                    placeholder="Search products..."
                                                                    displayValue={(product) => product}
                                                                    onChange={(e) => setQuery(e.target.value)}
                                                                />
                                                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                                    <BiChevronDown className="h-4 w-4 text-gray-400" />
                                                                </Combobox.Button>
                                                            </div>
                                                            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                {filteredProducts.length === 0 && query !== '' ? (
                                                                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                                                        Nothing found.
                                                                    </div>
                                                                ) : (
                                                                    filteredProducts.map((product) => (
                                                                        <Combobox.Option
                                                                            key={product.id}
                                                                            value={product.name}
                                                                            className={({ active }) =>
                                                                                `relative cursor-default select-none py-2 pl-4 pr-4 ${active ? 'bg-blue-600 text-white' : 'text-gray-900'
                                                                                }`
                                                                            }
                                                                        >
                                                                            {({ selected, active }) => (
                                                                                <>
                                                                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                                        {product.name}
                                                                                    </span>
                                                                                    {product.price && (
                                                                                        <span className={`absolute right-3 ${active ? 'text-blue-100' : 'text-gray-500'}`}>
                                                                                            ${product.price.toFixed(2)}
                                                                                        </span>
                                                                                    )}
                                                                                </>
                                                                            )}
                                                                        </Combobox.Option>
                                                                    ))
                                                                )}
                                                            </Combobox.Options>
                                                        </Combobox>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => handleChange(index, "quantity", e.target.value)}
                                                            className="w-full p-2 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            required
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <div className="relative">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                value={item.unitPrice}
                                                                onChange={(e) => handleChange(index, "unitPrice", e.target.value)}
                                                                className="w-full p-2 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-8"
                                                                required
                                                            />
                                                            <span className="absolute left-2 top-2 text-gray-500 text-sm">$</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <input
                                                            type="number"
                                                            value={item.total}
                                                            readOnly
                                                            className="w-full p-2 text-sm rounded-md border border-gray-300 bg-gray-50 font-medium"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(index)}
                                                            className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 transition-colors duration-200"
                                                            title="Remove item"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Step 3: Payment Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Payment Method</h2>

                                    <div className="space-y-1.5">
                                        <Label className="text-sm font-medium text-gray-700">Payment Method</Label>
                                        <Select>
                                            <SelectTrigger className="h-10 text-sm rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                                <SelectValue placeholder="Select method" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-lg shadow-lg border border-gray-200">
                                                <SelectGroup>
                                                    <SelectLabel className="text-xs font-medium text-gray-500">Payment Methods</SelectLabel>
                                                    <SelectItem value="fonepay" className="text-sm">Fonepay</SelectItem>
                                                    <SelectItem value="esewa" className="text-sm">Esewa</SelectItem>
                                                    <SelectItem value="khalti" className="text-sm">Khalti</SelectItem>
                                                    <SelectItem value="cash" className="text-sm">Cash</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-sm font-medium text-gray-700">Payment Status</Label>
                                        <Select>
                                            <SelectTrigger className="h-10 text-sm rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-lg shadow-lg border border-gray-200">
                                                <SelectGroup>
                                                    <SelectLabel className="text-xs font-medium text-gray-500">Status Options</SelectLabel>
                                                    <SelectItem value="paid" className="text-sm">Paid</SelectItem>
                                                    <SelectItem value="partial" className="text-sm">Partially Paid</SelectItem>
                                                    <SelectItem value="pending" className="text-sm">Pending</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Amounts</h2>

                                    <div className="space-y-1.5">
                                        <Label className="text-sm font-medium text-gray-700">Subtotal</Label>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            className="h-10 text-sm rounded-lg border-gray-300 bg-gray-50 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            readOnly
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium text-gray-700">Tax (%)</Label>
                                            <Input
                                                type="number"
                                                placeholder="13"
                                                className="h-10 text-sm rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium text-gray-700">Discount</Label>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    className="h-10 text-sm rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-8"
                                                />
                                                <span className="absolute left-3 top-2.5 text-gray-500 text-sm">$</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Final Amount</h2>

                                    <div className="space-y-1.5">
                                        <Label className="text-sm font-medium text-gray-700">Total Amount</Label>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            className="h-10 text-sm rounded-lg border-gray-300 bg-gray-50 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            readOnly
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium text-gray-700">Paid Amount</Label>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    className="h-10 text-sm rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-8"
                                                />
                                                <span className="absolute left-3 top-2.5 text-gray-500 text-sm">$</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-medium text-gray-700">Due Amount</Label>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    className="h-10 text-sm rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-8"
                                                />
                                                <span className="absolute left-3 top-2.5 text-gray-500 text-sm">$</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 p-4 border-t border-gray-100 bg-white sticky bottom-0 shadow-sm">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => setOpenReceiptForm(false)}
                                className="min-w-[120px] h-10 text-sm font-medium border-gray-300 hover:bg-gray-50 text-gray-700"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="min-w-[120px] h-10 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <BiLoaderAlt className="animate-spin w-4 h-4" />
                                        <span>Processing...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Save className="w-4 h-4" />
                                        <span>Save Receipt</span>
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
};

export default PaymentReceipts;