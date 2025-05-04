'use client';

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
import { BiLoaderAlt } from "react-icons/bi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox"
import { IoIosInformationCircle } from "react-icons/io";
import Pagination from '@/components/ui/CustomPagination';
import React, { useEffect, useState } from 'react';
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

    // Form states
    const [openReceiptForm, setOpenReceiptForm] = useState(false);
    console.log('Open Receipt: ', openReceiptForm);

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
                    <form className="bg-white w-11/12 md:w-10/12 h-[90vh] rounded-lg">
                        {/* Header */}
                        <div className="w-full flex justify-between p-5 items-center">
                            <h1 className="text-lg font-bold">Create Receipts</h1>
                            <X
                                className="w-4 h-4 cursor-pointer"
                                onClick={() => setOpenReceiptForm(false)} />
                        </div>
                        <div className='border-b'></div>
                        {/* Body */}
                        <div>

                        </div>

                        {/* Footer */}
                        <div></div>
                    </form>
                </div>
            )}
        </div>
    )
};

export default PaymentReceipts;