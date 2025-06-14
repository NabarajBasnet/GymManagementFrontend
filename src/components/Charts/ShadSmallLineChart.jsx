"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
    { month: "January", newadmission: 186, mobile: 80 },
    { month: "February", newadmission: 305, mobile: 200 },
    { month: "March", newadmission: 237, mobile: 120 },
    { month: "April", newadmission: 73, mobile: 190 },
    { month: "May", newadmission: 209, mobile: 130 },
    { month: "June", newadmission: 214, mobile: 140 },
    { month: "July", newadmission: 230, mobile: 132 },
    { month: "August", newadmission: 210, mobile: 142 },
    { month: "September", newadmission: 190, mobile: 170 },
    { month: "October", newadmission: 195, mobile: 162 },
    { month: "November", newadmission: 150, mobile: 156 },
    { month: "December", newadmission: 200, mobile: 174 },
];

const chartConfig = {
    newadmission: {
        label: "New Admission",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
}

export function ShadSmallLineChart() {
    return (
        <div className="w-full border-none">
            <Card className="w-full dark:border-none dark:bg-gray-800 border-none rounded-2xl">
                <CardHeader>
                    <CardDescription>January - December 2024</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig}>
                        <LineChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={4}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Line
                                dataKey="newadmission"
                                type="natural"
                                stroke="#14b8a6"
                                strokeWidth={1}
                                dot={{
                                    fill: "#14b8a6",
                                }}
                                activeDot={{
                                    r: 3,
                                }}
                            />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 font-medium leading-none">
                        Increasing new admission by 5.2% this month <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="leading-none text-muted-foreground dark:text-gray-400">
                        Showing total new admission for the last 12 months
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};
