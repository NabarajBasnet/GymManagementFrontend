"use client"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
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
} from "@/components/ui/chart";

const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 200, mobile: 200 },
    { month: "March", desktop: 198, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 185, mobile: 130 },
    { month: "June", desktop: 175, mobile: 140 },
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 130 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 120, mobile: 130 },
    { month: "June", desktop: 180, mobile: 140 },
];

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
}

export function BodyMeasurementChartBySelectedValue() {
    return (
        <div>
            <Card className='p-0'>
                <CardHeader className='mb-2'>

                    <div className="md:flex items-center justify-between">
                        <div className="w-full">
                            <CardTitle className='font-bold'>Measurement Chart</CardTitle>
                            <CardDescription>
                                Showing body measurement on chart
                            </CardDescription>
                        </div>

                        {/* Select Data Group */}
                        <div className="w-full flex justify-center">
                            <Select className='w-full my-3 md:my-0 md:w-4/12 rounded-sm'>
                                <SelectTrigger className="w-full rounded-sm">
                                    <SelectValue placeholder="Select field" />
                                </SelectTrigger>
                                <SelectContent className='rounded-sm'>
                                    <SelectGroup>
                                        <SelectLabel>Select</SelectLabel>
                                        <SelectItem value="Weight">Weight</SelectItem>
                                        <SelectItem value="Chest">Chest</SelectItem>
                                        <SelectItem value="Upper Arm">Upper Arm</SelectItem>
                                        <SelectItem value="Fore Arm">Fore Arm</SelectItem>
                                        <SelectItem value="Waist">Waist</SelectItem>
                                        <SelectItem value="Thigh">Thigh</SelectItem>
                                        <SelectItem value="Calf">Calf</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full">
                            <TabsContent value="charts" className="mt-0">
                                <div className="space-y-6">
                                    <div className="flex justify-start md:justify-end">
                                        <Tabs>
                                            <TabsList>
                                                <TabsTrigger value="month">1 Month</TabsTrigger>
                                                <TabsTrigger value="quarter">3 Months</TabsTrigger>
                                                <TabsTrigger value="all">All Time</TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>
                                </div>
                            </TabsContent>
                        </div>
                    </div>

                </CardHeader>
                <CardContent className='p-0 mt-2 pt-2'>
                    <ChartContainer config={chartConfig}>
                        <AreaChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 2,
                                right: 2,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={1}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <defs>
                                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="0%"
                                        stopColor="var(--color-mobile)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="var(--color-mobile)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>
                            <Area
                                dataKey="mobile"
                                type="natural"
                                fill="url(#fillMobile)"
                                fillOpacity={0.4}
                                stroke="var(--color-mobile)"
                                stackId="a"
                            />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter>
                </CardFooter>
            </Card>
        </div>
    );
};
