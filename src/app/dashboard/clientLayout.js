'use client'

import Header from "./Header";
import Sidebar from "./Sidebar";
import RTKProvider from "@/state/ReduxProvider";
import { useSelector } from "react-redux";
import DashboardFooter from "@/components/DashboardFooter/Footer";
import ReactQueryClientProvider from "@/components/Providers/ReactQueryProvider";

export default function ClientLayout({ children }) {

    const adminSidebar = useSelector(state => state.rtkreducer.adminSidebar);
    const sidebarMinimized = useSelector(state => state.rtkreducer.sidebarMinimized);

    return (
        <RTKProvider>
            <ReactQueryClientProvider>
                <div className={`w-full flex`}>
                    {adminSidebar && (
                        <div className={`hidden md:flex`}>
                            <Sidebar />
                        </div>
                    )}

                    <div className={`w-full transition-all duration-500 ${sidebarMinimized ? 'md:ml-12' : 'md:ml-60'}`}>
                        <div className="w-full mt-14">
                            <Header />
                        </div>
                        <main className="w-full bg-white transition-all duration-500">
                            <div className="w-full mb-1 transition-transform duration-500 ease-in-out">
                                {children}
                            </div>
                            <div className="w-full mt-3">
                                <DashboardFooter />
                            </div>
                        </main>
                    </div>
                </div>
            </ReactQueryClientProvider>
        </RTKProvider>
    );
}
