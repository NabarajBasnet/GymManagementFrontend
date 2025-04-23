'use client';

import { IoPeopleSharp } from "react-icons/io5";
import { FcParallelTasks } from "react-icons/fc";
import { FaUsersRays } from "react-icons/fa6";
import { PiUsersFourFill, PiUsersThreeBold } from "react-icons/pi";
import { PiStarFour } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { FaBoxOpen } from "react-icons/fa";
import { HiChevronUpDown } from "react-icons/hi2";
import { BiSolidDashboard } from "react-icons/bi";
import {
    ChevronsUpDown,
    LogOut,
    Settings,
    User,
    UserPlus,
    Users,
    Plus,
    FileBarChart,
    Calendar,
    Tag,
    Box,
} from "lucide-react";
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
import { FaUserCircle } from "react-icons/fa";
import { HiUsers } from "react-icons/hi2";
import { useSelector, useDispatch } from 'react-redux';
import '../globals.css'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/DashboardUI/SidebarAccrodin";
import React from 'react';
import { RiDashboard2Line, RiUserUnfollowFill, RiCustomerService2Fill, RiRunLine } from 'react-icons/ri';
import { BiSolidUserCheck } from 'react-icons/bi';
import { GiLockers, GiBiceps } from 'react-icons/gi';
import { TiUserAdd } from 'react-icons/ti';
import { FaUsers, FaMoneyCheckAlt, FaRegUser, FaBox, FaChartLine, FaTags, FaCog, FaDumbbell, FaCalendarAlt, FaTicketAlt, FaClipboardList, FaUserCog } from 'react-icons/fa';
import { MdPayments, MdFitnessCenter, MdEventAvailable, MdAttachMoney, MdSupportAgent } from 'react-icons/md';
import { AiOutlineSchedule } from 'react-icons/ai';
import Link from 'next/link';
import { FaUsersGear } from "react-icons/fa6";
import { RiDashboard3Fill } from "react-icons/ri";
import { ToggleAdminSidebar, MinimizeSidebar } from '@/state/slicer';
import { useRouter } from "next/navigation";
import { MdDelete, MdError, MdClose, MdDone } from "react-icons/md";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/components/Providers/LoggedInUserProvider";

