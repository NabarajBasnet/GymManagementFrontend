"use client";

import { usePagination } from "@/hooks/Pagination";
import Pagination from "@/components/ui/CustomPagination";
import { FiSearch } from "react-icons/fi";
import { Controller, useForm } from "react-hook-form";
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Printer, FileDown, RotateCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { BodyMeasurementChartBySelectedValue } from "./BodyMeasurementsChart";

const BodyMeasurements = () => {

    const [renderDropdown, setRenderDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [renderMainContents, setRenderMainContents] = useState(false);
    const [measurements, setMeasurements] = useState([]);

    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setMonth(new Date().getMonth() - 3)),
        end: new Date()
    });
    const [loading, setLoading] = useState(true);

    const { control, formState: { errors }, handleSubmit } = useForm();
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(6);
    let totalBodyMeasurements = measurements ? measurements.length : 0;

    const getAllMembers = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/members`);
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

    // Get Body Measurement Details
    const [selectedMemberId, setSelectedMemberId] = useState('');
    const [totalPages, setTotalPages] = useState(null);

    const getBodyMeasurementDetails = async () => {
        setRenderMainContents(true);
        try {
            const response = await fetch(`http://localhost:3000/api/member/bodymeasurements/${selectedMemberId}?page=${currentPage}&limit=${limit}`);
            const responseBody = await response.json();
            if (response.ok) {
                setRenderMainContents(true);
                setMeasurements(responseBody.bodyMeasurements);
                setTotalPages(responseBody.totalPages);
            };
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const { range, setPage, active } = usePagination({
        total: totalPages ? totalPages : 1,
        siblings: 1,
        boundaries: 1,
        page: currentPage,
        onChange: (page) => {
            setCurrentPage(page);
        },
    });

    useEffect(() => {
        if (searchQuery, selectedMemberId) {
            getBodyMeasurementDetails();
        };
    }, [searchQuery, selectedMemberId, currentPage, limit]);

    const startEntry = (currentPage - 1) * limit + 1;
    const endEntry = Math.min(currentPage * limit, totalBodyMeasurements);

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

    const handleResetFilters = () => {
        setRenderMainContents(false);
        setSearchQuery('');
        setSelectedMemberId('');
        setDateRange({
            start: new Date(new Date().setMonth(new Date().getMonth() - 3)),
            end: new Date()
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const handleExport = () => {
        alert('Export functionality would be implemented here');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="body-measurement-tracker w-full p-4">

            <div className="bg-white rounded-sm mb-3 shadow-sm flex items-center py-6 px-1 border">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-1">
                                    <BreadcrumbEllipsis className="h-4 w-4" />
                                </DropdownMenuTrigger>
                            </DropdownMenu>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/docs/components">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Members</BreadcrumbPage>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Body Measurements</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="flex flex-col border px-2 py-2 rounded-sm md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Body Measurement</h1>
                    <p className="text-muted-foreground text-xs font-semibold my-1">Track and analyze body measurements over time</p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={handleResetFilters} title="Reset filters">
                        <RotateCcw className="h-4 w-4" />
                    </Button>

                    <Button variant="outline" className='px-4' size="icon" onClick={handlePrint} title="Print">
                        <Printer className="h-4 w-4" />
                    </Button>

                    <Button variant="outline" className='px-4' size="icon" onClick={handleExport} title="Export data">
                        <FileDown className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div>
                <form>
                    <div className="flex mb-4 flex-col md:flex-row items-start md:items-end gap-4 my-6">
                        {/* Member Search */}
                        <div className="w-full md:w-90">
                            <div ref={searchRef} className="relative">
                                <Controller
                                    name="memberName"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="relative">
                                            <Input
                                                id="member-search"
                                                {...field}
                                                autoComplete="off"
                                                value={searchQuery}
                                                onChange={(e) => {
                                                    setSearchQuery(e.target.value);
                                                    field.onChange(e);
                                                }}
                                                onFocus={handleSearchFocus}
                                                className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm px-4 py-2 pl-10"
                                                placeholder="Type member name..."
                                            />
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                                <FiSearch className="h-4 w-4" />
                                            </div>
                                        </div>
                                    )}
                                />
                                {errors.memberName && (
                                    <p className="mt-1 text-xs text-red-600">
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
                                                            setSearchQuery(member.fullName);
                                                            setRenderDropdown(false);
                                                            setSelectedMemberId(member._id);
                                                        }}
                                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors"
                                                        key={member._id}
                                                        value={member._id}
                                                    >
                                                        {member.fullName}
                                                    </div>
                                                ))
                                        ) : (
                                            <div className="px-4 py-2 text-sm text-gray-500">No members found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Date Range */}
                        <div className="w-full flex flex-col md:flex-row gap-4">
                            <div className="w-full">
                                <Input
                                    id="start-date"
                                    type="date"
                                    className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm px-4 py-2"
                                />
                            </div>

                            <div className="w-full">
                                <Input
                                    id="end-date"
                                    type="date"
                                    className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm px-4 py-2"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="md:w-auto">
                            <Button
                                type="submit"
                                className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                Filter Results
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

            {renderMainContents && (
                <div>
                    <Tabs defaultValue="table" className="mt-6">
                        <div className="flex px-1 rounded-md justify-between items-center mb-4">
                            <TabsList>
                                <TabsTrigger value="table">Data Table</TabsTrigger>
                                <TabsTrigger value="charts">Charts</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="charts" className="mt-0">
                            <Card className='p-0 border-none'>
                                <CardContent className='p-0'>
                                    <BodyMeasurementChartBySelectedValue />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="table" className="mt-0 shadow-lg bg-transparent">
                            <Card className="bg-transparent">
                                <div className="flex items-center gap-2 p-2">
                                    <span className="text-sm font-medium text-gray-600">Show</span>
                                    <select
                                        onChange={(e) => setLimit(Number(e.target.value))}
                                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg px-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    >
                                        <option value="15">15</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value={totalBodyMeasurements}>All</option>
                                    </select>
                                    <span className="text-sm font-medium text-gray-600">Body Measurements</span>
                                    <span className="text-xs text-gray-500 ml-2">(Selected: {limit})</span>
                                </div>
                                <CardContent className="p-6">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Date
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Weight
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Chest
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Waist
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Upper Arm
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Thigh
                                                    </th>
                                                    {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Notes
                                                    </th> */}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {Array.isArray(measurements) && measurements.length > 0 ? (
                                                    measurements.map((measurement) => (
                                                        <tr key={measurement._id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {formatDate(measurement.bodyMeasureDate)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {measurement.weight?.toFixed(1)} kg
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {measurement.chest?.toFixed(1)} cm
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {measurement.waist?.toFixed(1)} cm
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {measurement.upperArm?.toFixed(1)} cm
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {measurement.thigh?.toFixed(1)} cm
                                                            </td>
                                                            {/* <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                                {measurement.notes}
                                                            </td> */}
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                                            No measurements recorded yet
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="w-full border border-0.5 mb-3"></div>

                                    <div className='flex justify-between my-2 items-center'>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Showing <span className="font-medium">{startEntry}</span> to <span className="font-medium">{endEntry}</span> of{' '}
                                                <span className="font-medium">{totalBodyMeasurements}</span> results
                                            </p>
                                        </div>

                                        <div>
                                            <Pagination
                                                total={totalPages || 1}
                                                page={currentPage || 1}
                                                onChange={setCurrentPage}
                                                withEdges={true}
                                                siblings={1}
                                                boundaries={1}
                                                className="flex items-center space-x-1"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            )}
        </div>
    );
};

export default BodyMeasurements;
