"use client";

import { User } from "lucide-react";
import Loader from "@/components/Loader/Loader";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoIcon, TrendingDown, TrendingUp, RefreshCcw } from "lucide-react";
import { MdAutorenew } from "react-icons/md";
import { GiBiceps } from "react-icons/gi";
import { FaUsers } from "react-icons/fa6";
import { PiUsersFourFill } from "react-icons/pi";
import { RiUserShared2Fill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { BarChartMultiple } from "@/components/Charts/BarChart";
import { BarChartInterActive } from "@/components/Charts/barChartInteractive";
import { NewRadialChart } from "@/components/Charts/newRadialChart";
import { ShadSmallLineChart } from "@/components/Charts/ShadSmallLineChart";
import { RenewRadialChart } from "@/components/Charts/renewRadialChart";
import { useUser } from "@/components/Providers/LoggedInUserProvider";
import { useTenant } from "@/components/Providers/LoggedInTenantProvider";

const AdminDashboard = () => {
  const { tenant, loading } = useTenant();
  const loggedInTenant = tenant?.tenant;
  const router = useRouter();

  if (loading) {
    return <Loader />;
  }

  if (!loggedInTenant) {
    return (
      <div>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold">Please login to continue</h1>
          <p className="text-sm text-gray-500">Please login to continue</p>
          <Button onClick={() => router.push("/auth/tenantlogin")}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen w-full flex justify-center dark:bg-gray-900 bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        <div className="w-full flex items-start justify-between space-x-4">
          <Card className="w-full lg:w-3/12">
            <div>
              <div className="flex flex-col items-center justify-between p-2">
                <div className="flex items-center justify-center bg-white rounded-full p-12 text-gray-500">
                  {loggedInTenant?.ownerName.split(" ")[0].charAt(0)}
                  {loggedInTenant?.ownerName.split(" ")[1].charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {getGreeting()}, {loggedInTenant?.ownerName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {loggedInTenant?.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    {loggedInTenant?.phone?.countryCode}{" "}
                    {loggedInTenant?.phone?.number}
                  </p>
                  <p className="text-sm text-gray-500">
                    {loggedInTenant?.address}
                  </p>
                  <p className="text-sm text-gray-500">
                    {loggedInTenant?.tenantStatus}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(
                      loggedInTenant?.tenantSubscriptionStartDate
                    ).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(
                      loggedInTenant?.tenantSubscriptionEndDate
                    ).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {loggedInTenant?.tenantSubscriptionStatus}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="w-full lg:w-9/12">
            <h2 className="text-lg font-bold">My Tenants</h2>
            <p className="text-sm text-gray-500">
              View and manage your tenants
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
