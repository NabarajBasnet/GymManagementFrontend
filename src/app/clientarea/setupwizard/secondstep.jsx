'use client';

import { BiLoaderCircle } from "react-icons/bi";
import { toast as hotToast } from 'react-hot-toast';
import { toast as sonnerToast } from 'sonner';
import { FiSave, FiMapPin, FiGlobe, FiDollarSign, FiClock, FiType } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";

// Country data with flags
const countries = [
    { value: "US", label: "United States", flag: "US" },
    { value: "GB", label: "United Kingdom", flag: "GB" },
    { value: "CA", label: "Canada", flag: "CA" },
    { value: "AU", label: "Australia", flag: "AU" },
    { value: "DE", label: "Germany", flag: "DE" },
    { value: "FR", label: "France", flag: "FR" },
    { value: "JP", label: "Japan", flag: "JP" },
    { value: "IN", label: "India", flag: "IN" },
    { value: "BR", label: "Brazil", flag: "BR" },
    { value: "CN", label: "China", flag: "CN" },
    { value: "RU", label: "Russia", flag: "RU" },
    { value: "ZA", label: "South Africa", flag: "ZA" },
    { value: "MX", label: "Mexico", flag: "MX" },
    { value: "NP", label: "Nepal", flag: "NP" },
    { value: "PK", label: "Pakistan", flag: "PK" },
    { value: "BD", label: "Bangladesh", flag: "BD" },
    { value: "LK", label: "Sri Lanka", flag: "LK" },
    { value: "SG", label: "Singapore", flag: "SG" },
    { value: "MY", label: "Malaysia", flag: "MY" },
    { value: "TH", label: "Thailand", flag: "TH" },
];

// Timezones with representative countries
const timezones = [
    { value: "America/New_York", label: "Eastern Time (UTC-5/-4)", country: "US" },
    { value: "America/Chicago", label: "Central Time (UTC-6/-5)", country: "US" },
    { value: "America/Denver", label: "Mountain Time (UTC-7/-6)", country: "US" },
    { value: "America/Los_Angeles", label: "Pacific Time (UTC-8/-7)", country: "US" },
    { value: "Europe/London", label: "Greenwich Mean Time (UTC+0/+1)", country: "GB" },
    { value: "Europe/Paris", label: "Central European Time (UTC+1/+2)", country: "FR" },
    { value: "Asia/Dubai", label: "Gulf Standard Time (UTC+4)", country: "AE" },
    { value: "Asia/Kathmandu", label: "Nepal Time (UTC+5:45)", country: "NP" },
    { value: "Asia/Tokyo", label: "Japan Standard Time (UTC+9)", country: "JP" },
    { value: "Australia/Sydney", label: "Australian Eastern Time (UTC+10/+11)", country: "AU" },
    { value: "Asia/Kolkata", label: "India Standard Time (UTC+5:30)", country: "IN" },
    { value: "Asia/Shanghai", label: "China Standard Time (UTC+8)", country: "CN" },
    { value: "America/Toronto", label: "Eastern Time - Toronto (UTC-5/-4)", country: "CA" },
];

// Currencies with proper symbols
const currencies = [
    { value: "USD", label: "US Dollar", symbol: "$", country: "US" },
    { value: "EUR", label: "Euro", symbol: "€", country: "EU" },
    { value: "GBP", label: "British Pound", symbol: "£", country: "GB" },
    { value: "JPY", label: "Japanese Yen", symbol: "¥", country: "JP" },
    { value: "AUD", label: "Australian Dollar", symbol: "A$", country: "AU" },
    { value: "CAD", label: "Canadian Dollar", symbol: "C$", country: "CA" },
    { value: "CNY", label: "Chinese Yuan", symbol: "¥", country: "CN" },
    { value: "INR", label: "Indian Rupee", symbol: "₹", country: "IN" },
    { value: "NPR", label: "Nepalese Rupee", symbol: "रु", country: "NP" },
    { value: "PKR", label: "Pakistani Rupee", symbol: "₨", country: "PK" },
    { value: "BDT", label: "Bangladeshi Taka", symbol: "৳", country: "BD" },
    { value: "LKR", label: "Sri Lankan Rupee", symbol: "Rs", country: "LK" },
    { value: "SGD", label: "Singapore Dollar", symbol: "S$", country: "SG" },
    { value: "MYR", label: "Malaysian Ringgit", symbol: "RM", country: "MY" },
    { value: "THB", label: "Thai Baht", symbol: "฿", country: "TH" },
];

const languages = [
    { value: "en", label: "English", country: "US" },
    { value: "es", label: "Spanish", country: "ES" },
    { value: "fr", label: "French", country: "FR" },
    { value: "de", label: "German", country: "DE" },
    { value: "ja", label: "Japanese", country: "JP" },
    { value: "ne", label: "Nepali", country: "NP" },
    { value: "hi", label: "Hindi", country: "IN" },
    { value: "zh", label: "Chinese", country: "CN" },
    { value: "pt", label: "Portuguese", country: "BR" },
    { value: "ru", label: "Russian", country: "RU" },
    { value: "ar", label: "Arabic", country: "SA" },
];

