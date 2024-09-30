'use client'

import Header from "./Header";
import Sidebar from "./Sidebar";
import { useState } from 'react';

export default function ClientLayout({ children }) {
    return (
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
    );
}
