"use client";

import { FaUsers, FaChartLine, FaDollarSign, FaFileDownload, FaChartPie, FaCalendarAlt } from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/components/Providers/LoggedInUserProvider"
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import NewMemberGrowthChart from "./DashboardsChartOne";
import ChartPieStacked from "./DashboardsChartTwo";

const AnalyticsDashboard = () => {

  const [startDate, setStartDate] = useState(() => {
    let start = new Date();
    start.setDate(0);
    return start.toISOString().split("T")[0];
  });

  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  });

  const {user} = useUser();
  const loggedInuser = user?.user;

const getTotalMembers = async()=>{
  try{
    const response = await fetch(`http://88.198.112.156:3100/api/org-members/by-branch`);
    const responseBody = await response.json();
return  responseBody;
  }catch(error){
    console.log("Error: ",error);
  }
};

const {data} = useQuery({
  queryKey: ["total-members"],
  queryFn: getTotalMembers,
  staleTime: 1000 * 60 * 5,
  refetchOnWindowFocus: true,
  refetchOnMount: true,
  refetchOnReconnect: true,
  refetchInterval: 1000 * 60 * 5,
  enabled: !!loggedInuser,
})

  
  const {members, totalMembers} = data || {};

  const getNewMembers = async()=>{
    try{
      const response = await fetch(`http://88.198.112.156:3100/api/memberanalytics/newmembers?startDate=${startDate}&endDate=${endDate}`);
      const resBody = await response.json();
      return resBody;
    }catch(error){
      console.log("Error: ",error);
    }
  }

  const {data:newMembers} = useQuery({
    queryKey:['newmembers'],
    queryFn:getNewMembers
  });

  const getNewMembersGrowthPercentage = async()=>{
    try{
      const response = await fetch(`http://88.198.112.156:3100/api/graphdata/newmembers`);
      const resBody = await response.json();
      return resBody;
    }catch(error){
      console.log("Error: ",error);
    }
  }

  const {data:newMembersGrowthPercentageData} = useQuery({
    queryKey:['newmembersgrowthpercentage'],
    queryFn:getNewMembersGrowthPercentage
  });

  const {  newMembers: months,
    growthPercentage:newMembersGrowthPercentage,
    currentCount,
    previousCount, } = newMembersGrowthPercentageData || {};

  const getMemberAttendance = async () => {
    try {
        const response = await fetch("http://88.198.112.156:3100/api/graphdata/memberattendance")
        if (!response.ok) throw new Error("Network response was not ok")
        const data = await response.json()
        return data;
    } catch (error) {
        console.error("Error fetching attendance data:", error)
        return []
    }
}

  const { data: attendancesData } = useQuery({
    queryKey: ["memberAttendance"],
    queryFn: getMemberAttendance,
  })

  const {memberAttendance, growthPercentage} = attendancesData || {};

  const getActiveInactiveMembers = async () => {
    try {
      const response = await fetch("http://88.198.112.156:3100/api/graphdata/activeinactivemembers")
      if (!response.ok) throw new Error("Network response was not ok")
      const data = await response.json()
      return data;
    } catch (error) {
      console.error("Error fetching data:", error)
      return []
    }
  }

  const { data: activeInactiveMembersData = [], isLoading } = useQuery({
    queryKey: ["activeinactivemembers"],
    queryFn: getActiveInactiveMembers,
  })

  const { activeInactiveMembers,currentMonthStats, previousMonthStats, growth  } = activeInactiveMembersData || {};

  const getStatusBadge = (status) => {
    if (status === "Active") {
      return <Badge variant="green">Active</Badge>;
    } else {
      return <Badge variant="destructive">Inactive</Badge>;
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <Card className="mb-6 rounded-lg dark:border-none shadow-md dark:bg-gray-800 dark:text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center">
              <FaChartLine className="mr-2 text-primary" /> Analytics & Reports
            </CardTitle>
            <CardDescription>Comprehensive overview of your gym performance</CardDescription>
          </div>
          <Button>
            <FaFileDownload className="mr-2" /> Download Reports
          </Button>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="bg-white rounded-lg dark:border-none shadow-xl dark:bg-gray-800 dark:text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <FaUsers className="h-4 w-4 text-muted-foreground text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeInactiveMembers?activeInactiveMembers.length:0}</div>
            <p className="text-xs text-muted-foreground">+{growth?growth.activeMembersGrowth:0}% </p>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-lg dark:border-none shadow-xl dark:bg-gray-800 dark:text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Registrations</CardTitle>
            <FaCalendarAlt className="h-4 w-4 text-muted-foreground text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentCount?currentCount:0}</div>
            <p className="text-xs text-muted-foreground">+{newMembersGrowthPercentage?newMembersGrowthPercentage:0}% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-lg dark:border-none shadow-xl dark:bg-gray-800 dark:text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <FaChartLine className="h-4 w-4 text-muted-foreground text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{growthPercentage?growthPercentage:0}%</div>
            <p className="text-xs text-muted-foreground">{growthPercentage?growthPercentage:0}% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-lg dark:border-none shadow-xl dark:bg-gray-800 dark:text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <FaDollarSign className="h-4 w-4 text-muted-foreground text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NPR 1,50,000</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <NewMemberGrowthChart />
        <ChartPieStacked />
      </div>

      {/* Promotion Performance Table */}
      <Card className="bg-white rounded-lg dark:border-none shadow-xl dark:bg-gray-800 dark:text-white">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FaChartLine className="mr-2 text-primary" /> New Member Signups
          </CardTitle>
          <CardDescription>New member signups</CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="rounded-lg dark:border-none shadow-md dark:text-white">
            <TableHeader className="dark:border-none">
              <TableRow className="dark:border-none">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>DOB</TableHead>
                <TableHead>Signup Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Paid Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="dark:border-none">
                {newMembers?.members?.map((member) => (
                <TableRow key={member?.id} className="dark:border-none">
                  <TableCell className="font-medium">{member.member.fullName}</TableCell>
                  <TableCell>{member.member.email}</TableCell>
                    <TableCell>{member.member.contactNo}</TableCell>
                  <TableCell>{new Date(member.member.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                  <TableCell>{new Date(member.member.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                  <TableCell className="dark:border-none">{getStatusBadge(member.member.status)}</TableCell>
                  <TableCell className="font-medium text-center"> {loggedInuser?.organization?.currency} - {member.member.paidAmmount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;