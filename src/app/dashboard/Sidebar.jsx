'use client';

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


const Sidebar = () => {

    const sidebarContent = [
        {
            icon: FaMoneyCheckAlt,
            title: 'Membership Plans',
            link: '/dashboard/membershipplans',
        },
        {
            icon: BiSolidUserCheck,
            title: 'Attendance',
            link: '/dashboard/attendance',
            subObj: [
                { icon: BiSolidUserCheck, title: 'Member Attendance', link: '/dashboard/memberattendance' },
                { icon: BiSolidUserCheck, title: 'Staff Attendance', link: '/dashboard/staffattendance' },
                { icon: BiSolidUserCheck, title: 'Guest Attendance', link: '/dashboard/guestattendance' }
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
                { icon: FaUsersGear, title: 'Trainer Management', link: '/dashboard/trainermanagement' },
                { icon: FaUsersGear, title: 'Staff Scheduling', link: '/dashboard/staffscheduling' }
            ]
        },
        {
            icon: RiUserUnfollowFill,
            title: 'Expired Memberships',
            link: '/dashboard/expiredmemberships',
        },
        {
            icon: MdEventAvailable,
            title: 'Class Scheduling',
            link: '/dashboard/classscheduling',
            subObj: [
                { icon: MdEventAvailable, title: 'Yoga Classes', link: '/dashboard/yogaclasses' },
                { icon: MdEventAvailable, title: 'Spinning Classes', link: '/dashboard/spinningclasses' },
                { icon: MdEventAvailable, title: 'Zumba Classes', link: '/dashboard/zumbaclasses' }
            ]
        },
        {
            icon: FaDumbbell,
            title: 'Equipments',
            link: '/dashboard/equipmentmanagement',
            subObj: [
                { icon: FaDumbbell, title: 'Add Equipment', link: '/dashboard/addequipment' },
                { icon: FaDumbbell, title: 'View Equipment', link: '/dashboard/viewequipment' },
                { icon: FaDumbbell, title: 'Maintenance Requests', link: '/dashboard/equipmentmaintenance' }
            ]
        },
        {
            icon: GiBiceps,
            title: 'Personal Training',
            link: '/dashboard/personaltraining',
            subObj: [
                { icon: RiRunLine, title: 'Trainer Availability', link: '/dashboard/traineravailability' },
                { icon: GiBiceps, title: 'Book Personal Trainer', link: '/dashboard/booktrainer' }
            ]
        },
        {
            icon: MdFitnessCenter,
            title: 'Fitness Programs',
            link: '/dashboard/fitnessprograms',
            subObj: [
                { icon: MdFitnessCenter, title: 'Weight Loss Program', link: '/dashboard/weightloss' },
                { icon: MdFitnessCenter, title: 'Muscle Gain Program', link: '/dashboard/musclegain' }
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
        <div className="fixed left-0 top-0 h-full w-60 bg-gray-800 transition-all duration-300 flex flex-col">
            <Link href={'/dashboard'} className="flex justify-start py-4 bg-blue-600">
                <RiDashboard3Fill className='text-4xl mx-2 text-white' />
                <span className="text-white w-full text-2xl font-bold">Dashboard</span>
            </Link>
            <div className="flex-grow overflow-y-auto ::-webkit-scrollbar ::-webkit-scrollbar-track ::-webkit-scrollbar-thumb ::-webkit-scrollbar-thumb:hover">
                <ul>
                    {sidebarContent.map((sidebar, index) => (
                        <li key={index} className="p-1">
                            {sidebar.subObj ? (
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value={`item-${index}`}>
                                        <AccordionTrigger className="flex items-center p-2 text-white cursor-pointer hover:bg-gray-700 transition-colors">
                                            <sidebar.icon className='text-xl text-yellow-400' />
                                            <h1 className='mx-2 text-sm font-semibold'>{sidebar.title}</h1>
                                        </AccordionTrigger>
                                        {sidebar.subObj.map((subItem, subIndex) => (
                                            <AccordionContent key={subIndex}>
                                                <Link href={subItem.link} className="flex items-center ml-6 p-1 text-gray-300 hover:text-white">
                                                    <subItem.icon className='text-lg text-yellow-300' />
                                                    <h1 className='mx-2 text-sm font-semibold'>{subItem.title}</h1>
                                                </Link>
                                            </AccordionContent>
                                        ))}
                                    </AccordionItem>
                                </Accordion>
                            ) : (
                                <Link href={sidebar.link} className="flex items-center p-2 text-white cursor-pointer hover:bg-gray-700 transition-colors">
                                    <sidebar.icon className='text-xl text-yellow-400' />
                                    <h1 className='mx-2 text-sm font-semibold'>{sidebar.title}</h1>
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
