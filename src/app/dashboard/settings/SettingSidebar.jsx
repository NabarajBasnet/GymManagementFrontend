import React from 'react';
import Link from 'next/link';
import { IoIosSettings } from "react-icons/io";
import { BsPersonFillGear } from "react-icons/bs";
import { MdManageAccounts } from "react-icons/md";
import { BsDatabaseFillGear } from "react-icons/bs";
import { MdOutlineSecurity } from "react-icons/md";


const SettingSidebar = () => {
    return (
        <div>
            <div><BsPersonFillGear className='text-xl' /> <Link href={'/settings/general'}>General</Link> </div>
            <div><MdManageAccounts /> <Link href={'/settings/account'}>Account</Link> </div>
            <div><BsDatabaseFillGear /> <Link href={'/settings/datacontrols'}>General</Link> </div>
            <div><MdOutlineSecurity /> <Link href={'/settings/security'}>Security</Link> </div>
        </div>
    )
}

export default SettingSidebar;
