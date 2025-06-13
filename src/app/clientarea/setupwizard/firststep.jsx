'use client';

import { BiLoaderCircle } from "react-icons/bi";
import { toast as hotToast } from 'react-hot-toast';
import { toast as sonnerToast } from 'sonner';
import { FiSave } from "react-icons/fi";
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

    return (
        <div className="space-y-6 dark:bg-gray-800">
            <div>
                <h2 className="text-xl dark:text-gray-300 font-semibold text-gray-900 mb-3">Business Information</h2>
                <p className="text-gray-600 dark:text-gray-200 font-medium mb-6">Tell us about your fitness business to help us customize your experience.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name" className='dark:text-gray-200'>Organization Name *</Label>
                        <Input
                            {...register('name')}
                            className='py-6 rounded-sm dark:bg-gray-900 dark:text-white dark:border-none'
                            id="name"
                            placeholder="e.g. Peak Performance Gym"
                            required
                        />
                        {errors.name && (
                            <span className='text-xs font-medium text-red-600'>{`${errors.name.message}`}</span>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-200">This will appear on your client-facing materials</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="businessType" className='dark:text-gray-200'>Business Type *</Label>
                        <Select required onValueChange={(value) => setValue(value, 'businessType')}>
                            <SelectTrigger className='py-6 dark:bg-gray-900 dark:border-none rounded-sm dark:text-white'>
                                <SelectValue placeholder="Select your business type" />
                            </SelectTrigger>
                            <SelectContent className='dark:bg-gray-900 dark:border-none'>
                                <SelectGroup>
                                    {
                                        ["Gym", "CrossFit", "Yoga", "Fitness", "Martial Arts", "Other"].map((type, index) =>
                                            <SelectItem className='cursor-pointer hover:bg-blue-500' key={index} value={type}>{type}</SelectItem>
                                        )
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.businessType && (
                            <span className='text-xs font-medium text-red-600'>{`${errors.businessType.message}`}</span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="businessEmail" className='dark:text-gray-200'>Business Email *</Label>
                        <Input
                            {...register('businessEmail')}
                            className='py-6 rounded-sm dark:bg-gray-900 dark:border-none dark:text-white'
                            id="businessEmail"
                            type="email"
                            placeholder="contact@yourgym.com"
                            required
                        />
                        {errors.businessEmail && (
                            <span className='text-xs font-medium text-red-600'>{`${errors.businessEmail.message}`}</span>
                        )}
                        <p className="text-xs dark:text-gray-200 text-gray-500">We'll use this for important notifications</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber" className='dark:text-gray-200'>Phone Number</Label>
                        <Input
                            {...register('phoneNumber')}
                            className='py-6 rounded-sm dark:text-white dark:border-none dark:bg-gray-900'
                            id="phoneNumber"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                        />
                        {errors.phoneNumber && (
                            <span className='text-xs font-medium text-red-600'>{`${errors.phoneNumber.message}`}</span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="websiteUrl" className='dark:text-gray-200'>Website URL</Label>
                        <Input
                            {...register('websiteUrl')}
                            className='py-6 rounded-sm dark:bg-gray-900 dark:text-white dark:border-none'
                            id="websiteUrl"
                            type="url"
                            placeholder="https://yourgym.com"
                        />
                        {errors.websiteUrl && (
                            <span className='text-xs font-medium text-red-600'>{`${errors.websiteUrl.message}`}</span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="logoUrl" className='dark:text-gray-200'>Logo URL</Label>
                        <Input
                            {...register('logoUrl')}
                            className='py-6 rounded-sm dark:bg-gray-900 dark:border-none dark:text-white'
                            id="logoUrl"
                            type="url"
                            placeholder="https://yourgym.com/logo.png"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-200">We'll display this on your client portal</p>
                    </div>
                </div>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-6 mt-4 rounded-sm flex items-center justify-center gap-2 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                        }`}
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
        </div>
    )
}
export default FirstStep;
