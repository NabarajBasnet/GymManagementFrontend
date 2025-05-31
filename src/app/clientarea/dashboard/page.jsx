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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "react-hot-toast";
import { toast as soonerToast } from "sonner";
import { User, Settings, LogOut, X, Info } from "lucide-react";
import Loader from "@/components/Loader/Loader";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { GiBiceps } from "react-icons/gi";
import { FaUsers, FaBuilding } from "react-icons/fa6";
import { RiServiceLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/Providers/LoggedInUserProvider";
import { useTenant } from "@/components/Providers/LoggedInTenantProvider";

const StatCard = ({ icon: Icon, title, value, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="hover:shadow-lg cursor-pointer dark:border-none dark:bg-gray-800 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${className}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-3xl font-bold">{value}</h3>
            <p className="text-sm text-muted-foreground">{title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const TenantDashboard = () => {
  const { tenant, loading } = useTenant();
  const loggedInTenant = tenant?.tenant;
  const router = useRouter();

  const [createOrganizationAlertDialog, setCreateOrganizationAlertDialog] =
    useState(false);

  useEffect(() => {
    const checkOrganizationEmailExists = loggedInTenant?.organizationEmail;
    const checkOrganizationPhoneExists = loggedInTenant?.organizationPhone;

    if (
      checkOrganizationEmailExists === null ||
      checkOrganizationPhoneExists === null
    ) {
      setCreateOrganizationAlertDialog(true);
    } else {
      setCreateOrganizationAlertDialog(false);
    }
  }, [loggedInTenant]);

  if (loading) {
    return <Loader />;
  }

  if (!loggedInTenant) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <h1 className="text-2xl font-bold dark:text-gray-200">
            Please login to continue
          </h1>
          <p className="text-sm text-muted-foreground">Access your dashboard</p>
          <Button
            onClick={() => router.push("/auth/tenantlogin")}
            className="px-8"
          >
            Login
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
    <div className="min-h-screen w-full flex justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold dark:text-white"
        >
          My Dashboard
        </motion.h1>
        <p className="text-sm text-muted-foreground my-4 font-medium dark:text-white">
          Portal / Client Area / Dashboard
        </p>

        <div className="flex flex-col-reverse lg:flex-row gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full lg:w-3/12"
          >
            <Card className="overflow-hidden dark:border-none dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                      {loggedInTenant?.ownerName.split(" ")[0].charAt(0)}
                      {loggedInTenant?.ownerName.split(" ")[1].charAt(0)}
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">
                      {loggedInTenant?.ownerName}
                    </h2>
                    <p className="text-sm dark:text-gray-100">
                      {getGreeting()}
                    </p>
                  </div>

                  <div className="w-full space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4 dark:text-gray-100" />
                        <span className="dark:text-gray-100">
                          {loggedInTenant?.email}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <FaBuilding className="w-4 h-4 dark:text-gray-100" />
                        <span className="dark:text-gray-100">
                          {loggedInTenant?.address}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t dark:border-gray-800">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground dark:text-gray-100">
                          Account Status
                        </span>
                        <span className="font-medium dark:text-gray-100">
                          {loggedInTenant?.tenantStatus}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground dark:text-gray-100">
                          Subscription Status
                        </span>
                        <span className="font-medium dark:text-gray-100 ">
                          {loggedInTenant?.tenantSubscriptionStatus}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 pt-4">
                      <Button
                        variant="outline"
                        className="w-full dark:border-none dark:hover:bg-gray-700 hover:bg-gray-200"
                        onClick={() => {}}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button
                        className="w-full bg-red-600 text-white dark:border-none dark:hover:bg-red-700 hover:bg-red-700"
                        onClick={() => logOutTenant()}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Log Out
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="w-full lg:w-9/12 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={FaUsers}
                title="Staffs"
                value={loggedInTenant?.staffs?.length || 0}
                className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              />
              <StatCard
                icon={FaBuilding}
                title="Branches"
                value={
                  loggedInTenant?.tenantSubscription?.branches?.length || 0
                }
                className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
              />
              <StatCard
                icon={FaUsers}
                title="Users"
                value={loggedInTenant?.tenantSubscription?.users?.length || 0}
                className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
              />
              <StatCard
                icon={GiBiceps}
                title="Members"
                value={loggedInTenant?.tenantSubscription?.members?.length || 0}
                className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
              />
            </div>

            {/* Active Services Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="dark:border-none dark:bg-gray-800 shadow-md">
                <CardHeader>
                  <CardTitle>Your Current Active Services/Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-6 flex justify-between items-center bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
                    <div>
                      <h3 className="text-2xl font-semibold mb-2">
                        {loggedInTenant?.tenantSubscription[0]
                          ?.subscriptionName || "No Active Subscription"}
                      </h3>
                      <p className="text-blue-100 font-medium text-sm">
                        {loggedInTenant?.ownerName || "N/A"}
                      </p>
                    </div>

                    <div>
                      <h1 className="text-blue-100 font-medium text-sm">
                        Start:{" "}
                        {new Date(
                          loggedInTenant?.tenantSubscriptionStartDate
                        ).toLocaleDateString()}
                      </h1>
                      <h1 className="text-blue-100 font-medium text-sm">
                        End:{" "}
                        {new Date(
                          loggedInTenant?.tenantSubscriptionEndDate
                        ).toLocaleDateString()}
                      </h1>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Alert Dialog */}
      <AlertDialog
        open={createOrganizationAlertDialog}
        onOpenChange={setCreateOrganizationAlertDialog}
      >
        <AlertDialogContent className="sm:max-w-[525px] dark:bg-gray-800 dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl flex items-center font-semibold dark:text-white">
              <Info className="w-6 mt-1 h-6 mr-2" />
              Organization Details Required
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-sm font-medium dark:text-gray-300">
              Please provide your organization's contact information which will
              be usefull for notifications and many other purposes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              try {
                const response = await fetch(
                  `http://localhost:3000/api/tenant/email-phone-assign/${loggedInTenant?._id}`,
                  {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      organizationEmail: formData.get("organizationEmail"),
                      organizationPhone: formData.get("organizationPhone"),
                    }),
                  }
                );

                const data = await response.json();
                if (response.ok) {
                  toast.success(data.message);
                  soonerToast.success(data.message);
                  setCreateOrganizationAlertDialog(false);
                  window.location.reload();
                } else {
                  throw new Error(data.message || "Something went wrong");
                }
              } catch (error) {
                soonerToast.error(error.message);
              }
            }}
          >
            <div className="space-y-6 py-6">
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="organizationEmail"
                  className="text-sm font-medium dark:text-gray-200"
                >
                  Organization Email
                </label>
                <input
                  id="organizationEmail"
                  name="organizationEmail"
                  type="email"
                  placeholder="organization@example.com"
                  className="flex w-full rounded-sm border border-gray-200 bg-white px-3 py-3 text-sm 
                     ring-offset-white transition-colors file:border-0 file:bg-transparent 
                     file:text-sm file:font-medium placeholder:text-gray-500 
                     focus-visible:outline-none focus-visible:ring-gray-400 
                     focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
                     dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 
                     dark:ring-offset-gray-800 dark:placeholder:text-gray-400
                     dark:focus-visible:ring-gray-500"
                  required
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="organizationPhone"
                  className="text-sm font-medium dark:text-gray-200"
                >
                  Organization Phone
                </label>
                <input
                  id="organizationPhone"
                  name="organizationPhone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="flex w-full rounded-sm border border-gray-200 bg-white px-3 py-3 text-sm 
                     ring-offset-white transition-colors file:border-0 file:bg-transparent 
                     file:text-sm file:font-medium placeholder:text-gray-500 
                     focus-visible:outline-none focus-visible:ring-gray-400 
                     focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
                     dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 
                     dark:ring-offset-gray-800 dark:placeholder:text-gray-400
                     dark:focus-visible:ring-gray-500"
                  required
                />
              </div>
            </div>
            <AlertDialogFooter className="sm:justify-end gap-2">
              <AlertDialogCancel className="mt-0 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:border-gray-600">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Save Changes
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TenantDashboard;
