'use client'

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
        { icon: FaMoneyCheckAlt, title: 'Membership Plans', link: '/dashboard/membershipplans' },
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
            <div className="flex items-center justify-between p-4">
                <span className="text-white text-2xl font-bold">Admin Panel</span>
            </div>

            <div className="h-full overflow-y-auto ::-webkit-scrollbar:w-8px ::-webkit-scrollbar-thumb:rounded-full mt-10">
                <ul>
                    {
                        sidebarContent.map((sidebar, index) => (
                            <li key={index} className="flex items-center p-4 text-white cursor-pointer hover:bg-gray-700 transition-colors">
                                <Link href={sidebar.link}>
                                    <div className='flex items-center'>
                                        <sidebar.icon className='text-xl text-yellow-400' />
                                        <h1 className='mx-4'>{sidebar.title}</h1>
                                    </div>
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
