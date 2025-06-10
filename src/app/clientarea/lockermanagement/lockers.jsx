'use client';

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Circle,
    CircleCheck,
    CircleOff,
    CircleHelp,
    Wrench,
    Lock,
    Building2,
    Box
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const statuses = {
    available: { text: "Available", icon: CircleCheck, color: "bg-green-100 text-green-800" },
    occupied: { text: "Occupied", icon: Lock, color: "bg-blue-100 text-blue-800" },
    maintenance: { text: "Maintenance", icon: Wrench, color: "bg-yellow-100 text-yellow-800" },
    disabled: { text: "Disabled", icon: CircleOff, color: "bg-red-100 text-red-800" },
    unknown: { text: "Unknown", icon: CircleHelp, color: "bg-gray-100 text-gray-800" },
    empty: { text: "Empty", icon: Circle, color: "bg-gray-100 text-gray-800" }
};

const LockersOverview = () => {
    // Get all lockers of every branch and tenant
    const getAllLockers = async () => {
        try {
            const req = await fetch(`http://localhost:3000/api/lockers/by-tenant`);
            const res = await req.json();
            return res;
        } catch (error) {
            console.log("Error: ", error);
            return { lockers: [] };
        };
    };

    const { data, isLoading } = useQuery({
        queryKey: ['lockers'],
        queryFn: getAllLockers
    });

    const { lockers: tenantLockers = [] } = data || {};

    // Extract unique branches from the locker data
    const branches = tenantLockers.reduce((acc, locker) => {
        if (!acc.some(b => b.id === locker.organizationBranch._id)) {
            acc.push({
                id: locker.organizationBranch._id,
                name: locker.organizationBranch.orgBranchName
            });
        }
        return acc;
    }, [{ id: "all", name: "All Branches" }]);

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
        return <div>Loading lockers...</div>;
    }

    return (
        <div className="space-y-6">
            <Tabs defaultValue="grid">
                <Card className="dark:border-none shadow-md mb-4 dark:bg-gray-900">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold">Locker Management</h1>
                            <p className="text-muted-foreground">View and manage all locker units</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Select>
                                <SelectTrigger className="w-[200px] py-6 rounded-sm dark:bg-gray-800 dark:border-none dark:text-white">
                                    <SelectValue placeholder="Select branch" />
                                </SelectTrigger>
                                <SelectContent className='dark:text-white dark:border-none dark:bg-gray-800'>
                                    <SelectGroup>
                                        <SelectLabel>Branches</SelectLabel>
                                        {branches.map((branch) => (
                                            <SelectItem key={branch.id} value={branch.id} className='hover:cursor-pointer hover:bg-blue-500'>
                                                {branch.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <TabsList className="grid grid-cols-2 w-full sm:w-auto dark:bg-gray-800">
                                <TabsTrigger value="grid">
                                    <Box className="h-4 w-4 mr-2" /> Grid
                                </TabsTrigger>
                                <TabsTrigger value="table">
                                    <Table className="h-4 w-4 mr-2" /> Table
                                </TabsTrigger>
                            </TabsList>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6">
                        {Object.entries({
                            total: { count: lockerStats.total, label: "Total Lockers" },
                            available: { count: lockerStats.available, label: "Available" },
                            occupied: { count: lockerStats.occupied, label: "Occupied" },
                            maintenance: { count: lockerStats.maintenance, label: "Maintenance" },
                            disabled: { count: lockerStats.disabled, label: "Disabled" },
                        }).map(([key, { count, label }]) => {
                            const status = statuses[key] || statuses.unknown;
                            const Icon = status.icon || Circle;

                            return (
                                <Card key={key} className="shadow-sm dark:border-none dark:bg-gray-800">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium dark:text-gray-200">{label}</p>
                                                <h2 className="text-2xl font-bold">{count}</h2>
                                            </div>
                                            <div className={`p-3 rounded-full ${status.color}`}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </Card>

                <TabsContent value="grid">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {tenantLockers.map((locker) => {
                            const statusKey = locker.isAssigned ? "occupied" :
                                locker.status.toLowerCase() in statuses ?
                                    locker.status.toLowerCase() : "unknown";
                            const status = statuses[statusKey] || statuses.unknown;
                            const StatusIcon = status.icon || Circle;

                            return (
                                <Card key={locker._id} className="hover:shadow-md flex flex-col justify-between transition-shadow dark:bg-gray-900 dark:border-none">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">Locker {locker.lockerId}</CardTitle>
                                                <CardDescription>{locker.organizationBranch.orgBranchName}</CardDescription>
                                            </div>
                                            <Badge variant="outline" className={status.color}>
                                                <StatusIcon className="h-3 w-3 mr-1" />
                                                {status.text}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Size:</span>
                                                <span className="text-sm font-medium">{locker.lockerSize}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Assigned to:</span>
                                                <span className="text-sm font-medium">
                                                    {locker.memberName || "None"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Locker Number:</span>
                                                <span className="text-sm font-medium">
                                                    {locker.lockerNumber || "None"}
                                                </span>
                                            </div>
                                            {locker.expireDate && (
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-muted-foreground">Expires:</span>
                                                    <span className="text-sm font-medium">
                                                        {new Date(locker.expireDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-end">
                                        <Button variant="outline" size="sm" className='dark:border-none dark:bg-gray-800'>
                                            Manage
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>

                <TabsContent value="table">
                    <Card>
                        <CardHeader>
                            <CardTitle>Locker Inventory</CardTitle>
                            <CardDescription>Detailed view of all locker units</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Locker ID</TableHead>
                                        <TableHead>Branch</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Size</TableHead>
                                        <TableHead>Assigned To</TableHead>
                                        <TableHead>Expiration</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tenantLockers.map((locker) => {
                                        const statusKey = locker.isAssigned ? "occupied" :
                                            locker.status.toLowerCase() in statuses ?
                                                locker.status.toLowerCase() : "unknown";
                                        const status = statuses[statusKey] || statuses.unknown;
                                        const StatusIcon = status.icon || Circle;

                                        return (
                                            <TableRow key={locker._id}>
                                                <TableCell className="font-medium">{locker.lockerId}</TableCell>
                                                <TableCell>{locker.organizationBranch.orgBranchName}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={status.color}>
                                                        <StatusIcon className="h-3 w-3 mr-1" />
                                                        {status.text}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{locker.lockerSize}</TableCell>
                                                <TableCell>{locker.memberName || "None"}</TableCell>
                                                <TableCell>
                                                    {locker.expireDate ?
                                                        new Date(locker.expireDate).toLocaleDateString() :
                                                        "N/A"}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm">
                                                        Manage
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={6}>Total Lockers</TableCell>
                                        <TableCell className="text-right">{tenantLockers.length}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default LockersOverview;