'use client';

import { TiEdit } from "react-icons/ti";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
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
import React, { useState } from 'react';
import {
    Calendar,
    CheckCircle2,
    Clock,
    Filter,
    Flag,
    MoreVertical,
    Plus,
    Search,
    Tags,
    Trash2,
    Users
} from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const INITIAL_TASKS = [
    {
        id: 1,
        title: 'Clean and Sanitize Gym Equipment',
        description: 'Thoroughly clean all equipment in the weight room and cardio area',
        assignedTo: 'John Doe',
        status: 'In Progress',
        priority: 'High',
        category: 'Maintenance',
        dueDate: '2024-03-25',
        created: '2024-03-20',
        comments: [
            { id: 1, user: 'Sarah Manager', text: 'Focus on the cardio machines first', time: '2h ago' }
        ]
    },
    {
        id: 2,
        title: 'Restock Protein Shakes',
        description: 'Check and restock protein shakes in the nutrition bar',
        assignedTo: 'Jane Smith',
        status: 'Pending',
        priority: 'Medium',
        category: 'Inventory',
        dueDate: '2024-03-23',
        created: '2024-03-20',
        comments: []
    },
    {
        id: 3,
        title: 'Member Orientation Session',
        description: 'Conduct orientation for new gym members',
        assignedTo: 'Mike Johnson',
        status: 'Completed',
        priority: 'High',
        category: 'Training',
        dueDate: '2024-03-21',
        created: '2024-03-19',
        comments: [
            { id: 2, user: 'Mike Johnson', text: 'All 5 new members attended', time: '1d ago' }
        ]
    },
    {
        id: 3,
        title: 'Member Orientation Session',
        description: 'Conduct orientation for new gym members',
        assignedTo: 'Mike Johnson',
        status: 'Completed',
        priority: 'High',
        category: 'Training',
        dueDate: '2024-03-21',
        created: '2024-03-19',
        comments: [
            { id: 2, user: 'Mike Johnson', text: 'All 5 new members attended', time: '1d ago' }
        ]
    },
    {
        id: 3,
        title: 'Member Orientation Session',
        description: 'Conduct orientation for new gym members',
        assignedTo: 'Mike Johnson',
        status: 'Completed',
        priority: 'High',
        category: 'Training',
        dueDate: '2024-03-21',
        created: '2024-03-19',
        comments: [
            { id: 2, user: 'Mike Johnson', text: 'All 5 new members attended', time: '1d ago' }
        ]
    },
    {
        id: 3,
        title: 'Member Orientation Session',
        description: 'Conduct orientation for new gym members',
        assignedTo: 'Mike Johnson',
        status: 'Completed',
        priority: 'High',
        category: 'Training',
        dueDate: '2024-03-21',
        created: '2024-03-19',
        comments: [
            { id: 2, user: 'Mike Johnson', text: 'All 5 new members attended', time: '1d ago' }
        ]
    }
];

const STAFF_MEMBERS = [
    'John Doe',
    'Jane Smith',
    'Mike Johnson',
    'Sarah Wilson',
    'Robert Brown'
];

const CATEGORIES = [
    'Maintenance',
    'Inventory',
    'Training',
    'Customer Service',
    'Administration'
];

const StaffTaskManagement = () => {
    const [tasks, setTasks] = useState(INITIAL_TASKS);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        assignedTo: '',
        status: 'Pending',
        priority: 'Medium',
        category: '',
        dueDate: '',
    });
    const [filters, setFilters] = useState({
        status: 'all',
        priority: 'all',
        category: 'all',
        search: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask({ ...newTask, [name]: value });
    };

    const addTask = () => {
        if (newTask.title && newTask.assignedTo) {
            const task = {
                ...newTask,
                id: tasks.length + 1,
                created: new Date().toISOString().split('T')[0],
                comments: []
            };
            setTasks([...tasks, task]);
            setNewTask({
                title: '',
                description: '',
                assignedTo: '',
                status: 'Pending',
                priority: 'Medium',
                category: '',
                dueDate: '',
            });
            setIsAddingTask(false);
        }
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'in progress': return 'bg-blue-100 text-blue-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredTasks = tasks.filter(task => {
        return (
            (filters.status === 'all' || task.status.toLowerCase() === filters.status) &&
            (filters.priority === 'all' || task.priority.toLowerCase() === filters.priority) &&
            (filters.category === 'all' || task.category === filters.category) &&
            (task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                task.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                task.assignedTo.toLowerCase().includes(filters.search.toLowerCase()))
        );
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-8">
                    <Breadcrumb className='p-6'>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-1">
                                        <BreadcrumbEllipsis className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                    </DropdownMenuTrigger>
                                </DropdownMenu>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard/staffmanagement">Staff Management</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard/staffmanagement/staffs">Staffs</BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <button
                        onClick={() => setIsAddingTask(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        Add New Task
                    </button>
                </div>

                {/* Filters and Search */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <select
                                className="border rounded-lg px-3 py-2"
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="in progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                            <select
                                className="border rounded-lg px-3 py-2"
                                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                            >
                                <option value="all">All Priority</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                            <select
                                className="border rounded-lg px-3 py-2"
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            >
                                <option value="all">All Categories</option>
                                {CATEGORIES.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Task List */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Task</TableHead>
                                    <TableHead>Assigned To</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTasks.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{task.title}</span>
                                                <span className="text-sm text-gray-500">{task.description}</span>
                                                {task.comments.length > 0 && (
                                                    <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                                        <p className="font-medium">{task.comments[0].user}</p>
                                                        <p>{task.comments[0].text}</p>
                                                        <span className="text-xs text-gray-500">{task.comments[0].time}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-gray-600">
                                                        {task.assignedTo.split(" ").map((n) => n[0]).join("")}
                                                    </span>
                                                </div>
                                                <span className="ml-2">{task.assignedTo}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                                {task.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center text-gray-500">
                                                <Calendar size={16} className="mr-2" />
                                                {task.dueDate}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                                                {task.category}
                                            </span>
                                        </TableCell>
                                        <TableCell className="flex items-center space-x-1 justify-end">
                                            <TiEdit 
                                            className="h-5 w-5 cursor-pointer"
                                                onClick={() => deleteTask(task.id)}
                                            />
                                            <Trash2
                                                onClick={() => deleteTask(task.id)}
                                                className="h-4 w-4 cursor-pointer text-red-600" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Add Task Modal */}
            {isAddingTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                        <h2 className="text-2xl font-bold mb-6">Add New Task</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={newTask.title}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-lg"
                                    placeholder="Enter task title"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={newTask.description}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-lg"
                                    rows={3}
                                    placeholder="Enter task description"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                                <select
                                    name="assignedTo"
                                    value={newTask.assignedTo}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-lg"
                                >
                                    <option value="">Select Staff Member</option>
                                    {STAFF_MEMBERS.map(staff => (
                                        <option key={staff} value={staff}>{staff}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    name="category"
                                    value={newTask.category}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-lg"
                                >
                                    <option value="">Select Category</option>
                                    {CATEGORIES.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                <select
                                    name="priority"
                                    value={newTask.priority}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-lg"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={newTask.dueDate}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={() => setIsAddingTask(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addTask}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Create Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffTaskManagement;