'use client';

import { useState } from 'react';
import {
    Home,
    MessageSquare,
    Star,
    LineChart,
    Settings,
    LogOut,
    Menu,
    X,
    User
} from 'lucide-react';


// Sample body measurements
const bodyMeasurements = [
    { date: "2025-04-01", weight: 78.2, bodyFat: 18.5, chest: 42, waist: 34, arms: 14.5 },
    { date: "2025-03-15", weight: 79.4, bodyFat: 19.1, chest: 41.5, waist: 34.5, arms: 14.2 },
    { date: "2025-03-01", weight: 80.6, bodyFat: 19.8, chest: 41, waist: 35, arms: 14 }
];

function MemberPortal() {
    const [activeTab, setActiveTab] = useState('home');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState(memberData.trainers[0]);
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState(sampleMessages);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (chatInput.trim()) {
            const newMessage = {
                id: messages.length + 1,
                sender: "member",
                text: chatInput,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([...messages, newMessage]);
            setChatInput('');

            // Simulate trainer response
            setTimeout(() => {
                const trainerResponse = {
                    id: messages.length + 2,
                    sender: "trainer",
                    text: "Thanks for your message. I'll check in with you later about this.",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, trainerResponse]);
            }, 2000);
        }
    };



    return (
        <>
            {/* Mobile header */}
            <div className="md:hidden flex justify-between items-center px-4 py-3 bg-indigo-600 text-white">
                <h1 className="font-bold text-xl">FitHub</h1>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
                <div className="hidden md:flex justify-end p-4 bg-white border-b border-gray-200">
                    <LogoutButton />
                </div>
                <div className="p-6">
                    {renderContent()}
                </div>
            </div>
        </>
    );
}




function MeasurementsSection({ measurements }) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Body Measurements</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <MeasurementCard title="Current Weight" value="78.2 kg" trend="down" percentage="-3%" />
                <MeasurementCard title="Body Fat %" value="18.5%" trend="down" percentage="-1.3%" />
                <MeasurementCard title="Muscle Mass" value="62.5 kg" trend="up" percentage="+2.1%" />
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-medium">Measurement History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight (kg)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Body Fat (%)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chest (in)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waist (in)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arms (in)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {measurements.map((measurement, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(measurement.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{measurement.weight}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{measurement.bodyFat}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{measurement.chest}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{measurement.waist}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{measurement.arms}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-medium mb-4">Add New Measurement</h3>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                            Weight (kg)
                        </label>
                        <input
                            type="number"
                            id="weight"
                            step="0.1"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="bodyFat" className="block text-sm font-medium text-gray-700">
                            Body Fat (%)
                        </label>
                        <input
                            type="number"
                            id="bodyFat"
                            step="0.1"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="chest" className="block text-sm font-medium text-gray-700">
                            Chest (inches)
                        </label>
                        <input
                            type="number"
                            id="chest"
                            step="0.1"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="waist" className="block text-sm font-medium text-gray-700">
                            Waist (inches)
                        </label>
                        <input
                            type="number"
                            id="waist"
                            step="0.1"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="arms" className="block text-sm font-medium text-gray-700">
                            Arms (inches)
                        </label>
                        <input
                            type="number"
                            id="arms"
                            step="0.1"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="measurementDate" className="block text-sm font-medium text-gray-700">
                            Date
                        </label>
                        <input
                            type="date"
                            id="measurementDate"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            defaultValue={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
                        >
                            Save Measurement
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function MeasurementCard({ title, value, trend, percentage }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <div className="flex items-baseline mt-2">
                <p className="text-2xl font-semibold">{value}</p>
                <span className={`ml-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {percentage}
                </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">vs last month</p>
        </div>
    );
}

function SettingsSection() {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-medium">Personal Information</h3>
                </div>
                <div className="p-6">
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                defaultValue="Alex"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                defaultValue="Johnson"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                defaultValue="alex.johnson@example.com"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                defaultValue="(555) 123-4567"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
                            >
                                Update Information
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-medium">Change Password</h3>
                </div>
                <div className="p-6">
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                                Current Password
                            </label>
                            <input
                                type="password"
                                id="currentPassword"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
                        >
                            Change Password
                        </button>
                    </form>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-medium">Notification Settings</h3>
                </div>
                <div className="p-6">
                    <form className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium">Email Notifications</h4>
                                <p className="text-sm text-gray-500">Receive updates via email</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium">SMS Notifications</h4>
                                <p className="text-sm text-gray-500">Receive updates via text message</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium">App Notifications</h4>
                                <p className="text-sm text-gray-500">Receive in-app notifications</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
                        >
                            Save Notification Settings
                        </button>
                    </form>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
                <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
                    <h3 className="font-medium text-red-800">Danger Zone</h3>
                </div>
                <div className="p-6">
                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium">Delete Account</h4>
                                <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                            </div>
                            <button
                                type="button"
                                className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                            >
                                Delete Account
                            </button>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium">Cancel Membership</h4>
                                <p className="text-sm text-gray-500">Cancel your premium membership</p>
                            </div>
                            <button
                                type="button"
                                className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                            >
                                Cancel Membership
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MemberPortal;

