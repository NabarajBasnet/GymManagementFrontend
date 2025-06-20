"use client";

import { FaSpinner, FaArrowRight } from "react-icons/fa";
import { toast } from "sonner";
import {
  Search,
  InfoIcon,
  CalendarIcon,
  Clock,
  User,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Building2,
  Users,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FiSearch } from "react-icons/fi";
import {
  BiHomeAlt,
  BiSolidUserDetail,
  BiSolidUserCircle,
} from "react-icons/bi";
import { Input } from "@/components/ui/input";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/components/Providers/LoggedInUserProvider";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useMemo, useRef, useEffect } from "react";

const MemberTransfer = () => {
  const { user, loading } = useUser();
  const searchRef = useRef(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState();
  const [selectedBranchId, setSelectedBranchId] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [renderDropdown, setRenderDropdown] = useState(false);
  const [transfering, setTransfering] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/org-members/by-branch`);
        return await response.json();
      } catch (error) {
        toast.error(error.message);
        console.log("Error: ", error);
        throw error;
      }
    },
  });

  const { members } = data || {};

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setRenderDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  const { data: branchesData, isLoading: isBranchLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      try {
        const response = await fetch("http://localhost:3000/api/organizationbranch/by-system-user");
        return await response.json();
      } catch (error) {
        toast.error(error.message);
        console.log("Error: ", error);
        throw error;
      }
    },
  });

  const { branches } = branchesData || {};

  // Calculate current branch name based on selected member and branches
  const memberCurrentBranch = useMemo(() => {
    if (!selectedMember || !branches) return "";
    const branch = branches.find(b => b._id === selectedMember.organizationBranch?._id);
    return branch?.orgBranchName || "N/A";
  }, [selectedMember, branches]);

  // Get destination branch name
  const destinationBranch = useMemo(() => {
    if (!selectedBranchId || !branches) return "";
    const branch = branches.find(b => b._id === selectedBranchId);
    return branch?.orgBranchName || "";
  }, [selectedBranchId, branches]);

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
    setSearchQuery(member.fullName);
    setSelectedMemberId(member._id);
    setRenderDropdown(false);
  };

  const transferMember = async () => {
    try {
      setTransfering(true);
      const response = await fetch(`http://localhost:3000/api/organizationbranch/transfer-member?selectedMemberId=${selectedMemberId}&selectedBranchId=${selectedBranchId}`, {
        method: "PATCH"
      });
      const resBody = await response.json();
      if (response.ok) {
        toast.success(resBody.message);
        setTransfering(false);
      } else {
        setTransfering(false);
        toast.error(resBody.message);
        window.location.href = resBody.redirectURL
      };
    } catch (error) {
      setTransfering(false);
      toast.error(error.message);
      console.log("Error: ", error);
    };
  };

  const isTransferReady = selectedMember && selectedBranchId && memberCurrentBranch !== destinationBranch;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/"
                  className="font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 flex items-center gap-2 transition-colors"
                >
                  <BiHomeAlt size={16} />
                  <span>Home</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/dashboard"
                  className="font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                >
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-blue-600 dark:text-blue-400">
                  Member Transfer
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-gray-100 dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
              Member Transfer
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Seamlessly transfer members between branches in your organization with our intuitive transfer system
          </p>
        </div>

        {/* Main Transfer Card */}
        <Card className="mb-8 shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="pb-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Transfer Configuration
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Select member and configure transfer destination
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Member Select */}
              <div className="space-y-3" ref={searchRef}>
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Select Member
                </Label>
                <div className="relative">
                  <div className="flex items-center bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-lg shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
                    <Search className="h-4 w-4 ml-3 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="member-search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setRenderDropdown(true)}
                      className="border-0 focus-visible:ring-0 rounded-lg bg-transparent py-3 px-3 focus-visible:ring-offset-0 dark:text-gray-300 placeholder:text-gray-500"
                      placeholder="Search members..."
                      autoComplete="off"
                    />
                  </div>

                  {renderDropdown && (
                    <div className="absolute z-50 w-full mt-2 max-h-64 overflow-y-auto bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg shadow-xl">
                      {isLoading ? (
                        <div className="p-4 space-y-3">
                          <Skeleton className="h-8 w-full dark:bg-gray-700" />
                          <Skeleton className="h-8 w-full dark:bg-gray-700" />
                          <Skeleton className="h-8 w-full dark:bg-gray-700" />
                        </div>
                      ) : members?.length > 0 ? (
                        members
                          .filter((member) =>
                            member.fullName
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                          )
                          .map((member) => (
                            <div
                              key={member._id}
                              onClick={() => handleMemberSelect(member)}
                              className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
                            >
                              <div className="p-1 bg-gray-100 dark:bg-gray-600 rounded-full">
                                <User className="h-3 w-3 text-gray-600 dark:text-gray-300" />
                              </div>
                              <span className="text-gray-900 dark:text-gray-100 font-medium">
                                {member.fullName}
                              </span>
                            </div>
                          ))
                      ) : (
                        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                          <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No members found</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* From Branch */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  From Branch
                </Label>
                <Select>
                  <SelectTrigger className="w-full py-3 px-4 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
                    <SelectValue placeholder={memberCurrentBranch || "Select member first"} />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600">
                    <SelectGroup>
                      <SelectLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400">Current Branch</SelectLabel>
                      <SelectItem
                        value={memberCurrentBranch || "N/A"}
                        className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        {memberCurrentBranch || "N/A"}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Member ID */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <InfoIcon className="h-4 w-4" />
                  Member ID
                </Label>
                <Select>
                  <SelectTrigger className="w-full py-3 px-4 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
                    <SelectValue placeholder="Member ID" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600">
                    <SelectGroup>
                      <SelectLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400">Member ID</SelectLabel>
                      <SelectItem
                        value="member-id"
                        className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        {selectedMemberId || "N/A"}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* To Branch */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  To Branch
                </Label>
                <Select onValueChange={(value) => setSelectedBranchId(value)}>
                  <SelectTrigger className="w-full py-3 px-4 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600">
                    <SelectGroup>
                      <SelectLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400">Available Branches</SelectLabel>
                      {Array.isArray(branches) && branches?.length >= 1 ? (
                        branches
                          ?.filter(branch => branch._id !== selectedMember?.organizationBranch?._id)
                          ?.map((branch) => (
                            <SelectItem
                              key={branch._id}
                              value={branch._id}
                              className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                              {branch.orgBranchName}
                            </SelectItem>
                          ))
                      ) : (
                        <SelectItem value="no-branches">No branches available</SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <div className="flex items-end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="w-full py-3 px-6 rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                      disabled={!isTransferReady || transfering}
                    >
                      {transfering ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaArrowRight className="mr-2" />
                          Transfer Member
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="sm:max-w-md">
                    <AlertDialogHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <AlertDialogTitle className="text-lg font-semibold">
                          Confirm Member Transfer
                        </AlertDialogTitle>
                      </div>
                      <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                        Are you sure you want to transfer <span className="font-semibold text-gray-900 dark:text-gray-100">{selectedMember?.fullName}</span> from <span className="font-semibold text-blue-600 dark:text-blue-400">{memberCurrentBranch}</span> to <span className="font-semibold text-green-600 dark:text-green-400">{destinationBranch}</span>?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 my-4">
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-2">Transfer Summary:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Member:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{selectedMember?.fullName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">From:</span>
                          <span className="font-medium text-blue-600 dark:text-blue-400">{memberCurrentBranch}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">To:</span>
                          <span className="font-medium text-green-600 dark:text-green-400">{destinationBranch}</span>
                        </div>
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-gray-300 dark:border-gray-600">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={transferMember}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        Confirm Transfer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transfer Summary Card */}
        {selectedMember && (
          <Card className="mb-8 shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Transfer Summary
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Review transfer details before confirmation
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Member Info */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Member Details</h3>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Name</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedMember.fullName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Member ID</p>
                      <p className="font-mono text-sm text-gray-700 dark:text-gray-300">{selectedMemberId}</p>
                    </div>
                  </div>
                </div>

                {/* From Branch */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <Building2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Current Branch</h3>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">From</p>
                    <p className="font-semibold text-red-600 dark:text-red-400">{memberCurrentBranch || "N/A"}</p>
                  </div>
                </div>

                {/* To Branch */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Building2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Destination Branch</h3>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">To</p>
                    <p className="font-semibold text-green-600 dark:text-green-400">{destinationBranch || "Select destination"}</p>
                  </div>
                </div>
              </div>

              {/* Transfer Arrow */}
              <div className="flex justify-center my-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-px bg-gradient-to-r from-red-300 to-red-500"></div>
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-lg">
                    <ArrowRight className="h-5 w-5 text-white" />
                  </div>
                  <div className="w-16 h-px bg-gradient-to-r from-green-300 to-green-500"></div>
                </div>
              </div>

              {/* Status */}
              <div className="text-center">
                {isTransferReady ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold">
                    <CheckCircle className="h-4 w-4" />
                    Ready to transfer
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm font-semibold">
                    <AlertTriangle className="h-4 w-4" />
                    {!selectedMember ? "Select a member" : !selectedBranchId ? "Select destination branch" : "Configuration incomplete"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-100">Error Loading Data</h3>
                  <p className="text-red-600 dark:text-red-400">
                    Failed to load member data. Please refresh the page and try again.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MemberTransfer;