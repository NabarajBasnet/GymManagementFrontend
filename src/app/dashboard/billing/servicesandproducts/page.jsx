'use client';

import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox"
import { IoIosInformationCircle } from "react-icons/io";
import Pagination from '@/components/ui/CustomPagination';
import React, { useState } from 'react';
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
const taxRate = ['0', '3', '5', '7', '9', '11', '13', '15', '20', '25'];

const ServiceAndProducts = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [openAddItemForm, setOpenAddItemForm] = useState(false);

    // Items states
    const [itemType, setItemType] = useState('');
    const [warehouse, setWareHouse] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [currency, setCurrency] = useState('');
    const [taxRate, setTaxRate] = useState('');

    console.log('Item Type: ', itemType);
    console.log('Warehouse: ', warehouse);
    console.log('Category: ', category)
    console.log('Sub Category: ', subCategory)
    console.log('Currency: ', currency)
    console.log('Tax Rate: ', taxRate)

    // React Hook Form
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        setError } = useForm();

    const handleAddItem = async () => {
        try {

        } catch (error) {
            console.log('Error: ', error);
            toast.error('Internal Server Error!');
        };
    };


    const mockData = [
        {
            id: 1,
            itemId: '100',
            name: "Monthly Membership",
            type: "service",
            price: 49.99,
            taxRate: 10,
            category: "Membership",
            active: true
        },
        {
            id: 2,
            itemId: '101',
            name: "Personal Training Session",
            type: "service",
            price: 39.99,
            taxRate: 10,
            category: "Training",
            active: true
        },
        {
            id: 3,
            itemId: '102',
            name: "Protein Shake",
            type: "product",
            price: 5.99,
            taxRate: 7,
            category: "Nutrition",
            active: true
        },
        {
            id: 4,
            itemId: '103',
            name: "Gym Towel",
            type: "product",
            price: 15.99,
            taxRate: 7,
            category: "Merchandise",
            active: true
        },
        {
            id: 5,
            itemId: '104',
            name: "Swimming Classes",
            type: "service",
            price: 29.99,
            taxRate: 10,
            category: "Aquatics",
            active: false
        },
    ];


    const filteredData = activeTab === "all"
        ? mockData
        : activeTab === "active"
            ? mockData.filter(item => item.active)
            : activeTab === "services"
                ? mockData.filter(item => item.type === "service")
                : mockData.filter(item => item.type === "product");

    return (
        <div className="container mx-auto py-6 px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
                    <Button onClick={() => {
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

            <div className="rounded-md border shadow">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-muted/50">
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
                            {filteredData.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-muted/50">
                                    <td className="align-middle text-center font-medium">
                                        <Checkbox id="terms" />
                                    </td>
                                    <td className="align-middle md:text-center font-medium">{item.itemId}</td>
                                    <td className="p-4 align-middle font-medium">{item.name}</td>
                                    <td className="p-4 align-middle">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.type === "service"
                                            ? "bg-purple-100 text-purple-800"
                                            : "bg-blue-100 text-blue-800"
                                            }`}>
                                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle">{item.category}</td>
                                    <td className="p-4 align-middle text-right">${item.price.toFixed(2)}</td>
                                    <td className="p-4 align-middle text-right">{item.taxRate}%</td>
                                    <td className="p-4 align-middle">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.active
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                            }`}>
                                            {item.active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle text-right">
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
                </div>
                <div className="flex items-center justify-between border-t px-4 py-4">
                    <div className="text-sm text-muted-foreground">
                        Showing <strong>{filteredData.length}</strong> of <strong>{mockData.length}</strong> items
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

            {/* Open Add Items Form */}
            {openAddItemForm && (
                <div className="fixed inset-0 bg-black/50 rounded-sm backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-sm shadow-xl w-11/12 md:w-10/12 max-h-[90vh] flex flex-col">
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {/* Item Type */}
                                        <div className="space-y-2">
                                            <Label className="font-medium">Item Type</Label>
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
                                            <Label className="font-medium">Warehouse</Label>
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
                                            <Label className="font-medium" htmlFor="itemName">
                                                Name <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="itemName"
                                                placeholder="Enter name"
                                                className="w-full"
                                            />
                                        </div>

                                        {/* Category */}
                                        <div className="space-y-2">
                                            <Label className="font-medium">Category</Label>
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
                                            <Label className="font-medium">Sub Category</Label>
                                            <Select onValueChange={(value) => setSubCategory(value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Sub Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Select</SelectLabel>
                                                        <SelectItem value='Sub Category One'>Sub Category One</SelectItem>
                                                        <SelectItem value='Sub Category Two'>Sub Category Two</SelectItem>
                                                        <SelectItem value='Sub Category Three'>Sub Category Three</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* SKU/Code */}
                                        <div className="space-y-2">
                                            <Label className="font-medium" htmlFor="itemSKU">
                                                SKU/Code
                                            </Label>
                                            <Input
                                                id="itemSKU"
                                                placeholder="Enter unique SKU"
                                                className="w-full"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2 md:col-span-2 lg:col-span-3">
                                            <Label className="font-medium" htmlFor="itemDescription">
                                                Description
                                            </Label>
                                            <textarea
                                                id="itemDescription"
                                                placeholder="Enter description"
                                                className="flex w-full rounded-sm bg-background px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing Section */}
                                <div className="border rounded-sm p-4 space-y-4">
                                    <h3 className="font-medium text-lg">Pricing</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {/* Currency */}
                                        <div className="space-y-2">
                                            <Label className="font-medium">Currency</Label>
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
                                            <Label className="font-medium" htmlFor="itemPrice">
                                                Selling Price <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                                <Input
                                                    id="itemPrice"
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
                                            <Label className="font-medium" htmlFor="itemCostPrice">
                                                Cost Price
                                            </Label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                                <Input
                                                    id="itemCostPrice"
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
                                            <Label className="font-medium">Tax Rate</Label>
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
                                            <Label className="font-medium" htmlFor="itemCostPrice">
                                                Max Discount Percent
                                            </Label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                                <Input
                                                    id="itemCostPrice"
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
                                            />
                                            <Label htmlFor="itemActive">Active</Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="itemOnline"
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
                                onClick={() => setOpenAddItemForm(false)}
                                className="min-w-[100px]"
                            >
                                Cancel
                            </Button>
                            <Button className="min-w-[100px] bg-blue-600 hover:bg-blue-700">
                                <Save className="mr-2 h-4 w-4" />
                                Save
                            </Button>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceAndProducts;
