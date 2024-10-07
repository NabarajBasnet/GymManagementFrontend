"use client"

import { RiAccountCircleFill } from "react-icons/ri";
import React from 'react'
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
        <div className='flex justify-between py-6 items-center bg-green-500'>
            <div className='mx-4'>
                <IoMenuSharp
                    className='text-3xl text-white cursor-pointer'
                    onClick={handleDispatchSidebar}
                />
            </div>

            <div className='mx-4'>
                <RiAccountCircleFill
                    className='text-3xl text-white cursor-pointer'
                    onClick={handleDispatchSidebar}
                />
            </div>
        </div>
    )
}

export default Header;
