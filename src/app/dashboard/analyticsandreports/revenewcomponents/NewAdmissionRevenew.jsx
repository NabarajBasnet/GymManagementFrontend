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

export const description = "A line chart"

const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
};
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useQuery } from "@tanstack/react-query"
import Loader from "@/components/Loader/Loader"

const invoices = [
    {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV004",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV005",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV006",
        paymentStatus: "Pending",
        totalAmount: "$200.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV007",
        paymentStatus: "Unpaid",
        totalAmount: "$300.00",
        paymentMethod: "Credit Card",
    },
]


const NewMemberRevenew = ({ data, isLoading }) => {

    const { count, members, totalRevenue } = data?.data || {};
    console.log(data)
    console.log('Members: ', members);

    return (
        <div className="w-full">
            <div className="w-full md:flex">
                <div className="w-full">
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <Table>
                            <TableCaption>A list of new members.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="">Id</TableHead>
                                    <TableHead>Full Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Payment Date</TableHead>
                                    <TableHead>Membership</TableHead>
                                    <TableHead>Discount</TableHead>
                                    <TableHead>Total Paid</TableHead>
                                    <TableHead>Payment Method</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.isArray(data?.members) && data?.members?.length >= 1 ? (
                                    <>
                                        {data?.members?.map((member) => (
                                            <TableRow key={member?._id}>
                                                <TableCell className="font-medium">{member?._id}</TableCell>
                                                <TableCell className="font-medium">{member?.fullName}</TableCell>
                                                <TableCell className="font-medium">{member?.email}</TableCell>
                                                <TableCell className="font-medium">{new Date(member?.membershipRenewDate).toISOString().split('T')[0]}</TableCell>
                                                <TableCell className="font-medium">{member?.membership}</TableCell>
                                                <TableCell>{member?.discountAmmount}</TableCell>
                                                <TableCell>{member?.paidAmmount}</TableCell>
                                                <TableCell className="text-right">{member?.paymentMethod}</TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-gray-500">
                                                No members found.
                                            </TableCell>
                                        </TableRow>
                                    </>
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={3}>Total</TableCell>
                                    <TableCell className="text-right">$2,500.00</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    )}
                </div>
            </div>
        </div>
    )
}

export default NewMemberRevenew;
