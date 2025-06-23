"use client"

import { useQuery } from "@tanstack/react-query";
import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

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

export const description = "A pie chart with stacked sections"

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
  },
  mobile: {
    label: "Mobile",
  },
  january: {
    label: "January",
    color: "var(--chart-1)",
  },
  february: {
    label: "February",
    color: "var(--chart-2)",
  },
  march: {
    label: "March",
    color: "var(--chart-3)",
  },
  april: {
    label: "April",
    color: "var(--chart-4)",
  },
  may: {
    label: "May",
    color: "var(--chart-5)",
  },
}

const ChartPieStacked = () => {
  const getMemberAttendance = async () => {
    try {
        const response = await fetch("http://88.198.112.156:3100/api/graphdata/memberattendance")
        if (!response.ok) throw new Error("Network response was not ok")
        const data = await response.json()
        return data;
    } catch (error) {
        console.error("Error fetching attendance data:", error)
        return []
    }
  }
  
  const { data: attendancesData } = useQuery({
    queryKey: ["memberAttendance"],
    queryFn: getMemberAttendance,
  })
  
  const {memberAttendance, growthPercentage} = attendancesData || {};

  // More deterministic color assignment
  const getColorForDate = (date) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#FF9F1C', '#2EC4B6', '#E71D36'];
    // Use the date to determine the color index
    const dateNum = new Date(date).getDate();
    return colors[dateNum % colors.length];
  };
    
  const transformedData = React.useMemo(() => {
    if (!memberAttendance) return [];
    
    return memberAttendance.map(attendance => ({
      date: new Date(attendance.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      attendanceCount: attendance.attendanceCount,
      fill: getColorForDate(attendance.date)
    }));
  }, [memberAttendance]);

  return (
    <Card className="flex flex-col w-full dark:border-none dark:bg-gray-800">
      <CardHeader className="items-center pb-0">
        <CardTitle>Member Attendance</CardTitle>
        <CardDescription>Daily Attendance Overview</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelKey="attendanceCount"
                  nameKey="date"
                  indicator="line"
                  labelFormatter={(_, payload) => {
                    return `${payload?.[0].payload.date}: ${payload?.[0].value} members`
                  }}
                />
              }
            />
            <Pie 
              data={transformedData} 
              dataKey="attendanceCount" 
              nameKey="date"
              outerRadius={80}
              label={({ date, attendanceCount }) => `${date}`}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Growth: {growthPercentage}% <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing daily member attendance
        </div>
      </CardFooter>
    </Card>
  )
}

export default ChartPieStacked;