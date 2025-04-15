"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
const chartData = [
    { date: "2024-04-01", new_admission: 222, renewal: 150 },
    { date: "2024-04-02", new_admission: 97, renewal: 180 },
    { date: "2024-04-03", new_admission: 167, renewal: 120 },
    { date: "2024-04-04", new_admission: 242, renewal: 260 },
    { date: "2024-04-05", new_admission: 373, renewal: 290 },
    { date: "2024-04-06", new_admission: 301, renewal: 340 },
    { date: "2024-04-07", new_admission: 245, renewal: 180 },
    { date: "2024-04-08", new_admission: 409, renewal: 320 },
    { date: "2024-04-09", new_admission: 59, renewal: 110 },
    { date: "2024-04-10", new_admission: 261, renewal: 190 },
    { date: "2024-04-11", new_admission: 327, renewal: 350 },
    { date: "2024-04-12", new_admission: 292, renewal: 210 },
    { date: "2024-04-13", new_admission: 342, renewal: 380 },
    { date: "2024-04-14", new_admission: 137, renewal: 220 },
    { date: "2024-04-15", new_admission: 120, renewal: 170 },
    { date: "2024-04-16", new_admission: 138, renewal: 190 },
    { date: "2024-04-17", new_admission: 446, renewal: 360 },
    { date: "2024-04-18", new_admission: 364, renewal: 410 },
    { date: "2024-04-19", new_admission: 243, renewal: 180 },
    { date: "2024-04-20", new_admission: 89, renewal: 150 },
    { date: "2024-04-21", new_admission: 137, renewal: 200 },
    { date: "2024-04-22", new_admission: 224, renewal: 170 },
    { date: "2024-04-23", new_admission: 138, renewal: 230 },
    { date: "2024-04-24", new_admission: 387, renewal: 290 },
    { date: "2024-04-25", new_admission: 215, renewal: 250 },
    { date: "2024-04-26", new_admission: 75, renewal: 130 },
    { date: "2024-04-27", new_admission: 383, renewal: 420 },
    { date: "2024-04-28", new_admission: 122, renewal: 180 },
    { date: "2024-04-29", new_admission: 315, renewal: 240 },
    { date: "2024-04-30", new_admission: 454, renewal: 380 },
    { date: "2024-05-01", new_admission: 165, renewal: 220 },
    { date: "2024-05-02", new_admission: 293, renewal: 310 },
    { date: "2024-05-03", new_admission: 247, renewal: 190 },
    { date: "2024-05-04", new_admission: 385, renewal: 420 },
    { date: "2024-05-05", new_admission: 481, renewal: 390 },
    { date: "2024-05-06", new_admission: 498, renewal: 520 },
    { date: "2024-05-07", new_admission: 388, renewal: 300 },
    { date: "2024-05-08", new_admission: 149, renewal: 210 },
    { date: "2024-05-09", new_admission: 227, renewal: 180 },
    { date: "2024-05-10", new_admission: 293, renewal: 330 },
    { date: "2024-05-11", new_admission: 335, renewal: 270 },
    { date: "2024-05-12", new_admission: 197, renewal: 240 },
    { date: "2024-05-13", new_admission: 197, renewal: 160 },
    { date: "2024-05-14", new_admission: 448, renewal: 490 },
    { date: "2024-05-15", new_admission: 473, renewal: 380 },
    { date: "2024-05-16", new_admission: 338, renewal: 400 },
    { date: "2024-05-17", new_admission: 499, renewal: 420 },
    { date: "2024-05-18", new_admission: 315, renewal: 350 },
    { date: "2024-05-19", new_admission: 235, renewal: 180 },
    { date: "2024-05-20", new_admission: 177, renewal: 230 },
    { date: "2024-05-21", new_admission: 82, renewal: 140 },
    { date: "2024-05-22", new_admission: 81, renewal: 120 },
    { date: "2024-05-23", new_admission: 252, renewal: 290 },
    { date: "2024-05-24", new_admission: 294, renewal: 220 },
    { date: "2024-05-25", new_admission: 201, renewal: 250 },
    { date: "2024-05-26", new_admission: 213, renewal: 170 },
    { date: "2024-05-27", new_admission: 420, renewal: 460 },
    { date: "2024-05-28", new_admission: 233, renewal: 190 },
    { date: "2024-05-29", new_admission: 78, renewal: 130 },
    { date: "2024-05-30", new_admission: 340, renewal: 280 },
    { date: "2024-05-31", new_admission: 178, renewal: 230 },
    { date: "2024-06-01", new_admission: 178, renewal: 200 },
    { date: "2024-06-02", new_admission: 470, renewal: 410 },
    { date: "2024-06-03", new_admission: 103, renewal: 160 },
    { date: "2024-06-04", new_admission: 439, renewal: 380 },
    { date: "2024-06-05", new_admission: 88, renewal: 140 },
    { date: "2024-06-06", new_admission: 294, renewal: 250 },
    { date: "2024-06-07", new_admission: 323, renewal: 370 },
    { date: "2024-06-08", new_admission: 385, renewal: 320 },
    { date: "2024-06-09", new_admission: 438, renewal: 480 },
    { date: "2024-06-10", new_admission: 155, renewal: 200 },
    { date: "2024-06-11", new_admission: 92, renewal: 150 },
    { date: "2024-06-12", new_admission: 492, renewal: 420 },
    { date: "2024-06-13", new_admission: 81, renewal: 130 },
    { date: "2024-06-14", new_admission: 426, renewal: 380 },
    { date: "2024-06-15", new_admission: 307, renewal: 350 },
    { date: "2024-06-16", new_admission: 371, renewal: 310 },
    { date: "2024-06-17", new_admission: 475, renewal: 520 },
    { date: "2024-06-18", new_admission: 107, renewal: 170 },
    { date: "2024-06-19", new_admission: 341, renewal: 290 },
    { date: "2024-06-20", new_admission: 408, renewal: 450 },
    { date: "2024-06-21", new_admission: 169, renewal: 210 },
    { date: "2024-06-22", new_admission: 317, renewal: 270 },
    { date: "2024-06-23", new_admission: 480, renewal: 530 },
    { date: "2024-06-24", new_admission: 132, renewal: 180 },
    { date: "2024-06-25", new_admission: 141, renewal: 190 },
    { date: "2024-06-26", new_admission: 434, renewal: 380 },
    { date: "2024-06-27", new_admission: 448, renewal: 490 },
    { date: "2024-06-28", new_admission: 149, renewal: 200 },
    { date: "2024-06-29", new_admission: 103, renewal: 160 },
    { date: "2024-06-30", new_admission: 446, renewal: 400 },
]

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    new_admission: {
        label: "New Admission",
        color: "hsl(var(--chart-1))",
    },
    renewal: {
        label: "Renewal",
        color: "hsl(var(--chart-2))",
    },
}

const AllMembersAreaChart = () => {
    const [timeRange, setTimeRange] = React.useState("90d")

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date)
        const referenceDate = new Date("2024-06-30")
        let daysToSubtract = 90
        if (timeRange === "30d") {
            daysToSubtract = 30
        } else if (timeRange === "7d") {
            daysToSubtract = 7
        }
        const startDate = new Date(referenceDate)
        startDate.setDate(startDate.getDate() - daysToSubtract)
        return date >= startDate
    })

    return (
        <Card>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle className='font-bold'>All Members</CardTitle>
                    <CardDescription>
                        Showing total renewals and new admissions for the last 3 months
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="w-[160px] rounded-lg sm:ml-auto"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            Last 3 months
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="fillnew_admission" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-new_admission)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-new_admission)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillrenewal" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-renewal)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-renewal)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
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
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="renewal"
                            type="natural"
                            fill="url(#fillrenewal)"
                            stroke="var(--color-renewal)"
                            stackId="a"
                        />
                        <Area
                            dataKey="new_admission"
                            type="natural"
                            fill="url(#fillnew_admission)"
                            stroke="var(--color-new_admission)"
                            stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default AllMembersAreaChart;
