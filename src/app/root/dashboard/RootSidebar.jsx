"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRootUser } from "@/components/Providers/LoggedInRootUserProvider";
import toast from "react-hot-toast";
import {
    Home,
    Users,
    ShoppingCart,
    CreditCard,
    Settings,
    LogOut,
    ShieldCheck,
    Shield,
    Lock,
    AlertTriangle,
    Activity,
    Database,
    HelpCircle,
    Crown,
    UserCheck,
} from "lucide-react";

const RootSidebar = ({ activeTab }) => {
    const router = useRouter();
    const { rootUser } = useRootUser();

    const navItems = [
        {
            id: "/root/dashboard",
            icon: <Home size={20} />,
            label: "Admin Dashboard",
            description: "System Overview & Analytics",
        },
        {
            id: "/root/dashboard/tenantmanagement",
            icon: <Users size={20} />,
            label: "Tenant Management",
            description: "Organizations & Clients",
        },
        {
            id: "/root/dashboard/ordermanagement",
            icon: <ShoppingCart size={20} />,
            label: "Order Management",
            description: "Order Management",
        },
        {
            id: "/root/dashboard/subscriptionmanagement",
            icon: <CreditCard size={20} />,
            label: "Subscription Management",
            description: "Plans & Billing Control",
        },
        {
            id: "/root/dashboard/settings",
            icon: <Settings size={20} />,
            label: "System Settings",
            description: "Platform Configuration",
        },
    ];

    const adminQuickActions = [
        {
            icon: <AlertTriangle size={16} />,
            label: "System Alerts",
            count: 2,
            link: "system",
            color: "text-red-600",
        },
        {
            icon: <Activity size={16} />,
            label: "System Health",
            color: "text-green-600",
            link: "system",
        },
        {
            icon: <Database size={16} />,
            label: "Database",
            color: "text-purple-600",
            link: "systemalerts",
        },
    ];

    const handleNavClick = (id) => {
        router.push(id);
    };

    const logOutRootUser = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/rootuser/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const responseBody = await response.json();
            if (response.ok) {
                toast.success(responseBody.message);
                router.push(responseBody.redirectUrl);
            }
        } catch (error) {
            console.log("Error: ", error);
            toast.error(error.message);
        }
    };

    // Safe access to member data
    const rootUserName = rootUser?.fullName || "";

    // Get admin role styling
    const getAdminRoleStyling = (role) => {
        switch (role?.toLowerCase()) {
            case "super_admin":
                return {
                    bg: "bg-gradient-to-r from-red-500 to-pink-600",
                    icon: <Crown size={12} />,
                    label: "Super Admin",
                };
            case "admin":
                return {
                    bg: "bg-gradient-to-r from-purple-500 to-indigo-600",
                    icon: <ShieldCheck size={12} />,
                    label: "Admin",
                };
            case "moderator":
                return {
                    bg: "bg-gradient-to-r from-blue-500 to-cyan-600",
                    icon: <Shield size={12} />,
                    label: "Moderator",
                };
            default:
                return {
                    bg: "bg-gradient-to-r from-gray-500 to-gray-700",
                    icon: <UserCheck size={12} />,
                    label: role || "Admin",
                };
        }
    };

    const adminRoleStyle = getAdminRoleStyling(rootUser?.rootUserRole);

    return (
        <div className="w-[240px] h-screen flex flex-col bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg border-r border-red-100/50 dark:border-gray-800/50 sticky top-0">
            {/* Enhanced Admin Profile */}
            {rootUser && (
                <div className="px-2 py-2 bg-gradient-to-r from-red-50 dark:from-gray-800 to-rose-50 dark:to-gray-900 border-b border-red-100 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-lg font-bold text-white shadow-lg">
                                {rootUserName
                                    ?.split(" ")
                                    .map((word) => word[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-3 border-white shadow-sm flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg truncate">
                                {rootUserName}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                                <span
                                    className={`inline-flex items-center space-x-1 text-xs font-semibold px-3 py-1 rounded-full text-white ${adminRoleStyle.bg} shadow-sm`}
                                >
                                    {adminRoleStyle.icon}
                                    <span>{adminRoleStyle.label}</span>
                                </span>
                                <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400">
                                    {rootUser?.rootUserStatus}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                                <Lock size={12} className="mr-1" />
                                System Administrator
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-1 py-2 space-y-2">
                <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-3">
                        Administration
                    </h4>
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={`flex items-center w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${activeTab === item.id
                                ? "bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg transform scale-[1.02]"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-red-700 dark:hover:text-red-400 hover:transform hover:scale-[1.01]"
                                }`}
                        >
                            <span
                                className={`mr-4 p-1.5 rounded-lg ${activeTab === item.id
                                    ? "bg-white/20"
                                    : "bg-gray-100 dark:bg-gray-800 group-hover:bg-red-100 dark:group-hover:bg-red-900/30"
                                    }`}
                            >
                                {item.icon}
                            </span>
                            <div className="flex-1 text-left">
                                <div className="font-semibold">{item.label}</div>
                                <div
                                    className={`text-xs ${activeTab === item.id
                                        ? "text-white/80"
                                        : "text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400"
                                        }`}
                                >
                                    {item.description}
                                </div>
                            </div>
                            {activeTab === item.id && (
                                <ShieldCheck size={16} className="text-white/80" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-3">
                        System Controls
                    </h4>
                    {adminQuickActions.map((action, index) => (
                        <button
                            onClick={() => router.push(`/root/dashboard/${action.link}`)}
                            key={index}
                            className="flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-red-700 dark:hover:text-red-400 transition-all duration-200 group"
                        >
                            <span
                                className={`mr-3 p-1 rounded-md bg-gray-100 dark:bg-gray-800 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 ${action.color}`}
                            >
                                {action.icon}
                            </span>
                            <span className="flex-1 text-left">{action.label}</span>
                            {action.count && (
                                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-medium">
                                    {action.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="px-2 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sticky bottom-0">
                <button
                    onClick={logOutRootUser}
                    className="flex items-center w-full p-3 rounded-xl bg-white dark:bg-gray-900 hover:bg-red-50 dark:hover:bg-red-900/30 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 group"
                >
                    <LogOut
                        size={18}
                        className="mr-3 group-hover:scale-110 transition-transform"
                    />
                    <div className="flex-1 text-left">
                        <div className="font-semibold">Secure Logout</div>
                        <div className="text-xs text-red-500 dark:text-red-400">
                            End admin session
                        </div>
                    </div>
                    <Shield
                        size={16}
                        className="text-red-400 dark:text-red-500 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors"
                    />
                </button>
            </div>
        </div>
    );
};

export default RootSidebar;
