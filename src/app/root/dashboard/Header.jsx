'use client';

import { AiOutlineSchedule } from "react-icons/ai";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { MdCardMembership } from "react-icons/md";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from 'react';
import {
    Home,
    MessageSquare,
    Star,
    LineChart,
    Settings,
    LogOut,
    Menu,
    X,
    User,
    QrCode,
    Shield,
    Crown,
    Zap,
    Bell,
    HelpCircle,
    CreditCard,
    Building2,
    Calendar,
    TrendingUp,
    Award,
    Users,
    Database,
    Activity,
    BarChart3,
    ShieldCheck,
    Cog,
    AlertTriangle,
    Globe,
    Lock,
    UserCheck
} from 'lucide-react';
import { FaTag } from "react-icons/fa";
import { RiCustomerServiceFill } from "react-icons/ri";
import { FaMoneyBillWaveAlt } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useRootUser } from "@/components/Providers/LoggedInRootUserProvider";

const RootUserHeader = ({ activeTab }) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const router = useRouter();
    const { rootUser, loading } = useRootUser();

    const navItems = [
        { 
            id: '/root/dashboard', 
            icon: <Home size={20} />, 
            label: "Admin Dashboard",
            description: "System Overview & Analytics"
        },
        { 
            id: '/root/dashboard/tenantmanagement', 
            icon: <Users size={20} />, 
            label: "Tenant Management",
            description: "Organizations & Clients"
        },
        { 
            id: '/root/dashboard/subscriptionmanagement', 
            icon: <CreditCard size={20} />, 
            label: "Subscription Management",
            description: "Plans & Billing Control"
        },
        { 
            id: '/root/dashboard/settings', 
            icon: <Settings size={20} />, 
            label: "System Settings",
            description: "Platform Configuration"
        },
    ];

    const adminQuickActions = [
        { icon: <AlertTriangle size={16} />, label: "System Alerts", count: 2, color: "text-red-600" },
        { icon: <Activity size={16} />, label: "System Health", color: "text-green-600" },
        { icon: <BarChart3 size={16} />, label: "Analytics", color: "text-blue-600" },
        { icon: <Database size={16} />, label: "Database", color: "text-purple-600" },
    ];

    const systemStats = [
        { label: "Active Tenants", value: "127", trend: "+12%" },
        { label: "System Uptime", value: "99.9%", trend: "Stable" },
        { label: "Total Revenue", value: "$45.2K", trend: "+8.3%" },
    ];

    const handleNavClick = (id, tab) => {
        router.push(id);
        setIsSheetOpen(false);
    };

    const logOutRootUser = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/rootuser/logout`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const responseBody = await response.json();
            if (response.ok) {
                toast.success(responseBody.message);
                router.push(responseBody.redirectUrl);
            };
        } catch (error) {
            console.log("Error: ", error);
            toast.error(error.message);
        };
    };

    // Safe access to member data
    const rootUserName = rootUser?.fullName || '';
    const rootUserStatus = rootUser?.status || '';

    // Get admin role styling
    const getAdminRoleStyling = (role) => {
        switch (role?.toLowerCase()) {
            case 'super_admin':
                return { bg: 'bg-gradient-to-r from-red-500 to-pink-600', icon: <Crown size={12} />, label: 'Super Admin' };
            case 'admin':
                return { bg: 'bg-gradient-to-r from-purple-500 to-indigo-600', icon: <ShieldCheck size={12} />, label: 'Admin' };
            case 'moderator':
                return { bg: 'bg-gradient-to-r from-blue-500 to-cyan-600', icon: <Shield size={12} />, label: 'Moderator' };
            default:
                return { bg: 'bg-gradient-to-r from-gray-500 to-gray-700', icon: <UserCheck size={12} />, label: role || 'Admin' };
        }
    };

    const adminRoleStyle = getAdminRoleStyling(rootUser?.rootUserRole);

    return (
        <header className="bg-white/95 backdrop-blur-lg shadow-lg border-b border-red-100/50 sticky top-0 z-50">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-18">
                    {/* Mobile menu button */}
                    <div className="flex items-center">
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetTrigger asChild>
                                <button
                                    className="inline-flex items-center justify-center p-3 rounded-xl text-gray-600 hover:text-red-700 hover:bg-red-50/80 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:bg-red-50/80 transition-all duration-200 group"
                                    aria-label="Open menu"
                                >
                                    <IoMenu className="block h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[340px] sm:w-[380px] p-0 bg-gradient-to-b from-white to-red-50/30">
                                <div className="h-full flex flex-col">
                                    <SheetHeader className="px-6 pt-6 pb-4 bg-gradient-to-r from-red-600 to-rose-700 text-white">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                                <ShieldCheck className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <SheetTitle className="text-xl font-bold text-white">
                                                    Fit Loft Admin
                                                </SheetTitle>
                                                <p className="text-red-100 text-sm font-medium">System Administration</p>
                                            </div>
                                        </div>
                                    </SheetHeader>

                                    {/* Enhanced Admin Profile */}
                                    {rootUser && (
                                        <div className="px-6 py-6 bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-100">
                                            <div className="flex items-center space-x-4">
                                                <div className="relative">
                                                    <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-lg font-bold text-white shadow-lg">
                                                        {rootUserName
                                                            ?.split(' ')
                                                            .map((word) => word[0])
                                                            .join('')
                                                            .slice(0, 2)
                                                            .toUpperCase()}
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-3 border-white shadow-sm flex items-center justify-center">
                                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-900 text-lg truncate">
                                                        {rootUserName}
                                                    </h3>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <span className={`inline-flex items-center space-x-1 text-xs font-semibold px-3 py-1 rounded-full text-white ${adminRoleStyle.bg} shadow-sm`}>
                                                            {adminRoleStyle.icon}
                                                            <span>{adminRoleStyle.label}</span>
                                                        </span>
                                                        <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-md bg-emerald-100 text-emerald-800">
                                                            {rootUser?.rootUserStatus}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1 flex items-center">
                                                        <Lock size={12} className="mr-1" />
                                                        System Administrator
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* System Stats */}
                                    <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-red-50/50 border-b border-gray-200">
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                            System Overview
                                        </h4>
                                        <div className="grid grid-cols-1 gap-3">
                                            {systemStats.map((stat, index) => (
                                                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-white/60 border border-gray-100">
                                                    <div>
                                                        <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                                                        <p className="text-sm font-bold text-gray-900">{stat.value}</p>
                                                    </div>
                                                    <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                                                        stat.trend.includes('+') ? 'bg-green-100 text-green-700' : 
                                                        stat.trend === 'Stable' ? 'bg-blue-100 text-blue-700' : 
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {stat.trend}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Navigation */}
                                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                                        <div className="mb-4">
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
                                                Administration
                                            </h4>
                                            {navItems.map((item) => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => handleNavClick(item.id)}
                                                    className={`flex items-center w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                                                        activeTab === item.id
                                                            ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg transform scale-[1.02]'
                                                            : 'text-gray-700 hover:bg-gray-100/80 hover:text-red-700 hover:transform hover:scale-[1.01]'
                                                    }`}
                                                >
                                                    <span className={`mr-4 p-1.5 rounded-lg ${
                                                        activeTab === item.id 
                                                            ? 'bg-white/20' 
                                                            : 'bg-gray-100 group-hover:bg-red-100'
                                                    }`}>
                                                        {item.icon}
                                                    </span>
                                                    <div className="flex-1 text-left">
                                                        <div className="font-semibold">{item.label}</div>
                                                        <div className={`text-xs ${
                                                            activeTab === item.id 
                                                                ? 'text-white/80' 
                                                                : 'text-gray-500 group-hover:text-red-600'
                                                        }`}>
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
                                        <div className="pt-4 border-t border-gray-200">
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
                                                System Controls
                                            </h4>
                                            {adminQuickActions.map((action, index) => (
                                                <button
                                                    key={index}
                                                    className="flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100/80 hover:text-red-700 transition-all duration-200 group"
                                                >
                                                    <span className={`mr-3 p-1 rounded-md bg-gray-100 group-hover:bg-red-100 ${action.color}`}>
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
                                    </nav>

                                    {/* Enhanced Footer */}
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                        <button
                                            onClick={() => {
                                                logOutRootUser()
                                                setIsSheetOpen(false);
                                            }}
                                            className="flex items-center w-full p-3 rounded-xl bg-white hover:bg-red-50 border border-gray-200 hover:border-red-300 text-red-600 hover:text-red-700 transition-all duration-200 group"
                                        >
                                            <LogOut size={18} className="mr-3 group-hover:scale-110 transition-transform" />
                                            <div className="flex-1 text-left">
                                                <div className="font-semibold">Secure Logout</div>
                                                <div className="text-xs text-red-500">End admin session</div>
                                            </div>
                                            <Shield size={16} className="text-red-400 group-hover:text-red-600 transition-colors" />
                                        </button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Enhanced Logo */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-lg">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 to-rose-700 bg-clip-text text-transparent">
                                    Fit Loft Admin
                                </h1>
                                <p className="text-xs text-gray-500 font-medium">System Administration</p>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced User Profile */}
                    <div className="flex items-center space-x-4">
                        {/* Quick Action Buttons - Desktop */}
                        <div className="hidden lg:flex items-center space-x-2">
                            {adminQuickActions.slice(0, 3).map((action, index) => (
                                <button
                                    key={index}
                                    className={`relative p-2.5 rounded-xl text-gray-600 hover:text-red-700 hover:bg-red-50/80 transition-all duration-200 group ${action.color}`}
                                    title={action.label}
                                >
                                    {action.icon}
                                    {action.count && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                            {action.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50/80 transition-all duration-200 group">
                                    {rootUser && (
                                        <>
                                            <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                                                {rootUserName?.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase()}
                                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></div>
                                            </div>
                                            <div className="hidden lg:block text-left">
                                                <div className="text-sm font-semibold text-gray-900 group-hover:text-red-700 transition-colors">
                                                    {rootUserName}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`inline-flex items-center space-x-1 text-xs font-medium px-2 py-0.5 rounded-md text-white ${adminRoleStyle.bg}`}>
                                                        {adminRoleStyle.icon}
                                                        <span>{adminRoleStyle.label}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-80" align="end">
                                <DropdownMenuLabel className="px-4 py-3 border-b border-gray-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-sm font-bold text-white">
                                            {rootUserName?.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-800">{rootUserName}</div>
                                            <div className="text-xs text-gray-500 flex items-center mt-1">
                                                <span className={`inline-flex items-center space-x-1 text-xs font-medium px-2 py-0.5 rounded-md text-white ${adminRoleStyle.bg} mr-2`}>
                                                    {adminRoleStyle.icon}
                                                    <span>{adminRoleStyle.label}</span>
                                                </span>
                                                <span className="text-emerald-600 font-medium">{rootUser?.rootUserStatus}</span>
                                            </div>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                
                                <div className="py-2">
                                    <DropdownMenuItem className="cursor-pointer px-4 py-3 hover:bg-gray-50">
                                        <User className="mr-3" size={16} />
                                        <div>
                                            <div className="font-medium">Admin Profile</div>
                                            <div className="text-xs text-gray-500">Manage admin settings</div>
                                        </div>
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuItem className="cursor-pointer px-4 py-3 hover:bg-gray-50">
                                        <Globe className="mr-3" size={16} />
                                        <div>
                                            <div className="font-medium">System Configuration</div>
                                            <div className="text-xs text-gray-500">Platform settings</div>
                                        </div>
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuItem className="cursor-pointer px-4 py-3 hover:bg-gray-50">
                                        <Activity className="mr-3 text-green-600" size={16} />
                                        <div>
                                            <div className="font-medium">System Health</div>
                                            <div className="text-xs text-green-600">All systems operational</div>
                                        </div>
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuItem className="cursor-pointer px-4 py-3 hover:bg-gray-50">
                                        <Database className="mr-3 text-blue-600" size={16} />
                                        <div>
                                            <div className="font-medium">Database Management</div>
                                            <div className="text-xs text-blue-600">Monitor & maintain</div>
                                        </div>
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuItem className="cursor-pointer px-4 py-3 hover:bg-gray-50">
                                        <HelpCircle className="mr-3" size={16} />
                                        <div>
                                            <div className="font-medium">Admin Documentation</div>
                                            <div className="text-xs text-gray-500">System guides & help</div>
                                        </div>
                                    </DropdownMenuItem>
                                </div>
                                
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer px-4 py-3 text-red-600 hover:bg-red-50" onClick={logOutRootUser}>
                                    <LogOut className="mr-3" size={16} />
                                    <div>
                                        <div className="font-medium">Secure Logout</div>
                                        <div className="text-xs text-red-500">End admin session</div>
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default RootUserHeader;