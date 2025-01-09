'use client';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as React from 'react';
import { MdAutorenew } from "react-icons/md";
import { GiBiceps } from "react-icons/gi";
import { FaUsers } from "react-icons/fa6";
import { PiUsersFourFill } from "react-icons/pi";
import { RiUserShared2Fill } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BarChartMultiple } from "@/components/Charts/BarChart";
import { BarChartInterActive } from "@/components/Charts/barChartInteractive";
import { RadialChart } from "@/components/Charts/radialChart";
import { LineChartShad } from "@/components/Charts/LineChart";
import { AreaChartShad } from "@/components/Charts/areaChart";
import { ShadSmallLineChart } from "@/components/Charts/ShadSmallLineChart";
import { RenewRadialChart } from "@/components/Charts/renewRadialChart";
import { usePagination } from "@/hooks/Pagination";

const AdminDashboard = () => {

  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 3;
  const [startDate, setStartDate] = useState(() => {
    const startDate = new Date();
    const calculatedStartYear = startDate.getFullYear();
    startDate.setFullYear(calculatedStartYear, 0, 1);
    return startDate;
  });

  const [endDate, setEndDate] = useState(new Date());

  const getTotalMembers = async () => {
    try {
      const response = await fetch(`http://88.198.112.156:5000/api/members?startDate=${startDate}&endDate=${endDate}&limit=${limit}&page=${currentPage}`);
      const responseBody = await response.json();
      if (responseBody.redirect) {
        router.push(responseBody.redirect);
      };
      return responseBody;
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const { data } = useQuery({
    queryKey: ['membersLength'],
    queryFn: getTotalMembers
  });

  const {
    members,
    totalMembers,
    totalPages,
    inactiveMembers,
    totalActiveMembers,
    totalInactiveMembers,
    dailyAverageActiveMembers,
    renewdMembers,
    renewdMembersLength,
    newAdmissions,
    newAdmissionsLength
  } = data || {};

  const { range, setPage, active } = usePagination({
    total: totalPages ? totalPages : 1,
    siblings: 1,
    boundaries: 1,
    page: currentPage,
    onChange: (page) => {
      setCurrentPage(page);
    },
  });

  // React.useEffect(() => {
  //   getTotalMembers()
  // }, [startDate, endDate]);

  const gridContents = [
    {
      icon: FaUsers,
      text: "Total Membership",
      value: totalMembers,
      color: 'text-blue-600',
      bg: 'bg-blue-200'
    },
    {
      icon: MdAutorenew,
      text: "Renew",
      value: renewdMembersLength,
      color: 'text-green-600',
      bg: 'bg-green-200'
    },
    {
      icon: RiUserShared2Fill,
      text: "New Admission",
      value: newAdmissionsLength,
      color: 'text-yellow-600',
      bg: 'bg-yellow-200'
    },
    {
      icon: GiBiceps,
      text: "Active",
      value: totalActiveMembers,
      color: 'text-green-600',
      bg: 'bg-green-200'
    },
    {
      icon: FaUsers,
      text: "Average Active",
      value: dailyAverageActiveMembers,
      color: 'text-blue-600',
      bg: 'bg-blue-200'
    },
    {
      icon: PiUsersFourFill,
      text: "Inactive",
      value: totalInactiveMembers,
      color: 'text-red-600',
      bg: 'bg-red-200'
    },
  ];

  return (
    <div className="w-full bg-gray-100">
      <div className="w-full p-6">
        <div className="w-full">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
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
                <BreadcrumbLink>Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>

        <div className="mt-4 mb-2 flex items-center space-x-4">
          <p className="font-semibold text-green-600">Note:</p>
          <p className="font-semibold text-red-600 text-sm mt-1">Default Date will be Jan 1, Change in field to override</p>
        </div>

        <form className="flex items-center space-x-4">
          <div className="flex flex-col">
            <label className="font-bold">From</label>
            <input
              type='date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder='From'
              className="bg-gray-50 border py-1 px-3 rounded-md focus:outline-none cursor-pointer"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold">To</label>
            <input
              type='date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder='To'
              className="bg-gray-50 border py-1 px-3 rounded-md focus:outline-none cursor-pointer"
            />
          </div>
        </form>

        <div className="w-full py-5">
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5">
            {gridContents.map((grid) => (
              <div key={grid.text} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl">
                <div className="flex items-center">
                  <div className={`${grid.bg} p-2 rounded-full`}>
                    <grid.icon className={`text-4xl ${grid.color}`} />
                  </div>
                  <div className="px-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-500">{grid.text}</p>
                      {/* <p className="text-sm font-semibold text-gray-500">{'Last Month'}</p> */}
                    </div>
                    <div className='flex items-center justify-between'>
                      <h1 className={`text-3xl font-bold ${grid.color}`}>{grid.value}</h1>
                      {/* <h1 className={`text-3xl font-bold ${grid.color}`}>{grid.value}</h1> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full space-y-6">
          <div className="w-full items-center space-y-6">
            <BarChartMultiple />
            <ShadSmallLineChart />
          </div>
          <BarChartInterActive />

          <div className="w-full md:flex items-center space-y-6 md:space-y-0 md:space-x-6">
            <div className="w-full rounded-lg bg-white">
              <RenewRadialChart />
            </div>
            <div className="w-full rounded-lg bg-white">
              <RadialChart />
            </div>
          </div>

          <div className="w-full space-y-6">
            <AreaChartShad />
            <LineChartShad />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
