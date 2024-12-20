import { FaUsers, FaChartLine, FaDollarSign, FaFileDownload, FaChartPie, FaCalendarAlt } from "react-icons/fa";
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

const AnalyticsReports = () => {
    return (
        <div className="w-full bg-gray-100 ">

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
                            <BreadcrumbPage>Analytics & Reports</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-xl font-bold mt-3">Analytics & Reports</h1>
            </div>

            <div className="w-full p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold flex items-center">
                        <FaChartLine className="mr-2 text-yellow-400" /> Analytics & Reports
                    </h1>
                    <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg flex items-center text-white">
                        <FaFileDownload className="mr-2" /> Download Reports
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg p-4 shadow-xl flex items-center">
                        <FaUsers className="text-blue-600 text-4xl mr-4" />
                        <div>
                            <p className="text-gray-700">Active Members</p>
                            <h2 className="text-2xl font-bold">230</h2>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-xl flex items-center">
                        <FaCalendarAlt className="text-yellow-500 text-4xl mr-4" />
                        <div>
                            <p className="text-gray-700">New Registrations</p>
                            <h2 className="text-2xl font-bold">45</h2>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-xl flex items-center">
                        <FaChartLine className="text-green-600 text-4xl mr-4" />
                        <div>
                            <p className="text-gray-700">Attendance This Month</p>
                            <h2 className="text-2xl font-bold">87%</h2>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-xl flex items-center">
                        <FaDollarSign className="text-red-600 text-4xl mr-4" />
                        <div>
                            <p className="text-gray-700">Total Revenue</p>
                            <h2 className="text-2xl font-bold">NPR 1,50,000</h2>
                        </div>
                    </div>
                </div>

                {/* Analytics Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Member Growth Chart */}
                    <div className="bg-white rounded-lg p-6 shadow-xl">
                        <h3 className="text-xl font-bold mb-4 flex items-center">
                            <FaChartPie className="mr-2 text-yellow-500" /> Member Growth
                        </h3>
                        <div className="rounded-lg h-64 flex items-center justify-center text-gray-400">
                            {/* Placeholder for Graph */}
                            <p>[Graph Placeholder - Member Growth]</p>
                        </div>
                    </div>

                    {/* Attendance Trends */}
                    <div className="bg-white rounded-lg p-6 shadow-xl">
                        <h3 className="text-xl font-bold mb-4 flex items-center">
                            <FaChartPie className="mr-2 text-blue-600" /> Attendance Trends
                        </h3>
                        <div className="rounded-lg h-64 flex items-center justify-center text-gray-400">
                            {/* Placeholder for Graph */}
                            <p>[Graph Placeholder - Attendance Trends]</p>
                        </div>
                    </div>
                </div>

                {/* Table for Promotion Performance */}
                <div className="bg-white rounded-lg p-6 shadow-xl">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                        <FaChartLine className="mr-2 text-green-500" /> Promotion Performance
                    </h3>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-700 text-gray-700">
                                <th className="py-2">Promotion</th>
                                <th className="py-2">Discount</th>
                                <th className="py-2">Start Date</th>
                                <th className="py-2">End Date</th>
                                <th className="py-2">Signups</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-700 hover:bg-gray-300 cursor-pointer transition">
                                <td className="py-2">New Year Discount</td>
                                <td className="py-2">20%</td>
                                <td className="py-2">2024-01-01</td>
                                <td className="py-2">2024-01-15</td>
                                <td className="py-2">50</td>
                            </tr>
                            <tr className="border-b border-gray-700 hover:bg-gray-300 cursor-pointer transition">
                                <td className="py-2">Summer Special</td>
                                <td className="py-2">15%</td>
                                <td className="py-2">2024-06-01</td>
                                <td className="py-2">2024-06-30</td>
                                <td className="py-2">30</td>
                            </tr>
                            <tr className="hover:bg-gray-300 cursor-pointer transition">
                                <td className="py-2 px-1">Black Friday Deal</td>
                                <td className="py-2 px-1">30%</td>
                                <td className="py-2 px-1">2023-11-24</td>
                                <td className="py-2 px-1">2023-11-30</td>
                                <td className="py-2 px-1">2023-11-30</td>
                                <td className="py-2 px-1">75</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsReports;
