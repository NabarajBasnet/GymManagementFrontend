"use client";

import CreateUsers from "./CreateUsers";
import Users from "./Users";
import { User, UserPlus, UserCheck, UserX } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SystemUsers = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <h1 className="text-2xl font-bold dark:text-gray-100">System Users</h1>
      <div className="w-full py-6">
        <Tabs defaultValue="users">
          <TabsList className="w-full gap-2 py-2 rounded-sm dark:bg-gray-800">
            <TabsTrigger value="users" className="w-full py-2 dark:bg-gray-800">
              <User size={16} className="mr-2" /> System Users
            </TabsTrigger>
            <TabsTrigger value="adduser" className="w-full py-2 dark:bg-gray-800">
              <UserPlus size={16} className="mr-2" /> Add User
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="border-none shadow-none">
            <Users />
          </TabsContent>

          <TabsContent value="adduser" className='shadow-none'>
            <Card className="border-none shadow-none">
              <CreateUsers />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SystemUsers;
