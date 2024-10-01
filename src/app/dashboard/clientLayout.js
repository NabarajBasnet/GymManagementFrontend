'use client'

import Header from "./Header";
import Sidebar from "./Sidebar";
import RTKProvider from "@/state/ReduxProvider";
import { useSelector } from "react-redux";

export default function ClientLayout({ children }) {
    

    const adminSidebar = useSelector(state => state.rtkreducer.adminSidebar);
    console.log('Admin Sidebar In Layout: ',adminSidebar);

    return (
        <RTKProvider>
            <div>
                <div>
                    <div>
                        <Sidebar />
                    </div>
                    <div>
                        <Header />
                        {children}
                    </div>
                </div>
            </div>
        </RTKProvider>
    );
}
