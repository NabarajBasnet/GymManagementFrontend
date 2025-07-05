'use client';

import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    Lock,
    Mail,
    Eye,
    EyeOff,
    AlertCircle,
    Loader2,
    User,
    ArrowRight,
    Shield
} from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

const MemberLogin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState('');
    const router = useRouter();

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm();

    const loginMember = async (data) => {
        try {
            const { email, password } = data;
            const credentials = { email, password }
            const response = await fetch('http://localhost:3000/api/member/auth/member-login', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials),
            });

            const responseBody = await response.json();
            if (response.ok) {
                toast.success(responseBody.message);
                router.push(`/member/${responseBody.redirect}`);
            } else {
                toast.error(responseBody.message);
                setLoginError(responseBody.message);
            }
        } catch (error) {
            console.log("Error: ", error);
            setLoginError('An unexpected error occurred. Please try again.');
        };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Main Card */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 p-8 space-y-8">

                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/25">
                            <User className="w-8 h-8 text-white" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                Welcome Back
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                Sign in to access your fitness dashboard and track your progress
                            </p>
                        </div>
                    </div>

                    {/* Error Alert */}
                    {loginError && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-4 animate-in slide-in-from-top-2 duration-300">
                            <div className="flex items-start space-x-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                        {loginError}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit(loginMember)} className="space-y-6">

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Please enter a valid email address'
                                        }
                                    })}
                                    className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border-2 transition-all duration-200 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-0 ${errors.email
                                        ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400'
                                        : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 hover:border-slate-300 dark:hover:border-slate-600'
                                        }`}
                                    placeholder="Enter your email address"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm font-medium text-red-600 dark:text-red-400 animate-in slide-in-from-top-1 duration-200">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters'
                                        }
                                    })}
                                    className={`w-full pl-12 pr-12 py-3.5 bg-slate-50 dark:bg-slate-900/50 border-2 transition-all duration-200 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-0 ${errors.password
                                        ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400'
                                        : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 hover:border-slate-300 dark:hover:border-slate-600'
                                        }`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm font-medium text-red-600 dark:text-red-400 animate-in slide-in-from-top-1 duration-200">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="w-4 h-4 text-indigo-600 bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-2 transition-colors duration-200"
                                />
                                <label htmlFor="remember-me" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Remember me
                                </label>
                            </div>

                            <Link
                                href="/forgot-password"
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-indigo-400 disabled:to-purple-400 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 transform ${isSubmitting ? 'scale-95' : 'hover:scale-[1.02] active:scale-95'
                                } focus:outline-none focus:ring-4 focus:ring-indigo-500/50`}
                        >
                            <div className="flex items-center justify-center space-x-2">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Signing you in...</span>
                                    </>
                                ) : (
                                    <>
                                        <Shield className="w-5 h-5" />
                                        <span>Sign In</span>
                                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                                    </>
                                )}
                            </div>

                            {/* Button shine effect */}
                            <div className="absolute inset-0 -top-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-100%] transition-transform duration-700 hover:translate-x-[100%]"></div>
                        </button>
                    </form>
                </div>

                {/* Security Badge */}
                <div className="mt-6 text-center">
                    <div className="inline-flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-3 py-2 rounded-full border border-slate-200/50 dark:border-slate-700/50">
                        <Shield className="w-3 h-3" />
                        <span>Your data is secure and encrypted</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberLogin;