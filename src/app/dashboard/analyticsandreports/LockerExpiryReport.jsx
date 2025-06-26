"use client";

import Pagination from "@/components/ui/CustomPagination";
import { toast } from "sonner";
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
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";

const LockerExpiryReport = () => {
  // State initialization

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const [fromDate, setFromDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() - 7);
    return today.toISOString().split("T")[0];
  });
  const [toDate, setToDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 7);
    return today.toISOString().split("T")[0];
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Helper functions
  const calculateDaysLeft = (expireDate) => {
    if (!expireDate) return Infinity;
    const today = new Date();
    const expiry = new Date(expireDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusBadge = (expireDate) => {
    const daysLeft = calculateDaysLeft(expireDate);
    if (daysLeft < 0) {
      return <Badge variant="destructive">Expired</Badge>;
    } else if (daysLeft <= 14) {
      return <Badge variant="warning">Expiring Soon</Badge>;
    } else {
      return <Badge variant="success">Active</Badge>;
    }
  };

  const calculateSummary = (lockers) => {
    let expiringSoon = 0;
    let expired = 0;

    lockers?.forEach((locker) => {
      const daysLeft = calculateDaysLeft(locker.expireDate);
      if (daysLeft < 0) {
        expired++;
      } else if (daysLeft <= 14) {
        expiringSoon++;
      }
    });

    return { expiringSoon, expired };
  };

  // Data fetching
  const getLockersData = async ({ queryKey }) => {
    const [, fromDate, toDate, currentPage, limit] = queryKey;
    try {
      const response = await fetch(
        `http://localhost:3000/api/reports/lockerexpiryreport?fromDate=${fromDate}&toDate=${toDate}&page=${currentPage}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch locker data");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching locker data:", error);
      toast.error(error.message);
      return { lockers: [] };
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["lockersdata", fromDate, toDate, currentPage, limit],
    queryFn: getLockersData,
  });

  const { totalPages, totalLockers } = data || {};

  const lockers = data?.lockers || [];
  const { expiringSoon, expired } = calculateSummary(lockers);

  // Handlers
  const handleSendReminder = (id) => {
    console.log(`Sending reminder for locker ID: ${id}`);
    toast.success(`Reminder sent for locker ${id}`);
    // Implement actual reminder logic here
  };

  const filteredLockerData = lockers.filter((locker) => {
    if (!locker) return false;

    const searchLower = searchQuery.toLowerCase();
    return (
      locker.lockerNumber?.toString().includes(searchQuery) ||
      locker.member?.fullName?.toLowerCase().includes(searchLower) ||
      locker.member?.contactNo?.includes(searchQuery)
    );
  });

  return (
    <div className="w-full">
      <Card className="bg-white rounded-lg dark:border-none dark:bg-gray-800 dark:text-white">
        <CardHeader>
          <CardTitle>Locker Expiry Report</CardTitle>
          <CardDescription>
            View and manage locker assignments that are expiring soon or have expired
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader />
          ) : (
            <div className="w-full">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card className="bg-white rounded-lg dark:border-none shadow-md dark:bg-gray-900 dark:text-white">
                  <CardHeader className="pb-2">
                    <CardDescription>Expiring Lockers</CardDescription>
                    <CardTitle className="text-2xl text-yellow-600">
                      {expiringSoon}
                    </CardTitle>
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
                    <CardTitle className="text-2xl text-red-600">
                      {expired}
                    </CardTitle>
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
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="py-6 rounded-sm shadow-sm bg-white dark:bg-gray-900 dark:text-white dark:border-none"
                    />
                    <span className="text-sm text-muted-foreground">to</span>
                    <Input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="py-6 rounded-sm shadow-sm bg-white dark:bg-gray-900 dark:text-white dark:border-none"
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
                <Button
                  variant="outline"
                  className="bg-white rounded-sm py-6 dark:border-none shadow-sm dark:bg-gray-900 dark:text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export to PDF
                </Button>
                <Button
                  variant="outline"
                  className="bg-white rounded-sm py-6 dark:border-none shadow-sm dark:bg-gray-900 dark:text-white"
                >
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
                    {filteredLockerData.length > 0 ? (
                      filteredLockerData.map((locker) => {
                        const daysLeft = calculateDaysLeft(locker.expireDate);
                        return (
                          <TableRow key={locker._id} className="dark:border-none">
                            <TableCell className="font-medium">
                              {locker.lockerNumber} {locker.lockerSize && `(${locker.lockerSize})`}
                            </TableCell>
                            <TableCell>
                              {locker.member?.fullName || "N/A"}
                            </TableCell>
                            <TableCell>
                              {locker.member?.contactNo || "N/A"}
                            </TableCell>
                            <TableCell>
                              {formatDate(locker.renewDate)}
                            </TableCell>
                            <TableCell>
                              {formatDate(locker.expireDate)}
                            </TableCell>
                            <TableCell>
                              {daysLeft > 0 ? daysLeft : 0}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(locker.expireDate)}
                            </TableCell>
                            <TableCell className="text-right dark:border-none">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSendReminder(locker._id)}
                              >
                                <Send className="mr-2 h-4 w-4" />
                                Remind
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          No lockers found matching your criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-end p-4 border-t dark:border-none">
                <Pagination
                  total={totalPages}
                  page={currentPage}
                  onChange={setCurrentPage}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LockerExpiryReport;