'use client';

import { FaUsers, FaChartLine } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { RiUserShared2Fill } from 'react-icons/ri';
import { ArrowUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import * as React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoIcon, TrendingDown, TrendingUp, RefreshCcw } from 'lucide-react';
import { MdAutorenew } from "react-icons/md";
import { GiBiceps } from "react-icons/gi";
import { PiUsersFourFill } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { BarChartMultiple } from "@/components/Charts/BarChart";
import { BarChartInterActive } from "@/components/Charts/barChartInteractive";
import { NewRadialChart } from "@/components/Charts/newRadialChart";
import { NewMembersLineChart } from "@/components/Charts/NewMembersLineChart";
import { RenewRadialChart } from "@/components/Charts/renewRadialChart";
import { useUser } from "@/components/Providers/LoggedInUserProvider";
import { ActiveInactiveMemberChart } from "@/components/Charts/ActiveInactiveMemberChart";

const AdminDashboard = () => {

  const { user } = useUser();
  const loggedInUser = user?.user;

  const router = useRouter();
  const [averageActiveMembers, setAverageActiveMembers] = React.useState(null);
  const [data, setData] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const limit = 3;
  const [numbersLoading, setNumberLoading] = React.useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const [startDate, setStartDate] = React.useState(() => {
    let start = new Date();
    start.setDate(0);
    return start.toISOString().split("T")[0];
  });

  const [endDate, setEndDate] = React.useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  });

  const getTotalMembers = async () => {
    try {
      const response = await fetch(
        `http://88.198.112.156:3100/api/org-members/by-branch?startDate=${startDate}&endDate=${endDate}&limit=${limit}&page=${currentPage}`
      );
      const responseBody = await response.json();

      if (response.ok && response.status === 200) {
        setNumberLoading(false);
      };

      if (responseBody.redirect) {
        router.push(responseBody.redirect);
      }
      setData(responseBody);
      return responseBody;
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const getAverageActiveMembers = async () => {
    try {
      const response = await fetch('http://88.198.112.156:3100/api/averageactivemembers');
      const responseBody = await response.json();
      if (response.ok) {
        setAverageActiveMembers(responseBody.averageActiveMembers);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  React.useEffect(() => {
    getTotalMembers();
    getAverageActiveMembers();
  }, [startDate, endDate, currentPage]);

  const {
    totalMembers,
    activeMembers,
    InactiveMembers
  } = data || {};

  // Get New Members
  const getNewMembers = async () => {
    try {
      const response = await fetch(`http://88.198.112.156:3100/api/memberanalytics/newmembers?startDate=${startDate}&endDate=${endDate}`);
      const responseBody = await response.json();
      return responseBody;
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  const { data: newMembers, isLoading: isNewMemberLoading } = useQuery({
    queryKey: ['newmembers'],
    queryFn: getNewMembers,
  });

  // Get Renewed Members
  const getRenewedMembers = async ({ queryKey }) => {
    const [, startDate, endDate, page, limit] = queryKey;
    try {
      const response = await fetch(
        `http://88.198.112.156:3100/api/memberanalytics/renewedmembers?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`
      );
      const responseBody = await response.json();
      return responseBody;
    } catch (error) {
      console.error("Error fetching renewed members:", error);
      return { members: [] };
    }
  };

  const { data: renewedMembers = { members: [] }, isLoading: isRenewedMembersLoading } = useQuery({
    queryKey: ['renewedMembers', startDate, endDate, currentPage, limit],
    queryFn: getRenewedMembers
  });

  const getActiveInactiveMembers = async () => {
    try {
      const response = await fetch("http://88.198.112.156:3100/api/graphdata/activeinactivemembers")
      const data = await response.json()
      return data;
    } catch (error) {
      console.error("Error fetching data:", error)
      return []
    }
  }

  const { data: activeInactiveMembersData, isLoading } = useQuery({
    queryKey: ["activeinactivemembers"],
    queryFn: getActiveInactiveMembers,
  })

  const { growth } = activeInactiveMembersData || {};
  const { activeMembersGrowth, inactiveMembersGrowth } = growth || {};

  const getNewMembersGrowthPercentage = async () => {
    try {
      const response = await fetch(`http://88.198.112.156:3100/api/graphdata/newmembers`);
      const resBody = await response.json();
      return resBody;
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  const { data: newMembersGrowthPercentageData } = useQuery({
    queryKey: ['newmembersgrowthpercentage'],
    queryFn: getNewMembersGrowthPercentage
  });

  const { newMembers: months,
    growthPercentage: newMembersGrowthPercentage,
    currentCount,
    previousCount, } = newMembersGrowthPercentageData || {};

  const gridContents = [
    {
      id: 'total-membership',
      icon: FaUsers,
      text: "Total Membership",
      value: `${numbersLoading ? '...' : totalMembers || 0}`,
      percentage: 1.1,
      trend: "up",
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-700/20',
      border: 'border-blue-300',
    },
    {
      id: 'renewals',
      icon: MdAutorenew,
      text: "Renewals",
      value: `${numbersLoading ? '...' : renewedMembers?.members?.length || 0}`,
      percentage: -1.5,
      trend: "down",
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-700/20',
      border: 'border-green-300',
    },
    {
      id: 'new-admissions',
      icon: RiUserShared2Fill,
      text: "New Admissions",
      value: `${numbersLoading ? '...' : newMembers?.members?.length || 0}`,
      percentage: newMembersGrowthPercentage ? newMembersGrowthPercentage : 0,
      trend: newMembersGrowthPercentage > 0 ? "up" : "down",
      color: 'text-yellow-600',
      bg: 'bg-yellow-100 dark:bg-yellow-700/20',
      border: 'border-yellow-300',
    },
    {
      id: 'active-members',
      icon: GiBiceps,
      text: "Active Members",
      value: `${numbersLoading ? '...' : activeMembers?.length || 0}`,
      percentage: activeMembersGrowth ? activeMembersGrowth : 0,
      trend: activeMembersGrowth > 0 ? "up" : "down",
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-700/20',
      border: 'border-green-300',
    },
    {
      id: 'average-active',
      icon: FaUsers,
      text: "Average Active",
      value: `${numbersLoading ? '...' : averageActiveMembers || 0}`,
      percentage: 3.9,
      trend: "up",
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-700/20',
      border: 'border-blue-300',
    },
    {
      id: 'inactive-members',
      icon: PiUsersFourFill,
      text: "Inactive Members",
      value: `${numbersLoading ? '...' : InactiveMembers?.length || 0}`,
      percentage: inactiveMembersGrowth ? inactiveMembersGrowth : 0,
      trend: inactiveMembersGrowth > 0 ? "down" : "up",
      color: 'text-red-600',
      bg: 'bg-red-100 dark:bg-red-700/20',
      border: 'border-red-300',
    },
  ];

  return (
    <div className="min-h-screen w-full flex justify-center dark:bg-gray-900 bg-gray-50">
      <div className="w-full px-5 py-7">

        {/* Welcome Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Main Welcome Card - Now with max height */}
          <Card className="lg:col-span-8 relative overflow-hidden rounded-xl shadow-lg group transition-all duration-500 hover:shadow-xl bg-white dark:bg-gray-900/95 border-0 dark:border dark:border-gray-800/50 max-h-[24rem]">
            {/* Light mode background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20 dark:hidden"></div>

            {/* Dark mode grid background */}
            <div className="hidden dark:block absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%236b7280' stroke-width='1'%3E%3Cpath d='m0 60 60-60M30 0v60M0 30h60'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>

            {/* Floating orbs */}
            <div className="absolute top-10 right-20 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-cyan-300/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-r from-purple-400/10 to-pink-300/10 rounded-full blur-xl animate-pulse delay-1000"></div>

            {/* Content container with constrained height */}
            <div className="relative z-20 h-full p-6 lg:p-8 flex flex-col">
              <div className="flex-1 flex flex-col lg:flex-row items-center gap-6">
                {/* Text content */}
                <div className="flex-1 space-y-4 text-center lg:text-left">
                  <div className="flex justify-center lg:justify-start items-center gap-3">
                    <div className="space-y-2">
                      <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                        {getGreeting()},{" "}
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                          {loggedInUser?.firstName}
                        </span>
                        <span className="text-3xl"> 👋</span>
                      </h1>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                    Transform your gym operations with cutting-edge analytics and intelligent member management solutions.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 pt-2">
                    <Button
                      onClick={() => router.push('/dashboard')}
                      className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-600 text-white transition-all duration-500 shadow-lg hover:shadow-xl px-6 py-6 rounded-lg font-bold text-sm transform hover:scale-105 border-0 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                      <span className="relative flex items-center gap-2">
                        <span className="text-lg">📝</span>
                        See Documentation
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="group relative bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white 
                         border-2 border-gray-200 dark:border-gray-700 
                         hover:bg-gray-50 dark:hover:bg-gray-700/90 
                         hover:border-gray-300 dark:hover:border-gray-600 
                         transition-all duration-500 shadow-md hover:shadow-lg 
                         px-6 py-6 rounded-lg font-bold text-sm 
                         transform hover:scale-105 overflow-hidden backdrop-blur-sm"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                      <span className="relative flex items-center gap-2">
                        <span className="text-lg">📚</span>
                        Explore Features
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Image Container - Adjusted size */}
                <div className="flex-shrink-0 w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-2">
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl scale-110 animate-pulse"></div>
                    <div className="relative w-full h-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-3 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
                      <img
                        src="/dashboard.png"
                        alt="dashboard"
                        className="w-full h-full object-contain rounded-2xl filter drop-shadow-lg transition-all duration-500 group-hover:drop-shadow-2xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Stats Card - Now with max height */}
          <Card className="lg:col-span-4 relative rounded-xl shadow-lg bg-white dark:bg-gray-900/95 group border-0 dark:border dark:border-gray-800/50 overflow-hidden max-h-[24rem]">
            {/* Light mode background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-indigo-50/30 dark:hidden"></div>

            {/* Dark mode grid background */}
            <div className="hidden dark:block absolute inset-0 opacity-15" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%236b7280' stroke-width='0.5'%3E%3Cpath d='M0 0h40v40H0z'/%3E%3Cpath d='M0 20h40M20 0v40'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>

            {/* Floating elements */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 right-6 w-16 h-16 bg-gradient-to-r from-blue-400/15 to-cyan-400/15 rounded-full blur-md animate-pulse"></div>
              <div className="absolute bottom-6 left-4 w-12 h-12 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-md animate-pulse delay-700"></div>
            </div>

            {/* Content with constrained height */}
            <div className="relative z-10 h-full p-4 flex flex-col">
              <div className="space-y-2 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                      <span className="text-xl">📊</span>
                      Analytics Hub
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">Live Performance Metrics</p>
                  </div>
                  <div className="group/refresh p-2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-110 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                    <MdAutorenew className="text-lg text-blue-600 dark:text-blue-400 group-hover/refresh:animate-spin transition-all duration-300" />
                  </div>
                </div>

                {/* Stats Grid - Now with flex-1 to fill remaining space */}
                <div className="grid gap-2 flex-1">
                  {/* New Members Card */}
                  <div className="group/card relative p-3 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-750 rounded-xl transition-all duration-500 shadow-md hover:shadow-xl transform hover:scale-[1.02] border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-xl transform translate-x-6 -translate-y-6"></div>
                    <div className="relative flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">👥</span>
                          <p className="text-xs font-bold text-gray-700 dark:text-gray-300">New Members</p>
                        </div>
                        <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                          {newMembers?.members?.length || 0}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-500/20 px-2 py-1 rounded-md border border-emerald-200 dark:border-emerald-500/30">
                            <ArrowUp className="h-2.5 w-2.5 text-emerald-700 dark:text-emerald-400" />
                            <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-400">+8% growth</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-500/20 dark:to-cyan-500/20 border border-blue-200 dark:border-blue-500/30 rounded-xl shadow-lg group-hover/card:shadow-xl transition-all duration-300">
                        <FaUsers className="h-6 w-6 text-blue-700 dark:text-blue-400" />
                      </div>
                    </div>
                  </div>

                  {/* Renewed Members Card */}
                  <div className="group/card relative p-5 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-750 rounded-xl transition-all duration-500 shadow-md hover:shadow-xl transform hover:scale-[1.02] border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-xl transform translate-x-6 -translate-y-6"></div>
                    <div className="relative flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">✨</span>
                          <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Renewed Members</p>
                        </div>
                        <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                          {renewedMembers?.members?.length || 0}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-500/20 px-2 py-1 rounded-md border border-amber-200 dark:border-amber-500/30">
                            <ArrowUp className="h-2.5 w-2.5 text-amber-700 dark:text-amber-400" />
                            <p className="text-[10px] font-black text-amber-700 dark:text-amber-400">+15% renewal</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20 border border-amber-200 dark:border-amber-500/30 rounded-xl shadow-lg group-hover/card:shadow-xl transition-all duration-300">
                        <RiUserShared2Fill className="h-6 w-6 text-amber-700 dark:text-amber-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="py-2 rounded-2xl dark:bg-gray-800 shadow-sm mb-6 dark:border dark:border-none border border-gray-200">
          <div className="px-3 py-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-gray-800 rounded-lg">
                  <InfoIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200">Date Range Filter</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Select a custom date range to view specific data</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Current Month</span>
                </div>
                <div className="h-4 w-px bg-gray-200"></div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Custom Range</span>
                </div>
              </div>
            </div>

            <div className="mt-2 rounded-lg">
              <form className="flex flex-col md:flex-row items-start md:items-end gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Start Date
                  </Label>
                  <div className="relative">
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-10 pl-3 pr-3 bg-white dark:border-gray-600 dark:bg-gray-800 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-md cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center w-8 h-10">
                  <div className="h-px w-full bg-gray-200"></div>
                </div>

                <div className="flex-1 space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    End Date
                  </Label>
                  <div className="relative">
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="h-10 pl-3 pr-3 bg-white dark:border-gray-600 dark:bg-gray-800 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-md cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 px-4 border-gray-200 dark:border-gray-600 dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => {
                      let start = new Date();
                      start.setDate(1);
                      setStartDate(start.toISOString().split("T")[0]);
                      const end = new Date();
                      end.setDate(end.getDate() + 1);
                      setEndDate(end.toISOString().split("T")[0]);
                    }}
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {gridContents.map((item) => (
            <Card
              key={item.id}
              className={`
                overflow-hidden 
                rounded-2xl 
                shadow-md 
                border 
                dark:border-none
                bg-gradient-to-br from-gray-100 via-gray-50 to-white
                dark:bg-gradient-to-br dark:from-gray-700 dark:via-gray-800 dark:to-gray-900
                ${item.border}
              `}
            >
              <div className="p-5 py-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{item.text}</p>
                    <div className="flex items-baseline">
                      <h3 className={`text-4xl pt-6 pb-2 font-bold ${item.color}`}>
                        {item.value.toLocaleString()}
                      </h3>
                      <span className={`ml-2 text-sm font-medium ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        <span className="flex items-center">
                          {item.trend === 'up' ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          {Math.abs(item.percentage)}% This Month
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${item.bg}`}>
                    <item.icon className={`text-3xl ${item.color}`} />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="border dark:border-none dark:bg-gray-800 shadow-lg rounded-2xl">
            <BarChartMultiple />
          </Card>

          <Card className="border dark:border-none rounded-2xl dark:bg-gray-800 shadow-lg">
            <NewMembersLineChart />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="border dark:border-none rounded-2xl dark:bg-gray-800 shadow-lg">
            <RenewRadialChart startDate={startDate} endDate={endDate} />
          </Card>

          <Card className="border dark:border-none rounded-2xl dark:bg-gray-800 shadow-lg">
            <NewRadialChart startDate={startDate} endDate={endDate} />
          </Card>
        </div>

        <Card className="border dark:border-none rounded-2xl dark:bg-gray-800 shadow-lg mb-6">
          <ActiveInactiveMemberChart />
        </Card>

        <Card className="border dark:border-none rounded-2xl dark:bg-gray-800 shadow-lg">
          <BarChartInterActive />
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
