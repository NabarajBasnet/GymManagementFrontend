'use client';

import CreateLocker from './register'
import { IoDocumentTextOutline } from "react-icons/io5";
import { LuLogs } from "react-icons/lu";
import { IoMdAdd } from "react-icons/io";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight } from "lucide-react";
import { FaLockOpen, FaLock } from "react-icons/fa";
import { Documentation } from "./documentation";
import LockersOverview from "./lockers";
import LockerLogs from './logs';

const LockerManagement = () => {
    return (
        <div className="w-full min-h-screen bg-gray-100 dark:bg-gradient-to-br from-gray-800 via-slate-700 to-neutral-800 py-7 px-4">
            {/* Header Section */}
            <div className="flex flex-col space-y-3 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                        <FaLockOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Locker Management
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
                                Locker Management
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Tabs Component */}
            <Tabs defaultValue="lockers" className="w-full mt-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Left Side - Tabs List */}
                    <div className="w-full md:w-2/12">
                        <Card className='h-full dark:bg-gray-800 dark:border-none'>
                            <TabsList className="w-full h-full flex md:flex-col items-start justify-start p-4 gap-1 space-y-0 md:space-y-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <TabsTrigger
                                    value="lockers"
                                    className="w-full justify-start px-4 py-2 text-sm font-medium rounded-md transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400"
                                >
                                    <FaLock className="mr-2 h-4 w-4" />
                                    <span className='hidden md:flex'>
                                        Lockers
                                    </span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="register"
                                    className="w-full justify-start px-4 py-2 text-sm font-medium rounded-md transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400"
                                >
                                    <IoMdAdd className="mr-2 h-4 w-4" />
                                    <span className='hidden md:flex'>
                                        Register
                                    </span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="logs"
                                    className="w-full justify-start px-4 py-2 text-sm font-medium rounded-md transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400"
                                >
                                    <IoDocumentTextOutline className="mr-2 h-4 w-4" />
                                    <span className='hidden md:flex'>
                                        Logs
                                    </span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="documentation"
                                    className="w-full justify-start px-4 py-2 text-sm font-medium rounded-md transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400"
                                >
                                    <LuLogs className="mr-2 h-4 w-4" />
                                    <span className='hidden md:flex'>
                                        Doc
                                    </span>
                                </TabsTrigger>
                            </TabsList>
                        </Card>
                    </div>

                    {/* Right Side - Tabs Content */}
                    <div className="w-full md:w-10/12">
                        <Card className="h-full p-3 md:p-6 dark:bg-gray-800 dark:border-none">
                            <TabsContent value='lockers' className="h-full">
                                <LockersOverview />
                            </TabsContent>
                            <TabsContent value='register' className="h-full">
                                <CreateLocker />
                            </TabsContent>
                            <TabsContent value='logs' className="h-full">
                                <LockerLogs />
                            </TabsContent>
                            <TabsContent value='documentation' className="h-full">
                                <Documentation />
                            </TabsContent>
                        </Card>
                    </div>
                </div>
            </Tabs>
        </div>
    )
}

export default LockerManagement;