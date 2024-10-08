'use client'

import Head from "next/head";
import Header from "./Header";
import Sidebar from "./Sidebar";
import RTKProvider from "@/state/ReduxProvider";
import { useSelector } from "react-redux";

export default function ClientLayout({ children }) {

    const adminSidebar = useSelector(state => state.rtkreducer.adminSidebar);

    return (
        <RTKProvider>
            <div className='w-full flex'>
                {adminSidebar && (
                    <div className={`hidden md:flex transition-all duration-500`}>
                        <div className={`transition-all duration-500${adminSidebar ? 'opacity-100 -translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                            <Sidebar />
                        </div>
                    </div>
                )}
                <div className={`w-full ${adminSidebar ? 'md:ml-60' : ''}`}>
                    <div className="w-full mt-16">
                        <Header />
                    </div>
                    <main className="w-full bg-gray-100 dark:bg-neutral-900">
                        {children}
                    </main>
                </div>
            </div>
        </RTKProvider>
    );
}
