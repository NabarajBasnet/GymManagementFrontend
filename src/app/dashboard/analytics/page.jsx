import { FaUsers, FaChartLine, FaDollarSign, FaFileDownload, FaChartPie, FaCalendarAlt } from "react-icons/fa";

const AnalyticsReports = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold flex items-center">
                    <FaChartLine className="mr-2 text-yellow-400" /> Analytics & Reports
                </h1>
                <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg flex items-center text-white">
                    <FaFileDownload className="mr-2" /> Download Reports
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-800 rounded-lg p-4 shadow-lg flex items-center">
                    <FaUsers className="text-blue-400 text-4xl mr-4" />
                    <div>
                        <p className="text-gray-400">Active Members</p>
                        <h2 className="text-2xl font-bold">230</h2>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 shadow-lg flex items-center">
                    <FaCalendarAlt className="text-yellow-400 text-4xl mr-4" />
                    <div>
                        <p className="text-gray-400">New Registrations</p>
                        <h2 className="text-2xl font-bold">45</h2>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 shadow-lg flex items-center">
                    <FaChartLine className="text-green-400 text-4xl mr-4" />
                    <div>
                        <p className="text-gray-400">Attendance This Month</p>
                        <h2 className="text-2xl font-bold">87%</h2>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 shadow-lg flex items-center">
                    <FaDollarSign className="text-red-400 text-4xl mr-4" />
                    <div>
                        <p className="text-gray-400">Total Revenue</p>
                        <h2 className="text-2xl font-bold">NPR 1,50,000</h2>
                    </div>
                </div>
            </div>

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Member Growth Chart */}
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                        <FaChartPie className="mr-2 text-yellow-400" /> Member Growth
                    </h3>
                    <div className="bg-gray-700 rounded-lg h-64 flex items-center justify-center text-gray-400">
                        {/* Placeholder for Graph */}
                        <p>[Graph Placeholder - Member Growth]</p>
                    </div>
                </div>

                {/* Attendance Trends */}
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                        <FaChartPie className="mr-2 text-blue-400" /> Attendance Trends
                    </h3>
                    <div className="bg-gray-700 rounded-lg h-64 flex items-center justify-center text-gray-400">
                        {/* Placeholder for Graph */}
                        <p>[Graph Placeholder - Attendance Trends]</p>
                    </div>
                </div>
            </div>

            {/* Table for Promotion Performance */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                    <FaChartLine className="mr-2 text-green-400" /> Promotion Performance
                </h3>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-700 text-gray-400">
                            <th className="py-2">Promotion</th>
                            <th className="py-2">Discount</th>
                            <th className="py-2">Start Date</th>
                            <th className="py-2">End Date</th>
                            <th className="py-2">Signups</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-700 hover:bg-gray-700 transition">
                            <td className="py-2">New Year Discount</td>
                            <td className="py-2">20%</td>
                            <td className="py-2">2024-01-01</td>
                            <td className="py-2">2024-01-15</td>
                            <td className="py-2">50</td>
                        </tr>
                        <tr className="border-b border-gray-700 hover:bg-gray-700 transition">
                            <td className="py-2">Summer Special</td>
                            <td className="py-2">15%</td>
                            <td className="py-2">2024-06-01</td>
                            <td className="py-2">2024-06-30</td>
                            <td className="py-2">30</td>
                        </tr>
                        <tr className="hover:bg-gray-700 transition">
                            <td className="py-2">Black Friday Deal</td>
                            <td className="py-2">30%</td>
                            <td className="py-2">2023-11-24</td>
                            <td className="py-2">2023-11-30</td>
                            <td className="py-2">75</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AnalyticsReports;
