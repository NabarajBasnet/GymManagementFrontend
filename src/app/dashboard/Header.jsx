"use client";

import {toast as soonerToast} from 'sonner'
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { TbListDetails } from "react-icons/tb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaMoneyBillAlt } from "react-icons/fa";
import { IoReceiptSharp } from "react-icons/io5";
import { AiFillProduct } from "react-icons/ai";
import { MdFeedback } from "react-icons/md";
import { toast as notify } from "react-hot-toast";
import { FaRulerHorizontal } from "react-icons/fa";
import { LuLogs } from "react-icons/lu";
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
import { FiSidebar, FiSearch } from "react-icons/fi";
import {
  MdError,
  MdClose,
  MdDone,
  MdNotificationsActive,
} from "react-icons/md";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Plus,
  User,
  Users,
  Settings as SettingsIcon,
  Bell,
  Calendar,
  Clock,
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
import Badge from "@mui/material/Badge";
import "../globals.css";
import React, { useEffect, useRef, useState } from "react";
import { MinimizeSidebar } from "@/state/slicer";
import { useDispatch } from "react-redux";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/DashboardUI/MobileSidebar";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/DashboardUI/SidebarAccrodin";
import {
  RiUserUnfollowFill,
  RiCustomerService2Fill,
  RiRunLine,
  RiDashboard3Fill,
} from "react-icons/ri";
import { BiSolidUserCheck } from "react-icons/bi";
import { GiLockers, GiBiceps } from "react-icons/gi";
import { TiUserAdd } from "react-icons/ti";
import {
  FaUsers,
  FaMoneyCheckAlt,
  FaChartLine,
  FaTags,
  FaCog,
  FaRegUser,
  FaUserCog,
  FaClipboardList,
  FaDumbbell,
} from "react-icons/fa";
import { MdPayments, MdAttachMoney } from "react-icons/md";
import { AiOutlineSchedule } from "react-icons/ai";
import { FaUsersGear } from "react-icons/fa6";

