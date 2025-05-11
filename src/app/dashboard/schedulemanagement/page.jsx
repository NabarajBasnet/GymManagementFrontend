'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaCalendar, FaFilter, FaUser, FaClock } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";


const ScheduleManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const [currentSchedule, setCurrentSchedule] = useState(null);
    const [saveType, setSaveType] = useState('POST');
    const [openForm, setOpenForm] = useState(false);

    const {
        register,
        reset,
        handleSubmit,
        formState: { isSubmitting, errors },
        setValue,
        clearErrors,
        control } = useForm();

    const getAllStaffs = async () => {
        try {
            const response = await fetch(`http://88.198.115.156:3000/api/staffsmanagement`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const { data: allStaffs, isLoading: staffsLoading } = useQuery({
        queryKey: ['staffs'],
        queryFn: getAllStaffs
    });
    const { staffs } = allStaffs || {};

    const getAllSchedules = async () => {
        try {
            const response = await fetch(`http://88.198.115.156:3000/api/staffschedules`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log('Error: ', error);
        };
    };

    const { data, isLoading } = useQuery({
        queryKey: ['schedules'],
        queryFn: getAllSchedules
    });

    const { allschedules } = data || {};

    const getSingleSchedule = async (id) => {
        try {
            const response = await fetch(`http://88.198.115.156:3000/api/staffschedules/${id}`);
            const responseBody = await response.json();
            if (responseBody && responseBody.schedule) {
                reset({
                    titile: responseBody.schedule.title,
                    staff: responseBody.schedule.staff,
                    day: responseBody.schedule.day,
                    time: responseBody.schedule.time,
                });
            };
        } catch (error) {
            console.log('Error: ', error);
        };
    };

    const handleSave = async (data) => {
        try {
            const url = 'http://88.198.115.156:3000/api/staffschedules'
            const response = await fetch(url, {
                method: saveType === "POST" ? "POST" : "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const responseBody = await response.json();
            if (response.ok) {
                setOpenForm(false);
            };
            console.log(responseBody);
        } catch (error) {
            console.log('Error: ', error);
        };
    };


    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return (
        <div className="w-full">
            <div className='w-full p-6'>
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
                            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Schedule Management</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-xl font-bold mt-3">Schedules</h1>
            </div>

            <div className="p-6 bg-gray-100">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold flex items-center">
                        <FaCalendar className="mr-2 text-blue-600" /> Schedule Management
                    </h1>
                    <Button
                        onClick={() => setOpenForm(true)}
                        className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg flex items-center text-white"
                    >
                        <FaPlus className="mr-2" /> Add Schedule
                    </Button >
                </div>

                {/* Filters */}
                <div className="flex justify-between mb-4">
                    <div className="flex items-center">
                        <FaFilter className="mr-2 text-yellow-500" />
                        <span>Filters:</span>
                    </div>
                    <div className="space-x-4">
                        {Array.isArray(staffs) && staffs.length >= 1 ? (
                            staffs.map((staff) => (
                                <select key={staff._id} className="p-2 rounded-lg text-gray-800 px-2 shadow-sm">
                                    <option>Select</option>
                                    <option>{staff.fullName}</option>
                                </select>
                            ))
                        ) : (
                            <select className="p-2 rounded-lg text-gray-800 px-2 shadow-sm">
                                <option>Staffs not registered</option>
                            </select>
                        )}

                        <select className="p-2 rounded-lg shadow-sm px-2 text-gray-800">
                            <option>All Days</option>
                            {days.map((day) => (
                                <option key={day}>{day}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Weekly Schedule Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.isArray(allschedules) && allschedules.length >= 1 ? (
                        <>
                            {
                                allschedules.map((schedule) => (
                                    <div key={schedule._id} className="rounded-lg shadow-xl border-gray-400 bg-white p-4">
                                        <h2 className="text-lg font-semibold mb-4">{schedule.day}</h2>
                                        <div className="space-y-4">
                                            <div
                                                key={schedule.id}
                                                className="p-3 rounded-lg flex justify-between items-center"
                                            >
                                                <div>
                                                    <h3 className="font-semibold">{schedule.title}</h3>
                                                    <p className="text-sm text-gray-800 flex items-center">
                                                        <FaClock className="mr-1" /> {schedule.time}
                                                    </p>
                                                    <p className="text-sm text-gray-800 flex items-center">
                                                        <FaUser className="mr-1" /> {schedule.staff}
                                                    </p>
                                                </div>
                                                <div className="space-x-3">
                                                    <button
                                                        onClick={() => {
                                                            setSaveType('PATCH');
                                                            setOpenForm(true);
                                                        }}
                                                        className="bg-transparent text-black hover:text-gray-700 transition-all duration-500"
                                                    >
                                                        <FaEdit />
                                                    </button >
                                                    <button className="text-red-500 hover:text-red-600 bg-transparent">
                                                        <FaTrash />
                                                    </button >
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </>
                    ) : (
                        <div className="w-full flex justify-center items-center">
                            <p className="text-sm font-semibold text-center">No schedules found.</p>
                        </div>
                    )}

                </div>

                {/* Add/Edit Schedule Modal */}
                {openForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
                        <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                            <h2 className="text-2xl font-bold mb-4">
                                {currentSchedule ? "Edit Schedule" : "Add Schedule"}
                            </h2>
                            <form onSubmit={handleSubmit(handleSave)}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold mb-2">Title</label>
                                    <Controller
                                        name='title'
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                onChange={(e) => field.onChange(e)}
                                                type="text"
                                                {...register('title')}
                                                className="w-full rounded-md"
                                            />
                                        )}
                                    />
                                    {errors.title && (
                                        <p className="text-sm font-semibold text-red-600">{errors.staff.message}</p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold mb-2">Staff</label>
                                    {Array.isArray(staffs) && staffs.length >= 1 ? (
                                        staffs.map((staff) => (
                                            <Controller
                                                name='staff'
                                                key={staff._id}
                                                control={control}
                                                render={({ field }) => (
                                                    <select
                                                        {...field}
                                                        onChange={(e) => {
                                                            setValue('staff', e.target.value);
                                                            field.onChange(e);
                                                            clearErrors('staff');
                                                        }
                                                        } key={staff._id} className="w-full p-2 border outline-none rounded-lg text-gray-800 px-2 shadow-sm">
                                                        <option value={undefined}>Select</option>
                                                        <option value={staff.fullName}>{staff.fullName}</option>
                                                    </select>
                                                )}
                                            />
                                        ))
                                    ) : (
                                        <select onChange={() => clearErrors('staff')} className="w-full p-2 border outline-none rounded-lg text-gray-800 px-2 shadow-sm">
                                            <option>Staffs not registered</option>
                                        </select>
                                    )}
                                    {errors.staff && (
                                        <p className="text-sm font-semibold text-red-600">{errors.staff.message}</p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold mb-2">Day</label>
                                    <Controller
                                        name="day"
                                        control={control}
                                        render={({ field }) => (
                                            <select
                                                {...field}
                                                onChange={(e) => {
                                                    setValue('day', e.target.value);
                                                    field.onChange(e)
                                                    clearErrors('day');
                                                }}
                                                className="w-full p-2 cursor-pointer rounded-lg border"
                                                key={field}
                                            >
                                                <option>Sunday</option>
                                                <option>Monday</option>
                                                <option>Tuesday</option>
                                                <option>Wednesday</option>
                                                <option>Thursday</option>
                                                <option>Friday</option>
                                                <option>Saturday</option>
                                            </select>
                                        )}
                                    />
                                    {errors.day && (
                                        <p className="text-sm font-semibold text-red-600">{errors.day.message}</p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-semibold mb-2">Time</label>
                                    <Controller
                                        name="time"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                onChange={(e) => field.onChange(e)}
                                                type="text"
                                                {...register('time')}
                                                className="w-full rounded-md"
                                                placeholder="e.g., 8:00 AM - 9:00 AM"
                                            />
                                        )}
                                    />
                                    {errors.time && (
                                        <p className="text-sm font-semibold text-red-600">{errors.time.message}</p>
                                    )}
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <Button
                                        type="button"
                                        onClick={() => setOpenForm(false)}
                                        className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500"
                                    >
                                        Cancel
                                    </Button >
                                    {saveType === 'POST' ? (
                                        <Button
                                            type="submit"
                                            className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600"
                                        >
                                            {isSubmitting ? 'Submitting' : 'Submit'}
                                        </Button>
                                    ) : (
                                        <Button
                                            type="submit"
                                            className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600"
                                        >
                                            Update
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScheduleManagement;
