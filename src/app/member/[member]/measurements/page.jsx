'use client';

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { usePagination } from "@/hooks/Pagination";
import Pagination from "@/components/ui/CustomPagination";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { IoIosClose } from "react-icons/io";
import { useState, useEffect } from 'react';
import {
    ArrowUp,
    ArrowDown,
    Plus,
    Trash2,
    Edit,
} from 'lucide-react';
import { MeasurementGraph } from "./measurementGraph";
import { useMember } from "@/components/Providers/LoggedInMemberProvider";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "@/components/Loader/Loader";

const MemberBodyMeasurements = () => {
    // States for managing measurements and UI
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [viewMode, setViewMode] = useState('measurements');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(6);

    // get logged in member
    const { member } = useMember();
    const memberId = member?.loggedInMember?._id || '';
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm();

    // Add Body Measurements
    const submitBodyMeasurements = async (data) => {
        try {
            const {
                bodyMeasureDate,
                weight,
                height,
                chest,
                upperArm,
                foreArm,
                waist,
                hip,
                thigh,
                calf,
                notes
            } = data;

            const jsonData = {
                bodyMeasureDate,
                weight,
                height,
                chest,
                upperArm,
                foreArm,
                waist,
                hip,
                thigh,
                calf,
                notes
            };

            const response = await fetch(`http://88.198.112.156:3000/api/member/bodymeasurements/${memberId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData),
            });

            const responseBody = await response.json();
            if (response.ok) {
                reset();
                setIsAdding(false);
                toast.success(responseBody.message);
                queryClient.invalidateQueries(['bodymeasurements']);
            };

        } catch (error) {
            console.log("Error: ", error);
        };
    };

    // Fetch All Body Measurements
    const getAllBodyMeasurements = async ({ queryKey }) => {
        const [, page] = queryKey;
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/member/bodymeasurements/${memberId}?page=${page}&limit=${limit}`);
            const responseBody = await response.json();
            return responseBody;
        } catch (error) {
            console.log('Error', error);
        };
    };

    const { data, isLoading } = useQuery({
        queryFn: getAllBodyMeasurements,
        queryKey: ['bodymeasurements', currentPage, limit],
        enabled: !!memberId
    });

    const { bodyMeasurements, totalBodyMeasurements, totalPages } = data || {};

    const { range, setPage, active } = usePagination({
        total: totalPages ? totalPages : 1,
        siblings: 1,
        boundaries: 1,
        page: currentPage,
        onChange: (page) => {
            setCurrentPage(page);
        },
    });

    const startEntry = (currentPage - 1) * limit + 1;
    const endEntry = Math.min(currentPage * limit, totalBodyMeasurements);

    // Form actions
    const handleAddMeasurement = () => {
        setIsAdding(true);
        setEditingId(null);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://88.198.112.156:3000/api/member/bodymeasurements/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const responseBody = await response.json();
            if (response.ok) {
                toast.success(responseBody.message);
                queryClient.invalidateQueries(['bodymeasurements']);
            };
        } catch (error) {
            console.error("Error deleting measurement:", error);
            toast.error(error.message);
        };
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const renderMeasurementsView = () => (
        <>
            {/* Add/Edit Form */}
            {(isAdding || editingId) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
                    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">
                                {editingId ? 'Edit Measurement' : 'Add New Measurement'}
                            </h3>
                            <button
                                onClick={() => {
                                    setIsAdding(false);
                                    setEditingId(null);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <IoIosClose size={30} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(submitBodyMeasurements)}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-1">
                                    <label htmlFor="bodyMeasureDate" className="block text-sm font-medium text-gray-700">
                                        Date
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            id="bodyMeasureDate"
                                            {...register('bodyMeasureDate')}
                                            name="bodyMeasureDate"
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                                        Weight (kg)
                                    </label>
                                    <input
                                        type="number"
                                        id="weight"
                                        {...register('weight')}
                                        name="weight"
                                        step="0.1"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
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
                                        {...register('height')}
                                        name="height"
                                        step="0.1"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="chest" className="block text-sm font-medium text-gray-700">
                                        Chest (inch)
                                    </label>
                                    <input
                                        type="number"
                                        id="chest"
                                        name="chest"
                                        {...register('chest')}
                                        step="0.1"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="waist" className="block text-sm font-medium text-gray-700">
                                        Waist (inch)
                                    </label>
                                    <input
                                        type="number"
                                        id="waist"
                                        name="waist"
                                        {...register('waist')}
                                        step="0.1"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="upperArm" className="block text-sm font-medium text-gray-700">
                                        Upper Arm (inch)
                                    </label>
                                    <input
                                        type="number"
                                        id="upperArm"
                                        name="upperArm"
                                        {...register('upperArm')}
                                        step="0.1"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="foreArm" className="block text-sm font-medium text-gray-700">
                                        Forearm (inch)
                                    </label>
                                    <input
                                        type="number"
                                        id="foreArm"
                                        name="foreArm"
                                        {...register('foreArm')}
                                        step="0.1"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="thigh" className="block text-sm font-medium text-gray-700">
                                        Thigh (inch)
                                    </label>
                                    <input
                                        type="number"
                                        id="thigh"
                                        name="thigh"
                                        {...register('thigh')}
                                        step="0.1"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="calf" className="block text-sm font-medium text-gray-700">
                                        Calf (inch)
                                    </label>
                                    <input
                                        type="number"
                                        id="calf"
                                        name="calf"
                                        {...register('calf')}
                                        step="0.1"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                {/* Custom metrics field */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Hip Circumference (inch)
                                    </label>
                                    <input
                                        type="number"
                                        {...register('hip')}
                                        step="0.1"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div className="md:col-span-2 lg:col-span-3 space-y-1">
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                        Notes
                                    </label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        {...register('notes')}
                                        rows={2}
                                        className="w-full p-2 border border-gray-300 h-[150px] rounded-md focus:ring-indigo-500 focus:border-indigo-500"
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
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                                >
                                    {editingId ? 'Update' : 'Save'} Measurement
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Measurement History */}
            {
                isLoading ? (
                    <div>
                        <Loader />
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-medium">My Measurement History</h3>
                            <div className="text-sm text-gray-500">
                                {bodyMeasurements?.length} records
                            </div>
                        </div>
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
                                    {Array.isArray(bodyMeasurements) && bodyMeasurements.length > 0 ? (
                                        bodyMeasurements.map((measurement) => (
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
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="outline" className='text-red-600 hover:text-red-600 border-none hover:bg-transparent bg-transparent'>
                                                                    <Trash2 size={16} />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This action cannot be undone. This will permanently delete your
                                                                        body measurement and remove data from our servers.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction className='bg-red-500 hover:bg-red-600' onClick={() => handleDelete(measurement._id)}>Continue</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
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
                            <p className="text-sm text-gray-500">
                                Showing <span className="font-medium">{startEntry}</span> to <span className="font-medium">{endEntry}</span> of{' '}
                                <span className="font-medium">{totalBodyMeasurements}</span> results
                            </p>

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
                    </div>
                )
            }
        </>
    );

    const renderChartsView = () => (
        <div>
            <MeasurementGraph />
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
                    <div className="w-full">
                        <div className="w-full flex justify-between space-x-2 mb-6">
                            <div className='w-full flex space-x-2'>
                                <button
                                    onClick={() => setViewMode('measurements')}
                                    className={`md:px-4 px-2 py-2 rounded-sm ${viewMode === 'measurements' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    Measurements
                                </button>
                                <button
                                    onClick={() => setViewMode('charts')}
                                    className={`md:px-4 px-2 py-2 rounded-sm ${viewMode === 'charts' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    Graphs
                                </button>
                            </div>

                            <div className='w-full flex justify-end'>
                                <button
                                    onClick={handleAddMeasurement}
                                    className="md:px-4 px-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-sm flex items-center"
                                >
                                    <Plus size={16} className="mr-1 text-white" />
                                    {isSubmitting ? (<>
                                        <AiOutlineLoading3Quarters className="animate-spin" />Procesing...
                                    </>) : (<><h1>Add Measurement</h1></>)}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Render the appropriate view */}
                    {viewMode === 'measurements' && renderMeasurementsView()}
                    {viewMode === 'charts' && renderChartsView()}
                </>
            )}
        </div>
    );
};

export default MemberBodyMeasurements;
