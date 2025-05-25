'use client';

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
    ChevronDown
} from 'lucide-react';
import { RiCustomerServiceFill } from "react-icons/ri";
import { IoMenu } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useStaff } from "@/components/Providers/LoggedInStaffProvider";

const StaffHeader = ({ activeTab }) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const router = useRouter();
    const { staff } = useStaff();

    const staffName = staff?.loggedInStaff?.fullName || '';
    const staffStatus = staff?.loggedInStaff?.status || '';
    const gymName = staff?.loggedInStaff?.gymName || '';
    const gymBranchName = staff?.loggedInStaff?.gymBranch || '';

    const navItems = [
        { id: '/MyProfile', icon: <CgProfile size={20} />, label: "Profile" },
        { id: '/MyProfile/chat', icon: <MessageSquare size={20} />, label: "Chat" },
        { id: '/MyProfile/taskmanagement', icon: <GoTasklist size={20} />, label: "Task Management" },
        { id: '/MyProfile/attendance', icon: <FaUserCheck size={20} />, label: "Attendance" },
        { id: '/MyProfile/feedbacks', icon: <VscFeedback size={20} />, label: "Feedbacks & Ratings" },
        { id: '/MyProfile/promotions&offers', icon: <MdLocalOffer size={20} />, label: "Promotions & Offers" },
        { id: '/MyProfile/customersupport', icon: <RiCustomerServiceFill size={20} />, label: "Customer Support" },
        { id: '/MyProfile/settings', icon: <Settings size={20} />, label: "Settings" },
    ];

    const handleNavClick = (id, tab) => {
        router.push(id);
        setIsSheetOpen(false);
    };

    const logOutStaff = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/staff-login/logout`, {
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

    return (
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Mobile menu button */}
                    <div className="flex items-center">
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetTrigger asChild>
                                <button
                                    className="inline-flex items-center justify-center p-2.5 rounded-xl text-gray-600 hover:text-gray-800 hover:bg-gray-100/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-indigo-50 transition-all duration-200 group"
                                    aria-label="Open menu"
                                >
                                    <IoMenu className="block h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[320px] sm:w-[340px] p-0 bg-gradient-to-br from-white to-gray-50/50">
                                <div className="h-full flex flex-col">
                                    <SheetHeader className="px-6 pt-6 pb-4 border-b border-gray-200/60 bg-gradient-to-r from-indigo-50 to-blue-50">
                                        <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                                            {gymName}
                                        </SheetTitle>
                                    </SheetHeader>

                                    {/* User profile */}
                                    {staff && staff && staff.loggedInStaff && (
                                        <div className="px-6 py-6 border-b border-gray-200/60 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                                            <div className="flex items-center">
                                                <div className="relative">
                                                    <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-base font-bold text-white shadow-lg ring-4 ring-white">
                                                        {staffName
                                                            ?.split(' ')
                                                            .map((word) => word[0])
                                                            .join('')
                                                            .slice(0, 2)
                                                            .toUpperCase()}
                                                    </div>
                                                    <span className="absolute -bottom-1 -right-1 block w-4 h-4 rounded-full bg-emerald-500 border-3 border-white shadow-sm animate-pulse"></span>
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <p className="font-semibold text-gray-900 text-base">{staffName}</p>
                                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                                        <span className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                                                            {staffStatus}
                                                        </span>
                                                        <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">
                                                            {gymBranchName}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Navigation */}
                                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                                        {navItems.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => handleNavClick(item.id)}
                                                className={`flex items-center w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                                                    activeTab === item.id
                                                        ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-500/25 transform scale-[1.02]'
                                                        : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 hover:shadow-sm hover:scale-[1.01]'
                                                }`}
                                            >
                                                <span className={`mr-4 transition-all duration-200 ${
                                                    activeTab === item.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                                                }`}>
                                                    {item.icon}
                                                </span>
                                                {item.label}
                                            </button>
                                        ))}
                                    </nav>

                                    {/* Footer with logout */}
                                    <div className="px-4 py-4 border-t border-gray-200/60 bg-gray-50/50">
                                        <button
                                            onClick={() => {
                                                logOutStaff()
                                                setIsSheetOpen(false);
                                            }}
                                            className="flex items-center w-full px-4 py-3.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group hover:shadow-sm"
                                        >
                                            <LogOut size={18} className="mr-4 group-hover:scale-110 transition-transform duration-200" />
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Logo - hidden on mobile */}
                    <div className="hidden md:flex ml-48 items-center">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                            {gymName}
                        </h1>
                    </div>

                    {/* User profile */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div>
                                {staff?.loggedInStaff && (
                                    <div className="flex cursor-pointer items-center px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group">
                                        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-md ring-2 ring-white">
                                            {staffName?.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase()}
                                            <span className="absolute -bottom-0.5 -right-0.5 block w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
                                        </div>
                                        <div className="ml-3 hidden lg:block">
                                            <span className="text-sm font-semibold text-gray-800 block">
                                                {staffName}
                                            </span>
                                            <span className="text-xs text-gray-500 block">
                                                {staffStatus}
                                            </span>
                                        </div>
                                        <ChevronDown className="ml-2 h-4 w-4 text-gray-500 group-hover:text-gray-700 transition-colors duration-200 hidden lg:block" />
                                    </div>
                                )}
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64 mt-2 p-2 bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-xl rounded-2xl">
                            <DropdownMenuLabel className='cursor-pointer px-4 py-3 font-semibold text-gray-800 border-b border-gray-100'>
                                My Account
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="my-2" />
                            <DropdownMenuItem 
                                className='cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl mx-1 px-4 py-3 transition-all duration-200 font-medium' 
                                onClick={logOutStaff}
                            >
                                <LogOut className="mr-3 h-4 w-4" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};

export default StaffHeader;