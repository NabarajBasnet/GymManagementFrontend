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
import { MapPin, CreditCard, Building2, Globe, FileText } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
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
  ChevronRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTenant } from "@/components/Providers/LoggedInTenantProvider";
import OrgDetailsForm from "./OrgDetailsForm";
import LocationAndLocaleForm from "./LocationAndLocaleForm";
import TenantDetailsCard from "./DetailsCard";
import PasswordComponent from "./PasswordComponent";

const TenantSetting = () => {
  const tenant = useTenant();
  const loggedInTenant = tenant?.tenant?.tenant;

  // Notification setting states
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotification: loggedInTenant?.emailNotification || false,
    smsNotification: loggedInTenant?.smsNotification || false,
    appNotification: loggedInTenant?.appNotification || false,
  });

  // React hook form
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    watch,
    setValue,
    control,
  } = useForm();

  // Toggle notifications
  const toggleNotification = (type) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  // State for dialogs
  const [showDeleteRequestDialog, setShowDeleteRequestDialog] = useState(false);
  const [showCancelMembershipDialog, setShowCancelMembershipDialog] =
    useState(false);
  const [submitting, setIsSubmitting] = useState(false);

  // Populate Data
  useEffect(() => {
    reset({
      fullName: loggedInTenant?.fullName,
      address: loggedInTenant?.address,
      email: loggedInTenant?.email,
      phone: loggedInTenant?.phone,
    });
  }, [loggedInTenant, reset]);

  // Populate notification states
  useEffect(() => {
    setNotificationSettings({
      emailNotification: loggedInTenant?.emailNotification || false,
      smsNotification: loggedInTenant?.smsNotification || false,
      appNotification: loggedInTenant?.appNotification || false,
    });
  }, [loggedInTenant]);

  // Password toggle
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // constants
  const businessTypes = [
    "Gym",
    "CrossFit",
    "Yoga",
    "Fitness",
    "Martial Arts",
    "Other",
  ];
  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "Germany",
    "France",
  ];
  const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "NPR", "INR", "YAN"];
  const languages = ["English", "Spanish", "French", "German", "Chinese"];
  const paymentProviders = ["Stripe", "PayPal", "Square", "Authorize.net"];

  // Change basic details
  const changePersonalDetails = async (data) => {
    try {
      const response = await fetch(
        `http://88.198.112.156:3100/api/tenant/change-personal-details`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const responseBody = await response.json();
      if (response.ok) {
        sonnerToast.success(responseBody.message);
        hotToast.success(responseBody.message);
      } else {
        sonnerToast.error(responseBody.message);
        hotToast.error(responseBody.message);
      }
    } catch (error) {
      console.log("Error: ", error);
      sonnerToast.error(error.message);
      hotToast.error(error.message);
    }
  };

  // Change basic details
  const changePassword = async (data) => {
    try {
      const response = await fetch(
        `http://88.198.112.156:3100/api/tenant/change-password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const responseBody = await response.json();
      console.log("Response body: ", responseBody);
      if (response.ok) {
        sonnerToast.success(responseBody.message);
        hotToast.success(responseBody.message);
      } else {
        sonnerToast.error(responseBody.message);
        hotToast.error(responseBody.message);
      }
    } catch (error) {
      console.log("Error: ", error);
      sonnerToast.error(error.message);
      hotToast.error(error.message);
    }
  };

  // Handle nofitication submit
  const handleNotificationsSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://88.198.112.156:3100/api/tenant/save-notification-settings",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(notificationSettings),
        }
      );

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
      const response = await fetch("/api/account/request-deletion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        sonnerToast.success(
          "Deletion request submitted. Our team will contact you shortly."
        );
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
      const response = await fetch("/api/membership/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="w-full mx-auto p-4">
        {/* Header Section */}
        <div className="flex flex-col space-y-3 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
              <MdSettings className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Account Settings
              </h1>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Portal
                </span>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Client Area
                </span>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  Settings
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="accountdetails" className="w-full mt-6">
          <TabsList className="w-full flex justify-center gap-1 p-1 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <TabsTrigger
              value="accountdetails"
              className="px-4 py-2 text-sm font-medium rounded-md transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400"
            >
              <RiUserSettingsFill className="w-5 h-5 mr-2" />
              <span>Personal Details</span>
            </TabsTrigger>
            <TabsTrigger
              value="orgsetup"
              className="px-4 py-2 text-sm font-medium rounded-md transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400"
            >
              <FaBuilding className="w-5 h-5 mr-2" />
              <span>Organization</span>
            </TabsTrigger>
            <TabsTrigger
              value="cards"
              className="px-4 py-2 text-sm font-medium rounded-md transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400"
            >
              <PiCardsThreeFill className="w-5 h-5 mr-2" />
              <span>Cards</span>
            </TabsTrigger>
          </TabsList>

          <Card className="w-full p-3 md:p-6 dark:bg-gray-800 dark:border-none">
            <TabsContent value="accountdetails">
              <div className="w-11/12 lg:w-10/12 mx-auto px-4 sm:px-0 lg:px-8 py-8">
                {/* Personal Information */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-500 dark:bg-gray-800 bg-gray-50">
                    <h3 className="font-medium dark:text-gray-200 text-gray-900 flex items-center">
                      <FaUser className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-200" />
                      Personal Information
                    </h3>
                  </div>
                  <div className="p-6">
                    <form onSubmit={handleSubmit(changePersonalDetails)}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="fullName"
                            className="block text-sm dark:text-gray-200 font-medium text-gray-700 mb-1"
                          >
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            {...register("fullName")}
                            className={`block w-full p-2 py-3 border dark:border-none ${
                              errors.fullName
                                ? "border-red-300"
                                : "border-gray-300"
                            } rounded-sm shadow-sm dark:border-gray-500 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                          />
                          {errors.fullName && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertTriangle className="mr-1 h-4 w-4" />
                              {errors.fullName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="address"
                            className="block text-sm dark:text-gray-200 font-medium text-gray-700 mb-1"
                          >
                            Address
                          </label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            {...register("address")}
                            className={`block w-full p-2 py-3 border dark:border-none ${
                              errors.address
                                ? "border-red-300"
                                : "border-gray-300"
                            } rounded-sm shadow-sm dark:border-gray-500 bg-gray-50 dark:text-gray-200 dark:bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                          />
                          {errors.lastName && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertTriangle className="mr-1 h-4 w-4" />
                              {errors.lastName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm dark:text-gray-200 font-medium text-gray-700 mb-1"
                          >
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            {...register("email")}
                            className={`block w-full p-2 py-3 border dark:border-none ${
                              errors.email
                                ? "border-red-300"
                                : "border-gray-300"
                            } rounded-sm shadow-sm dark:border-gray-500 bg-gray-50 dark:text-gray-200 dark:bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                          />
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertTriangle className="mr-1 h-4 w-4" />
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm dark:text-gray-200 font-medium text-gray-700 mb-1"
                          >
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            {...register("phone")}
                            className={`block w-full p-2 py-3 border dark:border-none ${
                              errors.phone
                                ? "border-red-300"
                                : "border-gray-300"
                            } rounded-sm shadow-sm dark:border-gray-500 bg-gray-50 dark:text-gray-200 dark:bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                          />
                          {errors.phone && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertTriangle className="mr-1 h-4 w-4" />
                              {errors.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-6">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`px-4 py-2 rounded-md text-white ${
                            isSubmitting
                              ? "bg-indigo-400"
                              : "bg-indigo-600 hover:bg-indigo-700"
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        >
                          {isSubmitting ? "Saving..." : "Update Information"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Change Password */}
                <PasswordComponent />

                {/* Notification Settings */}
                <div className="bg-gray-100 dark:bg-gray-900 rounded-xl shadow-md overflow-hidden mb-8">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-500 bg-gray-50 dark:bg-gray-800">
                    <h3 className="font-medium dark:text-gray-200 text-gray-900 flex items-center">
                      <Bell className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-200" />
                      Notification Settings
                    </h3>
                  </div>
                  <div className="p-6 bg-white dark:bg-gray-800">
                    <form onSubmit={handleNotificationsSubmit}>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center">
                            <Mail className="h-5 w-5 text-gray-500 dark:text-gray-300 mr-3" />
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-gray-200">
                                Email Notifications
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Receive updates via email
                              </p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={notificationSettings.emailNotification}
                              onChange={() =>
                                toggleNotification("emailNotification")
                              }
                            />
                            <div
                              className={`w-11 h-6 rounded-full peer ${
                                notificationSettings.emailNotification
                                  ? "bg-indigo-600"
                                  : "bg-gray-200"
                              } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                            ></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center">
                            <Phone className="h-5 w-5 text-gray-500 dark:text-gray-300 mr-3" />
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-gray-200">
                                SMS Notifications
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Receive updates via text message
                              </p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={notificationSettings.smsNotification}
                              onChange={() =>
                                toggleNotification("smsNotification")
                              }
                            />
                            <div
                              className={`w-11 h-6 rounded-full peer ${
                                notificationSettings.smsNotification
                                  ? "bg-indigo-600"
                                  : "bg-gray-200"
                              } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                            ></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center">
                            <Bell className="h-5 w-5 text-gray-500 dark:text-gray-300 mr-3" />
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-gray-200">
                                App Notifications
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Receive in-app notifications
                              </p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={notificationSettings.appNotification}
                              onChange={() =>
                                toggleNotification("appNotification")
                              }
                            />
                            <div
                              className={`w-11 h-6 rounded-full peer ${
                                notificationSettings.appNotification
                                  ? "bg-indigo-600"
                                  : "bg-gray-200"
                              } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                            ></div>
                          </label>
                        </div>
                      </div>

                      <div className="mt-6">
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Save Notification Settings
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-gray-100 dark:bg-gray-900 rounded-xl shadow-md overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-500 bg-red-50 dark:bg-red-900">
                    <h3 className="font-medium text-red-800 dark:text-red-200 flex items-center">
                      <AlertTriangle className="mr-2 h-5 w-5 text-red-600 dark:text-red-400" />
                      Danger Zone
                    </h3>
                  </div>
                  <div className="p-6 bg-white dark:bg-gray-800">
                    <div className="space-y-4">
                      {/* Delete Account Request */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-3 bg-red-50 dark:bg-red-900/50 rounded-lg">
                        <div className="mb-3 md:mb-0">
                          <h4 className="font-medium text-red-800 dark:text-red-200">
                            Request Account Deletion
                          </h4>
                          <p className="text-sm text-red-600 dark:text-red-300">
                            Submit a request to permanently delete your account
                            and all associated data.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowDeleteRequestDialog(true)}
                          className="px-4 py-2 border border-red-600 text-red-600 dark:border-red-500 dark:text-red-500 rounded-md hover:bg-white dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                        >
                          <Trash2 className="inline mr-2 h-4 w-4" />
                          Request Deletion
                        </button>
                      </div>

                      {/* Cancel Membership */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-3 bg-red-50 dark:bg-red-900/50 rounded-lg">
                        <div className="mb-3 md:mb-0">
                          <h4 className="font-medium text-red-800 dark:text-red-200">
                            Cancel Membership
                          </h4>
                          <p className="text-sm text-red-600 dark:text-red-300">
                            Immediately cancel your premium membership and lose
                            access to all premium features.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowCancelMembershipDialog(true)}
                          className="px-4 py-2 border border-red-600 text-red-600 dark:border-red-500 dark:text-red-500 rounded-md hover:bg-white dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                        >
                          Cancel Membership
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delete Account Request Dialog */}
                <AlertDialog
                  open={showDeleteRequestDialog}
                  onOpenChange={setShowDeleteRequestDialog}
                >
                  <AlertDialogContent className="max-w-md rounded-xl border-0 bg-gradient-to-br from-white to-gray-50 shadow-xl dark:from-gray-900 dark:to-gray-800 dark:border dark:border-gray-700">
                    <AlertDialogHeader className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/30">
                          <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <AlertDialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                          Request Account Deletion
                        </AlertDialogTitle>
                      </div>

                      <AlertDialogDescription className="space-y-4 text-gray-600 dark:text-gray-300">
                        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                          <p className="font-medium text-red-600 dark:text-red-400">
                            ⚠️ This action cannot be undone
                          </p>
                        </div>

                        <ul className="space-y-3">
                          <li className="flex items-start gap-2">
                            <span className="mt-0.5 flex-shrink-0 text-red-500 dark:text-red-400">
                              •
                            </span>
                            <span>
                              All data including member records, payments, and
                              settings will be{" "}
                              <span className="font-semibold text-red-600 dark:text-red-400">
                                permanently deleted
                              </span>
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-0.5 flex-shrink-0 text-red-500 dark:text-red-400">
                              •
                            </span>
                            <span>
                              Your gym locations and staff accounts will be{" "}
                              <span className="font-semibold">affected</span>
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-0.5 flex-shrink-0 text-red-500 dark:text-red-400">
                              •
                            </span>
                            <span>
                              Process may take{" "}
                              <span className="font-semibold">
                                up to 7 business days
                              </span>
                            </span>
                          </li>
                        </ul>

                        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                          <p className="flex items-start gap-2 text-blue-600 dark:text-blue-300">
                            <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <span>
                              Our support team will contact you to confirm this
                              request
                            </span>
                          </p>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                      <AlertDialogCancel className="mt-0 rounded-lg border-gray-300 bg-transparent px-4 py-2 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={requestAccountDeletion}
                        className="rounded-lg bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-white shadow-md hover:from-red-700 hover:to-red-600 focus-visible:ring-red-500 dark:from-red-700 dark:to-red-600 dark:hover:from-red-800 dark:hover:to-red-700"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <span className="flex items-center gap-2">
                            <svg
                              className="h-4 w-4 animate-spin"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Submitting...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Trash2 className="h-4 w-4" />
                            Request Deletion
                          </span>
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Cancel Membership Dialog */}
                <AlertDialog
                  open={showCancelMembershipDialog}
                  onOpenChange={setShowCancelMembershipDialog}
                >
                  <AlertDialogContent className="max-w-md rounded-xl border-0 bg-gradient-to-br from-white to-gray-50 shadow-xl dark:from-gray-900 dark:to-gray-800 dark:border dark:border-gray-700">
                    <AlertDialogHeader className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/30">
                          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <AlertDialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                          Cancel Membership
                        </AlertDialogTitle>
                      </div>

                      <AlertDialogDescription className="space-y-4 text-gray-600 dark:text-gray-300">
                        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                          <p className="font-medium text-red-600 dark:text-red-400">
                            ⚠️ WARNING: This action has immediate effect!
                          </p>
                        </div>

                        <ul className="space-y-3">
                          <li className="flex items-start gap-2">
                            <span className="mt-0.5 flex-shrink-0 text-red-500 dark:text-red-400">
                              •
                            </span>
                            <span>
                              All premium features will be{" "}
                              <span className="font-semibold text-red-600 dark:text-red-400">
                                disabled immediately
                              </span>
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-0.5 flex-shrink-0 text-red-500 dark:text-red-400">
                              •
                            </span>
                            <span>
                              Your billing cycle will{" "}
                              <span className="font-semibold">end today</span>
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-0.5 flex-shrink-0 text-red-500 dark:text-red-400">
                              •
                            </span>
                            <span>No refunds for current billing period</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-0.5 flex-shrink-0 text-red-500 dark:text-red-400">
                              •
                            </span>
                            <span>
                              Member access to premium features revoked
                            </span>
                          </li>
                        </ul>

                        <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
                          <p className="flex items-start gap-2 text-amber-600 dark:text-amber-300">
                            <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <span>
                              Consider downgrading instead to retain basic
                              functionality
                            </span>
                          </p>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                      <AlertDialogCancel className="mt-0 rounded-lg border-gray-300 bg-transparent px-4 py-2 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                        Go Back
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={cancelMembership}
                        className="rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 px-4 py-2 text-white shadow-md hover:from-amber-700 hover:to-amber-600 focus-visible:ring-amber-500 dark:from-amber-700 dark:to-amber-600 dark:hover:from-amber-800 dark:hover:to-amber-700"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <span className="flex items-center gap-2">
                            <svg
                              className="h-4 w-4 animate-spin"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Cancel Membership
                          </span>
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TabsContent>

            <TabsContent
              value="orgsetup"
              className="w-full flex flex-col items-center space-y-6"
            >
              <Card className="w-full md:w-10/12 lg:w-9/12 dark:border-none dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
                <OrgDetailsForm />
              </Card>

              <Card className="w-full md:w-10/12 lg:w-9/12 dark:border-none dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
                <LocationAndLocaleForm />
              </Card>
            </TabsContent>

            <TabsContent value="cards">
              <TenantDetailsCard tenantData={loggedInTenant} />
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
};

export default TenantSetting;
