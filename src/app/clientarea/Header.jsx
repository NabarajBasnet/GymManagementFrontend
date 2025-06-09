"use client";

import { FaLockOpen } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { Moon, Sun, Package } from "lucide-react";
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
import toast from "react-hot-toast";
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
} from "lucide-react";
import { IoMenu } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useTenant } from "@/components/Providers/LoggedInTenantProvider";
import Loader from "@/components/Loader/Loader";
import { useSelector } from "react-redux";

const ClientAreaHeader = ({ activeTab }) => {
  const cartLength = useSelector((state) => state.rtkreducer.cartLength);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { setTheme } = useTheme();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const router = useRouter();
  const { tenant, loading } = useTenant();
  const loggedInTenant = tenant?.tenant;

  const tenantOnTrail = loggedInTenant?.freeTrailStatus;
  const freeTrailExpireAt = new Date(loggedInTenant?.freeTrailEndsAt);
  const today = new Date();
  const expireDate = new Date(freeTrailExpireAt.setHours(0, 0, 0, 0));
  const todayDate = new Date(today.setHours(0, 0, 0, 0));

  // Calculate difference in milliseconds
  const diffTime = expireDate.getTime() - todayDate.getTime();
  const remainingDaysOnFreeTrail = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Get the nav items based on features
  const navItems = [
    {
      id: "/clientarea/dashboard",
      icon: <Home size={20} />,
      label: "Dashboard",
      description: "Overview & Analytics",
    },
    {
      id: "/login",
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
      id: "/clientarea/mysubscriptions",
      icon: <MdOutlineShoppingCart size={20} />,
      label: "My Subscriptions",
      description: "My Subscriptions",
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
      id: "/clientarea/settings",
      icon: <Settings size={20} />,
      label: "Settings",
      description: "Configuration & Preferences",
    },
  ];

  const quickActions = [
    {
      icon: <Bell size={16} />,
      label: "Notifications",
      count: 3,
      link: "/clientarea/notifications",
    },
    {
      icon: <ShoppingCart size={16} />,
      label: "Cart",
      count: cartLength,
      link: "/clientarea/cart",
    },
  ];

  const handleNavClick = (id, tab) => {
    router.push(id);
    setIsSheetOpen(false);
  };

  const logOutTenant = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/tenant/auth/logout`,
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

  // Get subscription tier styling
  const getSubscriptionStyling = (status) => {
    switch (status?.toLowerCase()) {
      case "premium":
        return {
          bg: "bg-gradient-to-r from-yellow-400 to-orange-500",
          icon: <Crown size={12} />,
        };
      case "pro":
        return {
          bg: "bg-gradient-to-r from-purple-500 to-indigo-600",
          icon: <Zap size={12} />,
        };
      case "basic":
        return {
          bg: "bg-gradient-to-r from-blue-500 to-cyan-600",
          icon: <Shield size={12} />,
        };
      default:
        return {
          bg: "bg-gradient-to-r from-gray-400 to-gray-600",
          icon: <Shield size={12} />,
        };
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

  return (
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg py-2 shadow-md border-b border-gray-100/50 dark:border-gray-800/50 sticky top-0 z-40">
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            {/* Mobile menu button */}
            <div className="flex items-center">
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
                      <div className="flex flex-col items-start justify-between mb-4">
                        {/* Quick Actions */}
                        <div className="border-gray-200 dark:border-gray-700">
                          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-3">
                            Quick Actions
                          </h4>
                          <div className="flex items-center space-x-2">
                            {quickActions.slice(0, 2).map((action, index) => (
                              <button
                                key={index}
                                onClick={() => router.push(action.link)}
                                className="relative p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/20 transition-all duration-200 group"
                                title={action.label}
                              >
                                {action.icon}
                                {action.count ? (
                                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                    {action.count}
                                  </span>
                                ) : null}
                              </button>
                            ))}
                          </div>
                        </div>
                        {/* <div className="w-full mb-1 flex flex-col items-start text-xs font-medium space-x-1">
                          {loggedInTenant?.freeTrailStatus && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                              <Calendar size={12} className="mr-1" />
                              {
                                loggedInTenant?.tenantFreeTrailRemainingDays
                              }{" "}
                              Days left for free trail
                            </p>
                          )}

                          {loggedInTenant?.tenantOnFreeTrial && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                              <Calendar size={12} className="mr-1" />
                              Ends on{" "}
                              {new Date(
                                loggedInTenant?.tenantFreeTrialEndDate
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div> */}

                        {/* <div className="w-full dark:border dark:border-gray-700 flex items-center bg-gray-100 dark:bg-gray-800 border-gray-200 border py-3 px-4 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                          <User
                            size={16}
                            className="mr-2 text-gray-500 dark:text-gray-400"
                          />
                          <span className="font-medium">
                            Owner: {ownerName}
                          </span>
                        </div> */}
                      </div>
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

            {/* Enhanced Logo */}
            {/* <div className="hidden md:flex justify-center ml-52 items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent">
                    Fit Loft
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-200 font-medium">
                    Automate Gym
                  </p>
                </div>
              </div>
            </div> */}

            {/* Enhanced User Profile */}
            <div className="flex items-center space-x-4">
              {/* Quick Action Buttons - Desktop */}
              <div className="flex items-center space-x-2">
                {quickActions.slice(0, 2).map((action, index) => (
                  <button
                    key={index}
                    onClick={() => router.push(action.link)}
                    className="relative p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/20 transition-all duration-200 group"
                    title={action.label}
                  >
                    {action.icon}
                    {action.count ? (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {action.count}
                      </span>
                    ) : null}
                  </button>
                ))}
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
                              className={`inline-flex items-center space-x-1 text-xs font-medium px-2 py-0.5 rounded-md text-white`}
                            >
                              {/* {subscriptionStyle.icon} */}
                              <span>
                                {loggedInTenant?.subscriptionStatus}
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
                            className={`inline-flex items-center space-x-1 text-xs font-medium px-2 py-0.5 rounded-md text-white mr-2`}
                          >
                            {/* {subscriptionStyle.icon} */}
                            <span>
                              {loggedInTenant?.subscriptionStatus}
                            </span>
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            {loggedInTenant?.subscriptionStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <div
                    className="py-2"
                    onClick={() => router.push("/clientarea/accountsetting")}
                  >
                    <DropdownMenuItem className="cursor-pointer px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <User className="mr-3" size={16} />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          Account Details
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          View and manage account details
                        </div>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="cursor-pointer px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800">
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

                    <DropdownMenuItem className="cursor-pointer px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <Package className="mr-3" size={16} />
                      <div
                        onClick={() => router.push("/clientarea/myorders")}
                        className="cursor-pointer"
                      >
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          My Orders
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          View my orders
                        </div>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="cursor-pointer px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <Settings className="mr-3" size={16} />
                      <div
                        onClick={() => router.push("/clientarea/settings")}
                        className="cursor-pointer"
                      >
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          Settings
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Configure and preferences
                        </div>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="cursor-pointer px-4 py-3 bg-gradient-to-r from-indigo-50 dark:from-indigo-900/20 to-purple-50 dark:to-purple-900/20 hover:from-indigo-100 dark:hover:from-indigo-800/30 hover:to-purple-100 dark:hover:to-purple-800/30">
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

                    <DropdownMenuItem className="cursor-pointer px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800">
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
