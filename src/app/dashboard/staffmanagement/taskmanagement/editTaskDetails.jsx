'use client';

import { IoCloseSharp } from "react-icons/io5";
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";

const CATEGORIES = [
    'Maintenance',
    'Inventory',
    'Training',
    'Customer Service',
    'Administration'
];

const EditTaskDetails = ({ task, id }) => {

    useEffect(() => {
        reset({
            title: task.title,
            description: task.description,
            assignedTo: task.assignedTo?._id || task.assignedTo || "",
            category: task.category,
            priority: task.priority,
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
            dueTime: task.dueTime ? task.dueTime : '',
        });
    }, []);

    // States
    const [taskMode, setTaskMode] = useState(null);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const queryClient = useQueryClient();

    // Form states
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitSuccessful },
        setValue,
        setError,
        clearErrors,
        reset,
        control
    } = useForm();

    // Functions
    const getAllStaffMembers = async () => {
        try {
            const response = await fetch(`https://fitbinary.com/api/staffsmanagement`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log("Error: ", error);
        };
    };

    const { data: STAFF_MEMBERS, isLoading: isStaffsLoading } = useQuery({
        queryKey: ['staffs'],
        queryFn: getAllStaffMembers
    });
    const staffs = STAFF_MEMBERS?.staffs || [];

    const [currentTask, setCurrentTask] = useState(null);

    const editTask = async (data) => {
        try {
            const { title, description, assignedTo, category, priority, dueDate, dueTime } = data;
            const finalData = { title: title, description: description, assignedTo: assignedTo, status: 'Not Started', category: category, priority: priority, dueDate: dueDate, dueTime: dueTime };
            for (let key in finalData) {
                if (!finalData[key]) {
                    toast.error(`${key.charAt(0).toUpperCase() + key.slice(1)} field is missing, Please fill this field`);
                    return;
                };
            };
            const response = await fetch(`https://fitbinary.com/api/tasks/edit/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(finalData),
            });

            const responseBody = await response.json();
            if (response.ok) {
                toast.success(responseBody.message);
                setIsAddingTask(false);
                queryClient.invalidateQueries(['tasks']);
            };
        } catch (error) {
            toast.error(error.message);
            console.log("Error: ", error);
            console.log("Error Message: ", error.message);
        };
    };

    return (
        <div className="min-h-screen w-full bg-gray-50">
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                <form onSubmit={handleSubmit(editTask)} className="bg-white dark:bg-gray-800 rounded-sm p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold dark:text-white">Edit Task Details</h2>
                        <IoCloseSharp className="cursor-pointer w-5 h-5 dark:text-white" onClick={() => window.location.reload()} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2">
                            <Label htmlFor="title" className="text-sm font-medium dark:text-white text-gray-700">Title</Label>
                            <Input
                                id="title"
                                type="text"
                                name="title"
                                {...register('title')}
                                className="mt-1 py-6 rounded-sm dark:text-white dark:bg-gray-900 dark:border-none bg-white"
                                placeholder="Enter task title"
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <Label htmlFor="description" className="text-sm dark:text-white font-medium text-gray-700">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                {...register('description')}
                                className="focus-visible:ring-0 dark:bg-gray-900 dark:text-white dark:border-none focus:ring-none mt-1 focus:outline-none rounded-sm"

                                placeholder="Enter task description"
                            />
                        </div>
                        <div>
                            <Label htmlFor="assignedTo" className="dark:text-white text-sm font-medium text-gray-700">Assigned To</Label>
                            {taskMode === 'Edit' ? (
                                <select
                                    id="assignedTo"
                                    name="assignedTo"
                                    {...register("assignedTo", { required: "Please select a staff member" })}
                                    className="mt-1 block py-4 dark:border-none dark:bg-gray-900 dark:text-white w-full rounded-sm border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="">Select Staff</option>
                                    {STAFF_MEMBERS?.staffs?.length > 0 ? (
                                        STAFF_MEMBERS.staffs.map((staff) => (
                                            <option key={staff._id} value={staff._id} selected={staff._id === currentTask.assignedTo}>
                                                {staff.fullName}
                                            </option>
                                        ))
                                    ) : (
                                        <option>Not registered</option>
                                    )}
                                </select>
                            ) : (
                                <select
                                    id="assignedTo"
                                    name="assignedTo"
                                    {...register("assignedTo", { required: "Please select a staff member" })}
                                    className="mt-1 py-4 dark:border-none dark:bg-gray-900 dark:text-white block w-full rounded-sm border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="">Select Staff</option>
                                    {STAFF_MEMBERS ? STAFF_MEMBERS.staffs.map(staff => (
                                        <option key={staff._id} value={staff._id}>{staff.fullName}</option>
                                    )) :
                                        <option>Not registered</option>
                                    }
                                </select>
                            )}

                        </div>
                        <div>
                            <Label htmlFor="category" className="dark:text-white text-sm font-medium text-gray-700">Category</Label>
                            <select
                                id="category"
                                name="category"
                                {...register("category", { required: "Please select a staff member" })}
                                className="mt-1 py-4 dark:border-none dark:bg-gray-900 dark:text-white block w-full rounded-sm border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">Select Category</option>
                                {CATEGORIES.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="priority" className="dark:text-white text-sm font-medium text-gray-700">Priority</Label>
                            <select
                                id="priority"
                                name="priority"
                                {...register("priority", { required: "Please select a staff member" })}
                                className="mt-1 py-4 dark:border-none dark:bg-gray-900 dark:text-white block w-full rounded-sm border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="dueDate" className="dark:text-white text-sm font-medium text-gray-700">Due Date & Time</Label>
                            <div className="flex items-center space-x-4">
                                <Input
                                    id="dueDate"
                                    type="date"
                                    name="dueDate"
                                    {...register('dueDate')}
                                    className="mt-1 py-6 dark:border-none dark:bg-gray-900 dark:text-white rounded-sm"
                                />
                                <Input
                                    id="dueDate"
                                    type="time"
                                    name="dueTime"
                                    {...register('dueTime')}
                                    className="mt-1 py-6 dark:border-none dark:bg-gray-900 dark:text-white rounded-sm"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
                        <Button
                            variant="outline"
                            type='button'
                            onClick={() => window.location.reload()}
                            className="w-full rounded-sm sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            className="w-full sm:w-auto rounded-sm bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </div>
                </form>
            </div>
        </div >
    );
};

export default EditTaskDetails;
