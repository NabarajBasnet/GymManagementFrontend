"use client";

import { FiSearch } from "react-icons/fi";
import {
  BiHomeAlt,
  BiSolidUserDetail,
  BiSolidUserCircle,
} from "react-icons/bi";

// Import UI components
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/components/Providers/LoggedInUserProvider";

const MemberTransfer = () => {
  const { user, loading } = useUser();

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-900 px-4 pt-10 md:py-8">
      <div className="flex items-center gap-2 mb-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/"
                className="font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1"
              >
                <BiHomeAlt size={18} /> Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="h-4 w-4" />
                </DropdownMenuTrigger>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="font-medium text-gray-600 dark:text-gray-300">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-gray-600 dark:text-gray-300">
                Member Transfer
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="w-full">
        <h1 className="text-xl font-bold text-gray-600 dark:text-gray-100 my-3">
          Member Transfer
        </h1>
      </div>

      <div>
        
      </div>
    </div>
  );
};

export default MemberTransfer;
