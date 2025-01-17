"use client";

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
import { FiSidebar } from "react-icons/fi";
import { MdError, MdClose, MdDone } from "react-icons/md";
import { useRouter } from "next/navigation";
import {
    LogOut,
    Plus,
    User,
    Users,
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
import { RiUserUnfollowFill, RiCustomerService2Fill, RiRunLine } from 'react-icons/ri';
import { BiSolidUserCheck } from 'react-icons/bi';
import { GiLockers, GiBiceps } from 'react-icons/gi';
import { TiUserAdd } from 'react-icons/ti';
import { FaUsers, FaMoneyCheckAlt, FaChartLine, FaTags, FaCog } from 'react-icons/fa';
import { MdPayments } from 'react-icons/md';
import { AiOutlineSchedule } from 'react-icons/ai';
import { FaUsersGear } from "react-icons/fa6";

const Header = () => {

    const sidebarMinimized = useSelector(state => state.rtkreducer.sidebarMinimized);
    const dispatch = useDispatch();
    const searchRef = useRef(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [toast, setToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState({ icon: MdDone, message: '' });
    const [errorMessage, setErrorMessage] = useState({ icon: MdError, message: '' });
    const [responseType, setResponseType] = useState('')

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

    const minimizeSidebar = () => {
        dispatch(MinimizeSidebar());
    };

    const logoutUser = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/auth/logout`, {
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
                setResponseType(responseResultType[0]);
                setToast(true);
                setTimeout(() => {
                    setToast(false);
                }, 6000);
                setSuccessMessage({
                    icon: MdDone,
                    message: responseBody.message
                })
                router.push("/login");
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

    const sidebarContent = [
        {
            icon: FaMoneyCheckAlt,
            title: 'Membership Plans',
            link: '/dashboard/membershipplans',
        },
        {
            icon: BiSolidUserCheck,
            title: 'Attendance',
            link: '/dashboard/attendance/memberattendance',
            subObj: [
                { icon: BiSolidUserCheck, title: 'Member Attendance', link: '/dashboard/attendance/memberattendance' },
                { icon: BiSolidUserCheck, title: 'Staff Attendance', link: '/dashboard/attendance/staffattendance' },
                { icon: BiSolidUserCheck, title: 'Attendance History', link: '/dashboard/attendance/attendancehistory' }
            ]
        },
        {
            icon: GiLockers,
            title: 'Lockers',
            link: '/dashboard/lockers',
        },
        {
            icon: TiUserAdd,
            title: 'New Member',
            link: '/dashboard/newmember',
        },
        {
            icon: FaUsers,
            title: 'All Members',
            link: '/dashboard/allmembers',
        },
        {
            icon: HiUsers,
            title: 'Users',
            link: '/dashboard/users',
        },
        {
            icon: FaUsersGear,
            title: 'Staff Management',
            link: '/dashboard/staffmanagement',
        },
        {
            icon: GiBiceps,
            title: 'Personal Training',
            link: '/dashboard/personaltraining',
            subObj: [
                { icon: RiRunLine, title: 'Trainer Availability', link: '/dashboard/personaltraining/traineravailability' },
                { icon: GiBiceps, title: 'Book Personal Trainer', link: '/dashboard/personaltraining/booktrainer' }
            ]
        },
        {
            icon: MdPayments,
            title: 'Payment Details',
            link: '/dashboard/paymentdetails',
        },
        {
            icon: RiUserUnfollowFill,
            title: 'Expired Memberships',
            link: '/dashboard/expiredmemberships',
        },
        {
            icon: RiCustomerService2Fill,
            title: 'Customer Support',
            link: '/dashboard/customersupport',
        },
        {
            icon: FaChartLine,
            title: 'Analytics & Reports',
            link: '/dashboard/analytics',
        },
        {
            icon: AiOutlineSchedule,
            title: 'Schedule Management',
            link: '/dashboard/schedulemanagement',
        },
        {
            icon: FaTags,
            title: 'Promotions & Offers',
            link: '/dashboard/promotions',
        },
        {
            icon: FaCog,
            title: 'Settings',
            link: '/dashboard/settings',
        },
        {
            icon: FaBoxOpen,
            title: 'Logs',
            link: '/dashboard/logs',
        },
    ];

    return (
        <div
            onClick={() => setToast(false)}
            className={`fixed top-0 right-0 transition-all duration-500 ${sidebarMinimized ? 'md:w-[calc(100%-48px)] w-full' : 'md:w-[calc(100%-240px)]'} w-full flex justify-between py-4 px-4 items-center backdrop-blur-sm bg-opacity-60 z-50`}>
            <div className='mx-4'>
                <div className="flex items-center gap-2" ref={searchRef}>
                    <FiSidebar
                        className='text-2xl text-gray-800 hidden md:flex cursor-pointer'
                        onClick={minimizeSidebar}
                    />
                </div>
                {toast ? (
                    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 z-[1000] flex items-center justify-between bg-white border shadow-2xl p-4 rounded">
                        <div>
                            {responseType === 'Success' ? (
                                <MdDone className="text-3xl mx-4 text-green-600" />
                            ) : (
                                <MdError className="text-3xl mx-4 text-red-600" />
                            )}
                        </div>
                        <div className="block">
                            {responseType === 'Success' ? (
                                <p className="text-sm font-semibold text-green-600">{successMessage.message}</p>
                            ) : (
                                <p className="text-sm font-semibold text-red-600">{errorMessage.message}</p>
                            )}
                        </div>
                        <div>
                            <MdClose
                                onClick={() => setToast(false)}
                                className="cursor-pointer text-3xl ml-4"
                            />
                        </div>
                    </div>
                ) : null}
                <div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <div className="flex items-center">
                                <FiSidebar
                                    className='text-xl md:hidden flex cursor-pointer'
                                />
                            </div>
                        </SheetTrigger>
                        <SheetContent className="h-full flex flex-col">
                            <SheetHeader className="bg-white">
                                <SheetTitle>
                                    <Link href={'/dashboard'} className="flex justify-start py-3 hover:bg-gray-50">
                                        <BiSolidDashboard className='text-3xl mx-2 text-start bg-gray-800 text-white p-1 rounded-md' />
                                        <span className="w-full text-lg font-bold">Revive Fitness</span>
                                    </Link>
                                </SheetTitle>
                            </SheetHeader>

                            <div className="flex-grow overflow-y-auto">
                                <div className='min-h-screen'>
                                    <ul>
                                        {sidebarContent.map((sidebar, index) => (
                                            <li key={index} className="p-1">
                                                {sidebar.subObj ? (
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem value={`item-${index}`}>
                                                            <AccordionTrigger className="w-full flex items-center p-2 cursor-pointer hover:bg-gray-100 transition-colors">
                                                                <sidebar.icon className='text-xl' />
                                                                <span className='text-start mx-2 text-sm font-semibold'>{sidebar.title}</span>
                                                            </AccordionTrigger>
                                                            <div className="border-l ml-6 flex flex-col">
                                                                {sidebar.subObj.map((subItem, subIndex) => (
                                                                    <AccordionContent key={subIndex} className="flex items-center">
                                                                        <Link
                                                                            href={subItem.link}
                                                                            className="flex items-center text-gray-600 hover:text-gray-800 w-full"
                                                                        >
                                                                            {!sidebarMinimized && (
                                                                                <h1 className="mx-2 text-sm">{subItem.title}</h1>
                                                                            )}
                                                                        </Link>
                                                                    </AccordionContent>
                                                                ))}
                                                            </div>
                                                        </AccordionItem>
                                                    </Accordion>
                                                ) : (
                                                    <Link href={sidebar.link} className="flex items-center p-2 cursor-pointer hover:bg-gray-100 transition-colors">
                                                        <sidebar.icon className='text-xl' />
                                                        <span className='mx-2 text-sm font-semibold'>{sidebar.title}</span>
                                                    </Link>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex items-center hover:bg-gray-50 cursor-pointer p-2">
                                        <FaUserCircle className="text-3xl mr-2" />
                                        {sidebarMinimized ? null : (
                                            <div>
                                                <h1 className="font-bold text-sm text-gray-700 hover:text-gray-800">Revive Fitness</h1>
                                                <p className="font-semibold text-[11px] text-gray-700 hover:text-gray-800">
                                                    revivefitness.np@gmail.com
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" side="right" align="start">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            <User />
                                            <span>Profile</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Settings />
                                            <a href='/settings'>Settings</a>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            <Users />
                                            <span>Team</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSub>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent>
                                                    <DropdownMenuSeparator />
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                        <DropdownMenuItem>
                                            <Plus />
                                            <span>New Team</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => logoutUser()}>
                                        <LogOut />
                                        <span className="cursor-pointer">{loading ? 'Processing...' : 'Log out'}</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <div className="flex items-center md:hidden space-x-8">
                <h1 className="text-sm font-bold">{currentDateTime.date}</h1>
                <h1 className="text-sm font-bold">{currentDateTime.time}</h1>
            </div>

            <div className='flex items-center space-x-4'>

                <div className="hidden items-center md:flex space-x-4">
                    <h1 className="text-sm font-bold">{currentDateTime.date}</h1>
                    <h1 className="text-sm font-bold">{currentDateTime.time}</h1>
                </div>

                <Badge badgeContent={2} color="primary">
                    <IoIosNotifications
                        className='text-2xl text-gray-800 cursor-pointer'
                    />
                </Badge>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <IoMdSettings
                            className='text-2xl text-gray-800 cursor-pointer'
                        />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <div className='w-full flex justify-between items-center'>
                                <AlertDialogTitle>Settings</AlertDialogTitle>
                                <AlertDialogCancel className='border-none hover:bg-none hover:bg-transparent'>
                                    <IoClose className='text-xl' />
                                </AlertDialogCancel>
                            </div>
                            <Separator orientation="horizontal" />
                            <AlertDialogDescription>
                                <Settings />
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                    </AlertDialogContent>
                </AlertDialog>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className='mx-4'>
                            <RiAccountCircleFill
                                className='text-3xl text-gray-800 cursor-pointer'
                            />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <User />
                                <span>Profile</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Users />
                                <span>Team</span>
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuSeparator />
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuItem>
                                <Plus />
                                <span>New Team</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => logoutUser()}>
                            <LogOut />
                            <span className="cursor-pointer">{loading ? 'Processing...' : "Log out"}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

export default Header;
