'use client';

import { BiLoaderCircle } from "react-icons/bi";
import { toast as hotToast } from 'react-hot-toast';
import { toast as sonnerToast } from 'sonner';
import { FiSave } from "react-icons/fi";
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
    // Add more countries as needed
];

// Timezones with representative countries
const timezones = [
    { value: "America/New_York", label: "Eastern Time (ET)", country: "US" },
    { value: "America/Chicago", label: "Central Time (CT)", country: "US" },
    { value: "America/Denver", label: "Mountain Time (MT)", country: "US" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)", country: "US" },
    { value: "Europe/London", label: "London (GMT)", country: "GB" },
    { value: "Europe/Paris", label: "Paris (CET)", country: "FR" },
    { value: "Asia/Dubai", label: "Dubai (GST)", country: "AE" },
    { value: "Asia/Kathmandu", label: "Kathmandu (NPT)", country: "NP" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)", country: "JP" },
    { value: "Australia/Sydney", label: "Sydney (AEST)", country: "AU" },
    { value: "Asia/Kolkata", label: "India (IST)", country: "IN" },
    { value: "Asia/Shanghai", label: "China (CST)", country: "CN" },
    { value: "America/Toronto", label: "Toronto (EST)", country: "CA" },
    // Add more timezones as needed
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
    // Add more currencies as needed
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
]

// Country flag component
function CountryFlag({ countryCode }) {
    return (
        <span className={`fi fi-${countryCode.toLowerCase()} mr-2`}></span>
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
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Location & Preferences</h2>
                <p className="text-gray-600 mb-6">Configure your regional settings for proper scheduling and billing.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select 
                        onValueChange={(value) => setValue('country', value)} 
                        required
                    >
                        <SelectTrigger className="py-6 dark:bg-gray-800 rounded-sm dark:text-white">
                            <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent>
                            <div className="px-3 py-2 flex items-center border-b">
                                <Search className="h-4 w-4 mr-2 opacity-50" />
                                <input
                                    type="text"
                                    placeholder="Search countries..."
                                    className="bg-transparent outline-none w-full"
                                    value={countrySearch}
                                    onChange={(e) => setCountrySearch(e.target.value)}
                                />
                            </div>
                            <SelectGroup>
                                {filteredCountries.map((country) => (
                                    <SelectItem key={country.value} value={country.value}>
                                        <div className="flex items-center">
                                            <CountryFlag countryCode={country.flag} />
                                            {country.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="state">State/Province *</Label>
                    <Input
                        {...register('state')}
                        className="py-6 rounded-sm"
                        id="state"
                        placeholder="e.g. California"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                        {...register('city')}
                        className="py-6 rounded-sm"
                        id="city"
                        placeholder="e.g. Los Angeles"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone *</Label>
                    <Select 
                        onValueChange={(value) => setValue('timezone', value)} 
                        required
                    >
                        <SelectTrigger className="py-6 dark:bg-gray-800 rounded-sm dark:text-white">
                            <SelectValue placeholder="Select your timezone" />
                        </SelectTrigger>
                        <SelectContent>
                            <div className="px-3 py-2 flex items-center border-b">
                                <Search className="h-4 w-4 mr-2 opacity-50" />
                                <input
                                    type="text"
                                    placeholder="Search timezones..."
                                    className="bg-transparent outline-none w-full"
                                    value={timezoneSearch}
                                    onChange={(e) => setTimezoneSearch(e.target.value)}
                                />
                            </div>
                            <SelectGroup>
                                {filteredTimezones.map((tz) => (
                                    <SelectItem key={tz.value} value={tz.value}>
                                        <div className="flex items-center">
                                            {tz.country && <CountryFlag countryCode={tz.country} />}
                                            {tz.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">Affects class scheduling and reminders</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="currency">Currency *</Label>
                    <Select 
                        onValueChange={(value) => setValue('currency', value)} 
                        required
                    >
                        <SelectTrigger className="py-6 dark:bg-gray-800 rounded-sm dark:text-white">
                            <SelectValue placeholder="Select your currency" />
                        </SelectTrigger>
                        <SelectContent>
                            <div className="px-3 py-2 flex items-center border-b">
                                <Search className="h-4 w-4 mr-2 opacity-50" />
                                <input
                                    type="text"
                                    placeholder="Search currencies..."
                                    className="bg-transparent outline-none w-full"
                                    value={currencySearch}
                                    onChange={(e) => setCurrencySearch(e.target.value)}
                                />
                            </div>
                            <SelectGroup>
                                {filteredCurrencies.map((curr) => (
                                    <SelectItem key={curr.value} value={curr.value}>
                                        <div className="flex items-center">
                                            {curr.country && <CountryFlag countryCode={curr.country} />}
                                            <span className="mr-2">{curr.symbol}</span>
                                            {curr.label} ({curr.value})
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="language">Language *</Label>
                    <Select 
                        onValueChange={(value) => setValue('language', value)} 
                        required
                    >
                        <SelectTrigger className="py-6 dark:bg-gray-800 rounded-sm dark:text-white">
                            <SelectValue placeholder="Select your language" />
                        </SelectTrigger>
                        <SelectContent>
                            <div className="px-3 py-2 flex items-center border-b">
                                <Search className="h-4 w-4 mr-2 opacity-50" />
                                <input
                                    type="text"
                                    placeholder="Search languages..."
                                    className="bg-transparent outline-none w-full"
                                    value={languageSearch}
                                    onChange={(e) => setLanguageSearch(e.target.value)}
                                />
                            </div>
                            <SelectGroup>
                                {filteredLanguages.map((lang) => (
                                    <SelectItem key={lang.value} value={lang.value}>
                                        <div className="flex items-center">
                                            {lang.country && <CountryFlag countryCode={lang.country} />}
                                            {lang.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">Affects your admin interface language</p>
                </div>

            </div>
            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 mt-4 rounded-sm flex items-center justify-center gap-2"
            >
                {isSubmitting ? (
                    <>
                        <BiLoaderCircle className="animate-spin text-xl" />
                        Submitting...
                    </>
                ) : (
                    <>
                        <FiSave className="text-xl" />
                        Submit Details
                    </>
                )}
            </Button>
        </form>
    );
};

export default SecondStep;
