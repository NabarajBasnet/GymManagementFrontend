'use client';

import { useState } from "react";
import {
    FaUserCog,
    FaBell,
    FaDollarSign,
    FaTools,
    FaUsers,
    FaDatabase,
} from "react-icons/fa";

const Settings = () => {
    const [activeSection, setActiveSection] = useState("profile");

    const sections = [
        {
            id: "profile",
            title: "Profile Settings",
            icon: <FaUserCog size={20} />,
            content: (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
                    <div className="space-y-4">
                        <label className="block">
                            <span className="text-gray-700">Full Name</span>
                            <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="Enter your full name" />
                        </label>
                        <label className="block">
                            <span className="text-gray-700">Email Address</span>
                            <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="Enter your email" />
                        </label>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Save Changes</button>
                    </div>
                </div>
            ),
        },
        {
            id: "system",
            title: "System Settings",
            icon: <FaTools size={20} />,
            content: (
                <div>
                    <h2 className="text-xl font-semibold mb-4">System Settings</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span>Dark Mode</span>
                            <input type="checkbox" className="toggle" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Enable Auto Updates</span>
                            <input type="checkbox" className="toggle" />
                        </div>
                        <button className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600">Save Preferences</button>
                    </div>
                </div>
            ),
        },
        {
            id: "membership",
            title: "Membership Settings",
            icon: <FaUsers size={20} />,
            content: (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Membership Settings</h2>
                    <p>Define membership plans, hold rules, and expiration policies.</p>
                    <div className="mt-4">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Plan</th>
                                    <th className="border border-gray-300 px-4 py-2">Price</th>
                                    <th className="border border-gray-300 px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">Basic</td>
                                    <td className="border border-gray-300 px-4 py-2">$10</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <button className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">Edit</button>
                                        <button className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Delete</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">Premium</td>
                                    <td className="border border-gray-300 px-4 py-2">$20</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <button className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">Edit</button>
                                        <button className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            ),
        },
        {
            id: "notifications",
            title: "Notifications",
            icon: <FaBell size={20} />,
            content: (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Notifications</h2>
                    <p>Manage notification settings for members and staff.</p>
                    <div className="space-y-4 mt-4">
                        <label className="flex items-center">
                            <input type="checkbox" className="toggle" />
                            <span className="ml-2">Email Notifications</span>
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" className="toggle" />
                            <span className="ml-2">SMS Notifications</span>
                        </label>
                        <button className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Save Settings</button>
                    </div>
                </div>
            ),
        },
        {
            id: "billing",
            title: "Billing & Payments",
            icon: <FaDollarSign size={20} />,
            content: (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Billing & Payments</h2>
                    <p>Set up payment gateways, currencies, and tax configurations.</p>
                    <div className="mt-4">
                        <label className="block">
                            <span className="text-gray-700">Payment Gateway</span>
                            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                <option>PayPal</option>
                                <option>Stripe</option>
                                <option>Square</option>
                            </select>
                        </label>
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Save Billing Info</button>
                    </div>
                </div>
            ),
        },
        {
            id: "data",
            title: "Data & Backup",
            icon: <FaDatabase size={20} />,
            content: (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Data & Backup</h2>
                    <p>Backup and restore system data or reset settings.</p>
                    <div className="mt-4 space-y-4">
                        <button className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600">Backup Data</button>
                        <button className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Restore Data</button>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="flex h-screen">
            {/* Sidebar Navigation */}
            <div className="w-1/4 bg-gray-800 text-white p-6">
                <h1 className="text-2xl font-bold mb-6">Settings</h1>
                <ul className="space-y-4">
                    {sections.map((section) => (
                        <li
                            key={section.id}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-700 ${activeSection === section.id ? "bg-gray-700" : ""
                                }`}
                            onClick={() => setActiveSection(section.id)}
                        >
                            {section.icon}
                            <span>{section.title}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content Area */}
            <div className="w-3/4 bg-gray-100 p-6 overflow-y-auto">
                {sections.find((section) => section.id === activeSection)?.content}
            </div>
        </div>
    );
};

export default Settings;
