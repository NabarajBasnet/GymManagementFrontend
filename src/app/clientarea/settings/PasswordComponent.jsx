"use client";

import { Card } from "@/components/ui/card";
import { toast as sonnerToast } from "sonner";
import { useForm } from "react-hook-form";
import { FaLock } from "react-icons/fa";
import { useState } from "react";
import {
    Eye,
    EyeOff,
    AlertTriangle,
} from "lucide-react";

const PasswordComponent = () => {

    // React hook form
    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
        reset,
        watch,
        setValue,
        control
    } = useForm()

    // Password toggle
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Change basic details
    const changePassword = async (data) => {
        try {
            const response = await fetch(`https://fitbinary.com/api/tenant/change-password`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const responseBody = await response.json();
            if (response.ok) {
                sonnerToast.success(responseBody.message)
            } else {
                sonnerToast.error(responseBody.message)
            }
        } catch (error) {
            console.log("Error: ", error);
            sonnerToast.error(error.message)
        };
    };

    return (
        <Card className="w-full dark:border-none dark:bg-gray-800 shadow-xl mb-8 rounded-xl">
            {/* Change Password */}
            <div className="px-6 py-4 border-b border-gray-200 rounded-t-xl dark:border-gray-500 bg-gray-50 dark:bg-gray-800">
                <h3 className="font-medium dark:text-gray-200 text-gray-900 flex items-center">
                    <FaLock className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-200" />
                    Change Password
                </h3>
            </div>
            <div className="p-6">
                <form onSubmit={handleSubmit(changePassword)} className="space-y-4">
                    <div>
                        <label
                            htmlFor="currentPassword"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                        >
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                id="currentPassword"
                                {...register('currentPassword', {
                                    required: "Current password is required",
                                })}
                                className={`block w-full p-2 py-3 border dark:border-none rounded-sm shadow-sm dark:border-gray-500 bg-gray-50 dark:text-gray-200 dark:bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.currentPassword ? "border-red-300" : ""
                                    }`}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                        {errors.currentPassword && (
                            <p className="mt-1 text-xs font-medium text-red-600 flex items-center">
                                <AlertTriangle className="mr-1 h-4 w-4" />
                                {errors.currentPassword.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="newPassword"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                        >
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                id="newPassword"
                                {...register('newPassword', {
                                    required: "New password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters",
                                    },
                                })}
                                className={`block w-full p-2 py-3 border dark:border-none rounded-sm shadow-sm dark:border-gray-500 bg-gray-50 dark:text-gray-200 dark:bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.newPassword ? "border-red-300" : ""
                                    }`}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="mt-1 text-xs font-medium text-red-600 flex items-center">
                                <AlertTriangle className="mr-1 h-4 w-4" />
                                {errors.newPassword.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                        >
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                {...register('confirmPassword', {
                                    required: "Please confirm your password",
                                    validate: (value) =>
                                        value === watch('newPassword') || "Passwords do not match",
                                })}
                                className={`block w-full p-2 py-3 border dark:border-none rounded-sm shadow-sm dark:border-gray-500 bg-gray-50 dark:text-gray-200 dark:bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.confirmPassword ? "border-red-300" : ""
                                    }`}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1 text-xs font-medium text-red-600 flex items-center">
                                <AlertTriangle className="mr-1 h-4 w-4" />
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-4 py-2 rounded-md text-white ${isSubmitting
                                ? "bg-indigo-400"
                                : "bg-indigo-600 hover:bg-indigo-700"
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        >
                            {isSubmitting ? "Updating..." : "Change Password"}
                        </button>
                    </div>
                </form>
            </div>
        </Card>
    );
};

export default PasswordComponent;
