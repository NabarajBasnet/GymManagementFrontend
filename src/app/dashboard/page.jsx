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
      const response = await fetch(`http://localhost:3000/api/members?startDate=${startDate}&endDate=${endDate}&limit=${limit}&page=${currentPage}`);
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

  const gridContents = [
    {
      icon: FaUsers,
      text: "Total Membership",
      value: totalMembers,
      percentage: 1.1,
      color: 'text-blue-600',
      bg: 'bg-blue-200',
    },
    {
      icon: MdAutorenew,
      text: "Renew",
      value: renewdMembersLength,
      percentage: -1.5,
      color: 'text-green-600',
      bg: 'bg-green-200',
    },
    {
      icon: RiUserShared2Fill,
      text: "New Admission",
      value: newAdmissionsLength,
      percentage: +0.5,
      color: 'text-yellow-600',
      bg: 'bg-yellow-200',
    },
    {
      icon: GiBiceps,
      text: "Active",
      value: totalActiveMembers,
      percentage: -0.2,
      color: 'text-green-600',
      bg: 'bg-green-200',
    },
    {
      icon: FaUsers,
      text: "Average Active",
      value: dailyAverageActiveMembers,
      percentage: +3.9,
      color: 'text-blue-600',
      bg: 'bg-blue-200',
    },
    {
      icon: PiUsersFourFill,
      text: "Inactive",
      value: totalInactiveMembers,
      percentage: -4.5,
      color: 'text-red-600',
      bg: 'bg-red-200',
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {gridContents.map((grid) => (
              <div
                key={grid.text}
                className="bg-white py-3 px-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-between items-center">
                  {/* Content Section */}
                  <div>
                    <p className="text-md font-bold text-gray-800">{grid.text}</p>
                    <h1 className={`text-4xl my-1 font-bold ${grid.color}`}>
                      {grid.value}
                    </h1>
                    {/* <p
                      className={`text-xs font-medium mt-1 px-1 py-0.5 rounded-full inline-block ${grid.percentage > 0
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                        }`}
                      style={{ lineHeight: '1.2rem', width: 'fit-content' }}
                    >
                      {grid.percentage > 0 ? `+${grid.percentage}%` : `${grid.percentage}%`}
                    </p> */}
                  </div>
                  {/* Icon Section */}
                  <div
                    className={`p-3 rounded-full flex items-center justify-center ${grid.bg}`}
                  >
                    <grid.icon className={`text-4xl ${grid.color}`} />
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
