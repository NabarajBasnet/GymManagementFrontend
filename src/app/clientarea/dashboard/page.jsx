"use client";

import { toast as soonerToast } from "sonner";
import { User, Settings, LogOut, Clock, Shield, Activity, CreditCard, Globe, Mail, Phone, MapPin, DollarSign, FileText, CheckCircle } from "lucide-react";
import Loader from "@/components/Loader/Loader";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { GiBiceps } from "react-icons/gi";
import { FaUsers, FaBuilding, FaDumbbell, FaCreditCard } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useTenant } from "@/components/Providers/LoggedInTenantProvider";
import { useQuery } from "@tanstack/react-query";

const TenantDashboard = () => {
  const { tenant, loading } = useTenant();
  const loggedInTenant = tenant?.tenant;
  const router = useRouter();

  const tenantOnTrail = loggedInTenant?.freeTrailStatus;
  const freeTrailExpireAt = new Date(loggedInTenant?.freeTrailEndsAt);
  const today = new Date();
  const expireDate = new Date(freeTrailExpireAt.setHours(0, 0, 0, 0));
  const todayDate = new Date(today.setHours(0, 0, 0, 0));

  const diffTime = expireDate.getTime() - todayDate.getTime();
  const remainingDaysOnFreeTrail = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const calculateRemainingDays = () => {
    const endDate = new Date(loggedInTenant?.tenantSubscriptionEndDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return <Loader />;
  }

  if (!loggedInTenant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent)]" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative text-center space-y-6 p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Authentication Required
            </h1>
            <p className="text-gray-600 dark:text-gray-300">Please sign in to access your dashboard</p>
          </div>
          <Button
            onClick={() => router.push("/login")}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Sign In
          </Button>
        </motion.div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const logOutTenant = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/tenant/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseBody = await response.json();
      if (response.ok) {
        soonerToast.success(responseBody.message);
        router.push(responseBody.redirectUrl);
      }
    } catch (error) {
      console.log("Error: ", error);
      soonerToast.error(error.message);
    }
  };

  // Get staffs by tenant
  const getStaffsByTenant = async () => {
    try {
      const request = await fetch(`http://localhost:3000/api/staffsmanagement/by-tenant`);
      const responseBody = await request.json();
      return responseBody;
    } catch (error) {
      console.log("Error: ", error);
    };
  };

  const { data: staffsData, isLoading: isStaffsLoading } = useQuery({
    queryKey: ['staffs'],
    queryFn: getStaffsByTenant,
  });
  const { staffs, totalStaffs } = staffsData || {};

  // Get System Users by tenant
  const getSystemUsersByTenant = async () => {
    try {
      const request = await fetch(`http://localhost:3000/api/systemusers/system-users-by-tenant`);
      const responseBody = await request.json();
      return responseBody;
    } catch (error) {
      console.log("Error: ", error);
    };
  };

  const { data: usersData, isLoading: isUsersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getSystemUsersByTenant,
  });
  const { users, totalUsers } = usersData || {};

  // Get members by tenant
  const getMembersByTenant = async () => {
    try {
      const request = await fetch(`http://localhost:3000/api/members/members-by-tenant`);
      const responseBody = await request.json();
      return responseBody;
    } catch (error) {
      soonerToast.error(error.message);
      console.log("Error: ", error);
    };
  };

  const { data: membersData, isLoading: isMembersLoading } = useQuery({
    queryKey: ['members'],
    queryFn: getMembersByTenant,
  });
  const { members, totalMembers } = membersData || {};

  // Get branches by tenant
  const getBranchessByTenant = async () => {
    try {
      const request = await fetch(`http://localhost:3000/api/organizationbranch/tenant`);
      const responseBody = await request.json();
      return responseBody;
    } catch (error) {
      soonerToast.error(error.message);
      console.log("Error: ", error);
    };
  };

  const { data: branchessData, isLoading: isBranchessLoading } = useQuery({
    queryKey: ['branches'],
    queryFn: getBranchessByTenant,
  });
  const { branches, totalBranches } = branchessData || {};

  // RUC
  const StatCard = ({ icon: Icon, title, value, className, trend, subtitle, link }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="h-full cursor-pointer"
    >
      <Card className="relative overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-800/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent dark:from-white/10" />
        <CardContent className="p-6 relative h-full flex flex-col">
          <div className="flex items-center justify-between flex-grow">
            <div className="space-y-2">
              <div className={`inline-flex p-3 rounded-xl ${className} transition-all duration-300 group-hover:scale-110`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
                {subtitle && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
                )}
              </div>
            </div>
            {trend && (
              <div className="text-right">
                <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full">
                  {trend}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const FeatureBadge = ({ feature }) => (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mr-2 mb-2">
      <CheckCircle className="w-3 h-3 mr-1" />
      {feature}
    </span>
  );

  const DetailItem = ({ icon: Icon, label, value, className }) => (
    <div className="flex items-start space-x-3 py-2">
      <div className={`p-2 rounded-lg ${className || 'bg-gray-100 dark:bg-gray-700/50'}`}>
        <Icon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 break-words">{value || 'N/A'}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Full-width background elements */}

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-4 py-4">
        {/* Header */}
        <div
          className="mb-4"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Dashboard Overview
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <span>Portal</span>
                <span>/</span>
                <span>Client Area</span>
                <span>/</span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">Dashboard</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <Clock className="w-4 h-4" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-4">
          {/* Enhanced Profile Card */}
          <div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full xl:w-80 flex-shrink-0"
          >
            <Card className="overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent" />
              <CardContent className="p-8 relative h-full flex flex-col">
                <div className="flex flex-col items-center space-y-6 flex-grow">
                  {/* Avatar with Status */}
                  <div className="relative">
                    <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {loggedInTenant?.fullName.split(" ")[0].charAt(0)}
                      {loggedInTenant?.fullName.split(" ")[1]?.charAt(0) || ""}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {loggedInTenant?.fullName}
                    </h2>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                      {getGreeting()}
                    </p>
                  </div>

                  {/* Contact Details */}
                  <div className="w-full space-y-4 flex-grow">
                    <div className="space-y-3 p-4 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                          {loggedInTenant?.email}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <FaBuilding className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                          {loggedInTenant?.address}
                        </span>
                      </div>
                    </div>

                    {/* Status Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-700/30">
                        <div className="text-center">
                          <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">Account</p>
                          <p className="text-sm font-bold text-green-700 dark:text-green-300">
                            {loggedInTenant?.status || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/30">
                        <div className="text-center">
                          <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Subscription</p>
                          <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
                            {loggedInTenant?.subscriptionStatus || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-3 pt-4">
                      <Button
                        variant="outline"
                        className="w-full h-11 border-2 dark:border-none border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-700/20 transition-all duration-300 group"
                        onClick={() => { }}
                      >
                        <Settings className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                        Edit Profile
                      </Button>
                      <Button
                        className="w-full h-11 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => logOutTenant()}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-4">
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={FaUsers}
                title="Staff Members"
                value={isStaffsLoading ? '0' : totalStaffs || 0}
                className="cursor-pointer bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-600 dark:text-blue-400"
                trend="+12%"
                subtitle="Active employees"
                link={'/clientarea/staffs'}
              />
              <StatCard
                icon={FaBuilding}
                title="Branches"
                value={isBranchessLoading ? '0' : totalBranches || 0}
                className="cursor-pointer bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 text-purple-600 dark:text-purple-400"
                trend="+5%"
                subtitle="Business locations"
                link={'/clientarea/branches'}
              />
              <StatCard
                icon={FaUsers}
                title="System Users"
                value={isUsersLoading ? '0' : totalUsers || 0}
                className="cursor-pointer bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 text-green-600 dark:text-green-400"
                trend="+8%"
                subtitle="Platform access"
                link={'/clientarea/systemusers'}
              />
              <StatCard
                icon={GiBiceps}
                title="Members"
                value={isMembersLoading ? '0' : totalMembers || 0}
                className="cursor-pointer bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 text-orange-600 dark:text-orange-400"
                trend="+23%"
                subtitle="Total members"
                link={'/clientarea/members'}
              />
            </div>

            {/* Organization and Subscription Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Organization Details Card */}
              <div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="h-full"
              >
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                          Organization Details
                        </CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          Your business information
                        </p>
                      </div>
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <FaBuilding className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="h-[calc(100%-72px)] overflow-y-auto">
                    <div className="space-y-4">
                      <DetailItem
                        icon={FaBuilding}
                        label="Business Name"
                        value={loggedInTenant?.organization?.name}
                        className="bg-purple-100 dark:bg-purple-900/30"
                      />
                      <DetailItem
                        icon={FaDumbbell}
                        label="Business Type"
                        value={loggedInTenant?.organization?.businessType}
                        className="bg-orange-100 dark:bg-orange-900/30"
                      />
                      <DetailItem
                        icon={Mail}
                        label="Business Email"
                        value={loggedInTenant?.organization?.businessEmail}
                        className="bg-blue-100 dark:bg-blue-900/30"
                      />
                      <DetailItem
                        icon={Globe}
                        label="Website"
                        value={loggedInTenant?.organization?.websiteUrl}
                        className="bg-green-100 dark:bg-green-900/30"
                      />
                      <DetailItem
                        icon={MapPin}
                        label="Location"
                        value={`${loggedInTenant?.organization?.city}, ${loggedInTenant?.organization?.state}, ${loggedInTenant?.organization?.country}`}
                        className="bg-red-100 dark:bg-red-900/30"
                      />
                      <DetailItem
                        icon={DollarSign}
                        label="Currency"
                        value={loggedInTenant?.organization?.currency}
                        className="bg-yellow-100 dark:bg-yellow-900/30"
                      />
                      <DetailItem
                        icon={FileText}
                        label="Tax ID"
                        value={loggedInTenant?.organization?.taxId}
                        className="bg-indigo-100 dark:bg-indigo-900/30"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Active Services Card */}
              <div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="h-full"
              >
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                          Current Subscription
                        </CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          Your active service plan and details
                        </p>
                      </div>
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 h-[calc(100%-72px)] overflow-y-auto">
                    <div className="relative p-6 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-xl text-white overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)]" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.05),transparent)]" />

                      <div className="relative space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl">
                              {loggedInTenant?.freeTrailStatus === 'Active' ? 'Free Trail' : loggedInTenant?.subscription?.subscriptionName || 'N/A'}
                            </h3>
                            <p className="text-blue-100 text-sm">
                              {loggedInTenant?.freeTrailStatus === 'Active' ? `${loggedInTenant?.freeTrailStatus}` : `${loggedInTenant?.subscriptionStatus}`}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-blue-100 text-xs mb-1">Start Date</p>
                            <p className="font-medium">
                              {tenantOnTrail ?
                                new Date(loggedInTenant?.createdAt).toLocaleDateString() :
                                new Date(loggedInTenant?.subscriptionStartsAt).toLocaleDateString()
                              }
                            </p>
                          </div>
                          <div>
                            <p className="text-blue-100 text-xs mb-1">End Date</p>
                            <p className="font-medium">
                              {tenantOnTrail
                                ? new Date(loggedInTenant?.freeTrailEndsAt).toLocaleDateString()
                                : new Date(loggedInTenant?.subscriptionEndsAt).toLocaleDateString()
                              }
                            </p>
                          </div>
                          <div>
                            <p className="text-blue-100 text-xs mb-1">Duration</p>
                            <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-bold">
                          {loggedInTenant?.freeTrailStatus  === 'Active' ? `${loggedInTenant?.freeTrailRemainingDays} days` : `${loggedInTenant?.subscriptionRemainingDays} days left`}
                          </span>
                        </div>
                          </div>
                          <div>
                            <p className="text-blue-100 text-xs mb-1">Price</p>
                            <p className="font-medium">
                              {loggedInTenant?.subscription?.subscriptionPrice ?
                                `${loggedInTenant?.organization?.currency} ${loggedInTenant?.subscription?.subscriptionPrice}` :
                                'N/A'
                              }
                            </p>
                          </div>
                        </div>

                      
                      </div>
                    </div>

                    {/* Subscription Features */}
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Included Features</h4>
                      <div className="flex flex-wrap">
                        {loggedInTenant?.subscription?.subscriptionFeatures?.map((feature, index) => (
                          <FeatureBadge key={index} feature={feature} />
                        ))}
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div className="mt-6 space-y-4">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Payment Information</h4>
                      <DetailItem
                        icon={FaCreditCard}
                        label="Payment Provider"
                        value={loggedInTenant?.organization?.paymentProvider}
                      />
                      <DetailItem
                        icon={CreditCard}
                        label="Payment Account"
                        value={loggedInTenant?.organization?.paymentAccountId}
                      />
                      <DetailItem
                        icon={Mail}
                        label="Invoice Email"
                        value={loggedInTenant?.organization?.invoiceEmail}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Billing Address Section */}
            <div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                        Billing Address
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Your business billing information
                      </p>
                    </div>
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                      <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Primary Address</h4>
                      <DetailItem
                        icon={MapPin}
                        label="Address Line 1"
                        value={loggedInTenant?.organization?.billingAddress?.addressLine1}
                      />
                      <DetailItem
                        icon={MapPin}
                        label="Address Line 2"
                        value={loggedInTenant?.organization?.billingAddress?.addressLine2}
                      />
                      <DetailItem
                        icon={MapPin}
                        label="City"
                        value={loggedInTenant?.organization?.billingAddress?.city}
                      />
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Additional Details</h4>
                      <DetailItem
                        icon={MapPin}
                        label="State/Province"
                        value={loggedInTenant?.organization?.billingAddress?.state}
                      />
                      <DetailItem
                        icon={Globe}
                        label="Country"
                        value={loggedInTenant?.organization?.billingAddress?.country}
                      />
                      <DetailItem
                        icon={FileText}
                        label="ZIP/Postal Code"
                        value={loggedInTenant?.organization?.billingAddress?.zipCode}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;