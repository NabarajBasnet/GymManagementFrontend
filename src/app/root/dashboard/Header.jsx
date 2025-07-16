"use client";

// Icons
import { FiShoppingCart } from "react-icons/fi";
import { MdOutlineShoppingCart } from "react-icons/md";
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
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  Home,
  Settings,
  LogOut,
  User,
  Shield,
  Crown,
  HelpCircle,
  CreditCard,
  Users,
  Database,
  Activity,
  BarChart3,
  ShieldCheck,
  Cog,
  AlertTriangle,
  Globe,
  Lock,
  UserCheck,
  Bell,
  MessageSquare,
  CheckCircle,
  UserPlus,
} from "lucide-react";
import { IoMenu } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useRootUser } from "@/components/Providers/LoggedInRootUserProvider";
import { useDispatch } from "react-redux";
import { ToggleRootSidebar } from "@/state/slicer";

import { io } from 'socket.io-client';
import { useQuery } from "@tanstack/react-query";

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
});

const RootUserHeader = ({ activeTab }) => {
  const dispatch = useDispatch();

  // Join notification room
  socket.emit("join-root-notification-room");

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const router = useRouter();
  const { rootUser, loading } = useRootUser();

  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  const navItems = [
    {
      id: "/root/dashboard",
      icon: <Home size={20} />,
      label: "Admin Dashboard",
      description: "System Overview & Analytics",
    },
    {
      id: "/root/dashboard/tenantmanagement",
      icon: <Users size={20} />,
      label: "Tenant Management",
      description: "Organizations & Clients",
    },
    {
      id: "/root/dashboard/ordermanagement",
      icon: <FiShoppingCart size={20} />,
      label: "Order Management",
      description: "Order Management",
    },
    {
      id: "/root/dashboard/subscriptionmanagement",
      icon: <CreditCard size={20} />,
      label: "Subscription Management",
      description: "Plans & Billing Control",
    },
    {
      id: "/root/dashboard/demomanagement",
      icon: <CreditCard size={20} />,
      label: "Demo Management",
      description: "Handle Demos",
    },
    {
      id: "/root/dashboard/settings",
      icon: <Settings size={20} />,
      label: "System Settings",
      description: "Platform Configuration",
    },
  ];

  const adminQuickActions = [
    {
      icon: <AlertTriangle size={16} />,
      label: "System Alerts",
      count: 2,
      link: "/system",
      color: "text-red-600",
    },
    {
      icon: <Activity size={16} />,
      label: "System Health",
      color: "text-green-600",
      link: "/system",
    },
    {
      icon: <BarChart3 size={16} />,
      label: "Analytics",
      link: "/systemalerts",
      color: "text-blue-600",
    },
    {
      icon: <Database size={16} />,
      label: "Database",
      color: "text-purple-600",
      link: "/systemalerts",
    },
  ];

  const handleNavClick = (id, tab) => {
    router.push(id);
    setIsSheetOpen(false);
  };

  const logOutRootUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/rootuser/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseBody = await response.json();
      if (response.ok) {
        toast.success(responseBody.message);
        router.push(responseBody.redirectUrl);
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error(error.message);
    }
  };

  // Safe access to member data
  const rootUserName = rootUser?.fullName || "";
  const rootUserStatus = rootUser?.status || "";

  // Get admin role styling
  const getAdminRoleStyling = (role) => {
    switch (role?.toLowerCase()) {
      case "super_admin":
        return {
          bg: "bg-gradient-to-r from-red-500 to-pink-600",
          icon: <Crown size={12} />,
          label: "Super Admin",
        };
      case "admin":
        return {
          bg: "bg-gradient-to-r from-purple-500 to-indigo-600",
          icon: <ShieldCheck size={12} />,
          label: "Admin",
        };
      case "moderator":
        return {
          bg: "bg-gradient-to-r from-blue-500 to-cyan-600",
          icon: <Shield size={12} />,
          label: "Moderator",
        };
      default:
        return {
          bg: "bg-gradient-to-r from-gray-500 to-gray-700",
          icon: <UserCheck size={12} />,
          label: role || "Admin",
        };
    }
  };

  const adminRoleStyle = getAdminRoleStyling(rootUser?.rootUserRole);

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

  // get notifications
  const getNotifications = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/root-notification/get`);
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
  }, [, refetch, rootUser]);

  const { notifications } = data || {};

  const unreadedNotifications = notifications?.filter((notif) => {
    return notif.status === 'Unread'
  })

  const markSingleNotificationAsRead = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/root-notification/single-read/${id}`, {
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

      const response = await fetch(`http://localhost:3000/api/root-notification/bulk-read/`, {
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
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg py-3 shadow-sm border-b border-red-100 dark:border-gray-800/50 sticky top-0 z-50">
      <div className="w-full mx-auto px-4">
        <div className="flex justify-between items-center h-18">
          {/* Mobile menu button */}
          <button
            className="inline-flex md:flex hidden items-center justify-center p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50/80 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:bg-red-50/80 dark:focus:bg-gray-800 transition-all duration-200 group"
            onClick={() => dispatch(ToggleRootSidebar())}
          >
            <IoMenu className="block h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
          </button>
          <div className="flex items-center">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <button
                  className="inline-flex items-center flex md:hidden justify-center p-3 rounded-xl text-gray-600 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50/80 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:bg-red-50/80 dark:focus:bg-gray-800 transition-all duration-200 group"
                  aria-label="Open menu"
                >
                  <IoMenu className="block h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[340px] sm:w-[380px] p-0 bg-gradient-to-b from-white dark:from-gray-900 to-red-50/30 dark:to-gray-800/30"
              >
                <div className="h-full flex flex-col">
                  {/* Enhanced Admin Profile */}
                  {rootUser && (
                    <div className="px-6 py-1 bg-gradient-to-r from-red-50 dark:from-gray-800 to-rose-50 dark:to-gray-900 border-b border-red-100 dark:border-gray-700">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-lg font-bold text-white shadow-lg">
                            {rootUserName
                              ?.split(" ")
                              .map((word) => word[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-3 border-white shadow-sm flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg truncate">
                            {rootUserName}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span
                              className={`inline-flex items-center space-x-1 text-xs font-semibold px-3 py-1 rounded-full text-white ${adminRoleStyle.bg} shadow-sm`}
                            >
                              {adminRoleStyle.icon}
                              <span>{adminRoleStyle.label}</span>
                            </span>
                            <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400">
                              {rootUser?.rootUserStatus}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                            <Lock size={12} className="mr-1" />
                            System Administrator
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-3">
                        Administration
                      </h4>
                      {navItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`flex items-center w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${activeTab === item.id
                            ? "bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg transform scale-[1.02]"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-red-700 dark:hover:text-red-400 hover:transform hover:scale-[1.01]"
                            }`}
                        >
                          <span
                            className={`mr-4 p-1.5 rounded-lg ${activeTab === item.id
                              ? "bg-white/20"
                              : "bg-gray-100 dark:bg-gray-800 group-hover:bg-red-100 dark:group-hover:bg-red-900/30"
                              }`}
                          >
                            {item.icon}
                          </span>
                          <div className="flex-1 text-left">
                            <div className="font-semibold">{item.label}</div>
                            <div
                              className={`text-xs ${activeTab === item.id
                                ? "text-white/80"
                                : "text-gray-500 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400"
                                }`}
                            >
                              {item.description}
                            </div>
                          </div>
                          {activeTab === item.id && (
                            <ShieldCheck size={16} className="text-white/80" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-3">
                        System Controls
                      </h4>
                      {adminQuickActions.map((action, index) => (
                        <button
                          onClick={() => router.push(`/root/dashboard/${action.link}`)}
                          key={index}
                          className="flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-red-700 dark:hover:text-red-400 transition-all duration-200 group"
                        >
                          <span
                            className={`mr-3 p-1 rounded-md bg-gray-100 dark:bg-gray-800 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 ${action.color}`}
                          >
                            {action.icon}
                          </span>
                          <span className="flex-1 text-left">
                            {action.label}
                          </span>
                          {action.count && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-medium">
                              {action.count}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </nav>

                  {/* Enhanced Footer */}
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        logOutRootUser();
                        setIsSheetOpen(false);
                      }}
                      className="flex items-center w-full p-3 rounded-xl bg-white dark:bg-gray-900 hover:bg-red-50 dark:hover:bg-red-900/30 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 group"
                    >
                      <LogOut
                        size={18}
                        className="mr-3 group-hover:scale-110 transition-transform"
                      />
                      <div className="flex-1 text-left">
                        <div className="font-semibold">Secure Logout</div>
                        <div className="text-xs text-red-500 dark:text-red-400">
                          End admin session
                        </div>
                      </div>
                      <Shield
                        size={16}
                        className="text-red-400 dark:text-red-500 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors"
                      />
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Enhanced User Profile */}
          <div className="flex items-center space-x-4">
            {/* Quick Action Buttons - Desktop */}
            <div className="hidden lg:flex items-center space-x-2">
              {adminQuickActions.slice(0, 3).map((action, index) => (
                <button
                  key={index}
                  className={`relative p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50/80 dark:hover:bg-gray-800/80 transition-all duration-200 group ${action.color}`}
                  title={action.label}
                >
                  {action.icon}
                  {action.count && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {action.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Notification Real*/}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="relative p-3 rounded-2xl text-gray-600 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-gray-700/80 transition-all duration-200 group"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-0 right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {unreadedNotifications?.length || 0}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 md:w-96 max-h-[70vh] flex flex-col dark:bg-gray-900 dark:border-none" align="end">
                <DropdownMenuLabel className="flex justify-between items-center px-2">
                  <span>Notifications</span>
                  <button
                    onClick={markBulkNotificationAsRead}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
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

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-300 group"
              aria-label="Toggle theme"
            >
              <div className="relative w-5 h-5">
                <Sun
                  className={`absolute inset-0 w-5 h-5 text-black dark:text-white transition-all duration-300 ${darkMode
                    ? "opacity-0 rotate-90 scale-0"
                    : "opacity-100 rotate-0 scale-100"
                    }`}
                />
                <Moon
                  className={`absolute inset-0 w-5 h-5 text-white transition-all duration-300 ${darkMode
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 -rotate-90 scale-0"
                    }`}
                />
              </div>
            </button>

            {/* Cart */}
            <button className="relative p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-300 group">
              <MdOutlineShoppingCart
                size={24}
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-400"
              />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50/80 dark:hover:bg-gray-800/80 transition-all duration-200 group">
                  {rootUser && (
                    <>
                      <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                        {rootUserName
                          ?.split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></div>
                      </div>
                      <div className="hidden lg:block text-left">
                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
                          {rootUserName}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center space-x-1 text-xs font-medium px-2 py-0.5 rounded-md text-white ${adminRoleStyle.bg}`}
                          >
                            {adminRoleStyle.icon}
                            <span>{adminRoleStyle.label}</span>
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-80 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                align="end"
              >
                <DropdownMenuLabel className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-sm font-bold text-white">
                      {rootUserName
                        ?.split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-gray-100">
                        {rootUserName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                        <span
                          className={`inline-flex items-center space-x-1 text-xs font-medium px-2 py-0.5 rounded-md text-white ${adminRoleStyle.bg} mr-2`}
                        >
                          {adminRoleStyle.icon}
                          <span>{adminRoleStyle.label}</span>
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          {rootUser?.rootUserStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <div className="py-2">
                  <DropdownMenuItem className="cursor-pointer px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <User className="mr-3" size={16} />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        Admin Profile
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Manage admin settings
                      </div>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <Globe className="mr-3" size={16} />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        System Configuration
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Platform settings
                      </div>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <Activity
                      className="mr-3 text-green-600 dark:text-green-400"
                      size={16}
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        System Health
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400">
                        All systems operational
                      </div>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <Database
                      className="mr-3 text-blue-600 dark:text-blue-400"
                      size={16}
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        Database Management
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        Monitor & maintain
                      </div>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="cursor-pointer px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <HelpCircle className="mr-3" size={16} />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        Admin Documentation
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        System guides & help
                      </div>
                    </div>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="border-gray-200 dark:border-gray-800" />
                <DropdownMenuItem
                  className="cursor-pointer px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                  onClick={logOutRootUser}
                >
                  <LogOut className="mr-3" size={16} />
                  <div>
                    <div className="font-medium">Secure Logout</div>
                    <div className="text-xs text-red-500 dark:text-red-400">
                      End admin session
                    </div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default RootUserHeader;
