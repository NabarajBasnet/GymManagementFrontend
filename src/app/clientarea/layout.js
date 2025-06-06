"use client";

import ClientAreaHeader from "./Header";
import ReactQueryClientProvider from "@/components/Providers/ReactQueryProvider";
import LoggedInTenantProvider from "@/components/Providers/LoggedInTenantProvider";
import { usePathname } from "next/navigation";

const ClientAreaLayout = ({ children }) => {
  const pathname = usePathname();

  const hideHeader = pathname === "/clientarea/onboarding";

  return (
    <div className="w-full">
      <LoggedInTenantProvider>
        <ReactQueryClientProvider>
          {!hideHeader && <ClientAreaHeader />}
          <div className="w-full">{children}</div>
        </ReactQueryClientProvider>
      </LoggedInTenantProvider>
    </div>
  );
};

export default ClientAreaLayout;
