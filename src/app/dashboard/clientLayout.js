"use client";

import ClientAreaHeader from "./Header";
import ReactQueryClientProvider from "@/components/Providers/ReactQueryProvider";
import { usePathname } from "next/navigation";
import ClientAreaSidebar from "./Sidebar";
import { useSelector } from "react-redux";

const ClientAreaLayout = ({ children }) => {
  const pathname = usePathname();
  const adminSidebar = useSelector((state) => state.rtkreducer.adminSidebar);
  const sidebarMinimized = useSelector((state) => state.rtkreducer.sidebarMinimized);

  const hideHeader = pathname === "/clientarea/setupwizard";
  const hideSidebar = pathname === "/clientarea/setupwizard";

  return (
    <div className="w-full">
      <ReactQueryClientProvider>
        <div>
          {/* Sidebar */}
          {adminSidebar && !hideSidebar && (
            <div className="w-full md:flex hidden">
              <ClientAreaSidebar />
            </div>
          )}

          {/* Main Content Area */}
          <div
            className={`w-full ${
              adminSidebar && !hideSidebar
                ? sidebarMinimized
                  ? "pl-0 md:pl-[70px]"
                  : "pl-0 md:pl-[235px]"
                : "pl-0"
            } ${hideSidebar ? "!pl-0" : ""}`}
          >
            {/* Header */}
            {!hideHeader && <ClientAreaHeader />}

            {/* Children */}
            {children}
          </div>
        </div>
      </ReactQueryClientProvider>
    </div>
  );
};

export default ClientAreaLayout;