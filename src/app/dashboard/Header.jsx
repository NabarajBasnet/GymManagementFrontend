"use client";

import { TbLiveViewFilled } from "react-icons/tb";
import { RiUserLocationFill } from "react-icons/ri";
import { IoMdCart } from "react-icons/io";
import { MdAdd } from "react-icons/md";
import { FaList } from "react-icons/fa";
import { HiClipboardList } from "react-icons/hi";
import { ImUsers } from "react-icons/im";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast as soonerToast } from "sonner";
import { Moon, Sun, MessageSquare, CheckCircle, AlertTriangle, UserPlus } from "lucide-react";
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
  const loggedInUser = user?.user;

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
      const response = await fetch(`https://fitbinary.com/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const responseBody = await response.json();

      if (response.ok) {
        setLoading(false);
        soonerToast.success(responseBody.message, {
          description: "Logout successful",
        });
        router.push("/userlogin");
        window.location.reload();
      }
    } catch (error) {
      console.log("Error: ", error);
      soonerToast.error(error.message, {
        description: "Internal server error",
      });
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
        {
          icon: RiUserLocationFill,
          title: "Smart Check-In",
          link: "/dashboard/attendance/memberattendance",
          subObj: [
            {
              icon: FaRegUser,
              title: "Member Check-In",
              link: "/dashboard/smartcheckin/membercheckin",
            },
            {
              icon: FaUserCog,
              title: "Staff Check-In",
              link: "/dashboard/smartcheckin/staffcheckin",
            },
            {
              icon: TbLiveViewFilled,
              title: "Live Track",
              link: "/dashboard/smartcheckin/livetrack",
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
        ...(user?.user?.organizationBranch && loggedInUser?.role !== 'Gym Admin' ?
          [{
            icon: ImUsers,
            title: "Member Transfer",
            link: "/dashboard/membertransfer",
            highlight: true,
          },
          ] : []
        ),
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
        },
        // {
        //   icon: LuLogs,
        //   title: "Membership Logs",
        //   link: "/dashboard/members/membershiplogs",
        // },
        // {
        //     icon: MdAutoGraph,
        //     title: 'Member Performance',
        //     link: '/dashboard/members/memberperformance',
        // },
        // {
        //   icon: FaRulerHorizontal,
        //   title: "Body Measurements",
        //   link: "/dashboard/members/bodymeasurements",
        // },
      ],
    },
    // Facility Management
    {
      category: "Facility Management",
      items: [
        {
          icon: GiLockers,
          title: "Locker Management",
          link: "/dashboard/lockersmanagement",
        },
        {
          icon: GiBiceps,
          title: "Personal Training",
          link: "/dashboard/personaltraining",
          subObj: [
            ...(loggedInUser?.role !== 'Gym Admin' ? [
              {
                icon: FaDumbbell,
                title: "Training Packages",
                link: "/dashboard/personaltraining/trainingpackages",
              },
            ] : []),
            {
              icon: FaDumbbell,
              title: "Book Training",
              link: "/dashboard/personaltraining/booktraining",
            },
          ],
        },
        // {
        //   icon: AiFillProduct,
        //   title: "E-Com Store",
        //   link: "/dashboard/ecomstore",
        //   subObj: [
        //     {
        //       icon: AiFillProduct,
        //       title: "Dashboard",
        //       link: "/dashboard/ecomstore/dashboard",
        //     },
        //     {
        //       icon: MdAdd,
        //       title: "Add Products",
        //       link: "/dashboard/ecomstore/addproducts",
        //     },
        //     {
        //       icon: FaList,
        //       title: "Products List",
        //       link: "/dashboard/ecomstore/productslist",
        //     },
        //     {
        //       icon: IoMdCart,
        //       title: "Orders",
        //       link: "/dashboard/ecomstore/orders",
        //     },
        //     {
        //       icon: MdPayments,
        //       title: "Payments",
        //       link: "/dashboard/ecomstore/payments",
        //     },
        //     {
        //       icon: FaChartLine,
        //       title: "Reports",
        //       link: "/dashboard/ecomstore/reports",
        //     },
        //   ]
        // },
        {
          icon: AiOutlineSchedule,
          title: "Class Schedules",
          link: "/dashboard/classschedulemanagement",
        },
      ],
    },
    // Staff Operations
    {
      category: "Staff Management",
      items: [
        {
          icon: FaUsersGear,
          title: "Staff Management",
          link: "/dashboard/staffmanagement",
          subObj: [
            {
              icon: IoPeopleSharp,
              title: "Staff Management",
              link: "/dashboard/staffmanagement/staffs",
            },
            ...(loggedInUser?.role === 'Gym Admin' ? [] : [
              {
                icon: FcParallelTasks,
                title: "Task Management",
                link: "/dashboard/staffmanagement/taskmanagement",
              },
            ])
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
          title: "Bill Management",
          link: "/dashboard/billing",
          subObj: [
            {
              icon: IoReceiptSharp,
              title: "Receipts",
              link: "/dashboard/billing/paymentreceipts",
            },
            {
              icon: FaMoneyBillAlt,
              title: "Invoices",
              link: "/dashboard/billing/salesinvoice",
            },
            // { icon: FaMoneyBillAlt, title: 'Proforma Invoice', link: '/dashboard/billing/proformainvoice' },
            // { icon: RiBillFill, title: 'Sales Return', link: '/dashboard/billing/salesreturn' },
          ],
        },
        // {
        //   icon: FaTags,
        //   title: "Promotions & Offers",
        //   link: "/dashboard/promotionsandoffers",
        // },
      ],
    },
    // Analytics & Support
    {
      category: "Reports & Analytics",
      items: [
        {
          icon: FaChartLine,
          title: "Reports & Analytics",
          link: "/dashboard/analyticsandreports",
        },
        // {
        //   icon: MdFeedback,
        //   title: "Feedback Management",
        //   link: "/dashboard/feedbacks",
        // },
        {
          icon: HiClipboardList,
          title: "Logs",
          link: "/dashboard/logs",
        },
        // {
        //   icon: IoChatbubbleEllipsesSharp,
        //   title: "Ai Assistant",
        //   link: "/dashboard/aiassistant",
        // },
      ],
    },
  ];

  const [activeItem, setActiveItem] = useState("");
  const [notifications, setNotifications] = useState(3);

  // Function to determine if a link is active
  const isActive = (link) => {
    return activeItem === link || activeItem.startsWith(link + "/");
  };

  return (
    <header
      className={`fixed top-0 right-0 backdrop-blur-md dark:border-b border-gray-700 py-0 transition-all duration-500 z-40 
        ${isScrolled
          ? "bg-white shadow-md dark:bg-gray-900"
          : "bg-white dark:bg-gray-900"
        } 
        ${sidebarMinimized
          ? "md:w-[calc(100%-80px)]"
          : "md:w-[calc(100%-240px)]"
        } 
        w-full flex justify-between px-2 py-2 md:px-4 items-center`}
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
              <div className="w-full flex items-start justify-start">
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
                                                ${isActive(item.link)
                                      ? "bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 text-indigo-700 dark:text-indigo-400 font-medium border-l-4 border-indigo-600 dark:border-indigo-500"
                                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                                    }`}
                                >
                                  <div
                                    className={`flex items-center ${isActive(item.link)
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
                                  className={`ml-7 border-l-2 ${isActive(item.link)
                                    ? "border-indigo-300 dark:border-indigo-700"
                                    : "border-gray-200 dark:border-gray-700"
                                    }`}
                                >
                                  {item.subObj.map((subItem, subIndex) => (
                                    <AccordionContent key={subIndex}>
                                      <Link
                                        href={subItem.link}
                                        className={`group flex items-center px-4 py-2 text-sm transition-all duration-200 rounded-xl
                                                                ${isActive(
                                          subItem.link
                                        )
                                            ? "text-indigo-700 dark:text-indigo-400 font-medium bg-indigo-50/60 dark:bg-indigo-900/10"
                                            : "text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800/40"
                                          }`}
                                      >
                                        <subItem.icon
                                          className={`w-4 h-4 ${isActive(subItem.link)
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
                                            ${isActive(item.link)
                                  ? "bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 text-indigo-700 dark:text-indigo-400 font-medium border-l-4 border-indigo-600 dark:border-indigo-500"
                                  : item.highlight
                                    ? "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 dark:hover:from-indigo-900/20 dark:hover:to-blue-900/20"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                                }`}
                            >
                              <div
                                className={`flex items-center ${isActive(item.link)
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
      <div className="flex items-center hidden space-x-0 md:space-x-2">
        <div className="flex items-center rounded-md px-0 py-2">
          <Calendar size={16} className="text-blue-600 mr-2" />
          <h1 className="text-sm font-medium dark:text-gray-200 text-gray-700">
            {currentDateTime.date}
          </h1>
        </div>
        <div className="flex items-center rounded-md pl-3 py-2">
          <Clock size={16} className="text-blue-600 mr-1" />
          <h1 className="text-sm font-medium dark:text-gray-200 text-gray-700">
            {currentDateTime.time}
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x- md:space-x-1">
        {/* Date/Time for desktop */}
        <div className="hidden items-center md:flex space-x-0">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="relative p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-gray-700/80 transition-all duration-200 group"
            >
              <Bell className="w-4 h-4 text-sky-600" />
              <span className="absolute -top-0 right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {3}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 md:w-96 dark:bg-gray-900 dark:border-none" align="end">
            <DropdownMenuLabel className="flex justify-between items-center">
              <span>Notifications</span>
              <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                Mark all as read
              </button>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Unread notifications */}
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex items-start gap-3 py-3 hover:bg-indigo-50/50 dark:hover:bg-gray-800">
                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-full">
                  <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="font-medium">New message received</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">John Doe sent you a message</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">2 minutes ago</p>
                </div>
                <span className="ml-auto w-2 h-2 rounded-full bg-indigo-600"></span>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-start gap-3 py-3 hover:bg-indigo-50/50 dark:hover:bg-gray-800">
                <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium">Task completed</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">"Update dashboard" was marked as done</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">1 hour ago</p>
                </div>
                <span className="ml-auto w-2 h-2 rounded-full bg-indigo-600"></span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Read notifications */}
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex items-start gap-3 py-3 hover:bg-indigo-50/50 dark:hover:bg-gray-800">
                <div className="bg-yellow-100 dark:bg-yellow-900/50 p-2 rounded-full">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="font-medium">Warning notification</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Your storage is almost full</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Yesterday</p>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-start gap-3 py-3 hover:bg-indigo-50/50 dark:hover:bg-gray-800">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
                  <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">New connection</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sarah Smith accepted your invitation</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">2 days ago</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="justify-center text-indigo-600 dark:text-indigo-400 hover:underline">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme changer */}
        <button
          onClick={toggleTheme}
          className="relative p-2 rounded-full bg-transparent dark:bg-transparent hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-300 group"
          aria-label="Toggle theme"
        >
          <div className="relative w-5 h-5">
            <Sun
              className={`absolute inset-0 w-5 h-5 text-blue-500 transition-all duration-300 ${darkMode
                ? "opacity-0 rotate-90 scale-0"
                : "opacity-100 rotate-0 scale-100"
                }`}
            />
            <Moon
              className={`absolute inset-0 w-5 h-5 text-blue-500 transition-all duration-300 ${darkMode
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 -rotate-90 scale-0"
                }`}
            />
          </div>
        </button>

        {/* Settings Dialog */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="bg-transparent dark:hover:bg-gray-800/80 p-2 rounded-full dark:shadow-none hover:bg-gray-100 transition-all duration-300 cursor-pointer hover:scale-105 border-none">
              <SettingsIcon
                size={20}
                className="text-blue-600 dark:text-blue-400 hover:rotate-90 duration-300 transition-all"
              />
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-4xl dark:bg-gray-900 dark:border-gray-700 w-[95vw] rounded-xl shadow-2xl">
            <AlertDialogHeader>
              <div className="w-full flex justify-between items-center p-6 pb-4">
                <AlertDialogTitle className="text-2xl font-bold text-blue-800 dark:text-white">
                  Settings
                </AlertDialogTitle>
                <AlertDialogCancel className="border-none hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full dark:bg-transparent transition-colors">
                  <IoClose className="text-xl text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200" />
                </AlertDialogCancel>
              </div>
              <Separator orientation="horizontal" className="mx-6 dark:bg-gray-700" />
              <AlertDialogDescription className="h-[80vh] max-h-[600px]">
                <Tabs defaultValue="general" className="h-full flex flex-col">
                  <TabsList className="w-full justify-start px-6 py-4 bg-transparent flex flex-wrap gap-2">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="notifications">
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>

                  <div className="flex-1 overflow-y-auto py-4 px-6">
                    <TabsContent value="general" className="space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                          Account
                        </h3>
                        <div className="space-y-6">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <Label htmlFor="name" className="text-base">Name</Label>
                            <Input
                              value={`${loggedInUser?.firstName} ${loggedInUser?.lastName}`}
                              id="name"
                              defaultValue="John Doe"
                              className="w-full sm:max-w-xs py-3 rounded-lg dark:bg-gray-800 dark:border-gray-700 bg-gray-50 border-gray-200"
                            />
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <Label htmlFor="email" className="text-base">Email</Label>
                            <Input
                              value={loggedInUser?.email}
                              id="email"
                              type="email"
                              defaultValue="john@example.com"
                              className="w-full sm:max-w-xs py-3 rounded-lg dark:bg-gray-800 dark:border-gray-700 bg-gray-50 border-gray-200"
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="appearance" className="space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                          Theme
                        </h3>
                        <div className="space-y-6">
                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                              <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Toggle between light and dark themes</p>
                            </div>
                            <Switch id="dark-mode"
                              checked={darkMode}
                              onCheckedChange={toggleTheme}
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                          Email Notifications
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                              <Label htmlFor="product-updates" className="text-base">
                                Product updates
                              </Label>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Get notified about new features</p>
                            </div>
                            <Switch id="product-updates" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                              <Label htmlFor="security-alerts" className="text-base">
                                Security alerts
                              </Label>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Important security notifications</p>
                            </div>
                            <Switch id="security-alerts" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                              <Label htmlFor="newsletter" className="text-base">Newsletter</Label>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Weekly product updates</p>
                            </div>
                            <Switch id="newsletter" />
                          </div>
                        </div>
                      </div>

                      <Separator className="my-6" />

                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                          In-app Notifications
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                              <Label htmlFor="mentions" className="text-base">Mentions</Label>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">When someone mentions you</p>
                            </div>
                            <Switch id="mentions" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                              <Label htmlFor="messages" className="text-base">Direct messages</Label>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Personal messages from others</p>
                            </div>
                            <Switch id="messages" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                              <Label htmlFor="sounds" className="text-base">Notification sounds</Label>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Play sound for notifications</p>
                            </div>
                            <Switch id="sounds" />
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                          Performance
                        </h3>
                        <div className="space-y-6">
                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                              <Label htmlFor="hardware-accel" className="text-base">
                                Hardware Acceleration
                              </Label>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Use GPU for better performance</p>
                            </div>
                            <Switch id="hardware-accel" defaultChecked />
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                              <Label htmlFor="cache-size" className="text-base">Cache Size</Label>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Set maximum cache size</p>
                            </div>
                            <Select defaultValue="medium">
                              <SelectTrigger className="w-full sm:w-[180px] dark:border-gray-700 rounded-lg">
                                <SelectValue placeholder="Select cache size" />
                              </SelectTrigger>
                              <SelectContent className='dark:border-gray-700'>
                                <SelectItem value="small" className='hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer'>
                                  Small (100MB)
                                </SelectItem>
                                <SelectItem value="medium" className='hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer'>
                                  Medium (500MB)
                                </SelectItem>
                                <SelectItem value="large" className='hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer'>
                                  Large (1GB)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer group">
              <div className="flex items-center gap-2">
                {user?.user?.firstName && user?.user?.lastName ? (
                  // Show user initials if name exists
                  <div className="flex items-center justify-center h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-medium group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                    {user.user.firstName.charAt(0)}
                    {user.user.lastName.charAt(0)}
                  </div>
                ) : (
                  // Fallback to user icon
                  <div className="bg-transparent p-1 md:p-2 rounded-full transition-colors group-hover:bg-gray-100 dark:group-hover:bg-gray-700">
                    <FaUserCircle className="text-2xl text-blue-600 dark:text-blue-400 transition-colors group-hover:text-blue-700 dark:group-hover:text-blue-300" />
                  </div>
                )}
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 mt-2 border border-gray-100 dark:border-gray-700 rounded-lg shadow-xl dark:shadow-2xl dark:shadow-black/50 bg-white dark:bg-gray-800 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <DropdownMenuLabel className="font-semibold text-gray-900 dark:text-white">
                My Account
              </DropdownMenuLabel>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                {(user && user.user.email) || "admin@example.com"}
              </div>
            </div>

            <div className="p-2">
              <DropdownMenuGroup>
                <DropdownMenuItem className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <User className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>Profile</span>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-1 bg-gray-100 dark:bg-gray-700" />

              <DropdownMenuGroup>
                <DropdownMenuItem className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <Users className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>Team</span>
                  <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <Plus className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>New Team</span>
                  <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-1 bg-gray-100 dark:bg-gray-700" />

              <DropdownMenuItem
                onClick={() => logoutUser()}
                className="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{loading ? "Processing..." : "Log out"}</span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
