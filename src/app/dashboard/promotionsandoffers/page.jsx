'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { FaSpinner } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const PromotionForm = ({ onClose }) => {
    const [isPercentage, setIsPercentage] = useState(false);
    const [selectedAudience, setSelectedAudience] = useState(['all_members']);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
        watch,
        setValue,
    } = useForm();

    const audienceOptions = [
        { id: 'new_joiners', label: 'New Joiners' },
        { id: 'expired_members', label: 'Expired Members' },
        { id: 'all_members', label: 'All Members' },
        { id: 'students', label: 'Students' },
        { id: 'seniors', label: 'Seniors' },
        { id: 'corporate', label: 'Corporate' },
    ];

    const offerTypes = [
        { value: 'discount', label: 'Discount' },
        { value: 'referral', label: 'Referral' },
        { value: 'seasonal', label: 'Seasonal' },
        { value: 'festival', label: 'Festival' },
        { value: 'loyalty', label: 'Loyalty' },
        { value: 'membership', label: 'Membership' },
        { value: 'other', label: 'Other' },
    ];

    const onSubmit = async (data) => {
        try {
            console.log('Form data:', data);
            // Add your submission logic here
            // await submitPromotion(data);
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleAudienceChange = (audienceId) => {
        setSelectedAudience(prev => {
            if (prev.includes(audienceId)) {
                return prev.filter(id => id !== audienceId);
            } else {
                return [...prev, audienceId];
            }
        });
    };

    return (
        <div className="w-full flex justify-center items-center bg-black bg-opacity-70 backdrop-blur-sm fixed inset-0 z-50">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white w-11/12 md:w-9/12 max-w-6xl h-[95vh] rounded-md shadow-xl flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b">
                    <h1 className='text-lg font-medium'>Create New Promotions & Offers</h1>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <IoMdClose className="h-5 w-5" />
                    </button>
                </div>

                {/* Main Form Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Promotion Title*</Label>
                        <Input
                            id="title"
                            {...register('title', {
                                required: 'Title is required',
                                maxLength: {
                                    value: 100,
                                    message: 'Title cannot exceed 100 characters'
                                }
                            })}
                            placeholder="Enter promotion title"
                            className={errors.title ? 'border-red-500' : ''}
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            {...register('description', {
                                maxLength: {
                                    value: 500,
                                    message: 'Description cannot exceed 500 characters'
                                }
                            })}
                            placeholder="Enter promotion description"
                            rows={3}
                            className={errors.description ? 'border-red-500' : ''}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Offer Type */}
                    <div className="space-y-2">
                        <Label htmlFor="offerType">Offer Type*</Label>
                        <Select
                            onValueChange={(value) => setValue('offerType', value)}
                            defaultValue="discount"
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select offer type" />
                            </SelectTrigger>
                            <SelectContent>
                                {offerTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <input
                            type="hidden"
                            {...register('offerType', { required: 'Offer type is required' })}
                        />
                        {errors.offerType && (
                            <p className="text-red-500 text-sm">{errors.offerType.message}</p>
                        )}
                    </div>

                    {/* Discount Value */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="discountValue">Discount Value*</Label>
                            <Input
                                id="discountValue"
                                type="number"
                                {...register('discountValue', {
                                    required: 'Discount value is required',
                                    min: {
                                        value: 0,
                                        message: 'Discount cannot be negative'
                                    },
                                    validate: (value) => {
                                        if (isPercentage && value > 100) {
                                            return 'Percentage discount cannot exceed 100%';
                                        }
                                        return true;
                                    }
                                })}
                                placeholder={isPercentage ? "0-100%" : "Enter amount"}
                                className={errors.discountValue ? 'border-red-500' : ''}
                            />
                            {errors.discountValue && (
                                <p className="text-red-500 text-sm">{errors.discountValue.message}</p>
                            )}
                        </div>
                        <div className="flex items-end space-x-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isPercentage"
                                    checked={isPercentage}
                                    onCheckedChange={() => setIsPercentage(!isPercentage)}
                                />
                                <Label htmlFor="isPercentage">Is Percentage</Label>
                            </div>
                            <input
                                type="hidden"
                                {...register('isPercentage')}
                                value={isPercentage}
                            />
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date*</Label>
                            <Input
                                id="startDate"
                                control={control}
                                name="startDate"
                                rules={{ required: 'Start date is required' }}
                                placeholder="Select start date"
                                minDate={new Date()}
                            />
                            {errors.startDate && (
                                <p className="text-red-500 text-sm">{errors.startDate.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate">End Date*</Label>
                            <Input
                                id="endDate"
                                control={control}
                                name="endDate"
                                rules={{
                                    required: 'End date is required',
                                    validate: (value) => {
                                        const startDate = watch('startDate');
                                        if (startDate && value < startDate) {
                                            return 'End date must be after start date';
                                        }
                                        return true;
                                    }
                                }}
                                placeholder="Select end date"
                                minDate={watch('startDate') || new Date()}
                            />
                            {errors.endDate && (
                                <p className="text-red-500 text-sm">{errors.endDate.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Target Audience */}
                    <div className="space-y-2">
                        <Label>Target Audience*</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {audienceOptions.map((audience) => (
                                <div key={audience.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={audience.id}
                                        checked={selectedAudience.includes(audience.id)}
                                        onCheckedChange={() => handleAudienceChange(audience.id)}
                                    />
                                    <Label htmlFor={audience.id}>{audience.label}</Label>
                                </div>
                            ))}
                        </div>
                        <input
                            type="hidden"
                            {...register('targetAudience', {
                                validate: (value) =>
                                    selectedAudience.length > 0 || 'At least one audience is required'
                            })}
                            value={selectedAudience}
                        />
                        {errors.targetAudience && (
                            <p className="text-red-500 text-sm">{errors.targetAudience.message}</p>
                        )}
                    </div>

                    {/* Promo Code */}
                    <div className="space-y-2">
                        <Label htmlFor="promoCode">Promo Code (Optional)</Label>
                        <Input
                            id="promoCode"
                            {...register('promoCode', {
                                maxLength: {
                                    value: 20,
                                    message: 'Promo code cannot exceed 20 characters'
                                }
                            })}
                            placeholder="Enter promo code (e.g., SUMMER20)"
                            className={errors.promoCode ? 'border-red-500' : ''}
                        />
                        {errors.promoCode && (
                            <p className="text-red-500 text-sm">{errors.promoCode.message}</p>
                        )}
                    </div>

                    {/* Usage Limit */}
                    <div className="space-y-2">
                        <Label htmlFor="usageLimit">Usage Limit (Optional)</Label>
                        <Input
                            id="usageLimit"
                            type="number"
                            {...register('usageLimit', {
                                min: {
                                    value: 0,
                                    message: 'Usage limit cannot be negative'
                                }
                            })}
                            placeholder="Enter maximum number of uses"
                            className={errors.usageLimit ? 'border-red-500' : ''}
                        />
                        {errors.usageLimit && (
                            <p className="text-red-500 text-sm">{errors.usageLimit.message}</p>
                        )}
                    </div>

                    {/* Minimum Purchase */}
                    <div className="space-y-2">
                        <Label htmlFor="minimumPurchase">Minimum Purchase (Optional)</Label>
                        <Input
                            id="minimumPurchase"
                            type="number"
                            {...register('minimumPurchase', {
                                min: {
                                    value: 0,
                                    message: 'Minimum purchase cannot be negative'
                                }
                            })}
                            placeholder="Enter minimum purchase amount"
                            className={errors.minimumPurchase ? 'border-red-500' : ''}
                        />
                        {errors.minimumPurchase && (
                            <p className="text-red-500 text-sm">{errors.minimumPurchase.message}</p>
                        )}
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isActive"
                            defaultChecked
                            {...register('isActive')}
                        />
                        <Label htmlFor="isActive">Active Promotion</Label>
                    </div>
                </div>

                {/* Footer */}
                <div className="w-full flex justify-end bg-gray-50 gap-3 p-6 border-t border-gray-100">
                    <Button
                        type="button"
                        onClick={onClose}
                        variant="outline"
                        className="h-10 px-6 rounded-md border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="h-10 px-6 rounded-md bg-primary hover:bg-primary/90 text-white"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <FaSpinner className="animate-spin h-4 w-4" />
                                Saving...
                            </div>
                        ) : (
                            'Save Promotion'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default PromotionForm;