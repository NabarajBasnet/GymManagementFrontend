"use client";

import Header from "./Header";
import Sidebar from "./Sidebar";
import RTKProvider from "@/state/ReduxProvider";
import { useSelector } from "react-redux";
import DashboardFooter from "@/components/DashboardFooter/Footer";
import ReactQueryClientProvider from "@/components/Providers/ReactQueryProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function ClientLayout({ children }) {
  const adminSidebar = useSelector((state) => state.rtkreducer.adminSidebar);
  const sidebarMinimized = useSelector(
    (state) => state.rtkreducer.sidebarMinimized
  );

  return (
    <RTKProvider>
      <ReactQueryClientProvider>
        <TooltipProvider>
          <div className="w-full flex">
            {adminSidebar && (
              <aside className="hidden md:flex">
                <Sidebar />
              </aside>
            )}

            {/* Right-side container with constrained height */}
            <div
              className={`w-full transition-all dark:bg-gray-900 duration-500 ${
                sidebarMinimized ? "md:pl-20" : "md:pl-60"
              } flex flex-col min-h-screen`}
            >
              {/* Header with fixed height */}
              <header className="mt-12">
                <Header />
              </header>

              {/* Scrollable content area */}
              <main className="flex-1 overflow-x-auto bg-white dark:bg-gray-900">
                <div className="w-full mb-0">{children}</div>
              </main>

              {/* Fixed footer at the bottom */}
              <footer>
                <DashboardFooter />
              </footer>
            </div>
          </div>
        </TooltipProvider>
      </ReactQueryClientProvider>
    </RTKProvider>
  );
}
