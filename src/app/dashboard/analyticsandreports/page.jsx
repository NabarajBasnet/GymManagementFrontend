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

const  AnalyticsAndReports =()=> {
  return (
    <div className="p-4 bg-gray-100 min-h-screen dark:bg-gray-900"> 


    <div className="mt-4">
        <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2"><TbReportAnalytics className="size-12 text-blue-500 bg-blue-500/10 p-2 rounded-md" /> Analytics & Reports</h1>
        <div className="mt-4">
            <Tabs defaultValue="analyticsdashboard" className="w-full bg-transparent">
                <TabsList className="bg-transparent border-b border-gray-200 dark:border-gray-700">
                    <TabsTrigger value="analyticsdashboard" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Analytics Dashboard</TabsTrigger>
                    <TabsTrigger value="members" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Members Expiry Report</TabsTrigger>
                    <TabsTrigger value="lockers" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Locker Expiry Report</TabsTrigger>
                </TabsList>

                <TabsContent value="analyticsdashboard">  
                    <AnalyticsDashboard />
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
    </div>
  )
}

export default AnalyticsAndReports;