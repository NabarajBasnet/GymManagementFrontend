'use client';

import { Button } from "@/components/ui/button";
import * as React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoIcon, TrendingDown, TrendingUp } from 'lucide-react';
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

const AdminDashboard = () => {

  const {user} = useUser();
  const loggedInUser = user?.user;
  
  const router = useRouter();
  const [averageActiveMembers, setAverageActiveMembers] = React.useState(null);
  const [data, setData] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const limit = 3;
  const [numbersLoading, setNumberLoading] = React.useState(true);

  const [startDate, setStartDate] = React.useState(() => {
    let start = new Date();
    start.setDate(1);
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
        `http://localhost:3000/api/members?startDate=${startDate}&endDate=${endDate}&limit=${limit}&page=${currentPage}`
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
    totalPages,
    totalActiveMembers,
    totalInactiveMembers,
    renewdMembersLength,
    newAdmissionsLength,
  } = data || {};

  const gridContents = [
    {
      icon: FaUsers,
      text: "Total Membership",
      value: `${numbersLoading ? '...' : totalMembers || 0}`,
      percentage: 1.1,
      trend: "up",
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      border: 'border-blue-300',
    },
    {
      icon: MdAutorenew,
      text: "Renewals",
      value: `${numbersLoading ? '...' : renewdMembersLength || 0}`,
      percentage: -1.5,
      trend: "down",
      color: 'text-green-600',
      bg: 'bg-green-100',
      border: 'border-green-300',
    },
    {
      icon: RiUserShared2Fill,
      text: "New Admissions",
      value: `${numbersLoading ? '...' : newAdmissionsLength || 0}`,
      percentage: 0.5,
      trend: "up",
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
      border: 'border-yellow-300',
    },
    {
      icon: GiBiceps,
      text: "Active Members",
      value: `${numbersLoading ? '...' : totalActiveMembers || 0}`,
      percentage: -0.2,
      trend: "down",
      color: 'text-green-600',
      bg: 'bg-green-100',
      border: 'border-green-300',
    },
    {
      icon: FaUsers,
      text: "Average Active",
      value: `${numbersLoading ? '...' : averageActiveMembers || 0}`,
      percentage: 3.9,
      trend: "up",
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      border: 'border-blue-300',
    },
    {
      icon: PiUsersFourFill,
      text: "Inactive Members",
      value: `${numbersLoading ? '...' : totalInactiveMembers || 0}`,
      percentage: -4.5,
      trend: "down",
      color: 'text-red-600',
      bg: 'bg-red-100',
      border: 'border-red-300',
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };
  

  return (
    <div className="min-h-screen w-full flex justify-center bg-gray-50">
      <div className="w-full px-5 py-7">

      {/* Welcome Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-4">
        {/* Welcome Card */}
        <Card className="lg:col-span-8 relative overflow-hidden rounded-2xl shadow-md group">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-stone-800/90 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534258936925-c58bed479fcb?q=80&w=2070')] bg-cover bg-center opacity-90 transition-all duration-500"></div>
          <div className="relative z-20 p-6">
            <div className="flex flex-col gap-6">
              <div className="space-y-3 flex flex-col justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-8 bg-blue-400 rounded-full"></div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    {getGreeting()}, {loggedInUser?.firstName}! 👋
                  </h1>
                </div>
                <p className="text-white/80 text-md font-medium max-w-2xl leading-relaxed">
                Track member activities, manage memberships, and analyze business metrics. Stay on top of your gym's operations and make data-driven decisions to drive success.
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-white text-blue-600 hover:bg-white/90 transition-all duration-300">
                  View Progress
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats Card */}
        <Card className="lg:col-span-4 relative rounded-2xl shadow-md overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800/95 via-stone-800/70 to-neutral-800/95 z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070')] bg-cover bg-center opacity-15"></div>
          <div className="relative z-20 p-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-white tracking-tight">Performance Overview</h3>
                </div>
                <div className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 cursor-pointer">
                  <MdAutorenew className="text-2xl text-white" />
                </div>
              </div>
              
              <div className="space-y-2">

                <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg hover:bg-white/15 transition-all duration-300">
                  <div className="space-y-1">
                    <p className="text-sm text-white/70 font-medium">Active Members</p>
                    <p className="text-2xl font-bold text-white tracking-tight">{totalActiveMembers || 0}</p>
                    <p className="text-xs text-blue-400">↑ 8% this week</p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <FaUsers className="text-blue-400" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg hover:bg-white/15 transition-all duration-300">
                  <div className="space-y-1">
                    <p className="text-sm text-white/70 font-medium">New Members</p>
                    <p className="text-2xl font-bold text-white tracking-tight">{newAdmissionsLength || 0}</p>
                    <p className="text-xs text-yellow-400">↑ 15% this month</p>
                  </div>
                  <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <RiUserShared2Fill className="text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

        <Card className="py-2 rounded-2xl shadow-sm mb-4 border border-gray-100">
          <div className="px-4 py-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <InfoIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Date Range Filter</h3>
                  <p className="text-sm text-gray-500">Select a custom date range to view specific data</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Current Month</span>
                </div>
                <div className="h-4 w-px bg-gray-200"></div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600">Custom Range</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <form className="flex flex-col md:flex-row items-start md:items-end gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                    Start Date
                  </Label>
                  <div className="relative">
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-10 pl-3 pr-3 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-md cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center w-8 h-10">
                  <div className="h-px w-full bg-gray-200"></div>
                </div>

                <div className="flex-1 space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                    End Date
                  </Label>
                  <div className="relative">
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="h-10 pl-3 pr-3 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-md cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    type="button"
                    variant="outline"
                    className="h-10 px-4 border-gray-200 hover:bg-gray-50"
                    onClick={() => {
                      let start = new Date();
                      start.setDate(1);
                      setStartDate(start.toISOString().split("T")[0]);
                      const end = new Date();
                      end.setDate(end.getDate() + 1);
                      setEndDate(end.toISOString().split("T")[0]);
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {gridContents.map((item) => (
            <Card
              key={item.text}
              className={`overflow-hidden rounded-2xl shadow-md border ${item.border}`}>
              <div className="p-6 py-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">{item.text}</p>
                    <div className="flex items-baseline">
                      <h3 className={`text-4xl pt-6 pb-2 text-streamline font-bold ${item.color}`}>
                        {item.value.toLocaleString()}
                      </h3>
                      <span className={`ml-2 text-sm font-medium ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                        <span className="flex items-center">
                          {item.trend === 'up' ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          {Math.abs(item.percentage)}%  This Month
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border shadow-lg">
            <BarChartMultiple />
          </Card>

          <Card className="border shadow-lg">
            <ShadSmallLineChart />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border shadow-lg">
            <RenewRadialChart />
          </Card>

          <Card className="border shadow-lg">
            <NewRadialChart />
          </Card>
        </div>

        <Card className="border shadow-lg">
          <BarChartInterActive />
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
