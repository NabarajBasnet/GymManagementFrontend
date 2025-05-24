'use client';

import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import {
    CheckCircle2,
    X,
    AtSign,
    User,
    Phone,
    Lock,
    MapPin,
    Building2,
    Globe,
    Clock,
    DollarSign,
    ChevronRight,
    ChevronLeft,
    Loader2
} from 'lucide-react';
import { GB, US, NP, IN, CN, JP, KR, AU, DE, FR, IT, ES, NL, BE, CH, SE, NO, DK, FI, AT, HU, PL, CZ, SK, HR, SI, RO, BG, GR, PT, BR, AR, CL, CO, VE, EC, PE, MX, CA, ZA, EG, AE, SA, IL, TR, IR, PK, BD, MM, TH, VN, MY, ID, PH, SG, HK, TW, NZ } from 'country-flag-icons/react/3x2';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import React from 'react';

// Country codes with flags
const countryCodes = [
    { code: '+977', country: 'Nepal', flag: NP, iso: 'NP' },
    { code: '+91', country: 'India', flag: IN, iso: 'IN' },
    { code: '+1', country: 'United States', flag: US, iso: 'US' },
    { code: '+44', country: 'United Kingdom', flag: GB, iso: 'GB' },
    { code: '+86', country: 'China', flag: CN, iso: 'CN' },
    { code: '+81', country: 'Japan', flag: JP, iso: 'JP' },
    { code: '+82', country: 'South Korea', flag: KR, iso: 'KR' },
    { code: '+61', country: 'Australia', flag: AU, iso: 'AU' },
    { code: '+49', country: 'Germany', flag: DE, iso: 'DE' },
    { code: '+33', country: 'France', flag: FR, iso: 'FR' },
    { code: '+39', country: 'Italy', flag: IT, iso: 'IT' },
    { code: '+34', country: 'Spain', flag: ES, iso: 'ES' },
    { code: '+31', country: 'Netherlands', flag: NL, iso: 'NL' },
    { code: '+32', country: 'Belgium', flag: BE, iso: 'BE' },
    { code: '+41', country: 'Switzerland', flag: CH, iso: 'CH' },
    { code: '+46', country: 'Sweden', flag: SE, iso: 'SE' },
    { code: '+47', country: 'Norway', flag: NO, iso: 'NO' },
    { code: '+45', country: 'Denmark', flag: DK, iso: 'DK' },
    { code: '+358', country: 'Finland', flag: FI, iso: 'FI' },
    { code: '+43', country: 'Austria', flag: AT, iso: 'AT' },
    { code: '+36', country: 'Hungary', flag: HU, iso: 'HU' },
    { code: '+48', country: 'Poland', flag: PL, iso: 'PL' },
    { code: '+420', country: 'Czech Republic', flag: CZ, iso: 'CZ' },
    { code: '+421', country: 'Slovakia', flag: SK, iso: 'SK' },
    { code: '+385', country: 'Croatia', flag: HR, iso: 'HR' },
    { code: '+386', country: 'Slovenia', flag: SI, iso: 'SI' },
    { code: '+40', country: 'Romania', flag: RO, iso: 'RO' },
    { code: '+359', country: 'Bulgaria', flag: BG, iso: 'BG' },
    { code: '+30', country: 'Greece', flag: GR, iso: 'GR' },
    { code: '+351', country: 'Portugal', flag: PT, iso: 'PT' },
    { code: '+55', country: 'Brazil', flag: BR, iso: 'BR' },
    { code: '+54', country: 'Argentina', flag: AR, iso: 'AR' },
    { code: '+56', country: 'Chile', flag: CL, iso: 'CL' },
    { code: '+57', country: 'Colombia', flag: CO, iso: 'CO' },
    { code: '+58', country: 'Venezuela', flag: VE, iso: 'VE' },
    { code: '+593', country: 'Ecuador', flag: EC, iso: 'EC' },
    { code: '+51', country: 'Peru', flag: PE, iso: 'PE' },
    { code: '+52', country: 'Mexico', flag: MX, iso: 'MX' },
    { code: '+1', country: 'Canada', flag: CA, iso: 'CA' },
    { code: '+27', country: 'South Africa', flag: ZA, iso: 'ZA' },
    { code: '+20', country: 'Egypt', flag: EG, iso: 'EG' },
    { code: '+971', country: 'UAE', flag: AE, iso: 'AE' },
    { code: '+966', country: 'Saudi Arabia', flag: SA, iso: 'SA' },
    { code: '+972', country: 'Israel', flag: IL, iso: 'IL' },
    { code: '+90', country: 'Turkey', flag: TR, iso: 'TR' },
    { code: '+98', country: 'Iran', flag: IR, iso: 'IR' },
    { code: '+92', country: 'Pakistan', flag: PK, iso: 'PK' },
    { code: '+880', country: 'Bangladesh', flag: BD, iso: 'BD' },
    { code: '+95', country: 'Myanmar', flag: MM, iso: 'MM' },
    { code: '+66', country: 'Thailand', flag: TH, iso: 'TH' },
    { code: '+84', country: 'Vietnam', flag: VN, iso: 'VN' },
    { code: '+60', country: 'Malaysia', flag: MY, iso: 'MY' },
    { code: '+62', country: 'Indonesia', flag: ID, iso: 'ID' },
    { code: '+63', country: 'Philippines', flag: PH, iso: 'PH' },
    { code: '+65', country: 'Singapore', flag: SG, iso: 'SG' },
    { code: '+852', country: 'Hong Kong', flag: HK, iso: 'HK' },
    { code: '+886', country: 'Taiwan', flag: TW, iso: 'TW' },
    { code: '+64', country: 'New Zealand', flag: NZ, iso: 'NZ' }
];

