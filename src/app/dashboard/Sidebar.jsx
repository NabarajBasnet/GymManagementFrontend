'use client';

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


const Sidebar = () => {

    const dispatch = useDispatch();
    const adminSidebar = useSelector(state => state.rtkreducer.adminSidebar);
    const sidebarMinimized = useSelector(state => state.rtkreducer.sidebarMinimized);

    const minimizeSidebar = () => {
        dispatch(MinimizeSidebar());
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
            icon: MdPayments,
            title: 'Payment Details',
            link: '/dashboard/paymentdetails',
        },
        {
            icon: FaUsersGear,
            title: 'Staff Management',
            link: '/dashboard/staffmanagement',
            subObj: [
                { icon: FaUsersGear, title: 'Trainer Management', link: '/dashboard/staffmanagement/trainermanagement' },
                { icon: FaUsersGear, title: 'Staff Scheduling', link: '/dashboard/staffmanagement/staffscheduling' },
                { icon: FaUsersGear, title: 'All Staffs', link: '/dashboard/staffmanagement/allstaffs' }
            ]
        },
        {
            icon: RiUserUnfollowFill,
            title: 'Expired Memberships',
            link: '/dashboard/expiredmemberships',
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
        <div className={`fixed left-0 transition-all duration-500 top-0 h-full ${sidebarMinimized ? 'w-12' : 'w-60'} bg-gray-800 flex flex-col`}
            onMouseEnter={() => minimizeSidebar()}
        >
            <Link href={'/dashboard'} className="flex justify-start py-4 bg-blue-600">
                <RiDashboard3Fill className='text-4xl mx-2 text-white' />
                {
                    sidebarMinimized ? (
                        <></>
                    ) : (
                        <span className="text-white w-full text-2xl font-bold">Dashboard</span>
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
        </div>
    );
};

export default Sidebar;
