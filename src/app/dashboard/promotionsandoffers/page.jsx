'use client';

import { FiPause, FiCopy } from "react-icons/fi";
import { BiEdit } from "react-icons/bi";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { MdHome } from "react-icons/md";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

// UI Components
import { Checkbox } from "@/components/ui/checkbox"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import Badge from '@mui/material/Badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Pagination from '@/components/ui/CustomPagination';
import Loader from "@/components/Loader/Loader";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

// Icons
import {
    FaExclamationTriangle,
    FaPlayCircle,
    FaSpinner,
} from 'react-icons/fa';
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdError, MdClose, MdDone, MdDelete } from "react-icons/md";
import { QrCode, RefreshCw, Search, User, Calendar, Timer, Info, AlertCircle, CheckCircle, ChevronRight, Plus, Trash2, Save, X, ArrowUpDown } from 'lucide-react';
import toast from "react-hot-toast";

const PromotionsAndOfferManagement = () => {

    const [openNewForm, setOpenNewForm] = useState(false);
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 6;
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [submitMode, setSubmitMode] = useState(null);
    console.log("Submit Mode: ", submitMode);

    // React hook form
    const {
        register,
        formState: { isSubmitting, errors },
        reset,
        handleSubmit
    } = useForm();

    const audienceOptions = [
        { id: 'New Joiners', label: 'New Joiners' },
        { id: 'Expired Members', label: 'Expired Members' },
        { id: 'All Members', label: 'All Members' },
        { id: 'Students', label: 'Students' },
        { id: 'Seniors', label: 'Seniors' },
        { id: 'Corporate', label: 'Corporate' },
    ];

    const offerTypes = [
        { value: 'newyear', label: 'New Year' },
        { value: 'discount', label: 'Discount' },
        { value: 'referral', label: 'Referral' },
        { value: 'seasonal', label: 'Seasonal' },
        { value: 'festival', label: 'Festival' },
        { value: 'loyalty', label: 'Loyalty' },
        { value: 'membership', label: 'Membership' },
        { value: 'other', label: 'Other' },
    ];

    // Form Data States
    const [offerType, setSelectedOfferType] = useState('');
    const [discountValueIsPercentage, setDiscountValueIsPercentage] = useState(false);
    const [selectedAudiences, setSelectedAudiences] = useState([]);
    const baseURL = `http://localhost:3000/api/promotionsandoffers`;

    const onFormSubmit = async (data) => {

        const {
            title,
            description,
            discountValue,
            startDate,
            endDate,
            promoCode,
            usageLimit,
            minimumPurchase,
            isActive
        } = data;

        const finalDataObject = {
            title,
            description,
            offerType,
            discountValue,
            discountValueIsPercentage,
            startDate,
            endDate,
            selectedAudiences,
            promoCode,
            usageLimit,
            minimumPurchase,
            isActive
        };

        try {
            const response = await fetch(`${baseURL}`, {
                method: submitMode === 'edit' ? 'PATCH' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(finalDataObject),
            });

            const responseBody = await response.json();

            if (response.ok && response.status === 200) {
                setOpenNewForm(false);
                reset();
                setSelectedOfferType('');
                setDiscountValueIsPercentage(false);
                setSelectedAudiences([]);
                toast.success(responseBody.message);
                queryClient.invalidateQueries(['promotionsandoffers']);
            } else {
                toast.error(responseBody.message);
            };

            if (response.ok && response.status === 200 && submitMode === 'edit') {
                console.log("Response body: ", responseBody);
                // reset({
                //     title:responseBody.
                // })
            }

        } catch (error) {
            console.log("Error: ", error);
            toast.error(error.message);
        };
    };

    console.log('Form mode: ', submitMode);

    const getSingleOfferDetails = async (id) => {
        setOpenNewForm(true);
        try {
            const response = await fetch(`${baseURL}/${id}`);
            const responseBody = await response.json();

            if (response.ok && submitMode === 'edit') {
                //
            };
            console.log("Respone Body: ", responseBody);

        } catch (error) {
            console.log("Error: ", error)
            toast.error(error.message);
        };
    };

    const handleCheckboxChange = (id) => {
        setSelectedAudiences((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    const getAllOffers = async ({ queryKey }) => {
        const [, page] = queryKey;
        try {
            const response = await fetch(`http://localhost:3000/api/promotionsandoffers?page=${page}&limit=${limit}`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error.message);
            toast.error(error.message);
        };
    };

    const { data, isLoading } = useQuery({
        queryKey: ['promotionsandoffers', currentPage],
        queryFn: getAllOffers,
    });

    const { offers, totalPages } = data || {}

    const deleteOffer = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/promotionsandoffers/${id}`, {
                method: "DELETE"
            });

            const responseBody = await response.json();
            if (response.ok && response.status === 200) {
                toast.success(responseBody.message);
                queryClient.invalidateQueries(['promotionsandoffers']);
            } else {
                toast.error(responseBody.message);
            }
        } catch (error) {
            console.log("Error: ", error);
            toast.error(error.message);
        };
    };

    const copyPromoCodeToClipboard = (promoCode) => {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard.writeText(promoCode)
                .then(() => toast.success(`Promo code ${promoCode} copied to clipboard`))
                .catch(() => toast.error("Failed to copy promo code"));
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = promoCode;
            textArea.style.position = "fixed";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    toast.success(`Promo code ${promoCode} copied to clipboard`);
                } else {
                    throw new Error();
                }
            } catch (err) {
                toast.error("Failed to copy code");
            }
            document.body.removeChild(textArea);
        }
    };

    return (
        <div className='w-full bg-slate-50 min-h-screen'>
            {/* Breadcrumb and Header */}
            <div className='w-full p-4 md:p-6 border-b border-gray-200 bg-gray-50 shadow-sm'>
                <Breadcrumb className="mb-3 md:mb-4">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <MdHome className='w-4 h-4' />
                            <BreadcrumbLink href="/" className="text-slate-600 hover:text-slate-800 ml-2">
                                Home
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink className="text-slate-600 hover:text-slate-800">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium text-slate-900">Promotion And Offer</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900">Promotion And Offer</h1>
                    <Button
                        variant="outline"
                        className='flex items-center rounded-sm bg-slate-800 hover:bg-slate-700 border text-gray-100 hover:text-gray-200'
                        onClick={() => setOpenNewForm(true)}
                    >
                        <IoMdAdd className="h-4 w-4 mr-2" />
                        Create Offers
                    </Button>
                </div>
            </div>

            {openNewForm && (
                <div className="w-full flex justify-center items-center bg-black bg-opacity-70 backdrop-blur-sm fixed inset-0 z-50 p-4">
                    <form onSubmit={handleSubmit(onFormSubmit)} className="bg-white w-full max-w-6xl h-[90vh] md:h-[95vh] rounded-md shadow-xl flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 md:p-5 border-b">
                            <h1 className='text-lg font-medium'>Create New Promotions & Offers</h1>
                            <button
                                type="button"
                                onClick={() => {
                                    setOpenNewForm(false)
                                    setSubmitMode(null);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <IoMdClose className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Main Form Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Promotion Title*</Label>
                                <Input
                                    id="title"
                                    {...register('title', {
                                        required: 'Title is required',
                                        maxLength: {
                                            value: 100,
                                            message: 'Title cannot exceed 100 characters'
                                        }
                                    })}
                                    placeholder="Enter promotion title"
                                    className={errors.title ? 'border-red-500' : ''}
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-sm">{errors.title.message}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    {...register('description', {
                                        maxLength: {
                                            value: 500,
                                            message: 'Description cannot exceed 500 characters'
                                        }
                                    })}
                                    placeholder="Enter promotion description"
                                    rows={3}
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm">{errors.description.message}</p>
                                )}
                            </div>

                            {/* Offer Type */}
                            <div className="space-y-2">
                                <Label htmlFor="offerType">Offer Type*</Label>
                                <Select onValueChange={(value) => setSelectedOfferType(value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select offer type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {offerTypes.map((offer) => (
                                                <SelectItem key={offer.value} value={offer.value}>
                                                    {offer.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Discount Value */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="discountValue">Discount Value*</Label>
                                    <Input
                                        {...register('discountValue')}
                                        placeholder='Enter discount value'
                                    />
                                    {errors.discountValue && (
                                        <p className="text-red-500 text-sm">{errors.discountValue.message}</p>
                                    )}
                                </div>

                                <div className="flex items-end space-x-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="isPercentage"
                                            checked={discountValueIsPercentage}
                                            onCheckedChange={(value) => setDiscountValueIsPercentage(!!value)}
                                        />
                                        <Label htmlFor="isPercentage">Is Percentage</Label>
                                    </div>
                                    <input type="hidden" />
                                </div>
                            </div>

                            {/* Date Range */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Start Date*</Label>
                                    <Input
                                        type='date'
                                        {...register('startDate', { required: "Start date required" })}
                                        rules={{ required: 'Start date is required' }}
                                        placeholder="Select start date"
                                    />
                                    {errors.startDate && (
                                        <p className="text-red-500 text-sm">{errors.startDate.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date*</Label>
                                    <Input
                                        type='date'
                                        {...register('endDate', { required: "End date required" })}
                                        rules={{
                                            required: 'End date is required',
                                            validate: (value) => {
                                                const startDate = watch('startDate');
                                                if (startDate && value < startDate) {
                                                    return 'End date must be after start date';
                                                }
                                                return true;
                                            }
                                        }}
                                        placeholder="Select end date"
                                    />
                                    {errors.endDate && (
                                        <p className="text-red-500 text-sm">{errors.endDate.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Target Audience */}
                            <div className="space-y-2">
                                <Label>Target Audience*</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {audienceOptions.map((option) => (
                                        <div key={option.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={option.id}
                                                checked={selectedAudiences.includes(option.id)}
                                                onCheckedChange={() => handleCheckboxChange(option.id)}
                                            />
                                            <Label htmlFor={option.id}>{option.label}</Label>
                                        </div>
                                    ))}
                                </div>
                                <input type="hidden" />
                                {errors.targetAudience && (
                                    <p className="text-red-500 text-sm">{errors.targetAudience.message}</p>
                                )}
                            </div>

                            {/* Promo Code */}
                            <div className="space-y-2">
                                <Label htmlFor="promoCode">Promo Code (Optional)</Label>
                                <Input
                                    id="promoCode"
                                    {...register('promoCode', {
                                        maxLength: {
                                            value: 20,
                                            message: 'Promo code cannot exceed 20 characters'
                                        }
                                    })}
                                    placeholder="Enter promo code (e.g., SUMMER20)"
                                    className={errors.promoCode ? 'border-red-500' : ''}
                                />
                                {errors.promoCode && (
                                    <p className="text-red-500 text-sm">{errors.promoCode.message}</p>
                                )}
                            </div>

                            {/* Usage Limit */}
                            <div className="space-y-2">
                                <Label htmlFor="usageLimit">Usage Limit (Optional)</Label>
                                <Input
                                    id="usageLimit"
                                    type="text"
                                    {...register('usageLimit', {
                                        min: {
                                            value: 0,
                                            message: 'Usage limit cannot be negative'
                                        }
                                    })}
                                    placeholder="Enter maximum number of uses"
                                    className={errors.usageLimit ? 'border-red-500' : ''}
                                />
                                {errors.usageLimit && (
                                    <p className="text-red-500 text-sm">{errors.usageLimit.message}</p>
                                )}
                            </div>

                            {/* Minimum Purchase */}
                            <div className="space-y-2">
                                <Label htmlFor="minimumPurchase">Minimum Purchase (Optional)</Label>
                                <Input
                                    id="minimumPurchase"
                                    type="text"
                                    {...register('minimumPurchase', {
                                        min: {
                                            value: 0,
                                            message: 'Minimum purchase cannot be negative'
                                        }
                                    })}
                                    placeholder="Enter minimum purchase amount"
                                    className={errors.minimumPurchase ? 'border-red-500' : ''}
                                />
                                {errors.minimumPurchase && (
                                    <p className="text-red-500 text-sm">{errors.minimumPurchase.message}</p>
                                )}
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isActive"
                                    defaultChecked
                                    {...register('isActive')}
                                />
                                <Label htmlFor="isActive">Active Promotion</Label>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="w-full flex justify-end bg-gray-50 gap-3 p-4 md:p-6 border-t border-gray-100">
                            <Button
                                type="button"
                                onClick={() => {
                                    setSubmitMode(null);
                                    setOpenNewForm(false);
                                }}
                                variant="outline"
                                className="h-10 px-4 md:px-6 rounded-md border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>

                            {submitMode === 'edit' ? (
                                <Button
                                    type="button"
                                    className="h-10 px-4 md:px-6 rounded-md bg-primary hover:bg-primary/90 text-white"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <FaSpinner className="animate-spin h-4 w-4" />
                                            Editing...
                                        </div>
                                    ) : (
                                        'Edit Promotion'
                                    )}
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    className="h-10 px-4 md:px-6 rounded-md bg-primary hover:bg-primary/90 text-white"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <FaSpinner className="animate-spin h-4 w-4" />
                                            Saving...
                                        </div>
                                    ) : (
                                        'Save Promotion'
                                    )}
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            <div className="p-4">

                <div className="w-full flex bg-white py-6 px-2 rounded-sm border flex-col md:flex-row gap-4 items-center">
                    {/* Search Input */}
                    <div className="border bg-white flex items-center rounded-full px-4 flex-1 w-full">
                        <Search className="h-4 w-4 mr-2" />
                        <Input
                            className='outline-none border-none focus:outline-none focus:border-none w-full'
                            placeholder="Search..."
                        />
                    </div>

                    {/* Filter Selects */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                        <Select>
                            <SelectTrigger className="w-full rounded-lg">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Categories</SelectLabel>
                                    <SelectItem value="apple">Apple</SelectItem>
                                    <SelectItem value="banana">Banana</SelectItem>
                                    <SelectItem value="blueberry">Blueberry</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger className="w-full rounded-lg">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Status</SelectLabel>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Select>
                            <SelectTrigger className="w-full rounded-lg">
                                <SelectValue placeholder="Date" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Date Range</SelectLabel>
                                    <SelectItem value="today">Today</SelectItem>
                                    <SelectItem value="week">This Week</SelectItem>
                                    <SelectItem value="month">This Month</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Tabs defaultValue="cards" className="w-full mx-auto">
                    <TabsList className="grid my-4 bg-gray-800 w-full md:w-80 rounded-full grid-cols-2">
                        <TabsTrigger className='text-gray-50 rounded-full' value="cards">Cards</TabsTrigger>
                        <TabsTrigger className='text-gray-50 rounded-full' value="table">Table</TabsTrigger>
                    </TabsList>
                    <TabsContent value="cards">
                        <div>
                            {isLoading ? (
                                <Loader />
                            ) : (
                                <div className="">
                                    {Array.isArray(offers) && offers.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {offers.map((offer) => (
                                                <div
                                                    key={offer._id}
                                                    className="rounded-xl shadow-md p-5 bg-white hover:shadow-lg border transition-shadow duration-200 flex flex-col"
                                                >
                                                    {/* Card Header with Status */}
                                                    <div className="flex justify-between items-start mb-4">
                                                        <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{offer.title}</h3>
                                                        <span className={`px-4 py-2 rounded-full text-xs font-semibold ${offer.isActive === "on"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-100 text-gray-600"
                                                            }`}>
                                                            {offer.isActive === "on" ? "Active" : "Inactive"}
                                                        </span>
                                                    </div>

                                                    {/* Discount Badge */}
                                                    <div className={`w-fit px-4 py-2 mb-5 rounded-full font-bold text-sm ${offer.discountValueIsPercentage
                                                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                                                        : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                                                        }`}>
                                                        {offer.discountValueIsPercentage
                                                            ? `${offer.discountValue}% OFF`
                                                            : `$${offer.discountValue} OFF`}
                                                    </div>

                                                    {/* Description */}
                                                    <p className="text-gray-600 text-sm font-medium mb-6 line-clamp-3">{offer.description}</p>

                                                    {/* Details Grid */}
                                                    <div className="space-y-3 mb-6">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500 font-medium">Promo Code:</span>
                                                            <span className="font-semibold flex items-center text-gray-800 bg-gray-50 px-2 py-1 rounded">
                                                                {offer.promoCode}
                                                                <FiCopy onClick={() => copyPromoCodeToClipboard(offer.promoCode)} className="mx-2 cursor-pointer" />
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500 font-medium">Valid:</span>
                                                            <span className="text-gray-800">
                                                                {new Date(offer.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(offer.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500 font-medium">Min. Purchase:</span>
                                                            <span className="text-gray-800">${offer.minimumPurchase}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500 font-medium">Usage:</span>
                                                            <span className="text-gray-800">
                                                                <span className={offer.timesUsed >= offer.usageLimit ? "text-red-500" : "text-green-600"}>
                                                                    {offer.timesUsed}
                                                                </span> / {offer.usageLimit} used
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500 font-medium">Eligible For:</span>
                                                            <span className="text-right text-gray-800">
                                                                {offer.selectedAudiences.map(aud => aud.replace(/_/g, ' ')).join(', ')}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-100">
                                                        <button
                                                            onClick={() => {
                                                                setSubmitMode('edit');
                                                                getSingleOfferDetails(offer._id);
                                                            }}
                                                            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                                                            <BiEdit className="mr-2" size={16} />
                                                            Edit
                                                        </button>
                                                        <div className="flex space-x-2">
                                                            <button className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 transition-colors border border-red-200 rounded-lg hover:bg-red-50">
                                                                Disable
                                                            </button>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <button className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50">
                                                                        <MdDelete className="mr-2" size={16} />
                                                                        Delete
                                                                    </button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            This action cannot be undone. This will permanently delete your
                                                                            this document and remove data from our servers.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction onClick={() => deleteOffer(offer._id)}>Continue</AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16">
                                            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-medium text-gray-800 mb-2">No promotions available</h3>
                                            <p className="text-gray-500 max-w-md mx-auto">Create your first promotion to attract more customers and boost sales.</p>
                                            <button onClick={() => setOpenNewForm(true)} className="mt-6 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                                                Create Promotion
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="w-full flex justify-center my-4 lg:justify-end">
                            <Pagination
                                total={totalPages}
                                page={currentPage || 1}
                                onChange={setCurrentPage}
                                withEdges={true}
                                siblings={1}
                                boundaries={1}
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="table">
                        <div>
                            {isLoading ? (
                                <Loader />
                            ) : (
                                <div className="">
                                    {Array.isArray(offers) && offers.length > 0 ? (
                                        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Offer Details</th>
                                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                                                            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Validity</th>
                                                            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                            <th scope="col" className="px-4 py-3 text-end text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {offers.map((offer) => (
                                                            <tr key={offer._id} className="hover:bg-gray-50 transition-colors duration-150">
                                                                {/* Offer Details - Left aligned */}
                                                                <td className="px-4 py-4 max-w-[200px] 2xl:max-w-[300px] text-left">
                                                                    <div className="flex items-start">
                                                                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold mr-3">
                                                                            {offer.discountValueIsPercentage ? `${offer.discountValue}%` : `$${offer.discountValue}`}
                                                                        </div>
                                                                        <div className="min-w-0">
                                                                            <div className="text-sm font-medium text-gray-900 truncate">{offer.title}</div>
                                                                            <div
                                                                                className="text-sm text-gray-500 truncate hover:whitespace-normal hover:overflow-visible hover:bg-white hover:z-10 hover:absolute hover:max-w-[300px] hover:shadow-md hover:px-2 hover:py-1 hover:border hover:border-gray-200 hover:rounded"
                                                                                title={offer.description}
                                                                            >
                                                                                {offer.description}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>

                                                                {/* Discount Info - Left aligned */}
                                                                <td className="px-4 py-4 whitespace-nowrap text-left">
                                                                    <div className="space-y-1">
                                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${offer.discountValueIsPercentage
                                                                            ? 'bg-red-100 text-red-800'
                                                                            : 'bg-blue-100 text-blue-800'
                                                                            }`}>
                                                                            {offer.discountValueIsPercentage
                                                                                ? `${offer.discountValue}% OFF`
                                                                                : `$${offer.discountValue} OFF`}
                                                                        </span>
                                                                        <div className="text-xs flex items-center text-gray-500">
                                                                            <span>Code: {offer.promoCode}</span>
                                                                            <FiCopy onClick={() => copyPromoCodeToClipboard(offer.promoCode)} className="mx-2 cursor-pointer" />
                                                                        </div>
                                                                        <div className="text-xs text-gray-500">Min: ${offer.minimumPurchase}</div>
                                                                    </div>
                                                                </td>

                                                                {/* Validity - Center aligned */}
                                                                <td className="px-4 py-4 whitespace-nowrap text-center">
                                                                    <div className="text-sm text-gray-900 space-y-1 mx-auto">
                                                                        <div>
                                                                            <span className="font-medium">From:</span> {new Date(offer.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                                        </div>
                                                                        <div>
                                                                            <span className="font-medium">To:</span> {new Date(offer.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 truncate max-w-[120px] mx-auto">
                                                                            {offer.selectedAudiences.map(aud => aud.replace(/_/g, ' ')).join(', ')}
                                                                        </div>
                                                                    </div>
                                                                </td>

                                                                {/* Status - Center aligned */}
                                                                <td className="px-4 py-4 whitespace-nowrap text-center">
                                                                    <div className="space-y-1 mx-auto">
                                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${offer.isActive === "on"
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : 'bg-gray-100 text-gray-800'
                                                                            }`}>
                                                                            {offer.isActive === "on" ? 'Active' : 'Inactive'}
                                                                        </span>
                                                                        <div className="text-xs text-gray-500">
                                                                            Used: <span className={offer.timesUsed >= offer.usageLimit ? "text-red-500" : "text-green-600"}>
                                                                                {offer.timesUsed}
                                                                            </span> / {offer.usageLimit}
                                                                        </div>
                                                                    </div>
                                                                </td>

                                                                {/* Actions - Right aligned */}
                                                                <td className="px-4 py-4 whitespace-nowrap text-end">
                                                                    <div className="flex justify-end items-center space-x-3">
                                                                        <button
                                                                            onClick={() => {
                                                                                setSubmitMode('edit');
                                                                                getSingleOfferDetails(offer._id);
                                                                            }}
                                                                            className="text-gray-600 hover:text-gray-900 flex items-center"
                                                                            title="Edit"
                                                                        >
                                                                            <BiEdit className="mr-1" size={16} />
                                                                        </button>
                                                                        <button
                                                                            className={`flex items-center ${offer.isActive === "on"
                                                                                ? "text-yellow-600 hover:text-yellow-900"
                                                                                : "text-green-600 hover:text-green-900"
                                                                                }`}
                                                                            title={offer.isActive === "on" ? "Disable" : "Enable"}
                                                                        >
                                                                            {offer.isActive === "on" ? (
                                                                                <FiPause className="mr-1" size={16} />
                                                                            ) : (
                                                                                <FiPlay className="mr-1" size={16} />
                                                                            )}
                                                                        </button>
                                                                        <AlertDialog>
                                                                            <AlertDialogTrigger asChild>
                                                                                <button
                                                                                    className="text-red-600 hover:text-red-900 flex items-center"
                                                                                    title="Delete"
                                                                                >
                                                                                    <MdDelete className="mr-1" size={16} />
                                                                                </button>
                                                                            </AlertDialogTrigger>
                                                                            <AlertDialogContent>
                                                                                <AlertDialogHeader>
                                                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                                    <AlertDialogDescription>
                                                                                        This action cannot be undone. This will permanently delete your
                                                                                        this document and remove data from our servers.
                                                                                    </AlertDialogDescription>
                                                                                </AlertDialogHeader>
                                                                                <AlertDialogFooter>
                                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                    <AlertDialogAction onClick={() => deleteOffer(offer._id)}>Continue</AlertDialogAction>
                                                                                </AlertDialogFooter>
                                                                            </AlertDialogContent>
                                                                        </AlertDialog>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-16">
                                            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-medium text-gray-800 mb-2">No promotions available</h3>
                                            <p className="text-gray-500 max-w-md mx-auto">Create your first promotion to attract more customers and boost sales.</p>
                                            <button onClick={() => setOpenNewForm(true)} className="mt-6 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                                                Create Promotion
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="w-full flex justify-center my-4 lg:justify-end">
                            <Pagination
                                total={totalPages}
                                page={currentPage || 1}
                                onChange={setCurrentPage}
                                withEdges={true}
                                siblings={1}
                                boundaries={1}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default PromotionsAndOfferManagement;