const Sidebar = () => {

    const { user } = useUser();

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [toast, setToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState({ icon: MdDone, message: '' });
    const [errorMessage, setErrorMessage] = useState({ icon: MdError, message: '' });
    const [responseType, setResponseType] = useState('')

    const logoutUser = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/auth/logout`, {
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

    const dispatch = useDispatch();
    const adminSidebar = useSelector(state => state.rtkreducer.adminSidebar);
    const sidebarMinimized = useSelector(state => state.rtkreducer.sidebarMinimized);

    const minimizeSidebar = () => {
        if (sidebarMinimized) {
            dispatch(MinimizeSidebar());
        }
    }

    // Categorized sidebar content
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
                    icon: BiSolidUserCheck,
                    title: 'Attendance',
                    link: '/dashboard/attendance/memberattendance',
                    subObj: [
                        { icon: FaRegUser, title: 'Member Attendance', link: '/dashboard/attendance/memberattendance' },
                        { icon: FaUserCog, title: 'Staff Attendance', link: '/dashboard/attendance/staffattendance' },
                        { icon: FaClipboardList, title: 'Attendance History', link: '/dashboard/attendance/attendancehistory' }
                    ]
                },
                {
                    icon: FaMoneyCheckAlt,
                    title: 'Membership Plans',
                    link: '/dashboard/membershipplans',
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
                    title: 'Payment Details',
                    link: '/dashboard/paymentdetails',
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
        <div
            onClick={() => setToast(false)}
            className={`fixed left-0 transition-all bg-gray-100 duration-500 rounded-none top-0 h-full ${sidebarMinimized ? 'w-12' : 'w-60'} z-20 flex border-r flex-col`}
        >
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

            <Link href={'/dashboard'} className="flex py-3 items-center">
                <BiSolidDashboard className='text-3xl mx-2 text-start bg-blue-600 text-white p-1 rounded-md' />
                <div className="">
                    {sidebarMinimized ? (
                        <></>
                    ) : (
                        <span>
                            <p className="w-full text-md font-bold text-gray-900">Revive Fitness</p>
                            <p className="w-full text-[10px] font-semibold text-blue-400">Starter</p>
                        </span>
                    )}
                </div>
            </Link>

            <div className="flex-grow overflow-y-auto ::-webkit-scrollbar ::-webkit-scrollbar-track ::-webkit-scrollbar-thumb ::-webkit-scrollbar-thumb:hover">
                {/* Render categorized sidebar items */}
                {sidebarContent.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="mb-1">
                        {!sidebarMinimized && (
                            <p className='text-[11px] uppercase tracking-wider font-bold text-black ml-3 mt-3 mb-1'>{category.category}</p>
                        )}
                        <ul>
                            {category.items.map((sidebar, index) => (
                                <li key={index} className="p-1">
                                    {sidebar.subObj ? (
                                        <Accordion type="single" collapsible className="w-full py-1">
                                            <AccordionItem value={`item-${categoryIndex}-${index}`}>
                                                <AccordionTrigger className="w-full flex items-center px-2 text-gray-800 hover:text-black rounded cursor-pointer transition-colors font-normal">
                                                    <sidebar.icon className='text-xl text-blue-500 hover:text-blue-300' />
                                                    {
                                                        sidebarMinimized ? (
                                                            <></>
                                                        ) : (
                                                            <h1 className='text-start mx-2 text-sm font-medium'>{sidebar.title}</h1>
                                                        )
                                                    }
                                                </AccordionTrigger>
                                                <div className="border-l border-gray-700 ml-6 flex flex-col">
                                                    {sidebar.subObj.map((subItem, subIndex) => (
                                                        <AccordionContent key={subIndex} className="flex items-center">
                                                            <Link
                                                                href={subItem.link}
                                                                className="flex items-center text-gray-800 hover:text-blue-600 w-full pl-2 py-1 rounded"
                                                            >
                                                                <subItem.icon className="text-sm text-gray-800 hover:text-blue-600" />
                                                                {!sidebarMinimized && (
                                                                    <h1 className="mx-2 text-xs">{subItem.title}</h1>
                                                                )}
                                                            </Link>
                                                        </AccordionContent>
                                                    ))}
                                                </div>
                                            </AccordionItem>
                                        </Accordion>
                                    ) : (
                                        <Link href={sidebar.link} className="flex items-center p-2 text-gray-800 hover:text-black cursor-pointer rounded transition-colors">
                                            <sidebar.icon className='text-xl text-blue-600' />
                                            {
                                                sidebarMinimized ? (
                                                    <></>
                                                ) : (
                                                    <h1 className='mx-2 text-sm font-medium'>{sidebar.title}</h1>
                                                )
                                            }
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="flex items-center hover:bg-gray-800 cursor-pointer p-2 border-t border-gray-800">
                        <FaUserCircle className="text-3xl mr-2 text-blue-400" />
                        {sidebarMinimized ? null : (
                            <div>
                                <div className="flex items-center">
                                    <h1 className="text-sm text-gray-100 hover:text-white">{user && user.user.firstName + ' ' + user.user.lastName || 'Admin'}</h1>
                                </div>
                                <p className="font-semibold text-[11px] text-gray-400 hover:text-gray-300">
                                    {user && user.user.email || ''}
                                </p>
                            </div>
                        )}
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-900 text-gray-200 border-gray-700" side="right" align="start">
                    <DropdownMenuLabel className="text-gray-300">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuGroup>
                        <DropdownMenuItem className="focus:bg-gray-800 focus:text-white">
                            <Button className='space-x-2 flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'>
                                <PiStarFour />
                                Upgrade Plan
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-gray-800 focus:text-white">
                            <User className="text-blue-400 mr-2" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuGroup>
                        <DropdownMenuItem className="focus:bg-gray-800 focus:text-white">
                            <Settings className="text-blue-400 mr-2" />
                            <a href='/settings'>Settings</a>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuGroup>
                        <DropdownMenuItem className="focus:bg-gray-800 focus:text-white">
                            <Users className="text-blue-400 mr-2" />
                            <span>Team</span>
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent className="bg-gray-900 text-gray-200 border-gray-700">
                                    <DropdownMenuSeparator className="bg-gray-700" />
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem className="focus:bg-gray-800 focus:text-white">
                            <Plus className="text-blue-400 mr-2" />
                            <span>New Team</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem onClick={() => logoutUser()} className="focus:bg-gray-800 focus:text-white">
                        <LogOut className="text-blue-400 mr-2" />
                        <span className="cursor-pointer">{loading ? 'Processing...' : 'Log out'}</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default Sidebar;