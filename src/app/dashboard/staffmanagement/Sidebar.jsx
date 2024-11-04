import Link from "next/link";

const StaffsSidebar = () => {
    return (
        <div className="w-full min-h-screen sticky top-0 bg-blue-800">
            <h1 className="text-white font-bold py-4 px-2">Staff Management</h1>
            <div className="w-full">
                <ul>
                    <li className="text-white font-bold py-4 hover:bg-blue-600 p-1"><Link href={'/'}>Staff Profiles and Roles</Link></li>
                    <li className="text-white font-bold py-4 hover:bg-blue-600 p-1"><Link href={'/'}>Scheduling and Availability</Link></li>
                    <li className="text-white font-bold py-4 hover:bg-blue-600 p-1"><Link href={'/'}>Payroll and Compensation</Link></li>
                    <li className="text-white font-bold py-4 hover:bg-blue-600 p-1"><Link href={'/'}>Access Control and Permissions</Link></li>
                    <li className="text-white font-bold py-4 hover:bg-blue-600 p-1"><Link href={'/'}>Task and Communication Management</Link></li>
                </ul>
            </div>
        </div>
    )
}

export default StaffsSidebar;
