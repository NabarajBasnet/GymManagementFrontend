'use client';

import React, { useState } from 'react';

const StaffTaskManagement = () => {
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Clean Gym Equipment', assignedTo: 'John Doe', status: 'Pending' },
        { id: 2, title: 'Check Inventory', assignedTo: 'Jane Smith', status: 'In Progress' },
        { id: 3, title: 'Schedule Maintenance', assignedTo: 'Mike Johnson', status: 'Completed' },
    ]);

    const [newTask, setNewTask] = useState({ title: '', assignedTo: '', status: 'Pending' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTask({ ...newTask, [name]: value });
    };

    const addTask = () => {
        if (newTask.title && newTask.assignedTo) {
            setTasks([...tasks, { ...newTask, id: tasks.length + 1 }]);
            setNewTask({ title: '', assignedTo: '', status: 'Pending' });
        }
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Staff Task Management</h1>

            {/* Add New Task Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="title"
                        value={newTask.title}
                        onChange={handleInputChange}
                        placeholder="Task Title"
                        className="p-2 border rounded-lg"
                    />
                    <input
                        type="text"
                        name="assignedTo"
                        value={newTask.assignedTo}
                        onChange={handleInputChange}
                        placeholder="Assigned To"
                        className="p-2 border rounded-lg"
                    />
                </div>
                <button
                    onClick={addTask}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Add Task
                </button>
            </div>

            {/* Task List */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Task List</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">ID</th>
                                <th className="py-2 px-4 border-b">Title</th>
                                <th className="py-2 px-4 border-b">Assigned To</th>
                                <th className="py-2 px-4 border-b">Status</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map(task => (
                                <tr key={task.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">{task.id}</td>
                                    <td className="py-2 px-4 border-b">{task.title}</td>
                                    <td className="py-2 px-4 border-b">{task.assignedTo}</td>
                                    <td className="py-2 px-4 border-b">
                                        <span className={`px-2 py-1 rounded-full text-sm ${task.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                            }`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <button
                                            onClick={() => deleteTask(task.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StaffTaskManagement;