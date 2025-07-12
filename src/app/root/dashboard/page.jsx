"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowUpRight,
  BarChart2,
  Calendar,
  Clock,
  Database,
  Download,
  Filter,
  HardDrive,
  Shield,
  Users,
} from "lucide-react";

const RootDashboard = () => {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Sample data for the table
  const recentActivities = [
    {
      id: 1,
      user: "admin@fitloft.com",
      action: "System Configuration Updated",
      time: "2 minutes ago",
      status: "completed",
    },
    {
      id: 2,
      user: "john@client.com",
      action: "New Tenant Registration",
      time: "15 minutes ago",
      status: "pending",
    },
    {
      id: 3,
      user: "system",
      action: "Nightly Backup Completed",
      time: "3 hours ago",
      status: "completed",
    },
    {
      id: 4,
      user: "billing@fitloft.com",
      action: "Subscription Renewal Processed",
      time: "1 day ago",
      status: "completed",
    },
    {
      id: 5,
      user: "support@fitloft.com",
      action: "Support Ticket Created",
      time: "2 days ago",
      status: "in-progress",
    },
  ];

  // Stats cards data
  const stats = [
    {
      title: "Active Tenants",
      value: "142",
      change: "+12%",
      icon: <Users className="w-6 h-6" />,
      color: "from-purple-600 to-indigo-600",
    },
    {
      title: "System Uptime",
      value: "99.98%",
      change: "0.02%",
      icon: <HardDrive className="w-6 h-6" />,
      color: "from-emerald-600 to-teal-600",
    },
    {
      title: "Total Revenue",
      value: "$48,752",
      change: "+8.3%",
      icon: <BarChart2 className="w-6 h-6" />,
      color: "from-amber-600 to-orange-600",
    },
    {
      title: "Pending Actions",
      value: "7",
      change: "-2",
      icon: <Shield className="w-6 h-6" />,
      color: "from-rose-600 to-pink-600",
    },
  ];

  return (
    <div className="flex-1 p-6 bg-gray-50/50 dark:bg-gray-900/50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            System overview and analytics
          </p>
        </div>

        {/* Simple Date Range Selector */}
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <div className="relative">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
          <span className="text-gray-500 dark:text-gray-400">to</span>
          <div className="relative">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
          <button className="px-3 py-2 text-sm font-medium rounded-md bg-gradient-to-r from-red-600 to-rose-700 text-white hover:from-red-700 hover:to-rose-800 transition-colors">
            Apply
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${stat.color} rounded-xl p-5 shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <div className="text-white/80">{stat.title}</div>
              <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                {stat.icon}
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="flex items-center mt-2 text-sm text-white/90">
                <span
                  className={`inline-flex items-center ${stat.change.startsWith("+")
                      ? "text-emerald-200"
                      : stat.change.startsWith("-")
                        ? "text-rose-200"
                        : "text-blue-200"
                    }`}
                >
                  {stat.change.startsWith("+") ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : stat.change.startsWith("-") ? (
                    <ArrowUpRight className="w-4 h-4 mr-1 rotate-180" />
                  ) : (
                    <Clock className="w-4 h-4 mr-1" />
                  )}
                  {stat.change}
                </span>
                <span className="ml-2">vs last period</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent System Activities
          </h2>
          <button className="flex items-center space-x-1 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Action
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Details</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.user}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {activity.action}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${activity.status === "completed"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                          : activity.status === "pending"
                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                            : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
                        }`}
                    >
                      {activity.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => router.push(`/root/dashboard/activity/${activity.id}`)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-500 transition-colors"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">5</span> of{" "}
            <span className="font-medium">24</span> activities
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              System Health
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
              All systems operational
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Database
                </span>
                <span className="text-sm text-green-600 dark:text-green-400">
                  100%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  API Services
                </span>
                <span className="text-sm text-green-600 dark:text-green-400">
                  99.9%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: "99.9%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Storage
                </span>
                <span className="text-sm text-amber-600 dark:text-amber-400">
                  78%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full"
                  style={{ width: "78%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Alerts
            </h2>
            <button className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Database backup failed
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last attempted 2 hours ago
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  High memory usage detected
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Server #3 reached 85% capacity
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  New tenant registration
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Requires admin approval
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RootDashboard;