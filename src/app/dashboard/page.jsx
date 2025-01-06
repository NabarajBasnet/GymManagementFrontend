'use client';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
];

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

const AdminDashboard = () => {

  const router = useRouter();

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(null);

  React.useEffect(() => {
    const startDate = new Date();
    const calculatedStartYear = startDate.getFullYear() - 1;
    startDate.setFullYear(calculatedStartYear);
    startDate.setMonth(0);
    startDate.setDate(0+1);
    console.log('Calculated Date: ', startDate);
  }, []);

  const getTotalMembers = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/members`);
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

  const { members,
    totalMembers,
    totalPages,
    inactiveMembers,
    totalActiveMembers,
    totalInactiveMembers,
    dailyAverageActiveMembers,
    renewdMembers,
    renewdMembersLength,
    newAdmissions,
    newAdmissionsLength } = data || {};

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
                    <grid.icon className={`text-5xl ${grid.color}`} />
                  </div>
                  <div className="px-4">
                    <p className="text-sm font-semibold text-gray-500">{grid.text}</p>
                    <h1 className={`text-3xl font-bold ${grid.color}`}>{grid.value}</h1>
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
            <div className="w-full bg-white py-5 rounded-lg">
              <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.invoice}>
                      <TableCell className="font-medium">{invoice.invoice}</TableCell>
                      <TableCell>{invoice.paymentStatus}</TableCell>
                      <TableCell>{invoice.paymentMethod}</TableCell>
                      <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">$2,500.00</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
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
