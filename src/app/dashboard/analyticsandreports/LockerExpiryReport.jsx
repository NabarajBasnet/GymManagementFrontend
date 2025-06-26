"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Download, Search, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const LockerExpiryReport = () => {

  const [fromDate, setFromDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() - 7);
    return today.toISOString().split("T")[0];
  })
  const [toDate, setToDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 7);
    return today.toISOString().split("T")[0];
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Sample data
  const lockerData = [
    {
      id: 1,
      number: "L-101",
      member: "John Doe",
      contact: "+1 555-123-4567",
      startDate: "2023-06-01",
      expiryDate: "2023-12-01",
      daysLeft: 5,
      status: "expiring",
    },
    {
      id: 2,
      number: "L-205",
      member: "Sarah Williams",
      contact: "+1 555-789-0123",
      startDate: "2023-09-01",
      expiryDate: "2023-11-15",
      daysLeft: -3,
      status: "expired",
    },
    {
      id: 3,
      number: "L-302",
      member: "Mike Johnson",
      contact: "+1 555-456-7890",
      startDate: "2023-10-01",
      expiryDate: "2024-01-01",
      daysLeft: 45,
      status: "active",
    },
    {
      id: 4,
      number: "L-410",
      member: "Emily Chen",
      contact: "+1 555-321-6547",
      startDate: "2023-08-15",
      expiryDate: "2023-12-15",
      daysLeft: 10,
      status: "expiring",
    },
  ];

  const getStatusBadge = (status, daysLeft) => {
    if (status === "expired" || daysLeft < 0) {
      return <Badge variant="destructive">Expired</Badge>;
    } else if (status === "expiring" || daysLeft <= 14) {
      return <Badge variant="warning">Expiring Soon</Badge>;
    } else {
      return <Badge variant="success">Active</Badge>;
    }
  };

  const handleSendReminder = (id) => {
    console.log(`Sending reminder for locker ID: ${id}`);
    // Implement actual reminder logic here
  };

  const filteredLockerData = lockerData.filter((locker) => {
    const matchesSearch =
      locker.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      locker.member.toLowerCase().includes(searchQuery.toLowerCase()) ||
      locker.contact.includes(searchQuery);
    return matchesSearch;
  });

  return (
    <div className="w-full">
      <Card className="bg-white rounded-lg dark:border-none shadow-xl dark:bg-gray-800 dark:text-white">
        <CardHeader>
          <CardTitle>Locker Expiry Report</CardTitle>
          <CardDescription>
            View and manage locker assignments that are expiring soon or have expired
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-white rounded-lg dark:border-none shadow-md dark:bg-gray-900 dark:text-white">
              <CardHeader className="pb-2">
                <CardDescription>Expiring Lockers</CardDescription>
                <CardTitle className="text-2xl text-yellow-600">5</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Will expire within 14 days
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white rounded-lg dark:border-none shadow-md dark:bg-gray-900 dark:text-white">
              <CardHeader className="pb-2">
                <CardDescription>Expired Lockers</CardDescription>
                <CardTitle className="text-2xl text-red-600">2</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Past expiration date
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="col-span-1 md:col-span-2 space-y-1">
              <label className="text-sm font-medium leading-none">
                Date Range
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type='date'
                  value={new Date(fromDate).toISOString().split("T")[0]}
                  onChange={(e) => setFromDate(new Date(e.target.value).toISOString().split("T")[0])}
                  className='py-6 rounded-sm shadow-sm bg-white dark:bg-gray-900 dark:text-white dark:border-none'
                />
                <span className="text-sm text-muted-foreground">to</span>
                <Input
                  type='date'
                  value={new Date(toDate).toISOString().split("T")[0]}
                  onChange={(e) => setToDate(new Date(e.target.value).toISOString().split("T")[0])}
                  className='py-6 rounded-sm shadow-sm bg-white dark:bg-gray-900 dark:text-white dark:border-none'
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Locker number or member"
                  className="pl-9 py-6 bg-white rounded-sm dark:border-none shadow-sm dark:bg-gray-900 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex justify-end gap-2 mb-4">
            <Button variant="outline" className="bg-white rounded-sm py-6 dark:border-none shadow-sm dark:bg-gray-900 dark:text-white">
              <Download className="mr-2 h-4 w-4" />
              Export to PDF
            </Button>
            <Button variant="outline" className="bg-white rounded-sm py-6 dark:border-none shadow-sm dark:bg-gray-900 dark:text-white">
              <Download className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
          </div>

          {/* Data Table */}
          <div className="rounded-md border">
            <Table className="rounded-lg dark:border-none shadow-md dark:text-white">
              <TableHeader className="dark:border-none">
                <TableRow className="dark:border-none">
                  <TableHead>Locker Number</TableHead>
                  <TableHead>Assigned Member</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Days Left</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="dark:border-none">
                {filteredLockerData.map((locker) => (
                  <TableRow key={locker.id} className="dark:border-none">
                    <TableCell className="font-medium">{locker.number}</TableCell>
                    <TableCell>{locker.member}</TableCell>
                    <TableCell>{locker.contact}</TableCell>
                    <TableCell>{locker.startDate}</TableCell>
                    <TableCell>{locker.expiryDate}</TableCell>
                    <TableCell>
                      {locker.daysLeft > 0 ? locker.daysLeft : 0}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(locker.status, locker.daysLeft)}
                    </TableCell>
                    <TableCell className="text-right dark:border-none">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSendReminder(locker.id)}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Remind
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t dark:border-none">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">10</span> of{" "}
              <span className="font-medium">100</span> entries
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-white rounded-lg dark:border-none shadow-md dark:bg-gray-900 dark:text-white">
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-white rounded-lg dark:border-none shadow-md dark:bg-gray-900 dark:text-white">
                1
              </Button>
              <Button variant="outline" size="sm" className="bg-white rounded-lg dark:border-none shadow-md dark:bg-gray-900 dark:text-white">
                2
              </Button>
              <Button variant="outline" size="sm" className="bg-white rounded-lg dark:border-none shadow-md dark:bg-gray-900 dark:text-white">
                3
              </Button>
              <Button variant="outline" size="sm" className="bg-white rounded-lg dark:border-none shadow-md dark:bg-gray-900 dark:text-white">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LockerExpiryReport;