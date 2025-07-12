'use client';

import {
  FileText,
  Zap,
  BarChart3,
  Users,
  UserPlus,
  UserCheck,
  RotateCcw,
  InfoIcon,
  TrendingDown,
  TrendingUp,
  RefreshCcw
} from 'lucide-react';
import { FaUsers } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { RiUserShared2Fill } from 'react-icons/ri';
import { Button } from "@/components/ui/button";
import * as React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const getRenewedMembers = async ({ queryKey }) => {
    const [, startDate, endDate, page, limit] = queryKey;
    try {
      const response = await fetch(
        `http://localhost:3000/api/memberanalytics/renewedmembers?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`
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
      const response = await fetch("http://localhost:3000/api/graphdata/activeinactivemembers")
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
      const response = await fetch(`http://localhost:3000/api/graphdata/newmembers`);
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
      description: "Total membership of this organization till today"
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
      description: "Total renewals from starting of this month"
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
      border: 'bg-yellow-200',
      description: "Total new member from starting of this month"
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
      border: 'bg-green-200',
      description: "Total active member of today"
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
      description: "Average active member of today"
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
      description: "Todays inactive member count"
    },
  ];

  return (
    <div className="min-h-screen w-full flex justify-center dark:bg-gray-900 bg-gray-50">
      <div className="w-full p-4 md:pt-10">

        {/* Welcome Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
          {/* Main Welcome Card */}
          <Card className="lg:col-span-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                {/* Text content */}
                <div className="flex-1 space-y-4 flex flex-col justify-between text-center lg:text-left">
                  <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold font-serif text-gray-900 dark:text-white">
                      {getGreeting()}, {loggedInUser?.firstName}
                    </h1>
                    <div className="w-12 h-1 bg-blue-600 mx-auto lg:mx-0 rounded-full"></div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    Transform your gym operations with cutting-edge analytics and intelligent member management solutions.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 pt-4">
                    <Button
                      onClick={() => router.push('/dashboard')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 rounded-lg font-medium text-sm transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      See Documentation
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-6 py-6 rounded-lg font-medium text-sm transition-colors duration-200"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Explore Features
                    </Button>
                  </div>
                </div>

                {/* Image Container */}
                <div className="flex-shrink-0 w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40">
                  <div className="w-full h-full bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <img
                      src="/dashboard.png"
                      alt="dashboard"
                      className="w-full h-full object-contain rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Stats Card */}
          <Card className="lg:col-span-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Analytics Hub
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Live Performance Metrics</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                >
                  <RefreshCcw className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </Button>
              </div>

              {/* Stats Grid */}
              <div className="space-y-4 flex-1">
                {/* New Members Card */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">New Members</p>
                      </div>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {newMembers?.members?.length || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </div>

                {/* Renewed Members Card */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-green-600" />
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Renewed Members</p>
                      </div>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {renewedMembers?.members?.length || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <RotateCcw className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="py-2 rounded-2xl dark:bg-gray-800 shadow-sm mb-4 dark:border dark:border-none border border-gray-200">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {gridContents.map((item) => (
            <Card
              key={item.id}
              className={`
              group relative overflow-hidden 
              rounded-2xl 
              bg-white dark:bg-gray-800
              border-0 shadow-sm hover:shadow-xl
              transition-all duration-300 ease-out
              hover:-translate-y-1
              ${item.border}
              backdrop-blur-sm
            `}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-gray-800/50 pointer-events-none" />

              {/* Content */}
              <div className="relative p-8">
                <div className="flex justify-between items-start space-x-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                      {item.text}
                    </p>
                    <div className="flex items-baseline space-x-3 mb-2">
                      <h1 className={`text-4xl font-bold ${item.color} tracking-tight`}>
                        {item.value.toLocaleString()}
                      </h1>
                      <span className={`
                        flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold
                        ${item.trend === 'up'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }
                      `}>
                        {item.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {Math.abs(item.percentage)}%
                      </span>
                    </div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-500">
                      {item.description}
                    </p>
                  </div>

                  <div className={`
                    p-4 rounded-xl ${item.bg} 
                    group-hover:scale-110 transition-transform duration-300
                  `}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className={`
                  absolute bottom-0 left-0 right-0 h-1 
                  bg-gradient-to-r ${item.color.replace('text-', 'from-').replace(' dark:text-', ' to-')}
                  opacity-60 group-hover:opacity-100 transition-opacity duration-300
                `} />
              </div>
            </Card>
          ))}
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <Card className="border dark:border-none dark:bg-gray-800 shadow-lg rounded-2xl">
            <BarChartMultiple />
          </Card>

          <Card className="border dark:border-none rounded-2xl dark:bg-gray-800 shadow-lg">
            <NewMembersLineChart />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <Card className="border dark:border-none rounded-2xl dark:bg-gray-800 shadow-lg">
            <RenewRadialChart startDate={startDate} endDate={endDate} />
          </Card>

          <Card className="border dark:border-none rounded-2xl dark:bg-gray-800 shadow-lg">
            <NewRadialChart startDate={startDate} endDate={endDate} />
          </Card>
        </div>

        <Card className="border dark:border-none rounded-2xl dark:bg-gray-800 shadow-lg mb-4">
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
