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
import { ShadSmallLineChart } from "@/components/Charts/ShadSmallLineChart";
import { RenewRadialChart } from "@/components/Charts/renewRadialChart";
import { useUser } from "@/components/Providers/LoggedInUserProvider";

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
        `http://localhost:3000/api/org-members/by-branch?startDate=${startDate}&endDate=${endDate}&limit=${limit}&page=${currentPage}`
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
      const response = await fetch('http://localhost:3000/api/averageactivemembers');
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
    totalActiveMembers,
    totalInactiveMembers,
    activeMembers,
    InactiveMembers
  } = data || {};

  // Get New Members
  const getNewMembers = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/memberanalytics/newmembers?startDate=${startDate}&endDate=${endDate}`);
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
  const getRenewedMembers = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/memberanalytics/renewedmembers?startDate=${startDate}&endDate=${endDate}`);
      const responseBody = await response.json();
      return responseBody;
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  const { data: renewedMembers, isLoading: isRenewedMembersLoading } = useQuery({
    queryKey: ['renewedMembers'],
    queryFn: getRenewedMembers
  });

  const gridContents = [
    {
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
      icon: RiUserShared2Fill,
      text: "New Admissions",
      value: `${numbersLoading ? '...' : newMembers?.members?.length || 0}`,
      percentage: 0.5,
      trend: "up",
      color: 'text-yellow-600',
      bg: 'bg-yellow-100 dark:bg-yellow-700/20',
      border: 'border-yellow-300',
    },
    {
      icon: GiBiceps,
      text: "Active Members",
      value: `${numbersLoading ? '...' : activeMembers?.length || 0}`,
      percentage: -0.2,
      trend: "down",
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-700/20',
      border: 'border-green-300',
    },
    {
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
      icon: PiUsersFourFill,
      text: "Inactive Members",
      value: `${numbersLoading ? '...' : InactiveMembers?.length || 0}`,
      percentage: -4.5,
      trend: "down",
      color: 'text-red-600',
      bg: 'bg-red-100 dark:bg-red-700/20',
      border: 'border-red-300',
    },
  ];

  return (
    <div className="min-h-screen w-full flex justify-center dark:bg-gray-900 bg-gray-50">
      <div className="w-full px-5 py-7">

        {/* Welcome Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Main Welcome Card */}
          <Card className="lg:col-span-8 dark:border-none relative overflow-hidden rounded-xl shadow-md group transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-900">
            {/* Sleek gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-indigo/75 to-purple-700/75 dark:from-blue-900/90 dark:via-indigo/75 dark:to-purple-700/75 z-10"></div>

            {/* Geometric pattern overlay */}
            <div className="absolute inset-0 opacity-5 z-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20L0 0h40v40L20 20z'/%3E%3C/g%3E%3C/svg%3E")`
            }}></div>

            {/* Content container */}
            <div className="relative z-20 p-5 lg:p-6">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                {/* Text content */}
                <div className="flex-1 space-y-4 text-center lg:text-left">
                  <div className="flex justify-center lg:justify-start items-center gap-2">
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                      {getGreeting()}, <span className="text-cyan-400 font-black">{loggedInUser?.firstName}</span>!
                      <span className="ml-2 text-lg">👋</span>
                    </h1>
                  </div>

                  <p className="text-gray-300 text-sm md:text-base font-medium max-w-xl mx-auto lg:mx-0 leading-snug">
                    Streamline your gym operations with intelligent analytics and member management tools.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 pt-1">
                    <Button
                      onClick={() => router.push('/dashboard')}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white transition-all duration-300 shadow-md hover:shadow-lg px-6 py-2.5 rounded-lg font-semibold text-sm transform hover:scale-105 border-0"
                    >
                      <span className="mr-2">🚀</span> Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-white/5 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 shadow-sm hover:shadow-md px-6 py-2.5 rounded-lg font-semibold text-sm transform hover:scale-105"
                    >
                      <span className="mr-2">📚</span> Learn More
                    </Button>
                  </div>
                </div>

                {/* Image */}
                <div className="flex-shrink-0 w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 transform transition-all duration-500 group-hover:scale-105">
                  <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20 shadow-xl">
                    <img
                      src="/dashboard.png"
                      alt="dashboard"
                      className="w-full h-full object-contain rounded-xl filter drop-shadow-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Stats Card */}
          <Card className="lg:col-span-4 dark:border-none relative rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-900 group">
            {/* Modern glass-morphism background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-900/90 via-blue-600/70 to-purple-600/90 z-10"></div>

            {/* Floating elements */}
            <div className="absolute inset-0 z-10">
              <div className="absolute top-3 right-3 w-12 h-12 bg-white/10 rounded-full blur-sm animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 bg-white/5 rounded-full blur-sm animate-pulse delay-500"></div>
            </div>

            <div className="relative z-20 p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      <span className="mr-2">📊</span>Analytics
                    </h3>
                    <p className="text-xs text-white/80 font-medium">Real-time insights</p>
                  </div>
                  <div className="p-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-lg transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg transform hover:scale-110">
                    <MdAutorenew className="text-lg text-white/90 animate-spin hover:animate-none" />
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-[1.01] border border-white/10">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-white/90">👥 New Members</p>
                      <p className="text-2xl font-black text-white">{newMembers?.members?.length || 0}</p>
                      <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1 bg-emerald-500/20 px-1.5 py-0.5 rounded-md">
                          <ArrowUp className="h-2.5 w-2.5 text-emerald-300" />
                          <p className="text-[10px] font-bold text-emerald-300">+8%</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2.5 bg-gradient-to-br from-blue-400/20 to-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-xl shadow-md">
                      <FaUsers className="h-5 w-5 text-blue-300" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-[1.01] border border-white/10">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-white/90">✨ Renewed Members</p>
                      <p className="text-2xl font-black text-white">{renewedMembers?.members?.length || 0}</p>
                      <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1 bg-amber-500/20 px-1.5 py-0.5 rounded-md">
                          <ArrowUp className="h-2.5 w-2.5 text-amber-300" />
                          <p className="text-[10px] font-bold text-amber-300">+15%</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2.5 bg-gradient-to-br from-amber-400/20 to-orange-500/20 backdrop-blur-sm border border-amber-400/30 rounded-xl shadow-md">
                      <RiUserShared2Fill className="h-5 w-5 text-amber-300" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-[1.01] border border-white/10">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-white/90">📈 Attendance</p>
                      <p className="text-2xl font-black text-white">78%</p>
                      <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1 bg-green-500/20 px-1.5 py-0.5 rounded-md">
                          <ArrowUp className="h-2.5 w-2.5 text-green-300" />
                          <p className="text-[10px] font-bold text-green-300">+5%</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2.5 bg-gradient-to-br from-green-400/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl shadow-md">
                      <FaChartLine className="h-5 w-5 text-green-300" />
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
              key={item.text}
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
            <ShadSmallLineChart />
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

        <Card className="border dark:border-none rounded-2xl dark:bg-gray-800 shadow-lg">
          <BarChartInterActive />
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
