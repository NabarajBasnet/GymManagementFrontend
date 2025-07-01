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

const categories = ["Memberships", "Personal_Trainings", "Lockers", "Supplements", "Aquatics", "Equipments", "Wares"];

const subCategories = {
    Memberships: ["Monthly", "Quarterly", "Half-Yearly", "Yearly", "Student", "Corporate"],
    Personal_Trainings: ["Normal Training", "Personal Training", "Group Classes", "Yoga", "CrossFit", "Zumba", "Online Coaching"],
    Lockers: ["Supplements", "Diet Plans", "Protein", "Vitamins", 'Creatines', "Consultation", "Others"],
    Supplements: ["T-Shirts", "Shakers", "Gym Bags", "Caps", "Wristbands", "Others"],
    Aquatics: ["Swimming Lessons", "Aqua Therapy", "Pool Membership", "Hydro Fitness"],
    Equipments: ["Treadmills", "Dumbbells", "Resistance Bands", "Mats", "Foam Rollers", "Barbells", "Plates"],
    Wares: ["Wrist Wrap", "T Shirt"],
};

const ServiceAndProducts = () => {

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

    // Add and delete items
    const handleAddItem = async (data) => {
        try {
            const { itemName, SKU, description, sellingPrice, costPrice, maxDiscount, taxRate } = data;
            const finalData = {
                itemName,
                SKU,
                description,
                sellingPrice,
                costPrice,
                maxDiscount,
                isActive,
                itemType,
                warehouse,
                category,
                subCategory,
                currency,
                taxRate
            };

            const url = formMode === 'create' ? 'http://localhost:3000/api/accounting/serviceandproducts' : `http://localhost:3000/api/accounting/serviceandproducts/${itemId}`

            const response = await fetch(url, {
                method: formMode === 'create' ? "POST" : "PATCH",
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
            <div className="w-full">

                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink className='font-medium text-xs' href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink className='font-medium text-xs'>Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink className='font-medium text-xs'>Billing</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className='font-medium text-xs'>Services & Products</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="w-full bg-white mt-4 dark:bg-gray-800 space-y-4 p-4 border dark:border-none rounded-sm md:space-y-0 flex justify-between items-end">
                    <div className="w-full flex items-center justify-between">
                        <div className="w-full flex justify-start items-center">
                            <h1 className="text-xl font-bold text-primary">Services & Products</h1>
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

            {/* Open Add More Form */}
            {openAddMoreForm && (
                <div className="fixed inset-0 z-[51] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <form
                        onSubmit={handleSubmit(handleAddItem)}
                        className="relative bg-white shadow-xl w-full max-w-md md:max-w-lg p-6 space-y-4"
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
                <div className={`fixed inset-0 bg-black/50 rounded-none backdrop-blur-sm flex items-center justify-center z-50 p-4`}>
                    <form onSubmit={handleSubmit(handleAddItem)} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-11/12 md:w-10/12 max-h-[90vh] flex flex-col">
                        {/* Header Section */}
                        <header className='flex justify-between rounded-lg items-center p-4 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10'>
                            <h1 className='text-xl font-semibold flex text-primary items-center gap-2'>
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
                        <div className="overflow-y-auto rounded-lg flex-1 p-4 md:p-6">
                            <div className="space-y-6">
                                <p className="text-gray-600 text-sm dark:text-gray-300">
                                    Fill in the details to add a new product to inventory
                                </p>

                                {/* General Information Section */}
                                <div className="border dark:border-gray-700 rounded-sm p-4 space-y-4">
                                    <h3 className="font-medium text-lg text-primary">General Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                        {/* Item Type */}
                                        <div className="space-y-2">
                                            <div className='flex items-center justify-between'>
                                                <Label className="font-medium flex-1 text-primary">Item Type</Label>
                                                {/* <Button variant="ghost" onClick={() => setOpenAddMoreForm(true)} size="sm" className="text-black p-0 h-auto hover:bg-transparent">
                                                    <IoAddCircle className="mr-1" />
                                                    Add More
                                                </Button> */}
                                            </div>
                                            <Controller
                                                name="itemType"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        onValueChange={(value) => {
                                                            setItemType(value)
                                                            field.onChange(value)
                                                        }}
                                                    >
                                                        <SelectTrigger className='dark:bg-gray-900 py-6 rounded-sm text-primary dark:border-none'>
                                                            <SelectValue placeholder="Select Item Type" />
                                                        </SelectTrigger>
                                                        <SelectContent className='dark:bg-gray-900 rounded-sm dark:border-none'>
                                                            <SelectGroup>
                                                                <SelectLabel>Select</SelectLabel>
                                                                <SelectItem className='hover:cursor-pointer text-primary hover:bg-blue-600/30' value='Product'>Product</SelectItem>
                                                                <SelectItem className='hover:cursor-pointer text-primary hover:bg-blue-600/30' value='Service'>Service</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>

                                        {/* Name */}
                                        <div className="space-y-2">
                                            <div className='flex items-center justify-between'>
                                                <Label className="font-medium text-primary" htmlFor="itemName">
                                                    Item Name <span className="text-red-500">*</span>
                                                </Label>
                                                <div className="h-[4px]"></div>
                                            </div>
                                            <Controller
                                                name="itemName"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        id="itemName"
                                                        {...field}
                                                        {...register('itemName', { required: 'Item name is required' })}
                                                        placeholder="Enter name"
                                                        className='w-full dark:bg-gray-900 py-6 rounded-sm text-primary dark:border-none'
                                                    />
                                                )}
                                            />
                                        </div>

                                        {/* Category */}
                                        <div className="space-y-2">
                                            <div className='flex items-center justify-between'>
                                                <Label className="font-medium flex-1 text-primary">Category</Label>
                                                {/* <Button variant="ghost" size="sm" onClick={() => setOpenAddMoreForm(true)} className="text-black p-0 h-auto hover:bg-transparent">
                                                    <IoAddCircle className="mr-1" />
                                                    Add More
                                                </Button> */}
                                            </div>
                                            <Controller
                                                name="category"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        onValueChange={(value) => {
                                                            setCategory(value)
                                                            field.onChange(value)
                                                        }}>
                                                        <SelectTrigger className='dark:bg-gray-900 py-6 rounded-sm text-primary dark:border-none'>
                                                            <SelectValue placeholder="Select Category" />
                                                        </SelectTrigger>
                                                        <SelectContent className='dark:bg-gray-900 rounded-sm dark:border-none'>
                                                            <SelectGroup>
                                                                <SelectLabel>Select</SelectLabel>
                                                                {categories.map((category, index) =>
                                                                    <SelectItem className='hover:cursor-pointer text-primary hover:bg-blue-600/30' key={index} value={category}>{category}</SelectItem>
                                                                )}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>

                                        {/* Sub Category */}
                                        <div className="space-y-2">
                                            <div className='flex items-center justify-between'>
                                                <Label className="font-medium flex-1 text-primary">Sub Category</Label>
                                                {/* <Button variant="ghost" size="sm" onClick={() => setOpenAddMoreForm(true)} className="text-black p-0 h-auto hover:bg-transparent">
                                                    <IoAddCircle className="mr-1" />
                                                    Add More
                                                </Button> */}
                                            </div>
                                            <Controller
                                                name="subCategory"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        onValueChange={(value) => {
                                                            setSubCategory(value)
                                                            field.onChange(value)
                                                        }}
                                                        disabled={!category}>
                                                        <SelectTrigger className='dark:bg-gray-900 py-6 rounded-sm text-primary dark:border-none'>
                                                            <SelectValue placeholder="Select Sub Category" />
                                                        </SelectTrigger>
                                                        <SelectContent className='dark:bg-gray-900 rounded-sm dark:border-none text-primary'>
                                                            <SelectGroup>
                                                                <SelectLabel>Select</SelectLabel>
                                                                {(subCategories[category] || []).map((subCat, index) => (
                                                                    <SelectItem className='hover:cursor-pointer text-primary hover:bg-blue-600/30' key={index} value={subCat}>{subCat}</SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2 md:col-span-2 lg:col-span-2">
                                            <div className='flex items-center justify-between'>
                                                <Label className="font-medium flex-1 text-primary" htmlFor="itemDescription">
                                                    Description
                                                </Label>
                                                <div className="h-[32px]"></div>
                                            </div>
                                            <Controller
                                                name="itemDescription"
                                                control={control}
                                                render={({ field }) => (
                                                    <textarea
                                                        id="itemDescription"
                                                        {...field}
                                                        {...register('description', { required: 'Item description is required' })}
                                                        placeholder="Enter description"
                                                        className="flex w-full rounded-sm dark:bg-gray-900 dark:text-white dark:border-none border focus:outline-none focus:border-blue-500 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing Section */}
                                <div className="border rounded-sm p-4 dark:border-gray-700 space-y-4">
                                    <h3 className="font-medium text-lg text-primary">Pricing</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                        {/* Selling Price */}
                                        <div className="space-y-2">
                                            <div className='flex items-center justify-between'>
                                                <Label className="font-medium flex-1 text-primary" htmlFor="sellingPrice">
                                                    Selling Price <span className="text-red-500">*</span>
                                                </Label>
                                                <div className="h-[32px]"></div>
                                            </div>
                                            <div className="relative">
                                                <span className="absolute left-3 top-3 text-gray-500 dark:text-gray-300">{loggedInUser?.organization?.currency}</span>
                                                <Controller
                                                    name="sellingPrice"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            id="sellingPrice"
                                                            {...field}
                                                            {...register('sellingPrice', { required: 'Item selling price is required' })}
                                                            className='w-full dark:bg-gray-900 pl-12 py-6 rounded-sm text-primary dark:border-none'
                                                            placeholder="0.00"
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        {/* Cost Price */}
                                        <div className="space-y-2">
                                            <div className='flex items-center justify-between'>
                                                <Label className="font-medium flex-1 text-primary" htmlFor="costPrice">
                                                    Cost Price
                                                </Label>
                                                <div className="h-[32px]"></div>
                                            </div>
                                            <div className="relative">
                                                <span className="absolute left-3 top-3 text-gray-500 dark:text-gray-300">{loggedInUser?.organization?.currency}</span>
                                                <Controller
                                                    name="costPrice"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            id="costPrice"
                                                            {...field}
                                                            {...register('costPrice')}
                                                            className='w-full dark:bg-gray-900 pl-12 py-6 rounded-sm text-primary dark:border-none'
                                                            placeholder="0.00"
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        {/* Tax Rate */}
                                        <div className="space-y-2">
                                            <div className='flex items-center justify-between'>
                                                <Label className="font-medium flex-1 text-primary" htmlFor="taxRate">
                                                    Tax Rate ( Optional )
                                                </Label>
                                                <div className="h-[32px]"></div>
                                            </div>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2.5 text-gray-500">%</span>
                                                <Controller
                                                    name="taxRate"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            id="taxRate"
                                                            {...register('taxRate')}
                                                            className='w-full dark:bg-gray-900 pl-8 py-6 rounded-sm text-primary dark:border-none'
                                                            placeholder="0.00"
                                                            type="number"
                                                            step="1"
                                                            min="0"
                                                            max="80"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Section */}
                                <div className="border dark:border-gray-700 rounded-sm p-4 space-y-4">
                                    <h3 className="font-medium text-lg text-primary">Status</h3>
                                    <div className="flex flex-wrap items-center gap-4 pt-2">
                                        <div className="flex items-center space-x-2">
                                            <Controller
                                                name="itemStatus"
                                                control={control}
                                                render={({ field }) => (
                                                    <Switch
                                                        {...field}
                                                        id="itemActive"
                                                        checked={isActive}
                                                        onCheckedChange={(value) => setIsActive(value)}
                                                    />
                                                )}
                                            />
                                            <Label htmlFor="itemActive" className='text-primary'>Active</Label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer with actions */}
                        <footer className="flex justify-end rounded-lg gap-3 p-4 border-t dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
                            <Button
                                variant="outline"
                                type='button'
                                onClick={() => setOpenAddItemForm(false)}
                                className="min-w-[100px] dark:bg-gray-900 dark:text-white dark:border-none"
                            >
                                Cancel
                            </Button>
                            <Button
                                type='submit'
                                className="min-w-[100px] bg-blue-600 hover:bg-blue-700 dark:text-white">
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
