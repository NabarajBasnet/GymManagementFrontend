"use client";

import { useQuery } from "@tanstack/react-query";
import { MdContentCopy } from "react-icons/md";
import { toast as notify } from 'react-hot-toast';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import Pagination from "../ui/CustomPagination";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TrendingUp } from "lucide-react";
import {
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
    ResponsiveContainer,
} from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const chartData = [
    { name: "Target", value: 200, fill: "#10b981" },
    { name: "Completed", value: 150, fill: "#77d496" },
];

export function RenewRadialChart({ startDate, endDate }) {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 5;

    const getRenewedMembers = async ({ queryKey }) => {
        const [, startDate, endDate, page, limit] = queryKey;
        try {
            const response = await fetch(
                `http://localhost:3000/api/memberanalytics/renewedmembers?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`
            );
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.error("Error fetching renewed members:", error);
            return { members: [] };
        }
    };

    const { data: renewedMembers = { members: [] }, isLoading: isRenewedMembersLoading } = useQuery({
        queryKey: ['renewedMembers', startDate, endDate, currentPage, limit],
        queryFn: getRenewedMembers
    });
    const { totalPages } = renewedMembers || {}

    // Calculate completion percentage for the chart
    const completionPercentage = Math.round((chartData[1].value / chartData[0].value) * 100);

    // Pagination logic
    const totalMembers = renewedMembers.members?.length || 0;
    const paginatedMembers = renewedMembers.members?.slice(
        (currentPage - 1) * limit,
        currentPage * limit
    ) || [];

    const copyToClipboard = (_id) => {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard.writeText(_id)
                .then(() => notify.success(`Member ID ${_id} copied to clipboard`))
                .catch(() => notify.error("Failed to copy ID"));
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = _id;
            textArea.style.position = "fixed";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    notify.success(`Member ID ${_id} copied to clipboard`);
                } else {
                    throw new Error();
                }
            } catch (err) {
                notify.error("Failed to copy ID");
            }
            document.body.removeChild(textArea);
        }
    };

    return (
        <div className="w-full border-none dark:border-none dark:bg-gray-800 rounded-2xl">
            <Card className="flex flex-col dark:border-gray-600 dark:bg-gray-800 border-none rounded-2xl">
                <CardHeader className="items-center pb-0">
                    <CardTitle className='text-emerald-600'>Target Renews</CardTitle>
                    <CardDescription className='text-xs font-medium'>
                        {startDate.toLocaleString('default', { month: 'long' })} - {endDate.toLocaleString('default', { month: 'long' })}
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex pb-0">
                    <div className="w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                                data={chartData}
                                startAngle={180}
                                endAngle={-180}
                                innerRadius="50%"
                                outerRadius="90%"
                            >
                                <PolarGrid
                                    gridType="circle"
                                    radialLines={false}
                                />
                                <PolarRadiusAxis
                                    angle={30}
                                    domain={[0, 200]}
                                    tick={false}
                                    axisLine={false}
                                />
                                <RadialBar
                                    dataKey="value"
                                    cornerRadius={10}
                                    background
                                    animationDuration={1500}
                                />
                                <text
                                    x="50%"
                                    y="50%"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="text-lg font-bold fill-emerald-600"
                                >
                                    {chartData[1].value} / {chartData[0].value}
                                </text>
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 font-medium text-emerald-600 dark:text-gray-300 leading-none">
                        Renewal target reached {completionPercentage}% this period <TrendingUp className="h-4 w-4 dark:text-white" />
                    </div>
                    <div className="leading-none text-muted-foreground dark:text-gray-400">
                        Showing target progress from {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
                    </div>
                </CardFooter>
            </Card>

            <div className="mt-6 overflow-x-auto">
                <Table className='min-w-full dark:border-gray-600 dark:bg-gray-800 rounded-2xl'>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='text-emerald-600 text-xs font-medium'>Member ID</TableHead>
                            <TableHead className='text-emerald-600 text-xs font-medium'>Full Name</TableHead>
                            <TableHead className='text-emerald-600 text-xs font-medium'>Duration</TableHead>
                            <TableHead className='text-emerald-600 text-xs font-medium'>Renew Date</TableHead>
                            <TableHead className='text-emerald-600 text-xs font-medium'>Contact No</TableHead>
                            <TableHead className='text-emerald-600 text-xs font-medium'>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="rounded-2xl">
                        {isRenewedMembersLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-4">
                                    Loading members...
                                </TableCell>
                            </TableRow>
                        ) : paginatedMembers.length > 0 ? (
                            paginatedMembers.map(({ member }) => {
                                const textColor =
                                    member.status === 'Active' ? 'text-black dark:text-white' :
                                        member.status === 'OnHold' ? 'text-yellow-600 dark:text-yellow-500' :
                                            'text-red-500 dark:text-red-500';
                                return (
                                    <TableRow key={member._id} className={textColor}>
                                        <TableCell>
                                            <div className="flex items-center justify-end text-center space-x-1 max-w-[100px]">
                                                <span className="truncate text-center font-medium text-xs">{member._id}</span>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={() => copyToClipboard(member._id)}
                                                                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                                                            >
                                                                <MdContentCopy size={14} />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Copy ID</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </TableCell>
                                        <TableCell className='text-xs font-medium'>{member.fullName}</TableCell>
                                        <TableCell className='text-xs font-medium'>{member.membershipDuration}</TableCell>
                                        <TableCell className='text-xs font-medium'>
                                            {new Date(member.membershipRenewDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className='text-xs font-medium'>{member.contactNo}</TableCell>
                                        <TableCell className='text-xs font-medium'>
                                            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-4">
                                    No renewed members found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter className="rounded-2xl">
                        <TableRow>
                            <TableCell colSpan={5} className="text-left text-xs bg-gray-100 dark:bg-gray-800 font-medium">
                                Total Renewed Members
                            </TableCell>
                            <TableCell className="text-right text-xs font-medium">
                                {renewedMembers?.members?.length}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
                <div className="py-3 border-t dark:border-gray-600 dark:bg-gray-800 rounded-b-2xl">
                    <Pagination
                        total={totalPages || 0}
                        page={currentPage}
                        onChange={setCurrentPage}
                        withEdges={true}
                        siblings={1}
                        boundaries={1}
                        limit={limit}
                    />
                </div>
            </div>
        </div>
    );
}