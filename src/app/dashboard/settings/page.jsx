import { FaUserCog, FaBell, FaDollarSign, FaTools, FaUsers, FaDatabase } from "react-icons/fa";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";


const Settings = () => {
    const settingsOptions = [
        {
            title: "Profile Settings",
            description: "Manage your personal information, password, and profile picture.",
            icon: <FaUserCog size={28} className="text-blue-500" />,
        },
        {
            title: "System Settings",
            description: "Configure system preferences like timezones and formats.",
            icon: <FaTools size={28} className="text-purple-500" />,
        },
        {
            title: "Membership Settings",
            description: "Define membership plans, hold rules, and expiration policies.",
            icon: <FaUsers size={28} className="text-green-500" />,
        },
        {
            title: "Notifications",
            description: "Manage notification settings for members and staff.",
            icon: <FaBell size={28} className="text-yellow-500" />,
        },
        {
            title: "Billing & Payments",
            description: "Set up payment gateways, currencies, and tax configurations.",
            icon: <FaDollarSign size={28} className="text-red-500" />,
        },
        {
            title: "Data & Backup",
            description: "Backup and restore system data or reset settings.",
            icon: <FaDatabase size={28} className="text-indigo-500" />,
        },
    ];

    return (
        <div className="w-full">
            <div className='w-full p-6'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-1">
                                    <BreadcrumbEllipsis className="h-4 w-4" />
                                </DropdownMenuTrigger>
                            </DropdownMenu>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Settings</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-xl font-bold mt-3">Settings</h1>
            </div>

            <div className="w-full p-6">
                <p className="text-gray-800 text-center mb-8">
                    Configure your system preferences.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {settingsOptions.map((option, index) => (
                        <div
                            key={index}
                            className="flex items-center cursor-pointer border border-gray-300 p-4  rounded-lg shadow-md hover:bg-gray-100 hover:shadow-md hover:scale-105 transition-all  duration-300"
                        >
                            <div className="mr-4">{option.icon}</div>
                            <div>
                                <h2 className="text-lg font-semibold">{option.title}</h2>
                                <p className="text-sm">{option.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Settings;
