'use client';

import { MdOutlineRemoveRedEye, MdShoppingBag } from "react-icons/md";
import { FaMoneyBill } from "react-icons/fa";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    Home,
    Settings,
    ChevronRight,
    Save,
    Building,
    FileText,
    Phone,
    Mail,
    Calendar,
    CreditCard,
    FileStack,
    Edit,
    Eye,
    EyeOff
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { useUser } from "@/components/Providers/LoggedInUserProvider";
import Loader from "@/components/Loader/Loader";
import { useTenant } from "@/components/Providers/LoggedInTenantProvider";

export default function GymBillingProfileForm() {

    const tenant = useTenant();
    const loggedInTenant = tenant?.tenant?.tenant
    console.log(loggedInTenant)

    // Vat registered
    const [vatRegistered, setVatRegistered] = useState(false);

    // States
    const queryClient = useQueryClient();
    const { user } = useUser();
    const loggedInUser = user?.user;
    const userId = loggedInUser?._id
    const [openForm, setOpenForm] = useState(true);

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    return (
        <div className="w-full bg-gray-50 dark:bg-gray-900 mx-auto py-6 px-4">

            <div className="flex flex-col space-y-3 pb-6 border-b border-gray-200 dark:border-gray-700 mb-4">
                <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                        <FaMoneyBill className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Billing Profile
                        </h1>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Portal
                            </span>
                            <ChevronRight className="w-4 h-4 mx-2" />
                            <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Client Area
                            </span>
                            <ChevronRight className="w-4 h-4 mx-2" />
                            <span className="text-blue-600 dark:text-blue-400 font-medium">
                                Billing Profile
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <Card>
                <form>
                    <div>
                        <Label>Invoice email</Label>
                        <Input />
                    </div>
                </form>
            </Card>

        </div>
    );
}
