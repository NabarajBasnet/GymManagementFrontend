'use client';

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

// Icons
import {
    FaExclamationTriangle,
    FaPlayCircle,
    FaSpinner,
} from 'react-icons/fa';
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdError, MdClose, MdDone } from "react-icons/md";
import { QrCode, RefreshCw, Search, User, Calendar, Timer, Info, AlertCircle, CheckCircle, ChevronRight, Plus, Trash2, Save, X, ArrowUpDown } from 'lucide-react';
import toast from "react-hot-toast";

const PromotionsAndOfferManagement = () => {

    const [openNewForm, setOpenNewForm] = useState(false);
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    // React hook form
    const {
        register,
        formState: { isSubmitting, errors },
        reset,
        handleSubmit
    } = useForm();

    const audienceOptions = [
        { id: 'new_joiners', label: 'New Joiners' },
        { id: 'expired_members', label: 'Expired Members' },
        { id: 'all_members', label: 'All Members' },
        { id: 'students', label: 'Students' },
        { id: 'seniors', label: 'Seniors' },
        { id: 'corporate', label: 'Corporate' },
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
            const response = await fetch(`http://localhost:3000/api/promotionsandoffers`, {
                method: "POST",
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

        } catch (error) {
            console.log("Error: ", error);
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
            console.log('Response Body: ', responseBody);
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
    console.log('offers: ', offers);

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
                                onClick={() => setOpenNewForm(false)}
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
                                onClick={() => setOpenNewForm(false)}
                                variant="outline"
                                className="h-10 px-4 md:px-6 rounded-md border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
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
                        </div>
                    </form>
                </div>
            )}

            <div className="p-4 md:p-6">
                <Tabs defaultValue="account" className="w-full mx-auto">
                    <TabsList className="grid w-80 grid-cols-2">
                        <TabsTrigger value="cards">Cards</TabsTrigger>
                        <TabsTrigger value="table">Table</TabsTrigger>
                    </TabsList>
                    <TabsContent value="cards">
                        <div>
                            {isLoading ? (
                                <Loader />
                            ) : (
                                <div className="">
                                    {Array.isArray(offers) && offers.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {offers.map((offer) => (
                                                <div key={offer._id} className="border border-gray-200 rounded-lg shadow-sm p-6 bg-white relative">
                                                    {/* Card Header */}
                                                    <div className="flex justify-between items-start mb-4">
                                                        <h3 className="text-lg font-semibold text-gray-800">{offer.title}</h3>
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${offer.isActive === "on"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-gray-100 text-gray-800"
                                                            }`}>
                                                            {offer.isActive === "on" ? "Active" : "Inactive"}
                                                        </span>
                                                    </div>

                                                    {/* Discount Badge */}
                                                    <div className={`inline-block px-3 py-1 mb-4 rounded-md font-bold ${offer.discountValueIsPercentage
                                                        ? "bg-red-500 text-white"
                                                        : "bg-blue-500 text-white"
                                                        }`}>
                                                        {offer.discountValueIsPercentage
                                                            ? `${offer.discountValue}% OFF`
                                                            : `$${offer.discountValue} OFF`}
                                                    </div>

                                                    {/* Description */}
                                                    <p className="text-gray-600 mb-4">{offer.description}</p>

                                                    {/* Details Grid */}
                                                    <div className="space-y-2 mb-6">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">Promo Code:</span>
                                                            <span className="font-medium">{offer.promoCode}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">Valid:</span>
                                                            <span>
                                                                {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">Min. Purchase:</span>
                                                            <span>${offer.minimumPurchase}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">Usage:</span>
                                                            <span>{offer.timesUsed}/{offer.usageLimit} used</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">Eligible For:</span>
                                                            <span className="text-right">
                                                                {offer.selectedAudiences.map(aud => aud.replace(/_/g, ' ')).join(', ')}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Apply Button */}
                                                    <button className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition duration-200">
                                                        Apply Offer
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10">
                                            <h3 className="text-xl font-medium text-gray-600 mb-2">No promotions and offers recorded</h3>
                                            <p className="text-gray-500">Check back later for exciting deals!</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="table">
                        <div>
                            {isLoading ? (
                                <Loader />
                            ) : (
                                <div className="">
                                    {Array.isArray(offers) && offers.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promo Code</th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Dates</th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {offers.map((offer) => (
                                                        <tr key={offer._id}>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="font-medium text-gray-900">{offer.title}</div>
                                                                <p className="text-sm text-gray-500 h-full max-w-80">{offer.description}</p>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${offer.discountValueIsPercentage ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                                                    }`}>
                                                                    {offer.discountValueIsPercentage
                                                                        ? `${offer.discountValue}% OFF`
                                                                        : `$${offer.discountValue} OFF`}
                                                                </span>
                                                                <div className="text-sm text-gray-500">Min: ${offer.minimumPurchase}</div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                                                {offer.promoCode}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-900">
                                                                    {new Date(offer.startDate).toLocaleDateString()}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    to {new Date(offer.endDate).toLocaleDateString()}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${offer.isActive === "on" ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                    {offer.isActive === "on" ? 'Active' : 'Inactive'}
                                                                </span>
                                                                <div className="text-sm text-gray-500">
                                                                    Used: {offer.timesUsed}/{offer.usageLimit}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                                                                <button className="text-red-600 hover:text-red-900">Delete</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-10">
                                            <h3 className="text-xl font-medium text-gray-600 mb-2">No promotions and offers recorded</h3>
                                            <p className="text-gray-500">Check back later for exciting deals!</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <Pagination
                        total={totalPages}
                        page={currentPage || 1}
                        onChange={setCurrentPage}
                        withEdges={true}
                        siblings={1}
                        boundaries={1}
                    />
                </Tabs>
            </div>
        </div>
    )
}

export default PromotionsAndOfferManagement;
