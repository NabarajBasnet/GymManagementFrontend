'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HiMiniUsers } from "react-icons/hi2";
import { MdAutorenew } from "react-icons/md";
import { RiExchange2Line } from "react-icons/ri";
import { GiBiceps } from "react-icons/gi";
import { FaUsers } from "react-icons/fa6";
import { PiUsersFourFill } from "react-icons/pi";
import { RiUserShared2Fill } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";

const AdminDashboard = () => {

  const getTotalMembers = async () => {
    try {
      const response = await fetch(`https://revivefitnessapi.getinshapewithshreejan.com/api/members`);
      const responseBody = await response.json();
      return responseBody;
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const { data } = useQuery({
    queryKey: ['membersLength'],
    queryFn: getTotalMembers
  });

  const { totalMembers, totalActiveMembers, totalInactiveMembers, dailyAverageActiveMembers } = data || {};

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
    { month: "July", desktop: 214, mobile: 140 },
    { month: "August", desktop: 214, mobile: 140 },
    { month: "September", desktop: 214, mobile: 140 },
    { month: "October", desktop: 214, mobile: 140 },
    { month: "November", desktop: 214, mobile: 140 },
    { month: "December", desktop: 214, mobile: 140 },
  ];

  const chartConfig = {
    desktop: {
      label: "Active",
      color: "#fbbf24"
    },
    mobile: {
      label: "Inactive",
      color: "#dc2626",
    },
  };

  const chartData2 = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
    { month: "July", desktop: 250, mobile: 145 },
    { month: "August", desktop: 232, mobile: 130 },
    { month: "September", desktop: 190, mobile: 150 },
    { month: "October", desktop: 205, mobile: 160 },
    { month: "November", desktop: 220, mobile: 140 },
    { month: "December", desktop: 234, mobile: 175 },
  ];

  const chartConfig2 = {
    desktop: {
      label: "New Admission",
      color: "#22c55e",
    },
    mobile: {
      label: "Renew",
      color: "#2563eb",
    },
  };

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
      value: '400',
      color: 'text-green-600',
      bg: 'bg-green-200'
    }, {
      icon: RiUserShared2Fill,
      text: "New Admission",
      value: '75',
      color: 'text-yellow-600',
      bg: 'bg-yellow-200'
    }, {
      icon: GiBiceps,
      text: "Active",
      value: totalActiveMembers,
      color: 'text-green-600',
      bg: 'bg-green-200'
    }, {
      icon: FaUsers,
      text: "Average Active",
      value: dailyAverageActiveMembers,
      color: 'text-blue-600',
      bg: 'bg-blue-200'
    }, {
      icon: PiUsersFourFill,
      text: "Inactive",
      value: totalInactiveMembers,
      color: 'text-red-600',
      bg: 'bg-red-200'
    },
  ];

  return (
    <div className="w-full">
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
                    <span className="sr-only">Toggle menu</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem>Documentation</DropdownMenuItem>
                    <DropdownMenuItem>Themes</DropdownMenuItem>
                    <DropdownMenuItem>GitHub</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/docs/components">Components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-xl font-bold">Home</h1>
        </div>

        <div className="w-full py-5">
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5">
            {
              gridContents.map((grid) => (
                <div key={grid.value} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl">
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
              ))
            }
          </div>
        </div>

        <div className="w-full bg-white py-5 rounded-lg">
          <div className="w-full md:flex justify-start">
            <ChartContainer config={chartConfig2} className="min-h-[200px] md:w-6/12 w-full px-4">
              <BarChart accessibilityLayer data={chartData2}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
              </BarChart>
            </ChartContainer>
            <div />

            <div className="w-full flex justify-start">
              <ChartContainer config={chartConfig} className="min-h-[200px] md:w-6/12 w-full px-4">
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                  <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard;
