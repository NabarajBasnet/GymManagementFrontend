'use client';

import Loader from "@/components/Loader/Loader";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Copy, Share2, Clock, Users, Tag, Gift, Sparkles, CheckCircle, Star, Calendar, TrendingUp } from 'lucide-react';
import toast from "react-hot-toast";

const OfferShowcase = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 6;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [copiedCode, setCopiedCode] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    const baseURL = `https://fitbinary.com/api/promotionsandoffers/`;

    // Fetch real offers data
    const getAllOffers = async ({ queryKey }) => {
        const [, page] = queryKey;
        try {
            const response = await fetch(`${baseURL}?page=${page}&limit=${limit}`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error.message);
            toast.error(error.message, {
                style: {
                    background: '#EF4444',
                    color: '#fff',
                },
                iconTheme: {
                    primary: '#fff',
                    secondary: '#EF4444',
                },
            });
        };
    };

    const { data, isLoading } = useQuery({
        queryKey: ['promotionsandoffers', currentPage],
        queryFn: getAllOffers,
    });

    const { offers, totalPages } = data || { offers: [], totalPages: 1 };

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const copyPromoCodeToClipboard = (promoCode) => {
        navigator.clipboard.writeText(promoCode)
            .then(() => {
                setCopiedCode(promoCode);
                toast.success(`Copied: ${promoCode}`, {
                    style: {
                        background: '#10B981',
                        color: '#fff',
                    },
                    iconTheme: {
                        primary: '#fff',
                        secondary: '#10B981',
                    },
                });
                setTimeout(() => setCopiedCode(''), 2000);
            })
            .catch(() => toast.error("Failed to copy promo code", {
                style: {
                    background: '#EF4444',
                    color: '#fff',
                },
                iconTheme: {
                    primary: '#fff',
                    secondary: '#EF4444',
                },
            }));
    };

    const formatAudience = (audiences) => {
        if (!audiences) return 'All Users';
        return audiences.map(aud =>
            aud.replace(/_/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
        ).join(', ');
    };

    const getDaysRemaining = (endDate) => {
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getDiscountBadgeColor = (offer) => {
        if (offer.discountValueIsPercentage) {
            return offer.discountValue >= 30 ? 'from-red-500 to-pink-600' : 'from-orange-500 to-red-600';
        }
        return 'from-blue-500 to-indigo-600';
    };

    const getPopularityScore = (offer) => {
        const usageRatio = offer.timesUsed / offer.usageLimit;
        const baseScore = 4.0;
        const popularity = baseScore + (usageRatio * 1.5);
        return Math.min(5.0, popularity).toFixed(1);
    };

    if (isLoading) {
        return (
            <Loader />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            {/* Hero Section */}
            <div className="bg-[radial-gradient(circle,_rgba(168,162,158,1)_0%,_rgba(75,85,99,1)_60%,_rgba(55,65,81,1)_100%)] dark:bg-[radial-gradient(circle,_rgba(31,41,55,1)_0%,_rgba(17,24,39,1)_60%,_rgba(3,7,18,1)_100%)] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <div className="flex justify-center items-center space-x-2 mb-4">
                            <Sparkles className="h-8 w-8 text-yellow-300" />
                            <h1 className="text-4xl md:text-6xl font-bold">
                                Exclusive Offers
                            </h1>
                            <Sparkles className="h-8 w-8 text-yellow-300" />
                        </div>
                        <p className="text-sm md:text-lg text-indigo-100 dark:text-indigo-200 max-w-3xl mx-auto">
                            Discover amazing deals and unlock incredible savings on our premium services
                        </p>
                        <div className="mt-8 flex justify-center">
                            <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
                                <p className="text-lg">
                                    <span className="font-bold text-yellow-300">{offers?.length || 0}</span> Active Offers Available
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search for offers..."
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center space-x-3">
                            <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            <select
                                className="border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="all">All Categories</option>
                                <option value="welcome">Welcome Offers</option>
                                <option value="seasonal">Seasonal Deals</option>
                                <option value="upgrade">Premium Upgrades</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Offers Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {offers && offers.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {offers.map((offer) => {
                                const daysRemaining = getDaysRemaining(offer.endDate);
                                const usagePercentage = (offer.timesUsed / offer.usageLimit) * 100;
                                const popularityScore = getPopularityScore(offer);

                                return (
                                    <div
                                        key={offer._id}
                                        className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-500 hover:-translate-y-1"
                                    >
                                        {/* Card Header */}
                                        <div className="relative p-6 pb-4">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center space-x-2">
                                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                                        <Gift className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                        <span className="text-sm text-gray-600 dark:text-gray-300">{popularityScore}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {offer.isActive === 'on' && (
                                                        <span className="flex items-center space-x-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                                                            <CheckCircle className="h-3 w-3" />
                                                            <span>Active</span>
                                                        </span>
                                                    )}
                                                    {daysRemaining <= 7 && (
                                                        <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-xs font-medium">
                                                            Ending Soon
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Discount Badge */}
                                            <div className={`inline-flex items-center space-x-2 bg-gradient-to-r ${getDiscountBadgeColor(offer)} text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg`}>
                                                <Tag className="h-5 w-5" />
                                                <span>
                                                    {offer.discountValueIsPercentage
                                                        ? `${offer.discountValue}% OFF`
                                                        : `$${offer.discountValue} OFF`}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Content */}
                                        <div className="px-6 pb-6">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {offer.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                                                {offer.description}
                                            </p>

                                            {/* Offer Details */}
                                            <div className="space-y-3 mb-6">
                                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                                                        <Tag className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                                                        Promo Code
                                                    </span>
                                                    <div className="flex items-center space-x-2">
                                                        <code className="bg-white dark:bg-gray-600 px-3 py-1 rounded-lg font-mono text-sm border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                                                            {offer.promoCode}
                                                        </code>
                                                        <button
                                                            onClick={() => copyPromoCodeToClipboard(offer.promoCode)}
                                                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                                        >
                                                            {copiedCode === offer.promoCode ? (
                                                                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                            ) : (
                                                                <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400 flex items-center">
                                                        <Calendar className="h-4 w-4 mr-2" />
                                                        Valid Until
                                                    </span>
                                                    <span className="font-medium text-gray-900 dark:text-gray-200">
                                                        {new Date(offer.endDate).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">Min. Purchase</span>
                                                    <span className="font-medium text-gray-900 dark:text-gray-200">${offer.minimumPurchase || 0}</span>
                                                </div>

                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400 flex items-center">
                                                        <Users className="h-4 w-4 mr-2" />
                                                        Eligible For
                                                    </span>
                                                    <span className="font-medium text-gray-900 dark:text-gray-200 text-right">
                                                        {formatAudience(offer.selectedAudiences)}
                                                    </span>
                                                </div>

                                                {/* Usage Progress */}
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600 dark:text-gray-400 flex items-center">
                                                            <TrendingUp className="h-4 w-4 mr-2" />
                                                            Claimed
                                                        </span>
                                                        <span className="font-medium text-gray-900 dark:text-gray-200">
                                                            {offer.timesUsed || 0} / {offer.usageLimit || '∞'}
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full transition-all duration-300 ${usagePercentage >= 90 ? 'bg-gradient-to-r from-red-500 to-pink-600' :
                                                                usagePercentage >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
                                                                    'bg-gradient-to-r from-green-500 to-emerald-600'
                                                                }`}
                                                            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex space-x-3">
                                                <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                                                    Claim Offer
                                                </button>
                                                <button className="p-3 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 rounded-xl transition-colors group">
                                                    <Share2 className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex justify-center">
                                <div className="flex space-x-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentPage === page
                                                ? 'bg-indigo-600 dark:bg-indigo-700 text-white'
                                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="mx-auto w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-8">
                            <Gift className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">No Active Offers</h3>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-lg">
                            Don't worry! New exciting offers are coming soon. Check back later for amazing deals.
                        </p>
                    </div>
                )}
            </div>

            {/* Footer CTA */}
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 dark:from-indigo-950 dark:to-purple-950 text-white py-16 transition-colors duration-300">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Don't Miss Out on Future Offers!
                    </h2>
                    <p className="text-md font-medium text-indigo-200 dark:text-indigo-300 mb-8">
                        Subscribe to our newsletter and be the first to know about new deals and exclusive offers.
                    </p>
                    <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-6 py-3 rounded-md text-gray-900 dark:text-gray-100 border-0 focus:ring-2 focus:ring-yellow-400 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-3 rounded-md transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfferShowcase;