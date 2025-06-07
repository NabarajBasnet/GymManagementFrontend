"use client";

import { MdSettings } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import { PiCardsThreeFill } from "react-icons/pi";
import { FaBuilding } from "react-icons/fa6";
import { RiUserSettingsFill } from "react-icons/ri";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  MapPin,
  CreditCard,
  Palette,
  Building2,
  Globe,
  Clock,
  Calendar,
  Banknote,
  FileText,
  Brush
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card"
import { FaLock } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { useState } from "react";
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
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const TenantSetting = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const businessTypes = ["Gym", "CrossFit", "Yoga", "Fitness", "Martial Arts", "Other"]

  const countries = ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France"]
  const currencies = ["USD", "EUR", "GBP", "CAD", "AUD"]
  const languages = ["English", "Spanish", "French", "German", "Chinese"]
  const paymentProviders = ["Stripe", "PayPal", "Square", "Authorize.net"]

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm()


  const [formData, setFormData] = useState({
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@example.com",
    phone: "(555) 123-4567",
    notifications: {
      email: true,
      sms: false,
      app: true,
    },
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleNotification = (type) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };

  const validatePersonalInfo = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (
      !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
        formData.phone
      )
    ) {
      newErrors.phone = "Please enter a valid phone number";
    }

    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordChange = () => {
    const newErrors = {};
    if (!passwordData.currentPassword)
      newErrors.currentPassword = "Current password is required";
    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return Object.keys(newErrors).length === 0;
  };

  const handlePersonalInfoSubmit = (e) => {
    e.preventDefault();
    if (!validatePersonalInfo()) return;

    // Simulate API call
    setTimeout(() => {
      setSuccessMessage("Personal information updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!validatePasswordChange()) return;

    // Simulate API call
    setTimeout(() => {
      setSuccessMessage("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1000);
  };

  const handleNotificationsSubmit = (e) => {
    e.preventDefault();
    // Simulate API call

  };

  const confirmAccountDeletion = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      // Handle account deletion
      alert("Account deletion requested. This may take a few moments.");
    }
  };

  const confirmMembershipCancellation = () => {
    if (window.confirm("Are you sure you want to cancel your membership?")) {
      // Handle membership cancellation
      alert("Membership cancellation requested. We're sorry to see you go!");
    }
  };

  return (
    <div className="w-full flex justify-center dark:bg-gray-900 bg-gray-100 items-center">
      <div className="w-full mt-4 p-8">
        <div className="flex items-center space-x-4 mx-2">
          <MdSettings className="w-10 h-10 dark:text-white" />
          <h1 className="text-3xl font-bold dark:text-white">Settings</h1>
        </div>
        <div className="dark:text-white text-sm flex space-x-4 font-medium mt-4 mx-2">
          <span>
            Portal /
          </span>

          <span>
            Client Area /
          </span>
          <span className="text-blue-600">
            Settings
          </span>
        </div>

        <Tabs defaultValue='orgsetup' className="w-full items-start">
          <TabsList className="w-full px-0 bg-transparent items-start">
            <TabsTrigger value='accountdetails' className='py-4 data-[state=active]:shadow-none data-[state=active]:bg-transparent'><RiUserSettingsFill className='w-5 h-5 mr-2' />Personal Details</TabsTrigger>
            <TabsTrigger value='orgsetup' className='py-4 data-[state=active]:shadow-none data-[state=active]:bg-transparent'><FaBuilding className='w-5 h-5 mr-2' /> Organization Details</TabsTrigger>
            <TabsTrigger value='cards' className='py-4 data-[state=active]:shadow-none data-[state=active]:bg-transparent'><PiCardsThreeFill className='w-5 h-5 mr-2' />Cards</TabsTrigger>
            <TabsTrigger value='billing' className='py-4 data-[state=active]:shadow-none data-[state=active]:bg-transparent'><FaMoneyBillWave className='w-5 h-5 mr-2' />Billing & Payment</TabsTrigger>
          </TabsList>

          <Card className="w-full p-6 dark:bg-gray-800 dark:border-none">
            <TabsContent value='accountdetails'>
              <div className="w-11/12 lg:w-10/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        {successMessage}
                      </p>
                    </div>
                  </div>
                )}

                {/* Personal Information */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-500 dark:bg-gray-800 bg-gray-50">
                    <h3 className="font-medium dark:text-gray-200 text-gray-900 flex items-center">
                      <FaUser className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-200" />
                      Personal Information
                    </h3>
                  </div>
                  <div className="p-6">
                    <form onSubmit={handlePersonalInfoSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="firstName"
                            className="block text-sm dark:text-gray-200 font-medium text-gray-700 mb-1"
                          >
                            First Name
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={`block w-full p-2 py-3 border dark:border-none ${errors.firstName ? "border-red-300" : "border-gray-300"
                              } rounded-sm shadow-sm dark:border-gray-500 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                          />
                          {errors.firstName && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <AlertTriangle className="mr-1 h-4 w-4" />
                              {errors.firstName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="lastName"
                            className="block text-sm dark:text-gray-200 font-medium text-gray-700 mb-1"
                          >
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={`block w-full p-2 py-3 border dark:border-none ${errors.lastName ? "border-red-300" : "border-gray-300"
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
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`block w-full p-2 py-3 border dark:border-none ${errors.email ? "border-red-300" : "border-gray-300"
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
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`block w-full p-2 py-3 border dark:border-none ${errors.phone ? "border-red-300" : "border-gray-300"
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
                          className={`px-4 py-2 rounded-md text-white ${isSubmitting
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
                <div className="bg-gray-100 dark:bg-gray-900 rounded-xl shadow-md overflow-hidden mb-8">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-500 bg-gray-50 dark:bg-gray-800">
                    <h3 className="font-medium dark:text-gray-200 text-gray-900 flex items-center">
                      <FaLock className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-200" />
                      Change Password
                    </h3>
                  </div>
                  <div className="p-6 bg-white dark:bg-gray-800">
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div>
                        <label
                          htmlFor="currentPassword"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                        >
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            id="currentPassword"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className={`block w-full p-2 py-3 border dark:border-none ${errors.currentPassword
                              ? "border-red-300"
                              : "border-gray-300"
                              } rounded-sm shadow-sm dark:border-gray-500 bg-gray-50 dark:text-gray-200 dark:bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                        {errors.currentPassword && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertTriangle className="mr-1 h-4 w-4" />
                            {errors.currentPassword}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="newPassword"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                        >
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            id="newPassword"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className={`block w-full p-2 py-3 border dark:border-none ${errors.newPassword ? "border-red-300" : "border-gray-300"
                              } rounded-sm shadow-sm dark:border-gray-500 bg-gray-50 dark:text-gray-200 dark:bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                        {errors.newPassword && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertTriangle className="mr-1 h-4 w-4" />
                            {errors.newPassword}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                        >
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className={`block w-full p-2 py-3 border dark:border-none ${errors.confirmPassword
                              ? "border-red-300"
                              : "border-gray-300"
                              } rounded-sm shadow-sm dark:border-gray-500 bg-gray-50 dark:text-gray-200 dark:bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertTriangle className="mr-1 h-4 w-4" />
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>

                      <div className="mt-6">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`px-4 py-2 rounded-md text-white ${isSubmitting
                            ? "bg-indigo-400"
                            : "bg-indigo-600 hover:bg-indigo-700"
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        >
                          {isSubmitting ? "Updating..." : "Change Password"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

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
                              checked={formData.notifications.email}
                              onChange={() => toggleNotification("email")}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
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
                              checked={formData.notifications.sms}
                              onChange={() => toggleNotification("sms")}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
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
                              checked={formData.notifications.app}
                              onChange={() => toggleNotification("app")}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                      </div>

                      <div className="mt-6">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`px-4 py-2 rounded-md text-white ${isSubmitting
                            ? "bg-indigo-400"
                            : "bg-indigo-600 hover:bg-indigo-700"
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        >
                          {isSubmitting ? "Saving..." : "Save Notification Settings"}
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
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-3 bg-red-50 dark:bg-red-900/50 rounded-lg">
                        <div className="mb-3 md:mb-0">
                          <h4 className="font-medium text-red-800 dark:text-red-200">
                            Delete Account
                          </h4>
                          <p className="text-sm text-red-600 dark:text-red-300">
                            Permanently delete your account and all associated data.
                            This action cannot be undone.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={confirmAccountDeletion}
                          className="px-4 py-2 border border-red-600 text-red-600 dark:border-red-500 dark:text-red-500 rounded-md hover:bg-white dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                        >
                          <Trash2 className="inline mr-2 h-4 w-4" />
                          Delete Account
                        </button>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-3 bg-red-50 dark:bg-red-900/50 rounded-lg">
                        <div className="mb-3 md:mb-0">
                          <h4 className="font-medium text-red-800 dark:text-red-200">
                            Cancel Membership
                          </h4>
                          <p className="text-sm text-red-600 dark:text-red-300">
                            Cancel your premium membership. You'll lose access to
                            premium features immediately.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={confirmMembershipCancellation}
                          className="px-4 py-2 border border-red-600 text-red-600 dark:border-red-500 dark:text-red-500 rounded-md hover:bg-white dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                        >
                          Cancel Membership
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value='orgsetup' className='w-full flex flex-col items-center space-y-6'>
              <Card className='w-9/12 dark:border-none shadow-md rounded-2xl'>
                <div className="dark:bg-gray-800 dark:border-none">
                  <div className="flex space-x-4 bg-gray-100 dark:bg-gray-700 p-5 border-b dark:border-gray-500 rounded-t-2xl">
                    <Building2 className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-semibold">Basic Information</h2>
                  </div>

                  <div className="grid space-y-6 p-6 grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Organization Name *</Label>
                      <Input
                        placeholder="Acme Inc."
                        className='dark:bg-gray-900 dark:text-white py-6 rounded-sm dark:border-none bg-white'
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type *</Label>
                      <Select
                      >
                        <SelectTrigger className='rounded-sm dark:bg-gray-900 dark:border-none p-6'>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessTypes.map(type => (
                            <SelectItem key={type} value={type} className='hover:cursor-pointer hover:bg-blue-600 hover:text-white'>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessEmail">Business Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="businessEmail"
                          type="email"
                          className="pl-9 py-6 rounded-sm bg-white dark:bg-gray-900 dark:text-white dark:border-none"
                          placeholder="contact@acme.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="websiteUrl">Website URL</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="websiteUrl"
                          className="pl-9 py-6 rounded-sm bg-white dark:bg-gray-900 dark:text-white dark:border-none"
                          placeholder="https://acme.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logoUrl">Logo URL</Label>
                      <Input
                        id="logoUrl"
                        className="py-6 rounded-sm bg-white dark:bg-gray-900 dark:text-white dark:border-none"
                        placeholder="https://acme.com/logo.png"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className='w-9/12 rounded-2xl shadow-md'>
                <div className="space-y-6">
                  <div className="space-y-6 dark:bg-gray-800 dark:border-none">
                    <div className="flex space-x-4 bg-gray-100 dark:bg-gray-700 p-5 border-b dark:border-gray-500 rounded-t-2xl">
                      <MapPin className="w-6 h-6 text-primary" />
                      <h2 className="text-xl font-semibold">Location & Locale</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="country">Country *</Label>
                        <Select
                        >
                          <SelectTrigger className='py-6 dark:bg-gray-900 rounded-sm dark:border-none'>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map(country => (
                              <SelectItem key={country} value={country} className='cursor-pointer hover:bg-blue-500'>{country}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                          <SelectContent>
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
                  </div>
                </div>
              </Card>
              <Button
                className="bg-green-600 hover:bg-green-700"
                type='submit'
              >
                Submit Organization
              </Button>
            </TabsContent>

            <TabsContent value='cards'>
            </TabsContent>

            <TabsContent value='billing'>
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
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </div >
  );
};

export default TenantSetting;
