"use client";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const invoices = [
    {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV004",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV005",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV006",
        paymentStatus: "Pending",
        totalAmount: "$200.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV007",
        paymentStatus: "Unpaid",
        totalAmount: "$300.00",
        paymentMethod: "Credit Card",
    },
];

import Pagination from "../ui/CustomPagination";
import { useRouter } from "next/navigation";
import { usePagination } from "@/hooks/Pagination";
import { TrendingUp } from "lucide-react"
import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts";
import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
const chartData = [
    { browser: "safari", visitors: 200, fill: "#db2777" },
]

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    safari: {
        label: "Safari",
        color: "#db2777",
    },
};

export function RadialChart() {

    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(1);
    const limit = 3;
    const [startDate, setStartDate] = useState(() => {
        const startDate = new Date();
        const calculatedStartYear = startDate.getFullYear();
        startDate.setFullYear(calculatedStartYear, 0, 1);
        return startDate;
    });

    const [endDate, setEndDate] = useState(new Date());

    const getTotalMembers = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/members?startDate=${startDate}&endDate=${endDate}&limit=${limit}&page=${currentPage}`);
            const responseBody = await response.json();
            if (responseBody.redirect) {
                router.push(responseBody.redirect);
            };
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const { data } = useQuery({
        queryKey: ['membersLength'],
        queryFn: getTotalMembers
    });

    const {
        members,
        totalMembers,
        totalPages,
        inactiveMembers,
        totalActiveMembers,
        totalInactiveMembers,
        dailyAverageActiveMembers,
        renewdMembers,
        renewdMembersLength,
        newAdmissions,
        newAdmissionsLength
    } = data || {};

    const { range, setPage, active } = usePagination({
        total: totalPages ? totalPages : 1,
        siblings: 1,
        boundaries: 1,
        page: currentPage,
        onChange: (page) => {
            setCurrentPage(page);
        },
    });

    return (
        <div>
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                    <CardTitle className='text-pink-600'>Target New Admmission</CardTitle>
                    <CardDescription>{startDate.getMonth() === 0 ? 'Jaruary' : ''} - {startDate.getMonth()}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[250px]"
                    >
                        <RadialBarChart
                            data={chartData}
                            startAngle={0}
                            endAngle={250}
                            innerRadius={80}
                            outerRadius={110}
                        >
                            <PolarGrid
                                gridType="circle"
                                radialLines={false}
                                stroke="none"
                                className="first:fill-muted last:fill-background"
                                polarRadius={[86, 74]}
                            />
                            <RadialBar dataKey="visitors" background cornerRadius={10} />
                            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-pink-600 text-2xl font-bold"
                                                    >
                                                        {chartData[0].visitors.toLocaleString()} Of {chartData[0].visitors.toLocaleString()}
                                                    </tspan>

                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 24}
                                                        className="fill-muted-foreground"
                                                    >
                                                        New Admission
                                                    </tspan>
                                                </text>
                                            )
                                        }
                                    }}
                                />
                            </PolarRadiusAxis>
                        </RadialBarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 font-medium text-pink-600 leading-none">
                        New admission target reached 5.2% this month <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="leading-none text-muted-foreground">
                        Showing target progress for the last 1 month
                    </div>
                </CardFooter>
            </Card>

            <div className='bg-white rounded-md shadow-md mt-6'>
                <Table className='bg-white rounded-md shadow-md'>
                    <TableHeader>
                        <TableRow className='text-pink-600'>
                            <TableHead className='text-pink-600'>Invoice</TableHead>
                            <TableHead className='text-pink-600'>Status</TableHead>
                            <TableHead className='text-pink-600'>Method</TableHead>
                            <TableHead className='text-pink-600 text-right'>Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.invoice}>
                                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                                <TableCell>{invoice.paymentStatus}</TableCell>
                                <TableCell>{invoice.paymentMethod}</TableCell>
                                <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter className='bg-pink-600'>
                        <TableRow className='text-white'>
                            <TableCell colSpan={3}>Total</TableCell>
                            <TableCell className="text-right">$2,500.00</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>

                <div className="py-3">
                    <Pagination
                        total={totalPages || 1}
                        page={currentPage || 1}
                        onChange={setCurrentPage}
                        withEdges={true}
                        siblings={1}
                        boundaries={1}
                    />
                </div>
            </div>
        </div>
    );
};
