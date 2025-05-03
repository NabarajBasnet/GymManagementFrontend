'use client';

import { BiLoaderAlt } from "react-icons/bi";
import { IoAddCircle } from "react-icons/io5";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox"
import { IoIosInformationCircle } from "react-icons/io";
import Pagination from '@/components/ui/CustomPagination';
import React, { useEffect, useState } from 'react';
import { Check, Plus, Search, Filter, Trash2, Save, X, Edit, ArrowUpDown, MoreHorizontal } from 'lucide-react';

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

const currencies = [
    {
        code: "NPR",
        name: "Nepalese Rupee",
        symbol: "₨"
    },
    {
        code: "INR",
        name: "Indian Rupee",
        symbol: "₹"
    },
    {
        code: "USD",
        name: "United States Dollar",
        symbol: "$"
    },
    {
        code: "EUR",
        name: "Euro",
        symbol: "€"
    },
    {
        code: "GBP",
        name: "British Pound Sterling",
        symbol: "£"
    },
    {
        code: "JPY",
        name: "Japanese Yen",
        symbol: "¥"
    },
    {
        code: "CNY",
        name: "Chinese Yuan",
        symbol: "¥"
    },
    {
        code: "AUD",
        name: "Australian Dollar",
        symbol: "A$"
    },
    {
        code: "CAD",
        name: "Canadian Dollar",
        symbol: "C$"
    }
];

const categories = ["Membership", "Training", "Nutrition", "Merchandise", "Aquatics", "Equipment"];

const subCategories = {
    Membership: ["Monthly", "Quarterly", "Half-Yearly", "Yearly", "Student", "Corporate"],
    Training: ["Normal Training", "Personal Training", "Group Classes", "Yoga", "CrossFit", "Zumba", "Online Coaching"],
    Nutrition: ["Supplements", "Diet Plans", "Protein", "Vitamins", 'Creatines', "Consultation", "Others"],
    Merchandise: ["T-Shirts", "Shakers", "Gym Bags", "Caps", "Wristbands", "Others"],
    Aquatics: ["Swimming Lessons", "Aqua Therapy", "Pool Membership", "Hydro Fitness"],
    Equipment: ["Treadmills", "Dumbbells", "Resistance Bands", "Mats", "Foam Rollers", "Barbells", "Plates"],
};

