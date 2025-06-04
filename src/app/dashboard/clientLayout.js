"use client";

import Header from "./Header";
import Sidebar from "./Sidebar";
import RTKProvider from "@/state/ReduxProvider";
import { useSelector } from "react-redux";
import DashboardFooter from "@/components/DashboardFooter/Footer";
import ReactQueryClientProvider from "@/components/Providers/ReactQueryProvider";

export default function ClientLayout({ children }) {
  const adminSidebar = useSelector((state) => state.rtkreducer.adminSidebar);
  const sidebarMinimized = useSelector(
    (state) => state.rtkreducer.sidebarMinimized
  );

  return (
    <RTKProvider>
      <ReactQueryClientProvider>
        <div className="w-full flex">
          {adminSidebar && (
            <aside className="hidden md:flex">
              <Sidebar />
            </aside>
          )}

          {/* Right-side container with constrained height */}
          <div
            className={`w-full transition-all dark:bg-gray-900 duration-500 ${
              sidebarMinimized ? "md:ml-20" : "md:ml-60"
            } flex flex-col min-h-screen`}
          >
            {/* Header with fixed height */}
            <header className="mt-14">
              <Header />
            </header>

            {/* Scrollable content area */}
            <main className="flex-1 overflow-auto bg-white dark:bg-gray-900">
              <div className="w-full mb-1">{children}</div>
            </main>

            {/* Fixed footer at the bottom */}
            <footer>
              <DashboardFooter />
            </footer>
          </div>
        </div>
      </ReactQueryClientProvider>
    </RTKProvider>
  );
}
