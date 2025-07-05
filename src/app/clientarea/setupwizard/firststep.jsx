'use client';

import { FaBuilding } from "react-icons/fa";
import { BiLoaderCircle } from "react-icons/bi";
import { toast as sonnerToast } from 'sonner';
import { FiSave, FiMail, FiPhone, FiGlobe, FiImage, FiShield, FiCheck, FiUser, FiMapPin } from "react-icons/fi";
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
        const REDIRECT_URI = 'http://88.198.112.156:3100:5000/oauth/callback';

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
        { value: "Gym", label: "Traditional Gym", icon: "🏋️", description: "Full-service fitness facility" },
        { value: "CrossFit", label: "CrossFit Box", icon: "💪", description: "High-intensity functional fitness" },
        { value: "Yoga", label: "Yoga Studio", icon: "🧘", description: "Mind-body wellness center" },
        { value: "Fitness", label: "Personal Training", icon: "👨‍💼", description: "One-on-one fitness coaching" },
        { value: "Martial Arts", label: "Martial Arts Dojo", icon: "🥋", description: "Combat sports training" },
        { value: "Other", label: "Other Fitness Business", icon: "🏃", description: "Specialized fitness service" }
    ];

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="text-center pb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl mb-6 shadow-lg">
                    <FaBuilding className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    Tell us about your business
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    Help us customize your Liftora experience by providing some basic information about your fitness business. This information will be used across your platform.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Business Identity Section */}
                <div className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-2xl p-8 border border-indigo-100 dark:border-indigo-900/30">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <FaBuilding className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Business Identity</h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Organization Name */}
                        <div className="lg:col-span-2 space-y-3">
                            <Label htmlFor="name" className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <FiUser className="w-4 h-4" />
                                Organization Name
                                <span className="text-red-500 text-lg">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    {...register('name', { required: 'Organization name is required' })}
                                    className={`h-14 pl-5 pr-5 border-2 focus:border-indigo-500 dark:focus:border-indigo-400 rounded-xl shadow-sm text-lg font-medium transition-all duration-300 ${errors.name
                                            ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-950/20'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                                        } dark:bg-slate-800 dark:text-white`}
                                    id="name"
                                    placeholder="e.g., Peak Performance Fitness Center"
                                />
                                {!errors.name && (
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                    </div>
                                )}
                            </div>
                            {errors.name && (
                                <div className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg">
                                    <span className="text-base">⚠️</span>
                                    {errors.name.message}
                                </div>
                            )}
                            <p className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 rounded-lg">
                                💡 This name will appear on your client portal, invoices, and all customer-facing materials.
                            </p>
                        </div>

                        {/* Business Type */}
                        <div className="lg:col-span-2 space-y-3">
                            <Label htmlFor="businessType" className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <FiMapPin className="w-4 h-4" />
                                Business Type
                                <span className="text-red-500 text-lg">*</span>
                            </Label>
                            <Select required onValueChange={(value) => setValue('businessType', value)}>
                                <SelectTrigger className="h-14 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 focus:border-indigo-500 dark:focus:border-indigo-400 dark:text-white dark:bg-slate-800 rounded-xl shadow-sm text-lg font-medium transition-all duration-300">
                                    <SelectValue placeholder="Select your business type" />
                                </SelectTrigger>
                                <SelectContent className="border-slate-200 dark:border-slate-600 dark:bg-slate-800 rounded-xl shadow-2xl max-h-80">
                                    <SelectGroup>
                                        {businessTypes.map((type, index) => (
                                            <SelectItem
                                                key={index}
                                                value={type.value}
                                                className="cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-950/30 py-4 px-4 rounded-lg m-1 transition-all duration-200"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{type.icon}</span>
                                                    <div>
                                                        <div className="font-semibold">{type.label}</div>
                                                        <div className="text-sm text-slate-500 dark:text-slate-400">{type.description}</div>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.businessType && (
                                <div className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg">
                                    <span className="text-base">⚠️</span>
                                    {errors.businessType.message}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact Information Section */}
                <div className="bg-gradient-to-r from-cyan-50/50 to-blue-50/50 dark:from-cyan-950/20 dark:to-blue-950/20 rounded-2xl p-8 border border-cyan-100 dark:border-cyan-900/30">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center">
                            <FiMail className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Contact Information</h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Business Email */}
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <FiMail className="w-4 h-4" />
                                Business Email
                                <span className="text-red-500 text-lg">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    {...register('businessEmail', {
                                        required: 'Business email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    className={`h-14 pl-5 pr-5 border-2 focus:border-cyan-500 dark:focus:border-cyan-400 rounded-xl shadow-sm text-lg font-medium transition-all duration-300 ${errors.businessEmail
                                            ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-950/20'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-600'
                                        } dark:bg-slate-800 dark:text-white`}
                                    id="businessEmail"
                                    type="email"
                                    placeholder="yourgym@gmail.com"
                                />
                            </div>
                            {errors.businessEmail && (
                                <div className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg">
                                    <span className="text-base">⚠️</span>
                                    {errors.businessEmail.message}
                                </div>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-3">
                            <Label htmlFor="phoneNumber" className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <FiPhone className="w-4 h-4" />
                                Phone Number
                            </Label>
                            <div className="relative">
                                <Input
                                    {...register('phoneNumber')}
                                    className="h-14 pl-5 pr-5 border-2 border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-600 focus:border-cyan-500 dark:focus:border-cyan-400 dark:bg-slate-800 dark:text-white rounded-xl shadow-sm text-lg font-medium transition-all duration-300"
                                    id="phoneNumber"
                                    type="tel"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                            {errors.phoneNumber && (
                                <div className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg">
                                    <span className="text-base">⚠️</span>
                                    {errors.phoneNumber.message}
                                </div>
                            )}
                        </div>

                        {/* Website URL */}
                        <div className="space-y-3">
                            <Label htmlFor="websiteUrl" className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <FiGlobe className="w-4 h-4" />
                                Website URL
                            </Label>
                            <div className="relative">
                                <Input
                                    {...register('websiteUrl')}
                                    className="h-14 pl-5 pr-5 border-2 border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-600 focus:border-cyan-500 dark:focus:border-cyan-400 dark:bg-slate-800 dark:text-white rounded-xl shadow-sm text-lg font-medium transition-all duration-300"
                                    id="websiteUrl"
                                    type="url"
                                    placeholder="https://yourfitnessbusiness.com"
                                />
                            </div>
                            {errors.websiteUrl && (
                                <div className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg">
                                    <span className="text-base">⚠️</span>
                                    {errors.websiteUrl.message}
                                </div>
                            )}
                        </div>

                        {/* Logo URL */}
                        <div className="space-y-3">
                            <Label htmlFor="logoUrl" className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <FiImage className="w-4 h-4" />
                                Business Logo URL
                            </Label>
                            <div className="relative">
                                <Input
                                    {...register('logoUrl')}
                                    className="h-14 pl-5 pr-5 border-2 border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-600 focus:border-cyan-500 dark:focus:border-cyan-400 dark:bg-slate-800 dark:text-white rounded-xl shadow-sm text-lg font-medium transition-all duration-300"
                                    id="logoUrl"
                                    type="url"
                                    placeholder="https://yourfitnessbusiness.com/logo.png"
                                />
                            </div>
                            {errors.logoUrl && (
                                <div className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg">
                                    <span className="text-base">⚠️</span>
                                    {errors.logoUrl.message}
                                </div>
                            )}
                            <p className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 rounded-lg">
                                🎨 Your logo will be displayed on the client portal, invoices, and member communications. We recommend a square image (minimum 200x200px).
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
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Ready to Continue</h3>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                        Once you save this information, we'll set up your business profile and you can proceed to the next step.
                    </p>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full h-16 text-lg font-bold rounded-2xl shadow-lg transition-all duration-300 transform ${isSubmitting
                                ? "bg-slate-400 cursor-not-allowed scale-95"
                                : "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 hover:shadow-2xl hover:scale-105 active:scale-95"
                            }`}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center gap-4">
                                <BiLoaderCircle className="text-white animate-spin text-2xl" />
                                <div className="flex flex-col items-center">
                                    <span className="text-white font-bold">Saving Information...</span>
                                    <span className="text-white/80 text-sm">Please wait</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-4">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <FiSave className="text-white text-xl" />
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-white font-bold">Save Business Information</span>
                                    <span className="text-white/80 text-sm">Continue to next step</span>
                                </div>
                            </div>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default FirstStep;