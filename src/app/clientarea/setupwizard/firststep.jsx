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
                sonnerToast.success(resBody.message)
            } else {
                sonnerToast.error(resBody.message)
            }
        } catch (error) {
            console.log("Error: ", error);
            sonnerToast.error(error.message);
        };
    };

    const handleGmailConnect = () => {
        setIsConnectingGmail(true);

        const CLIENT_ID = "751184591988-gbg1v35tlgk485e6145n9ir1jnrhsagr.apps.googleusercontent.com";
        const REDIRECT_URI = 'http://88.198.112.156:5000/oauth/callback';

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

                        <Input
                            {...register('businessEmail')}
                            className="h-12 border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 rounded-xl shadow-sm"
                            id="businessEmail"
                            type="email"
                            placeholder="yourgym@gmail.com"
                        />

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