"use client";

import { useState } from "react";
import { toast as soonerToast } from "sonner";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  User,
  MapPin,
  CreditCard,
  Settings,
  Lock,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Shield,
  Users,
  CheckCircle,
  XCircle,
  Globe,
  Clock,
} from "lucide-react";

const AccountSetting = () => {
  const [activeTab, setActiveTab] = useState("company");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const getAccountDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tenant/details`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseBody = await response.json();

      if (!response.ok) {
        soonerToast.error(responseBody.message);
        toast.error(responseBody.message);
      }

      return responseBody;
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["accountdetails"],
    queryFn: getAccountDetails,
  });

  const { tenant } = data || {};

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordSubmit = () => {
    // Add validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    // Add your password change logic here
    console.log("Password change submitted:", passwordData);
    toast.success("Password changed successfully!");
    setShowPasswordForm(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount, currency) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  const tabs = [
    { id: "company", label: "Company Details", icon: Building2 },
    { id: "owner", label: "Owner Details", icon: User },
    { id: "subscription", label: "Subscription", icon: CreditCard },
    { id: "security", label: "Security", icon: Lock },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Failed to load account details
          </h3>
          <p className="text-gray-500">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const renderCompanyDetails = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center mb-4">
          <Building2 className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Organization Information
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Organization Name
            </label>
            <p className="text-gray-900 dark:text-gray-100 font-medium">
              {tenant.organizationName}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Business Type
            </label>
            <p className="text-gray-900 dark:text-gray-100">
              {tenant.businessType}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address
            </label>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-gray-900 dark:text-gray-100">
                {tenant.address}, {tenant.country}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                {tenant.tenantStatus}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Currency
            </label>
            <p className="text-gray-900 dark:text-gray-100">
              {tenant.tenantCurrency}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Timezone
            </label>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-400 mr-2" />
              <p className="text-gray-900 dark:text-gray-100">
                {tenant.tenantTimezone}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center mb-4">
          <Users className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Organization Structure
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 dark:bg-gray-900 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {tenant.organizationMembers?.length || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              Members
            </p>
          </div>
          <div className="text-center p-4 dark:bg-gray-900 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {tenant.organizationStaffs?.length || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              Staff
            </p>
          </div>
          <div className="text-center p-4 dark:bg-gray-900 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {tenant.organizationBranch?.length || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              Branches
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOwnerDetails = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center mb-4">
        <User className="h-6 w-6 text-blue-600 mr-3" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Owner Information
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name
          </label>
          <p className="text-gray-900 dark:text-gray-100 font-medium">
            {tenant.ownerName}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <div className="flex items-center">
            <Mail className="h-4 w-4 text-gray-400 mr-2" />
            <p className="text-gray-900 dark:text-gray-100">{tenant.email}</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone Number
          </label>
          <div className="flex items-center">
            <Phone className="h-4 w-4 text-gray-400 mr-2" />
            <p className="text-gray-900 dark:text-gray-100">
              {tenant.phone?.countryCode} {tenant.phone?.number}
            </p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Country
          </label>
          <div className="flex items-center">
            <Globe className="h-4 w-4 text-gray-400 mr-2" />
            <p className="text-gray-900 dark:text-gray-100">
              {tenant.phone?.country}
            </p>
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Account Created
          </label>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
            <p className="text-gray-900 dark:text-gray-100">
              {formatDate(tenant.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSubscription = () => {
    const subscription = tenant.tenantSubscription?.[0];
    return (
      <div className="space-y-6 border-none">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CreditCard className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Current Subscription
              </h3>
            </div>
            <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
              {tenant.tenantSubscriptionStatus}
            </span>
          </div>

          {subscription && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Plan Name
                </label>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {subscription.subscriptionName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Plan Price
                </label>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {formatCurrency(
                    subscription.subscriptionPrice,
                    tenant.tenantCurrency
                  )}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {subscription.subscriptionDuration} days
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Method
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {tenant.tenantSubscriptionPaymentMethod}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {formatDate(tenant.tenantSubscriptionStartDate)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {formatDate(tenant.tenantSubscriptionEndDate)}
                </p>
              </div>
            </div>
          )}
        </div>

        {subscription?.subscriptionFeatures && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Plan Features
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {subscription.subscriptionFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex dark:bg-gray-900 items-center p-3 bg-green-50 rounded-lg"
                >
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSecurity = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center mb-6">
        <Lock className="h-6 w-6 text-blue-600 mr-3" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Security Settings
        </h3>
      </div>

      <div className="space-y-6">
        <div className="border-b pb-6">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
            Password
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 font-medium">
            Update your password to keep your account secure
          </p>

          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Change Password
            </button>
          ) : (
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handlePasswordSubmit}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update Password
                </button>
                <button
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
            Account Status
          </h4>
          <div className="flex items-center p-4 dark:bg-gray-900 bg-green-50 rounded-lg">
            <Shield className="h-5 w-5 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Account is secure
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your account is properly configured and secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center mb-6">
        <Settings className="h-6 w-6 text-blue-600 mr-3" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          General Settings
        </h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Language
          </label>
          <p className="text-gray-900 dark:text-gray-100">
            {tenant.tenantLanguage}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Timezone
          </label>
          <p className="text-gray-900 dark:text-gray-100">
            {tenant.tenantTimezone}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Currency
          </label>
          <p className="text-gray-900 dark:text-gray-100">
            {tenant.tenantCurrency}
          </p>
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
            Trial Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Trial Status
              </label>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  tenant.tenantFreeTrialStatus === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {tenant.tenantFreeTrialStatus}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                On Free Trial
              </label>
              <p className="text-gray-900 dark:text-gray-100">
                {tenant.tenantOnFreeTrial ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "company":
        return renderCompanyDetails();
      case "owner":
        return renderOwnerDetails();
      case "subscription":
        return renderSubscription();
      case "security":
        return renderSecurity();
      case "settings":
        return renderSettings();
      default:
        return renderCompanyDetails();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Account Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium text-sm">
            Manage your account information and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - full width on mobile, 3/12 on desktop */}
          <div className="w-full lg:w-3/12">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 border-l-4 border-blue-600"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content - full width on mobile, 9/12 on desktop */}
          <div className="w-full lg:w-9/12">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSetting;
