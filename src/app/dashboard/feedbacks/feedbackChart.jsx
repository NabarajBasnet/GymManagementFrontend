"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

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

// Sample data - replace with your actual data
const chartData = [
  { month: "Jan", feedbacks: 186, resolved: 150 },
  { month: "Feb", feedbacks: 305, resolved: 280 },
  { month: "Mar", feedbacks: 237, resolved: 200 },
  { month: "Apr", feedbacks: 273, resolved: 250 },
  { month: "May", feedbacks: 309, resolved: 290 },
  { month: "Jun", feedbacks: 214, resolved: 180 },
]

const chartConfig = {
  feedbacks: {
    label: "Total Feedbacks",
    color: "hsl(var(--chart-1))",
  },
  resolved: {
    label: "Resolved",
    color: "hsl(var(--chart-2))",
  },
}

export function FeedbackChart() {
  // Calculate trend
  const currentMonth = chartData[chartData.length - 1].feedbacks;
  const previousMonth = chartData[chartData.length - 2].feedbacks;
  const trend = ((currentMonth - previousMonth) / previousMonth) * 100;
  const isPositive = trend >= 0;

  return (
    <Card className="dark:bg-gray-800 dark:border-none">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold dark:text-gray-100">Feedback Analytics</CardTitle>
            <CardDescription className="text-sm dark:text-gray-400">
              Last 6 months feedback overview
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(trend).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[400px] w-full p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <defs>
                <linearGradient id="colorFeedbacks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false}
                stroke="var(--gray-200)"
                className="dark:stroke-gray-700"
              />
              <XAxis 
                dataKey="month" 
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                className="dark:text-gray-400"
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                className="dark:text-gray-400"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                labelStyle={{
                  color: 'var(--foreground)',
                  fontWeight: '600',
                }}
              />
              <Line
                type="monotone"
                dataKey="feedbacks"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 4, fill: "#3B82F6" }}
                activeDot={{ r: 6, fill: "#3B82F6" }}
                className="dark:stroke-blue-500"
              />
              <Line
                type="monotone"
                dataKey="resolved"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 4, fill: "#10B981" }}
                activeDot={{ r: 6, fill: "#10B981" }}
                className="dark:stroke-green-500"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 text-sm border-t dark:border-gray-700">
        <div className="flex items-center gap-4 w-full">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="font-medium dark:text-gray-300">Total Feedbacks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="font-medium dark:text-gray-300">Resolved</span>
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing feedback trends and resolution rates
        </div>
      </CardFooter>
    </Card>
  )
}
