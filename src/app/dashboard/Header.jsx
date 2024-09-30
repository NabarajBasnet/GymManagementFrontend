import React from 'react'
import { IoMenuSharp } from "react-icons/io5";
import { ToggleAdminSidebar } from '@/state/slicer';
import { useDispatch, useSelector } from 'react-redux';

const Header = () => {

    const adminSidebar = useSelector(state => state.rtkreducer.adminSidebar);
    console.log('Admin Sidebar: ', adminSidebar);

    const dispatch = useDispatch();

    const handleDispatchSidebar = () => {
        dispatch(ToggleAdminSidebar());
    };

    return (
        <div className='flex justify-between py-8 items-center bg-green-400'>
            <IoMenuSharp
                className='text-2xl cursor-pointer'
                onClick={handleDispatchSidebar}
            />
            <h1 className='text-3xl font-bold'>Toggle</h1>
            <h1 className='text-3xl font-bold'>Header</h1>
        </div>
    )
}

export default Header;
