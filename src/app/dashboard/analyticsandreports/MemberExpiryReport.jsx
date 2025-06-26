"use client";

import { TbLoader2 } from "react-icons/tb";
import { useReactToPrint } from 'react-to-print';
import { useState, useRef } from "react";
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
import { CalendarIcon, Download, Search, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@/components/ui/CustomPagination";
import { toast } from 'sonner';

const MemberExpiryReport = () => {

  const componentPDF = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(new Date().setDate(new Date().getDate() + 7)),
  });
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Get Member Expiry Report
  const getMemberExpiryReport = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/reports/memberexiryreport?from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}&page=${currentPage}&limit=${limit}`
      );
      const resBody = await response.json();
      return resBody;
    } catch (error) {
      console.log("Error: ", error);
      return {
        expiredCount: 0,
        expiredMembers: [],
        expiringCount: 0,
        expiringMembers: [],
        totalPages: 0,
      };
    }
  };

  const { data: memberExpiryReportData, isLoading } = useQuery({
    queryKey: ["memberExpiryReport", dateRange.from, dateRange.to, currentPage, limit],
    queryFn: getMemberExpiryReport,
  });

  const { totalPages } = memberExpiryReportData || {};

  const getStatusBadge = (status, expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysLeft = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));

    if (status === "Inactive" || daysLeft < 0) {
      return <Badge variant="destructive">Expired</Badge>;
    } else if (daysLeft <= 14) {
      return <Badge variant="warning">Expiring Soon</Badge>;
    } else {
      return <Badge variant="success">Active</Badge>;
    }
  };

  const getDaysLeft = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysLeft = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  };

  const handleSendReminder = (id) => {
    console.log(`Sending reminder for member ID: ${id}`);
    // Implement actual reminder logic here
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Combine expired and expiring members
  const allMembers = [
    ...(memberExpiryReportData?.expiredMembers || []),
    ...(memberExpiryReportData?.expiringMembers || []),
  ];

  const filteredMemberData = allMembers.filter((member) => {
    const matchesSearch =
      member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.contactNo.includes(searchQuery);

    if (selectedStatus === "all") return matchesSearch;
    if (selectedStatus === "Expired") return matchesSearch && member.status === "Inactive";
    if (selectedStatus === "Expiring") {
      const daysLeft = getDaysLeft(member.membershipExpireDate);
      return matchesSearch && daysLeft <= 14 && member.status === "Active";
    }
    if (selectedStatus === "Active") {
      const daysLeft = getDaysLeft(member.membershipExpireDate);
      return matchesSearch && daysLeft > 14 && member.status === "Active";
    }

    return matchesSearch;
  });

  // Initialize useReactToPrint hook
  const handlePrint = useReactToPrint({
    contentRef: componentPDF,
    documentTitle: "Members expiry list",
    onAfterPrint: () => {
      setIsGeneratingPDF(false);
      toast.success('Expiry list saved in PDF');
    },
    onPrintError: (error) => {
      setIsGeneratingPDF(false);
      console.error('Print error:', error);
      toast.error('Failed to generate PDF');
    }
  });

  const handleGeneratePDF = () => {
    // Check if there's data to print
    if (!filteredMemberData || filteredMemberData.length === 0) {
      toast.error('No data available to print');
      return;
    }

    // Check if ref is properly attached
    if (!componentPDF.current) {
      toast.error('Print component not ready. Please try again.');
      return;
    }

    setIsGeneratingPDF(true);

    // Add a small delay to ensure DOM is ready
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  return (
    <div className="w-full bg-transparent">
      <div className="bg-transparent rounded-lg space-y-4 border-none dark:text-white">
        <Card className="rounded-lg dark:border-none shadow-md dark:bg-gray-800 dark:text-white p-6">
          <CardTitle>Member Expiry Report</CardTitle>
          <CardDescription className="text-sm mt-1 mb-6">
            View and manage memberships that are expiring soon or have expired. By default reports will be generated daily.
          </CardDescription>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-white rounded-lg dark:border-none shadow-md dark:bg-gray-900 dark:text-white">
              <CardHeader className="pb-2">
                <CardDescription>Expiring Members</CardDescription>
                <CardTitle className="text-2xl text-yellow-600">
                  {memberExpiryReportData?.expiringCount || 0}
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
                <CardDescription>Expired Members</CardDescription>
                <CardTitle className="text-2xl text-red-600">
                  {memberExpiryReportData?.expiredCount || 0}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="col-span-1 md:col-span-2 space-y-1">
              <label className="text-sm font-medium leading-none">
                Date Range
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={dateRange.from.toISOString().split('T')[0]}
                  onChange={(e) => setDateRange({ ...dateRange, from: new Date(e.target.value) })}
                  className="bg-white rounded-sm py-6 dark:border-none shadow-sm dark:bg-gray-900 dark:text-white"
                />
                <span className="text-sm text-muted-foreground">to</span>
                <Input
                  type="date"
                  value={dateRange.to.toISOString().split('T')[0]}
                  className="bg-white rounded-sm py-6 dark:border-none shadow-sm dark:bg-gray-900 dark:text-white"
                  onChange={(e) => setDateRange({ ...dateRange, to: new Date(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">Status</label>
              <Select
                value={selectedStatus}
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger className="bg-white rounded-sm py-6 dark:border-none shadow-sm dark:bg-gray-900 dark:text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-lg dark:border-none shadow-md dark:bg-gray-900 dark:text-white">
                  <SelectItem value="all" className="dark:text-white cursor-pointer hover:bg-blue-600/30">All Status</SelectItem>
                  <SelectItem value="Expired" className="dark:text-white cursor-pointer hover:bg-blue-600/30">Expired</SelectItem>
                  <SelectItem value="Expiring" className="dark:text-white cursor-pointer hover:bg-blue-600/30">Expiring</SelectItem>
                  <SelectItem value="Active" className="dark:text-white cursor-pointer hover:bg-blue-600/30">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Member name or phone"
                  className="pl-9 bg-white rounded-sm py-6 dark:border-none shadow-sm dark:bg-gray-900 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex justify-end gap-2 mb-4">
            <Button
              onClick={handleGeneratePDF}
              disabled={isGeneratingPDF || isLoading}
              variant="outline"
              className="bg-white rounded-sm dark:border-none shadow-sm py-6 dark:bg-gray-900 dark:text-white"
            >
              {isGeneratingPDF ? (
                <TbLoader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {isGeneratingPDF ? 'Generating...' : 'Export to PDF'}
            </Button>
            <Button variant="outline" className="bg-white rounded-sm dark:border-none shadow-sm py-6 dark:bg-gray-900 dark:text-white">
              <Download className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
          </div>

          {/* Data Table - Wrap the table in a div with the ref */}
          <div className="rounded-md border">
            <div ref={componentPDF}>
              {/* Add header for PDF */}
              <div className="print-only" style={{ display: 'none' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
                  Member Expiry Report
                </h2>
                <p style={{ textAlign: 'center', marginBottom: '20px', fontSize: '14px' }}>
                  Generated on: {new Date().toLocaleDateString()}
                </p>
              </div>

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
                    <TableHead className="text-right actions-column">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="dark:border-none">
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filteredMemberData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No members found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMemberData.map((member) => (
                      <TableRow key={member._id} className="dark:border-none">
                        <TableCell className="font-medium">{member.fullName}</TableCell>
                        <TableCell>{member.contactNo}</TableCell>
                        <TableCell>{member.membershipType}</TableCell>
                        <TableCell>{formatDate(member.membershipDate)}</TableCell>
                        <TableCell>{formatDate(member.membershipExpireDate)}</TableCell>
                        <TableCell>
                          {getDaysLeft(member.membershipExpireDate)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(member.status, member.membershipExpireDate)}
                        </TableCell>
                        <TableCell className="text-right dark:border-none actions-column">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSendReminder(member._id)}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Remind
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end p-4 border-t dark:border-none">
            <Pagination
              total={totalPages ? totalPages : 1}
              page={currentPage}
              onChange={setCurrentPage}
            />
          </div>
        </Card>
      </div>

      {/* Add print-specific styles */}
      <style jsx global>{`
        @media print {
          .print-only {
            display: block !important;
          }
          .actions-column {
            display: none !important;
          }
          body {
            font-size: 12px;
          }
          table {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default MemberExpiryReport;