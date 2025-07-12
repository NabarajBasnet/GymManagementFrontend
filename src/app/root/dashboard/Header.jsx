"use client";

// Icons
import { MdOutlineShoppingCart } from "react-icons/md";
import { Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import {
  LogOut,
  User,
  Shield,
  Crown,
  HelpCircle,
  Database,
  Activity,
  BarChart3,
  ShieldCheck,
  AlertTriangle,
  Globe,
  UserCheck,
} from "lucide-react";
import { IoMenu } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useRootUser } from "@/components/Providers/LoggedInRootUserProvider";

const RootUserHeader = () => {
  const router = useRouter();
  const { rootUser, loading } = useRootUser();

  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  return (
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg py-3 shadow-lg border-b border-red-100/50 dark:border-gray-800/50 sticky top-0 z-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Mobile menu button */}
          <button
            className="inline-flex items-center justify-center p-0 rounded-xl text-gray-600 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50/80 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:bg-red-50/80 dark:focus:bg-gray-800 transition-all duration-200 group"
          >
            <IoMenu className="block h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
          </button>

          {/* Enhanced Logo */}
          <div className="hidden md:flex items-center ml-56 space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-700 bg-clip-text text-transparent">
                  Fit Loft Admin
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  System Administration
                </p>
              </div>
            </div>
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
