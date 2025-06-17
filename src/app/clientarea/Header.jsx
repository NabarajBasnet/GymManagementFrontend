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
import { useDispatch, useSelector } from "react-redux";
import { ToggleClientSidebar } from "@/state/slicer";

const ClientAreaHeader = ({ activeTab }) => {
  const cartLength = useSelector((state) => state.rtkreducer.cartLength);
  const dispatch = useDispatch();
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
            <button
            onClick={() => dispatch(ToggleClientSidebar())}
                    className="inline-flex items-center justify-center p-3 rounded-xl text-gray-600 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-indigo-50/80 dark:focus:bg-indigo-900/20 transition-all duration-200 group"
                    aria-label="Open menu"
                  >
                    <IoMenu className="block h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                  </button>
            <div className="flex items-center">
             
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
