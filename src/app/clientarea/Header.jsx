"use client";

import { FaLockOpen, FaMoneyBill } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useTheme } from "next-themes";
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
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Home,
  MessageSquare,
  Star,
  LineChart,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  QrCode,
  Shield,
  Crown,
  Zap,
  Bell,
  HelpCircle,
  CreditCard,
  Building2,
  Calendar,
  TrendingUp,
  Award,
  ShoppingCart,
  Package, Moon, Sun, CheckCircle, AlertTriangle, UserPlus
} from "lucide-react";
import { IoMenu } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useTenant } from "@/components/Providers/LoggedInTenantProvider";
import Loader from "@/components/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { ToggleClientSidebar } from "@/state/slicer";
import { io } from 'socket.io-client';
import Link from "next/link";

const socket = io('https://fitbinary.com', {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
})

const ClientAreaHeader = ({ activeTab }) => {
  const cartLength = useSelector((state) => state.rtkreducer.cartLength);
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedNotificationIds, setSelectedNotificationIds] = useState([]);
  const { setTheme } = useTheme();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const router = useRouter();
  const { tenant, loading } = useTenant();
  const loggedInTenant = tenant?.tenant;

  // Get the nav items based on features
  const navItems = [
    {
      id: "/clientarea/dashboard",
      icon: <Home size={20} />,
      label: "Dashboard",
      description: "Overview & Analytics",
    },
    {
      id: "/userlogin",
      icon: <QrCode size={20} />,
      label: "Gym Dashboard",
      description: "Access Control & Monitoring",
    },
    {
      id: "/clientarea/branchmanagement",
      icon: <Building2 size={20} />,
      label: "Branch Management",
      description: "Manage Branch",
    },
    {
      id: "/clientarea/pricing",
      icon: <CreditCard size={20} />,
      label: "Pricing",
      description: "View and purchase services & products",
    },
    {
      id: "/clientarea/systemusers",
      icon: <User size={20} />,
      label: "System Users",
      description: "Manage System Users",
    },
    {
      id: "/clientarea/lockermanagement",
      icon: < FaLockOpen size={20} />,
      label: "Locker Management",
      description: "Manage Lockers",
    },
    {
      id: "/clientarea/myorders",
      icon: <Package size={20} />,
      label: "My Orders",
      description: "My Orders",
    },
    {
      id: "/clientarea/billingprofile",
      icon: <FaMoneyBill size={18} />,
      label: "Billing Profile",
      description: "Billing Details",
    },
    {
      id: "/clientarea/membershipplans",
      icon: <Package size={20} />,
      label: "Membership Plans",
      description: "Gym Membership Plans",
    },
    {
      id: "/clientarea/settings",
      icon: <Settings size={20} />,
      label: "Settings",
      description: "Configuration & Preferences",
    },
  ];

  const handleNavClick = (id, tab) => {
    router.push(id);
    setIsSheetOpen(false);
  };

  const logOutTenant = async () => {
    try {
      const response = await fetch(
        `https://fitbinary.com/api/tenant/auth/logout`,
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

  // Notification related functions

  // get notifications
  const getNotifications = async () => {
    try {
      const response = await fetch(`https://fitbinary.com/api/tenant-notification/get`);
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

  const { tenantnotifications } = data || {};

  // join server on load
  socket.emit('join-tenant-notification-room');

  useEffect(() => {
    const handleTenantNotification = (data) => {
      refetch();
    }

    socket.on('tenant_notifications', handleTenantNotification);
    return () => {
      socket.off('tenant_notifications', handleTenantNotification);
    }
  }, [refetch, loggedInTenant]);

  const unreadedNotifications = tenantnotifications?.filter((notif) => {
    return notif.status === 'Unread'
  })

  const markSingleNotificationAsRead = async (id) => {
    try {
      const response = await fetch(`https://fitbinary.com/api/tenant-notification/single-read/${id}`, {
        method: "PATCH",
      });
      const resBody = await response.json();
    } catch (error) {
      console.log("Error: ", error);
      toast.error(error.message);
    }
  };

  const markBulkNotificationAsRead = async () => {
    try {
      const unreadedNotificationsIds = tenantnotifications?.filter((notif) => notif.status === 'Unread').map((notif) => notif._id);

      if (!unreadedNotificationsIds || unreadedNotificationsIds.length === 0) {
        toast.error("No unread notifications");
        return;
      }

      const response = await fetch(`https://fitbinary.com/api/tenant-notification/bulk-read/`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ unreadedNotificationsIds })
      });
      const resBody = await response.json();
      if (response.ok) {
        toast.success(resBody.message || "Notifications marked as read");
      };
      refetch();
    } catch (error) {
      console.log("Error: ", error);
      toast.error(error.message);
    }
  };

  return (
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg py-2 px-2 md:px-0 shadow-md border-b border-gray-100/50 dark:border-gray-800/50 sticky top-0 z-40">
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full mx-auto md:px-2">
          <div className="flex justify-between items-center h-18">
            {/* Mobile menu button */}

            <button
              onClick={() => dispatch(ToggleClientSidebar())}
              className="inline-flex hidden md:flex items-center justify-center p-3 rounded-xl text-gray-600 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-indigo-50/80 dark:focus:bg-indigo-900/20 transition-all duration-200 group"
              aria-label="Open menu"
            >
              <IoMenu className="block h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
            </button>

            <div className="flex items-center md:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <button
                    className="inline-flex items-center justify-center p-3 rounded-xl text-gray-600 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-indigo-50/80 dark:focus:bg-indigo-900/20 transition-all duration-200 group"
                    aria-label="Open menu"
                  >
                    <IoMenu className="block h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[320px] sm:w-[360px] p-0 bg-gradient-to-b from-white dark:from-gray-900 to-gray-50/30 dark:to-gray-800/30"
                >
                  <div className="h-full flex flex-col">
                    {/* Enhanced User Profile */}
                    {loggedInTenant && (
                      <div className="px-6 py-6 bg-gradient-to-r from-indigo-50 dark:from-indigo-900/20 to-purple-50 dark:to-purple-900/20 border-b border-indigo-100 dark:border-indigo-800/30">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-lg font-bold text-white shadow-lg">
                              {loggedInTenant?.fullName
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
                              {loggedInTenant?.fullName}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex items-center space-x-1">
                                <span className="text-xs font-medium dark:text-white">
                                  Account Status:
                                </span>
                                <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
                                  {loggedInTenant?.freeTrailStatus}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-3">
                          Main Navigation
                        </h4>
                        {navItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={`flex items-center w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${activeTab === item.id
                              ? "bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg transform scale-[1.02]"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-indigo-700 dark:hover:text-indigo-400 hover:transform hover:scale-[1.01]"
                              }`}
                          >
                            <span
                              className={`mr-4 p-1.5 rounded-lg ${activeTab === item.id
                                ? "bg-white/20"
                                : "bg-gray-100 dark:bg-gray-800 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30"
                                }`}
                            >
                              {item.icon}
                            </span>
                            <div className="flex-1 text-left">
                              <div className="font-semibold">{item.label}</div>
                              <div
                                className={`text-xs ${activeTab === item.id
                                  ? "text-white/80"
                                  : "text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                                  }`}
                              >
                                {item.description}
                              </div>
                            </div>
                            {activeTab === item.id && (
                              <Award size={16} className="text-white/80" />
                            )}
                          </button>
                        ))}
                      </div>
                    </nav>

                    {/* Enhanced Footer */}
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="w-full flex items-center p-3 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-200 group">
                            {loggedInTenant && (
                              <>
                                <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-sm font-bold text-white">
                                  {loggedInTenant?.fullName
                                    ?.split(" ")
                                    .map((word) => word[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></div>
                                </div>
                                <div className="ml-3 flex-1 text-left">
                                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {loggedInTenant?.fullName}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Account Settings
                                  </p>
                                </div>
                                <Settings
                                  size={16}
                                  className="text-gray-400 dark:text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                                />
                              </>
                            )}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64" side="right">
                          <DropdownMenuLabel className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                            <div className="font-semibold text-gray-800 dark:text-gray-200">
                              Account Management
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Manage your account settings
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                            <User className="mr-3" size={16} />
                            <div>
                              <div className="font-medium text-gray-900 dark:text-gray-100">
                                Profile Settings
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Update personal information
                              </div>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer px-4 py-3 bg-gradient-to-r from-indigo-50 dark:from-indigo-900/20 to-purple-50 dark:to-purple-900/20 hover:from-indigo-100 dark:hover:from-indigo-800/30 hover:to-purple-100 dark:hover:to-purple-800/30">
                            <Crown className="mr-3 text-yellow-600" size={16} />
                            <div>
                              <div className="font-medium text-indigo-700 dark:text-indigo-400">
                                Upgrade Plan
                              </div>
                              <div className="text-xs text-indigo-600 dark:text-indigo-500">
                                Unlock premium features
                              </div>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={logOutTenant}
                          >
                            <LogOut className="mr-3" size={16} />
                            <div>
                              <div className="font-medium">Sign Out</div>
                              <div className="text-xs text-red-500 dark:text-red-400">
                                End current session
                              </div>
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex items-center rounded-lg bg-transparent">
              {loggedInTenant?.freeTrailStatus === 'Active' ? (
                <div className="md:flex text-center items-center md:space-x-2 space-x-1 justify-between w-full">
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    <span className="font-semibold">{loggedInTenant?.freeTrailRemainingDays}</span> Days left on free trial
                  </p>
                  <button
                    onClick={() => {
                      window.location.href = '/clientarea/pricing';
                    }}
                    className="md:px-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400 transition-all"
                  >
                    Upgrade Now
                  </button>
                </div>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                </div>
              )}
            </div>

            {/* Enhanced User Profile */}
            <div className="flex items-center space-x-1 md:space-x-4">
              {/* Quick Action Buttons - Desktop */}
              <div className="flex items-center md:space-x-2">
                <button
                  onClick={() => router.push('/clientarea/cart')}
                  className="relative p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/20 transition-all duration-200 group"
                >
                  <MdOutlineShoppingCart />
                  {cartLength ? (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartLength}
                    </span>
                  ) : null}
                </button>

                {/* Notification */}
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
                              <Link href={notif.actionUrl || '/dashboard'}>
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
                              </Link>
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

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="relative p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-300 group"
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-3 p-2 hover:bg-transparent rounded-xl hover:bg-gray-50/80 dark:hover:bg-gray-800/80 transition-all duration-200 group">
                    {loggedInTenant && (
                      <>
                        <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                          {loggedInTenant?.fullName
                            ?.split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></div>
                        </div>
                        <div className="hidden lg:block text-left">
                          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                            {loggedInTenant?.fullName}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${loggedInTenant?.status === "active"
                                ? "bg-green-100 text-green-800"
                                : loggedInTenant?.status === "inactive"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                                }`}
                            >
                              <span className="capitalize">
                                Account: {loggedInTenant?.status || "unknown"}
                              </span>
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 dark:bg-gray-900 dark:border-gray-700" align="end">
                  <DropdownMenuLabel className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-sm font-bold text-white">
                        {loggedInTenant?.fullName
                          ?.split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 dark:text-gray-200">
                          {loggedInTenant?.fullName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                          <span
                            className={`font-medium px-2 py-0.5 rounded-full ${loggedInTenant?.freeTrailStatus === "Active"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                              }`}
                          >
                            {loggedInTenant?.freeTrailStatus === "Active"
                              ? `Free Trial • ${loggedInTenant?.freeTrailStatus}`
                              : `Subscription • ${loggedInTenant?.subscriptionStatus}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <div className="py-2">

                    <DropdownMenuItem
                      className="cursor-pointer px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => router.push("/clientarea/mysubscriptions")}
                    >
                      <CreditCard className="mr-3" size={16} />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          Billing & Usage
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          View invoices and usage
                        </div>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="cursor-pointer px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => router.push("/clientarea/myorders")}
                    >
                      <Package className="mr-3" size={16} />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          My Orders
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          View my orders
                        </div>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="cursor-pointer px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => router.push("/clientarea/settings")}
                    >
                      <Settings className="mr-3" size={16} />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          Settings
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Configure and preferences
                        </div>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="cursor-pointer px-4 py-3 bg-gradient-to-r from-indigo-50 dark:from-indigo-900/20 to-purple-50 dark:to-purple-900/20 hover:from-indigo-100 dark:hover:from-indigo-800/30 hover:to-purple-100 dark:hover:to-purple-800/30"
                      onClick={() => router.push("/clientarea/upgrade")}
                    >
                      <Crown className="mr-3 text-yellow-600" size={16} />
                      <div>
                        <div className="font-medium text-indigo-700 dark:text-indigo-400">
                          Upgrade to Premium
                        </div>
                        <div className="text-xs text-indigo-600 dark:text-indigo-500">
                          Unlock advanced features
                        </div>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="cursor-pointer px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => router.push("/clientarea/support")}
                    >
                      <HelpCircle className="mr-3" size={16} />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          Help & Support
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Get assistance
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </div>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={logOutTenant}
                  >
                    <LogOut className="mr-3" size={16} />
                    <div>
                      <div className="font-medium">Sign Out</div>
                      <div className="text-xs text-red-500 dark:text-red-400">
                        End your session securely
                      </div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default ClientAreaHeader;
