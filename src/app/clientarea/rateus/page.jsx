"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaStar, FaUser, FaPen } from "react-icons/fa";

export default function CreateTestimonial() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch,
    } = useForm();

    const [message, setMessage] = useState("");
    const [hoverRating, setHoverRating] = useState(0);
    const currentRating = watch("stars") || 0;

    const onSubmit = async (data) => {
        try {
            const response = await fetch('https://fitbinary.com/api/testimonals/create', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            const resBody = await response.json();
            console.log(resBody);
            setMessage("✅ Testimonial submitted successfully!");
            reset();
            setHoverRating(0);
        } catch (err) {
            setMessage(
                err?.response?.data?.message || "❌ Failed to submit testimonial."
            );
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-0">
            {/* Success/Error Message */}
            {message && (
                <div className={`mb-6 p-4 rounded-xl border-l-4 ${message.includes('✅')
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-400 text-green-700 dark:text-green-300'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-400 text-red-700 dark:text-red-300'
                    } transition-all duration-300`}>
                    <p className="font-medium text-sm md:text-base">{message}</p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Position Input */}
                <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <FaUser className="w-4 h-4 text-blue-500" />
                        Your Position
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="e.g. Trainer, Member, Coach"
                            {...register("position", { required: "Position is required" })}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl 
                                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                     placeholder-gray-400 dark:placeholder-gray-500
                                     focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 
                                     transition-all duration-200 outline-none
                                     hover:border-gray-300 dark:hover:border-gray-500"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        </div>
                    </div>
                    {errors.position && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-2 animate-pulse">
                            {errors.position.message}
                        </p>
                    )}
                </div>

                {/* Rating Section */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <FaStar className="w-4 h-4 text-yellow-500" />
                        Your Rating
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex items-center justify-center sm:justify-start">
                            {[1, 2, 3, 4, 5, 6].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    className={`text-2xl md:text-3xl p-2 rounded-full transition-all duration-200 transform hover:scale-110 ${star <= (hoverRating || currentRating)
                                        ? 'text-yellow-400 drop-shadow-lg'
                                        : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
                                        }`}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setValue("stars", star)}
                                >
                                    <FaStar />
                                </button>
                            ))}
                        </div>
                        {currentRating > 0 && (
                            <div className="flex items-center justify-center sm:justify-start">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                                    {currentRating} Star{currentRating > 1 ? 's' : ''}
                                </span>
                            </div>
                        )}
                    </div>
                    <input
                        type="hidden"
                        {...register("stars", {
                            required: "Rating is required",
                            valueAsNumber: true,
                        })}
                    />
                    {errors.stars && (
                        <p className="text-red-500 dark:text-red-400 text-sm animate-pulse">
                            {errors.stars.message}
                        </p>
                    )}
                </div>

                {/* Description Textarea */}
                <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <FaPen className="w-4 h-4 text-purple-500" />
                        Your Feedback
                    </label>
                    <div className="relative">
                        <textarea
                            placeholder="Share your experience with us... What did you like most? How can we improve?"
                            {...register("description", {
                                required: "Description is required",
                            })}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl 
                                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                     placeholder-gray-400 dark:placeholder-gray-500
                                     focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 
                                     transition-all duration-200 outline-none resize-none
                                     hover:border-gray-300 dark:hover:border-gray-500 min-h-[120px]"
                            rows={5}
                        />
                        <div className="absolute bottom-3 right-3 pointer-events-none">
                            <div className="w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        </div>
                    </div>
                    {errors.description && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-2 animate-pulse">
                            {errors.description.message}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                    <button
                        type="submit"
                        className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 
                                 hover:from-blue-600 hover:to-purple-700 
                                 dark:from-blue-600 dark:to-purple-700 
                                 dark:hover:from-blue-700 dark:hover:to-purple-800
                                 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl 
                                 transform hover:scale-105 transition-all duration-200 
                                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                                 focus:ring-4 focus:ring-blue-500/20 outline-none
                                 flex items-center justify-center gap-2 min-w-[160px]"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <FaStar className="w-4 h-4" />
                                Submit Review
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}