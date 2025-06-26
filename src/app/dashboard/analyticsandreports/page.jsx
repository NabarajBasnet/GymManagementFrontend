import {
    ChevronRight,
    BarChart3,
    TrendingUp,
    Users,
    Lock,
    Calendar
} from "lucide-react";
import { TbReportAnalytics } from "react-icons/tb";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import MemberExpiryReport from "./MemberExpiryReport";
import LockerExpiryReport from "./LockerExpiryReport";
import AnalyticsDashboard from "./AnalyticsDashboard";
import RevenewDashboard from "./RevenewDashboard";

const AnalyticsAndReports = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            <div className="px-4 py-6">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex items-start space-x-4">
                            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                                <TbReportAnalytics className="w-8 h-8 text-white" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                                    Reports & Analytics
                                </h1>
                                {/* Breadcrumb */}
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                                        Portal
                                    </span>
                                    <ChevronRight className="w-4 h-4 mx-2 opacity-60" />
                                    <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                                        Client Area
                                    </span>
                                    <ChevronRight className="w-4 h-4 mx-2 opacity-60" />
                                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                                        Reports & Analytics
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <Tabs defaultValue="analyticsdashboard" className="w-full">
                        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <TabsList className="bg-transparent h-auto p-0 space-x-0 w-full justify-start overflow-x-auto">
                                <TabsTrigger
                                    value="analyticsdashboard"
                                    className="flex items-center space-x-2 px-6 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200 text-gray-600 dark:text-gray-400 whitespace-nowrap"
                                >
                                    <BarChart3 className="w-4 h-4" />
                                    <span className="font-medium">Analytics Dashboard</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="revenewdashboard"
                                    className="flex items-center space-x-2 px-6 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-green-500 data-[state=active]:bg-green-50 dark:data-[state=active]:bg-green-900/20 data-[state=active]:text-green-700 dark:data-[state=active]:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200 text-gray-600 dark:text-gray-400 whitespace-nowrap"
                                >
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="font-medium">Revenue Dashboard</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="members"
                                    className="flex items-center space-x-2 px-6 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-orange-50 dark:data-[state=active]:bg-orange-900/20 data-[state=active]:text-orange-700 dark:data-[state=active]:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200 text-gray-600 dark:text-gray-400 whitespace-nowrap"
                                >
                                    <Users className="w-4 h-4" />
                                    <span className="font-medium">Members Expiry Report</span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="lockers"
                                    className="flex items-center space-x-2 px-6 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-purple-50 dark:data-[state=active]:bg-purple-900/20 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200 text-gray-600 dark:text-gray-400 whitespace-nowrap"
                                >
                                    <Lock className="w-4 h-4" />
                                    <span className="font-medium">Locker Expiry Report</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="p-4">
                            <TabsContent value="analyticsdashboard" className="mt-0">
                                <AnalyticsDashboard />
                            </TabsContent>

                            <TabsContent value="revenewdashboard" className="mt-0">
                                <RevenewDashboard />
                            </TabsContent>

                            <TabsContent value="members" className="mt-0">
                                <MemberExpiryReport />
                            </TabsContent>

                            <TabsContent value="lockers" className="mt-0">
                                <LockerExpiryReport />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsAndReports;