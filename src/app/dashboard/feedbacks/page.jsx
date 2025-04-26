'use client';

import { useState, useEffect } from 'react';
import { CalendarDays, Filter, Search, Check, X, MessageSquare, Star } from 'lucide-react';

export default function FeedbacksPage() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [currentFeedback, setCurrentFeedback] = useState(null);
    const [responseText, setResponseText] = useState('');

    // Simulated data fetch - replace with your actual API call
    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                // Replace with your actual API endpoint
                // const response = await fetch('/api/feedbacks');
                // const data = await response.json();

                // Simulated data for demonstration
                const data = [
                    {
                        id: 1,
                        memberId: 'M001',
                        memberName: 'John Doe',
                        subject: 'Equipment Issue',
                        message: 'The treadmill in the cardio section has been making strange noises for the past week.',
                        date: '2025-04-22',
                        status: 'pending',
                        rating: 3,
                    },
                    {
                        id: 2,
                        memberId: 'M015',
                        memberName: 'Sarah Wilson',
                        subject: 'Great Personal Training',
                        message: 'I wanted to commend Mark for his excellent personal training sessions. He has helped me achieve my fitness goals faster than expected.',
                        date: '2025-04-24',
                        status: 'responded',
                        rating: 5,
                        response: 'Thank you for your positive feedback! We will share this with Mark.'
                    },
                    {
                        id: 3,
                        memberId: 'M042',
                        memberName: 'Michael Brown',
                        subject: 'Cleanliness Concern',
                        message: 'The locker rooms need more frequent cleaning, especially during peak hours.',
                        date: '2025-04-25',
                        status: 'pending',
                        rating: 2,
                    },
                    {
                        id: 4,
                        memberId: 'M078',
                        memberName: 'Emily Johnson',
                        subject: 'Class Schedule Suggestion',
                        message: 'Would it be possible to add more yoga classes in the evening? The current ones are always full.',
                        date: '2025-04-20',
                        status: 'pending',
                        rating: 4,
                    },
                ];

                setFeedbacks(data);
                setFilteredFeedbacks(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching feedbacks:', error);
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    // Filter and sort feedbacks
    useEffect(() => {
        let result = [...feedbacks];

        // Apply status filter
        if (filterStatus !== 'all') {
            result = result.filter(item => item.status === filterStatus);
        }

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(item =>
                item.memberName.toLowerCase().includes(term) ||
                item.subject.toLowerCase().includes(term) ||
                item.message.toLowerCase().includes(term)
            );
        }

        // Apply sorting
        switch (sortBy) {
            case 'date':
                result.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'status':
                result.sort((a, b) => {
                    if (a.status === 'pending' && b.status !== 'pending') return -1;
                    if (a.status !== 'pending' && b.status === 'pending') return 1;
                    return 0;
                });
                break;
            default:
                break;
        }

        setFilteredFeedbacks(result);
    }, [feedbacks, filterStatus, searchTerm, sortBy]);

    // Handle feedback response
    const handleRespond = async () => {
        if (!currentFeedback || !responseText.trim()) return;

        try {
            // In a real app, make an API call to update the feedback
            // const response = await fetch(`/api/feedbacks/${currentFeedback.id}/respond`, {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ response: responseText })
            // });

            // Simulating successful response
            const updatedFeedbacks = feedbacks.map(feedback => {
                if (feedback.id === currentFeedback.id) {
                    return {
                        ...feedback,
                        status: 'responded',
                        response: responseText
                    };
                }
                return feedback;
            });

            setFeedbacks(updatedFeedbacks);
            setResponseText('');
            setCurrentFeedback(null);

            // Show success notification (implement as needed)
            alert('Response sent successfully!');
        } catch (error) {
            console.error('Error responding to feedback:', error);
            alert('Failed to send response. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getRatingStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <Star
                    key={i}
                    size={16}
                    className={i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                />
            );
        }
        return stars;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-xl font-semibold">Loading feedbacks...</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Member Feedbacks</h1>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={20} className="text-gray-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search feedbacks..."
                        className="pl-10 p-2 border border-gray-300 rounded w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter size={18} className="text-gray-500" />
                        </div>
                        <select
                            className="pl-10 p-2 border border-gray-300 rounded"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="responded">Responded</option>
                        </select>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CalendarDays size={18} className="text-gray-500" />
                        </div>
                        <select
                            className="pl-10 p-2 border border-gray-300 rounded"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="date">Sort by Date</option>
                            <option value="rating">Sort by Rating</option>
                            <option value="status">Sort by Status</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Feedback Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-blue-700">Total Feedbacks</h3>
                    <p className="text-3xl font-bold">{feedbacks.length}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-yellow-700">Pending Responses</h3>
                    <p className="text-3xl font-bold">
                        {feedbacks.filter(f => f.status === 'pending').length}
                    </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-green-700">Average Rating</h3>
                    <p className="text-3xl font-bold">
                        {(feedbacks.reduce((sum, item) => sum + item.rating, 0) / feedbacks.length).toFixed(1)}
                    </p>
                </div>
            </div>

            {/* Feedback List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {filteredFeedbacks.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No feedbacks match your current filters.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredFeedbacks.map((feedback) => (
                            <div key={feedback.id} className="p-4 hover:bg-gray-50">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-medium text-lg">{feedback.subject}</h3>
                                        <p className="text-sm text-gray-600">
                                            From: {feedback.memberName} (ID: {feedback.memberId})
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm text-gray-500">{formatDate(feedback.date)}</span>
                                        <span className={`text-sm px-2 py-1 rounded-full ${feedback.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-green-100 text-green-800'
                                            }`}>
                                            {feedback.status === 'pending' ? 'Pending' : 'Responded'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-2 flex items-center">
                                    <div className="flex mr-2">
                                        {getRatingStars(feedback.rating)}
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {feedback.rating}/5
                                    </span>
                                </div>

                                <p className="text-gray-700 mb-3">{feedback.message}</p>

                                {feedback.response && (
                                    <div className="bg-blue-50 p-3 rounded mb-3">
                                        <p className="text-sm font-medium text-blue-800 mb-1">Your Response:</p>
                                        <p className="text-sm text-gray-700">{feedback.response}</p>
                                    </div>
                                )}

                                <div className="flex justify-end">
                                    {feedback.status === 'pending' ? (
                                        <button
                                            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            onClick={() => setCurrentFeedback(feedback)}
                                        >
                                            <MessageSquare size={16} className="mr-1" />
                                            Respond
                                        </button>
                                    ) : (
                                        <button
                                            className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                            onClick={() => setCurrentFeedback(feedback)}
                                        >
                                            <MessageSquare size={16} className="mr-1" />
                                            View/Edit Response
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Response Modal */}
            {currentFeedback && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
                        <div className="p-4 border-b">
                            <h2 className="text-xl font-semibold">
                                {currentFeedback.status === 'pending' ? 'Respond to Feedback' : 'Edit Response'}
                            </h2>
                        </div>

                        <div className="p-4">
                            <div className="mb-4">
                                <h3 className="font-medium">{currentFeedback.subject}</h3>
                                <p className="text-sm text-gray-600">
                                    From {currentFeedback.memberName} on {formatDate(currentFeedback.date)}
                                </p>
                            </div>

                            <div className="mb-4 p-3 bg-gray-50 rounded">
                                <p>{currentFeedback.message}</p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Your Response:</label>
                                <textarea
                                    className="w-full p-2 border border-gray-300 rounded h-32"
                                    value={responseText || currentFeedback.response || ''}
                                    onChange={(e) => setResponseText(e.target.value)}
                                    placeholder="Type your response here..."
                                />
                            </div>
                        </div>

                        <div className="p-4 border-t bg-gray-50 flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                                onClick={() => {
                                    setCurrentFeedback(null);
                                    setResponseText('');
                                }}
                            >
                                <span className="flex items-center">
                                    <X size={16} className="mr-1" />
                                    Cancel
                                </span>
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                onClick={handleRespond}
                                disabled={!responseText && !currentFeedback.response}
                            >
                                <span className="flex items-center">
                                    <Check size={16} className="mr-1" />
                                    {currentFeedback.status === 'pending' ? 'Send Response' : 'Update Response'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}