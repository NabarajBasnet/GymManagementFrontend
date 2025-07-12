"use client";

import { useState, useMemo } from "react";
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Building2,
  CreditCard,
  DollarSign,
  Download,
  Filter,
  HardDrive,
  MapPin,
  MoreHorizontal,
  Settings,
  Shield,
  TrendingUp,
  TrendingDown,
  Users,
  UserPlus,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Dumbbell,
  Heart,
  Target,
  Bell,
  ChevronRight,
  Server,
  CloudUpload,
  RefreshCw,
  PauseCircle,
} from "lucide-react";

// Memoized data to prevent unnecessary recalculations
const useDashboardData = () => {
  const topGyms = useMemo(() => [
    {
      id: 1,
      name: "FitLife Premium",
      locations: 12,
      members: 2847,
      revenue: 128500,
      growth: 12.5,
      status: "active",
      plan: "Enterprise",
      logo: "🏋️"
    },
    {
      id: 2,
      name: "PowerHouse Gyms",
      locations: 8,
      members: 1923,
      revenue: 89200,
      growth: 8.3,
      status: "active",
      plan: "Professional",
      logo: "💪"
    },
    {
      id: 3,
      name: "Elite Fitness",
      locations: 15,
      members: 3421,
      revenue: 156800,
      growth: -2.1,
      status: "warning",
      plan: "Enterprise",
      logo: "⚡"
    },
    {
      id: 4,
      name: "Community Wellness",
      locations: 5,
      members: 892,
      revenue: 42100,
      growth: 15.7,
      status: "active",
      plan: "Basic",
      logo: "🌟"
    },
    {
      id: 5,
      name: "Urban Fitness Co.",
      locations: 22,
      members: 4156,
      revenue: 198300,
      growth: 6.9,
      status: "active",
      plan: "Enterprise",
      logo: "🏙️"
    }
  ], []);

  const mainStats = useMemo(() => [
    {
      title: "Monthly Recurring Revenue",
      value: "$847,250",
      change: "+18.2%",
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-red-600 to-rose-600",
      trend: "up",
      description: "vs last month"
    },
    {
      title: "Active Gym Partners",
      value: "1,247",
      change: "+24",
      icon: <Building2 className="w-6 h-6" />,
      color: "from-amber-600 to-orange-600",
      trend: "up",
      description: "new this month"
    },
    {
      title: "Total Gym Members",
      value: "186,492",
      change: "+12.8%",
      icon: <Users className="w-6 h-6" />,
      color: "from-red-700 to-pink-600",
      trend: "up",
      description: "across all gyms"
    },
    {
      title: "Platform Uptime",
      value: "99.97%",
      change: "+0.05%",
      icon: <Zap className="w-6 h-6" />,
      color: "from-red-800 to-rose-800",
      trend: "up",
      description: "this quarter"
    }
  ], []);

  const systemMetrics = useMemo(() => [
    { name: "API Gateway", status: "operational", uptime: "99.98%", color: "green" },
    { name: "Database Cluster", status: "operational", uptime: "99.95%", color: "green" },
    { name: "Payment Processing", status: "operational", uptime: "99.99%", color: "green" },
    { name: "CDN & Assets", status: "degraded", uptime: "98.12%", color: "yellow" },
    { name: "Analytics Engine", status: "operational", uptime: "99.87%", color: "green" },
    { name: "Notification Service", status: "maintenance", uptime: "95.23%", color: "blue" }
  ], []);

  const recentActivities = useMemo(() => [
    {
      id: 1,
      gym: "FitLife Premium",
      action: "Subscription upgraded to Enterprise",
      user: "admin@fitlife.com",
      time: "3 minutes ago",
      status: "completed",
      revenue: "+$2,400/mo",
      type: "upgrade"
    },
    {
      id: 2,
      gym: "New Registration",
      action: "Metro Fitness Center signed up",
      user: "owner@metrofitness.com",
      time: "1 hour ago",
      status: "pending",
      revenue: "+$890/mo",
      type: "signup"
    },
    {
      id: 3,
      gym: "PowerHouse Gyms",
      action: "Payment method updated",
      user: "billing@powerhouse.com",
      time: "2 hours ago",
      status: "completed",
      revenue: "",
      type: "billing"
    },
    {
      id: 4,
      gym: "Elite Fitness",
      action: "Support ticket: Integration issue",
      user: "tech@elitefitness.com",
      time: "4 hours ago",
      status: "in-progress",
      revenue: "",
      type: "support"
    },
    {
      id: 5,
      gym: "Community Wellness",
      action: "Monthly report generated",
      user: "system",
      time: "6 hours ago",
      status: "completed",
      revenue: "",
      type: "report"
    }
  ], []);

  const geoData = useMemo(() => [
    { region: "North America", gyms: 487, members: 89234, revenue: 342100 },
    { region: "Europe", gyms: 312, members: 56782, revenue: 198500 },
    { region: "Asia Pacific", gyms: 298, members: 31456, revenue: 156800 },
    { region: "Latin America", gyms: 89, members: 6820, revenue: 42300 },
    { region: "Middle East", gyms: 61, members: 2200, revenue: 18900 }
  ], []);

  return { topGyms, mainStats, systemMetrics, recentActivities, geoData };
};

const StatusBadge = ({ status, plan }) => {
  const statusColor = useMemo(() => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "warning": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "inactive": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  }, [status]);

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
      {plan}
    </span>
  );
};

