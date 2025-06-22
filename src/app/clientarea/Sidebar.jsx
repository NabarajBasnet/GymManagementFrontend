"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
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

const ClientAreaSidebar = ({ activeTab }) => {
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
      id: "/clientarea/mysubscriptions",
      icon: <MdOutlineShoppingCart size={20} />,
      label: "My Subscriptions",
      description: "My Subscriptions",
    },
    {
      id: "/clientarea/pricing",
      icon: <CreditCard size={20} />,
      label: "Pricing",
      description: "Purchase Subscriptions",
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
    }
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

  return (
    <div className="bg-white/95 dark:bg-gray-900/95 w-[240px] min-h-screen py-2 shadow-md border-b border-gray-100/50 dark:border-gray-800/50 fixed left-0 top-0 z-50 flex flex-col">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0">
        {/* Tenant Profile Section */}
        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {loggedInTenant?.fullName.split(" ").map((name) => name.charAt(0)).join("")}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {loggedInTenant?.fullName || "Tenant"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center space-x-1">
                <span className={`font-medium text-xs ${loggedInTenant?.freeTrailStatus === 'Active' ? 'text-yellow-500' : 'text-green-500'}`}>
                  {loggedInTenant?.freeTrailStatus === 'Active' ? 'Free Trail' : loggedInTenant?.subscription?.subscriptionName}
                </span>

                <span className={`text-xs font-medium ${loggedInTenant?.freeTrailStatus === 'Active' ? 'text-yellow-500' : 'text-green-500'}`}>
                  ( {loggedInTenant?.freeTrailStatus === 'Active' ? loggedInTenant?.freeTrailRemainingDays : loggedInTenant?.subscriptionRemainingDays} Days left )
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Navigation Section */}
      <div className="flex-grow overflow-y-auto">
        <ScrollArea className="h-[80vh] w-full">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium ${activeTab === item.id
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                >
                  <span className="text-white dark:text-gray-200 bg-blue-700/70 dark:bg-blue-700/50 p-2 rounded-md">
                    {item.icon}
                  </span>
                  <div className="flex flex-col items-start">
                    <span className="text-md font-medium text-sky-400">{item.label}</span>
                    <span className="text-[11px] text-start text-gray-500 dark:text-gray-300 font-medium">{item.description}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>

      {/* Fixed Footer Section */}
      <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200 dark:border-gray-700">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-sm font-medium dark:text-white text-gray-700">{loggedInTenant?.fullName}</h1>
                <p className='text-xs font-medium dark:text-white text-gray-700'>{loggedInTenant?.email}</p>
              </div>
              <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <Settings size={20} />
              </button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNavClick("/clientarea/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavClick("/clientarea/help")}>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logOutTenant}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ClientAreaSidebar;
