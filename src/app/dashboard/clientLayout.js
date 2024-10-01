'use client'

import Header from "./Header";
import Sidebar from "./Sidebar";
import RTKProvider from "@/state/ReduxProvider";
import { useSelector } from "react-redux";

export default function ClientLayout({ children }) {

    const adminSidebar = useSelector(state => state.rtkreducer.adminSidebar);
    
    return (
        <RTKProvider>
            <div className="w-full">
                <div className="w-full">
                    <div className="w-full flex">
                        {adminSidebar&&(
                            <div className={`hidden md:flex`}>
                        <Sidebar />
                        </div>
                        )}
                    </div>

                    <div className={`w-full ${adminSidebar?'md:ml-64':''}`}>                    
                            <Header />
                            <div className="w-full">
                                {children}
                            </div>
                        </div>
                </div>
            </div>
        </RTKProvider>
    );
}
