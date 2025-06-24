"use client";

import CreateUsers from "./CreateUsers";
import Users from "./Users";
import { User, UserPlus, Settings, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const SystemUsers = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-6">
      <div className="w-full mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <User className="text-2xl font-bold text-indigo-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              User Management
            </h1>
          </div>
          <p className="text-gray-600 text-sm font-medium dark:text-gray-300 max-w-3xl">
            Manage all system users, permissions, and access controls. Create new accounts,
            modify existing privileges, and monitor user activity across your platform.
          </p>
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

          <div className="mt-4">
            <TabsContent value="users">
              <Card className="border-0 bg-transparent shadow-sm">
                <Users />
              </Card>
            </TabsContent>

            <TabsContent value="adduser">
              <Card className="border-0 bg-transparent shadow-sm">
                <CreateUsers />
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default SystemUsers;