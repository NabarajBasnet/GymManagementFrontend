"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";


export function BarChartMultiple() {

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

    const { members,
        totalMembers,
        totalPages,
        inactiveMembers,
        totalActiveMembers,
        totalInactiveMembers,
        dailyAverageActiveMembers,
        renewdMembers,
        renewdMembersLength,
        newAdmissions,
        newAdmissionsLength } = data || {};

    const chartData = [
        { month: "January", Renew: 186, NewAdmission: 80 },
        { month: "February", Renew: 305, NewAdmission: 200 },
        { month: "March", Renew: 237, NewAdmission: 120 },
        { month: "April", Renew: 73, NewAdmission: 190 },
        { month: "May", Renew: 209, NewAdmission: 130 },
        { month: "June", Renew: 200, NewAdmission: 140 },
        { month: "July", Renew: 214, NewAdmission: 180 },
        { month: "September", Renew: 214, NewAdmission: 140 },
        { month: "October", Renew: 200, NewAdmission: 100 },
        { month: "November", Renew: 245, NewAdmission: 150 },
        { month: "December", Renew: 190, NewAdmission: 170 },
    ];

    const chartConfig = {
        Renew: {
            label: "Renew",
            color: "hsl(var(--chart-1))",
        },
        NewAdmission: {
            label: "NewAdmission",
            color: "hsl(var(--chart-2))",
        },
    }

    const date = new Date();

    const fromStartingMonth = new Date();
    fromStartingMonth.setMonth(0);
    fromStartingMonth.setDate(1);

    return (
        <div className="w-full border-none">
            <Card className="border-none dark:border-none dark:bg-gray-800">
                <CardHeader>
                    <CardDescription>{fromStartingMonth.toLocaleString('default', { month: 'long' })} {fromStartingMonth.getDate()} - {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: '2-digit'
                    })}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig}>
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dashed" />}
                            />
                            <Bar dataKey="Renew" fill="#2563eb" radius={20} />
                            <Bar dataKey="NewAdmission" fill="#7c3aed" radius={20} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 font-medium leading-none text-green-600 dark:text-white">
                        Increased renewal by 5.2% this month <TrendingUp className="text-green-600 dark:text-white h-4 w-4" />
                    </div>
                    <div className="leading-none text-muted-foreground dark:text-gray-400">
                        Showing total new admission and renew from Jan 1 this year
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}