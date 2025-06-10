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
    unknown: { text: "Unknown", icon: CircleHelp, color: "bg-gray-100 text-gray-800" }
};

const branches = [
    { id: "all", name: "All Branches" },
    { id: "downtown", name: "Downtown" },
    { id: "uptown", name: "Uptown" },
    { id: "westside", name: "Westside" },
    { id: "eastside", name: "Eastside" },
];

const lockers = Array.from({ length: 10 }).map((_, i) => ({
    id: `LKR${100 + i}`,
    branch: branches[Math.floor(Math.random() * branches.length)].name,
    status: Object.keys(statuses)[Math.floor(Math.random() * Object.keys(statuses).length)],
    size: ["Small", "Medium", "Large"][Math.floor(Math.random() * 3)],
    lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString(),
}));

const LockersOverview = () => {

    // Get all lockers of every branch and tenant
    const getAllLockers = async () => {
        try {
            const req = await fetch(`http://localhost:3000/api/lockers/by-tenant`);
            const res = await req.json();
            console.log('Res: ', res);
            return res;
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const { data, isLoading } = useQuery({
        queryKey: ['lockers'],
        queryFn: getAllLockers
    });

    const { lockers: tenantLockers } = data || {};
    console.log("Lockers: ", tenantLockers);


    return (
        <div className="space-y-6">
            <Tabs defaultValue="grid">
                <Card className="border-none shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold">Locker Management</h1>
                            <p className="text-muted-foreground">View and manage all locker units</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Select>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Select branch" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Branches</SelectLabel>
                                        {branches.map((branch) => (
                                            <SelectItem key={branch.id} value={branch.id}>
                                                {branch.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <TabsList className="grid grid-cols-2 w-full sm:w-auto">
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
                            total: { count: 180, label: "Total Lockers" },
                            available: { count: 80, label: "Available" },
                            occupied: { count: 60, label: "Occupied" },
                            maintenance: { count: 25, label: "Maintenance" },
                            disabled: { count: 15, label: "Disabled" },
                        }).map(([key, { count, label }]) => {
                            const status = statuses[key] || statuses.unknown;
                            const Icon = status.icon || Circle;

                            return (
                                <Card key={key} className="shadow-sm">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">{label}</p>
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
                        {lockers?.map((locker, index) => {
                            const status = statuses[locker.status] || statuses.unknown;
                            const StatusIcon = status.icon || Circle;

                            return (
                                <Card key={index} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">Locker {locker.id}</CardTitle>
                                                <CardDescription>{locker.branch}</CardDescription>
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
                                                <span className="text-sm font-medium">{locker.size}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">Last Used:</span>
                                                <span className="text-sm font-medium">{locker.lastUsed}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-end">
                                        <Button variant="outline" size="sm">
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
                                        <TableHead>Last Used</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lockers?.map((locker) => {
                                        const status = statuses[locker.status] || statuses.unknown;
                                        const StatusIcon = status.icon || Circle;

                                        return (
                                            <TableRow key={locker.id}>
                                                <TableCell className="font-medium">{locker.id}</TableCell>
                                                <TableCell>{locker.branch}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={status.color}>
                                                        <StatusIcon className="h-3 w-3 mr-1" />
                                                        {status.text}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{locker.size}</TableCell>
                                                <TableCell>{locker.lastUsed}</TableCell>
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
                                        <TableCell colSpan={5}>Total Lockers</TableCell>
                                        <TableCell className="text-right">{lockers.length}</TableCell>
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