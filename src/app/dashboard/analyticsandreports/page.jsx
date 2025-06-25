import {
    ChevronRight,
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
        <div className="p-4 bg-gray-100 min-h-screen dark:bg-gray-900">

            <div className="flex flex-col space-y-3 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                        <TbReportAnalytics className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Reports & Analytics
                        </h1>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Portal
                            </span>
                            <ChevronRight className="w-4 h-4 mx-2" />
                            <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Client Area
                            </span>
                            <ChevronRight className="w-4 h-4 mx-2" />
                            <span className="text-blue-600 dark:text-blue-400 font-medium">
                                Reports & Analytics
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <Tabs defaultValue="analyticsdashboard" className="w-full bg-transparent">
                    <TabsList className="bg-transparent border-b border-gray-200 dark:border-gray-700">
                        <TabsTrigger value="analyticsdashboard" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Analytics Dashboard</TabsTrigger>
                        <TabsTrigger value="revenewdashboard" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Revenew Dashboard</TabsTrigger>
                        <TabsTrigger value="members" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Members Expiry Report</TabsTrigger>
                        <TabsTrigger value="lockers" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Locker Expiry Report</TabsTrigger>
                    </TabsList>

                    <TabsContent value="analyticsdashboard">
                        <AnalyticsDashboard />
                    </TabsContent>

                    <TabsContent value="revenewdashboard">
                        <RevenewDashboard />
                    </TabsContent>

                    <TabsContent value="members">
                        <MemberExpiryReport />
                    </TabsContent>

                    <TabsContent value="lockers">
                        <LockerExpiryReport />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default AnalyticsAndReports;