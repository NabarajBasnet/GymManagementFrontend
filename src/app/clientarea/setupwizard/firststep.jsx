'use client';

import { FaBuilding } from "react-icons/fa";
import { BiLoaderCircle } from "react-icons/bi";
import { toast as hotToast } from 'react-hot-toast';
import { toast as sonnerToast } from 'sonner';
import { FiSave, FiMail, FiPhone, FiGlobe, FiImage, FiShield, FiCheck } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useState } from "react";

const FirstStep = () => {
    const [isGmailConnected, setIsGmailConnected] = useState(false);
    const [isConnectingGmail, setIsConnectingGmail] = useState(false);

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await fetch(`http://88.198.112.156:3100/api/organization/first-step`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });

            const resBody = await response.json();
            if (response.ok) {
                hotToast.success(resBody.message)
                sonnerToast.success(resBody.message)
            } else {
                hotToast.error(resBody.message)
                sonnerToast.error(resBody.message)
            }
        } catch (error) {
            console.log("Error: ", error);
            hotToast.error(error.message);
            sonnerToast.error(error.message);
        };
    };

    const handleGmailConnect = () => {
        setIsConnectingGmail(true);

        const CLIENT_ID = "751184591988-gbg1v35tlgk485e6145n9ir1jnrhsagr.apps.googleusercontent.com";
        const REDIRECT_URI = 'http://localhost:5000/oauth/callback';

        const scope = encodeURIComponent("https://www.googleapis.com/auth/gmail.send");
        const url = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `scope=${scope}` +
            `&access_type=offline` +
            `&include_granted_scopes=true` +
            `&prompt=consent` +
            `&response_type=code` +
            `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
            `&client_id=${CLIENT_ID}`;

        window.location.href = url;
    };

    const businessTypes = [
        { value: "Gym", label: "Traditional Gym" },
        { value: "CrossFit", label: "CrossFit Box" },
        { value: "Yoga", label: "Yoga Studio" },
        { value: "Fitness", label: "Personal Training" },
        { value: "Martial Arts", label: "Martial Arts Dojo" },
        { value: "Other", label: "Other Fitness Business" }
    ];

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center pb-6 border-b border-slate-200 dark:border-slate-700">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl mb-4">
                    <FaBuilding className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Tell us about your business
                </h2>
                <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                    Help us customize your Liftora experience by providing some basic information about your fitness business.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Organization Name */}
                    <div className="lg:col-span-2 space-y-3">
                        <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                            <FaBuilding className="w-4 h-4" />
                            Organization Name
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            {...register('name')}
                            className="h-12 border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 rounded-xl shadow-sm"
                            id="name"
                            placeholder="e.g., Peak Performance Fitness Center"
                            required
                        />
                        {errors.name && (
                            <span className="text-xs font-medium text-red-600 flex items-center gap-1">
                                <span>⚠</span> {`${errors.name.message}`}
                            </span>
                        )}
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            This name will appear on your client portal, invoices, and all customer-facing materials.
                        </p>
                    </div>

                    {/* Business Type */}
                    <div className="space-y-3">
                        <Label htmlFor="businessType" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            Business Type
                            <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Select required onValueChange={(value) => setValue('businessType', value)}>
                            <SelectTrigger className="h-12 border-slate-300 dark:text-white dark:border-slate-600 dark:bg-slate-800 rounded-xl shadow-sm">
                                <SelectValue placeholder="Select your business type" />
                            </SelectTrigger>
                            <SelectContent className="border-slate-200 dark:border-slate-600 dark:bg-slate-800 rounded-xl shadow-xl">
                                <SelectGroup>
                                    {businessTypes.map((type, index) => (
                                        <SelectItem
                                            key={index}
                                            value={type.value}
                                            className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 py-3 px-4 rounded-lg"
                                        >
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.businessType && (
                            <span className="text-xs font-medium text-red-600 flex items-center gap-1">
                                <span>⚠</span> {`${errors.businessType.message}`}
                            </span>
                        )}
                    </div>

                    {/* Gmail Connection Section */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                            <FiMail className="w-4 h-4" />
                            Business Email
                            <span className="text-red-500">*</span>
                        </Label>

                        {/* Gmail Connection Card */}
                        <div className="border border-slate-200 dark:border-slate-600 rounded-xl p-4 bg-white dark:bg-slate-800">
                            <div className="flex items-start gap-4">
                                {/* Gmail Logo */}
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-md">
                                        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-slate-900 dark:text-white">
                                            Connect Gmail Account
                                        </h3>
                                        {isGmailConnected && (
                                            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                                                <FiCheck className="w-3 h-3 text-green-600 dark:text-green-400" />
                                                <span className="text-xs font-medium text-green-700 dark:text-green-300">Connected</span>
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                                        Connect your Gmail account to send automated emails, notifications, and communications to your members directly from your organization.
                                    </p>

                                    {/* Features List */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                            <FiShield className="w-3 h-3" />
                                            <span>Secure OAuth2 authentication</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                            <FiMail className="w-3 h-3" />
                                            <span>Send emails directly from your Gmail</span>
                                        </div>
                                    </div>

                                    {/* Connection Button */}
                                    {!isGmailConnected ? (
                                        <Button
                                            type="button"
                                            onClick={handleGmailConnect}
                                            disabled={isConnectingGmail}
                                            className="w-full h-11 bg-white hover:bg-gray-50 border border-slate-300 text-slate-700 font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isConnectingGmail ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <BiLoaderCircle className="animate-spin text-lg" />
                                                    <span>Connecting...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-3">
                                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                                    </svg>
                                                    <span>Connect with Google</span>
                                                </div>
                                            )}
                                        </Button>
                                    ) : (
                                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <FiCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                                                    Gmail Connected Successfully
                                                </span>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setIsGmailConnected(false)}
                                                className="text-xs border-green-300 text-green-700 hover:bg-green-100"
                                            >
                                                Disconnect
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {errors.businessEmail && (
                            <span className="text-xs font-medium text-red-600 flex items-center gap-1">
                                <span>⚠</span> {`${errors.businessEmail.message}`}
                            </span>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-3">
                        <Label htmlFor="phoneNumber" className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                            <FiPhone className="w-4 h-4" />
                            Phone Number
                        </Label>
                        <Input
                            {...register('phoneNumber')}
                            className="h-12 border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 rounded-xl shadow-sm"
                            id="phoneNumber"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                        />
                        {errors.phoneNumber && (
                            <span className="text-xs font-medium text-red-600 flex items-center gap-1">
                                <span>⚠</span> {`${errors.phoneNumber.message}`}
                            </span>
                        )}
                    </div>

                    {/* Website URL */}
                    <div className="space-y-3">
                        <Label htmlFor="websiteUrl" className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                            <FiGlobe className="w-4 h-4" />
                            Website URL
                        </Label>
                        <Input
                            {...register('websiteUrl')}
                            className="h-12 border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 rounded-xl shadow-sm"
                            id="websiteUrl"
                            type="url"
                            placeholder="https://yourfitnessbusiness.com"
                        />
                        {errors.websiteUrl && (
                            <span className="text-xs font-medium text-red-600 flex items-center gap-1">
                                <span>⚠</span> {`${errors.websiteUrl.message}`}
                            </span>
                        )}
                    </div>

                    {/* Logo URL */}
                    <div className="lg:col-span-2 space-y-3">
                        <Label htmlFor="logoUrl" className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                            <FiImage className="w-4 h-4" />
                            Business Logo URL
                        </Label>
                        <Input
                            {...register('logoUrl')}
                            className="h-12 border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 rounded-xl shadow-sm"
                            id="logoUrl"
                            type="url"
                            placeholder="https://yourfitnessbusiness.com/logo.png"
                        />
                        {errors.logoUrl && (
                            <span className="text-xs font-medium text-red-600 flex items-center gap-1">
                                <span>⚠</span> {`${errors.logoUrl.message}`}
                            </span>
                        )}
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Your logo will be displayed on the client portal, invoices, and member communications. We recommend a square image (minimum 200x200px).
                        </p>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full h-14 text-base font-semibold rounded-xl shadow-lg transition-all duration-200 ${isSubmitting
                            ? "bg-slate-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
                            }`}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center gap-3">
                                <BiLoaderCircle className="dark:text-white animate-spin text-xl" />
                                <span className="dark:text-white">Saving Information...</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-3">
                                <FiSave className="dark:text-white text-xl" />
                                <span className="dark:text-white">Save Business Information</span>
                            </div>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default FirstStep;