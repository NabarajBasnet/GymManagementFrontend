'use client'

import { toast as hotToast } from "react-hot-toast";
import { toast as sonnerToast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import {
    MapPin,
    CreditCard,
    Building2,
    Globe,
    FileText,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react";
import { useTenant } from "@/components/Providers/LoggedInTenantProvider";
import {
    Eye,
    EyeOff,
    AlertTriangle,
    Info,
    Bell,
    BellOff,
    Mail,
    Phone,
    Trash2,
    ChevronRight
} from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define validation schema
const orgDetailsSchema = z.object({
    name: z.string().min(1, "Organization name is required").max(100),
    businessType: z.string().min(1, "Business type is required"),
    businessEmail: z.string().email("Invalid email address").min(1, "Email is required"),
    websiteUrl: z.union([
        z.string().url("Invalid URL").optional(),
        z.literal("")
    ]),
    logoUrl: z.union([
        z.string().url("Invalid URL").optional(),
        z.literal("")
    ])
});

const businessTypes = ["Gym", "CrossFit", "Yoga", "Fitness", "Martial Arts", "Other"]
const countries = ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France"]
const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "NPR", "INR", "YAN"]
const languages = ["English", "Spanish", "French", "German", "Chinese"]
const paymentProviders = ["Stripe", "PayPal", "Square", "Authorize.net"]

const OrgDetailsForm = () => {
    const tenant = useTenant();
    const loggedInTenant = tenant?.tenant?.tenant;
    const onboardAt = loggedInTenant?.onboardingStep;

    // React hook form
    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors, isSubmitSuccessful },
        reset,
        watch,
        setValue,
        control
    } = useForm({
        resolver: zodResolver(orgDetailsSchema),
        defaultValues: {
            name: "",
            businessType: "",
            businessEmail: "",
            websiteUrl: "",
            logoUrl: ""
        }
    });

    // State for loading
    const [isLoading, setIsLoading] = useState(false);

    // If we have existing organization data, populate the form
    useEffect(() => {
        if (loggedInTenant?.organization) {
            reset({
                name: loggedInTenant?.organization?.name || "",
                businessType: loggedInTenant?.organization?.businessType || "",
                businessEmail: loggedInTenant?.organization?.businessEmail || "",
                websiteUrl: loggedInTenant?.organization?.websiteUrl || "",
                logoUrl: loggedInTenant?.organization?.logoUrl || ""
            });
        }
    }, [loggedInTenant?.organization, reset, loggedInTenant]);

    // Handle Organization Setup
    const onSubmit = async (data) => {
        try {
            setIsLoading(true);

            const response = await fetch('http://localhost:3000/api/organization/register-organization', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                sonnerToast.success(result.message || "Organization details saved successfully");
                hotToast.success(result.message || "Organization details saved successfully");

                // If this is during onboarding, you might want to update the tenant context here
                // For example: updateTenant({ ...tenant, organization: data });
            } else {
                sonnerToast.error(result.message || "Failed to save organization details");
                hotToast.error(result.message || "Failed to save organization details");
            }
        } catch (error) {
            console.error("Error:", error);
            sonnerToast.error("An error occurred while saving organization details");
            hotToast.error("An error occurred while saving organization details");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center space-x-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {onboardAt === 'Business Info' ? 'Setup Your Organization' : 'Organization Details'}
                </h2>
            </div>

            <div className="grid p-6 grid-cols-1 md:grid-cols-2 gap-6">
                {/* Organization Name */}
                <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300 font-medium">Organization Name *</Label>
                    <Input
                        {...register("name")}
                        placeholder="Acme Inc."
                        className="py-6 rounded-sm dark:border-none bg-white dark:bg-gray-900 dark:text-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.name && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                {/* Business Type */}
                <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300 font-medium">Business Type *</Label>
                    <Controller
                        name="businessType"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="py-6 rounded-sm bg-white dark:bg-gray-900 dark:text-white border-gray-300 dark:border-none focus:ring-2 focus:ring-blue-500">
                                    <SelectValue placeholder="Select business type" />
                                </SelectTrigger>
                                <SelectContent className="rounded-sm dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700">
                                    {businessTypes.map(type => (
                                        <SelectItem
                                            key={type}
                                            value={type}
                                            className="hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer focus:bg-blue-50 dark:focus:bg-gray-700"
                                        >
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.businessType && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            {errors.businessType.message}
                        </p>
                    )}
                </div>

                {/* Business Email */}
                <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300 font-medium">Business Email *</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        <Input
                            {...register("businessEmail")}
                            type="email"
                            className="pl-10 py-6 rounded-sm dark:border-none bg-white dark:bg-gray-900 dark:text-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="contact@acme.com"
                        />
                    </div>
                    {errors.businessEmail && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            {errors.businessEmail.message}
                        </p>
                    )}
                </div>

                {/* Website URL */}
                <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300 font-medium">Website URL</Label>
                    <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        <Input
                            {...register("websiteUrl")}
                            className="pl-10 py-6 rounded-sm dark:border-none bg-white dark:bg-gray-900 dark:text-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://acme.com"
                        />
                    </div>
                    {errors.websiteUrl && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            {errors.websiteUrl.message}
                        </p>
                    )}
                </div>

                {/* Logo URL */}
                <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300 font-medium">Logo URL</Label>
                    <Input
                        {...register("logoUrl")}
                        className="py-6 rounded-sm dark:border-none dark:bg-gray-900 dark:text-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://acme.com/logo.png"
                    />
                    {errors.logoUrl && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            {errors.logoUrl.message}
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
                            {onboardAt === 'Business Info' ? 'Setting Up...' : 'Saving...'}
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            {onboardAt === 'Business Info' ? 'Setup Organization' : 'Save Changes'}
                        </span>
                    )}
                </Button>
            </div>
        </form>
    )
}

export default OrgDetailsForm;