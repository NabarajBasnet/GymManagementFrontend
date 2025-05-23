'use client';

import { WiStars } from "react-icons/wi";
import { Loader2 } from "lucide-react";
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
    Award
} from 'lucide-react';
import { FaTag } from "react-icons/fa";
import { RiCustomerServiceFill } from "react-icons/ri";
import { FaMoneyBillWaveAlt } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useTenant } from "@/components/Providers/LoggedInTenantProvider";
import Loader from "@/components/Loader/Loader";

const ClientAreaHeader = ({ activeTab }) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const router = useRouter();

    const { tenant, loading } = useTenant();
    const loggedInTenant = tenant?.tenant;

    const navItems = [
        { 
            id: '/clientarea/dashboard', 
            icon: <Home size={20} />, 
            label: "Dashboard",
            description: "Overview & Analytics"
        },
        { 
            id: '/clientarea/dashboard/gymdashboard', 
            icon: <QrCode size={20} />, 
            label: "Gym Dashboard",
            description: "Access Control & Monitoring"
        },
        { 
            id: '/clientarea/dashboard/subscriptionmanagement', 
            icon: <CreditCard size={20} />, 
            label: "Subscription Management",
            description: "Plans & Billing"
        },
        { 
            id: '/clientarea/dashboard/settings', 
            icon: <Settings size={20} />, 
            label: "Settings",
            description: "Configuration & Preferences"
        },
    ];

    const quickActions = [
        { icon: <Bell size={16} />, label: "Notifications", count: 3 },
        { icon: <HelpCircle size={16} />, label: "Support" },
        { icon: <TrendingUp size={16} />, label: "Analytics" },
    ];

    const handleNavClick = (id, tab) => {
        router.push(id);
        setIsSheetOpen(false);
    };

    const logOutTenant = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/tenant/auth/logout`, {
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

    // Safe access to tenant data
    const ownerName = loggedInTenant?.ownerName || '';

    // Get subscription tier styling
    const getSubscriptionStyling = (status) => {
        switch (status?.toLowerCase()) {
            case 'premium':
                return { bg: 'bg-gradient-to-r from-yellow-400 to-orange-500', icon: <Crown size={12} /> };
            case 'pro':
                return { bg: 'bg-gradient-to-r from-purple-500 to-indigo-600', icon: <Zap size={12} /> };
            case 'basic':
                return { bg: 'bg-gradient-to-r from-blue-500 to-cyan-600', icon: <Shield size={12} /> };
            default:
                return { bg: 'bg-gradient-to-r from-gray-400 to-gray-600', icon: <Shield size={12} /> };
        }
    };

    const subscriptionStyle = getSubscriptionStyling(loggedInTenant?.tenantSubscriptionStatus);

    return (
        <header className="bg-white/95 backdrop-blur-lg shadow-md border-b border-gray-100/50 sticky top-0 z-50">
            {loading ? (
               <Loader />
            ) : (
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-18">
                        {/* Mobile menu button */}
                        <div className="flex items-center">
                            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                                <SheetTrigger asChild>
                                    <button
                                        className="inline-flex items-center justify-center p-3 rounded-xl text-gray-600 hover:text-indigo-700 hover:bg-indigo-50/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-indigo-50/80 transition-all duration-200 group"
                                        aria-label="Open menu"
                                    >
                                        <IoMenu className="block h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[320px] sm:w-[360px] p-0 bg-gradient-to-b from-white to-gray-50/30">
                                    <div className="h-full flex flex-col">
                                        <SheetHeader className="px-6 pt-6 pb-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                                    <Building2 className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <SheetTitle className="text-xl font-bold text-white">
                                                        Fit Loft Pro
                                                    </SheetTitle>
                                                    <p className="text-indigo-100 text-sm font-medium">Fitness Management Suite</p>
                                                </div>
                                            </div>
                                        </SheetHeader>

                                        {/* Enhanced User Profile */}
                                        {loggedInTenant && (
                                            <div className="px-6 py-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
                                                <div className="flex items-center space-x-4">
                                                    <div className="relative">
                                                        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-lg font-bold text-white shadow-lg">
                                                            {loggedInTenant?.organizationName
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
                                                            {loggedInTenant?.organizationName}
                                                        </h3>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <span className={`inline-flex items-center space-x-1 text-xs font-semibold px-3 py-1 rounded-full text-white ${subscriptionStyle.bg} shadow-sm`}>
                                                                {subscriptionStyle.icon}
                                                                <span>{loggedInTenant?.tenantSubscriptionStatus}</span>
                                                            </span>
                                                            <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-md bg-emerald-100 text-emerald-800">
                                                                {loggedInTenant?.tenantStatus}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1 flex items-center">
                                                            <Calendar size={12} className="mr-1" />
                                                            Member since 2024
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Navigation */}
                                        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                                            <div className="mb-4">
                                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
                                                    Main Navigation
                                                </h4>
                                                {navItems.map((item) => (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => handleNavClick(item.id)}
                                                        className={`flex items-center w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                                                            activeTab === item.id
                                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg transform scale-[1.02]'
                                                                : 'text-gray-700 hover:bg-gray-100/80 hover:text-indigo-700 hover:transform hover:scale-[1.01]'
                                                        }`}
                                                    >
                                                        <span className={`mr-4 p-1.5 rounded-lg ${
                                                            activeTab === item.id 
                                                                ? 'bg-white/20' 
                                                                : 'bg-gray-100 group-hover:bg-indigo-100'
                                                        }`}>
                                                            {item.icon}
                                                        </span>
                                                        <div className="flex-1 text-left">
                                                            <div className="font-semibold">{item.label}</div>
                                                            <div className={`text-xs ${
                                                                activeTab === item.id 
                                                                    ? 'text-white/80' 
                                                                    : 'text-gray-500 group-hover:text-indigo-600'
                                                            }`}>
                                                                {item.description}
                                                            </div>
                                                        </div>
                                                        {activeTab === item.id && (
                                                            <Award size={16} className="text-white/80" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Quick Actions */}
                                            <div className="pt-4 border-t border-gray-200">
                                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
                                                    Quick Actions
                                                </h4>
                                                {quickActions.map((action, index) => (
                                                    <button
                                                        key={index}
                                                        className="flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100/80 hover:text-indigo-700 transition-all duration-200 group"
                                                    >
                                                        <span className="mr-3 p-1 rounded-md bg-gray-100 group-hover:bg-indigo-100">
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
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <User size={16} className="mr-2 text-gray-500" />
                                                    <span className="font-medium">Owner: {ownerName}</span>
                                                </div>
                                            </div>
                                            
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="w-full flex items-center p-3 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 hover:border-indigo-300 transition-all duration-200 group">
                                                        {loggedInTenant && (
                                                            <>
                                                                <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-sm font-bold text-white">
                                                                    {loggedInTenant?.organizationName?.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase()}
                                                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></div>
                                                                </div>
                                                                <div className="ml-3 flex-1 text-left">
                                                                    <p className="text-sm font-semibold text-gray-900">{ownerName}</p>
                                                                    <p className="text-xs text-gray-500">Account Settings</p>
                                                                </div>
                                                                <Settings size={16} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                                                            </>
                                                        )}
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-64" side="right">
                                                    <DropdownMenuLabel className="px-4 py-3 border-b border-gray-100">
                                                        <div className="font-semibold text-gray-800">Account Management</div>
                                                        <div className="text-xs text-gray-500 mt-1">Manage your account settings</div>
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuItem className="cursor-pointer px-4 py-3 hover:bg-gray-50">
                                                        <User className="mr-3" size={16} />
                                                        <div>
                                                            <div className="font-medium">Profile Settings</div>
                                                            <div className="text-xs text-gray-500">Update personal information</div>
                                                        </div>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100">
                                                        <Crown className="mr-3 text-yellow-600" size={16} />
                                                        <div>
                                                            <div className="font-medium text-indigo-700">Upgrade Plan</div>
                                                            <div className="text-xs text-indigo-600">Unlock premium features</div>
                                                        </div>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="cursor-pointer px-4 py-3 text-red-600 hover:bg-red-50" onClick={logOutTenant}>
                                                        <LogOut className="mr-3" size={16} />
                                                        <div>
                                                            <div className="font-medium">Sign Out</div>
                                                            <div className="text-xs text-red-500">End current session</div>
                                                        </div>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Enhanced Logo */}
                        <div className="hidden md:flex justify-center ml-52 items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg">
                                    <Building2 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent">
                                        Fit Loft
                                    </h1>
                                    <p className="text-xs text-gray-500 font-medium">Automate Gym</p>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced User Profile */}
                        <div className="flex items-center space-x-4">
                            {/* Quick Action Buttons - Desktop */}
                            <div className="hidden lg:flex items-center space-x-2">
                                {quickActions.slice(0, 2).map((action, index) => (
                                    <button
                                        key={index}
                                        className="relative p-2.5 rounded-xl text-gray-600 hover:text-indigo-700 hover:bg-indigo-50/80 transition-all duration-200 group"
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
                                        {loggedInTenant && (
                                            <>
                                                <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                                                    {loggedInTenant?.organizationName?.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase()}
                                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></div>
                                                </div>
                                                <div className="hidden lg:block text-left">
                                                    <div className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                                                        {loggedInTenant?.organizationName}
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`inline-flex items-center space-x-1 text-xs font-medium px-2 py-0.5 rounded-md text-white ${subscriptionStyle.bg}`}>
                                                            {subscriptionStyle.icon}
                                                            <span>{loggedInTenant?.tenantSubscriptionStatus}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-72" align="end">
                                    <DropdownMenuLabel className="px-4 py-3 border-b border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-sm font-bold text-white">
                                                {loggedInTenant?.organizationName?.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-800">{loggedInTenant?.organizationName}</div>
                                                <div className="text-xs text-gray-500 flex items-center mt-1">
                                                    <span className={`inline-flex items-center space-x-1 text-xs font-medium px-2 py-0.5 rounded-md text-white ${subscriptionStyle.bg} mr-2`}>
                                                        {subscriptionStyle.icon}
                                                        <span>{loggedInTenant?.tenantSubscriptionStatus}</span>
                                                    </span>
                                                    <span className="text-emerald-600 font-medium">{loggedInTenant?.tenantStatus}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    
                                    <div className="py-2">
                                        <DropdownMenuItem className="cursor-pointer px-4 py-3 hover:bg-gray-50">
                                            <User className="mr-3" size={16} />
                                            <div>
                                                <div className="font-medium">Account Settings</div>
                                                <div className="text-xs text-gray-500">Manage your profile</div>
                                            </div>
                                        </DropdownMenuItem>
                                        
                                        <DropdownMenuItem className="cursor-pointer px-4 py-3 hover:bg-gray-50">
                                            <CreditCard className="mr-3" size={16} />
                                            <div>
                                                <div className="font-medium">Billing & Usage</div>
                                                <div className="text-xs text-gray-500">View invoices and usage</div>
                                            </div>
                                        </DropdownMenuItem>
                                        
                                        <DropdownMenuItem className="cursor-pointer px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100">
                                            <Crown className="mr-3 text-yellow-600" size={16} />
                                            <div>
                                                <div className="font-medium text-indigo-700">Upgrade to Premium</div>
                                                <div className="text-xs text-indigo-600">Unlock advanced features</div>
                                            </div>
                                        </DropdownMenuItem>
                                        
                                        <DropdownMenuItem className="cursor-pointer px-4 py-3 hover:bg-gray-50">
                                            <HelpCircle className="mr-3" size={16} />
                                            <div>
                                                <div className="font-medium">Help & Support</div>
                                                <div className="text-xs text-gray-500">Get assistance</div>
                                            </div>
                                        </DropdownMenuItem>
                                    </div>
                                    
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer px-4 py-3 text-red-600 hover:bg-red-50" onClick={logOutTenant}>
                                        <LogOut className="mr-3" size={16} />
                                        <div>
                                            <div className="font-medium">Sign Out</div>
                                            <div className="text-xs text-red-500">End your session securely</div>
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default ClientAreaHeader;