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
import { Check,     Save, X, Edit, } from 'lucide-react';

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

    // Items states
    const [isActive, setIsActive] = useState(false);
    const [itemType, setItemType] = useState('');
    const [warehouse, setWareHouse] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [currency, setCurrency] = useState('');
    const [taxRate, setTaxRate] = useState('');

    const [itemId, setItemId] = useState('');

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

    // Get all services and products from server
    const getAllServicesAndProducts = async ({ queryKey }) => {
        const [, page, searchQuery, sortBy, sortOrderDesc, activeTab] = queryKey;
        try {
            const response = await fetch(`http://localhost:3000/api/accounting/serviceandproducts?page=${page}&limit=${limit}&searchQuery=${searchQuery}&sortBy=${sortBy}&sortOrderDesc=${sortOrderDesc}&activeTab=${activeTab}`);
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
            const response = await fetch(`http://localhost:3000/api/accounting/serviceandproducts/${itemId}`);
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
            const response = await fetch(`http://localhost:3000/api/accounting/serviceandproducts/${itemId}`, {
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
            const response = await fetch(`http://localhost:3000/api/accounting/serviceandproducts`, {
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
               <div className="w-full bg-white mt-4 dark:bg-gray-800 space-y-4 p-4 border dark:border-none rounded-sm md:space-y-0 flex justify-between items-end">
                    <div className="w-full flex items-center justify-between">
                              <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                  <div className="py-6 lg:py-8">
                                    {/* Breadcrumb */}
                                    <div className="mb-8">
                                      <Breadcrumb>
                                        <BreadcrumbList className="flex items-center space-x-1">
                                          <BreadcrumbItem>
                                            <BreadcrumbLink
                                              href="/"
                                              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
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
                                              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                                            >
                                              <LayoutDashboard className="h-4 w-4 mr-2" />
                                              Dashboard
                                            </BreadcrumbLink>
                                          </BreadcrumbItem>
                                          <BreadcrumbSeparator>
                                            <ChevronRight className="h-4 w-4 text-gray-400" />
                                          </BreadcrumbSeparator>
                                          <BreadcrumbItem>
                                            <BreadcrumbPage className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                              <Server className="h-4 w-4 mr-2" />
                                              System Logs
                                            </BreadcrumbPage>
                                          </BreadcrumbItem>
                                        </BreadcrumbList>
                                      </Breadcrumb>
                                    </div>
                        
                                    {/* Title and Actions */}
                                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start space-x-4">
                                          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-2xl shadow-lg shadow-blue-500/25 dark:shadow-blue-500/20">
                                            <Server className="h-8 w-8 text-white" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                                              System Logs
                                            </h1>
                                            <p className="text-base text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                                              Monitor and analyze application activities, errors, and system events in real-time
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                        
                                      <div className="flex items-center space-x-3">
                                        <Button
                                          onClick={() => refetch()}
                                          variant="outline"
                                          className="flex items-center space-x-2 dark:border-nones text-primary dark:bg-gray-700 border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        >
                                          <RefreshCw className="h-4 w-4" />
                                          <span>Refresh</span>
                                        </Button>
                                        <Button
                                          variant="outline"
                                          className="flex items-center space-x-2 dark:border-nones text-primary dark:bg-gray-700 border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        >
                                          <Download className="h-4 w-4" />
                                          <span>Export</span>
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                        <div className="w-full flex items-center justify-end space-x-4">
                            {selectedItems.length === 0 ? (
                                <></>
                            ) : (
                                <AlertDialog className='md:space-x-4'>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            className='rounded-sm'
                                            variant="destructive"
                                            disabled={selectedItems.length === 0}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete Selected ({selectedItems.length})
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the assigned task
                                                and remove data from servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                className='bg-red-600 hover:bg-red-700'
                                                onClick={() => deleteSelectedItems()}
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                            {loggedInUser?.role === 'Gym Admin' ? (
                                <></>
                            ) : (
                                <Button
                                    className='rounded-sm md:space-x-4'
                                    onClick={() => {
                                        setOpenAddItemForm(true);
                                    }
                                    }>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New Item
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

            <div className="w-full">
             <div className="flex flex-col md:flex-row md:items-center my-4 border px-1 py-3 rounded-sm justify-between gap-4 bg-white dark:bg-gray-800 dark:border-none">
                    <Tabs
                        defaultValue="all"
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full md:w-auto"
                    >
                        <TabsList className="grid grid-cols-3 w-full md:w-auto dark:bg-gray-900">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="services">Services</TabsTrigger>
                            <TabsTrigger value="products">Products</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search items..."
                                className="pl-8 w-full rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none md:w-64"
                            />
                        </div>
                        <Button variant="outline" className='dark:bg-gray-900 dark:border-none' size="icon">
                            <Filter className="h-4 w-4 text-primary" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="w-full bg-white dark:bg-gray-800 dark:border-none rounded-lg border shadow">
                {Array.isArray(serviceAndProducts) && serviceAndProducts.length > 0 ? (
                    <div className="w-full">
                        <div className="overflow-x-auto">
                            {isLoading ? (
                                <Loader />
                            ) : (
                                <table className="text-sm w-full">
                                    <thead>
                                        <tr className="border-b bg-gray-100">
                                            <th className="h-16 px-4 text-left font-medium dark:text-gray-200">
                                                {loggedInUser?.role === 'Gym Admin' ? (
                                                    <>
                                                    </>
                                                ) : (
                                                    <Checkbox
                                                        checked={serviceAndProducts?.length > 0 && selectedItems.length === serviceAndProducts.length}
                                                        onCheckedChange={handleSelectAllItems}
                                                    />
                                                )}
                                            </th>

                                            <th className="h-16 px-4 text-left font-medium">
                                                <div className="flex items-center dark:text-gray-200">
                                                    Item ID
                                                    <ArrowUpDown
                                                        onClick={() => {
                                                            setSortBy('itemId');
                                                            setSortOrderDesc(!sortOrderDesc);
                                                        }}
                                                        className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                                </div>
                                            </th>
                                            <th className="h-16 px-4 text-left font-medium">
                                                <div className="flex items-center dark:text-gray-200">
                                                    Name
                                                    <ArrowUpDown
                                                        onClick={() => {
                                                            setSortBy('itemName');
                                                            setSortOrderDesc(!sortOrderDesc);
                                                        }}
                                                        className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                                </div>
                                            </th>
                                            <th className="h-10 px-4 text-left font-medium">
                                                <div className="flex items-center dark:text-gray-200">
                                                    Type
                                                    <ArrowUpDown
                                                        onClick={() => {
                                                            setSortBy('itemType');
                                                            setSortOrderDesc(!sortOrderDesc);
                                                        }}
                                                        className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                                </div>
                                            </th>
                                            <th className="h-10 px-4 text-left font-medium">
                                                <div className="flex items-center dark:text-gray-200">
                                                    Category
                                                    <ArrowUpDown
                                                        onClick={() => {
                                                            setSortBy('category');
                                                            setSortOrderDesc(!sortOrderDesc);
                                                        }}
                                                        className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                                </div>
                                            </th>
                                            <th className="h-10 px-4 text-right font-medium">
                                                <div className="flex items-center dark:text-gray-200">
                                                    Price
                                                    <ArrowUpDown
                                                        onClick={() => {
                                                            setSortBy('sellingPrice');
                                                            setSortOrderDesc(!sortOrderDesc);
                                                        }}
                                                        className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                                </div>
                                            </th>
                                            <th className="px-4 text-right font-medium">
                                                <div className="flex items-center dark:text-gray-200">
                                                    TaxRate
                                                    <ArrowUpDown
                                                        onClick={() => {
                                                            setSortBy('taxRate');
                                                            setSortOrderDesc(!sortOrderDesc);
                                                        }}
                                                        className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                                </div>
                                            </th>
                                            <th className="h-10 px-4 text-left font-medium">
                                                <div className="flex items-center dark:text-gray-200">
                                                    Status
                                                    <ArrowUpDown
                                                        onClick={() => {
                                                            setSortBy('status');
                                                            setSortOrderDesc(!sortOrderDesc);
                                                        }}
                                                        className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                                </div>
                                            </th>
                                            {loggedInUser?.role === 'Gym Admin' ? (
                                                <></>
                                            ) : (
                                                <th className="h-10 px-4 text-right font-medium">Actions</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {serviceAndProducts.map((item) => (
                                            <tr key={item.itemId} className="border-b text-sm hover:bg-muted/50">
                                                <td className="align-middle text-center font-medium">
                                                    {loggedInUser?.role === 'Gym Admin' ? (
                                                        <>
                                                        </>
                                                    ) : (
                                                        <Checkbox
                                                            checked={selectedItems.includes(item.itemId)}
                                                            onCheckedChange={() => toggleIndividualItemSelection(item.itemId)}
                                                        />
                                                    )}
                                                </td>
                                                <td className="align-middle md:text-center font-medium">{item.itemId}</td>
                                                <td className="p-4 align-middle font-medium">{item.itemName}</td>
                                                <td className="p-4 align-middle">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.type === "service"
                                                        ? "bg-purple-100 text-purple-800"
                                                        : "bg-blue-100 text-blue-800"
                                                        }`}>
                                                        {item.itemType.charAt(0).toUpperCase() + item.itemType.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="p-4 align-middle">{item.category}</td>
                                                <td className="p-4 align-middle text-center">${item.sellingPrice.toFixed(2)}</td>
                                                <td className="p-4 align-middle text-center">{item.taxRate}%</td>
                                                <td className="p-4 align-middle">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.status === 'Active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : item.status === 'Inactive'
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                            }`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </td>
                                                {loggedInUser?.role === 'Gym Admin' ? (
                                                    <></>
                                                ) : (
                                                    <td className="flex items-center p-4 align-middle justify-end">
                                                        <Edit
                                                            onClick={() => getSingleServiceOrProduct(item.itemId)}
                                                            className="h-4 w-4" />
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    className='bg-transparent hover:bg-transparent hover:text-black text-gray-800'
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This action cannot be undone. This will permanently delete this item and remove your data from our servers.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => deleteItems(item.itemId)}>Continue</AlertDialogAction>
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
                        <div className="flex items-center justify-between px-4 py-2">
                            <div className="text-sm text-muted-foreground">
                                Showing <strong>{serviceAndProducts ? serviceAndProducts.length : ''}</strong> of <strong>{serviceAndProducts ? serviceAndProducts.length : ''}</strong> items
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="flex justify-center py-2">
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
                ) : (
                    <div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-sm bg-muted/50">
                                        <th className="h-16 px-4 text-left font-medium">
                                            <Checkbox id="terms" />
                                        </th>

                                        <th className="h-16 px-4 text-left font-medium">
                                            <div className="flex items-center dark:text-gray-200">
                                                Item ID
                                                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                            </div>
                                        </th>
                                        <th className="h-16 px-4 text-left font-medium">
                                            <div className="flex items-center dark:text-gray-200">
                                                Name
                                                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                            </div>
                                        </th>
                                        <th className="h-10 px-4 text-left font-medium">
                                            <div className="flex items-center dark:text-gray-200">
                                                Type
                                                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                            </div>
                                        </th>
                                        <th className="h-10 px-4 text-left font-medium">
                                            <div className="flex items-center dark:text-gray-200">
                                                Category
                                                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                            </div>
                                        </th>
                                        <th className="h-10 px-4 text-right font-medium">
                                            <div className="flex items-center dark:text-gray-200">
                                                Price
                                                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                            </div>
                                        </th>
                                        <th className="h-10 px-4 text-right font-medium">
                                            <div className="flex items-center dark:text-gray-200">
                                                Tax Rate
                                                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                            </div>
                                        </th>
                                        <th className="h-10 px-4 text-left font-medium">
                                            <div className="flex items-center dark:text-gray-200">
                                                Status
                                                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                            </div>
                                        </th>
                                        <th className="h-10 px-4 text-right font-medium dark:text-gray-200">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan={9} className="text-center py-6 text-sm text-muted-foreground">
                                            Items not found.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-300 px-4 py-2">
                            <div className="text-sm text-muted-foreground">
                                Showing <strong>{data ? data.length : ''}</strong> of <strong>{data ? data.length : ''}</strong> items
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="flex justify-center py-2">
                                    <Pagination
                                        total={1}
                                        page={1}
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
                )}
            </div>
        </div>
    );
};

export default ProductsList;
