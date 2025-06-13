'use client';

import { FaBuilding } from "react-icons/fa";
import { BiLoaderCircle } from "react-icons/bi";
import { toast as hotToast } from 'react-hot-toast';
import { toast as sonnerToast } from 'sonner';
import { FiSave, FiMail, FiPhone, FiGlobe, FiImage } from "react-icons/fi";
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

const FirstStep = () => {

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
            const response = await fetch(`http://localhost:3000/api/organization/first-step`, {
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

                    {/* Business Email */}
                    <div className="space-y-3">
                        <Label htmlFor="businessEmail" className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                            <FiMail className="w-4 h-4" />
                            Business Email
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            {...register('businessEmail')}
                            className="h-12 border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 rounded-xl shadow-sm"
                            id="businessEmail"
                            type="email"
                            placeholder="contact@yourfitnessbusiness.com"
                            required
                        />
                        {errors.businessEmail && (
                            <span className="text-xs font-medium text-red-600 flex items-center gap-1">
                                <span>⚠</span> {`${errors.businessEmail.message}`}
                            </span>
                        )}
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            We'll use this email for important system notifications and client communications.
                        </p>
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