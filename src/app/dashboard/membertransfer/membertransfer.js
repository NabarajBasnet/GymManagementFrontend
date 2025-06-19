"use client";

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

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

const MemberTransfer = () => {
  const { user, loading } = useUser();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const getMembers = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/org-members/by-branch`
      );
      const resBody = await response.json();
      return resBody;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["members"],
    queryFn: getMembers,
  });

  const { members } = data || {};

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
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">
                  Member
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger
                    asChild
                    className="py-6 dark:border-none dark:bg-gray-900"
                  >
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between h-10"
                    >
                      {value
                        ? frameworks.find((f) => f.value === value)?.label
                        : "Select member..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 dark:bg-gray-900 dark:border-none">
                    <Command>
                      <CommandInput
                        placeholder="Search members..."
                        className="h-12"
                      />
                      <CommandList>
                        <CommandEmpty>No members found.</CommandEmpty>
                        <CommandGroup>
                          {frameworks.map((framework) => (
                            <CommandItem
                              key={framework.value}
                              value={framework.value}
                              onSelect={(currentValue) => {
                                setValue(
                                  currentValue === value ? "" : currentValue
                                );
                                setOpen(false);
                              }}
                              className="cursor-pointer"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  value === framework.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {framework.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* To Branch */}
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">
                  To Branch
                </Label>
                <Select>
                  <SelectTrigger className="w-full py-6 dark:bg-gray-900 dark:border-none rounded-sm">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-900 dark:border-none">
                    <SelectGroup>
                      <SelectLabel>Branches</SelectLabel>
                      <SelectItem
                        value="north"
                        className="cursor-pointer hover:bg-blue-600/30"
                      >
                        North Branch
                      </SelectItem>
                      <SelectItem
                        value="south"
                        className="cursor-pointer hover:bg-blue-600/30"
                      >
                        South Branch
                      </SelectItem>
                      <SelectItem
                        value="east"
                        className="cursor-pointer hover:bg-blue-600/30"
                      >
                        East Branch
                      </SelectItem>
                      <SelectItem
                        value="west"
                        className="cursor-pointer hover:bg-blue-600/30"
                      >
                        West Branch
                      </SelectItem>
                      <SelectItem
                        value="central"
                        className="cursor-pointer hover:bg-blue-600/30"
                      >
                        Central Branch
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Current Branch */}
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">
                  Current Branch
                </Label>
                <Select>
                  <SelectTrigger className="w-full py-6 dark:bg-gray-900 dark:border-none rounded-sm">
                    <SelectValue placeholder="Current branch" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-900 dark:border-none">
                    <SelectGroup>
                      <SelectLabel>Current Branch</SelectLabel>
                      <SelectItem
                        value="north"
                        className="cursor-pointer hover:bg-blue-600/30"
                      >
                        North Branch
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
                <Input
                  placeholder="Member ID"
                  className="py-6 bg-white dark:bg-gray-900 dark:border-none dark:text-white"
                  disabled
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-end">
                <Button className="w-full h-10 mt-2">Transfer Member</Button>
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
