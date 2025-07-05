'use client';

import { BiLoaderAlt } from "react-icons/bi";
import { useForm, Controller } from "react-hook-form";
import { IoIosInformationCircle } from "react-icons/io";
import React, { useState } from 'react';
import {
    CircleDollarSign,
    Home,
    LayoutDashboard,
    ChevronRight,
    Plus,
    Save,
} from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useUser } from "@/components/Providers/LoggedInUserProvider";

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

const AddProducts = () => {

    const { user } = useUser();
    const loggedInUser = user ? user.user : null;

    // Form states
    const [formOpen, setFormOpen] = useState(false);

    // Items states
    const [isActive, setIsActive] = useState(false);
    const [itemType, setItemType] = useState('');
    const [warehouse, setWareHouse] = useState('');
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [currency, setCurrency] = useState('');

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

            const url = 'https://fitbinary.com/api/accounting/serviceandproducts'
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalData),
            });

            const responseBody = await response.json();

            if (response.ok && response.status === 200) {
                toast.success(responseBody.message);
                reset();
            } else {
                toast.error(responseBody.message);
            };

        } catch (error) {
            console.log('Error: ', error);
            toast.error('Internal Server Error!');
        };
    };

    return (
        <div className="w-full mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen py-6 px-4">
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
                            <Plus className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Add Products & Services
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Add your products and services with ease in inventory and manage
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Item Form (Integrated into page) */}
            <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 p-6 mb-6">
                <form onSubmit={handleSubmit(handleAddItem)}>
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <IoIosInformationCircle className="text-blue-500" />
                            {'Add New Product'}
                        </h2>
                    </div>

                    {/* Form Content */}
                    <div className="space-y-6">
                        <p className="text-gray-600 text-sm dark:text-gray-300">
                            Fill in the details to add a newproduct to inventory
                        </p>

                        {/* General Information Section */}
                        <div className="border dark:border-gray-700 rounded-lg p-4 space-y-4">
                            <h3 className="font-medium text-lg text-primary">General Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                {/* Item Type */}
                                <div className="space-y-2">
                                    <Label className="font-medium flex-1 text-primary">Item Type</Label>
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
                                                <SelectTrigger className='dark:bg-gray-900 py-6 rounded-lg text-primary dark:border-none'>
                                                    <SelectValue placeholder="Select Item Type" />
                                                </SelectTrigger>
                                                <SelectContent className='dark:bg-gray-900 rounded-lg dark:border-none'>
                                                    <SelectGroup>
                                                        <SelectLabel>Select</SelectLabel>
                                                        <SelectItem className='hover:cursor-pointer text-primary hover:bg-blue-600/30' value='Standard'>Standard</SelectItem>
                                                        <SelectItem className='hover:cursor-pointer text-primary hover:bg-blue-600/30' value='Combo'>Combo</SelectItem>
                                                        <SelectItem className='hover:cursor-pointer text-primary hover:bg-blue-600/30' value='Digital'>Digital</SelectItem>
                                                        <SelectItem className='hover:cursor-pointer text-primary hover:bg-blue-600/30' value='Service'>Service</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>

                                {/* Name */}
                                <div className="space-y-2">
                                    <Label className="font-medium text-primary" htmlFor="itemName">
                                        Item Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Controller
                                        name="itemName"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                id="itemName"
                                                {...field}
                                                {...register('itemName', { required: 'Item name is required' })}
                                                placeholder="Enter name"
                                                className='w-full bg-white dark:bg-gray-900 py-6 rounded-lg text-primary dark:border-none'
                                            />
                                        )}
                                    />
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label className="font-medium flex-1 text-primary">Category</Label>
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
                                                <SelectTrigger className='dark:bg-gray-900 py-6 rounded-lg text-primary dark:border-none'>
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                                <SelectContent className='dark:bg-gray-900 rounded-lg dark:border-none'>
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
                                    <Label className="font-medium flex-1 text-primary">Sub Category</Label>
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
                                                <SelectTrigger className='dark:bg-gray-900 py-6 rounded-lg text-primary dark:border-none'>
                                                    <SelectValue placeholder="Select Sub Category" />
                                                </SelectTrigger>
                                                <SelectContent className='dark:bg-gray-900 rounded-lg dark:border-none text-primary'>
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
                                    <Label className="font-medium flex-1 text-primary" htmlFor="itemDescription">
                                        Description
                                    </Label>
                                    <Controller
                                        name="itemDescription"
                                        control={control}
                                        render={({ field }) => (
                                            <textarea
                                                id="itemDescription"
                                                {...field}
                                                {...register('description', { required: 'Item description is required' })}
                                                placeholder="Enter description"
                                                className="flex w-full rounded-lg dark:bg-gray-900 dark:text-white dark:border-none border focus:outline-none focus:border-blue-500 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing Section */}
                        <div className="border rounded-lg p-4 dark:border-gray-700 space-y-4">
                            <h3 className="font-medium text-lg text-primary">Pricing</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                {/* Selling Price */}
                                <div className="space-y-2">
                                    <Label className="font-medium flex-1 text-primary" htmlFor="sellingPrice">
                                        Selling Price <span className="text-red-500">*</span>
                                    </Label>
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
                                                    className='w-full dark:bg-gray-900 bg-white pl-12 py-6 rounded-lg text-primary dark:border-none'
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
                                    <Label className="font-medium flex-1 text-primary" htmlFor="costPrice">
                                        Cost Price
                                    </Label>
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
                                                    className='w-full dark:bg-gray-900 bg-white pl-12 py-6 rounded-lg text-primary dark:border-none'
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
                                    <Label className="font-medium flex-1 text-primary" htmlFor="taxRate">
                                        Tax Rate (Optional)
                                    </Label>
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
                                                    className='w-full dark:bg-gray-900 bg-white pl-8 py-6 rounded-lg text-primary dark:border-none'
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
                        <div className="border dark:border-gray-700 rounded-lg p-4 space-y-4">
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

                        {/* Form Actions */}
                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                variant="outline"
                                type='button'
                                className="min-w-[100px] py-6 rounded-sm dark:bg-gray-900 dark:text-white dark:border-none"
                            >
                                Reset
                            </Button>
                            <Button
                                type='submit'
                                className="min-w-[100px] py-6 px-4 rounded-sm bg-blue-600 hover:bg-blue-700 dark:text-white">
                                {isSubmitting ? <BiLoaderAlt className="h-4 w-4 mr-2 animate-spin duration-500" /> : <Save className="mr-2 h-4 w-4" />}
                                {isSubmitting ? 'Submitting...' : 'Save'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProducts;
