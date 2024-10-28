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
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {

  const getTotalMembers = async () => {
    try {
      const response = await fetch(`http://88.198.112.156:3000/api/members`);
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

  const { totalMembers, totalActiveMembers, totalInactiveMembers, dailyAverageActiveMembers, membersRenewedThisWeek } = data || {};

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
      value: membersRenewedThisWeek || "Null",
      color: 'text-green-600',
      bg: 'bg-green-200'
    },
    {
      icon: RiUserShared2Fill,
      text: "New Admission",
      value: '75',
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

  const barChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [{
      label: 'Monthly New Admissions',
      data: [50, 60, 70, 80, 90, 100],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  const lineChartData = {
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    datasets: [{
      label: 'Daily Active Members',
      data: [10, 20, 30, 40, 50, 60, 70],
      borderColor: 'rgba(54, 162, 235, 1)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      fill: true
    }]
  };

  const pieChartData = {
    labels: ['Active Members', 'Inactive Members'],
    datasets: [{
      data: [totalActiveMembers || 0, totalInactiveMembers || 0],
      backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)']
    }]
  };

  const doughnutChartData = {
    labels: ['Renewed Members', 'New Admissions'],
    datasets: [{
      data: [membersRenewedThisWeek || 0, 75],
      backgroundColor: ['rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)']
    }]
  };

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <Doughnut data={doughnutChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
