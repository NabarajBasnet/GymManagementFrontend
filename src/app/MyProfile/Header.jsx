'use client';

import { FaBuilding } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { MdLocalOffer } from "react-icons/md";
import { VscFeedback } from "react-icons/vsc";
import { FaUserCheck } from "react-icons/fa6";
import { GoTasklist } from "react-icons/go";
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
import { useState, useEffect } from 'react';
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
    ChevronDown,
    Sun,
    Moon,
    Monitor,
    Sparkles,
    Zap
} from 'lucide-react';
import { RiCustomerServiceFill } from "react-icons/ri";
import { IoMenu } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useStaff } from "@/components/Providers/LoggedInStaffProvider";

const StaffHeader = ({ activeTab }) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { staff } = useStaff();

    const loggedInStaff = staff?.loggedInStaff;

    const staffName = staff?.loggedInStaff?.fullName || '';
    const staffStatus = staff?.loggedInStaff?.status || '';
    const gymBranchName = staff?.loggedInStaff?.gymBranch || '';

    // Theme handling
    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setDarkMode(savedTheme === 'dark');
        } else {
            setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            if (darkMode) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
        }
    }, [darkMode, mounted]);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    const navItems = [
        { id: '/MyProfile', icon: <CgProfile size={20} />, label: "Profile", color: "from-blue-500 to-cyan-500" },
        { id: '/MyProfile/chats', icon: <MessageSquare size={20} />, label: "Chat", color: "from-green-500 to-emerald-500" },
        { id: '/MyProfile/taskmanagement', icon: <GoTasklist size={20} />, label: "Task Management", color: "from-purple-500 to-violet-500" },
        { id: '/MyProfile/attendance', icon: <FaUserCheck size={20} />, label: "Attendance", color: "from-orange-500 to-red-500" },
        { id: '/MyProfile/feedbacks', icon: <VscFeedback size={20} />, label: "Feedbacks & Ratings", color: "from-pink-500 to-rose-500" },
        { id: '/MyProfile/promotions&offers', icon: <MdLocalOffer size={20} />, label: "Promotions & Offers", color: "from-yellow-500 to-amber-500" },
        { id: '/MyProfile/customersupport', icon: <RiCustomerServiceFill size={20} />, label: "Customer Support", color: "from-indigo-500 to-blue-500" },
        { id: '/MyProfile/settings', icon: <Settings size={20} />, label: "Settings", color: "from-gray-500 to-slate-500" },
    ];

    const handleNavClick = (id, tab) => {
        router.push(id);
        setIsSheetOpen(false);
    };

    const logOutStaff = async () => {
        try {
            const response = await fetch(`http://88.198.112.156:3100/api/staff-login/logout`, {
                method: "POST",
            })
            const responseBody = await response.json();
            if (response.status !== 200) {
                toast.error('An unexpected error occurred. Please try again.');
            }
            else {
                if (response.status === 200) {
                    toast.success(responseBody.message);
                    router.push(responseBody.redirect);
                }
            }
        } catch (error) {
            toast.error(error);
            console.log("Error: ", error);
        }
    };

    if (!mounted) {
        return null;
    }

    return (
        <header className="bg-white/70 dark:bg-gray-900 backdrop-blur-2xl border-b border-gray-200/30 dark:border-gray-700/30 sticky top-0 z-50 shadow-sm dark:shadow-gray-900/10">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Mobile menu button */}
                    <div className="flex items-center">
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetTrigger asChild>
                                <button
                                    className="relative inline-flex items-center justify-center p-3 rounded-2xl text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300 group overflow-hidden"
                                    aria-label="Open menu"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <IoMenu className="relative block h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[320px] sm:w-[360px] p-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border-gray-200/30 dark:border-gray-700/30">
                                <div className="h-full flex flex-col">
                                    <SheetHeader className="p-3 border-b border-gray-200/40 dark:border-gray-700/40 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-gray-800/50 dark:to-gray-900/50">
                                        <div className="flex items-center justify-between">
                                            <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                                {loggedInStaff?.organization?.name}
                                            </SheetTitle>
                                        </div>
                                    </SheetHeader>

                                    {/* User profile */}
                                    {staff && staff && staff.loggedInStaff && (
                                        <div className="px-6 py-6 border-b border-gray-200/40 dark:border-gray-700/40">
                                            <div className="flex items-center">
                                                <div className="relative">
                                                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-500 dark:via-purple-500 dark:to-indigo-500 flex items-center justify-center text-base font-bold text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-400/25 ring-4 ring-white/50 dark:ring-gray-800/50">
                                                        {staffName
                                                            ?.split(' ')
                                                            .map((word) => word[0])
                                                            .join('')
                                                            .slice(0, 2)
                                                            .toUpperCase()}
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 border-3 border-white dark:border-gray-900 shadow-sm">
                                                        <div className="w-full h-full rounded-full bg-emerald-400 animate-ping opacity-75"></div>
                                                    </div>
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-base">{staffName}</p>
                                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                                        <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
                                                            {staffStatus}
                                                        </span>
                                                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-3 py-1.5 rounded-full font-medium">
                                                            {gymBranchName}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Navigation */}
                                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                                        {navItems.map((item, index) => (
                                            <button
                                                key={item.id}
                                                onClick={() => handleNavClick(item.id)}
                                                className={`relative flex items-center w-full px-4 py-4 rounded-2xl text-sm font-medium transition-all duration-300 group overflow-hidden ${activeTab === item.id
                                                    ? 'text-white shadow-lg transform scale-[1.02]'
                                                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:shadow-md hover:scale-[1.01]'
                                                    }`}
                                                style={{
                                                    animationDelay: `${index * 50}ms`
                                                }}
                                            >
                                                {activeTab === item.id && (
                                                    <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl shadow-lg`}></div>
                                                )}
                                                {activeTab !== item.id && (
                                                    <div className="absolute inset-0 bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                )}
                                                <span className={`relative mr-4 transition-all duration-300 ${activeTab === item.id ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                                                    }`}>
                                                    {item.icon}
                                                </span>
                                                <span className="relative">{item.label}</span>
                                                {activeTab === item.id && (
                                                    <Zap className="relative ml-auto w-4 h-4 text-white/80" />
                                                )}
                                            </button>
                                        ))}
                                    </nav>

                                    {/* Footer with logout */}
                                    <div className="px-4 py-4 border-t border-gray-200/40 dark:border-gray-700/40 bg-gray-50/50 dark:bg-gray-800/50">
                                        <button
                                            onClick={() => {
                                                logOutStaff()
                                                setIsSheetOpen(false);
                                            }}
                                            className="flex items-center w-full px-4 py-4 rounded-2xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 group hover:shadow-md"
                                        >
                                            <LogOut size={18} className="mr-4 group-hover:scale-110 transition-transform duration-300" />
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Logo - hidden on mobile */}
                    <div className="hidden md:flex ml-48 items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 flex items-center justify-center shadow-lg">
                                <FaBuilding className="w-4 h-4 text-white animate-pulse" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                {loggedInStaff?.organization?.name}
                            </h1>
                        </div>
                    </div>

                    {/* Theme toggle and User profile */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="relative p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-300 group"
                            aria-label="Toggle theme"
                        >
                            <div className="relative w-5 h-5">
                                <Sun className={`absolute inset-0 w-5 h-5 text-yellow-500 transition-all duration-300 ${darkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                                    }`} />
                                <Moon className={`absolute inset-0 w-5 h-5 text-blue-500 transition-all duration-300 ${darkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                                    }`} />
                            </div>
                        </button>

                        {/* User Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div>
                                    {staff?.loggedInStaff && (
                                        <div className="flex cursor-pointer items-center px-3 py-2 rounded-2xl hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-300 group">
                                            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-500 dark:via-purple-500 dark:to-indigo-500 flex items-center justify-center text-sm font-bold text-white shadow-md shadow-blue-500/25 dark:shadow-blue-400/25 ring-2 ring-white/50 dark:ring-gray-800/50">
                                                {staffName?.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase()}
                                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 border-2 border-white dark:border-gray-900"></div>
                                            </div>
                                            <div className="ml-3 hidden lg:block">
                                                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 block">
                                                    {staffName}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 block">
                                                    {staffStatus}
                                                </span>
                                            </div>
                                            <ChevronDown className="ml-2 h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-all duration-300 hidden lg:block group-hover:rotate-180" />
                                        </div>
                                    )}
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64 mt-2 p-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border border-gray-200/30 dark:border-gray-700/30 shadow-xl rounded-2xl">
                                <DropdownMenuLabel className='cursor-pointer px-4 py-3 font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700'>
                                    My Account
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="my-2 bg-gray-200/50 dark:bg-gray-700/50" />
                                <DropdownMenuItem
                                    className='cursor-pointer text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl mx-1 px-4 py-3 transition-all duration-200 font-medium'
                                    onClick={logOutStaff}
                                >
                                    <LogOut className="mr-3 h-4 w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default StaffHeader;