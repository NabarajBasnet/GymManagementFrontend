import { FaUserCog, FaBell, FaDollarSign, FaTools, FaUsers, FaDatabase } from "react-icons/fa";

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
        <div className="min-h-screen p-6">
            <h1 className="text-4xl font-bold mb-6 text-center">⚙️ Settings</h1>
            <p className="text-gray-800 text-center mb-8">
                Configure your system preferences.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {settingsOptions.map((option, index) => (
                    <div
                        key={index}
                        className="flex items-center border border-gray-300 p-4  rounded-lg shadow-md hover:bg-gray-100 hover:shadow-md hover:scale-105 transition-all  duration-300"
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
    );
};

export default Settings;
