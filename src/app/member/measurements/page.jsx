'use client';

import { useState } from 'react';
import {
    ArrowUp,
    ArrowDown,
    Plus,
    LineChart,
    Calendar,
    Trash2,
    Edit
} from 'lucide-react';

const BodyMeasurements = () => {
    const [measurements, setMeasurements] = useState([
        {
            id: 1,
            date: '2023-06-15',
            weight: 82.4,
            bodyFat: 21.2,
            chest: 42.5,
            waist: 36.0,
            arms: 14.2,
            notes: "Started new training program"
        },
        {
            id: 2,
            date: '2023-05-15',
            weight: 83.1,
            bodyFat: 21.8,
            chest: 42.0,
            waist: 36.5,
            arms: 13.9,
            notes: ""
        },
        {
            id: 3,
            date: '2023-04-15',
            weight: 84.0,
            bodyFat: 22.5,
            chest: 41.5,
            waist: 37.0,
            arms: 13.5,
            notes: "Consistent with diet"
        }
    ]);

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        weight: '',
        bodyFat: '',
        chest: '',
        waist: '',
        arms: '',
        notes: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddMeasurement = () => {
        setIsAdding(true);
        setEditingId(null);
        setFormData({
            date: new Date().toISOString().split('T')[0],
            weight: '',
            bodyFat: '',
            chest: '',
            waist: '',
            arms: '',
            notes: ''
        });
    };

    const handleEditMeasurement = (measurement) => {
        setIsAdding(false);
        setEditingId(measurement.id);
        setFormData({
            date: measurement.date,
            weight: measurement.weight,
            bodyFat: measurement.bodyFat,
            chest: measurement.chest,
            waist: measurement.waist,
            arms: measurement.arms,
            notes: measurement.notes
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newMeasurement = {
            id: editingId || Math.max(...measurements.map(m => m.id), 0) + 1,
            date: formData.date,
            weight: parseFloat(formData.weight),
            bodyFat: parseFloat(formData.bodyFat),
            chest: parseFloat(formData.chest),
            waist: parseFloat(formData.waist),
            arms: parseFloat(formData.arms),
            notes: formData.notes
        };

        if (editingId) {
            setMeasurements(measurements.map(m =>
                m.id === editingId ? newMeasurement : m
            ));
        } else {
            setMeasurements([newMeasurement, ...measurements]);
        }

        setIsAdding(false);
        setEditingId(null);
    };

    const handleDelete = (id) => {
        setMeasurements(measurements.filter(m => m.id !== id));
    };

    const calculateProgress = (current, previous) => {
        if (!previous) return { value: 0, trend: 'neutral' };
        const change = current - previous;
        const percentage = ((Math.abs(change) / previous)) * 100;
        return {
            value: percentage.toFixed(1),
            trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
        };
    };

    const latestMeasurement = measurements[0];
    const previousMeasurement = measurements[1];

    const weightProgress = calculateProgress(
        latestMeasurement?.weight,
        previousMeasurement?.weight
    );
    const fatProgress = calculateProgress(
        latestMeasurement?.bodyFat,
        previousMeasurement?.bodyFat
    );
    const muscleMass = latestMeasurement
        ? latestMeasurement.weight * (1 - latestMeasurement.bodyFat / 100)
        : 0;
    const prevMuscleMass = previousMeasurement
        ? previousMeasurement.weight * (1 - previousMeasurement.bodyFat / 100)
        : 0;
    const muscleProgress = calculateProgress(muscleMass, prevMuscleMass);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Body Measurements</h2>
                <button
                    onClick={handleAddMeasurement}
                    className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                    <Plus size={18} className="mr-2" />
                    Add Measurement
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <MeasurementCard
                    title="Current Weight"
                    value={latestMeasurement?.weight ? `${latestMeasurement.weight.toFixed(1)} kg` : 'N/A'}
                    trend={weightProgress.trend}
                    percentage={weightProgress.value > 0 ? `${weightProgress.value}%` : ''}
                    icon={<LineChart size={20} />}
                />
                <MeasurementCard
                    title="Body Fat %"
                    value={latestMeasurement?.bodyFat ? `${latestMeasurement.bodyFat.toFixed(1)}%` : 'N/A'}
                    trend={fatProgress.trend}
                    percentage={fatProgress.value > 0 ? `${fatProgress.value}%` : ''}
                    icon={<LineChart size={20} />}
                />
                <MeasurementCard
                    title="Muscle Mass"
                    value={muscleMass ? `${muscleMass.toFixed(1)} kg` : 'N/A'}
                    trend={muscleProgress.trend}
                    percentage={muscleProgress.value > 0 ? `${muscleProgress.value}%` : ''}
                    icon={<LineChart size={20} />}
                />
            </div>

            {/* Add/Edit Form */}
            {(isAdding || editingId) && (
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h3 className="text-lg font-medium mb-4">
                        {editingId ? 'Edit Measurement' : 'Add New Measurement'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                    Date
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                    <Calendar size={18} className="absolute right-3 top-2.5 text-gray-400" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                                    Weight (kg)
                                </label>
                                <input
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleInputChange}
                                    step="0.1"
                                    min="30"
                                    max="200"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="bodyFat" className="block text-sm font-medium text-gray-700">
                                    Body Fat (%)
                                </label>
                                <input
                                    type="number"
                                    id="bodyFat"
                                    name="bodyFat"
                                    value={formData.bodyFat}
                                    onChange={handleInputChange}
                                    step="0.1"
                                    min="5"
                                    max="50"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="chest" className="block text-sm font-medium text-gray-700">
                                    Chest (inches)
                                </label>
                                <input
                                    type="number"
                                    id="chest"
                                    name="chest"
                                    value={formData.chest}
                                    onChange={handleInputChange}
                                    step="0.1"
                                    min="20"
                                    max="60"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="waist" className="block text-sm font-medium text-gray-700">
                                    Waist (inches)
                                </label>
                                <input
                                    type="number"
                                    id="waist"
                                    name="waist"
                                    value={formData.waist}
                                    onChange={handleInputChange}
                                    step="0.1"
                                    min="20"
                                    max="60"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="arms" className="block text-sm font-medium text-gray-700">
                                    Arms (inches)
                                </label>
                                <input
                                    type="number"
                                    id="arms"
                                    name="arms"
                                    value={formData.arms}
                                    onChange={handleInputChange}
                                    step="0.1"
                                    min="5"
                                    max="25"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div className="md:col-span-2 lg:col-span-3 space-y-1">
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                    Notes
                                </label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Any additional notes about this measurement..."
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAdding(false);
                                    setEditingId(null);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                            >
                                {editingId ? 'Update' : 'Save'} Measurement
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Measurement History */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium">Measurement History</h3>
                    <div className="text-sm text-gray-500">
                        {measurements.length} records
                    </div>
                </div>
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
                                    Body Fat
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Chest
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Waist
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Arms
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Notes
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {measurements.length > 0 ? (
                                measurements.map((measurement) => (
                                    <tr key={measurement.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(measurement.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {measurement.weight.toFixed(1)} kg
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {measurement.bodyFat.toFixed(1)}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {measurement.chest.toFixed(1)} in
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {measurement.waist.toFixed(1)} in
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {measurement.arms.toFixed(1)} in
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                            {measurement.notes}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleEditMeasurement(measurement)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(measurement.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No measurements recorded yet. Add your first measurement to get started!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const MeasurementCard = ({ title, value, trend, percentage, icon }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
                <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
                <div className="text-gray-400">
                    {icon}
                </div>
            </div>
            <div className="flex items-baseline mt-2">
                <p className="text-2xl font-semibold">{value}</p>
                {percentage && (
                    <span className={`ml-2 flex items-center text-sm ${trend === 'up' ? 'text-green-600' :
                        trend === 'down' ? 'text-red-600' : 'text-gray-500'
                        }`}>
                        {trend === 'up' ? <ArrowUp size={14} className="mr-0.5" /> :
                            trend === 'down' ? <ArrowDown size={14} className="mr-0.5" /> : null}
                        {percentage}
                    </span>
                )}
            </div>
            <p className="text-xs text-gray-500 mt-1">vs previous measurement</p>
        </div>
    );
};

export default BodyMeasurements;