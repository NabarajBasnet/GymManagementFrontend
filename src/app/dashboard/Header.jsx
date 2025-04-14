"use client";

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
            title: 'Members',
            link: '/dashboard/members',
            subObj: [
                { icon: PiUsersFourFill, title: 'All Members', link: '/dashboard/members' },
                { icon: PiUsersThreeBold, title: 'Inactive Members', link: '/dashboard/members/inactivemembers' },
                { icon: FaUsersRays, title: 'Paused Members', link: '/dashboard/members/pausedmembers' }
            ]
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
            subObj: [
                { icon: IoPeopleSharp, title: 'Staffs', link: '/dashboard/staffmanagement/staffs' },
                { icon: FcParallelTasks, title: 'Task Management', link: '/dashboard/staffmanagement/taskmanagement' },
            ]
        },
        {
            icon: MdPayments,
            title: 'Payment Details',
            link: '/dashboard/paymentdetails',
        },
        {
            icon: GiBiceps,
            title: 'Personal Training',
            link: '/dashboard/personaltraining',
            subObj: [
                { icon: GiBiceps, title: 'Book Personal Training', link: '/dashboard/personaltraining/booktraining' }
            ]
        },
        {
            icon: MdPayments,
            title: 'Billing',
            link: '/dashboard/billing',
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
            icon: FaBoxOpen,
            title: 'Logs',
            link: '/dashboard/logs',
        },
    ];

    return (
        <div className={`fixed top-0 right-0 backdrop-blur-md transition-all duration-500 z-40 
    ${isScrolled ? 'bg-white border-b border-gray-400' : 'bg-white'} 
    ${sidebarMinimized ? 'md:w-[calc(100%-48px)]' : 'md:w-[calc(100%-240px)]'} 
    w-full flex justify-between py-4 px-4 items-center`}>
            <div className='mx-4'>
                <div className="flex items-center gap-2" ref={searchRef}>
                    <FiSidebar
                        className='text-2xl text-gray-800 hidden md:flex cursor-pointer'
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
                            ${responseType === 'Success' ? 'border-emerald-500' : 'border-rose-500'}`}>

                                <div className={`flex items-center justify-center p-2 rounded-full 
                                    ${responseType === 'Success' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                                    {responseType === 'Success' ? (
                                        <MdDone className="text-xl text-emerald-600" />
                                    ) : (
                                        <MdError className="text-xl text-rose-600" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3 className={`text-base font-semibold mb-1
                                    ${responseType === 'Success' ? 'text-emerald-800' : 'text-rose-800'}`}>
                                        {responseType === 'Success' ? "Successfully sent!" : "Action required"}
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
                                            <button className="text-xs font-medium text-emerald-700 hover:text-emerald-900 underline">
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
                                    className='text-xl md:hidden flex cursor-pointer'
                                />
                            </div>
                        </SheetTrigger>
                        <SheetContent className="h-full flex flex-col">
                            <SheetHeader className="bg-white">
                                <SheetTitle>
                                    <Link href={'/dashboard'} className="flex justify-start py-2 items-center hover:bg-gray-50">
                                        <BiSolidDashboard className='text-3xl mx-2 text-start bg-gray-800 text-white p-1 rounded-md' />
                                        <div>
                                            <p className="w-full text-lg font-bold text-gray-600">Revive Fitness</p>
                                            <p className="w-full text-[11px] font-bold text-blue-600">Starter</p>
                                        </div>
                                    </Link>
                                </SheetTitle>
                            </SheetHeader>

                            <div className="flex-grow overflow-y-auto">
                                <div className='h-full'>
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
                                                <div className="flex items-center">
                                                    <h1 className="text-sm text-gray-700 hover:text-gray-800">{user && user.user.firstName + ' ' + user.user.lastName || 'Admin'}</h1>
                                                </div>
                                                <p className="font-semibold text-[11px] text-gray-700 hover:text-gray-800">
                                                    {user && user.user.email || ''}
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
                            <AlertDialogDescription className='h-[80vh]'>
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
                                <Button className='space-x-2 flex justify-between items-center bg-gradient-to-r from-pink-700 to-purple-700'>
                                    <PiStarFour />
                                    Upgrade Plan
                                </Button>
                            </DropdownMenuItem>
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
