'use client';

import { BiLoaderCircle } from "react-icons/bi";
import { toast as sonnerToast } from 'sonner';
import { FiSave, FiMapPin, FiGlobe, FiDollarSign, FiClock, FiType, FiChevronDown, FiCheck } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Search } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";

// Country data with flags
const countries = [
    { value: "US", label: "United States", flag: "🇺🇸" },
    { value: "GB", label: "United Kingdom", flag: "🇬🇧" },
    { value: "CA", label: "Canada", flag: "🇨🇦" },
    { value: "AU", label: "Australia", flag: "🇦🇺" },
    { value: "DE", label: "Germany", flag: "🇩🇪" },
    { value: "FR", label: "France", flag: "🇫🇷" },
    { value: "JP", label: "Japan", flag: "🇯🇵" },
    { value: "IN", label: "India", flag: "🇮🇳" },
    { value: "BR", label: "Brazil", flag: "🇧🇷" },
    { value: "CN", label: "China", flag: "🇨🇳" },
    { value: "RU", label: "Russia", flag: "🇷🇺" },
    { value: "ZA", label: "South Africa", flag: "🇿🇦" },
    { value: "MX", label: "Mexico", flag: "🇲🇽" },
    { value: "NP", label: "Nepal", flag: "🇳🇵" },
    { value: "PK", label: "Pakistan", flag: "🇵🇰" },
    { value: "BD", label: "Bangladesh", flag: "🇧🇩" },
    { value: "LK", label: "Sri Lanka", flag: "🇱🇰" },
    { value: "SG", label: "Singapore", flag: "🇸🇬" },
    { value: "MY", label: "Malaysia", flag: "🇲🇾" },
    { value: "TH", label: "Thailand", flag: "🇹🇭" },
];

// Timezones with representative countries
const timezones = [
    { value: "America/New_York", label: "Eastern Time (UTC-5/-4)", flag: "🇺🇸", description: "New York, Toronto" },
    { value: "America/Chicago", label: "Central Time (UTC-6/-5)", flag: "🇺🇸", description: "Chicago, Mexico City" },
    { value: "America/Denver", label: "Mountain Time (UTC-7/-6)", flag: "🇺🇸", description: "Denver, Phoenix" },
    { value: "America/Los_Angeles", label: "Pacific Time (UTC-8/-7)", flag: "🇺🇸", description: "Los Angeles, Vancouver" },
    { value: "Europe/London", label: "Greenwich Mean Time (UTC+0/+1)", flag: "🇬🇧", description: "London, Dublin" },
    { value: "Europe/Paris", label: "Central European Time (UTC+1/+2)", flag: "🇫🇷", description: "Paris, Berlin, Rome" },
    { value: "Asia/Dubai", label: "Gulf Standard Time (UTC+4)", flag: "🇦🇪", description: "Dubai, Abu Dhabi" },
    { value: "Asia/Kathmandu", label: "Nepal Time (UTC+5:45)", flag: "🇳🇵", description: "Kathmandu" },
    { value: "Asia/Tokyo", label: "Japan Standard Time (UTC+9)", flag: "🇯🇵", description: "Tokyo, Seoul" },
    { value: "Australia/Sydney", label: "Australian Eastern Time (UTC+10/+11)", flag: "🇦🇺", description: "Sydney, Melbourne" },
    { value: "Asia/Kolkata", label: "India Standard Time (UTC+5:30)", flag: "🇮🇳", description: "Mumbai, Delhi" },
    { value: "Asia/Shanghai", label: "China Standard Time (UTC+8)", flag: "🇨🇳", description: "Beijing, Shanghai" },
    { value: "America/Toronto", label: "Eastern Time - Toronto (UTC-5/-4)", flag: "🇨🇦", description: "Toronto, Montreal" },
];

