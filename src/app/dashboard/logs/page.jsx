'use client';

import { LuLogs } from "react-icons/lu";
import { PiPrinterBold } from "react-icons/pi";
import { useReactToPrint } from "react-to-print";
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
} from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox";
import { LuSend } from "react-icons/lu";
import { FiPrinter } from "react-icons/fi";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LuFileSearch2 } from "react-icons/lu";
import { FaUser } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import {
  CircleDollarSign,
  RotateCcw,
  XCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Home,
  LayoutDashboard,
  CreditCard,
  FileText,
  ChevronRight,
  Plus,
  Search,
  Trash2,
  ArrowUpDown
} from "lucide-react";
import { FaFileInvoice } from "react-icons/fa6";
import { useRef, useEffect, useState } from 'react';
import Pagination from '@/components/ui/CustomPagination';

// Import shadcn components
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Loader from "@/components/Loader/Loader";
import { useUser } from "@/components/Providers/LoggedInUserProvider";
import { useQuery, useQueryClient } from '@tanstack/react-query';

const LearnAggregation = () => {

  const getLogs = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/applogs');

      const resBody = await response.json();

      if (!response.ok) {
        toast.error(resBody.message || 'Failed to fetch data');
      } else {
        toast.success('Data fetched successfully');
        console.log(resBody);
      };
      return resBody;
    } catch (error) {
      console.error("Error in getData:", error);
    };
  };

  const { data, isLoading } = useQuery({
    queryKey: ['logs'],
    queryFn: getLogs
  })

  const { logs } = data || {};
  console.log(logs);

  return (
    <div className="w-full min-h-screen">
      <div className="bg-slate-50 dark:bg-gray-800 rounded-sm">
        {/* Professional Container */}
        <div className="bg-slate-50 dark:bg-gray-800 shadow-md rounded-sm border-b border-gray-200/50 dark:border-none">
          <div className="w-full mx-auto px-4">
            <div className="py-6 lg:py-8">
              {/* Enhanced Breadcrumb Navigation */}
              <div className="mb-8">
                <Breadcrumb>
                  <BreadcrumbList className="flex items-center space-x-1">
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href="/"
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                      >
                        <Home className="h-4 w-4 mr-2" />
                        Home
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href="/dashboard"
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                      >
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </BreadcrumbLink>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                      <BreadcrumbLink
                        href="/dashboard/logs"
                        className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                      >
                        <LuLogs className="h-4 w-4 mr-2" />
                        Logs
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              {/* Main Header Section */}
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
                {/* Enhanced Title Section */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/25">
                      <LuLogs className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        Logs
                      </h1>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                        Manage and track all your invoices with precision and ease
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearnAggregation;
