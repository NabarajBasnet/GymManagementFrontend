'use client';

import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    CheckCircle2,
    X,
    User,
    Lock,
    ChevronRight,
    Github,
    Linkedin
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RootSignUpPage() {

    const router = useRouter();
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
            const response = await fetch('http://localhost:3000/api/rootuser/register', {
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
                reset();
                router.push('/root/login');
            } else {
                toast.error(responseBody.message || 'Failed to create account');
            }
        } catch (error) {
            toast.error('An unexpected error occurred. Please try again.');
            console.log("Error: ", error);
        }
    };

    return (
        <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 overflow-auto">

            <motion.div
                className="w-full md:max-w-4xl rounded-2xl overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex flex-col lg:flex-row max-h-screen overflow-auto">
                    {/* Left side - Brand panel */}
                    <div className="lg:w-5/12 relative flex flex-col items-center justify-center p-6 text-white">
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            <motion.div
                                className="md:mb-6 inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm"
                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                            >
                                <User className="w-7 h-7 text-white" />
                            </motion.div>

                            <h1 className="text-2xl font-bold mb-3">Create Account</h1>
                            <p className="text-white/80 md:mb-6 text-sm">Join thousands of users and start your journey today.</p>

                            <div className="hidden md:flex flex-col space-y-3 mb-6">
                                <div className="flex items-center space-x-3 text-xs">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    <span>Premium design templates</span>
                                </div>
                                <div className="flex items-center space-x-3 text-xs">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    <span>Advanced analytics dashboard</span>
                                </div>
                                <div className="flex items-center space-x-3 text-xs">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    <span>Priority customer support</span>
                                </div>
                            </div>

                            <div className="pt-3 text-xs">
                                <p>Already have an account?</p>
                                <Link href="/root/login" className="inline-flex items-center mt-2 text-white font-medium hover:underline">
                                    Sign in to your account <ChevronRight className="ml-1 w-3 h-3" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right side - Form */}
                    <div className="lg:w-7/12 p-6 bg-white/95 overflow-y-auto max-h-screen">
                        <div className="w-full mx-auto">
                            <div className="mb-4">
                                <h2 className="text-xl font-bold text-gray-800">Root User Sign Up</h2>
                                <p className="text-gray-600 text-sm">Fill in your information to create an root user account</p>
                            </div>

                            <form onSubmit={handleSubmit(onSignUp)} className="space-y-3">
                                <div>
                                    <Label>Full Name</Label>
                                    <Input
                                        className="text-black"
                                        type="text"
                                        placeholder="Eg: John Doe"
                                        {...register('fullName', {
                                        required: "Full name is required",
                                        pattern: {
                                            value: /^[a-zA-Z\s]+$/,
                                            message: "Please enter a valid full name"
                                        }
                                        })}
                                    />
                                    {errors.fullName && (
                                        <p className="text-red-500 text-sm mt-1">
                                        {errors.fullName.message}
                                        </p>
                                    )}
                                    </div>

                                    <div className='space-y-1'>
                                        <Label className='text-sm font-medium text-gray-700 block'>Email</Label>
                                        <Input
                                            type="email"
                                            placeholder="Email"
                                            {...register('email', {
                                                    required: "Email is required",
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: "Please enter a valid email"
                                            }
                                            })}
                                        />
                                        {errors.email && (
                                            <p className="text-sm font-medium text-red-500 mt-1 flex items-center">
                                                <X className="w-4 h-4 mr-1" /> {errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className='space-y-1'>
                                        <Label className='text-sm font-medium text-gray-700 block'>Phone</Label>
                                        <Input
                                            type="tel"
                                            placeholder="Phone"
                                        {...register('phone', {
                                                required: "Phone is required",
                                            pattern: {
                                                value: /^[0-9+\-\s()]{10,15}$/,
                                                message: "Please enter a valid phone number"
                                        }
                                        })}
                                    />
                                    {errors.phone && (
                                        <p className="text-sm font-medium text-red-500 mt-1 flex items-center">
                                            <X className="w-4 h-4 mr-1" /> {errors.phone.message}
                                        </p>
                                    )}
                                    </div>

                                <div className='md:flex items-center justify-between'>
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium text-gray-700 block">
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <Input
                                                type="password"
                                                className="pl-10 w-full transition-all duration-200"
                                                placeholder="Create a password"
                                                {...register('password', {
                                                    required: "Password is required"
                                                })}
                                            />
                                        </div>
                                        {errors.password && (
                                            <p className="text-sm font-medium text-red-500 mt-1 flex items-center">
                                                <X className="w-4 h-4 mr-1" /> {errors.password.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium text-gray-700 block">
                                            Confirm Password
                                        </Label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <Input
                                                type="password"
                                                className="pl-10 w-full transition-all duration-200"
                                                placeholder="Confirm Password"
                                                {...register('confirmPassword', {
                                                    required: "Confirm Password is required",
                                                    validate: value =>
                                                        value === watchPassword || "Passwords do not match"
                                                })}
                                            />
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="text-sm font-medium text-red-500 mt-1 flex items-center">
                                                <X className="w-4 h-4 mr-1" /> {errors.confirmPassword.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className='space-y-1'>
                                        <Label className='text-sm font-medium text-gray-700 block'>Address</Label>
                                        <Input
                                            type="text"
                                            placeholder="Address"
                                        {...register('address', {
                                                required: "Address is required",
                                            pattern: {
                                                value: /^[a-zA-Z0-9\s\.,-]{3,100}$/,
                                                message: "Please enter a valid address"
                                        }
                                        })}
                                    />
                                    {errors.address && (
                                        <p className="text-sm font-medium text-red-500 mt-1 flex items-center">
                                            <X className="w-4 h-4 mr-1" /> {errors.address.message}
                                        </p>
                                    )}
                                    </div>

                                <Button
                                    type="submit"
                                    className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        <span>Create Account</span>
                                    )}
                                </Button>
                            </form>

                            <div className="mt-4 text-center">
                                <p className="text-xs text-gray-500">
                                    By signing up, you agree to our{' '}
                                    <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{' '}
                                    and{' '}
                                    <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
                                </p>

                                <div className="mt-4 flex items-center justify-center space-x-4">
                                    <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                                        <Github className="h-5 w-5" />
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
                                        <Linkedin className="h-5 w-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