const ServiceAndProducts = () => {

    const queryClient = useQueryClient();

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

    const [openAddItemForm, setOpenAddItemForm] = useState(false);
    const [openAddMoreForm, setOpenAddMoreForm] = useState(false);

    // Items states

    const [isAvailableOnline, setIsAvailableOnline] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [itemType, setItemType] = useState('');
    const [warehouse, setWareHouse] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [currency, setCurrency] = useState('');
    const [taxRate, setTaxRate] = useState('');

    // React Hook Form
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        setError
    } = useForm();

    const handleAddItem = async (data) => {
        try {
            const { itemName, SKU, description, sellingPrice, costPrice, maxDiscount } = data;
            const finalData = {
                itemName,
                SKU,
                description,
                sellingPrice,
                costPrice,
                maxDiscount,
                isAvailableOnline,
                isActive,
                itemType,
                warehouse,
                category,
                subCategory,
                currency,
                taxRate
            };

            const response = await fetch('http://88.198.112.156:3000/api/accounting/serviceandproducts', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalData),
            });

            const responseBody = await response.json();

            if (response.ok && response.status === 200) {
                toast.success(responseBody.message),
                    reset();
                setOpenAddItemForm(false);
                queryClient.invalidateQueries(['servicesandproducts']);
            } else {
                toast.error(responseBody.message);
            };

        } catch (error) {
            console.log('Error: ', error);
            toast.error('Internal Server Error!');
        };
    };


    // Get all services and products from server
    const getAllServicesAndProducts = async ({ queryKey }) => {
        const [, page, searchQuery, sortBy, sortOrderDesc, activeTab] = queryKey;
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/accounting/serviceandproducts?page=${page}&&limit=${limit}&&searchQuery=${searchQuery}&&sortBy=${sortBy}&&sortOrderDesc=${sortOrderDesc}&&activeTab=${activeTab}`);
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

    // Debounce Search Query
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery)
        }, 300);

        return () => clearTimeout(timerId);
    }, [searchQuery]);

    return (
        <div className="w-full mx-auto py-6 px-4">
            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className='w-full'>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-1">
                                        <BreadcrumbEllipsis className="h-4 w-4" />
                                    </DropdownMenuTrigger>
                                </DropdownMenu>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink>Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink>Billing</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Services & Products</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>

            <div className="w-full">
                <div className="w-full flex justify-between items-center">
                    <h1 className="text-xl font-bold mt-3">Services & Products</h1>
                    <Button
                        className='rounded-sm'
                        onClick={() => {
                            setOpenAddItemForm(true);
                        }
                        }>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Item
                    </Button>
                </div>

                <div className="flex flex-col md:flex-row md:items-center my-4 border px-1 py-3 rounded-sm justify-between gap-4">
                    <Tabs
                        defaultValue="all"
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full md:w-auto"
                    >
                        <TabsList className="grid grid-cols-3 w-full md:w-auto">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="services">Services</TabsTrigger>
                            <TabsTrigger value="products">Products</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search items..."
                                className="pl-8 w-full md:w-64"
                            />
                        </div>
                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="w-full rounded-md border shadow">
                {Array.isArray(serviceAndProducts) && serviceAndProducts.length > 0 ? (
                    <div className="w-full">
                        <div className="overflow-x-auto">
                            {isLoading ? (
                                <Loader />
                            ) : (
                                <table className="text-sm w-full">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="h-16 px-4 text-left font-medium">
                                                <Checkbox id="terms" />
                                            </th>

                                            <th className="h-16 px-4 text-left font-medium">
                                                <div className="flex items-center">
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
                                                <div className="flex items-center">
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
                                                <div className="flex items-center">
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
                                                <div className="flex items-center">
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
                                                <div className="flex items-center">
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
                                                <div className="flex items-center">
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
                                                <div className="flex items-center">
                                                    Status
                                                    <ArrowUpDown
                                                        onClick={() => {
                                                            setSortBy('status');
                                                            setSortOrderDesc(!sortOrderDesc);
                                                        }}
                                                        className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                                </div>
                                            </th>
                                            <th className="h-10 px-4 text-right font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {serviceAndProducts.map((item) => (
                                            <tr key={item.itemId} className="border-b text-sm hover:bg-muted/50">
                                                <td className="align-middle text-center font-medium">
                                                    <Checkbox id="terms" />
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
                                                <td className="p-4 align-middle text-center">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem>
                                                                {item.active ? (
                                                                    <>
                                                                        <X className="mr-2 h-4 w-4" />
                                                                        Deactivate
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Check className="mr-2 h-4 w-4" />
                                                                        Activate
                                                                    </>
                                                                )}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                        <div className="flex items-center justify-between border-t px-4 py-4">
                            <div className="text-sm text-muted-foreground">
                                Showing <strong>{serviceAndProducts ? serviceAndProducts.length : ''}</strong> of <strong>{serviceAndProducts ? serviceAndProducts.length : ''}</strong> items
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
                                            <div className="flex items-center">
                                                Item ID
                                                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                            </div>
                                        </th>
                                        <th className="h-16 px-4 text-left font-medium">
                                            <div className="flex items-center">
                                                Name
                                                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                            </div>
                                        </th>
                                        <th className="h-10 px-4 text-left font-medium">
                                            <div className="flex items-center">
                                                Type
                                                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                            </div>
                                        </th>
                                        <th className="h-10 px-4 text-left font-medium">
                                            <div className="flex items-center">
                                                Category
                                                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                            </div>
                                        </th>
                                        <th className="h-10 px-4 text-right font-medium">
                                            <div className="flex items-center">
                                                Price
                                                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                            </div>
                                        </th>
                                        <th className="h-10 px-4 text-right font-medium">
                                            <div className="flex items-center">
                                                Tax Rate
                                                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                            </div>
                                        </th>
                                        <th className="h-10 px-4 text-left font-medium">
                                            <div className="flex items-center">
                                                Status
                                                <ArrowUpDown className="ml-2 h-4 w-4 cursor-pointer hover:text-gray-700 transition-color duration-500" />
                                            </div>
                                        </th>
                                        <th className="h-10 px-4 text-right font-medium">Actions</th>
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
                        <div className="flex items-center justify-between border-t px-4 py-4">
                            <div className="text-sm text-muted-foreground">
                                Showing <strong>{data ? data.length : ''}</strong> of <strong>{data ? data.length : ''}</strong> items
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="flex justify-center py-4">
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

            {/* Open Add More Form */}
            {openAddMoreForm && (
                <div className="fixed inset-0 z-[51] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <form
                        onSubmit={handleSubmit(handleAddItem)}
                        className="relative bg-white rounded-md shadow-xl w-full max-w-md md:max-w-lg p-6 space-y-4"
                    >
                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={() => setOpenAddMoreForm(false)}
                            className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>

                        {/* Title */}
                        <h2 className="text-lg font-semibold text-gray-800">Add New Item</h2>

                        {/* Input Field */}
                        <div>
                            <Label htmlFor="itemName" className="block font-medium text-sm">
                                Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="itemName"
                                {...register("itemName")}
                                placeholder="Add Item"
                                className="mt-1 w-full"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Add Item
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Open Add Items Form */}
            {openAddItemForm && (
                <div className={`fixed inset-0 bg-black/50 rounded-sm backdrop-blur-sm flex items-center justify-center z-50 p-4`}>
                    <form onSubmit={handleSubmit(handleAddItem)} className="bg-white rounded-sm shadow-xl w-11/12 md:w-10/12 max-h-[90vh] flex flex-col">
                        {/* Header Section */}
                        <header className='flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10'>
                            <h1 className='text-xl font-semibold flex items-center gap-2'>
                                <IoIosInformationCircle className="text-blue-500" />
                                Add New Product
                            </h1>
                            <button
                                onClick={() => setOpenAddItemForm(false)}
                                className='p-1 rounded-full hover:bg-gray-100 transition-colors'
                            >
                                <X className='w-5 h-5 text-gray-500' />
                            </button>
                        </header>

                        {/* Form Section */}
                        <div className="overflow-y-auto flex-1 p-4 md:p-6">
                            <div className="space-y-6">
                                <p className="text-gray-600 text-sm">
                                    Fill in the details to add a new product to inventory
                                </p>

                                {/* General Information Section */}
                                <div className="border rounded-sm p-4 space-y-4">
                                    <h3 className="font-medium text-lg">General Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                        {/* Item Type */}
                                        <div className="space-y-2">
                                            <div className='flex items-center justify-between'>
                                                <Label className="font-medium flex-1">Item Type</Label>
                                                <Button variant="ghost" onClick={() => setOpenAddMoreForm(true)} size="sm" className="text-black p-0 h-auto hover:bg-transparent">
                                                    <IoAddCircle className="mr-1" />
                                                    Add More
                                                </Button>
                                            </div>
                                            <Select onValueChange={(value) => setItemType(value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Item Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Select</SelectLabel>
                                                        <SelectItem value='Product'>Product</SelectItem>
                                                        <SelectItem value='Service'>Service</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Warehouse */}
                                        <div className="space-y-2">
                                            <div className='flex items-center justify-between'>
                                                <Label className="font-medium flex-1">Warehouse</Label>
                                                <Button variant="ghost" size="sm" onClick={() => setOpenAddMoreForm(true)} className="text-black p-0 h-auto hover:bg-transparent">
                                                    <IoAddCircle className="mr-1" />
                                                    Add More
                                                </Button>
                                            </div>
                                            <Select onValueChange={(value) => setWareHouse(value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Warehouse" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Select</SelectLabel>
                                                        <SelectItem value='Warehouse One'>Warehouse One</SelectItem>
                                                        <SelectItem value='Warehouse Two'>Warehouse Two</SelectItem>
                                                        <SelectItem value='Warehouse Three'>Warehouse Three</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Name */}
                                        <div className="space-y-2">
                                            <div className='flex items-center justify-between'>
                                                <Label className="font-medium" htmlFor="itemName">
                                                    Name <span className="text-red-500">*</span>
                                                </Label>
                                                <div className="h-[4px]"></div> {/* Invisible spacer for alignment */}
                                            </div>
                                            <Input
                                                id="itemName"
                                                {...register('itemName', { required: 'Item name is required' })}
                                                placeholder="Enter name"
                                                className="w-full"
                                            />
                                        </div>

                                        {/* Category */}
                                        <div className="space-y-2">
                                            <div className='flex items-center justify-between'>
                                                <Label className="font-medium flex-1">Category</Label>
                                                <Button variant="ghost" size="sm" onClick={() => setOpenAddMoreForm(true)} className="text-black p-0 h-auto hover:bg-transparent">
                                                    <IoAddCircle className="mr-1" />
                                                    Add More
                                                </Button>
                                            </div>
                                            <Select onValueChange={(value) => setCategory(value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Select</SelectLabel>
                                                        {categories.map((category, index) =>
                                                            <SelectItem key={index} value={category}>{category}</SelectItem>
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Sub Category */}
                                        <div className="space-y-2">
                                            <div className='flex items-center justify-between'>
                                                <Label className="font-medium flex-1">Sub Category</Label>
                                                <Button variant="ghost" size="sm" onClick={() => setOpenAddMoreForm(true)} className="text-black p-0 h-auto hover:bg-transparent">
                                                    <IoAddCircle className="mr-1" />
                                                    Add More
                                                </Button>
                                            </div>
                                            <Select onValueChange={(value) => setSubCategory(value)} disabled={!category}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Sub Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Select</SelectLabel>
                                                        {(subCategories[category] || []).map((subCat, index) => (
                                                            <SelectItem key={index} value={subCat}>{subCat}</SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* SKU/Code */}
                                        <div className="space-y-2">
                                            <div className='flex items-center justify-between'>
                                                <Label className="font-medium" htmlFor="itemSKU">
                                                    SKU/Code
                                                </Label>
                                                <div className="h-[4px]"></div> {/* Invisible spacer for alignment */}
                                            </div>
                                            <Input
                                                id="itemSKU"
                                                {...register('SKU')}
                                                placeholder="Enter unique SKU"
                                                className="w-full"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2 md:col-span-2 lg:col-span-2">
                                            <div className='flex items-center justify-between'>
                                                <Label className="font-medium flex-1" htmlFor="itemDescription">
                                                    Description
                                                </Label>
                                                <div className="h-[32px]"></div> {/* Invisible spacer for alignment */}
                                            </div>
                                            <textarea
                                                id="itemDescription"
                                                {...register('description', { required: 'Item description is required' })}
                                                placeholder="Enter description"
                                                className="flex w-full rounded-sm border focus:outline-none focus:border-blue-500 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing Section */}
                                <div className="border rounded-sm p-4 space-y-4">
                                    <h3 className="font-medium text-lg">Pricing</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                        {/* Currency */}
                                        <div className="space-y-2">
                                            <div className='flex items-center justify-between'>
                                                <Label className="font-medium flex-1">Currency</Label>
                                                <div className="h-[32px]"></div> {/* Invisible spacer for alignment */}
                                            </div>
                                            <Select onValueChange={(value) => setCurrency(value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Currency" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Select</SelectLabel>
                                                        {currencies.map((currency, index) =>
                                                            <SelectItem key={index} value={`${currency.symbol}-${currency.name}`}>{currency.code}</SelectItem>
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Selling Price */}
                                        <div className="space-y-2">
                                            <div className='flex items-center justify-between'>
                                                <Label className="font-medium flex-1" htmlFor="itemPrice">
                                                    Selling Price <span className="text-red-500">*</span>
                                                </Label>
                                                <div className="h-[32px]"></div> {/* Invisible spacer for alignment */}
                                            </div>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2.5 text-gray-500">{currency.split('-')[0]}</span>
                                                <Input
                                                    id="itemPrice"
                                                    {...register('sellingPrice', { required: 'Item selling price is required' })}
                                                    className="pl-8 w-full"
                                                    placeholder="0.00"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                />
                                            </div>
                                        </div>

                                        {/* Cost Price */}
                                        <div className="space-y-2">
                                            <div className='flex items-center justify-between'>
                                                <Label className="font-medium flex-1" htmlFor="itemCostPrice">
                                                    Cost Price
                                                </Label>
                                                <div className="h-[32px]"></div> {/* Invisible spacer for alignment */}
                                            </div>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2.5 text-gray-500">{currency.split('-')[0]}</span>
                                                <Input
                                                    id="itemCostPrice"
                                                    {...register('costPrice')}
                                                    className="pl-8 w-full"
                                                    placeholder="0.00"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                />
                                            </div>
                                        </div>

                                        {/* Tax Rate */}
                                        <div className="space-y-2">
                                            <div className='flex items-center justify-between'>
                                                <Label className="font-medium flex-1">Tax Rate</Label>
                                                <div className="h-[32px]"></div> {/* Invisible spacer for alignment */}
                                            </div>
                                            <Select onValueChange={(value) => setTaxRate(value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Tax Rate" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Select</SelectLabel>
                                                        <SelectItem value='3'>3 %</SelectItem>
                                                        <SelectItem value='5'>5 %</SelectItem>
                                                        <SelectItem value='7'>7 %</SelectItem>
                                                        <SelectItem value='9'>9 %</SelectItem>
                                                        <SelectItem value='11'>11 %</SelectItem>
                                                        <SelectItem value='13'>13 %</SelectItem>
                                                        <SelectItem value='15'>15 %</SelectItem>
                                                        <SelectItem value='17'>17 %</SelectItem>
                                                        <SelectItem value='20'>20 %</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Available Discount Percentage */}
                                        <div className="space-y-2">
                                            <div className='flex items-center justify-between'>
                                                <Label className="font-medium flex-1" htmlFor="maxDiscount">
                                                    Max Discount Percent
                                                </Label>
                                                <div className="h-[32px]"></div> {/* Invisible spacer for alignment */}
                                            </div>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2.5 text-gray-500">%</span>
                                                <Input
                                                    id="maxDiscount"
                                                    {...register('maxDiscount')}
                                                    className="pl-8 w-full"
                                                    placeholder="0.00"
                                                    type="number"
                                                    step="1"
                                                    min="0"
                                                    max="80"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Section */}
                                <div className="border rounded-sm p-4 space-y-4">
                                    <h3 className="font-medium text-lg">Status</h3>
                                    <div className="flex flex-wrap items-center gap-4 pt-2">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="itemActive"
                                                checked={isActive}
                                                onCheckedChange={(value) => setIsActive(value)}
                                            />
                                            <Label htmlFor="itemActive">Active</Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="itemOnline"
                                                checked={isAvailableOnline}
                                                onCheckedChange={(value) => setIsAvailableOnline(value)}
                                            />
                                            <Label htmlFor="itemOnline">Available Online</Label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer with actions */}
                        <footer className="flex justify-end gap-3 p-4 border-t sticky bottom-0 bg-white">
                            <Button
                                variant="outline"
                                type='button'
                                onClick={() => setOpenAddItemForm(false)}
                                className="min-w-[100px]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type='submit'
                                className="min-w-[100px] bg-blue-600 hover:bg-blue-700">
                                {isSubmitting ? <BiLoaderAlt className="h-4 w-4 mr-2 animate-spin duration-500" /> : <Save className="mr-2 h-4 w-4" />}
                                {isSubmitting ? 'Submitting...' : 'Save'}
                            </Button>
                        </footer>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ServiceAndProducts;
