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
    QrCode
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
            const response = await fetch(`gymmanagementbackend-o2l3.onrender.com/api/staff-login/logout`, {
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
        <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Mobile menu button */}
                    <div className="flex items-center">
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetTrigger asChild>
                                <button
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                                    aria-label="Open menu"
                                >
                                    <IoMenu className="block h-6 w-6" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[280px] sm:w-[300px] p-0">
                                <div className="h-full flex flex-col">
                                    <SheetHeader className="px-4 pt-4 pb-2 border-b border-gray-200">
                                        <SheetTitle className="text-xl font-bold text-indigo-600">
                                            {gymName}
                                        </SheetTitle>
                                    </SheetHeader>

                                    {/* User profile */}
                                    {staff && staff && staff.loggedInStaff && (
                                        <div className="px-4 py-6 border-b border-gray-200">
                                            <div className="flex items-center">
                                                <div className="relative">
                                                    <div className="relative w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold text-white">
                                                        {staffName
                                                            ?.split(' ')
                                                            .map((word) => word[0])
                                                            .join('')
                                                            .slice(0, 2)
                                                            .toUpperCase()}
                                                        <span className="absolute bottom-0 right-0 block w-2 h-2 rounded-full bg-green-500 border-2 border-white"></span>
                                                    </div>
                                                    <span className="absolute bottom-0 right-0 block w-3 h-3 rounded-full bg-green-500 border-2 border-white"></span>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="font-medium text-gray-900">{staffName}</p>
                                                    <p className="text-sm text-gray-500 flex items-center space-x-2">
                                                        <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full mr-1">
                                                            {staffStatus}
                                                        </span>
                                                        <span className="bg-indigo-100 text-black text-xs px-2 py-0.5 rounded-full mr-1">
                                                            Branch: {gymBranchName}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Navigation */}
                                    <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                                        {navItems.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => handleNavClick(item.id)}
                                                className={`flex items-center w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === item.id
                                                    ? 'bg-indigo-50 text-indigo-700'
                                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                                    }`}
                                            >
                                                <span className="mr-3 opacity-80">{item.icon}</span>
                                                {item.label}
                                            </button>
                                        ))}
                                    </nav>

                                    {/* Footer with logout */}
                                    <div className="px-4 py-4 border-t border-gray-200">
                                        <button
                                            onClick={() => {
                                                logOutStaff()
                                                setIsSheetOpen(false);
                                            }}
                                            className="flex items-center w-full px-3 py-2.5 rounded-md text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                        >
                                            <LogOut size={18} className="mr-3" />
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Logo - hidden on mobile */}
                    <div className="hidden md:flex items-center">
                        <h1 className="text-xl font-bold text-indigo-600">
                            {gymName}
                        </h1>
                    </div>

                    {/* User profile */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div>
                                {staff?.loggedInStaff && (
                                    <div className="flex cursor-pointer items-center">
                                        <div className="relative w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold text-white">
                                            {staffName?.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase()}
                                            <span className="absolute bottom-0 right-0 block w-2 h-2 rounded-full bg-green-500 border-2 border-white"></span>
                                        </div>
                                        <span className="ml-2 text-sm font-medium text-gray-700 hidden lg:inline">
                                            {staffName}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel className='cursor-pointer'>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className='cursor-pointer text-red-600' onClick={logOutStaff}>
                                <LogOut />
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
