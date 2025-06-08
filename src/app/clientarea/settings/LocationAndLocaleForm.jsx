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
import OrgDetailsForm from "./OrgDetailsForm";
import BillingAndPaymentForm from "./BillingAndPaymentForm";

const LocationAndLocaleForm = () => {

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
        <div>
            <div className="space-y-6 dark:bg-gray-800 dark:border-none">
                <div className="flex space-x-4 bg-gray-100 dark:bg-gray-700 p-5 border-b dark:border-gray-500 rounded-t-2xl">
                    <MapPin className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold">Location & Locale</h2>
                </div>
                <div className="grid px-6 grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="country">Country *</Label>
                        <Input
                            id="country"
                            className='py-6 rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none'
                            placeholder="Country"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="state">State/Province *</Label>
                        <Input
                            id="state"
                            className='py-6 rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none'
                            placeholder="California"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                            id="city"
                            className='py-6 rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none'
                            placeholder="San Francisco"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Input
                            id="timezone"
                            className='py-6 rounded-sm dark:text-white bg-white dark:bg-gray-900 dark:border-none'
                            placeholder="PST (UTC-8)"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="currency">Currency *</Label>
                        <Select
                        >
                            <SelectTrigger className='py-6 rounded-sm dark:border-none dark:bg-gray-900 bg-white'>
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent className='dark:bg-gray-900 dark:border-none'>
                                {currencies.map(currency => (
                                    <SelectItem key={currency} value={currency} className='cursor-pointer hover:bg-blue-500'>{currency}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="language">Language *</Label>
                        <Select
                        >
                            <SelectTrigger className='py-6 rounded-sm dark:bg-gray-900 bg-white dark:border-none'>
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                {languages.map(language => (
                                    <SelectItem key={language} value={language} className='cursor-pointer hover:bg-blue-500'>{language}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex justify-start items-center">
                    <Button
                        className="bg-indigo-600 m-4 text-white hover:bg-indigo-700"
                        type='submit'
                    >
                        Submit Details
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default LocationAndLocaleForm;
