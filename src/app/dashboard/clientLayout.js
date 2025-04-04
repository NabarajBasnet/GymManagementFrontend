'use client'

import Header from "./Header";
import Sidebar from "./Sidebar";
import RTKProvider from "@/state/ReduxProvider";
import { useSelector } from "react-redux";
import DashboardFooter from "@/components/DashboardFooter/Footer";
import ReactQueryClientProvider from "@/components/Providers/ReactQueryProvider";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({ children }) {
    const adminSidebar = useSelector(state => state.rtkreducer.adminSidebar);
    const sidebarMinimized = useSelector(state => state.rtkreducer.sidebarMinimized);

    return (
        <RTKProvider>
            <ReactQueryClientProvider>
                <div className="w-full flex">
                    {adminSidebar && (
                        <div className="hidden md:flex">
                            <Sidebar />
                        </div>
                    )}

                    {/* Right-side container with constrained height */}
                    <div className={`w-full transition-all duration-500 ${sidebarMinimized ? 'md:ml-12' : 'md:ml-60'} flex flex-col min-h-screen`}>
                        {/* Header with fixed height */}
                        <div className="mt-14">
                            <Header />
                        </div>

                        {/* Scrollable content area */}
                        <main className="flex-1 overflow-auto bg-white">
                            <div className="w-full mb-1"> {/* Added padding for spacing */}
                                {children}
                            </div>
                        </main>

                        {/* Fixed footer at the bottom */}
                        <div className="mt-3">
                            <DashboardFooter />
                        </div>
                    </div>
                </div>
            </ReactQueryClientProvider>
        </RTKProvider>
    );
}