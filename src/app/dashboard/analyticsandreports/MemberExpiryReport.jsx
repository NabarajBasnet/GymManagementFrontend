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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Download, Search, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

const MemberExpiryReport = () => {
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Sample data
  const memberData = [
    {
      id: 1,
      name: "John Doe",
      contact: "+1 555-123-4567",
      plan: "Premium Annual",
      startDate: "2023-01-15",
      expiryDate: "2024-01-15",
      daysLeft: 15,
      status: "expiring",
    },
    {
      id: 2,
      name: "Jane Smith",
      contact: "+1 555-987-6543",
      plan: "Basic Monthly",
      startDate: "2023-11-01",
      expiryDate: "2023-12-01",
      daysLeft: -5,
      status: "expired",
    },
    {
      id: 3,
      name: "Mike Johnson",
      contact: "+1 555-456-7890",
      plan: "Standard Quarterly",
      startDate: "2023-09-01",
      expiryDate: "2023-12-01",
      daysLeft: 10,
      status: "expiring",
    },
    {
      id: 4,
      name: "Sarah Williams",
      contact: "+1 555-789-0123",
      plan: "Premium Annual",
      startDate: "2023-03-15",
      expiryDate: "2024-03-15",
      daysLeft: 90,
      status: "active",
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
    console.log(`Sending reminder for member ID: ${id}`);
    // Implement actual reminder logic here
  };

  const filteredMemberData = memberData.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.contact.includes(searchQuery);
    return matchesSearch;
  });

  return (
    <div className="w-full bg-transparent">
      <div className="bg-transparent rounded-lg space-y-4 border-none dark:text-white">
        <Card className="rounded-lg dark:border-none shadow-md dark:bg-gray-800 dark:text-white p-4">
          <CardTitle>Member Expiry Report</CardTitle>
          <CardDescription className="text-sm mt-4">
            View and manage memberships that are expiring soon or have expired. By default reports will be generated daily.
          </CardDescription>
        </Card>

        <Card className="rounded-lg dark:border-none shadow-md dark:bg-gray-800 dark:text-white p-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-white rounded-lg dark:border-none shadow-md dark:bg-gray-900 dark:text-white">
              <CardHeader className="pb-2">
                <CardDescription>Expiring Members</CardDescription>
                <CardTitle className="text-2xl text-yellow-600">12</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Will expire within 14 days
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white rounded-lg dark:border-none shadow-md dark:bg-gray-900 dark:text-white">
              <CardHeader className="pb-2">
                <CardDescription>Expired Members</CardDescription>
                <CardTitle className="text-2xl text-red-600">3</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Past expiration date
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="col-span-1 md:col-span-2 space-y-1">
              <label className="text-sm font-medium leading-none">
                Date Range
              </label>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild className="bg-white rounded-lg dark:border-none shadow-md dark:bg-gray-900 dark:text-white">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        format(dateRange.from, "PPP")
                      ) : (
                        <span>From</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) =>
                        setDateRange({ ...dateRange, from: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <span className="text-sm text-muted-foreground">to</span>
                <Popover>
                  <PopoverTrigger asChild className="bg-white rounded-lg dark:border-none shadow-md dark:bg-gray-900 dark:text-white">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to ? (
                        format(dateRange.to, "PPP")
                      ) : (
                        <span>To</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) =>
                        setDateRange({ ...dateRange, to: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">Branch</label>
              <Select
                value={selectedBranch}
                onValueChange={setSelectedBranch}
              >
                <SelectTrigger className="bg-white rounded-lg dark:border-none shadow-md dark:bg-gray-900 dark:text-white">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-lg dark:border-none shadow-md dark:bg-gray-900 dark:text-white">
                  <SelectItem value="all" className="dark:text-white cursor-pointer">All Branches</SelectItem>
                  <SelectItem value="downtown" className="dark:text-white cursor-pointer">Downtown</SelectItem>
                  <SelectItem value="uptown" className="dark:text-white cursor-pointer">Uptown</SelectItem>
                  <SelectItem value="westside" className="dark:text-white cursor-pointer">Westside</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">Status</label>
              <Select
                value={selectedStatus}
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger className="bg-white rounded-lg dark:border-none shadow-md dark:bg-gray-900 dark:text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-lg dark:border-none shadow-md dark:bg-gray-900 dark:text-white">
                  <SelectItem value="all" className="dark:text-white cursor-pointer">All Status</SelectItem>
                  <SelectItem value="Expired" className="dark:text-white cursor-pointer">Expired</SelectItem>
                  <SelectItem value="Expiring" className="dark:text-white cursor-pointer">Expiring</SelectItem>
                  <SelectItem value="Active" className="dark:text-white cursor-pointer">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Member name or phone"
                  className="pl-9 bg-white rounded-lg dark:border-none shadow-md dark:bg-gray-900 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex justify-end gap-2 mb-4">
            <Button variant="outline" className="bg-white rounded-lg dark:border-none shadow-md dark:bg-gray-900 dark:text-white">
              <Download className="mr-2 h-4 w-4" />
              Export to PDF
            </Button>
            <Button variant="outline" className="bg-white rounded-lg dark:border-none shadow-md dark:bg-gray-900 dark:text-white">
              <Download className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
          </div>

          {/* Data Table */}
          <div className="rounded-md border">
            <Table className="rounded-lg dark:border-none shadow-md dark:text-white">
              <TableHeader className="dark:border-none">
                <TableRow className="dark:border-none">
                  <TableHead>Member Name</TableHead>
                  <TableHead>Contact Number</TableHead>
                  <TableHead>Membership Plan</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Days Left</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="dark:border-none">
                {filteredMemberData.map((member) => (
                  <TableRow key={member.id} className="dark:border-none">
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.contact}</TableCell>
                    <TableCell>{member.plan}</TableCell>
                    <TableCell>{member.startDate}</TableCell>
                    <TableCell>{member.expiryDate}</TableCell>
                    <TableCell>
                      {member.daysLeft > 0 ? member.daysLeft : 0}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(member.status, member.daysLeft)}
                    </TableCell>
                    <TableCell className="text-right dark:border-none">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSendReminder(member.id)}
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
        </Card>
      </div>
    </div>
  );
};

export default MemberExpiryReport;