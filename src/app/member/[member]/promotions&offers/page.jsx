'use client';

import { FiPause, FiCopy, FiShare2 } from "react-icons/fi";
import { BiEdit } from "react-icons/bi";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { MdHome } from "react-icons/md";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import Pagination from '@/components/ui/CustomPagination';
import Loader from "@/components/Loader/Loader";
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

    // Form Data States
    const [offerType, setSelectedOfferType] = useState('');
    const [discountValueIsPercentage, setDiscountValueIsPercentage] = useState(false);
    const [selectedAudiences, setSelectedAudiences] = useState([]);
    const baseURL = `http://localhost:3000/api/promotionsandoffers/`;

    const getAllOffers = async ({ queryKey }) => {
        const [, page] = queryKey;
        try {
            const response = await fetch(`${baseURL}?page=${page}&limit=${limit}`);
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
            {/* Header */}
            <div className="p-4">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">Promotion And Offer</h1>
            </div>

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

                <div className="my-4">
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
                                                className="rounded-sm shadow-md p-5 bg-white hover:shadow-lg border transition-shadow duration-200 flex flex-col"
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
                                                    <div className="flex space-x-2">
                                                        <Button className="px-3 py-1.5 text-sm bg-transparent font-medium text-green-600 hover:text-green-800 transition-colors border border-green-200 rounded-lg hover:bg-green-100">
                                                            Grab Offer
                                                        </Button>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setSubmitMode('edit');
                                                            getSingleOfferDetails(offer._id);
                                                        }}
                                                        className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                                                        <FiShare2 className="mr-2" size={16} />
                                                        Share
                                                    </button>
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
                </div>
            </div>
        </div>
    )
}

export default PromotionsAndOfferManagement;