// Currencies with proper symbols
const currencies = [
    { value: "USD", label: "US Dollar", symbol: "$", flag: "🇺🇸", description: "United States Dollar" },
    { value: "EUR", label: "Euro", symbol: "€", flag: "🇪🇺", description: "European Union Euro" },
    { value: "GBP", label: "British Pound", symbol: "£", flag: "🇬🇧", description: "British Pound Sterling" },
    { value: "JPY", label: "Japanese Yen", symbol: "¥", flag: "🇯🇵", description: "Japanese Yen" },
    { value: "AUD", label: "Australian Dollar", symbol: "A$", flag: "🇦🇺", description: "Australian Dollar" },
    { value: "CAD", label: "Canadian Dollar", symbol: "C$", flag: "🇨🇦", description: "Canadian Dollar" },
    { value: "CNY", label: "Chinese Yuan", symbol: "¥", flag: "🇨🇳", description: "Chinese Yuan" },
    { value: "INR", label: "Indian Rupee", symbol: "₹", flag: "🇮🇳", description: "Indian Rupee" },
    { value: "NPR", label: "Nepalese Rupee", symbol: "रु", flag: "🇳🇵", description: "Nepalese Rupee" },
    { value: "PKR", label: "Pakistani Rupee", symbol: "₨", flag: "🇵🇰", description: "Pakistani Rupee" },
    { value: "BDT", label: "Bangladeshi Taka", symbol: "৳", flag: "🇧🇩", description: "Bangladeshi Taka" },
    { value: "LKR", label: "Sri Lankan Rupee", symbol: "Rs", flag: "🇱🇰", description: "Sri Lankan Rupee" },
    { value: "SGD", label: "Singapore Dollar", symbol: "S$", flag: "🇸🇬", description: "Singapore Dollar" },
    { value: "MYR", label: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾", description: "Malaysian Ringgit" },
    { value: "THB", label: "Thai Baht", symbol: "฿", flag: "🇹🇭", description: "Thai Baht" },
];

const languages = [
    { value: "en", label: "English", flag: "🇺🇸", description: "Global business language" },
    { value: "es", label: "Spanish", flag: "🇪🇸", description: "Español" },
    { value: "fr", label: "French", flag: "🇫🇷", description: "Français" },
    { value: "de", label: "German", flag: "🇩🇪", description: "Deutsch" },
    { value: "ja", label: "Japanese", flag: "🇯🇵", description: "日本語" },
    { value: "ne", label: "Nepali", flag: "🇳🇵", description: "नेपाली" },
    { value: "hi", label: "Hindi", flag: "🇮🇳", description: "हिन्दी" },
    { value: "zh", label: "Chinese", flag: "🇨🇳", description: "中文" },
    { value: "pt", label: "Portuguese", flag: "🇧🇷", description: "Português" },
    { value: "ru", label: "Russian", flag: "🇷🇺", description: "Русский" },
    { value: "ar", label: "Arabic", flag: "🇸🇦", description: "العربية" },
];

// Custom Searchable Dropdown Component
const SearchableDropdown = ({
    options,
    placeholder,
    onSelect,
    searchPlaceholder,
    icon: Icon,
    value,
    error,
    required = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    const filteredOptions = useMemo(() => {
        return options.filter(option =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (option.description && option.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [options, searchTerm]);

    const selectedOption = options.find(option => option.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm("");
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (option) => {
        onSelect(option.value);
        setIsOpen(false);
        setSearchTerm("");
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                className={`h-14 pl-5 pr-12 border-2 rounded-xl shadow-sm text-lg font-medium transition-all duration-300 cursor-pointer flex items-center justify-between ${error
                    ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-950/20'
                    : isOpen
                        ? 'border-indigo-500 dark:border-indigo-400'
                        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                    } dark:bg-slate-800 dark:text-white`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    {selectedOption ? (
                        <>
                            <span className="text-2xl">{selectedOption.flag}</span>
                            <div>
                                <div className="font-semibold">{selectedOption.label}</div>
                                {selectedOption.symbol && (
                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                        {selectedOption.symbol} • {selectedOption.description || selectedOption.value}
                                    </div>
                                )}
                                {selectedOption.description && !selectedOption.symbol && (
                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                        {selectedOption.description}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <span className="text-slate-500 dark:text-slate-400">{placeholder}</span>
                    )}
                </div>
                <FiChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 rounded-xl shadow-2xl max-h-80 overflow-hidden">
                    {/* Search Input */}
                    <div className="sticky top-0 bg-white dark:bg-slate-800 px-4 py-3 border-b border-slate-200 dark:border-slate-600">
                        <div className="flex items-center gap-3">
                            <Search className="h-4 w-4 text-slate-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder={searchPlaceholder}
                                className="bg-transparent outline-none w-full text-sm placeholder:text-slate-400 dark:text-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="overflow-y-auto max-h-60">
                        {filteredOptions.length === 0 ? (
                            <div className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                                No options found
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className="cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-950/30 py-4 px-4 transition-all duration-200 border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                                    onClick={() => handleSelect(option)}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{option.flag}</span>
                                        <div className="flex-1">
                                            <div className="font-semibold text-slate-900 dark:text-white">
                                                {option.label}
                                                {option.symbol && (
                                                    <span className="ml-2 text-slate-600 dark:text-slate-300 font-bold">
                                                        {option.symbol}
                                                    </span>
                                                )}
                                            </div>
                                            {option.description && (
                                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                                    {option.description}
                                                </div>
                                            )}
                                        </div>
                                        {value === option.value && (
                                            <FiCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const SecondStep = () => {
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch
    } = useForm();

    const watchedValues = watch();

    const onSubmit = async (data) => {
        try {
            const response = await fetch(`http://localhost:3000/api/organization/second-step`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    country: data.country,
                    state: data.state,
                    city: data.city,
                    timezone: data.timezone,
                    currency: data.currency,
                    language: data.language
                }),
            });

            const resBody = await response.json();
            if (resBody.success) {
                sonnerToast.success("Location details updated successfully");
            } else {
                sonnerToast.error(resBody.message || "Failed to update location details");
            }
        } catch (error) {
            console.error("Error:", error);
            sonnerToast.error("Failed to update location details");
        }
    }

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="text-center pb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl mb-6 shadow-lg">
                    <FiGlobe className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                    Location & Regional Settings
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    Configure your regional preferences to ensure accurate scheduling, billing, and localization for your fitness business.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Business Location Section */}
                <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-8 border border-blue-100 dark:border-blue-900/30">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                            <FiMapPin className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Business Location</h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Country */}
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <FiGlobe className="w-4 h-4" />
                                Country
                                <span className="text-red-500 text-lg">*</span>
                            </Label>
                            <SearchableDropdown
                                options={countries}
                                placeholder="Select your country"
                                searchPlaceholder="Search countries..."
                                onSelect={(value) => setValue('country', value)}
                                value={watchedValues.country}
                                error={errors.country}
                                required
                            />
                            {errors.country && (
                                <div className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg">
                                    <span className="text-base">⚠️</span>
                                    {errors.country.message}
                                </div>
                            )}
                        </div>

                        {/* State/Province */}
                        <div className="space-y-3">
                            <Label htmlFor="state" className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <FiMapPin className="w-4 h-4" />
                                State/Province
                                <span className="text-red-500 text-lg">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    {...register('state', { required: 'State/Province is required' })}
                                    className={`h-14 pl-5 pr-5 border-2 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl shadow-sm text-lg font-medium transition-all duration-300 ${errors.state
                                        ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-950/20'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                                        } dark:bg-slate-800 dark:text-white`}
                                    id="state"
                                    placeholder="e.g., California, Ontario, Bagmati, etc."
                                />
                                {!errors.state && (
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    </div>
                                )}
                            </div>
                            {errors.state && (
                                <div className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg">
                                    <span className="text-base">⚠️</span>
                                    {errors.state.message}
                                </div>
                            )}
                        </div>

                        {/* City */}
                        <div className="lg:col-span-2 space-y-3">
                            <Label htmlFor="city" className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <FiMapPin className="w-4 h-4" />
                                City
                                <span className="text-red-500 text-lg">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    {...register('city', { required: 'City is required' })}
                                    className={`h-14 pl-5 pr-5 border-2 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl shadow-sm text-lg font-medium transition-all duration-300 ${errors.city
                                        ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-950/20'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                                        } dark:bg-slate-800 dark:text-white`}
                                    id="city"
                                    placeholder="e.g., Los Angeles, Toronto, Kathmandu, etc."
                                />
                                {!errors.city && (
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    </div>
                                )}
                            </div>
                            {errors.city && (
                                <div className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg">
                                    <span className="text-base">⚠️</span>
                                    {errors.city.message}
                                </div>
                            )}
                            <p className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 rounded-lg">
                                🏢 Your business location helps us provide accurate local services and compliance information.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Regional Preferences Section */}
                <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl p-8 border border-purple-100 dark:border-purple-900/30">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                            <FiClock className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Regional Preferences</h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Timezone */}
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <FiClock className="w-4 h-4" />
                                Timezone
                                <span className="text-red-500 text-lg">*</span>
                            </Label>
                            <SearchableDropdown
                                options={timezones}
                                placeholder="Select your timezone"
                                searchPlaceholder="Search timezones..."
                                onSelect={(value) => setValue('timezone', value)}
                                value={watchedValues.timezone}
                                error={errors.timezone}
                                required
                            />
                            {errors.timezone && (
                                <div className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg">
                                    <span className="text-base">⚠️</span>
                                    {errors.timezone.message}
                                </div>
                            )}
                            <p className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 rounded-lg">
                                ⏰ Used for class scheduling, reminders, and system timestamps
                            </p>
                        </div>

                        {/* Currency */}
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <FiDollarSign className="w-4 h-4" />
                                Currency
                                <span className="text-red-500 text-lg">*</span>
                            </Label>
                            <SearchableDropdown
                                options={currencies}
                                placeholder="Select your currency"
                                searchPlaceholder="Search currencies..."
                                onSelect={(value) => setValue('currency', value)}
                                value={watchedValues.currency}
                                error={errors.currency}
                                required
                            />
                            {errors.currency && (
                                <div className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg">
                                    <span className="text-base">⚠️</span>
                                    {errors.currency.message}
                                </div>
                            )}
                            <p className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 rounded-lg">
                                💰 Default currency for memberships, payments, and financial reports
                            </p>
                        </div>

                        {/* Language */}
                        <div className="lg:col-span-2 space-y-3">
                            <Label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <FiType className="w-4 h-4" />
                                Interface Language
                                <span className="text-red-500 text-lg">*</span>
                            </Label>
                            <SearchableDropdown
                                options={languages}
                                placeholder="Select interface language"
                                searchPlaceholder="Search languages..."
                                onSelect={(value) => setValue('language', value)}
                                value={watchedValues.language}
                                error={errors.language}
                                required
                            />
                            {errors.language && (
                                <div className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg">
                                    <span className="text-base">⚠️</span>
                                    {errors.language.message}
                                </div>
                            )}
                            <p className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 rounded-lg">
                                🌐 Language for your admin dashboard, emails, and system communications
                            </p>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl p-8 border border-emerald-100 dark:border-emerald-900/30">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                            <FiCheck className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Complete Regional Setup</h3>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                        Your regional settings will be applied across your entire fitness management platform to ensure the best experience for you and your clients.
                    </p>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full h-16 text-lg font-bold rounded-2xl shadow-lg transition-all duration-300 transform ${isSubmitting
                            ? "bg-slate-400 cursor-not-allowed scale-95"
                            : "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700                                    hover:to-cyan-700 hover:shadow-xl hover:scale-[1.01]"
                            }`}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center gap-3">
                                <BiLoaderCircle className="text-white animate-spin text-xl" />
                                <span className="dark:text-white">Saving Regional Settings...</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-3">
                                <FiSave className="text-xl dark:text-white" />
                                <span className="dark:text-white">Save Regional Settings</span>
                            </div>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default SecondStep;