const SignUpPage = () => {

    const [currentStep, setCurrentStep] = useState(1);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const totalSteps = 3;

    const [tenantTimezone, setTenantTimezone] = useState('');
    const [tenantLanguage, setTenantLanguage] = useState('');
    const [tenantCurrency, setTenantCurrency] = useState('');
    const [selectedCountryCode, setSelectedCountryCode] = useState('+977'); // Default to Nepal

    const options = countryCodes.map((option) => {
        const firstLetter = option.country[0].toUpperCase();
        return {
          firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
          ...option,
        };
    });

    const {
        register,
        handleSubmit,
            watch,
        trigger,
        formState: { errors }
    } = useForm();

    const watchPassword = watch('password', '');

    const timezones = [
        { name: "UTC", offset: 0 },
        { name: "Asia/Kathmandu", offset: 5.45 },
        { name: "America/New_York", offset: -5 },
        { name: "America/Los_Angeles", offset: -8 },
        { name: "Europe/London", offset: 0 },
        { name: "Europe/Paris", offset: 1 },
        { name: "Asia/Kolkata", offset: 5.5 },
        { name: "Asia/Tokyo", offset: 9 },
        { name: "Australia/Sydney", offset: 10 },
        { name: "Asia/Dubai", offset: 4 },
        { name: "Asia/Shanghai", offset: 8 },
        { name: "Asia/Hong_Kong", offset: 8 },
        { name: "Asia/Singapore", offset: 8 },
        { name: "Asia/Bangkok", offset: 7 },
        { name: "Asia/Jakarta", offset: 7 },
    ];

    const languages = [
        { name: "English", code: "English" },
        { name: "Spanish", code: "Spanish" },
        { name: "French", code: "French" },
        { name: "German", code: "German" },
        { name: "Italian", code: "Italian" },
        { name: "Portuguese", code: "Portuguese" },
        { name: "Russian", code: "Russian" },
        { name: "Arabic", code: "Arabic" },
        { name: "Chinese", code: "Chinese" },
    ];

    const currencies = [
        { name: "USD", code: "USD", symbol: "$" },
        { name: "EUR", code: "EUR", symbol: "€" },
        { name: "NPR", code: "NPR", symbol: "₨" },
        { name: "GBP", code: "GBP", symbol: "£" },
        { name: "JPY", code: "JPY", symbol: "¥" },
        { name: "INR", code: "INR", symbol: "₹" },
        { name: "AUD", code: "AUD", symbol: "A$" },
        { name: "CAD", code: "CAD", symbol: "C$" },
        { name: "NZD", code: "NZD", symbol: "NZ$" },
        { name: "SGD", code: "SGD", symbol: "S$" },
        { name: "HKD", code: "HKD", symbol: "HK$" },
        { name: "RMB", code: "CNY", symbol: "¥" },
        { name: "RUB", code: "RUB", symbol: "₽" },
        { name: "AED", code: "AED", symbol: "د.إ" },
        { name: "SAR", code: "SAR", symbol: "ر.س" },
        { name: "QAR", code: "QAR", symbol: "ر.ق" },
        { name: "KRW", code: "KRW", symbol: "₩" },
        { name: "MXN", code: "MXN", symbol: "$" },
    ];

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

    const validateStep = async (step) => {
        let fieldsToValidate = [];
        
        switch(step) {
            case 1:
                fieldsToValidate = ['organizationName', 'ownerName', 'email', 'phone', 'address'];
                break;
            case 2:
                fieldsToValidate = ['password', 'confirmPassword'];
                break;
        }

        const result = await trigger(fieldsToValidate);
        return result;
    };

    const nextStep = async () => {
        setIsValidating(true);
        const isValid = await validateStep(currentStep);
        setIsValidating(false);
        
        if (isValid) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            // Get the selected country data
            const selectedCountry = countryCodes.find(c => c.code === selectedCountryCode);
            
            // Structure the phone data
            const phoneData = {
                country: selectedCountry?.country || '',
                countryCode: selectedCountry?.code || '',
                number: data.phone
            };

            // Only send required fields to the backend
            const submitData = {
                organizationName: data.organizationName,
                ownerName: data.ownerName,
                email: data.email,
                phone: phoneData,
                address: data.address,
                country: selectedCountry?.country || '',
                password: data.password,
                tenantTimezone,
                tenantLanguage,
                tenantCurrency
            };

            console.log('Submitting data:', submitData);

            const response = await fetch('http://localhost:3000/api/tenant/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(submitData),
            });

            const responseData = await response.json();
            if (response.ok) {
                toast.success(responseData.message);
                // Reset form or redirect
            } else {
                toast.error(responseData.message || 'Failed to create account');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-7xl">
                <Card className="overflow-hidden border-0 shadow-2xl bg-white/10 backdrop-blur-xl">
                    <div className="flex flex-col lg:flex-row min-h-[95vh] max-h-[95vh]">
                        {/* Left Panel - Progress & Info */}
                        <div className="lg:w-2/5 bg-gradient-to-br from-purple-600/30 to-blue-600/30 p-8 text-white relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent"></div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-48 -translate-x-48"></div>
                            
                            <div className="relative z-10">
                                {/* Logo */}
                                <div className="flex items-center mb-8">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                        <Building2 className="w-6 h-6" />
                                    </div>
                                    <div className="ml-3">
                                        <h1 className="text-xl font-bold">Create Your Account</h1>
                                        <p className="text-sm text-white/80">Fit Loft</p>
                                    </div>
                                </div>

                                {/* Progress Steps */}
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        {[1, 2, 3].map((step) => (
                                            <div key={step} className="flex items-center">
                                                <div
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                                                        currentStep > step
                                                            ? "bg-green-500 text-white shadow-lg"
                                                            : currentStep === step
                                                            ? "bg-white text-purple-600 shadow-lg scale-110"
                                                            : "bg-white/20 text-white/60"
                                                    }`}
                                                >
                                                    {currentStep > step ? (
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    ) : (
                                                        step
                                                    )}
                                                </div>
                                                {step < 3 && (
                                                    <div className={`w-16 h-1 mx-2 rounded transition-all duration-300 ${
                                                        currentStep > step ? "bg-green-500" : "bg-white/20"
                                                    }`}></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <Progress 
                                        value={(currentStep / totalSteps) * 100} 
                                        className="h-2 bg-white/20"
                                    />
                                </div>

                                {/* Step Info */}
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">
                                            {currentStep === 1 && "Basic Information"}
                                            {currentStep === 2 && "Account Security"}
                                            {currentStep === 3 && "Preferences"}
                                        </h2>
                                        <p className="text-white/80">
                                            {currentStep === 1 && "Tell us about your gym and contact details"}
                                            {currentStep === 2 && "Create a secure password for your account"}
                                            {currentStep === 3 && "Set up your regional preferences"}
                                        </p>
                                    </div>

                                    {/* Features List */}
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                                            <span className="text-sm">Complete gym management system</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                                            <span className="text-sm">Member tracking & billing</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                                            <span className="text-sm">Equipment & class scheduling</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Sign In Link */}
                                <div className="mt-8 pt-6 border-t border-white/20">
                                    <p className="text-sm text-white/80">Already have an account?</p>
                                    <button className="text-white font-medium hover:underline flex items-center mt-1">
                                        Sign in here <ChevronRight className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Form */}
                        <div className="lg:w-3/5 bg-white p-4 lg:p-8 flex flex-col">
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
                                {/* Step 1: Basic Information */}
                                {currentStep === 1 && (
                                    <div className="flex-1 overflow-y-auto pr-2">
                                        <div className="space-y-2 animate-in slide-in-from-right-2 duration-300">
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                                    Organization Name
                                                </Label>
                                                <div className="relative">
                                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <Input
                                                        type="text"
                                                        placeholder="Your Gym Name"
                                                        className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                                        {...register('organizationName', {
                                                            required: "Organization name is required"
                                                        })}
                                                    />
                                                </div>
                                                {errors.organizationName && (
                                                    <p className="text-sm text-red-500 mt-1 flex items-center">
                                                        <X className="w-4 h-4 mr-1" />
                                                        {errors.organizationName.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                                    Owner Name
                                                </Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <Input
                                                        type="text"
                                                        placeholder="John Doe"
                                                        className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                                        {...register('ownerName', {
                                                            required: "Owner name is required"
                                                        })}
                                                    />
                                                </div>
                                                {errors.ownerName && (
                                                    <p className="text-sm text-red-500 mt-1 flex items-center">
                                                        <X className="w-4 h-4 mr-1" />
                                                        {errors.ownerName.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                                    Email Address
                                                </Label>
                                                <div className="relative">
                                                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <Input
                                                        type="email"
                                                        placeholder="john@example.com"
                                                        className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                                        {...register('email', {
                                                            required: "Email is required",
                                                            pattern: {
                                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                                message: "Please enter a valid email"
                                                            }
                                                        })}
                                                    />
                                                </div>
                                                {errors.email && (
                                                    <p className="text-sm text-red-500 mt-1 flex items-center">
                                                        <X className="w-4 h-4 mr-1" />
                                                        {errors.email.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                                    Phone Number
                                                </Label>
                                                <div className="flex space-x-2">
                                                    <Select
                                                        value={selectedCountryCode}
                                                        onValueChange={(value) => {
                                                            setSelectedCountryCode(value);
                                                            const country = countryCodes.find(c => c.code === value);
                                                            if (country) {
                                                                register('country').onChange({ target: { value: country.country } });
                                                            }
                                                        }}
                                                    >
                                                        <SelectTrigger className="w-[140px] h-12 rounded-md">
                                                            <SelectValue placeholder="Select country" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {countryCodes.map((country) => (
                                                                <SelectItem key={country.code} value={country.code}>
                                                                    <div className="flex items-center space-x-2">
                                                                        <country.flag className="w-5 h-4" />
                                                                        <span>{country.code}</span>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <div className="relative flex-1">
                                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                        <Input
                                                            type="tel"
                                                            placeholder="Phone number"
                                                            className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                                            {...register('phone', {
                                                                required: "Phone number is required",
                                                                pattern: {
                                                                    value: /^[0-9]{10,15}$/,
                                                                    message: "Please enter a valid phone number"
                                                                }
                                                            })}
                                                        />
                                                    </div>
                                                </div>
                                                {errors.phone && (
                                                    <p className="text-sm text-red-500 mt-1 flex items-center">
                                                        <X className="w-4 h-4 mr-1" />
                                                        {errors.phone.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="mb-6">
                                                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                                    Country
                                                </Label>
                                                <Autocomplete
                                                    options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                                                    groupBy={(option) => option.firstLetter}
                                                    getOptionLabel={(option) => option.country}
                                                    renderOption={(props, option) => (
                                                        <li {...props} className="flex items-center space-x-3 py-2 px-3">
                                                            <option.flag className="w-6 h-4" />
                                                            <span className="text-sm">{option.country}</span>
                                                        </li>
                                                    )}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            placeholder="Select your country"
                                                            className="w-full"
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                className: "h-12 pl-3",
                                                                startAdornment: (
                                                                    <>
                                                                        {params.InputProps.startAdornment}
                                                                        {selectedCountryCode && (
                                                                            <div className="flex items-center mr-2">
                                                                                {countryCodes.find(c => c.code === selectedCountryCode)?.flag && 
                                                                                    React.createElement(countryCodes.find(c => c.code === selectedCountryCode).flag, {
                                                                                        className: "w-6 h-4"
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                ),
                                                            }}
                                                        />
                                                    )}
                                                    onChange={(event, newValue) => {
                                                        if (newValue) {
                                                            setSelectedCountryCode(newValue.code);
                                                            register('country').onChange({ target: { value: newValue.country } });
                                                        }
                                                    }}
                                                    className="w-full"
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            '& fieldset': {
                                                                borderColor: '#e5e7eb',
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: '#9333ea',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: '#9333ea',
                                                            },
                                                        },
                                                        '& .MuiInputLabel-root': {
                                                            color: '#6b7280',
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': {
                                                            color: '#9333ea',
                                                        },
                                                    }}
                                                />
                                                {errors.country && (
                                                    <p className="text-sm text-red-500 mt-1 flex items-center">
                                                        <X className="w-4 h-4 mr-1" />
                                                        {errors.country.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                                    Address
                                                </Label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <Input
                                                        type="text"
                                                        placeholder="123 Main St, City, Country"
                                                        className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                                        {...register('address', {
                                                            required: "Address is required"
                                                        })}
                                                    />
                                                </div>
                                                {errors.address && (
                                                    <p className="text-sm text-red-500 mt-1 flex items-center">
                                                        <X className="w-4 h-4 mr-1" />
                                                        {errors.address.message}
                                                    </p>
                                                )}
                                            </div>

                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Account Security */}
                                {currentStep === 2 && (
                                    <div className="flex-1 overflow-y-auto pr-2">
                                        <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                                    Password
                                                </Label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <Input
                                                        type="password"
                                                        placeholder="Create a strong password"
                                                        className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                                        {...register('password', {
                                                            required: "Password is required",
                                                            minLength: {
                                                                value: 8,
                                                                message: "Password must be at least 8 characters"
                                                            },
                                                            onChange: (e) => setPasswordStrength(calculatePasswordStrength(e.target.value))
                                                        })}
                                                    />
                                                </div>
                                                {watchPassword && (
                                                    <div className="mt-3 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-gray-500">Password strength:</span>
                                                            <span className={`text-xs font-medium ${
                                                                passwordStrength <= 25 ? 'text-red-500' :
                                                                passwordStrength <= 50 ? 'text-orange-500' :
                                                                passwordStrength <= 75 ? 'text-yellow-500' : 'text-green-500'
                                                            }`}>
                                                                {getPasswordStrengthText(passwordStrength)}
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div 
                                                                className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                                                                style={{ width: `${passwordStrength}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )}
                                                {errors.password && (
                                                    <p className="text-sm text-red-500 mt-1 flex items-center">
                                                        <X className="w-4 h-4 mr-1" />
                                                        {errors.password.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                                    Confirm Password
                                                </Label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <Input
                                                        type="password"
                                                        placeholder="Confirm your password"
                                                        className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                                        {...register('confirmPassword', {
                                                            required: "Please confirm your password",
                                                            validate: value =>
                                                                value === watchPassword || "Passwords do not match"
                                                        })}
                                                    />
                                                </div>
                                                {errors.confirmPassword && (
                                                    <p className="text-sm text-red-500 mt-1 flex items-center">
                                                        <X className="w-4 h-4 mr-1" />
                                                        {errors.confirmPassword.message}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Password Requirements */}
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Password must contain:</h4>
                                                <ul className="space-y-1 text-xs text-gray-600">
                                                    <li className="flex items-center">
                                                        <CheckCircle2 className={`w-3 h-3 mr-2 ${watchPassword.length >= 8 ? 'text-green-500' : 'text-gray-300'}`} />
                                                        At least 8 characters
                                                    </li>
                                                    <li className="flex items-center">
                                                        <CheckCircle2 className={`w-3 h-3 mr-2 ${/[A-Z]/.test(watchPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                                                        One uppercase letter
                                                    </li>
                                                    <li className="flex items-center">
                                                        <CheckCircle2 className={`w-3 h-3 mr-2 ${/[0-9]/.test(watchPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                                                        One number
                                                    </li>
                                                    <li className="flex items-center">
                                                        <CheckCircle2 className={`w-3 h-3 mr-2 ${/[^A-Za-z0-9]/.test(watchPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                                                        One special character
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Preferences */}
                                {currentStep === 3 && (
                                    <div className="flex-1 overflow-y-auto pr-2">
                                        <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
                                            <div>
                                                <Label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                                    Timezone
                                                </Label>
                                                <Select 
                                                    onValueChange={(value) => setTenantTimezone(value)}
                                                >
                                                    <SelectTrigger className="h-12">
                                                        <SelectValue placeholder="Select timezone" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {timezones.map((timezone) => (
                                                            <SelectItem key={timezone.name} value={timezone.name}>
                                                                {timezone.name} (UTC{timezone.offset >= 0 ? '+' : ''}{timezone.offset})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                    <Globe className="w-4 h-4 mr-2 text-gray-400" />
                                                    Language
                                                </Label>
                                                <Select 
                                                    onValueChange={(value) => setTenantLanguage(value)}
                                                >
                                                    <SelectTrigger className="h-12">
                                                        <SelectValue placeholder="Select language" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {languages.map((language) => (
                                                            <SelectItem key={language.code} value={language.code}>
                                                                {language.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                    <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                                                    Currency
                                                </Label>
                                                <Select 
                                                    onValueChange={(value) => setTenantCurrency(value)}
                                                >
                                                    <SelectTrigger className="h-12">
                                                        <SelectValue placeholder="Select currency" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {currencies.map((currency) => (
                                                            <SelectItem key={currency.code} value={currency.code}>
                                                                {currency.name} ({currency.symbol})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Summary */}
                                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                                <h4 className="text-sm font-medium text-purple-800 mb-2">Setup Summary</h4>
                                                <div className="space-y-1 text-xs text-purple-700">
                                                    <p><strong>Organization:</strong> {watch('organizationName')}</p>
                                                    <p><strong>Owner:</strong> {watch('ownerName')}</p>
                                                    <p><strong>Email:</strong> {watch('email')}</p>
                                                    <p><strong>Currency:</strong> {currencies.find(c => c.code === watch('tenantCurrency'))?.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex justify-between items-center mt-2 border-gray-200 sticky bottom-0 bg-white">
                                    {currentStep > 1 ? (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={prevStep}
                                            className="px-6 h-12"
                                            disabled={isValidating || isSubmitting}
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-2" />
                                            Previous
                                        </Button>
                                    ) : (
                                        <div></div>
                                    )}
                                        
                                    {currentStep < totalSteps ? (
                                        <Button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                nextStep();
                                            }}
                                            className="px-6 h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg transition-all duration-300"
                                            disabled={isValidating || isSubmitting}
                                        >
                                            {isValidating ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <>
                                                    Next <ChevronRight className="w-4 h-4 ml-2" />
                                                </>
                                            )}
                                        </Button>
                                    ) : (
                                        <Button
                                            type="submit"
                                            className="px-6 h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg transition-all duration-300"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                "Create Account"
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default SignUpPage;
