"use client";

import { FaUserCheck } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { Moon, Sun, Bell, MessageCircle, ShoppingCart } from "lucide-react";
import { useTheme } from "next-themes";
import { AiOutlineSchedule } from "react-icons/ai";
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
import { MdCardMembership } from "react-icons/md";
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
} from "lucide-react";
import { FaTag } from "react-icons/fa";
import { FaMoneyBillWaveAlt } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useMember } from "@/components/Providers/LoggedInMemberProvider";

const MemberHeader = ({ activeTab }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { setTheme } = useTheme();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const router = useRouter();
  const member = useMember();

  const loggedInMember = member?.member?.loggedInMember;

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

  const navItems = [
    { id: "smartcheckin", icon: <FaUserCheck size={20} />, label: "Smart Check-In" },
    { id: "qrcode", icon: <QrCode size={20} />, label: "QR Code" },
    // { id: "chat", icon: <MessageSquare size={20} />, label: "Chat" },
    // {
    //   id: "store",
    //   icon: <ShoppingCart size={20} />,
    //   label: "Store",
    // },
    {
      id: "membershipdetails",
      icon: <MdCardMembership size={20} />,
      label: "Membership Details",
    },
    // {
    //   id: "measurements",
    //   icon: <LineChart size={20} />,
    //   label: "Measurements",
    // },
    // {
    //   id: "payments",
    //   icon: <FaMoneyBillWaveAlt size={20} />,
    //   label: "Payments",
    // },
    { id: "feedback", icon: <Star size={20} />, label: "Feedback" },
    {
      id: "promotions&offers",
      icon: <FaTag size={20} />,
      label: "Promotions & Offers",
    },
    {
      id: "classbooking",
      icon: <AiOutlineSchedule size={20} />,
      label: "Class Booking",
    },
    // { id: "settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  const handleNavClick = (id, tab) => {
    router.push(id);
    setIsSheetOpen(false);
  };

  const logOutMember = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/member/auth/member-logout`,
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
        router.push(responseBody.redirect);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  // Safe access to member data
  const memberName = member?.member?.loggedInMember?.fullName || "";
  const memberStatus = member?.member?.loggedInMember?.status || "";
  const memberId = member?.member?.loggedInMember?._id || "";
  const gymName = member?.member?.loggedInMember?.gymName || "";

  // New handlers for added icons
  const handleNotificationClick = () => {
    // Add your notification logic here
    toast.success("Notifications clicked!");
  };

  const handleChatClick = () => {
    // Add your chat logic here
    router.push("/chat");
  };

  const handleCartClick = () => {
    // Add your cart logic here
    router.push("/cart");
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg sticky top-0 z-50 py-1 dark:bg-gray-900/80 transition-all duration-300">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button */}
          <div className="flex items-center">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <button
                  className="group inline-flex items-center justify-center p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                  aria-label="Open menu"
                >
                  <IoMenu className="block h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[300px] p-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
                <div className="h-full flex flex-col">
                  <SheetHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
                    <SheetTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {loggedInMember?.organization?.name}
                    </SheetTitle>
                  </SheetHeader>

                  {/* User profile */}
                  {member && member.member && member.member.loggedInMember && (
                    <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-base font-bold text-white shadow-lg">
                            {memberName
                              ?.split(" ")
                              .map((word) => word[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <span className="absolute -bottom-1 -right-1 block w-4 h-4 rounded-full bg-green-500 border-3 border-white dark:border-gray-900 shadow-md animate-pulse"></span>
                        </div>
                        <div className="ml-4">
                          <p className="font-semibold text-gray-900 dark:text-white text-base">
                            {memberName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                            <span className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-700 dark:text-indigo-300 text-xs px-3 py-1 rounded-full font-medium">
                              {memberStatus}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`group flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === item.id
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-[1.02]"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white hover:translate-x-1"
                          }`}
                      >
                        <span className={`mr-4 ${activeTab === item.id ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-indigo-500'} transition-colors duration-200`}>
                          {item.icon}
                        </span>
                        {item.label}
                      </button>
                    ))}
                  </nav>

                  {/* Footer with logout */}
                  <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <button
                      onClick={() => {
                        logOutMember();
                        setIsSheetOpen(false);
                      }}
                      className="group flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                    >
                      <LogOut size={18} className="mr-4 group-hover:scale-110 transition-transform duration-200" />
                      Sign out
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-2">
            {/* Notification Icon */}
            <button
              onClick={handleNotificationClick}
              className="relative p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-200 group"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-200" />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                3
              </span>
            </button>

            {/* Chat Icon */}
            <button
              onClick={handleChatClick}
              className="relative p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-200 group"
              aria-label="Chat"
            >
              <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-200" />
              {/* Online indicator */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></span>
            </button>

            {/* Cart Icon */}
            <button
              onClick={handleCartClick}
              className="relative p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-200 group"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-200" />
              {/* Cart item count */}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                2
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-300 group overflow-hidden"
              aria-label="Toggle theme"
            >
              <div className="relative w-5 h-5">
                <Sun
                  className={`absolute inset-0 w-5 h-5 text-amber-500 transition-all duration-500 ${darkMode
                    ? "opacity-0 rotate-180 scale-0"
                    : "opacity-100 rotate-0 scale-100"
                    }`}
                />
                <Moon
                  className={`absolute inset-0 w-5 h-5 text-indigo-500 transition-all duration-500 ${darkMode
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 -rotate-180 scale-0"
                    }`}
                />
              </div>
            </button>

            {/* User profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer">
                  {member?.member?.loggedInMember && (
                    <div className="flex items-center group">
                      <div className="relative">
                        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                          {memberName
                            ?.split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <span className="absolute -bottom-1 -right-1 block w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900 shadow-md"></span>
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-200 hidden lg:inline group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                        {memberName}
                      </span>
                    </div>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl">
                <DropdownMenuLabel className="cursor-pointer font-semibold text-gray-900 dark:text-white px-3 py-2">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg mx-1 transition-all duration-200"
                  onClick={logOutMember}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MemberHeader;