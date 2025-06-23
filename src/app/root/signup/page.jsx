'use client';

import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { toast as soonerToast } from "sonner";
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    X,
    User,
    Lock,
    Eye,
    EyeOff,
    AtSign,
    Phone,
    MapPin,
    Shield,
    Crown,
    Server,
    Database,
    Settings,
    ArrowRight,
    Github,
    Linkedin,
    UserPlus
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RootSignUpPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const {
        register,
        reset,
        handleSubmit,
        watch,
        formState: { isSubmitting, errors }
    } = useForm();

    const watchPassword = watch('password', '');

    const onSignUp = async (data) => {
        try {
            const response = await fetch('http://88.198.112.156:3100/api/rootuser/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });
            const responseBody = await response.json();
            if (response.ok) {
                toast.success('Account created successfully!');
                soonerToast.success('Account created successfully!');
                reset();
                router.push('/root/login');
            } else {
                toast.error(responseBody.message || 'Failed to create account');
                soonerToast.error(responseBody.message || 'Failed to create account');
            }
        } catch (error) {
            toast.error('An unexpected error occurred. Please try again.');
            soonerToast.error('An unexpected error occurred. Please try again.');
            console.log("Error: ", error);
        }
    };

    const FormField = ({ label, icon: Icon, type = "text", placeholder, registerProps, error, showPasswordToggle = false, passwordVisible, onTogglePassword }) => (
        <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">{label}</Label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Icon className="w-5 h-5 text-gray-400 group-focus-within:text-red-400 transition-colors duration-200" />
                </div>
                <Input
                    className="w-full pl-12 pr-12 py-3.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 hover:bg-white/10 transition-all duration-200"
                    type={showPasswordToggle && passwordVisible ? "text" : type}
                    placeholder={placeholder}
                    {...registerProps}
                />
                {showPasswordToggle && (
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-4"
                        onClick={onTogglePassword}
                    >
                        {passwordVisible ? 
                            <EyeOff className="w-5 h-5 text-gray-400 hover:text-red-400 transition-colors duration-200" /> : 
                            <Eye className="w-5 h-5 text-gray-400 hover:text-red-400 transition-colors duration-200" />
                        }
                    </button>
                )}
            </div>
            {error && (
                <div className="flex items-center space-x-2 text-red-400 text-sm mt-2">
                    <X className="w-4 h-4 flex-shrink-0" />
                    <span>{error.message}</span>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden flex items-center justify-center p-4">
            {/* Subtle grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

            {/* Gradient orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>

            {/* Main Card Container */}
            <div className="relative z-10 w-full max-w-7xl">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="grid lg:grid-cols-5 h-full">
                        {/* Left Panel - Root Admin Branding */}
                        <div className="lg:col-span-2 bg-gradient-to-br from-red-600 via-red-700 to-red-800 relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute top-0 left-0 w-full h-full bg-[url(&quot;data:image/svg+xml,%3Csvg height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&quot;)]"></div>
                            <div className="relative z-10 flex flex-col justify-center h-full p-8 lg:p-12 text-white">
                                <div className="max-w-sm">
                                    {/* Root Admin Icon */}
                                    <div className="mb-8">
                                        <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center mb-6 group hover:bg-white/20 transition-all duration-300">
                                            <Crown className="w-10 h-10 text-yellow-300 group-hover:scale-110 transition-transform duration-300" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                <span className="text-sm text-green-300 font-medium">Setup Required</span>
                                            </div>
                                            <h1 className="text-3xl lg:text-4xl font-bold mb-3">
                                                Initialize System
                                            </h1>
                                            <p className="text-red-100 text-lg leading-relaxed">
                                                Create your root administrator account to setup the gym management system.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Admin Features */}
                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center space-x-3 group">
                                            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                                <Server className="w-4 h-4 text-red-200" />
                                            </div>
                                            <span className="text-red-100 text-sm">Complete System Control</span>
                                        </div>
                                        <div className="flex items-center space-x-3 group">
                                            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                                <Database className="w-4 h-4 text-red-200" />
                                            </div>
                                            <span className="text-red-100 text-sm">Advanced User Management</span>
                                        </div>
                                        <div className="flex items-center space-x-3 group">
                                            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                                <Settings className="w-4 h-4 text-red-200" />
                                            </div>
                                            <span className="text-red-100 text-sm">Full Operations Oversight</span>
                                        </div>
                                    </div>

                                    {/* Security Notice */}
                                    <div className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                                        <div className="flex items-start space-x-3">
                                            <Shield className="w-5 h-5 text-yellow-300 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h3 className="text-sm font-semibold text-white mb-1">Security Notice</h3>
                                                <p className="text-xs text-red-100 leading-relaxed">
                                                    Root access provides full system privileges. Keep your credentials secure and confidential.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Signup Form */}
                        <div className="lg:col-span-3 flex items-center justify-center p-6 sm:p-8 lg:p-12 overflow-y-auto">
                            <div className="w-full max-w-lg">
                                {/* Form Header */}
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                        <UserPlus className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                                        Create Root Account
                                    </h2>
                                    <p className="text-gray-400">
                                        Setup your gym management system administrator account
                                    </p>
                                </div>

                                {/* Signup Form */}
                                <form onSubmit={handleSubmit(onSignUp)} className="space-y-6">
                                    <FormField
                                        label="Full Name"
                                        icon={User}
                                        placeholder="Enter your full name"
                                        registerProps={register('fullName', {
                                            required: "Full name is required",
                                            pattern: {
                                                value: /^[a-zA-Z\s]+$/,
                                                message: "Please enter a valid full name"
                                            }
                                        })}
                                        error={errors.fullName}
                                    />

                                    <FormField
                                        label="Administrator Email"
                                        icon={AtSign}
                                        type="email"
                                        placeholder="admin@yourgym.com"
                                        registerProps={register('email', {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Please enter a valid email"
                                            }
                                        })}
                                        error={errors.email}
                                    />

                                    <FormField
                                        label="Phone Number"
                                        icon={Phone}
                                        type="tel"
                                        placeholder="+1 (555) 123-4567"
                                        registerProps={register('phone', {
                                            required: "Phone is required",
                                            pattern: {
                                                value: /^[0-9+\-\s()]{10,15}$/,
                                                message: "Please enter a valid phone number"
                                            }
                                        })}
                                        error={errors.phone}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            label="Root Password"
                                            icon={Lock}
                                            type="password"
                                            placeholder="Create secure password"
                                            registerProps={register('password', {
                                                required: "Password is required"
                                            })}
                                            error={errors.password}
                                            showPasswordToggle={true}
                                            passwordVisible={showPassword}
                                            onTogglePassword={() => setShowPassword(!showPassword)}
                                        />

                                        <FormField
                                            label="Confirm Password"
                                            icon={Lock}
                                            type="password"
                                            placeholder="Confirm password"
                                            registerProps={register('confirmPassword', {
                                                required: "Confirm Password is required",
                                                validate: value =>
                                                    value === watchPassword || "Passwords do not match"
                                            })}
                                            error={errors.confirmPassword}
                                            showPasswordToggle={true}
                                            passwordVisible={showConfirmPassword}
                                            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                                        />
                                    </div>

                                    <FormField
                                        label="Address"
                                        icon={MapPin}
                                        placeholder="123 Fitness Street, City, State"
                                        registerProps={register('address', {
                                            required: "Address is required",
                                            pattern: {
                                                value: /^[a-zA-Z0-9\s\.,-]{3,100}$/,
                                                message: "Please enter a valid address"
                                            }
                                        })}
                                        error={errors.address}
                                    />

                                    {/* Submit Button */}
                                    <div className="pt-4">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl group"
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center justify-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span>Creating Account...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center">
                                                    <Crown className="mr-2 w-5 h-5" />
                                                    <span>Create Root Account</span>
                                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                                                </div>
                                            )}
                                        </Button>
                                    </div>
                                </form>

                                {/* Footer */}
                                <div className="mt-8 space-y-6">
                                    {/* Login Link */}
                                    <div className="text-center">
                                        <p className="text-gray-400 text-sm mb-3">
                                            Already have a root account?
                                        </p>
                                        <Link href="/root/login">
                                            <button className="text-red-400 hover:text-red-300 font-medium text-sm transition-colors duration-200 hover:underline">
                                                Sign in as Root User →
                                            </button>
                                        </Link>
                                    </div>

                                    {/* Legal */}
                                    <div className="text-center">
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            By creating an account, you agree to our{' '}
                                            <a href="#" className="text-red-400 hover:text-red-300 transition-colors">Terms of Service</a>
                                            {' '}and{' '}
                                            <a href="#" className="text-red-400 hover:text-red-300 transition-colors">Privacy Policy</a>
                                        </p>
                                    </div>

                                    {/* Social Links */}
                                    <div className="flex justify-center space-x-4 pt-4">
                                        <a href="#" className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200">
                                            <Github className="h-4 w-4" />
                                        </a>
                                        <a href="#" className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200">
                                            <Linkedin className="h-4 w-4" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}