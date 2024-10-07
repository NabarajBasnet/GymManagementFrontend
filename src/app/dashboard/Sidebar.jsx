'use client'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/DashboardUI/SidebarAccrodin"
import React, { useState } from 'react';
import { RiDashboard2Line } from 'react-icons/ri';
import { FaRegUser, FaBox, FaChartLine, FaTags, FaCog } from 'react-icons/fa';
import Link from 'next/link';
import { FaMoneyCheckAlt } from "react-icons/fa";
import { BiSolidUserCheck } from "react-icons/bi";
import { GiLockers } from "react-icons/gi";
import { TiUserAdd } from "react-icons/ti";
import { FaUsers } from "react-icons/fa";
import { MdPayments } from "react-icons/md";
import { FaUsersGear } from "react-icons/fa6";
import { RiUserUnfollowFill } from "react-icons/ri";


const Sidebar = () => {

    const sidebarContent = [
        { icon: FaMoneyCheckAlt, title: 'Membership Plans', link: '/dashboard/membershipplans', subObj: { icon: FaMoneyCheckAlt, title: 'Membership Plans', link: '/dashboard/membershipplans' } },
        { icon: BiSolidUserCheck, title: 'Attedence', link: '/dashboard/attdence' },
        { icon: GiLockers, title: 'Lockers', link: '/dashboard/lockers' },
        { icon: TiUserAdd, title: 'New Member', link: '/dashboard/newmember' },
        { icon: FaUsers, title: 'All Members', link: '/dashboard/allmembers' },
        { icon: MdPayments, title: 'Payment Details', link: '/dashboard/paymentdetails' },
        { icon: FaUsersGear, title: 'Staff Management', link: '/dashboard/staffmanagement' },
        { icon: RiUserUnfollowFill, title: 'Expired Memberships', link: '/dashboard/expiredmemberships' },
        { icon: FaRegUser, title: 'User', link: '/dashboard/user' },
        { icon: FaBox, title: 'Box', link: '/dashboard/box' },
        { icon: FaChartLine, title: 'Chart', link: '/dashboard/chart' },
        { icon: FaTags, title: 'Tags', link: '/dashboard/tags' },
        { icon: FaCog, title: 'Cog', link: '/dashboard/Cog' },
    ];

    return (
        <div className={`fixed left-0 top-0 h-full w-60 bg-gray-800 transition-all duration-300`}>
            <div className="flex justify-start items-center py-8 bg-blue-600">
                <span className="text-white text-2xl mx-2 font-bold">Dashboard</span>
            </div>

            <div className="h-full overflow-y-auto mt-3">
                <ul>
                    {
                        sidebarContent.map((sidebar, index) => (
                            <li key={index} className="flex items-center p-2 text-white cursor-pointer hover:bg-gray-700 transition-colors">
                                <Link href={sidebar.link}>
                                    {
                                        sidebar.subObj ? (
                                            <Accordion type="single" collapsible className="w-full">
                                                <AccordionItem value="item-1">
                                                    <AccordionTrigger>
                                                        <sidebar.icon className='text-xl text-yellow-400' />
                                                        <h1 className='mx-2 text-sm font-semibold'>{sidebar.title}</h1>
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        <sidebar.subObj.icon />
                                                        <h1 className='mx-2 text-sm font-semibold'>{sidebar.subObj.title}</h1>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        ) : (
                                            <div>
                                                <div className='flex items-center'>
                                                    <sidebar.icon className='text-xl text-yellow-400' />
                                                    <h1 className='mx-2 text-sm font-semibold'>{sidebar.title}</h1>
                                                </div>
                                                {sidebar.subObj && (
                                                    <div className='flex justify-start items-center '>
                                                        <sidebar.subObj.icon />
                                                        <p>{sidebar.subObj.title}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    }
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
