'use client';

import { IoMdAdd, IoMdClose } from "react-icons/io";
import { MdHome } from "react-icons/md";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

// UI Components
import { Checkbox } from "@/components/ui/checkbox"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import Badge from '@mui/material/Badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Pagination from '@/components/ui/CustomPagination';
import Loader from "@/components/Loader/Loader";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Icons
import {
    FaExclamationTriangle,
    FaPlayCircle,
    FaSpinner,
} from 'react-icons/fa';
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdError, MdClose, MdDone } from "react-icons/md";
import { QrCode, RefreshCw, Search, User, Calendar, Timer, Info, AlertCircle, CheckCircle, ChevronRight, Plus, Trash2, Save, X, ArrowUpDown } from 'lucide-react';


const PromotionsAndOfferManagement = () => {

    const [openNewForm, setOpenNewForm] = useState(false);

    // React hook form
    const {
        register,
        formState: { isSubmitting, errors
        },
        reset
    } = useForm();

    return (
        <div className='w-full bg-slate-50 min-h-screen'>

            {/* Breadcrumb and Header */}
            <div className='w-full p-6  border-b border-gray-200 bg-gray-50 shadow-sm'>
                <Breadcrumb className="mb-4">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <MdHome className='w-4 h-4' /><BreadcrumbLink href="/" className="text-slate-600 hover:text-slate-800">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink className="text-slate-600 hover:text-slate-800">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium text-slate-900">Promotion And Offer</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl md:text-lg font-bold text-slate-900">Promotion And Offer</h1>
                    <Button
                        variant="outline"
                        className='flex items-center rounded-sm bg-slate-800 hover:bg-slate-700 border text-gray-100 hover:text-gray-200'
                        onClick={() => setOpenNewForm(true)}
                    >
                        <IoMdAdd className="h-4 w-4" />
                        Create Offers
                    </Button>
                </div>
            </div>

            {openNewForm && (
                <div className="w-full flex justify-center items-center bg-black bg-opacity-70 backdrop-blur-sm fixed inset-0 z-50">
                    <form
                        className="bg-white w-11/12 md:w-9/12 max-w-6xl h-[95vh] rounded-md shadow-xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b">
                            <h1 className='text-lg font-medium'>Create New Promotions & Offers</h1>
                            <button
                                type="button"
                                onClick={() => setOpenNewForm(false)}
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
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm">{errors.description.message}</p>
                                )}
                            </div>

                            {/* Offer Type */}
                            <div className="space-y-2">
                                <Label htmlFor="offerType">Offer Type*</Label>
                                <Select
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select offer type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem>
                                            Label
                                        </SelectItem>
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
                                    />
                                    {errors.discountValue && (
                                        <p className="text-red-500 text-sm">{errors.discountValue.message}</p>
                                    )}
                                </div>
                                <div className="flex items-end space-x-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="isPercentage"
                                        />
                                        <Label htmlFor="isPercentage">Is Percentage</Label>
                                    </div>
                                    <input
                                        type="hidden"
                                    />
                                </div>
                            </div>

                            {/* Date Range */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Start Date*</Label>
                                    <Input
                                        id="startDate"
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

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                        />
                                        <Label>Label</Label>
                                    </div>
                                </div>
                                <input
                                    type="hidden"
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
                                onClick={() => setOpenNewForm(false)}
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
            )}

            <Tabs defaultValue="account" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account</CardTitle>
                            <CardDescription>
                                Make changes to your account here. Click save when you're done.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" defaultValue="Pedro Duarte" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" defaultValue="@peduarte" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Save changes</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="password">
                    <Card>
                        <CardHeader>
                            <CardTitle>Password</CardTitle>
                            <CardDescription>
                                Change your password here. After saving, you'll be logged out.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="current">Current password</Label>
                                <Input id="current" type="password" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="new">New password</Label>
                                <Input id="new" type="password" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Save password</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default PromotionsAndOfferManagement;
