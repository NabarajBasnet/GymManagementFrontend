'use client';

import { useMemo } from 'react';
import { Checkbox } from "@/components/ui/checkbox"
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
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
    Building2,
    Dumbbell,
    Shield,
    Users,
    TrendingUp,
    CheckCircle
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    GB,
    US,
    NP,
    IN,
    CN,
    JP,
    KR,
    AU,
    DE,
    FR,
    IT,
    ES,
    NL,
    BE,
    CH,
    SE,
    NO,
    DK,
    FI,
    AT,
    HU,
    PL,
    CZ,
    SK,
    HR,
    SI,
    RO,
    BG,
    GR,
    PT,
    BR,
    AR,
    CL,
    CO,
    VE,
    EC,
    PE,
    MX,
    CA,
    ZA,
    EG,
    AE,
    SA,
    IL,
    TR,
    IR,
    PK,
    BD,
    MM,
    TH,
    VN,
    MY,
    ID,
    PH,
    SG,
    HK,
    TW,
    NZ,
} from "country-flag-icons/react/3x2";

const countryCodes = [
    { code: "+977", country: "Nepal", flag: NP, iso: "NP" },
    { code: "+91", country: "India", flag: IN, iso: "IN" },
    { code: "+1", country: "United States", flag: US, iso: "US" },
    { code: "+44", country: "United Kingdom", flag: GB, iso: "GB" },
    { code: "+86", country: "China", flag: CN, iso: "CN" },
    { code: "+81", country: "Japan", flag: JP, iso: "JP" },
    { code: "+82", country: "South Korea", flag: KR, iso: "KR" },
    { code: "+61", country: "Australia", flag: AU, iso: "AU" },
    { code: "+49", country: "Germany", flag: DE, iso: "DE" },
    { code: "+33", country: "France", flag: FR, iso: "FR" },
    { code: "+39", country: "Italy", flag: IT, iso: "IT" },
    { code: "+34", country: "Spain", flag: ES, iso: "ES" },
    { code: "+31", country: "Netherlands", flag: NL, iso: "NL" },
    { code: "+32", country: "Belgium", flag: BE, iso: "BE" },
    { code: "+41", country: "Switzerland", flag: CH, iso: "CH" },
    { code: "+46", country: "Sweden", flag: SE, iso: "SE" },
    { code: "+47", country: "Norway", flag: NO, iso: "NO" },
    { code: "+45", country: "Denmark", flag: DK, iso: "DK" },
    { code: "+358", country: "Finland", flag: FI, iso: "FI" },
    { code: "+43", country: "Austria", flag: AT, iso: "AT" },
    { code: "+36", country: "Hungary", flag: HU, iso: "HU" },
    { code: "+48", country: "Poland", flag: PL, iso: "PL" },
    { code: "+420", country: "Czech Republic", flag: CZ, iso: "CZ" },
    { code: "+421", country: "Slovakia", flag: SK, iso: "SK" },
    { code: "+385", country: "Croatia", flag: HR, iso: "HR" },
    { code: "+386", country: "Slovenia", flag: SI, iso: "SI" },
    { code: "+40", country: "Romania", flag: RO, iso: "RO" },
    { code: "+359", country: "Bulgaria", flag: BG, iso: "BG" },
    { code: "+30", country: "Greece", flag: GR, iso: "GR" },
    { code: "+351", country: "Portugal", flag: PT, iso: "PT" },
    { code: "+55", country: "Brazil", flag: BR, iso: "BR" },
    { code: "+54", country: "Argentina", flag: AR, iso: "AR" },
    { code: "+56", country: "Chile", flag: CL, iso: "CL" },
    { code: "+57", country: "Colombia", flag: CO, iso: "CO" },
    { code: "+58", country: "Venezuela", flag: VE, iso: "VE" },
    { code: "+593", country: "Ecuador", flag: EC, iso: "EC" },
    { code: "+51", country: "Peru", flag: PE, iso: "PE" },
    { code: "+52", country: "Mexico", flag: MX, iso: "MX" },
    { code: "+1", country: "Canada", flag: CA, iso: "CA" },
    { code: "+27", country: "South Africa", flag: ZA, iso: "ZA" },
    { code: "+20", country: "Egypt", flag: EG, iso: "EG" },
    { code: "+971", country: "UAE", flag: AE, iso: "AE" },
    { code: "+966", country: "Saudi Arabia", flag: SA, iso: "SA" },
    { code: "+972", country: "Israel", flag: IL, iso: "IL" },
    { code: "+90", country: "Turkey", flag: TR, iso: "TR" },
    { code: "+98", country: "Iran", flag: IR, iso: "IR" },
    { code: "+92", country: "Pakistan", flag: PK, iso: "PK" },
    { code: "+880", country: "Bangladesh", flag: BD, iso: "BD" },
    { code: "+95", country: "Myanmar", flag: MM, iso: "MM" },
    { code: "+66", country: "Thailand", flag: TH, iso: "TH" },
    { code: "+84", country: "Vietnam", flag: VN, iso: "VN" },
    { code: "+60", country: "Malaysia", flag: MY, iso: "MY" },
    { code: "+62", country: "Indonesia", flag: ID, iso: "ID" },
    { code: "+63", country: "Philippines", flag: PH, iso: "PH" },
    { code: "+65", country: "Singapore", flag: SG, iso: "SG" },
    { code: "+852", country: "Hong Kong", flag: HK, iso: "HK" },
    { code: "+886", country: "Taiwan", flag: TW, iso: "TW" },
    { code: "+64", country: "New Zealand", flag: NZ, iso: "NZ" },
];

