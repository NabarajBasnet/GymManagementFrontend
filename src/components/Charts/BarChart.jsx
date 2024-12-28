"use client"

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

const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 200, mobile: 140 },
    { month: "July", desktop: 214, mobile: 180 },
    { month: "September", desktop: 214, mobile: 140 },
    { month: "October", desktop: 200, mobile: 100 },
    { month: "November", desktop: 245, mobile: 150 },
    { month: "December", desktop: 190, mobile: 170 },
]

const chartConfig = {
    renew: {
        label: "Renew",
        color: "hsl(var(--chart-1))",
    },
    newadmission: {
        label: "New Admission",
        color: "hsl(var(--chart-2))",
    },
}

export function BarChartMultiple() {
    return (
        <Card>
            <CardHeader>
                <CardDescription>January - December 2024</CardDescription>
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
                        <Bar dataKey="desktop" fill="#2563eb" radius={20} />
                        <Bar dataKey="mobile" fill="#7c3aed" radius={20} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Increased renewal by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total new admission and renew for the last 12 months
                </div>
            </CardFooter>
        </Card>
    )
}
