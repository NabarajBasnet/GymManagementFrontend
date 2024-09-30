'use client'

import Header from "./Header";
import Sidebar from "./Sidebar";
import MainStateProvider from "@/state/ReduxProvider";

export default function ClientLayout({ children }) {
    return (
        <MainStateProvider>
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
        </MainStateProvider>
    );
}
