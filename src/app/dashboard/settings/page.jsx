'use client';

import React from 'react';
import SettingSidebar from './SettingSidebar';

const Settings = ({ children }) => {
    return (
        <div className='w-full block md:flex'>
            <div className='w-full md:w-2/12'>
                <SettingSidebar />
            </div>
            <div className='w-full md:w-10/12 min-h-screen'>
                {children}
            </div>
        </div >
    )
}

export default Settings;
