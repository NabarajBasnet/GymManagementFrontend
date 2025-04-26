'use client';

import { TbBarbellFilled } from "react-icons/tb";
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
    QrCode
} from 'lucide-react';
import { IoMenu } from "react-icons/io5";
import { useRouter } from "next/navigation";

const MemberHeader = ({ activeTab, setActiveTab }) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const router = useRouter();

    // Sample member data
    const memberData = {
        name: "Alex Johnson",
        membershipStatus: "Premium",
        membershipId: "MEM-2025-4872",
        qrCodeUrl: "/api/placeholder/300/300",
        avatar: "/api/placeholder/100/100"
    };

    const navItems = [
        { id: 'qrcode', icon: <QrCode size={20} />, label: "QR Code" },
        { id: 'chat', icon: <MessageSquare size={20} />, label: "Chat" },
        { id: 'membershipdetails', icon: <MdCardMembership size={20} />, label: "Membership Details" },
        { id: 'measurements', icon: <LineChart size={20} />, label: "Measurements" },
        { id: 'feedback', icon: <Star size={20} />, label: "Feedback" },
        { id: 'settings', icon: <Settings size={20} />, label: "Settings" },
    ];

    const handleNavClick = (id, tab) => {
        router.push(id);
        setActiveTab(tab);
        setIsSheetOpen(false);
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                                            FitHub Pro
                                        </SheetTitle>
                                        <SheetDescription className="text-xs text-gray-500">
                                            Member Portal
                                        </SheetDescription>
                                    </SheetHeader>

                                    {/* User profile */}
                                    <div className="px-4 py-6 border-b border-gray-200">
                                        <div className="flex items-center">
                                            <div className="relative">
                                                <img
                                                    src={memberData.avatar}
                                                    alt={memberData.name}
                                                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(memberData.name)}&background=random`;
                                                    }}
                                                />
                                                <span className="absolute bottom-0 right-0 block w-3 h-3 rounded-full bg-green-500 border-2 border-white"></span>
                                            </div>
                                            <div className="ml-3">
                                                <p className="font-medium text-gray-900">{memberData.name}</p>
                                                <p className="text-sm text-gray-500 flex items-center">
                                                    <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full mr-1">
                                                        {memberData.membershipStatus}
                                                    </span>
                                                    {memberData.membershipId}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

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
                                                // Handle logout logic
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
                        <h1 className="text-xl font-bold text-indigo-600">FitHub Pro</h1>
                    </div>

                    {/* Desktop navigation - hidden on mobile */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === item.id
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* User profile - desktop */}
                    <div className="hidden md:flex items-center">
                        <div className="relative">
                            <img
                                src={memberData.avatar}
                                alt={memberData.name}
                                className="w-8 h-8 rounded-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(memberData.name)}&background=random`;
                                }}
                            />
                            <span className="absolute bottom-0 right-0 block w-2 h-2 rounded-full bg-green-500 border-2 border-white"></span>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 hidden lg:inline">
                            {memberData.name}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default MemberHeader;