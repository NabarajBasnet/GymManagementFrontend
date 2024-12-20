import {
    FaEnvelope,
    FaPhone,
    FaHeadset,
    FaQuestionCircle,
    FaComments,
    FaFilter,
    FaSearch
} from "react-icons/fa";
import { IoSend } from "react-icons/io5";

const AdminCustomerSupport = () => {
    return (
        <div className="w-full bg-gray-100 p-6">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Customer Support Dashboard</h1>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
                        <FaFilter /> Filter
                    </button>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            className="px-4 py-2 rounded-lg shadow border border-gray-300 w-64"
                        />
                        <FaSearch className="absolute right-3 top-3 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Tickets Table */}
            <div className="bg-white p-4 rounded-lg shadow">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2 px-4">Ticket ID</th>
                            <th className="py-2 px-4">Customer</th>
                            <th className="py-2 px-4">Status</th>
                            <th className="py-2 px-4">Priority</th>
                            <th className="py-2 px-4">Date Created</th>
                            <th className="py-2 px-4">Assigned To</th>
                            <th className="py-2 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(5)].map((_, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="py-2 px-4">#12345</td>
                                <td className="py-2 px-4">John Doe</td>
                                <td className="py-2 px-4 text-yellow-500">Pending</td>
                                <td className="py-2 px-4 text-red-500">High</td>
                                <td className="py-2 px-4">2024-12-19</td>
                                <td className="py-2 px-4">Admin A</td>
                                <td className="py-2 px-4">
                                    <button className="text-blue-500 hover:underline">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Analytics Section */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 bg-white rounded-lg shadow">
                    <h2 className="text-lg font-bold">Tickets Resolved</h2>
                    <p className="text-2xl font-semibold text-green-500">120</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow">
                    <h2 className="text-lg font-bold">Pending Tickets</h2>
                    <p className="text-2xl font-semibold text-yellow-500">45</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow">
                    <h2 className="text-lg font-bold">Average Resolution Time</h2>
                    <p className="text-2xl font-semibold text-blue-500">3h 20m</p>
                </div>
            </div>

            {/* FAQ and Help Article Management */}
            <div className="mt-12 bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">FAQ Management</h2>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">Add New FAQ</button>
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2 px-4">Question</th>
                            <th className="py-2 px-4">Category</th>
                            <th className="py-2 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(3)].map((_, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="py-2 px-4">How to reset my password?</td>
                                <td className="py-2 px-4">Account</td>
                                <td className="py-2 px-4">
                                    <button className="text-blue-500 hover:underline mr-2">Edit</button>
                                    <button className="text-red-500 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Live Chat Section */}
            <div className="mt-12 bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Live Chat</h2>
                </div>
                <div className="flex h-96 rounded-lg p-2 overflow-hidden">
                    {/* Chat Sidebar */}
                    <div className="w-1/4 bg-gray-50 p-4 overflow-y-auto rounded-md">
                        {["John Doe", "Jane Smith", "Customer 123", '12', '20', '30', '40', '50', '60', '70', '80'].map((name, index) => (
                            <div
                                key={index}
                                className="p-2 mb-2 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-100"
                            >
                                {name}
                            </div>
                        ))}
                    </div>

                    {/* Chat Window */}
                    <div className="w-3/4 bg-gray-100 p-4 flex flex-col justify-between">
                        <div className="overflow-y-auto">
                            {["Hello, I need help!", "Sure, what seems to be the issue?"].map((message, index) => (
                                <div
                                    key={index}
                                    className={`p-2 text-white font-semibold mb-2 rounded-lg ${index % 2 === 0 ? "bg-blue-500 self-start" : "bg-green-600 self-end"}`}
                                >
                                    {message}
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300"
                            />
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCustomerSupport;
