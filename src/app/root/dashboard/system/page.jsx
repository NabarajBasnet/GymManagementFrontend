"use client";

import React, { useState, useEffect } from "react";
import {
  Monitor,
  Cpu,
  HardDrive,
  Network,
  Clock,
  Server,
  Wifi,
  Activity,
  Globe,
  MemoryStick,
  Database,
  Shield,
  Terminal,
  User,
  Power,
  AlertTriangle,
  BarChart2,
  Settings
} from "lucide-react";

const System = () => {
  const [systemData, setSystemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTab, setSelectedTab] = useState("overview");
  const [retryCount, setRetryCount] = useState(0);

  const getSystemInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        "http://88.198.112.156:3100/api/root/system/monitor/system-info",
        {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSystemData(data);
    } catch (err) {
      console.error("Error fetching system info:", err);
      setError(err.message);
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    getSystemInfo();

    // Auto-retry with exponential backoff
    let retryTimer;
    if (error && retryCount < 5) {
      const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
      retryTimer = setTimeout(getSystemInfo, delay);
    }

    // Data refresh interval
    const dataRefresh = setInterval(getSystemInfo, 15000);

    return () => {
      clearInterval(timer);
      clearInterval(dataRefresh);
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [error, retryCount]);

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const CircularProgress = ({
    percentage,
    size = 120,
    strokeWidth = 8,
    color = "from-cyan-400 to-blue-500",
    children,
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

    return (
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg
          className="absolute transform -rotate-90"
          width={size}
          height={size}
        >
          <defs>
            <linearGradient
              id={`gradient-${color}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#gradient-${color})`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute text-center">{children}</div>
      </div>
    );
  };

  const MetricCard = ({
    title,
    value,
    icon: Icon,
    gradient = "from-blue-500 to-purple-600",
    children,
    warning = false,
    danger = false
  }) => (
    <div className={`bg-gray-900/50 backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 hover:shadow-lg ${
      danger ? "border-red-500/50 hover:shadow-red-500/20" : 
      warning ? "border-yellow-500/50 hover:shadow-yellow-500/20" : 
      "border-gray-800 hover:border-cyan-500/50 hover:shadow-cyan-500/20"
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">{title}</h3>
        <div className={`p-2 rounded-lg bg-gradient-to-r ${gradient}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-2">{value}</div>
      {children}
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto mb-4"></div>
        <p className="text-white text-xl">Loading System Data...</p>
        {retryCount > 0 && (
          <p className="text-gray-400 mt-2">
            Attempt {retryCount} of 5...
          </p>
        )}
      </div>
    </div>
  );

  const ErrorDisplay = () => (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center max-w-md p-6 bg-gray-800/80 rounded-xl border border-gray-700">
        <div className="text-red-400 text-xl mb-4">
          <AlertTriangle className="inline mr-2" />
          Error: {error}
        </div>
        <p className="text-gray-300 mb-6">
          {retryCount < 5 
            ? "The system will automatically retry..."
            : "Failed after multiple attempts. Please check your connection."}
        </p>
        <button
          onClick={() => {
            setRetryCount(0);
            getSystemInfo();
          }}
          className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center mx-auto"
        >
          <Power className="mr-2" /> Retry Now
        </button>
        {retryCount >= 5 && (
          <p className="text-gray-400 mt-4">
            You might need to check if the API endpoint is available at:
            <code className="block mt-2 p-2 bg-gray-700 rounded text-sm">
              http://88.198.112.156:3100/api/root/system/monitor/system-info
            </code>
          </p>
        )}
      </div>
    </div>
  );

  if (loading && !systemData) return <LoadingSkeleton />;
  if (error && !systemData) return <ErrorDisplay />;
  if (!systemData) return null;

  // Calculate percentages
  const memoryUsagePercent = ((systemData.mem.used / systemData.mem.total) * 100).toFixed(1);
  const diskUsagePercent = systemData.disk[0]?.use || 0;
  const swapUsagePercent = ((systemData.mem.swapused / systemData.mem.swaptotal) * 100).toFixed(1);
  const cpuLoad = systemData.currentLoad.currentLoad.toFixed(1);

  // Determine warning/danger states
  const isCpuCritical = cpuLoad > 90;
  const isMemoryCritical = memoryUsagePercent > 90;
  const isDiskCritical = diskUsagePercent > 90;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Shield className="text-cyan-400 w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <Terminal className="mr-2 text-cyan-400" />
                Root System Dashboard
              </h1>
              <p className="text-gray-400 text-sm">
                {systemData.osInfo.hostname} | {systemData.osInfo.distro}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-mono bg-gray-800 px-3 py-1 rounded">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-gray-400 text-sm mt-1">
              Uptime: {formatUptime(systemData.uptime)}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            {[
              { id: "overview", name: "Overview", icon: Monitor },
              { id: "cpu", name: "CPU", icon: Cpu },
              { id: "memory", name: "Memory", icon: MemoryStick },
              { id: "disk", name: "Storage", icon: HardDrive },
              { id: "network", name: "Network", icon: Network },
              { id: "processes", name: "Processes", icon: Activity },
              { id: "users", name: "Users", icon: User },
              { id: "settings", name: "Settings", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center space-x-2 py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
                  selectedTab === tab.id
                    ? "border-cyan-400 text-cyan-400"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {selectedTab === "overview" && (
          <>
            {/* Critical Alerts */}
            {(isCpuCritical || isMemoryCritical || isDiskCritical) && (
              <div className="mb-6 bg-red-900/50 border border-red-700 rounded-lg p-4">
                <h3 className="font-bold text-red-300 flex items-center">
                  <AlertTriangle className="mr-2" />
                  System Alerts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  {isCpuCritical && (
                    <div className="flex items-center text-red-200">
                      <Cpu className="mr-2" /> CPU usage critical: {cpuLoad}%
                    </div>
                  )}
                  {isMemoryCritical && (
                    <div className="flex items-center text-red-200">
                      <MemoryStick className="mr-2" /> Memory usage critical: {memoryUsagePercent}%
                    </div>
                  )}
                  {isDiskCritical && (
                    <div className="flex items-center text-red-200">
                      <HardDrive className="mr-2" /> Disk usage critical: {diskUsagePercent.toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* CPU Usage */}
              <MetricCard
                title="CPU Usage"
                value={`${cpuLoad}%`}
                icon={Cpu}
                gradient={isCpuCritical ? "from-red-500 to-pink-600" : "from-green-500 to-emerald-600"}
                danger={isCpuCritical}
              >
                <CircularProgress
                  percentage={cpuLoad}
                  size={80}
                  color={isCpuCritical ? "from-red-500 to-pink-600" : "from-green-500 to-emerald-600"}
                >
                  <div className="text-sm font-bold">
                    {cpuLoad}%
                  </div>
                </CircularProgress>
              </MetricCard>

              {/* Memory Usage */}
              <MetricCard
                title="Memory Usage"
                value={`${memoryUsagePercent}%`}
                icon={MemoryStick}
                gradient={isMemoryCritical ? "from-red-500 to-pink-600" : "from-blue-500 to-cyan-600"}
                danger={isMemoryCritical}
              >
                <CircularProgress
                  percentage={parseFloat(memoryUsagePercent)}
                  size={80}
                  color={isMemoryCritical ? "from-red-500 to-pink-600" : "from-blue-500 to-cyan-600"}
                >
                  <div className="text-sm font-bold">{memoryUsagePercent}%</div>
                </CircularProgress>
              </MetricCard>

              {/* Disk Usage */}
              <MetricCard
                title="Disk Usage"
                value={`${diskUsagePercent.toFixed(1)}%`}
                icon={HardDrive}
                gradient={isDiskCritical ? "from-red-500 to-pink-600" : "from-purple-500 to-pink-600"}
                danger={isDiskCritical}
              >
                <CircularProgress 
                  percentage={diskUsagePercent} 
                  size={80}
                  color={isDiskCritical ? "from-red-500 to-pink-600" : "from-purple-500 to-pink-600"}
                >
                  <div className="text-sm font-bold">
                    {diskUsagePercent.toFixed(1)}%
                  </div>
                </CircularProgress>
              </MetricCard>

              {/* System Info */}
              <MetricCard
                title="System Info"
                value={systemData.osInfo.platform}
                icon={Server}
                gradient="from-orange-500 to-red-600"
              >
                <div className="text-sm text-gray-400">
                  <div className="flex justify-between">
                    <span>Arch:</span>
                    <span className="font-mono">{systemData.osInfo.arch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kernel:</span>
                    <span className="font-mono">{systemData.osInfo.kernel}</span>
                  </div>
                </div>
              </MetricCard>
            </div>

            {/* System Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* CPU Summary */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Cpu className="w-6 h-6 mr-2 text-cyan-400" />
                  CPU Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Model:</span>
                    <span className="font-mono">{systemData.cpu.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cores:</span>
                    <span className="font-mono">
                      {systemData.cpu.cores} ({systemData.cpu.physicalCores} physical)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Speed:</span>
                    <span className="font-mono">{systemData.cpu.speed} GHz</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Load Avg:</span>
                    <span className="font-mono">{systemData.currentLoad.avgLoad.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Memory Summary */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <MemoryStick className="w-6 h-6 mr-2 text-blue-400" />
                  Memory Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total:</span>
                    <span className="font-mono">{formatBytes(systemData.mem.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Used:</span>
                    <span className="font-mono">{formatBytes(systemData.mem.used)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Free:</span>
                    <span className="font-mono">{formatBytes(systemData.mem.free)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Swap Used:</span>
                    <span className="font-mono">{formatBytes(systemData.mem.swapused)}</span>
                  </div>
                </div>
              </div>

              {/* Disk Summary */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <HardDrive className="w-6 h-6 mr-2 text-purple-400" />
                  Disk Summary
                </h3>
                <div className="space-y-3">
                  {systemData.disk.map((disk, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Drive {disk.fs}:</span>
                        <span className="font-mono">{disk.use.toFixed(1)}% used</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total:</span>
                        <span>{formatBytes(disk.size)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Free:</span>
                        <span>{formatBytes(disk.available)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Processes */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-green-400" />
                Top Processes
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">PID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">CPU %</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Memory %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {systemData.processes.top5.map((proc, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap font-mono">{proc.pid}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{proc.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-700 rounded-full h-2.5 mr-2">
                              <div 
                                className="bg-cyan-500 h-2.5 rounded-full" 
                                style={{ width: `${Math.min(100, proc.cpu)}%` }}
                              ></div>
                            </div>
                            {proc.cpu.toFixed(1)}%
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-700 rounded-full h-2.5 mr-2">
                              <div 
                                className="bg-purple-500 h-2.5 rounded-full" 
                                style={{ width: `${Math.min(100, proc.mem)}%` }}
                              ></div>
                            </div>
                            {proc.mem.toFixed(1)}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {selectedTab === "cpu" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CPU Details */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Cpu className="w-6 h-6 mr-2 text-cyan-400" />
                  CPU Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Manufacturer:</span>
                    <span className="font-mono">{systemData.cpu.manufacturer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Model:</span>
                    <span className="font-mono">{systemData.cpu.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Speed:</span>
                    <span className="font-mono">{systemData.cpu.speed} GHz</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cores:</span>
                    <span className="font-mono">
                      {systemData.cpu.cores} ({systemData.cpu.physicalCores} physical)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Virtualization:</span>
                    <span className="font-mono">
                      {systemData.cpu.virtualization ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Current Load */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <BarChart2 className="w-6 h-6 mr-2 text-green-400" />
                  Current Load
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total:</span>
                    <span className="font-mono">{systemData.currentLoad.currentLoad.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">User:</span>
                    <span className="font-mono">{systemData.currentLoad.currentLoadUser.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">System:</span>
                    <span className="font-mono">{systemData.currentLoad.currentLoadSystem.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Idle:</span>
                    <span className="font-mono">{systemData.currentLoad.currentLoadIdle.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Usage */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Core Usage</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {systemData.currentLoad.cpus.map((cpu, index) => (
                  <div key={index} className="text-center">
                    <CircularProgress 
                      percentage={cpu.load} 
                      size={100}
                      color={cpu.load > 90 ? "from-red-500 to-pink-600" : "from-cyan-400 to-blue-500"}
                    >
                      <div>
                        <div className="text-xs text-gray-400">Core {index + 1}</div>
                        <div className="text-sm font-bold">{cpu.load.toFixed(1)}%</div>
                      </div>
                    </CircularProgress>
                    <div className="mt-2 text-xs text-gray-400">
                      <div>User: {cpu.loadUser.toFixed(1)}%</div>
                      <div>System: {cpu.loadSystem.toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cache Info */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Database className="w-6 h-6 mr-2 text-purple-400" />
                Cache Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">
                    {formatBytes(systemData.cpu.cache.l1d)}
                  </div>
                  <div className="text-sm text-gray-400">L1 Data Cache</div>
                </div>
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">
                    {formatBytes(systemData.cpu.cache.l1i)}
                  </div>
                  <div className="text-sm text-gray-400">L1 Instruction Cache</div>
                </div>
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">
                    {formatBytes(systemData.cpu.cache.l2)}
                  </div>
                  <div className="text-sm text-gray-400">L2 Cache</div>
                </div>
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">
                    {formatBytes(systemData.cpu.cache.l3)}
                  </div>
                  <div className="text-sm text-gray-400">L3 Cache</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "memory" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* RAM Usage */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <MemoryStick className="w-6 h-6 mr-2 text-blue-400" />
                  RAM Usage
                </h3>
                <div className="flex justify-center mb-6">
                  <CircularProgress
                    percentage={parseFloat(memoryUsagePercent)}
                    size={150}
                    color={isMemoryCritical ? "from-red-500 to-pink-600" : "from-blue-500 to-cyan-600"}
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {memoryUsagePercent}%
                      </div>
                      <div className="text-sm text-gray-400">Used</div>
                    </div>
                  </CircularProgress>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total:</span>
                    <span className="font-mono">{formatBytes(systemData.mem.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Used:</span>
                    <span className="font-mono">{formatBytes(systemData.mem.used)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Free:</span>
                    <span className="font-mono">{formatBytes(systemData.mem.free)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Available:</span>
                    <span className="font-mono">{formatBytes(systemData.mem.available)}</span>
                  </div>
                </div>
              </div>

              {/* Swap Usage */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <HardDrive className="w-6 h-6 mr-2 text-green-400" />
                  Swap Usage
                </h3>
                <div className="flex justify-center mb-6">
                  <CircularProgress
                    percentage={parseFloat(swapUsagePercent)}
                    size={150}
                    color={swapUsagePercent > 50 ? "from-orange-500 to-red-600" : "from-green-500 to-emerald-600"}
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {swapUsagePercent}%
                      </div>
                      <div className="text-sm text-gray-400">Used</div>
                    </div>
                  </CircularProgress>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total:</span>
                    <span className="font-mono">{formatBytes(systemData.mem.swaptotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Used:</span>
                    <span className="font-mono">{formatBytes(systemData.mem.swapused)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Free:</span>
                    <span className="font-mono">{formatBytes(systemData.mem.swapfree)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Memory Usage Chart */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <BarChart2 className="w-6 h-6 mr-2 text-purple-400" />
                Memory Allocation
              </h3>
              <div className="h-64 flex items-end space-x-2">
                <div className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-cyan-500 rounded-t-sm transition-all duration-1000"
                    style={{ height: `${(systemData.mem.used / systemData.mem.total) * 100}%` }}
                  ></div>
                  <div className="text-xs mt-2 text-gray-400">Used</div>
                  <div className="text-sm">{formatBytes(systemData.mem.used)}</div>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-blue-500 rounded-t-sm transition-all duration-1000"
                    style={{ height: `${(systemData.mem.active / systemData.mem.total) * 100}%` }}
                  ></div>
                  <div className="text-xs mt-2 text-gray-400">Active</div>
                  <div className="text-sm">{formatBytes(systemData.mem.active)}</div>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gray-600 rounded-t-sm transition-all duration-1000"
                    style={{ height: `${(systemData.mem.free / systemData.mem.total) * 100}%` }}
                  ></div>
                  <div className="text-xs mt-2 text-gray-400">Free</div>
                  <div className="text-sm">{formatBytes(systemData.mem.free)}</div>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-purple-500 rounded-t-sm transition-all duration-1000"
                    style={{ height: `${(systemData.mem.buffcache / systemData.mem.total) * 100}%` }}
                  ></div>
                  <div className="text-xs mt-2 text-gray-400">Buff/Cache</div>
                  <div className="text-sm">{formatBytes(systemData.mem.buffcache)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "disk" && (
          <div className="space-y-6">
            {systemData.disk.map((disk, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
              >
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <HardDrive className="w-6 h-6 mr-2 text-purple-400" />
                  Drive {disk.fs} ({disk.type})
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="flex flex-col items-center">
                    <CircularProgress 
                      percentage={disk.use} 
                      size={150}
                      color={disk.use > 90 ? "from-red-500 to-pink-600" : "from-purple-500 to-pink-600"}
                    >
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {disk.use.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-400">Used</div>
                      </div>
                    </CircularProgress>
                    <div className="mt-4 text-sm text-gray-400">
                      {formatBytes(disk.used)} of {formatBytes(disk.size)}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mount Point:</span>
                      <span className="font-mono">{disk.mount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">File System:</span>
                      <span className="font-mono">{disk.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Size:</span>
                      <span className="font-mono">{formatBytes(disk.size)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Used:</span>
                      <span className="font-mono">{formatBytes(disk.used)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Available:</span>
                      <span className="font-mono">{formatBytes(disk.available)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Read/Write:</span>
                      <span className="font-mono">
                        {disk.rw ? "Read/Write" : "Read Only"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTab === "network" && (
          <div className="space-y-6">
            {/* Network Interfaces */}
            {systemData.network.interfaces.map((iface, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
              >
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  {iface.type === "wireless" ? (
                    <Wifi className="w-6 h-6 mr-2 text-green-400" />
                  ) : (
                    <Network className="w-6 h-6 mr-2 text-blue-400" />
                  )}
                  {iface.ifaceName}{" "}
                  {iface.default && (
                    <span className="text-xs bg-green-500 px-2 py-1 rounded ml-2">
                      Default
                    </span>
                  )}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-cyan-400">
                      Interface Details
                    </h4>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="font-mono">{iface.iface}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="font-mono capitalize">
                        {iface.type || "Unknown"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span
                        className={`font-mono ${
                          iface.operstate === "up"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {iface.operstate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">MAC Address:</span>
                      <span className="font-mono">{iface.mac}</span>
                    </div>
                    {iface.speed && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Speed:</span>
                        <span className="font-mono">{iface.speed} Mbps</span>
                      </div>
                    )}
                  </div>

                  {(iface.ip4 || iface.ip6) && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-cyan-400">
                        IP Configuration
                      </h4>
                      {iface.ip4 && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-400">IPv4:</span>
                            <span className="font-mono">{iface.ip4}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Subnet:</span>
                            <span className="font-mono">{iface.ip4subnet}</span>
                          </div>
                        </>
                      )}
                      {iface.ip6 && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">IPv6:</span>
                          <span className="font-mono">{iface.ip6}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">DHCP:</span>
                        <span
                          className={`font-mono ${
                            iface.dhcp ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {iface.dhcp ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                      {iface.dnsSuffix && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">DNS Suffix:</span>
                          <span className="font-mono">{iface.dnsSuffix}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Network Stats */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-yellow-400" />
                Network Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {systemData.network.stats.map((stat, index) => (
                  <div key={index} className="space-y-3">
                    <h4 className="font-semibold text-cyan-400">
                      Interface: {stat.iface}
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-700/50 p-3 rounded-lg">
                        <div className="text-sm text-gray-400 mb-1">Received</div>
                        <div className="font-mono">{formatBytes(stat.rx_bytes)}</div>
                        {stat.rx_sec !== null && (
                          <div className="text-xs text-gray-500">
                            {formatBytes(stat.rx_sec)}/s
                          </div>
                        )}
                      </div>
                      <div className="bg-gray-700/50 p-3 rounded-lg">
                        <div className="text-sm text-gray-400 mb-1">Transmitted</div>
                        <div className="font-mono">{formatBytes(stat.tx_bytes)}</div>
                        {stat.tx_sec !== null && (
                          <div className="text-xs text-gray-500">
                            {formatBytes(stat.tx_sec)}/s
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Errors: {stat.rx_errors + stat.tx_errors}</span>
                      <span>Dropped: {stat.rx_dropped + stat.tx_dropped}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === "processes" && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-green-400" />
                Process Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">Total Processes</div>
                  <div className="text-2xl font-bold">
                    {systemData.processes.summary.all}
                  </div>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">Running</div>
                  <div className="text-2xl font-bold">
                    {systemData.processes.summary.running}
                  </div>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">Sleeping</div>
                  <div className="text-2xl font-bold">
                    {systemData.processes.summary.sleeping}
                  </div>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">Unknown</div>
                  <div className="text-2xl font-bold">
                    {systemData.processes.summary.unknown}
                  </div>
                </div>
              </div>

              <h4 className="font-semibold text-lg mb-3">Top Processes by Resource Usage</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">PID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">CPU %</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Memory %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {systemData.processes.top5.map((proc, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap font-mono">{proc.pid}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{proc.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-700 rounded-full h-2.5 mr-2">
                              <div 
                                className="bg-cyan-500 h-2.5 rounded-full" 
                                style={{ width: `${Math.min(100, proc.cpu)}%` }}
                              ></div>
                            </div>
                            {proc.cpu.toFixed(1)}%
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-700 rounded-full h-2.5 mr-2">
                              <div 
                                className="bg-purple-500 h-2.5 rounded-full" 
                                style={{ width: `${Math.min(100, proc.mem)}%` }}
                              ></div>
                            </div>
                            {proc.mem.toFixed(1)}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "users" && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <User className="w-6 h-6 mr-2 text-blue-400" />
                Active Users
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Login Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">From</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {systemData.users.map((user, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap">{user.user}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {user.date} at {user.time}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {user.ip || "Local"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "settings" && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Settings className="w-6 h-6 mr-2 text-gray-400" />
              System Settings
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700/50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3">Refresh Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Refresh Interval</label>
                      <select className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white">
                        <option>5 seconds</option>
                        <option>15 seconds</option>
                        <option>30 seconds</option>
                        <option>1 minute</option>
                        <option>5 minutes</option>
                      </select>
                    </div>
                    <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded">
                      Save Settings
                    </button>
                  </div>
                </div>
                <div className="bg-gray-700/50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3">System Actions</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded text-sm">
                      Restart Service
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm">
                      Shutdown
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm">
                      Backup
                    </button>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded text-sm">
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default System;