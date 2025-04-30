'use client';

import { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { BiLoaderCircle } from "react-icons/bi";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FiSearch, FiCalendar } from "react-icons/fi";
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Pagination from "@/components/ui/CustomPagination";
import Loader from "@/components/Loader/Loader";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { usePagination } from "@/hooks/Pagination";

const MembershipLogs = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [memberName, setMemberName] = useState('');
    const [memberId, setMemberId] = useState('');
    const [renderDropdown, setRenderDropdown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isExporting, setIsExporting] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    const [expandedSnapshots, setExpandedSnapshots] = useState({});
    const tableRef = useRef(null);

    const limit = 10;
    const queryClient = useQueryClient();

    const { control, formState: { errors }, handleSubmit } = useForm();

    const getAllMembers = async () => {
        try {
            const response = await fetch(`gymmanagementbackend-o2l3.onrender.com/api/members`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
            toast.error("Failed to fetch members");
        }
    };

    const { data, isLoading } = useQuery({
        queryKey: ['members'],
        queryFn: getAllMembers
    });

    const { members } = data || {};

    const getMembershipLogs = async ({ queryKey }) => {
        const [, page, memberId, start, end] = queryKey;
        if (!memberId) return null;

        try {
            const dateParams = start && end ? `&startDate=${start}&endDate=${end}` : "";
            const response = await fetch(`gymmanagementbackend-o2l3.onrender.com/api/members/membershiplogs/${memberId}?page=${page}&limit=${limit}${dateParams}`);
            const responseBody = await response.json();
            console.log('Response Body: ', responseBody);
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
            toast.error("Failed to fetch membership logs");
            return null;
        };
    };

    const { data: membershipLogs, isLoading: isLogsLoading, refetch } = useQuery({
        queryKey: ['membershipLogs', currentPage, memberId, startDate, endDate],
        queryFn: getMembershipLogs,
        enabled: !!memberId
    });

    const { totalPages, total, logs } = membershipLogs || { totalPages: 1, total: 0, logs: [] };

    const { range, setPage, active } = usePagination({
        total: totalPages ? totalPages : 1,
        siblings: 1,
        boundaries: 1,
        page: currentPage,
        onChange: (page) => {
            setCurrentPage(page);
        },
    });

    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setRenderDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchRef]);

    const handleSearchFocus = () => {
        setRenderDropdown(true);
    };

    const toggleSnapshotVisibility = (logId) => {
        setExpandedSnapshots(prev => ({
            ...prev,
            [logId]: !prev[logId]
        }));
    };

    const handleDateFilter = () => {
        if (memberId) {
            refetch();
        } else {
            toast.error("Please select a member first");
        }
    };

    const resetFilter = () => {
        if (memberId) {
            setSearchQuery('');
            setMemberId('');
            setMemberName('')
            setStartDate('')
            setEndDate('')
            refetch();
        } else {
            toast.error("Please select a member first");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="w-full bg-gray-50 min-h-screen">
            {/* Loading State */}
            {(isDeleting || isPrinting || isExporting) && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                    <div className="bg-white rounded-lg shadow-2xl p-6 flex items-center space-x-3 max-w-sm w-full mx-4">
                        <BiLoaderCircle className="text-2xl text-blue-600 animate-spin" />
                        <h1 className="text-lg font-medium text-gray-800">
                            {isDeleting ? "Deleting" : isPrinting ? "Generating PDF" : "Exporting Excel"}
                            <span className="animate-pulse">...</span>
                        </h1>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="w-full p-6 bg-white border-b shadow-sm sticky top-0 z-10">
                <Breadcrumb>
                    <BreadcrumbList className="text-sm">
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/" className="text-gray-600 hover:text-blue-600">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
                                    <BreadcrumbEllipsis className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="rounded-lg shadow-lg">
                                    <DropdownMenuItem className="hover:bg-gray-100">Documentation</DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-gray-100">Themes</DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-gray-100">GitHub</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium text-gray-900">Membership Logs</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4">
                    <h1 className="text-2xl font-bold text-gray-900">Membership Logs</h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1400px] mx-auto p-4 md:p-6">
                {/* Search and Filter Form */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Member Search */}
                        <div>
                            <Label className="block text-sm font-medium mb-1.5 text-gray-700">Search Member</Label>
                            <div ref={searchRef} className="relative">
                                <Controller
                                    name="memberName"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                autoComplete="off"
                                                value={searchQuery}
                                                onChange={(e) => {
                                                    setSearchQuery(e.target.value);
                                                    field.onChange(e);
                                                }}
                                                onFocus={handleSearchFocus}
                                                className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm px-4 py-2.5 pl-10"
                                                placeholder="Search members..."
                                            />
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                                <FiSearch className="h-5 w-5" />
                                            </div>
                                        </div>
                                    )}
                                />
                                {errors.memberName && (
                                    <p className="mt-1.5 text-sm font-medium text-red-600">
                                        {errors.memberName.message}
                                    </p>
                                )}

                                {renderDropdown && (
                                    <div className="absolute w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto z-20 top-full left-0 mt-1">
                                        {members?.length > 0 ? (
                                            members
                                                .filter((member) => {
                                                    return member.fullName
                                                        .toLowerCase()
                                                        .includes(searchQuery.toLowerCase());
                                                })
                                                .map((member) => (
                                                    <div
                                                        onClick={() => {
                                                            setMemberName(member.fullName);
                                                            setSearchQuery(member.fullName);
                                                            setMemberId(member._id);
                                                            setRenderDropdown(false);
                                                        }}
                                                        className="px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors"
                                                        key={member._id}
                                                        value={member._id}
                                                    >
                                                        {member.fullName}
                                                    </div>
                                                ))
                                        ) : (
                                            <div className="px-4 py-3 text-sm text-gray-500">No members found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Start Date */}
                        <div>
                            <Label className="block text-sm font-medium mb-1.5 text-gray-700">Start Date</Label>
                            <div className="relative">
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm px-4 py-2.5 pl-10"
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <FiCalendar className="h-5 w-5" />
                                </div>
                            </div>
                        </div>

                        {/* End Date */}
                        <div>
                            <Label className="block text-sm font-medium mb-1.5 text-gray-700">End Date</Label>
                            <div className="relative">
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm px-4 py-2.5 pl-10"
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <FiCalendar className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end space-x-4">
                        <Button
                            onClick={resetFilter}
                            className="bg-red-500 hover:bg-red-600 text-white"
                            disabled={!memberId}
                        >
                            Reset Filters
                        </Button>
                        <Button
                            onClick={handleDateFilter}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={!memberId}
                        >
                            Apply Filters
                        </Button>
                    </div>
                </div>

                {/* Membership Logs Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {isLogsLoading ? (
                        <div className="p-8 flex justify-center">
                            <Loader size="lg" />
                        </div>
                    ) : logs && logs.length > 0 ? (
                        <>
                            <TableContainer component={Paper} className="border-0 shadow-none" ref={tableRef}>
                                <Table sx={{ minWidth: 650 }} aria-label="membership logs table">
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                                            <TableCell className="font-medium text-gray-700">Action Type</TableCell>
                                            <TableCell className="font-medium text-gray-700">Action Date</TableCell>
                                            <TableCell className="font-medium text-gray-700">Action Taker</TableCell>
                                            <TableCell className="font-medium text-gray-700">Reason</TableCell>
                                            <TableCell className="font-medium text-gray-700">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {logs.map((log) => (
                                            <>
                                                <TableRow key={log._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell component="th" scope="row">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${log.actionType === 'Renewed' ? 'bg-green-100 text-green-800' :
                                                            log.actionType === 'Resume' ? 'bg-blue-100 text-blue-800' :
                                                                log.actionType === 'Freeze' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {log.actionType}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>{formatDate(log.actionDate)}</TableCell>
                                                    <TableCell>{log.actionTaker}</TableCell>
                                                    <TableCell>{log.reason || "N/A"}</TableCell>
                                                    <TableCell>
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        onClick={() => toggleSnapshotVisibility(log._id)}
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="text-gray-600 hover:text-blue-600"
                                                                    >
                                                                        {expandedSnapshots[log._id] ? (
                                                                            <MdVisibilityOff className="h-5 w-5" />
                                                                        ) : (
                                                                            <MdVisibility className="h-5 w-5" />
                                                                        )}
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    {expandedSnapshots[log._id] ? "Hide Snapshot" : "View Snapshot"}
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </TableCell>
                                                </TableRow>
                                                {expandedSnapshots[log._id] && log.snapshot && (
                                                    <TableRow className="bg-gray-50">
                                                        <TableCell colSpan={5} className="p-4">
                                                            <div className="border border-gray-200 rounded-lg p-4 bg-white">
                                                                <h4 className="text-sm font-medium text-gray-900 mb-3">Membership Snapshot</h4>
                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                    <div>
                                                                        <p className="text-xs font-medium text-gray-500 mb-1">Membership Type</p>
                                                                        <p className="text-sm text-gray-800">{log.snapshot.membershipType || "N/A"}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-medium text-gray-500 mb-1">Membership Duration</p>
                                                                        <p className="text-sm text-gray-800">{log.snapshot.membershipDuration || "N/A"}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-medium text-gray-500 mb-1">Shift</p>
                                                                        <p className="text-sm text-gray-800">{log.snapshot.membershipShift || "N/A"}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-medium text-gray-500 mb-1">Membership Date</p>
                                                                        <p className="text-sm text-gray-800">{formatDate(log.snapshot.membershipDate)}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-medium text-gray-500 mb-1">Renew Date</p>
                                                                        <p className="text-sm text-gray-800">{formatDate(log.snapshot.membershipRenewDate)}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-medium text-gray-500 mb-1">Expire Date</p>
                                                                        <p className="text-sm text-gray-800">{formatDate(log.snapshot.membershipExpireDate)}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-medium text-gray-500 mb-1">Final Amount</p>
                                                                        <p className="text-sm text-gray-800">₹{log.snapshot.finalAmmount?.toLocaleString() || "N/A"}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-medium text-gray-500 mb-1">Paid Amount</p>
                                                                        <p className="text-sm text-gray-800">₹{log.snapshot.paidAmmount?.toLocaleString() || "N/A"}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-medium text-gray-500 mb-1">Due Amount</p>
                                                                        <p className="text-sm text-gray-800">₹{log.snapshot.dueAmmount?.toLocaleString() || "N/A"}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-medium text-gray-500 mb-1">Discount Amount</p>
                                                                        <p className="text-sm text-gray-800">
                                                                            {log.snapshot.discountAmmount ? `₹${log.snapshot.discountAmmount.toLocaleString()}` : "N/A"}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-medium text-gray-500 mb-1">Payment Method</p>
                                                                        <p className="text-sm text-gray-800">{log.snapshot.paymentMethod || "N/A"}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-medium text-gray-500 mb-1">Receipt No</p>
                                                                        <p className="text-sm text-gray-800">{log.snapshot.receiptNo || "N/A"}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-medium text-gray-500 mb-1">Status</p>
                                                                        <p className="text-sm text-gray-800">
                                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${log.snapshot.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                                                log.snapshot.status === 'Expired' ? 'bg-red-100 text-red-800' :
                                                                                    log.snapshot.status === 'Frozen' ? 'bg-blue-100 text-blue-800' :
                                                                                        'bg-gray-100 text-gray-800'
                                                                                }`}>
                                                                                {log.snapshot.status}
                                                                            </span>
                                                                        </p>
                                                                    </div>
                                                                    {log.snapshot.discountReason && (
                                                                        <div className="md:col-span-3">
                                                                            <p className="text-xs font-medium text-gray-500 mb-1">Discount Reason</p>
                                                                            <p className="text-sm text-gray-800">{log.snapshot.discountReason}</p>
                                                                        </div>
                                                                    )}
                                                                    {log.snapshot.remark && (
                                                                        <div className="md:col-span-3">
                                                                            <p className="text-xs font-medium text-gray-500 mb-1">Remark</p>
                                                                            <p className="text-sm text-gray-800">{log.snapshot.remark}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    ) : memberId ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500">No membership logs found for this member.</p>
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <p className="text-gray-500">Please select a member to view their membership logs.</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex bg-white mx-6 mb-6 shadow-md rounded-md px-4 justify-end py-4">
                <Pagination
                    total={totalPages || 1}
                    page={currentPage || 1}
                    onChange={setCurrentPage}
                    withEdges={true}
                    siblings={1}
                    boundaries={1}
                    classNames={{
                        item: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 relative inline-flex items-center px-4 py-2 text-sm font-medium",
                        active: "z-10 bg-blue-600 border-blue-600 text-white hover:bg-blue-700",
                        dots: "relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                    }}
                />
            </div>
        </div>
    );
};

export default MembershipLogs;
