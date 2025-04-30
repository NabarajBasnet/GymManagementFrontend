"use client";

import { MdFeedback } from "react-icons/md";
import { toast as notify } from 'react-hot-toast';
import { FaRulerHorizontal } from "react-icons/fa";
import { LuLogs } from "react-icons/lu";
import { MdAutoGraph } from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";
import { FcParallelTasks } from "react-icons/fc";
import { useUser } from "@/components/Providers/LoggedInUserProvider";
import { FaUsersRays } from "react-icons/fa6";
import { PiUsersFourFill, PiUsersThreeBold } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { PiStarFour } from "react-icons/pi";
import Settings from "./settings/page";
import { IoClose } from "react-icons/io5";
import { Separator } from "@/components/ui/separator";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/Setting/Setting";
import { FaBoxOpen } from "react-icons/fa";
import { BiSolidDashboard } from "react-icons/bi";
import { FiSidebar, FiSearch } from "react-icons/fi";
import { MdError, MdClose, MdDone, MdNotificationsActive } from "react-icons/md";
import { useRouter } from "next/navigation";
import {
    LogOut,
    Plus,
    User,
    Users,
    Settings as SettingsIcon,
    Bell,
    Calendar,
    Clock
} from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
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
import { HiUsers } from "react-icons/hi2";
import Badge from '@mui/material/Badge';
import { IoIosNotifications, IoMdSettings } from "react-icons/io";
import '../globals.css';
import { RiAccountCircleFill } from "react-icons/ri";
import React, { useEffect, useRef, useState } from 'react';
import { MinimizeSidebar } from '@/state/slicer';
import { useDispatch } from 'react-redux';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/DashboardUI/MobileSidebar";
import Link from "next/link";
import { useSelector } from 'react-redux';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/DashboardUI/SidebarAccrodin";
import { RiUserUnfollowFill, RiCustomerService2Fill, RiRunLine, RiDashboard3Fill } from 'react-icons/ri';
import { BiSolidUserCheck } from 'react-icons/bi';
import { GiLockers, GiBiceps } from 'react-icons/gi';
import { TiUserAdd } from 'react-icons/ti';
import { FaUsers, FaMoneyCheckAlt, FaChartLine, FaTags, FaCog, FaRegUser, FaUserCog, FaClipboardList, FaDumbbell } from 'react-icons/fa';
import { MdPayments, MdAttachMoney } from 'react-icons/md';
import { AiOutlineSchedule } from 'react-icons/ai';
import { FaUsersGear } from "react-icons/fa6";

