'use client';

import Pagination from '@/components/ui/CustomPagination';
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Circle,
    CircleCheck,
    CircleOff,
    CircleHelp,
    Wrench,
    Lock,
    Box,
    Search,
    SortAsc,
    SortDesc,
    Filter
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTenant } from '@/components/Providers/LoggedInTenantProvider';
import debounce from 'lodash/debounce';

const statuses = {
    available: { text: "Available", icon: CircleCheck, color: "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200" },
    occupied: { text: "Occupied", icon: Lock, color: "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200" },
    maintenance: { text: "Maintenance", icon: Wrench, color: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200" },
    disabled: { text: "Disabled", icon: CircleOff, color: "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200" },
    unknown: { text: "Unknown", icon: CircleHelp, color: "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200" },
    empty: { text: "Empty", icon: Circle, color: "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200" }
};

const lockerSizes = ["Small", "Medium", "Large", "Extra Large"];

const LockersOverview = () => {
    const { tenant } = useTenant();

    // Filter and pagination states
    const limit = 15;
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedBranch, setSelectedBranch] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('lockerNumber');
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedSize, setSelectedSize] = useState('all');
    const [activeTab, setActiveTab] = useState('grid');

    // Debounced search function
    const debouncedSearch = debounce((value) => {
        setSearchQuery(value);
        setCurrentPage(1);
    }, 300);

    // Get all lockers of every branch and tenant
    const getAllLockers = async ({ queryKey }) => {
        const [, page, limit, selectedBranch, searchQuery, sortBy, sortOrder, selectedSize] = queryKey;
        try {
            const queryParams = new URLSearchParams({
                page,
                limit,
                branch: selectedBranch,
                search: searchQuery,
                sortBy,
                sortOrder,
                lockerSize: selectedSize
            });

            const req = await fetch(`http://localhost:3000/api/lockers/by-tenant?${queryParams}`);
            const res = await req.json();
            return res;
        } catch (error) {
            console.log("Error: ", error);
            return { lockers: [], branches: [] };
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ['lockers', currentPage, limit, selectedBranch, searchQuery, sortBy, sortOrder, selectedSize],
        queryFn: getAllLockers,
    });

    const { lockers: tenantLockers = [], totalPages, totalLockers, branches = [] } = data || {};

    // Filter toolbar component
    const FilterToolbar = () => (
        <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
            <div className="flex-1">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 h-5 w-5 transition-colors duration-200" />
                    <Input
                        placeholder="Search lockers by ID, member name, or number..."
                        className="pl-12 h-12 dark:bg-gray-700/70 rounded-xl border-gray-200 dark:border-gray-600/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-300 text-base placeholder:text-gray-500 focus:border-blue-400 dark:focus:border-blue-500"
                        onChange={(e) => debouncedSearch(e.target.value)}
                    />
                </div>
            </div>

            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="w-full md:w-[220px] h-12 dark:border-gray-600/50 rounded-xl cursor-pointer dark:bg-gray-700/70 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 border-gray-200 focus:border-blue-400 dark:focus:border-blue-500">
                    <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-700/95 dark:border-gray-600/50 rounded-xl backdrop-blur-md shadow-xl border-gray-200'>
                    <SelectGroup>
                        <SelectLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">Branches</SelectLabel>
                        <SelectItem value="all" className='cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg mx-1 transition-colors duration-200'>All Branches</SelectItem>
                        {Array.from(new Set(tenantLockers.map(locker => locker.organizationBranch._id))).map((branchId) => (
                            <SelectItem className='cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg mx-1 transition-colors duration-200' key={branchId} value={branchId}>
                                {tenantLockers.find(l => l.organizationBranch._id === branchId)?.organizationBranch.orgBranchName || branchId}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-full md:w-[200px] h-12 dark:border-gray-600/50 rounded-xl cursor-pointer dark:bg-gray-700/70 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 border-gray-200 focus:border-blue-400 dark:focus:border-blue-500">
                    <SelectValue placeholder="Filter by size" />
                </SelectTrigger>
                <SelectContent className='dark:bg-gray-700/95 dark:border-gray-600/50 rounded-xl backdrop-blur-md shadow-xl border-gray-200'>
                    <SelectGroup>
                        <SelectLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">Locker Size</SelectLabel>
                        <SelectItem value="all" className='cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg mx-1 transition-colors duration-200'>All Sizes</SelectItem>
                        {lockerSizes.map((size) => (
                            <SelectItem className='cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg mx-1 transition-colors duration-200' key={size} value={size}>{size}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            <div className="flex gap-3">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="h-12 w-12 rounded-xl dark:bg-gray-700/70 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 border-gray-200 dark:border-gray-600/50 hover:border-blue-400 dark:hover:border-blue-500 group"
                >
                    {sortOrder === 'asc' ?
                        <SortAsc className="h-5 w-5 group-hover:text-blue-600 transition-colors duration-200" /> :
                        <SortDesc className="h-5 w-5 group-hover:text-blue-600 transition-colors duration-200" />
                    }
                </Button>
            </div>
        </div>
    );

    // Calculate locker statistics
    const lockerStats = tenantLockers.reduce((stats, locker) => {
        stats.total++;

        if (locker.status === "Empty") {
            stats.available++;
        } else if (locker.isAssigned) {
            stats.occupied++;
        } else if (locker.status === "Maintenance") {
            stats.maintenance++;
        } else if (locker.status === "Disabled") {
            stats.disabled++;
        }

        return stats;
    }, {
        total: 0,
        available: 0,
        occupied: 0,
        maintenance: 0,
        disabled: 0
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Loading lockers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 p-0 rounded-md min-h-screen">
            {/* Header Card with Stats */}
            <Card className="dark:border-gray-700/50 shadow-md mb-4 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 bg-gradient-to-br from-white to-gray-50 border-gray-200/50 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 space-y-6 md:space-y-0">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                            Locker Management
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">View and manage all locker units across your organization</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4">
                    {Object.entries({
                        total: { count: totalLockers, label: "Total Lockers", gradient: "from-violet-500 to-purple-600" },
                        available: { count: lockerStats.available, label: "Available", gradient: "from-emerald-500 to-green-600" },
                        occupied: { count: lockerStats.occupied, label: "Occupied", gradient: "from-blue-500 to-indigo-600" },
                        maintenance: { count: lockerStats.maintenance, label: "Maintenance", gradient: "from-amber-500 to-orange-600" },
                        disabled: { count: lockerStats.disabled, label: "Disabled", gradient: "from-red-500 to-rose-600" },
                    }).map(([key, { count, label, gradient }]) => {
                        const status = statuses[key] || statuses.unknown;
                        const Icon = status.icon || Circle;

                        return (
                            <Card key={key} className="shadow-lg hover:shadow-xl dark:border-gray-700/50 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-700 bg-gradient-to-br from-white to-gray-50 border-gray-200/50 transition-all duration-300 hover:scale-[1.02] group min-w-0">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between space-x-4">
                                        <div className="space-y-1 min-w-0">
                                            <p className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider truncate">{label}</p>
                                            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate">{count}</h2>
                                        </div>
                                        <div className={`p-2 md:p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg group-hover:shadow-xl transition-all duration-300 flex-shrink-0`}>
                                            <Icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                        <FilterToolbar />
                    </div>
                    <TabsList className="grid grid-cols-2 w-full md:w-[240px] dark:bg-gray-800/70 bg-white/80 backdrop-blur-sm shadow-lg rounded-md p-2 border border-gray-200/50 dark:border-gray-700/50">
                        <TabsTrigger
                            value="grid"
                            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-300 data-[state=active]:shadow-lg"
                        >
                            <Box className="h-4 w-4 mr-2" /> Grid
                        </TabsTrigger>
                        <TabsTrigger
                            value="table"
                            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-300 data-[state=active]:shadow-lg"
                        >
                            <Table className="h-4 w-4 mr-2" /> Table
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="grid" className="mt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {tenantLockers.map((locker) => {
                            const statusKey = locker.isAssigned ? "occupied" :
                                locker.status.toLowerCase() in statuses ?
                                    locker.status.toLowerCase() : "unknown";
                            const status = statuses[statusKey] || statuses.unknown;
                            const StatusIcon = status.icon || Circle;

                            return (
                                <Card
                                    key={locker._id}
                                    className="hover:shadow-2xl shadow-lg transform hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 bg-gradient-to-br from-white to-gray-50 dark:border-gray-700/50 border-gray-200/50 group overflow-hidden relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    <CardHeader className="pb-4 relative z-10">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <CardTitle className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                                    Locker {locker.lockerId}
                                                </CardTitle>
                                                <CardDescription className="text-gray-600 dark:text-gray-300 font-medium">
                                                    {locker.organizationBranch.orgBranchName}
                                                </CardDescription>
                                            </div>
                                            <Badge variant="outline" className={`${status.color} font-semibold px-3 py-1 rounded-full shadow-sm`}>
                                                <StatusIcon className="h-3 w-3 mr-2" />
                                                {status.text}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="relative z-10 space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Size:</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white px-2 py-1 bg-white dark:bg-gray-700 rounded-md shadow-sm">
                                                    {locker.lockerSize}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Assigned to:</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {locker.memberName || "None"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Number:</span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {locker.lockerNumber || "None"}
                                                </span>
                                            </div>
                                            {locker.expireDate && (
                                                <div className="flex justify-between items-center p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50">
                                                    <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Expires:</span>
                                                    <span className="text-sm font-bold text-amber-900 dark:text-amber-200">
                                                        {new Date(locker.expireDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>

                                    <CardFooter className="flex justify-end relative z-10 pt-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className='dark:border-gray-600/50 dark:bg-gray-800/70 bg-white/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white hover:border-transparent transition-all duration-300 rounded-xl shadow-sm hover:shadow-lg font-semibold'
                                        >
                                            Manage
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>

                <TabsContent value="table" className="mt-0">
                    <Card className='dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 bg-gradient-to-br from-white to-gray-50 dark:border-gray-700/50 border-gray-200/50 shadow-xl backdrop-blur-sm overflow-hidden'>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700">
                                            <TableHead className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 font-bold text-gray-700 dark:text-gray-200 py-4 px-6 rounded-tl-lg" onClick={() => setSortBy('lockerId')}>
                                                Locker ID {sortBy === 'lockerId' && (sortOrder === 'asc' ? '↑' : '↓')}
                                            </TableHead>
                                            <TableHead className="font-bold text-gray-700 dark:text-gray-200 py-4 px-6">Branch</TableHead>
                                            <TableHead className="font-bold text-gray-700 dark:text-gray-200 py-4 px-6">Status</TableHead>
                                            <TableHead className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 font-bold text-gray-700 dark:text-gray-200 py-4 px-6" onClick={() => setSortBy('lockerSize')}>
                                                Size {sortBy === 'lockerSize' && (sortOrder === 'asc' ? '↑' : '↓')}
                                            </TableHead>
                                            <TableHead className="font-bold text-gray-700 dark:text-gray-200 py-4 px-6">Assigned To</TableHead>
                                            <TableHead className="font-bold text-gray-700 dark:text-gray-200 py-4 px-6">Expiration</TableHead>
                                            <TableHead className="text-right font-bold text-gray-700 dark:text-gray-200 py-4 px-6 rounded-tr-lg">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {tenantLockers.map((locker, index) => {
                                            const statusKey = locker.isAssigned ? "occupied" :
                                                locker.status.toLowerCase() in statuses ?
                                                    locker.status.toLowerCase() : "unknown";
                                            const status = statuses[statusKey] || statuses.unknown;
                                            const StatusIcon = status.icon || Circle;

                                            return (
                                                <TableRow
                                                    key={locker._id}
                                                    className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 transition-all duration-300 ${index % 2 === 0 ? 'bg-white dark:bg-gray-900/50' : 'bg-gray-50/50 dark:bg-gray-800/30'
                                                        } border-b border-gray-100 dark:border-gray-800`}
                                                >
                                                    <TableCell className="font-bold text-gray-900 dark:text-white py-4 px-6">{locker.lockerId}</TableCell>
                                                    <TableCell className="text-gray-700 dark:text-gray-300 py-4 px-6 font-medium">{locker.organizationBranch.orgBranchName}</TableCell>
                                                    <TableCell className="py-4 px-6">
                                                        <Badge variant="outline" className={`${status.color} font-semibold px-3 py-1 rounded-full shadow-sm`}>
                                                            <StatusIcon className="h-3 w-3 mr-2" />
                                                            {status.text}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-gray-700 dark:text-gray-300 py-4 px-6 font-medium">{locker.lockerSize}</TableCell>
                                                    <TableCell className="text-gray-700 dark:text-gray-300 py-4 px-6 font-medium">{locker.memberName || "None"}</TableCell>
                                                    <TableCell className="text-gray-700 dark:text-gray-300 py-4 px-6 font-medium">
                                                        {locker.expireDate ?
                                                            new Date(locker.expireDate).toLocaleDateString() :
                                                            "N/A"}
                                                    </TableCell>
                                                    <TableCell className="text-right py-4 px-6">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white transition-all duration-300 rounded-xl font-semibold"
                                                        >
                                                            Manage
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow className="bg-gradient-to-r from-gray-100 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-t-2 border-gray-200 dark:border-gray-600">
                                            <TableCell colSpan={6} className="font-bold text-gray-800 dark:text-gray-200 py-4 px-6">Total Lockers</TableCell>
                                            <TableCell className="text-right font-bold text-gray-900 dark:text-white py-4 px-6 text-lg">{tenantLockers.length}</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className='w-full flex justify-end my-8'>
                <Pagination
                    total={totalPages || 1}
                    page={currentPage || 1}
                    onChange={setCurrentPage}
                    withEdges={true}
                    siblings={1}
                    boundaries={1}
                    classNames={{
                        item: "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 relative inline-flex items-center px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg shadow-sm hover:shadow-md",
                        active: "z-10 bg-gradient-to-r from-blue-600 to-indigo-700 border-blue-600 text-white hover:from-blue-700 hover:to-indigo-800 shadow-lg",
                        dots: "relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg"
                    }}
                />
            </div>
        </div>
    );
};

export default LockersOverview;