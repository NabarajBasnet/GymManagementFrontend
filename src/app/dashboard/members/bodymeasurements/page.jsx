"use client";

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
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from 'date-fns';
import { Line, LineChart, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalendarIcon, Printer, FileDown, RotateCcw, PencilIcon, ChevronDownIcon, ChevronUpIcon, Search, XCircle, ArrowDown, ArrowUp, Minus } from "lucide-react";

const BodyMeasurements = ({ memberId }) => {
    const [measurements, setMeasurements] = useState([]);
    const [selectedMeasurement, setSelectedMeasurement] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setMonth(new Date().getMonth() - 3)),
        end: new Date()
    });
    const [loading, setLoading] = useState(true);
    const [chartPeriod, setChartPeriod] = useState("all");
    const [sortConfig, setSortConfig] = useState({
        key: 'bodyMeasuredate',
        direction: 'desc'
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const itemsPerPage = 5;

    // Form validation schema
    const formSchema = z.object({
        weight: z.preprocess(
            (val) => (val === '' ? undefined : Number(val)),
            z.number().min(0, "Weight must be a positive number").optional()
        ),
        height: z.preprocess(
            (val) => (val === '' ? undefined : Number(val)),
            z.number().min(0, "Height must be a positive number").optional()
        ),
        upperArm: z.preprocess(
            (val) => (val === '' ? undefined : Number(val)),
            z.number().min(0, "Upper arm must be a positive number").optional()
        ),
        foreArm: z.preprocess(
            (val) => (val === '' ? undefined : Number(val)),
            z.number().min(0, "Forearm must be a positive number").optional()
        ),
        chest: z.preprocess(
            (val) => (val === '' ? undefined : Number(val)),
            z.number().min(0, "Chest must be a positive number").optional()
        ),
        waist: z.preprocess(
            (val) => (val === '' ? undefined : Number(val)),
            z.number().min(0, "Waist must be a positive number").optional()
        ),
        thigh: z.preprocess(
            (val) => (val === '' ? undefined : Number(val)),
            z.number().min(0, "Thigh must be a positive number").optional()
        ),
        calf: z.preprocess(
            (val) => (val === '' ? undefined : Number(val)),
            z.number().min(0, "Calf must be a positive number").optional()
        ),
    });

    // Initialize form
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            weight: selectedMeasurement?.weight || "",
            height: selectedMeasurement?.height || "",
            upperArm: selectedMeasurement?.upperArm || "",
            foreArm: selectedMeasurement?.foreArm || "",
            chest: selectedMeasurement?.chest || "",
            waist: selectedMeasurement?.waist || "",
            thigh: selectedMeasurement?.thigh || "",
            calf: selectedMeasurement?.calf || "",
        },
    });

    useEffect(() => {
        const mockData = generateMockData(memberId);
        setTimeout(() => {
            setMeasurements(mockData);
            setLoading(false);
        }, 800);
    }, [memberId]);

    const generateMockData = (memberId) => {
        const mockData = [];
        const now = new Date();

        for (let i = 0; i < 12; i++) {
            const date = new Date(now);
            date.setMonth(now.getMonth() - i);

            const weightBase = 80 - (i * 0.5);
            const armBase = 35 - (i * 0.2);
            const chestBase = 105 - (i * 0.3);
            const waistBase = 85 - (i * 0.4);
            const thighBase = 58 - (i * 0.2);
            const calfBase = 38 - (i * 0.1);

            mockData.push({
                _id: `measurement_${i}`,
                member: memberId,
                bodyMeasuredate: date,
                weight: weightBase + (Math.random() * 1 - 0.5),
                height: 180,
                upperArm: armBase + (Math.random() * 0.5 - 0.25),
                foreArm: 30 - (i * 0.1) + (Math.random() * 0.4 - 0.2),
                chest: chestBase + (Math.random() * 0.8 - 0.4),
                waist: waistBase + (Math.random() * 0.6 - 0.3),
                thigh: thighBase + (Math.random() * 0.6 - 0.3),
                calf: calfBase + (Math.random() * 0.4 - 0.2),
                createdAt: date,
                updatedAt: date
            });
        }

        return mockData.sort((a, b) => new Date(b.bodyMeasuredate) - new Date(a.bodyMeasuredate));
    };

    const handleEditMeasurement = (measurement) => {
        setSelectedMeasurement(measurement);
        setSelectedDate(new Date(measurement.bodyMeasuredate));
        form.reset({
            weight: measurement.weight,
            height: measurement.height,
            upperArm: measurement.upperArm,
            foreArm: measurement.foreArm,
            chest: measurement.chest,
            waist: measurement.waist,
            thigh: measurement.thigh,
            calf: measurement.calf,
        });
        setIsEditing(true);
    };

    const handleSaveMeasurement = (values) => {
        const updatedMeasurement = {
            ...selectedMeasurement,
            ...values,
            bodyMeasuredate: selectedDate,
        };

        Object.keys(updatedMeasurement).forEach(key => {
            if (typeof updatedMeasurement[key] === 'string' && !isNaN(updatedMeasurement[key])) {
                updatedMeasurement[key] = parseFloat(updatedMeasurement[key]);
            }
        });

        if (updatedMeasurement._id) {
            setMeasurements(measurements.map(m =>
                m._id === updatedMeasurement._id ? updatedMeasurement : m
            ));
        } else {
            const newMeasurement = {
                ...updatedMeasurement,
                _id: `measurement_${Date.now()}`,
                member: memberId,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            setMeasurements([newMeasurement, ...measurements]);
        }

        setSelectedMeasurement(null);
        setIsEditing(false);
    };

    const handleAddNew = () => {
        setSelectedMeasurement({
            member: memberId,
            bodyMeasuredate: new Date(),
            weight: 0,
            height: 0,
            upperArm: 0,
            foreArm: 0,
            chest: 0,
            waist: 0,
            thigh: 0,
            calf: 0
        });
        setSelectedDate(new Date());
        form.reset({
            weight: "",
            height: "",
            upperArm: "",
            foreArm: "",
            chest: "",
            waist: "",
            thigh: "",
            calf: "",
        });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setSelectedMeasurement(null);
        setIsEditing(false);
    };

    const handleResetFilters = () => {
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

    const filteredMeasurements = measurements.filter(m => {
        const measureDate = new Date(m.bodyMeasuredate);
        return measureDate >= dateRange.start && measureDate <= dateRange.end;
    });

    const formatDateRange = () => {
        if (dateRange.start && dateRange.end) {
            return `${format(dateRange.start, 'MMM d, yyyy')} - ${format(dateRange.end, 'MMM d, yyyy')}`;
        }
        return 'Select date range';
    };

    // Chart data preparation
    const getFilteredChartData = () => {
        const today = new Date();
        let filtered = [...filteredMeasurements];

        if (chartPeriod === "month") {
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            filtered = filtered.filter(m => new Date(m.bodyMeasuredate) >= monthAgo);
        } else if (chartPeriod === "quarter") {
            const quarterAgo = new Date(today);
            quarterAgo.setMonth(quarterAgo.getMonth() - 3);
            filtered = filtered.filter(m => new Date(m.bodyMeasuredate) >= quarterAgo);
        }

        return filtered
            .sort((a, b) => new Date(a.bodyMeasuredate) - new Date(b.bodyMeasuredate))
            .map(m => ({
                date: format(new Date(m.bodyMeasuredate), 'MMM d'),
                weight: parseFloat(m.weight.toFixed(1)),
                waist: parseFloat(m.waist.toFixed(1)),
                chest: parseFloat(m.chest.toFixed(1)),
                upperArm: parseFloat(m.upperArm.toFixed(1)),
                foreArm: parseFloat(m.foreArm.toFixed(1)),
                thigh: parseFloat(m.thigh.toFixed(1)),
                calf: parseFloat(m.calf.toFixed(1)),
            }));
    };

    const proportionalData = measurements.length > 0 ? [
        { name: 'Chest', value: measurements[0].chest },
        { name: 'Waist', value: measurements[0].waist },
        { name: 'Upper Arm', value: measurements[0].upperArm },
        { name: 'Fore Arm', value: measurements[0].foreArm },
        { name: 'Thigh', value: measurements[0].thigh },
        { name: 'Calf', value: measurements[0].calf },
    ] : [];

    // Table sorting and filtering
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (columnName) => {
        if (sortConfig.key !== columnName) {
            return null;
        }
        return sortConfig.direction === 'asc' ?
            <ChevronUpIcon className="h-4 w-4 inline ml-1" /> :
            <ChevronDownIcon className="h-4 w-4 inline ml-1" />;
    };

    const filterAndSortData = () => {
        const filtered = searchTerm
            ? filteredMeasurements.filter(m =>
                format(new Date(m.bodyMeasuredate), 'MMM d, yyyy').toLowerCase().includes(searchTerm.toLowerCase())
            )
            : filteredMeasurements;

        return [...filtered].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (sortConfig.key === 'bodyMeasuredate') {
                const aDate = new Date(aValue);
                const bDate = new Date(bValue);
                return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
            }

            if (typeof aValue === 'number') {
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            }

            return sortConfig.direction === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        });
    };

    const sortedData = filterAndSortData();
    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const currentItems = sortedData.slice(firstItemIndex, lastItemIndex);
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    // Summary calculations
    const calculateChange = (current, previous, field) => {
        if (!previous) return { value: 0, direction: 'neutral' };

        const diff = current[field] - previous[field];
        const direction = diff === 0 ? 'neutral' : diff < 0 ? 'down' : 'up';

        let effectiveDirection = direction;
        if (field === 'waist') {
            effectiveDirection = direction === 'down' ? 'up' : direction === 'up' ? 'down' : 'neutral';
        }

        return {
            value: Math.abs(diff).toFixed(1),
            direction,
            effectiveDirection
        };
    };

    const renderChangeIndicator = (change) => {
        if (!filteredMeasurements[1]) return null;

        const effectiveClass = change.effectiveDirection === 'up'
            ? 'text-green-500'
            : change.effectiveDirection === 'down'
                ? 'text-red-500'
                : 'text-yellow-500';

        return (
            <div className={`flex items-center gap-1 ${effectiveClass}`}>
                {change.direction === 'up' && <ArrowUp className="h-4 w-4" />}
                {change.direction === 'down' && <ArrowDown className="h-4 w-4" />}
                {change.direction === 'neutral' && <Minus className="h-4 w-4" />}
                <span>{change.value}</span>
            </div>
        );
    };

    const measurementFields = [
        { name: "weight", label: "Weight (kg)", description: "Member's weight in kilograms" },
        { name: "height", label: "Height (cm)", description: "Member's height in centimeters" },
        { name: "upperArm", label: "Upper Arm (cm)", description: "Circumference of upper arm" },
        { name: "foreArm", label: "Forearm (cm)", description: "Circumference of forearm" },
        { name: "chest", label: "Chest (cm)", description: "Chest circumference at nipple level" },
        { name: "waist", label: "Waist (cm)", description: "Waist circumference at navel" },
        { name: "thigh", label: "Thigh (cm)", description: "Circumference of upper thigh" },
        { name: "calf", label: "Calf (cm)", description: "Circumference of calf" },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <Skeleton className="h-4 w-24 mb-2" />
                                <Skeleton className="h-8 w-16 mb-2" />
                                <Skeleton className="h-4 w-32" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-72" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[300px] w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    const chartData = getFilteredChartData();
    const latest = filteredMeasurements[0];
    const previous = filteredMeasurements[1];

    const summaryMetrics = latest ? [
        {
            title: 'Weight',
            value: `${latest.weight.toFixed(1)} kg`,
            change: calculateChange(latest, previous, 'weight'),
            subtitle: 'Since last measurement'
        },
        {
            title: 'Waist',
            value: `${latest.waist.toFixed(1)} cm`,
            change: calculateChange(latest, previous, 'waist'),
            subtitle: 'Since last measurement'
        },
        {
            title: 'Chest',
            value: `${latest.chest.toFixed(1)} cm`,
            change: calculateChange(latest, previous, 'chest'),
            subtitle: 'Since last measurement'
        },
        {
            title: 'Upper Arm',
            value: `${latest.upperArm.toFixed(1)} cm`,
            change: calculateChange(latest, previous, 'upperArm'),
            subtitle: 'Since last measurement'
        }
    ] : [];

    return (
        <div className="body-measurement-tracker w-full max-w-7xl mx-auto p-4">

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

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">

                <div>
                    <h1 className="text-2xl font-bold text-primary">Body Measurement Tracker</h1>
                    <p className="text-muted-foreground">Track and analyze body measurements over time</p>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formatDateRange()}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                mode="range"
                                selected={{
                                    from: dateRange.start,
                                    to: dateRange.end,
                                }}
                                onSelect={(range) => {
                                    if (range?.from && range?.to) {
                                        setDateRange({ start: range.from, end: range.to });
                                    }
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>

                    <Button variant="ghost" size="icon" onClick={handleResetFilters} title="Reset filters">
                        <RotateCcw className="h-4 w-4" />
                    </Button>

                    <Button variant="outline" size="icon" onClick={handlePrint} title="Print">
                        <Printer className="h-4 w-4" />
                    </Button>

                    <Button variant="outline" size="icon" onClick={handleExport} title="Export data">
                        <FileDown className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {isEditing ? (
                <Card>
                    <CardContent className="p-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                {selectedMeasurement?._id ? "Edit Measurement" : "Add New Measurement"}
                            </h2>

                            <div className="mb-6">
                                <Label>Measurement Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal mt-1"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {selectedDate ? format(selectedDate, 'PPP') : "Select date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={(date) => setSelectedDate(date)}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleSaveMeasurement)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {measurementFields.map((field) => (
                                            <FormField
                                                key={field.name}
                                                control={form.control}
                                                name={field.name}
                                                render={({ field: formField }) => (
                                                    <FormItem>
                                                        <FormLabel>{field.label}</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                step="0.1"
                                                                placeholder="0.0"
                                                                {...formField}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>{field.description}</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                    </div>

                                    <div className="flex justify-end gap-2 pt-4">
                                        <Button type="button" variant="outline" onClick={handleCancel}>
                                            Cancel
                                        </Button>
                                        <Button type="submit">
                                            {selectedMeasurement?._id ? "Update Measurement" : "Save Measurement"}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {summaryMetrics.map((metric, index) => (
                            <Card key={index} className="overflow-hidden transition-all duration-200 hover:shadow-md">
                                <CardContent className="p-6">
                                    <h3 className="text-sm font-medium text-muted-foreground">{metric.title}</h3>
                                    <div className="flex items-end gap-2 mt-1">
                                        <p className="text-2xl font-bold">{metric.value}</p>
                                        {renderChangeIndicator(metric.change)}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">{metric.subtitle}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Tabs defaultValue="charts" className="mt-6">
                        <div className="flex justify-between items-center mb-4">
                            <TabsList>
                                <TabsTrigger value="charts">Charts</TabsTrigger>
                                <TabsTrigger value="table">Data Table</TabsTrigger>
                            </TabsList>

                            <Button onClick={handleAddNew}>Add New Measurement</Button>
                        </div>

                        <TabsContent value="charts" className="mt-0">
                            <div className="space-y-6">
                                <div className="flex justify-end">
                                    <Tabs value={chartPeriod} onValueChange={setChartPeriod}>
                                        <TabsList>
                                            <TabsTrigger value="month">1 Month</TabsTrigger>
                                            <TabsTrigger value="quarter">3 Months</TabsTrigger>
                                            <TabsTrigger value="all">All Time</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>

                            </div>
                        </TabsContent>

                        <TabsContent value="table" className="mt-0">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                        <div className="relative w-full md:w-64">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="text"
                                                placeholder="Search by date..."
                                                value={searchTerm}
                                                onChange={(e) => {
                                                    setSearchTerm(e.target.value);
                                                    setCurrentPage(1);
                                                }}
                                                className="pl-8"
                                            />
                                            {searchTerm && (
                                                <button
                                                    className="absolute right-2.5 top-2.5"
                                                    onClick={() => setSearchTerm('')}
                                                    aria-label="Clear search"
                                                >
                                                    <XCircle className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead
                                                        className="w-[120px] cursor-pointer"
                                                        onClick={() => requestSort('bodyMeasuredate')}
                                                    >
                                                        Date {getSortIcon('bodyMeasuredate')}
                                                    </TableHead>
                                                    <TableHead
                                                        className="text-right cursor-pointer"
                                                        onClick={() => requestSort('weight')}
                                                    >
                                                        Weight (kg) {getSortIcon('weight')}
                                                    </TableHead>
                                                    <TableHead
                                                        className="text-right cursor-pointer"
                                                        onClick={() => requestSort('height')}
                                                    >
                                                        Height (cm) {getSortIcon('height')}
                                                    </TableHead>
                                                    <TableHead
                                                        className="text-right cursor-pointer"
                                                        onClick={() => requestSort('upperArm')}
                                                    >
                                                        Upper Arm {getSortIcon('upperArm')}
                                                    </TableHead>
                                                    <TableHead
                                                        className="text-right cursor-pointer"
                                                        onClick={() => requestSort('chest')}
                                                    >
                                                        Chest {getSortIcon('chest')}
                                                    </TableHead>
                                                    <TableHead
                                                        className="text-right cursor-pointer"
                                                        onClick={() => requestSort('waist')}
                                                    >
                                                        Waist {getSortIcon('waist')}
                                                    </TableHead>
                                                    <TableHead
                                                        className="text-right cursor-pointer"
                                                        onClick={() => requestSort('thigh')}
                                                    >
                                                        Thigh {getSortIcon('thigh')}
                                                    </TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {currentItems.map((measurement, index) => (
                                                    <TableRow key={measurement._id || index} className="hover:bg-muted/50">
                                                        <TableCell className="font-medium">
                                                            {format(new Date(measurement.bodyMeasuredate), 'MMM d, yyyy')}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {measurement.weight?.toFixed(1)}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {measurement.height?.toFixed(1)}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {measurement.upperArm?.toFixed(1)}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {measurement.chest?.toFixed(1)}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {measurement.waist?.toFixed(1)}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {measurement.thigh?.toFixed(1)}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleEditMeasurement(measurement)}
                                                            >
                                                                <PencilIcon className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-between space-x-2 py-4">
                                            <div className="text-sm text-muted-foreground">
                                                Showing {firstItemIndex + 1}-{Math.min(lastItemIndex, sortedData.length)} of {sortedData.length}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                    disabled={currentPage === 1}
                                                >
                                                    Previous
                                                </Button>
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                    <Button
                                                        key={page}
                                                        variant={currentPage === page ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setCurrentPage(page)}
                                                    >
                                                        {page}
                                                    </Button>
                                                ))}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    Next
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </>
            )}
        </div>
    );
};

export default BodyMeasurements;