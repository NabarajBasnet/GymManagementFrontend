"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Package } from "lucide-react";
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
import { RiCustomerServiceFill } from "react-icons/ri";
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
    { id: "qrcode", icon: <QrCode size={20} />, label: "QR Code" },
    { id: "chat", icon: <MessageSquare size={20} />, label: "Chat" },
    {
      id: "membershipdetails",
      icon: <MdCardMembership size={20} />,
      label: "Membership Details",
    },
    {
      id: "measurements",
      icon: <LineChart size={20} />,
      label: "Measurements",
    },
    {
      id: "payments",
      icon: <FaMoneyBillWaveAlt size={20} />,
      label: "Payments",
    },
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
    { id: "settings", icon: <Settings size={20} />, label: "Settings" },
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

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10 py-1 dark:bg-gray-900">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button */}
          <div className="flex items-center">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <button
                  className="inline-flex items-center justify-center p-2 rounded-md dark:hover:bg-none text-gray-500 hover:text-gray-700 hover:bg-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  aria-label="Open menu"
                >
                  <IoMenu className="block h-6 w-6 dark:text-gray-200" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[300px] p-0">
                <div className="h-full flex flex-col">
                  <SheetHeader className="px-4 pt-4 pb-2 border-b border-gray-200">
                    <SheetTitle className="text-xl font-bold text-indigo-600">
                      {gymName}
                    </SheetTitle>
                  </SheetHeader>

                  {/* User profile */}
                  {member && member.member && member.member.loggedInMember && (
                    <div className="px-4 py-6 border-b border-gray-200">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="relative w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold text-white">
                            {memberName
                              ?.split(" ")
                              .map((word) => word[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                            <span className="absolute bottom-0 right-0 block w-2 h-2 rounded-full bg-green-500 border-2 border-white"></span>
                          </div>
                          <span className="absolute bottom-0 right-0 block w-3 h-3 rounded-full bg-green-500 border-2 border-white"></span>
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">
                            {memberName}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full mr-1">
                              {memberStatus}
                            </span>
                            {/* {memberId} */}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`flex items-center w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                          activeTab === item.id
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <span className="mr-3 opacity-80">{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                  </nav>

                  {/* Footer with logout */}
                  <div className="px-4 py-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        logOutMember();
                        setIsSheetOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2.5 rounded-md text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <LogOut size={18} className="mr-3" />
                      Sign out
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo - hidden on mobile */}
          <div className="hidden md:flex ml-32 items-center">
            <h1 className="text-xl font-bold text-indigo-600">{gymName}</h1>
          </div>

          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-300 group"
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

            {/* User profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div>
                  {member?.member?.loggedInMember && (
                    <div className="flex cursor-pointer items-center">
                      <div className="relative w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold text-white">
                        {memberName
                          ?.split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                        <span className="absolute bottom-0 right-0 block w-2 h-2 rounded-full bg-green-500 border-2 border-white"></span>
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200 hidden lg:inline">
                        {memberName}
                      </span>
                    </div>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel className="cursor-pointer">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600"
                  onClick={logOutMember}
                >
                  <LogOut />
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
