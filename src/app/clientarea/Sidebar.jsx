"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { FaLockOpen, FaMoneyBill } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
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
  Home,
  Settings,
  LogOut,
  User,
  QrCode,
  HelpCircle,
  CreditCard,
  Building2,
  Package
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTenant } from "@/components/Providers/LoggedInTenantProvider";
import { useSelector } from "react-redux";

const ClientAreaSidebar = ({ activeTab }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const clientSidebar = useSelector((state) => state.rtkreducer.clientSidebar);
  const router = useRouter();
  const { tenant, loading } = useTenant();
  const loggedInTenant = tenant?.tenant;
  const tenantSubscriptionFeatures = loggedInTenant?.subscription?.subscriptionFeatures;
  const multiBranchSupport = tenantSubscriptionFeatures?.find((feature) => {
    return feature.toString() === 'Multi Branch Support'
  });

  // Categorized nav items
  const navCategories = [
    {
      title: "General",
      items: [
        {
          id: "/clientarea/dashboard",
          icon: <Home size={18} />,
          label: "Dashboard",
          description: "Overview & Analytics",
        },
        {
          id: "/userlogin",
          icon: <QrCode size={18} />,
          label: "Gym Dashboard",
          description: "Access Control",
        },
      ]
    },
    {
      title: "Management",
      items: [
        ...(multiBranchSupport || loggedInTenant?.freeTrailStatus === 'Active' ? [
          {
            id: "/clientarea/branchmanagement",
            icon: <Building2 size={18} />,
            label: "Branches",
            description: "Manage Locations",
          },
        ] : []),
        {
          id: "/clientarea/systemusers",
          icon: <User size={18} />,
          label: "Users",
          description: "Manage Team",
        },
        {
          id: "/clientarea/lockermanagement",
          icon: <FaLockOpen size={18} />,
          label: "Lockers",
          description: "Manage Storage",
        },
        {
          id: "/clientarea/membershipplans",
          icon: <Package size={18} />,
          label: "Plans",
          description: "Membership Plans",
        },
      ]
    },
    {
      title: "Billing",
      items: [
        {
          id: "/clientarea/mysubscriptions",
          icon: <MdOutlineShoppingCart size={18} />,
          label: "Subscriptions",
          description: "My Plans",
        },
        {
          id: "/clientarea/pricing",
          icon: <CreditCard size={18} />,
          label: "Pricing",
          description: "Upgrade Plan",
        },
        {
          id: "/clientarea/myorders",
          icon: <Package size={18} />,
          label: "Orders",
          description: "Purchase History",
        },
        {
          id: "/clientarea/billingprofile",
          icon: <FaMoneyBill size={18} />,
          label: "Billing Profile",
          description: "Billing Details",
        },
      ]
    },
    {
      title: "Settings",
      items: [
        {
          id: "/clientarea/settings",
          icon: <Settings size={18} />,
          label: "Settings",
          description: "Configuration",
        }
      ]
    }
  ];

  const handleNavClick = (id) => {
    router.push(id);
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
    <div className={`
      bg-white/95 dark:bg-gray-900/95 
      ${clientSidebar ? 'w-[235px]' : 'w-[75px]'} 
      min-h-screen py-2 shadow-lg border-r border-gray-200/50 dark:border-gray-800/50 
      fixed left-0 top-0 z-50 flex flex-col transition-all duration-300 ease-in-out
      backdrop-blur-sm
    `}>
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shrink-0">
            {loggedInTenant?.fullName.split(" ").map((name) => name.charAt(0)).join("")}
          </div>

          {clientSidebar && (
            <div className="overflow-hidden transition-all duration-300 ease-in-out">
              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                {loggedInTenant?.fullName || "Tenant"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1 truncate">
                <span className={`font-medium ${loggedInTenant?.freeTrailStatus === 'Active' ? 'text-yellow-500' : 'text-green-500'}`}>
                  {loggedInTenant?.freeTrailStatus === 'Active' ? 'Free Trial' : loggedInTenant?.subscription?.subscriptionName}
                </span>
                <span>•</span>
                <span className={`font-medium ${loggedInTenant?.freeTrailStatus === 'Active' ? 'text-yellow-500' : 'text-green-500'}`}>
                  {loggedInTenant?.freeTrailStatus === 'Active' ? loggedInTenant?.freeTrailRemainingDays : loggedInTenant?.subscriptionRemainingDays}d left
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Navigation Section */}
      <div className="flex-grow overflow-y-auto">
        <ScrollArea className="h-[calc(100vh-180px)] w-full">
          <div className="px-3 py-4 space-y-6">
            {navCategories.map((category) => (
              <div key={category.title}>
                {clientSidebar && (
                  <h4 className="px-2 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-opacity duration-300 ease-in-out">
                    {category.title}
                  </h4>
                )}
                <ul className="space-y-1">
                  {category.items.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => handleNavClick(item.id)}
                        className={`
                          w-full flex items-center 
                          ${clientSidebar ? 'px-3' : 'px-0 justify-center'}
                          py-2.5 rounded-lg text-sm font-medium 
                          ${activeTab === item.id
                            ? "bg-blue-50/80 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                            : "text-gray-600 hover:bg-gray-100/50 dark:text-gray-300 dark:hover:bg-gray-800/50"
                          }
                          transition-all duration-200
                        `}
                      >
                        <span className={`
                          ${clientSidebar ? 'mr-3' : 'mx-auto'}
                          p-4 rounded-md
                          ${activeTab === item.id
                            ? 'bg-blue-500 text-blue-600 dark:bg-blue-800/50 dark:text-blue-300'
                            : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                          }
                        `}>
                          {item.icon}
                        </span>
                        {clientSidebar && (
                          <div className="text-left overflow-hidden transition-all duration-300 ease-in-out">
                            <span className="block text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                              {item.label}
                            </span>
                            <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">
                              {item.description}
                            </span>
                          </div>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Fixed Footer Section */}
      <div className="flex-shrink-0 px-3 py-4 border-t border-gray-200 dark:border-gray-700">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={`
              w-full flex items-center 
              ${clientSidebar ? 'px-3' : 'px-0 justify-center'}
              py-2 rounded-lg text-sm
              hover:bg-gray-100/50 dark:hover:bg-gray-800/50
              transition-all duration-200
            `}>
              <div className={`
                ${clientSidebar ? 'mr-3' : 'mx-auto'}
                p-1.5 rounded-md bg-gray-100/50 dark:bg-gray-800/50
                text-gray-600 dark:text-gray-300
              `}>
                <Settings size={18} />
              </div>

              {clientSidebar && (
                <div className="text-left overflow-hidden transition-all duration-300 ease-in-out">
                  <span className="block text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                    {loggedInTenant?.fullName?.split(" ")[0] || "Account"}
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">
                    {loggedInTenant?.email}
                  </span>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-56"
            align={clientSidebar ? "end" : "start"}
            side={clientSidebar ? "right" : "bottom"}
          >
            <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNavClick("/clientarea/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavClick("/clientarea/help")}>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help Center</span>
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