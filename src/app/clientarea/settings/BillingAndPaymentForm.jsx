"use client";

import { toast as hotToast } from "react-hot-toast";
import { toast as sonnerToast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, FileText, Mail, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useTenant } from "@/components/Providers/LoggedInTenantProvider";
import { Card } from "@/components/ui/card";

// Define validation schema
const billingSchema = z.object({
    billingAddressLine1: z.string().min(1, "Address line 1 is required"),
    billingAddressLine2: z.string().optional(),
    billingCity: z.string().min(1, "City is required"),
    billingState: z.string().min(1, "State is required"),
    billingZipCode: z.string().min(1, "ZIP code is required"),
    billingCountry: z.string().min(1, "Country is required"),
    taxId: z.string().optional(),
    invoiceEmail: z.string().email("Invalid email").min(1, "Invoice email is required"),
    paymentProvider: z.string().min(1, "Payment provider is required"),
    paymentAccountId: z.string().min(1, "Payment account ID is required")
});

const countries = ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France"];
const paymentProviders = ["Stripe", "PayPal", "Square", "Authorize.net"];

const BillingAndPaymentForm = () => {
    const { tenant, updateTenant } = useTenant();
    const loggedInTenant = tenant?.tenant;
    const onboardAt = loggedInTenant?.onboardingStep;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        control,
        setValue
    } = useForm({
        resolver: zodResolver(billingSchema)
    });

    const [isLoading, setIsLoading] = useState(false);

    // Populate form with existing data
    useEffect(() => {
        if (loggedInTenant?.organization) {
            const org = loggedInTenant.organization;
            const billingData = {
                billingAddressLine1: org.billingAddress?.addressLine1 || "",
                billingAddressLine2: org.billingAddress?.addressLine2 || "",
                billingCity: org.billingAddress?.city || "",
                billingState: org.billingAddress?.state || "",
                billingZipCode: org.billingAddress?.zipCode || "",
                billingCountry: org.billingAddress?.country || "",
                taxId: org.taxId || "",
                invoiceEmail: org.invoiceEmail || "",
                paymentProvider: org.paymentProvider || "",
                paymentAccountId: org.paymentAccountId || ""
            };

            reset(billingData);

            // Explicitly set select values
            if (org.billingAddress?.country) {
                setValue("billingCountry", org?.billingAddress?.country);
            }
            if (org.paymentProvider) {
                setValue("paymentProvider", org?.paymentProvider);
            }
        }
    }, [loggedInTenant?.organization, reset, setValue]);

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);

            const response = await fetch('http://88.198.112.156:3100/api/organization/update-billingandpayment-details', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                sonnerToast.success(result.message || "Billing details saved successfully");
                hotToast.success(result.message || "Billing details saved successfully");

                // Update the tenant context with new organization data
                if (result.organization && updateTenant) {
                    updateTenant({
                        tenant: {
                            ...loggedInTenant,
                            organization: result.organization
                        }
                    });
                }
            } else {
                sonnerToast.error(result.message || "Failed to save billing details");
                hotToast.error(result.message || "Failed to save billing details");
            }
        } catch (error) {
            console.error("Error:", error);
            sonnerToast.error("An error occurred while saving billing details");
            hotToast.error("An error occurred while saving billing details");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center space-x-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {onboardAt === 'Billing' ? 'Setup Your Billing & Payments' : 'Billing & Payments'}
                </h2>
            </div>

            <div className="grid p-6 grid-cols-1 md:grid-cols-2 gap-6">
                {/* Billing Address Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        <MapPin className="w-5 h-5 text-primary" />
                        <h3 className="font-medium text-lg">Billing Address</h3>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-700 dark:text-gray-300 font-medium">Address Line 1 *</Label>
                        <Input
                            {...register("billingAddressLine1")}
                            className="py-6 rounded-sm dark:border-none bg-white dark:bg-gray-900 dark:text-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="123 Main St"
                        />
                        {errors.billingAddressLine1 && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                {errors.billingAddressLine1.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-700 dark:text-gray-300 font-medium">Address Line 2</Label>
                        <Input
                            {...register("billingAddressLine2")}
                            className="py-6 rounded-sm dark:border-none bg-white dark:bg-gray-900 dark:text-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Apt 4B"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-700 dark:text-gray-300 font-medium">City *</Label>
                        <Input
                            {...register("billingCity")}
                            className="py-6 rounded-sm dark:border-none bg-white dark:bg-gray-900 dark:text-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="San Francisco"
                        />
                        {errors.billingCity && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                {errors.billingCity.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-700 dark:text-gray-300 font-medium">State *</Label>
                        <Input
                            {...register("billingState")}
                            className="py-6 rounded-sm dark:border-none bg-white dark:bg-gray-900 dark:text-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="CA"
                        />
                        {errors.billingState && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                {errors.billingState.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-700 dark:text-gray-300 font-medium">ZIP/Postal Code *</Label>
                        <Input
                            {...register("billingZipCode")}
                            className="py-6 rounded-sm dark:border-none bg-white dark:bg-gray-900 dark:text-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="94105"
                        />
                        {errors.billingZipCode && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                {errors.billingZipCode.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-700 dark:text-gray-300 font-medium">Country *</Label>
                        <Controller
                            name="billingCountry"
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
                        {errors.billingCountry && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                {errors.billingCountry.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Payment Information Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-5 h-5 text-primary" />
                        <h3 className="font-medium text-lg">Payment Information</h3>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-700 dark:text-gray-300 font-medium">Tax ID</Label>
                        <Input
                            {...register("taxId")}
                            className="py-6 rounded-sm dark:border-none bg-white dark:bg-gray-900 dark:text-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="123-45-6789"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-700 dark:text-gray-300 font-medium">Invoice Email *</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                            <Input
                                {...register("invoiceEmail")}
                                type="email"
                                className="pl-10 py-6 rounded-sm dark:border-none bg-white dark:bg-gray-900 dark:text-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="billing@acme.com"
                            />
                        </div>
                        {errors.invoiceEmail && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                {errors.invoiceEmail.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-700 dark:text-gray-300 font-medium">Payment Provider *</Label>
                        <Controller
                            name="paymentProvider"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="py-6 rounded-sm bg-white dark:bg-gray-900 dark:text-white border-gray-300 dark:border-none focus:ring-2 focus:ring-blue-500">
                                        <SelectValue placeholder="Select provider" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-sm dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700">
                                        {paymentProviders.map(provider => (
                                            <SelectItem
                                                key={provider}
                                                value={provider}
                                                className="hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer focus:bg-blue-50 dark:focus:bg-gray-700"
                                            >
                                                {provider}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.paymentProvider && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                {errors.paymentProvider.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-700 dark:text-gray-300 font-medium">Payment Account ID *</Label>
                        <Input
                            {...register("paymentAccountId")}
                            className="py-6 rounded-sm dark:border-none bg-white dark:bg-gray-900 dark:text-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="acct_123456789"
                        />
                        {errors.paymentAccountId && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                {errors.paymentAccountId.message}
                            </p>
                        )}
                    </div>
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
                            {onboardAt === 'Billing' ? 'Setting Up...' : 'Saving...'}
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            {onboardAt === 'Billing' ? 'Setup Billing' : 'Save Changes'}
                        </span>
                    )}
                </Button>
            </div>
        </form>
    );
};

export default BillingAndPaymentForm;