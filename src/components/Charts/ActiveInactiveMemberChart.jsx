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
import { useQuery } from "@tanstack/react-query"

const chartConfig = {
  active: {
    label: "Active",
    color: "#06b6d4",
  },
  inactive: {
    label: "Inactive",
    color: "#dc2626",
  },
}

export function ActiveInactiveMemberChart() {
  const [timeRange, setTimeRange] = React.useState("90d")

  const getActiveInactiveMembers = async () => {
    try {
      const response = await fetch("http://88.198.112.156:3100/api/graphdata/activeinactivemembers")
      if (!response.ok) throw new Error("Network response was not ok")
      const data = await response.json()
      return Array.isArray(data?.activeInactiveMembers) ? data.activeInactiveMembers : []
    } catch (error) {
      console.error("Error fetching data:", error)
      return []
    }
  }

  const { data: activeInactiveMembers = [], isLoading } = useQuery({
    queryKey: ["activeinactivemembers"],
    queryFn: getActiveInactiveMembers,
  })

  const transformData = React.useCallback(() => {
    if (!Array.isArray(activeInactiveMembers)) return []
    return activeInactiveMembers.map(item => ({
      date: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : "",
      active: item.activeMembers || 0,
      inactive: item.inactiveMembers || 0
    })).filter(item => item.date)
  }, [activeInactiveMembers])

  const apiData = transformData()
  const hasApiData = apiData.length > 0

  const filteredData = React.useMemo(() => {
    if (!apiData.length) return []
    
    const referenceDate = new Date()
    let daysToSubtract = 90
    
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    
    return apiData.filter(item => {
      try {
        const date = new Date(item.date)
        return date >= startDate
      } catch {
        return false
      }
    })
  }, [apiData, timeRange])

  return (
    <Card className="pt-0 border dark:border-none rounded-2xl dark:bg-gray-800 shadow-lg">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Active and Inactive Members</CardTitle>
          <CardDescription>
            {hasApiData ? "Real-time" : "Sample"} data for the last {timeRange === "7d" ? "week" : timeRange === "30d" ? "month" : "3 months"}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex dark:bg-gray-900 dark:border-none">
            <SelectValue placeholder={`Last ${timeRange === "7d" ? "week" : timeRange === "30d" ? "month" : "3 months"}`} />
          </SelectTrigger>
          <SelectContent className="rounded-xl dark:bg-gray-900 dark:border-none">
            <SelectItem value="90d" className="dark:text-white cursor-pointer">Last 3 months</SelectItem>
            <SelectItem value="30d" className="dark:text-white cursor-pointer">Last 30 days</SelectItem>
            <SelectItem value="7d" className="dark:text-white cursor-pointer">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillActive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillInactive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1} />
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
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    try {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    } catch {
                      return "Invalid date"
                    }
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="inactive"
              type="natural"
              fill="url(#fillInactive)"
              stroke="#dc2626"
              stackId="a"
            />
            <Area
              dataKey="active"
              type="natural"
              fill="url(#fillActive)"
              stroke="#06b6d4"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}