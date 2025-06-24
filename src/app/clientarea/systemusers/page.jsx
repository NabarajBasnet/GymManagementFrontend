"use client";

import { MdOutlineVerifiedUser } from "react-icons/md";
import {
  ChevronRight,
} from "lucide-react";
import CreateUsers from "./CreateUsers";
import Users from "./Users";
import { User, UserPlus, Settings, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SystemUsers = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-6">
      <div className="w-full mx-auto">

        <div className="flex flex-col space-y-3 pb-6 border-b border-gray-200 dark:border-gray-700 mb-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
              <MdOutlineVerifiedUser className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                System Users
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
                  System Users
                </span>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
            <TabsTrigger
              value="users"
              className="flex items-center gap-2 py-3 px-4 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all"
            >
              <User className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>

            <TabsTrigger
              value="adduser"
              className="flex items-center gap-2 py-3 px-4 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add User</span>
            </TabsTrigger>

            <TabsTrigger
              value="roles"
              className="flex items-center gap-2 py-3 px-4 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all"
              disabled
            >
              <Shield className="h-4 w-4" />
              <span>Roles</span>
            </TabsTrigger>

            <TabsTrigger
              value="settings"
              className="flex items-center gap-2 py-3 px-4 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all"
              disabled
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 bg-transparent">
            <TabsContent value="users">
              <Users />
            </TabsContent>

            <TabsContent value="adduser">
              <CreateUsers />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default SystemUsers;
