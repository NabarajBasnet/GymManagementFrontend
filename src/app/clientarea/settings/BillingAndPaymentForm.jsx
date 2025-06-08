"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast as hotToast } from "react-hot-toast";
import { toast as sonnerToast } from "sonner";
import { MdSettings } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import { PiCardsThreeFill } from "react-icons/pi";
import { FaBuilding } from "react-icons/fa6";
import { RiUserSettingsFill } from "react-icons/ri";
import {
    MapPin,
    CreditCard,
    Building2,
    Globe,
    FileText,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card"
import { FaLock } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { useEffect, useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTenant } from "@/components/Providers/LoggedInTenantProvider";

const BillingAndPaymentForm = () => {

    const tenant = useTenant();
    const loggedInTenant = tenant?.tenant?.tenant;

    // console.log("Tenant: ", loggedInTenant);
    // tenant onboarding steps

    const onboardAt = loggedInTenant?.onboardingStep

    // Notification setting states
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotification: loggedInTenant?.emailNotification || false,
        smsNotification: loggedInTenant?.smsNotification || false,
        appNotification: loggedInTenant?.appNotification || false
    });

    // React hook form
    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
        reset,
        watch,
        setValue,
        control
    } = useForm()

    // Toggle notifications
    const toggleNotification = (type) => {
        setNotificationSettings(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    // State for dialogs
    const [showDeleteRequestDialog, setShowDeleteRequestDialog] = useState(false);
    const [showCancelMembershipDialog, setShowCancelMembershipDialog] = useState(false);
    const [submitting, setIsSubmitting] = useState(false);

    // Populate Data
    useEffect(() => {
        reset({
            fullName: loggedInTenant?.fullName,
            address: loggedInTenant?.address,
            email: loggedInTenant?.email,
            phone: loggedInTenant?.phone,
        })
    }, [loggedInTenant, reset]);

    // Populate notification states
    useEffect(() => {
        setNotificationSettings({
            emailNotification: loggedInTenant?.emailNotification || false,
            smsNotification: loggedInTenant?.smsNotification || false,
            appNotification: loggedInTenant?.appNotification || false
        });
    }, [loggedInTenant]);

    // Password toggle
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // constants
    const businessTypes = ["Gym", "CrossFit", "Yoga", "Fitness", "Martial Arts", "Other"]
    const countries = ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France"]
    const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "NPR", "INR", "YAN"]
    const languages = ["English", "Spanish", "French", "German", "Chinese"]
    const paymentProviders = ["Stripe", "PayPal", "Square", "Authorize.net"]

    // Change basic details
    const changePersonalDetails = async (data) => {
        try {
            const response = await fetch(`http://localhost:3000/api/tenant/change-personal-details`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const responseBody = await response.json();
            if (response.ok) {
                sonnerToast.success(responseBody.message)
                hotToast.success(responseBody.message)
            } else {
                sonnerToast.error(responseBody.message)
                hotToast.error(responseBody.message)
            }
        } catch (error) {
            console.log("Error: ", error);
            sonnerToast.error(error.message)
            hotToast.error(error.message)
        };
    };

    // Change basic details
    const changePassword = async (data) => {
        try {
            const response = await fetch(`http://localhost:3000/api/tenant/change-password`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const responseBody = await response.json();
            console.log("Response body: ", responseBody);
            if (response.ok) {
                sonnerToast.success(responseBody.message)
                hotToast.success(responseBody.message)
            } else {
                sonnerToast.error(responseBody.message)
                hotToast.error(responseBody.message)
            }
        } catch (error) {
            console.log("Error: ", error);
            sonnerToast.error(error.message)
            hotToast.error(error.message)
        };
    };

    // Handle nofitication submit
    const handleNotificationsSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/tenant/save-notification-settings', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(notificationSettings),
            });

            const responseData = await response.json();

            if (response.ok) {
                sonnerToast.success(responseData.message);
                hotToast.success(responseData.message);
            } else {
                sonnerToast.error(responseData.message);
                hotToast.error(responseData.message);
            }
        } catch (error) {
            console.error("Error:", error);
            sonnerToast.error("Failed to save notification settings");
            hotToast.error("Failed to save notification settings");
        }
    };

    // Handle delete account request
    const requestAccountDeletion = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/account/request-deletion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            if (response.ok) {
                sonnerToast.success("Deletion request submitted. Our team will contact you shortly.");
            } else {
                throw new Error("Failed to submit deletion request");
            }
        } catch (error) {
            sonnerToast.error(error.message);
        } finally {
            setIsSubmitting(false);
            setShowDeleteRequestDialog(false);
        }
    };

    // Handle membership cancellation
    const cancelMembership = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/membership/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            if (response.ok) {
                sonnerToast.success("Membership cancelled successfully");
            } else {
                throw new Error("Failed to cancel membership");
            }
        } catch (error) {
            sonnerToast.error(error.message);
        } finally {
            setIsSubmitting(false);
            setShowCancelMembershipDialog(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Billing & Payments</h2>
            </div>

            <Card className="p-6 space-y-6 dark:bg-gray-800 dark:border-none">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <h3 className="font-medium">Billing Address</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="addressLine1">Address Line 1 *</Label>
                            <Input
                                id="addressLine1"
                                className='py-6 rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none'
                                placeholder="123 Main St"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="addressLine2">Address Line 2</Label>
                            <Input
                                id="addressLine2"
                                className='py-6 rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none'
                                placeholder="Apt 4B"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="billingCity">City *</Label>
                            <Input
                                id="billingCity"
                                className='py-6 rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none'
                                placeholder="San Francisco"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="billingState">State *</Label>
                            <Input
                                id="billingState"
                                className='py-6 rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none'
                                placeholder="CA"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                            <Input
                                id="zipCode"
                                className='py-6 rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none'
                                placeholder="94105"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="billingCountry">Country *</Label>
                            <Select
                            >
                                <SelectTrigger className='py-6 dark:border-none dark:bg-gray-900'>
                                    <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                                <SelectContent>
                                    {countries.map(country => (
                                        <SelectItem key={country} value={country} className='hover:bg-blue-500 cursor-pointer'>{country}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="taxId">Tax ID</Label>
                        <Input
                            id="taxId"
                            className='py-6 rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none'
                            placeholder="123-45-6789"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="invoiceEmail">Invoice Email *</Label>
                        <Input
                            id="invoiceEmail"
                            type="email"
                            className='py-6 rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none'
                            placeholder="billing@acme.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="paymentProvider">Payment Provider *</Label>
                        <Select
                        >
                            <SelectTrigger className='py-6 dark:border-none dark:bg-gray-900'>
                                <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                                {paymentProviders.map(provider => (
                                    <SelectItem className='hover:bg-blue-500 cursor-pointer' key={provider} value={provider}>{provider}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="paymentAccountId">Payment Account ID *</Label>
                        <Input
                            id="paymentAccountId"
                            className='py-6 rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none'
                            placeholder="acct_123456789"
                        />
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default BillingAndPaymentForm;
