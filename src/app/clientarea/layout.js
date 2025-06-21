"use client";

import ClientAreaHeader from "./Header";
import ReactQueryClientProvider from "@/components/Providers/ReactQueryProvider";
import LoggedInTenantProvider from "@/components/Providers/LoggedInTenantProvider";
import { usePathname } from "next/navigation";
import ClientAreaSidebar from "./Sidebar";
import { useSelector } from "react-redux";

const ClientAreaLayout = ({ children }) => {
  const pathname = usePathname();
  const clientSidebar = useSelector((state) => state.rtkreducer.clientSidebar);
  const hideHeader = pathname === "/clientarea/setupwizard";
  const hideSidebar = pathname === "/clientarea/setupwizard";
  return (
    <div className="w-full">
      <LoggedInTenantProvider>
        <ReactQueryClientProvider>
          <div>
            <div className="w-full md:flex hidden">
              {clientSidebar && <ClientAreaSidebar />}
            </div>
            <div
              className={`w-full ${
                clientSidebar ? "pl-0 md:pl-[240px]" : "pl-0"
              }`}
            >
              <ClientAreaHeader />
              {children}
            </div>
          </div>
        </ReactQueryClientProvider>
      </LoggedInTenantProvider>
    </div>
  );
};

export default ClientAreaLayout;
