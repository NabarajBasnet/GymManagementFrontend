"use client"

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
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
    { date: "2024-04-01", Active: 222, Inactive: 150 },
    { date: "2024-04-02", Active: 97, Inactive: 180 },
    { date: "2024-04-03", Active: 167, Inactive: 120 },
    { date: "2024-04-04", Active: 242, Inactive: 260 },
    { date: "2024-04-05", Active: 373, Inactive: 290 },
    { date: "2024-04-06", Active: 301, Inactive: 340 },
    { date: "2024-04-07", Active: 245, Inactive: 180 },
    { date: "2024-04-08", Active: 409, Inactive: 320 },
    { date: "2024-04-09", Active: 59, Inactive: 110 },
    { date: "2024-04-10", Active: 261, Inactive: 190 },
    { date: "2024-04-11", Active: 327, Inactive: 350 },
    { date: "2024-04-12", Active: 292, Inactive: 210 },
    { date: "2024-04-13", Active: 342, Inactive: 380 },
    { date: "2024-04-14", Active: 137, Inactive: 220 },
    { date: "2024-04-15", Active: 120, Inactive: 170 },
    { date: "2024-04-16", Active: 138, Inactive: 190 },
    { date: "2024-04-17", Active: 446, Inactive: 360 },
    { date: "2024-04-18", Active: 364, Inactive: 410 },
    { date: "2024-04-19", Active: 243, Inactive: 180 },
    { date: "2024-04-20", Active: 89, Inactive: 150 },
    { date: "2024-04-21", Active: 137, Inactive: 200 },
    { date: "2024-04-22", Active: 224, Inactive: 170 },
    { date: "2024-04-23", Active: 138, Inactive: 230 },
    { date: "2024-04-24", Active: 387, Inactive: 290 },
    { date: "2024-04-25", Active: 215, Inactive: 250 },
    { date: "2024-04-26", Active: 75, Inactive: 130 },
    { date: "2024-04-27", Active: 383, Inactive: 420 },
    { date: "2024-04-28", Active: 122, Inactive: 180 },
    { date: "2024-04-29", Active: 315, Inactive: 240 },
    { date: "2024-04-30", Active: 454, Inactive: 380 },
    { date: "2024-05-01", Active: 165, Inactive: 220 },
    { date: "2024-05-02", Active: 293, Inactive: 310 },
    { date: "2024-05-03", Active: 247, Inactive: 190 },
    { date: "2024-05-04", Active: 385, Inactive: 420 },
    { date: "2024-05-05", Active: 481, Inactive: 390 },
    { date: "2024-05-06", Active: 498, Inactive: 520 },
    { date: "2024-05-07", Active: 388, Inactive: 300 },
    { date: "2024-05-08", Active: 149, Inactive: 210 },
    { date: "2024-05-09", Active: 227, Inactive: 180 },
    { date: "2024-05-10", Active: 293, Inactive: 330 },
    { date: "2024-05-11", Active: 335, Inactive: 270 },
    { date: "2024-05-12", Active: 197, Inactive: 240 },
    { date: "2024-05-13", Active: 197, Inactive: 160 },
    { date: "2024-05-14", Active: 448, Inactive: 490 },
    { date: "2024-05-15", Active: 473, Inactive: 380 },
    { date: "2024-05-16", Active: 338, Inactive: 400 },
    { date: "2024-05-17", Active: 499, Inactive: 420 },
    { date: "2024-05-18", Active: 315, Inactive: 350 },
    { date: "2024-05-19", Active: 235, Inactive: 180 },
    { date: "2024-05-20", Active: 177, Inactive: 230 },
    { date: "2024-05-21", Active: 82, Inactive: 140 },
    { date: "2024-05-22", Active: 81, Inactive: 120 },
    { date: "2024-05-23", Active: 252, Inactive: 290 },
    { date: "2024-05-24", Active: 294, Inactive: 220 },
    { date: "2024-05-25", Active: 201, Inactive: 250 },
    { date: "2024-05-26", Active: 213, Inactive: 170 },
]

const chartConfig = {
    views: {
        label: "Page Views",
    },
    Inactive: {
        label: "Inactive",
        color: "#dc2626",
    },
    Active: {
        label: "Active",
        color: "#06b6d4",
    },
}

export function BarChartInterActive() {
    const [activeChart, setActiveChart] =
        React.useState("Active")

    const total = React.useMemo(
        () => ({
            Active: chartData.reduce((acc, curr) => acc + curr.Active, 0),
            Inactive: chartData.reduce((acc, curr) => acc + curr.Inactive, 0),
        }),
        []
    )

    return (
        <div className="w-full border-none rounded-2xl">
            <Card className="w-full border-none dark:bg-gray-800 rounded-2xl">
                <CardHeader className="flex flex-col items-stretch space-y-0 border-b border-gray-200 dark:border-gray-400 p-0 sm:flex-row">
                    <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                        <CardDescription>
                            Showing average member attendance in months
                        </CardDescription>
                    </div>
                    <div className="flex dark:border-gray-400 dark:bg-gray-600">
                        {["Inactive", "Active"].map((key) => {
                            const chart = key
                            return (
                                <button
                                    key={chart}
                                    data-active={activeChart === chart}
                                    className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                                    onClick={() => setActiveChart(chart)}
                                >
                                    <span className="text-xs text-muted-foreground dark:text-gray-400">
                                        {chartConfig[chart].label}
                                    </span>
                                    <span className="text-lg font-bold leading-none sm:text-3xl">
                                        {total[key].toLocaleString()}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </CardHeader>
                <CardContent className="px-2 sm:p-6">
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[250px] w-full"
                    >
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => {
                                    const date = new Date(value)
                                    return date.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })
                                }}
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        className="w-[150px]"
                                        nameKey="views"
                                        labelFormatter={(value) => {
                                            return new Date(value).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })
                                        }}
                                    />
                                }
                            />
                            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}
