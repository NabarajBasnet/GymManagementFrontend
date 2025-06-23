"use client";

import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
};

const AllMembersAreaChart = () => {

  const getNewMembers = async () => {
    try {
        const response = await fetch(`http://88.198.112.156:8000/api/graphdata/newmembers`);
        const data = await response.json();
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
          const response = await fetch(`http://88.198.112.156:8000/api/graphdata/renewedmembers`);
          const data = await response.json();
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

  const [timeRange, setTimeRange] = React.useState("12m");

  // Combine the data from both APIs
  const chartData = React.useMemo(() => {
    if (!newMembers.length && !renewedMembers.length) return [];
    
    // Create a map to combine data by month
    const dataMap = new Map();
    
    // Add new members data
    newMembers.forEach(item => {
      if (item.month && typeof item.value === 'number') {
        dataMap.set(item.month, {
          month: item.month,
          new_admission: item.value,
          renewal: 0
        });
      }
    });
    
    // Add renewed members data
    renewedMembers.forEach(item => {
      if (item.month && typeof item.value === 'number') {
        const existing = dataMap.get(item.month) || { 
          month: item.month, 
          new_admission: 0, 
          renewal: 0 
        };
        existing.renewal = item.value;
        dataMap.set(item.month, existing);
      }
    });
    
    // Convert to array and sort by month order
    const monthOrder = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return Array.from(dataMap.values()).sort((a, b) => {
      return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });
  }, [newMembers, renewedMembers]);

  const filteredData = React.useMemo(() => {
    if (!chartData.length) return [];
    
    const monthOrder = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const currentMonth = new Date().getMonth(); // 0-based index
    let monthsToShow = 12;
    
    if (timeRange === "6m") {
      monthsToShow = 6;
    } else if (timeRange === "3m") {
      monthsToShow = 3;
    }
    
    // Get the months to show based on selection
    const relevantMonths = [];
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      relevantMonths.push(monthOrder[monthIndex]);
    }
    
    return chartData.filter(item => relevantMonths.includes(item.month));
  }, [chartData, timeRange]);

  return (
    <Card className="dark:bg-gray-800 dark:text-gray-300 border-none">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="font-bold">All Members</CardTitle>
          <CardDescription>
            Showing total renewals and new admissions by month
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 12 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="12m" className="rounded-lg">
              Last 12 months
            </SelectItem>
            <SelectItem value="6m" className="rounded-lg">
              Last 6 months
            </SelectItem>
            <SelectItem value="3m" className="rounded-lg">
              Last 3 months
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
              <linearGradient
                id="fillnew_admission"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
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
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                // Show abbreviated month names
                return value.substring(0, 3);
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
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
  );
};

export default AllMembersAreaChart;