'use client';

import { useState } from 'react';
import { Star, StarFill } from 'react-bootstrap-icons';

const FeedbackSection = () => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [selectedTrainer, setSelectedTrainer] = useState('');
    const [feedbackType, setFeedbackType] = useState('suggestion');
    const [feedbackText, setFeedbackText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const trainers = [
        { id: 1, name: "Sarah Taylor", status: "online", avatar: "/api/placeholder/40/40", specialty: "Strength Training" },
        { id: 2, name: "Mike Richards", status: "offline", avatar: "/api/placeholder/40/40", specialty: "Cardio & Endurance" },
        { id: 3, name: "Elena Davis", status: "online", avatar: "/api/placeholder/40/40", specialty: "Yoga & Flexibility" }
    ];

    const memberData = {
        name: "Alex Johnson",
        membershipStatus: "Premium",
        membershipId: "MEM-2025-4872",
        qrCodeUrl: "/api/placeholder/300/300",
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!feedbackText.trim()) return;

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            console.log({
                rating,
                trainerId: selectedTrainer,
                type: feedbackType,
                feedback: feedbackText
            });
            setIsSubmitting(false);
            setSubmitSuccess(true);
            resetForm();
        }, 1500);
    };

    const resetForm = () => {
        setTimeout(() => {
            setSubmitSuccess(false);
        }, 3000);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Provide Feedback</h2>

            {submitSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center">
                        <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <h3 className="text-lg font-medium text-green-800">Thank you for your feedback!</h3>
                    </div>
                    <p className="mt-2 text-green-700">We appreciate you taking the time to share your experience with us.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 md:p-8">
                        <form onSubmit={handleSubmit}>
                            {/* Rating Section */}
                            <div className="mb-6">
                                <label className="block text-gray-700 font-medium mb-3">Overall Rating</label>
                                <div className="flex items-center space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            className="focus:outline-none"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                                        >
                                            {(hoverRating || rating) >= star ? (
                                                <StarFill size={28} className="text-yellow-400" />
                                            ) : (
                                                <Star size={28} className="text-yellow-400 opacity-50" />
                                            )}
                                        </button>
                                    ))}
                                    <span className="ml-2 text-gray-500 text-sm">
                                        {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : "Not rated"}
                                    </span>
                                </div>
                            </div>

                            {/* Trainer Selection */}
                            <div className="mb-6">
                                <label htmlFor="trainer" className="block text-gray-700 font-medium mb-3">
                                    Trainer (Optional)
                                </label>
                                <select
                                    id="trainer"
                                    value={selectedTrainer}
                                    onChange={(e) => setSelectedTrainer(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                >
                                    <option value="">Select a trainer</option>
                                    {trainers.map(trainer => (
                                        <option key={trainer.id} value={trainer.id}>
                                            {trainer.name} {trainer.status === 'online' && '(Available)'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Feedback Type */}
                            <div className="mb-6">
                                <label htmlFor="feedbackType" className="block text-gray-700 font-medium mb-3">
                                    Feedback Type
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { value: 'suggestion', label: 'Suggestion' },
                                        { value: 'compliment', label: 'Compliment' },
                                        { value: 'complaint', label: 'Complaint' },
                                        { value: 'other', label: 'Other' }
                                    ].map((type) => (
                                        <div key={type.value} className="flex items-center">
                                            <input
                                                id={`type-${type.value}`}
                                                name="feedbackType"
                                                type="radio"
                                                checked={feedbackType === type.value}
                                                onChange={() => setFeedbackType(type.value)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                            />
                                            <label htmlFor={`type-${type.value}`} className="ml-2 block text-sm text-gray-700">
                                                {type.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Feedback Text */}
                            <div className="mb-6">
                                <label htmlFor="feedback" className="block text-gray-700 font-medium mb-3">
                                    Your Feedback
                                </label>
                                <textarea
                                    id="feedback"
                                    rows={5}
                                    value={feedbackText}
                                    onChange={(e) => setFeedbackText(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                    placeholder="Please share your detailed feedback about your experience..."
                                    required
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Minimum 20 characters (currently {feedbackText.length})
                                </p>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-8">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || feedbackText.length < 20}
                                    className={`w-full py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${isSubmitting
                                        ? 'bg-indigo-400 cursor-not-allowed'
                                        : feedbackText.length < 20
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Submitting...
                                        </span>
                                    ) : (
                                        'Submit Feedback'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Member Info Footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-700">{memberData.name}</p>
                                <p className="text-xs text-gray-500">{memberData.membershipStatus} Member • {memberData.membershipId}</p>
                            </div>
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                <img
                                    src={memberData.qrCodeUrl}
                                    alt="Member QR Code"
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(memberData.membershipId)}`;
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackSection;