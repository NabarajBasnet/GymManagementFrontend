'use client';

import {
    LogOut,
    Settings,
    User,
    UserPlus,
    Users,
    Plus,
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
import { FaUsers, FaMoneyCheckAlt, FaRegUser, FaBox, FaChartLine, FaTags, FaCog, FaDumbbell } from 'react-icons/fa';
import { MdPayments, MdFitnessCenter, MdEventAvailable } from 'react-icons/md';
import { AiOutlineSchedule } from 'react-icons/ai';
import Link from 'next/link';
import { FaUsersGear } from "react-icons/fa6";
import { RiDashboard3Fill } from "react-icons/ri";
import { ToggleAdminSidebar, MinimizeSidebar } from '@/state/slicer';
import { useRouter } from "next/navigation";
import { MdDelete, MdError, MdClose, MdDone } from "react-icons/md";
import { useState } from "react";

const Sidebar = () => {

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
    ];


    return (
        <div className={`fixed left-0 transition-all duration-500 top-0 h-full ${sidebarMinimized ? 'w-12' : 'w-60'} z-20 flex bg-gray-800 flex-col`}
            onMouseEnter={() => minimizeSidebar()}
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
            <Link href={'/dashboard'} className="flex justify-start py-4">
                <RiDashboard3Fill className='text-3xl mx-2 text-white' />
                {
                    sidebarMinimized ? (
                        <></>
                    ) : (
                        <span className="text-white w-full text-2xl font-bold">Revive Fitness</span>
                    )
                }
            </Link>
            <div className="flex-grow overflow-y-auto ::-webkit-scrollbar ::-webkit-scrollbar-track ::-webkit-scrollbar-thumb ::-webkit-scrollbar-thumb:hover">
                <ul>
                    {sidebarContent.map((sidebar, index) => (
                        <li key={index} className="p-1">
                            {sidebar.subObj ? (
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value={`item-${index}`}>
                                        <AccordionTrigger className="w-full flex items-center p-2 text-white cursor-pointer hover:bg-gray-700 transition-colors">
                                            <sidebar.icon className='text-xl text-yellow-400' />
                                            {
                                                sidebarMinimized ? (
                                                    <></>
                                                ) : (
                                                    <h1 className='text-start mx-2 text-sm font-semibold'>{sidebar.title}</h1>
                                                )
                                            }
                                        </AccordionTrigger>
                                        {sidebar.subObj.map((subItem, subIndex) => (
                                            <AccordionContent key={subIndex}>
                                                <Link href={subItem.link} className="flex items-center ml-6 p-1 text-gray-300 hover:text-white">
                                                    <subItem.icon className='text-lg text-yellow-300' />
                                                    {
                                                        sidebarMinimized ? (
                                                            <></>
                                                        ) : (
                                                            <h1 className='mx-2 text-sm font-semibold'>{subItem.title}</h1>
                                                        )
                                                    }
                                                </Link>
                                            </AccordionContent>
                                        ))}
                                    </AccordionItem>
                                </Accordion>
                            ) : (
                                <Link href={sidebar.link} className="flex items-center p-2 text-white cursor-pointer hover:bg-gray-700 transition-colors">
                                    <sidebar.icon className='text-xl text-yellow-400' />
                                    {
                                        sidebarMinimized ? (
                                            <></>
                                        ) : (
                                            <h1 className='mx-2 text-sm font-semibold'>{sidebar.title}</h1>
                                        )
                                    }
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className='flex items-center cursor-pointer p-2 hover:bg-gray-700'>
                        <FaUserCircle className="text-3xl mr-2 text-white" />
                        {
                            sidebarMinimized ? (
                                <>
                                </>
                            ) : (
                                <div>
                                    <h1 className='font-bold text-sm text-white'>Revive Fitness</h1>
                                    <p className='font-semibold text-[11px] text-white'>revivefitness.np@gmail.com</p>
                                </div>
                            )
                        }
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
                        <DropdownMenuItem>
                            <Settings />
                            <span>Settings</span>
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
    );
};

export default Sidebar;
