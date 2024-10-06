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
                            <div className={`hidden md:flex`}>
                                <Sidebar />
                            </div>
                        )}
                        <div className={`w-full ${adminSidebar ? 'md:ml-60' : ''}`}>
                            <div>
                                <Header />
                            </div>
                            <main className="w-full">
                                {children}
                            </main>
                        </div>
                    </div>
        </RTKProvider>
    );
}
