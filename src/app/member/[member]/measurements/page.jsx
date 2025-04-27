'use client';

import { useState, useEffect } from 'react';
import {
    ArrowUp,
    ArrowDown,
    Plus,
    LineChart,
    Calendar,
    Trash2,
    Edit,
    Target,
    TrendingUp,
    Clock
} from 'lucide-react';
import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const MemberBodyMeasurements = ({ memberId }) => {
    // States for managing measurements and UI
    const [measurements, setMeasurements] = useState([]);
    const [goals, setGoals] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [viewMode, setViewMode] = useState('measurements'); // 'measurements', 'goals', 'charts'
    const [chartMetric, setChartMetric] = useState('weight');

    // Form states
    const [formData, setFormData] = useState({
        bodyMeasureDate: new Date().toISOString().split('T')[0],
        weight: '',
        height: '',
        upperArm: '',
        foreArm: '',
        chest: '',
        waist: '',
        thigh: '',
        calf: '',
        notes: '',
        // Custom metrics can be added here
        customMetrics: {}
    });

    const [goalFormData, setGoalFormData] = useState({
        weightGoal: '',
        upperArmGoal: '',
        chestGoal: '',
        waistGoal: '',
        thighGoal: '',
        calfGoal: '',
        goalType: 'maintenance',
        goalDeadline: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0]
    });

    // Fetch data (in a real app, this would call your API)
    useEffect(() => {
        // Simulate API fetch
        const fetchData = async () => {
            try {
                // Replace with actual API call
                // const response = await fetch(`/api/bodymeasurements/${memberId}`);
                // const data = await response.json();

                // Mock data for demonstration
                const mockMeasurements = [
                    {
                        _id: '1',
                        bodyMeasureDate: '2023-11-15',
                        weight: 82.4,
                        height: 180,
                        upperArm: 35.2,
                        foreArm: 28.3,
                        chest: 108.0,
                        waist: 91.4,
                        thigh: 58.5,
                        calf: 38.2,
                        goalType: 'weight_loss',
                        progressPercentage: 45,
                        progressType: 'Decreasing',
                        status: 'Active',
                        notes: "Started new training program",
                        customMetrics: { hipCircumference: 102.5 }
                    },
                    {
                        _id: '2',
                        bodyMeasureDate: '2023-10-15',
                        weight: 83.6,
                        height: 180,
                        upperArm: 34.9,
                        foreArm: 28.1,
                        chest: 107.0,
                        waist: 92.5,
                        thigh: 58.0,
                        calf: 38.0,
                        goalType: 'weight_loss',
                        progressPercentage: 35,
                        progressType: 'Decreasing',
                        status: 'Active',
                        notes: "",
                        customMetrics: { hipCircumference: 103.2 }
                    },
                    {
                        _id: '3',
                        bodyMeasureDate: '2023-09-15',
                        weight: 85.1,
                        height: 180,
                        upperArm: 34.5,
                        foreArm: 27.8,
                        chest: 106.5,
                        waist: 94.0,
                        thigh: 57.5,
                        calf: 37.5,
                        goalType: 'weight_loss',
                        progressPercentage: 20,
                        progressType: 'Decreasing',
                        status: 'Active',
                        notes: "Started diet plan",
                        customMetrics: { hipCircumference: 104.5 }
                    }
                ];

                const mockGoal = {
                    weightGoal: 78.0,
                    upperArmGoal: 36.5,
                    chestGoal: 110.0,
                    waistGoal: 86.0,
                    thighGoal: 60.0,
                    calfGoal: 40.0,
                    goalType: 'weight_loss',
                    goalDeadline: '2024-03-15'
                };

                setMeasurements(mockMeasurements);
                setGoals(mockGoal);

                // Initialize goal form with current goals
                setGoalFormData(mockGoal);

                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch measurements:", error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [memberId]);

    // Input change handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGoalInputChange = (e) => {
        const { name, value } = e.target;
        setGoalFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCustomMetricChange = (metricName, value) => {
        setFormData(prev => ({
            ...prev,
            customMetrics: {
                ...prev.customMetrics,
                [metricName]: value
            }
        }));
    };

    // Form actions
    const handleAddMeasurement = () => {
        setIsAdding(true);
        setEditingId(null);
        setFormData({
            bodyMeasureDate: new Date().toISOString().split('T')[0],
            weight: '',
            height: '',
            upperArm: '',
            foreArm: '',
            chest: '',
            waist: '',
            thigh: '',
            calf: '',
            notes: '',
            customMetrics: {}
        });
    };

    const handleEditMeasurement = (measurement) => {
        setIsAdding(false);
        setEditingId(measurement._id);

        // Convert customMetrics Map to object if needed
        const customMetricsObj = measurement.customMetrics instanceof Map
            ? Object.fromEntries(measurement.customMetrics)
            : measurement.customMetrics || {};

        setFormData({
            bodyMeasureDate: new Date(measurement.bodyMeasureDate).toISOString().split('T')[0],
            weight: measurement.weight,
            height: measurement.height,
            upperArm: measurement.upperArm,
            foreArm: measurement.foreArm,
            chest: measurement.chest,
            waist: measurement.waist,
            thigh: measurement.thigh,
            calf: measurement.calf,
            notes: measurement.notes,
            customMetrics: customMetricsObj
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Format data for submission
            const submissionData = {
                ...formData,
                member: memberId,
                editedBy: 'Member' // Assuming this is a member view
            };

            // In a real app, you would send this to your API
            // if (editingId) {
            //   await fetch(`/api/bodymeasurements/${editingId}`, {
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(submissionData)
            //   });
            // } else {
            //   await fetch('/api/bodymeasurements', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(submissionData)
            //   });
            // }

            // For demo: update the local state
            if (editingId) {
                setMeasurements(measurements.map(m =>
                    m._id === editingId ? {
                        ...m,
                        ...submissionData,
                        _id: editingId
                    } : m
                ));
            } else {
                const newMeasurement = {
                    _id: Math.random().toString(36).substr(2, 9),
                    ...submissionData,
                    progressPercentage: 0,
                    progressType: 'Maintaining',
                    status: 'Active'
                };
                setMeasurements([newMeasurement, ...measurements]);
            }

            setIsAdding(false);
            setEditingId(null);
        } catch (error) {
            console.error("Error saving measurement:", error);
            alert("Failed to save measurement. Please try again.");
        }
    };

    const handleGoalSubmit = async (e) => {
        e.preventDefault();

        try {
            // In a real app, send to API
            // await fetch(`/api/bodymeasurements/${memberId}/goals`, {
            //   method: 'PUT',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(goalFormData)
            // });

            // Update local state
            setGoals(goalFormData);
            alert("Goals updated successfully!");
        } catch (error) {
            console.error("Error updating goals:", error);
            alert("Failed to update goals. Please try again.");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this measurement?")) return;

        try {
            // In a real app, send to API
            // await fetch(`/api/bodymeasurements/${id}`, {
            //   method: 'DELETE'
            // });

            // Update local state
            setMeasurements(measurements.filter(m => m._id !== id));
        } catch (error) {
            console.error("Error deleting measurement:", error);
            alert("Failed to delete measurement. Please try again.");
        }
    };

    // Helper functions
    const calculateProgress = (current, previous, metric) => {
        if (!previous) return { value: 0, trend: 'neutral' };

        const change = current - previous;
        const percentage = ((Math.abs(change) / previous) * 100).toFixed(1);

        // For metrics where decrease is progress (like weight, waist)
        const decreaseIsGood = ['weight', 'waist'];
        const isGoodChange = decreaseIsGood.includes(metric) ? change < 0 : change > 0;

        return {
            value: percentage,
            trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
            isGood: isGoodChange
        };
    };

    const getLatestMeasurement = () => measurements[0] || null;
    const getPreviousMeasurement = () => measurements[1] || null;

    const progressToGoal = (metric) => {
        const latest = getLatestMeasurement();
        if (!latest || !goals || !goals[`${metric}Goal`]) return { percent: 0, remaining: 0 };

        const currentValue = latest[metric];
        const goalValue = goals[`${metric}Goal`];
        const diff = Math.abs(currentValue - goalValue);

        // Determine if we're trying to increase or decrease this metric
        const isDecreasing = currentValue > goalValue;

        // Calculate based on whether our goal is to increase or decrease
        let percent;
        if (isDecreasing) {
            // For decrease goals (like weight loss): original - current / original - goal
            const originalValue = measurements[measurements.length - 1][metric];
            percent = ((originalValue - currentValue) / (originalValue - goalValue)) * 100;
        } else {
            // For increase goals (like muscle gain): current - original / goal - original
            const originalValue = measurements[measurements.length - 1][metric];
            percent = ((currentValue - originalValue) / (goalValue - originalValue)) * 100;
        }

        return {
            percent: Math.min(Math.max(percent, 0), 100).toFixed(1),
            remaining: diff.toFixed(1),
            increasing: !isDecreasing
        };
    };

    // Prepare chart data
    const prepareChartData = () => {
        return measurements
            .slice()
            .reverse()
            .map(m => ({
                date: new Date(m.bodyMeasureDate).toLocaleDateString(),
                weight: m.weight,
                waist: m.waist,
                chest: m.chest,
                upperArm: m.upperArm,
                thigh: m.thigh,
                calf: m.calf,
                foreArm: m.foreArm,
                ...(m.customMetrics || {})
            }));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    // UI Components
    const MeasurementCard = ({ title, value, metric, icon }) => {
        const latest = getLatestMeasurement();
        const previous = getPreviousMeasurement();

        let progress = null;
        let goalProgress = null;

        if (latest && previous) {
            progress = calculateProgress(latest[metric], previous[metric], metric);
        }

        if (goals && goals[`${metric}Goal`]) {
            goalProgress = progressToGoal(metric);
        }

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
                    {progress && progress.value > 0 && (
                        <span className={`ml-2 flex items-center text-sm ${progress.isGood ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {progress.trend === 'up' ? <ArrowUp size={14} className="mr-0.5" /> :
                                progress.trend === 'down' ? <ArrowDown size={14} className="mr-0.5" /> : null}
                            {progress.value}%
                        </span>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-1">vs previous measurement</p>

                {goalProgress && goalProgress.percent > 0 && (
                    <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Goal Progress</span>
                            <span>{goalProgress.percent}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${goalProgress.percent}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {goalProgress.remaining} {goalProgress.increasing ? 'to gain' : 'to lose'}
                        </p>
                    </div>
                )}
            </div>
        );
    };

    const renderMeasurementsView = () => (
        <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <MeasurementCard
                    title="Current Weight"
                    value={getLatestMeasurement()?.weight ? `${getLatestMeasurement().weight.toFixed(1)} kg` : 'N/A'}
                    metric="weight"
                    icon={<LineChart size={20} />}
                />
                <MeasurementCard
                    title="Waist"
                    value={getLatestMeasurement()?.waist ? `${getLatestMeasurement().waist.toFixed(1)} cm` : 'N/A'}
                    metric="waist"
                    icon={<LineChart size={20} />}
                />
                <MeasurementCard
                    title="Chest"
                    value={getLatestMeasurement()?.chest ? `${getLatestMeasurement().chest.toFixed(1)} cm` : 'N/A'}
                    metric="chest"
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
                                <label htmlFor="bodyMeasureDate" className="block text-sm font-medium text-gray-700">
                                    Date
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        id="bodyMeasureDate"
                                        name="bodyMeasureDate"
                                        value={formData.bodyMeasureDate}
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
                                <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                                    Height (cm)
                                </label>
                                <input
                                    type="number"
                                    id="height"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleInputChange}
                                    step="0.1"
                                    min="100"
                                    max="250"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="chest" className="block text-sm font-medium text-gray-700">
                                    Chest (cm)
                                </label>
                                <input
                                    type="number"
                                    id="chest"
                                    name="chest"
                                    value={formData.chest}
                                    onChange={handleInputChange}
                                    step="0.1"
                                    min="50"
                                    max="200"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="waist" className="block text-sm font-medium text-gray-700">
                                    Waist (cm)
                                </label>
                                <input
                                    type="number"
                                    id="waist"
                                    name="waist"
                                    value={formData.waist}
                                    onChange={handleInputChange}
                                    step="0.1"
                                    min="50"
                                    max="200"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="upperArm" className="block text-sm font-medium text-gray-700">
                                    Upper Arm (cm)
                                </label>
                                <input
                                    type="number"
                                    id="upperArm"
                                    name="upperArm"
                                    value={formData.upperArm}
                                    onChange={handleInputChange}
                                    step="0.1"
                                    min="15"
                                    max="60"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="foreArm" className="block text-sm font-medium text-gray-700">
                                    Forearm (cm)
                                </label>
                                <input
                                    type="number"
                                    id="foreArm"
                                    name="foreArm"
                                    value={formData.foreArm}
                                    onChange={handleInputChange}
                                    step="0.1"
                                    min="15"
                                    max="50"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="thigh" className="block text-sm font-medium text-gray-700">
                                    Thigh (cm)
                                </label>
                                <input
                                    type="number"
                                    id="thigh"
                                    name="thigh"
                                    value={formData.thigh}
                                    onChange={handleInputChange}
                                    step="0.1"
                                    min="30"
                                    max="100"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="calf" className="block text-sm font-medium text-gray-700">
                                    Calf (cm)
                                </label>
                                <input
                                    type="number"
                                    id="calf"
                                    name="calf"
                                    value={formData.calf}
                                    onChange={handleInputChange}
                                    step="0.1"
                                    min="20"
                                    max="60"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Custom metrics field */}
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Hip Circumference (cm)
                                </label>
                                <input
                                    type="number"
                                    value={formData.customMetrics?.hipCircumference || ''}
                                    onChange={(e) => handleCustomMetricChange('hipCircumference', e.target.value)}
                                    step="0.1"
                                    min="60"
                                    max="150"
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
                                                    onClick={() => handleDelete(measurement._id)}
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
                                        No measurements recorded yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        Showing {measurements.length} of {measurements.length} records
                    </div>
                    <button
                        onClick={handleAddMeasurement}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center"
                    >
                        <Plus size={16} className="mr-1" />
                        Add Measurement
                    </button>
                </div>
            </div>
        </>
    );

    const renderGoalsView = () => (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-medium mb-6">Body Measurement Goals</h3>
            <form onSubmit={handleGoalSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label htmlFor="goalType" className="block text-sm font-medium text-gray-700">
                            Goal Type
                        </label>
                        <select
                            id="goalType"
                            name="goalType"
                            value={goalFormData.goalType}
                            onChange={handleGoalInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="weight_loss">Weight Loss</option>
                            <option value="muscle_gain">Muscle Gain</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="goalDeadline" className="block text-sm font-medium text-gray-700">
                            Target Date
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                id="goalDeadline"
                                name="goalDeadline"
                                value={goalFormData.goalDeadline}
                                onChange={handleGoalInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <Calendar size={18} className="absolute right-3 top-2.5 text-gray-400" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="weightGoal" className="block text-sm font-medium text-gray-700">
                            Target Weight (kg)
                        </label>
                        <input
                            type="number"
                            id="weightGoal"
                            name="weightGoal"
                            value={goalFormData.weightGoal}
                            onChange={handleGoalInputChange}
                            step="0.1"
                            min="30"
                            max="200"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="chestGoal" className="block text-sm font-medium text-gray-700">
                            Target Chest (cm)
                        </label>
                        <input
                            type="number"
                            id="chestGoal"
                            name="chestGoal"
                            value={goalFormData.chestGoal}
                            onChange={handleGoalInputChange}
                            step="0.1"
                            min="50"
                            max="200"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="waistGoal" className="block text-sm font-medium text-gray-700">
                            Target Waist (cm)
                        </label>
                        <input
                            type="number"
                            id="waistGoal"
                            name="waistGoal"
                            value={goalFormData.waistGoal}
                            onChange={handleGoalInputChange}
                            step="0.1"
                            min="50"
                            max="200"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="upperArmGoal" className="block text-sm font-medium text-gray-700">
                            Target Upper Arm (cm)
                        </label>
                        <input
                            type="number"
                            id="upperArmGoal"
                            name="upperArmGoal"
                            value={goalFormData.upperArmGoal}
                            onChange={handleGoalInputChange}
                            step="0.1"
                            min="15"
                            max="60"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="thighGoal" className="block text-sm font-medium text-gray-700">
                            Target Thigh (cm)
                        </label>
                        <input
                            type="number"
                            id="thighGoal"
                            name="thighGoal"
                            value={goalFormData.thighGoal}
                            onChange={handleGoalInputChange}
                            step="0.1"
                            min="30"
                            max="100"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="calfGoal" className="block text-sm font-medium text-gray-700">
                            Target Calf (cm)
                        </label>
                        <input
                            type="number"
                            id="calfGoal"
                            name="calfGoal"
                            value={goalFormData.calfGoal}
                            onChange={handleGoalInputChange}
                            step="0.1"
                            min="20"
                            max="60"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div className="mt-8">
                    <h4 className="text-md font-medium mb-4">Current Progress</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {goals.weightGoal && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium">Weight</span>
                                    <span className="text-sm text-gray-500">
                                        {getLatestMeasurement()?.weight?.toFixed(1)} kg → {goals.weightGoal} kg
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        style={{ width: `${progressToGoal('weight').percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                        {goals.chestGoal && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium">Chest</span>
                                    <span className="text-sm text-gray-500">
                                        {getLatestMeasurement()?.chest?.toFixed(1)} cm → {goals.chestGoal} cm
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        style={{ width: `${progressToGoal('chest').percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => setViewMode('measurements')}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                    >
                        Update Goals
                    </button>
                </div>
            </form>
        </div>
    );

    const renderChartsView = () => (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Progress Charts</h3>
                <div className="flex space-x-2">
                    <select
                        value={chartMetric}
                        onChange={(e) => setChartMetric(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    >
                        <option value="weight">Weight</option>
                        <option value="waist">Waist</option>
                        <option value="chest">Chest</option>
                        <option value="upperArm">Upper Arm</option>
                        <option value="thigh">Thigh</option>
                        <option value="calf">Calf</option>
                    </select>
                </div>
            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                        data={prepareChartData()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey={chartMetric}
                            stroke="#4f46e5"
                            activeDot={{ r: 8 }}
                            name={chartMetric.charAt(0).toUpperCase() + chartMetric.slice(1)}
                        />
                    </RechartsLineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    onClick={() => setViewMode('measurements')}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                    Back to Measurements
                </button>
            </div>
        </div>
    );

    // Main render
    return (
        <div className="container mx-auto px-4 py-8">
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            ) : (
                <>
                    {/* View Mode Tabs */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setViewMode('measurements')}
                                className={`px-4 py-2 rounded-lg ${viewMode === 'measurements' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                Measurements
                            </button>
                            <button
                                onClick={() => setViewMode('goals')}
                                className={`px-4 py-2 rounded-lg ${viewMode === 'goals' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                Goals
                            </button>
                            <button
                                onClick={() => setViewMode('charts')}
                                className={`px-4 py-2 rounded-lg ${viewMode === 'charts' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                Charts
                            </button>
                        </div>
                    </div>

                    {/* Render the appropriate view */}
                    {viewMode === 'measurements' && renderMeasurementsView()}
                    {viewMode === 'goals' && renderGoalsView()}
                    {viewMode === 'charts' && renderChartsView()}
                </>
            )}
        </div>
    );
};

export default MemberBodyMeasurements;