const Header = () => {
  const { user, loading: userLoading } = useUser();
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { setTheme } = useTheme();

  const [isScrolled, setIsScrolled] = useState(false);
  const sidebarMinimized = useSelector(
    (state) => state.rtkreducer.sidebarMinimized
  );
  const dispatch = useDispatch();
  const searchRef = useRef(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [currentDateTime, setCurrentDateTime] = useState({
    date: "",
    time: "",
  });

  useEffect(() => {
    const updateDateTime = () => {
      const date = new Date();
      const formatedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      const formatedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      setCurrentDateTime({
        date: formatedDate,
        time: formatedTime,
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

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Theme handling
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    } else {
      setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      if (darkMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }, [darkMode, mounted]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const minimizeSidebar = () => {
    dispatch(MinimizeSidebar());
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const responseBody = await response.json();

      if (response.ok) {
        setLoading(false);
        notify.success(responseBody.message);
        soonerToast.success(responseBody.message,{
          description:'Internal server error'
        })
        router.push("/login");
        window.location.reload();
      }
    } catch (error) {
      console.log("Error: ", error);
      notify.error(error.message);
      soonerToast.error(error.message,{
        description:'Internal server error'
      })
    }
  };

  // Categorized sidebar content for mobile view
  const sidebarContent = [
    // Dashboard
    {
      category: "Main",
      items: [
        {
          icon: RiDashboard3Fill,
          title: "Dashboard",
          link: "/dashboard",
        },
      ],
    },
    // Checkin Management
    {
      category: "Attendance Management",
      items: [
        {
          icon: BiSolidUserCheck,
          title: "Attendance",
          link: "/dashboard/attendance/memberattendance",
          subObj: [
            {
              icon: FaRegUser,
              title: "Member Attendance",
              link: "/dashboard/attendance/memberattendance",
            },
            {
              icon: FaUserCog,
              title: "Staff Attendance",
              link: "/dashboard/attendance/staffattendance",
            },
            {
              icon: FaClipboardList,
              title: "Attendance History",
              link: "/dashboard/attendance/attendancehistory",
            },
          ],
        },
      ],
    },
    // Member Management
    {
      category: "Member Management",
      items: [
        {
          icon: TiUserAdd,
          title: "New Member",
          link: "/dashboard/newmember",
        },
        {
          icon: FaUsers,
          title: "Members",
          link: "/dashboard/members",
          subObj: [
            {
              icon: PiUsersFourFill,
              title: "All Members",
              link: "/dashboard/members",
            },
            {
              icon: PiUsersThreeBold,
              title: "Inactive Members",
              link: "/dashboard/members/inactivemembers",
            },
            {
              icon: FaUsersRays,
              title: "Paused Members",
              link: "/dashboard/members/pausedmembers",
            },
          ],
        },
        {
          icon: FaMoneyCheckAlt,
          title: "Membership Plans",
          link: "/dashboard/membershipplans",
          subObj: [
            {
              icon: FaMoneyCheckAlt,
              title: "Plans Management",
              link: "/dashboard/membershipplans/plansmanagement",
            },
            {
              icon: FaMoneyCheckAlt,
              title: "View Plans",
              link: "/dashboard/membershipplans/viewplans",
            },
          ],
        },
        {
          icon: LuLogs,
          title: "Membership Logs",
          link: "/dashboard/members/membershiplogs",
        },
        // {
        //     icon: MdAutoGraph,
        //     title: 'Member Performance',
        //     link: '/dashboard/members/memberperformance',
        // },
        {
          icon: FaRulerHorizontal,
          title: "Body Measurements",
          link: "/dashboard/members/bodymeasurements",
        },
      ],
    },
    // Staff Operations
    {
      category: "Staff Management",
      items: [
        {
          icon: HiUsers,
          title: "System Users",
          link: "/dashboard/users",
        },
        {
          icon: FaUsersGear,
          title: "Staff Management",
          link: "/dashboard/staffmanagement",
          subObj: [
            {
              icon: IoPeopleSharp,
              title: "Staffs",
              link: "/dashboard/staffmanagement/staffs",
            },
            {
              icon: FcParallelTasks,
              title: "Task Management",
              link: "/dashboard/staffmanagement/taskmanagement",
            },
          ],
        },
      ],
    },
    // Financial Management
    {
      category: "Financial",
      items: [
        {
          icon: MdPayments,
          title: "Payment History",
          link: "/dashboard/paymenthistory",
        },
        {
          icon: MdAttachMoney,
          title: "Billing",
          link: "/dashboard/billing",
          subObj: [
            {
              icon: AiFillProduct,
              title: "Services & Products",
              link: "/dashboard/billing/servicesandproducts",
            },
            {
              icon: TbListDetails,
              title: "Billing Profile",
              link: "/dashboard/billing/billingprofile",
            },
            {
              icon: IoReceiptSharp,
              title: "Payment Receipt",
              link: "/dashboard/billing/paymentreceipts",
            },
            {
              icon: FaMoneyBillAlt,
              title: "Sales Invoice",
              link: "/dashboard/billing/salesinvoice",
            },
            // { icon: FaMoneyBillAlt, title: 'Proforma Invoice', link: '/dashboard/billing/proformainvoice' },
            // { icon: RiBillFill, title: 'Sales Return', link: '/dashboard/billing/salesreturn' },
          ],
        },
        {
          icon: FaTags,
          title: "Promotions & Offers",
          link: "/dashboard/promotionsandoffers",
        },
      ],
    },
    // Facility Management
    {
      category: "Facility Management",
      items: [
        {
          icon: GiLockers,
          title: "Lockers",
          link: "/dashboard/lockers",
        },
        {
          icon: GiBiceps,
          title: "Personal Training",
          link: "/dashboard/personaltraining",
          subObj: [
            {
              icon: FaDumbbell,
              title: "Training Packages",
              link: "/dashboard/personaltraining/trainingpackages",
            },
            {
              icon: FaDumbbell,
              title: "Book Training",
              link: "/dashboard/personaltraining/booktraining",
            },
            // { icon: FaDumbbell, title: 'Training Logs', link: '/dashboard/personaltraining/traininglogs' },
            // { icon: FaDumbbell, title: 'Training History', link: '/dashboard/personaltraining/traininghistory' },
            // { icon: FaDumbbell, title: 'Training Feedback', link: '/dashboard/personaltraining/trainingfeedback' },
            // { icon: FaDumbbell, title: 'Training Reports', link: '/dashboard/personaltraining/trainingreports' },
            // { icon: FaDumbbell, title: 'Training Settings', link: '/dashboard/personaltraining/trainingsettings' },
            // { icon: FaDumbbell, title: 'Training Analytics', link: '/dashboard/personaltraining/traininganalytics' },
            // { icon: FaDumbbell, title: 'Training Calendar', link: '/dashboard/personaltraining/trainingcalendar' },
            // { icon: FaDumbbell, title: 'Training Goals', link: '/dashboard/personaltraining/traininggoals' },
            // { icon: FaDumbbell, title: 'Training Progress', link: '/dashboard/personaltraining/trainingprogress' },
            // { icon: FaDumbbell, title: 'Training Tips', link: '/dashboard/personaltraining/trainingtips' },
            // { icon: FaDumbbell, title: 'Training Resources', link: '/dashboard/personaltraining/trainingresources' },
            // { icon: FaDumbbell, title: 'Training FAQs', link: '/dashboard/personaltraining/trainingfaqs' },
            // { icon: FaDumbbell, title: 'Training Certificates', link: '/dashboard/personaltraining/trainingcertificates' },
          ],
        },
        {
          icon: AiOutlineSchedule,
          title: "Class Schedules",
          link: "/dashboard/classschedulemanagement",
        },
      ],
    },
    // Analytics & Support
    {
      category: "Reports & Support",
      items: [
        {
          icon: FaChartLine,
          title: "Analytics & Reports",
          link: "/dashboard/analytics",
        },
        {
          icon: MdFeedback,
          title: "Members Feedback",
          link: "/dashboard/feedbacks",
        },
        {
          icon: FaBoxOpen,
          title: "Logs",
          link: "/dashboard/logs",
          subObj: [
            {
              icon: FaBoxOpen,
              title: "Audit Logs",
              link: "/dashboard/logs/auditlogs",
            },
            {
              icon: FaBoxOpen,
              title: "Auth Logs",
              link: "/dashboard/logs/authlogs",
            },
            {
              icon: FaBoxOpen,
              title: "Error Logs",
              link: "/dashboard/logs/errorlogs",
            },
          ],
        },
      ],
    },
  ];

  const [activeItem, setActiveItem] = useState("");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [notifications, setNotifications] = useState(3);

  // Function to determine if a link is active
  const isActive = (link) => {
    return activeItem === link || activeItem.startsWith(link + "/");
  };

  return (
    <header
      className={`fixed top-0 right-0 backdrop-blur-md transition-all duration-500 z-40 
        ${
          isScrolled
            ? "bg-white shadow-md dark:bg-gray-900"
            : "bg-white dark:bg-gray-900"
        } 
        ${
          sidebarMinimized
            ? "md:w-[calc(100%-80px)]"
            : "md:w-[calc(100%-240px)]"
        } 
        w-full flex justify-between px-2 py-3 md:px-4 items-center`}
    >
      <div className="mx-4 flex items-center">
        <div className="flex items-center gap-2" ref={searchRef}>
          <FiSidebar
            className="text-2xl text-blue-600 hidden md:flex cursor-pointer hover:text-blue-800 transition-colors"
            onClick={minimizeSidebar}
          />
        </div>

        <div>
          <Sheet>
            <SheetTrigger asChild>
              <div className="flex items-center">
                <FiSidebar className="text-xl md:hidden flex cursor-pointer text-blue-600 hover:text-blue-800" />
              </div>
            </SheetTrigger>
            <SheetContent className="h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800">
              <SheetHeader className="border-b border-gray-100 dark:border-gray-800 pb-3">
                <SheetTitle>
                  <Link
                    href={"/dashboard"}
                    className="flex items-center px-2 py-5"
                  >
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-500 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/20">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z"
                          fill="white"
                        />
                        <path
                          d="M9 12C9 12.5523 8.55228 13 8 13C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11C8.55228 11 9 11.4477 9 12Z"
                          fill="white"
                        />
                        <path
                          d="M17 12C17 12.5523 16.5523 13 16 13C15.4477 13 15 12.5523 15 12C15 11.4477 15.4477 11 16 11C16.5523 11 17 11.4477 17 12Z"
                          fill="white"
                        />
                        <path
                          d="M13 16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15C12.5523 15 13 15.4477 13 16Z"
                          fill="white"
                        />
                        <path
                          d="M9 16C9 16.5523 8.55228 17 8 17C7.44772 17 7 16.5523 7 16C7 15.4477 7.44772 15 8 15C8.55228 15 9 15.4477 9 16Z"
                          fill="white"
                        />
                        <path
                          d="M13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7C12.5523 7 13 7.44772 13 8Z"
                          fill="white"
                        />
                        <path
                          d="M9 8C9 8.55228 8.55228 9 8 9C7.44772 9 7 8.55228 7 8C7 7.44772 7.44772 7 8 7C8.55228 7 9 7.44772 9 8Z"
                          fill="white"
                        />
                      </svg>
                      <div
                        className="absolute inset-0 bg-white opacity-10 rounded-xl animate-pulse"
                        style={{ animationDuration: "3s" }}
                      ></div>
                    </div>
                    <div className="ml-3.5">
                      <p className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">
                        Revive Fitness
                      </p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                          Fitness Center
                        </p>
                        <Badge
                          variant="outline"
                          className="text-[9px] px-2 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-medium rounded-2xl"
                        >
                          Pro
                        </Badge>
                      </div>
                    </div>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="flex-grow overflow-y-auto px-3 py-5 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent">
                {sidebarContent.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="mb-6">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 ml-3 mb-3 letter-spacing-[0.2em]">
                      {category.category}
                    </p>
                    <ul>
                      {category.items.map((item, index) => (
                        <li key={index} className="mb-1.5">
                          {item.subObj ? (
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full"
                            >
                              <AccordionItem
                                value={`item-${categoryIndex}-${index}`}
                              >
                                <AccordionTrigger
                                  className={`group w-full flex items-center px-4 py-2.5 rounded-xl text-sm transition-all duration-300
                                                ${
                                                  isActive(item.link)
                                                    ? "bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 text-indigo-700 dark:text-indigo-400 font-medium border-l-4 border-indigo-600 dark:border-indigo-500"
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                                                }`}
                                >
                                  <div
                                    className={`flex items-center ${
                                      isActive(item.link)
                                        ? "text-indigo-600 dark:text-indigo-400"
                                        : "text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                                    }`}
                                  >
                                    <item.icon className="w-5 h-5" />
                                    <span className="ml-3.5 font-medium">
                                      {item.title}
                                    </span>
                                    {item.badge && (
                                      <Badge
                                        className={`ml-2.5 text-[9px] py-0 h-5 text-white ${item.badgeColor}`}
                                      >
                                        {item.badge}
                                      </Badge>
                                    )}
                                  </div>
                                </AccordionTrigger>
                                <div
                                  className={`ml-7 border-l-2 ${
                                    isActive(item.link)
                                      ? "border-indigo-300 dark:border-indigo-700"
                                      : "border-gray-200 dark:border-gray-700"
                                  }`}
                                >
                                  {item.subObj.map((subItem, subIndex) => (
                                    <AccordionContent key={subIndex}>
                                      <Link
                                        href={subItem.link}
                                        className={`group flex items-center px-4 py-2 text-sm transition-all duration-200 rounded-xl
                                                                ${
                                                                  isActive(
                                                                    subItem.link
                                                                  )
                                                                    ? "text-indigo-700 dark:text-indigo-400 font-medium bg-indigo-50/60 dark:bg-indigo-900/10"
                                                                    : "text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800/40"
                                                                }`}
                                      >
                                        <subItem.icon
                                          className={`w-4 h-4 ${
                                            isActive(subItem.link)
                                              ? "text-indigo-600 dark:text-indigo-400"
                                              : "text-gray-500 dark:text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                                          }`}
                                        />
                                        <span className="ml-3 text-sm tracking-tight">
                                          {subItem.title}
                                        </span>
                                        {subItem.badge && (
                                          <Badge
                                            className={`ml-2 text-[9px] py-0 h-5 text-white ${subItem.badgeColor}`}
                                          >
                                            {subItem.badge}
                                          </Badge>
                                        )}
                                      </Link>
                                    </AccordionContent>
                                  ))}
                                </div>
                              </AccordionItem>
                            </Accordion>
                          ) : (
                            <Link
                              href={item.link}
                              className={`group flex items-center px-4 py-2.5 rounded-xl text-sm transition-all duration-300
                                            ${
                                              isActive(item.link)
                                                ? "bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 text-indigo-700 dark:text-indigo-400 font-medium border-l-4 border-indigo-600 dark:border-indigo-500"
                                                : item.highlight
                                                ? "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 dark:hover:from-indigo-900/20 dark:hover:to-blue-900/20"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                                            }`}
                            >
                              <div
                                className={`flex items-center ${
                                  isActive(item.link)
                                    ? "text-indigo-600 dark:text-indigo-400"
                                    : "text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                                }`}
                              >
                                <item.icon className="w-5 h-5" />
                                <span className="ml-3.5 font-medium tracking-tight">
                                  {item.title}
                                </span>
                                {item.badge && (
                                  <Badge
                                    className={`ml-2.5 text-[9px] py-0 h-5 text-white ${item.badgeColor}`}
                                  >
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-auto border-t border-gray-100 dark:border-gray-800 px-3 pt-3 pb-4">
                <Button
                  variant="ghost"
                  className="w-full mb-3 justify-between bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl h-12 pr-3.5"
                >
                  <div className="flex items-center">
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-1.5 mr-2.5">
                      <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      Notifications
                    </span>
                  </div>
                  {notifications > 0 && (
                    <Badge className="bg-red-500 text-white hover:bg-red-600 px-4 rounded-full">
                      {notifications}
                    </Badge>
                  )}
                </Button>

                <div
                  className={`flex items-center rounded-xl cursor-pointer p-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors duration-200`}
                >
                  <Avatar className="h-10 w-10 border-2 border-indigo-100 dark:border-indigo-900/50 shadow-sm">
                    <AvatarImage
                      src={user?.user.avatarUrl || ""}
                      alt={user?.user.firstName || ""}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-medium">
                      {user?.user.firstName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="ml-3 overflow-hidden">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-tight">
                      {(user &&
                        user.user.firstName + " " + user.user.lastName) ||
                        "Admin"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {(user && user.user.email) || ""}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto text-gray-500 dark:text-gray-400 hover:bg-transparent"
                    onClick={() => logoutUser()}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Date/Time for mobile */}
      <div className="flex items-center md:hidden space-x-2">
      <div className="flex items-center rounded-md px-3 py-2">
            <Calendar size={16} className="text-blue-600 mr-2" />
            <h1 className="text-sm font-medium dark:text-gray-200 text-gray-700">
              {currentDateTime.date}
            </h1>
          </div>
          <div className="flex items-center rounded-md px-3 py-2">
            <Clock size={16} className="text-blue-600 mr-2" />
            <h1 className="text-sm font-medium dark:text-gray-200 text-gray-700">
              {currentDateTime.time}
            </h1>
          </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Date/Time for desktop */}
        <div className="hidden items-center md:flex space-x-4">
          <div className="flex items-center rounded-md px-3 py-2">
            <Calendar size={16} className="text-blue-600 mr-2" />
            <h1 className="text-sm font-medium dark:text-gray-200 text-gray-700">
              {currentDateTime.date}
            </h1>
          </div>
          <div className="flex items-center rounded-md px-3 py-2">
            <Clock size={16} className="text-blue-600 mr-2" />
            <h1 className="text-sm font-medium dark:text-gray-200 text-gray-700">
              {currentDateTime.time}
            </h1>
          </div>
        </div>

        {/* Theme changer */}
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="relative p-2.5 rounded-xl bg-transparent dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-300 group"
          aria-label="Toggle theme"
        >
          <div className="relative w-5 h-5">
            <Sun
              className={`absolute inset-0 w-5 h-5 text-blue-500 transition-all duration-300 ${
                darkMode
                  ? "opacity-0 rotate-90 scale-0"
                  : "opacity-100 rotate-0 scale-100"
              }`}
            />
            <Moon
              className={`absolute inset-0 w-5 h-5 text-blue-500 transition-all duration-300 ${
                darkMode
                  ? "opacity-100 rotate-0 scale-100"
                  : "opacity-0 -rotate-90 scale-0"
              }`}
            />
          </div>
        </button>

        {/* Settings Dialog */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="bg-transparent p-1 md:p-2 rounded-full transition-colors cursor-pointer">
              <SettingsIcon
                size={20}
                className="text-blue-600 animate-spin duration-[10ms] transition-all"
              />
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <div className="w-full flex justify-between items-center">
                <AlertDialogTitle className="text-xl font-bold text-blue-800">
                  Settings
                </AlertDialogTitle>
                <AlertDialogCancel className="border-none hover:bg-none hover:bg-transparent">
                  <IoClose className="text-xl text-gray-600 hover:text-gray-800" />
                </AlertDialogCancel>
              </div>
              <Separator orientation="horizontal" className="my-2" />
              <AlertDialogDescription className="h-[80vh]">
                <Settings />
              </AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer">
              <div className="bg-transparent p-1 md:p-2 rounded-full transition-colors">
                <FaUserCircle className="text-2xl text-blue-600" />
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mt-1 border border-gray-200 shadow-lg">
            <DropdownMenuLabel className="font-medium text-gray-800">
              My Account
            </DropdownMenuLabel>
            <div className="px-2 py-1.5 text-xs text-gray-500">
              {(user && user.user.email) || "admin@example.com"}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="focus:bg-blue-50 focus:text-blue-700">
                <Button className="space-x-2 w-full flex justify-center items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <PiStarFour />
                  Upgrade Plan
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-blue-50 focus:text-blue-700">
                <User className="mr-2 h-4 w-4 text-blue-600" />
                <span>Profile</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="focus:bg-blue-50 focus:text-blue-700">
                <Users className="mr-2 h-4 w-4 text-blue-600" />
                <span>Team</span>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuSeparator />
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem className="focus:bg-blue-50 focus:text-blue-700">
                <Plus className="mr-2 h-4 w-4 text-blue-600" />
                <span>New Team</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logoutUser()}
              className="focus:bg-blue-50 focus:text-blue-700 text-red-600 font-medium"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span className="cursor-pointer">
                {loading ? "Processing..." : "Log out"}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
