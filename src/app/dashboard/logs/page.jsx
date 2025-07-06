'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge";
import {
  CircleDollarSign,
  RotateCcw,
  XCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Home,
  LayoutDashboard,
  CreditCard,
  FileText,
  ChevronRight,
  Plus,
  Search,
  Trash2,
  ArrowUpDown,
  Eye,
  Calendar,
  User,
  Building,
  Phone,
  Mail,
  Globe,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  Info,
  Bug,
  Zap,
  Activity,
  Server,
  Database,
  Shield,
  TrendingUp
} from "lucide-react";
import { useState } from 'react';
import Pagination from '@/components/ui/CustomPagination';

// Import shadcn components
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useQuery } from '@tanstack/react-query';

const Logs = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedLog, setSelectedLog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  const getLogs = async ({ queryKey }) => {
    const [, currentPage, limit] = queryKey
    try {
      const response = await fetch(`https://fitbinary.com/api/applogs?page=${currentPage}&limit=${limit}`);
      const resBody = await response.json();

      if (!response.ok) {
        toast.error(resBody.message || 'Failed to fetch data');
      }
      return resBody;
    } catch (error) {
      console.error("Error in getData:", error);
      toast.error('Failed to fetch logs');
    }
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['logs', currentPage, limit],
    queryFn: getLogs
  });

  const { logs, totalLogs, totalPages } = data || {};

  // Filter and sort logs
  const filteredAndSortedLogs = logs ? logs
    .filter(log => {
      const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.metadata?.user?.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.metadata?.user?.lastName || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel;

      return matchesSearch && matchesLevel;
    })
    .sort((a, b) => {
      const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    }) : [];

  // Pagination
  const startIndex = (currentPage - 1) * limit;
  const paginatedLogs = filteredAndSortedLogs.slice(startIndex, startIndex + limit);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getLevelBadgeColor = (level) => {
    switch (level.toLowerCase()) {
      case 'error':
        return 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800/50';
      case 'warn':
        return 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800/50';
      case 'info':
        return 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800/50';
      case 'debug':
        return 'bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-600/50';
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/50';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-600/50';
    }
  };

  const getLevelIcon = (level) => {
    switch (level.toLowerCase()) {
      case 'error':
        return <XCircle className="h-3.5 w-3.5" />;
      case 'warn':
        return <AlertTriangle className="h-3.5 w-3.5" />;
      case 'info':
        return <Info className="h-3.5 w-3.5" />;
      case 'debug':
        return <Bug className="h-3.5 w-3.5" />;
      case 'success':
        return <CheckCircle2 className="h-3.5 w-3.5" />;
      default:
        return <Activity className="h-3.5 w-3.5" />;
    }
  };

  const getRowHoverColor = (level) => {
    switch (level.toLowerCase()) {
      case 'error':
        return 'hover:bg-red-50/50 dark:hover:bg-red-950/20';
      case 'warn':
        return 'hover:bg-amber-50/50 dark:hover:bg-amber-950/20';
      case 'info':
        return 'hover:bg-blue-50/50 dark:hover:bg-blue-950/20';
      case 'debug':
        return 'hover:bg-gray-50/50 dark:hover:bg-gray-800/30';
      case 'success':
        return 'hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20';
      default:
        return 'hover:bg-gray-50/50 dark:hover:bg-gray-800/30';
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getLogStats = () => {
    if (!logs) return { total: 0, error: 0, warn: 0, info: 0, debug: 0, success: 0 };

    const stats = logs.reduce((acc, log) => {
      acc.total++;
      acc[log.level.toLowerCase()] = (acc[log.level.toLowerCase()] || 0) + 1;
      return acc;
    }, { total: 0, error: 0, warn: 0, info: 0, debug: 0, success: 0 });

    return stats;
  };

  const stats = getLogStats();

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 lg:py-8">
            {/* Breadcrumb */}
            <div className="mb-8">
              <Breadcrumb>
                <BreadcrumbList className="flex items-center space-x-1">
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href="/"
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href="/dashboard"
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <Server className="h-4 w-4 mr-2" />
                      System Logs
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Title and Actions */}
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
              <div className="flex-1 min-w-0">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-2xl shadow-lg shadow-blue-500/25 dark:shadow-blue-500/20">
                    <Server className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                      System Logs
                    </h1>
                    <p className="text-base text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                      Monitor and analyze application activities, errors, and system events in real-time
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => refetch()}
                  variant="outline"
                  className="flex items-center space-x-2 dark:border-nones text-primary dark:bg-gray-700 border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center space-x-2 dark:border-nones text-primary dark:bg-gray-700 border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="w-full mx-auto pt-4 px-4 mb-2">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <Activity className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Errors</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-400">{stats.error}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Warnings</p>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{stats.warn}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Info</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{stats.info}</p>
              </div>
              <Info className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Debug</p>
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-400">{stats.debug}</p>
              </div>
              <Bug className="h-8 w-8 text-gray-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Success</p>
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{stats.success}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="w-full mx-auto pt-2 px-4 pb-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 mb-4">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search logs by message, level, or user..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80 h-11 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                >
                  <option value="all">All Levels</option>
                  <option value="error">Error</option>
                  <option value="warn">Warning</option>
                  <option value="info">Info</option>
                  <option value="debug">Debug</option>
                  <option value="success">Success</option>
                </select>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing <span className="font-medium text-gray-900 dark:text-gray-100">{paginatedLogs.length}</span> of{' '}
                  <span className="font-medium text-gray-900 dark:text-gray-100">{filteredAndSortedLogs.length}</span> logs
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('timestamp')}
                      className="flex items-center space-x-1 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Timestamp</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('level')}
                      className="flex items-center space-x-1 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                      <Shield className="h-4 w-4" />
                      <span>Level</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <FileText className="h-4 w-4" />
                      <span>Message</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>User</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <Building className="h-4 w-4" />
                      <span>Organization</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedLogs.map((log, index) => (
                  <tr key={log._id} className={`transition-all duration-200 ${getRowHoverColor(log.level)}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{formatDate(log.timestamp)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${getLevelBadgeColor(log.level)} flex items-center space-x-1.5 font-medium`}>
                        {getLevelIcon(log.level)}
                        <span className="capitalize">{log.level}</span>
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      <div className="max-w-md">
                        <p className="truncate font-medium">{log.message}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {log.metadata?.user ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="font-medium">{log.metadata.user.firstName} {log.metadata.user.lastName}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 italic">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {log.metadata?.organization ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <Building className="h-3 w-3 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="font-medium max-w-xs truncate">{log.metadata.organization.name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 italic">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <AlertDialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <AlertDialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <AlertDialogTitle className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getLevelBadgeColor(selectedLog.level)}`}>
                  {getLevelIcon(selectedLog.level)}
                </div>
                <div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Log Details</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {formatDate(selectedLog.timestamp)}
                  </p>
                </div>
              </AlertDialogTitle>
            </AlertDialogHeader>

            <div className="space-y-6 py-4">
              {/* Level and Message */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Level</label>
                  <Badge className={`${getLevelBadgeColor(selectedLog.level)} text-base px-3 py-1`}>
                    {getLevelIcon(selectedLog.level)}
                    <span className="ml-2 capitalize font-medium">{selectedLog.level}</span>
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Message</label>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{selectedLog.message}</p>
                  </div>
                </div>
              </div>

              {/* User Information */}
              {selectedLog.metadata?.user && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">User Details</label>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {selectedLog.metadata.user.firstName} {selectedLog.metadata.user.lastName}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{selectedLog.metadata.user.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Role</span>
                          <p className="text-sm font-medium text-primary">{selectedLog.metadata.user.role}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Phone</span>
                          <p className="text-sm font-medium text-primary">{selectedLog.metadata.user.phoneNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Organization Information */}
              {selectedLog.metadata?.organization && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">Organization Details</label>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <Building className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {selectedLog.metadata.organization.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {selectedLog.metadata.organization.businessType}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Email</span>
                          <p className="text-sm font-medium text-primary">{selectedLog.metadata.organization.businessEmail}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Phone</span>
                          <p className="text-sm font-medium text-primary">{selectedLog.metadata.organization.phoneNumber}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Location</span>
                          <p className="text-sm font-medium text-primary">
                            {selectedLog.metadata.organization.city}, {selectedLog.metadata.organization.country}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Website</span>
                          <p className="text-sm font-medium text-primary">{selectedLog.metadata.organization.websiteUrl}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Branch Information */}
              {selectedLog.metadata?.organizationBranch && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">Branch Details</label>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {selectedLog.metadata.organizationBranch.orgBranchName}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Status: {selectedLog.metadata.organizationBranch.orgBranchStatus}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Email</span>
                          <p className="text-sm font-medium text-primary">{selectedLog.metadata.organizationBranch.orgBranchEmail}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Phone</span>
                          <p className="text-sm font-medium text-primary">{selectedLog.metadata.organizationBranch.orgBranchPhone}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Address</span>
                          <p className="text-sm font-medium text-primary">{selectedLog.metadata.organizationBranch.orgBranchAddress}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Website</span>
                          <p className="text-sm font-medium text-primary">{selectedLog.metadata.organizationBranch.orgBranchWebsite}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <AlertDialogFooter className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <AlertDialogAction
                onClick={() => setSelectedLog(null)}
                className="bg-blue-600 text-primary hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Close
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <div className="w-full flex justify-center md:justify-end pb-4 px-4">
        <Pagination
          total={totalPages}
          page={currentPage}
          onChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Logs;