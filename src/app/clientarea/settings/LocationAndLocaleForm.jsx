"use client";

import { toast as sonnerToast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { MapPin, Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useTenant } from "@/components/Providers/LoggedInTenantProvider";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define validation schema
const locationSchema = z.object({
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State/Province is required"),
    city: z.string().min(1, "City is required"),
    timezone: z.string().min(1, "Timezone is required"),
    currency: z.string().min(1, "Currency is required"),
    language: z.string().min(1, "Language is required")
});

const countries = ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France"];
const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "NPR", "INR", "YAN"];
const languages = ["English", "Spanish", "French", "German", "Chinese"];
const timezones = ["PST (UTC-8)", "EST (UTC-5)", "CST (UTC-6)", "GMT (UTC+0)", "CET (UTC+1)"];

const LocationAndLocaleForm = () => {
    const tenant = useTenant();
    const loggedInTenant = tenant?.tenant?.tenant;
    const onboardAt = loggedInTenant?.onboardingStep;

    // React hook form

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors, isSubmitSuccessful },
        reset,
        control
    } = useForm({
        resolver: zodResolver(locationSchema),
        defaultValues: {
            country: "",
            state: "",
            city: "",
            timezone: "",
            currency: "",
            language: ""
        }
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (loggedInTenant?.organization) {
            reset({
                country: loggedInTenant.organization.country || "",
                state: loggedInTenant.organization.state || "",
                city: loggedInTenant.organization.city || "",
                timezone: loggedInTenant.organization.timezone || "",
                currency: loggedInTenant.organization.currency || "",
                language: loggedInTenant.organization.language || ""
            });
        }
    }, [loggedInTenant?.organization, reset]);

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);

            const response = await fetch('https://fitbinary.com/api/organization/update-location-details', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth header
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                sonnerToast.success(result.message || "Location details saved successfully");
            } else {
                sonnerToast.error(result.message || "Failed to save location details");
            }
        } catch (error) {
            console.error("Error:", error);
            sonnerToast.error("An error occurred while saving location details");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center space-x-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {onboardAt === 'Location' ? 'Setup Your Location & Locale' : 'Location & Locale'}
                </h2>
            </div>

            <div className="grid p-6 grid-cols-1 md:grid-cols-2 gap-6">
                {/* Country */}
                <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300 font-medium">Country *</Label>
                    <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="py-6 rounded-sm bg-white dark:bg-gray-900 dark:text-white border-gray-300 dark:border-none focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                                <SelectContent className="rounded-sm dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700">
                                    {countries.map(country => (
                                        <SelectItem
                                            key={country}
                                            value={country}
                                            className="hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer focus:bg-blue-50 dark:focus:bg-gray-700"
                                        >
                                            {country}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.country && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            {errors.country.message}
                        </p>
                    )}
                </div>

                {/* State/Province */}
                <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300 font-medium">State/Province *</Label>
                    <Input
                        {...register("state")}
                        placeholder="California"
                        className="py-6 rounded-sm dark:border-none bg-white dark:bg-gray-900 dark:text-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.state && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            {errors.state.message}
                        </p>
                    )}
                </div>

                {/* City */}
                <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300 font-medium">City *</Label>
                    <Input
                        {...register("city")}
                        placeholder="San Francisco"
                        className="py-6 rounded-sm dark:border-none bg-white dark:bg-gray-900 dark:text-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.city && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            {errors.city.message}
                        </p>
                    )}
                </div>

                {/* Timezone */}
                <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300 font-medium">Timezone *</Label>
                    <Controller
                        name="timezone"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="py-6 rounded-sm bg-white dark:bg-gray-900 dark:text-white border-gray-300 dark:border-none focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="Select timezone" />
                                </SelectTrigger>
                                <SelectContent className="rounded-sm dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700">
                                    {timezones.map(tz => (
                                        <SelectItem
                                            key={tz}
                                            value={tz}
                                            className="hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer focus:bg-blue-50 dark:focus:bg-gray-700"
                                        >
                                            {tz}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.timezone && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            {errors.timezone.message}
                        </p>
                    )}
                </div>

                {/* Currency */}
                <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300 font-medium">Currency *</Label>
                    <Controller
                        name="currency"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="py-6 rounded-sm bg-white dark:bg-gray-900 dark:text-white border-gray-300 dark:border-none focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent className="rounded-sm dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700">
                                    {currencies.map(currency => (
                                        <SelectItem
                                            key={currency}
                                            value={currency}
                                            className="hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer focus:bg-blue-50 dark:focus:bg-gray-700"
                                        >
                                            {currency}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.currency && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            {errors.currency.message}
                        </p>
                    )}
                </div>

                {/* Language */}
                <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300 font-medium">Language *</Label>
                    <Controller
                        name="language"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="py-6 rounded-sm bg-white dark:bg-gray-900 dark:text-white border-gray-300 dark:border-none focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent className="rounded-sm dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700">
                                    {languages.map(language => (
                                        <SelectItem
                                            key={language}
                                            value={language}
                                            className="hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer focus:bg-blue-50 dark:focus:bg-gray-700"
                                        >
                                            {language}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.language && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            {errors.language.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Fields marked with * are required
                </div>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {onboardAt === 'Location' ? 'Setting Up...' : 'Saving...'}
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            {onboardAt === 'Location' ? 'Setup Location' : 'Save Changes'}
                        </span>
                    )}
                </Button>
            </div>
        </form>
    );
};

export default LocationAndLocaleForm;