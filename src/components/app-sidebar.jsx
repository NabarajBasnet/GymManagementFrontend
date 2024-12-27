"use client"

import { FaUserCircle } from "react-icons/fa";
import { HiUsers } from "react-icons/hi2";
import { useSelector, useDispatch } from 'react-redux';
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
import Link from 'next/link';
import { FaUsersGear } from "react-icons/fa6";
import { RiDashboard3Fill } from "react-icons/ri";
import { ToggleAdminSidebar, MinimizeSidebar } from '@/state/slicer';
import { useRouter } from "next/navigation";
import { MdDelete, MdError, MdClose, MdDone } from "react-icons/md";
import { useState } from "react";
import {
  LogOut,
  Settings,
  User,
  UserPlus,
  Users,
  Plus,
} from "lucide-react";
import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { TeamSwitcher } from '../components/team-switcher';
import { NavMain } from '../components/nav-main';
import {NavProjects}from '../components/nav-projects';
import {NavUser} from '../components/nav-user';

import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarRail,   } from "./ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Gym Management",
      logo: FaCog, // Replace with an appropriate logo/icon
      plan: "Professional",
    },
  ],
  navMain: [
    {
      title: "Membership Plans",
      url: "/dashboard/membershipplans",
      icon: FaMoneyCheckAlt,
    },
    {
      title: "Attendance",
      url: "/dashboard/attendance/memberattendance",
      icon: BiSolidUserCheck,
      items: [
        { title: "Member Attendance", url: "/dashboard/attendance/memberattendance" },
        { title: "Staff Attendance", url: "/dashboard/attendance/staffattendance" },
        { title: "Attendance History", url: "/dashboard/attendance/attendancehistory" },
      ],
    },
    {
      title: "Lockers",
      url: "/dashboard/lockers",
      icon: GiLockers,
    },
    {
      title: "New Member",
      url: "/dashboard/newmember",
      icon: TiUserAdd,
    },
    {
      title: "All Members",
      url: "/dashboard/allmembers",
      icon: FaUsers,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: HiUsers,
    },
    {
      title: "Staff Management",
      url: "/dashboard/staffmanagement",
      icon: FaUsersGear,
    },
    {
      title: "Personal Training",
      url: "/dashboard/personaltraining",
      icon: GiBiceps,
      items: [
        { title: "Trainer Availability", url: "/dashboard/personaltraining/traineravailability" },
        { title: "Book Personal Trainer", url: "/dashboard/personaltraining/booktrainer" },
      ],
    },
    {
      title: "Payment Details",
      url: "/dashboard/paymentdetails",
      icon: MdPayments,
    },
    {
      title: "Expired Memberships",
      url: "/dashboard/expiredmemberships",
      icon: RiUserUnfollowFill,
    },
    {
      title: "Customer Support",
      url: "/dashboard/customersupport",
      icon: RiCustomerService2Fill,
    },
    {
      title: "Analytics & Reports",
      url: "/dashboard/analytics",
      icon: FaChartLine,
    },
    {
      title: "Schedule Management",
      url: "/dashboard/schedulemanagement",
      icon: AiOutlineSchedule,
    },
    {
      title: "Promotions & Offers",
      url: "/dashboard/promotions",
      icon: FaTags,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: FaCog,
    },
  ],
  projects: [
    {
      name: "Membership Tracking",
      url: "/dashboard/membershiptracking",
      icon: FaMoneyCheckAlt,
    },
    {
      name: "Analytics",
      url: "/dashboard/analytics",
      icon: FaChartLine,
    },
    {
      name: "Customer Support",
      url: "/dashboard/customersupport",
      icon: RiCustomerService2Fill,
    },
  ],
};

export function AppSidebar({
  ...props
}) {
  return (
    (<Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>)
  );
}
