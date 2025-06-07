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
import { toast } from "react-hot-toast";
import { toast as soonerToast } from "sonner";
import { User, Settings, LogOut, X, Info, Calendar, Clock, Shield, Activity } from "lucide-react";
import Loader from "@/components/Loader/Loader";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { GiBiceps } from "react-icons/gi";
import { FaUsers, FaBuilding } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useTenant } from "@/components/Providers/LoggedInTenantProvider";

const StatCard = ({ icon: Icon, title, value, className, trend, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={{ y: -2 }}
  >
    <Card className="relative overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-800/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent dark:from-white/10" />
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between">
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

const TenantDashboard = () => {
  const { tenant, loading } = useTenant();
  const loggedInTenant = tenant?.tenant;
  const router = useRouter();

  const tenantOnTrail = loggedInTenant?.freeTrailStatus;
  const freeTrailExpireAt = new Date(loggedInTenant?.freeTrailEndsAt);
  const today = new Date();
  const expireDate = new Date(freeTrailExpireAt.setHours(0, 0, 0, 0));
  const todayDate = new Date(today.setHours(0, 0, 0, 0));

  // Calculate difference in milliseconds
  const diffTime = expireDate.getTime() - todayDate.getTime();
  const remainingDaysOnFreeTrail = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  let [organizationDetailsSetupCompleted, setOrganizationDetailsSetupCompleted] = useState(false);

  useEffect(() => {
    if (loggedInTenant?.onboardingCompleted !== undefined) {
      setOrganizationDetailsSetupCompleted(loggedInTenant?.onboardingCompleted);
    }
  }, [loggedInTenant]);

  const [createOrganizationAlertDialog, setCreateOrganizationAlertDialog] =
    useState(false);
  const [onFreeTrail, setOnFreeTrail] = useState(false);

  useEffect(() => {
    const checkOrganizationEmailExists = loggedInTenant?.organizationEmail;
    const checkOrganizationPhoneExists = loggedInTenant?.organizationPhone;

    const checkOnFreeTrail = loggedInTenant?.tenantOnFreeTrial;
    setOnFreeTrail(checkOnFreeTrail);

    if (
      checkOrganizationEmailExists === null ||
      checkOrganizationPhoneExists === null
    ) {
      setCreateOrganizationAlertDialog(true);
    } else {
      setCreateOrganizationAlertDialog(false);
    }
  }, [loggedInTenant]);

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
      const response = await fetch(
        `http://localhost:3000/api/tenant/auth/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseBody = await response.json();
      if (response.ok) {
        soonerToast.success(responseBody.message);
        toast.success(responseBody.message);
        router.push(responseBody.redirectUrl);
      }
    } catch (error) {
      console.log("Error: ", error);
      soonerToast.error(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent)] dark:bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.05),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent)] dark:bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.05),transparent)]" />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
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
        </motion.div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Enhanced Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full xl:w-80 flex-shrink-0"
          >
            <Card className="overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent" />
              <CardContent className="p-8 relative">
                <div className="flex flex-col items-center space-y-6">
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
                  <div className="w-full space-y-4">
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
                            {loggedInTenant?.tenantSubscriptionStatus || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-3 pt-4">
                      <Button
                        variant="outline"
                        className="w-full h-11 border-2  dark:border-none border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-700/20 transition-all duration-300 group"
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
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={FaUsers}
                title="Staff Members"
                value={loggedInTenant?.staffs?.length || 0}
                className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-600 dark:text-blue-400"
                trend="+12%"
                subtitle="Active employees"
              />
              <StatCard
                icon={FaBuilding}
                title="Branches"
                value={loggedInTenant?.tenantSubscription?.branches?.length || 0}
                className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 text-purple-600 dark:text-purple-400"
                trend="+5%"
                subtitle="Business locations"
              />
              <StatCard
                icon={FaUsers}
                title="System Users"
                value={loggedInTenant?.tenantSubscription?.users?.length || 0}
                className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 text-green-600 dark:text-green-400"
                trend="+8%"
                subtitle="Platform access"
              />
              <StatCard
                icon={GiBiceps}
                title="Members"
                value={loggedInTenant?.tenantSubscription?.members?.length || 0}
                className="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 text-orange-600 dark:text-orange-400"
                trend="+23%"
                subtitle="Registered members"
              />
            </div>

            {/* Enhanced Active Services Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden">
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
                <CardContent className="pt-0">
                  <div className="relative p-8 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl text-white overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.05),transparent)]" />

                    <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                          </div>
                          <div className="space-x-2 font-medium text-xl">
                            <span>
                              {
                                tenantOnTrail ? 'Free Trail' : loggedInTenant?.subscription || 'N/A'
                              }
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 text-right">
                        <div className="flex items-center space-x-2 text-blue-100">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Start: {tenantOnTrail ? new Date(loggedInTenant?.createdAt).toLocaleDateString() : new Date(loggedInTenant?.subscriptionStartsAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-blue-100">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            End: {tenantOnTrail
                              ? new Date(loggedInTenant?.freeTrailEndsAt).toLocaleDateString()
                              : new Date(loggedInTenant?.subscriptionEndsAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-bold">
                            {tenantOnTrail
                              ? `${remainingDaysOnFreeTrail} days left`
                              : `${calculateRemainingDays()} days remaining`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
