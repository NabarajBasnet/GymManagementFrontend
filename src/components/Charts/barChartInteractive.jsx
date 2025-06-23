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
import { useQuery } from "@tanstack/react-query";

const chartConfig = {
    attendance: {
        label: "Attendance",
        color: "#06b6d4",
    },
}

export function BarChartInterActive() {
    const getMemberAttendance = async () => {
        try {
            const response = await fetch("http://88.198.112.156:3100/api/graphdata/memberattendance")
            if (!response.ok) throw new Error("Network response was not ok")
            const data = await response.json()
            return data.memberAttendance || []
        } catch (error) {
            console.error("Error fetching attendance data:", error)
            return []
        }
    }

    const { data: attendanceData = [], isLoading } = useQuery({
        queryKey: ["memberAttendance"],
        queryFn: getMemberAttendance,
    })

    // Transform data for chart
    const transformData = React.useCallback(() => {
        if (!Array.isArray(attendanceData)) return []
        return attendanceData.map(item => ({
            date: item.date,
            attendance: item.attendanceCount
        }))
    }, [attendanceData])

    const chartData = transformData()

    return (
        <div className="w-full border-none rounded-2xl">
            <Card className="w-full border-none dark:bg-gray-800 rounded-2xl">
                <CardHeader className="flex flex-col items-stretch space-y-0 border-b border-gray-200 dark:border-gray-400 p-0 sm:flex-row">
                    <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                        <CardTitle>Member Attendance</CardTitle>
                        <CardDescription>
                            Daily attendance records
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="px-2 sm:p-6">
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[250px] w-full"
                    >
                        <BarChart
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
                                    try {
                                        const date = new Date(value)
                                        return date.toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    } catch {
                                        return ""
                                    }
                                }}
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        className="w-[150px]"
                                        labelFormatter={(value) => {
                                            try {
                                                return new Date(value).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })
                                            } catch {
                                                return "Invalid date"
                                            }
                                        }}
                                    />
                                }
                            />
                            <Bar 
                                dataKey="attendance" 
                                fill="#06b6d4"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}
