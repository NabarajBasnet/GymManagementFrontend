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
    const getNewMembers = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/graphdata/newmembers`);
            const data = await response.json();
            // Handle both array response and object with newMembers property
            return Array.isArray(data) ? data : (data?.newMembers || []);
        } catch (error) {
            console.log("Error: ", error);
            return [];
        }
    };

    const { data: newMembers = [] } = useQuery({
        queryKey: ['newMembers'],
        queryFn: getNewMembers
    });

    const getRenewedMembers = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/graphdata/renewedmembers`);
            const data = await response.json();
            // Handle both array response and object with renewedMembers property
            return Array.isArray(data) ? data : (data?.renewedMembers || []);
        } catch (error) {
            console.log("Error: ", error);
            return [];
        }
    };

    const { data: renewedMembers = [] } = useQuery({
        queryKey: ['renewedMembers'],
        queryFn: getRenewedMembers
    });

    // Create month names array
    const monthNames = ["January", "February", "March", "April", "May", "June", 
                       "July", "August", "September", "October", "November", "December"];

    // Create chart data - ensure we always have all months
    const chartData = monthNames.map(month => {
        // Safely find data for each month
        const newCount = Array.isArray(newMembers) 
            ? (newMembers.find(m => m?.month === month)?.value || 0)
            : 0;
            
        const renewCount = Array.isArray(renewedMembers) 
            ? (renewedMembers.find(m => m?.month === month)?.value || 0)
            : 0;
        
        return {
            month,
            Renew: renewCount,
            NewAdmission: newCount
        };
    });

    const chartConfig = {
        Renew: {
            label: "Renew",
            color: "hsl(var(--chart-1))",
        },
        NewAdmission: {
            label: "NewAdmission",
            color: "hsl(var(--chart-2))",
        },
    };

    const date = new Date();
    const fromStartingMonth = new Date();
    fromStartingMonth.setMonth(0);
    fromStartingMonth.setDate(1);

    return (
        <div className="w-full border-none rounded-2xl">
            <Card className="border-none dark:border-none dark:bg-gray-800 rounded-2xl">
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