const Header = () => {
    const { user } = useUser();

    const [isScrolled, setIsScrolled] = useState(false);
    const sidebarMinimized = useSelector(state => state.rtkreducer.sidebarMinimized);
    const dispatch = useDispatch();
    const searchRef = useRef(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [toast, setToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState({ icon: MdDone, message: '' });
    const [errorMessage, setErrorMessage] = useState({ icon: MdError, message: '' });
    const [responseType, setResponseType] = useState('');

    const [currentDateTime, setCurrentDateTime] = useState({
        date: '',
        time: ''
    });

    useEffect(() => {
        const updateDateTime = () => {
            const date = new Date();
            const formatedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });

            const formatedTime = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            });

            setCurrentDateTime({
                date: formatedDate,
                time: formatedTime
            });
        };

        const intervalId = setInterval(updateDateTime, 1000);
        updateDateTime();

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const minimizeSidebar = () => {
        dispatch(MinimizeSidebar());
    };

    const logoutUser = async () => {
        setLoading(true);
        try {
            const response = await fetch(`gymmanagementbackend-o2l3.onrender.com/api/auth/logout`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                credentials: "include"
            });
            const responseBody = await response.json();
            const responseResultType = ['Success', 'Failure'];

            if (response.ok) {
                setLoading(false);
                notify.success(responseBody.message);
                router.push("/login");
                window.location.reload();
            };
        } catch (error) {
            const responseResultType = ['Success', 'Failure'];
            console.log("Error: ", error);
            setResponseType(responseResultType[1]);
            setToast(true);
            setTimeout(() => {
                setToast(false);
            }, 6000);
            setErrorMessage({
                icon: MdError,
                message: responseBody.message
            })
        };
    };

    // Categorized sidebar content for mobile view
    const sidebarContent = [
        // Dashboard
        {
            category: "Main",
            items: [
                {
                    icon: RiDashboard3Fill,
                    title: 'Dashboard',
                    link: '/dashboard',
                }
            ]
        },
        // Checkin Management 
        {
            category: "Attendance Management",
            items: [
                {
                    icon: BiSolidUserCheck,
                    title: 'Attendance',
                    link: '/dashboard/attendance/memberattendance',
                    subObj: [
                        { icon: FaRegUser, title: 'Member Attendance', link: '/dashboard/attendance/memberattendance' },
                        { icon: FaUserCog, title: 'Staff Attendance', link: '/dashboard/attendance/staffattendance' },
                        { icon: FaClipboardList, title: 'Attendance History', link: '/dashboard/attendance/attendancehistory' }
                    ]
                },
            ]
        },
        // Member Management
        {
            category: "Member Management",
            items: [
                {
                    icon: TiUserAdd,
                    title: 'New Member',
                    link: '/dashboard/newmember',
                },
                {
                    icon: FaUsers,
                    title: 'Members',
                    link: '/dashboard/members',
                    subObj: [
                        { icon: PiUsersFourFill, title: 'All Members', link: '/dashboard/members' },
                        { icon: PiUsersThreeBold, title: 'Inactive Members', link: '/dashboard/members/inactivemembers' },
                        { icon: FaUsersRays, title: 'Paused Members', link: '/dashboard/members/pausedmembers' }
                    ]
                },
                {
                    icon: FaMoneyCheckAlt,
                    title: 'Membership Plans',
                    link: '/dashboard/membershipplans',
                },
                {
                    icon: LuLogs,
                    title: 'Membership Logs',
                    link: '/dashboard/members/membershiplogs',
                },
                {
                    icon: MdAutoGraph,
                    title: 'Member Performance',
                    link: '/dashboard/members/memberperformance',
                },
                {
                    icon: FaRulerHorizontal,
                    title: 'Body Measurements',
                    link: '/dashboard/members/bodymeasurements',
                },
            ]
        },
        // Staff Operations
        {
            category: "Staff Management",
            items: [
                {
                    icon: HiUsers,
                    title: 'System Users',
                    link: '/dashboard/users',
                },
                {
                    icon: FaUsersGear,
                    title: 'Staff Management',
                    link: '/dashboard/staffmanagement',
                    subObj: [
                        { icon: IoPeopleSharp, title: 'Staffs', link: '/dashboard/staffmanagement/staffs' },
                        { icon: FcParallelTasks, title: 'Task Management', link: '/dashboard/staffmanagement/taskmanagement' },
                    ]
                },
            ]
        },
        // Financial Management
        {
            category: "Financial",
            items: [
                {
                    icon: MdPayments,
                    title: 'Payment History',
                    link: '/dashboard/members/paymenthistory',
                },
                {
                    icon: MdAttachMoney,
                    title: 'Billing',
                    link: '/dashboard/billing',
                },
                {
                    icon: FaTags,
                    title: 'Promotions & Offers',
                    link: '/dashboard/promotions',
                },
            ]
        },
        // Facility Management
        {
            category: "Facility Management",
            items: [
                {
                    icon: GiLockers,
                    title: 'Lockers',
                    link: '/dashboard/lockers',
                },
                {
                    icon: GiBiceps,
                    title: 'Personal Training',
                    link: '/dashboard/personaltraining',
                    subObj: [
                        { icon: FaDumbbell, title: 'Book Personal Training', link: '/dashboard/personaltraining/booktraining' }
                    ]
                },
                {
                    icon: AiOutlineSchedule,
                    title: 'Schedule Management',
                    link: '/dashboard/schedulemanagement',
                },
            ]
        },
        // Analytics & Support
        {
            category: "Reports & Support",
            items: [
                {
                    icon: FaChartLine,
                    title: 'Analytics & Reports',
                    link: '/dashboard/analytics',
                },
                {
                    icon: MdFeedback,
                    title: 'Members Feedback',
                    link: '/dashboard/feedbacks',
                },
                {
                    icon: RiCustomerService2Fill,
                    title: 'Customer Support',
                    link: '/dashboard/customersupport',
                },
                {
                    icon: FaBoxOpen,
                    title: 'Logs',
                    link: '/dashboard/logs',
                },
            ]
        },
    ];

    return (
        <div className={`fixed top-0 right-0 backdrop-blur-md transition-all duration-500 z-40 
        ${isScrolled ? 'bg-white shadow-md' : 'bg-white'} 
        ${sidebarMinimized ? 'md:w-[calc(100%-80px)]' : 'md:w-[calc(100%-240px)]'} 
        w-full flex justify-between px-2 py-3 md:px-4 items-center`}>
            <div className='mx-4 flex items-center'>
                <div className="flex items-center gap-2" ref={searchRef}>
                    <FiSidebar
                        className='text-2xl text-blue-600 hidden md:flex cursor-pointer hover:text-blue-800 transition-colors'
                        onClick={minimizeSidebar}
                    />
                </div>

                {toast && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-fade-in"
                            onClick={() => setToast(false)}
                        ></div>

                        <div className="fixed top-4 right-4 z-50 animate-slide-in">
                            <div className={`relative flex items-start gap-3 px-4 py-3 bg-white shadow-lg border-l-[5px] rounded-xl
                            transition-all duration-300 ease-in-out w-80
                            ${responseType === 'Success' ? 'border-blue-500' : 'border-rose-500'}`}>

                                <div className={`flex items-center justify-center p-2 rounded-full 
                                    ${responseType === 'Success' ? 'bg-blue-100' : 'bg-rose-100'}`}>
                                    {responseType === 'Success' ? (
                                        <MdDone className="text-xl text-blue-600" />
                                    ) : (
                                        <MdError className="text-xl text-rose-600" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3 className={`text-base font-semibold mb-1
                                    ${responseType === 'Success' ? 'text-blue-800' : 'text-rose-800'}`}>
                                        {responseType === 'Success' ? "Success" : "Action required"}
                                    </h3>

                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {responseType === 'Success'
                                            ? (
                                                <div>
                                                    {successMessage.message}
                                                </div>
                                            )
                                            : (
                                                <div>
                                                    {errorMessage.message}
                                                </div>
                                            )
                                        }
                                    </p>

                                    <div className="mt-3 flex items-center gap-2">
                                        {responseType === 'Success' ? (
                                            <button className="text-xs font-medium text-blue-700 hover:text-blue-900 underline">
                                                Done
                                            </button>
                                        ) : (
                                            <button className="text-xs font-medium text-rose-700 hover:text-rose-900 underline">
                                                Retry Now
                                            </button>
                                        )}
                                        <span className="text-gray-400">|</span>
                                        <button
                                            className="text-xs font-medium text-gray-500 hover:text-gray-700 underline"
                                            onClick={() => setToast(false)}>
                                            Dismiss
                                        </button>
                                    </div>
                                </div>

                                <MdClose
                                    onClick={() => setToast(false)}
                                    className="cursor-pointer text-lg text-gray-400 hover:text-gray-600 transition mt-0.5"
                                />
                            </div>
                        </div>
                    </>
                )}

                <div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <div className="flex items-center">
                                <FiSidebar
                                    className='text-xl md:hidden flex cursor-pointer text-blue-600 hover:text-blue-800'
                                />
                            </div>
                        </SheetTrigger>
                        <SheetContent className="h-full flex flex-col bg-gray-900 text-white border-r border-gray-800">
                            <SheetHeader className="bg-gray-900 border-b border-gray-800 pb-3">
                                <SheetTitle>
                                    <Link href={'/dashboard'} className="flex justify-start py-2 items-center hover:bg-gray-800 rounded">
                                        <BiSolidDashboard className='text-3xl mx-2 text-start bg-blue-600 text-white p-1 rounded-md' />
                                        <div>
                                            <p className="w-full text-lg font-bold text-white">Revive Fitness</p>
                                            <p className="w-full text-[11px] font-bold text-blue-400">Starter</p>
                                        </div>
                                    </Link>
                                </SheetTitle>
                            </SheetHeader>

                            <div className="flex-grow overflow-y-auto">
                                <div className='h-full'>
                                    {/* Render categorized sidebar items in mobile view */}
                                    {sidebarContent.map((category, categoryIndex) => (
                                        <div key={categoryIndex} className="mb-2 mt-3">
                                            <p className='text-[11px] uppercase tracking-wider font-semibold text-gray-400 ml-3 mb-1'>{category.category}</p>
                                            <ul>
                                                {category.items.map((sidebar, index) => (
                                                    <li key={index} className="p-1">
                                                        {sidebar.subObj ? (
                                                            <Accordion type="single" collapsible className="w-full">
                                                                <AccordionItem value={`item-${categoryIndex}-${index}`}>
                                                                    <AccordionTrigger className="w-full flex items-center p-2 cursor-pointer text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors">
                                                                        <sidebar.icon className='text-xl text-blue-400' />
                                                                        <span className='text-start mx-2 text-sm font-medium'>{sidebar.title}</span>
                                                                    </AccordionTrigger>
                                                                    <div className="border-l border-gray-700 ml-6 flex flex-col">
                                                                        {sidebar.subObj.map((subItem, subIndex) => (
                                                                            <AccordionContent key={subIndex} className="flex items-center">
                                                                                <Link
                                                                                    href={subItem.link}
                                                                                    className="flex items-center text-gray-400 hover:text-white w-full pl-2 py-1 hover:bg-gray-800 rounded"
                                                                                >
                                                                                    <subItem.icon className="text-sm text-gray-400" />
                                                                                    <h1 className="mx-2 text-xs">{subItem.title}</h1>
                                                                                </Link>
                                                                            </AccordionContent>
                                                                        ))}
                                                                    </div>
                                                                </AccordionItem>
                                                            </Accordion>
                                                        ) : (
                                                            <Link href={sidebar.link} className="flex items-center p-2 cursor-pointer text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors">
                                                                <sidebar.icon className='text-xl text-blue-400' />
                                                                <span className='mx-2 text-sm font-medium'>{sidebar.title}</span>
                                                            </Link>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-3 border-t border-gray-800 mt-auto">
                                <div className="flex items-center hover:bg-gray-800 rounded cursor-pointer p-2">
                                    <FaUserCircle className="text-3xl mr-2 text-blue-400" />
                                    <div>
                                        <div className="flex items-center">
                                            <h1 className="text-sm text-gray-100">{user && user.user.firstName + ' ' + user.user.lastName || 'Admin'}</h1>
                                        </div>
                                        <p className="font-semibold text-[11px] text-gray-400">
                                            {user && user.user.email || ''}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    className='w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2'
                                    onClick={() => logoutUser()}
                                >
                                    <LogOut size={16} />
                                    {loading ? 'Processing...' : 'Log out'}
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Date/Time for mobile */}
            <div className="flex items-center md:hidden space-x-2">
                <div className="flex items-center bg-gray-100 rounded-md px-2 py-2">
                    <Calendar size={14} className="text-blue-600 mr-1" />
                    <h1 className="text-xs font-medium text-gray-700">{currentDateTime.date}</h1>
                </div>
                <div className="flex items-center bg-gray-100 rounded-md px-2 py-2">
                    <Clock size={14} className="text-blue-600 mr-1" />
                    <h1 className="text-xs font-medium text-gray-700">{currentDateTime.time}</h1>
                </div>
            </div>

            <div className='flex items-center space-x-2 md:space-x-4'>
                {/* Date/Time for desktop */}
                <div className="hidden items-center md:flex space-x-4">
                    <div className="flex items-center bg-gray-100 rounded-md px-3 py-2">
                        <Calendar size={16} className="text-blue-600 mr-2" />
                        <h1 className="text-sm font-medium text-gray-700">{currentDateTime.date}</h1>
                    </div>
                    <div className="flex items-center bg-gray-100 rounded-md px-3 py-2">
                        <Clock size={16} className="text-blue-600 mr-2" />
                        <h1 className="text-sm font-medium text-gray-700">{currentDateTime.time}</h1>
                    </div>
                </div>

                {/* Settings Dialog */}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <div className="bg-gray-100 hover:bg-gray-200 p-1 md:p-2 rounded-full transition-colors cursor-pointer">
                            <SettingsIcon size={20} className="text-blue-600" />
                        </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-2xl">
                        <AlertDialogHeader>
                            <div className='w-full flex justify-between items-center'>
                                <AlertDialogTitle className="text-xl font-bold text-blue-800">Settings</AlertDialogTitle>
                                <AlertDialogCancel className='border-none hover:bg-none hover:bg-transparent'>
                                    <IoClose className='text-xl text-gray-600 hover:text-gray-800' />
                                </AlertDialogCancel>
                            </div>
                            <Separator orientation="horizontal" className="my-2" />
                            <AlertDialogDescription className='h-[80vh]'>
                                <Settings />
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                    </AlertDialogContent>
                </AlertDialog>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className='cursor-pointer'>
                            <div className="bg-gray-100 hover:bg-gray-200 p-1 md:p-2 rounded-full transition-colors">
                                <FaUserCircle className="text-2xl text-blue-600" />
                            </div>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 mt-1 border border-gray-200 shadow-lg">
                        <DropdownMenuLabel className="font-medium text-gray-800">My Account</DropdownMenuLabel>
                        <div className="px-2 py-1.5 text-xs text-gray-500">
                            {user && user.user.email || 'admin@example.com'}
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="focus:bg-blue-50 focus:text-blue-700">
                                <Button className='space-x-2 w-full flex justify-center items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'>
                                    <PiStarFour />
                                    Upgrade Plan
                                </Button>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-blue-50 focus:text-blue-700">
                                <User className="mr-2 h-4 w-4 text-blue-600" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="focus:bg-blue-50 focus:text-blue-700">
                                <Users className="mr-2 h-4 w-4 text-blue-600" />
                                <span>Team</span>
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuSeparator />
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuItem className="focus:bg-blue-50 focus:text-blue-700">
                                <Plus className="mr-2 h-4 w-4 text-blue-600" />
                                <span>New Team</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => logoutUser()}
                            className="focus:bg-blue-50 focus:text-blue-700 text-red-600 font-medium"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span className="cursor-pointer">{loading ? 'Processing...' : "Log out"}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

export default Header;