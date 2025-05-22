'use client';

import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FiCalendar, FiClock, FiUsers, FiMapPin, FiLoader, FiSearch } from 'react-icons/fi';
import { MdFitnessCenter } from 'react-icons/md';
import toast from 'react-hot-toast';

// UI Components
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useMember } from '@/components/Providers/LoggedInMemberProvider';

const ClassBooking = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

    const {member}  = useMember();
    const loggedInMember = member?.loggedInMember;

    const queryClient = useQueryClient();

    // Debounce serach query
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    // Fetch all schedules
    const getAllSchedules = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/schedules?search=${debouncedSearchQuery}&category=${selectedCategory}`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
            toast.error("Failed to fetch classes");
        }
    };

    const { data: schedulesData, isLoading } = useQuery({
        queryKey: ['schedules', debouncedSearchQuery, selectedCategory],
        queryFn: getAllSchedules
    });

    const { schedules } = schedulesData || {};

    // Format datetime for display
    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    // Get separate date and time
    const getDateAndTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return {
            date: date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
            }),
            time: date.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit', 
                hour12: true 
            })
        };
    };

    // Filter schedules based on category and search query
    const filteredSchedules = schedules?.filter(schedule => {
        const matchesCategory = selectedCategory === 'all' || schedule.className.toLowerCase().includes(selectedCategory.toLowerCase());
        const matchesSearch = schedule.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            schedule.trainer?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            schedule.room.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // States for booking
    const [isBooking, setIsBooking] = useState(false);

    // Handle class booking
    const handleBookClass = async (scheduleId) => {
        setIsBooking(true);
        try {
            const response = await fetch(`http://localhost:3000/api/schedules/${scheduleId}/book`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    member: loggedInMember?._id,
                }),
            });

            const responseBody = await response.json();
            
            if (response.ok) {
                queryClient.invalidateQueries({ queryKey: ['schedules'] });
                toast.success(responseBody.message);
                setIsBooking(false);
            } else {
                toast.error(responseBody.message);
                setIsBooking(false);
            }
        } catch (error) {
            console.log("Error: ", error);
            toast.error("Failed to book class");
            setIsBooking(false);
        }
    };

    // Get status styling
    const getStatusStyling = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-blue-50 text-blue-700 border border-blue-200';
            case 'OnGoing':
                return 'bg-green-50 text-green-700 border border-green-200';
            case 'Completed':
                return 'bg-gray-50 text-gray-700 border border-gray-200';
            default:
                return 'bg-red-50 text-red-700 border border-red-200';
        }
    };

    // Calculate availability percentage
    const getAvailabilityPercentage = (members, capacity) => {
        return ((capacity - (members?.length || 0)) / capacity) * 100;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="container mx-auto px-4 py-12">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6">
                        <MdFitnessCenter className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Class Booking
                    </h1>
                    <p className="text-lg font-medium text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Book your favorite fitness classes and join our community of fitness enthusiasts!
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                                placeholder="Search classes, trainers, or rooms..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                            />
                        </div>
                        <Select onValueChange={(value) => setSelectedCategory(value)}>
                            <SelectTrigger className="w-full lg:w-[200px] h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Classes</SelectItem>
                                <SelectItem value="yoga">Yoga</SelectItem>
                                <SelectItem value="hiit">HIIT</SelectItem>
                                <SelectItem value="cardio">Cardio</SelectItem>
                                <SelectItem value="strength">Strength</SelectItem>
                                <SelectItem value="pilates">Pilates</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Classes Grid */}
                {isLoading ? (
                    <div className="flex flex-col justify-center items-center min-h-[400px]">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        </div>
                        <p className="mt-4 text-gray-600 font-medium">Loading amazing classes...</p>
                    </div>
                ) : filteredSchedules?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredSchedules.map((schedule) => {
                            const startDateTime = getDateAndTime(schedule.startTime);
                            const endDateTime = getDateAndTime(schedule.endTime);
                            const availabilityPercentage = getAvailabilityPercentage(schedule.members, schedule.capacity);
                            const spotsLeft = schedule.capacity - (schedule.members?.length || 0);
                            
                            return (
                                <Card key={schedule._id} className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 border-0 bg-white rounded-2xl overflow-hidden">
                                    {/* Card Header with Gradient */}
                                    <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
                                    
                                    <CardHeader className="pb-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <CardTitle className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                    {schedule.className}
                                                </CardTitle>
                                                <CardDescription className="flex items-center gap-2 text-gray-600">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                                        <MdFitnessCenter className="h-4 w-4 text-white" />
                                                    </div>
                                                    <span className="font-medium">Class by: {schedule.trainer?.fullName || 'N/A'}</span>
                                                </CardDescription>
                                            </div>
                                            <Badge className={`${getStatusStyling(schedule.status)} font-semibold px-3 py-1 rounded-full`}>
                                                {schedule.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        {/* Date and Time */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <FiCalendar className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                                                    <p className="font-semibold text-gray-900">{startDateTime.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                    <FiClock className="h-5 w-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Time</p>
                                                    <p className="font-semibold text-gray-900">{startDateTime.time}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Location */}
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                <FiMapPin className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                                                <p className="font-semibold text-gray-900">{schedule.room}</p>
                                            </div>
                                        </div>

                                        {/* Capacity with Progress Bar */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <FiUsers className="h-4 w-4 text-gray-500" />
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {schedule.members?.length || 0} / {schedule.capacity} booked
                                                    </span>
                                                </div>
                                                <span className={`text-sm font-semibold ${spotsLeft <= 3 ? 'text-red-600' : 'text-green-600'}`}>
                                                    {spotsLeft} spots left
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className={`h-2 rounded-full transition-all duration-300 ${
                                                        availabilityPercentage > 50 ? 'bg-green-500' : 
                                                        availabilityPercentage > 25 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                    style={{ width: `${100 - availabilityPercentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="pt-4">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button 
                                                    className={`w-full h-12 rounded-xl font-semibold transition-all duration-300 ${
                                                        schedule.status === 'Pending' 
                                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]' 
                                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                    disabled={schedule.status !== 'Pending'}
                                                >
                                                    {schedule.status === 'Pending' ? 'Book This Class' : 
                                                     schedule.status === 'OnGoing' ? 'Class in Progress' :
                                                     schedule.status === 'Completed' ? 'Class Completed' : 'Unavailable'}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md rounded-2xl">
                                                <DialogHeader className="text-center">
                                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <MdFitnessCenter className="h-8 w-8 text-white" />
                                                    </div>
                                                    <DialogTitle className="text-2xl font-bold">Confirm Your Booking</DialogTitle>
                                                    <DialogDescription className="text-gray-600 mt-2">
                                                        You're about to book this amazing class. You can cancel up to 24 hours before it starts.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                
                                                <div className="py-6">
                                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 space-y-3">
                                                        <h3 className="font-bold text-gray-900 mb-3">Class Details</h3>
                                                        <div className="space-y-2 text-sm">
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">Class:</span>
                                                                <span className="font-semibold text-gray-900">{schedule.className}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">Trainer:</span>
                                                                <span className="font-semibold text-gray-900">{schedule.trainer?.fullName}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">Date & Time:</span>
                                                                <span className="font-semibold text-gray-900">{formatDateTime(schedule.startTime)}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">Location:</span>
                                                                <span className="font-semibold text-gray-900">{schedule.room}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-600">Available Spots:</span>
                                                                <span className="font-semibold text-green-600">
                                                                    {schedule.capacity - (schedule.members?.length || 0)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <DialogFooter className="gap-3">
                                                    <Button 
                                                        variant="outline" 
                                                        className="flex-1 h-11 rounded-xl border-gray-300 hover:bg-gray-50"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button 
                                                        onClick={() => handleBookClass(schedule._id)}
                                                        className="flex-1 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
                                                    >
                                                        {isBooking ? <FiLoader className="animate-spin" /> : 'Confirm Booking'}
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiSearch className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Classes Found</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            We couldn't find any classes matching your search criteria. Try adjusting your filters or search terms.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClassBooking;