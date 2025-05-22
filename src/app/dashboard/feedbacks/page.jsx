'use client';

import Pagination from "@/components/ui/CustomPagination.jsx";
import { CiUndo } from "react-icons/ci";
import Loader from "@/components/Loader/Loader";
import { FaList } from "react-icons/fa6";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { FiChevronRight, FiTrash2, FiEdit, FiPlus, FiX, FiSave, FiCheck, FiInfo, FiEye, FiLoader, FiFilter, FiRefreshCcw } from "react-icons/fi";
import { MdHome } from "react-icons/md";
import toast from "react-hot-toast";

// UI Components
import { Switch } from "@/components/ui/switch";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const AdminFeedBackManagement = () => {

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 6;

    // Filter and search plans
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');


    return (
        <div className='w-full bg-gray-100 min-h-screen p-4 md:p-6'>
            {/* Breadcrumb with arrows */}
            <div className='w-full mb-4'>
                <Breadcrumb className="mb-4">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <MdHome className='w-4 h-4' />
                            <BreadcrumbLink href="/" className="ml-2 font-semibold">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <FiChevronRight className="h-4 w-4" />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink className="font-semibold">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <FiChevronRight className="h-4 w-4" />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink className="font-semibold">Feedback Management</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex flex-col md:flex-row justify-between items-start bg-white p-4 py-4 border border-gray-200 shadow-sm rounded-md md:items-center gap-4">
                    <div>
                        <h1 className="text-xl font-bold mb-2">Feedback Management</h1>
                        <p className="text-xs text-gray-500 font-medium">
                            View and manage all feedbacks.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminFeedBackManagement;
