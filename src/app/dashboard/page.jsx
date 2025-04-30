'use client';

import * as React from 'react';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { usePagination } from "@/hooks/Pagination";
import Pagination from "@/components/ui/CustomPagination";

const AdminDashboard = () => {
  const router = useRouter();
  const [averageActiveMembers, setAverageActiveMembers] = React.useState(null);
  const [data, setData] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const limit = 3;

  const [startDate, setStartDate] = React.useState(() => {
    let start = new Date();
    start.setDate(1);
    return start.toISOString().split("T")[0];
  });

  const [endDate, setEndDate] = React.useState(() =>
    new Date().toISOString().split("T")[0]
  );

  const getTotalMembers = async () => {
    try {
      const response = await fetch(
        `https://gymmanagementbackend-o2l3.onrender.com/api/members?startDate=${startDate}&endDate=${endDate}&limit=${limit}&page=${currentPage}`
      );
      const responseBody = await response.json();
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
      const response = await fetch('https://gymmanagementbackend-o2l3.onrender.com/api/averageactivemembers');
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

  const { range, setPage, active } = usePagination({
    total: totalPages || 1,
    siblings: 1,
    boundaries: 1,
    page: currentPage,
    onChange: (page) => setCurrentPage(page),
  });

  const gridContents = [
    {
      icon: FaUsers,
      text: "Total Membership",
      value: totalMembers || 0,
      percentage: 1.1,
      trend: "up",
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      border: 'border-blue-300',
    },
    {
      icon: MdAutorenew,
      text: "Renewals",
      value: renewdMembersLength || 0,
      percentage: -1.5,
      trend: "down",
      color: 'text-green-600',
      bg: 'bg-green-100',
      border: 'border-green-300',
    },
    {
      icon: RiUserShared2Fill,
      text: "New Admissions",
      value: newAdmissionsLength || 0,
      percentage: 0.5,
      trend: "up",
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
      border: 'border-yellow-300',
    },
    {
      icon: GiBiceps,
      text: "Active Members",
      value: totalActiveMembers || 0,
      percentage: -0.2,
      trend: "down",
      color: 'text-green-600',
      bg: 'bg-green-100',
      border: 'border-green-300',
    },
    {
      icon: FaUsers,
      text: "Average Active",
      value: averageActiveMembers || 0,
      percentage: 3.9,
      trend: "up",
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      border: 'border-blue-300',
    },
    {
      icon: PiUsersFourFill,
      text: "Inactive Members",
      value: totalInactiveMembers || 0,
      percentage: -4.5,
      trend: "down",
      color: 'text-red-600',
      bg: 'bg-red-100',
      border: 'border-red-300',
    },
  ];

  return (
    <div className="min-h-screen w-full flex justify-center bg-gray-50/50">
      <div className="w-full md:mx-4 px-4 py-8">
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                  </DropdownMenuTrigger>
                </DropdownMenu>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink className="font-semibold">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <Alert className="bg-blue-50 border-blue-100">
          <InfoIcon className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            Showing data from the beginning of the current month. Adjust dates below to view different periods.
          </AlertDescription>
        </Alert>

        <Card className="py-6 mb-8">
          <form className="flex justify-between px-4 md:justify-start flex-wrap gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="startDate" className="font-medium text-gray-700">
                From
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="endDate" className="font-medium text-gray-700">
                To
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="cursor-pointer"
              />
            </div>
          </form>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {gridContents.map((item) => (
            <Card
              key={item.text}
              className={`overflow-hidden border ${item.border}`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">{item.text}</p>
                    <div className="flex items-baseline">
                      <h3 className={`text-3xl font-bold ${item.color}`}>
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
            <h3 className="text-lg font-semibold p-2 text-gray-800">Monthly Membership Activity</h3>
            <BarChartMultiple />
          </Card>

          <Card className="border shadow-lg">
            <h3 className="text-lg font-semibold p-2 text-gray-800">Monthly New Members</h3>
            <ShadSmallLineChart />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border shadow-lg">
            <h3 className="text-lg font-semibold p-2 text-gray-800">Membership Renewls</h3>
            <RenewRadialChart />
          </Card>

          <Card className="border shadow-lg">
            <h3 className="text-lg font-semibold p-2 text-gray-800">New Members</h3>
            <NewRadialChart />
          </Card>
        </div>

        <Card className="border shadow-lg">
          <h3 className="text-lg font-semibold p-2 text-gray-800">Membership Traffic</h3>
          <BarChartInterActive />
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
