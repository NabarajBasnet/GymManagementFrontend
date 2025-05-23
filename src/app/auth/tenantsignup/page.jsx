'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
    CheckCircle2,
    X,
    AtSign,
    User,
    Phone,
    Lock,
    MapPin,
    Calendar,
    ChevronRight,
    Github,
    Linkedin,
    Building2,
    Globe,
    CreditCard,
    Clock,
    Languages,
    DollarSign
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SignUpPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const totalSteps = 4;

    const {
        register,
        reset,
        handleSubmit,
        watch,
        formState: { isSubmitting, errors }
    } = useForm();

    const watchPassword = watch('password', '');

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;
        return strength;
    };

    const getPasswordStrengthColor = (strength) => {
        if (strength <= 25) return "bg-red-500";
        if (strength <= 50) return "bg-orange-500";
        if (strength <= 75) return "bg-yellow-500";
        return "bg-green-500";
    };

    const getPasswordStrengthText = (strength) => {
        if (strength <= 25) return "Weak";
        if (strength <= 50) return "Fair";
        if (strength <= 75) return "Good";
        return "Strong";
    };

    const onSignUp = async (data) => {
        try {
            const response = await fetch('http://localhost:3000/api/tenant/signup', {
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
            } else {
                toast.error(responseBody.message || 'Failed to create account');
            }
        } catch (error) {
            toast.error('An unexpected error occurred. Please try again.');
            console.log("Error: ", error);
        }
    };

    const FormField = ({ label, name, type = 'text', icon, validation, error, placeholder, options }) => (
        <div className="space-y-1">
            <Label
                htmlFor={name}
                className="text-sm font-medium text-gray-700 block"
            >
                {label}
            </Label>

            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {icon}
                </div>

                {options ? (
                    <Select {...register(name, validation)}>
                        <SelectTrigger className="pl-10 w-full">
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ) : (
                    <Input
                        id={name}
                        type={type}
                        className={`pl-10 w-full transition-all duration-200 ${error ? 'border-red-500 focus:border-red-500' : ''}`}
                        placeholder={placeholder}
                        {...register(name, validation)}
                    />
                )}

                {error && (
                    <motion.div
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <X className="h-5 w-5 text-red-500" />
                    </motion.div>
                )}
            </div>

            {error && (
                <motion.p
                    className="text-sm font-medium text-red-500 mt-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {error.message}
                </motion.p>
            )}
        </div>
    );

    const nextStep = () => {
        setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 p-4">
            <div className="w-full max-w-6xl">
                <Card className="border-0 bg-transparent shadow-none">
                    <motion.div
                        className="w-full rounded-2xl overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex flex-col lg:flex-row max-h-screen overflow-auto">
                            {/* Left side - Progress and Info */}
                            <div className="lg:w-5/12 relative flex flex-col items-center justify-center p-8 text-white bg-gradient-to-br from-purple-600/50 to-indigo-600/50">
                                <motion.div
                                    className="text-center w-full"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.8 }}
                                >
                                    <motion.div
                                        className="md:mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm"
                                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.25)' }}
                                    >
                                        <Building2 className="w-10 h-10 text-white" />
                                    </motion.div>

                                    <h1 className="text-3xl font-bold mb-4">Create Your Gym Account</h1>
                                    <p className="text-white/90 md:mb-8 text-base">Set up your gym management system in minutes</p>

                                    {/* Progress Steps */}
                                    <div className="w-full max-w-md mx-auto mb-8">
                                        <div className="flex justify-between mb-2">
                                            {[...Array(totalSteps)].map((_, index) => (
                                                <div
                                                    key={index}
                                                    className={cn(
                                                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                                                        currentStep > index + 1
                                                            ? "bg-green-500 text-white"
                                                            : currentStep === index + 1
                                                            ? "bg-white text-purple-600"
                                                            : "bg-white/20 text-white"
                                                    )}
                                                >
                                                    {index + 1}
                                                </div>
                                            ))}
                                        </div>
                                        <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
                                    </div>

                                    <div className="hidden md:flex flex-col space-y-4 mb-8">
                                        <div className="flex items-center space-x-3 text-sm">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                            <span>Complete gym profile setup</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-sm">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                            <span>Configure subscription details</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-sm">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                            <span>Set up payment information</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 text-sm">
                                        <p>Already have an account?</p>
                                        <Link href="/login" className="inline-flex items-center mt-2 text-white font-medium hover:underline">
                                            Sign in to your account <ChevronRight className="ml-1 w-4 h-4" />
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Right side - Form */}
                            <div className="lg:w-7/12 p-8 bg-white/95 overflow-y-auto max-h-screen">
                                <div className="w-full mx-auto max-w-xl">
                                    <form onSubmit={handleSubmit(onSignUp)} className="space-y-4">
                                        {/* Step 1: Basic Information */}
                                        {currentStep === 1 && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                            >
                                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h2>
                                                
                                                <FormField
                                                    label="Organization Name"
                                                    name="organizationName"
                                                    icon={<Building2 className="text-gray-400" />}
                                                    validation={{
                                                        required: "Organization name is required"
                                                    }}
                                                    error={errors.organizationName}
                                                    placeholder="Your Gym Name"
                                                />

                                                <FormField
                                                    label="Owner Name"
                                                    name="ownerName"
                                                    icon={<User className="text-gray-400" />}
                                                    validation={{
                                                        required: "Owner name is required"
                                                    }}
                                                    error={errors.ownerName}
                                                    placeholder="John Doe"
                                                />

                                                <FormField
                                                    label="Email Address"
                                                    name="email"
                                                    type="email"
                                                    icon={<AtSign className="text-gray-400" />}
                                                    validation={{
                                                        required: "Email is required",
                                                        pattern: {
                                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                            message: "Please enter a valid email"
                                                        }
                                                    }}
                                                    error={errors.email}
                                                    placeholder="john.doe@example.com"
                                                />

                                                <FormField
                                                    label="Phone Number"
                                                    name="phone"
                                                    type="tel"
                                                    icon={<Phone className="text-gray-400" />}
                                                    validation={{
                                                        required: "Phone number is required",
                                                        pattern: {
                                                            value: /^[0-9+\-\s()]{10,15}$/,
                                                            message: "Please enter a valid phone number"
                                                        }
                                                    }}
                                                    error={errors.phone}
                                                    placeholder="+1 (555) 000-0000"
                                                />

                                                <FormField
                                                    label="Address"
                                                    name="address"
                                                    icon={<MapPin className="text-gray-400" />}
                                                    validation={{
                                                        required: "Address is required"
                                                    }}
                                                    error={errors.address}
                                                    placeholder="123 Main St, City, Country"
                                                />
                                            </motion.div>
                                        )}

                                        {/* Step 2: Account Security */}
                                        {currentStep === 2 && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                            >
                                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Security</h2>

                                                <div className="space-y-2">
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
                                                                required: "Password is required",
                                                                onChange: (e) => setPasswordStrength(calculatePasswordStrength(e.target.value))
                                                            })}
                                                        />
                                                    </div>
                                                    {watchPassword && (
                                                        <div className="space-y-2">
                                                            <Progress 
                                                                value={passwordStrength} 
                                                                className={cn("h-1", getPasswordStrengthColor(passwordStrength))}
                                                            />
                                                            <p className="text-xs text-gray-500">
                                                                Password strength: {getPasswordStrengthText(passwordStrength)}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {errors.password && (
                                                        <p className="text-sm font-medium text-red-500 mt-1 flex items-center">
                                                            <X className="w-4 h-4 mr-1" /> {errors.password.message}
                                                        </p>
                                                    )}
                                                </div>

                                                <FormField
                                                    label="Confirm Password"
                                                    name="confirmPassword"
                                                    type="password"
                                                    icon={<Lock className="text-gray-400" />}
                                                    validation={{
                                                        required: "Please confirm your password",
                                                        validate: value =>
                                                            value === watchPassword || "Passwords do not match"
                                                    }}
                                                    error={errors.confirmPassword}
                                                    placeholder="Confirm your password"
                                                />
                                            </motion.div>
                                        )}

                                        {/* Step 3: Subscription Details */}
                                        {currentStep === 3 && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                            >
                                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Subscription Details</h2>

                                                <FormField
                                                    label="Subscription Start Date"
                                                    name="tenantSubscriptionStartDate"
                                                    type="date"
                                                    icon={<Calendar className="text-gray-400" />}
                                                    validation={{
                                                        required: "Start date is required"
                                                    }}
                                                    error={errors.tenantSubscriptionStartDate}
                                                />

                                                <FormField
                                                    label="Subscription End Date"
                                                    name="tenantSubscriptionEndDate"
                                                    type="date"
                                                    icon={<Calendar className="text-gray-400" />}
                                                    validation={{
                                                        required: "End date is required"
                                                    }}
                                                    error={errors.tenantSubscriptionEndDate}
                                                />

                                                <FormField
                                                    label="Payment Amount"
                                                    name="tenantSubscriptionPaymentAmount"
                                                    type="number"
                                                    icon={<DollarSign className="text-gray-400" />}
                                                    validation={{
                                                        required: "Payment amount is required"
                                                    }}
                                                    error={errors.tenantSubscriptionPaymentAmount}
                                                    placeholder="Enter amount"
                                                />

                                                <FormField
                                                    label="Payment Method"
                                                    name="tenantSubscriptionPaymentMethod"
                                                    icon={<CreditCard className="text-gray-400" />}
                                                    validation={{
                                                        required: "Payment method is required"
                                                    }}
                                                    error={errors.tenantSubscriptionPaymentMethod}
                                                    placeholder="Select payment method"
                                                    options={[
                                                        { value: 'credit_card', label: 'Credit Card' },
                                                        { value: 'debit_card', label: 'Debit Card' },
                                                        { value: 'bank_transfer', label: 'Bank Transfer' }
                                                    ]}
                                                />
                                            </motion.div>
                                        )}

                                        {/* Step 4: Preferences */}
                                        {currentStep === 4 && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                            >
                                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Preferences</h2>

                                                <FormField
                                                    label="Timezone"
                                                    name="tenantTimezone"
                                                    icon={<Clock className="text-gray-400" />}
                                                    validation={{
                                                        required: "Timezone is required"
                                                    }}
                                                    error={errors.tenantTimezone}
                                                    placeholder="Select timezone"
                                                    options={[
                                                        { value: 'UTC', label: 'UTC' },
                                                        { value: 'EST', label: 'Eastern Time' },
                                                        { value: 'PST', label: 'Pacific Time' },
                                                        { value: 'GMT', label: 'Greenwich Mean Time' }
                                                    ]}
                                                />

                                                <FormField
                                                    label="Language"
                                                    name="tenantLanguage"
                                                    icon={<Languages className="text-gray-400" />}
                                                    validation={{
                                                        required: "Language is required"
                                                    }}
                                                    error={errors.tenantLanguage}
                                                    placeholder="Select language"
                                                    options={[
                                                        { value: 'en', label: 'English' },
                                                        { value: 'es', label: 'Spanish' },
                                                        { value: 'fr', label: 'French' }
                                                    ]}
                                                />

                                                <FormField
                                                    label="Currency"
                                                    name="tenantCurrency"
                                                    icon={<DollarSign className="text-gray-400" />}
                                                    validation={{
                                                        required: "Currency is required"
                                                    }}
                                                    error={errors.tenantCurrency}
                                                    placeholder="Select currency"
                                                    options={[
                                                        { value: 'USD', label: 'US Dollar' },
                                                        { value: 'EUR', label: 'Euro' },
                                                        { value: 'GBP', label: 'British Pound' }
                                                    ]}
                                                />
                                            </motion.div>
                                        )}

                                        {/* Navigation Buttons */}
                                        <div className="flex justify-between mt-8">
                                            {currentStep > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={prevStep}
                                                    className="px-6"
                                                >
                                                    Previous
                                                </Button>
                                            )}
                                            
                                            {currentStep < totalSteps ? (
                                                <Button
                                                    type="button"
                                                    onClick={nextStep}
                                                    className="ml-auto px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                                >
                                                    Next Step
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="submit"
                                                    className="ml-auto px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        <span className="flex items-center">
                                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Creating Account...
                                                        </span>
                                                    ) : (
                                                        <span>Create Account</span>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </form>

                                    <div className="mt-6 text-center">
                                        <p className="text-xs text-gray-500">
                                            By signing up, you agree to our{' '}
                                            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{' '}
                                            and{' '}
                                            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </Card>
            </div>
        </div>
    );
}


