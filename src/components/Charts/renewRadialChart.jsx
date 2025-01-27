"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { MdEmail, MdClose } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useUser } from '@/components/Providers/LoggedInUserProvider.jsx';
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Pagination from "../ui/CustomPagination";
import { useRouter } from "next/navigation";
import { usePagination } from "@/hooks/Pagination";
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
];

import { TrendingUp } from "lucide-react";
import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
const chartData = [
    { browser: "safari", visitors: 200, fill: "#10b981" },
];

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    safari: {
        label: "Safari",
        color: "#10b981",
    },
};

export function RenewRadialChart() {

    const router = useRouter();
    const { user, loading } = useUser();

    const [currentPage, setCurrentPage] = useState(1);
    const limit = 3;
    const [startDate, setStartDate] = useState(() => {
        const startDate = new Date();
        const calculatedStartYear = startDate.getFullYear();
        startDate.setFullYear(calculatedStartYear, 0, 1);
        return startDate;
    });

    const [endDate, setEndDate] = useState(new Date());

    const getTotalMembers = async () => {
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/members?startDate=${startDate}&endDate=${endDate}&limit=${limit}&page=${currentPage}`);
            const responseBody = await response.json();
            if (responseBody.redirect) {
                router.push(responseBody.redirect);
            };
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const { data } = useQuery({
        queryKey: ['membersLength'],
        queryFn: getTotalMembers
    });

    const {
        members,
        totalMembers,
        totalPages,
        inactiveMembers,
        totalActiveMembers,
        totalInactiveMembers,
        dailyAverageActiveMembers,
        renewdMembers,
        renewdMembersLength,
        newAdmissions,
        newAdmissionsLength
    } = data || {};

    console.log('Renew Admission: ', renewdMembers);

    const { range, setPage, active } = usePagination({
        total: totalPages ? totalPages : 1,
        siblings: 1,
        boundaries: 1,
        page: currentPage,
        onChange: (page) => {
            setCurrentPage(page);
        },
    });

    return (
        <div>
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                    <CardTitle className='text-emerald-600'>Target Renews</CardTitle>
                    <CardDescription>January - June 2024</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[250px]"
                    >
                        <RadialBarChart
                            data={chartData}
                            startAngle={0}
                            endAngle={250}
                            innerRadius={80}
                            outerRadius={110}
                        >
                            <PolarGrid
                                gridType="circle"
                                radialLines={false}
                                stroke="none"
                                className="first:fill-muted last:fill-background"
                                polarRadius={[86, 74]}
                            />
                            <RadialBar dataKey="visitors" background cornerRadius={10} />
                            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-emerald-600 text-2xl font-bold"
                                                    >
                                                        {chartData[0].visitors.toLocaleString()} Of {chartData[0].visitors.toLocaleString()}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 24}
                                                        className="fill-muted-foreground"
                                                    >
                                                        Renews
                                                    </tspan>
                                                </text>
                                            )
                                        }
                                    }}
                                />
                            </PolarRadiusAxis>
                        </RadialBarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 font-medium text-emerald-600 leading-none">
                        New admission target reached 5.2% this month <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="leading-none text-muted-foreground">
                        Showing target progress for the last 1 month
                    </div>
                </CardFooter>
            </Card>

            <div className='bg-white rounded-md overflow-x-scroll shadow-md mt-6'>
                <Table className='min-w-full'>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='text-emerald-600'>Member Id</TableHead>
                            <TableHead className='text-emerald-600'>Full Name</TableHead>
                            <TableHead className='text-emerald-600'>Duration</TableHead>
                            <TableHead className='text-emerald-600'>Option</TableHead>
                            <TableHead className='text-emerald-600'>Renew</TableHead>
                            <TableHead className='text-emerald-600'>Type</TableHead>
                            <TableHead className='text-emerald-600'>Expire</TableHead>
                            <TableHead className='text-emerald-600'>Contact No</TableHead>
                            <TableHead className='text-emerald-600'>Shift</TableHead>
                            <TableHead className='text-emerald-600'>Status</TableHead>
                            <TableHead className='text-emerald-600'>Fee</TableHead>
                            <TableHead className='text-emerald-600'>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {renewdMembers && renewdMembers.length > 0 ? (
                            renewdMembers.map((member) => {
                                const textColor =
                                    member.status === 'Active' ? 'text-black' :
                                        member.status === 'OnHold' ? 'text-yellow-600' :
                                            'text-red-500';
                                return (
                                    <TableRow key={member._id} className={textColor}>
                                        <TableCell><p>{member._id}</p></TableCell>
                                        <TableCell>{member.fullName}</TableCell>
                                        <TableCell>{member.membershipDuration}</TableCell>
                                        <TableCell>{member.membershipOption}</TableCell>
                                        <TableCell>{new Date(member.membershipRenewDate).toISOString().split("T")[0]}</TableCell>
                                        <TableCell>{member.membershipType}</TableCell>
                                        <TableCell>{new Date(member.membershipExpireDate).toISOString().split("T")[0]}</TableCell>
                                        <TableCell>{member.contactNo}</TableCell>
                                        <TableCell>{member.membershipShift}</TableCell>
                                        <TableCell>{member.status.charAt(0).toUpperCase() + member.status.slice(1)}</TableCell>
                                        <TableCell>{member.paidAmmount}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center space-x-1">
                                                <Link href={`/dashboard/allmembers/${member._id}`}>
                                                    <FaUserEdit className='cursor-pointer text-lg' />
                                                </Link>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <MdEmail
                                                            className='cursor-pointer text-lg'
                                                        />
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                {`This email will send membership details and QR Code to the ${member.fullName || 'member'}. If you are sure click continue`}
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => sendQrInEmail(member._id)}>Continue</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        {user && user.user.role === 'Gym Admin' ? (
                                                            <></>

                                                        ) : (
                                                            <MdDelete
                                                                className="cursor-pointer text-red-600 text-lg"
                                                            />
                                                        )}
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                {`This action cannot be undone. This will permanently delete ${member.fullName || 'member'}'s  detail
                                                                           and remove data from servers.`}
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => deleteMember(member._id)}>Continue</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow className='bg-emerald-600 text-white'>
                                <TableCell colSpan={13} className="text-center">
                                    No members found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow className='bg-emerald-600 text-white'>
                            <TableCell colSpan={3}>Total Members</TableCell>
                            <TableCell className="text-right">{totalMembers}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
                <div className="py-3">
                    <Pagination
                        total={totalPages || 1}
                        page={currentPage || 1}
                        onChange={setCurrentPage}
                        withEdges={true}
                        siblings={1}
                        boundaries={1}
                    />
                </div>
            </div>
        </div>
    )
};