const SystemStatusIndicator = ({ status }) => {
  const statusColor = useMemo(() => {
    switch (status) {
      case "operational": return "text-green-600 dark:text-green-400";
      case "degraded": return "text-yellow-600 dark:text-yellow-400";
      case "maintenance": return "text-blue-600 dark:text-blue-400";
      case "down": return "text-red-600 dark:text-red-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  }, [status]);

  return (
    <div className={`text-xs ${statusColor}`}>
      {status}
    </div>
  );
};

const StatCard = ({ stat }) => (
  <div className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/50 dark:hover:border-gray-600/50">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          {stat.title}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {stat.value}
        </p>
        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center text-sm font-medium ${stat.trend === "up"
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
              }`}
          >
            {stat.trend === "up" ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {stat.change}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {stat.description}
          </span>
        </div>
      </div>
      <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
        {stat.icon}
      </div>
    </div>
  </div>
);

const GymCard = ({ gym }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center text-white text-xl">
        {gym.logo}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {gym.name}
        </h3>
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {gym.locations} locations
          </span>
          <span className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {gym.members.toLocaleString()} members
          </span>
        </div>
      </div>
    </div>

    <div className="flex items-center space-x-4">
      <div className="text-right">
        <div className="font-semibold text-gray-900 dark:text-white">
          ${gym.revenue.toLocaleString()}
        </div>
        <div className={`flex items-center text-sm ${gym.growth > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
          {gym.growth > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {Math.abs(gym.growth)}%
        </div>
      </div>
      <StatusBadge status={gym.status} plan={gym.plan} />
    </div>
  </div>
);

const ActivityItem = ({ activity }) => (
  <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
    <div className={`w-2 h-2 rounded-full mt-2 ${activity.status === 'completed' ? 'bg-green-500' :
      activity.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
      }`} />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 dark:text-white">
        {activity.action}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {activity.gym} • {activity.time}
      </p>
      {activity.revenue && (
        <p className="text-sm font-medium text-green-600 dark:text-green-400">
          {activity.revenue}
        </p>
      )}
    </div>
  </div>
);

const QuickActionButton = ({ action }) => (
  <button
    className={`p-4 rounded-xl bg-gradient-to-br ${action.color === 'blue' ? 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' :
      action.color === 'green' ? 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' :
        action.color === 'purple' ? 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700' :
          action.color === 'red' ? 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' :
            action.color === 'orange' ? 'from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700' :
              'from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'
      } text-white transition-all duration-200 hover:scale-105 hover:shadow-lg`}
  >
    <div className="flex flex-col items-center space-y-2">
      {action.icon}
      <span className="text-sm font-medium text-center">{action.label}</span>
    </div>
  </button>
);

const ModernGymSaasDashboard = () => {
  const [dateRange, setDateRange] = useState("7d");
  const { topGyms, mainStats, systemMetrics, recentActivities, geoData } = useDashboardData();

  const quickActions = useMemo(() => [
    { icon: <UserPlus className="w-5 h-5" />, label: "Add Gym Partner", color: "red" },
    { icon: <CreditCard className="w-5 h-5" />, label: "Billing Overview", color: "orange" },
    { icon: <BarChart3 className="w-5 h-5" />, label: "Analytics", color: "purple" },
    { icon: <Settings className="w-5 h-5" />, label: "System Config", color: "gray" },
    { icon: <Shield className="w-5 h-5" />, label: "Security", color: "red" },
    { icon: <Download className="w-5 h-5" />, label: "Export Data", color: "orange" }
  ], []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      <div className="px-4 py-4">
        <div className="flex items-center mb-4 space-x-4">
          <div className="flex justify-end items-center space-x-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-sm border-0 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500/20"
            >
              <option value="1d">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {mainStats.map((stat, index) => (
            <StatCard key={`stat-${index}`} stat={stat} />
          ))}
        </div>

        {/* Top Performing Gyms & System Health */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
          {/* Top Performing Gyms */}
          <div className="xl:col-span-2">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Top Performing Gym Chains
                  </h2>
                  <button className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors">
                    View All
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-4">
                  {topGyms.map((gym) => (
                    <GymCard key={`gym-${gym.id}`} gym={gym} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="xl:col-span-1">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    System Health
                  </h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
                    Operational
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {systemMetrics.map((metric, index) => (
                    <div key={`metric-${index}`} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${metric.color === 'green' ? 'bg-green-500' :
                          metric.color === 'yellow' ? 'bg-yellow-500' :
                            metric.color === 'blue' ? 'bg-blue-500' : 'bg-red-500'
                          }`} />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {metric.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {metric.uptime}
                        </div>
                        <SystemStatusIndicator status={metric.status} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Overall Health</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">99.2%</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "99.2%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Geographic Distribution & Recent Activities */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
          {/* Geographic Distribution */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Geographic Distribution
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Global gym partnerships by region
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {geoData.map((region, index) => (
                  <div key={`region-${index}`} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {region.region}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {region.gyms} gyms
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {region.members.toLocaleString()} members
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Recent Activities
                </h2>
                <button className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors">
                  View All
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <ActivityItem key={`activity-${activity.id}`} activity={activity} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
          <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Quick Actions
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Common administrative tasks
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {quickActions.map((action, index) => (
                <QuickActionButton key={`action-${index}`} action={action} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernGymSaasDashboard;
