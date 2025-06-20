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
  const [renderDropdown, setRenderDropdown] = useState(false)
  const [transfering, setTransfering] = useState(false)

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
      console.log("Response Body: ", resBody);
      if (response.ok) {
        toast.success(resBody.message);
      } else {
        setTransfering(false);
        toast.error(resBody.message);
      };
    } catch (error) {
      setTransfering(false);
      toast.error(error.message);
      console.log("Error: ", error);
    };
  };

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 px-4 py-6 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/"
                  className="font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 flex items-center gap-1 transition-colors"
                >
                  <BiHomeAlt size={16} className="mt-0.5" />
                  <span>Home</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/dashboard"
                  className="font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
                >
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-primary dark:text-primary-light">
                  Member Transfer
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Member Transfer
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Transfer members between branches in your organization
          </p>
        </div>

        {/* Main Card */}
        <Card className="p-6 dark:bg-gray-800 dark:border-gray-700 shadow-sm">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Transfer Details
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Select member and destination branch
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Member Select */}
              <div className="space-y-2" ref={searchRef}>
                <Label className="text-gray-700 dark:text-gray-300">
                  Member
                </Label>
                <div className="relative">
                  <div className="flex items-center bg-white dark:bg-gray-900 border dark:border-none rounded-sm transition-all focus-within:ring-2 focus-within:ring-blue-200 dark:focus-within:ring-blue-800 focus-within:border-blue-400 dark:focus-within:border-blue-600">
                    <Search className="h-4 w-4 ml-3 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="member-search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setRenderDropdown(true)}
                      className="border-0 focus-visible:ring-0 rounded-sm bg-white dark:bg-gray-900 py-6 focus-visible:ring-offset-0 dark:text-gray-300"
                      placeholder={`Search members...`}
                      autoComplete="off"
                    />
                  </div>

                  {renderDropdown && (
                    <div className="absolute z-50 w-full mt-1 max-h-64 overflow-y-auto bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg">
                      {isLoading ? (
                        <div className="p-4 space-y-2">
                          <Skeleton className="h-6 w-full dark:bg-gray-700" />
                          <Skeleton className="h-6 w-full dark:bg-gray-700" />
                          <Skeleton className="h-6 w-full dark:bg-gray-700" />
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
                              className="px-4 py-3 flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <span className="text-gray-900 dark:text-gray-100">
                                {member.fullName}
                              </span>
                            </div>
                          ))
                      ) : (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          No members found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* To Branch */}
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">
                  From Branch
                </Label>
                <Select>
                  <SelectTrigger className="w-full py-6 dark:bg-gray-900 dark:border-none rounded-sm">
                    <SelectValue placeholder={memberCurrentBranch || "N/A"} />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-900 dark:border-none">
                    <SelectGroup>
                      <SelectLabel>Current Branch</SelectLabel>
                      <SelectItem
                        value={memberCurrentBranch || "N/A"}
                        className="cursor-pointer hover:bg-blue-600/30"
                      >
                        {memberCurrentBranch || "N/A"}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Member ID */}
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">
                  Member ID
                </Label>
                <Select>
                  <SelectTrigger className="w-full py-6 dark:bg-gray-900 dark:border-none rounded-sm">
                    <SelectValue placeholder="Member ID" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-900 dark:border-none">
                    <SelectGroup>
                      <SelectLabel>Member ID</SelectLabel>
                      <SelectItem
                        value="north"
                        className="cursor-pointer hover:bg-blue-600/30"
                      >
                        {selectedMemberId || "N/A"}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Current Branch */}
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">
                  To Branch
                </Label>
                <Select onValueChange={(value) => setSelectedBranchId(value)}>
                  <SelectTrigger className="w-full py-6 dark:bg-gray-900 dark:border-none rounded-sm">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-900 dark:border-none">
                    <SelectGroup>
                      <SelectLabel>Branches</SelectLabel>
                      {Array.isArray(branches) && branches?.length >= 1 ? (
                        branches?.map((branch) => (
                          <SelectItem
                            key={branch._id}
                            value={branch._id}
                            className="cursor-pointer hover:bg-blue-600/30"
                          >
                            {branch.orgBranchName}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem>No branches found</SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <div className="flex items-end">
                <Button
                  className="w-full py-6 rounded-sm mt-2 flex items-center justify-center gap-2 text-white bg-blue-600 hover:bg-blue-700 transition"
                  onClick={transfering ? undefined : () => transferMember()}
                  disabled={transfering || !selectedMemberId || !selectedBranchId}
                >
                  {transfering ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaArrowRight />
                      Transfer Member
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-red-600 dark:text-red-400">
              Error loading member data. Please try again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberTransfer;