// Country flag component
function CountryFlag({ countryCode }) {
    if (!countryCode) return null;
    return (
        <span className={`fi fi-${countryCode.toLowerCase()} mr-3 text-lg`}></span>
    );
}

const SecondStep = () => {
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch
    } = useForm();

    // Separate search terms for each field
    const [countrySearch, setCountrySearch] = useState("");
    const [timezoneSearch, setTimezoneSearch] = useState("");
    const [currencySearch, setCurrencySearch] = useState("");
    const [languageSearch, setLanguageSearch] = useState("");

    // Separate filtered lists
    const filteredCountries = useMemo(() => {
        return countries.filter(country =>
            country.label.toLowerCase().includes(countrySearch.toLowerCase())
        );
    }, [countrySearch]);

    const filteredTimezones = useMemo(() => {
        return timezones.filter(tz =>
            tz.label.toLowerCase().includes(timezoneSearch.toLowerCase())
        );
    }, [timezoneSearch]);

    const filteredCurrencies = useMemo(() => {
        return currencies.filter(curr =>
            curr.label.toLowerCase().includes(currencySearch.toLowerCase())
        );
    }, [currencySearch]);

    const filteredLanguages = useMemo(() => {
        return languages.filter(lang =>
            lang.label.toLowerCase().includes(languageSearch.toLowerCase())
        );
    }, [languageSearch]);

    const onSubmit = async (data) => {
        try {
            const response = await fetch(`http://88.198.112.156:3100/api/organization/second-step`, {
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
        <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center pb-6 border-b border-slate-200 dark:border-slate-700">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl mb-4">
                    <FiGlobe className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Location & Regional Settings
                </h2>
                <p className="text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                    Configure your regional preferences to ensure accurate scheduling, billing, and localization for your fitness business.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Location Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <FiMapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Business Location</h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Country */}
                        <div className="space-y-3">
                            <Label htmlFor="country" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Country
                                <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <Select
                                onValueChange={(value) => setValue('country', value)}
                                required
                            >
                                <SelectTrigger className="h-12 dark:text-white border-slate-300 dark:border-slate-600 dark:bg-slate-800 rounded-xl shadow-sm">
                                    <SelectValue placeholder="Select your country" />
                                </SelectTrigger>
                                <SelectContent className="border-slate-200 dark:border-slate-600 dark:bg-slate-800 rounded-xl shadow-xl max-h-80">
                                    <div className="sticky top-0 bg-white dark:bg-slate-800 px-3 py-2 border-b border-slate-200 dark:border-slate-600">
                                        <div className="flex items-center">
                                            <Search className="h-4 w-4 mr-2 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Search countries..."
                                                className="bg-transparent outline-none w-full text-sm placeholder:text-slate-400 dark:text-white"
                                                value={countrySearch}
                                                onChange={(e) => setCountrySearch(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <SelectGroup>
                                        {filteredCountries.map((country) => (
                                            <SelectItem
                                                key={country.value}
                                                value={country.value}
                                                className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 py-3 px-4"
                                            >
                                                <div className="flex items-center">
                                                    <CountryFlag countryCode={country.flag} />
                                                    <span className="font-medium">{country.label}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.country && (
                                <span className="text-xs font-medium text-red-600 flex items-center gap-1">
                                    <span>⚠</span> {`${errors.country.message}`}
                                </span>
                            )}
                        </div>

                        {/* State/Province */}
                        <div className="space-y-3">
                            <Label htmlFor="state" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                State/Province
                                <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <Input
                                {...register('state')}
                                className="h-12 border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 rounded-xl shadow-sm"
                                id="state"
                                placeholder="e.g., California, Ontario, etc."
                                required
                            />
                            {errors.state && (
                                <span className="text-xs font-medium text-red-600 flex items-center gap-1">
                                    <span>⚠</span> {`${errors.state.message}`}
                                </span>
                            )}
                        </div>

                        {/* City */}
                        <div className="lg:col-span-2 space-y-3">
                            <Label htmlFor="city" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                City
                                <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <Input
                                {...register('city')}
                                className="h-12 border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 rounded-xl shadow-sm"
                                id="city"
                                placeholder="e.g., Los Angeles, Toronto, etc."
                                required
                            />
                            {errors.city && (
                                <span className="text-xs font-medium text-red-600 flex items-center gap-1">
                                    <span>⚠</span> {`${errors.city.message}`}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Regional Preferences Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <FiClock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Regional Preferences</h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Timezone */}
                        <div className="space-y-3">
                            <Label htmlFor="timezone" className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <FiClock className="w-4 h-4" />
                                Timezone
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                onValueChange={(value) => setValue('timezone', value)}
                                required
                            >
                                <SelectTrigger className="h-12 dark:text-white border-slate-300 dark:border-slate-600 dark:bg-slate-800 rounded-xl shadow-sm">
                                    <SelectValue placeholder="Select your timezone" />
                                </SelectTrigger>
                                <SelectContent className="border-slate-200 dark:border-slate-600 dark:bg-slate-800 rounded-xl shadow-xl max-h-80">
                                    <div className="sticky top-0 bg-white dark:bg-slate-800 px-3 py-2 border-b border-slate-200 dark:border-slate-600">
                                        <div className="flex items-center">
                                            <Search className="h-4 w-4 mr-2 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Search timezones..."
                                                className="bg-transparent outline-none w-full text-sm placeholder:text-slate-400 dark:text-white"
                                                value={timezoneSearch}
                                                onChange={(e) => setTimezoneSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <SelectGroup>
                                        {filteredTimezones.map((tz) => (
                                            <SelectItem
                                                key={tz.value}
                                                value={tz.value}
                                                className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 py-3 px-4"
                                            >
                                                <div className="flex items-center">
                                                    {tz.country && <CountryFlag countryCode={tz.country} />}
                                                    <span className="font-medium">{tz.label}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Used for class scheduling, reminders, and system timestamps
                            </p>
                        </div>

                        {/* Currency */}
                        <div className="space-y-3">
                            <Label htmlFor="currency" className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <FiDollarSign className="w-4 h-4" />
                                Currency
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                onValueChange={(value) => setValue('currency', value)}
                                required
                            >
                                <SelectTrigger className="h-12 dark:text-white border-slate-300 dark:border-slate-600 dark:bg-slate-800 rounded-xl shadow-sm">
                                    <SelectValue placeholder="Select your currency" />
                                </SelectTrigger>
                                <SelectContent className="border-slate-200 dark:border-slate-600 dark:bg-slate-800 rounded-xl shadow-xl max-h-80">
                                    <div className="sticky top-0 bg-white dark:bg-slate-800 px-3 py-2 border-b border-slate-200 dark:border-slate-600">
                                        <div className="flex items-center">
                                            <Search className="h-4 w-4 mr-2 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Search currencies..."
                                                className="bg-transparent outline-none w-full text-sm placeholder:text-slate-400 dark:text-white"
                                                value={currencySearch}
                                                onChange={(e) => setCurrencySearch(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <SelectGroup>
                                        {filteredCurrencies.map((curr) => (
                                            <SelectItem
                                                key={curr.value}
                                                value={curr.value}
                                                className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 py-3 px-4"
                                            >
                                                <div className="flex items-center">
                                                    {curr.country && <CountryFlag countryCode={curr.country} />}
                                                    <span className="font-bold text-slate-600 dark:text-slate-300 mr-2 min-w-[2rem]">
                                                        {curr.symbol}
                                                    </span>
                                                    <span className="font-medium">{curr.label}</span>
                                                    <span className="ml-auto text-sm text-slate-500">({curr.value})</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Default currency for memberships, payments, and financial reports
                            </p>
                        </div>

                        {/* Language */}
                        <div className="lg:col-span-2 space-y-3">
                            <Label htmlFor="language" className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <FiType className="w-4 h-4" />
                                Interface Language
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                onValueChange={(value) => setValue('language', value)}
                                required
                            >
                                <SelectTrigger className="h-12 dark:text-white border-slate-300 dark:border-slate-600 dark:bg-slate-800 rounded-xl shadow-sm">
                                    <SelectValue placeholder="Select interface language" />
                                </SelectTrigger>
                                <SelectContent className="border-slate-200 dark:border-slate-600 dark:bg-slate-800 rounded-xl shadow-xl max-h-80">
                                    <div className="sticky top-0 bg-white dark:bg-slate-800 px-3 py-2 border-b border-slate-200 dark:border-slate-600">
                                        <div className="flex items-center">
                                            <Search className="h-4 w-4 mr-2 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Search languages..."
                                                className="bg-transparent outline-none w-full text-sm placeholder:text-slate-400 dark:text-white"
                                                value={languageSearch}
                                                onChange={(e) => setLanguageSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <SelectGroup>
                                        {filteredLanguages.map((lang) => (
                                            <SelectItem
                                                key={lang.value}
                                                value={lang.value}
                                                className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 py-3 px-4"
                                            >
                                                <div className="flex items-center">
                                                    {lang.country && <CountryFlag countryCode={lang.country} />}
                                                    <span className="font-medium">{lang.label}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Language for your admin dashboard, emails, and system communications
                            </p>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full h-14 text-base font-semibold rounded-xl shadow-lg transition-all duration-200 ${isSubmitting
                            ? "bg-slate-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl"
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
