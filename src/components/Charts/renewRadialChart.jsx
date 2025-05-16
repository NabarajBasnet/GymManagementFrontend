"use client";

import { MdContentCopy } from "react-icons/md";
import { toast as notify } from 'react-hot-toast'
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
import React from 'react';
import { TrendingUp } from "lucide-react";
import {
    Label,
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
    { name: "Completed", value: 150, fill: "#d1fae5" },
];

export function RenewRadialChart() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 5;
    const [data, setData] = useState(null);

    const [startDate, setStartDate] = useState(() => {
        let start = new Date();
        start.setDate(1);
        return start;
    });

    const [endDate, setEndDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    });

    const getTotalMembers = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/members?startDate=${startDate}&endDate=${endDate}&limit=${limit}&page=${currentPage}`);
            const responseBody = await response.json();
            if (responseBody.redirect) {
                router.push(responseBody.redirect);
            };
            setData(responseBody);
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    React.useEffect(() => {
        getTotalMembers()
    }, []);

    React.useEffect(() => {
        getTotalMembers()
    }, [startDate, endDate, currentPage]);

    const {
        renewdMembers,
        renewdMembersLength,
        totalRenewdMembersPages
    } = data || {};

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
                };
            } catch (err) {
                notify.error("Failed to copy ID");
            };
            document.body.removeChild(textArea);
        };
    };

    return (
        <div className="w-full border-none">
            <Card className="flex flex-col border-none">
                <CardHeader className="items-center pb-0">
                    <CardTitle className='text-emerald-600'>Target Renews</CardTitle>
                    <CardDescription className='text-xs font-medium'>January - June 2024</CardDescription>
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
                    <div className="flex items-center gap-2 font-medium text-emerald-600 leading-none">
                        New admission target reached 5.2% this month <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="leading-none text-muted-foreground">
                        Showing target progress for the last 1 month
                    </div>
                </CardFooter>
            </Card>

            <div className="mt-6 overflow-x-auto">
                <Table className='min-w-full'>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='text-emerald-600 text-xs font-medium'>Member Id</TableHead>
                            <TableHead className='text-emerald-600 text-xs font-medium'>Full Name</TableHead>
                            <TableHead className='text-emerald-600 text-xs font-medium'>Duration</TableHead>
                            <TableHead className='text-emerald-600 text-xs font-medium'>Renew</TableHead>
                            <TableHead className='text-emerald-600 text-xs font-medium'>Contact No</TableHead>
                            <TableHead className='text-emerald-600 text-xs font-medium'>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {renewdMembers && renewdMembers.length > 0 ? (
                            renewdMembers.map((member) => {
                                const textColor =
                                    member.status === 'Active' ? 'text-black' :
                                        member.status === 'OnHold' ? 'text-yellow-600' :
                                            'text-red-500';
                                return (
                                    <TableRow key={member._id} className={textColor}>
                                        <TableCell>
                                            <div className="flex items-center justify-end text-center space-x-1 max-w-[100px]">
                                                <span className="truncate text-center font-medium text-xs">{member._id}</span>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                                                            >
                                                                <MdContentCopy
                                                                    onClick={() => copyToClipboard(member._id)}
                                                                    size={14} />
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
                                        <TableCell className='text-xs font-medium'>{new Date(member.membershipRenewDate).toISOString().split("T")[0]}</TableCell>
                                        <TableCell className='text-xs font-medium'>{member.contactNo}</TableCell>
                                        <TableCell className='text-xs font-medium'>{member.status.charAt(0).toUpperCase() + member.status.slice(1)}</TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow className='bg-white hover:bg-emerald-100 text-gray-800 hover:text-gray-900'>
                                <TableCell colSpan={6} className="text-center">
                                    No members found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow className='bg-white hover:bg-emerald-100 text-gray-800 hover:text-gray-900'>
                            <TableCell colSpan={5} className="text-left text-xs font-medium">Total Renewd Members</TableCell>
                            <TableCell className="text-right">{renewdMembersLength}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
                <div className="py-3">
                    <Pagination
                        total={totalRenewdMembersPages}
                        page={currentPage || 1}
                        onChange={setCurrentPage}
                        withEdges={true}
                        siblings={1}
                        boundaries={1}
                    />
                </div>
            </div>
        </div>
    )
}