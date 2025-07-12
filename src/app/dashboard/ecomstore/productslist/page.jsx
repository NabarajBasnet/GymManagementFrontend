'use client';

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
    ArrowUpDown,
    Eye,
    Calendar,
    User,
    Building,
    Phone,
    Mail,
    Globe,
    Filter,
    Download,
    RefreshCw,
    AlertTriangle,
    Info,
    Bug,
    Zap,
    Activity,
    Server,
    Database,
    Shield,
    TrendingUp
} from "lucide-react";
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
import { Check, Save, X, Edit } from 'lucide-react';

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

const ProductsList = () => {
    const queryClient = useQueryClient();
    const { user } = useUser();
    const loggedInUser = user ? user.user : null;

    // Form states
    const [openAddItemForm, setOpenAddItemForm] = useState(false);
    const [openAddMoreForm, setOpenAddMoreForm] = useState(false);
    const [formMode, setFormMode] = useState('create');

    // Sort States
    const [activeTab, setActiveTab] = useState("all");
    const [sortBy, setSortBy] = useState('');
    const [sortOrderDesc, setSortOrderDesc] = useState(true);

    // Search Query
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    // Pagination states
    let limit = 15;
    const [currentPage, setCurrentPage] = useState(1);

    const [itemId, setItemId] = useState('');

    // Get all services and products from server
    const getAllServicesAndProducts = async ({ queryKey }) => {
        const [, page, searchQuery, sortBy, sortOrderDesc, activeTab] = queryKey;
        try {
            const response = await fetch(`https://fitbinary.com/api/accounting/serviceandproducts?page=${page}&limit=${limit}&searchQuery=${searchQuery}&sortBy=${sortBy}&sortOrderDesc=${sortOrderDesc}&activeTab=${activeTab}`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const { data, isLoading } = useQuery({
        queryFn: getAllServicesAndProducts,
        queryKey: ['servicesandproducts', currentPage, debouncedSearchQuery, sortBy, sortOrderDesc, activeTab],
    });

    const { serviceAndProducts, totalPages } = data || {};

    // Other states
    const [selectedItems, setSelectedItems] = useState([]);

    // Toggle a single item's selection
    const toggleIndividualItemSelection = (itemId) => {
        setSelectedItems((prev) =>
            prev.includes(itemId)
                ? prev.filter((id) => id !== itemId)
                : [...prev, itemId]
        );
    };

    // Select/Deselect all items
    const handleSelectAllItems = () => {
        if (selectedItems.length === serviceAndProducts?.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(serviceAndProducts?.map((item) => item.itemId) || []);
        };
    };

    // Debounce Search Query
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery)
        }, 300);

        return () => clearTimeout(timerId);
    }, [searchQuery]);

    // Get single Product or service
    const [productOrService, setProductOrService] = useState(null);

    const getSingleServiceOrProduct = async (itemId) => {
        try {
            const response = await fetch(`https://fitbinary.com/api/accounting/serviceandproducts/${itemId}`);
            const responseBody = await response.json();
            const subCategory = responseBody.item.subCategory
            const taxRate = responseBody.item.taxRate

            setProductOrService(responseBody.item);
            if (response.ok) {
                setItemId(responseBody.item.itemId);
                reset({
                    itemType: responseBody.item.itemType,
                    warehouse: responseBody.item.warehouse,
                    itemName: responseBody.item.itemName,
                    category: responseBody.item.category,
                    subCategory: responseBody.item.subCategory,
                    itemSKU: responseBody.item.SKU,
                    itemDescription: responseBody.item.description,
                    currency: responseBody.item.currency,
                    sellingPrice: responseBody.item.sellingPrice,
                    costPrice: responseBody.item.costPrice,
                    taxRate: responseBody.item.taxRate,
                    maxDiscount: responseBody.item.maxDiscount,
                    itemStatus: responseBody.item.status,
                    itemOnline: responseBody.item.availableOnline
                });
                setFormMode('edit');
                setOpenAddItemForm(true);
            };
        } catch (error) {
            console.log("Error: ", error);
            toast.error(error.message);
        };
    };

    const deleteItems = async (itemId) => {
        try {
            const response = await fetch(`https://fitbinary.com/api/accounting/serviceandproducts/${itemId}`, {
                method: "DELETE",
            });
            const responseBody = await response.json();
            if (response.ok) {
                toast.success(responseBody.message);
                queryClient.invalidateQueries(['servicesandproducts']);
            };
        } catch (error) {
            console.log("Error: ", error.message);
            toast.error(error.message);
        };
    };

    const deleteSelectedItems = async () => {
        try {
            const response = await fetch(`https://fitbinary.com/api/accounting/serviceandproducts`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ itemIds: selectedItems })
            });

            const responseBody = await response.json();
            if (response.ok) {
                toast.success(responseBody.message);
                queryClient.invalidateQueries(['servicesandproducts']);
                setSelectedItems([]);
            } else {
                toast.error(responseBody.message);
                queryClient.invalidateQueries(['servicesandproducts']);
            }
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    return (
        <div className="w-full mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen py-6 px-4">
            <div className="w-full mx-auto">
                {/* Header Section */}
                <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 mb-6">
                    <div className="mb-6">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
                                        <Home className="h-4 w-4 mr-2" />
                                        Home
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator>
                                    <ChevronRight className="h-4 w-4 text-gray-400" />
                                </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/dashboard" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
                                        <LayoutDashboard className="h-4 w-4 mr-2" />
                                        Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator>
                                    <ChevronRight className="h-4 w-4 text-gray-400" />
                                </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-100">
                                        <CircleDollarSign className="h-4 w-4 mr-2" />
                                        Products & Services List
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex items-start space-x-4">
                            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 rounded-2xl shadow-lg">
                                <CircleDollarSign className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Products & Services List
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Manage your inventory of products and services with ease
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Button
                                variant="outline"
                                className="flex items-center space-x-2 text-primary dark:border-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
                            >
                                <RefreshCw className="h-4 w-4" />
                                <span>Refresh</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="flex items-center space-x-2 text-primary dark:border-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
                            >
                                <Download className="h-4 w-4" />
                                <span>Export</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Filters and Actions Section */}
                <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <Tabs
                            defaultValue="all"
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full"
                        >
                            <TabsList className="grid w-full md:w-6/12 grid-cols-3 p-1 h-10 rounded-lg bg-gray-100 dark:bg-gray-800">
                                <TabsTrigger
                                    value="all"
                                    className="text-sm font-medium transition-all rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100"
                                >
                                    All
                                </TabsTrigger>
                                <TabsTrigger
                                    value="services"
                                    className="text-sm font-medium transition-all rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100"
                                >
                                    Services
                                </TabsTrigger>
                                <TabsTrigger
                                    value="products"
                                    className="text-sm font-medium transition-all rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100"
                                >
                                    Products
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search items..."
                                    className="w-full pl-8 bg-white dark:border-none w-full rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                            <Button variant="outline" size="icon" className="dark:bg-gray-700 dark:border-gray-600">
                                <Filter className="h-4 w-4 text-primary" />
                            </Button>

                            <div className="flex items-center gap-2">
                                {selectedItems.length > 0 && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span>Delete {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}</span>
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="border-red-200 dark:bg-red-950/50 dark:border-red-800">
                                            <AlertDialogHeader>
                                                <div className="flex items-center gap-3">
                                                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />
                                                    <AlertDialogTitle className="text-red-600 dark:text-red-500">
                                                        Confirm Deletion
                                                    </AlertDialogTitle>
                                                </div>
                                                <AlertDialogDescription className="text-left pt-3">
                                                    You're about to permanently delete {selectedItems.length} selected item{selectedItems.length !== 1 ? 's' : ''}.
                                                    <span className="block mt-2 font-medium text-red-600 dark:text-red-400">
                                                        This action cannot be undone!
                                                    </span>
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="border-gray-300 text-primary dark:bg-gray-800 dark:border-none hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800 focus-visible:ring-red-500"
                                                    onClick={() => deleteSelectedItems()}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete Permanently
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Table Section */}
                <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader />
                        </div>
                    ) : Array.isArray(serviceAndProducts) && serviceAndProducts.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                {loggedInUser?.role !== 'Gym Admin' && (
                                                    <Checkbox
                                                        checked={serviceAndProducts?.length > 0 && selectedItems.length === serviceAndProducts.length}
                                                        onCheckedChange={handleSelectAllItems}
                                                    />
                                                )}
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    Item ID
                                                    <ArrowUpDown
                                                        onClick={() => {
                                                            setSortBy('itemId');
                                                            setSortOrderDesc(!sortOrderDesc);
                                                        }}
                                                        className="ml-2 h-4 w-4 cursor-pointer"
                                                    />
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    Name
                                                    <ArrowUpDown
                                                        onClick={() => {
                                                            setSortBy('itemName');
                                                            setSortOrderDesc(!sortOrderDesc);
                                                        }}
                                                        className="ml-2 h-4 w-4 cursor-pointer"
                                                    />
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    Type
                                                    <ArrowUpDown
                                                        onClick={() => {
                                                            setSortBy('itemType');
                                                            setSortOrderDesc(!sortOrderDesc);
                                                        }}
                                                        className="ml-2 h-4 w-4 cursor-pointer"
                                                    />
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    Category
                                                    <ArrowUpDown
                                                        onClick={() => {
                                                            setSortBy('category');
                                                            setSortOrderDesc(!sortOrderDesc);
                                                        }}
                                                        className="ml-2 h-4 w-4 cursor-pointer"
                                                    />
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    Price
                                                    <ArrowUpDown
                                                        onClick={() => {
                                                            setSortBy('sellingPrice');
                                                            setSortOrderDesc(!sortOrderDesc);
                                                        }}
                                                        className="ml-2 h-4 w-4 cursor-pointer"
                                                    />
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    Tax Rate
                                                    <ArrowUpDown
                                                        onClick={() => {
                                                            setSortBy('taxRate');
                                                            setSortOrderDesc(!sortOrderDesc);
                                                        }}
                                                        className="ml-2 h-4 w-4 cursor-pointer"
                                                    />
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    Status
                                                    <ArrowUpDown
                                                        onClick={() => {
                                                            setSortBy('status');
                                                            setSortOrderDesc(!sortOrderDesc);
                                                        }}
                                                        className="ml-2 h-4 w-4 cursor-pointer"
                                                    />
                                                </div>
                                            </th>
                                            {loggedInUser?.role !== 'Gym Admin' && (
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {serviceAndProducts.map((item) => (
                                            <tr key={item.itemId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {loggedInUser?.role !== 'Gym Admin' && (
                                                        <Checkbox
                                                            checked={selectedItems.includes(item.itemId)}
                                                            onCheckedChange={() => toggleIndividualItemSelection(item.itemId)}
                                                        />
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                    {item.itemId}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {item.itemName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.itemType === "service"
                                                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                                        }`}>
                                                        {item.itemType.charAt(0).toUpperCase() + item.itemType.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {item.category}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                                                    ${item.sellingPrice.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                                                    {item.taxRate}%
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.status === 'Active'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        : item.status === 'Inactive'
                                                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                {loggedInUser?.role !== 'Gym Admin' && (
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => getSingleServiceOrProduct(item.itemId)}
                                                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            This action cannot be undone. This will permanently delete this item.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            className="bg-red-600 hover:bg-red-700"
                                                                            onClick={() => deleteItems(item.itemId)}
                                                                        >
                                                                            Delete
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
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-600">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Showing <span className="font-medium">1</span> to <span className="font-medium">{serviceAndProducts.length}</span> of{' '}
                                    <span className="font-medium">{serviceAndProducts.length}</span> results
                                </div>
                                <Pagination
                                    total={totalPages || 1}
                                    page={currentPage || 1}
                                    onChange={setCurrentPage}
                                    withEdges={true}
                                    siblings={1}
                                    boundaries={1}
                                    classNames={{
                                        item: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 relative inline-flex items-center px-4 py-2 text-sm font-medium",
                                        active: "z-10 bg-blue-600 border-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:border-blue-700",
                                        dots: "relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                                    }}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="w-full p-12 text-center">
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <Server className="h-12 w-12 text-gray-400" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No items found</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Get started by adding a new item.
                                </p>
                                {loggedInUser?.role !== 'Gym Admin' && (
                                    <Button
                                        onClick={() => {
                                            setOpenAddItemForm(true);
                                            setFormMode('create');
                                        }}
                                        className="mt-4"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add New Item
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductsList;
