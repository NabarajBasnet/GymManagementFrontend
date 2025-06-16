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
    const response = await fetch(`http://localhost:3000/api/org-members/by-branch`);
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
      const response = await fetch(`http://localhost:3000/api/memberanalytics/newmembers?startDate=${startDate}&endDate=${endDate}`);
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

  console.log(newMembers);

  // Sample data
  const promotions = [
    {
      id: 1,
      name: "New Year Discount",
      discount: "20%",
      startDate: "2024-01-01",
      endDate: "2024-01-15",
      signups: 50,
      status: "completed"
    },
    {
      id: 2,
      name: "Summer Special",
      discount: "15%",
      startDate: "2024-06-01",
      endDate: "2024-06-30",
      signups: 30,
      status: "active"
    },
    {
      id: 3,
      name: "Black Friday Deal",
      discount: "30%",
      startDate: "2023-11-24",
      endDate: "2023-11-30",
      signups: 75,
      status: "completed"
    }
  ];

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
            <div className="text-2xl font-bold">{totalMembers?totalMembers:0}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-lg dark:border-none shadow-xl dark:bg-gray-800 dark:text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Registrations</CardTitle>
            <FaCalendarAlt className="h-4 w-4 text-muted-foreground text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newMembers?.members.length}</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-lg dark:border-none shadow-xl dark:bg-gray-800 dark:text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <FaChartLine className="h-4 w-4 text-muted-foreground text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
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
        <Card className="h-[350px] bg-white rounded-lg dark:border-none shadow-xl dark:bg-gray-800 dark:text-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaChartPie className="mr-2 text-primary" /> Member Growth
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-60px)] flex items-center justify-center">
            <div className="text-muted-foreground text-center">
              <p>Member growth chart visualization</p>
              <p className="text-sm">(Monthly new members and churn rate)</p>
            </div>
          </CardContent>
        </Card>
        <Card className="h-[350px] bg-white rounded-lg dark:border-none shadow-xl dark:bg-gray-800 dark:text-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaChartPie className="mr-2 text-primary" /> Attendance Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-60px)] flex items-center justify-center">
            <div className="text-muted-foreground text-center">
              <p>Attendance trends visualization</p>
              <p className="text-sm">(Peak hours and daily/weekly patterns)</p>
            </div>
          </CardContent>
        </Card>
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
                {newMembers?.members.map((member) => (
                <TableRow key={member.id} className="dark:border-none">
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