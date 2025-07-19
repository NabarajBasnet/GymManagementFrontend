"use client";

import { useQuery } from "@tanstack/react-query";
import { TbLiveViewFilled } from "react-icons/tb";
import { RiUserLocationFill } from "react-icons/ri";
import { MdAdd } from "react-icons/md";
import { FaList } from "react-icons/fa";
import { HiClipboardList } from "react-icons/hi";
import { FaMoneyBillAlt } from "react-icons/fa";
import { IoReceiptSharp } from "react-icons/io5";
import { AiFillProduct } from "react-icons/ai";
import { ImUsers } from "react-icons/im";
import Loader from "@/components/Loader/Loader";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { useUser } from "@/components/Providers/LoggedInUserProvider";
import { motion } from "framer-motion";

// Icons
import { FaDumbbell } from "react-icons/fa6";
import { BiSolidUserCheck } from "react-icons/bi";
import {
  FaUsers,
  FaMoneyCheckAlt,
  FaRegUser,
  FaChartLine,
  FaClipboardList,
  FaUserCog,
} from "react-icons/fa";
import {
  MdPayments,
  MdFeedback,
  MdAutoGraph,
  MdAttachMoney,
} from "react-icons/md";
import { GiLockers, GiBiceps } from "react-icons/gi";
import { TiUserAdd } from "react-icons/ti";
import { AiOutlineSchedule } from "react-icons/ai";
import { HiUsers } from "react-icons/hi2";
import { FaUsersGear, FaUsersRays } from "react-icons/fa6";
import { IoPeopleSharp } from "react-icons/io5";
import { FcParallelTasks } from "react-icons/fc";
import { PiUsersFourFill, PiUsersThreeBold } from "react-icons/pi";
import {
  LogOut,
  Settings,
  User,
  ChevronRight,
  LayoutDashboard,
  Bell,
  Crown,
  Loader2
} from "lucide-react";
import { IoMdCart } from "react-icons/io";

// Components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/DashboardUI/SidebarAccrodin";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
});

