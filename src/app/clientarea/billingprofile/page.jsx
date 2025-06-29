'use client';

import { AlertCircleIcon, CheckCircle2Icon, InfoIcon, MailIcon } from "lucide-react";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import { FaMoneyBill, FaRegIdCard, FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlineMail, HiOutlineDocumentText } from "react-icons/hi";
import { RiVipCrownLine, RiMoneyDollarCircleLine } from "react-icons/ri";
import { BsBuilding, BsSticky } from "react-icons/bs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ChevronRight, Save } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import Loader from "@/components/Loader/Loader";
import { useTenant } from "@/components/Providers/LoggedInTenantProvider";
import { Separator } from "@/components/ui/separator";

export default function GymBillingProfileForm() {
    const tenant = useTenant();
    const loggedInTenant = tenant?.tenant?.tenant;
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [vatRegistered, setVatRegistered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async () => {
        try {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setShowSuccessAlert(true);
            setTimeout(() => setShowSuccessAlert(false), 5000);
            toast.success("Billing profile updated successfully");
        } catch (error) {
            toast.error("Failed to update billing profile");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full bg-gray-50 dark:bg-gray-900 mx-auto py-6 px-4 w-full">
            {/* Header Section */}
            <div className="flex flex-col space-y-3 pb-6 border-b border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                        <FaMoneyBill className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Billing Profile
                        </h1>
                        <Breadcrumb className="mt-2">
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                                        Portal
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator>
                                    <ChevronRight className="w-4 h-4" />
                                </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                                        Client Area
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator>
                                    <ChevronRight className="w-4 h-4" />
                                </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-blue-600 dark:text-blue-400 font-medium">
                                        Billing Profile
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
            </div>

            {/* Success Alert */}
            {showSuccessAlert && (
                <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-500">
                    <CheckCircle2Icon className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <AlertTitle className="text-green-800 dark:text-green-200">Success!</AlertTitle>
                    <AlertDescription className="text-green-700 dark:text-green-300">
                        Your billing profile has been updated successfully. These details will appear on all customer invoices.
                    </AlertDescription>
                </Alert>
            )}

            {/* Information Alert */}
            <Alert className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-500">
                <InfoIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-3" />
                <AlertTitle className="text-blue-800 dark:text-blue-200 mt-1">Important Information</AlertTitle>
                <AlertDescription className="text-blue-700 mt-1 dark:text-blue-300">
                    The details you provide here will be displayed on all customer invoices and receipts.
                    Please ensure all tax information is accurate to avoid issues with billing.
                </AlertDescription>
            </Alert>

            {/* Main Form Card */}
            <Card className="shadow-sm dark:bg-gray-800 dark:border-none">
                <CardHeader>
                    <CardTitle className="text-xl mt-1">Billing Information</CardTitle>
                    <CardDescription className='mt-1'>
                        Update your organization's billing details for invoicing and tax purposes
                    </CardDescription>
                </CardHeader>

                <Separator className="mb-4 dark:bg-gray-600" />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="panNo">PAN Number</Label>
                                    <div className="relative">
                                        <FaRegIdCard className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="panNo"
                                            className="pl-10 rounded-sm py-6 bg-white dark:bg-gray-900 dark:border-none dark:text-gray-200"
                                            placeholder="Enter PAN number"
                                            {...register("panNo", { required: true })}
                                        />
                                    </div>
                                    {errors.panNo && (
                                        <Alert variant="destructive" className="mt-2">
                                            <AlertCircleIcon className="h-4 w-4 mt-1 dark:text-red-600" />
                                            <AlertDescription className='mt-1'>
                                                PAN number is required for tax documentation
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                <div className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700">
                                    <div>
                                        <Label htmlFor="vatRegistered">VAT Registered</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Enable if your organization is VAT registered
                                        </p>
                                    </div>
                                    <Switch
                                        id="vatRegistered"
                                        checked={vatRegistered}
                                        onCheckedChange={setVatRegistered}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="vatNo">VAT Number</Label>
                                    <div className="relative">
                                        <RiVipCrownLine className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="vatNo"
                                            className="pl-10 rounded-sm py-6 bg-white dark:bg-gray-900 dark:border-none dark:text-gray-200"
                                            placeholder="Enter VAT number"
                                            disabled={!vatRegistered}
                                            {...register("vatNo")}
                                        />
                                    </div>
                                    {vatRegistered && (
                                        <Alert className="mt-2 bg-amber-50 dark:bg-amber-900/20 border-amber-500">
                                            <InfoIcon className="h-4 w-4 mt-1 text-amber-600 dark:text-amber-400" />
                                            <AlertDescription className="text-amber-700 mt-1 dark:text-amber-300">
                                                VAT number will be shown on customer invoices
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="invoiceEmail">Invoice Email</Label>
                                    <div className="relative">
                                        <HiOutlineMail className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="invoiceEmail"
                                            className="pl-10 rounded-sm py-6 bg-white dark:bg-gray-900 dark:border-none dark:text-gray-200"
                                            type="email"
                                            placeholder="billing@yourgym.com"
                                            {...register("invoiceEmail", {
                                                required: "Invoice email is required",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Invalid email address"
                                                }
                                            })}
                                        />
                                    </div>
                                    {errors.invoiceEmail && (
                                        <Alert variant="destructive" className="mt-2">
                                            <AlertCircleIcon className="h-4 w-4 mt-1 dark:text-red-600" />
                                            <AlertDescription className='mt-1'>
                                                {errors.invoiceEmail.message}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                    <Alert className="mt-2 bg-blue-50 dark:bg-blue-900/20 border-blue-500">
                                        <MailIcon className="h-4 w-4 mt-1 text-blue-600 dark:text-blue-400" />
                                        <AlertDescription className="text-blue-700 mt-1 dark:text-blue-300">
                                            This email will receive all billing notifications and receipts
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="taxId">Tax ID</Label>
                                    <div className="relative">
                                        <RiMoneyDollarCircleLine className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="taxId"
                                            className="pl-10 rounded-sm py-6 bg-white dark:bg-gray-900 dark:border-none dark:text-gray-200"
                                            placeholder="Enter tax identification number"
                                            {...register("taxId")}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="businessRegNumber">Business Registration Number</Label>
                                    <div className="relative">
                                        <BsBuilding className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="businessRegNumber"
                                            className="pl-10 rounded-sm py-6 bg-white dark:bg-gray-900 dark:border-none dark:text-gray-200"
                                            placeholder="Enter registration number"
                                            {...register("businessRegNumber")}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="businessRegDate">Business Registration Date</Label>
                                    <div className="relative">
                                        <FaRegCalendarAlt className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="businessRegDate"
                                            className="pl-10 rounded-sm py-6 bg-white dark:bg-gray-900 dark:border-none dark:text-gray-200"
                                            type="date"
                                            {...register("businessRegDate")}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="billingNotes">Billing Notes</Label>
                                    <div className="relative">
                                        <BsSticky className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                        <Input
                                            id="billingNotes"
                                            className="pl-10 rounded-sm py-6 bg-white dark:bg-gray-900 dark:border-none dark:text-gray-200"
                                            placeholder="Any additional billing instructions"
                                            {...register("billingNotes")}
                                        />
                                    </div>
                                    <Alert className="mt-2 bg-blue-50 dark:bg-blue-900/20 border-blue-500">
                                        <InfoIcon className="h-4 w-4 mt-1" />
                                        <AlertDescription className='mt-1'>
                                            These notes will appear at the bottom of customer invoices
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    <Separator className="dark:bg-gray-600 mb-5" />

                    <CardFooter className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="rounded-sm py-6 px-8 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-gray-100"
                        >
                            {isLoading ? (
                                <>
                                    <Loader className="mr-2 h-4 w-4" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Details
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}