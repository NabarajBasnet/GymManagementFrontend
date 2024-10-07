"use client";

import { RiAccountCircleFill } from "react-icons/ri";
import React from 'react';
import { IoMenuSharp } from "react-icons/io5";
import { ToggleAdminSidebar } from '@/state/slicer';
import { useDispatch, useSelector } from 'react-redux';

const Header = () => {
    const adminSidebar = useSelector(state => state.rtkreducer.adminSidebar);
    const dispatch = useDispatch();

    const handleDispatchSidebar = () => {
        dispatch(ToggleAdminSidebar());
    };

    return (
        <div className={`fixed top-0 right-0 transition-all duration-300 ${adminSidebar ? 'md:w-[calc(100%-240px)] w-full' : 'w-full'} flex justify-between py-4 items-center backdrop-blur-sm bg-white bg-opacity-70 z-50`}>
            <div className='mx-4'>
                <IoMenuSharp
                    className='text-3xl text-gray-800 cursor-pointer'
                    onClick={handleDispatchSidebar}
                />
            </div>

            <div className='mx-4'>
                <RiAccountCircleFill
                    className='text-3xl text-gray-800 cursor-pointer'
                    onClick={handleDispatchSidebar}
                />
            </div>
        </div>
    );
}

export default Header;
