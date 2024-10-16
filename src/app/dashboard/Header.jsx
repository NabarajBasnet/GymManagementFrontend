"use client";

import { IoSearch } from "react-icons/io5";
import Badge from '@mui/material/Badge';
import { IoIosNotifications } from "react-icons/io";
import '../globals.css'
import { RiAccountCircleFill } from "react-icons/ri";
import React, { useEffect, useRef, useState } from 'react';
import { IoMenuSharp } from "react-icons/io5";
import { ToggleAdminSidebar, MinimizeSidebar } from '@/state/slicer';
import { useDispatch } from 'react-redux';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/DashboardUI/MobileSidebar";
import Link from "next/link";
import { useSelector } from 'react-redux';
import '../globals.css'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/DashboardUI/SidebarAccrodin";
import { RiDashboard2Line, RiUserUnfollowFill, RiCustomerService2Fill, RiRunLine } from 'react-icons/ri';
import { BiSolidUserCheck } from 'react-icons/bi';
import { GiLockers, GiBiceps } from 'react-icons/gi';
import { TiUserAdd } from 'react-icons/ti';
import { FaUsers, FaMoneyCheckAlt, FaRegUser, FaBox, FaChartLine, FaTags, FaCog, FaDumbbell } from 'react-icons/fa';
import { MdPayments, MdFitnessCenter, MdEventAvailable } from 'react-icons/md';
import { AiOutlineSchedule } from 'react-icons/ai';
import { FaUsersGear } from "react-icons/fa6";
import { RiDashboard3Fill } from "react-icons/ri";
import { Input } from "@/components/ui/input";

const Header = () => {
    const sidebarMinimized = useSelector(state => state.rtkreducer.sidebarMinimized);
    const dispatch = useDispatch();
    const searchRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [renderSearchDropdown, setRenderSearchDropdown] = useState(false);

    console.log('Search Ref: ', searchRef);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setRenderSearchDropdown(false);
            };
        };

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [searchRef]);

    const minimizeSidebar = () => {
        dispatch(MinimizeSidebar());
    }

    const recentSearches = [
        'Gym Management',
        'Personal Training',
        'New Member Registration',
        'Payment Details',
    ];

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
        <div className={`fixed top-0 right-0 transition-all duration-500 ${sidebarMinimized ? 'md:w-[calc(100%-48px)] w-full' : 'md:w-[calc(100%-240px)]'} w-full flex justify-between py-4 items-center backdrop-blur-sm bg-white bg-opacity-70 z-50`}>
            <div className='mx-4'>
                <div className="flex items-center" ref={searchRef}>
                    <IoMenuSharp
                        className='text-3xl text-gray-800 hidden md:flex cursor-pointer'
                        onClick={minimizeSidebar}
                    />
                    <div className="w-full hidden md:flex justify-center relative">
                        <div className="w-full px-4 flex justify-between border border-gray-400 rounded-none items-center">
                            <IoSearch className="text-xl" />
                            <Input
                                onFocus={() => setRenderSearchDropdown(true)}
                                className='w-full border-none bg-none bg-transparent'
                                placeholder='Search Member...'
                            />
                        </div>
                        {
                            renderSearchDropdown && (
                                <div className="w-full absolute top-full max-h-72 border bg-white shadow-xl overflow-y-auto z-10" style={{ left: 0 }}>
                                    {
                                        recentSearches.map((item, index) => (
                                            <div
                                                key={index}
                                                className="hover:bg-gray-200 px-4 py-2 cursor-pointer"
                                                onClick={() => setRenderSearchDropdown(!renderSearchDropdown)}>
                                                <p>{item}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
                <div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <div className="flex items-center">
                                <IoMenuSharp
                                    className='text-3xl md:hidden flex text-blue-600 cursor-pointer'
                                />
                            </div>
                        </SheetTrigger>
                        <SheetContent className="h-full flex flex-col">
                            <SheetHeader className="bg-white">
                                <SheetTitle>
                                    <Link href={'/dashboard'} className="flex justify-start py-3 bg-blue-600">
                                        <RiDashboard3Fill className='text-4xl mx-2 text-white' />
                                        <span className="text-white w-full text-2xl font-bold">Dashboard</span>
                                    </Link>
                                </SheetTitle>
                            </SheetHeader>

                            <SheetDescription className="flex-grow overflow-y-auto">
                                <div className='min-h-screen'>
                                    <ul>
                                        {sidebarContent.map((sidebar, index) => (
                                            <li key={index} className="p-1">
                                                {sidebar.subObj ? (
                                                    <Accordion type="single" collapsible className="w-full">
                                                        <AccordionItem value={`item-${index}`}>
                                                            <AccordionTrigger className="w-full flex items-center p-2 cursor-pointer hover:bg-gray-100 transition-colors">
                                                                <sidebar.icon className='text-xl' />
                                                                <h1 className='text-start mx-2 text-sm font-semibold'>{sidebar.title}</h1>
                                                            </AccordionTrigger>
                                                            {sidebar.subObj.map((subItem, subIndex) => (
                                                                <AccordionContent key={subIndex}>
                                                                    <Link href={subItem.link} className="flex items-center ml-6 p-1">
                                                                        <subItem.icon className='text-lg' />
                                                                        <h1 className='mx-2 text-sm font-semibold'>{subItem.title}</h1>
                                                                    </Link>
                                                                </AccordionContent>
                                                            ))}
                                                        </AccordionItem>
                                                    </Accordion>
                                                ) : (
                                                    <Link href={sidebar.link} className="flex items-center p-2 cursor-pointer hover:bg-gray-100 transition-colors">
                                                        <sidebar.icon className='text-xl' />
                                                        <h1 className='mx-2 text-sm font-semibold'>{sidebar.title}</h1>
                                                    </Link>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </SheetDescription>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <div className="w-full md:hidden flex justify-center" ref={searchRef}>
                <div className="w-full relative flex justify-between border border-gray-400 rounded-none items-center">
                    <div className="w-full flex items-center">
                        <IoSearch className="text-xl" />
                        <Input
                            onFocus={() => setRenderSearchDropdown(true)}
                            className='w-full border-none bg-none bg-transparent'
                            placeholder='Search Member Mobile...'
                        />
                    </div>
                    {
                        renderSearchDropdown && (
                            <div className="w-full absolute top-full max-h-72 bg-white shadow-2xl border border-gray-300">
                                {
                                    recentSearches.map((item, index) => (
                                        <div
                                            onClick={() => setRenderSearchDropdown(true)}
                                            key={index}
                                            className="hover:bg-gray-300 cursor-pointer">
                                            <p className="px-4 py-2 text-sm font-semibold text-red-600">{item}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }
                </div>
            </div>

            <div className='flex items-center'>
                <Badge badgeContent={4} color="primary">
                    <IoIosNotifications
                        className='text-3xl text-gray-800 cursor-pointer'
                        onClick={minimizeSidebar}
                    />
                </Badge>

                <div className='mx-4'>
                    <RiAccountCircleFill
                        className='text-3xl text-gray-800 cursor-pointer'
                        onClick={minimizeSidebar}
                    />
                </div>
            </div>
        </div>
    );
}

export default Header;
