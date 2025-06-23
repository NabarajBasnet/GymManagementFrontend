"use client"

import { useQuery } from "@tanstack/react-query"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A line chart showing new member growth"

const chartConfig = {
  newMembers: {
    label: "New Members",
    color: "hsl(var(--chart-1))",
  },
}

const getNewMembersGrowthPercentage = async () => {
  try {
    const response = await fetch(`http://88.198.112.156:8000/api/graphdata/newmembers`)
    const resBody = await response.json()
    return resBody
  } catch (error) {
    console.log("Error: ", error)
    return {
      newMembers: Array(12).fill(0).map((_, i) => ({
        month: new Date(0, i).toLocaleString('default', { month: 'long' }),
        value: 0
      })),
      growthPercentage: 0,
      currentCount: 0,
      previousCount: 0
    }
  }
}

const NewMemberGrowthChart = () => {
  const { data: newMembersGrowthPercentageData } = useQuery({
    queryKey: ['newmembersgrowthpercentage'],
    queryFn: getNewMembersGrowthPercentage
  })

  const { newMembers = [], growthPercentage = 0 } = newMembersGrowthPercentageData || {}

  // Transform the API data to match the expected format
  const chartData = newMembers.map(item => ({
    month: item.month,
    newMembers: item.value
  }))

  // Get the full year range for display
  const year = new Date().getFullYear()
  const dateRange = `January - December ${year}`

  return (
    <Card className="bg-white rounded-lg dark:border-none shadow-xl dark:bg-gray-800 dark:text-white">
      <CardHeader>
        <CardTitle>New Member Growth</CardTitle>
        <CardDescription>{dateRange}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
            width={800} // Increased width to accommodate all 12 months
            height={300}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              interval={0} // Show all months
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="newMembers"
              type="natural"
              stroke={chartConfig.newMembers.color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by {growthPercentage}% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing all new members for {year}
        </div>
      </CardFooter>
    </Card>
  )
}

export default NewMemberGrowthChart