'use client';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
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
    User
} from 'lucide-react';
import { IoMenu } from "react-icons/io5";

const MemberPortal = () => {
    
// Sample member data
const memberData = {
    name: "Alex Johnson",
    membershipStatus: "Premium",
    membershipId: "MEM-2025-4872",
    qrCodeUrl: "/api/placeholder/300/300", // Placeholder for QR code
    trainers: [
        { id: 1, name: "Sarah Taylor", status: "online", avatar: "/api/placeholder/40/40" },
        { id: 2, name: "Mike Richards", status: "offline", avatar: "/api/placeholder/40/40" },
        { id: 3, name: "Elena Davis", status: "online", avatar: "/api/placeholder/40/40" }
    ]
};

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <QRCodeSection memberData={memberData} />;
            case 'chat':
                return (
                    <ChatSection
                        trainers={memberData.trainers}
                        selectedTrainer={selectedTrainer}
                        setSelectedTrainer={setSelectedTrainer}
                        messages={messages}
                        chatInput={chatInput}
                        setChatInput={setChatInput}
                        handleSendMessage={handleSendMessage}
                    />
                );
            case 'feedback':
                return <FeedbackSection trainers={memberData.trainers} />;
            case 'measurements':
                return <MeasurementsSection measurements={bodyMeasurements} />;
            case 'settings':
                return <SettingsSection />;
            default:
                return <QRCodeSection memberData={memberData} />;
        }
    };



    function LogoutButton() {
        return (
            <button className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition duration-150">
                <LogOut size={20} className="mr-2" />
                <span>Logout</span>
            </button>
        );
    }

    function SidebarLink({ icon, label, active, onClick }) {
        return (
            <button
                onClick={onClick}
                className={`flex items-center w-full px-4 py-3 mb-1 rounded-lg text-left ${active
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
            >
                <span className="mr-3">{icon}</span>
                <span className="font-medium">{label}</span>
            </button>
        );
    }



    return (
        <div>
            <Sheet>
                <SheetTrigger asChild>
                <IoMenu className="text-2xl cursor-pointer"/>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Welcome To My Gym</SheetTitle>
                    </SheetHeader>
                    <div className={`md:block md:w-64 bg-white shadow-sm`}>
                        <div className="flex flex-col h-full">
                            <div className="hidden md:flex items-center justify-center py-6 border-b border-gray-200">
                                <h1 className="text-xl font-bold text-indigo-600">FitHub</h1>
                            </div>

                            <div className="px-4 py-6 border-b border-gray-200">
                                <div className="flex items-center">
                                    <div className="rounded-full bg-indigo-100 p-2">
                                        <User size={24} className="text-indigo-600" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-medium">{'memberData.name'}</p>
                                        <p className="text-sm text-gray-500">{'memberData.membershipStatus'}</p>
                                    </div>
                                </div>
                            </div>

                            <nav className="flex-1 px-2 py-4">
                                <SidebarLink
                                    icon={<Home size={20} />}
                                    label="QR Code"
                                />
                                <SidebarLink
                                    icon={<MessageSquare size={20} />}
                                    label="Chat"
                                />
                                <SidebarLink
                                    icon={<Star size={20} />}
                                    label="Feedback"
                                />
                                <SidebarLink
                                    icon={<LineChart size={20} />}
                                    label="Measurements"
                                />
                                <SidebarLink
                                    icon={<Settings size={20} />}
                                    label="Settings"
                                />
                            </nav>

                            <div className="p-4 border-t border-gray-200">
                                <LogoutButton />
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default MemberPortal;