const Sidebar = () => {
  const { user, loading: userLoading } = useUser();
  const loggedInUser = user?.user;

  // Join notification room
  socket.emit("join-user-notification-room");

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const sidebarMinimized = useSelector(
    (state) => state.rtkreducer.sidebarMinimized
  );
  const [activeItem, setActiveItem] = useState("");
  const [hoveredItem, setHoveredItem] = useState(null);

  // Set active item based on current route
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      setActiveItem(path);
    }
  }, []);

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
        toast.success(responseBody.message, {
          style: {
            background: "#10B981",
            color: "#FFFFFF",
            fontWeight: "500",
          },
          iconTheme: {
            primary: "#FFFFFF",
            secondary: "#10B981",
          },
        });
        router.push("/userlogin");
        window.location.reload();
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Failed to logout. Please try again.", {
        style: {
          background: "#EF4444",
          color: "#FFFFFF",
          fontWeight: "500",
        },
      });
      setLoading(false);
    }
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        duration: 0.3,
      },
    },
  };

  // Advanced sidebar content
  const sidebarContent = [
    // Dashboard
    {
      category: "Main",
      items: [
        {
          icon: LayoutDashboard,
          title: "Dashboard",
          link: "/dashboard",
          // badgeColor: 'bg-gradient-to-r from-emerald-500 to-teal-500'
        },
      ],
    },
    // Attendance Management
    {
      category: "Attendance",
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
          link: "/dashboard/smartcheckin/membercheckin",
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
            // {
            //   icon: TbLiveViewFilled,
            //   title: "Live Track",
            //   link: "/dashboard/smartcheckin/livetrack",
            // },
          ],
        },
      ],
    },
    // Member Management
    {
      category: "Members",
      items: [
        {
          icon: TiUserAdd,
          title: "New Member",
          link: "/dashboard/newmember",
          highlight: true,
        },
        ...(user?.user?.organizationBranch && loggedInUser?.role !== 'Gym Admin'
          ? [
            {
              icon: ImUsers,
              title: "Member Transfer",
              link: "/dashboard/membertransfer",
              highlight: true,
            },
          ]
          : []
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
          // subObj: [
          //   {
          //     icon: FaMoneyCheckAlt,
          //     title: "Plans Management",
          //     link: "/dashboard/membershipplans/plansmanagement",
          //   },
          //   {
          //     icon: FaMoneyCheckAlt,
          //     title: "View Plans",
          //     link: "/dashboard/membershipplans/viewplans",
          //   },
          // ],
        },
        {
          icon: FaUsers,
          title: "Payment Reminder",
          link: "/dashboard/paymentreminders",
        },
        // {
        //   icon: LuLogs,
        //   title: "Membership Logs",
        //   link: "/dashboard/members/membershiplogs",
        // },
        // {
        //   icon: MdAutoGraph,
        //   title: 'Member Performance',
        //   link: '/dashboard/members/memberperformance',
        //   badge: 'Pro',
        //   badgeColor: 'bg-gradient-to-r from-purple-500 to-indigo-500'
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
      category: "Facility",
      items: [
        {
          icon: GiLockers,
          title: "Locker Management",
          link: "/dashboard/lockersmanagement",
        },
        {
          icon: GiLockers,
          title: "Locker Expiry",
          link: "/dashboard/lockersexpiry",
        },
        {
          icon: GiBiceps,
          title: "Personal Training",
          link: "/dashboard/personaltraining",
          subObj: [
            ...(loggedInUser?.role !== 'Gym Admin'
              ? [
                {
                  icon: FaDumbbell,
                  title: "Training Packages",
                  link: "/dashboard/personaltraining/trainingpackages",
                },
              ]
              : []
            ),
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
    ...(user?.user?.organizationBranch && loggedInUser?.role !== 'Gym Admin'
      ? [
        {
          category: "Staff",
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
                ...(loggedInUser?.role === 'Gym Admin'
                  ? []
                  : [
                    {
                      icon: FcParallelTasks,
                      title: "Task Management",
                      link: "/dashboard/staffmanagement/taskmanagement",
                    },
                  ]
                ),
              ],
            },
          ],
        },
      ]
      : []
    ),
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

  // Function to determine if a link is active
  const isActive = (link) => {
    return activeItem === link || activeItem.startsWith(link + "/");
  };

  // get notifications
  const getNotifications = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/user-notification/get`);
      const resBody = await response.json();
      return resBody;
    } catch (error) {
      console.log("Error: ", error);
      toast.error(error.message);
    };
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications
  });

  // Listen to emit event
  useEffect(() => {

    const getNotificationHandler = (data) => {
      refetch();
    }

    socket.on('new_notification', getNotificationHandler);
    return () => {
      socket.off('new_notification', getNotificationHandler);
    }
  }, [, refetch, loggedInUser]);

  const { notifications } = data || {};

  const unreadedNotifications = notifications?.filter((notif) => {
    return notif.status === 'Unread'
  })

  const markSingleNotificationAsRead = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/user-notification/single-read/${id}`, {
        method: "PATCH",
      });
      const resBody = await response.json();
      if (response.ok) {
        refetch()
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error(error.message);
    }
  };

  const markBulkNotificationAsRead = async () => {
    try {
      const unreadedNotificationsIds = notifications?.filter((notif) => notif.status === 'Unread').map((notif) => notif._id);

      if (!unreadedNotificationsIds || unreadedNotificationsIds.length === 0) {
        toast.error("No unread notifications");
        return;
      }

      const response = await fetch(`http://localhost:3000/api/user-notification/bulk-read/`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ unreadedNotificationsIds })
      });
      const resBody = await response.json();
      if (response.ok) {
        refetch()
        toast.success(resBody.message || "Notifications marked as read");
      };
      refetch();
    } catch (error) {
      console.log("Error: ", error);
      toast.error(error.message);
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <motion.aside
        className={`fixed left-0 transition-all duration-300 bg-white dark:bg-gray-900 top-0 h-full 
          ${sidebarMinimized ? "w-20" : "w-60"
          } z-50 flex flex-col border-r dark:border-gray-700 dark:shadow-[5px_0_30px_rgba(0,0,0,0.2)]`}
      >
        {/* Logo and Brand */}
        {userLoading ? (
          <Loader />
        ) : (
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-4 py-3.5">
            <Link href={"/dashboard"} className="flex items-center">
              <div className="relative flex items-center justify-center w-12 h-11 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-500 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/20">
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
              {!sidebarMinimized && (
                <div className="ml-3.5">
                  <p className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">
                    {user?.user?.organization?.name}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {user?.user?.organization?.businessType}
                    </p>
                    <Badge
                      variant="outline"
                      className="text-[9px] py-0 h-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-medium"
                    >
                      {user?.user?.organizationBranch ? `${user?.user?.organizationBranch?.orgBranchName}` : `${user?.user?.organization?.name}`}
                    </Badge>
                  </div>
                </div>
              )}
            </Link>
          </div>
        )}


        {/* Sidebar Content */}
        <div className="flex-grow overflow-y-auto px-3 py-5 scrollbar-background-white scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent">
          {sidebarContent.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial="hidden"
              animate="visible"
              transition={{
                staggerChildren: 0.05,
                delayChildren: categoryIndex * 0.05,
              }}
              className="mb-6"
            >
              {!sidebarMinimized && (
                <motion.p
                  variants={itemVariants}
                  className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 ml-3 mb-3 letter-spacing-[0.2em]"
                >
                  {category.category}
                </motion.p>
              )}
              <ul>
                {category.items.map((item, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    className="mb-1.5"
                    onMouseEnter={() =>
                      setHoveredItem(`${categoryIndex}-${index}`)
                    }
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {item.subObj ? (
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value={`item-${categoryIndex}-${index}`}>
                          <AccordionTrigger
                            className={`group w-full flex items-center px-4 py-2.5 rounded-xl text-sm transition-all duration-300
                                                            ${isActive(
                              item.link
                            )
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
                              <div className="relative">
                                <item.icon
                                  className={`w-5 h-5 transition-all duration-200 
                                                                ${hoveredItem ===
                                      `${categoryIndex}-${index}`
                                      ? "scale-110"
                                      : ""
                                    }`}
                                />
                                {hoveredItem ===
                                  `${categoryIndex}-${index}` && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="absolute -inset-1.5 bg-gray-100 dark:bg-gray-800 rounded-full -z-10"
                                    />
                                  )}
                              </div>
                              {!sidebarMinimized && (
                                <span className="ml-3.5 font-medium">
                                  {item.title}
                                </span>
                              )}
                              {item.badge && !sidebarMinimized && (
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
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Link
                                      href={subItem.link}
                                      className={`group flex items-center px-3 py-1 text-sm font-medium transition-all duration-200 rounded-md
                                                                                    ${isActive(
                                        subItem.link
                                      )
                                          ? "text-indigo-700 dark:text-indigo-400 font-medium bg-indigo-50/60 dark:bg-indigo-900/10"
                                          : "text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800/40"
                                        }`}
                                    >
                                      <div className="relative">
                                        <subItem.icon
                                          className={`w-4 h-4 ${isActive(subItem.link)
                                            ? "text-indigo-600 dark:text-indigo-400"
                                            : "text-gray-500 dark:text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                                            }`}
                                        />
                                      </div>
                                      {!sidebarMinimized && (
                                        <span className="ml-3 my-2 text-sm font-medium tracking-tight">
                                          {subItem.title}
                                        </span>
                                      )}
                                      {subItem.badge && !sidebarMinimized && (
                                        <Badge
                                          className={`ml-2 text-[9px] py-0 h-5 text-white ${subItem.badgeColor}`}
                                        >
                                          {subItem.badge}
                                        </Badge>
                                      )}
                                    </Link>
                                  </TooltipTrigger>
                                  {sidebarMinimized && (
                                    <TooltipContent
                                      side="right"
                                      sideOffset={20}
                                      className="bg-gray-900 text-white text-xs font-medium py-1.5 px-3"
                                    >
                                      {subItem.title}
                                      {subItem.badge && (
                                        <span
                                          className={`ml-1.5 text-[9px] py-0.5 px-1.5 rounded-sm text-white ${subItem.badgeColor}`}
                                        >
                                          {subItem.badge}
                                        </span>
                                      )}
                                    </TooltipContent>
                                  )}
                                </Tooltip>
                              </AccordionContent>
                            ))}
                          </div>
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.link}
                            className={`group flex items-center px-4 py-2.5 rounded-xl text-sm transition-all duration-300
                                                                ${isActive(
                              item.link
                            )
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
                              <div className="relative">
                                <item.icon
                                  className={`w-5 h-5 transition-all duration-200 
                                                                ${hoveredItem ===
                                      `${categoryIndex}-${index}`
                                      ? "scale-110 rotate-3"
                                      : ""
                                    }`}
                                />
                                {hoveredItem ===
                                  `${categoryIndex}-${index}` && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="absolute -inset-1.5 bg-gray-100 dark:bg-gray-800 rounded-full -z-10"
                                    />
                                  )}
                              </div>
                              {!sidebarMinimized && (
                                <span className="ml-3.5 font-medium tracking-tight">
                                  {item.title}
                                </span>
                              )}
                              {item.badge && !sidebarMinimized && (
                                <Badge
                                  className={`ml-2.5 text-[9px] py-0 h-5 text-white ${item.badgeColor}`}
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                          </Link>
                        </TooltipTrigger>
                        {sidebarMinimized && (
                          <TooltipContent
                            side="right"
                            sideOffset={20}
                            className="bg-gray-900 text-white text-xs font-medium py-1.5 px-3"
                          >
                            {item.title}
                            {item.badge && (
                              <span
                                className={`ml-1.5 text-[9px] py-0.5 px-1.5 rounded-sm text-white ${item.badgeColor}`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* User Profile Section */}
        <div className="mt-auto border-t border-gray-100 px-3 dark:border-gray-800 pt-3 pb-4">
          {/* Notifications badge */}
          {sidebarMinimized ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-full mb-2 h-12 relative flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl"
                    >
                      <Bell className="h-5 w-5 text-gray-500" />
                      {unreadedNotifications?.length > 0 && (
                        <span className="absolute top-2 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                          {unreadedNotifications?.length}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-80 md:w-96 max-h-[70vh] flex flex-col dark:bg-gray-900 dark:border-none"
                    align="end"
                    side="right"
                    sideOffset={20}
                  >
                    <DropdownMenuLabel className="flex justify-between items-center px-2">
                      <span>Notifications</span>
                      <button
                        onClick={markBulkNotificationAsRead}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Mark all as read
                      </button>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    {/* Scrollable notification list */}
                    <div className="flex-1 overflow-y-auto">
                      <DropdownMenuGroup>
                        {unreadedNotifications?.length >= 1 ? (
                          unreadedNotifications?.map((notif) => (
                            <DropdownMenuItem
                              onClick={() => markSingleNotificationAsRead(notif._id)}
                              key={notif._id}
                              className="flex cursor-pointer items-start gap-3 py-3 hover:bg-indigo-50/50 dark:hover:bg-gray-800"
                            >
                              <div>
                                <p className="font-medium">{notif.type || 'N/A'}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{notif.message || 'N/A'}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                  {new Date(notif.createdAt).toLocaleString("en-US", {
                                    weekday: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                              {notif.status === 'Unread' && (
                                <span
                                  className={`ml-auto w-2 h-2 rounded-full ${notif.priority.toString() === 'High'
                                      ? 'bg-red-600'
                                      : notif.priority.toString() === 'Normal'
                                        ? 'bg-yellow-600'
                                        : notif.priority.toString() === 'Low'
                                          ? 'bg-green-600'
                                          : 'bg-gray-600'
                                    }`}
                                />
                              )}
                            </DropdownMenuItem>
                          ))
                        ) : (
                          <DropdownMenuItem className="flex items-start gap-3 py-3 hover:bg-indigo-50/50 dark:hover:bg-gray-800">
                            <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-full">
                              <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                              <p className="font-medium">No notifications yet</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">You're all caught up!</p>
                            </div>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuGroup>
                    </div>

                    <DropdownMenuSeparator />

                    {/* Footer always visible */}
                    <DropdownMenuItem className="justify-center cursor-pointer text-indigo-600 dark:text-indigo-400 hover:underline">
                      View all notifications
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={20}
                className="bg-gray-900 text-white text-xs"
              >
                Notifications
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
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
                    {unreadedNotifications?.length > 0 && (
                      <Badge className="bg-red-500 text-white hover:bg-red-600">
                        {unreadedNotifications.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-80 md:w-96 max-h-[70vh] flex flex-col dark:bg-gray-900 dark:border-none"
                  align="end"
                >
                  <DropdownMenuLabel className="flex justify-between items-center px-2">
                    <span>Notifications</span>
                    <button
                      onClick={markBulkNotificationAsRead}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Mark all as read
                    </button>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  {/* Scrollable notification list */}
                  <div className="flex-1 overflow-y-auto">
                    <DropdownMenuGroup>
                      {unreadedNotifications?.length >= 1 ? (
                        unreadedNotifications.map((notif) => (
                          <DropdownMenuItem
                            onClick={() => markSingleNotificationAsRead(notif._id)}
                            key={notif._id}
                            className="flex cursor-pointer items-start gap-3 py-3 hover:bg-indigo-50/50 dark:hover:bg-gray-800"
                          >
                            <div>
                              <p className="font-medium">{notif.type || 'N/A'}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{notif.message || 'N/A'}</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                {new Date(notif.createdAt).toLocaleString("en-US", {
                                  weekday: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                            {notif.status === 'Unread' && (
                              <span
                                className={`ml-auto w-2 h-2 rounded-full ${notif.priority.toString() === 'High'
                                    ? 'bg-red-600'
                                    : notif.priority.toString() === 'Normal'
                                      ? 'bg-yellow-600'
                                      : notif.priority.toString() === 'Low'
                                        ? 'bg-green-600'
                                        : 'bg-gray-600'
                                  }`}
                              />
                            )}
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <DropdownMenuItem className="flex items-start gap-3 py-3 hover:bg-indigo-50/50 dark:hover:bg-gray-800">
                          <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-full">
                            <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div>
                            <p className="font-medium">No notifications yet</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">You're all caught up!</p>
                          </div>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuGroup>
                  </div>

                  <DropdownMenuSeparator />

                  {/* Footer always visible */}
                  <DropdownMenuItem className="justify-center cursor-pointer text-indigo-600 dark:text-indigo-400 hover:underline">
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {userLoading ? (
            <Loader />
          ) : (
            <DropdownMenu className="border dark:border-none dark:bg-gray-800">
              <DropdownMenuTrigger asChild>
                <div
                  className={`flex items-center rounded-xl cursor-pointer p-2 ${sidebarMinimized ? "justify-center" : "px-3"
                    } hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors duration-200`}
                >
                  <Avatar className="h-10 w-10 border-2 border-indigo-100 dark:border-indigo-900/50 shadow-sm">
                    <AvatarImage
                      src={user?.user?.avatarUrl || ""}
                      alt={user?.user?.firstName || ""}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-medium">
                      {user?.user?.firstName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>

                  {!sidebarMinimized && (
                    <div className="ml-3 overflow-hidden">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-tight">
                        {(user &&
                          user?.user?.firstName + " " + user?.user?.lastName) ||
                          "Admin"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {(user && user?.user?.email) || ""}
                      </p>
                    </div>
                  )}

                  {!sidebarMinimized && (
                    <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
                  )}
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-64 p-0 rounded-xl shadow-2xl dark:border-none dark:bg-gray-900 shadow-gray-200/70 dark:shadow-none border border-gray-100 dark:border-gray-800"
                side={sidebarMinimized ? "right" : "top"}
                align={sidebarMinimized ? "start" : "end"}
                alignOffset={10}
              >
                <DropdownMenuLabel className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                  {userLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 border-2 border-indigo-100 dark:border-indigo-900/50 shadow-sm mr-3">
                        <AvatarImage
                          src={user?.user?.avatarUrl || ""}
                          alt={user?.user?.firstName || ""}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-medium">
                          {user?.user?.firstName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          {user?.user?.firstName + " " + user?.user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user && user?.user?.email}
                        </p>
                      </div>
                    </div>
                  )}
                </DropdownMenuLabel>

                <DropdownMenuGroup className="p-1.5">
                  <DropdownMenuItem className="px-3 py-2.5 rounded-lg focus:bg-gray-50 dark:focus:bg-gray-800/60 cursor-pointer">
                    <User className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-3 py-2.5 rounded-lg focus:bg-gray-50 dark:focus:bg-gray-800/60 cursor-pointer">
                    <Settings className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-1 bg-gray-100 dark:bg-gray-800" />

                <DropdownMenuGroup className="p-1.5">
                  <DropdownMenuItem
                    onClick={logoutUser}
                    className="px-3 py-2.5 rounded-lg focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer text-red-600 dark:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </motion.aside>
    </TooltipProvider>
  );
};

export default Sidebar;