export default function TenantSignUpPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptPrivacy, setAcceptPrivacy] = useState(false);
    const [selectedCountryCode, setSelectedCountryCode] = useState("+977");

    const {
        register,
        reset,
        handleSubmit,
        watch,
        formState: { isSubmitting, errors },
        setValue
    } = useForm();

    const watchPassword = watch('password', '');

    const onSignUp = async (data) => {
        if (!acceptTerms || !acceptPrivacy) {
            toast.error('Please accept the terms and privacy policy to continue');
            return;
        }
        const completePhoneNumber = `${selectedCountryCode} ${data.phoneNumber}`;
        const submissionData = {
            ...data,
            phone: completePhoneNumber,
        };

        try {
            const response = await fetch('http://localhost:3000/api/tenant/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(submissionData),
            });
            const responseBody = await response.json();
            if (response.ok) {
                toast.success('Account created successfully!');
                reset();
                router.push(responseBody.redirect);
            } else {
                toast.error(responseBody.message || 'Failed to create account');
            }
        } catch (error) {
            toast.error(error.message || 'Internal server error');
            console.log("Error: ", error);
        }
    };

    const FormField = useMemo(() => {
        return ({ label, icon: Icon, type = "text", placeholder, registerProps, error, showPasswordToggle = false, passwordVisible, onTogglePassword }) => (
            <div className="space-y-2">
                <Label className="text-gray-700 font-medium text-sm">{label}</Label>
                <div className="relative">
                    <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        className="pl-12 pr-12 py-6 bg-white border-2 border-gray-200 rounded-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-gray-300"
                        type={showPasswordToggle && passwordVisible ? "text" : type}
                        placeholder={placeholder}
                        {...registerProps}
                    />
                    {showPasswordToggle && (
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            onClick={onTogglePassword}
                        >
                            {passwordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    )}
                </div>
                {error && (
                    <p className="text-red-500 text-xs font-medium flex items-center mt-1">
                        <X className="w-4 h-4 mr-1" />
                        {error.message}
                    </p>
                )}
            </div>
        );
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left Panel - Brand Information */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
                    <div className="max-w-md">
                        <div className="flex items-center mb-8">
                            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <Dumbbell className="w-8 h-8 text-white" />
                            </div>
                            <div className="ml-4">
                                <h1 className="text-2xl font-bold">GeoFit</h1>
                                <p className="text-blue-100">Automate your gym workflow</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mb-6">
                            Start Your Free Trail
                        </h2>

                        <h3 className="text-xl text-blue-100 leading-relaxed">
                            14 days free trial
                        </h3>

                        <p className="text-sm text-blue-100 mb-12 leading-relaxed">
                            No obligation or credit-card required. Try our service for free for 14 days.
                        </p>

                        <div className="space-y-6">
                            {[
                                { icon: Users, title: "Member Management", desc: "Complete member tracking and engagement tools" },
                                { icon: TrendingUp, title: "Business Analytics", desc: "Detailed insights and performance metrics" },
                                { icon: Shield, title: "Secure & Reliable", desc: "Enterprise-grade security and 99.9% uptime" }
                            ].map((feature, index) => (
                                <div key={index} className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                                        <feature.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                                        <p className="text-blue-100 text-sm">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Registration Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="lg:hidden flex items-center justify-center mb-6">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                                <Dumbbell className="w-6 h-6 text-white" />
                            </div>
                            <span className="ml-3 text-xl font-bold text-gray-900">GymPro Manager</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
                        <p className="text-gray-600">Get started with your gym management journey</p>
                    </div>

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
                            label="Email Address"
                            icon={AtSign}
                            type="email"
                            placeholder="Enter your email address"
                            registerProps={register('email', {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Please enter a valid email"
                                }
                            })}
                            error={errors.email}
                        />

                        <div className="space-y-2">
                            <Label className="text-gray-700 font-medium text-sm">Phone Number</Label>
                            <div className="flex space-x-2">
                                <Select
                                    value={selectedCountryCode}
                                    onValueChange={(value) => {
                                        setSelectedCountryCode(value);
                                        setValue('countryCode', value);
                                    }}
                                >
                                    <SelectTrigger className="w-[140px] bg-white border-2 border-gray-200 rounded-sm text-gray-900 h-12 pl-3 pr-8 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-gray-300">
                                        <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-2 border-gray-200 rounded-sm">
                                        {countryCodes.map((country) => (
                                            <SelectItem
                                                key={country.code}
                                                value={country.code}
                                                className="hover:bg-gray-50 focus:bg-gray-50"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <country.flag className="w-5 h-4" />
                                                    <span className='text-black'>{country.code}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="relative flex-1">
                                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        type="tel"
                                        placeholder="Phone number"
                                        className="pl-12 pr-4 py-6 bg-white border-2 border-gray-200 rounded-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-gray-300 h-12"
                                        {...register("phoneNumber", {
                                            required: "Phone number is required",
                                            pattern: {
                                                value: /^[0-9]{10,15}$/,
                                                message: "Please enter a valid phone number",
                                            },
                                        })}
                                    />
                                </div>
                            </div>
                            {errors.phone && (
                                <p className="text-red-500 text-xs font-medium flex items-center mt-1">
                                    <X className="w-4 h-4 mr-1" />
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                label="Password"
                                icon={Lock}
                                type="password"
                                placeholder="Create password"
                                registerProps={register('password', {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters"
                                    }
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
                            placeholder="Enter your address"
                            registerProps={register('address', {
                                required: "Address is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9\s\.,-]{3,100}$/,
                                    message: "Please enter a valid address"
                                }
                            })}
                            error={errors.address}
                        />

                        {/* Terms and Privacy Checkboxes */}
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    className="mt-1 w-6 h-6 text-blue-600 cursor-pointer border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                />
                                <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                                    I agree to the{' '}
                                    <Link href="/termsofservice" className="text-blue-600 hover:text-blue-800 underline font-medium">
                                        Terms of Service
                                    </Link>
                                    {' '}and understand the platform's usage policies
                                </label>
                            </div>

                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    id="privacy"
                                    checked={acceptPrivacy}
                                    onChange={(e) => setAcceptPrivacy(e.target.checked)}
                                    className="mt-1 w-5 h-5 text-blue-600 cursor-pointer border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                />
                                <label htmlFor="privacy" className="text-sm text-gray-600 leading-relaxed">
                                    I acknowledge that I have read and accept the{' '}
                                    <Link href="/privacypolicy" className="text-blue-600 hover:text-blue-800 underline font-medium">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting || !acceptTerms || !acceptPrivacy}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </Button>

                        <div className="text-center pt-4">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <Link href="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                        <p className="text-xs text-gray-500">
                            Secure registration powered by industry-standard encryption
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}