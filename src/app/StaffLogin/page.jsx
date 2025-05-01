'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { UserCircle, Lock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

function App() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setError,
        formState: { isSubmitting, errors }
    } = useForm();

    const onLogin = async (data) => {
        const { email, password } = data;
        const finalData = { email, password };
        try {
            const response = await fetch(`https://38ff26b62e8fb10c5911b95dbbd1747b.serveo.net/api/staff-login/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(finalData)
            });
            const responseBody = await response.json();

            if (response.ok) {
                toast.success('Login successful! Redirecting...');
                setTimeout(() => {
                    router.push('/MyProfile');
                }, 1000);
            } else {
                if (response.status === 400 && responseBody.field === 'email') {
                    setError('email', {
                        type: 'manual',
                        message: responseBody.message
                    });
                } else if (response.status === 404 && responseBody.field === 'email') {
                    setError('email', {
                        type: 'manual',
                        message: responseBody.message
                    });
                } else if (response.status === 403 && responseBody.field === 'password') {
                    setError('password', {
                        type: 'manual',
                        message: responseBody.message
                    });
                } else {
                    toast.error('An unexpected error occurred. Please try again.');
                }
            }
        } catch (error) {
            console.log("Error: ", error);
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transform transition-all duration-300 hover:shadow-3xl">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="inline-block p-4 rounded-full bg-emerald-50 mb-4">
                        <UserCircle className="w-12 h-12 text-emerald-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Revive Fitness
                    </h1>
                    <h2 className="text-lg text-gray-600">Staff Login</h2>
                </div>

                <form onSubmit={handleSubmit(onLogin)} className="space-y-6">
                    {/* Email Field */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                {...register('email', { required: 'Email is required' })}
                                type="email"
                                id="email"
                                className={`
                                    w-full pl-12 pr-4 py-3 rounded-lg border 
                                    ${errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'} 
                                    focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200
                                    bg-gray-50
                                `}
                                placeholder="Enter your email"
                            />
                            <UserCircle className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        </div>
                        {errors.email && (
                            <p className="text-sm text-red-600 mt-1 flex items-center">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                {...register('password', { required: 'Password is required' })}
                                type="password"
                                id="password"
                                className={`
                                    w-full pl-12 pr-4 py-3 rounded-lg border 
                                    ${errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'} 
                                    focus:border-transparent focus:outline-none focus:ring-2 transition-all duration-200
                                    bg-gray-50
                                `}
                                placeholder="Enter your password"
                            />
                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        </div>
                        {errors.password && (
                            <p className="text-sm text-red-600 mt-1 flex items-center">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`
                            w-full py-3 px-4 rounded-lg text-white font-medium
                            flex items-center justify-center space-x-2
                            transition-all duration-200
                            ${isSubmitting
                                ? 'bg-emerald-400 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
                            }
                            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                            transform active:scale-98
                        `}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin h-5 w-5" />
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <span>Sign In</span>
                        )}
                    </button>
                </form>

                {/* Additional Info */}
                <p className="mt-6 text-center text-sm text-gray-500">
                    Having trouble logging in? Contact your administrator
                </p>
            </div>
        </div>
    );
}

export default App;