"use client"

import Pagination from "@/components/ui/CustomPagination";
import { Users, DollarSign, Calendar, CreditCard, Mail, User, Hash, Clock } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUser } from "@/components/Providers/LoggedInUserProvider";

const NewMemberRevenue = ({
    data,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
}) => {
    const { user } = useUser();
    const loggedInUser = user?.user;

    // Fetch all membership plans upfront
    const { data: membershipPlans, isLoading: isLoadingPlans } = useQuery({
        queryKey: ['membershipPlans'],
        queryFn: async () => {
            try {
                const response = await fetch('http://localhost:3000/api/membershipplans/by-org');
                if (!response.ok) throw new Error('Failed to fetch plans');
                const resbody = await response.json();
                return resbody?.membershipPlans;
            } catch (error) {
                toast.error(error.message || 'Failed to load membership plans');
                return [];
            }
        },
        staleTime: 60 * 1000
    });

    // Get membership name by ID
    const getMembershipName = (id) => {
        if (!id || !membershipPlans) return 'Unknown';
        const plan = membershipPlans.find(plan => plan._id.toString() === id.toString());
        return plan?.planName || 'Unknown';
    };

    // Get latest member
    const getLatestMember = () => {
        if (!data?.members || data.members.length === 0) return 'No new members';
        const latest = data.members.reduce((prev, current) =>
            new Date(prev.membershipRenewDate) > new Date(current.membershipRenewDate) ? prev : current
        );
        return latest.fullName;
    };

    // Enhanced loading skeleton for cards
    const CardSkeleton = () => (
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 shadow-lg backdrop-blur-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                </div>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-20 mb-1" />
            </CardContent>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-pulse" />
        </Card>
    );

    return (
        <div className="w-full space-y-4 p-1">
            {/* Enhanced Summary Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                {isLoading ? (
                    <>
                        <CardSkeleton />
                        <CardSkeleton />
                        <CardSkeleton />
                    </>
                ) : (
                    <>
                        {/* New Members Card */}
                        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <CardHeader className="pb-3 relative">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                                        New Members
                                    </CardTitle>
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                        <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="relative">
                                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                    {data?.members?.length || 0}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    This month
                                </div>
                            </CardContent>
                        </Card>

                        {/* Total Revenue Card */}
                        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <CardHeader className="pb-3 relative">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                                        Total Revenue
                                    </CardTitle>
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                        <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="relative">
                                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                    {loggedInUser?.organization?.currency || 'N/A'} {data?.totalRevenue || 0}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    From new members
                                </div>
                            </CardContent>
                        </Card>

                        {/* Latest Member Card */}
                        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <CardHeader className="pb-3 relative">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                                        Latest Member
                                    </CardTitle>
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                        <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="relative">
                                <div className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate">
                                    {getLatestMember()}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Most recent signup
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            {/* Enhanced Members Table */}
            <Card className="border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                            <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                                New Members
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">
                                Recently joined members with payment details
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading || isLoadingPlans ? (
                        <div className="p-6 space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center space-x-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-48" />
                                    </div>
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-6 w-16" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-50/70 dark:hover:bg-gray-800/70">
                                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <Hash className="h-4 w-4" />
                                                ID
                                            </div>
                                        </TableHead>
                                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                Member
                                            </div>
                                        </TableHead>
                                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 hidden md:table-cell">
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4" />
                                                Email
                                            </div>
                                        </TableHead>
                                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Date
                                            </div>
                                        </TableHead>
                                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Plan</TableHead>
                                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Discount</TableHead>
                                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Amount</TableHead>
                                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <CreditCard className="h-4 w-4" />
                                                Method
                                            </div>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Array.isArray(data?.members) && data?.members?.length >= 1 ? (
                                        data?.members?.map((member, index) => (
                                            <TableRow
                                                key={member?._id}
                                                className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700"
                                            >
                                                <TableCell className="font-mono text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs">
                                                        #{member?._id?.slice(-6)}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                                            {member?.fullName?.charAt(0)?.toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                                {member?.fullName}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400 md:hidden">
                                                                {member?.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell text-gray-600 dark:text-gray-400">
                                                    {member?.email}
                                                </TableCell>
                                                <TableCell className="text-gray-600 dark:text-gray-400">
                                                    {new Date(member?.membershipRenewDate).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 font-medium"
                                                    >
                                                        {getMembershipName(member?.membership)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {member?.discountAmmount ? (
                                                        <span className="text-red-600 dark:text-red-400 font-medium">
                                                            {loggedInUser?.organization?.currency || 'N/A'} -{member.discountAmmount}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-600 dark:text-gray-300 text-sm">None</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-bold text-gray-900 dark:text-white">
                                                    {loggedInUser?.organization?.currency || 'N/A'} {member?.paidAmmount}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 font-medium"
                                                    >
                                                        {member?.paymentMethod}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="h-32 text-center">
                                                <div className="flex flex-col items-center justify-center gap-3 text-gray-500 dark:text-gray-400">
                                                    <Users className="h-12 w-12 opacity-50" />
                                                    <div>
                                                        <p className="font-medium">No members found</p>
                                                        <p className="text-sm">New members will appear here when they join</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                                {Array.isArray(data?.members) && data?.members.length >= 1 && (
                                    <TableFooter>
                                        <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600">
                                            <TableCell colSpan={6} className="font-semibold text-gray-700 dark:text-gray-300">
                                                Total Revenue
                                            </TableCell>
                                            <TableCell colSpan={2} className="text-right font-bold text-lg text-gray-900 dark:text-white">
                                                {loggedInUser?.organization?.currency || 'N/A'} {data?.totalRevenue || 0}
                                            </TableCell>
                                        </TableRow>
                                    </TableFooter>
                                )}
                            </Table>
                        </div>
                    )}
                    <div className="w-full flex justify-end my-2">
                        <Pagination
                            total={totalPages}
                            page={currentPage}
                            onChange={setCurrentPage}
                        />
                    </div>
                </CardContent>
                <CardFooter className="bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 py-3">
                    <div className="flex items-center justify-between w-full text-xs text-gray-500 dark:text-gray-400">
                        <span>Updated just now</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Live data</span>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default NewMemberRevenue;